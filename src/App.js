import { Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./login-signup/Login";
import SignUp from "./login-signup/SignUp";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/insights";
import Unauthorized from "./components/Unauthorized";
import FirmTemplate from "./pages/FirmTemplate";
import Tasks from "./pages/Templates/TasksTemp/TasksTemplate";
import Emails from "./pages/Templates/EmailTemp/EmailTemplate";
import JobTemplate from "./pages/Templates/JobTemp/JobTemplate";
import ClientFacingJobTemplate from "./pages/Templates/ClientFacingJobTemp/ClientFacingJobTemplate";
import ChatTemp from "./pages/Templates/ChatTemp/ChatTemplate";
import FolderTemplate from "./pages/Templates/FolderTemp/FolderTemp";
import InvoiceTemplate from "./pages/Templates/InvoiceTemp/InvoiceTemplates";
import OrgaizerTemplate from "./pages/Templates/OrganizerTemp/OrgaizerTemplate";
import ProposalTemplate from "./pages/Templates/ProposalTemp/ProposalsTable";
import ProposalForm from "./pages/Templates/ProposalTemp/ProposalForm";
import TeamMember from "./pages/Teammembers/TeamMember";
import ActivateAccount from "./pages/Teammembers/ActivateAccount";
import Tags from "./pages/Templates/Tags/Tags";
import Service from "./pages/Templates/Services&Category/Services";
import Account from "./pages/Account-Contact/AccountTable";
import ForgotPassword from "./login-signup/ForgotPassword";
import ResetPassword from "./login-signup/ResetPassword";
import MyAccount from "./pages/Settings/MyAccount";
import FirmSetting from "./pages/Settings/FirmSetting";
import PipelineForm from "./pages/Templates/PipelineTemp/PipelineTemplate";
import PipelineTable from "./pages/Templates/PipelineTemp/PipelineTable";
import FolderTreeView from "./pages/Templates/FolderTemp/FolderTreeView";
import TemplateCreator from "./pages/Templates/FolderTemp/TemplateCreator";
import ContactsTable from "./pages/Account-Contact/ContactTable";
import AccountsDash from "./pages/AccountDashboard";
import Overview from "./pages/AccountDashboard/Overview";
import Info from "./pages/AccountDashboard/Info";
import Docs from "./pages/AccountDashboard/Docs";
import Communication from "./pages/AccountDashboard/Communication";
import Organizers from "./pages/AccountDashboard/Organizers";
import Invoices from "./pages/AccountDashboard/Invoices";
import Email from "./pages/AccountDashboard/Email";
import Proposals from "./pages/AccountDashboard/Proposals";
import Notes from "./pages/AccountDashboard/Notes";
import Workflow from "./pages/AccountDashboard/Workflow";
import Pipeline from "./pages/AccountDashboard/Work-flow/Pipeline";
import Activejobs from "./pages/AccountDashboard/Work-flow/Activejobs";
import Archivejobs from "./pages/AccountDashboard/Work-flow/Archivejobs";
import Pendingtasks from "./pages/AccountDashboard/Work-flow/Pendingtasks";
import Completedtasks from "./pages/AccountDashboard/Work-flow/Completedtasks";
import Documents from "./pages/AccountDashboard/Documents/Documents";
import Approvals from "./pages/AccountDashboard/Documents/Approvals";
import Signatures from "./pages/AccountDashboard/Documents/Signatures";
import Trash from "./pages/AccountDashboard/Documents/Trash";
import AccountProposalForm from "./pages/AccountDashboard/Proposals/AccountProposalForm";
import AllProposalList from "./pages/AllProposalList";
import AccountOrganizer from "./pages/AccountDashboard/Organizer/AccountOrganizer";
import InvoiceList from "./pages/AccountDashboard/Invoices/InvoiceList";
import Payment from "./pages/AccountDashboard/Invoices/Payment";
import AllInvoices from "./pages/AllInvoices";
import WorkflowPipeline from "./pages/Workflow/Pipeline";
import JobList from "./pages/Workflow/JobList";
import AccountTasksList from "./pages/AccountTasks/AccountTasksList";
import ContactImport from "./pages/Import/ContactImport";
import AccountImport from "./pages/Import/AccountImport";
import UploadFolderToAccount from "./pages/Import/UploadFolderToAccount";
import InternalCommunication from "./pages/Internal-communication/internalCommunication";
import InboxPlus from "./pages/InboxPlus";
import Inbox from "./pages/AccountDashboard/Email/Inbox";
import Sent from "./pages/AccountDashboard/Email/Sent";
import ActiveMember from "./pages/Teammembers/ActiveTeammembers";
import Deactivatemember from "./pages/Teammembers/Deactivatemember";
import ActiveGroups from "./pages/Teammembers/ActiveGroups";
function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route
        path="/activate-team-member/:id/:token"
        element={<ActivateAccount />}
      />
      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route
          // path="/insights"
          index
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/accounts/activeaccounts"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/clients/accounts/accountsdash"
          element={
            <ProtectedRoute>
              <AccountsDash />
            </ProtectedRoute>
          }
        >
          <Route path="overview/:accountId" element={<Overview />} />
          <Route path="info/:accountId" element={<Info />} />
          <Route path="docs/:accountId" element={<Docs />}>
            <Route index element={<Documents />} />
            <Route path="documents" element={<Documents />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="signatures" element={<Signatures />} />
            <Route path="trash" element={<Trash />} />
          </Route>
          <Route path="communication/:accountId" element={<Communication />} />
          <Route path="organizers/:accountId" element={<Organizers />} />
          <Route
            path="organizers/:accountId/accountorganizer"
            element={<AccountOrganizer />}
          />
          <Route path="invoices/:accountId" element={<Invoices />}>
            <Route index element={<InvoiceList />} />
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="payment" element={<Payment />} />
          </Route>
          <Route path="email/:accountId" element={<Email />}>
            <Route path="inbox" element={<Inbox />} />
            <Route path="sent" element={<Sent />} />
          </Route>
          <Route path="proposals/:accountId" element={<Proposals />} />
          <Route
            path="proposals/:accountId/account-proposal"
            element={<AccountProposalForm />}
          />
          <Route path="notes/:accountId" element={<Notes />} />
          <Route path="workflow/:accountId" element={<Workflow />}>
            <Route index element={<Pipeline />} />
            <Route path="pipelines" element={<Pipeline />} />
            <Route path="activejobs" element={<Activejobs />} />
            <Route path="archivedjobs" element={<Archivejobs />} />
            <Route path="pendingtasks" element={<Pendingtasks />} />
            <Route path="completetasks" element={<Completedtasks />} />
          </Route>
        </Route>
        <Route
          path="/clients/contacts"
          element={
            <ProtectedRoute>
              <ContactsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/import/contacts"
          element={
            <ProtectedRoute>
              <ContactImport />
            </ProtectedRoute>
          }
        />

        <Route path="/import/accounts" element={<AccountImport />} />
        <Route
          path="/upload-docs"
          element={
            <ProtectedRoute>
              <UploadFolderToAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/myaccount"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/firmsettings"
          element={
            <ProtectedRoute>
              <FirmSetting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing/proposalsandels"
          element={
            <ProtectedRoute>
              <AllProposalList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/Invoices"
          element={
            <ProtectedRoute>
              <AllInvoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing/proposalsandels/new"
          element={
            <ProtectedRoute>
              <AccountProposalForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pipelines"
          element={
            <ProtectedRoute>
              {" "}
              <WorkflowPipeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/activejob"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/pending"
          element={
            <ProtectedRoute>
              <AccountTasksList />
            </ProtectedRoute>
          }
        />
        {/* ✅ Templates Parent Route */}
        <Route
          path="firmtemp/templates"
          element={
            <ProtectedRoute>
              <FirmTemplate />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="tasks" replace />} />
          {/* ✅ Child Routes */}
          <Route path="tasks" element={<Tasks />} />

          <Route path="emails" element={<Emails />} />

          <Route path="jobs" element={<JobTemplate />} />

          <Route path="clientfacing" element={<ClientFacingJobTemplate />} />

          <Route path="folders" element={<FolderTemplate />} />
          <Route path="createfolder" element={<TemplateCreator />} />
          <Route path="tree/:templateId" element={<FolderTreeView />} />

          <Route path="chats" element={<ChatTemp />} />

          <Route path="invoices" element={<InvoiceTemplate />} />

          <Route path="organizers" element={<OrgaizerTemplate />} />

          <Route path="proposals" element={<ProposalTemplate />} />
          <Route path="proposals/proposal-form" element={<ProposalForm />} />
        </Route>

        <Route path="firmtemp/pipelines" element={<PipelineTable />} />
        <Route
          path="firmtemp/pipelines/pipelineform"
          element={<PipelineForm />}
        />
        {/* <Route path="firmtemp/teammember" element={<TeamMember />} /> */}

      <Route path="firmtemp/teammember" element={<TeamMember />}>
  <Route index element={<ActiveMember />} />
  <Route path="active" element={<ActiveMember />} />
  <Route path="deactive" element={<Deactivatemember />} />
  <Route path="groups" element={<ActiveGroups />} />
</Route>
        <Route path="firmtemp/tags" element={<Tags />} />
        <Route path="firmtemp/service" element={<Service />} />

        <Route
          path="/internal-communation"
          element={
            <ProtectedRoute>
              <InternalCommunication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Inbox+"
          element={
            <ProtectedRoute>
              <InboxPlus />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
