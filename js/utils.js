export const STATUS_LABELS = {
  applied: "Applied",
  assessment: "Assessment",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected"
};

export function formatDate(value, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN", options);
}

export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export function isFollowUpDue(application) {
  if (!application.followup || ["offer", "rejected"].includes(application.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followup = new Date(`${application.followup}T00:00:00`);
  return followup <= today;
}
