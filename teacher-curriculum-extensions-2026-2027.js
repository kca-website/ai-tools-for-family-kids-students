(function(){
  "use strict";

  const META={
    version:"1.0.1",
    schoolYear:"2026-2027",
    verified:"2026-09-12",
    note:"Official school-book/topic references and current IEP frameworks used only as the type of evidence stated per entry; they are not silently promoted to a separate E.A.E. examinable syllabus."
  };

  const SOURCES={
    homeA:"https://ebooks.edu.gr/ebooks/handle/8547/133",
    infoA:"https://ebooks.edu.gr/ebooks/handle/8547/139",
    infoB:"https://ebooks.edu.gr/ebooks/handle/8547/140",
    infoC:"https://ebooks.edu.gr/ebooks/handle/8547/141",
    musicA:"https://ebooks.edu.gr/ebooks/v/html/8547/2258/Mousiki_A-Gymnasiou_html-empl/",
    musicB:"https://ebooks.edu.gr/ebooks/v/html/8547/2300/Mousiki_B-Gymnasiou_html-empl/",
    musicC:"https://ebooks.edu.gr/ebooks/v/html/8547/2304/Mousiki_G-Gymnasiou_html-empl/",
    artA:"https://ebooks.edu.gr/ebooks/handle/8547/94",
    artB:"https://ebooks.edu.gr/ebooks/handle/8547/95",
    artC:"https://ebooks.edu.gr/ebooks/handle/8547/96",
    skills:"https://www.iep.edu.gr/ergastiria-dexiotiton-2-2/",
    eneegyl:"https://www.iep.edu.gr/yli-kai-odigies-didaskalias-en-e-e-gy-l-gia-to-scholiko-etos-2026-2027/"
  };

  const HOME_A=[
    "Οικογένεια και κοινωνικός περίγυρος",
    "Οικονομικά της οικογένειας και οικογενειακός προϋπολογισμός",
    "Διατροφή και ομάδες τροφίμων",
    "Αγωγή υγείας και πρόληψη ατυχημάτων",
    "Κατοικία",
    "Ενδυμασία"
  ];

  const INFO={
    a:[
      "Γνωριμία με τον υπολογιστή",
      "Το λογισμικό του υπολογιστή",
      "Χρήση εργαλείων έκφρασης και δημιουργίας",
      "Γνωριμία με το διαδίκτυο και τις υπηρεσίες του",
      "Ο υπολογιστής στην καθημερινή μας ζωή"
    ],
    b:[
      "Κεφάλαιο 1 — Ψηφιακός Κόσμος",
      "Κεφάλαιο 2 — Το Εσωτερικό του Υπολογιστή",
      "Κεφάλαιο 3 — Πολυμέσα",
      "Κεφάλαιο 4 — Δίκτυα Υπολογιστών",
      "Χρήση εργαλείων έκφρασης, επικοινωνίας, ανακάλυψης και δημιουργίας",
      "Ο υπολογιστής στο επάγγελμα"
    ],
    c:[
      "Ενότητα 1 — Γνωρίζω τον υπολογιστή ως ενιαίο σύστημα - Προγραμματισμός",
      "Κεφάλαιο 1 — Εισαγωγή στην Έννοια του Αλγορίθμου και στον Προγραμματισμό",
      "Κεφάλαιο 2 — Ο Προγραμματισμός στην πράξη",
      "Ενότητα 2 — Χρήση εργαλείων έκφρασης, επικοινωνίας, ανακάλυψης και δημιουργίας",
      "Ενότητα 3 — Ο υπολογιστής στην κοινωνία και στον πολιτισμό"
    ]
  };

  const MUSIC={
    a:[
      "Α΄ Ενότητα — Ρυθμός, Ήχος, Χρώματα",
      "Β΄ Ενότητα — Υφαίνω μουσική",
      "Δ΄ Ενότητα — Υφαίνω κι άλλη μουσική",
      "Ε΄ Ενότητα — Ταξιδεύω με τη μουσική",
      "ΣΤ΄ Ενότητα — Χορεύω με τη μουσική",
      "Η΄ Ενότητα — Σχέδιο συνθετικής εργασίας: Το νερό"
    ],
    b:[
      "Κεφάλαιο 1 — Ένας κόσμος... μετά μουσικής",
      "Κεφάλαιο 2 — Σε ρυθμούς... αφρικάνικους",
      "Κεφάλαιο 3 — Μελωδικοί εξωτικοί αυτοσχεδιασμοί",
      "Κεφάλαιο 4 — Μουσική για... χορό",
      "Κεφάλαιο 5 — Ευρωπαϊκές προδιαγραφές",
      "Κεφάλαιο 6 — Ο γύρος της Ελλάδας"
    ],
    c:[
      "Το ταξίδι της μουσικής στον 20ό αιώνα",
      "Εικόνα και Ήχος",
      "Από το γκόσπελ στο ροκ",
      "Ελληνικές μουσικές ιστορίες",
      "Στις γειτονιές του ελληνικού τραγουδιού",
      "Αντί επιλόγου — σχέδια εργασίας"
    ]
  };

  const ART={
    a:[
      "Υλικά, αντίληψη του ωραίου και αφαίρεση",
      "Χρώμα",
      "Σύνθεση",
      "Ζωγραφική",
      "Κινούμενο σχέδιο",
      "Κεραμική και γλυπτική",
      "Χαρακτική",
      "Εικαστική δημιουργία με αφετηρία ένα θέμα",
      "Παρθενώνας και Ιστορία της Τέχνης",
      "Αισθητική ανάλυση και κριτική έργου τέχνης"
    ],
    b:[
      "1η ενότητα — Υλικά και τεχνικές στις Εικαστικές τέχνες",
      "2η ενότητα — Εφαρμοσμένες τέχνες",
      "3η ενότητα — Μορφικά στοιχεία της εικαστικής γλώσσας",
      "4η ενότητα — Έργο τέχνης και Ιστορία της τέχνης"
    ],
    c:[
      "1η ενότητα — Μορφικά στοιχεία της εικαστικής γλώσσας",
      "2η ενότητα — Εφαρμοσμένες Τέχνες και χρηστικά έργα",
      "3η ενότητα — Νέες Τεχνολογίες στις εικαστικές τέχνες",
      "4η ενότητα — Σύγχρονες Μορφές Εικαστικών Τεχνών και ο ρόλος των τεχνών στον πολιτισμό"
    ]
  };

  const SKILLS=[
    "Ζω Καλύτερα – Ευ Ζην",
    "Φροντίζω το Περιβάλλον",
    "Ενδιαφέρομαι και Ενεργώ – Κοινωνική Συναίσθηση και Ευθύνη",
    "Δημιουργώ και Καινοτομώ – Δημιουργική Σκέψη και Πρωτοβουλία"
  ];

  const ZDD=[
    "Δραστηριότητες με βάση ενδιαφέροντα και δυνατότητες μαθητών/τριών",
    "Βιωματική, συνεργατική και δημιουργική μάθηση",
    "Ομαδικό θέμα με στόχους, πορεία εργασίας και παραδοτέα",
    "Θεματικά πεδία: υγεία, σταδιοδρομία, τέχνες, περιβάλλον και αθλητισμός",
    "Αξιολόγηση με έμφαση στη συμμετοχή, τη συνέπεια και τη συνεργασία"
  ];

  function addEntry(C,{id,schoolType,grade,gradeLabel,subject,subjectId,topics,sourceUrl,sourceTitle,basis="official-digital-textbook-extension",coverageStatus="reference",note=""}){
    if(!C?.entries||!topics?.length) return false;
    if(C.entries[id] && (C.entries[id].officialAnchors||[]).length) return false;
    C.entries[id]={
      id,schoolType,grade,gradeLabel,subject,subjectId,
      subjectType:"Επαληθευμένη αναφορά για επιλογή ενότητας στον AI Βοηθό Εκπαιδευτικού",
      status:"verified",
      coverageStatus,
      verificationBasis:basis,
      verificationDate:META.verified,
      sourceTitle,sourceUrl,
      officialAnchors:[...topics],
      verificationNote:note||"Οι επιλογές προέρχονται από την αναφερόμενη επίσημη πηγή και χρησιμοποιούνται ως πλαίσιο επιλογής ενότητας. Δεν αποτελούν από μόνες τους δήλωση ξεχωριστής εξεταστέας ύλης Ε.Α.Ε."
    };
    return true;
  }

  function addGymBookMappings(C){
    const grades={a:"Α΄ Γυμνασίου",b:"Β΄ Γυμνασίου",c:"Γ΄ Γυμνασίου"};
    const infoSources={a:SOURCES.infoA,b:SOURCES.infoB,c:SOURCES.infoC};
    const musicSources={a:SOURCES.musicA,b:SOURCES.musicB,c:SOURCES.musicC};
    const artSources={a:SOURCES.artA,b:SOURCES.artB,c:SOURCES.artC};

    addEntry(C,{id:"teacher-ext-special-gym-a-home",schoolType:"special-gymnasium",grade:"A",gradeLabel:grades.a,subject:"Οικιακή Οικονομία",subjectId:"home-economics",topics:HOME_A,sourceUrl:SOURCES.homeA,sourceTitle:"Διαδραστικά Σχολικά Βιβλία — Οικιακή Οικονομία Α΄ Γυμνασίου"});
    ["a","b","c"].forEach(g=>{
      addEntry(C,{id:`teacher-ext-special-gym-${g}-informatics`,schoolType:"special-gymnasium",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Πληροφορική",subjectId:"informatics",topics:INFO[g],sourceUrl:infoSources[g],sourceTitle:`Διαδραστικά Σχολικά Βιβλία — Πληροφορική ${grades[g]}`});
      addEntry(C,{id:`teacher-ext-special-gym-${g}-music`,schoolType:"special-gymnasium",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Μουσική",subjectId:"music",topics:MUSIC[g],sourceUrl:musicSources[g],sourceTitle:`Διαδραστικά Σχολικά Βιβλία — Μουσική ${grades[g]}`});
      addEntry(C,{id:`teacher-ext-special-gym-${g}-art`,schoolType:"special-gymnasium",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Καλλιτεχνικά",subjectId:"art",topics:ART[g],sourceUrl:artSources[g],sourceTitle:`Διαδραστικά Σχολικά Βιβλία — Καλλιτεχνικά ${grades[g]}`});
      addEntry(C,{id:`teacher-ext-special-gym-${g}-skills`,schoolType:"special-gymnasium",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Εργαστήρια Δεξιοτήτων",subjectId:"skills-labs",topics:SKILLS,sourceUrl:SOURCES.skills,sourceTitle:"ΙΕΠ — Εργαστήρια Δεξιοτήτων 2026-2027",basis:"iep-skills-labs-2026-27",coverageStatus:"framework",note:"Οι τέσσερις θεματικές προέρχονται από το τρέχον πλαίσιο Εργαστηρίων Δεξιοτήτων του ΙΕΠ. Χρησιμοποιούνται ως θεματικοί άξονες και όχι ως ισχυρισμός συγκεκριμένης εξεταστέας ύλης."});
    });

    addEntry(C,{id:"teacher-ext-eneegyl-gym-a-home",schoolType:"eneegyl",grade:"A",gradeLabel:grades.a,subject:"Οικιακή Οικονομία",subjectId:"homeEconomics",topics:HOME_A,sourceUrl:SOURCES.homeA,sourceTitle:"Διαδραστικά Σχολικά Βιβλία — Οικιακή Οικονομία Α΄ Γυμνασίου"});
    ["a","b","c"].forEach(g=>{
      addEntry(C,{id:`teacher-ext-eneegyl-gym-${g}-music`,schoolType:"eneegyl",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Μουσική / Θεατρική Αγωγή",subjectId:"musicTheatre",topics:MUSIC[g],sourceUrl:musicSources[g],sourceTitle:`Διαδραστικά Σχολικά Βιβλία — Μουσική ${grades[g]}`,coverageStatus:"partial-reference",note:"Η επίσημη αναφορά καλύπτει το σκέλος Μουσικής του συνδυαστικού μαθήματος «Μουσική / Θεατρική Αγωγή». Δεν παρουσιάζεται ως πλήρης χαρτογράφηση του σκέλους Θεατρικής Αγωγής."});
      addEntry(C,{id:`teacher-ext-eneegyl-gym-${g}-art`,schoolType:"eneegyl",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Καλλιτεχνικά",subjectId:"arts",topics:ART[g],sourceUrl:artSources[g],sourceTitle:`Διαδραστικά Σχολικά Βιβλία — Καλλιτεχνικά ${grades[g]}`});
      addEntry(C,{id:`teacher-ext-eneegyl-gym-${g}-skills`,schoolType:"eneegyl",grade:g.toUpperCase(),gradeLabel:grades[g],subject:"Εργαστήρια Δεξιοτήτων",subjectId:"skills",topics:SKILLS,sourceUrl:SOURCES.skills,sourceTitle:"ΙΕΠ — Εργαστήρια Δεξιοτήτων 2026-2027",basis:"iep-skills-labs-2026-27",coverageStatus:"framework",note:"Οι τέσσερις θεματικές προέρχονται από το τρέχον πλαίσιο Εργαστηρίων Δεξιοτήτων του ΙΕΠ και χρησιμοποιούνται ως θεματικοί άξονες."});
    });
  }

  function addEneegylLyceumMappings(C){
    [
      ["B","Β΄ Λυκείου","teacher-ext-eneegyl-lyc-b-zdd"],
      ["C","Γ΄ Λυκείου","teacher-ext-eneegyl-lyc-c-zdd"]
    ].forEach(([grade,gradeLabel,id])=>addEntry(C,{
      id,schoolType:"eneegyl",grade,gradeLabel,subject:"Ζώνη Δημιουργικών Δραστηριοτήτων",subjectId:"creative-zone",topics:ZDD,
      sourceUrl:SOURCES.eneegyl,
      sourceTitle:"ΙΕΠ — Ύλη και οδηγίες διδασκαλίας ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026-2027: Ζώνη Δημιουργικών Δραστηριοτήτων Α΄-Γ΄ Λυκείου",
      basis:"annual-instructions-2026-27",coverageStatus:"official-course-guidance",
      note:"Η τρέχουσα σελίδα του ΙΕΠ για το 2026-2027 αναφέρει ρητά το μάθημα ως Προσανατολισμού στην Α΄ και Γενικής Παιδείας στη Β΄ και Γ΄ Λυκείου ΕΝ.Ε.Ε.ΓΥ.-Λ. Οι άξονες χρησιμοποιούνται ως πλαίσιο σχεδιασμού δραστηριότητας."
    }));
  }

  function run(){
    const C=window.SPECIAL_EDUCATION_CURRICULUM;
    if(!C?.entries) return;
    addGymBookMappings(C);
    addEneegylLyceumMappings(C);
    window.AITOOLSKIDS_TEACHER_CURRICULUM_EXTENSIONS_2026_2027=Object.freeze({meta:META,sources:Object.freeze({...SOURCES})});
    if(typeof window.refreshSubjects==="function" && ["specialGym","eneegyl"].includes(document.getElementById("context")?.value)) window.refreshSubjects();
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run,{once:true});
  else run();
})();
