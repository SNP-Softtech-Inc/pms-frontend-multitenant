// Team member Access Rights (v1.86.0): readable names, and toggles whose
// on/off state can be told apart at a glance.
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { permissionLabel } from "./permissionLabels";
import PermissionToggle from "./PermissionToggle";

describe("permissionLabel", () => {
  it("writes every current permission as words", () => {
    const expected = {
      managePayments: "Manage Payments",
      managePipelines: "Manage Pipelines",
      manageTimeEntries: "Manage Time Entries",
      manageAccounts: "Manage Accounts",
      manageTags: "Manage Tags",
      manageOrganizers: "Manage Organizers",
      chargeFirmBalance: "Charge Firm Balance",
      manageContacts: "Manage Contacts",
      manageSites: "Manage Sites",
      manageServices: "Manage Services",
      managePublicFilterTemplates: "Manage Public Filter Templates",
      manageTemplates: "Manage Templates",
      manageMarketPlace: "Manage Marketplace",
      manageInvoices: "Manage Invoices",
      manageJobRecurrence: "Manage Job Recurrence",
      manageRatesinTimeEntries: "Manage Rates in Time Entries",
      viewallAccounts: "View All Accounts",
      manageCustomFields: "Manage Custom Fields",
      assignTeamMates: "Assign Teammates",
      viewAllContacts: "View All Contacts",
      manageProposals: "Manage Proposals",
      manageEmails: "Manage Emails",
      editOrganizersAnswers: "Edit Organizer Answers",
      manageDocuments: "Manage Documents",
      manageIRSTranscripts: "Manage IRS Transcripts",
      viewReporting: "View Reporting",
    };
    Object.entries(expected).forEach(([key, label]) => {
      expect(permissionLabel(key)).toBe(label);
    });
  });

  it("makes a readable name for a permission added later", () => {
    expect(permissionLabel("manageClientPortalSettings")).toBe("Manage Client Portal Settings");
    expect(permissionLabel("exportPDFReports")).toBe("Export PDF Reports");
  });

  it("copes with nothing", () => {
    expect(permissionLabel("")).toBe("");
    expect(permissionLabel(undefined)).toBe("");
  });
});

describe("PermissionToggle", () => {
  const setup = (props) => {
    const onToggle = jest.fn();
    render(<PermissionToggle label="Manage Payments" onToggle={onToggle} {...props} />);
    return { onToggle, toggle: screen.getByRole("switch", { name: "Manage Payments" }) };
  };

  it("shows an enabled permission as on, highlighted", () => {
    const { toggle } = setup({ checked: true });

    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAttribute("data-state", "on");
    expect(screen.getByText("On")).toBeInTheDocument();
    expect(toggle.closest("[data-permission]")).toHaveAttribute("data-state", "on");
  });

  it("shows a disabled permission as off, in grey", () => {
    const { toggle } = setup({ checked: false });

    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAttribute("data-state", "off");
    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(toggle.className).toMatch(/bg-muted-foreground/);
  });

  it("switches when clicked", () => {
    const { toggle, onToggle } = setup({ checked: false });

    fireEvent.click(toggle);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("cannot be switched when the permission is not available yet, and says so", () => {
    const { toggle, onToggle } = setup({ checked: false, unavailable: true });

    expect(toggle).toBeDisabled();
    fireEvent.click(toggle);
    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });
});
