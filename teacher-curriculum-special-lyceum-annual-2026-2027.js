/**
 * Special Lyceum E.A.E. — exact annual mappings from the 2026–27 guidance.
 * Only subjects whose official PDF has been read section-by-section belong here.
 */
(function(){
  "use strict";

  const SOURCE_HUB="https://dide.ira.sch.gr/ekpedevtika-themata/ekp260915/";
  const INFORMATICS_A_PDF="https://dide.ira.sch.gr/wp-content/uploads/2026/09/%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%9A%CE%97_%CE%91_%CE%9B%CE%A5%CE%9A_-%CE%95%CE%91%CE%95_2026_27.pdf";
  const sections=Object.freeze([
    "7.1 Προγραμματισμός εφαρμογών για φορητές συσκευές",
    "7.2 Αντικειμενοστρεφής προγραμματισμός σε 3D περιβάλλον",
    "9.3 Από τον Web 1.0 στον Web X.0",
    "10.1 Υπηρεσίες Διαδικτύου",
    "10.2 Ο παγκόσμιος ιστός, υπηρεσίες και εφαρμογές Διαδικτύου",
    "11.1 Γενική εισαγωγή στην HTML",
    "11.2 Η HTML ως γλώσσα σήμανσης",
    "11.3 Ενσωμάτωση αντικειμένων σε σελίδα HTML",
    "11.4 Καθορίζοντας την εμφάνιση — CSS",
    "13.1 Εισαγωγή στις εφαρμογές Νέφους",
    "13.2 Μοντέλα υπηρεσιών Νέφους",
    "13.3 Εφαρμογές υπηρεσιών Νέφους",
    "14.2 Επικοινωνία και συνεργασία από απόσταση",
    "15.1 Γενικά για τα Κοινωνικά Δίκτυα",
    "15.2 Κατηγορίες Κοινωνικών Δικτύων",
    "15.3 Πλεονεκτήματα και μειονεκτήματα χρήσης Κοινωνικών Δικτύων",
    "16.1 Ασφάλεια υπολογιστικού συστήματος",
    "16.2 Θέματα ασφάλειας και προστασίας στο Διαδίκτυο",
    "16.3 Πληροφορίες, πνευματικά δικαιώματα και πειρατεία λογισμικού στο Διαδίκτυο",
    "16.4 Ιδιωτικότητα και προσωπικά δεδομένα στο Διαδίκτυο"
  ]);
  const INFORMATICS_B_PDF="https://dide.ira.sch.gr/wp-content/uploads/2026/09/%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%9A%CE%97_%CE%92_%CE%9B%CE%A5%CE%9A_%CE%95%CE%91%CE%95_2026_27.pdf";
  const sectionsB=Object.freeze([
    "1.1 Επιστήμη των Υπολογιστών",
    "2.1 Πρόβλημα",
    "2.2 Αλγόριθμοι — εκτός 2.2.2, 2.2.3, 2.2.4, 2.2.7.5, 2.2.7.6, 2.2.8, 2.2.10",
    "2.3 Προγραμματισμός — εκτός 2.3.1.2, 2.3.1.3, 2.3.3",
    "3.1 Εφαρμοσμένη Επιστήμη των Υπολογιστών",
    "3.2 Λειτουργικά Συστήματα",
    "3.3 Πληροφοριακά Συστήματα",
    "3.4 Δίκτυα και Τεχνητή Νοημοσύνη"
  ]);
  const INFORMATICS_C_PDF="https://dide.ira.sch.gr/wp-content/uploads/2026/09/%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%9A%CE%97-_%CE%93_%CE%9B%CE%A5%CE%9A_-%CE%95%CE%91%CE%95-%CE%A0%CE%A1%CE%9F%CE%A3%CE%91%CE%9D-2026-27.pdf";
  const sectionsC=Object.freeze([
    "1.1–1.4 Η έννοια, κατανόηση και δομή προβλήματος — καθορισμός απαιτήσεων",
    "2.1–2.3 Τι είναι αλγόριθμος — σπουδαιότητα, περιγραφή και αναπαράσταση",
    "4.1 Ανάλυση προβλημάτων",
    "6.1, 6.4, 6.4.1–6.4.3 Πρόγραμμα και τεχνικές σχεδίασης — ιεραρχικός, τμηματικός και δομημένος προγραμματισμός",
    "6.3 Φυσικές και τεχνητές γλώσσες",
    "6.7 Προγραμματιστικά περιβάλλοντα",
    "7.1–7.4 Αλφάβητο της ΓΛΩΣΣΑΣ — τύποι δεδομένων, σταθερές και μεταβλητές",
    "7.5–7.7 Αριθμητικοί τελεστές, συναρτήσεις και αριθμητικές εκφράσεις",
    "2.4.1, 7.8–7.10 Δομή ακολουθίας — εκχώρηση, είσοδος/έξοδος και δομή προγράμματος",
    "2.4.2–2.4.4, 8.1–8.1.2 και Βιβλίο 2 §3.1–3.1.2 Δομή επιλογής",
    "2.4.5, 8.2–8.2.3 Δομές επανάληψης",
    "13.1 και Βιβλίο 2 §5.1 Κατηγορίες λαθών",
    "Βιβλίο 2 §5.2.1–5.2.5 Εκσφαλμάτωση λογικών λαθών",
    "Βιβλίο 2 §2.1 Διαίρει και βασίλευε — μόνο επαναληπτική προσέγγιση",
    "3.1–3.7 Δομές δεδομένων, πίνακες, αναζήτηση και ταξινόμηση",
    "9.1–9.4 Μονοδιάστατοι/πολυδιάστατοι πίνακες και τυπικές επεξεργασίες",
    "3.4–3.5 και Βιβλίο 2 §1.1–1.2 Στοίβα και ουρά",
    "10.1–10.6 Τμηματικός προγραμματισμός — διαδικασίες, συναρτήσεις, παράμετροι και εμβέλεια",
    "Βιβλίο 2 §1.3.1–1.3.4 Λίστες, δένδρα και γράφοι",
    "6.5 και Βιβλίο 2 §4.1–4.6 Αντικειμενοστραφής προγραμματισμός"
  ]);

  const map=window.AITOOLSKIDS_SPECIAL_LYCEUM_ANNUAL_2026_2027={
    version:"1.0.0",schoolYear:"2026-2027",verificationDate:"2026-09-20",sourceHub:SOURCE_HUB,
    entries:Object.freeze({
      "a|informatics":Object.freeze({
        id:"special-lyceum-a-informatics-official-2026-27",grade:"A",gradeId:"a",gradeLabel:"Α΄ Λυκείου",
        subject:"Εφαρμογές Πληροφορικής",subjectId:"informatics",sourceSubjectIds:Object.freeze(["informatics","pliroforiki-a-lykeiou"]),status:"verified",coverageStatus:"exact",
        schoolYear:"2026-2027",verificationDate:"2026-09-20",annualInstructionsStatus:"verified",
        verificationBasis:"official-special-lyceum-annual-guidance",sourceTitle:"Εφαρμογές Πληροφορικής Α΄ Λυκείου Ε.Α.Ε. — Οδηγίες 2026–27",
        sourceUrl:INFORMATICS_A_PDF,officialAnchors:sections,
        verificationNote:"Ακριβής μεταφορά της διδακτέας ύλης: κεφάλαια 7, 9.3, 10, 11, 13, 14.2, 15 και 16."
      }),
      "b|informatics":Object.freeze({
        id:"special-lyceum-b-informatics-official-2026-27",grade:"B",gradeId:"b",gradeLabel:"Β΄ Λυκείου",
        subject:"Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ",subjectId:"informatics",sourceSubjectIds:Object.freeze(["informatics","pliroforiki-b-lykeiou"]),status:"verified",coverageStatus:"exact",
        schoolYear:"2026-2027",verificationDate:"2026-09-21",annualInstructionsStatus:"verified",
        verificationBasis:"official-special-lyceum-annual-guidance",sourceTitle:"Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ Β΄ Λυκείου Ε.Α.Ε. — Οδηγίες 2026–27",
        sourceUrl:INFORMATICS_B_PDF,officialAnchors:sectionsB,
        verificationNote:"Ακριβής μεταφορά από τον πίνακα «Διδακτέα ύλη» της επίσημης οδηγίας. Διατηρούνται ρητά οι εξαιρέσεις των κεφαλαίων 2.2 και 2.3."
      }),
      "c|informatics":Object.freeze({
        id:"special-lyceum-c-informatics-official-2026-27",grade:"C",gradeId:"c",gradeLabel:"Γ΄ Λυκείου",
        subject:"Πληροφορική Προσανατολισμού",subjectId:"informatics",sourceSubjectIds:Object.freeze(["informatics","pliroforiki-g-lykeiou"]),status:"verified",coverageStatus:"exact",
        schoolYear:"2026-2027",verificationDate:"2026-09-21",annualInstructionsStatus:"verified",
        verificationBasis:"official-special-lyceum-annual-guidance",sourceTitle:"Πληροφορική Προσανατολισμού Γ΄ Λυκείου Ε.Α.Ε. — Οδηγίες 2026–27",
        sourceUrl:INFORMATICS_C_PDF,officialAnchors:sectionsC,
        verificationNote:"Οι επιλογές προέρχονται από τον επίσημο Πίνακα 1 «Προτεινόμενη Διδασκαλία» και ομαδοποιούν μόνο τις ρητά καταγεγραμμένες ενότητες των δύο βασικών εγχειριδίων."
      })
    })
  };
  Object.freeze(map);

  const curriculum=window.SPECIAL_EDUCATION_CURRICULUM;
  if(curriculum?.entries) Object.values(map.entries).forEach((entry)=>{
    curriculum.entries[entry.id]={...entry,schoolType:"special-lyceum",subjectType:"Ύλη 2026–27"};
  });
})();
