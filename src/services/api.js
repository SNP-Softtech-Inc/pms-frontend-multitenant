import axios from "axios";
import {
  getAccessToken,
   setAccessToken as saveAccessToken,
  // getAccessToken,
  clearAccessToken,
} from "../services/tokenService";
// ================= BASE URLs =================
const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;
const SIDEBAR_URL = process.env.REACT_APP_SIDEBAR;
const TEMPLATE_URL = process.env.REACT_APP_TEMPLATE;
const ACCOUNT_CONTACT_URL = process.env.REACT_APP_ACCOUNT_CONTACT;
const PROPOSAL_URL = process.env.REACT_APP_PROPOSAL;
const ORGANIZER_URL = process.env.REACT_APP_ORGANIZER;
const FOLDER_MANAGEMENT_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;
const CHAT_URL = process.env.REACT_APP_CHAT; // add in .env
const INVOICE_URL = process.env.REACT_APP_INVOICE;
const JOBS_URL = process.env.REACT_APP_JOBS;
const ACCOUNT_TASKS_URL = process.env.REACT_APP_ACCOUNT_TASKS;
const INTERNAL_CHAT_URL = process.env.REACT_APP_TEAMMATES_CHAT;
const EMAIL_SYNC = process.env.REACT_APP_EMAIL_SYNC;
const ACCOUNT_NOTE = process.env.REACT_APP_ACCOUNT_NOTE;
const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
// ================= AXIOS INSTANCES =================
const authUserApi = axios.create({
  baseURL: AUTH_USER_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

const sidebarApi = axios.create({
  baseURL: SIDEBAR_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

const templateApi = axios.create({
  baseURL: TEMPLATE_URL, // include /temp here
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

const accountcontactApi = axios.create({
  baseURL: ACCOUNT_CONTACT_URL,
      withCredentials: true,

  headers: {

    "Content-Type": "application/json",
  },
});

const proposalApi = axios.create({
  baseURL: PROPOSAL_URL, // e.g. http://localhost:8023/api/proposals
     withCredentials: true,
 headers: {
    "Content-Type": "application/json",
  },
});
const organizerApi = axios.create({
  baseURL: ORGANIZER_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

const folderManagementApi = axios.create({
  baseURL: FOLDER_MANAGEMENT_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});
const chatApi = axios.create({
  baseURL: CHAT_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});
const invoiceApi = axios.create({
  baseURL: INVOICE_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

const jobsApi = axios.create({
  baseURL: JOBS_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});
const accountTasksApi = axios.create({
  baseURL: ACCOUNT_TASKS_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});
const internalChatApi = axios.create({
  baseURL: INTERNAL_CHAT_URL,
      withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});
const emailSyncApi = axios.create({
  baseURL: EMAIL_SYNC,
      withCredentials: true,

  headers:{
    "Content-Type": "application/json",
  }
});
const accNoteApi = axios.create({
  baseURL: ACCOUNT_NOTE,
      withCredentials: true,

  headers:{
        "Content-Type": "application/json",

  }
});
const signatureApi = axios.create({ 
  baseURL: SIGNATURE_API,
   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// ================= COMMON INTERCEPTORS =================


// =================== REFRESH STATE ===================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
};

// =================== ATTACH INTERCEPTORS ===================

const attachInterceptors = (api) => {
  // Request
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      
if (
  error.response?.status !== 401 ||
  originalRequest._retry ||
  originalRequest.url.includes("/api/auth/login") ||
  originalRequest.url.includes("/api/auth/refresh-token") ||
  originalRequest.url.includes("/api/auth/validate-activation") ||
  originalRequest.url.includes("/api/auth/activate-team-member") ||
  originalRequest.url.includes("/api/auth/forgot-password") ||
  originalRequest.url.includes("/api/auth/reset-password")
) {
  return Promise.reject(error);
}
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // const { data } = await authAPI.refresh();
const { data } = await axios.post(
  `${AUTH_USER_URL}/api/auth/refresh-token`,
  {},
  {
    withCredentials: true,
  }
);
      //  setAccessToken(data.accessToken);
saveAccessToken(data.accessToken);
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        clearAccessToken();

        localStorage.removeItem("user");

        window.location.href = "/admin/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
// // Apply interceptors
attachInterceptors(authUserApi);
attachInterceptors(sidebarApi);
attachInterceptors(accountcontactApi);
attachInterceptors(proposalApi);
attachInterceptors(organizerApi);
attachInterceptors(folderManagementApi);
attachInterceptors(chatApi);
attachInterceptors(invoiceApi);
attachInterceptors(jobsApi);
attachInterceptors(accountTasksApi);
attachInterceptors(internalChatApi);
attachInterceptors(emailSyncApi);
attachInterceptors(accNoteApi);
attachInterceptors(signatureApi);
attachInterceptors(templateApi)


// ================= AUTH + USER APIs =================
export const authAPI = {
  // OTP
  sendOTP: (email) => authUserApi.post("/api/auth/send-otp", { email }),
  verifyOTP: (email, otp) =>
    authUserApi.post("/api/auth/verify-otp", { email, otp }),
  resendOTP: (email) => authUserApi.post("/api/auth/resend-otp", { email }),

  // Register
  registerAdmin: (data) => authUserApi.post("/api/auth/register/admin", data),
  registerTeamMember: (data) =>
    authUserApi.post("/api/auth/register/team-member", data),

  // // Login
  // login: (email, password, expiryTime) =>
  //   authUserApi.post("/api/auth/login", { email, password, expiryTime }),
  // Login
login: ({ email, password, expiryTime, userId }) =>
  authUserApi.post("/api/auth/login", {
    email,
    password,
    expiryTime,
    userId,
  }),

  getUsersByEmail: (email) =>
    authUserApi.post("/api/auth/get-users", { email }),

   // Get Current Logged-in User
getCurrentUser: () => authUserApi.get("/api/auth/me"),
  // ✅ NEW API
  getAllUsers: (params) => authUserApi.post("/api/auth/users", { params }),
  getSingleUser: (id) => authUserApi.get(`/api/auth/user/${id}`),
  // ✅ NEW: UPDATE MY PROFILE (BEST PRACTICE 🚀)
  updateMyProfile: (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    return authUserApi.patch("/api/auth/my-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  // ✅ UPDATE EMAIL SYNC EMAIL
  updateEmailSyncEmail: (data) =>
    authUserApi.patch("/api/auth/email-sync", data),
  // Logout
  logout: () => authUserApi.post("/api/auth/logout"),

  forgotPassword: (data) => authUserApi.post("/api/auth/forgot-password", data),
refresh: () =>
    authUserApi.post("/api/auth/refresh-token"),
  resetPassword: (id, token, data) =>
    authUserApi.post(`/api/auth/reset-password/${id}/${token}`, data),

  verifyPassword: (data) => authUserApi.post("/api/auth/verify-password", data),
changePassword: (data) => authUserApi.post("/api/auth/change-password", data),
updateLoginDetails: (data) => authUserApi.patch("/api/auth/login-details", data),
  // ======================= GROUPED USERS APIs ===============================

  getGroupedUsers: () =>
    authUserApi.get("/api/auth/grouped-users"),

  // ======================= TEAMMEMBERS APIs ===============================

  // Activation endpoints
  validateActivationToken: (id, token) =>
    authUserApi.get(`/api/teammember/validate-activation/${id}/${token}`),

  activateTeamMember: (id, token, password, confirmPassword) =>
    authUserApi.post(`/api/teammember/activate-team-member/${id}/${token}`, {
      password,
      confirmPassword,
    }),

  resendActivation: (teamMemberId) =>
    authUserApi.post("/api/teammember/resend-activation", { teamMemberId }),

  // Get all team members
  getTeamMembers: () => authUserApi.get("/api/teammember/"),

    // Get active team members
  getActiveTeamMembers: () =>
    authUserApi.get("/api/teammember/active"),

  // Get inactive team members
  getInactiveTeamMembers: () =>
    authUserApi.get("/api/teammember/inactive"),


  deactivateTeamMember: (id) =>
  authUserApi.patch(`/api/teammember/${id}/deactivate`),


  // Get single team member
  getTeamMemberById: (id) => authUserApi.get(`/api/teammember/${id}`),

  // Update team member
  updateTeamMember: (id, data) =>
    authUserApi.put(`/api/teammember/${id}`, data),

  // Delete team member
  deleteTeamMember: (id) => authUserApi.delete(`/api/teammember/${id}`),

  // ======================= NOTIFICATIONS APIs ===============================

  // Get all notifications for logged-in tenant
  getNotifications: () => authUserApi.get("/api/notifications/"),

  // Get a single notification by ID
  getNotification: (id) => authUserApi.get(`/api/notifications/${id}`),

  // Get notification by user ID
  getNotificationByUser: (userid) =>
    authUserApi.get(`/api/notifications/user/${userid}`),

  // Create a new notification
  createNotification: (data) => authUserApi.post("/api/notifications/", data),

  // // Update a notification

  updateNotification: (notificationDocId, notificationId, data) =>
    authUserApi.put(
      `/api/notifications/${notificationDocId}/${notificationId}`,
      data,
    ),
  // Delete a notification
  deleteNotification: (id) => authUserApi.delete(`/api/notifications/${id}`),

  // ======================= GROUP APIs ===============================

  // Create group
  createGroup: (data) => authUserApi.post("/api/groups/", data),

  // Get all groups
  getGroups: () => authUserApi.get("/api/groups/"),

  // Add members to group
  addMembersToGroup: (groupId, memberIds) =>
    authUserApi.post(`/api/groups/${groupId}/add-members`, {
      memberIds,
    }),

  // Remove members from group
  removeMembersFromGroup: (groupId, memberIds) =>
    authUserApi.post(`/api/groups/${groupId}/remove-members`, {
      memberIds,
    }),

  // Change group leader
  changeGroupLeader: (groupId, newLeaderId) =>
    authUserApi.put(`/api/groups/${groupId}/change-leader`, {
      newLeaderId,
    }),
  updateGroup: (groupId, data) =>
    authUserApi.put(`/api/groups/${groupId}`, data),
  deleteGroup: (groupId) => authUserApi.delete(`/api/groups/groups/${groupId}`),


  // ======================= EMAIL SYNC APIs ===============================

// Get notification emails
// getEmailNotifications: () =>
//   authUserApi.get("/api/emailsync/notifications"),
// In your authAPI or API service file
getEmailNotifications: (archived = false) => {
  // Pass archived as query parameter
  return authUserApi.get(`/api/emailsync/notifications?archived=${archived}`);
},
// Get communication emails
getEmailCommunications: () =>
  authUserApi.get("/api/emailsync/communications"),

  // Mark thread as read
  markThreadAsRead: (
    threadId
  ) =>
    emailSyncApi.put(
      `/api/emailsync/mark-read/${threadId}`
    ),

  // Archive thread
  archiveThread: (
    threadId
  ) =>
    emailSyncApi.put(
      `/api/emailsync/archive/${threadId}`
    ),

  // Unarchive thread
  unarchiveThread: (
    threadId
  ) =>
    emailSyncApi.put(
      `/api/emailsync/unarchive/${threadId}`
    ),
    // Get attachment data by attachment ID
  getAttachmentData: (attachmentId) =>
    authUserApi.get(`/api/emailsync/attachment/${attachmentId}`),

 

};

// ================= SIDEBAR APIs =================
export const sidebarAPI = {
  getSidebar: () => sidebarApi.get("/api/sidebar/"),
};

export const leftSidebarAPI = {
  getLeftSidebar: () => sidebarApi.get("/api/newsidebar/"),
};
// ================= TEMPLATE APIs =================
export const templateAPI = {
  // ================= CLIENTFACINGJOB STATUS =================
  createJobStatus: (data) =>
    templateApi.post("/temp/clientfacing/newstatus", data),

  getAllJobStatus: () => templateApi.get("/temp/clientfacing/"),

  getJobStatusById: (id) => templateApi.get(`/temp/clientfacing/${id}`),

  updateJobStatus: (id, data) =>
    templateApi.patch(`/temp/clientfacing/${id}`, data),

  deleteJobStatus: (id) => templateApi.delete(`/temp/clientfacing/${id}`),

  // ================= TAGS =================
  getAllTags: () => templateApi.get("/temp/tags/"),

  getTagById: (id) => templateApi.get(`/temp/tags/${id}`),

  createTags: (data) => templateApi.post("/temp/tags/", data),

  updateTags: (id, data) => templateApi.patch(`/temp/tags/${id}`, data),

  deleteTags: (id) => templateApi.delete(`/temp/tags/${id}`),

  findTagsByName: (name) =>
    templateApi.get(`/temp/tags/find?name=${encodeURIComponent(name)}`),
  getAccountCountOfTag: () =>
    templateApi.get("/temp/tags/accountcountoftag/account"),
  // ✅ NEW: Get default tags (Incomplete Data & Imported Account)
  getDefaultTags: () => templateApi.get("/temp/tags/default-tags"),

  // ================= TASKS =================
  // CREATE
  createTaskTemplate: (data) => templateApi.post("/temp/tasks/", data),

  // GET ALL
  getAllTaskTemplates: () => templateApi.get(`/temp/tasks`),

  // GET SINGLE
  getTaskTemplateById: (id) => templateApi.get(`/temp/tasks/${id}`),

  // UPDATE
  updateTaskTemplate: (id, data) =>
    templateApi.patch(`/temp/tasks/${id}`, data),

  // DELETE (Soft delete)
  deleteTaskTemplate: (id) => templateApi.delete(`/temp/tasks/${id}`),

  // ================= EMAIL TEMPLATES =================

  // GET ALL
  getEmailTemplates: () => templateApi.get("/temp/emails/emailtemplate"),

  // GET SINGLE
  getEmailTemplateById: (id) =>
    templateApi.get(`/temp/emails/emailtemplate/${id}`),

  // GET LIST (custom)
  getEmailTemplateList: (id) =>
    templateApi.get(`/temp/emails/emailtemplate/emailtemplateList/${id}`),

  // CREATE (with file upload)
  createEmailTemplate: (data) => {
    console.log("data", data);

    return templateApi.post("/temp/emails/emailtemplate", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // UPDATE (with file upload)
  updateEmailTemplate: (id, data) =>
    templateApi.patch(`/temp/emails/emailtemplate/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // DELETE TEMPLATE
  deleteEmailTemplate: (id) =>
    templateApi.delete(`/temp/emails/emailtemplate/${id}`),

  // DELETE ATTACHMENT
  deleteAttachment: (templateId, filename) =>
    templateApi.delete(
      `/temp/emails/deleteattachments/${templateId}/${filename}`,
    ),

  // CHECK NAME
  checkTemplateNameExists: (name) =>
    templateApi.get(`/temp/emails/check-name?name=${encodeURIComponent(name)}`),

  // ================= CHAT TEMPLATES =================

  getAllChatTemplates: () => templateApi.get("/temp/chats/chattemplate"),
  getChatTemplateById: (id) =>
    templateApi.get(`/temp/chats/chattemplate/${id}`),
  getChatTemplateList: (id) =>
    templateApi.get(`/temp/chats/chattemplate/chattemplateList/${id}`),
  createChatTemplate: (data) =>
    templateApi.post("/temp/chats/chattemplate", data),
  updateChatTemplate: (id, data) =>
    templateApi.patch(`/temp/chats/chattemplate/${id}`, data),
  deleteChatTemplate: (id) =>
    templateApi.delete(`/temp/chats/chattemplate/${id}`),
  checkChatTemplateNameExists: (name) =>
    templateApi.get(`/temp/chats/check-name?name=${encodeURIComponent(name)}`),

  // ================= SERVICE TEMPLATES =================
  getAllServiceTemplates: () =>
    templateApi.get("/temp/service/servicetemplate"),
  getServiceTemplateById: (id) =>
    templateApi.get(`/temp/service/servicetemplate/${id}`),
  getServiceTemplateDetailedById: (id) =>
    templateApi.get(`/temp/service/servicetemplate/servicetemplatebyid/${id}`),
  createServiceTemplate: (data) =>
    templateApi.post("/temp/service/servicetemplate", data),
  updateServiceTemplate: (id, data) =>
    templateApi.patch(`/temp/service/servicetemplate/${id}`, data),
  deleteServiceTemplate: (id) =>
    templateApi.delete(`/temp/service/servicetemplate/${id}`),

  // ================= CATEGORY =================
  getAllCategories: () => templateApi.get("/temp/category/categorys"),
  getCategoryById: (id) => templateApi.get(`/temp/category/category/${id}`),
  createCategory: (data) =>
    templateApi.post("/temp/category/newcategory", data),
  updateCategory: (id, data) =>
    templateApi.patch(`/temp/category/category/${id}`, data),
  deleteCategory: (id) => templateApi.delete(`/temp/category/category/${id}`),

  // ================= INVOICE TEMPLATES =================

  // GET ALL
  getAllInvoiceTemplates: () =>
    templateApi.get("/temp/invoice/invoicetemplate"),

  // GET SINGLE
  getInvoiceTemplateById: (id) =>
    templateApi.get(`/temp/invoice/invoicetemplate/${id}`),

  // CREATE
  createInvoiceTemplate: (data) =>
    templateApi.post("/temp/invoice/invoicetemplate", data),

  // UPDATE
  updateInvoiceTemplate: (id, data) =>
    templateApi.patch(`/temp/invoice/invoicetemplate/${id}`, data),

  // DELETE
  deleteInvoiceTemplate: (id) =>
    templateApi.delete(`/temp/invoice/invoicetemplate/${id}`),

  // CHECK NAME
  checkInvoiceTemplateNameExists: (name) =>
    templateApi.get(
      `/temp/invoice/check-name?name=${encodeURIComponent(name)}`,
    ),

  // ================= JOB TEMPLATES =================

  // GET ALL
  getAllJobTemplates: () => templateApi.get("/temp/jobs/jobtemplate"),

  // GET SINGLE
  getJobTemplateById: (id) => templateApi.get(`/temp/jobs/jobtemplate/${id}`),

  // GET LIST
  getJobTemplateList: (id) =>
    templateApi.get(`/temp/jobs/jobtemplate/jobtemplatelist/${id}`),

  // CREATE
  createJobTemplate: (data) => templateApi.post("/temp/jobs/jobtemplate", data),

  // UPDATE
  updateJobTemplate: (id, data) =>
    templateApi.patch(`/temp/jobs/jobtemplate/${id}`, data),

  // DELETE
  deleteJobTemplate: (id) => templateApi.delete(`/temp/jobs/jobtemplate/${id}`),

  // CHECK NAME
  checkJobTemplateNameExists: (name) =>
    templateApi.get(`/temp/jobs/check-name?name=${encodeURIComponent(name)}`),

  // ================= PIPELINE =================

  // GET ALL PIPELINES
  getAllPipelines: () => templateApi.get("/temp/pipeline/pipelines"),

  // GET PIPELINES BY USER
  getPipelinesByUser: (userId) =>
    templateApi.get(`/temp/pipeline/pipelines/${userId}`),

  // GET SINGLE PIPELINE
  getPipelineById: (id) => templateApi.get(`/temp/pipeline/pipeline/${id}`),

  // CREATE PIPELINE
  createPipeline: (data) =>
    templateApi.post("/temp/pipeline/createpipeline", data),

  // UPDATE PIPELINE
  updatePipeline: (id, data) =>
    templateApi.patch(`/temp/pipeline/pipeline/${id}`, data),

  // DELETE PIPELINE
  deletePipeline: (id) => templateApi.delete(`/temp/pipeline/pipeline/${id}`),

  // GET PIPELINE TEMPLATE LIST (with automations populated)
  getPipelineTemplateList: (id) =>
    templateApi.get(`/temp/pipeline/pipeline/pipelinelist/${id}`),

  // GET PIPELINES WITH ACTIVE JOB COUNT
  getPipelinesWithCount: () =>
    templateApi.get("/temp/pipeline/pipelines/count"),

  // CHECK NAME EXISTS
  checkPipelineNameExists: (name) =>
    templateApi.get(
      `/temp/pipeline/check-name?name=${encodeURIComponent(name)}`,
    ),

  // NEW: GET PIPELINE STAGES (with automations)
  getPipelineStages: (pipelineId) =>
    templateApi.get(`/temp/pipeline/stages/${pipelineId}`),

  // ================= SORT JOBS BY =================

  // GET ALL
  getAllSortJobsBy: () => templateApi.get("/temp/sortjobs/sortjobby"),

  // GET SINGLE
  getSortJobById: (id) => templateApi.get(`/temp/sortjobs/sortjobby/${id}`),

  // CREATE
  createSortJobsBy: (data) =>
    templateApi.post("/temp/sortjobs/sortjobby", data),

  // UPDATE
  updateSortJobsBy: (id, data) =>
    templateApi.patch(`/temp/sortjobs/sortjobby/${id}`, data),

  // DELETE
  deleteSortJobsBy: (id) =>
    templateApi.delete(`/temp/sortjobs/sortjobby/${id}`),
};

// ================= ACCOUNTS APIs =================

export const accountsAPI = {
  // ================= CREATE =================
  createAccount: (data) => accountcontactApi.post("/api/clientaccounts/", data),

  createAccountFromCSV: (data) =>
    accountcontactApi.post("/api/clientaccounts/csv-import", data),

  // ================= UPDATE =================
  updateAccount: (id, data) =>
    accountcontactApi.put(`/api/clientaccounts/${id}`, data),

  updateAccountTags: (id, data) =>
    accountcontactApi.patch(
      `/api/clientaccounts/accountdetails/updateaccounttags/${id}`,
      data,
    ),

  updateAccountActiveStatus: (data) =>
    accountcontactApi.patch(`/api/clientaccounts/update-active`, data),

  // ================= GET =================
  getAccounts: () => accountcontactApi.get("/api/clientaccounts/"),

  // getAccountsList: () =>
  //   accountcontactApi.get("/accounts/list"),
  getAccountsList: (active = true) =>
    accountcontactApi.get(`/api/clientaccounts/list?active=${active}`),

  getAccountById: (id) => accountcontactApi.get(`/api/clientaccounts/${id}`),

  getMultipleAccountsByIds: (data) =>
    accountcontactApi.post("/api/clientaccounts/multiple", data),

getAccountsByTeamMember: (active) =>
  accountcontactApi.get(`/api/clientaccounts/byTeam?active=${active}`),

  getAccountNames: () =>
    accountcontactApi.get("/api/clientaccounts/accountlist/names"),

  // getAccountNamesByStatus: () =>
  //   accountcontactApi.get("/api/accounts/accountlist/names-by-status"),
  // getAccountNamesByStatus: (active = true) =>
  //   accountcontactApi.get(
  //     `/api/clientaccounts/accountlist/names-by-status?active=${active}`,
  //   ),
  getAccountNamesByStatus: (params) =>
  accountcontactApi.get(
    `/api/clientaccounts/accountlist/names-by-status`,
    { params } // ✅ THIS is the correct way
  ),
  
  getAccountsByTeamMemberName : (params) =>
  accountcontactApi.get(
    `/api/clientaccounts/accountlist/teams-by-status`,
    { params } // ✅ THIS is the correct way
  ),
  getAccountNamesWithEmails: () =>
    accountcontactApi.get("/api/clientaccounts/accounts-by-status-with-emails"),

  getAccountContactEmails: (id) =>
    accountcontactApi.get(`/api/clientaccounts/contacts-emails/${id}`),

  getAccountsWithImportedAndIncompleteTags: () =>
    accountcontactApi.get("/api/clientaccounts/imported-incomplete"),
  getAccountsWithOnlyImportedTag: (active = true) =>
    accountcontactApi.get(`/api/clientaccounts/only-imported?active=${active}`),
  // ================= DELETE =================
  deleteMultipleAccounts: (data) =>
    accountcontactApi.delete(
      "/api/clientaccounts/accounts/deleteMultipleAccounts",
      {
        data,
      },
    ),

  // ================= PROFILE =================
  uploadProfilePicture: (id, data) =>
    accountcontactApi.patch(`/api/clientaccounts/${id}/profile-picture`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // ================= CONTACTS =================
  getAccountContacts: (accountId) =>
    accountcontactApi.get(`/api/clientaccounts/${accountId}/contacts`),

  addContactsToAccount: (accountId, data) =>
    accountcontactApi.post(`/api/clientaccounts/${accountId}/contacts`, data),

  removeContactFromAccount: (accountId, contactId) =>
    accountcontactApi.delete(
      `/api/clientaccounts/${accountId}/contact/${contactId}`,
    ),

  toggleContactLogin: (accountId, contactId, data) =>
    accountcontactApi.patch(
      `/api/clientaccounts/${accountId}/contact/${contactId}`,
      data,
    ),

  // ================= BULK TAGS =================
  assignBulkTags: (data) =>
    accountcontactApi.post(
      "/api/clientaccounts/assignbulktags/tomultipleaccount",
      data,
    ),

  removeBulkTags: (data) =>
    accountcontactApi.post(
      "/api/clientaccounts/assignbulktags/removetags",
      data,
    ),

  // ================= TEAM MEMBERS =================
  assignTeamMembers: (data) =>
    accountcontactApi.post(
      "/api/clientaccounts/manageteammember/teamMembertomultipleaccount",
      data,
    ),

  removeTeamMembers: (data) =>
    accountcontactApi.post(
      "/api/clientaccounts/manageteammember/removeteammember",
      data,
    ),

  // ================= EMAIL =================
  sendBulkEmails: (data) =>
    accountcontactApi.post("/api/clientaccounts/sendBulkEmails", data),

  sendComposeEmail: (data) =>
    accountcontactApi.post("/api/clientaccounts/sendComposeEmail", data),
};

// ================= CONTACT APIs =================
export const contactsAPI = {
  // ================= CREATE =================
  createContact: (data) => accountcontactApi.post("/api/contacts/", data),

  createBulkContacts: (data) =>
    accountcontactApi.post("/api/contacts/bulk-save", data),

  // ================= UPDATE =================
  updateContact: (id, data) =>
    accountcontactApi.put(`/api/contacts/${id}`, data),

  updateContactWithoutPassword: (id, data) =>
    accountcontactApi.put(`/api/contacts/contact/${id}`, data),

  // ================= GET =================
  getContacts: () => accountcontactApi.get("/api/contacts/"),

  getContactById: (id) => accountcontactApi.get(`/api/contacts/contact/${id}`),

  // getContactNames: () => accountcontactApi.get("/api/contacts/contact-names"),
  getContactNames: (params) =>
  accountcontactApi.get("/api/contacts/contact-names", { params }),

   // ✅ NEW: Get contacts by email
  getContactsByEmail: (email) =>
    accountcontactApi.get(`/api/contacts/by-email`, {
      params: { email },
    }),
  // ================= DELETE =================
  deleteContacts: (data) =>
    accountcontactApi.delete("/api/contacts/delete-multiple", {
      data,
    }),

  // ================= ACTIVATION =================
  verifyActivationToken: (token) =>
    accountcontactApi.get(`/api/contacts/activate/verify/${token}`),

  activateAndSetPassword: (token, data) =>
    accountcontactApi.post(
      `/api/contacts/activate/set-password/${token}`,
      data,
    ),

  // resendActivationEmail: (contactId) =>
  //   accountcontactApi.post(`/api/contacts/${contactId}/resend-activation`),
  resendActivationEmail: (contactId, data) =>
  accountcontactApi.post(
    `/api/contacts/${contactId}/resend-activation`,
    data
  ),
};

// ================= PROPOSALS APIs =================
export const proposalAPI = {
  // CREATE
  createProposal: (data) => proposalApi.post("/api/proposals/", data),

  // GET ALL
  getAllProposals: () => proposalApi.get("/api/proposals/"),

  // GET SINGLE
  getProposalById: (id) => proposalApi.get(`/api/proposals/${id}`),

  // UPDATE
  updateProposal: (id, data) => proposalApi.put(`/api/proposals/${id}`, data),

  // DELETE
  deleteProposal: (id) => proposalApi.delete(`/api/proposals/${id}`),

  // ===== ACCOUNT PROPOSALS (MAIN MODULE) =====

  // CREATE
  createAccountProposal: (data) =>
    proposalApi.post("/account/proposals/", data),

  // GET ALL
  getAllAccountProposals: () => proposalApi.get("/account/proposals/"),

  // GET SINGLE
  getAccountProposalById: (id) => proposalApi.get(`/account/proposals/${id}`),

  // UPDATE
  updateAccountProposal: (id, data) =>
    proposalApi.put(`/account/proposals/${id}`, data),

  // DELETE SINGLE
  deleteAccountProposal: (id) => proposalApi.delete(`/account/proposals/${id}`),

  // ===== FILTERS =====

  // GET PENDING
  getPendingAccountProposals: () =>
    proposalApi.get("/account/proposals/status/pending"),

  // GET BY ACCOUNT (MULTIPLE IDS SUPPORT)
  getAccountProposalsByAccountIds: (accountIds) =>
    proposalApi.get(`/account/proposals/byaccount/${accountIds.join(",")}`),

  getPendingAccountProposalsByAccountId: (accountId) =>
  proposalApi.get(`/account/proposals/byaccount/${accountId}/status/pending`),

  // ===== BULK =====

  // DELETE MULTIPLE
  deleteMultipleAccountProposals: (data) =>
    proposalApi.delete("/account/proposals/delete-multiple", {
      data, // { proposalIds: [] }
    }),

  // ===== ACTIONS =====

  // SIGN PROPOSAL
  signAccountProposal: (id, data) =>
    proposalApi.post(`/account/proposals/sign/${id}`, data),

  // AUTOMATION
  runProposalAutomation: (data) =>
    proposalApi.post(`/account/proposals/automation`, data),
};

// ================= ORGANIZER TEMPLATE APIs =================
export const organizerAPI = {
  // GET ALL
  getOrganizerTemplates: () =>
    organizerApi.get("/api/organizertemp/organizertemplate"),

  // GET SINGLE
  getOrganizerTemplateById: (id) =>
    organizerApi.get(`/api/organizertemp/organizertemplate/${id}`),

  // CREATE
  createOrganizerTemplate: (data) =>
    organizerApi.post("/api/organizertemp/organizertemplate", data),

  // UPDATE
  updateOrganizerTemplate: (id, data) =>
    organizerApi.patch(`/api/organizertemp/organizertemplate/${id}`, data),

  // DELETE
  deleteOrganizerTemplate: (id) =>
    organizerApi.delete(`/api/organizertemp/organizertemplate/${id}`),

  // CHECK NAME
  checkTemplateNameExists: (name) =>
    organizerApi.get(
      `/api/organizertemp/check-name?name=${encodeURIComponent(name)}`,
    ),
  // DUPLICATE ✅
  duplicateOrganizerTemplate: (id) =>
    organizerApi.post(`/api/organizertemp/organizertemplate/duplicate/${id}`),

  // ================= ACCOUNT-WISE ORGANIZER APIs =================

  // GET ALL
  getOrganizerAccountWises: () =>
    organizerApi.get("/api/orgaccwise/organizeraccountwise"),

  // GET SINGLE
  getOrganizerAccountWiseById: (id) =>
    organizerApi.get(`/api/orgaccwise/organizeraccountwise/${id}`),

  // CREATE
  createOrganizerAccountWise: (data) =>
    organizerApi.post("/api/orgaccwise/organizeraccountwise/org", data),

  // DELETE
  deleteOrganizerAccountWise: (id) =>
    organizerApi.delete(`/api/orgaccwise/organizeraccountwise/${id}`),

  // GET BY ACCOUNT ID
  getOrganizerByAccountId: (accountId) =>
    organizerApi.get(
      `/api/orgaccwise/organizeraccountwise/organizerbyaccount/${accountId}`,
    ),

  // GET ACTIVE BY ACCOUNT ID
  getActiveOrganizerByAccountId: (accountId, isActive) =>
    organizerApi.get(
      `/api/orgaccwise/organizeraccountwise/organizerbyaccount/${accountId}/${isActive}`,
    ),

  // UPDATE
  updateOrganizerAccountWise: (id, data) =>
    organizerApi.patch(`/api/orgaccwise/organizeraccountwise/${id}`, data),

  // ACTIVE / ARCHIVE
  updateOrganizerStatus: (id, data) =>
    organizerApi.patch(
      `/api/orgaccwise/organizeraccountwise/active-archive/${id}`,
      data,
    ),

  // COMPLETE & NOTIFY
  completeAndNotifyOrganizer: (id, data) =>
    organizerApi.patch(
      `/api/orgaccwise/organizeraccountwise/completeandnotify/${id}`,
      data,
    ),

  // UPDATE STATUS (SUBMITTED)
  updateOrganizerSubmissionStatus: (id, isSubmitted) =>
    organizerApi.patch(
      `/api/orgaccwise/organizeraccountwise/organizeraccountwisestatus/${id}/${isSubmitted}`,
    ),

  // GET PENDING
  getPendingOrganizersByAccountId: (accountId) =>
    organizerApi.get(`/api/orgaccwise/organizer/pending/${accountId}`),

  // UPDATE FORM ELEMENT ACTIVE STATUS
  updateFormElementActiveStatus: (
    organizerId,
    sectionId,
    formElementId,
    data,
  ) =>
    organizerApi.patch(
      `/api/orgaccwise/${organizerId}/sections/${sectionId}/form-elements/${formElementId}`,
      data,
    ),

  // AUTO SAVE
  autoSaveOrganizer: (id, data) =>
    organizerApi.patch(`/api/orgaccwise/autosave/${id}`, data),

  // RENAME
  renameOrganizerAccountWise: (id, data) =>
    organizerApi.patch(`/api/orgaccwise/rename/${id}`, data),
};

// ================= FOLDER MANAGEMENT APIs =================gfvF
export const folderManagementAPI = {
  // CREATE
  createFolderTemplate: (data) =>
    folderManagementApi.post("/tempfolder/foldertemp/folder-template", data),

  // GET ALL
  getFolderTemplates: () =>
    folderManagementApi.get("/tempfolder/foldertemp/templatelist"),

  // GET SINGLE
  getFolderTemplateById: (id) =>
    folderManagementApi.get(`/tempfolder/foldertemp/${id}`),

  // RENAME
  renameFolderTemplate: (id, data) =>
    folderManagementApi.patch(`/tempfolder/foldertemp/rename/${id}`, data),

  // DELETE
  deleteFolderTemplate: (id) =>
    folderManagementApi.delete(`/tempfolder/foldertemp/delete/${id}`),
};


// ================= ESIGN APIs =================

export const esignAPI = {
  // Generate DocuSeal token
  generateToken: (params) =>
    signatureApi.get("/api/generate-token", {
      params,
    }),

  // DocuSeal embedded token
  getDocusealToken: (templateId) =>
    signatureApi.get("/api/docuseal-token", {
      params: { templateId },
    }),

  // Get signed submission file
  getSubmissionFile: (submissionId) =>
    signatureApi.get("/api/get-submission-file", {
      params: { submissionId },
    }),

  // Get DocuSeal submissions
  getSubmissions: () =>
    signatureApi.get("/api/submissions"),

  // Notify admin
  notifyAdmin: (data) =>
    signatureApi.post("/notify-admin", data),

  // Get signature by ID
  getSignatureById: (id) =>
    signatureApi.get(`/signature/byid/${id}`),

  // Cancel signature request
  cancelSignature: (id, data) =>
    signatureApi.delete(`/signature/cancel/${id}`, {
      data,
    }),

  // Pending signatures by account
  getSignatureList: (accountId) =>
    signatureApi.get(`/signautrelist/${accountId}`),

  // Signature records by externalId
  getSignatureListByExternalId: (externalId) =>
    signatureApi.get(`/signautrelist/list/${externalId}`),

  // Check completion status
  checkCompletion: (externalId) =>
    signatureApi.get(
      `/signautrelist/check-completion/${externalId}`
    ),

  // Update signature status
  updateSignature: (externalId, data) =>
    signatureApi.patch(
      `/signautrelist/update/${externalId}`,
      data
    ),

  // Update submitter status
  updateSubmitterStatus: (externalId, data) =>
    signatureApi.patch(
      `/signautrelist/update-submitter/${externalId}`,
      data
    ),
};
// ================= DOC MANAGEMENT APIs =================
export const docAPI = {
  // ================= FOLDER =================

  // Create folder
  createFolder: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/folder", data),

  // Lock / Unlock folder
  setFolderReadOnly: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/folder/readonly", data),

  // Upload folder (multiple files structure)
  uploadFolderStructure: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/folder/upload", data),

  // Upload ZIP folder
  uploadFolderZip: (formData) =>
    folderManagementApi.post(
      "/tempfolder/docManagement/upload-folder",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    ),

  // ================= FILE =================

  // Upload single file
  uploadFile: (formData, folderPath) =>
    folderManagementApi.post(
      `/tempfolder/docManagement/file/upload?folderPath=${encodeURIComponent(folderPath)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    ),

  // Lock / Unlock file
  setFileReadOnly: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/file/readonly", data),

  // ================= COMMON =================

  // Delete file or folder
  deleteItem: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/delete", data),

  // Move file or folder
  moveItem: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/move", data),

  // Rename file or folder
  renameItem: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/rename", data),

  // Update metadata
  updateMeta: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/meta", data),

  // Update status
  updateStatus: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/updateStatus", data),

  // ================= LISTING =================

  // List folder content
  listFolderContent: (folderPath) =>
    folderManagementApi.get(
      `/tempfolder/docManagement/list?folderPath=${folderPath}`,
    ),

  // List full tree (folders + files)
  listFoldersAndFiles: (folderPath) =>
    folderManagementApi.get(
      `/tempfolder/docManagement/files/list?folderPath=${folderPath}`,
    ),

  // ================= TEMPLATE =================

  // Apply template to account
  applyTemplateToAccount: (data) =>
    folderManagementApi.post("/tempfolder/docManagement/apply-template", data),
};

export const accountDocsAPI = {
  // ================= FOLDER =================

  // Create folder
  createFolder: (data) =>
    folderManagementApi.post("/accounts/docs/folder", data),

  // Lock / Unlock folder
  setFolderReadOnly: (data) =>
    folderManagementApi.post("/accounts/docs/folder/readonly", data),

  // Upload folder structure (nested)
  uploadFolderStructure: (data) =>
    folderManagementApi.post("/accounts/docs/folder/upload", data),

  // Upload ZIP folder
  uploadFolderZip: (formData) =>
    folderManagementApi.post("/accounts/docs/upload-folder", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Upload ZIP & merge to account
  uploadAccountFolderZip: (formData) =>
    folderManagementApi.post("/accounts/docs/account-upload-folder", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Delete entire account folder
  deleteAccountFolder: (data) =>
    folderManagementApi.delete("/accounts/docs/delete-account-folder", {
      data,
    }),

  // ================= FILE =================

  // Upload single file
  uploadFile: (formData, folderPath) =>
    folderManagementApi.post(
      `/accounts/docs/file/upload?folderPath=${encodeURIComponent(folderPath)}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    ),
// View document (creates VIEW audit trail)
viewDocument: (data) =>
  folderManagementApi.post("/accounts/docs/view", data),
  // Lock / Unlock file
  setFileReadOnly: (data) =>
    folderManagementApi.post("/accounts/docs/file/readonly", data),

  // Remove "new" tag
  removeNewTag: (data) =>
    folderManagementApi.patch("/accounts/docs/remove-new-tag", data),

  // Approval toggle
  toggleApproval: (data) =>
    folderManagementApi.post("/accounts/docs/file/approval-toggle", data),

  // ================= COMMON =================

  // Delete file/folder
  deleteItem: (data) => folderManagementApi.post("/accounts/docs/delete", data),

  // Move to trash
  trashItem: (data) => folderManagementApi.patch("/accounts/docs/trash", data),

  bulkTrashItems: (data) =>
    folderManagementApi.post("/accounts/docs/bulktrash", data),

  // Restore item
  restoreItem: (data) =>
    folderManagementApi.patch("/accounts/docs/restore", data),

  // Move item
  moveItem: (data) => folderManagementApi.post("/accounts/docs/move", data),

  // Rename item
  renameItem: (data) => folderManagementApi.post("/accounts/docs/rename", data),

  // Update metadata
  updateMeta: (data) => folderManagementApi.post("/accounts/docs/meta", data),

  // Update status
  updateStatus: (data) =>
    folderManagementApi.post("/accounts/docs/updateStatus", data),

  // // Download
  // downloadItems: (data) =>
  //   folderManagementApi.post("/accounts/docs/download", data),
  // Download
  downloadItems: (data) =>
    folderManagementApi.post("/accounts/docs/download", data, {
      responseType: "blob", // ✅ THIS FIXES YOUR ERROR
    }),

  // ================= LISTING =================

  // List folder content
  listFolderContent: (folderPath) =>
    folderManagementApi.get(
      `/accounts/docs/list?folderPath=${encodeURIComponent(folderPath)}`,
    ),

  // List full tree
  listFoldersAndFiles: (folderPath) =>
    folderManagementApi.get(
      `/accounts/docs/files/list?folderPath=${encodeURIComponent(folderPath)}`,
    ),

  // Client view
  clientListFoldersAndFiles: (folderPath) =>
    folderManagementApi.get(
      `/accounts/docs/files/list/clientView?folderPath=${encodeURIComponent(
        folderPath,
      )}`,
    ),

  // Trashed items
  // listTrashedItems: () =>
  //   folderManagementApi.get("/accounts/docs/list-trashed"),
 listTrashedItems: (folderPath) =>
  folderManagementApi.get(
    `/accounts/docs/list-trashed?folderPath=${encodeURIComponent(folderPath)}`
  ),
  // ================= DOCUMENT STATES =================

  // New tagged docs
  // getNewTaggedDocs: () =>
  //   folderManagementApi.get("/accounts/docs/documents/new-tagged"),
  getNewTaggedDocs: (config) =>
  folderManagementApi.get(
    "/accounts/docs/documents/new-tagged",
    config
  ),

  // Pending approvals
  getPendingApprovals: () =>
    folderManagementApi.get("/accounts/docs/documents/pending-approvals"),

  // Pending signatures
  getPendingSignatures: () =>
    folderManagementApi.get("/accounts/docs/documents/pending-signature"),

  // ================= INVOICE =================

  // Lock / Unlock invoice
  lockUnlockInvoice: (data) =>
    folderManagementApi.post("/accounts/docs/invoice/lock-unlock", data),

  // ================= BULK =================

  bulkDeleteItems: (data) =>
    folderManagementApi.post("/accounts/docs/bulk-delete", data),

  bulkSetReadOnly: (data) =>
    folderManagementApi.post("/accounts/docs/bulk-lock", data),

  bulkMoveItems: (data) =>
    folderManagementApi.post("/accounts/docs/bulk-move", data),

  // ================= APPROVALS =================

  // Request approval
  requestApproval: (data) =>
    folderManagementApi.post("/approvals/request-approval", data),

  // Get approvals by client email
  getClientApprovals: (email) =>
    folderManagementApi.get(`/approvals/client-approvals/${email}`),

  // Get approval by ID
  getApprovalById: (id) =>
    folderManagementApi.get(`/approvals/approvals/${id}`),

  // Update approval status (approve/reject)
  updateApprovalStatus: (id, data) =>
    folderManagementApi.patch(`/approvals/client-approvals/${id}`, data),

  // Get approvals by accountId
  getApprovalsByAccount: (accountId) =>
    folderManagementApi.get(`/approvals/approvalList/byaccountid/${accountId}`),

  // Get pending approvals by accountId
  getPendingApprovalsByAccount: (accountId) =>
    folderManagementApi.get(`/approvals/approvalList/${accountId}/pending`),

  // Delete approval
  deleteApproval: (id) => folderManagementApi.delete(`/approvals/${id}`),

  // ================= DOCUMENT AUDIT TRAIL =================

  // Create audit log
  createAudit: (data) =>
    folderManagementApi.post("/audittrail", data),

  // Get all audit logs
  getAllAudits: () =>
    folderManagementApi.get("/audittrail"),

  // Get audit history of a document
  getDocumentAudit: (documentId) =>
    folderManagementApi.get(`/audittrail/document/${documentId}`),

  // Get account-wise audit history
  getAccountAudit: (accountId) =>
    folderManagementApi.get(`/audittrail/account/${accountId}`),

  // Delete audit log
  deleteAudit: (id) =>
    folderManagementApi.delete(`/audittrail/${id}`),
};

export const chatAPI = {
  // ================= CHAT =================

  getAllChats: () => chatApi.get("/chats/chatsaccountwise"),

  getChatById: (id) => chatApi.get(`/chats/chatsaccountwise/${id}`),

  getChatsByAccount: (accountId) =>
    chatApi.get(`/chats/chatsaccountwise/chatlistbyaccount/${accountId}`),

  getChatsByAccountAndStatus: (accountId, isactive,role) =>
    chatApi.get(
      `/chats/chatsaccountwise/isactivechat/${accountId}/${isactive}?role=${role}`,
    ),
  createChat: (data) => chatApi.post("/chats/chatsaccountwise", data),

  createChatAdmin: (data) =>
    chatApi.post("/chats/chatsaccountwise/admin", data),

  deleteChat: (id) => chatApi.delete(`/chats/chatsaccountwise/${id}`),

  updateChat: (id, data) =>
    chatApi.patch(`/chats/chatsaccountwise/${id}`, data),
  // ✅ NEW
  deleteChatForAdmin: (id) =>
    chatApi.put(`/chats/delete-chat-for-admin/${id}`),
  // ================= MESSAGES =================

  updateMessage: (data) =>
    chatApi.patch(
      `/chats/chatsaccountwise/chatmessage/bymessageid/update`,
      data,
    ),

  deleteMessage: (data) =>
    chatApi.delete(`/chats/chatsaccountwise/chatmessage/bymessageid/delete`, {
      data,
    }),

  sendMessageFromClient: (id, data) =>
    chatApi.patch(`/chats/chatsaccountwise/chatmessagefromclient/${id}`, data),

  updateChatDescription: (id, data) =>
    chatApi.patch(`/chats/chatsaccountwise/chatupdatemessage/${id}`, data),

  // ================= TASK =================

  addClientTask: (data) =>
    chatApi.post(`/chats/chatsaccountwise/addclienttask`, data),

  updateTaskCheckedStatus: (data) =>
    chatApi.post(`/chats/chatsaccountwise/updateTaskCheckedStatus`, data),

  // ================= UNREAD =================

  getUnreadChats: () => chatApi.get(`/chats/unreadmessages`),

  getUnreadByAccount: (accountId) => chatApi.get(`/chats/unread/${accountId}`),

  getUnreadMessages: (accountId, fromwhome) =>
    chatApi.get(`/chats/unread/${accountId}/${fromwhome}`),

  markMessageAsRead: (chatId, messageId) =>
    chatApi.patch(`/mark-as-read/${chatId}/${messageId}`),

  markAllAsRead: (chatId, accountId, fromwhome) =>
    chatApi.patch(
      `/chats/mark-all-read/${chatId}/accounts/${accountId}/${fromwhome}`,
    ),
// ================= THREAD READ/UNREAD =================

markThreadAsRead: (chatId) =>
  chatApi.put(`/chats/${chatId}/mark-read`),

markThreadAsUnread: (chatId) =>
  chatApi.put(`/chats/${chatId}/mark-unread`),
  // ================= STATUS =================

  updateChatStatus: (id, data) =>
    chatApi.post(`/chats/accountchat/updatestatus/${id}`, data),

  // For chatsend
  sendSecureChat: (data) => chatApi.post("/chats/securechatsend", data),

  // For chat message send
  sendSecureMessage: (data) =>
    chatApi.post("/chatsend/securemessagechatsend", data),



};

// ================= INVOICE APIs =================
export const invoiceAPI = {
  // ================= CREATE =================
  createInvoice: (data) =>
    invoiceApi.post("/account/invoicelist/invoice", data),
 // ================= OFFLINE PAYMENT =================
  offlinePayment: (data) =>
    invoiceApi.post(
      "/account/invoicelist/offline-payment",
      data
    ),
  payAdminInvoice: (data) =>
    invoiceApi.post(
      "/account/invoicelist/pay-admin-invoice",
      data
    ),

  // ================= GET =================
  getInvoices: () => invoiceApi.get("/account/invoicelist/invoice"),

  getInvoiceById: (id) => invoiceApi.get(`/account/invoicelist/invoice/${id}`),

  getInvoiceCount: () => invoiceApi.get("/account/invoicelist/invoicecount"),

  getInvoiceStatusCount: () =>
    invoiceApi.get("/account/invoicelist/invoicestatuscount"),

  getInvoiceSummary: () =>
    invoiceApi.get("/account/invoicelist/invoicesummary"),

  getInvoiceList: () =>
    invoiceApi.get("/account/invoicelist/invoice/invoicelist"),

  getInvoiceListById: (id) =>
    invoiceApi.get(
      `/account/invoicelist/invoice/invoicelist/invoicelistbyid/${id}`,
    ),

  getInvoiceListByAccountId: (id) =>
    invoiceApi.get(
      `/account/invoicelist/invoice/invoicelistby/accountid/${id}`,
    ),

  getPendingInvoicesByAccountId: (id) =>
    invoiceApi.get(
      `/account/invoicelist/invoice/pending/invoicelistby/accountid/${id}`,
    ),

  getInvoiceForPrint: (id) =>
    invoiceApi.get(`/account/invoicelist/invoice/invoiceforprint/${id}`),

  getNextInvoiceNumber: () =>
    invoiceApi.get("/account/invoicelist/next-invoice-number"),

  // ================= UPDATE =================
  updateInvoice: (id, data) =>
    invoiceApi.patch(`/account/invoicelist/invoice/${id}`, data),

  updateInvoiceStatus: (invoiceNumber, data) =>
    invoiceApi.patch(
      `/account/invoicelist/invoicestatus/${invoiceNumber}`,
      data,
    ),

  // ================= DELETE =================
  deleteInvoice: (id) =>
    invoiceApi.delete(`/account/invoicelist/invoice/${id}`),

  deleteInvoicesByAccountId: (id) =>
    invoiceApi.delete(`/account/invoicelist/invoices/by-account/${id}`),


// ================= OFFLINE PAYMENT APIs =================

// Create Offline Payment
createOfflinePayment: (data) =>
  invoiceApi.post("/account/offline-payments", data),

// Get All Offline Payments
getOfflinePayments: () =>
  invoiceApi.get("/account/offline-payments"),

// Get Offline Payment By ID
getOfflinePaymentById: (id) =>
  invoiceApi.get(`/account/offline-payments/${id}`),

// Get Offline Payments By Account ID
getOfflinePaymentsByAccountId: (accountId) =>
  invoiceApi.get(`/account/offline-payments/account/${accountId}`),

// Update Offline Payment
updateOfflinePayment: (id, data) =>
  invoiceApi.put(`/account/offline-payments/${id}`, data),

// Delete Offline Payment
deleteOfflinePayment: (id) =>
  invoiceApi.delete(`/account/offline-payments/${id}`),
};

// ================= JOB APIs =================
export const jobAPI = {
  // ================= BASIC =================

  // GET ALL JOBS
  getJobs: () => jobsApi.get("/workflow/jobs/jobs"),

  // GET JOB COUNT
  getJobsCount: () => jobsApi.get("/workflow/jobs/jobs/count"),

  // ACTIVE / INACTIVE COUNTS
  getActiveJobCount: () => jobsApi.get("/workflow/jobs/jobs/count/active"),
  getInactiveJobCount: () => jobsApi.get("/workflow/jobs/jobs/count/inactive"),

  // GET SINGLE JOB
  getJobById: (id) => jobsApi.get(`/workflow/jobs/jobs/${id}`),

  // CREATE JOB
  createJob: (data) => jobsApi.post("/workflow/jobs/jobs", data),

  // UPDATE JOB
  updateJob: (id, data) => jobsApi.patch(`/workflow/jobs/jobs/${id}`, data),

  // DELETE JOB
  deleteJob: (id) => jobsApi.delete(`/workflow/jobs/jobs/${id}`),

  // ================= LISTS =================

  // ACTIVE / INACTIVE LIST
  getActiveJobList: (isActive = true) =>
    jobsApi.get(`/workflow/jobs/jobs/list/status/${isActive}`),

  // BY USER
  getJobsByUser: (userId, isActive = true) =>
    jobsApi.get(`/workflow/jobs/jobs/list/user/${userId}/${isActive}`),

  // BY ACCOUNT IDS (GET - comma separated)
  getJobsByAccountIds: (accountId, isActive) =>
    jobsApi.get(`/workflow/jobs/jobs/list/account/${accountId}/${isActive}`),
  pipelineJoblist: (accountId, isActive) =>
    jobsApi.get(`/workflow/jobs/pipeline-jobs/${isActive}/${accountId}`),
  pipelineJobsByAccount: (accountId, isActive) =>
    jobsApi.get(
      `/workflow/jobs/pipeline-jobs/byaccount/${accountId}/${isActive}`,
    ),
  // POST FILTER (ACCOUNT IDS ARRAY)
  getJobsByAccountsPost: (data) =>
    jobsApi.post(`/workflow/jobs/jobs/list/account`, data),

  // ================= DETAIL =================

  // GET FULL JOB DETAIL
  getJobDetail: (id) => jobsApi.get(`/workflow/jobs/jobs/details/${id}`),

  // ================= ACCOUNT =================

  // GET JOBS BY ACCOUNT
  getJobsByAccount: (accountId, isActive) =>
    jobsApi.get(`/workflow/jobs/accounts/${accountId}/jobs/${isActive}`),

  // DELETE JOBS BY ACCOUNT
  deleteJobsByAccount: (accountId) =>
    jobsApi.delete(`/workflow/jobs/accounts/${accountId}/jobs`),

  // ================= PIPELINES =================

  // GET PIPELINES FROM JOB LIST
  getPipelinesFromJobs: (userId, isActive = true) =>
    jobsApi.get(`/workflow/jobs/jobs/pipelines/${userId}/${isActive}`),

  // ================= STAGE =================

  // UPDATE STAGE
  updateJobStage: (id, data) =>
    jobsApi.patch(`/workflow/jobs/jobs/${id}/stage`, data),

  // RUN STAGE AUTOMATION + MOVE
  runStageAutomation: (data) =>
    jobsApi.post(`/workflow/jobs/jobs/stage/automations`, data),

  // ================= BULK =================

  // CREATE BULK JOB
  createBulkJob: (data) => jobsApi.post(`/workflow/jobs/jobs/bulk`, data),
};

// ================= ACCOUNT TASKS APIs =================
export const accountTasksAPI = {
  // GET ALL TASKS
  getAllTasks: () => accountTasksApi.get("/accounts-tasks/"),

  // CREATE TASK
  createTask: (data) => accountTasksApi.post("/accounts-tasks/newtask", data),

  // TASK LIST (ACTIVE / INACTIVE)
  getTaskList: (isActive) =>
    accountTasksApi.get(`/accounts-tasks/tasklist/${isActive}`),

  // GET TASK BY ID
  getTaskById: (id) => accountTasksApi.get(`/accounts-tasks/taskbyid/${id}`),

  // DELETE TASK
  deleteTask: (id) =>
    accountTasksApi.delete(`/accounts-tasks/taskdelete/${id}`),

  // UPDATE TASK
  updateTask: (id, data) =>
    accountTasksApi.patch(`/accounts-tasks/updatatasks/${id}`, data),

  // GET TASK LIST BY ID
  getTaskListById: (id) =>
    accountTasksApi.get(`/accounts-tasks/task/listbyid/${id}`),

  // GET COMPLETED TASK LIST
  getCompleteTaskList: () =>
    accountTasksApi.get(`/accounts-tasks/tasks/tasklist/completed`),

  // TASKS BY ACCOUNT
  getTaskListByAccountId: (accountId) =>
    accountTasksApi.get(
      `/accounts-tasks/tasks/taskslist/byaccount/${accountId}`,
    ),

  // COMPLETED TASKS BY ACCOUNT
  getCompleteTaskListByAccount: (accountId) =>
    accountTasksApi.get(
      `/accounts-tasks/tasks/tasklist/byaccount/completed/${accountId}`,
    ),

  // BULK STATUS UPDATE
  bulkUpdateTaskStatus: (data) =>
    accountTasksApi.post(`/accounts-tasks/tasks/updatestatus`, data),
  // ✅ ALL PENDING TASKS
  getPendingTasks: () => accountTasksApi.get(`/accounts-tasks/pending`),

  // ✅ ALL COMPLETED TASKS
  getCompletedTasks: () => accountTasksApi.get(`/accounts-tasks/completed`),

  // ✅ PENDING TASKS BY ACCOUNT
  getPendingTasksByAccount: (accountId) =>
    accountTasksApi.get(`/accounts-tasks/pending/account/${accountId}`),

  // ✅ COMPLETED TASKS BY ACCOUNT
  getCompletedTasksByAccount: (accountId) =>
    accountTasksApi.get(`/accounts-tasks/completed/account/${accountId}`),
};
// ================= INTERNAL CHAT APIs =================

export const internalChatAPI = {
  // ================= CHAT =================

  // Send message (create chat or add message)
  sendMessage: (data) => internalChatApi.post("/api/internalchat/send", data),

  // Get all chats
  getAllChats: () => internalChatApi.get("/api/internalchat/"),

  // Get chat by ID
  getChatById: (chatId) => internalChatApi.get(`/api/internalchat/${chatId}`),

  // Get chat by participants
  getChatByParticipants: (params) =>
    internalChatApi.get("/api/internalchat/by-participants", { params }),

  // Get chats by user ID
  getChatsByUserId: (userId) =>
    internalChatApi.get(`/api/internalchat/user/${userId}`),

  // ================= MESSAGES =================

  // Add message to existing chat
  addMessageToChat: (chatId, data) =>
    internalChatApi.patch(`/api/internalchat/${chatId}/message`, data),

  // Mark single message as read
  markMessageAsRead: (chatId, messageId) =>
    internalChatApi.patch(`/api/internalchat/${chatId}/read/${messageId}`),

  // Mark all messages as read
  markAllMessagesAsRead: (chatId) =>
    internalChatApi.patch(`/api/internalchat/${chatId}/markAllRead`),

  // Delete specific message
  deleteMessage: (chatId, data) =>
    internalChatApi.delete(
      `/api/internalchat/${chatId}/message/bymessageid/delete`,
      { data },
    ),

  // ================= CHAT DELETE =================

  // Delete full chat
  deleteChat: (chatId) => internalChatApi.delete(`/api/internalchat/${chatId}`),

  // ================= (OPTIONAL BUT NEEDED) =================

  // ✅ UPDATE MESSAGE (you MUST add backend for this if not exists)
  updateMessage: (chatId, data) =>
    internalChatApi.patch(`/api/internalchat/${chatId}/message/update`, data),
};
export const emailSyncAPI = {
  // ================= EMAIL THREADS =================

  // Get all # notification threads
  getMessageNotifications: () =>
    emailSyncApi.get("/emailsync/messagesList/messagesnotification"),

  // Get threads by emails
  getMessagesByEmails: (emails) =>
    emailSyncApi.post("/emailsync/messagesList/messages", {
      emails,
    }),

  // ================= UNREAD =================

  // Get unread count for # subjects
  getUnreadCount: () =>
    emailSyncApi.get("/emailsync/messagesList/messages/unread-count"),

  // ================= THREAD ACTIONS =================

  // Mark thread as read
  markThreadAsRead: (threadId) =>
    emailSyncApi.patch("/emailsync/messagesList/threads/mark-read", {
      threadId,
    }),

  // Archive / Unarchive thread
  archiveThread: (threadId, archived = true) =>
    emailSyncApi.patch("/emailsync/messagesList/threads/archive", {
      threadId,
      archived,
    }),
};
// ================= ACCOUNT NOTE APIs =================
export const accountNoteAPI = {
  // Create Note
  createNote: (data) =>
    accNoteApi.post("/account/notes/", data),

  // Get All Notes
  getAllNotes: () =>
    accNoteApi.get("/account/notes/"),

  // Get Single Note
  getNoteById: (id) =>
    accNoteApi.get(`/account/notes/${id}`),

  // Update Note
  updateNote: (id, data) =>
    accNoteApi.patch(`/account/notes/${id}`, data),

  // Delete Note
  deleteNote: (id) =>
    accNoteApi.delete(`/account/notes/${id}`),

  // Get Notes By Account Id
  getNotesByAccountId: (accountId) =>
    accNoteApi.get(`/account/notes/account/${accountId}`),
};