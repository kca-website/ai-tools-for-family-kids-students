import fs from 'node:fs';

const path='general-education-book-sections-2026-2027.js';
let s=fs.readFileSync(path,'utf8');

function mustReplace(from,to,label){
  if(!s.includes(from)){
    if(s.includes(to)) return;
    throw new Error(`Could not find ${label}`);
  }
  s=s.replace(from,to);
}

// A Gymnasium Modern Greek: the catalog still pointed to the retired identity page,
// which the strict resolver correctly refuses. Point it to the current official HTML book.
mustReplace(
  'sourceUrl:"https://dev.old.ebooks.edu.gr/new/tautotita.php?course=DSGYM-A112",',
  'sourceUrl:"https://www.ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/",',
  'A Gymnasium Greek current official source'
);

// G Gymnasium Mathematics: chapter selections are broad UI units. Ground each chapter
// in every numbered teaching section that belongs to that official chapter, rather than
// pretending the chapter title itself is a page heading.
const mathNeedle='''    "mathimatika-g-gymnasiou":{\n      sourceUrl:"https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/",\n      sections:[''';
const mathReplacement='''    "mathimatika-g-gymnasiou":{\n      sourceUrl:"https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/",\n      groundedSections:Object.freeze({\n        "Α΄ Μέρος · Κεφάλαιο 1 — Αλγεβρικές παραστάσεις": Array.from({length:10},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA1_${i+1}.html`),\n        "Α΄ Μέρος · Κεφάλαιο 2 — Εξισώσεις - Ανισώσεις": Array.from({length:5},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA2_${i+1}.html`),\n        "Α΄ Μέρος · Κεφάλαιο 3 — Συστήματα γραμμικών εξισώσεων": Array.from({length:3},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA3_${i+1}.html`),\n        "Α΄ Μέρος · Κεφάλαιο 4 — Συναρτήσεις": Array.from({length:2},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA4_${i+1}.html`),\n        "Α΄ Μέρος · Κεφάλαιο 5 — Πιθανότητες": Array.from({length:3},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexA5_${i+1}.html`),\n        "Β΄ Μέρος · Κεφάλαιο 1 — Γεωμετρία": Array.from({length:6},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexB1_${i+1}.html`),\n        "Β΄ Μέρος · Κεφάλαιο 2 — Τριγωνομετρία": Array.from({length:4},(_,i)=>`https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/indexB2_${i+1}.html`)\n      }),\n      mappingStatus:"official-book-chapter-grounded",\n      lastVerified:"2026-10-04",\n      annualScopeVerified:false,\n      sections:[''';
mustReplace(mathNeedle,mathReplacement,'G Gymnasium Math chapter grounding');

// G Gymnasium History: exact chapter-to-lesson ranges from the official book contents.
const historyNeedle='''    "istoria-g-gymnasiou":{\n      sourceUrl:"https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/",\n      sections:[''';
const historyReplacement='''    "istoria-g-gymnasiou":{\n      sourceUrl:"https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/",\n      groundedSections:Object.freeze({\n        "Κεφάλαιο 1 — Οι απαρχές του κόσμου": [1,2,3,4].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index1_${n}.html`),\n        "Κεφάλαιο 2 — Η Ελληνική Επανάσταση του 1821 στο πλαίσιο της ανάδυσης των εθνικών ιδεών και του φιλελευθερισμού στην Ευρώπη": [5,6,7,8,9,10,11].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index2_${n}.html`),\n        "Κεφάλαιο 3 — Οικονομικές, κοινωνικές και πολιτικές εξελίξεις στην Ευρώπη και στον κόσμο τον 19ο αιώνα": [12,13,14,15,16].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index3_${n}.html`),\n        "Κεφάλαιο 4 — Το ελληνικό κράτος από την ίδρυσή του έως τις αρχές του 20ού αιώνα": [17,18,19,20,21].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index4_${n}.html`),\n        "Κεφάλαιο 5 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 19ο αιώνα": [24,25,26].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index5_${n}.html`),\n        "Κεφάλαιο 6 — Η Ελλάδα από το κίνημα στο Γουδί (1909) έως το τέλος των Βαλκανικών Πολέμων (1913)": [27,28,29,30].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index6_${n}.html`),\n        "Κεφάλαιο 7 — Ο Α΄ Παγκόσμιος Πόλεμος και η Ρωσική Επανάσταση (1914-1918)": [31,32,33,34].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index7_${n}.html`),\n        "Κεφάλαιο 8 — Ο Μικρασιατικός Πόλεμος (1919-1922)": [35,36,37,38,39].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index8_${n}.html`),\n        "Κεφάλαιο 9 — Η εποχή του Μεσοπολέμου (1919-1939)": [40,41,42,43,44].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index9_${n}.html`),\n        "Κεφάλαιο 10 — Ο Β΄ Παγκόσμιος Πόλεμος και η Ελλάδα": [45,46,47,48,49].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index10_${n}.html`),\n        "Κεφάλαιο 11 — Διεθνείς εξελίξεις από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα": [50,51,52,53].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index11_${n}.html`),\n        "Κεφάλαιο 12 — Η Ελλάδα από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα": [54,55,56,57,58].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index12_${n}.html`),\n        "Κεφάλαιο 13 — Οι προσπάθειες ενοποίησης της Ευρώπης και η Ελλάδα": [59,60].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index13_${n}.html`),\n        "Κεφάλαιο 14 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 20ό αιώνα": [61,62,63,64,65].map(n=>`https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/index14_${n}.html`)\n      }),\n      mappingStatus:"official-book-chapter-grounded",\n      lastVerified:"2026-10-04",\n      annualScopeVerified:false,\n      sections:[''';
mustReplace(historyNeedle,historyReplacement,'G Gymnasium History chapter grounding');

s=s.replace('version:"2.15.1"','version:"2.16.0"');
fs.writeFileSync(path,s);
console.log('Patched wave 1 grounding: A Gym Greek source + G Gym Math/History chapter mappings.');
