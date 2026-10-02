(function(){
"use strict";
const MIDDLE="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",HIGH="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/",PRIMARY="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",SKILLS="https://www.iep.edu.gr/ergastiria-dexiotiton-2-2/",INFORMATICS_IEP="https://www.iep.edu.gr/diadrastika-gymnasio/",INFORMATICS_BOOK="https://ebooks.edu.gr/ebooks/v/html/8547/2759/Pliroforiki_A-B-G-Gymnasiou_html-empl/",PE_BOOK="https://ebooks.edu.gr/ebooks/v/html/8547/2252/Fysiki-Agogi_A-B-GGymnasiou_html-empl/index.html",TECH_A_BOOK="https://old.ebooks.edu.gr/new/tautotita.php?course=DSGYM-A101",TECH_B_BOOK="https://ebooks.edu.gr/ebooks/v/html/8547/2194/Technologia_B-Gymnasiou_html-empl/";
const cat=window.AITOOLSKIDS_TUTOR_CATALOG;
function topic(id,el,en){return{id,labelEl:el,labelEn:en,explainEl:"Υποστηρικτική δραστηριότητα πάνω στην πραγματική ενότητα που διδάσκεται. Δεν παρουσιάζεται ως επίσημος τίτλος ύλης.",explainEn:"Support activity based on the actual taught unit. It is not an official syllabus title.",specialSupportAction:true,status:"support-action"};}
function verifiedTopic(id,el,en,source){return{id,labelEl:el,labelEn:en,explainEl:"Τίτλος διασταυρωμένος με επίσημο υλικό ΙΕΠ/Διαδραστικών Σχολικών Βιβλίων. Δεν δηλώνεται ως πλήρης υποχρεωτική ετήσια ύλη.",explainEn:"Title verified against official IEP/Interactive School Books material. It is not claimed as the complete mandatory annual syllabus.",status:"related-section-verified",sourceUrl:source};}
function subject(id,grade,el,en,source,rows){return{id,grade,subjectLabelEl:el,subjectLabelEn:en,topics:rows.map((x,i)=>topic(id+".support-"+(i+1),x[0],x[1])),curriculum:{schoolYear:"2026-2027",coverageStatus:"official-current-year-reference",coverageLabelEl:"Επίσημες οδηγίες 2026–27 δημοσιευμένες · υποστηρικτικές δράσεις",coverageLabelEn:"Official 2026–27 guidance published · support actions",annualInstructionsStatus:"2026-27-guidance-published",annualInstructionsUrl:source,catalogUrl:source,sourceLabelEl:"ΙΕΠ · Οδηγίες 2026–27",sourceLabelEn:"IEP · 2026–27 guidance",verificationDate:"2026-09-25",scopeNoteEl:"Οι δράσεις είναι παιδαγωγικές επιλογές υποστήριξης, όχι αυτούσιοι επίσημοι τίτλοι κεφαλαίων.",scopeNoteEn:"Actions are support choices, not verbatim official chapter titles."}};}
function add(zone,g,row){const a=cat?.zones?.[zone]?.[g];if(a&&!a.some(x=>x.id===row.id))a.push(row);}
function upsert(zone,g,row){const a=cat?.zones?.[zone]?.[g];if(!a)return;const i=a.findIndex(x=>x.id===row.id);if(i>=0)a.splice(i,1,row);else a.push(row);}
const ancient=[["Κατανόηση του κειμένου που διδάσκεστε","Understand the text being taught"],["Μορφολογική εξάσκηση πάνω στο κείμενο","Morphology practice on the text"],["Συντακτική παρατήρηση πάνω στο κείμενο","Syntax practice on the text"],["Λεξιλόγιο, ετυμολογία και σύνδεση με Νέα Ελληνικά","Vocabulary, etymology and links to Modern Greek"]];
const informatics=[["Ανάλυση προβλήματος πριν από τον κώδικα","Problem analysis before code"],["Αλγόριθμος ή διάγραμμα βημάτων","Algorithm or step diagram"],["Έλεγχος και διόρθωση δικού σου κώδικα","Check and debug your own code"],["Ψηφιακή ασφάλεια και κριτική χρήση AI","Digital safety and critical AI use"]];
const informaticsOfficial={
  a:[
    ["Διαδίκτυο, Ιστορία του Διαδικτύου, Υπηρεσίες Διαδικτύου","Internet, history of the Internet and Internet services"],
    ["Βασικές Έννοιες Πληροφορικής","Basic concepts of Informatics"],
    ["Το Υλικό του Υπολογιστή","Computer hardware"],
    ["Κίνδυνοι στο Διαδίκτυο – Κανόνες Συμπεριφοράς","Internet risks and rules of conduct"],
    ["Επεξεργασία Κειμένου – Μορφοποίηση Γραμματοσειράς και Παραγράφου","Word processing – font and paragraph formatting"]
  ],
  b:[
    ["Ψηφιακός Κόσμος","Digital world"],
    ["Το Εσωτερικό του Υπολογιστή","Inside the computer"],
    ["Δίκτυα Υπολογιστών","Computer networks"],
    ["Χρήση συναρτήσεων στο λογισμικό Υπολογιστικά Φύλλα","Using functions in spreadsheet software"],
    ["Παρουσιάσεις – Διαχείριση Διαφανειών, Εναλλαγή Διαφανειών, Κινήσεις","Presentations – slide management, transitions and animations"]
  ],
  c:[
    ["Πρόβλημα – Αλγόριθμος","Problem – Algorithm"],
    ["Αριθμητικές Πράξεις, Εντολές Εξόδου","Arithmetic operations and output commands"],
    ["Εντολές Εξόδου, Μεταβλητές","Output commands and variables"],
    ["Σχεδιασμός γεωμετρικών σχημάτων – Επανάληψη – Διαδικασίες","Drawing geometric shapes – repetition – procedures"],
    ["Επιλέγοντας","Selection"]
  ]
};
function informaticsSubject(g){
  const id="pliroforiki-"+g+"-gymnasiou",s=subject(id,g,"Πληροφορική, "+g.toUpperCase()+"' Γυμνασίου","Informatics, Middle School",MIDDLE,[]);
  s.topics=(informaticsOfficial[g]||[]).map((x,i)=>verifiedTopic(id+".official-"+(i+1),x[0],x[1],INFORMATICS_IEP));
  Object.assign(s.curriculum,{
    coverageStatus:"official-book-verified",
    coverageLabelEl:"Επίσημη οδηγία 2026–27 + επαληθευμένες ενότητες ΙΕΠ",
    coverageLabelEn:"Official 2026–27 guidance + verified IEP sections",
    annualInstructionsStatus:"2026-27-guidance-published",
    annualInstructionsUrl:MIDDLE,
    catalogUrl:INFORMATICS_IEP,
    sourceLabelEl:"ΙΕΠ · Οδηγίες 2026–27 + επίσημο διαδραστικό υλικό Πληροφορικής",
    sourceLabelEn:"IEP · 2026–27 guidance + official Informatics interactive material",
    verificationDate:"2026-09-27",
    scopeNoteEl:"Οι εμφανιζόμενες ενότητες είναι τίτλοι από επίσημο υλικό ΙΕΠ/Διαδραστικών Σχολικών Βιβλίων και χρησιμοποιούνται ως επαληθευμένα σημεία πλοήγησης. Δεν παρουσιάζονται ως εξαντλητική ή υποχρεωτική σειρά της ετήσιας ύλης 2026–27.",
    scopeNoteEn:"Shown sections are titles from official IEP/Interactive School Books material and are used as verified navigation anchors. They are not presented as an exhaustive or mandatory sequence of the 2026–27 annual syllabus."
  });
  return s;
}
const pe=[["Στόχος φυσικής δραστηριότητας και ασφαλής προετοιμασία","Physical activity goal and safe preparation"],["Κανόνες, συνεργασία και fair play","Rules, teamwork and fair play"],["Αναστοχασμός μετά τη δραστηριότητα","Reflection after activity"]];
const peOfficial={
  a:[
    ["Κεφάλαιο 1 — Η Ιστορία του Αθλητισμού","Chapter 1 — The history of sport"],
    ["Κεφάλαιο 2 — Αθλητικές και Κινητικές Δραστηριότητες που διδάσκονται στο μάθημα της Φυσικής Αγωγής","Chapter 2 — Sport and movement activities taught in Physical Education"]
  ],
  b:[
    ["Κεφάλαιο 3 — Η Αξία της Διά Βίου Άσκησης","Chapter 3 — The value of lifelong exercise"],
    ["Κεφάλαιο 4 — Μέθοδοι Βελτίωσης των Φυσικών Ικανοτήτων των Μαθητών","Chapter 4 — Methods for improving students’ physical abilities"]
  ],
  c:[
    ["Κεφάλαιο 5 — Ειδικά Θέματα","Chapter 5 — Special topics"],
    ["Κεφάλαιο 6 — Συμμετοχή των Μαθητών στην Οργάνωση Σχολικών Δραστηριοτήτων","Chapter 6 — Student participation in organising school activities"]
  ]
};
function physicalEducationSubject(g){
  const id="fysiki-agogi-"+g+"-gymnasiou",s=subject(id,g,"Φυσική Αγωγή, "+g.toUpperCase()+"' Γυμνασίου","Physical Education, Middle School",MIDDLE,[]);
  s.topics=(peOfficial[g]||[]).map((x,i)=>verifiedTopic(id+".official-"+(i+1),x[0],x[1],PE_BOOK));
  Object.assign(s.curriculum,{
    coverageStatus:"official-book-verified",
    coverageLabelEl:"Επίσημη οδηγία 2026–27 + επαληθευμένη εστίαση επίσημου βιβλίου",
    coverageLabelEn:"Official 2026–27 guidance + verified official-book focus",
    annualInstructionsStatus:"2026-27-guidance-published",
    annualInstructionsUrl:MIDDLE,
    catalogUrl:PE_BOOK,
    sourceLabelEl:"ΙΕΠ · Οδηγίες 2026–27 + Διαδραστικά Σχολικά Βιβλία",
    sourceLabelEn:"IEP · 2026–27 guidance + Interactive School Books",
    verificationDate:"2026-09-27",
    scopeNoteEl:"Το επίσημο βιβλίο ορίζει εστίαση της Α΄ στα κεφάλαια 1–2, της Β΄ στα 3–4 και της Γ΄ στα 5–6. Οι τίτλοι εμφανίζονται ως επαληθευμένα σημεία πλοήγησης και όχι ως πλήρης περιγραφή όλων των πρακτικών δραστηριοτήτων του μαθήματος.",
    scopeNoteEn:"The official book directs Grade A to chapters 1–2, Grade B to 3–4 and Grade C to 5–6. Titles are shown as verified navigation anchors, not as a complete description of every practical PE activity."
  });
  return s;
}
const technologyOfficial={
  a:[
    ["Κεφάλαιο 1 — Τεχνολογία και Επιστήμη, Αποτελέσματα της Τεχνολογίας, Ανάγκη Τεχνολογικής Εκπαίδευσης","Chapter 1 — Technology and Science, Effects of Technology, Need for Technology Education"],
    ["Κεφάλαιο 2 — Η μέθοδος της ατομικής εργασίας","Chapter 2 — The individual-work method"],
    ["Κεφάλαιο 3 — Μελέτη τεχνολογικών ενοτήτων, Επιλογή ενότητας και θέματος, Συλλογή πληροφοριών","Chapter 3 — Study of technology fields, selection of field/topic, information gathering"],
    ["Κεφάλαιο 4 — Κατασκευή ατομικού έργου","Chapter 4 — Construction of an individual project"],
    ["Κεφάλαιο 5 — Συγγραφή γραπτής εργασίας","Chapter 5 — Writing the report"],
    ["Κεφάλαιο 6 — Οργάνωση σεμιναρίων","Chapter 6 — Organising seminars"]
  ],
  b:[
    ["Κεφάλαιο 1 — Εισαγωγικές Πληροφορίες","Chapter 1 — Introductory Information"],
    ["Κεφάλαιο 2 — Συνοπτική περιγραφή της μεθόδου της «Ομαδικής Εργασίας» για τη μελέτη της Βιομηχανίας","Chapter 2 — Brief description of the Group Work method for studying industry"],
    ["Κεφάλαιο 3 — Οργάνωση των σύγχρονων παραγωγικών μονάδων","Chapter 3 — Organisation of modern production units"],
    ["Κεφάλαιο 4 — Η μέθοδος της «Ομαδικής Εργασίας» βήμα προς βήμα","Chapter 4 — The Group Work method step by step"]
  ]
};
function technologySubject(g){
  const id="technologia-"+g+"-gymnasiou",book=g==="a"?TECH_A_BOOK:TECH_B_BOOK,s=subject(id,g,"Τεχνολογία, "+g.toUpperCase()+"' Γυμνασίου","Technology, Middle School",MIDDLE,[]);
  s.topics=(technologyOfficial[g]||[]).map((x,i)=>verifiedTopic(id+".official-"+(i+1),x[0],x[1],book));
  Object.assign(s.curriculum,{
    coverageStatus:"official-book-verified",
    coverageLabelEl:"Επίσημη οδηγία 2026–27 + επαληθευμένα κεφάλαια επίσημου βιβλίου",
    coverageLabelEn:"Official 2026–27 guidance + verified official-book chapters",
    annualInstructionsStatus:"2026-27-guidance-published",
    annualInstructionsUrl:MIDDLE,
    catalogUrl:book,
    sourceLabelEl:"ΙΕΠ · Οδηγίες 2026–27 + Διαδραστικά Σχολικά Βιβλία",
    sourceLabelEn:"IEP · 2026–27 guidance + Interactive School Books",
    verificationDate:"2026-09-27",
    scopeNoteEl:g==="a"
      ?"Οι έξι τίτλοι είναι τα επίσημα κεφάλαια του βιβλίου Α΄ Γυμνασίου. Το ίδιο το επίσημο υλικό διευκρινίζει ότι το μάθημα βασίζεται στη μέθοδο της ατομικής εργασίας και δεν αντιμετωπίζεται ως απλή ποσότητα «διδακτέας ύλης». Οι τίτλοι χρησιμοποιούνται ως επαληθευμένοι άξονες πλοήγησης."
      :"Οι τέσσερις τίτλοι είναι τα επίσημα κεφάλαια του βιβλίου Β΄ Γυμνασίου. Η τρέχουσα οδηγία 2026–27 ορίζει την εφαρμογή της ομαδικής εργασίας/γραμμής παραγωγής ανάλογα με την υποδομή του σχολείου· οι τίτλοι χρησιμοποιούνται ως επαληθευμένοι άξονες πλοήγησης και όχι ως ξεχωριστή εξεταστέα ύλη.",
    scopeNoteEn:g==="a"
      ?"The six titles are the official Grade A book chapters. The official material itself describes the course as an individual-work method rather than a fixed quantity of syllabus content; these titles are verified navigation anchors."
      :"The four titles are the official Grade B book chapters. Current 2026–27 guidance governs implementation of group work/production-line activities according to school infrastructure; these titles are verified navigation anchors, not a separate examinable syllabus."
  });
  return s;
}
const arts=[["Παρατήρηση και περιγραφή έργου ή οπτικού ερεθίσματος","Observe and describe an artwork or visual stimulus"],["Σχεδιασμός δικής σου δημιουργίας πριν από το ψηφιακό εργαλείο","Plan your own creation before a digital tool"],["Μουσική/εικαστική σύνθεση και αναστοχασμός","Music/visual composition and reflection"]];
const religion=[["Κατανόηση της πραγματικής ενότητας με βασικές έννοιες","Understand the actual unit through key concepts"],["Ιστορικό και πολιτισμικό πλαίσιο με πηγές","Historical and cultural context with sources"],["Σύγκριση ιδεών με σεβασμό και τεκμηρίωση","Compare ideas respectfully and with evidence"]];
const themes=[["Ζω Καλύτερα – Ευ Ζην","Live Better – Wellbeing"],["Φροντίζω το Περιβάλλον","Care for the Environment"],["Ενδιαφέρομαι και Ενεργώ – Κοινωνική Συναίσθηση και Ευθύνη","I Care and Act – Social Awareness and Responsibility"],["Δημιουργώ και Καινοτομώ – Δημιουργική Σκέψη και Πρωτοβουλία","Create and Innovate – Creative Thinking and Initiative"]];
function skills(g){const s=subject("ergastiria-dexiotiton-"+g+"-gym",g,"Εργαστήρια Δεξιοτήτων, "+g.toUpperCase()+"' Γυμνασίου","Skills Labs",SKILLS,[]);s.topics=themes.map((x,i)=>({id:s.id+".theme-"+(i+1),labelEl:x[0],labelEn:x[1],explainEl:"Επίσημη θεματική του πλαισίου Εργαστηρίων Δεξιοτήτων.",explainEn:"Official Skills Labs framework theme.",status:"verified-framework"}));Object.assign(s.curriculum,{coverageStatus:"annual-framework-verified",annualInstructionsStatus:"2026-27-framework-verified",frameworkOnly:true,sourceLabelEl:"ΙΕΠ · Εργαστήρια Δεξιοτήτων · ισχύον πλαίσιο"});return s;}
["a","b","c"].forEach(g=>{add("middle",g,subject("archaia-"+g+"-gymnasiou",g,"Αρχαία Ελληνική Γλώσσα και Γραμματεία, "+g.toUpperCase()+"' Γυμνασίου","Ancient Greek, Middle School",MIDDLE,ancient));upsert("middle",g,informaticsSubject(g));upsert("middle",g,physicalEducationSubject(g));if(g==="a"||g==="b")upsert("middle",g,technologySubject(g));add("middle",g,subject("politismos-drastiriotites-"+g+"-gymnasiou",g,"Πολιτισμός και Δραστηριότητες (Μουσική – Καλλιτεχνικά), "+g.toUpperCase()+"' Γυμνασίου","Culture and Activities (Music–Arts)",MIDDLE,arts));add("middle",g,skills(g));add("high",g,subject("fysiki-agogi-"+g+"-lykeiou",g,"Φυσική Αγωγή, "+g.toUpperCase()+"' Λυκείου","Physical Education, High School",HIGH,pe));add("high",g,subject("thriskeftika-"+g+"-lykeiou",g,"Θρησκευτικά, "+g.toUpperCase()+"' Λυκείου","Religious Studies, High School",HIGH,religion));});
add("high","b",subject("eisagogi-epistimi-hy-b-lykeiou","b","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ, Β' Λυκείου","Introduction to Computer Science, 11th Grade",HIGH,informatics));
if(typeof SUBJECTS!=="undefined"&&Array.isArray(SUBJECTS)){[{id:"ancient",icon:"🏺",labelEl:"Αρχαία Ελληνικά",labelEn:"Ancient Greek"},{id:"latin",icon:"🏛️",labelEl:"Λατινικά",labelEn:"Latin"},{id:"informatics",icon:"💻",labelEl:"Πληροφορική",labelEn:"Informatics"},{id:"arts",icon:"🎨",labelEl:"Καλλιτεχνικά & Μουσική",labelEn:"Arts & Music"},{id:"pe",icon:"🏃",labelEl:"Φυσική Αγωγή",labelEn:"Physical Education"},{id:"skills",icon:"🧭",labelEl:"Εργαστήρια Δεξιοτήτων",labelEn:"Skills Labs"},{id:"economics",icon:"📈",labelEl:"Οικονομία / ΑΟΘ",labelEn:"Economics"}].forEach(x=>{if(!SUBJECTS.some(s=>s.id===x.id))SUBJECTS.push(x);});}
function map(z,id,toolIds,noteEl,noteEn){if(typeof CURRICULUM==="undefined"||!CURRICULUM[z])return;if(!CURRICULUM[z][id])CURRICULUM[z][id]={toolIds,noteEl,noteEn};}
map("primary","arts",["autodraw","canva-magic","google-arts-culture"],"Δική σου ιδέα πρώτα, ψηφιακό/AI εργαλείο ως βοήθημα.","Own idea first; digital/AI tools as support.");map("primary","pe",["ai-help"],"Η AI δεν αντικαθιστά τη φυσική δραστηριότητα· μόνο κανόνες, στόχοι και αναστοχασμός με ενήλικα.","AI does not replace physical activity; only rules, goals and reflection with an adult.");map("primary","skills",["ai-help","canva-magic"],"Project και αναστοχασμός πάνω στις επίσημες θεματικές.","Projects and reflection on official themes.");map("primary","informatics",["codeai","ai-help"],"Αλγοριθμική σκέψη, ψηφιακή ασφάλεια και δημιουργία με επίβλεψη.","Algorithmic thinking, digital safety and supervised creation.");
map("middle","ancient",["ai-help","chatgpt","perplexity","notebooklm"],"Κατανόηση, μορφολογία και συντακτικό πάνω στο πραγματικό κείμενο.","Comprehension, morphology and syntax on the actual text.");map("middle","informatics",["codeai","ai-help","replit-ai"],"Αλγόριθμοι, κώδικας και κριτική χρήση AI: πρώτα δική σου λύση.","Algorithms, code and critical AI use: own solution first.");map("middle","arts",["canva-magic","google-arts-culture","autodraw"],"Δική σου δημιουργία πριν από το AI.","Own creation before AI.");map("middle","pe",["ai-help"],"Κανόνες, στόχοι και αναστοχασμός· όχι υποκατάσταση άσκησης.","Rules, goals and reflection; not a replacement for exercise.");map("middle","skills",["ai-help","canva-magic","notebooklm"],"Project και αναστοχασμός στις τέσσερις επίσημες θεματικές.","Projects and reflection on four official themes.");
map("high","ancient",["ai-help","chatgpt","perplexity","notebooklm"],"Κατανόηση, μορφολογία και σύνταξη χωρίς έτοιμη μετάφραση.","Comprehension, morphology and syntax without ready translation.");map("high","latin",["ai-help","chatgpt","perplexity"],"Μορφολογία, σύνταξη και κατανόηση πριν από τη μετάφραση.","Morphology, syntax and comprehension before translation.");map("high","informatics",["ai-help","replit-ai","github-copilot","notebooklm"],"Δική σου λύση πρώτα, AI για έλεγχο/debugging.","Own solution first, AI for checking/debugging.");map("high","pe",["ai-help"],"Στόχοι και αναστοχασμός· όχι ιατρικές ή εξατομικευμένες οδηγίες άσκησης.","Goals and reflection; no medical/personalised exercise prescription.");map("high","economics",["ai-help","perplexity","wolfram-alpha","notebooklm"],"Οικονομικές έννοιες, γραφήματα και τεκμηρίωση με πηγές.","Economic concepts, graphs and evidence with sources.");
window.AITOOLSKIDS_GENERAL_SUBJECT_EXPANSION=Object.freeze({version:2,verified:"2026-09-27",sources:{primary:PRIMARY,middle:MIDDLE,high:HIGH,skills:SKILLS,informatics:INFORMATICS_IEP,informaticsBook:INFORMATICS_BOOK,physicalEducationBook:PE_BOOK,technologyABooks:Object.freeze({a:TECH_A_BOOK,b:TECH_B_BOOK})}});
})();
// Full tool lists + need maps for every school subject beyond the five core ones,
// so the Tools filter (and the Curriculum Map "Which tool can help?" deep link)
// recommends subject-specific tools instead of a generic or near-empty list.
// Only existing TOOLS ids are used; age limits are still enforced by app.js.
(function(){
"use strict";
if(typeof CURRICULUM==="undefined") return;
const LISTS={
  religion:{
    primary:["ai-help","google-arts-culture","immersive-reader","autodraw"],
    middle:["ai-help","google-arts-culture","perplexity","notebooklm","quizlet","mindmup","immersive-reader","gemini-education","copilot","chatgpt"],
    high:["ai-help","google-arts-culture","perplexity","notebooklm","quizlet","mindmup","zotero","gemini-education","copilot","chatgpt","digital-tutoring"]
  },
  civics:{
    primary:["ai-help","google-arts-culture","immersive-reader","autodraw"],
    middle:["ai-help","perplexity","notebooklm","mindmup","quizlet","gamma","gemini-education","copilot","chatgpt"],
    high:["ai-help","perplexity","notebooklm","mindmup","quizlet","zotero","gamma","gemini-education","copilot","chatgpt","digital-tutoring"]
  },
  informatics:{
    primary:["codeai","ai-help","autodraw"],
    middle:["codeai","ai-help","replit-ai","github-copilot","elements-of-ai","quizlet","gemini-education","copilot","chatgpt"],
    high:["ai-help","codeai","replit-ai","github-copilot","google-colab","elements-of-ai","claude-academy","notebooklm","quizlet","gemini-education","chatgpt","digital-tutoring"]
  },
  technology:{
    middle:["ai-help","phet","codeai","miro-ai","mindmup","canva-magic","gamma","perplexity","copilot","chatgpt"],
    high:["ai-help","codeai","replit-ai","google-colab","wolfram-alpha","phet","miro-ai","gamma","perplexity","chatgpt"]
  },
  arts:{
    primary:["autodraw","google-arts-culture","canva-magic","ai-help"],
    middle:["google-arts-culture","autodraw","canva-magic","ai-help","gamma","perplexity","chatgpt"],
    high:["google-arts-culture","canva-magic","autodraw","ai-help","gamma","perplexity","notebooklm","chatgpt"]
  },
  pe:{
    primary:["ai-help","immersive-reader"],
    middle:["ai-help","quizlet","notion","perplexity","immersive-reader","chatgpt"],
    high:["ai-help","quizlet","notion","perplexity","notebooklm","chatgpt"]
  },
  skills:{
    primary:["ai-help","autodraw","canva-magic","mindmup","immersive-reader"],
    middle:["ai-help","mindmup","miro-ai","canva-magic","gamma","notebooklm","perplexity","notion"],
    high:["ai-help","mindmup","miro-ai","gamma","canva-magic","notebooklm","perplexity","notion","zotero"]
  },
  ancient:{
    middle:["ai-help","notebooklm","quizlet","anki","perplexity","immersive-reader","gemini-education","chatgpt"],
    high:["ai-help","notebooklm","quizlet","anki","perplexity","gemini-education","chatgpt","digital-tutoring"]
  },
  latin:{
    high:["ai-help","quizlet","anki","notebooklm","perplexity","chatgpt","digital-tutoring"]
  },
  economics:{
    high:["ai-help","perplexity","wolfram-alpha","desmos","notebooklm","quizlet","chatgpt","digital-tutoring"]
  }
};
const NOTES={
  religion:["Κατανόηση ενοτήτων με σεβασμό, ιστορικό/πολιτιστικό πλαίσιο και έλεγχο πηγών.","Understanding units respectfully, with historical/cultural context and source checking."],
  civics:["Κοινωνικά θέματα με έλεγχο πηγών, οργάνωση επιχειρημάτων και επανάληψη όρων.","Social topics with source checking, argument organisation and term revision."],
  informatics:["Αλγόριθμοι και κώδικας: πρώτα η δική σου λύση, μετά έλεγχος και εξήγηση με AI.","Algorithms and code: your own solution first, then checking and explanation with AI."],
  technology:["Σχεδιασμός, κατασκευές και ερευνητική μέθοδος με προσομοιώσεις και οργάνωση ιδεών.","Design, construction and research method with simulations and idea organisation."],
  arts:["Δική σου ιδέα πρώτα· ψηφιακά/AI εργαλεία για έμπνευση, γνωριμία με έργα και παρουσίαση.","Your own idea first; digital/AI tools for inspiration, exploring artworks and presenting."],
  pe:["Η AI δεν αντικαθιστά την άσκηση· μόνο κανόνες, θεωρία, στόχοι και αναστοχασμός.","AI never replaces exercise; only rules, theory, goals and reflection."],
  skills:["Εργαστήρια Δεξιοτήτων: οργάνωση ιδεών, ομαδικά σχέδια δράσης και παρουσίαση.","Skills Labs: organising ideas, group action plans and presenting."],
  ancient:["Κατανόηση, μορφολογία και σύνταξη πάνω στο πραγματικό κείμενο, χωρίς έτοιμη μετάφραση.","Comprehension, morphology and syntax on the actual text, without a ready translation."],
  latin:["Μορφολογία, σύνταξη και λεξιλόγιο με ενεργητική επανάληψη πριν από τη μετάφραση.","Morphology, syntax and vocabulary with active recall before translating."],
  economics:["Οικονομικές έννοιες, διαγράμματα και υπολογισμοί με έλεγχο μετά την προσπάθεια.","Economic concepts, graphs and calculations, checked after your own attempt."]
};
Object.keys(LISTS).forEach((subject)=>{
  Object.keys(LISTS[subject]).forEach((zone)=>{
    if(!CURRICULUM[zone]) return;
    const current=CURRICULUM[zone][subject];
    const ids=[...LISTS[subject][zone],...((current&&current.toolIds)||[])].filter((id,i,a)=>a.indexOf(id)===i);
    CURRICULUM[zone][subject]={...(current||{}),toolIds:ids,noteEl:(current&&current.noteEl)||NOTES[subject][0],noteEn:(current&&current.noteEn)||NOTES[subject][1]};
  });
});
if(typeof SUBJECTS!=="undefined"&&Array.isArray(SUBJECTS)){
  [{id:"technology",icon:"💻",labelEl:"Τεχνολογία & Πληροφορική",labelEn:"Technology & Computing"},{id:"civics",icon:"🏛️",labelEl:"Κοινωνικές Επιστήμες",labelEn:"Social Sciences"},{id:"religion",icon:"🤝",labelEl:"Θρησκευτικά",labelEn:"Religious Studies"}]
    .forEach((x)=>{if(!SUBJECTS.some((s)=>s.id===x.id))SUBJECTS.push(x);});
}
if(typeof NEED_TOOL_MAP==="undefined") return;
const NEEDS={
  religion:{understand:["ai-help","google-arts-culture","notebooklm","gemini-education","chatgpt"],practice:["quizlet","ai-help","chatgpt"],hint:["ai-help","chatgpt"],check:["ai-help","perplexity","notebooklm","google-arts-culture"],revise:["quizlet","ai-help","mindmup","notebooklm","digital-tutoring"],research:["perplexity","google-arts-culture","notebooklm","zotero"],"reading-support":["immersive-reader","ai-help","notebooklm"],"step-by-step":["ai-help","mindmup","immersive-reader"]},
  civics:{understand:["ai-help","notebooklm","gemini-education","chatgpt","google-arts-culture"],practice:["quizlet","ai-help","chatgpt"],hint:["ai-help","chatgpt"],check:["ai-help","perplexity","notebooklm"],revise:["quizlet","ai-help","mindmup","notebooklm","digital-tutoring"],research:["perplexity","notebooklm","zotero","gamma"],"reading-support":["immersive-reader","ai-help","notebooklm"],"step-by-step":["ai-help","mindmup","immersive-reader"]},
  informatics:{understand:["ai-help","codeai","elements-of-ai","claude-academy","gemini-education","chatgpt"],practice:["codeai","replit-ai","google-colab","ai-help","quizlet"],hint:["ai-help","chatgpt"],check:["ai-help","github-copilot","replit-ai","chatgpt"],revise:["quizlet","ai-help","notebooklm","digital-tutoring"],research:["notebooklm","elements-of-ai","claude-academy"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help","codeai"]},
  technology:{understand:["ai-help","phet","codeai","chatgpt","copilot"],practice:["codeai","replit-ai","google-colab","phet","ai-help"],hint:["ai-help","chatgpt"],check:["ai-help","wolfram-alpha","chatgpt"],revise:["ai-help","mindmup","miro-ai"],research:["perplexity","gamma","miro-ai"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help","mindmup","miro-ai"]},
  arts:{understand:["google-arts-culture","ai-help","chatgpt"],practice:["autodraw","canva-magic","ai-help"],hint:["ai-help","chatgpt"],check:["ai-help","google-arts-culture"],revise:["google-arts-culture","ai-help","notebooklm"],research:["google-arts-culture","perplexity","gamma"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help","autodraw"]},
  pe:{understand:["ai-help","chatgpt","notebooklm"],practice:["ai-help","notion"],hint:["ai-help"],check:["ai-help","perplexity"],revise:["quizlet","ai-help","notebooklm"],research:["perplexity","notebooklm"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help","notion"]},
  skills:{understand:["ai-help","notebooklm"],practice:["ai-help","canva-magic","autodraw"],hint:["ai-help"],check:["ai-help","perplexity"],revise:["mindmup","ai-help","notion"],research:["perplexity","notebooklm","zotero","gamma"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help","mindmup","miro-ai","notion"]},
  ancient:{understand:["ai-help","notebooklm","gemini-education","chatgpt"],practice:["quizlet","anki","ai-help"],hint:["ai-help","chatgpt"],check:["ai-help","perplexity","notebooklm"],revise:["quizlet","anki","ai-help","notebooklm","digital-tutoring"],research:["perplexity","notebooklm"],"reading-support":["immersive-reader","ai-help","notebooklm"],"step-by-step":["ai-help","immersive-reader"]},
  latin:{understand:["ai-help","notebooklm","chatgpt"],practice:["quizlet","anki","ai-help"],hint:["ai-help","chatgpt"],check:["ai-help","perplexity"],revise:["quizlet","anki","ai-help","digital-tutoring"],research:["perplexity","notebooklm"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help"]},
  economics:{understand:["ai-help","notebooklm","chatgpt"],practice:["quizlet","ai-help","desmos"],hint:["ai-help","chatgpt"],check:["ai-help","wolfram-alpha","desmos"],revise:["quizlet","ai-help","notebooklm","digital-tutoring"],research:["perplexity","notebooklm"],"reading-support":["immersive-reader","ai-help"],"step-by-step":["ai-help","wolfram-alpha"]}
};
Object.keys(NEEDS).forEach((subject)=>{if(!NEED_TOOL_MAP[subject])NEED_TOOL_MAP[subject]=NEEDS[subject];});
})();
