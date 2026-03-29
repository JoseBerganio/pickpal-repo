const Storage = (() => {

  const STORAGE_KEY = "assignments_tracker_data";
  const DRAFT_KEY = "assignments_tracker_draft";

  /* =============================
     ASSIGNMENTS STORAGE
  ============================= */

  function saveAssignments(assignments) {
    // Convert assignments array into JSON string
    const data = JSON.stringify(assignments);

    // Save it to localStorage using STORAGE_KEY
    localStorage.setItem(STORAGE_KEY, data);
  }

  function loadAssignments() {
  // Get data from localStorage

    const data = localStorage.getItem(STORAGE_KEY);

    // If nothing saved yet
    if (!data) {
      return [];
    }
    // Convert JSON string back to JS object

    return JSON.parse(data);
  }

  /* =============================
     DRAFT (tempAssignment) STORAGE
  ============================= */

  function saveDraft(draft) {
    // Save tempAssignment so user doesn't lose progress
    const data = JSON.stringify(draft);
    localStorage.setItem(DRAFT_KEY, data);
  }

  function loadDraft() {
    const data = localStorage.getItem(DRAFT_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  function clearDraft() {
    // Remove draft from storage
    localStorage.removeItem(DRAFT_KEY);
  }

  /* =============================
     UTILITIES
  ============================= */

  function clearAll() {
    // Use only for debugging
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DRAFT_KEY);
  }

  /* =============================
     PUBLIC API
  ============================= */

  return {
    saveAssignments,
    loadAssignments,

    saveDraft,
    loadDraft,
    clearDraft,

    clearAll
  };

})();