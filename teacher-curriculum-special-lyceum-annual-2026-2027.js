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
      })
    })
  };
  Object.freeze(map);

  const curriculum=window.SPECIAL_EDUCATION_CURRICULUM;
  const entry=map.entries["a|informatics"];
  if(curriculum?.entries) curriculum.entries[entry.id]={...entry,schoolType:"special-lyceum",subjectType:"Ύλη 2026–27"};
})();
