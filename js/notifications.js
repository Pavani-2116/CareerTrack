import { isFollowUpDue } from "./utils.js";

export function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

export function notifyDueFollowUps(applications) {
  const due = applications.filter(isFollowUpDue);
  if (due.length) {
    const message = due.length === 1
      ? `Follow-up due: ${due[0].company} — ${due[0].position}`
      : `${due.length} job follow-ups are due today or overdue.`;
    showToast(message);
  }
}
