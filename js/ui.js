const UI = (() => {
  const appContainer = document.getElementById("app");

  /* =============================
     HELPERS
  ============================= */
  function splitIntoColumns(arr, size = 3) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  function safeListener(selector, handler) {
    const el = document.querySelector(selector);
    if (!el) return;

    const newEl = el.cloneNode(true);
    el.replaceWith(newEl);
    newEl.addEventListener("click", handler);
  }

  /* =============================
     DASHBOARD (MAIN VIEW)
  ============================= */
  function renderDashboard(data) {
    appContainer.innerHTML = `
      <header><h2>PickPal by Flexiwoo</h2></header>
      <div class="list-container">
        <div class="assignment-list-homepage">
          <h2>Assignments</h2>
          <a class="add-assignment" href="#">Add Assignment</a>

          <div class="card-container">
            ${
              data.assignments.length === 0
                ? `<p>No assignments yet</p>`
                : data.assignments
                    .map(
                      (a, index) => `
              <div class="assignment-card" data-id="${a.id}">
                <h1>${String(index + 1).padStart(2, "0")}</h1>
                <h3>${a.subject} - ${a.assignmentType}</h3>
                <button class="done-btn">Mark As Done</button>
              </div>
            `,
                    )
                    .join("")
            }
          </div>
        </div>
      </div>
    `;

    attachDashboardHandlers(data.assignments);
  }

  function attachDashboardHandlers(assignments) {

    safeListener(".card-container", (e) => {
      const card = e.target.closest(".assignment-card");
      if (!card) return;

      const assignmentID = card.dataset.id;
      const selected = assignments.find((a) => String(a.id) === assignmentID);

      if (!selected) return;

      // Done button
      if (e.target.classList.contains("done-btn")) {
        App.markAsDone(assignmentID);
        return;
      }

      renderAssignmentDetails(selected);
    });

    const addBtn = document.querySelector(".add-assignment");

    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        renderSubjectName();
      });
    }
  }

  /* =============================
     DETAILS PAGE
  ============================= */
  function renderAssignmentDetails(a) {
    if (!a) return;

    appContainer.innerHTML = `
      <div class="assignment">
        <h3>${a.subject}</h3>
        <p>Type: ${a.assignmentType}</p>
        <p>Test Type: ${a.testType}</p>
        <p>Due Date: ${a.dueDate}</p>
        <button id="close-details">Back</button>
      </div>
    `;

    safeListener("#close-details", () => {
      renderDashboard(App.getCurrentData());
    });
  }

  /* =============================
     SUBJECT PAGE
  ============================= */
  function renderSubjectName() {
    const columns = splitIntoColumns(SUBJECTS);

    appContainer.innerHTML = `
      <div class="subject-type-container">
        <h2>What Subject?</h2>
        ${columns
          .map(
            (col) => `
          <div class="sub-column">
            ${col
              .map((sub) => `<a href="#" class="subject-name">${sub}</a>`)
              .join("")}
          </div>
        `,
          )
          .join("")}
        <button class="back-btn">Back</button>
      </div>
    `;

    safeListener(".subject-type-container", (e) => {
      const sub = e.target.closest(".subject-name");
      if (!sub) return;

      e.preventDefault();
      App.selectedSubject(sub.textContent);
    });

    safeListener(".back-btn", () => {
      renderDashboard(App.getCurrentData());
    });
  }

  /* =============================
     ASSIGNMENT TYPE PAGE
  ============================= */
  function renderAssignmentTypePage() {
    const columns = splitIntoColumns(ASSIGNMENT_TYPES);

    appContainer.innerHTML = `
      <div class="assignment-type-container">
        <h2>What Assignment?</h2>
        ${columns
          .map(
            (col) => `
          <div class="sub-column">
            ${col
              .map(
                (type) =>
                  `<a href="#" class="assignment-type-label">${type}</a>`,
              )
              .join("")}
          </div>
        `,
          )
          .join("")}
        <button class="back-btn">Back</button>
      </div>
    `;

    safeListener(".assignment-type-container", (e) => {
      const type = e.target.closest(".assignment-type-label");
      if (!type) return;

      e.preventDefault();
      App.selectedAssignmentType(type.textContent);
    });

    safeListener(".back-btn", () => renderSubjectName());
  }

  /* =============================
     TEST TYPE PAGE
  ============================= */
  function renderTestTypePage() {
    const columns = splitIntoColumns(TEST_TYPES);

    appContainer.innerHTML = `
      <div class="test-type-container">
        <h2>Test Type?</h2>
        ${columns
          .map(
            (col) => `
          <div class="sub-column">
            ${col
              .map((t) => `<a href="#" class="test-type-label">${t}</a>`)
              .join("")}
          </div>
        `,
          )
          .join("")}
        <button class="back-btn">Back</button>
      </div>
    `;

    safeListener(".test-type-container", (e) => {
      const t = e.target.closest(".test-type-label");
      if (!t) return;

      e.preventDefault();
      App.selectedTestType(t.textContent);
    });

    safeListener(".back-btn", () => renderAssignmentTypePage());
  }

  /* =============================
     DUE DATE PAGE
  ============================= */
  function renderDueDatePage() {
    const columns = splitIntoColumns(DUE_DATES);

    appContainer.innerHTML = `
      <div class="due-date-container">
        <h2>Due Date?</h2>
        ${columns
          .map(
            (col) => `
          <div class="sub-column">
            ${col
              .map((d) => `<a href="#" class="due-date-label">${d}</a>`)
              .join("")}
          </div>
        `,
          )
          .join("")}
        <button class="back-btn">Back</button>
      </div>
    `;

    safeListener(".due-date-container", (e) => {
      const d = e.target.closest(".due-date-label");
      if (!d) return;

      e.preventDefault();
      App.selectedDueDate(d.textContent);
    });

    safeListener(".back-btn", () => renderTestTypePage());
  }

  /* ==============================
      PUBLISH PAGE
  ============================== */
  function renderPublishToBoard() {
    appContainer.innerHTML = `
      <div class="publish-prompt-container">
        <h2>Publish to Board?</h2>
        <div class="publish-wrapper">
          <a href="#" class="publish-button">Yes</a>
          <a href="#" class="publish-button">No</a>
        </div>
      </div>
    `;

    safeListener(".publish-prompt-container", (e) => {
      const btn = e.target.closest(".publish-button");
      if (!btn) return;

      e.preventDefault();
      App.selectedButton(btn.textContent);
    });
  }

  /* =============================
     UTILITIES
  ============================= */
  function showToast(message) {
    alert(message);
  }

  return {
    renderDashboard,
    renderAssignmentDetails,
    renderSubjectName,
    renderAssignmentTypePage,
    renderTestTypePage,
    renderDueDatePage,
    renderPublishToBoard,
    showToast,
  };
})();
