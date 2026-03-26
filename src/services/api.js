import axios from "axios";

// ================= BASE URLs =================
const AUTH_USER_URL =
  process.env.REACT_APP_AUTH_USER ;

const SIDEBAR_URL = process.env.REACT_APP_SIDEBAR ;

const TEMPLATE_URL = process.env.REACT_APP_TEMPLATE ;

const ACCOUNT_CONTACT_URL =
  process.env.REACT_APP_ACCOUNT_CONTACT ;

  const PROPOSAL_URL = process.env.REACT_APP_PROPOSAL;


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

// ================= AUTH + USER APIs =================
export const authAPI = {
  // OTP
  sendOTP: (email) => authUserApi.post("/api/auth/send-otp", { email }),
  verifyOTP: (email, otp) =>
    authUserApi.post("/auth/verify-otp", { email, otp }),
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
  authUserApi.put(`/api/notifications/${notificationDocId}/${notificationId}`, data),
  // Delete a notification
  deleteNotification: (id) =>
    authUserApi.delete(`/api/notifications/${id}`),
};

// ================= SIDEBAR APIs =================
export const sidebarAPI = {
  getSidebar: () => sidebarApi.get("/api/sidebar/"),
};

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

  getAccountNamesByStatus: () =>
    accountcontactApi.get("/api/accounts/accountlist/names-by-status"),

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
  createProposal: (data) =>
    proposalApi.post("/api/proposals/", data),

  // GET ALL
  getAllProposals: () =>
    proposalApi.get("/api/proposals/"),

  // GET SINGLE
  getProposalById: (id) =>
    proposalApi.get(`/api/proposals/${id}`),

  // UPDATE
  updateProposal: (id, data) =>
    proposalApi.put(`/api/proposals/${id}`, data),

  // DELETE
  deleteProposal: (id) =>
    proposalApi.delete(`/api/proposals/${id}`),
};

