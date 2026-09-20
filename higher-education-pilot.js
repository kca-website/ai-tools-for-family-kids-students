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
  const aiInput = $("heAiInput");
  const aiStatus = $("heAiStatus");
  const aiOutput = $("heAiOutput");
  const aiGroq = $("heAiGroq");
  const aiPuter = $("heAiPuter");
  let aiAction = "explain";
  let puterLoadPromise = null;

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

  const ACTIONS = {
    explain: {
      label: "Εξήγηση",
      instruction: "Εξήγησε την έννοια καθαρά σε επίπεδο προπτυχιακού φοιτητή. Ξεκίνα από τη βασική ιδέα, χρησιμοποίησε ένα παράδειγμα και κλείσε με 2 ερωτήσεις αυτοελέγχου."
    },
    quiz: {
      label: "Quiz",
      instruction: "Δημιούργησε 8 ερωτήσεις εξάσκησης σχετικές με το μάθημα, με κλιμακούμενη δυσκολία. Βάλε τις απαντήσεις και σύντομη αιτιολόγηση στο τέλος, όχι αμέσως μετά από κάθε ερώτηση."
    },
    flashcards: {
      label: "Flashcards",
      instruction: "Δημιούργησε 12 σύντομες flashcards Ερώτηση → Απάντηση. Προτίμησε έννοιες και σχέσεις που αξίζει να ανακαλεί ο φοιτητής, όχι άσχετες λεπτομέρειες."
    },
    "study-plan": {
      label: "Πλάνο μελέτης",
      instruction: "Φτιάξε πρακτικό πλάνο μελέτης σε βήματα: τι να καταλάβω πρώτα, τι να εξασκήσω, πώς να αυτοελεγχθώ και τι να επαναλάβω. Μην υποθέτεις εξεταστέα ύλη που δεν παρέχεται."
    },
    paper: {
      label: "Paper helper",
      instruction: "Βοήθησε τον φοιτητή να διαβάσει το paper/abstract/σημειώσεις που επικόλλησε: σκοπός, βασική υπόθεση, μέθοδος, κύρια ευρήματα, περιορισμοί, άγνωστοι όροι και 5 ερωτήσεις κατανόησης. Αν δεν έχει επικολλήσει υλικό, ζήτησέ του να το προσθέσει αντί να επινοήσεις paper."
    },
    feedback: {
      label: "Feedback στη δουλειά μου",
      instruction: "Δώσε feedback μόνο πάνω στο κείμενο/κώδικα/λύση που έδωσε ο φοιτητής. Εντόπισε τι είναι σωστό, τι θέλει βελτίωση και δώσε συγκεκριμένες επόμενες κινήσεις. Μην ξαναγράψεις ολόκληρο παραδοτέο για υποβολή. Αν δεν έχει δώσει δική του προσπάθεια, ζήτησέ την."
    },
    research: {
      label: "Έρευνα / πηγές",
      instruction: "Βοήθησε να οργανωθεί στρατηγική έρευνας: βασικά ερευνητικά ερωτήματα, keywords στα ελληνικά και αγγλικά, τύποι αξιόπιστων πηγών και κριτήρια αξιολόγησης. Μην επινοήσεις βιβλιογραφικές αναφορές ή DOI. Αν δεν μπορείς να επαληθεύσεις συγκεκριμένη πηγή, πες το."
    }
  };

  function universityContext() {
    const institution = HE.institutions[institutionSelect.value];
    const department = HE.departments[departmentSelect.value];
    const course = currentCourse();
    const task = HE.taskTypes[taskSelect.value];
    return { institution, department, course, task };
  }

  function buildAiRequest() {
    const { institution, department, course, task } = universityContext();
    const extra = aiInput.value.trim();
    const action = ACTIONS[aiAction] || ACTIONS.explain;
    const sources = (department?.sources || []).join("\n");
    const system = [
      "Είσαι ο AI Βοηθός Φοιτητή του AITOOLS4KIDS.",
      "Στόχος σου είναι να βοηθάς τον φοιτητή να κατανοεί, να ερευνά, να εξασκείται και να βελτιώνει τη δική του δουλειά.",
      "Δεν γράφεις ολοκληρωμένη εργασία, report, essay, lab report ή άλλο παραδοτέο για υποβολή αντί για τον φοιτητή.",
      "Μπορείς να δώσεις outline, ερευνητικά ερωτήματα, μικρά παραδείγματα, feedback, hints, quiz, flashcards και πλάνο μελέτης.",
      "Μην επινοείς πηγές, DOI, αποτελέσματα μελετών ή στοιχεία του προγράμματος σπουδών.",
      "Τα παρακάτω στοιχεία μαθήματος είναι context του pilot και όχι απόδειξη πλήρους εξεταστέας ύλης.",
      "Αν λείπει πληροφορία, δήλωσέ το καθαρά.",
      "Απάντησε στα ελληνικά εκτός αν ο φοιτητής ζητήσει άλλη γλώσσα."
    ].join("\n");
    const prompt = [
      `Ίδρυμα: ${institution?.nameEl || ""}`,
      `Τμήμα: ${department?.departmentEl || ""}`,
      `Μάθημα: ${course?.code ? course.code + " · " : ""}${course?.titleEl || ""}`,
      `Στόχος που επέλεξε: ${task?.labelEl || ""}`,
      `Ενέργεια: ${action.label}`,
      `Coverage status: ${department?.coverageStatus || ""}`,
      `Επίσημες πηγές τμήματος που έχουμε καταχωρίσει:\n${sources || "Καμία"}`,
      "",
      `Οδηγία: ${action.instruction}`,
      extra ? `\nΠρόσθετο υλικό/ερώτημα του φοιτητή:\n${extra}` : ""
    ].filter(Boolean).join("\n");
    return { system, prompt };
  }

  function setAiBusy(busy, message) {
    aiGroq.disabled = busy;
    aiPuter.disabled = busy;
    aiStatus.textContent = message || "";
  }

  function showAiOutput(text, provider) {
    aiOutput.textContent = String(text || "").trim();
    aiOutput.classList.add("visible");
    aiStatus.textContent = `Έτοιμο · ${provider}`;
    aiOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function generateInlineGroq() {
    setAiBusy(true, "Δημιουργία…");
    try {
      const payload = buildAiRequest();
      const response = await fetch("/api/teacher-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Αποτυχία δημιουργίας");
      if (!data.text) throw new Error("Δεν επέστρεψε κείμενο.");
      showAiOutput(data.text, `GPT-OSS 120B${data.model ? " · " + data.model : ""}`);
    } catch (error) {
      aiStatus.textContent = "Δεν ολοκληρώθηκε: " + (error?.message || error);
    } finally {
      aiGroq.disabled = false;
      aiPuter.disabled = false;
    }
  }

  function ensurePuter() {
    if (window.puter) return Promise.resolve(window.puter);
    if (puterLoadPromise) return puterLoadPromise;
    puterLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      script.onload = () => resolve(window.puter);
      script.onerror = () => reject(new Error("Δεν φορτώθηκε το Puter."));
      document.head.appendChild(script);
    });
    return puterLoadPromise;
  }

  async function generateInlinePuter() {
    setAiBusy(true, "Φόρτωση Puter…");
    try {
      const puter = await ensurePuter();
      const payload = buildAiRequest();
      const response = await puter.ai.chat(
        [{ role: "system", content: payload.system }, { role: "user", content: payload.prompt }],
        { model: "gpt-5.6-luna", provider: "openai", max_tokens: 1200 }
      );
      const text = typeof response === "string"
        ? response
        : (response?.message?.content || response?.text || "");
      if (!text) throw new Error("Δεν επέστρεψε κείμενο.");
      showAiOutput(text, "Puter");
    } catch (error) {
      aiStatus.textContent = "Το Puter δεν ολοκλήρωσε: " + (error?.message || error);
    } finally {
      aiGroq.disabled = false;
      aiPuter.disabled = false;
    }
  }

  document.getElementById("heAiActions")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-he-action]");
    if (!button) return;
    aiAction = button.dataset.heAction;
    document.querySelectorAll("[data-he-action]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    const placeholders = {
      paper: "Επικόλλησε abstract, απόσπασμα ή σημειώσεις από το paper.",
      feedback: "Επικόλλησε τη δική σου παράγραφο, λύση, κώδικα ή draft για feedback.",
      research: "Γράψε το ερευνητικό θέμα ή το ερώτημα που θέλεις να διερευνήσεις.",
      explain: "Ποιο ακριβώς σημείο δεν καταλαβαίνεις;",
      quiz: "Προαιρετικά γράψε ποια ενότητα θέλεις να εξασκήσεις.",
      flashcards: "Προαιρετικά γράψε την ενότητα ή τις σημειώσεις σου.",
      "study-plan": "Προαιρετικά γράψε πόσο χρόνο έχεις και ποια σημεία σε δυσκολεύουν."
    };
    aiInput.placeholder = placeholders[aiAction] || "";
  });

  aiGroq.addEventListener("click", generateInlineGroq);
  aiPuter.addEventListener("click", generateInlinePuter);

  institutionSelect.addEventListener("change", populateDepartments);
  departmentSelect.addEventListener("change", populateCourses);
  courseSelect.addEventListener("change", populateTasks);
  taskSelect.addEventListener("change", render);
  search.addEventListener("input", handleSearch);

  populateInstitutions();
})();
