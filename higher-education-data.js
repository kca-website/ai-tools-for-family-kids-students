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
