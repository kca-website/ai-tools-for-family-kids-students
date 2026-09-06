window.SPECIAL_EDUCATION_CURRICULUM = {
  schoolYear: "2026-2027",
  verificationDate: "2026-09-06",
  disclaimer: "Η ύπαρξη θεματικού τίτλου ή topic anchor δεν αποδεικνύει από μόνη της ότι αποτελεί εξεταστέα ύλη. Η επίσημη εγκύκλιος και οι ισχύουσες οδηγίες παραμένουν η πηγή αναφοράς.",
  officialHubUrl: "https://www.minedu.gov.gr/eidiki-entaksiaki-ekpaidefsi",
  schools: {
    specialGymnasium: {
      id: "special-gymnasium",
      label: "Ειδικό Γυμνάσιο",
      type: "general-education",
      status: "pending-2026-27-subject-verification",
      note: "Ξεχωριστό dataset από το ΕΝ.Ε.Ε.ΓΥ.-Λ. Δεν χρησιμοποιούμε παλαιότερες οδηγίες ως τρέχουσα ύλη χωρίς νέα επαλήθευση."
    },
    eneegyl: {
      id: "eneegyl",
      label: "ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      type: "vocational-technological",
      status: "active"
    }
  },
  entries: {
    "eneegyl-a-zdd": {
      id: "eneegyl-a-zdd",
      schoolType: "eneegyl",
      grade: "A",
      gradeLabel: "Α΄ Λυκείου",
      subject: "Ζώνη Δημιουργικών Δραστηριοτήτων",
      subjectType: "Μάθημα Προσανατολισμού",
      status: "verified",
      coverageStatus: "pilot",
      annualInstructionsStatus: "verified",
      verificationDate: "2026-09-06",
      protocol: "113779/Δ3 · 02/09/2026",
      sourceTitle: "Οδηγίες για τη διδασκαλία του μαθήματος «Ζώνη Δημιουργικών Δραστηριοτήτων» στο Λύκειο των ΕΝ.Ε.Ε.ΓΥ.-Λ. για το σχολικό έτος 2026-2027",
      sourceUrl: "https://www.minedu.gov.gr/site/70752-03-09-26-enkyklioi-me-ten-yle-odegies-mathematon-eneegy-l",
      sourcePdfUrl: "https://www.minedu.gov.gr/publications/docs2026/%CE%A8%CE%96%CE%9D%CE%9A46%CE%9D%CE%9A%CE%A0%CE%94-4%CE%A96_%CE%96%CE%94%CE%94.pdf",
      officialAnchors: [
        "Δραστηριότητες με βάση ενδιαφέροντα και δυνατότητες μαθητών/τριών",
        "Βιωματική, συνεργατική και δημιουργική μάθηση",
        "Ομαδικό θέμα με στόχους, πορεία εργασίας και παραδοτέα",
        "Θεματικά πεδία όπως υγεία, σταδιοδρομία, τέχνες, περιβάλλον και αθλητισμός",
        "Αξιολόγηση με έμφαση στη συμμετοχή, τη συνέπεια και τη συνεργασία"
      ]
    }
  },
  sourceIndex: [
    {id:"eneegyl-2026-economy", order:1, title:"Διοίκηση και Οικονομία", firstGradeSubject:"Αρχές Οικονομίας", status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-structures", order:2, title:"Δομικά Έργα, Δομημένο Περιβάλλον και Αρχιτεκτονικός Σχεδιασμός", firstGradeSubject:"Αρχές Γραμμικού και Αρχιτεκτονικού Σχεδίου", status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-health", order:3, title:"Υγεία - Πρόνοια - Ευεξία", firstGradeSubject:"Αγωγή Υγείας", status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-arts", order:4, title:"Εφαρμοσμένες Τέχνες", firstGradeSubject:"Βασικές Αρχές Σύνθεσης", status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-research-tech", order:5, title:"Κοινό μάθημα Προσανατολισμού", firstGradeSubject:"Ερευνητική Εργασία στην Τεχνολογία", status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-mechanics", order:6, title:"Μηχανολογία", firstGradeSubject:"Αρχές Μηχανολογίας", status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-informatics", order:7, title:"Πληροφορική", firstGradeSubject:null, status:"source-indexed", coverageStatus:"pending-mapping"},
    {id:"eneegyl-2026-zdd", order:8, title:"Κοινό μάθημα Προσανατολισμού / Γενικής Παιδείας", firstGradeSubject:"Ζώνη Δημιουργικών Δραστηριοτήτων", status:"verified", coverageStatus:"pilot", curriculumId:"eneegyl-a-zdd"},
    {id:"eneegyl-2026-agriculture", order:9, title:"Γεωπονία, Τρόφιμα και Περιβάλλον", firstGradeSubject:"Γεωπονία και Αειφόρος Ανάπτυξη", status:"source-indexed", coverageStatus:"pending-mapping"}
  ]
};