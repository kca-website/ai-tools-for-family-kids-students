"use strict";

// Γυμνάσιο: explicit AI Study topic → official ebooks.edu.gr page(s) for subjects whose topics were
// hidden because no exact section was listed. Each topic points to every page of the book that
// teaches it (a chapter topic → all of its subsections). Pages were checked against the book's
// own table of contents on 2026-10-06. Topics without a matching book section are left out on
// purpose (fail closed): Βιολογία Α΄ «Επιστήμη της Βιολογίας…» (the book has no such section),
// Φυσική Α΄ «Μέτρηση όγκου» / «Μέτρηση πυκνότητας» (not among the book's 12 chapters).
(function (root) {
  const BIO_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/";
  const BIO_BG = "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/";
  const PHYS_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2314/Fysiki_A-Gymnasiou_html-empl/";
  const GEO_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2286/Geografia_A-Gymnasiou_html-empl/";
  const pages = (base, ...files) => files.map((f) => base + f);
  const range = (base, prefix, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${base}${prefix}${from + i}.html`);

  const SUBJECTS = Object.freeze({
    "biologia-a-gymnasiou": Object.freeze({
      "Οργάνωση της ζωής: χαρακτηριστικά οργανισμών": pages(BIO_A, "index1_1.html"),
      "Κύτταρο: η μονάδα της ζωής": pages(BIO_A, "index1_2.html"),
      "Οργάνωση πολυκύτταρων οργανισμών": pages(BIO_A, "index1_3.html"),
      "Αλληλεπιδράσεις και προσαρμογές (προαιρετικό)": pages(BIO_A, "index1_4.html"),
      "Φωτοσύνθεση": pages(BIO_A, "index2_1.html"),
      "Πρόσληψη ουσιών και πέψη": range(BIO_A, "index2_", 2, 4),
      "Μεταφορά και αποβολή ουσιών": range(BIO_A, "index3_", 1, 4),
      "Αναπνοή στους οργανισμούς και στον άνθρωπο": range(BIO_A, "index4_", 1, 4),
      "Κεφ. 1: Οργάνωση της ζωής: χαρακτηριστικά οργανισμών, κύτταρο, πολυκύτταρη οργάνωση, ταξινόμηση, προσαρμογές": range(BIO_A, "index1_", 1, 4),
      "Κεφ. 2: Πρόσληψη ουσιών και πέψη: φωτοσύνθεση, μονοκύτταροι, ζωικοί οργανισμοί, άνθρωπος": range(BIO_A, "index2_", 1, 4),
      "Κεφ. 3: Μεταφορά και αποβολή ουσιών": range(BIO_A, "index3_", 1, 4),
      "Κεφ. 4: Αναπνοή": range(BIO_A, "index4_", 1, 4),
      "Κεφ. 5: Στήριξη και κίνηση": range(BIO_A, "index5_", 1, 4),
      "Κεφ. 6: Αναπαραγωγή": range(BIO_A, "index6_", 1, 4),
      "Κεφ. 7: Ερεθιστικότητα: νευρικό σύστημα, αισθητήρια όργανα, ενδοκρινικό σύστημα": range(BIO_A, "index7_", 1, 4)
    }),
    "biologia-g-gymnasiou": Object.freeze({
      "Μόρια της ζωής": pages(BIO_BG, "index1_1.html"),
      "Κύτταρο: η μονάδα της ζωής": pages(BIO_BG, "index1_2.html"),
      "Ισορροπία και λειτουργία οικοσυστημάτων": range(BIO_BG, "index2_", 1, 3),
      "Γενετικό υλικό, γονίδια και χρωμοσώματα": pages(BIO_BG, "index5_1.html"),
      "Ροή γενετικής πληροφορίας και αλληλόμορφα": pages(BIO_BG, "index5_2.html", "index5_3.html"),
      "Κυτταρική διαίρεση και κληρονομικότητα": pages(BIO_BG, "index5_4.html", "index5_5.html"),
      "Μεταλλάξεις": pages(BIO_BG, "index5_6.html"),
      "Εξέλιξη και εξέλιξη του ανθρώπου": pages(BIO_BG, "index7_1.html", "index7_2.html"),
      "Γ΄ · 5.1 — Το γενετικό υλικό οργανώνεται σε χρωμοσώματα": pages(BIO_BG, "index5_1.html"),
      "Γ΄ · 5.5 — Κληρονομικότητα": pages(BIO_BG, "index5_5.html"),
      "Γ΄ · 7.1 — Η εξέλιξη και οι μαρτυρίες της": pages(BIO_BG, "index7_1.html"),
      // Prerequisite unit taught from the Α΄ Γυμνασίου book.
      "Α΄ · 6.1 — Αναπαραγωγή (προαπαιτούμενη βασική έννοια)": pages(BIO_A, "index6_1.html")
    }),
    "fysiki-a-gymnasiou": Object.freeze({
      "Μετρήσεις μήκους και μέση τιμή": pages(PHYS_A, "index1.html"),
      "Μετρήσεις χρόνου και ακρίβεια": pages(PHYS_A, "index2.html"),
      "Μετρήσεις μάζας και διαγράμματα": pages(PHYS_A, "index3.html"),
      "Θερμοκρασία και βαθμονόμηση": pages(PHYS_A, "index4.html"),
      "Θερμότητα, θερμοκρασία και θερμική ισορροπία": pages(PHYS_A, "index5.html"),
      "Ηλεκτρικό βραχυκύκλωμα και ασφάλεια": pages(PHYS_A, "index10.html"),
      "Από τον ηλεκτρισμό στον μαγνητισμό": pages(PHYS_A, "index11.html"),
      "Από τον μαγνητισμό στον ηλεκτρισμό": pages(PHYS_A, "index12.html")
    }),
    "geografia-a-gymnasiou": Object.freeze({
      "Χάρτες: είδη, υπόμνημα και κλίμακα": pages(GEO_A, "matA1_3.html", "matA1_4.html", "matA1_5.html"),
      "Γεωγραφικές συντεταγμένες και προσανατολισμός": pages(GEO_A, "matA1_1.html", "matA1_2.html"),
      "Η Γη στο ηλιακό σύστημα": pages(GEO_A, "matB1_1.html"),
      "Λιθόσφαιρα: ανάγλυφο και τεκτονικές πλάκες": pages(GEO_A, "matB4_2.html", "matB4_3.html", "matB4_4.html"),
      "Υδρόσφαιρα: ωκεανοί, θάλασσες και ποτάμια": pages(GEO_A, "matB3_1.html", "matB3_2.html", "matB3_4.html"),
      "Ατμόσφαιρα, καιρός και κλίμα": pages(GEO_A, "matB2_1.html", "matB2_2.html"),
      "Βιόσφαιρα και φυσικά οικοσυστήματα": pages(GEO_A, "matB5_1.html"),
      "Ανθρωπογενές περιβάλλον: πληθυσμός και οικισμοί": pages(GEO_A, "matC1_1.html", "matC1_2.html", "matC1_4.html", "matC1_5.html"),
      "Ήπειροι: συνθετική εργασία (προαιρετική εμβάθυνση)": range(GEO_A, "matD", 1, 7).map((u) => u.replace(/\.html$/, "_0.html"))
    })
  });

  // PDF-only books: [label, first PDF page, last PDF page, heading printed on the first page].
  // Θρησκευτικά Γυμνασίου: no 2026–27 IEP restriction is published for the course, so every
  // thematic unit of the current official book is in scope.
  const PDF_SUBJECTS = Object.freeze({
    "thriskeftika-a-gymnasiou": Object.freeze({
      title: "Θρησκευτικά Α΄ Γυμνασίου — Ένα ταξίδι ζωής: Η συνάντηση Θεού και ανθρώπου μέσα από τις βιβλικές διηγήσεις",
      viewUrl: "https://ebooks.edu.gr/ebooks/v/pdf/8547/5229/21-0201-01_V3_Thriskeutika_A-Gymnasiou_Vivlio-Mathiti/",
      downloadUrl: "https://ebooks.edu.gr/ebooks/d/8547/5229/21-0201-01_V3_Thriskeutika_A-Gymnasiou_Vivlio-Mathiti.pdf",
      units: Object.freeze([
        ["Α΄ Θεματική Ενότητα — Η Αγία Γραφή: Η συνάντηση Θεού και ανθρώπου καταγράφεται σε κείμενα", 7, 22, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Αγία Γραφή: Η συνάντηση"],
        ["Β΄ Θεματική Ενότητα — Θεός και άνθρωπος στην Ορθόδοξη Παράδοση: μια σχέση ζωής", 23, 40, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Θεός και άνθρωπος στην Ορθόδοξη"],
        ["Γ΄ Θεματική Ενότητα — Πού είναι ο Θεός; Η σχέση ζωής περνάει μέσα από δοκιμασίες", 41, 56, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Πού είναι ο Θεός; Η"],
        ["Δ΄ Θεματική Ενότητα — Ο Θεός γίνεται άνθρωπος: Το πιο συγκλονιστικό γεγονός της ιστορίας του ανθρώπου", 57, 93, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ο Θεός γίνεται άνθρωπος: Το"],
        ["Ε΄ Θεματική Ενότητα — Ένας καινούριος κόσμος ξεπροβάλλει: Χριστός ανέστη!", 94, 113, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ένας καινούριος κόσμος ξεπροβάλλει: Χριστός"],
        ["ΣΤ΄ Θεματική Ενότητα — Η Εκκλησία μεταμορφώνει τον κόσμο", 114, 132, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ H Εκκλησία μεταμορφώνει τον κόσμο"],
        ["Ζ΄ Θεματική Ενότητα — Η Εκκλησία ως κιβωτός σ’ ένα ταξίδι χωρίς τέλος", 133, 152, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Εκκλησία ως κιβωτός σ’"]
      ])
    }),
    "thriskeftika-g-gymnasiou": Object.freeze({
      title: "Θρησκευτικά Γ΄ Γυμνασίου — Η μαρτυρία της Ορθόδοξης Εκκλησίας στον σύγχρονο κόσμο",
      viewUrl: "https://ebooks.edu.gr/ebooks/v/pdf/8547/5231/21-0221-01_V1_Thriskeutika_G-Gymnasiou_Vivlio-Mathiti/",
      downloadUrl: "https://ebooks.edu.gr/ebooks/d/8547/5231/21-0221-01_V1_Thriskeutika_G-Gymnasiou_Vivlio-Mathiti.pdf",
      units: Object.freeze([
        ["Α΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σήμερα", 6, 11, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Ορθόδοξη Εκκλησία σήμερα"],
        ["Β΄ Θεματική Ενότητα — Η πρόταση ζωής της Ορθόδοξης Εκκλησίας", 12, 30, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η πρόταση ζωής της Ορθόδοξης"],
        ["Γ΄ Θεματική Ενότητα — Ιεραποστολή και Διακονία: Η ζωή της Ορθόδοξης Εκκλησίας αγκαλιάζει τον κόσμο ολάκερο!", 31, 34, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ιεραποστολή και Διακονία: Η ζωή"],
        ["Δ΄ Θεματική Ενότητα — Ο σεβασμός του άλλου στην Ορθόδοξη παράδοση", 35, 41, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ο σεβασμός του άλλου στην"],
        ["Ε΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σε διάλογο με τον δυτικό Χριστιανισμό", 42, 63, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Ορθόδοξη Εκκλησία σε διάλογο"],
        ["ΣΤ΄ Θεματική Ενότητα — Μονοθεϊστικές θρησκείες: Ιουδαϊσμός και Ισλάμ", 64, 78, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Μονοθεϊστικές θρησκείες: Ιουδαϊσμός και Ισλάμ"],
        ["Ζ΄ Θεματική Ενότητα — Θρησκείες της Ανατολής", 79, 94, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Θρησκείες της Ανατολής"]
      ])
    })
  });
  const PDF_MAX_SPAN = 40;

  const fold = (value) => String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

  function urlsFor(subjectId, topic) {
    const table = SUBJECTS[String(subjectId || "")];
    if (!table) return [];
    const key = Object.keys(table).find((label) => fold(label) === fold(topic));
    return key ? table[key].slice() : [];
  }

  function pdfFor(subjectId, topic) {
    const book = PDF_SUBJECTS[String(subjectId || "")];
    if (!book) return null;
    const unit = book.units.find(([label]) => fold(label) === fold(topic));
    if (!unit) return null;
    const [label, pdfPage, pdfPageEnd, heading] = unit;
    return { subjectId, label, pdfPage, pdfPageEnd, heading, title: book.title, viewUrl: book.viewUrl, downloadUrl: book.downloadUrl };
  }

  const api = Object.freeze({
    schoolYear: "2026-2027",
    subjects: SUBJECTS,
    pdfSubjects: PDF_SUBJECTS,
    pdfMaxSpan: PDF_MAX_SPAN,
    urlsFor,
    pdfFor,
    labels: (subjectId) => SUBJECTS[subjectId] ? Object.keys(SUBJECTS[subjectId]) : (PDF_SUBJECTS[subjectId]?.units || []).map(([label]) => label)
  });
  if (root) root.AITOOLSKIDS_GYMNASIUM_BOOK_SECTIONS = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
