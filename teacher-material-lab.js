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
