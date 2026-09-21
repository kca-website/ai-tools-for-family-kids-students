(function(){
  "use strict";

  const VERIFIED="2026-09-21";
  const HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-en-e-e-gy-l-gia-to-scholiko-etos-2026-2027/";
  const EXAM_A="https://www.iep.edu.gr/wp-content/uploads/2026/09/E%CE%9E%CE%95%CE%A4%CE%91%CE%96%CE%9F%CE%9C%CE%95%CE%9D%CE%91-%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%91_%CE%95%CE%A0%CE%91%CE%9B-%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_%CE%91_2026-20271.zip";
  const GUIDANCE="https://www.iep.edu.gr/wp-content/uploads/2026/09/%CE%9E%CE%95%CE%9D%CE%95%CE%A3-%CE%93%CE%9B%CE%A9%CE%A3%CE%A3%CE%95%CE%A3_%CE%95%CE%9D%CE%95%CE%95%CE%93%CE%A5%CE%9B_2026-2027.zip";

  const A=Object.freeze([
    "General English A΄ EPAL — Unit 1",
    "General English A΄ EPAL — Unit 2",
    "General English A΄ EPAL — Unit 3",
    "General English A΄ EPAL — Unit 4",
    "General English A΄ EPAL — Unit 6"
  ]);

  const row={
    id:"eneegyl-lyc-a-english-2026-27",
    schoolType:"eneegyl",
    grade:"A",gradeId:"lyc-a",gradeLabel:"Α΄ Λυκείου",
    subject:"Αγγλικά",subjectId:"english",
    subjectType:"Εξεταστέα ύλη 2026–27",
    status:"verified",
    coverageStatus:"exam-verified",
    verificationBasis:"official-written-exam-syllabus-2026-27",
    verificationDate:VERIFIED,
    annualInstructionsStatus:"verified",
    currentExamSyllabusStatus:"verified",
    sourceTitle:"Αγγλικά Α΄ Λυκείου ΕΝ.Ε.Ε.ΓΥ.-Λ. — εξεταστέα ύλη 2026–27",
    sourceUrl:EXAM_A,
    instructionSourceUrl:GUIDANCE,
    sourceHub:HUB,
    officialAnchors:[...A],
    verificationNote:"Ακριβής μεταφορά των ρητά οριζόμενων Units 1, 2, 3, 4 και 6 από το βιβλίο Γενικά Αγγλικά Α΄ ΕΠΑ.Λ. Δεν προστίθενται άλλες ενότητες."
  };

  const CATALOG=window.SPECIAL_EDUCATION_CURRICULUM;
  if(CATALOG?.entries) CATALOG.entries[row.id]=row;
  window.AITOOLSKIDS_ENEEGYL_ENGLISH_2026_2027=Object.freeze({
    version:"1.0.0",verified:VERIFIED,sourceHub:HUB,guidanceSourceUrl:GUIDANCE,entries:Object.freeze([row.id]),
    note:"Only A Lyceum is marked exam-exact here. B-D keep the official 2026-27 foreign-language guidance source without fabricated fixed-unit scope."
  });
})();