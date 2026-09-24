(function(){
  "use strict";
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  if(!C?.entries) return;

  const SOURCE_URL="https://www.minedu.gov.gr/protovathmia-defterovathmia/enimerosi?catid=1183&id=70556%3A27-07-26-kathorismos-ton-graptos-exetazomenon-mathematon-stis-proagogikes-kai-apolyteries-exetaseis-ton-a-b-g-kai-d-taxeon-epal-pepal-kai-ton-lykeion-en-e-e-gy-l-gia-ten-trapeza-thematon-diabathmisemes-dyskolias&view=article";
  const SOURCE_TITLE="ΥΠΑΙΘΑ — ΦΕΚ 4609/Β΄/24-07-2026 · εξεταστέα ύλη Γ΄ ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27";

  const PATCHES={
    "eneegyl-official-c-ιστορια-συγχρονης-τεχνης":{
      officialAnchors:[
        "Κεφάλαιο 13 — Ρομαντισμός",
        "Κεφάλαιο 14 — Ρεαλισμός, Ιμπρεσιονισμός",
        "Κεφάλαιο 15 — Το πέρασμα από τον 19ο στον 20ό αιώνα: Αρχιτεκτονική του Σιδήρου, του Γυαλιού και του οπλισμένου Σκυροδέματος · Arts and Crafts · Αρ Νουβό",
        "Κεφάλαιο 16 — Οι δεκαετίες 1900–1930 (α΄ μέρος): Εξπρεσιονισμός · Φωβισμός · Γαλάζιος Καβαλάρης · Κυβισμός · Φουτουρισμός"
      ],
      note:"Ακριβής chapter-level μεταφορά από τη διδακτέα/εξεταστέα ύλη Γ΄ ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27. Η επίσημη απόφαση περιλαμβάνει επίσης συγκεκριμένα έργα τέχνης ανά κεφάλαιο για ανάλυση."
    },
    "eneegyl-official-c-τεχνολογια-υλικων":{
      officialAnchors:[
        "Κεφάλαιο 1 — Πέτρα",
        "Κεφάλαιο 3 — Μέταλλα",
        "Κεφάλαιο 4 — Κεραμικά"
      ],
      note:"Ακριβής chapter-level μεταφορά από τη διδακτέα/εξεταστέα ύλη Γ΄ ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27. Οι αναδιατυπώσεις/προσθήκες/αφαιρέσεις ερωτήσεων παραμένουν στην επίσημη απόφαση και δεν συμπτύσσονται εδώ."
    },
    "eneegyl-official-c-μηχανικη-αντοχη-υλικων":{
      officialAnchors:[
        "Μέρος Α · Κεφάλαιο 1 — Γενικά περί δυνάμεων",
        "Μέρος Α · Κεφάλαιο 2 — Ροπές δυνάμεων",
        "Μέρος Α · Κεφάλαιο 3 — Σύνθεση δυνάμεων",
        "Μέρος Α · Κεφάλαιο 4 — Κέντρο βάρους – Ευστάθεια",
        "Μέρος Β · Κεφάλαιο 5 — Βασικές έννοιες",
        "Μέρος Β · Κεφάλαιο 6 — Αξονικός εφελκυσμός και θλίψη",
        "Μέρος Β · Κεφάλαιο 8 — Φορείς – Φορτίσεις – Στηρίξεις – Επίλυση δοκών",
        "Μέρος Β · Κεφάλαιο 9 — Διάτμηση",
        "Μέρος Β · Κεφάλαιο 10 — Κάμψη",
        "Μέρος Β · Κεφάλαιο 11 — Στρέψη",
        "Μέρος Β · Κεφάλαιο 12 — Σύνθετες καταστάσεις",
        "Μέρος Β · Κεφάλαιο 14 — Τριβή"
      ],
      note:"Ακριβής chapter-level μεταφορά της εξεταστέας ύλης Γ΄ ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27. Υπάρχουν επιμέρους εξαιρέσεις/παρατηρήσεις σε υποενότητες και παραδείγματα· για αυτές υπερισχύει η επίσημη απόφαση."
    },
    "eneegyl-official-c-οικοδομικο-σχεδιο":{
      officialAnchors:[
        "Κεφάλαιο 1 — Εισαγωγή",
        "Κεφάλαιο 2 — Κάτοψη Κατοικίας",
        "Κεφάλαιο 3 — Τομή Κατοικίας",
        "Κεφάλαιο 4 — Όψη Κατοικίας",
        "Κεφάλαιο 5 — Ξυλότυπος κάτοψης",
        "Κεφάλαιο 6 — Θεμέλια",
        "Κεφάλαιο 7 — Σκάλες (Κλίμακες)",
        "Κεφάλαιο 8 — Μονώσεις"
      ],
      note:"Ακριβής chapter-level μεταφορά από τη διδακτέα/εξεταστέα ύλη Γ΄ ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27."
    }
  };

  const ready=[];
  Object.entries(PATCHES).forEach(([id,patch])=>{
    const entry=C.entries[id];
    if(!entry) return;
    entry.officialAnchors=[...patch.officialAnchors];
    entry.requiresExactUnit=false;
    entry.status="verified";
    entry.coverageStatus="official-course-guidance";
    entry.verificationBasis="FEK-4609-2026-exam-scope";
    entry.verificationDate="2026-09-24";
    entry.sourceTitle=SOURCE_TITLE;
    entry.sourceUrl=SOURCE_URL;
    entry.verificationNote=patch.note;
    ready.push(id);
  });

  window.AITOOLSKIDS_ENEEGYL_EXACT_EXAM_2026_2027=Object.freeze({
    version:"1.0.0",
    verified:"2026-09-24",
    source:"ΦΕΚ 4609/Β΄/24-07-2026 · ΥΑ 99327/Δ3/23-07-2026",
    ready:Object.freeze([...ready])
  });
})();