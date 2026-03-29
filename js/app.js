const App = (() => {

  /* =============================
     STATE
  ============================= */
  let state = {
    assignments: []
  };

  /* CONFIG */
  window.SUBJECTS = ["DAA", "Elective", "CSA", "GBooks", "Ethics", "Entrep", "HCI", "Info", "PHED"];
  window.ASSIGNMENT_TYPES = ["Homework", "Lab Activity", "Essay", "PPT", "Quiz"];
  window.TEST_TYPES = ["MCQ", "Essay", "Identification", "Presentation", "Play"];
  window.DUE_DATES = ["Today", "Tomorrow", "This Week", "Next Week", "No Due Date"];



  // Temporary builder for step-by-step input
  let tempAssignment = {
    id: "",
    subject: "",
    assignmentType: "",
    testType: "",
    dueDate: ""
  };

  /* =============================
     INIT
  ============================= */
  function init() {
  const savedAssignments = Storage.loadAssignments();

  state = {
    assignments: savedAssignments || []
  };

  UI.renderDashboard(state);
}

  /* =============================
     GETTERS
  ============================= */
  function getCurrentData() {
    return state;
  }

  /* =============================
     FLOW HANDLERS 
  ============================= */

  function selectedSubject(subjectName) {
    // Save to temp
    tempAssignment.subject = subjectName;

    // Move to next screen
    UI.renderAssignmentTypePage();
  }

  function selectedAssignmentType(type) {
    tempAssignment.assignmentType = type;

    // TODO:
    // Move to Test Type page
    UI.renderTestTypePage();
  }

  function selectedTestType(testType) {
    tempAssignment.testType = testType;

    // TODO:
    // Move to Due Date page
    UI.renderDueDatePage();
  }

  function selectedDueDate(dueDate) {
    tempAssignment.dueDate = dueDate;

    // TODO:
    // Move to Publish screen
    UI.renderPublishToBoard();
  }

  function selectedButton(choice) {
    // choice = "Yes" or "No"

    if (choice === "Yes") {
      //new assignment object
      const newAssignment = {
        id: Date.now().toString(), // unique id
        subject: tempAssignment.subject,
        assignmentType: tempAssignment.assignmentType,
        testType: tempAssignment.testType,
        dueDate: tempAssignment.dueDate
      }
    
      //push to state
      state.assignments.push(newAssignment);
      Storage.saveAssignments(state.assignments);
      tempAssignment = {
        id: "",
        subject: "",
        assignmentType: "",
        testType: "",
        dueDate: ""
      }

      UI.showToast("Assignment added!");
    }

    // Return to dashboard
    UI.renderDashboard(state);
  }

  /* =============================
     ACTIONS
  ============================= */

  function markAsDone(id) {
    state.assignments = state.assignments.filter((a) => String(a.id) !== String(id));

    Storage.saveAssignments(state.assignments);
    UI.renderDashboard(state);
  }

  function deleteAssignment(id) {
    // TODO:
    // Remove assignment from state

    UI.renderDashboard(state);
  }

  /* =============================
     STORAGE
  ============================= */

  function saveToLocalStorage() {
    localStorage.setItem("assignments", JSON.stringify(state.assignments))
  }

  function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("assignments"));
    if (data) state.assignments = data;
  }

  /* =============================
     PUBLIC API
  ============================= */
  return {
    init,
    getCurrentData,
    selectedSubject,
    selectedAssignmentType,
    selectedTestType,
    selectedDueDate,
    selectedButton,
    markAsDone,
    deleteAssignment
  };

})();

/* =============================
    Start App
============================== */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
})