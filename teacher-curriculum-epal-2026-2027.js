(function(){
  "use strict";

  const GENERAL_GUIDANCE="https://www.iep.edu.gr/wp-content/uploads/2026/09/162917_1_2026_09_08_%CE%95%CE%9E%CE%95_116898_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%93%CE%95%CE%9D_%CE%A0%CE%91%CE%99%CE%94%CE%95%CE%99%CE%91%CE%A3_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A1%CE%A6%CE%A3%CE%A546%CE%9D%CE%9A%CE%A0%CE%94_%CE%96%CE%9D9.pdf";
  const EPAL_HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/";
  const EPAL_GENERAL_HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-kai-p-epa-l-gia-to-scholiko-etos-2026-2027/";
  const FOREIGN_LANG="https://www.iep.edu.gr/wp-content/uploads/2026/09/162643_1_2026_08_28_%CE%95%CE%9E%CE%95_111814_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%9E%CE%95%CE%9D%CE%95%CE%A3_%CE%93%CE%9B%CE%A9%CE%A3%CE%A3%CE%95%CE%A3_%CE%95%CE%A0%CE%91%CE%9B_%CE%A0%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%A81%CE%9A646%CE%9D%CE%9A%CE%A0%CE%94_%CE%9573.pdf";
  const CS_BOOK="https://www.ebooks.edu.gr/ebooks/v/html/8547/2716/Pliroforiki_B-Lykeiou_html-empl/";
  const MARITIME_STRUCTURE="https://www.minedu.gov.gr/panelladikes-eksetaseis-pistopoiitika/anakoinwseis-ell-ex?id=1593&view=category";

  const NEW_GREEK={
    a:[
      "Βιώματα, εμπειρίες και ενδιαφέροντα των εφήβων",
      "Γνωριμία με τον κόσμο της επιστήμης και της τεχνολογίας",
      "Ο άνθρωπος και η φύση",
      "Ταξίδια",
      "Όψεις της σύγχρονης ενημέρωσης",
      "Πέρα από τα σύνορα"
    ],
    b:[
      "«Τη γλώσσα μού έδωσαν ελληνική»",
      "Οι ανησυχίες των νέων",
      "Εμείς και οι «άλλοι»",
      "Διαδρομές στον χώρο της τέχνης",
      "Ταξίδι στην ιστορία",
      "Ο άνθρωπος ως πολίτης"
    ],
    c:[
      "Από τον 20ό στον 21ο αιώνα",
      "Ο πολίτης και οι θεσμοί",
      "Ζώντας την καθημερινότητα",
      "Μιλώντας για προβλήματα του ανθρώπου και του κόσμου",
      "Η Ελλάδα και ο κόσμος"
    ]
  };

  const MATH_A=[
    "Εισαγωγικό κεφάλαιο — Ε.2 Σύνολα",
    "Κεφάλαιο 2 — Οι Πραγματικοί Αριθμοί",
    "Κεφάλαιο 3 — Εξισώσεις",
    "Κεφάλαιο 4 — Ανισώσεις",
    "Κεφάλαιο 5 — Πρόοδοι",
    "Κεφάλαιο 6 — Βασικές Έννοιες των Συναρτήσεων"
  ];

  const CS_B=[
    "Ενότητα 1 — Βασικές Έννοιες",
    "Κεφάλαιο 1.1 — Επιστήμη των Υπολογιστών",
    "Ενότητα 2 — Θέματα Θεωρητικής Επιστήμης των Υπολογιστών",
    "Κεφάλαιο 2.1 — Πρόβλημα",
    "Κεφάλαιο 2.2 — Αλγόριθμοι",
    "Κεφάλαιο 2.3 — Προγραμματισμός",
    "Ενότητα 3 — Θέματα Εφαρμοσμένης Επιστήμης των Υπολογιστών",
    "Κεφάλαιο 3.1 — Λειτουργικά Συστήματα",
    "Κεφάλαιο 3.2 — Πληροφοριακά Συστήματα",
    "Κεφάλαιο 3.3 — Δίκτυα Υπολογιστών",
    "Κεφάλαιο 3.4 — Τεχνητή Νοημοσύνη"
  ];

  const CS_C=[
    "Κεφάλαιο 1 — επίσημες σημειώσεις «Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ»",
    "Κεφάλαιο 2 — επίσημες σημειώσεις «Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ»",
    "Κεφάλαιο 3 — επίσημες σημειώσεις «Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ»"
  ];

  const ENGLISH_A=["Unit 1","Unit 2","Unit 3","Unit 4","Unit 6","Unit 7"];

  const SECTORS=[
    ["agriculture","Γεωπονίας, Τροφίμων και Περιβάλλοντος"],
    ["administration-economy","Διοίκησης και Οικονομίας"],
    ["structures","Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού"],
    ["applied-arts","Εφαρμοσμένων Τεχνών"],
    ["electrical","Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού"],
    ["mechanical","Μηχανολογίας"],
    ["maritime","Ναυτιλιακών Επαγγελμάτων"],
    ["informatics-sector","Πληροφορικής"],
    ["health","Υγείας - Πρόνοιας - Ευεξίας"]
  ];

  const common=(id,label,topics=[],extra={})=>({id,label,topics:[...topics],...extra});
  const gateway=(grade,id,label)=>common(`${grade}-sector-${id}`,`${grade==='b'?'Τομέας':'Ειδικότητες Τομέα'}: ${label}`,[],{sectorGateway:true,sourceUrl:id==='maritime'?MARITIME_STRUCTURE:EPAL_HUB});

  const GRADES={
    a:[
      common("new-greek","Νέα Ελληνικά",NEW_GREEK.a,{sourceUrl:GENERAL_GUIDANCE}),
      common("math","Μαθηματικά (Άλγεβρα + Γεωμετρία)",MATH_A,{sourceUrl:GENERAL_GUIDANCE}),
      common("physics","Φυσική",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("chemistry","Χημεία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("biology","Βιολογία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("civics","Πολιτική Παιδεία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("history","Ιστορία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("religion","Θρησκευτικά",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("pe","Φυσική Αγωγή",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("informatics","Πληροφορική",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("english","Αγγλικά",ENGLISH_A,{sourceUrl:FOREIGN_LANG}),
      common("research-technology","Ερευνητική Εργασία στην Τεχνολογία",[],{sourceUrl:EPAL_GENERAL_HUB}),
      common("creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων",[],{sourceUrl:EPAL_GENERAL_HUB}),
      common("career-safety","Σχολικός Επαγγελματικός Προσανατολισμός – Ασφάλεια & Υγεία στον Χώρο Εργασίας",[],{sourceUrl:EPAL_GENERAL_HUB}),
      common("electrical-electronics","Αρχές Ηλεκτρολογίας και Ηλεκτρονικής",[],{sourceUrl:EPAL_HUB}),
      common("health-education","Αγωγή Υγείας",[],{sourceUrl:EPAL_HUB}),
      common("economics","Αρχές Οικονομίας",[],{sourceUrl:EPAL_HUB}),
      common("composition","Βασικές Αρχές Σύνθεσης",[],{sourceUrl:EPAL_HUB}),
      common("architectural-drawing","Αρχές Γραμμικού και Αρχιτεκτονικού Σχεδίου",[],{sourceUrl:EPAL_HUB}),
      common("mechanics","Αρχές Μηχανολογίας",[],{sourceUrl:EPAL_HUB}),
      common("agriculture-sustainability","Γεωπονία και Αειφόρος Ανάπτυξη",[],{sourceUrl:EPAL_HUB}),
      common("maritime-knowledge","Ναυτιλιακές Γνώσεις",[],{sourceUrl:MARITIME_STRUCTURE,structureOnly:true})
    ],
    b:[
      common("new-greek","Νέα Ελληνικά",NEW_GREEK.b,{sourceUrl:GENERAL_GUIDANCE}),
      common("math","Μαθηματικά (Άλγεβρα + Γεωμετρία)",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("physics","Φυσική",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("chemistry","Χημεία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("religion","Θρησκευτικά",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ",CS_B,{sourceUrl:GENERAL_GUIDANCE,textbookUrl:CS_BOOK}),
      common("pe","Φυσική Αγωγή",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("english","Αγγλικά",[],{sourceUrl:FOREIGN_LANG,continuation:true}),
      ...SECTORS.map(([id,label])=>gateway("b",id,label))
    ],
    c:[
      common("new-greek","Νέα Ελληνικά",NEW_GREEK.c,{sourceUrl:GENERAL_GUIDANCE}),
      common("math","Μαθηματικά (Άλγεβρα + Γεωμετρία)",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("physics","Φυσική",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("chemistry","Χημεία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ",CS_C,{sourceUrl:GENERAL_GUIDANCE}),
      common("pe","Φυσική Αγωγή",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("english","Αγγλικά",[],{sourceUrl:FOREIGN_LANG,continuation:true}),
      ...SECTORS.map(([id,label])=>gateway("c",id,label))
    ]
  };

  const DATA=Object.freeze({
    version:"1.0.0",
    schoolYear:"2026-2027",
    verificationDate:"2026-09-12",
    sourceUrls:Object.freeze({generalGuidance:GENERAL_GUIDANCE,epalHub:EPAL_HUB,epalGeneralHub:EPAL_GENERAL_HUB,foreignLanguages:FOREIGN_LANG,maritimeStructure:MARITIME_STRUCTURE}),
    note:"Τα μαθήματα Γενικής Παιδείας ακολουθούν την εγκύκλιο Φ3/116898/Δ4 (08-09-2026). Οι τομείς/επιλογές εμφανίζονται μόνο ως πύλες όπου δεν έχει ακόμη εξαχθεί πλήρης λίστα επιμέρους μαθημάτων από τις τρέχουσες οδηγίες. Δεν επινοούνται κεφάλαια.",
    grades:Object.freeze({a:Object.freeze(GRADES.a),b:Object.freeze(GRADES.b),c:Object.freeze(GRADES.c)})
  });

  window.EPAL_2026_2027_TEACHER_STRUCTURE=DATA;

  function install(){
    window.epalSubjects=function(gid){
      const id=String(gid||document.getElementById("grade")?.value||"a").toLowerCase();
      return (DATA.grades[id]||[]).map(x=>({...x,topics:[...(x.topics||[])]}));
    };
    if(document.getElementById("context")?.value==="epal" && typeof window.refreshSubjects==="function") window.refreshSubjects();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
