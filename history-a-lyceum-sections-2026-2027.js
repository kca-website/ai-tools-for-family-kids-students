"use strict";

// Ιστορία Α΄ ΓΕΛ — «Ιστορία του Αρχαίου Κόσμου» (ebooks.edu.gr 8547/2696, εμπλουτισμένο HTML).
// Each AI Study topic (official 2026–27 exam scope, gel-2026-2027-update.js) is linked to the
// official book page(s) that teach it. When several topics share one long page, `start` / `end`
// are the book's own bold subsection headings: the runtime keeps only the text between them and
// fails closed if a heading is no longer found. Verified against the live book on 2026-10-06.
const BASE = "https://lb1.ebooks.edu.gr/ebooks/v/html/8547/2696/Istoria_A-Lykeiou_html-empl/";

const page = (file, start = "", end = "") => ({ file, start, end });

const SECTIONS = Object.freeze([
  { label: "Αίγυπτος: οικονομική, κοινωνική και πολιτική οργάνωση", pages: [page("indexI2_2.html")], verify: "Οικονομική, κοινωνική και πολιτική οργάνωση" },
  { label: "Αίγυπτος: πολιτισμός", pages: [page("indexI2_4.html")], verify: "Ο πολιτισμός" },
  { label: "Μυκηναϊκός πολιτισμός", pages: [page("indexII1_2.html")], verify: "Ο μυκηναϊκός πολιτισμός" },
  { label: "Ομηρική εποχή και πρώτος ελληνικός αποικισμός", pages: [page("indexII2_1.html", "", "Οικονομική, κοινωνική και πολιτική οργάνωση.")], verify: "Ο πρώτος ελληνικός αποικισμός" },
  { label: "Ομηρική εποχή: οικονομική, κοινωνική και πολιτική οργάνωση", pages: [page("indexII2_1.html", "Οικονομική, κοινωνική και πολιτική οργάνωση.", "Ο πολιτισμός.")], verify: "Η πολιτική οργάνωση" },
  { label: "Ομηρική εποχή: πολιτισμός", pages: [page("indexII2_1.html", "Ο πολιτισμός.")], verify: "Ο πολιτισμός" },
  { label: "Αρχαϊκή εποχή και πόλη-κράτος", pages: [page("indexII2_2.html", "", "Ο πολιτισμός.")], verify: "Η γένεση της πόλης-κράτους" },
  { label: "Κλασική εποχή: Δηλιακή Συμμαχία και αθηναϊκή ηγεμονία", pages: [page("indexII2_3.html", "", "Η εποχή του Περικλή.")], verify: "Η συμμαχία της Δήλου" },
  { label: "Περικλής και αθηναϊκή δημοκρατία", pages: [page("indexII2_3.html", "Η εποχή του Περικλή.", "Ο Πελοποννησιακος πόλεμος")], verify: "Η εποχή του Περικλή" },
  { label: "Πελοποννησιακός πόλεμος", pages: [page("indexII2_3.html", "Ο Πελοποννησιακος πόλεμος", "Η κρίση της πόλης-κράτους.")], verify: "Πελοποννησιακος πόλεμος" },
  { label: "Κρίση της πόλης-κράτους και πανελλήνια ιδέα", pages: [page("indexII2_3.html", "Η κρίση της πόλης-κράτους.", "Ο Φίλιππος Β και η ένωση των Ελλήνων.")], verify: "Η πανελλήνια ιδέα" },
  { label: "Φίλιππος Β΄ και άνοδος της Μακεδονίας", pages: [page("indexII2_3.html", "Ο Φίλιππος Β και η ένωση των Ελλήνων.", "Το οικουμενικό κράτος του Μ. Αλεξάνδρου.")], verify: "Ο Φίλιππος Β" },
  { label: "Μέγας Αλέξανδρος και εκστρατεία στην Ανατολή", pages: [page("indexII2_3.html", "Το οικουμενικό κράτος του Μ. Αλεξάνδρου.", "Ο πολιτισμός.")], verify: "Το έργο του Μ. Αλεξάνδρου" },
  { label: "Πολιτισμός κλασικών χρόνων", pages: [page("indexII2_3.html", "Ο πολιτισμός.", "Ο Ελληνισμός στη Δυτική και Ανατολική Μεσόγειο.")], verify: "Αρχιτεκτονική" },
  { label: "Ελληνιστικός κόσμος: βασικά χαρακτηριστικά", pages: [page("indexIII1_2.html")], verify: "Τα βασίλεια της Ανατολής" },
  { label: "Ελληνιστικά κέντρα και ελληνιστική κοινή", pages: [page("indexIII2_1.html"), page("indexIII2_2.html")], verify: "Η Αλεξάνδρεια" },
  { label: "Ίδρυση και οργάνωση της Ρώμης", pages: [page("indexIV3_3.html")], verify: "Ρώμη" },
  { label: "Ρωμαϊκή πολιτεία και κοινωνία", pages: [page("indexIV3_4.html")], verify: "Res publica" },
  { label: "Τιβέριος και Γάιος Γράκχος", pages: [page("indexV2_2.html")], verify: "Γράκχ" },
  { label: "Οκταβιανός Αύγουστος: συγκέντρωση εξουσίας και μεταρρυθμίσεις", pages: [page("indexVI1_1.html")], verify: "Η ισχυροποίηση της κεντρικής εξουσίας" },
  { label: "Διάδοχοι του Αυγούστου και αυτοκρατορικό σύστημα", pages: [page("indexVI1_2.html")], verify: "διάδοχοι του Αυγούστου" },
  { label: "Κρίση του 3ου αιώνα μ.Χ.", pages: [page("indexVI2_1.html"), page("indexVI2_2.html"), page("indexVI2_3.html"), page("indexVI2_4.html")], verify: "Η κρίση του αυτοκρατορικού θεσμού" },
  { label: "Διοκλητιανός και αναδιοργάνωση της αυτοκρατορίας", pages: [page("indexVII1_1.html")], verify: "Διοκλητιαν" },
  { label: "Μέγας Κωνσταντίνος και εκχριστιανισμός", pages: [page("indexVII1_2.html")], verify: "Εκχριστιανισμός" },
  { label: "Εξελληνισμός του Ανατολικού Ρωμαϊκού κράτους", pages: [page("indexVII1_4.html")], verify: "εξελληνισμός" },
  { label: "Ελληνοχριστιανική οικουμένη", pages: [page("indexVII2_2.html")], verify: "ελληνοχριστιανική οικουμένη" }
]);

const fold = (value) => String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const byLabel = new Map(SECTIONS.map((s) => [fold(s.label), s]));

function get(topic) {
  return byLabel.get(fold(topic)) || null;
}

function urlsFor(topic) {
  const spec = get(topic);
  return spec ? spec.pages.map((p) => new URL(p.file, BASE).toString()) : [];
}

const strongText = (html) => fold(String(html || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " "));

// Keeps the official HTML between the subsection headings `start` (inclusive) and `end`
// (exclusive), always without the book's navigation menus. Returns "" when a required heading
// is missing, so callers fail closed.
function scopePageHtml(html, pageSpec) {
  const raw = String(html || "");
  if (!raw || !pageSpec) return "";
  const strongs = [...raw.matchAll(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi)]
    .map((m) => ({ index: m.index, text: strongText(m[1]) }));
  // The body (after the navigation menus) starts at the page's main container.
  const bodyTag = /<[^>]*id="eclass_ebook_body"[^>]*>/i.exec(raw);
  const bodyAt = bodyTag ? bodyTag.index + bodyTag[0].length : 0;
  let from = bodyAt;
  if (pageSpec.start) {
    const hit = strongs.find((s) => s.index > bodyAt && s.text.startsWith(fold(pageSpec.start)));
    if (!hit) return "";
    from = hit.index;
  }
  let to = raw.length;
  if (pageSpec.end) {
    const hit = strongs.find((s) => s.index > from && s.text.startsWith(fold(pageSpec.end)));
    if (!hit) return "";
    to = hit.index;
  }
  return `<html><body><div id="eclass_ebook_body">${raw.slice(from, to)}</div></body></html>`;
}

module.exports = Object.freeze({ BASE, SECTIONS, get, urlsFor, scopePageHtml, labels: SECTIONS.map((s) => s.label) });
