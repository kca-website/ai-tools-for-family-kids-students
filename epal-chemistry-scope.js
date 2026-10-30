"use strict";

// 2026-27 EPAL Chemistry B selects §1.1–1.2 in full, from §1.3 ONLY
// saturated hydrocarbon nomenclature, and from §1.4 ONLY chain isomerism.
// Do not return the surrounding PDF pages unscoped to any learner action.
const SUBJECT = "epal-b-chemistry";
const TOPIC = "Χημεία Β΄ Λυκείου, Κεφάλαιο 1 — Γενικό μέρος οργανικής χημείας · §1.1–1.2 · §1.3 μόνο κορεσμένοι υδρογονάνθρακες · §1.4 μόνο ισομέρεια αλυσίδας";

function selected(mapping, subject, topic) {
  return subject === SUBJECT && topic === TOPIC &&
    mapping?.bookKey === "8547-2576" && mapping?.grade === "b";
}
function between(source, startText, endText) {
  const start = source.indexOf(startText);
  const end = source.indexOf(endText, start + startText.length);
  return start < 0 || end < 0 || end <= start ? "" : source.slice(start, end).trim();
}
function excerptBefore(source, term, startText, limit) {
  const at = source.indexOf(term);
  if (at < 0) return "";
  const start = source.lastIndexOf(startText, at);
  if (start < 0 || at - start > limit) return "";
  return source.slice(start, at + term.length).trim();
}
function scope(source) {
  const raw = String(source || "");
  // §1.1 and §1.2 must begin at the FIRST official definition, not at a
  // later page which only contains the continuation of the unit.
  const intro = between(raw, "Οργανική χημεία ονομάζεται", "Ονοματολογία άκυκλων οργανικών ενώσεων");
  if (intro.length < 3000 || !intro.includes("Ταξινόμηση οργανικών ενώσεων")) {
    return { ok: false, error: "epal_chemistry_b_1_1_1_2_not_verified" };
  }

  // Only verified textbook examples for saturated hydrocarbons. Do not
  // ingest its unsaturated-hydrocarbon or alcohol/aldehyde nomenclature.
  const straight = between(raw, "Έχει 3 άτομα C: προπ-", "Έχει 4 άτομα C: βουτ-");
  const branch = excerptBefore(raw, "2-μεθυλοβουτάνιο", "18 Γενικό μέρος α.", 240);
  const otherBranch = excerptBefore(raw, "2,4-διμεθυλοεξάνιο", "β. CH", 180);
  if (!straight.includes("Είναι κορεσμένη: -αν-") ||
      !straight.includes("Δηλαδή, προπάνιο") ||
      !branch.includes("2-μεθυλοβουτάνιο") ||
      !otherBranch.includes("2,4-διμεθυλοεξάνιο")) {
    return { ok: false, error: "epal_chemistry_b_saturated_examples_not_verified" };
  }

  // The boundary is the FIRST definition of positional isomerism. Anything
  // after that heading (including stereoisomerism) is not in this unit.
  const chain = between(raw, "• Ισομέρεια αλυσίδας ονομάζεται", "• Ισομέρεια θέσης ονομάζεται");
  if (chain.length < 400 || !chain.includes("πεντάνιο") || !chain.includes("μεθυλοβουτάνιο")) {
    return { ok: false, error: "epal_chemistry_b_chain_isomerism_not_verified" };
  }

  const text = [
    "§1.1–1.2 · Εισαγωγή στην οργανική χημεία και ταξινόμηση οργανικών ενώσεων",
    intro,
    "§1.3 · Μόνο ονοματολογία κορεσμένων υδρογονανθράκων",
    straight, branch, otherBranch,
    "§1.4 · Μόνο ισομέρεια αλυσίδας",
    chain
  ].join("\n\n");
  if (/1-βουτένιο|3-βουτινικό οξύ|3-βουτεν-2-όλη|Στερεοϊσομέρεια:/i.test(text)) {
    return { ok: false, error: "epal_chemistry_b_out_of_scope_text_detected" };
  }
  return {
    ok: true,
    text,
    excluded: ["§1.3 Ονοματολογία ακόρεστων υδρογονανθράκων, αλκοολών και λοιπών ενώσεων",
      "§1.4 Ισομέρεια θέσης, ομόλογης σειράς και στερεοϊσομέρεια"],
    section: "§1.1–1.2, §1.3 μόνο κορεσμένοι υδρογονάνθρακες, §1.4 μόνο ισομέρεια αλυσίδας"
  };
}

module.exports = Object.freeze({ selected, scope, SUBJECT, TOPIC });
