(function(){
  "use strict";

  const VERIFIED="2026-09-21";
  const HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-en-e-e-gy-l-gia-to-scholiko-etos-2026-2027/";
  const SOURCES={
    a:"https://www.iep.edu.gr/wp-content/uploads/2026/09/E%CE%9E%CE%95%CE%A4%CE%91%CE%96%CE%9F%CE%9C%CE%95%CE%9D%CE%91-%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%91_%CE%95%CE%A0%CE%91%CE%9B-%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_%CE%91_2026-20271.zip",
    b:"https://www.iep.edu.gr/wp-content/uploads/2026/09/E%CE%9E%CE%95%CE%A4%CE%91%CE%96%CE%9F%CE%9C%CE%95%CE%9D%CE%91-%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%91_%CE%95%CE%A0%CE%91%CE%9B-%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_%CE%92_2026-20271.zip"
  };

  const A=Object.freeze([
    "2.1 Η έννοια της δύναμης",
    "2.2 Τα χαρακτηριστικά της δύναμης",
    "2.3 Δυνάμεις επαφής και δυνάμεις από απόσταση",
    "2.5 Η δύναμη ως αιτία παραμόρφωσης — Νόμος Hooke",
    "2.6 Μέτρηση δυνάμεων με δυναμόμετρο",
    "2.8 Σύνθεση δυνάμεων — μόνο συγγραμμικές και κάθετες, εκτός του λυμένου παραδείγματος",
    "2.9 Ανάλυση δύναμης σε συνιστώσες",
    "2.10 Δράση - Αντίδραση — 3ος νόμος του Νεύτωνα",
    "4.1.6 Μέση ταχύτητα",
    "4.1.7 Στιγμιαία ταχύτητα — εκτός του μαθηματικού προβληματισμού",
    "4.2 Αδράνεια — 1ος νόμος του Νεύτωνα για την κίνηση — εκτός του ιστορικού σημειώματος",
    "4.3.1 Μελέτη της ευθύγραμμης ομαλής κίνησης",
    "4.4.1 Η έννοια της επιτάχυνσης",
    "4.4.2 Εξισώσεις κίνησης - Διαγράμματα — εκτός αποδείξεων τύπων και παραδείγματος 3",
    "4.5 Δύναμη — Το μυστικό της επιτάχυνσης — 2ος νόμος του Νεύτωνα",
    "4.5.2 Βάρος — περιλαμβάνονται τα παραδείγματα 1, 3, 4 και 5",
    "4.9.1 Δυνάμεις τριβής",
    "4.9.2 Πού οφείλεται η τριβή",
    "4.10 Στατική τριβή — εκτός του υπολογισμού του nορ",
    "4.11 Τριβή ολίσθησης — εκτός του παραδείγματος με δύο σώματα/τροχαλία και του «ας στοχαστούμε»",
    "5.1 Από τη βιολογική εργασία στο φυσικό έργο",
    "5.2 Έργο σταθερής δύναμης — μέχρι την αναφορά στον James P. Joule, περιλαμβάνεται το παράδειγμα",
    "5.3.1 Το βάρος, το έργο και η συντήρηση",
    "5.4 Ρυθμοί έργου — μέχρι τη σχέση 5.3",
    "5.6 Έργο και ενέργεια: οι δύο όψεις του ίδιου νομίσματος — εκτός αποδείξεων, περιλαμβάνεται το δεύτερο παράδειγμα"
  ]);

  const B=Object.freeze([
    "1.1 Ο νόμος του Coulomb",
    "1.2 Ηλεκτρικό πεδίο",
    "1.4 Δυναμικό - Διαφορά δυναμικού",
    "2.1 Ηλεκτρικές πηγές",
    "2.2 Ηλεκτρικό ρεύμα",
    "2.3 Κανόνες του Kirchhoff",
    "2.4 Αντίσταση - Αντιστάτης",
    "2.5 Συνδεσμολογία αντιστατών (αντιστάσεων)",
    "2.7 Ενέργεια και ισχύς του ηλεκτρικού ρεύματος",
    "2.8 Ηλεκτρεγερτική δύναμη (ΗΕΔ) πηγής",
    "2.9 Νόμος του Ohm για κλειστό κύκλωμα"
  ]);

  function entry(grade,gradeLabel,topics,sourceUrl){
    return {
      id:`eneegyl-lyc-${grade}-physics-2026-27`,
      schoolType:"eneegyl",
      grade:grade.toUpperCase(),
      gradeId:`lyc-${grade}`,
      gradeLabel,
      subject:"Φυσική",
      subjectId:"physics",
      subjectType:"Εξεταστέα ύλη 2026–27",
      status:"verified",
      coverageStatus:"exam-verified",
      verificationBasis:"official-written-exam-syllabus-2026-27",
      verificationDate:VERIFIED,
      annualInstructionsStatus:"verified",
      currentExamSyllabusStatus:"verified",
      sourceTitle:`Φυσική ${gradeLabel} ΕΝ.Ε.Ε.ΓΥ.-Λ. — εξεταστέα ύλη 2026–27`,
      sourceUrl,
      sourceHub:HUB,
      officialAnchors:[...topics],
      verificationNote:"Ακριβής μεταφορά της επίσημης εξεταστέας ύλης 2026–27. Οι ρητές εξαιρέσεις, τα όρια παραγράφων και οι περιορισμοί παραδειγμάτων παραμένουν δεσμευτικοί."
    };
  }

  const ROWS=[
    entry("a","Α΄ Λυκείου",A,SOURCES.a),
    entry("b","Β΄ Λυκείου",B,SOURCES.b)
  ];

  const CATALOG=window.SPECIAL_EDUCATION_CURRICULUM;
  if(CATALOG?.entries) ROWS.forEach(e=>{CATALOG.entries[e.id]=e;});
  window.AITOOLSKIDS_ENEEGYL_PHYSICS_2026_2027=Object.freeze({
    version:"1.0.0",verified:VERIFIED,sourceHub:HUB,entries:Object.freeze(ROWS.map(e=>e.id)),
    note:"Only A and B Lyceum are marked exam-exact here. C and D remain separate teaching-guidance/source-index work until their exact 2026-27 section scope is verified."
  });
})();