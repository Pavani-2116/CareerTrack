import { formatDate, escapeHTML, STATUS_LABELS } from "./utils.js";

const tones = ["", "tone-1", "tone-2", "tone-3", "tone-4"];

export function renderApplications(applications, { search, status, sortOrder }, handlers) {
  const tbody = document.querySelector("#applications-list");
  const empty = document.querySelector("#empty-state");
  const query = search.trim().toLowerCase();

  const visible = applications
    .filter(app => status === "all" || app.status === status)
    .filter(app => !query || `${app.company} ${app.position}`.toLowerCase().includes(query))
    .sort((a, b) => sortOrder === "newest"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date));

  tbody.innerHTML = visible.map((app, index) => {
    const company = escapeHTML(app.company);
    const position = escapeHTML(app.position);
    const initials = escapeHTML(app.company.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase());
    const label = STATUS_LABELS[app.status] || "Applied";
    return `<tr>
      <td><div class="company-cell"><span class="company-avatar ${tones[index % tones.length]}">${initials}</span><div><div class="company-name" title="${company}">${company}</div><div class="job-title" title="${position}">${position}</div></div></div></td>
      <td>${formatDate(app.date)}</td>
      <td><span class="status-badge status-${escapeHTML(app.status)}">${label}</span></td>
      <td><div class="row-actions">
        <button class="icon-button" type="button" data-action="edit" data-id="${app.id}" aria-label="Edit ${company}" title="Edit">✎</button>
        <button class="icon-button" type="button" data-action="delete" data-id="${app.id}" aria-label="Delete ${company}" title="Delete">×</button>
        ${app.jobUrl ? `<a class="icon-button" href="${escapeHTML(app.jobUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open job posting" title="Open job posting">↗</a>` : ""}
      </div></td>
    </tr>`;
  }).join("");

  empty.classList.toggle("visible", visible.length === 0);
  document.querySelector(".applications-table").style.display = visible.length ? "table" : "none";
  document.querySelector("#results-count").textContent = `Showing ${visible.length} of ${applications.length} application${applications.length === 1 ? "" : "s"}`;

  tbody.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const app = applications.find(item => item.id === button.dataset.id);
      if (!app) return;
      if (button.dataset.action === "edit") handlers.onEdit(app);
      if (button.dataset.action === "delete") handlers.onDelete(app);
    });
  });
}
