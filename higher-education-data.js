/**
 * higher-education-data.js
 * Foundation data model for university-level support.
 * Pilot only: NOT loaded by production UI until the student route is reviewed.
 */
(function () {
  "use strict";

  const DATA = Object.freeze({
    meta: {
      schemaVersion: "0.1.0",
      academicYear: "2026-2027",
      lastVerified: "2026-09-20",
      status: "pilot",
      policyEl: "Η AI υποστηρίζει κατανόηση, έρευνα, εξάσκηση, οργάνωση και έλεγχο της δικής σου δουλειάς. Δεν δημιουργεί έτοιμη εργασία προς υποβολή.",
      policyEn: "AI supports understanding, research, practice, organization and checking your own work. It is not a submit-ready assignment generator.",
      sourcePolicy: "official-first",
    },

    taskTypes: {
      understand: {
        labelEl: "Να καταλάβω μια έννοια",
        labelEn: "Understand a concept",
        preferredTools: ["ai-help", "chatgpt", "claude", "gemini"],
      },
      research: {
        labelEl: "Να βρω και να ελέγξω πηγές",
        labelEn: "Find and verify sources",
        preferredTools: ["perplexity", "gemini", "chatgpt"],
      },
      papers: {
        labelEl: "Να διαβάσω / οργανώσω papers",
        labelEn: "Read / organize papers",
        preferredTools: ["notebooklm", "perplexity", "chatgpt"],
      },
      coding: {
        labelEl: "Να γράψω ή να διορθώσω κώδικα",
        labelEn: "Write or debug code",
        preferredTools: ["copilot", "chatgpt", "claude", "gemini"],
      },
      practice: {
        labelEl: "Να κάνω εξάσκηση",
        labelEn: "Practice",
        preferredTools: ["ai-help", "chatgpt", "gemini"],
      },
      notes: {
        labelEl: "Να οργανώσω σημειώσεις",
        labelEn: "Organize notes",
        preferredTools: ["notebooklm", "chatgpt", "gemini"],
      },
      feedback: {
        labelEl: "Να πάρω feedback στη δική μου δουλειά",
        labelEn: "Get feedback on my own work",
        preferredTools: ["ai-help", "chatgpt", "claude", "gemini"],
      },
      calculations: {
        labelEl: "Να ελέγξω υπολογισμούς / μαθηματικά βήματα",
        labelEn: "Check calculations / math steps",
        preferredTools: ["wolfram-alpha", "chatgpt", "gemini"],
      },
    },

    institutions: {
      aueb: {
        id: "aueb",
        nameEl: "Οικονομικό Πανεπιστήμιο Αθηνών",
        nameEn: "Athens University of Economics and Business",
        legacyAliases: [],
        sourceUrl: "https://www.aueb.gr/",
        departments: ["aueb-cs"],
      },
      nkua: {
        id: "nkua",
        nameEl: "Εθνικό και Καποδιστριακό Πανεπιστήμιο Αθηνών",
        nameEn: "National and Kapodistrian University of Athens",
        legacyAliases: [],
        sourceUrl: "https://www.uoa.gr/",
        departments: ["nkua-psychology"],
      },
      uniwa: {
        id: "uniwa",
        nameEl: "Πανεπιστήμιο Δυτικής Αττικής",
        nameEn: "University of West Attica",
        legacyAliases: ["ΤΕΙ Αθήνας", "ΑΕΙ Πειραιά ΤΤ", "ΤΕΙ Πειραιά"],
        legacyNoteEl: "Τα παλιά ονόματα χρησιμοποιούνται μόνο ως aliases αναζήτησης. Η τρέχουσα οντότητα είναι το Πανεπιστήμιο Δυτικής Αττικής.",
        sourceUrl: "https://www.uniwa.gr/",
        departments: ["uniwa-ice"],
      },
      hmu: {
        id: "hmu",
        nameEl: "Ελληνικό Μεσογειακό Πανεπιστήμιο",
        nameEn: "Hellenic Mediterranean University",
        legacyAliases: ["ΤΕΙ Κρήτης"],
        legacyNoteEl: "Το ΤΕΙ Κρήτης χρησιμοποιείται μόνο ως legacy alias. Το Ελληνικό Μεσογειακό Πανεπιστήμιο ιδρύθηκε το 2019 και αποτελεί τη σημερινή οντότητα.",
        sourceUrl: "https://hmu.gr/",
        departments: ["hmu-ece"],
      },
    },

    departments: {
      "aueb-cs": {
        institutionId: "aueb",
        schoolEl: "Σχολή Επιστημών και Τεχνολογίας της Πληροφορίας",
        departmentEl: "Τμήμα Πληροφορικής",
        departmentEn: "Department of Informatics",
        degreeLevel: 6,
        nominalSemesters: 8,
        coverageStatus: "pilot-verified-core",
        sourceConfidence: "high",
        sources: [
          "https://www.dept.aueb.gr/el/cs/courses",
          "https://www.dept.aueb.gr/en/cs/content/general-information"
        ],
        courses: [
          { code: null, semester: 1, titleEl: "Εισαγωγή στον Προγραμματισμό Υπολογιστών", tasks: ["understand","coding","practice"] },
          { code: null, semester: 1, titleEl: "Εισαγωγή στην Επιστήμη των Υπολογιστών", tasks: ["understand","notes","practice"] },
          { code: null, semester: 1, titleEl: "Διακριτά Μαθηματικά", tasks: ["understand","practice","calculations"] },
          { code: null, semester: 2, titleEl: "Προγραμματισμός Υπολογιστών με Java", tasks: ["coding","practice","feedback"] },
          { code: null, semester: 3, titleEl: "Δομές Δεδομένων", tasks: ["understand","coding","practice"] },
          { code: null, semester: 4, titleEl: "Αλγόριθμοι", tasks: ["understand","coding","practice"] },
          { code: null, semester: 4, titleEl: "Βάσεις Δεδομένων", tasks: ["understand","coding","practice"] },
          { code: null, semester: 5, titleEl: "Τεχνητή Νοημοσύνη", tasks: ["understand","papers","coding","research"] },
          { code: null, semester: 6, titleEl: "Μηχανική Μάθηση", tasks: ["understand","papers","coding","calculations"] },
          { code: null, semester: 8, titleEl: "Αλληλεπίδραση Ανθρώπου-Υπολογιστή", tasks: ["understand","research","papers","feedback"] },
        ],
      },

      "nkua-psychology": {
        institutionId: "nkua",
        schoolEl: "Φιλοσοφική Σχολή",
        departmentEl: "Τμήμα Ψυχολογίας",
        departmentEn: "Department of Psychology",
        degreeLevel: 6,
        nominalSemesters: 8,
        ectsTotal: 240,
        coverageStatus: "pilot-partial",
        sourceConfidence: "high",
        sources: [
          "https://www.psych.uoa.gr/undergraduate",
          "https://www.psych.uoa.gr/student_handbook",
          "https://www.psych.uoa.gr/class_schedule"
        ],
        notesEl: "Το πρόγραμμα περιλαμβάνει υποχρεωτικά και κατ’ επιλογή μαθήματα, πρακτική και προαιρετική πτυχιακή/εναλλακτικές επιλογές. Η πλήρης καταχώριση μαθημάτων θα ακολουθήσει από τον επίσημο Οδηγό Σπουδών.",
        courses: [
          { code: "ΨΧ01", semester: 1, titleEl: "Αναπτυξιακή Ψυχολογία Ι", tasks: ["understand","notes","papers","practice"] },
          { code: "ΨΧ76", semester: null, titleEl: "Πρόληψη και Παρέμβαση στην Οικογένεια και στο Σχολείο", tasks: ["understand","papers","research","feedback"] },
          { code: null, semester: null, titleEl: "Εισαγωγή στην Ψυχολογία", tasks: ["understand","notes","practice"] },
          { code: null, semester: null, titleEl: "Ιστορία της Ψυχολογίας", tasks: ["understand","research","papers"] },
          { code: null, semester: null, titleEl: "Γνωστική Ψυχολογία Ι", tasks: ["understand","papers","practice"] },
        ],
      },

      "uniwa-ice": {
        institutionId: "uniwa",
        schoolEl: "Σχολή Μηχανικών",
        departmentEl: "Τμήμα Μηχανικών Πληροφορικής και Υπολογιστών",
        departmentEn: "Department of Informatics and Computer Engineering",
        degreeLevel: 7,
        nominalSemesters: 10,
        coverageStatus: "pilot-legacy-mapping",
        sourceConfidence: "medium-high",
        legacyDepartmentAliases: [
          "Τμήμα Μηχανικών Πληροφορικής ΤΕΙ Αθήνας",
          "Τμήμα Μηχανικών Ηλεκτρονικών Υπολογιστικών Συστημάτων ΑΕΙ Πειραιά ΤΤ"
        ],
        sources: [
          "https://ice.uniwa.gr/wp-content/uploads/2019/06/20042019-%CE%A3%CE%A7%CE%95%CE%94%CE%99%CE%9F-%CE%A0%CE%A3-5-%CE%95%CE%A4%CE%95%CE%A3.pdf",
          "https://ice.uniwa.gr/education/undergraduate/courses/analysis-and-design-of-information-systems/"
        ],
        courses: [
          { code: "ICE-5003", semester: 5, titleEl: "Ανάλυση και Σχεδιασμός Πληροφοριακών Συστημάτων", tasks: ["understand","research","feedback","coding"] },
          { code: "ICE-6004", semester: 6, titleEl: "Μικροηλεκτρονική", tasks: ["understand","calculations","practice"] },
          { code: "ICE-7109", semester: 7, titleEl: "Μοντελοποίηση και Προγραμματισμός Περιορισμών", tasks: ["understand","coding","practice","papers"] },
          { code: "ICE-7113", semester: 9, titleEl: "Συστήματα Αποφάσεων και Διαχείρισης Διεργασιών", tasks: ["understand","research","papers","feedback"] },
          { code: "ICE-8206", semester: 8, titleEl: "Στοχαστικά και μη Γραμμικά Συστήματα", tasks: ["understand","calculations","practice","papers"] },
        ],
      },

      "hmu-ece": {
        institutionId: "hmu",
        schoolEl: "Σχολή Μηχανικών",
        departmentEl: "Τμήμα Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών",
        departmentEn: "Department of Electrical and Computer Engineering",
        degreeLevel: 7,
        nominalSemesters: 10,
        coverageStatus: "pilot-legacy-mapping",
        sourceConfidence: "high",
        legacyInstitutionAliases: ["ΤΕΙ Κρήτης"],
        sources: [
          "https://ece.hmu.gr/proptyxiakes/programma-spoydwn/",
          "https://hmu.gr/"
        ],
        courses: [
          { code: "1.001", semester: 1, titleEl: "Λογισμός I", tasks: ["understand","calculations","practice"] },
          { code: "1.002", semester: 1, titleEl: "Γραμμική Άλγεβρα", tasks: ["understand","calculations","practice"] },
          { code: "3.001", semester: 3, titleEl: "Διαφορικές Εξισώσεις και Μιγαδική Ανάλυση", tasks: ["understand","calculations","practice"] },
          { code: "3.002", semester: 3, titleEl: "Ηλεκτρικά Κυκλώματα ΙΙ", tasks: ["understand","calculations","practice"] },
          { code: "3.003", semester: 3, titleEl: "Θεωρία Πιθανοτήτων και Στατιστική", tasks: ["understand","calculations","practice","papers"] },
          { code: "3.004", semester: 3, titleEl: "Ηλεκτρονική Ι", tasks: ["understand","calculations","practice"] },
          { code: "3.005", semester: 3, titleEl: "Εισαγωγή στις Βάσεις Δεδομένων", tasks: ["understand","coding","practice"] },
          { code: "3.006", semester: 3, titleEl: "Τεχνικό Σχέδιο", tasks: ["understand","practice","feedback"] },
        ],
      },
    },
  });

  window.AITOOLSKIDS_HIGHER_EDUCATION = DATA;
})();
