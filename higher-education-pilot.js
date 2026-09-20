(function () {
  "use strict";

  const HE = window.AITOOLSKIDS_HIGHER_EDUCATION;
  if (!HE || typeof TOOLS === "undefined") return;

  const $ = (id) => document.getElementById(id);
  const institutionSelect = $("heInstitution");
  const departmentSelect = $("heDepartment");
  const courseSelect = $("heCourse");
  const taskSelect = $("heTask");
  const result = $("heResult");
  const coverage = $("heCoverage");
  const search = $("heSearch");
  const searchHint = $("heSearchHint");

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  function option(value, label) {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    return o;
  }

  function populateInstitutions() {
    institutionSelect.replaceChildren();
    for (const [id, institution] of Object.entries(HE.institutions)) {
      institutionSelect.append(option(id, institution.nameEl));
    }
    populateDepartments();
  }

  function populateDepartments() {
    const institution = HE.institutions[institutionSelect.value];
    departmentSelect.replaceChildren();
    for (const id of institution?.departments || []) {
      const department = HE.departments[id];
      if (department) departmentSelect.append(option(id, department.departmentEl));
    }
    populateCourses();
  }

  function populateCourses() {
    const department = HE.departments[departmentSelect.value];
    courseSelect.replaceChildren();
    for (const [index, course] of (department?.courses || []).entries()) {
      const prefix = course.code ? `${course.code} · ` : "";
      const suffix = course.semester ? ` · ${course.semester}ο εξ.` : "";
      courseSelect.append(option(String(index), `${prefix}${course.titleEl}${suffix}`));
    }
    populateTasks();
    renderCoverage();
  }

  function currentCourse() {
    const department = HE.departments[departmentSelect.value];
    return department?.courses?.[Number(courseSelect.value)] || null;
  }

  function populateTasks() {
    const course = currentCourse();
    taskSelect.replaceChildren();
    for (const taskId of course?.tasks || []) {
      const task = HE.taskTypes[taskId];
      if (task) taskSelect.append(option(taskId, task.labelEl));
    }
    render();
  }

  function renderCoverage() {
    const department = HE.departments[departmentSelect.value];
    if (!department) {
      coverage.textContent = "";
      return;
    }
    const statusMap = {
      "pilot-verified-core": "Pilot · επαληθευμένος βασικός κορμός",
      "pilot-partial": "Pilot · μερική κάλυψη",
      "pilot-legacy-mapping": "Pilot · legacy mapping + επαληθευμένα δείγματα μαθημάτων",
    };
    const sourceCount = department.sources?.length || 0;
    coverage.textContent = `${statusMap[department.coverageStatus] || department.coverageStatus} · Πηγές: ${sourceCount} · Confidence: ${department.sourceConfidence}`;
  }

  function render() {
    const course = currentCourse();
    const task = HE.taskTypes[taskSelect.value];
    if (!course || !task) {
      result.innerHTML = '<p class="he-empty">Διάλεξε μάθημα και στόχο.</p>';
      return;
    }

    const tools = task.preferredTools
      .map((id) => TOOLS[id])
      .filter(Boolean);

    const courseTitle = course.code ? `${course.code} · ${course.titleEl}` : course.titleEl;
    const cards = tools.map((tool) => `
      <article class="he-tool">
        <h3>${tool.name}</h3>
        <p>${tool.shortDescEl || ""}</p>
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">Άνοιγμα εργαλείου</a>
      </article>
    `).join("");

    result.innerHTML = `
      <p><strong>${courseTitle}</strong></p>
      <p class="he-meta">Στόχος: ${task.labelEl}</p>
      <div class="he-note">Ξεκίνα λέγοντας στην AI τι έχεις ήδη διαβάσει ή δοκιμάσει. Ζήτησε εξήγηση, έλεγχο, ερώτηση ή feedback — όχι τελικό παραδοτέο.</div>
      <div class="he-tools">${cards || '<p class="he-empty">Δεν υπάρχει ακόμη αντιστοίχιση εργαλείων.</p>'}</div>
    `;
  }

  function handleSearch() {
    const q = normalize(search.value);
    if (!q) {
      searchHint.textContent = "";
      return;
    }

    const matches = [];
    for (const [institutionId, institution] of Object.entries(HE.institutions)) {
      const institutionTerms = [institution.nameEl, institution.nameEn, ...(institution.legacyAliases || [])];
      const institutionMatch = institutionTerms.some((term) => normalize(term).includes(q) || q.includes(normalize(term)));
      for (const departmentId of institution.departments || []) {
        const department = HE.departments[departmentId];
        const departmentTerms = [department.departmentEl, department.departmentEn, ...(department.legacyDepartmentAliases || []), ...(department.legacyInstitutionAliases || [])];
        const departmentMatch = departmentTerms.some((term) => normalize(term).includes(q) || q.includes(normalize(term)));
        const combined = normalize([...institutionTerms, ...departmentTerms].join(" "));
        const tokens = q.split(" ").filter(Boolean);
        const combinedMatch = tokens.length > 1 && tokens.every((token) => combined.includes(token));
        if (institutionMatch || departmentMatch || combinedMatch) matches.push({ institutionId, departmentId, institution, department });
      }
    }

    const unique = matches.filter((m, i, arr) => arr.findIndex((x) => x.departmentId === m.departmentId) === i);
    if (!unique.length) {
      searchHint.textContent = "Δεν βρέθηκε ακόμη αντιστοίχιση στο pilot.";
      return;
    }

    const first = unique[0];
    institutionSelect.value = first.institutionId;
    populateDepartments();
    departmentSelect.value = first.departmentId;
    populateCourses();

    const legacy = (first.institution.legacyAliases || []).some((x) => normalize(x).includes(q)) ||
      (first.department.legacyDepartmentAliases || []).some((x) => normalize(x).includes(q)) ||
      (first.department.legacyInstitutionAliases || []).some((x) => normalize(x).includes(q));

    searchHint.textContent = legacy
      ? `Το παλιό όνομα αντιστοιχίστηκε στη σημερινή οντότητα: ${first.institution.nameEl} · ${first.department.departmentEl}.`
      : `Βρέθηκε: ${first.institution.nameEl} · ${first.department.departmentEl}.`;
  }

  institutionSelect.addEventListener("change", populateDepartments);
  departmentSelect.addEventListener("change", populateCourses);
  courseSelect.addEventListener("change", populateTasks);
  taskSelect.addEventListener("change", render);
  search.addEventListener("input", handleSearch);

  populateInstitutions();
})();
