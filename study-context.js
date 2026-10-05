(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AITOOLSKIDS_STUDY_CONTEXT = api;
})(typeof window !== "undefined" ? window : null, function (root) {
  "use strict";

  const VERSION = 2;
  const EVENT = "aitools4kids:study-context-updated";
  const SESSION_KEY = "aitools4kidsStudyContextV1";
  const SOURCE_POLICIES = Object.freeze([
    "attachment_override",
    "official_required",
    "official_if_available",
    "general_unverified"
  ]);

  function text(value, max = 300) {
    return String(value == null ? "" : value).trim().slice(0, max);
  }

  function cleanDocumentContext(value) {
    if (!value || typeof value !== "object") return null;
    const kind = text(value.kind, 40);
    const name = text(value.name, 180);
    const pagesRead = Number(value.pagesRead || 0);
    const totalPages = Number(value.totalPages || 0);
    const out = {
      kind: kind || "",
      name: name || "",
      pagesRead: Number.isFinite(pagesRead) ? Math.max(0, pagesRead) : 0,
      totalPages: Number.isFinite(totalPages) ? Math.max(0, totalPages) : 0,
      truncated: !!value.truncated
    };
    return out.kind || out.name || out.pagesRead || out.totalPages ? out : null;
  }

  function normalize(input) {
    const value = input && typeof input === "object" ? input : {};
    const sourcePolicy = SOURCE_POLICIES.includes(value.sourcePolicy)
      ? value.sourcePolicy
      : "general_unverified";

    return Object.freeze({
      version: VERSION,
      zoneId: text(value.zoneId, 40),
      roleId: text(value.roleId, 40),
      lang: value.lang === "en" ? "en" : "el",
      schoolType: text(value.schoolType, 40),
      grade: text(value.grade, 60),
      sector: text(value.sector, 120),
      specialty: text(value.specialty, 120),
      subject: text(value.subject, 180),
      topic: text(value.topic, 300),
      gapId: text(value.gapId, 180),
      learningMode: text(value.learningMode, 60),
      studyAction: text(value.studyAction, 60),
      sourcePolicy,
      documentContext: cleanDocumentContext(value.documentContext)
    });
  }

  function resolveSourcePolicy(options) {
    const value = options && typeof options === "object" ? options : {};
    if (value.hasAttachment) return "attachment_override";
    const schoolLevel = text(value.schoolLevel || value.zoneId, 40).toLowerCase();
    // One shared policy for every AI Study surface:
    // Primary prefers an official source but may fall back to tightly scoped AI.
    // Gymnasium and Lyceum always fail closed when the official source is missing.
    if (value.hasCurriculumSelection && schoolLevel === "primary") return "official_if_available";
    if (value.hasCurriculumSelection && (schoolLevel === "middle" || schoolLevel === "high")) return "official_required";
    if (value.requiresOfficial) return "official_required";
    if (value.hasCurriculumSelection) return "official_if_available";
    return "general_unverified";
  }

  function resolveSourceMode(options) {
    const value = options && typeof options === "object" ? options : {};
    if (value.hasAttachment || value.policy === "attachment_override") return "user_upload";
    if (value.hasOfficialSource) return "official_schoolbook";
    if (value.policy === "official_required") return "unmapped_blocked";
    if (value.policy === "official_if_available") return "ai_fallback";
    return "general_ai";
  }

  function sourceModeLabel(mode, lang) {
    const en = lang === "en";
    const labels = {
      official_schoolbook: en ? "Based on the official school textbook" : "Βασισμένο στο επίσημο σχολικό βιβλίο",
      ai_fallback: en ? "AI help adapted to the grade and selected unit" : "AI βοήθεια προσαρμοσμένη στην τάξη και στην επιλεγμένη ενότητα",
      unmapped_blocked: en
        ? "This unit has not yet been connected to its official school source. The connection is in progress."
        : "Η συγκεκριμένη ενότητα δεν έχει συνδεθεί ακόμη με την επίσημη σχολική πηγή. Η σύνδεσή της βρίσκεται σε εξέλιξη.",
      user_upload: en ? "Based on your uploaded material" : "Βασισμένο στο υλικό που ανέβασες",
      general_ai: en ? "General AI educational help" : "Γενική εκπαιδευτική βοήθεια AI"
    };
    return labels[mode] || labels.general_ai;
  }

  function fromSearchParams(search, defaults) {
    const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
    const base = Object.assign({}, defaults || {});
    const topicText = params.get("topicText");
    return normalize(Object.assign(base, {
      zoneId: params.get("zone") || base.zoneId,
      roleId: params.get("role") || base.roleId,
      schoolType: params.get("schoolType") || base.schoolType,
      grade: params.get("grade") || base.grade,
      sector: params.get("sector") || base.sector,
      specialty: params.get("specialty") || base.specialty,
      subject: params.get("subject") || base.subject,
      topic: topicText || params.get("topic") || base.topic,
      gapId: params.get("topic") || base.gapId,
      learningMode: params.get("mode") || base.learningMode
    }));
  }

  function toSearchParams(context, existing) {
    const ctx = normalize(context);
    const params = new URLSearchParams(existing || "");
    const set = (key, value) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };
    set("zone", ctx.zoneId);
    set("role", ctx.roleId);
    set("schoolType", ctx.schoolType);
    set("grade", ctx.grade);
    set("sector", ctx.sector);
    set("specialty", ctx.specialty);
    set("subject", ctx.subject);
    set("topic", ctx.gapId);
    set("topicText", ctx.topic && ctx.topic !== ctx.gapId ? ctx.topic : "");
    set("mode", ctx.learningMode);
    return params;
  }

  function publish(context, options) {
    const ctx = normalize(context);
    const opts = options && typeof options === "object" ? options : {};
    if (root && opts.persist !== false) {
      try {
        root.sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          createdAt: Date.now(),
          context: ctx
        }));
      } catch (_) {}
    }
    if (root && typeof root.dispatchEvent === "function" && typeof root.CustomEvent === "function") {
      try { root.dispatchEvent(new root.CustomEvent(EVENT, { detail: ctx })); } catch (_) {}
    }
    return ctx;
  }

  function readPersisted(maxAgeMs) {
    if (!root) return null;
    const maxAge = Number.isFinite(Number(maxAgeMs)) ? Number(maxAgeMs) : 2 * 60 * 60 * 1000;
    try {
      const raw = root.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      const createdAt = Number(payload && payload.createdAt);
      if (!createdAt || Date.now() - createdAt > maxAge) {
        root.sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return normalize(payload.context);
    } catch (_) {
      return null;
    }
  }

  function clearPersisted() {
    if (!root) return;
    try { root.sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
  }

  return Object.freeze({
    VERSION,
    EVENT,
    SESSION_KEY,
    SOURCE_POLICIES,
    normalize,
    resolveSourcePolicy,
    resolveSourceMode,
    sourceModeLabel,
    fromSearchParams,
    toSearchParams,
    publish,
    readPersisted,
    clearPersisted
  });
});
