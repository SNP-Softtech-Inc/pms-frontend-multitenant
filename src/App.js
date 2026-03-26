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
import FolderTemplate from "./pages/Templates/FolderTemp/FolderTemplates";
import InvoiceTemplate from "./pages/Templates/InvoiceTemp/InvoiceTemplates";
import OrgaizerTemplate from "./pages/Templates/OrganizerTemp/OrgaizerTemplate";
import ProposalTemplate from "./pages/Templates/ProposalTemp/ProposalsTable";
import ProposalForm from "./pages/Templates/ProposalTemp/ProposalForm"
import TeamMember from "./pages/Teammembers/TeamMember";
import ActivateAccount from "./pages/Teammembers/ActivateAccount";
import Tags from "./pages/Templates/Tags/Tags";
import Service from "./pages/Templates/Services&Category/Services";
import Account from "./pages/Account-Contact/AccountTable";
import ForgotPassword from "./login-signup/ForgotPassword";
import ResetPassword from "./login-signup/ResetPassword";
import MyAccount from "./pages/Settings/MyAccount";
import FirmSetting from "./pages/Settings/FirmSetting";

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
          path="/insights"
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
        {/* ✅ Templates Parent Route */}
        <Route
          path="firmtemp/templates"
          element={
            <ProtectedRoute>
              <FirmTemplate />
            </ProtectedRoute>
          }
        >
          {/* ✅ Child Routes */}
          <Route path="tasks" element={<Tasks />} />

          <Route path="emails" element={<Emails />} />

          <Route path="jobs" element={<JobTemplate />} />

          <Route path="clientfacing" element={<ClientFacingJobTemplate />} />

          <Route path="folders" element={<FolderTemplate />} />

          <Route path="chats" element={<ChatTemp />} />

          <Route path="invoices" element={<InvoiceTemplate />} />

          <Route path="organizers" element={<OrgaizerTemplate />} />

          <Route path="proposals" element={<ProposalTemplate />} />
          <Route path="proposals/proposal-form" element={<ProposalForm/>}/>
        </Route>
        <Route path="firmtemp/teammember" element={<TeamMember />} />
        <Route path="firmtemp/tags" element={<Tags />} />
        <Route path="firmtemp/service" element={<Service />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
