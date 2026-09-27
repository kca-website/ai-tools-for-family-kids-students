(function(){
"use strict";
const MIDDLE="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",HIGH="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/",PRIMARY="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/",SKILLS="https://www.iep.edu.gr/ergastiria-dexiotiton-2-2/",INFORMATICS_IEP="https://www.iep.edu.gr/diadrastika-gymnasio/",INFORMATICS_BOOK="https://ebooks.edu.gr/ebooks/v/html/8547/2759/Pliroforiki_A-B-G-Gymnasiou_html-empl/",PE_BOOK="https://ebooks.edu.gr/ebooks/v/html/8547/2252/Fysiki-Agogi_A-B-GGymnasiou_html-empl/index.html";
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
const arts=[["Παρατήρηση και περιγραφή έργου ή οπτικού ερεθίσματος","Observe and describe an artwork or visual stimulus"],["Σχεδιασμός δικής σου δημιουργίας πριν από το ψηφιακό εργαλείο","Plan your own creation before a digital tool"],["Μουσική/εικαστική σύνθεση και αναστοχασμός","Music/visual composition and reflection"]];
const religion=[["Κατανόηση της πραγματικής ενότητας με βασικές έννοιες","Understand the actual unit through key concepts"],["Ιστορικό και πολιτισμικό πλαίσιο με πηγές","Historical and cultural context with sources"],["Σύγκριση ιδεών με σεβασμό και τεκμηρίωση","Compare ideas respectfully and with evidence"]];
const themes=[["Ζω Καλύτερα – Ευ Ζην","Live Better – Wellbeing"],["Φροντίζω το Περιβάλλον","Care for the Environment"],["Ενδιαφέρομαι και Ενεργώ – Κοινωνική Συναίσθηση και Ευθύνη","I Care and Act – Social Awareness and Responsibility"],["Δημιουργώ και Καινοτομώ – Δημιουργική Σκέψη και Πρωτοβουλία","Create and Innovate – Creative Thinking and Initiative"]];
function skills(g){const s=subject("ergastiria-dexiotiton-"+g+"-gym",g,"Εργαστήρια Δεξιοτήτων, "+g.toUpperCase()+"' Γυμνασίου","Skills Labs",SKILLS,[]);s.topics=themes.map((x,i)=>({id:s.id+".theme-"+(i+1),labelEl:x[0],labelEn:x[1],explainEl:"Επίσημη θεματική του πλαισίου Εργαστηρίων Δεξιοτήτων.",explainEn:"Official Skills Labs framework theme.",status:"verified-framework"}));Object.assign(s.curriculum,{coverageStatus:"annual-framework-verified",annualInstructionsStatus:"2026-27-framework-verified",frameworkOnly:true,sourceLabelEl:"ΙΕΠ · Εργαστήρια Δεξιοτήτων · ισχύον πλαίσιο"});return s;}
["a","b","c"].forEach(g=>{add("middle",g,subject("archaia-"+g+"-gymnasiou",g,"Αρχαία Ελληνική Γλώσσα και Γραμματεία, "+g.toUpperCase()+"' Γυμνασίου","Ancient Greek, Middle School",MIDDLE,ancient));upsert("middle",g,informaticsSubject(g));upsert("middle",g,physicalEducationSubject(g));add("middle",g,subject("politismos-drastiriotites-"+g+"-gymnasiou",g,"Πολιτισμός και Δραστηριότητες (Μουσική – Καλλιτεχνικά), "+g.toUpperCase()+"' Γυμνασίου","Culture and Activities (Music–Arts)",MIDDLE,arts));add("middle",g,skills(g));add("high",g,subject("fysiki-agogi-"+g+"-lykeiou",g,"Φυσική Αγωγή, "+g.toUpperCase()+"' Λυκείου","Physical Education, High School",HIGH,pe));add("high",g,subject("thriskeftika-"+g+"-lykeiou",g,"Θρησκευτικά, "+g.toUpperCase()+"' Λυκείου","Religious Studies, High School",HIGH,religion));});
add("high","b",subject("eisagogi-epistimi-hy-b-lykeiou","b","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ, Β' Λυκείου","Introduction to Computer Science, 11th Grade",HIGH,informatics));
if(typeof SUBJECTS!=="undefined"&&Array.isArray(SUBJECTS)){[{id:"ancient",icon:"🏺",labelEl:"Αρχαία Ελληνικά",labelEn:"Ancient Greek"},{id:"latin",icon:"🏛️",labelEl:"Λατινικά",labelEn:"Latin"},{id:"informatics",icon:"💻",labelEl:"Πληροφορική",labelEn:"Informatics"},{id:"arts",icon:"🎨",labelEl:"Καλλιτεχνικά & Μουσική",labelEn:"Arts & Music"},{id:"pe",icon:"🏃",labelEl:"Φυσική Αγωγή",labelEn:"Physical Education"},{id:"skills",icon:"🧭",labelEl:"Εργαστήρια Δεξιοτήτων",labelEn:"Skills Labs"},{id:"economics",icon:"📈",labelEl:"Οικονομία / ΑΟΘ",labelEn:"Economics"}].forEach(x=>{if(!SUBJECTS.some(s=>s.id===x.id))SUBJECTS.push(x);});}
function map(z,id,toolIds,noteEl,noteEn){if(typeof CURRICULUM==="undefined"||!CURRICULUM[z])return;if(!CURRICULUM[z][id])CURRICULUM[z][id]={toolIds,noteEl,noteEn};}
map("primary","arts",["autodraw","canva-magic","google-arts-culture"],"Δική σου ιδέα πρώτα, ψηφιακό/AI εργαλείο ως βοήθημα.","Own idea first; digital/AI tools as support.");map("primary","pe",["ai-help"],"Η AI δεν αντικαθιστά τη φυσική δραστηριότητα· μόνο κανόνες, στόχοι και αναστοχασμός με ενήλικα.","AI does not replace physical activity; only rules, goals and reflection with an adult.");map("primary","skills",["ai-help","canva-magic"],"Project και αναστοχασμός πάνω στις επίσημες θεματικές.","Projects and reflection on official themes.");map("primary","informatics",["codeai","ai-help"],"Αλγοριθμική σκέψη, ψηφιακή ασφάλεια και δημιουργία με επίβλεψη.","Algorithmic thinking, digital safety and supervised creation.");
map("middle","ancient",["ai-help","chatgpt","perplexity","notebooklm"],"Κατανόηση, μορφολογία και συντακτικό πάνω στο πραγματικό κείμενο.","Comprehension, morphology and syntax on the actual text.");map("middle","informatics",["codeai","ai-help","replit-ai"],"Αλγόριθμοι, κώδικας και κριτική χρήση AI: πρώτα δική σου λύση.","Algorithms, code and critical AI use: own solution first.");map("middle","arts",["canva-magic","google-arts-culture","autodraw"],"Δική σου δημιουργία πριν από το AI.","Own creation before AI.");map("middle","pe",["ai-help"],"Κανόνες, στόχοι και αναστοχασμός· όχι υποκατάσταση άσκησης.","Rules, goals and reflection; not a replacement for exercise.");map("middle","skills",["ai-help","canva-magic","notebooklm"],"Project και αναστοχασμός στις τέσσερις επίσημες θεματικές.","Projects and reflection on four official themes.");
map("high","ancient",["ai-help","chatgpt","perplexity","notebooklm"],"Κατανόηση, μορφολογία και σύνταξη χωρίς έτοιμη μετάφραση.","Comprehension, morphology and syntax without ready translation.");map("high","latin",["ai-help","chatgpt","perplexity"],"Μορφολογία, σύνταξη και κατανόηση πριν από τη μετάφραση.","Morphology, syntax and comprehension before translation.");map("high","informatics",["ai-help","replit-ai","github-copilot","notebooklm"],"Δική σου λύση πρώτα, AI για έλεγχο/debugging.","Own solution first, AI for checking/debugging.");map("high","pe",["ai-help"],"Στόχοι και αναστοχασμός· όχι ιατρικές ή εξατομικευμένες οδηγίες άσκησης.","Goals and reflection; no medical/personalised exercise prescription.");map("high","economics",["ai-help","perplexity","wolfram-alpha","notebooklm"],"Οικονομικές έννοιες, γραφήματα και τεκμηρίωση με πηγές.","Economic concepts, graphs and evidence with sources.");
window.AITOOLSKIDS_GENERAL_SUBJECT_EXPANSION=Object.freeze({version:2,verified:"2026-09-27",sources:{primary:PRIMARY,middle:MIDDLE,high:HIGH,skills:SKILLS,informatics:INFORMATICS_IEP,informaticsBook:INFORMATICS_BOOK,physicalEducationBook:PE_BOOK}});
})();