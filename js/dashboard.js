import { isFollowUpDue } from "./utils.js";

export function updateDashboard(applications) {
  const count = status => applications.filter(app => app.status === status).length;
  document.querySelector("#total-applications").textContent = applications.length;
  document.querySelector("#interview-applications").textContent = count("interview");
  document.querySelector("#offer-applications").textContent = count("offer");
  document.querySelector("#rejected-applications").textContent = count("rejected");
  document.querySelector("#followup-applications").textContent = applications.filter(isFollowUpDue).length;

  const active = applications.filter(app => !["rejected"].includes(app.status)).length;
  const progressed = count("assessment") + count("interview") + count("offer");
  const progress = applications.length ? Math.round(progressed / applications.length * 100) : 0;
  document.querySelector("#progress-bar").style.width = `${progress}%`;
  document.querySelector("#progress-percentage").textContent = `${progress}%`;
  document.querySelector("#response-rate").textContent = applications.length
    ? `${Math.round((count("assessment") + count("interview") + count("offer")) / applications.length * 100)}%`
    : "0%";
}
