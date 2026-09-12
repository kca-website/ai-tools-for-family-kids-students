(function(){
  "use strict";

  const ECONOMICS_C_URL="https://ebooks.edu.gr/ebooks/handle/8547/5581";
  const SEP_C_URL="https://old.ebooks.edu.gr/new/tautotita.php?course=DSGYM-C111";
  const COMPOSITION_2026_URL="https://www.iep.edu.gr/wp-content/uploads/2026/09/162056_1_2026_07_31_%CE%95%CE%9E%CE%95_103707_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%95%CE%A6%CE%91%CE%A1%CE%9C_%CE%A4%CE%95%CE%A7%CE%9D%CE%A9%CE%9D_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_9%CE%9B%CE%A3646%CE%9D%CE%9A%CE%A0%CE%94_9%CE%92%CE%9F.pdf";
  const ENEEGYL_2026_URL="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-en-e-e-gy-l-gia-to-scholiko-etos-2026-2027/";

  function add(C,e){
    if(!C?.entries || C.entries[e.id]) return false;
    C.entries[e.id]={
      status:"verified",
      coverageStatus:"support-reference",
      verificationDate:"2026-09-12",
      verificationBasis:"official-reference-extension",
      subjectType:"Επαληθευμένη αναφορά για επιλογή ενότητας στον AI Βοηθό Εκπαιδευτικού",
      ...e
    };
    return true;
  }

  function run(){
    const C=window.SPECIAL_EDUCATION_CURRICULUM;
    if(!C?.entries) return;

    add(C,{
      id:"teacher-extra-special-gym-c-economics",
      schoolType:"special-gymnasium",
      grade:"C",
      gradeLabel:"Γ΄ Γυμνασίου",
      subject:"Οικονομικά",
      subjectId:"economics",
      sourceTitle:"Διαδραστικά Σχολικά Βιβλία — Οικονομικά Γ΄ Γυμνασίου",
      sourceUrl:ECONOMICS_C_URL,
      officialAnchors:[
        "Ακαθάριστο Εγχώριο Προϊόν (ΑΕΠ)",
        "Πληθωρισμός",
        "Αποταμίευση",
        "Απλά χρηματοπιστωτικά εργαλεία"
      ],
      verificationNote:"Επίσημο σχολικό μάθημα/βιβλίο Γ΄ Γυμνασίου. Χρησιμοποιείται ως επαληθευμένη αναφορά ενότητας για το αντίστοιχο μάθημα του Ειδικού Γυμνασίου, όχι ως δήλωση ξεχωριστής εξεταστέας ύλης Ε.Α.Ε."
    });

    add(C,{
      id:"teacher-extra-eneegyl-gym-c-career",
      schoolType:"eneegyl",
      grade:"C",
      gradeLabel:"Γ΄ Γυμνασίου",
      subject:"Σχολικός Επαγγελματικός Προσανατολισμός",
      subjectId:"career",
      sourceTitle:"Διαδραστικά Σχολικά Βιβλία — ΣΕΠ Γ΄ Γυμνασίου",
      sourceUrl:SEP_C_URL,
      officialAnchors:[
        "Ενότητα 1 — Το ελληνικό εκπαιδευτικό σύστημα",
        "Ενότητα 2 — Ο κόσμος της εργασίας",
        "Ενότητα 3 — Ανακαλύπτω τον εαυτό μου",
        "Ενότητα 4 — Αντιλήψεις για τους συνανθρώπους",
        "Ενότητα 5 — Πληροφόρηση",
        "Ενότητα 6 — Οι αποφάσεις στη ζωή μας"
      ],
      verificationNote:"Το επίσημο σχολικό βιβλίο ΣΕΠ της Γ΄ Γυμνασίου χρησιμοποιείται ως υποστηρικτική αναφορά για το ομώνυμο μάθημα της Γ΄ Γυμνασίου ΕΝ.Ε.Ε.ΓΥ.-Λ. Δεν παρουσιάζεται ως ξεχωριστή επίσημη ύλη ΕΝ.Ε.Ε.ΓΥ.-Λ."
    });

    add(C,{
      id:"teacher-extra-eneegyl-lyc-a-composition",
      schoolType:"eneegyl",
      grade:"A",
      gradeLabel:"Α΄ Λυκείου",
      subject:"Βασικές Αρχές Σύνθεσης",
      subjectId:"composition",
      sourceTitle:"ΙΕΠ 2026-2027 — Βασικές Αρχές Σύνθεσης Α΄ ΕΠΑ.Λ. (ισοδύναμη τρέχουσα αναφορά μαθήματος)",
      sourceUrl:COMPOSITION_2026_URL,
      annualInstructionsUrl:ENEEGYL_2026_URL,
      coverageStatus:"equivalent-course-reference",
      officialAnchors:[
        "Κεφάλαιο 1 — Γενικά για την τέχνη (1.1–1.4)",
        "Κεφάλαιο 2 — Η σύνθεση στις εφαρμοσμένες τέχνες (2.1–2.3)",
        "Κεφάλαιο 3 — Τα γεωμετρικά στοιχεία της σύνθεσης (3.1–3.4)",
        "Κεφάλαιο 4 — Τα χρωματικά στοιχεία της σύνθεσης (4.1–4.5)",
        "Κεφάλαιο 5 — Τα υλικά στοιχεία της σύνθεσης (5.1–5.4)"
      ],
      verificationNote:"Η επίσημη σελίδα ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026-2027 επιβεβαιώνει ότι το μάθημα υπάρχει στην Α΄ Λυκείου. Τα συγκεκριμένα κεφάλαια προέρχονται από την τρέχουσα επίσημη οδηγία του ομώνυμου μαθήματος Α΄ ΕΠΑ.Λ. και εμφανίζονται μόνο ως ισοδύναμη υποστηρικτική αναφορά, όχι ως δήλωση ότι αποτελούν αυτούσια την επίσημη ύλη ΕΝ.Ε.Ε.ΓΥ.-Λ."
    });

    window.AITOOLSKIDS_TEACHER_SPECIAL_EXTRA_2026_2027=Object.freeze({
      version:"1.0.0",
      verified:"2026-09-12",
      sources:Object.freeze({economicsC:ECONOMICS_C_URL,sepC:SEP_C_URL,composition2026:COMPOSITION_2026_URL,eneegyl2026:ENEEGYL_2026_URL})
    });

    if(typeof window.refreshSubjects==="function" && ["specialGym","eneegyl"].includes(document.getElementById("context")?.value)) window.refreshSubjects();
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run,{once:true});
  else run();
})();
