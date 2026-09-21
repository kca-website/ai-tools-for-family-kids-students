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
  const BIOLOGY_A_PDF="https://dide.ira.sch.gr/wp-content/uploads/2026/09/%CE%92%CE%99%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91-%CE%91-%CE%9BYK-EAE-%CE%9F%CE%94%CE%97%CE%93%CE%99%CE%95%CE%A3-2026-27.pdf";
  const biologyA=Object.freeze([
    "Κεφάλαιο 1: Από το κύτταρο στον οργανισμό — Κύτταρα και ιστοί",
    "Κεφάλαιο 1: Από το κύτταρο στον οργανισμό — Όργανα και συστήματα οργάνων",
    "Κεφάλαιο 3: Κυκλοφορικό Σύστημα — Καρδιά",
    "Κεφάλαιο 3: Κυκλοφορικό Σύστημα — Αιμοφόρα αγγεία",
    "Κεφάλαιο 3: Κυκλοφορικό Σύστημα — Η κυκλοφορία του αίματος",
    "Κεφάλαιο 3: Κυκλοφορικό Σύστημα — Αίμα",
    "Κεφάλαιο 9: Νευρικό Σύστημα — Δομή και λειτουργία νευρικών κυττάρων",
    "Κεφάλαιο 9: Νευρικό Σύστημα — Περιφερικό Νευρικό Σύστημα",
    "Κεφάλαιο 9: Νευρικό Σύστημα — Κεντρικό Νευρικό Σύστημα",
    "Κεφάλαιο 9: Νευρικό Σύστημα — Αυτόνομο Νευρικό Σύστημα",
    "Κεφάλαιο 12: Αναπαραγωγή – Ανάπτυξη — Δομή και λειτουργία αναπαραγωγικού συστήματος",
    "Κεφάλαιο 12: Αναπαραγωγή – Ανάπτυξη — Από τη μείωση στη γονιμοποίηση",
    "Κεφάλαιο 12: Αναπαραγωγή – Ανάπτυξη — Ανάπτυξη του εμβρύου και τοκετός (εκτός «Αυλάκωση», «Εμφύτευση», «Σχηματισμός πλακούντα»)"
  ]);
  const BIOLOGY_B_PDF="https://dide.ira.sch.gr/wp-content/uploads/2026/09/%CE%92%CE%99%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91-%CE%92-%CE%9B%CE%A5%CE%9A-%CE%95%CE%91%CE%95-%CE%9F%CE%94%CE%97%CE%93%CE%99%CE%95%CE%A3-2026-27.pdf";
  const biologyB=Object.freeze([
    "1.1 Παράγοντες που επηρεάζουν την υγεία του ανθρώπου",
    "1.2 Μικροοργανισμοί",
    "1.2.1 Κατηγορίες παθογόνων μικροοργανισμών — εκτός «Πολλαπλασιασμός των ιών»",
    "1.2.2 Μετάδοση και αντιμετώπιση των παθογόνων μικροοργανισμών",
    "1.3 Μηχανισμοί άμυνας του ανθρώπινου οργανισμού – Βασικές αρχές ανοσίας",
    "1.3.1 Μηχανισμοί μη ειδικής άμυνας",
    "1.3.2 Μηχανισμοί ειδικής άμυνας – Ανοσία",
    "1.3.3 Προβλήματα στη δράση του ανοσοβιολογικού συστήματος",
    "1.3.4 AIDS — εκτός «Αντιμετώπιση της ασθένειας» και «Κοινωνικό πρόβλημα»",
    "1.5 Ουσίες που προκαλούν εθισμό",
    "2.1 Η έννοια του οικοσυστήματος",
    "2.1.1 Χαρακτηριστικά οικοσυστημάτων",
    "2.2 Ροή Ενέργειας",
    "2.2.1 Τροφικές αλυσίδες και τροφικά πλέγματα",
    "2.2.2 Τροφικές πυραμίδες και τροφικά επίπεδα",
    "2.3 Βιογεωχημικοί κύκλοι",
    "2.3.1 Ο κύκλος του άνθρακα",
    "2.3.2 Ο κύκλος του αζώτου",
    "2.3.3 Ο κύκλος του νερού",
    "2.4.3 Ερημοποίηση",
    "2.4.4 Ρύπανση — μόνο εισαγωγή, «Το φαινόμενο του θερμοκηπίου» και «Ρύπανση των υδάτων»",
    "3.1.1 Ταξινόμηση των οργανισμών και εξέλιξη",
    "3.1.3 Η θεωρία της Φυσικής Επιλογής",
    "3.1.4 Αποσαφηνίσεις στη θεωρία της φυσικής επιλογής",
    "3.1.5 Η φυσική επιλογή εν δράσει",
    "3.3 Τι είναι η φυλογένεση και από πού αντλούμε σχετικά στοιχεία",
    "3.4 Η εξέλιξη του ανθρώπου",
    "3.4.1 Το γενεαλογικό μας δέντρο",
    "3.4.2 Η εμφάνιση των Θηλαστικών και των Πρωτευόντων",
    "3.4.3 Τα χαρακτηριστικά των Πρωτευόντων",
    "3.4.5 Η εμφάνιση των Ανθρωπιδών",
    "3.4.6 Οι πρώτοι άνθρωποι"
  ]);
  const BIOLOGY_C_PDF="https://dide.ira.sch.gr/wp-content/uploads/2026/09/%CE%92%CE%99%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91-%CE%93-%CE%9B%CE%A5%CE%9A-%CE%95%CE%91%CE%95-%CE%A0%CE%A1%CE%9F%CE%A3%CE%91%CE%9D%CE%91%CE%A4%CE%9F%CE%9B%CE%99%CE%A3%CE%9C%CE%9F%CE%A3-%CE%9F%CE%94%CE%97%CE%93%CE%99%CE%95%CE%A3-2026-27.pdf";
  const biologyC=Object.freeze([
    "Τεύχος Α΄, 1.2 Μακρομόρια — μόνο «Πρωτεΐνες: Διαδεδομένες, πολύπλοκες και εύθραυστες»",
    "Τεύχος Α΄, Κεφάλαιο 2 — Εισαγωγή",
    "Τεύχος Α΄, 2.3 — «Πυρήνας»",
    "Τεύχος Α΄, 2.3 — «Ενδομεμβρανικό σύστημα» μόνο το οριζόμενο απόσπασμα για το αδρό ενδοπλασματικό δίκτυο",
    "Τεύχος Α΄, 2.3 — «Χλωροπλάστες και Μιτοχόνδρια – Οι μετατροπείς ενέργειας των κυττάρων»",
    "Τεύχος Α΄, 3.2 Ένζυμα και Βιολογικοί Καταλύτες — μόνο «Μηχανισμός δράσης» και «Ιδιότητες των ενζύμων»",
    "Τεύχος Β΄, Κεφάλαιο 1: Το γενετικό υλικό — όλες οι παράγραφοι",
    "Τεύχος Α΄, 4.1 Κύκλος ζωής του κυττάρου",
    "Τεύχος Α΄, 4.3 Κυτταρική διαίρεση — ο επιχιασμός δεν περιλαμβάνεται σε ασκήσεις",
    "Τεύχος Β΄, Κεφάλαιο 2: Αντιγραφή, έκφραση και ρύθμιση της γενετικής πληροφορίας — όλες οι παράγραφοι",
    "Τεύχος Β΄, Κεφάλαιο 4: Τεχνολογία του ανασυνδυασμένου DNA — όλες οι παράγραφοι",
    "Τεύχος Β΄, Κεφάλαιο 5: Μενδελική κληρονομικότητα — όλες οι παράγραφοι",
    "Τεύχος Β΄, Κεφάλαιο 6: Μεταλλάξεις — όλες οι παράγραφοι",
    "Τεύχος Β΄, Κεφάλαιο 7: Αρχές και μεθοδολογία της Βιοτεχνολογίας — εκτός της παραγράφου για την παραγωγή πενικιλίνης",
    "Τεύχος Β΄, Κεφάλαιο 8: Εφαρμογές της Βιοτεχνολογίας στην Ιατρική — όλες οι παράγραφοι",
    "Τεύχος Β΄, Κεφάλαιο 9: Εφαρμογές της Βιοτεχνολογίας στη γεωργία και την κτηνοτροφία — όλες οι παράγραφοι"
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
      }),
      "a|biology":Object.freeze({
        id:"special-lyceum-a-biology-official-2026-27",grade:"A",gradeId:"a",gradeLabel:"Α΄ Λυκείου",
        subject:"Βιολογία",subjectId:"biology",sourceSubjectIds:Object.freeze(["biology","biologia-a-lykeiou"]),status:"verified",coverageStatus:"exact",
        schoolYear:"2026-2027",verificationDate:"2026-09-21",annualInstructionsStatus:"verified",
        verificationBasis:"official-special-lyceum-annual-guidance",sourceTitle:"Βιολογία Α΄ Λυκείου Ε.Α.Ε. — Οδηγίες 2026–27",
        sourceUrl:BIOLOGY_A_PDF,officialAnchors:biologyA,
        verificationNote:"Ακριβής μεταφορά της ρητά οριζόμενης ύλης των κεφαλαίων 1, 3, 9 και 12, μαζί με τις δηλωμένες εξαιρέσεις."
      }),
      "b|biology":Object.freeze({
        id:"special-lyceum-b-biology-official-2026-27",grade:"B",gradeId:"b",gradeLabel:"Β΄ Λυκείου",
        subject:"Βιολογία",subjectId:"biology",sourceSubjectIds:Object.freeze(["biology","biologia-b-lykeiou"]),status:"verified",coverageStatus:"exact",
        schoolYear:"2026-2027",verificationDate:"2026-09-21",annualInstructionsStatus:"verified",
        verificationBasis:"official-special-lyceum-annual-guidance",sourceTitle:"Βιολογία Β΄ Λυκείου Ε.Α.Ε. — Οδηγίες 2026–27",
        sourceUrl:BIOLOGY_B_PDF,officialAnchors:biologyB,
        verificationNote:"Ακριβής section-level μεταφορά των Κεφαλαίων 1–3 της επίσημης οδηγίας, με τις ρητές εξαιρέσεις να παραμένουν ορατές."
      }),
      "c|biology":Object.freeze({
        id:"special-lyceum-c-biology-official-2026-27",grade:"C",gradeId:"c",gradeLabel:"Γ΄ Λυκείου",
        subject:"Βιολογία Προσανατολισμού",subjectId:"biology",sourceSubjectIds:Object.freeze(["biology","biologia-g-lykeiou"]),status:"verified",coverageStatus:"exact",
        schoolYear:"2026-2027",verificationDate:"2026-09-21",annualInstructionsStatus:"verified",
        verificationBasis:"official-special-lyceum-annual-guidance",sourceTitle:"Βιολογία Προσανατολισμού Γ΄ Λυκείου Ε.Α.Ε. — Οδηγίες 2026–27",
        sourceUrl:BIOLOGY_C_PDF,officialAnchors:biologyC,
        verificationNote:"Ακριβής μεταφορά των ρητά περιλαμβανόμενων κεφαλαίων/παραγράφων από τα Τεύχη Α΄ και Β΄, με τις εξαιρέσεις και τους περιορισμούς της οδηγίας."
      })
    })
  };
  Object.freeze(map);

  const curriculum=window.SPECIAL_EDUCATION_CURRICULUM;
  if(curriculum?.entries) Object.values(map.entries).forEach((entry)=>{
    curriculum.entries[entry.id]={...entry,schoolType:"special-lyceum",subjectType:"Ύλη 2026–27"};
  });
})();
