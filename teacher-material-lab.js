(function () {
  "use strict";

  const STORAGE_KEY = "aitools4kids_teacher_materials_v1";
  const MAX_ITEMS = 50;
  const state = { versions: [], busy: false, lastAudit: null };

  const $id = (id) => document.getElementById(id);
  const norm = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[΄’'·.,:;()\/\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const optionText = (select) => select && select.options && select.selectedIndex >= 0
    ? select.options[select.selectedIndex].textContent
    : "";
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>\"]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"
  }[c]));
  const escapeAttr = (value) => escapeHtml(value).replace(/'/g, "&#39;");

  function currentTask() {
    try { return typeof task !== "undefined" ? task : ""; } catch (_) { return ""; }
  }
  function currentText() {
    try { return typeof lastText !== "undefined" ? String(lastText || "") : ""; } catch (_) { return ""; }
  }
  function isEligible() { return currentTask() === "worksheet" || currentTask() === "assessment"; }
  function selectedUnitText() {
    const unitEl = $id("unit");
    const custom = $id("customUnit");
    if (unitEl && unitEl.value === "custom" && custom && custom.value.trim()) return custom.value.trim();
    return optionText(unitEl);
  }
  function selectedSubjectSafe() {
    try { return typeof selectedSubject === "function" ? selectedSubject() : null; } catch (_) { return null; }
  }

  function sourceStatus() {
    const s = selectedSubjectSafe() || {};
    const topic = selectedUnitText();
    if (s.officialPublishedPending) return {
      tone: "unknown",
      label: "Δεν έχει ακόμη επιβεβαιωθεί σε επίπεδο ενότητας",
      detail: "Οι επίσημες οδηγίες έχουν δημοσιευθεί, αλλά δεν υπάρχει ακόμη ακριβής section-level αντιστοίχιση στο site."
    };
    if (s.supportOnly) return {
      tone: "partial",
      label: "Υποστηρικτική χαρτογράφηση",
      detail: "Χρησιμοποιείται ως βοήθημα και δεν παρουσιάζεται ως αυτούσια επίσημη ετήσια ύλη."
    };
    if (s.selectionFramework) return {
      tone: "partial",
      label: "Επαληθευμένο επίσημο πλαίσιο",
      detail: "Η θεματική βρίσκεται σε επαληθευμένο πλαίσιο, αλλά δεν αποτελεί αυτόματα υποχρεωτική ή εξεταστέα λίστα."
    };
    if (s.bookSections) return {
      tone: "partial",
      label: "Επαληθευμένη ενότητα σχολικού βιβλίου",
      detail: "Η ενότητα υπάρχει στο επίσημο βιβλίο, αλλά δεν ταυτίζεται αυτόματα με την ετήσια διδακτέα ή εξεταστέα ύλη."
    };
    if (s.navigationMap) return {
      tone: "partial",
      label: "Τεκμηριωμένος χάρτης πλοήγησης",
      detail: "Είναι βοήθημα πλοήγησης στις οδηγίες και όχι αυτούσιος επίσημος τίτλος ενότητας."
    };
    if (s.annualMapped) return {
      tone: "good",
      label: "Επαληθευμένη αντιστοίχιση 2026–27",
      detail: "Η επιλογή έχει ρητή αντιστοίχιση στην τρέχουσα ύλη ή στις οδηγίες του site."
    };
    if (topic && $id("unit") && $id("unit").value !== "custom") return {
      tone: "partial",
      label: "Χαρτογραφημένη επιλογή",
      detail: "Η επιλογή είναι χαρτογραφημένη, αλλά δεν δηλώνεται εδώ ως ακριβής ετήσια section-level επιβεβαίωση."
    };
    return {
      tone: "unknown",
      label: "Ενότητα που έδωσε ο/η εκπαιδευτικός",
      detail: "Δεν υπάρχει αυτόματη section-level επιβεβαίωση από τα δεδομένα του site. Χρειάζεται έλεγχος από τον/την εκπαιδευτικό."
    };
  }

  function snapshot() {
    const s = selectedSubjectSafe() || {};
    return {
      schemaVersion: 1,
      task: currentTask(),
      context: $id("context") ? $id("context").value : "",
      contextLabel: optionText($id("context")),
      grade: $id("grade") ? $id("grade").value : "",
      gradeLabel: optionText($id("grade")),
      subject: $id("subject") ? $id("subject").value : "",
      subjectLabel: optionText($id("subject")),
      unit: selectedUnitText(),
      objective: $id("objective") ? $id("objective").value : "",
      source: sourceStatus(),
      coverageCaveat: s.coverageCaveat || ""
    };
  }

  function contextBlock() {
    const c = snapshot();
    return [
      "Σχολικό πλαίσιο: " + c.contextLabel,
      "Τάξη: " + c.gradeLabel,
      "Μάθημα: " + c.subjectLabel,
      "Ενότητα: " + (c.unit || "δεν δόθηκε"),
      "Μαθησιακός στόχος: " + (c.objective || "δεν δόθηκε"),
      "Καθεστώς πηγής: " + c.source.label,
      c.coverageCaveat ? "Περιορισμός κάλυψης: " + c.coverageCaveat : ""
    ].filter(Boolean).join("\n");
  }

  function setBusy(flag, message) {
    state.busy = Boolean(flag);
    const root = $id("teacherMaterialLab");
    if (root) {
      root.classList.toggle("is-busy", state.busy);
      root.querySelectorAll("button[data-ai-action]").forEach((b) => { b.disabled = state.busy; });
    }
    if ($id("tmlStatus")) $id("tmlStatus").textContent = message || "";
  }

  async function callAI(system, prompt) {
    const response = await fetch("/api/teacher-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, prompt })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Δεν ολοκληρώθηκε η δημιουργία.");
    return String(data.text || "").trim();
  }

  function updateUndo() {
    const button = $id("tmlUndo");
    if (button) button.disabled = state.versions.length < 2;
  }

  }

  function remember(text, label) {
    const value = String(text || "").trim();
    if (!value) return;
    const last = state.versions[state.versions.length - 1];
    if (last && last.text === value) return;
    state.versions.push({ text: value, label: label || "Έκδοση", at: new Date().toISOString() });
    if (state.versions.length > 12) state.versions.shift();
    updateUndo();
  }

  function applyText(nextText, label) {
    const previous = currentText();
    if (previous) remember(previous, "Προηγούμενη έκδοση");
    const next = String(nextText || "").trim();
    if (!next) return;
    try {
      if (typeof lastText !== "undefined") lastText = next;
      if (typeof show === "function") show(next, "Εργαστήριο · " + (label || "Νέα έκδοση"));
      else if ($id("output")) $id("output").textContent = next;
    } catch (_) {
      if ($id("output")) $id("output").textContent = next;
    }
    remember(next, label || "Νέα έκδοση");
    syncEditor();
    renderSourceGate();
    renderMisconceptions();
  }

  const transforms = {
    simpler: "Ξαναγράψε το ίδιο υλικό με πιο απλή γλώσσα και συντομότερες προτάσεις, χωρίς να αφαιρέσεις το βασικό ακαδημαϊκό νόημα.",
    steps: "Σπάσε τις οδηγίες και τις δραστηριότητες σε μικρά, σαφή, αριθμημένα βήματα. Μην προσθέσεις νέα ύλη.",
    shorter: "Κάνε το υλικό αισθητά πιο σύντομο, κρατώντας μόνο ό,τι είναι αναγκαίο για τον δηλωμένο μαθησιακό στόχο.",
    harder: "Κάνε το υλικό πιο απαιτητικό με περισσότερη εφαρμογή, αιτιολόγηση και σύνδεση ιδεών, αλλά μείνε αυστηρά στην ίδια ενότητα.",
    example: "Πρόσθεσε ένα σύντομο, ηλικιακά κατάλληλο παράδειγμα που βοηθά να κατανοηθεί η ίδια έννοια. Μην εισάγεις μη επαληθευμένη ύλη.",
    vocabulary: "Πρόσθεσε μικρή ενότητα «Βασικό λεξιλόγιο» με έως 6 όρους που ήδη υπάρχουν ή είναι αναγκαίοι για το ίδιο υλικό.",
    visual: "Βελτίωσε την οπτική δομή για εκτύπωση: μικρές ενότητες, καθαρές επικεφαλίδες, bullets ή πίνακες όπου βοηθούν και περισσότερο λευκό χώρο. Μην αλλάξεις το περιεχόμενο."
  };

  const derivatives = {
    exit: "Δημιούργησε exit ticket 3 σύντομων ερωτήσεων αποκλειστικά από το υλικό. Δώσε χωριστά πολύ σύντομο κλειδί για τον εκπαιδευτικό.",
    check5: "Δημιούργησε 5 σύντομες ερωτήσεις ελέγχου κατανόησης αποκλειστικά από το υλικό. Συνδύασε κατανόηση και εφαρμογή, όχι μόνο ανάκληση. Δώσε χωριστό κλειδί.",
    flashcards: "Δημιούργησε ακριβώς 6 flashcards από το υλικό. Μπροστά ερώτηση ή όρος και πίσω σύντομη εξήγηση. Μην προσθέσεις πληροφορίες που δεν στηρίζονται στο υλικό.",
    vocab: "Δημιούργησε μικρό φύλλο βασικού λεξιλογίου με έως 8 όρους που προκύπτουν από το υλικό, απλή εξήγηση και σύντομη άσκηση χρήσης.",
    review10: "Μετέτρεψε το υλικό σε επανάληψη 10 λεπτών: 2' ανάκληση χωρίς βοήθεια, 5' σύντομη καθοδηγούμενη εφαρμογή, 3' τελικό έλεγχο κατανόησης."
  };

  async function runTransform(kind) {
    const instruction = transforms[kind];
    const original = currentText();
    if (!instruction || !original) return;
    setBusy(true, "Το AI προσαρμόζει το ίδιο υλικό χωρίς να αλλάζει το curriculum context…");
    try {
      const system = "Είσαι βοηθός εκπαιδευτικού. Μετασχηματίζεις υπάρχον υλικό χωρίς να εφευρίσκεις νέα επίσημη ύλη, πηγές ή τίτλους. Διατηρείς το ίδιο σχολικό πλαίσιο, τάξη, μάθημα, ενότητα και στόχο. Δεν κάνεις διάγνωση. Επιστρέφεις μόνο το νέο υλικό σε καθαρό Markdown.";
      const prompt = contextBlock() + "\n\nΕΝΤΟΛΗ\n" + instruction + "\n\nΥΠΑΡΧΟΝ ΥΛΙΚΟ\n---\n" + original + "\n---";
      applyText(await callAI(system, prompt), "Προσαρμογή");
      setBusy(false, "Έτοιμη νέα έκδοση. Η προηγούμενη παραμένει διαθέσιμη με «Πίσω».");
    } catch (error) { setBusy(false, "Δεν ολοκληρώθηκε: " + error.message); }
  }

  async function runDerivative(kind) {
    const instruction = derivatives[kind];
    const original = currentText();
    if (!instruction || !original) return;
    setBusy(true, "Δημιουργείται παράγωγο από το ίδιο υλικό…");
    try {
      const system = "Είσαι βοηθός εκπαιδευτικού. Δημιουργείς παράγωγο υλικό μόνο από το παρεχόμενο υλικό και το δηλωμένο σχολικό context. Δεν προσθέτεις μη τεκμηριωμένη επίσημη ύλη. Δεν βαθμολογείς πραγματικούς μαθητές. Επιστρέφεις μόνο το νέο υλικό σε καθαρό Markdown.";
      const prompt = contextBlock() + "\n\nΠΑΡΑΓΩΓΟ\n" + instruction + "\n\nΥΛΙΚΟ ΒΑΣΗΣ\n---\n" + original + "\n---";
      applyText(await callAI(system, prompt), "Παράγωγο υλικό");
      setBusy(false, "Το παράγωγο δημιουργήθηκε από την ίδια βάση.");
    } catch (error) { setBusy(false, "Δεν ολοκληρώθηκε: " + error.message); }
  }

  function parseJson(raw) {
    const cleaned = String(raw || "").trim().replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\s*\`\`\`$/, "");
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end < start) throw new Error("Ο έλεγχος δεν επέστρεψε αναγνώσιμη δομή.");
    return JSON.parse(cleaned.slice(start, end + 1));
  }

  async function runAudit() {
    const original = currentText();
    if (!original) return;
    setBusy(true, "Γίνεται παιδαγωγική εκτίμηση. Η αντιστοίχιση ύλης εμφανίζεται χωριστά από τα verified δεδομένα.");
    try {
      const system = "Είσαι βοηθός ποιοτικού ελέγχου εκπαιδευτικού υλικού. Αξιολογείς μόνο παιδαγωγικά και παρουσιαστικά χαρακτηριστικά. Δεν αποφασίζεις αν το υλικό είναι επίσημα σωστό, εγκεκριμένο ή curriculum-aligned. Δεν δίνεις συνολικό verdict. Επιστρέφεις αυστηρά JSON χωρίς markdown.";
      const prompt = contextBlock() + "\n\nΑξιολόγησε 5 κριτήρια: language, cognitiveLoad, clarity, accessibility, learningFirst. Για κάθε κριτήριο δώσε {\"status\":\"ok\" ή \"review\",\"note\":\"μία σύντομη συγκεκριμένη παρατήρηση στα ελληνικά\"}. Μην κάνεις διάγνωση. Το accessibility αφορά δομή και παρουσίαση.\n\nJSON shape:\n{\"language\":{\"status\":\"ok\",\"note\":\"\"},\"cognitiveLoad\":{\"status\":\"ok\",\"note\":\"\"},\"clarity\":{\"status\":\"ok\",\"note\":\"\"},\"accessibility\":{\"status\":\"ok\",\"note\":\"\"},\"learningFirst\":{\"status\":\"ok\",\"note\":\"\"}}\n\nΥΛΙΚΟ\n---\n" + original + "\n---";
      state.lastAudit = parseJson(await callAI(system, prompt));
      renderAudit();
      setBusy(false, "Ο έλεγχος ολοκληρώθηκε. Τα παιδαγωγικά σημεία είναι AI εκτίμηση και χρειάζονται κρίση εκπαιδευτικού.");
    } catch (error) { setBusy(false, "Δεν ολοκληρώθηκε ο έλεγχος: " + error.message); }
  }

  function renderSourceGate() {
    const host = $id("tmlVerifiedGate");
    if (!host) return;
    const s = sourceStatus();
    const symbols = { good: "✓", partial: "◐", unknown: "?" };
    host.innerHTML = '<div class="tml-check-row tml-' + s.tone + '"><span class="tml-check-icon">' + (symbols[s.tone] || "?") + '</span><div><strong>Αντιστοίχιση / πηγή: ' + escapeHtml(s.label) + '</strong><p>' + escapeHtml(s.detail) + '</p><span class="tml-data-label">Δεδομένα aitools4kids · όχι AI εκτίμηση</span></div></div>';
  }

  function renderAudit() {
    const host = $id("tmlAuditResults");
    if (!host) return;
    if (!state.lastAudit) {
      host.innerHTML = '<p class="tml-muted">Δεν έχει γίνει ακόμη παιδαγωγικός έλεγχος.</p>';
      return;
    }
    const fields = [
      ["language", "Γλωσσική δυσκολία"],
      ["cognitiveLoad", "Γνωστικό φορτίο"],
      ["clarity", "Σαφήνεια οδηγιών"],
      ["accessibility", "Δομή & προσβασιμότητα"],
      ["learningFirst", "Learning-first συμπεριφορά"]
    ];
    host.innerHTML = '<div class="tml-ai-estimate"><strong>AI εκτίμηση — χρειάζεται κρίση εκπαιδευτικού</strong></div>' + fields.map(([key, label]) => {
      const data = state.lastAudit[key] || {};
      const ok = data.status === "ok";
      return '<div class="tml-check-row ' + (ok ? "tml-good" : "tml-partial") + '"><span class="tml-check-icon">' + (ok ? "✓" : "◐") + '</span><div><strong>' + label + '</strong><p>' + escapeHtml(data.note || "Δεν δόθηκε παρατήρηση.") + '</p></div></div>';
    }).join("");
  }

  function exactMisconceptions() {
    if (currentTask() !== "assessment") return [];
    if (typeof GAP_TAGS === "undefined") return [];
    const layer = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    if (!layer || typeof layer.getGapAlignment !== "function") return [];
    const topic = norm(selectedUnitText());
    if (!topic) return [];
    const out = [];
    Object.keys(GAP_TAGS).forEach((id) => {
      const alignment = layer.getGapAlignment(id);
      if (!alignment || !alignment.annualScopeVerified) return;
      if (alignment.status !== "exact-section-verified" && alignment.status !== "related-section-verified") return;
      const candidates = [alignment.officialSectionEl, alignment.topicAnchorEl].filter(Boolean).map(norm);
      if (!candidates.some((value) => value === topic)) return;
      const gap = GAP_TAGS[id];
      out.push({ id, label: gap.labelEl || id, explain: gap.explainEl || "" });

    });
    return out.slice(0, 8);
  }

  function renderMisconceptions() {
    const wrap = $id("tmlMisconceptionWrap");
    const host = $id("tmlMisconceptions");
    if (!wrap || !host) return;
    wrap.hidden = currentTask() !== "assessment";
    if (wrap.hidden) return;
    const items = exactMisconceptions();
    const button = $id("tmlApplyMisconceptions");
    if (!items.length) {
      host.innerHTML = '<p class="tml-muted">Δεν υπάρχουν αυτή τη στιγμή τεκμηριωμένες παρανοήσεις με ακριβή σύνδεση σε αυτή την ενότητα. Δεν θα δημιουργηθούν πιθανολογικά misconceptions από το μοντέλο.</p>';
      if (button) button.hidden = true;
      return;
    }
    host.innerHTML = items.map((item) => '<label class="tml-misconception"><input type="checkbox" value="' + escapeAttr(item.id) + '"><span><strong>' + escapeHtml(item.label) + '</strong><small>' + escapeHtml(item.explain) + '</small></span></label>').join("");
    if (button) button.hidden = false;
  }

  async function applyMisconceptions() {
    const host = $id("tmlMisconceptions");
    if (!host) return;
    const ids = Array.from(host.querySelectorAll('input[type="checkbox"]:checked')).map((x) => x.value);
    if (!ids.length) { setBusy(false, "Επίλεξε τουλάχιστον μία τεκμηριωμένη παρανόηση."); return; }
    const valid = exactMisconceptions().filter((x) => ids.includes(x.id));
    if (!valid.length) { setBusy(false, "Δεν βρέθηκε ενεργή επαληθευμένη αντιστοίχιση."); return; }
    const original = currentText();
    setBusy(true, "Ενσωματώνονται μόνο οι επιλεγμένες τεκμηριωμένες παρανοήσεις…");
    try {
      const evidence = valid.map((x) => "- " + x.id + ": " + x.label + " — " + x.explain).join("\n");
      const system = "Είσαι βοηθός εκπαιδευτικού. Αναθεωρείς υπάρχον φύλλο αξιολόγησης. Χρησιμοποιείς μόνο τα misconception IDs που δίνονται ρητά. Δεν εφευρίσκεις άλλες παρανοήσεις και δεν κάνεις διάγνωση μαθητή.";
      const prompt = contextBlock() + "\n\nΤΕΚΜΗΡΙΩΜΕΝΕΣ ΠΑΡΑΝΟΗΣΕΙΣ ΑΠΟ ΤΟ DATA LAYER\n" + evidence + "\n\nΑναθεώρησε μόνο όπου ταιριάζει 1–2 distractors ώστε να ελέγχουν τις παραπάνω παρανοήσεις. Στις teacher-only σημειώσεις γράψε: «Η επιλογή μπορεί να αποτελεί ένδειξη ότι χρειάζεται επιπλέον έλεγχος της έννοιας…». Ποτέ μην γράψεις ότι ένας μαθητής έχει συγκεκριμένη δυσκολία ή διάγνωση επειδή επέλεξε μία απάντηση. Μην προσθέσεις νέο misconception.\n\nΥΠΑΡΧΟΝ ΦΥΛΛΟ\n---\n" + original + "\n---";
      applyText(await callAI(system, prompt), "Assessment με τεκμηριωμένα misconceptions");
      setBusy(false, "Η αξιολόγηση αναθεωρήθηκε μόνο με τεκμηριωμένα misconception IDs.");
    } catch (error) { setBusy(false, "Δεν ολοκληρώθηκε: " + error.message); }
  }

  function syncEditor() {
    const editor = $id("tmlEditor");
    if (editor && document.activeElement !== editor) editor.value = currentText();
  }

  function loadMaterials() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (_) { return []; }
  }
  function writeMaterials(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS))); }

  function saveCurrent() {
    const text = currentText();
    if (!text) return;
    const c = snapshot();
    const item = {
      schemaVersion: 1,
      id: "mat-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      title: (c.task === "assessment" ? "Φύλλο αξιολόγησης" : "Φύλλο εργασίας") + " · " + (c.subjectLabel || "Μάθημα") + " · " + (c.unit || "Ενότητα"),
      task: c.task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      context: c.context,
      contextLabel: c.contextLabel,
      grade: c.grade,
      gradeLabel: c.gradeLabel,
      subject: c.subject,
      subjectLabel: c.subjectLabel,
      unit: c.unit,
      objective: c.objective,
      source: c.source,
      text
    };
    try {
      writeMaterials([item].concat(loadMaterials()));
      renderLibrary();
      setBusy(false, "Αποθηκεύτηκε μόνο σε αυτόν τον browser.");
    } catch (_) { setBusy(false, "Δεν αποθηκεύτηκε: ο τοπικός χώρος του browser μπορεί να είναι γεμάτος."); }
  }

  function renderLibrary() {
    const host = $id("tmlLibraryList");
    if (!host) return;
    const items = loadMaterials();
    if (!items.length) {
      host.innerHTML = '<p class="tml-muted">Δεν έχεις αποθηκεύσει υλικό σε αυτόν τον browser.</p>';
      return;
    }
    host.innerHTML = items.map((item) => '<article class="tml-library-item" data-id="' + escapeAttr(item.id) + '"><div><strong>' + escapeHtml(item.title || "Υλικό") + '</strong><small>' + escapeHtml((item.gradeLabel || "") + " · " + (item.subjectLabel || "") + " · " + new Date(item.updatedAt || item.createdAt).toLocaleDateString("el-GR")) + '</small></div><div class="tml-library-actions"><button type="button" data-lib="open">Άνοιγμα</button><button type="button" data-lib="rename">Μετονομασία</button><button type="button" data-lib="delete">Διαγραφή</button></div></article>').join("");
  }

  function libraryAction(event) {
    const button = event.target.closest("button[data-lib]");
    if (!button) return;
    const row = button.closest("[data-id]");
    const items = loadMaterials();
    const index = items.findIndex((x) => x.id === (row ? row.dataset.id : ""));
    if (index < 0) return;
    if (button.dataset.lib === "open") { applyText(items[index].text, "Τοπική βιβλιοθήκη"); return; }
    if (button.dataset.lib === "rename") {
      const next = window.prompt("Νέος τίτλος:", items[index].title || "Υλικό");
      if (next && next.trim()) {
        items[index].title = next.trim();
        items[index].updatedAt = new Date().toISOString();
        writeMaterials(items);
        renderLibrary();
      }
      return;
    }
    if (button.dataset.lib === "delete" && window.confirm("Να διαγραφεί αυτό το τοπικά αποθηκευμένο υλικό;")) {
      items.splice(index, 1);
      writeMaterials(items);
      renderLibrary();
    }
  }

  function exportMaterials() {
    const payload = { schema: "aitools4kids-teacher-materials", version: 1, exportedAt: new Date().toISOString(), materials: loadMaterials() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aitools4kids-materials-v1.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importMaterials(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        if (data.schema !== "aitools4kids-teacher-materials" || data.version !== 1 || !Array.isArray(data.materials)) throw new Error("Μη συμβατό αρχείο.");
        const clean = data.materials.filter((x) => x && x.schemaVersion === 1 && typeof x.text === "string").slice(0, MAX_ITEMS);
        const seen = new Set();
        const merged = clean.concat(loadMaterials()).filter((x) => {
          const key = x.id || ((x.title || "") + "|" + (x.createdAt || ""));
