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
function literalUrls(urls){ return '['+urls.map(x=>JSON.stringify(x)).join(',')+']'; }
function range(a,b){ return Array.from({length:b-a+1},(_,i)=>a+i); }

mustReplace(
  'sourceUrl:"https://dev.old.ebooks.edu.gr/new/tautotita.php?course=DSGYM-A112",',
  'sourceUrl:"https://www.ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/",',
  'A Gymnasium Greek current official source'
);

const mathBase='https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/';
const mathNeedle='    "mathimatika-g-gymnasiou":{\n      sourceUrl:"'+mathBase+'",\n      sections:[';
const mathMaps=[
  ['Α΄ Μέρος · Κεφάλαιο 1 — Αλγεβρικές παραστάσεις',range(1,10).map(n=>mathBase+'indexA1_'+n+'.html')],
  ['Α΄ Μέρος · Κεφάλαιο 2 — Εξισώσεις - Ανισώσεις',range(1,5).map(n=>mathBase+'indexA2_'+n+'.html')],
  ['Α΄ Μέρος · Κεφάλαιο 3 — Συστήματα γραμμικών εξισώσεων',range(1,3).map(n=>mathBase+'indexA3_'+n+'.html')],
  ['Α΄ Μέρος · Κεφάλαιο 4 — Συναρτήσεις',range(1,2).map(n=>mathBase+'indexA4_'+n+'.html')],
  ['Α΄ Μέρος · Κεφάλαιο 5 — Πιθανότητες',range(1,3).map(n=>mathBase+'indexA5_'+n+'.html')],
  ['Β΄ Μέρος · Κεφάλαιο 1 — Γεωμετρία',range(1,6).map(n=>mathBase+'indexB1_'+n+'.html')],
  ['Β΄ Μέρος · Κεφάλαιο 2 — Τριγωνομετρία',range(1,4).map(n=>mathBase+'indexB2_'+n+'.html')]
];
const mathGrounded='      groundedSections:Object.freeze({\n'+mathMaps.map(([k,v])=>'        '+JSON.stringify(k)+':'+literalUrls(v)).join(',\n')+'\n      }),\n      mappingStatus:"official-book-chapter-grounded",\n      lastVerified:"2026-10-04",\n      annualScopeVerified:false,\n';
mustReplace(mathNeedle,'    "mathimatika-g-gymnasiou":{\n      sourceUrl:"'+mathBase+'",\n'+mathGrounded+'      sections:[','G Gymnasium Math chapter grounding');

const histBase='https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/';
const historyNeedle='    "istoria-g-gymnasiou":{\n      sourceUrl:"'+histBase+'",\n      sections:[';
const historyRanges=[
  ['Κεφάλαιο 1 — Οι απαρχές του κόσμου',1,1,4],
  ['Κεφάλαιο 2 — Η Ελληνική Επανάσταση του 1821 στο πλαίσιο της ανάδυσης των εθνικών ιδεών και του φιλελευθερισμού στην Ευρώπη',2,5,11],
  ['Κεφάλαιο 3 — Οικονομικές, κοινωνικές και πολιτικές εξελίξεις στην Ευρώπη και στον κόσμο τον 19ο αιώνα',3,12,16],
  ['Κεφάλαιο 4 — Το ελληνικό κράτος από την ίδρυσή του έως τις αρχές του 20ού αιώνα',4,17,21],
  ['Κεφάλαιο 5 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 19ο αιώνα',5,24,26],
  ['Κεφάλαιο 6 — Η Ελλάδα από το κίνημα στο Γουδί (1909) έως το τέλος των Βαλκανικών Πολέμων (1913)',6,27,30],
  ['Κεφάλαιο 7 — Ο Α΄ Παγκόσμιος Πόλεμος και η Ρωσική Επανάσταση (1914-1918)',7,31,34],
  ['Κεφάλαιο 8 — Ο Μικρασιατικός Πόλεμος (1919-1922)',8,35,39],
  ['Κεφάλαιο 9 — Η εποχή του Μεσοπολέμου (1919-1939)',9,40,44],
  ['Κεφάλαιο 10 — Ο Β΄ Παγκόσμιος Πόλεμος και η Ελλάδα',10,45,49],
  ['Κεφάλαιο 11 — Διεθνείς εξελίξεις από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα',11,50,53],
  ['Κεφάλαιο 12 — Η Ελλάδα από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα',12,54,58],
  ['Κεφάλαιο 13 — Οι προσπάθειες ενοποίησης της Ευρώπης και η Ελλάδα',13,59,60],
  ['Κεφάλαιο 14 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 20ό αιώνα',14,61,65]
];
const historyGrounded='      groundedSections:Object.freeze({\n'+historyRanges.map(([k,c,a,b])=>'        '+JSON.stringify(k)+':'+literalUrls(range(a,b).map(n=>histBase+'index'+c+'_'+n+'.html'))).join(',\n')+'\n      }),\n      mappingStatus:"official-book-chapter-grounded",\n      lastVerified:"2026-10-04",\n      annualScopeVerified:false,\n';
mustReplace(historyNeedle,'    "istoria-g-gymnasiou":{\n      sourceUrl:"'+histBase+'",\n'+historyGrounded+'      sections:[','G Gymnasium History chapter grounding');

s=s.replace('version:"2.15.1"','version:"2.16.0"');
fs.writeFileSync(path,s);
console.log('Patched wave 1 grounding: A Gym Greek source + G Gym Math/History chapter mappings.');
