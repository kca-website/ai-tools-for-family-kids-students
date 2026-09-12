(function(){
  "use strict";

  const ANNUAL="https://www.minedu.gov.gr/publications/docs2026/%CE%A807%CE%9C46%CE%9D%CE%9A%CE%A0%CE%94-%CE%9F%CE%A9%CE%94_%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%9A%CE%97%CE%A3.pdf";
  const FEK="https://www.minedu.gov.gr/publications/docs2026/%CE%A6%CE%95%CE%9A_4239_%CE%92_2026_%CE%A5%CE%9B%CE%97_%CE%A0%CE%91%CE%9D%CE%95%CE%9B%CE%9B%CE%91%CE%94_%CE%94_%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5-%CE%9B_2026-2027.pdf";
  const SECTOR="Πληροφορικής";
  const VERIFIED="2026-09-12";

  const PROGRAMMING_C=[
    "Κεφάλαιο 3 — Βασικά στοιχεία γλώσσας προγραμματισμού",
    "Κεφάλαιο 4 — Αλγοριθμικές δομές",
    "Κεφάλαιο 5 — Κλασικοί Αλγόριθμοι ΙΙ · 5.2 Ταξινόμηση Ευθείας ανταλλαγής",
    "Κεφάλαιο 8 — Δομές Δεδομένων ΙΙ · 8.1 Συμβολοσειρές και 8.2 Λίστες"
  ];
  const NETWORKS_C=[
    "Κεφάλαιο 1 — Βασικές έννοιες αρχιτεκτονικής και διασύνδεσης δικτύων · 1.2.2 TCP/IP και 1.3 Ενθυλάκωση",
    "Κεφάλαιο 2 — Τοπικά δίκτυα – Επίπεδο πρόσβασης δικτύου (TCP/IP)",
    "Κεφάλαιο 3 — Επίπεδο δικτύου – Διαδικτύωση"
  ];
  const PROGRAMMING_D=[
    "Κεφάλαιο 3 — Βασικά στοιχεία γλώσσας προγραμματισμού",
    "Κεφάλαιο 4 — Αλγοριθμικές δομές",
    "Κεφάλαιο 5 — Κλασικοί Αλγόριθμοι ΙΙ · δυαδική αναζήτηση και ταξινόμηση ευθείας ανταλλαγής",
    "Κεφάλαιο 6 — Διαχείριση Αρχείων",
    "Κεφάλαιο 7 — Προηγμένα στοιχεία γλώσσας προγραμματισμού",
    "Κεφάλαιο 8 — Δομές Δεδομένων ΙΙ · συμβολοσειρές, λίστες, στοίβα και ουρά",
    "Κεφάλαιο 11 — Αντικειμενοστρεφής Προγραμματισμός"
  ];
  const NETWORKS_D=[
    "Κεφάλαιο 1 — Βασικές έννοιες αρχιτεκτονικής και διασύνδεσης δικτύων",
    "Κεφάλαιο 2 — Τοπικά δίκτυα – Επίπεδο πρόσβασης δικτύου (TCP/IP)",
    "Κεφάλαιο 3 — Επίπεδο δικτύου – Διαδικτύωση",
    "Κεφάλαιο 4 — Επίπεδο μεταφοράς",
    "Κεφάλαιο 5 — Επεκτείνοντας το δίκτυο – Δίκτυα ευρείας περιοχής",
    "Κεφάλαιο 6 — Επίπεδο εφαρμογής",
    "Κεφάλαιο 7 — Διαχείριση δικτύου",
    "Κεφάλαιο 8 — Ασφάλεια δικτύων"
  ];

  function entry({id,grade,gradeLabel,subject,subjectId,topics,sourceUrl=ANNUAL,coverageStatus="official-course-guidance",verificationBasis="annual-instructions-2026-27",specialty="",note=""}){
    return {
      id,schoolType:"eneegyl",grade,gradeLabel,sector:SECTOR,specialty,subject,subjectId,
      subjectType:"Τρέχουσα επίσημη ύλη / οδηγίες διδασκαλίας ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27",
      status:"verified",coverageStatus,verificationBasis,verificationDate:VERIFIED,
      protocol:sourceUrl===ANNUAL?"113150/Δ3 · 01-09-2026":"90676/Δ3 · ΦΕΚ Β΄ 4239/13.07.2026",
      sourceTitle:sourceUrl===ANNUAL?"ΥΠΑΙΘΑ — Ύλη και οδηγίες Τομέα Πληροφορικής ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026-2027":"ΥΠΑΙΘΑ — Διδακτέα-εξεταστέα ύλη Πανελλαδικών Δ΄ ΕΝ.Ε.Ε.ΓΥ.-Λ. 2027",
      sourceUrl,
      officialAnchors:[...topics],
      verificationNote:note||"Οι επιλογές αποδίδουν την τρέχουσα επίσημη διδακτέα ύλη/οδηγία του συγκεκριμένου μαθήματος. Όπου η πηγή ορίζει εξαιρέσεις παραγράφων, αυτές παραμένουν δεσμευτικές ακόμη όταν το μενού εμφανίζει συνοπτικά κεφάλαια."
    };
  }

  const ROWS=[
    entry({id:"teacher-eneegyl-b-info-basics",grade:"B",gradeLabel:"Β΄ Λυκείου",subject:"Βασικά Θέματα Πληροφορικής",subjectId:"basic-informatics",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοί τους"]}),
    entry({id:"teacher-eneegyl-b-info-os-security",grade:"B",gradeLabel:"Β΄ Λυκείου",subject:"Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων",subjectId:"os-security",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός 1.8, 3.3.3, 5.3.4, 5.5 και Κεφαλαίου 6"]}),
    entry({id:"teacher-eneegyl-b-info-sales-specs",grade:"B",gradeLabel:"Β΄ Λυκείου",subject:"Τεχνικά Θέματα Πωλήσεων & Προδιαγραφών Υλικού και Λογισμικού",subjectId:"sales-specs",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός 1.2, Κεφαλαίου 3, 4.5 και Κεφαλαίου 6"]}),

    entry({id:"teacher-eneegyl-c-info-programming-principles",grade:"C",gradeLabel:"Γ΄ Λυκείου",subject:"Αρχές Προγραμματισμού Υπολογιστών",subjectId:"programming-principles",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός Κεφαλαίου 7 και παραγράφων 8.3 και 8.4"]}),
    entry({id:"teacher-eneegyl-c-info-hardware-networks",grade:"C",gradeLabel:"Γ΄ Λυκείου",subject:"Υλικό και Δίκτυα Υπολογιστών",subjectId:"hardware-networks",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός 3.2.2, 4.4, 5.2.5, 5.2.6 και 6.1.3"]}),
    entry({id:"teacher-eneegyl-c-info-websites",grade:"C",gradeLabel:"Γ΄ Λυκείου",subject:"Σχεδιασμός και Ανάπτυξη Ιστότοπων",subjectId:"website-design",topics:["Διδακτέα ύλη — Όλες οι ενότητες και οι παράγραφοί τους"]}),
    entry({id:"teacher-eneegyl-c-info-programming",grade:"C",gradeLabel:"Γ΄ Λυκείου",subject:"Προγραμματισμός Υπολογιστών",subjectId:"programming",topics:PROGRAMMING_C,coverageStatus:"exam-verified"}),
    entry({id:"teacher-eneegyl-c-info-networks",grade:"C",gradeLabel:"Γ΄ Λυκείου",subject:"Δίκτυα Υπολογιστών",subjectId:"networks",topics:NETWORKS_C,coverageStatus:"exam-verified",note:"Η επίσημη οδηγία περιλαμβάνει επιπλέον συγκεκριμένες υποστηρικτικές ενότητες εκτός εξεταστέας ύλης Πανελλαδικών. Το μενού κρατά ως κύριες επιλογές τα τρία επίσημα κεφάλαια της διδακτέας ύλης."}),

    entry({id:"teacher-eneegyl-d-info-apps-programming-theory",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Προγραμματισμός Υπολογιστών (Θ)",subjectId:"apps-programming-theory",topics:PROGRAMMING_D,sourceUrl:FEK,coverageStatus:"panhellenic-verified",verificationBasis:"panhellenic-FEK-B-4239-2026"}),
    entry({id:"teacher-eneegyl-d-info-apps-networks-theory",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Δίκτυα Υπολογιστών (Θ)",subjectId:"apps-networks-theory",topics:NETWORKS_D,sourceUrl:FEK,coverageStatus:"panhellenic-verified",verificationBasis:"panhellenic-FEK-B-4239-2026"}),
    entry({id:"teacher-eneegyl-d-info-apps-programming-lab",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Προγραμματισμός Υπολογιστών (Εργαστήριο)",subjectId:"apps-programming-lab",topics:["Κεφάλαιο 6","Κεφάλαιο 7 — 7.3, 7.3.1, 7.3.2, 7.3.3","Κεφάλαιο 9","Κεφάλαιο 10","Κεφάλαιο 11"]}),
    entry({id:"teacher-eneegyl-d-info-apps-networks-lab",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Δίκτυα Υπολογιστών (Εργαστήριο)",subjectId:"apps-networks-lab",topics:["Κεφάλαιο 2 — 2.1, 2.2, 2.2.1, 2.4, 2.4.2, 2.5, 2.5.1, 2.5.2","Κεφάλαιο 3 — εκτός 3.3.1","Κεφάλαιο 4","Κεφάλαιο 5 — 5.1.4, 5.1.4.1, 5.1.4.2","Κεφάλαιο 7 — 7.3, 7.3.1, 7.3.2, 7.3.4"]}),
    entry({id:"teacher-eneegyl-d-info-apps-is",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Πληροφοριακά Συστήματα σε Επιχειρήσεις και Οργανισμούς",subjectId:"apps-information-systems",topics:["Παράγραφος 1.5","Κεφάλαια 2 έως 8"]}),
    entry({id:"teacher-eneegyl-d-info-apps-db",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Συστήματα Διαχείρισης Βάσεων Δεδομένων και Εφαρμογές τους στο Διαδίκτυο",subjectId:"apps-db-web",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοί τους"]}),
    entry({id:"teacher-eneegyl-d-info-apps-special-programming",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Ειδικά Θέματα στον Προγραμματισμό Υπολογιστών",subjectId:"apps-special-programming",topics:["Ενότητα 1 — Κεφάλαια 1 έως 8","Ενότητα 2α — Κεφάλαια 1 έως 3 και 5 έως 12","Εναλλακτικά: Ενότητα 2β — Κεφάλαια 13 έως 20"]}),
    entry({id:"teacher-eneegyl-d-info-apps-webapps",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Εφαρμογών Πληροφορικής",subject:"Τεχνικός Εφαρμογών Πληροφορικής — Σχεδιασμός και Ανάπτυξη Διαδικτυακών Εφαρμογών",subjectId:"apps-web-apps",topics:["Κεφάλαιο 1 — 1.1, 1.2, 1.3, 1.7","Κεφάλαιο 2","Κεφάλαιο 3","Κεφάλαιο 4","Κεφάλαιο 5 — εκτός 5.3.3, 5.3.4, 5.4.10, 5.4.11, 5.4.12"]}),

    entry({id:"teacher-eneegyl-d-info-hw-programming-theory",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Προγραμματισμός Υπολογιστών (Θ)",subjectId:"hw-programming-theory",topics:PROGRAMMING_D,sourceUrl:FEK,coverageStatus:"panhellenic-verified",verificationBasis:"panhellenic-FEK-B-4239-2026"}),
    entry({id:"teacher-eneegyl-d-info-hw-networks-theory",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Δίκτυα Υπολογιστών (Θ)",subjectId:"hw-networks-theory",topics:NETWORKS_D,sourceUrl:FEK,coverageStatus:"panhellenic-verified",verificationBasis:"panhellenic-FEK-B-4239-2026"}),
    entry({id:"teacher-eneegyl-d-info-hw-programming-lab",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Προγραμματισμός Υπολογιστών (Εργαστήριο)",subjectId:"hw-programming-lab",topics:["Κεφάλαιο 6","Κεφάλαιο 7 — 7.3, 7.3.1, 7.3.2, 7.3.3","Κεφάλαιο 9","Κεφάλαιο 10","Κεφάλαιο 11"]}),
    entry({id:"teacher-eneegyl-d-info-hw-networks-lab",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Δίκτυα Υπολογιστών (Εργαστήριο)",subjectId:"hw-networks-lab",topics:["Κεφάλαιο 2 — 2.1, 2.2, 2.2.1, 2.4, 2.4.2, 2.5, 2.5.1, 2.5.2","Κεφάλαιο 3 — εκτός 3.3.1","Κεφάλαιο 4","Κεφάλαιο 5 — 5.1.4, 5.1.4.1, 5.1.4.2","Κεφάλαιο 7 — 7.3, 7.3.1, 7.3.2, 7.3.4"]}),
    entry({id:"teacher-eneegyl-d-info-hw-is",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Πληροφοριακά Συστήματα σε Επιχειρήσεις και Οργανισμούς",subjectId:"hw-information-systems",topics:["Παράγραφος 1.5","Κεφάλαια 2 έως 8"]}),
    entry({id:"teacher-eneegyl-d-info-hw-install",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Εγκατάσταση, Διαχείριση και Συντήρηση Υπολογιστικών Συστημάτων",subjectId:"hw-install-maintain",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός 2.7.1, 2.7.2, 2.7.3, 3.2.2, 4.4, 4.5, Κεφαλαίου 6 και 6.1–6.3"]}),
    entry({id:"teacher-eneegyl-d-info-hw-special",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Ειδικά Θέματα στο Υλικό και στα Δίκτυα Υπολογιστών",subjectId:"hw-special-hardware-networks",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός 5.3, 8.2.4–8.2.7 και Κεφαλαίου 10"]}),
    entry({id:"teacher-eneegyl-d-info-hw-support",grade:"D",gradeLabel:"Δ΄ Λυκείου",specialty:"Τεχνικός Η/Υ και Δικτύων Η/Υ",subject:"Τεχνικός Η/Υ και Δικτύων Η/Υ — Τεχνική Υποστήριξη Υπολογιστικών Συστημάτων και Δικτυακών Υποδομών",subjectId:"hw-technical-support",topics:["Διδακτέα ύλη — Όλα τα Κεφάλαια και οι παράγραφοι, εκτός 1.3 vi, 1.3 vii, 2.3, 3.1, 3.5, 3.7, 3.8, 3.11, 5.3, 5.4 και 5.6"]})
  ];

  function install(){
    const C=window.SPECIAL_EDUCATION_CURRICULUM;
    if(!C?.entries) return;
    ROWS.forEach(e=>{C.entries[e.id]=e;});
    window.AITOOLSKIDS_ENEEGYL_INFORMATICS_2026_2027=Object.freeze({
      version:"1.0.0",verified:VERIFIED,protocol:"113150/Δ3",sector:SECTOR,
      sourceUrl:ANNUAL,panhellenicSourceUrl:FEK,
      entries:Object.freeze(ROWS.map(x=>x.id))
    });
    if(typeof window.refreshSubjects==="function"&&document.getElementById("context")?.value==="eneegyl") window.refreshSubjects();
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
