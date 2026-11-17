// Creating an account with a new contact, end to end through the form
// (v1.87.0), with the API faked.
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import accountContactReducer from "../../redux/accountContactSlice";
import { ConfirmProvider } from "../../components/ConfirmDialogContext";

const mockShowToast = jest.fn();
const mockApi = {
  checkAccountName: jest.fn(),
  createAccount: jest.fn(),
  updateAccount: jest.fn(),
  getAccountById: jest.fn(),
  checkDuplicateContacts: jest.fn(),
  createContact: jest.fn(),
  updateContact: jest.fn(),
};

jest.mock("../../services/api", () => ({
  accountsAPI: {
    checkAccountName: (...a) => mockApi.checkAccountName(...a),
    createAccount: (...a) => mockApi.createAccount(...a),
    updateAccount: (...a) => mockApi.updateAccount(...a),
    getAccountById: (...a) => mockApi.getAccountById(...a),
  },
  contactsAPI: {
    checkDuplicateContacts: (...a) => mockApi.checkDuplicateContacts(...a),
    createContact: (...a) => mockApi.createContact(...a),
    updateContact: (...a) => mockApi.updateContact(...a),
    resendActivationEmail: jest.fn(async () => ({})),
  },
  docAPI: { applyTemplateToAccount: jest.fn(async () => ({ data: {} })) },
}));
jest.mock("../../context/ToastContext", () => ({ useToastContext: () => ({ showToast: mockShowToast }) }));
jest.mock("../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1" } }) }));
jest.mock("../../redux/accountContactDraft", () => ({ clearNewDraft: jest.fn() }));
// The form renders the drawer's header parts, which need the drawer itself.
jest.mock("../../components/ui/sheet", () => ({
  SheetHeader: ({ children }) => <div>{children}</div>,
  SheetTitle: ({ children }) => <h2>{children}</h2>,
  SheetDescription: ({ children }) => <p>{children}</p>,
  SheetFooter: ({ children }) => <div>{children}</div>,
}));
jest.mock("./AccountForm", () => (props) => (
  <button type="button" onClick={props.onContinue}>Continue</button>
));
jest.mock("./ContactForm", () => (props) => (
  <button type="button" onClick={() => props.onSubmit()}>Submit</button>
));

// eslint-disable-next-line import/first
import AccountContactForm from "./AccountContactForm";

const CONTACT = { contactName: "Basha (Mystery)", email: "basha@client.test", login: false };

const renderForm = () => {
  const store = configureStore({
    reducer: { accountContact: accountContactReducer },
    preloadedState: {
      accountContact: {
        ...accountContactReducer(undefined, { type: "@@init" }),
        accountData: {
          ...accountContactReducer(undefined, { type: "@@init" }).accountData,
          accountName: "Basha (Mystery Unlock LLC)",
          clientType: "Individual",
        },
        contacts: [CONTACT],
        selectedContacts: [],
      },
    },
  });
  render(
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <ConfirmProvider>
          <AccountContactForm isEditing={false} />
        </ConfirmProvider>
      </QueryClientProvider>
    </Provider>
  );
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Submit" }));
const lastToast = () => mockShowToast.mock.calls[mockShowToast.mock.calls.length - 1][0];

beforeEach(() => {
  Object.values(mockApi).forEach((f) => f.mockReset());
  mockShowToast.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});

  mockApi.checkAccountName.mockResolvedValue({ data: { available: true } });
  mockApi.checkDuplicateContacts.mockResolvedValue({ data: { duplicates: [] } });
  mockApi.createContact.mockResolvedValue({ data: { _id: "c1", ...CONTACT, warnings: [] } });
  mockApi.createAccount.mockResolvedValue({ data: { _id: "a1" } });
  mockApi.updateContact.mockResolvedValue({ data: {} });
  mockApi.getAccountById.mockResolvedValue({ data: { contacts: [{}] } });
});
afterEach(() => jest.restoreAllMocks());

describe("AccountContactForm", () => {
  it("creates the contact, then the account with it", async () => {
    renderForm();
    submit();

    await waitFor(() => expect(mockApi.createAccount).toHaveBeenCalledTimes(1));
    expect(mockApi.createContact).toHaveBeenCalledTimes(1);
    expect(mockApi.createAccount.mock.calls[0][0].contacts).toEqual([
      expect.objectContaining({ contact: "c1" }),
    ]);
    await waitFor(() => expect(lastToast()).toMatchObject({ title: "Account saved successfully!", type: "success" }));
  });

  it("stops before creating anything when the account name is taken", async () => {
    mockApi.checkAccountName.mockResolvedValue({
      data: { available: false, error: 'An archived account named "Basha (Mystery Unlock LLC)" already exists.' },
    });
    renderForm();
    submit();

    await waitFor(() =>
      expect(lastToast()).toMatchObject({ type: "error", description: expect.stringMatching(/archived account named/) })
    );
    expect(mockApi.createContact).not.toHaveBeenCalled();
    expect(mockApi.createAccount).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("asks before creating a duplicate contact, and creates nothing on Cancel", async () => {
    mockApi.checkDuplicateContacts.mockResolvedValue({
      data: { duplicates: [{ index: 0, contactName: "Basha (Mystery)", reasons: ["A contact with the email basha@client.test already exists (Basha)."] }] },
    });
    renderForm();
    submit();

    expect(await screen.findByText("Possible duplicate contact")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByText("Possible duplicate contact")).not.toBeInTheDocument());
    expect(mockApi.createContact).not.toHaveBeenCalled();
    expect(mockApi.createAccount).not.toHaveBeenCalled();
  });

  it("creates the duplicate when told to", async () => {
    mockApi.checkDuplicateContacts.mockResolvedValue({
      data: { duplicates: [{ index: 0, contactName: "Basha (Mystery)", reasons: ["dup"] }] },
    });
    renderForm();
    submit();

    fireEvent.click(await screen.findByRole("button", { name: "Create anyway" }));

    await waitFor(() => expect(mockApi.createAccount).toHaveBeenCalledTimes(1));
    expect(mockApi.createContact).toHaveBeenCalledTimes(1);
  });

  it("says the contact was created but the account was not - in plain words - and never creates it twice", async () => {
    mockApi.createAccount
      .mockRejectedValueOnce({ response: { status: 500, data: { error: "Regular expression is invalid: unmatched closing parenthesis" } } })
      .mockResolvedValueOnce({ data: { _id: "a1" } });
    renderForm();

    submit();
    await waitFor(() =>
      expect(lastToast()).toMatchObject({
        title: "Contact created, but the account was not",
        type: "error",
        description: expect.stringMatching(/^Basha \(Mystery\) was created\. The account was not: A name contains characters/),
      })
    );
    expect(JSON.stringify(mockShowToast.mock.calls)).not.toMatch(/Regular expression/);

    submit();
    await waitFor(() => expect(mockApi.createAccount).toHaveBeenCalledTimes(2));
    expect(mockApi.createContact).toHaveBeenCalledTimes(1);
    expect(mockApi.createAccount.mock.calls[1][0].contacts).toEqual([expect.objectContaining({ contact: "c1" })]);
  });

  it("ignores a second click while saving", async () => {
    let finish;
    mockApi.checkAccountName.mockImplementation(() => new Promise((r) => { finish = r; }));
    renderForm();

    submit();
    submit();
    submit();
    await act(async () => finish({ data: { available: true } }));

    await waitFor(() => expect(mockApi.createAccount).toHaveBeenCalledTimes(1));
    expect(mockApi.checkAccountName).toHaveBeenCalledTimes(1);
    expect(mockApi.createContact).toHaveBeenCalledTimes(1);
  });
});
