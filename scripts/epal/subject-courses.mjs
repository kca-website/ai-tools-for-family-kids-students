// Site EPAL subject label → official ebooks.edu.gr course title(s) for the SAME grade.
// Exact (normalised) title matches are automatic; this table only covers labels whose
// wording differs from the official course title on ebooks.edu.gr. Every entry names an
// official course that exists in the grade's inventory (validated by the build).
import { normalizeTitle, courseLabelOf, isStudentBook } from "./lib.mjs";

export const COURSE_ALIASES = Object.freeze({
  "a|Μαθηματικά (Άλγεβρα + Γεωμετρία)": ["ΑΛΓΕΒΡΑ", "ΓΕΩΜΕΤΡΙΑ"],
  "a|Σχολικός Επαγγελματικός Προσανατολισμός – Ασφάλεια & Υγεία στον Χώρο Εργασίας": ["ΣΧΟΛΙΚΟΣ ΕΠΑΓΓΕΛΜΑΤΙΚΟΣ ΠΡΟΣΑΝΑΤΟΛΙΣΜΟΣ - ΑΣΦΑΛΕΙΑ & ΥΓΕΙΑ ΣΤΟ ΧΩΡΟ ΕΡΓΑΣΙΑΣ"],
  "a|Αρχές Ηλεκτρολογίας και Ηλεκτρονικής": ["ΑΡΧΕΣ ΗΛΕΚΤΡΟΛΟΓΙΑΣ & ΗΛΕΚΤΡΟΝΙΚΗΣ"],
  "b|Μαθηματικά (Άλγεβρα + Γεωμετρία)": ["ΑΛΓΕΒΡΑ", "ΓΕΩΜΕΤΡΙΑ"],
  "b|Στοιχεία Γεωργικών Εγκαταστάσεων & Γεωργικά Μηχανήματα": ["ΣΤΟΙΧΕΙΑ ΓΕΩΡΓΙΚΩΝ ΕΓΚΑΤΑΣΤΑΣΕΩΝ ΚΑΙ ΓΕΩΡΓΙΚΑ ΜΗΧΑΝΗΜΑΤΑ"],
  "b|Εσωτερικές Ηλεκτρικές Εγκαταστάσεις και Ηλεκτρολογικό Σχέδιο": ["ΕΣΩΤΕΡΙΚΕΣ ΗΛΕΚΤΡΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ & ΗΛΕΚΤΡΟΛΟΓΙΚΟ ΣΧΕΔΙΟ"],
  "b|Μηχανική-Αντοχή Υλικών": ["ΜΗΧΑΝΙΚΗ - ΑΝΤΟΧΗ ΤΩΝ ΥΛΙΚΩΝ"],
  "b|Ναυπηγία – Ευστάθεια – Πρόωση": ["ΝΑΥΠΗΓΕΙΑ - ΕΥΣΤΑΘΕΙΑ - ΠΡΟΩΣΗ"],
  "b|Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων": ["ΛΕΙΤΟΥΡΓΙΚΑ ΣΥΣΤΗΜΑΤΑ & ΑΣΦΑΛΕΙΑ ΠΛΗΡΟΦΟΡΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ"],
  "b|Τεχνικά Θέματα Πωλήσεων & Προδιαγραφών Υλικού και Λογισμικού": ["ΤΕΧΝΙΚΑ ΘΕΜΑΤΑ ΠΩΛΗΣΕΩΝ ΚΑΙ ΠΡΟΔΙΑΓΡΑΦΩΝ ΥΛΙΚΟΥ ΚΑΙ ΛΟΓΙΣΜΙΚΟΥ"],
  "b|Ανατομία-Φυσιολογία I": ["ΑΝΑΤΟΜΙΑ - ΦΥΣΙΟΛΟΓΙΑ Ι"],
  "b|Εργασιακό Περιβάλλον Τομέα": ["ΕΡΓΑΣΙΑΚΟ ΠΕΡΙΒΑΛΛΟΝ"],
  "b|Δημιουργική Απασχόληση στην Προσχολική Ηλικία I": ["ΔΗΜΙΟΥΡΓΙΚΗ ΑΠΑΣΧΟΛΗΣΗ ΣΤΗΝ ΠΡΟΣΧΟΛΙΚΗ ΗΛΙΚΙΑ Ι"],
  "b|Οδοντοτεχνία Ι": ["ΟΔΟΝΤΟΤΕΧΝΙΑ"],
  "c|Μαθηματικά (Άλγεβρα + Γεωμετρία)": ["ΑΛΓΕΒΡΑ", "ΓΕΩΜΕΤΡΙΑ"],
  "c|Εφαρμογές Marketing": ["ΕΦΑΡΜΟΓΕΣ ΜΑΡΚΕΤΙΝΓΚ"],
  "c|Ποιοτικός Έλεγχος Υφάσματος": ["ΠΟΙΟΤΙΚΟΣ ΕΛΕΓΧΟΣ ΥΦΑΣΜΑΤΩΝ"],
  "c|Τεχνολογία Παραγωγή Ενδυμάτων": ["ΤΕΧΝΟΛΟΓΙΑ ΠΑΡΑΓΩΓΗΣ ΕΝΔΥΜΑΤΩΝ"],
  "c|Ηλεκτροτεχνία 2": ["ΗΛΕΚΤΡΟΤΕΧΝΙΑ ΙΙ"],
  "c|Ηλεκτρολογικές Εγκαταστάσεις 2": ["ΗΛΕΚΤΡΟΛΟΓΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ ΙΙ"],
  "c|Σύστημα Ελέγχου, Ρύθμισης και Αυτοματισμού Εγκαταστάσεων Ψύξης και Κλιματισμού": ["ΣΥΣΤΗΜΑΤΑ ΕΛΕΓΧΟΥ, ΡΥΘΜΙΣΗΣ ΚΑΙ ΑΥΤΟΜΑΤΙΣΜΟΥ ΕΓΚ/ΣΕΩΝ ΨΥΞΗΣ ΚΑΙ ΚΛΙΜΑΤΙΣΜΟΥ"],
  "c|Μηχανολογική Σχεδίαση Εγκαταστάσεων Ψύξης και Κλιματισμού": ["ΜΗΧΑΝΟΛΟΓΙΚΗ ΣΧΕΔΙΑΣΗ ΕΓΚ/ΣΕΩΝ ΨΥΞΗΣ ΚΑΙ ΚΛΙΜΑΤΙΣΜΟΥ"],
  "c|Κινητήρες Αεροσκαφών (Εργαστήριο)": ["ΚΙΝΗΤΗΡΕΣ ΑΕΡΟΣΚΑΦΩΝ"],
  "c|Ναυτικές Μηχανές": ["ΝΑΥΤΙΚΗ ΜΗΧΑΝΟΛΟΓΙΑ - ΕΦΑΡΜΟΓΕΣ"],
  "c|Ν.Η.Ο. – Επικοινωνίες": ["ΝΑΥΤΙΚΑ ΗΛΕΚΤΡΟΝΙΚΑ ΟΡΓΑΝΑ - ΕΠΙΚΟΙΝΩΝΙΕΣ"],
  "c|Προγραμματισμός Υπολογιστών (Εργαστήριο)": ["ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ ΥΠΟΛΟΓΙΣΤΩΝ"],
  "c|Δίκτυα Υπολογιστών (Εργαστήριο)": ["ΔΙΚΤΥΑ ΥΠΟΛΟΓΙΣΤΩΝ"],
  "c|Τεχνική Υποστήριξη Υπολογιστικών Συστημάτων και Δικτυακών Υποδομών": ["ΤΕΧΝΙΚΗ ΥΠΟΣΤΗΡΙΞΗ ΠΛΗΡΟΦΟΡΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ ΚΑΙ ΔΙΚΤΥΑΚΩΝ ΥΠΟΔΟΜΩΝ"],
  "c|Νεώτερες Απεικονιστικές Μέθοδοι": ["ΝΕΟΤΕΡΕΣ ΑΠΕΙΚΟΝΙΣΤΙΚΕΣ ΜΕΘΟΔΟΙ"],
  "c|Αγωγή Βρέφους & Νηπίου": ["ΑΓΩΓΗ ΒΡΕΦΟΥΣ ΚΑΙ ΝΗΠΙΟΥ"],
  "c|Στοιχεία Γενικής και Εξελικτικής Ψυχολογίας": ["ΣΤΟΙΧΕΙΑ ΓΕΝΙΚΗΣ & ΕΞΕΛΙΚΤΙΚΗΣ ΨΥΧΟΛΟΓΙΑΣ"],
  "c|Νοσηλευτική II": ["ΝΟΣΗΛΕΥΤΙΚΗ ΙΙ"],
  "c|Ακίνητη Προσθετική": ["ΑΚΙΝΗΤΗ ΠΡΟΣΘΕΤΙΚΗ - ΠΟΡΣΕΛΑΝΗ"],
  "c|Ακίνητη Προσθετική και Πορσελάνη": ["ΑΚΙΝΗΤΗ ΠΡΟΣΘΕΤΙΚΗ - ΠΟΡΣΕΛΑΝΗ"]
});

// Courses that, per the official sources, have no student textbook (activity-based or
// workshop courses). They are reported separately instead of being mapped.
export const NO_OFFICIAL_TEXTBOOK = Object.freeze({
  "Φυσική Αγωγή": "Δεν διανέμεται σχολικό βιβλίο μαθητή για τη Φυσική Αγωγή ΕΠΑΛ στο ebooks.edu.gr.",
  "Ζώνη Δημιουργικών Δραστηριοτήτων": "Η Ζώνη Δημιουργικών Δραστηριοτήτων δεν έχει σχολικό βιβλίο· διδάσκεται με σχέδια δράσης."
});

// Books from another grade that the official ΙΕΠ guidance «Ύλη – Οδηγίες Διδασκαλίας μαθημάτων
// Γενικής Παιδείας Α΄, Β΄, Γ΄ ΕΠΑ.Λ. 2026–27» explicitly assigns to the EPAL course.
export const GUIDANCE_EXTRA_BOOKS = Object.freeze({
  "a|Πολιτική Παιδεία": [{ file: /Oikonomika_G-Gymnasiou_Vivlio-Mathiti/, why: "Πολιτική Παιδεία Α΄: ενότητες του 5ου κεφ. από «Οικονομικά Γ΄ Γυμνασίου»" }],
  "b|Μαθηματικά (Άλγεβρα + Γεωμετρία)": [{ file: /Eukleideia-Geometria_A-Lykeiou_Vivlio-Mathiti/, why: "Γεωμετρία Β΄: Κεφ. 5 από «Ευκλείδεια Γεωμετρία Α΄ ΓΕΛ»" }],
  "b|Χημεία": [{ file: /Chimeia_A-Lykeiou_Vivlio-Mathiti/, why: "Χημεία Β΄: Κεφ. 4 από «Χημεία Α΄ Λυκείου»" }]
});

// Candidate official student books for a (grade, site subject label).
export function candidateBooks(inventory, grade, subjectLabel) {
  const course = courseLabelOf(subjectLabel);
  const alias = COURSE_ALIASES[`${grade}|${subjectLabel}`] || COURSE_ALIASES[`${grade}|${course}`] || null;
  const wanted = new Set((alias || [course]).map(normalizeTitle));
  const extra = (GUIDANCE_EXTRA_BOOKS[`${grade}|${subjectLabel}`] || [])
    .map((x) => inventory.find((b) => x.file.test(b.file))).filter(Boolean);
  const books = [...new Map([...inventory.filter((b) => b.grade === grade && isStudentBook(b) &&
    b.courses.some((c) => wanted.has(normalizeTitle(c)))), ...extra].map((b) => [b.downloadUrl, b])).values()];
  const matchedCourses = [...new Set(books.flatMap((b) => b.courses).filter((c) => wanted.has(normalizeTitle(c))))];
  return { course, alias, books, matchedCourses, wanted: [...wanted] };
}

// «ΔΙΔΑΚΤΙΚΗ ΕΝΟΤΗΤΑ N» is the numbering of the official curriculum, not of the book. Each unit
// is grounded only through the «ΒΙΒΛΙΑ / ΚΕΦΑΛΑΙΑ» column of the official ΙΕΠ guidance
// «Ύλη – Οδηγίες Διδασκαλίας μαθημάτων Ειδικότητας ΕΠΑ.Λ. 2026–27» (Τομέας Ηλεκτρολογίας,
// Ηλεκτρονικής και Αυτοματισμού). The cited paragraphs / printed pages were converted to PDF
// pages through the book's own table of contents (Στοιχεία Ηλεκτρολογίας: PDF = printed + 13;
// Στοιχεία Εσωτερικών Ηλ. Εγκαταστάσεων: PDF = printed + 1); `heading` must be on the first
// PDF page. Units without a citation stay unmapped.
export const GUIDANCE_UNIT_MAP = Object.freeze([
  {
    grade: "a",
    subject: /^Αρχές Ηλεκτρολογίας και Ηλεκτρονικής$/,
    book: /Stoicheia-Ilektrologias_A-B-EPAL_Vivlio-Mathiti/,
    citedBook: "Στοιχεία Ηλεκτρολογίας",
    units: {
      2: { pdf: [18, 36], heading: "1.1 Δομή του ατόμου", cite: "Κεφ. 1, §1.1–1.5 (σελ. 5–23)" },
      3: { pdf: [36, 45], heading: "1.6 Το ηλεκτρικό κύκλωμα", cite: "Κεφ. 1, §1.6–1.8 (σελ. 23–32)" },
      4: { pdf: [45, 55], heading: "1.9 Η ηλεκτρική αντίσταση", cite: "Κεφ. 1, §1.9 (σελ. 32–42)" },
      5: { pdf: [59, 89], heading: "2.1 Ο νόμος του Ωμ", cite: "Κεφ. 2, §2.1–2.3 (σελ. 46–76)" },
      6: { pdf: [93, 107], heading: "3.1 Μηχανική ενέργεια και ισχύς", cite: "Κεφ. 3, §3.1–3.4 (σελ. 80–94)" },
      7: { pdf: [118, 121], heading: "4.1 Συνεχές και εναλλασσόμενο ρεύμα", cite: "Κεφ. 4, §4.1 (σελ. 105–108)" },
      8: { pdf: [132, 175], heading: "4.6 Ο πυκνωτής", cite: "Κεφ. 4 §4.6 και Κεφ. 5 §5.1–5.7 (σελ. 119–162)" },
      9: { pdf: [185, 251], heading: "6.2 Δομή μιας ηλεκτρικής εγκατάστασης", cite: "Κεφ. 6 §6.2–6.8 και Κεφ. 7 §7.1–7.4 (σελ. 172–238)" },
      10: { pdf: [256, 313], heading: "8.1 Γεννήτριες", cite: "Κεφ. 8, §8.1–8.8 (σελ. 243–300)" },
      11: { pdf: [316, 377], heading: "9.1 Εισαγωγή", cite: "Κεφ. 9, §9.1–9.7 (σελ. 303–364)" }
    },
    uncited: { 1: "Η επίσημη εγκύκλιος δεν παραπέμπει σε κεφάλαιο βιβλίου για τη Διδακτική Ενότητα 1." }
  },
  {
    grade: "b",
    subject: /Εσωτερικές Ηλεκτρικές Εγκαταστάσεις και Ηλεκτρολογικό Σχέδιο$/,
    book: /Stoicheia-Esoterikon-Ilektrikon-Egkatastaseon-kai-Ilektrologikou-Schediou_B-EPAL_Vivlio-Mathiti/,
    citedBook: "Στοιχεία Εσωτερικών Ηλεκτρικών Εγκαταστάσεων και Ηλεκτρολογικού Σχεδίου",
    units: {
      1: { pdf: [27, 60], heading: "1.2 ΕΙΣΑΓΩΓΗ ΣΤΟ ΤΕΧΝΙΚΟ ΣΧΕΔΙΟ", cite: "Κεφ. 1, §1.2–1.5 (σελ. 26–59)" },
      2: { pdf: [116, 130], heading: "ΚΕΦΑΛΑΙΟ 4 Συνδεσμολογίες κυκλωμάτων φωτισμού", cite: "Κεφ. 4, σελ. 116–121 και 127–129" },
      3: { pdf: [130, 135], heading: "ΠΑΡΑΣΤΑΤΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΣΕ ΠΡΟΟΠΤΙΚΟ ΣΧΕΔΙΟ", cite: "Κεφ. 4, σελ. 129–134" },
      4: { pdf: [135, 140], heading: "ΠΑΡΑΣΤΑΤΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΣΕ ΠΡΟΟΠΤΙΚΟ ΣΧΕΔΙΟ", cite: "Κεφ. 4, σελ. 134–139" },
      5: { pdf: [189, 203], heading: "6.5 ΘΥΡΟΤΗΛΕΦΩΝΟ", cite: "Κεφ. 6, §6.5.1–6.7.3 (σελ. 188–202)" },
      6: { pdf: [189, 203], heading: "6.5 ΘΥΡΟΤΗΛΕΦΩΝΟ", cite: "Κεφ. 6, §6.5.1–6.7.3 (σελ. 188–202)" }
    },
    uncited: {}
  }
]);

export function guidanceUnitSpec(grade, subjectLabel, number) {
  const entry = GUIDANCE_UNIT_MAP.find((e) => e.grade === grade && e.subject.test(subjectLabel));
  if (!entry) return null;
  if (entry.units[number]) return { ...entry.units[number], book: entry.book, citedBook: entry.citedBook };
  return { uncited: entry.uncited[number] || "Η επίσημη εγκύκλιος δεν αντιστοιχίζει την ενότητα σε κεφάλαιο βιβλίου." }
}
