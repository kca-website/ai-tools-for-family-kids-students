(function(){
  "use strict";

  const FEK="https://www.minedu.gov.gr/publications/docs2026/2026_07_08_%CE%95%CE%9E%CE%95_91809_%CE%A5%CE%91_%CE%8E%CE%BB%CE%B7_%CE%A0%CE%B1%CE%BD_%CE%95%CE%BE%CE%B5%CF%84_%CE%9C%CE%B1%CE%B8%CE%B7%CE%BC_%CE%93_%CF%84%CE%AC%CE%BE%CE%B7%CF%82_%CE%95%CE%A0%CE%91%CE%9B-%CE%A0%CE%95%CE%A0%CE%91%CE%9B_2026-27_%CE%A6%CE%95%CE%9A_4328%CE%92_14.07.2026.pdf";
  const MINEDU="https://www.minedu.gov.gr/site/70528-17-07-26-kathorismos-didakteas-exetasteas-yles-ton-panelladikos-exetazomenon-mathematon-tes-g-taxes-ton-emeresion-kai-esperinon-epangelmatikon-lykeion-epa-l-kai-ton-protypon-epangelmatikon-lykeion-p-epa-l-gia-to-scholiko-etos-2026-2027";

  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[΄’'·.,:;()\/\\–—-]/g," ").replace(/\s+/g," ").trim();
  const rows=[
    ["Αρχιτεκτονικό Σχέδιο",[
      "Κεφάλαιο 6 — Αρχιτεκτονική μελέτη επαγγελματικού χώρου (κατάστημα σε δύο επίπεδα)",
      "Κεφάλαιο 7 — Αρχιτεκτονική μελέτη πολυώροφου κτιρίου"
    ]],
    ["Οικοδομική",[
      "Κεφάλαιο 1 — Τοιχοποιίες",
      "Κεφάλαιο 2 — Επιχρίσματα",
      "Κεφάλαιο 3 — Δάπεδα",
      "Κεφάλαιο 4 — Κουφώματα",
      "Κεφάλαιο 7 — Επενδύσεις",
      "Κεφάλαιο 8 — Κλίμακες"
    ]],
    ["Ηλεκτρικές Μηχανές",[
      "Κεφάλαιο 2 — Ηλεκτρικές μηχανές συνεχούς ρεύματος (Σ.Ρ.)",
      "Κεφάλαιο 1 — Μετασχηματιστές (Μ/Σ)",
      "Κεφάλαιο 3 — Εναλλακτήρες",
      "Κεφάλαιο 4 — Ασύγχρονοι τριφασικοί κινητήρες (Α.Τ.Κ.)",
      "Κεφάλαιο 5 — Μονοφασικοί κινητήρες"
    ]],
    ["Αρχές Οικονομικής Θεωρίας",[
      "Κεφάλαιο 1 — Βασικές οικονομικές έννοιες",
      "Κεφάλαιο 7 — Ακαθάριστο Εγχώριο Προϊόν",
      "Κεφάλαιο 8 — Το τραπεζικό σύστημα",
      "Κεφάλαιο 9 — Οικονομικές διακυμάνσεις, πληθωρισμός και ανεργία",
      "Κεφάλαιο 10 — Τα δημόσια οικονομικά"
    ]],
    ["Αρχές Οργάνωσης και Διοίκησης",[
      "Κεφάλαιο 1 — Η επιχείρηση",
      "Κεφάλαιο 2 — Οργάνωση και διοίκηση",
      "Κεφάλαιο 3 — Οι διοικητικές λειτουργίες της επιχείρησης (ενότητα 3.5: Λήψη αποφάσεων)",
      "Κεφάλαιο 4 — Σύγχρονες τάσεις της οργάνωσης και διοίκησης (ενότητα 4.3: Ο οργανισμός που μαθαίνει)"
    ]],
    ["Ναυσιπλοΐα ΙΙ",[
      "Κεφάλαιο 7 — Ναυτική κοσμογραφία",
      "Κεφάλαιο 8 — Χρόνος",
      "Κεφάλαιο 9 — Αστρονομική ναυσιπλοΐα",
      "Κεφάλαιο 10 — Ωκεανοπλοΐα",
      "Κεφάλαιο 11 — Παλίρροιες"
    ]],
    ["Ναυτικές Μηχανές",[
      "Τόμος Α΄ — Κεφάλαιο 1: Κατάταξη και στοιχειώδης περιγραφή λειτουργίας των εμβολοφόρων ΜΕΚ",
      "Τόμος Α΄ — Κεφάλαιο 2: Στοιχειώδης περιγραφή των βασικών τμημάτων εμβολοφόρων ΜΕΚ",
      "Τόμος Α΄ — Κεφάλαιο 3: Βασικές λειτουργίες των εμβολοφόρων ΜΕΚ",
      "Τόμος Α΄ — Κεφάλαιο 6: Δίκτυα των εμβολοφόρων ναυτικών πετρελαιομηχανών",
      "Τόμος Β΄ — Κεφάλαιο 12: Ισχύς, απόδοση και διαγράμματα"
    ]],
    ["Ναυτικό Δίκαιο - Διεθνείς Κανονισμοί στη Ναυτιλία - Εφαρμογές",[
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 1: Ναυτικό δίκαιο",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 5: Ο πλοίαρχος",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 6: Το πλήρωμα",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 8: Κανονισμοί εργασίας",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 14: Ναυτικά αδικήματα και ποινικές ευθύνες",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 15: Πειθαρχικό δίκαιο Εμπορικού Ναυτικού",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 16: Το ναυτικό ατύχημα",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 19: Ο ναυτικός πράκτορας",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 20: Ο πλοηγός",
      "Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 28: Η τρομοκρατία στη θάλασσα - επικίνδυνες περιοχές",
      "Διεθνείς Κανονισμοί — Κεφάλαιο 2: SOLAS — ασφάλεια ναυσιπλοΐας και ανθρώπινης ζωής στη θάλασσα",
      "Διεθνείς Κανονισμοί — Κεφάλαιο 3: STCW — διαχείριση ανθρώπινου δυναμικού στην εμπορική ναυτιλία",
      "Διεθνείς Κανονισμοί — Κεφάλαιο 4: MARPOL — προστασία του θαλάσσιου περιβάλλοντος",
      "Διεθνείς Κανονισμοί — Κεφάλαιο 5: ISM — ασφάλεια και ποιότητα στην εμπορική ναυτιλία",
      "Διεθνείς Κανονισμοί — Κεφάλαιο 6: ISPS — ασφάλεια πλοίων και λιμενικών εγκαταστάσεων",
      "Διεθνείς Κανονισμοί — Κεφάλαιο 8: BWM — διαχείριση έρματος"
    ]],
    ["Προγραμματισμός Υπολογιστών",[
      "Κεφάλαιο 3 — Βασικά στοιχεία γλώσσας προγραμματισμού",
      "Κεφάλαιο 4 — Αλγοριθμικές δομές",
      "Κεφάλαιο 5 — Κλασικοί Αλγόριθμοι ΙΙ",
      "Κεφάλαιο 6 — Διαχείριση Αρχείων",
      "Κεφάλαιο 7 — Προηγμένα στοιχεία γλώσσας προγραμματισμού",
      "Κεφάλαιο 8 — Δομές Δεδομένων ΙΙ",
      "Κεφάλαιο 11 — Αντικειμενοστρεφής Προγραμματισμός"
    ]],
    ["Δίκτυα Υπολογιστών",[
      "Κεφάλαιο 1 — Βασικές έννοιες αρχιτεκτονικής και διασύνδεσης δικτύων",
      "Κεφάλαιο 2 — Τοπικά δίκτυα - επίπεδο πρόσβασης δικτύου (TCP/IP)",
      "Κεφάλαιο 3 — Επίπεδο δικτύου - διαδικτύωση",
      "Κεφάλαιο 4 — Επίπεδο μεταφοράς",
      "Κεφάλαιο 5 — Επεκτείνοντας το δίκτυο - δίκτυα ευρείας περιοχής",
      "Κεφάλαιο 6 — Επίπεδο εφαρμογής",
      "Κεφάλαιο 7 — Διαχείριση δικτύου",
      "Κεφάλαιο 8 — Ασφάλεια δικτύων"
    ]]
  ];
  const TOPICS=new Map(rows.map(([label,topics])=>[norm(label),Object.freeze([...topics])]));

  function isEpalC(){return document.getElementById("context")?.value==="epal"&&String(document.getElementById("grade")?.value||"").toLowerCase()==="c";}
  function enrich(list){
    if(!isEpalC()) return list;
    return (list||[]).map(s=>{
      const topics=TOPICS.get(norm(s.label||s.subjectLabelEl||s.id));
      return topics?{...s,topics:[...topics],sourceUrl:FEK,panhellenic2027:true,verificationBasis:"FEK-B-4328-14.07.2026"}:s;
    });
  }

  function install(){
    if(typeof currentSubjects!=="function") return;
    const previousCurrent=currentSubjects;
    const currentProvider=function(){return enrich(previousCurrent());};
    window.currentSubjects=currentProvider;
    try{ currentSubjects=currentProvider; }catch(_){ }

    if(typeof epalSubjects==="function"){
      const previousEpal=epalSubjects;
      const epalProvider=function(gid){return String(gid||document.getElementById("grade")?.value||"").toLowerCase()==="c"?enrich(previousEpal(gid)):previousEpal(gid);};
      window.epalSubjects=epalProvider;
      try{ epalSubjects=epalProvider; }catch(_){ }
    }

    if(typeof refreshUnits==="function"){
      const previousUnits=refreshUnits;
      const unitsProvider=function(){
        const out=previousUnits();
        if(isEpalC()){
          const label=document.getElementById("subject")?.selectedOptions?.[0]?.textContent||"";
          const topics=TOPICS.get(norm(label));
          const note=document.getElementById("curriculumNote");
          if(topics&&note){
            note.innerHTML=`<strong>✓ Επίσημη διδακτέα-εξεταστέα ύλη Πανελλαδικών 2027.</strong> Οι ${topics.length} επιλογές προέρχονται από το ΦΕΚ Β΄ 4328/14.07.2026 για το σχολικό έτος 2026–27. Η επιλογή δείχνει κεφάλαιο/βασική ενότητα· οι επιμέρους εξαιρέσεις του ΦΕΚ εξακολουθούν να ισχύουν.`;
          }
        }
        return out;
      };
      window.refreshUnits=unitsProvider;
      try{ refreshUnits=unitsProvider; }catch(_){ }
    }

    if(isEpalC()&&typeof refreshSubjects==="function") refreshSubjects();
    window.AITOOLSKIDS_EPAL_PANHELLENIC_2027=Object.freeze({
      version:"1.0.0",
      schoolYear:"2026-2027",
      fek:"Β΄ 4328/14.07.2026",
      decision:"Φ6/91809/Δ4",
      sourceUrl:FEK,
      announcementUrl:MINEDU,
      mappedSubjects:Object.freeze(rows.map(([label,topics])=>Object.freeze({label,topicCount:topics.length})))
    });
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
