import { loadApplications, saveApplications, loadChecklist, saveChecklist } from "./storage.js";
import { renderApplications } from "./applications.js";
import { updateDashboard } from "./dashboard.js";
import { showToast, notifyDueFollowUps } from "./notifications.js";

export function initializeApp() {
  let applications = loadApplications();
  let editingId = null;
  let sortOrder = "newest";

  const dialog = document.querySelector("#application-dialog");
  const form = document.querySelector("#application-form");
  const formTitle = document.querySelector("#form-title");
  const saveButton = document.querySelector("#save-button");
  const error = document.querySelector("#form-error");
  const dateInput = document.querySelector("#date");
  const searchInput = document.querySelector("#search-input");
  const statusFilter = document.querySelector("#filter-status");

  document.querySelector("#current-year").textContent = new Date().getFullYear();
  document.querySelector("#today-label").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).toUpperCase();

  function refresh() {
    renderApplications(applications, {
      search: searchInput.value,
      status: statusFilter.value,
      sortOrder
    }, { onEdit: openEdit, onDelete: deleteApplication });
    updateDashboard(applications);
  }

  function openAdd() {
    editingId = null;
    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
    formTitle.textContent = "Add application";
    saveButton.textContent = "Save application";
    error.textContent = "";
    dialog.showModal();
    document.querySelector("#company").focus();
  }

  function openEdit(app) {
    editingId = app.id;
    form.elements.company.value = app.company;
    form.elements.position.value = app.position;
    form.elements.date.value = app.date;
    form.elements.status.value = app.status;
    form.elements.jobUrl.value = app.jobUrl || "";
    form.elements.followup.value = app.followup || "";
    form.elements.notes.value = app.notes || "";
    formTitle.textContent = "Edit application";
    saveButton.textContent = "Update application";
    error.textContent = "";
    dialog.showModal();
  }

  function deleteApplication(app) {
    if (!window.confirm(`Delete the ${app.position} application at ${app.company}?`)) return;
    applications = applications.filter(item => item.id !== app.id);
    saveApplications(applications);
    refresh();
    showToast("Application deleted.");
  }

  ["#top-add-button", "#panel-add-button", "#empty-add-button"].forEach(selector => {
    document.querySelector(selector).addEventListener("click", openAdd);
  });
  ["#close-dialog", "#cancel-dialog"].forEach(selector => {
    document.querySelector(selector).addEventListener("click", () => dialog.close());
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    error.textContent = "";
    const company = form.elements.company.value.trim();
    const position = form.elements.position.value.trim();
    const jobUrl = form.elements.jobUrl.value.trim();
    if (!company || !position) {
      error.textContent = "Please enter both the company name and job title.";
      return;
    }
    if (jobUrl) {
      try {
        const url = new URL(jobUrl);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
      } catch {
        error.textContent = "Please enter a valid job posting URL beginning with https://";
        return;
      }
    }

    const now = new Date().toISOString();
    const existing = applications.find(app => app.id === editingId);
    const record = {
      id: editingId || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      company, position,
      date: form.elements.date.value,
      status: form.elements.status.value,
      jobUrl,
      followup: form.elements.followup.value,
      notes: form.elements.notes.value.trim(),
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };

    if (editingId) {
      applications = applications.map(app => app.id === editingId ? record : app);
    } else {
      applications.unshift(record);
    }
    if (!saveApplications(applications)) {
      error.textContent = "Could not save data. Your browser storage may be full or disabled.";
      return;
    }
    dialog.close();
    form.reset();
    refresh();
    showToast(editingId ? "Application updated successfully." : "Application added successfully.");
    editingId = null;
  });

  searchInput.addEventListener("input", refresh);
  statusFilter.addEventListener("change", refresh);
  document.querySelector("#sort-button").addEventListener("click", () => {
    sortOrder = sortOrder === "newest" ? "oldest" : "newest";
    document.querySelector("#sort-button").textContent = sortOrder === "newest" ? "↕ Date" : "↑ Oldest";
    refresh();
  });

  const checklist = loadChecklist();
  const checkboxes = [...document.querySelectorAll("[data-check]")];
  function updateChecklist() {
    const completed = checkboxes.filter(box => box.checked).length;
    document.querySelector("#checklist-progress").textContent = `${completed} of ${checkboxes.length} completed`;
    saveChecklist(Object.fromEntries(checkboxes.map(box => [box.dataset.check, box.checked])));
  }
  checkboxes.forEach(box => {
    box.checked = Boolean(checklist[box.dataset.check]);
    box.addEventListener("change", updateChecklist);
  });
  updateChecklist();

  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  }));

  refresh();
  notifyDueFollowUps(applications);
}
