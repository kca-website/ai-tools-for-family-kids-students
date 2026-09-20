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
      upatras: {
        id: "upatras",
        nameEl: "Πανεπιστήμιο Πατρών",
        nameEn: "University of Patras",
        legacyAliases: [],
        sourceUrl: "https://www.upatras.gr/",
        departments: ["upatras-biology"],
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
        coverageStatus: "pilot-structured",
        sourceConfidence: "high",
        curriculumDisplay: "year-semester-course-topic",
        currentAcademicYearSource: "https://www.dept.aueb.gr/el/cs/courses",
        notesEl: "Η δομή εξαμήνων βασίζεται στην επίσημη τρέχουσα σελίδα μαθημάτων του Τμήματος. Αναλυτικές θεματικές εμφανίζονται μόνο σε μαθήματα με επίσημη σελίδα περιεχομένου που έχει αντιστοιχιστεί.",
        sources: [
          "https://www.dept.aueb.gr/el/cs/courses",
          "https://www.dept.aueb.gr/el/cs/studiesguide",
          "https://www.dept.aueb.gr/en/cs/content/general-information"
        ],
        courses: [
          {
            code: "3125", semester: 1, year: 1, ects: 6, required: true,
            titleEl: "Εισαγωγή στον Προγραμματισμό Υπολογιστών",
            tasks: ["understand","coding","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-course-page",
            syllabusSource: "https://www.dept.aueb.gr/el/cs/courses/3125",
            syllabusSourceAcademicYear: "current",
            topics: [
              "Έννοια προγράμματος, μεταβλητές, τύποι, εκφράσεις και αριθμητικοί υπολογισμοί",
              "Δομές ελέγχου και επανάληψης στην Python",
              "Είσοδος και έξοδος δεδομένων",
              "Εντοπισμός και άρση σφαλμάτων",
              "Συναρτήσεις και μέθοδοι",
              "Έννοια αλγορίθμου και αρχές δομημένου προγραμματισμού",
              "Αλφαριθμητικά, λίστες και πίνακες",
              "Αλγόριθμοι αναζήτησης και ταξινόμησης",
              "Αρχεία δεδομένων",
              "Αναδρομή και αναδρομικές συναρτήσεις",
              "Βασικές έννοιες συναρτησιακού και αντικειμενοστρεφούς προγραμματισμού"
            ]
          },
          {
            code: "3135", semester: 1, year: 1, ects: 6, required: true,
            titleEl: "Εισαγωγή στην Επιστήμη των Υπολογιστών",
            tasks: ["understand","notes","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-course-page",
            syllabusSource: "https://www.dept.aueb.gr/el/cs/courses/3135",
            syllabusSourceAcademicYear: "current",
            topics: [
              "Αλγόριθμοι και αρχές προγραμματισμού",
              "Δομές δεδομένων: πίνακες, λίστες, στοίβες και δέντρα",
              "Υπολογισιμότητα και πολυπλοκότητα - κλάσεις P και NP",
              "Αρχιτεκτονική υπολογιστών",
              "Γλώσσες προγραμματισμού και μεταγλωττιστές",
              "Λειτουργικά συστήματα και χρονοπρογραμματισμός",
              "Συστήματα αρχείων και βάσεις δεδομένων",
              "Δίκτυα υπολογιστών και Διαδίκτυο"
            ]
          },
          { code: null, semester: 1, year: 1, titleEl: "Εισαγωγή στην Οικονομική Επιστήμη", tasks: ["understand","notes","practice"] },
          { code: null, semester: 1, year: 1, titleEl: "Διακριτά Μαθηματικά", tasks: ["understand","practice","calculations"] },
          { code: null, semester: 1, year: 1, titleEl: "Μαθηματικά Ι", tasks: ["understand","practice","calculations"] },

          { code: null, semester: 2, year: 1, titleEl: "Σχεδίαση Ψηφιακών Συστημάτων", tasks: ["understand","practice","calculations"] },
          { code: null, semester: 2, year: 1, titleEl: "Προγραμματισμός Υπολογιστών με Java", tasks: ["coding","practice","feedback"] },
          { code: null, semester: 2, year: 1, titleEl: "Μαθηματικά ΙΙ", tasks: ["understand","practice","calculations"] },
          { code: null, semester: 2, year: 1, titleEl: "Πιθανότητες", tasks: ["understand","practice","calculations"] },
          { code: null, semester: 2, year: 1, titleEl: "Εισαγωγή στη Διοίκηση Επιχειρήσεων", tasks: ["understand","notes","practice"] },

          { code: null, semester: 3, year: 2, titleEl: "Δομές Δεδομένων", tasks: ["understand","coding","practice"] },
          { code: null, semester: 3, year: 2, titleEl: "Οργάνωση Συστημάτων Υπολογιστών", tasks: ["understand","practice"] },
          { code: null, semester: 3, year: 2, titleEl: "Προγραμματισμός Υπολογιστών με C++", tasks: ["coding","practice","feedback"] },
          { code: null, semester: 3, year: 2, titleEl: "Υπολογιστικά Μαθηματικά", tasks: ["understand","practice","calculations"] },

          { code: null, semester: 4, year: 2, titleEl: "Αλγόριθμοι", tasks: ["understand","coding","practice"] },
          { code: null, semester: 4, year: 2, titleEl: "Αυτόματα και Πολυπλοκότητα", tasks: ["understand","practice","calculations"] },
          { code: null, semester: 4, year: 2, titleEl: "Βάσεις Δεδομένων", tasks: ["understand","coding","practice"] },
          { code: null, semester: 4, year: 2, titleEl: "Λειτουργικά Συστήματα", tasks: ["understand","coding","practice"] },

          { code: null, semester: 5, year: 3, titleEl: "Τεχνολογία Λογισμικού", tasks: ["understand","coding","feedback"] },
          { code: null, semester: 5, year: 3, titleEl: "Δίκτυα Επικοινωνιών", tasks: ["understand","practice"] },
          { code: null, semester: 5, year: 3, titleEl: "Λογική", tasks: ["understand","practice"] },
          { code: null, semester: 5, year: 3, titleEl: "Στατιστική στην Πληροφορική", tasks: ["understand","calculations","practice"] },
          {
            code: "3531", semester: 5, year: 3, ects: 7, required: false,
            titleEl: "Τεχνητή Νοημοσύνη",
            tasks: ["understand","papers","coding","research"],
            topicsVerified: true,
            syllabusStatus: "verified-official-course-page",
            syllabusSource: "https://www.dept.aueb.gr/el/cs/courses/3531",
            syllabusSourceAcademicYear: "current",
            topics: [
              "Εισαγωγή στην Τεχνητή Νοημοσύνη και δοκιμασία Turing",
              "Επίλυση προβλημάτων μέσω αναζήτησης",
              "Ευρετικές και αλγόριθμος A*",
              "Τοπική αναζήτηση, beam search και προσομοιωμένη ανόπτηση",
              "Γενετικοί αλγόριθμοι, MiniMax και κλάδεμα α-β",
              "Παράσταση γνώσεων και συλλογιστική με λογική",
              "Σημασιολογικά δίκτυα, πλαίσια και οντολογίες",
              "Έμπειρα συστήματα",
              "Μηχανική μάθηση: k-NN, k-means, Bayes, δέντρα και Random Forest",
              "Γραμμική και λογιστική παλινδρόμηση, Perceptron και MLPs",
              "Επεξεργασία φυσικής γλώσσας και συντακτική ανάλυση"
            ]
          },

          { code: null, semester: 6, year: 3, titleEl: "Κατανεμημένα Συστήματα", tasks: ["understand","coding","practice"] },
          { code: null, semester: 6, year: 3, titleEl: "Ανάλυση και Σχεδίαση Πληροφοριακών Συστημάτων", tasks: ["understand","research","feedback"] },
          { code: null, semester: 6, year: 3, titleEl: "Κυβερνοασφάλεια", tasks: ["understand","research","practice"] },
          { code: null, semester: 6, year: 3, titleEl: "Δίκτυα Υπολογιστών", tasks: ["understand","practice"] },
          { code: null, semester: 6, year: 3, titleEl: "Επαλήθευση, Επικύρωση και Συντήρηση Λογισμικού", tasks: ["understand","coding","feedback"] },
          { code: null, semester: 6, year: 3, titleEl: "Θεωρία και Υποδείγματα Βελτιστοποίησης", tasks: ["understand","calculations","practice"] },
          { code: null, semester: 6, year: 3, titleEl: "Συστήματα Διαχείρισης και Ανάλυσης Δεδομένων", tasks: ["understand","coding","research"] },

          { code: null, semester: 7, year: 4, titleEl: "Ασφάλεια Δικτύων", tasks: ["understand","research","practice"] },
          { code: null, semester: 7, year: 4, titleEl: "Ασύρματα Δίκτυα και Κινητές Επικοινωνίες", tasks: ["understand","research"] },
          { code: null, semester: 7, year: 4, titleEl: "Γραφικά Υπολογιστών", tasks: ["understand","coding","practice"] },
          { code: null, semester: 7, year: 4, titleEl: "Ειδικά Θέματα Αλγορίθμων", tasks: ["understand","coding","practice"] },
          { code: null, semester: 7, year: 4, titleEl: "Εφαρμοσμένες Πιθανότητες και Πιθανοτικοί Αλγόριθμοι", tasks: ["understand","calculations","practice"] },
          { code: null, semester: 7, year: 4, titleEl: "Μέθοδοι Στατιστικής και Μηχανικής Μάθησης", tasks: ["understand","calculations","coding"] },
          { code: null, semester: 7, year: 4, titleEl: "Μεταγλωττιστές", tasks: ["understand","coding","practice"] },
          { code: null, semester: 7, year: 4, titleEl: "Μηχανική Μάθηση", tasks: ["understand","papers","coding","calculations"] },
          { code: null, semester: 7, year: 4, titleEl: "Τεχνολογία Πολυμέσων", tasks: ["understand","coding","feedback"] },
          { code: null, semester: 7, year: 4, titleEl: "Τεχνολογίες και Προγραμματισμός Εφαρμογών στον Ιστό", tasks: ["coding","practice","feedback"] },

          { code: null, semester: 8, year: 4, titleEl: "Αλληλεπίδραση Ανθρώπου-Υπολογιστή", tasks: ["understand","research","papers","feedback"] },
          { code: null, semester: 8, year: 4, titleEl: "Ανάλυση Δεδομένων", tasks: ["understand","calculations","research"] },
          { code: null, semester: 8, year: 4, titleEl: "Αρχιτεκτονική Υπολογιστών", tasks: ["understand","practice"] },
          { code: null, semester: 8, year: 4, titleEl: "Εξόρυξη Γνώσης", tasks: ["understand","coding","research"] },
          { code: null, semester: 8, year: 4, titleEl: "Θεωρία Πληροφορίας", tasks: ["understand","calculations","practice"] },
          { code: null, semester: 8, year: 4, titleEl: "Συστήματα Ανάκτησης Πληροφοριών", tasks: ["understand","coding","research"] },
          { code: null, semester: 8, year: 4, titleEl: "Πτυχιακή Εργασία", tasks: ["research","papers","feedback","notes"] },
          { code: null, semester: 8, year: 4, titleEl: "Πρακτική Άσκηση", tasks: ["notes","feedback","research"] }
        ]
      },

      "nkua-psychology": {
        institutionId: "nkua",
        schoolEl: "Φιλοσοφική Σχολή",
        departmentEl: "Τμήμα Ψυχολογίας",
        departmentEn: "Department of Psychology",
        degreeLevel: 6,
        nominalSemesters: 8,
        ectsTotal: 240,
        coverageStatus: "pilot-structured",
        sourceConfidence: "high",
        curriculumDisplay: "year-semester-course-topic",
        studyGuideSource: "https://en.psych.uoa.gr/fileadmin/depts/psych.uoa.gr/www/uploads/study/undergraduate/student_handbook/EKPA_Psych_StudyGuide_En.pdf",
        studyGuideAcademicYear: "2025-2026",
        currentScheduleSource: "https://www.psych.uoa.gr/class_schedule",
        notesEl: "Ο επίσημος οδηγός 2025-2026 παρέχει αναλυτικά course descriptions. Το χειμερινό πρόγραμμα διδασκαλίας 2026-2027 είναι δημοσιευμένο χωριστά. Η AI χρησιμοποιεί μόνο θεματικές από επίσημο course description ή υλικό που δίνει ο φοιτητής.",
        sources: [
          "https://www.psych.uoa.gr/undergraduate",
          "https://www.psych.uoa.gr/student_handbook",
          "https://www.psych.uoa.gr/class_schedule"
        ],
        courses: [
          {
            code: "PSY01", semester: 1, year: 1, ects: 5, required: true,
            titleEl: "Αναπτυξιακή Ψυχολογία Ι",
            tasks: ["understand","notes","papers","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-handbook",
            syllabusSource: "https://en.psych.uoa.gr/fileadmin/depts/psych.uoa.gr/www/uploads/study/undergraduate/student_handbook/EKPA_Psych_StudyGuide_En.pdf",
            syllabusSourceAcademicYear: "2025-2026",
            topics: [
              "Αντικείμενο και θεωρίες της αναπτυξιακής ψυχολογίας",
              "Κληρονομικότητα και περιβάλλον στην ανάπτυξη",
              "Ανάπτυξη νεογνού και σταθερότητα",
              "Κινητική και αισθητηριακή ανάπτυξη στη βρεφική ηλικία",
              "Γνωστική ανάπτυξη στη βρεφική ηλικία: Piaget και επεξεργασία πληροφοριών",
              "Γλωσσική ανάπτυξη στη βρεφική ηλικία",
              "Κοινωνική ανάπτυξη, προσωπικότητα και ατομικές διαφορές στη βρεφική ηλικία",
              "Σωματική, γνωστική και γλωσσική ανάπτυξη στην προσχολική ηλικία",
              "Κοινωνική ανάπτυξη, προσωπικότητα, φίλοι και οικογένεια στην προσχολική ηλικία"
            ]
          },
          {
            code: "PSY32", semester: 1, year: 1, ects: 5, required: true,
            titleEl: "Γνωστική Ψυχολογία Ι",
            tasks: ["understand","papers","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-handbook",
            syllabusSource: "https://en.psych.uoa.gr/fileadmin/depts/psych.uoa.gr/www/uploads/study/undergraduate/student_handbook/EKPA_Psych_StudyGuide_En.pdf",
            syllabusSourceAcademicYear: "2025-2026",
            topics: [
              "Ορισμός και ιστορία της Γνωστικής Ψυχολογίας",
              "Ερευνητικές μέθοδοι: πειραματικές, νευροαπεικονιστικές, προσομοιώσεις και AI",
              "Βιολογικές βάσεις της νόησης",
              "Θεωρία επεξεργασίας πληροφοριών",
              "Νοητικές αναπαραστάσεις",
              "Γνωστική Ψυχολογία και Γνωσιακή Επιστήμη",
              "Προσοχή",
              "Αντίληψη",
              "Μνήμη και μάθηση"
            ]
          },
          {
            code: "PSY02", semester: 2, year: 1, ects: 5, required: true,
            titleEl: "Αναπτυξιακή Ψυχολογία ΙΙ",
            tasks: ["understand","notes","papers","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-handbook",
            syllabusSource: "https://en.psych.uoa.gr/fileadmin/depts/psych.uoa.gr/www/uploads/study/undergraduate/student_handbook/EKPA_Psych_StudyGuide_En.pdf",
            syllabusSourceAcademicYear: "2025-2026",
            topics: [
              "Γνωστική ανάπτυξη στην προσχολική ηλικία: Piaget, Vygotsky και επεξεργασία πληροφοριών",
              "Γλώσσα και μάθηση",
              "Κοινωνική ανάπτυξη και προσωπικότητα",
              "Ηθική ανάπτυξη και επιθετικότητα",
              "Σωματική και γνωστική ανάπτυξη στη σχολική ηλικία",
              "Νοημοσύνη και γλωσσική ανάπτυξη",
              "Κοινωνική ανάπτυξη στη σχολική ηλικία",
              "Σωματική και γνωστική ανάπτυξη στην εφηβεία",
              "Εφηβικός εγωκεντρισμός και ανάληψη κινδύνου",
              "Ταυτότητα, ψυχολογικές διαταραχές και ψυχοσεξουαλική ταυτότητα στην εφηβεία"
            ]
          },
          {
            code: "PSY05", semester: 2, year: 1, ects: 5, required: true,
            titleEl: "Γνωστική Ψυχολογία ΙΙ",
            tasks: ["understand","papers","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-handbook",
            syllabusSource: "https://en.psych.uoa.gr/fileadmin/depts/psych.uoa.gr/www/uploads/study/undergraduate/student_handbook/EKPA_Psych_StudyGuide_En.pdf",
            syllabusSourceAcademicYear: "2025-2026",
            topics: [
              "Ορισμός και φύση της σκέψης",
              "Μεθοδολογικά ζητήματα στη μελέτη της σκέψης",
              "Επίλυση προβλημάτων",
              "Συλλογιστική",
              "Αναλογική σκέψη",
              "Δημιουργικότητα",
              "Λήψη αποφάσεων",
              "Γλώσσα",
              "Μεταγνωστικές διεργασίες",
              "Γνωστική ανάπτυξη",
              "Συνείδηση",
              "Νόηση και συναισθήματα"
            ]
          },
          { code: "PSY11", semester: 1, year: 1, ects: 5, required: true, titleEl: "Κοινωνική Ψυχολογία Ι", tasks: ["understand","notes","papers","practice"] },
          { code: "PSY27", semester: 1, year: 1, ects: 5, required: true, titleEl: "Βιολογικές Βάσεις της Συμπεριφοράς", tasks: ["understand","notes","papers","practice"] },
          { code: "PSY12", semester: 2, year: 1, ects: 5, required: true, titleEl: "Κοινωνική Ψυχολογία ΙΙ", tasks: ["understand","notes","papers","practice"] },
          { code: "PSY44", semester: 2, year: 1, ects: 5, required: true, titleEl: "Συμβουλευτική Ψυχολογία", tasks: ["understand","papers","feedback"] },
          { code: "PSY61", semester: 2, year: 1, ects: 5, required: true, titleEl: "Μέθοδοι Έρευνας στην Ψυχολογία", tasks: ["understand","research","practice","papers"] },
          { code: "PSY38", semester: null, year: null, ects: 4, required: false, titleEl: "Ιστορία της Ψυχολογίας", tasks: ["understand","research","papers"] },
          { code: "PSY76", semester: null, year: null, ects: 4, required: false, titleEl: "Πρόληψη και Παρέμβαση στην Οικογένεια και στο Σχολείο", tasks: ["understand","papers","research","feedback"] }
        ]
      },

      "uniwa-ice": {
        institutionId: "uniwa",
        schoolEl: "Σχολή Μηχανικών",
        departmentEl: "Τμήμα Μηχανικών Πληροφορικής και Υπολογιστών",
        departmentEn: "Department of Informatics and Computer Engineering",
        degreeLevel: 7,
        nominalSemesters: 10,
        coverageStatus: "pilot-source-locked",
        sourceConfidence: "high",
        curriculumDisplay: "year-semester-course-topic",
        legacyDepartmentAliases: [
          "Τμήμα Μηχανικών Πληροφορικής ΤΕΙ Αθήνας",
          "Τμήμα Μηχανικών Ηλεκτρονικών Υπολογιστικών Συστημάτων ΑΕΙ Πειραιά ΤΤ"
        ],
        notesEl: "Τα legacy ονόματα χρησιμοποιούνται μόνο για αναζήτηση. Οι θεματικές της AI ενεργοποιούνται μόνο όταν υπάρχει επίσημο περίγραμμα του σημερινού Τμήματος.",
        sources: [
          "https://ice.uniwa.gr/education/undergraduate/",
          "https://ice.uniwa.gr/education/undergraduate/courses/analysis-and-design-of-information-systems/",
          "https://ice.uniwa.gr/education/undergraduate/courses/microelectronics/"
        ],
        courses: [
          {
            code: "ICE-5003", semester: 5, year: 3, ects: 5, required: true,
            titleEl: "Ανάλυση και Σχεδιασμός Πληροφοριακών Συστημάτων",
            tasks: ["understand","research","feedback","coding"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://ice.uniwa.gr/wp-content/uploads/2022/11/ICE-5003-%CE%91%CE%9D%CE%91%CE%9B%CE%A5%CE%A3%CE%97-KAI-%CE%A3%CE%A7%CE%95%CE%94%CE%99%CE%91%CE%A3%CE%9C%CE%9F%CE%A3-%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%91%CE%9A%CE%A9%CE%9D-%CE%A3%CE%A5%CE%A3%CE%A4%CE%97%CE%9C%CE%91%CE%A4%CE%A9%CE%9D.pdf",
            syllabusSourceAcademicYear: "official outline",
            topics: [
              "Μοντελοποίηση, ανάλυση και σχεδιασμός πληροφοριακών συστημάτων",
              "Βασικά μοντέλα και μέθοδοι ανάλυσης συστημάτων",
              "Τεχνικές σχεδιασμού πληροφοριακών και επικοινωνιακών συστημάτων επιχειρήσεων και οργανισμών"
            ]
          },
          {
            code: "ICE-6004", semester: 6, year: 3, ects: 5, required: true,
            titleEl: "Μικροηλεκτρονική",
            tasks: ["understand","calculations","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://ice.uniwa.gr/wp-content/uploads/2022/11/ICE-6004-%CE%9C%CE%99%CE%9A%CE%A1%CE%9F%CE%97%CE%9B%CE%95%CE%9A%CE%A4%CE%A1%CE%9F%CE%9D%CE%99%CE%9A%CE%97.pdf",
            syllabusSourceAcademicYear: "official outline",
            topics: [
              "Ημιαγωγικές διατάξεις",
              "Σχεδίαση ψηφιακών λογικών πυλών",
              "Διαφορικοί και τελεστικοί ενισχυτές",
              "Τεχνολογίες και προγράμματα προσομοίωσης μικροηλεκτρονικών κυκλωμάτων"
            ]
          },
          { code: "ICE-7109", semester: 7, year: 4, titleEl: "Μοντελοποίηση και Προγραμματισμός Περιορισμών", tasks: ["understand","coding","practice","papers"] },
          { code: "ICE-8206", semester: 8, year: 4, titleEl: "Στοχαστικά και μη Γραμμικά Συστήματα", tasks: ["understand","calculations","practice","papers"] },
          { code: "ICE-7113", semester: 9, year: 5, titleEl: "Συστήματα Αποφάσεων και Διαχείρισης Διεργασιών", tasks: ["understand","research","papers","feedback"] }
        ]
      },

      "upatras-biology": {
        institutionId: "upatras",
        schoolEl: "Σχολή Θετικών Επιστημών",
        departmentEl: "Τμήμα Βιολογίας",
        departmentEn: "Department of Biology",
        degreeLevel: 6,
        nominalSemesters: 8,
        ectsTotal: 240,
        coverageStatus: "pilot-structured",
        sourceConfidence: "high",
        curriculumDisplay: "year-semester-course-topic",
        currentAcademicYearSource: "https://biology.upatras.gr/program-study/",
        studyGuideSource: "https://biology.upatras.gr/study_guide/",
        studyGuideAcademicYear: "2026-2027",
        officialCourseOutlinesSource: "https://biology.upatras.gr/wp-content/uploads/sites/229/2022/03/Course_Outines_Biology-Dpt-2022_GRE.pdf",
        officialCourseOutlinesAcademicYear: "2021-2022",
        notesEl: "Η κατανομή μαθημάτων και ο Οδηγός Σπουδών είναι επίσημα για το 2026-2027. Οι αναλυτικές θεματικές εμφανίζονται μόνο όταν έχουν αντιστοιχιστεί σε επίσημο περίγραμμα μαθήματος. Όπου το διαθέσιμο αναλυτικό περίγραμμα είναι παλαιότερο, εμφανίζεται καθαρά το έτος της πηγής και δεν θεωρείται αυτομάτως πλήρης τρέχουσα εξεταστέα ύλη.",
        sources: [
          "https://biology.upatras.gr/program-study/",
          "https://biology.upatras.gr/study_guide/",
          "https://biology.upatras.gr/undergraduate-lessons/",
          "https://biology.upatras.gr/annual_timetable/"
        ],
        courses: [
          {
            code: "ΒΙΟ_ΒΚΔ", semester: 1, year: 1, ects: 8, required: true,
            titleEl: "Βασικές Αρχές Βιολογίας Κυττάρου - Διδακτική",
            tasks: ["understand","notes","papers","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://biology.upatras.gr/wp-content/uploads/sites/229/2022/03/Course_Outines_Biology-Dpt-2022_GRE.pdf",
            syllabusSourceAcademicYear: "2021-2022",
            topics: [
              "Δομή και μοριακή οργάνωση του κυττάρου",
              "Εργαστηριακές τεχνικές μελέτης βιομορίων και κυττάρων",
              "Δομή πλασματικής μεμβράνης",
              "Λειτουργία πλασματικής μεμβράνης",
              "Δομή και οργάνωση πυρήνα",
              "Οργάνωση γενετικού υλικού",
              "Δομή του κυτταροπλασματικού συστήματος των μεμβρανών",
              "Λειτουργία του κυτταροπλασματικού συστήματος των μεμβρανών",
              "Σύνθεση και διαλογή πρωτεϊνών",
              "Λειτουργική ωρίμανση πρωτεϊνών",
              "Πρόσληψη κυττάρων και μακρομορίων",
              "Αυτοαναπαραγόμενα κυτταροπλασματικά οργανίδια"
            ]
          },
          {
            code: "ΒΙΟ_ΓΜΒ", semester: 1, year: 1, ects: 8, required: true,
            titleEl: "Γενικά Μαθηματικά - Βιοστατιστική",
            tasks: ["understand","calculations","practice","research"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://biology.upatras.gr/wp-content/uploads/sites/229/2022/03/Course_Outines_Biology-Dpt-2022_GRE.pdf",
            syllabusSourceAcademicYear: "2021-2022",
            topics: [
              "Τα μαθηματικά και η στατιστική στη Βιολογία",
              "Συναρτήσεις, όρια, συνέχεια και ρυθμός μεταβολής",
              "Παράγωγος: βασικές ιδιότητες και εφαρμογές",
              "Διαφορικές εξισώσεις και εφαρμογές στη Βιολογία",
              "Ολοκληρώματα και παραδείγματα στη Βιολογία",
              "Στατιστική: βασικές έννοιες",
              "Θεωρία πιθανοτήτων και δεσμευμένη πιθανότητα",
              "Δειγματοληψία και εκτιμήσεις",
              "Περιγραφική στατιστική",
              "Πειραματικός σχεδιασμός",
              "Έλεγχος υποθέσεων",
              "Συσχέτιση και παλινδρόμηση"
            ]
          },
          {
            code: "ΒΙΟ_ΓΧΜ", semester: 1, year: 1, ects: 7, required: true,
            titleEl: "Γενική Χημεία",
            tasks: ["understand","calculations","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://biology.upatras.gr/wp-content/uploads/sites/229/2022/03/Course_Outines_Biology-Dpt-2022_GRE.pdf",
            syllabusSourceAcademicYear: "2021-2022",
            topics: [
              "Χημεία και μετρήσεις: άτομα, μόρια, ιόντα και χημικές εξισώσεις",
              "Υπολογισμοί με χημικούς τύπους και εξισώσεις - στοιχειομετρία",
              "Χημικές αντιδράσεις και διαλύματα",
              "Θερμοχημεία",
              "Κβαντική θεωρία του ατόμου",
              "Ηλεκτρονικές δομές και περιοδικότητα",
              "Ιοντικός και ομοιοπολικός δεσμός",
              "Μοριακή γεωμετρία",
              "Διαλύματα και αθροιστικές ιδιότητες",
              "Ταχύτητες αντίδρασης και κατάλυση",
              "Χημική ισορροπία",
              "Οξέα και βάσεις",
              "Ισορροπίες οξέων-βάσεων και ρυθμιστικά διαλύματα",
              "Διαλυτότητα και ισορροπίες συμπλόκων",
              "Θερμοδυναμική και ισορροπία"
            ]
          },
          {
            code: "ΒΙΟ_ΦΥΣ", semester: 1, year: 1, ects: 7, required: true,
            titleEl: "Φυσική",
            tasks: ["understand","calculations","practice"],

          },
          {
            code: "ΒΙΟ_ΒΖΙ", semester: 2, year: 1, ects: 8, required: true,
            titleEl: "Βιολογία Ζώων Ι: Βασικά Φύλα & Πρωτοστόμια",
            tasks: ["understand","notes","practice","papers"],

          },
          {
            code: "ΒΙΟ_ΑΒΧ", semester: 2, year: 1, ects: 7, required: true,
            titleEl: "Βιοχημεία Ι",
            tasks: ["understand","notes","practice","calculations"],

          },
          {
            code: "ΒΙΟ_ΓΕΝ", semester: 2, year: 1, ects: 8, required: true,
            titleEl: "Γενετική",
            tasks: ["understand","notes","practice","papers"],

          },
          {
            code: "ΒΙΟ_ΟΧΜ", semester: 2, year: 1, ects: 7, required: true,
            titleEl: "Οργανική Χημεία",
            tasks: ["understand","calculations","practice"],

          },

          { code: "ΒΙΟ_ΒΖΔ", semester: 3, year: 2, ects: 8, required: true, titleEl: "Βιολογία Ζώων ΙΙ: Δευτεροστόμια", tasks: ["understand","notes","practice","papers"] },
          { code: "ΒΙΟ_ΒΙΙ", semester: 3, year: 2, ects: 7, required: true, titleEl: "Βιοχημεία ΙΙ", tasks: ["understand","practice","calculations","papers"] },
          { code: "ΒΙΟ_ΜΑΦ", semester: 3, year: 2, ects: 8, required: true, titleEl: "Μορφολογία και Ανατομία Φυτών - Διδακτική", tasks: ["understand","notes","practice"] },
          { code: "ΒΙΟ_ΠΛΟ", semester: 3, year: 2, ects: 7, required: true, titleEl: "Πληθυσμιακή Οικολογία", tasks: ["understand","calculations","research","practice"] },

          { code: "ΒΙΟ_ΑΞΒ", semester: 4, year: 2, ects: 6, required: true, titleEl: "Αναπτυξιακή Βιολογία", tasks: ["understand","notes","papers","practice"] },
          { code: "ΒΙΟ_ΜΚΛ", semester: 4, year: 2, ects: 6, required: true, titleEl: "Μοριακή Βάση των Κυτταρικών Λειτουργιών", tasks: ["understand","notes","papers","practice"] },
          { code: "ΒΙΟ_ΜΡΒ", semester: 4, year: 2, ects: 6, required: true, titleEl: "Μοριακή Βιολογία", tasks: ["understand","papers","research","notes"] },
          { code: "ΒΙΟ_ΟΒΟ", semester: 4, year: 2, ects: 6, required: true, titleEl: "Οικολογία Βιοκοινοτήτων & Οικοσυστημάτων", tasks: ["understand","research","papers","practice"] },
          { code: "ΒΙΟ_ΣΦΤ", semester: 4, year: 2, ects: 6, required: true, titleEl: "Συστηματική Φυτών", tasks: ["understand","notes","practice"] },

          { code: "ΒΙΟ_ΡΒΑ", semester: 5, year: 3, ects: 7, required: true, titleEl: "Μικροβιολογία", tasks: ["understand","papers","research","practice"] },
          { code: "ΒΙΟ_ΜΓΝ", semester: 5, year: 3, ects: 7, required: true, titleEl: "Μοριακή Γενετική", tasks: ["understand","papers","research","practice"] },
          { code: "ΒΙΟ_ΦΖΟ", semester: 5, year: 3, ects: 9, required: true, titleEl: "Φυσιολογία Ζωικών Οργανισμών", tasks: ["understand","notes","practice","papers"] },
          { code: "ΒΙΟ_ΦΦΤ", semester: 5, year: 3, ects: 7, required: true, titleEl: "Φυσιολογία Φυτών", tasks: ["understand","notes","practice","papers"] },

          { code: "ΒΙΟ_ΕΞΛ", semester: 6, year: 3, ects: 6, required: true, titleEl: "Εξέλιξη", tasks: ["understand","papers","research","practice"] },

          { code: "ΒΙΟ_ΒΠΛ", semester: 6, year: 3, ects: 3, required: false, group: "A", titleEl: "Βιοπληροφορική", tasks: ["understand","coding","papers","research"] },
          { code: "ΒΙΟ_ΓΑΙ", semester: 6, year: 3, ects: 6, required: false, group: "A", titleEl: "Γενετική Ανθρώπου - Ιατρική Γενετική", tasks: ["understand","papers","research","notes"] },
          { code: "ΒΙΟ_ΕΒΣ", semester: 6, year: 3, ects: 6, required: false, group: "A", titleEl: "Εφαρμοσμένη Βιοστατιστική", tasks: ["understand","calculations","research","practice"] },
          { code: "ΒΙΟ_ΕΜΚ", semester: 6, year: 3, ects: 6, required: false, group: "A", titleEl: "Εφαρμοσμένη Μικροβιολογία", tasks: ["understand","papers","research","practice"] },
          { code: "ΒΙΟ_ΘΟΛ", semester: 6, year: 3, ects: 6, required: false, group: "A", titleEl: "Θαλάσσια Οικολογία", tasks: ["understand","research","papers","practice"] },

          { code: "ΒΙΟ_ΑΝΒ", semester: 7, year: 4, ects: 6, required: false, group: "B", titleEl: "Ανοσοβιολογία", tasks: ["understand","papers","research","practice"] },
          { code: "ΒΙΟ_ΕΗΒ", semester: 7, year: 4, ects: 3, required: false, group: "B", titleEl: "Εφαρμοσμένη Ηθική και Βιοηθική", tasks: ["understand","research","papers","feedback"] },
          { code: "ΒΙΟ_ΝΕΥ", semester: 7, year: 4, ects: 3, required: false, group: "B", titleEl: "Νευροβιολογία", tasks: ["understand","papers","research","notes"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://biology.upatras.gr/wp-content/uploads/sites/229/2022/03/Course_Outines_Biology-Dpt-2022_GRE.pdf",
            syllabusSourceAcademicYear: "2021-2022",
            topics: [
              "Οργάνωση του Κεντρικού Νευρικού Συστήματος - δομή και λειτουργία νευρικών κυττάρων και κυττάρων της γλοίας",
              "Αξονική ροή, μεταφορά και μεταβολισμός του εγκεφάλου",
              "Συναπτική διαβίβαση",
              "Νευροδιαβιβαστικά συστήματα: GABAεργικό, κατεχολαμινεργικό και γλουταμινεργικό",
              "Εξέλιξη και ανάπτυξη του Κεντρικού Νευρικού Συστήματος, νεοφλοιός, γυρεγκεφαλία, μυελίνη και νευρικά βλαστικά κύτταρα",
              "Επιβίωση νευρικών κυττάρων, γήρανση και νευροεκφύλιση",
              "Παθοφυσιολογία της κίνησης",
              "Ειδικές αισθήσεις: όραση, ακοή, γεύση και όσφρηση",
              "Αναλγησία",
              "Ύπνος και εγρήγορση",
              "Νευροβιολογία της γλώσσας και γλωσσικές διαταραχές",
              "Δοκιμασίες καταγραφής συμπεριφοράς",
              "Νευροαπεικονιστικές τεχνικές PET, MRI και fMRI και σχετικά ηθικά/κοινωνικά διλήμματα",
              "Σύγχρονα θέματα Νευροβιολογίας και τεχνολογίες αιχμής"
            ] },
          { code: "ΒΙΟ_ΔΙΠΛ1", semester: 7, year: 4, ects: 6, required: false, group: "B", titleEl: "Διπλωματική Εργασία Ι", tasks: ["research","papers","feedback","notes"] },
          { code: "ΒΙΟ_ΠΡΧ", semester: 7, year: 4, ects: 6, required: false, group: "B", titleEl: "Πρακτική Άσκηση Ι", tasks: ["notes","feedback","research"] },

          { code: "ΒΙΟ_ΔΙΠΛ2", semester: 8, year: 4, ects: 12, required: false, group: "C", titleEl: "Διπλωματική Εργασία ΙΙ", tasks: ["research","papers","feedback","notes"] },
          { code: "ΒΙΟ_ΠΡΕ", semester: 8, year: 4, ects: 6, required: false, group: "C", titleEl: "Πρακτική Άσκηση ΙΙ", tasks: ["notes","feedback","research"] }
        ]
      },

      "hmu-ece": {
        institutionId: "hmu",
        schoolEl: "Σχολή Μηχανικών",
        departmentEl: "Τμήμα Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών",
        departmentEn: "Department of Electrical and Computer Engineering",
        degreeLevel: 7,
        nominalSemesters: 10,
        coverageStatus: "pilot-source-locked",
        sourceConfidence: "high",
        curriculumDisplay: "year-semester-course-topic",
        legacyInstitutionAliases: ["ΤΕΙ Κρήτης"],
        currentAcademicYearSource: "https://ece.hmu.gr/proptyxiakes/programma-spoydwn/",
        notesEl: "Η τρέχουσα κατανομή μαθημάτων προέρχεται από την επίσημη σελίδα του Τμήματος. Αναλυτική AI ύλη ενεργοποιείται μόνο σε μαθήματα με επίσημο περίγραμμα.",
        sources: [
          "https://ece.hmu.gr/proptyxiakes/programma-spoydwn/",
          "https://ece.hmu.gr/proptyxiakes/odigos-spoydwn/",
          "https://hmu.gr/"
        ],
        courses: [
          {
            code: "1.001", semester: 1, year: 1, ects: 6, required: true,
            titleEl: "Λογισμός I",
            tasks: ["understand","calculations","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://ece.hmu.gr/wp-content/uploads/2022/01/1.001_Logismos_1.pdf",
            syllabusSourceAcademicYear: "official outline",
            topics: [
              "Συναρτήσεις μιας μεταβλητής",
              "Εκθετική, λογαριθμική, τριγωνομετρικές και υπερβολικές συναρτήσεις",
              "Όρια και συνέχεια",
              "Παράγωγος και εφαρμογές",
              "Πολικές και παραμετρικές συναρτήσεις",
              "Ακολουθίες και σειρές πραγματικών αριθμών",
              "Δυναμοσειρές και σειρές Taylor",
              "Αόριστα και ορισμένα ολοκληρώματα",
              "Μέθοδοι ολοκλήρωσης και γενικευμένα ολοκληρώματα",
              "Συνήθεις διαφορικές εξισώσεις πρώτης τάξης"
            ]
          },
          {
            code: "1.002", semester: 1, year: 1, ects: 5, required: true,
            titleEl: "Γραμμική Άλγεβρα",
            tasks: ["understand","calculations","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://ece.hmu.gr/wp-content/uploads/2021/04/1_002_grammikh_algebra.pdf",
            syllabusSourceAcademicYear: "official outline",
            topics: [
              "Αναλυτική γεωμετρία, διανύσματα και διανυσματικοί χώροι",
              "Υποχώροι, γραμμική ανεξαρτησία, βάση και διάσταση",
              "Εσωτερικό, εξωτερικό και μικτό γινόμενο",
              "Γραμμικές απεικονίσεις",
              "Πίνακες και ορίζουσες",
              "Αντίστροφος πίνακας και αλγόριθμος Gauss",
              "Γραμμικά συστήματα και απαλοιφή Gauss/Gauss-Jordan",
              "Ελάχιστα τετράγωνα",
              "Ιδιοτιμές και ιδιοδιανύσματα",
              "Παραγοντοποιήσεις LU",
              "Εφαρμογές με Matlab/Python"
            ]
          },
          { code: "1.003", semester: 1, year: 1, ects: 6, required: true, titleEl: "Φυσική", tasks: ["understand","calculations","practice"] },
          {
            code: "1.004", semester: 1, year: 1, ects: 6, required: true,
            titleEl: "Δομημένος Προγραμματισμός",
            tasks: ["understand","coding","practice"],
            topicsVerified: true,
            syllabusStatus: "verified-official-outline",
            syllabusSource: "https://ece.hmu.gr/wp-content/uploads/2021/10/1_004_Domimenos_Programmatismos-10-21.pdf",
            syllabusSourceAcademicYear: "official outline",
            topics: [
              "Βασικές αρχές σχεδίασης και υλοποίησης δομημένων προγραμμάτων",
              "Γλώσσα προγραμματισμού C",
              "Ανάλυση προβλημάτων και αλγοριθμική επίλυση",
              "Δομές ακολουθίας, επιλογής και επανάληψης",
              "Συναρτήσεις και δομημένη αποσύνθεση προγραμμάτων"
            ]
          },
          { code: "1.005", semester: 1, year: 1, ects: 4, required: true, titleEl: "Ηλεκτροτεχνικά Υλικά I", tasks: ["understand","practice"] },
          { code: "1.006", semester: 1, year: 1, ects: 3, required: true, titleEl: "Επιστημονικός Προγραμματισμός με την Python", tasks: ["understand","coding","practice"] },
          { code: "3.001", semester: 3, year: 2, titleEl: "Διαφορικές Εξισώσεις και Μιγαδική Ανάλυση", tasks: ["understand","calculations","practice"] },
          { code: "3.002", semester: 3, year: 2, titleEl: "Ηλεκτρικά Κυκλώματα ΙΙ", tasks: ["understand","calculations","practice"] },
          { code: "3.003", semester: 3, year: 2, titleEl: "Θεωρία Πιθανοτήτων και Στατιστική", tasks: ["understand","calculations","practice","papers"] },
          { code: "3.004", semester: 3, year: 2, titleEl: "Ηλεκτρονική Ι", tasks: ["understand","calculations","practice"] },
          { code: "3.005", semester: 3, year: 2, titleEl: "Εισαγωγή στις Βάσεις Δεδομένων", tasks: ["understand","coding","practice"] },
          { code: "3.006", semester: 3, year: 2, titleEl: "Τεχνικό Σχέδιο", tasks: ["understand","practice","feedback"] }
        ]
      },
    },
  });

  window.AITOOLSKIDS_HIGHER_EDUCATION = DATA;
})();
