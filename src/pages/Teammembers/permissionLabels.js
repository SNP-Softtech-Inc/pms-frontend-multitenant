// src/pages/Teammembers/permissionLabels.js
//
// Readable names for team member permissions (v1.86.0). The Access Rights
// list printed the stored keys - "managePayments", "viewallAccounts" - as
// they are. The keys stay exactly as stored; only what is shown changes.

// Keys whose spelling would not read well split mechanically.
const NAMES = {
  viewallAccounts: "View All Accounts",
  manageRatesinTimeEntries: "Manage Rates in Time Entries",
  manageMarketPlace: "Manage Marketplace",
  assignTeamMates: "Assign Teammates",
  manageTeamMates: "Manage Teammates",
  editOrganizersAnswers: "Edit Organizer Answers",
  managefirmBalance: "Manage Firm Balance",
  managesites: "Manage Sites",
};

/** "managePublicFilterTemplates" → "Manage Public Filter Templates". */
export const permissionLabel = (key) => {
  if (!key) return "";
  if (NAMES[key]) return NAMES[key];

  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // manageIRS → manage IRS
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // IRSTranscripts → IRS Transcripts
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};
