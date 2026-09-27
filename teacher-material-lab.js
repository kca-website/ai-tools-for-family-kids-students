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
