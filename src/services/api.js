import axios from "axios";

// ================= BASE URLs =================
const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;
const SIDEBAR_URL = process.env.REACT_APP_SIDEBAR;
const TEMPLATE_URL = process.env.REACT_APP_TEMPLATE;
const ACCOUNT_CONTACT_URL = process.env.REACT_APP_ACCOUNT_CONTACT;
const PROPOSAL_URL = process.env.REACT_APP_PROPOSAL;
const ORGANIZER_URL = process.env.REACT_APP_ORGANIZER;
const FOLDER_MANAGEMENT_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;
const CHAT_URL = process.env.REACT_APP_CHAT; // add in .env

// ================= AXIOS INSTANCES =================
const authUserApi = axios.create({
  baseURL: AUTH_USER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const sidebarApi = axios.create({
  baseURL: SIDEBAR_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const templateApi = axios.create({
  baseURL: TEMPLATE_URL, // include /temp here
  headers: {
    "Content-Type": "application/json",
  },
});

const accountcontactApi = axios.create({
  baseURL: ACCOUNT_CONTACT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const proposalApi = axios.create({
  baseURL: PROPOSAL_URL, // e.g. http://localhost:8023/api/proposals
  headers: {
    "Content-Type": "application/json",
  },
});
const organizerApi = axios.create({
  baseURL: ORGANIZER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const folderManagementApi = axios.create({
  baseURL: FOLDER_MANAGEMENT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const chatApi = axios.create({
  baseURL: CHAT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= COMMON INTERCEPTORS =================
const attachInterceptors = (api) => {
  // REQUEST INTERCEPTOR (Attach Token)
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // RESPONSE INTERCEPTOR (Handle 401)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;

        const message = error.response?.data?.message || "";

        if (
          message.includes("token") ||
          message.includes("expired") ||
          message.includes("unauthorized")
        ) {
          // Clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("usersdatatoken");
          localStorage.removeItem("user");
          localStorage.removeItem("roleData");
          localStorage.removeItem("rememberMe");

          // Redirect to login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    },
  );
};
// Interceptor to auto attach tenantId or auth token
templateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // JWT stored in localStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Apply interceptors
attachInterceptors(authUserApi);
attachInterceptors(sidebarApi);
attachInterceptors(accountcontactApi);
attachInterceptors(proposalApi);
attachInterceptors(organizerApi);
attachInterceptors(folderManagementApi);
attachInterceptors(chatApi);
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

  // Login
  login: (email, password, expiryTime) =>
    authUserApi.post("/api/auth/login", { email, password, expiryTime }),

  getUsersByEmail: (email) =>
    authUserApi.post("/api/auth/get-users", { email }),
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
  // Logout
  logout: () => authUserApi.post("/api/auth/logout"),

  forgotPassword: (data) => authUserApi.post("/api/auth/forgot-password", data),

  resetPassword: (id, token, data) =>
    authUserApi.post(`/api/auth/reset-password/${id}/${token}`, data),

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
  // updateNotification: (id, data) =>
  //   authUserApi.put(`/api/notifications/${id}`, data),
  // New: use notification _id
  updateNotification: (notificationDocId, notificationId, data) =>
    authUserApi.put(
      `/api/notifications/${notificationDocId}/${notificationId}`,
      data,
    ),
  // Delete a notification
  deleteNotification: (id) => authUserApi.delete(`/api/notifications/${id}`),
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
  createAccount: (data) => accountcontactApi.post("/api/accounts/", data),

  createAccountFromCSV: (data) =>
    accountcontactApi.post("/api/accounts/csv-import", data),

  // ================= UPDATE =================
  updateAccount: (id, data) =>
    accountcontactApi.put(`/api/accounts/${id}`, data),

  updateAccountTags: (id, data) =>
    accountcontactApi.patch(
      `/api/accounts/accountdetails/updateaccounttags/${id}`,
      data,
    ),

  updateAccountActiveStatus: (data) =>
    accountcontactApi.patch(`/api/accounts/update-active`, data),

  // ================= GET =================
  getAccounts: () => accountcontactApi.get("/api/accounts/"),

  // getAccountsList: () =>
  //   accountcontactApi.get("/accounts/list"),
  getAccountsList: (active = true) =>
    accountcontactApi.get(`/api/accounts/list?active=${active}`),

  getAccountById: (id) => accountcontactApi.get(`/api/accounts/${id}`),

  getMultipleAccountsByIds: (data) =>
    accountcontactApi.post("/api/accounts/multiple", data),

  getAccountsByTeamMember: () => accountcontactApi.get("/api/accounts/byTeam"),

  getAccountNames: () =>
    accountcontactApi.get("/api/accounts/accountlist/names"),

  // getAccountNamesByStatus: () =>
  //   accountcontactApi.get("/api/accounts/accountlist/names-by-status"),
getAccountNamesByStatus: (active = true) =>
  accountcontactApi.get(
    `/api/accounts/accountlist/names-by-status?active=${active}`
  ),
  getAccountNamesWithEmails: () =>
    accountcontactApi.get("/api/accounts/accounts-by-status-with-emails"),

  getAccountContactEmails: (id) =>
    accountcontactApi.get(`/api/accounts/contacts-emails/${id}`),

  getAccountsWithImportedAndIncompleteTags: () =>
    accountcontactApi.get("/api/accounts/imported-incomplete"),

  // ================= DELETE =================
  deleteMultipleAccounts: (data) =>
    accountcontactApi.delete("/api/accounts/accounts/deleteMultipleAccounts", {
      data,
    }),

  // ================= PROFILE =================
  uploadProfilePicture: (id, data) =>
    accountcontactApi.patch(`/api/accounts/${id}/profile-picture`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // ================= CONTACTS =================
  getAccountContacts: (accountId) =>
    accountcontactApi.get(`/api/accounts/${accountId}/contacts`),

  addContactsToAccount: (accountId, data) =>
    accountcontactApi.post(`/api/accounts/${accountId}/contacts`, data),

  removeContactFromAccount: (accountId, contactId) =>
    accountcontactApi.delete(`/api/accounts/${accountId}/contact/${contactId}`),

  toggleContactLogin: (accountId, contactId, data) =>
    accountcontactApi.patch(
      `/api/accounts/${accountId}/contact/${contactId}`,
      data,
    ),

  // ================= BULK TAGS =================
  assignBulkTags: (data) =>
    accountcontactApi.post(
      "/api/accounts/assignbulktags/tomultipleaccount",
      data,
    ),

  removeBulkTags: (data) =>
    accountcontactApi.post("/api/accounts/assignbulktags/removetags", data),

  // ================= TEAM MEMBERS =================
  assignTeamMembers: (data) =>
    accountcontactApi.post(
      "/api/accounts/manageteammember/teamMembertomultipleaccount",
      data,
    ),

  removeTeamMembers: (data) =>
    accountcontactApi.post(
      "/api/accounts/manageteammember/removeteammember",
      data,
    ),

  // ================= EMAIL =================
  sendBulkEmails: (data) =>
    accountcontactApi.post("/api/accounts/sendBulkEmails", data),

  sendComposeEmail: (data) =>
    accountcontactApi.post("/api/accounts/sendComposeEmail", data),
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
  getContacts: () => accountcontactApi.get("/api/contacts"),

  getContactById: (id) => accountcontactApi.get(`/api/contacts/contact/${id}`),

  getContactNames: () => accountcontactApi.get("/api/contacts/contact-names"),

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

  resendActivationEmail: (contactId) =>
    accountcontactApi.post(`/api/contacts/${contactId}/resend-activation`),
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
  getAllAccountProposals: () =>
    proposalApi.get("/account/proposals/"),

  // GET SINGLE
  getAccountProposalById: (id) =>
    proposalApi.get(`/account/proposals/${id}`),

  // UPDATE
  updateAccountProposal: (id, data) =>
    proposalApi.put(`/account/proposals/${id}`, data),

  // DELETE SINGLE
  deleteAccountProposal: (id) =>
    proposalApi.delete(`/account/proposals/${id}`),

  // ===== FILTERS =====

  // GET PENDING
  getPendingAccountProposals: () =>
    proposalApi.get("/account/proposals/status/pending"),

  // GET BY ACCOUNT (MULTIPLE IDS SUPPORT)
  getAccountProposalsByAccountIds: (accountIds) =>
    proposalApi.get(
      `/account/proposals/byaccount/${accountIds.join(",")}`
    ),

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
};

// ================= FOLDER MANAGEMENT APIs =================
export const folderManagementAPI = {
  // CREATE
  createFolderTemplate: (data) =>
    folderManagementApi.post("/temp/foldertemp/folder-template", data),

  // GET ALL
  getFolderTemplates: () => folderManagementApi.get("/temp/foldertemp/templatelist"),

  // GET SINGLE
  getFolderTemplateById: (id) =>
    folderManagementApi.get(`/temp/foldertemp/${id}`),

  // RENAME
  renameFolderTemplate: (id, data) =>
    folderManagementApi.patch(`/temp/foldertemp/rename/${id}`, data),

  // DELETE
  deleteFolderTemplate: (id) =>
    folderManagementApi.delete(`/temp/foldertemp/delete/${id}`),
};

// ================= DOC MANAGEMENT APIs =================
export const docAPI = {
  // ================= FOLDER =================

  // Create folder
  createFolder: (data) => folderManagementApi.post("/temp/docManagement/folder", data),

  // Lock / Unlock folder
  setFolderReadOnly: (data) =>
    folderManagementApi.post("/temp/docManagement/folder/readonly", data),

  // Upload folder (multiple files structure)
  uploadFolderStructure: (data) =>
    folderManagementApi.post("/temp/docManagement/folder/upload", data),

  // Upload ZIP folder
  uploadFolderZip: (formData) =>
    folderManagementApi.post("/temp/docManagement/upload-folder", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // ================= FILE =================

  // Upload single file
uploadFile: (formData, folderPath) =>
  folderManagementApi.post(
    `/temp/docManagement/file/upload?folderPath=${encodeURIComponent(folderPath)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  ),

  // Lock / Unlock file
  setFileReadOnly: (data) =>
    folderManagementApi.post("/temp/docManagement/file/readonly", data),

  // ================= COMMON =================

  // Delete file or folder
  deleteItem: (data) => folderManagementApi.post("/temp/docManagement/delete", data),

  // Move file or folder
  moveItem: (data) => folderManagementApi.post("/temp/docManagement/move", data),

  // Rename file or folder
  renameItem: (data) => folderManagementApi.post("/temp/docManagement/rename", data),

  // Update metadata
  updateMeta: (data) => folderManagementApi.post("/temp/docManagement/meta", data),

  // Update status
  updateStatus: (data) =>
    folderManagementApi.post("/temp/docManagement/updateStatus", data),

  // ================= LISTING =================

  // List folder content
  listFolderContent: (folderPath) =>
    folderManagementApi.get(`/temp/docManagement/list?folderPath=${folderPath}`),

  // List full tree (folders + files)
  listFoldersAndFiles: (folderPath) =>
    folderManagementApi.get(`/temp/docManagement/files/list?folderPath=${folderPath}`),

  // ================= TEMPLATE =================

  // Apply template to account
  applyTemplateToAccount: (data) =>
    folderManagementApi.post("/temp/docManagement/apply-template", data),
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
      }
    ),

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
  deleteItem: (data) =>
    folderManagementApi.post("/accounts/docs/delete", data),

  // Move to trash
  trashItem: (data) =>
    folderManagementApi.patch("/accounts/docs/trash", data),

  bulkTrashItems: (data) =>
    folderManagementApi.post("/accounts/docs/bulktrash", data),

  // Restore item
  restoreItem: (data) =>
    folderManagementApi.patch("/accounts/docs/restore", data),

  // Move item
  moveItem: (data) =>
    folderManagementApi.post("/accounts/docs/move", data),

  // Rename item
  renameItem: (data) =>
    folderManagementApi.post("/accounts/docs/rename", data),

  // Update metadata
  updateMeta: (data) =>
    folderManagementApi.post("/accounts/docs/meta", data),

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
      `/accounts/docs/list?folderPath=${encodeURIComponent(folderPath)}`
    ),

  // List full tree
  listFoldersAndFiles: (folderPath) =>
    folderManagementApi.get(
      `/accounts/docs/files/list?folderPath=${encodeURIComponent(folderPath)}`
    ),

  // Client view
  clientListFoldersAndFiles: (folderPath) =>
    folderManagementApi.get(
      `/accounts/docs/files/list/clientView?folderPath=${encodeURIComponent(
        folderPath
      )}`
    ),

  // Trashed items
  listTrashedItems: () =>
    folderManagementApi.get("/accounts/docs/list-trashed"),

  // ================= DOCUMENT STATES =================

  // New tagged docs
  getNewTaggedDocs: () =>
    folderManagementApi.get("/accounts/docs/documents/new-tagged"),

  // Pending approvals
  getPendingApprovals: () =>
    folderManagementApi.get(
      "/accounts/docs/documents/pending-approvals"
    ),

  // Pending signatures
  getPendingSignatures: () =>
    folderManagementApi.get(
      "/accounts/docs/documents/pending-signature"
    ),

  // ================= INVOICE =================

  // Lock / Unlock invoice
  lockUnlockInvoice: (data) =>
    folderManagementApi.post(
      "/accounts/docs/invoice/lock-unlock",
      data
    ),

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
deleteApproval: (id) =>
  folderManagementApi.delete(`/approvals/${id}`),
};


export const chatAPI = {
  // ================= CHAT =================

  getAllChats: () => chatApi.get("/chats/chatsaccountwise"),

  getChatById: (id) => chatApi.get(`/chats/chatsaccountwise/${id}`),

  getChatsByAccount: (accountId) =>
    chatApi.get(`/chats/chatsaccountwise/chatlistbyaccount/${accountId}`),

  getChatsByAccountAndStatus: (accountId, isactive) =>
  chatApi.get(
    `/chats/chatsaccountwise/isactivechat/${accountId}/${isactive}`
  ),
  createChat: (data) => chatApi.post("/chats/chatsaccountwise", data),

  createChatAdmin: (data) =>
    chatApi.post("/chats/chatsaccountwise/admin", data),

  deleteChat: (id) => chatApi.delete(`/chats/chatsaccountwise/${id}`),

  updateChat: (id, data) =>
    chatApi.patch(`/chats/chatsaccountwise/${id}`, data),

  // ================= MESSAGES =================

  updateMessage: (data) =>
    chatApi.patch(`/chats/chatsaccountwise/chatmessage/bymessageid/update`, data),

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
    chatApi.post(`/chatsaccountwise/updateTaskCheckedStatus`, data),

  // ================= UNREAD =================

  getUnreadChats: () => chatApi.get(`/chats/unreadmessages`),

  getUnreadByAccount: (accountId) =>
    chatApi.get(`/chats/unread/${accountId}`),

  getUnreadMessages: (accountId, fromwhome) =>
    chatApi.get(`/chats/unread/${accountId}/${fromwhome}`),

  markMessageAsRead: (chatId, messageId) =>
    chatApi.patch(`/mark-as-read/${chatId}/${messageId}`),

  markAllAsRead: (chatId, accountId, fromwhome) =>
    chatApi.patch(
      `/chats/mark-all-read/${chatId}/accounts/${accountId}/${fromwhome}`
    ),

  // ================= STATUS =================

  updateChatStatus: (id, data) =>
    chatApi.post(`/chats/accountchat/updatestatus/${id}`, data),

 // For chatsend
  sendSecureChat: (data) =>
    chatApi.post("/chats/securechatsend", data),

  // For chat message send
  sendSecureMessage: (data) =>
    chatApi.post("/chats/securemessagechatsend", data),

};
