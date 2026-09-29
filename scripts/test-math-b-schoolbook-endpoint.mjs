import assert from "node:assert/strict";
const base=String(process.env.BASE_URL||"https://www.aitools4kids.gr").replace(/\/$/,"");
const subject="mathimatika-b-gymnasiou";
const positives=[
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.1 — Θετικοί και Αρνητικοί Αριθμοί (Ρητοί αριθμοί) - Η ευθεία των ρητών - Τετμημένη σημείου (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_1.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.2 — Απόλυτη τιμή ρητού - Αντίθετοι ρητοί - Σύγκριση ρητών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_2.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.3 — Πρόσθεση ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_3.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.4 — Αφαίρεση ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_4.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.5 — Πολλαπλασιασμός ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_5.html"
  ],
  [
    "Επανάληψη από Α΄ Γυμνασίου · 7.6 — Διαίρεση ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_6.html"
  ],
  [
    "Από Α΄ Γυμνασίου · 7.7 — Δεκαδική μορφή ρητών αριθμών (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_7.html"
  ],
  [
    "Από Α΄ Γυμνασίου · 7.8 — Δυνάμεις ρητών αριθμών με εκθέτη φυσικό (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_8.html"
  ],
  [
    "Από Α΄ Γυμνασίου · 7.9 — Δυνάμεις ρητών αριθμών με εκθέτη ακέραιο (μη εξεταστέο)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/indexA7_9.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 1 · 1.1 — Η έννοια της μεταβλητής - Αλγεβρικές παραστάσεις",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 1 · 1.2 — Εξισώσεις α΄ βαθμού",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 1 · 1.4 — Επίλυση προβλημάτων με τη χρήση εξισώσεων",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA1_4.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 2 · 2.1 — Τετραγωνική ρίζα θετικού αριθμού",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 2 · 2.2 — Άρρητοι αριθμοί - Πραγματικοί αριθμοί",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 2 · 2.3 — Προβλήματα (προαιρετικό)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA2_3.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.1 — Η έννοια της συνάρτησης",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.2 — Καρτεσιανές συντεταγμένες - Γραφική παράσταση συνάρτησης",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.3 — Η συνάρτηση y = αx",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_3.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.4 — Η συνάρτηση y = αx + β",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_4.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 3 · 3.5 — Η συνάρτηση y = α/x - Η υπερβολή",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA3_5.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 4 · 4.1 — Βασικές έννοιες της Στατιστικής: Πληθυσμός - Δείγμα",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_1.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 4 · 4.2 — Γραφικές παραστάσεις",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_2.html"
  ],
  [
    "Μέρος Α · Κεφάλαιο 4 · 4.5 — Μέση τιμή - Διάμεσος",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexA4_5.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.1 — Εμβαδόν επίπεδης επιφάνειας",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_1.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.2 — Μονάδες μέτρησης επιφανειών",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.3 — Εμβαδά επίπεδων σχημάτων",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_3.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 1 · 1.4 — Πυθαγόρειο θεώρημα",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB1_4.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 2 · 2.1 — Εφαπτομένη οξείας γωνίας",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_1.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 2 · 2.2 — Ημίτονο και συνημίτονο οξείας γωνίας",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB2_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.1 — Εγγεγραμμένες γωνίες",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_1.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.2 — Κανονικά πολύγωνα",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.3 — Μήκος κύκλου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_3.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 3 · 3.5 — Εμβαδόν κυκλικού δίσκου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB3_5.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.2 — Στοιχεία και εμβαδόν πρίσματος και κυλίνδρου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_2.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.3 — Όγκος πρίσματος και κυλίνδρου",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_3.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.4 — Η πυραμίδα και τα στοιχεία της (προαιρετικό)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_4.html"
  ],
  [
    "Μέρος Β · Κεφάλαιο 4 · 4.6 — Η σφαίρα και τα στοιχεία της (προαιρετικό)",
    "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/indexB4_6.html"
  ]
];
const results=[];
for(const [topic,expectedUrl] of positives){const url=`${base}/api/schoolbook-source?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;const response=await fetch(url,{headers:{Accept:"application/json"}});const body=await response.json();assert.equal(response.status,200,`${topic}: ${JSON.stringify(body)}`);assert.equal(body.grounded,true,topic);assert.equal(body.schoolYear,"2026-2027",topic);assert.ok(body.curriculumSource?.includes("2026-2027"),topic);assert.ok(String(body.curriculumScope||"").length>=20,topic);assert.ok(String(body.text||"").length>=500,topic);assert.deepEqual(body.sourceUrls,[expectedUrl],topic);results.push({topic,status:response.status,sourceUrl:body.sourceUrl});}
for(const topic of ["Μέρος Α · Κεφάλαιο 1 · 1.3 — Επίλυση τύπων","Μέρος Α · Κεφάλαιο 1 · 1.5 — Ανισώσεις α΄ βαθμού","Μέρος Α · Κεφάλαιο 4 · 4.3 — Κατανομή συχνοτήτων","Μέρος Β · Κεφάλαιο 2 · 2.3 — Μεταβολές ημιτόνου, συνημιτόνου και εφαπτομένης","Μέρος Β · Κεφάλαιο 3 · 3.4 — Μήκος τόξου","Μέρος Β · Κεφάλαιο 4 · 4.5 — Ο κώνος και τα στοιχεία του"]){const url=`${base}/api/schoolbook-source?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;const response=await fetch(url,{headers:{Accept:"application/json"}});const body=await response.json();assert.equal(response.status,404,`${topic}: ${JSON.stringify(body)}`);assert.equal(body.grounded,false,topic);assert.equal(body.error,"section_not_resolved",topic);results.push({topic,status:response.status,error:body.error});}

const scopedChecks=[
  ["Μέρος Α · Κεφάλαιο 3 · 3.4 — Η συνάρτηση y = αx + β","α·x + β·y = γ"],
  ["Μέρος Α · Κεφάλαιο 4 · 4.5 — Μέση τιμή - Διάμεσος","ομαδοποιημένης κατανομής"],
  ["Μέρος Β · Κεφάλαιο 2 · 2.2 — Ημίτονο και συνημίτονο οξείας γωνίας","παρατήρηση (β)"],
  ["Μέρος Β · Κεφάλαιο 3 · 3.2 — Κανονικά πολύγωνα","προαιρετική"]
];
for(const [topic,needle] of scopedChecks){
  const url=`${base}/api/schoolbook-source?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`;
  const response=await fetch(url,{headers:{Accept:"application/json"}});
  const body=await response.json();
  assert.equal(response.status,200,topic);
  assert.ok(String(body.curriculumScope||"").includes(needle),`${topic}: missing scope ${needle}`);
}

console.log(JSON.stringify({base,positiveCount:positives.length,results},null,2));
