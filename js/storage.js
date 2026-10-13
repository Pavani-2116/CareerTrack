const APPLICATIONS_KEY = "careertrack.applications.v1";
const CHECKLIST_KEY = "careertrack.checklist.v1";

export function loadApplications() {
  try {
    const value = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn("Could not read saved applications:", error);
    return [];
  }
}

export function saveApplications(applications) {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error("Could not save applications:", error);
    return false;
  }
}

export function loadChecklist() {
  try {
    const value = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function saveChecklist(checklist) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
}
