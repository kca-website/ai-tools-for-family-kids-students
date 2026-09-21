(function(){
  "use strict";

  const VERIFIED="2026-09-21";
  const HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-en-e-e-gy-l-gia-to-scholiko-etos-2026-2027/";
  const SOURCES={
    a:"https://www.iep.edu.gr/wp-content/uploads/2026/09/E%CE%9E%CE%95%CE%A4%CE%91%CE%96%CE%9F%CE%9C%CE%95%CE%9D%CE%91-%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%91_%CE%95%CE%A0%CE%91%CE%9B-%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_%CE%91_2026-20271.zip",
    b:"https://www.iep.edu.gr/wp-content/uploads/2026/09/E%CE%9E%CE%95%CE%A4%CE%91%CE%96%CE%9F%CE%9C%CE%95%CE%9D%CE%91-%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%91_%CE%95%CE%A0%CE%91%CE%9B-%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_%CE%92_2026-20271.zip",
    c:"https://www.iep.edu.gr/wp-content/uploads/2026/09/E%CE%9E%CE%95%CE%A4%CE%91%CE%96%CE%9F%CE%9C%CE%95%CE%9D%CE%91-%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%91_%CE%95%CE%A0%CE%91%CE%9B-%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_%CE%93_2026-20271.zip",
    d:"https://www.minedu.gov.gr/publications/docs2026/%CE%A6%CE%95%CE%9A_4239_%CE%92_2026_%CE%A5%CE%9B%CE%97_%CE%A0%CE%91%CE%9D%CE%95%CE%9B%CE%9B%CE%91%CE%94_%CE%94_%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5-%CE%9B_2026-2027.pdf"
  };

  const A=Object.freeze([
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — δραστηριότητες και θεματικοί κύκλοι του σχολικού εγχειριδίου, όπως ορίζονται στην εξεταστέα ύλη"
  ]);

  const B=Object.freeze([
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — Ενότητα 1",
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — Ενότητα 2",
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — Ενότητα 3",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — Ενότητα 1",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — Ενότητα 4",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — Ενότητα 6"
  ]);

  const C=Object.freeze([
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — Ενότητα 4",
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — Ενότητα 5",
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — Ενότητα 6",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — Ενότητα 2",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — Ενότητα 3",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — Ενότητα 5"
  ]);

  const D=Object.freeze([
    "Νέα Ελληνικά Γ΄ ΕΠΑ.Λ. — σχολικό εγχειρίδιο",
    "Νέα Ελληνικά Β΄ ΕΠΑ.Λ. — σχολικό εγχειρίδιο",
    "Νέα Ελληνικά Α΄ ΕΠΑ.Λ. — σχολικό εγχειρίδιο"
  ]);

  function entry(grade,gradeLabel,topics,sourceUrl,scopeNote){
    return {
      id:`eneegyl-lyc-${grade}-new-greek-2026-27`,
      schoolType:"eneegyl",
      grade:grade.toUpperCase(),
      gradeId:`lyc-${grade}`,
      gradeLabel,
      subject:"Νέα Ελληνικά",
      subjectId:"new-greek",
      subjectType:grade==="d"?"Διδακτέα-εξεταστέα ύλη 2026–27":"Εξεταστέα ύλη 2026–27",
      status:"verified",
      coverageStatus:grade==="d"?"panhellenic-verified":"exam-verified",
      verificationBasis:grade==="d"?"panhellenic-FEK-B-4239-2026":"official-written-exam-syllabus-2026-27",
      verificationDate:VERIFIED,
      annualInstructionsStatus:"verified",
      currentExamSyllabusStatus:"verified",
      sourceTitle:grade==="d"?`Νέα Ελληνικά Δ΄ Λυκείου ΕΝ.Ε.Ε.ΓΥ.-Λ. — διδακτέα/εξεταστέα ύλη 2026–27`:`Νέα Ελληνικά ${gradeLabel} ΕΝ.Ε.Ε.ΓΥ.-Λ. — εξεταστέα ύλη 2026–27`,
      sourceUrl,
      sourceHub:HUB,
      officialAnchors:[...topics],
      verificationNote:scopeNote
    };
  }

  const ROWS=[
    entry("a","Α΄ Λυκείου",A,SOURCES.a,"Η επίσημη εξεταστέα ύλη ορίζει δραστηριότητες που απορρέουν από θεματικούς κύκλους του σχολικού εγχειριδίου Α΄ ΕΠΑ.Λ. Δεν επινοούνται τεχνητοί τίτλοι κεφαλαίων."),
    entry("b","Β΄ Λυκείου",B,SOURCES.b,"Ακριβής μεταφορά του επίσημου exam scope: Ενότητες 1, 2, 3 του βιβλίου Β΄ ΕΠΑ.Λ. και Ενότητες 1, 4, 6 του βιβλίου Α΄ ΕΠΑ.Λ."),
    entry("c","Γ΄ Λυκείου",C,SOURCES.c,"Ακριβής μεταφορά του επίσημου exam scope: Ενότητες 4, 5, 6 του βιβλίου Β΄ ΕΠΑ.Λ. και Ενότητες 2, 3, 5 του βιβλίου Α΄ ΕΠΑ.Λ."),
    entry("d","Δ΄ Λυκείου",D,SOURCES.d,"Η ΥΑ 90676/Δ3 ορίζει ως διδακτέα-εξεταστέα ύλη τα σχολικά εγχειρίδια Νέα Ελληνικά Α΄, Β΄ και Γ΄ ΕΠΑ.Λ. Το site τα εμφανίζει σε επίπεδο βιβλίου και δεν κατασκευάζει ανύπαρκτη κλειστή λίστα ενοτήτων.")
  ];

  const CATALOG=window.SPECIAL_EDUCATION_CURRICULUM;
  if(CATALOG?.entries) ROWS.forEach(e=>{CATALOG.entries[e.id]=e;});
  window.AITOOLSKIDS_ENEEGYL_NEW_GREEK_2026_2027=Object.freeze({
    version:"1.0.0",verified:VERIFIED,sourceHub:HUB,entries:Object.freeze(ROWS.map(e=>e.id))
  });
})();