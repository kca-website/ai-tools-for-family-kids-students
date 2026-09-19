(function(){
  "use strict";

  const S=(id,label)=>({id,label});
  const list=(rows)=>rows.map(([id,label])=>S(id,label));
  const group=(id,label,rows)=>({id,label,subjects:list(rows)});

  const SG_SHARED=[
    ["language","Γλωσσική Διδασκαλία"],["literature","Νεοελληνική Λογοτεχνία"],
    ["ancient-language","Αρχαία Ελληνική Γλώσσα"],["ancient-translation","Αρχαία Ελληνικά από Μετάφραση"],
    ["math","Μαθηματικά"],["history","Ιστορία"],["religion","Θρησκευτικά / Ηθική"],
    ["english","Αγγλικά"],["pe","Φυσική Αγωγή"],["technology","Τεχνολογία"],
    ["music","Μουσική"],["art","Καλλιτεχνικά"]
  ];
  const sg=(extra)=>list([...SG_SHARED,...extra]);

  const SPECIAL_GYM={
    id:"special-gymnasium",label:"Ειδικό Γυμνάσιο",sourceUrl:"https://www.iep.edu.gr/wp-content/uploads/2026/04/%CE%A9%CE%A0_%CE%93%CE%A5%CE%9C%CE%9D_%CE%95%CE%91%CE%95.pdf",
    gradeOrder:["pre","a","b","c"],grades:{
      pre:{id:"pre",label:"Προκαταρκτική τάξη",subjects:list([
        ["greek","Ελληνική Γλώσσα"],["math","Μαθηματικά"],["communication-support","Υποστηρικτική Επικοινωνία / ΕΝΓ / Εναλλακτική Επικοινωνία"],
        ["pe","Φυσική Αγωγή"],["arts","Αισθητική Αγωγή"],["support-programs","Προγράμματα Υποστήριξης"],["skills-labs","Εργαστήρια Δεξιοτήτων"]
      ])},
      a:{id:"a",label:"Α΄ Γυμνασίου",subjects:sg([
        ["physics","Φυσική"],["biology","Βιολογία"],["geography","Γεωλογία-Γεωγραφία"],["home-economics","Οικιακή Οικονομία"],
        ["informatics","Πληροφορική"],["skills-labs","Εργαστήρια Δεξιοτήτων"]
      ])},
      b:{id:"b",label:"Β΄ Γυμνασίου",subjects:sg([
        ["physics","Φυσική"],["chemistry","Χημεία"],["biology","Βιολογία"],["geography","Γεωλογία-Γεωγραφία"],
        ["social-civic","Κοινωνική και Πολιτική Αγωγή"],["informatics","Πληροφορική"],["skills-labs","Εργαστήρια Δεξιοτήτων"]
      ])},
      c:{id:"c",label:"Γ΄ Γυμνασίου",subjects:sg([
        ["physics","Φυσική"],["chemistry","Χημεία"],["biology","Βιολογία"],["social-civic","Κοινωνική και Πολιτική Αγωγή"],
        ["economics","Οικονομικά"],["informatics","Πληροφορική"],["skills-labs","Εργαστήρια Δεξιοτήτων"]
      ])}
    }
  };

  const SL_SOURCE="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-e-a-e-gia-to-scholiko-etos-2026-2027/";
  const SL_COMMON_B=[
    ["ancient","Αρχαία Ελληνική Γλώσσα και Γραμματεία"],["new-greek","Νεοελληνική Γλώσσα και Λογοτεχνία"],
    ["algebra","Άλγεβρα"],["geometry","Γεωμετρία"],["physics","Φυσική"],["chemistry","Χημεία"],["biology","Βιολογία"],
    ["computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ"],["history","Ιστορία"],["philosophy","Φιλοσοφία"],
    ["religion","Θρησκευτικά / Ηθική"],["english","Αγγλικά"],["second-language","2η Ξένη Γλώσσα (Γαλλικά ή Γερμανικά)"],["pe","Φυσική Αγωγή"]
  ];
  const SPECIAL_LYC={
    id:"special-lyceum",label:"Ειδικό Λύκειο",sourceUrl:SL_SOURCE,gradeOrder:["pre","a","b","c"],grades:{
      pre:{id:"pre",label:"Προκαταρκτική τάξη",subjects:list([
        ["new-greek","Νέα Ελληνική Γλώσσα και Γραμματεία"],["math","Μαθηματικά"],["physics","Φυσική"],["chemistry","Χημεία"],
        ["pe","Φυσική Αγωγή"],["arts","Καλλιτεχνική Παιδεία"],["support","Υποστηρικτικές Δραστηριότητες"]
      ])},
      a:{id:"a",label:"Α΄ Λυκείου",subjects:list([
        ["ancient","Αρχαία Ελληνική Γλώσσα και Γραμματεία"],["new-greek","Νεοελληνική Γλώσσα και Λογοτεχνία"],
        ["religion","Θρησκευτικά / Ηθική"],["history","Ιστορία"],["algebra","Άλγεβρα"],["geometry","Γεωμετρία"],
        ["english","Αγγλικά"],["second-language","2η Ξένη Γλώσσα (Γαλλικά ή Γερμανικά)"],["physics","Φυσική"],["chemistry","Χημεία"],
        ["biology","Βιολογία"],["pe","Φυσική Αγωγή"],["civics","Πολιτική Παιδεία"],["informatics","Εφαρμογές Πληροφορικής"]
      ])},
      b:{id:"b",label:"Β΄ Λυκείου",subjects:list(SL_COMMON_B),groupLabel:"Ομάδα Προσανατολισμού",groups:[
        group("humanities","Ανθρωπιστικών Σπουδών",[["orientation-ancient","Αρχαία Ελληνική Γλώσσα και Γραμματεία"],["latin","Λατινικά"]]),
        group("sciences","Θετικών Σπουδών",[["orientation-physics","Φυσική"],["orientation-math","Μαθηματικά"]])
      ]},
      c:{id:"c",label:"Γ΄ Λυκείου",subjects:list([
        ["religion","Θρησκευτικά / Ηθική"],["new-greek","Νεοελληνική Γλώσσα και Λογοτεχνία"],["english","Αγγλικά"],["pe","Φυσική Αγωγή"]
      ]),groupLabel:"Ομάδα Προσανατολισμού",groups:[
        group("humanities","Ανθρωπιστικών Σπουδών",[["ancient","Αρχαία Ελληνικά"],["history","Ιστορία"],["latin","Λατινικά"],["math-general","Μαθηματικά Γενικής Παιδείας"]]),
        group("science-health","Θετικών Σπουδών / Υγείας",[["history-general","Ιστορία Γενικής Παιδείας"],["math-or-biology","Μαθηματικά ή Βιολογία"],["physics","Φυσική"],["chemistry","Χημεία"]]),
        group("economy-informatics","Οικονομίας και Πληροφορικής",[["history-general","Ιστορία Γενικής Παιδείας"],["math","Μαθηματικά"],["informatics","Πληροφορική"],["economics","Οικονομία"]])
      ]}
    }
  };

  const EN_GYM={
    "gym-a":[["language","Νεοελληνική Γλώσσα και Γραμματεία"],["literature","Νεοελληνική Λογοτεχνία"],["ancient","Αρχαία Ελληνικά Κείμενα από Μετάφραση"],["math","Μαθηματικά"],["physics","Φυσική"],["biology","Βιολογία"],["geography","Γεωλογία - Γεωγραφία"],["history","Ιστορία"],["religion","Θρησκευτικά / Ηθική"],["english","Αγγλικά"],["technology","Τεχνολογία"],["informatics","Πληροφορική"],["home-economics","Οικιακή Οικονομία"],["pe","Φυσική Αγωγή"],["music-theatre","Μουσική / Θεατρική Αγωγή"],["arts","Καλλιτεχνικά"],["career","Σχολικός Επαγγελματικός Προσανατολισμός"],["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"],["skills","Εργαστήρια Δεξιοτήτων"]],
    "gym-b":[["language","Νεοελληνική Γλώσσα και Γραμματεία"],["literature","Νεοελληνική Λογοτεχνία"],["ancient","Αρχαία Ελληνικά Κείμενα από Μετάφραση"],["math","Μαθηματικά"],["physics","Φυσική"],["chemistry","Χημεία"],["biology","Βιολογία"],["geography","Γεωλογία - Γεωγραφία"],["history","Ιστορία"],["religion","Θρησκευτικά / Ηθική"],["english","Αγγλικά"],["technology","Τεχνολογία"],["informatics","Πληροφορική"],["pe","Φυσική Αγωγή"],["music-theatre","Μουσική / Θεατρική Αγωγή"],["arts","Καλλιτεχνικά"],["career","Σχολικός Επαγγελματικός Προσανατολισμός"],["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"],["skills","Εργαστήρια Δεξιοτήτων"]],
    "gym-c":[["language","Νεοελληνική Γλώσσα και Γραμματεία"],["literature","Νεοελληνική Λογοτεχνία"],["ancient","Αρχαία Ελληνικά Κείμενα από Μετάφραση"],["math","Μαθηματικά"],["physics","Φυσική"],["geography","Γεωλογία - Γεωγραφία"],["history","Ιστορία"],["religion","Θρησκευτικά / Ηθική"],["english","Αγγλικά"],["technology","Τεχνολογία"],["informatics","Πληροφορική"],["civics","Κοινωνική και Πολιτική Αγωγή"],["pe","Φυσική Αγωγή"],["music-theatre","Μουσική / Θεατρική Αγωγή"],["arts","Καλλιτεχνικά"],["career","Σχολικός Επαγγελματικός Προσανατολισμός"],["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"],["skills","Εργαστήρια Δεξιοτήτων"]],
    "gym-d":[["language","Νεοελληνική Γλώσσα και Γραμματεία"],["literature","Νεοελληνική Λογοτεχνία"],["ancient","Αρχαία Ελληνικά Κείμενα από Μετάφραση"],["math","Μαθηματικά"],["physics","Φυσική"],["chemistry","Χημεία"],["biology","Βιολογία"],["history","Ιστορία"],["religion","Θρησκευτικά / Ηθική"],["english","Αγγλικά"],["technology","Τεχνολογία"],["informatics","Πληροφορική"],["civics","Κοινωνική και Πολιτική Αγωγή"],["economics","Οικονομικά"],["pe","Φυσική Αγωγή"],["music-theatre","Μουσική / Θεατρική Αγωγή"],["arts","Καλλιτεχνικά"],["career","Σχολικός Επαγγελματικός Προσανατολισμός"],["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"],["skills","Εργαστήρια Δεξιοτήτων"]]
  };

  const EN_GENERAL_B=[["new-greek","Νέα Ελληνικά"],["algebra","Άλγεβρα"],["geometry","Γεωμετρία"],["physics","Φυσική"],["chemistry","Χημεία"],["english","Αγγλικά"],["pe","Φυσική Αγωγή"],["computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ"],["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"],["work-safety","ΣΕΠ - Ασφάλεια και Υγεία στο χώρο Εργασίας"]];
  const EN_GENERAL_C=EN_GENERAL_B.filter(([id])=>id!=="work-safety");
  const EN_GENERAL_D=[["new-greek","Νέα Ελληνικά"],["algebra","Άλγεβρα"],["geometry","Γεωμετρία"],["physics","Φυσική"],["english","Αγγλικά"],["computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ"]];

  const SECTOR_B=[
    group("agriculture","Γεωπονίας, Τροφίμων και Περιβάλλοντος",[["plant-production","Φυτική Παραγωγή"],["animal-production","Ζωική Παραγωγή"],["food-technology","Τεχνολογία Τροφίμων"],["sector-english","Αγγλικά Τομέα"]]),
    group("administration-economy","Διοίκησης και Οικονομίας",[["accounting","Αρχές Λογιστικής"],["marketing","Εισαγωγή στο Μάρκετινγκ"],["tourism","Θεωρία Τουρισμού και Εφαρμογές"],["logistics","Εισαγωγή στην Εφοδιαστική (Logistics)"],["sector-english","Αγγλικά Τομέα"]]),
    group("structures","Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού",[["topography","Τοπογραφία"],["buildings-materials","Κτιριακά Έργα και Δομικά Υλικά"],["cad-structures","Σχέδιο Δομικών Έργων με χρήση Η/Υ"],["sector-english","Αγγλικά Τομέα"]]),
    group("applied-arts","Εφαρμοσμένων Τεχνών",[["free-drawing","Ελεύθερο Σχέδιο"],["linear-drawing","Γραμμικό Σχέδιο"],["art-history","Ιστορία τέχνης"]]),
    group("electrical","Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού",[["electrotechnics","Ηλεκτροτεχνία (Κυκλώματα Συνεχούς και Εναλλασσόμενου ρεύματος)"],["electrical-installations","Εσωτερικές Ηλεκτρικές Εγκαταστάσεις και Ηλεκτρολογικό Σχέδιο"],["sector-english","Αγγλικά Τομέα"]]),
    group("mechanical","Μηχανολογίας",[["mechanical-constructions","Τεχνολογία Μηχανολογικών Κατασκευών - Εφαρμογές"],["thermodynamics","Στοιχεία Τεχνικής Θερμοδυναμικής - Εφαρμογές"]]),
    group("informatics","Πληροφορικής",[["informatics-basics","Βασικά Θέματα Πληροφορικής"],["os-security","Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων"],["it-sales","Τεχνικά Θέματα Πωλήσεων και Προδιαγραφών Υλικού και Λογισμικού"],["sector-english","Αγγλικά Τομέα"]]),
    group("health","Υγείας - Πρόνοιας - Ευεξίας",[["anatomy-1","Ανατομία-Φυσιολογία Ι"],["health-nutrition","Υγεία και Διατροφή"],["sector-english","Αγγλικά Τομέα"],["special-a","Ειδικό εργαστηριακό μάθημα Α΄"],["special-b","Ειδικό εργαστηριακό μάθημα Β΄"]])
  ];
  const SECTOR_C=[
    group("agriculture","Γεωπονίας, Τροφίμων και Περιβάλλοντος",[["landscape","Αρχές Αρχιτεκτονικής Τοπίου"],["rural-development","Αρχές Αγροτικής Ανάπτυξης"],["environment-agriculture","Περιβάλλον και Γεωργία"],["farm-installations","Στοιχεία Γεωργικών Εγκαταστάσεων και Γεωργικά Μηχανήματα"],["farm-business","Σύγχρονες Γεωργικές Επιχειρήσεις"],["organic-farming","Αρχές Βιολογικής Γεωργίας"]]),
    group("administration-economy","Διοίκησης και Οικονομίας",[["sector-english","Αγγλικά Τομέα"],["law","Στοιχεία Δικαίου (Αστικό-Εργατικό)"],["finance-sheets","Χρηματοπιστωτικές Συναλλαγές - Λογιστικά Φύλλα"],["business-math","Οικονομικά Μαθηματικά και Στατιστική"],["economic-theory","Αρχές Οικονομικής Θεωρίας"],["management","Αρχές Οργάνωσης και Διοίκησης"]]),
    group("structures","Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού",[["built-environment","Δομημένο Περιβάλλον και Πολεοδομικές Εφαρμογές"],["building-drawing","Οικοδομικό Σχέδιο"],["topographic-drawing","Τοπογραφικό Σχέδιο - Ψηφιακή Χαρτογραφία"],["cad-structures","Σχέδιο Δομικών Έργων με χρήση Η/Υ"],["architectural-drawing","Αρχιτεκτονικό Σχέδιο"],["building-construction","Οικοδομική"]]),
    group("applied-arts","Εφαρμοσμένων Τεχνών",[["composition","Αρχές Σύνθεσης"],["digital-arts","Εφαρμοσμένες Τέχνες με χρήση Η/Υ"],["special-lab","Ειδικό εργαστηριακό μάθημα"],["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"]]),
    group("electrical","Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού",[["automation-sensors","Αυτοματισμοί, Αισθητήρες"],["electronics","Αναλογικά και Ψηφιακά Ηλεκτρονικά"],["systems-networks","Εισαγωγή στα Υπολογιστικά Συστήματα και στα Δίκτυα Επικοινωνιών"],["digital-systems","Ψηφιακά Συστήματα"],["networks","Δίκτυα Υπολογιστών"]]),
    group("mechanical","Μηχανολογίας",[["mechanics-strength","Μηχανική - Αντοχή Υλικών"],["machine-design","Σχεδιασμός και Περιγραφή Στοιχείων Μηχανών"],["basic-electrical","Βασική Ηλεκτρολογία και Εφαρμογές"],["sector-english","Αγγλικά Τομέα"],["machine-elements","Στοιχεία Μηχανών"]]),
    group("informatics","Πληροφορικής",[["programming-principles","Αρχές Προγραμματισμού Υπολογιστών"],["hardware-networks","Υλικό και Δίκτυα Υπολογιστών"],["web-design","Σχεδιασμός και Ανάπτυξη Ιστοτόπων"],["programming","Προγραμματισμός Υπολογιστών"],["networks","Δίκτυα Υπολογιστών"]]),
    group("health","Υγείας - Πρόνοιας - Ευεξίας",[["first-aid","Πρώτες Βοήθειες"],["relationships","Διαπροσωπικές Σχέσεις"],["workplace","Εργασιακό Περιβάλλον Τομέα"],["special-a","Ειδικό εργαστηριακό μάθημα Α΄"],["special-b","Ειδικό εργαστηριακό μάθημα Β΄"],["anatomy-2","Ανατομία-Φυσιολογία ΙΙ"],["hygiene","Υγιεινή"]])
  ];

  const SPEC_D=[
    group("plant-tech","Τεχνικός Φυτικής Παραγωγής",[["farm-business","Σύγχρονες Γεωργικές Επιχειρήσεις"],["organic-farming","Αρχές Βιολογικής Γεωργίας"],["tree-vine","Δενδροκομία - Αμπελουργία"],["field-crops","Φυτά Μεγάλης Καλλιέργειας - Κηπευτικές Καλλιέργειες"],["irrigation","Αρδεύσεις Καλλιεργειών"],["plant-protection","Φυτοπροστασία"]]),
    group("animal-tech","Τεχνικός Ζωικής Παραγωγής",[["farm-business","Σύγχρονες Γεωργικές Επιχειρήσεις"],["organic-farming","Αρχές Βιολογικής Γεωργίας"],["animal-feed","Διατροφή Αγροτικών Ζώων"],["animal-breeding","Εκτροφή Αγροτικών Ζώων"],["aquaculture","Υδατοκαλλιέργειες"],["beekeeping","Μελισσοκομία - Σηροτροφία"]]),
    group("food-tech","Τεχνικός Τεχνολογίας Τροφίμων και Ποτών",[["farm-business","Σύγχρονες Γεωργικές Επιχειρήσεις"],["organic-farming","Αρχές Βιολογικής Γεωργίας"],["food-processing","Αρχές Επεξεργασίας Τροφίμων"],["plant-products","Μεταποίηση Φυτικών Προϊόντων"],["animal-products","Μεταποίηση Ζωικών Προϊόντων"],["food-safety","Ασφάλεια Τροφίμων"]]),
    group("floriculture","Τεχνικός Ανθοκομίας και Αρχιτεκτονικής Τοπίου",[["farm-business","Σύγχρονες Γεωργικές Επιχειρήσεις"],["organic-farming","Αρχές Βιολογικής Γεωργίας"],["flowers","Ανθοκομικά Φυτά"],["garden-irrigation","Εφαρμογές Αρδευτικών Δικτύων στην Κηποτεχνία"],["plant-design","Σχεδιασμός Φυτοτεχνικών Έργων"],["garden-maintenance","Συντήρηση Κηποτεχνικών Εφαρμογών"]]),
    group("admin-services","Υπάλληλος Διοίκησης και Οικονομικών Υπηρεσιών",[["economic-theory","Αρχές Οικονομικής Θεωρίας"],["management","Αρχές Οργάνωσης και Διοίκησης"],["office","Σύγχρονο Περιβάλλον Γραφείου"],["tax","Φορολογική Πρακτική"],["accounting-apps","Λογιστικές Εφαρμογές"],["pr","Επικοινωνία και Δημόσιες Σχέσεις"]]),
    group("tourism-services","Υπάλληλος Τουριστικών Επιχειρήσεων",[["economic-theory","Αρχές Οικονομικής Θεωρίας"],["management","Αρχές Οργάνωσης και Διοίκησης"],["tourism-org","Οργάνωση και Λειτουργία Τουριστικών Επιχειρήσεων"],["hotel-org","Οργάνωση και Λειτουργία Ξενοδοχειακών Επιχειρήσεων"],["tourism-geography","Γεωγραφία Τουρισμού"],["tourism-apps","Εφαρμογές στον Τουρισμό"],["specialty-english","Αγγλικά Ειδικότητας"],["second-language","Γαλλικά ή Γερμανικά"]]),
    group("marketing-services","Υπάλληλος Εμπορίας και Διαφήμισης",[["economic-theory","Αρχές Οικονομικής Θεωρίας"],["management","Αρχές Οργάνωσης και Διοίκησης"],["office","Σύγχρονο Περιβάλλον Γραφείου"],["advertising","Διαφήμιση"],["pr","Επικοινωνία και Δημόσιες Σχέσεις"],["marketing-apps","Εφαρμογές Μάρκετινγκ"],["accounting-apps","Λογιστικές Εφαρμογές"]]),
    group("logistics-services","Υπάλληλος Αποθήκης και Συστημάτων Εφοδιασμού",[["economic-theory","Αρχές Οικονομικής Θεωρίας"],["management","Αρχές Οργάνωσης και Διοίκησης"],["warehouses","Οργάνωση και Διαχείριση Αποθηκών"],["transport","Οργάνωση και Διαχείριση Μεταφορών"],["logistics-apps","Εφαρμογές Εφοδιαστικής"],["accounting-apps","Λογιστικές Εφαρμογές"]]),
    group("structures-tech","Τεχνικός Δομικών Έργων και Γεωπληροφορικής",[["architectural-drawing","Αρχιτεκτονικό Σχέδιο"],["building","Οικοδομική"],["civil-drawing","Σχέδιο Πολιτικού Μηχανικού και Έργων Υποδομής"],["geoinformatics","Εφαρμογές Γεωπληροφορικής στα Τεχνικά Έργα"],["project-org","Οργάνωση Τεχνικών Έργων"],["cad-2","Σχέδιο Δομικών Έργων με χρήση Η/Υ II"]]),
    group("graphic-arts","Γραφικών Τεχνών",[["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"],["free-color","Ελεύθερο Σχέδιο - Χρώμα"],["graphic-apps","Γραφιστικές Εφαρμογές"],["printing","Τεχνολογία Εκτυπώσεων"],["digital-publications","Ψηφιακή Σχεδίαση Εντύπων"],["lettering","Γραμματογραφία"],["specialty-english","Αγγλικά Ειδικότητας"]]),
    group("jewelry","Αργυροχρυσοχοΐας",[["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"],["handmade-jewelry","Εργαστήριο Χειροποίητου Κοσμήματος"],["reproduction-jewelry","Εργαστήριο Αναπαραγωγικού Κοσμήματος - Σμάλτο"],["jewelry-design","Σχέδιο Κοσμηματοποιίας"],["metal-plastic","Εργαστήριο Πλαστικής - Μεταλλοπλαστικής"]]),
    group("art-conservation","Συντήρησης Έργων Τέχνης - Αποκατάστασης",[["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"],["conservation","Βασικές Τεχνικές Συντήρησης Έργων Τέχνης"],["heritage","Προστασία Πολιτιστικής Κληρονομιάς"],["copy-art","Αντίγραφο Έργων Τέχνης"],["documentation","Σχεδιαστική Τεκμηρίωση Έργων Τέχνης"],["specialty-english","Αγγλικά Ειδικότητας"]]),
    group("fashion","Σχεδίασης και Παραγωγής Ενδύματος",[["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"],["patterns","Τεχνολογία Προτύπων Κοπής (Πατρόν)"],["digital-product","Ηλεκτρονική Σχεδίαση Βιομηχανικού Προϊόντος"],["fabric-collection","Τεχνολογία Υφάσματος και Οργάνωση Συλλογής Ενδύματος"],["fabric-quality","Ποιοτικός Έλεγχος Υφάσματος"],["garment-production","Τεχνολογία Παραγωγής Ενδυμάτων"]]),
    group("interior","Σχεδιασμού - Διακόσμησης Εσωτερικών Χώρων",[["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"],["free-color","Ελεύθερο Σχέδιο - Χρώμα"],["digital-design","Ψηφιακή Σχεδίαση"],["interior-design","Διακόσμηση Εσωτερικών Χώρων"],["composition-model","Διακοσμητική Σύνθεση - Τρισδιάστατη Μακέτα"],["specialty-english","Αγγλικά Ειδικότητας"]]),
    group("wood","Επιπλοποιίας - Ξυλογλυπτικής",[["modern-art-history","Ιστορία Σύγχρονης Τέχνης"],["materials","Τεχνολογία Υλικών"],["wood-construction","Ξύλινες Κατασκευές"],["furniture-carving","Συνδεσμολογία Επίπλου - Ξυλογλυπτική"],["wood-tech","Τεχνολογία Ξύλου - Μετρήσεις"],["linear-drawing","Γραμμικό Σχέδιο"],["free-drawing","Ελεύθερο Σχέδιο"]]),
    group("electronics-systems","Τεχνικός Ηλεκτρονικών και Υπολογιστικών Συστημάτων, Εγκαταστάσεων, Δικτύων και Τηλεπικοινωνιών",[["digital-systems","Ψηφιακά Συστήματα"],["networks","Δίκτυα Υπολογιστών"],["electronics-apps","Εφαρμοσμένα Ηλεκτρονικά - Κατασκευές"],["network-admin","Εγκατάσταση και Διαχείριση Δικτύων - Συντήρηση Υπολογιστικών Συστημάτων"],["control-security","Συστήματα Ελέγχου και Ασφάλειας"],["telecom","Τηλεπικοινωνίες - Τηλεματική"],["robotics","Ρομποτική"],["signal","Επεξεργασία Σήματος Ήχου και Εικόνας"]]),
    group("electrical-systems","Τεχνικός Ηλεκτρολογικών Συστημάτων, Εγκαταστάσεων και Δικτύων",[["electrotechnics-2","Ηλεκτροτεχνία II"],["electric-machines","Ηλεκτρικές Μηχανές"],["installations-2","Ηλεκτρολογικές Εγκαταστάσεις II"],["electrical-lab","Εργαστήριο Ηλεκτροτεχνίας - Ηλεκτρικών Μηχανών"],["plc","Αυτοματισμοί Προγραμματισμένης Λογικής"]]),
    group("mechanical-installations","Τεχνικός Μηχανολογικών Εγκαταστάσεων και Κατασκευών",[["machine-elements","Στοιχεία Μηχανών"],["heating-design","Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων"],["machine-tools","Μηχανουργική Τεχνολογία - Εργαλειομηχανές"],["lifts","Ανελκυστήρες - Ανυψωτικές Μηχανές"],["cooling","Στοιχεία Ψύξης - Κλιματισμού"]]),
    group("thermal-hydraulic","Τεχνικός Θερμικών και Υδραυλικών Εγκαταστάσεων και Τεχνολογίας Πετρελαίου και Φυσικού Αερίου",[["machine-elements","Στοιχεία Μηχανών"],["heating-design","Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων"],["combustion-maintenance","Συντήρηση και Επισκευή Εγκαταστάσεων Καύσης Υγρών και Αερίων Καυσίμων"],["water-drain","Ύδρευση - Αποχέτευση"],["central-heating","Κατασκευή και Λειτουργία Κεντρικής Θέρμανσης"],["specialty-design","Σχέδιο Ειδικότητας"]]),
    group("cooling-tech","Τεχνικός Εγκαταστάσεων Ψύξης, Αερισμού και Κλιματισμού",[["machine-elements","Στοιχεία Μηχανών"],["cooling","Στοιχεία Ψύξης - Κλιματισμού"],["cooling-lab","Στοιχεία Ψύξης - Κλιματισμού (Εργαστήριο)"],["air-conditioning","Εγκαταστάσεις Κλιματισμού"],["cooling-controls","Σύστημα Ελέγχου, Ρύθμισης και Αυτοματισμού Εγκαταστάσεων Ψύξης και Κλιματισμού"],["cooling-design","Μηχανολογική Σχεδίαση Εγκαταστάσεων Ψύξης και Κλιματισμού"]]),
    group("vehicles","Τεχνικός Οχημάτων",[["machine-elements","Στοιχεία Μηχανών"],["engines-2","Μηχανές Εσωτερικής Καύσης II"],["engines-lab","Μηχανές Εσωτερικής Καύσης II (Εργαστήριο)"],["vehicle-systems","Συστήματα Αυτοκινήτου"],["diagnostics","Τεχνολογία Ελέγχων και Διαγνώσεων"]]),
    group("aircraft","Τεχνικός Μηχανοσυνθέτης Αεροσκαφών",[["machine-elements","Στοιχεία Μηχανών"],["aircraft-engines","Κινητήρες Αεροσκαφών"],["aircraft-engines-lab","Κινητήρες Αεροσκαφών (Εργαστήριο)"],["aircraft-systems","Δομή και Συστήματα Αεροσκαφών"],["aircraft-maintenance","Διαδικασίες Συντήρησης Αεροσκαφών"],["aviation-materials","Τεχνολογία Αεροπορικού Υλικού"]]),
    group("it-apps","Τεχνικός Εφαρμογών Πληροφορικής",[["programming","Προγραμματισμός Υπολογιστών"],["networks","Δίκτυα Υπολογιστών"],["programming-lab","Προγραμματισμός Υπολογιστών (Εργαστήριο)"],["networks-lab","Δίκτυα Υπολογιστών (Εργαστήριο)"],["information-systems","Πληροφοριακά Συστήματα σε Επιχειρήσεις και Οργανισμούς"],["databases-web","Συστήματα Διαχείρισης Βάσεων Δεδομένων και Εφαρμογές τους στο Διαδίκτυο"],["advanced-programming","Ειδικά Θέματα στον Προγραμματισμό Υπολογιστών"],["web-apps","Σχεδιασμός και Ανάπτυξη Διαδικτυακών Εφαρμογών"]]),
    group("it-networks","Τεχνικός Η/Υ και Δικτύων Η/Υ",[["programming","Προγραμματισμός Υπολογιστών"],["networks","Δίκτυα Υπολογιστών"],["programming-lab","Προγραμματισμός Υπολογιστών (Εργαστήριο)"],["networks-lab","Δίκτυα Υπολογιστών (Εργαστήριο)"],["information-systems","Πληροφοριακά Συστήματα σε Επιχειρήσεις και Οργανισμούς"],["system-admin","Εγκατάσταση, Διαχείριση και Συντήρηση Υπολογιστικών Συστημάτων"],["hardware-topics","Ειδικά Θέματα στο Υλικό και στα Δίκτυα Υπολογιστών"],["tech-support","Τεχνική Υποστήριξη Υπολογιστικών Συστημάτων και Δικτυακών Υποδομών"]]),
    group("nursing","Βοηθός Νοσηλευτή",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["nursing-2","Νοσηλευτική II"],["pathology","Στοιχεία Παθολογίας"],["surgery","Χειρουργική - Τεχνική Χειρουργείου"],["obstetrics","Στοιχεία Μαιευτικής - Γυναικολογίας"]]),
    group("medical-lab","Βοηθός Ιατρικών - Βιολογικών Εργαστηρίων",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["microbiology-2","Μικροβιολογία II"],["hematology","Αιματολογία"],["biochemistry","Κλινική Βιοχημεία"],["immunology","Ανοσολογία"]]),
    group("childcare","Βοηθός Βρεφονηπιοκόμων",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["nursery-environment","Παιδαγωγικό Περιβάλλον Βρεφονηπιακού Σταθμού"],["infant-care","Αγωγή Βρέφους και Νηπίου"],["psychology","Στοιχεία Γενικής και Εξελικτικής Ψυχολογίας"],["creative-preschool","Δημιουργική Απασχόληση στην Προσχολική Ηλικία II"],["music-movement","Μουσικοκινητική Αγωγή"],["preschool-literature","Λογοτεχνία Προσχολικής Ηλικίας"]]),
    group("physiotherapy","Βοηθός Φυσικοθεραπευτή",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["kinesiology","Κινησιολογία"],["physiotherapy","Φυσικοθεραπεία"],["physiotherapy-practice","Πρακτική Φυσικοθεραπεία"],["massage","Μάλαξη"],["physical-agents","Φυσικά Μέσα και Εφαρμογή τους"]]),
    group("dental","Βοηθός Οδοντοτεχνίτη",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["dental-lab","Οργάνωση - Εξοπλισμός - Υλικά Οδοντοτεχνικού Εργαστηρίου"],["dental-tech-2","Οδοντοτεχνία II"],["fixed-prosthetics","Ακίνητη Προσθετική"],["porcelain","Ακίνητη Προσθετική και Πορσελάνη"],["orthodontics","Στοιχεία Ορθοδοντικής"]]),
    group("radiology","Βοηθός Ακτινολογικών Εργαστηρίων",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["radioprotection","Ακτινοπροστασία"],["imaging","Νεότερες Απεικονιστικές Μέθοδοι"],["radiotechnology-2","Ακτινοτεχνολογία II"],["radioanatomy","Ακτινοανατομική"],["ethics","Δεοντολογία Επαγγέλματος"]]),
    group("pharmacy","Βοηθός Φαρμακείου",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["prescriptions-law","Συνταγολογία - Νομοθεσία - Βιβλία Φαρμακείου"],["pharma-tech-2","Φαρμακευτική Τεχνολογία II"],["cosmetology","Κοσμητολογία"],["pharmacognosy","Στοιχεία Φαρμακογνωσίας"],["pharmacology","Φαρμακολογία - Τοξικολογία"]]),
    group("aesthetics","Βοηθός Αισθητικής Τέχνης",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["makeup","Μακιγιάζ"],["spa","SPA και Λουτροθεραπεία"],["aesthetics-2","Σύγχρονη Αισθητική II"],["nails","Αισθητική Άκρων - Ονυχοπλαστική"],["cosmetology-materials","Κοσμητολογία - Τεχνολογία Υλικών"]]),
    group("hairdressing","Βοηθός Κομμωτικής Τέχνης",[["anatomy-2","Ανατομία - Φυσιολογία II"],["hygiene","Υγιεινή"],["hair-hygiene","Υγιεινή Κόμης Τριχωτού Κεφαλής - Τοξικολογία - Δερματολογία"],["hair-lab","Εργαστήριο Τεχνικών Εργασιών"],["hairstyles","Καλλιτεχνικά Χτενίσματα"],["materials","Τεχνολογία Υλικών"],["hair-basics-2","Βασικές Εφαρμογές Κομμωτικής II"]])
  ];

  const EN_SOURCE="https://www.minedu.gov.gr/site/70752-03-09-26-enkyklioi-me-ten-yle-odegies-mathematon-eneegy-l";
  const ENEEGYL={id:"eneegyl",label:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",sourceUrl:EN_SOURCE,gradeOrder:["gym-a","gym-b","gym-c","gym-d","lyc-a","lyc-b","lyc-c","lyc-d"],grades:{
    "gym-a":{id:"gym-a",label:"Α΄ Γυμνασίου",subjects:list(EN_GYM["gym-a"])},
    "gym-b":{id:"gym-b",label:"Β΄ Γυμνασίου",subjects:list(EN_GYM["gym-b"])},
    "gym-c":{id:"gym-c",label:"Γ΄ Γυμνασίου",subjects:list(EN_GYM["gym-c"])},
    "gym-d":{id:"gym-d",label:"Δ΄ Γυμνασίου",subjects:list(EN_GYM["gym-d"])},
    "lyc-a":{id:"lyc-a",label:"Α΄ Λυκείου",subjects:list([
      ["new-greek","Νέα Ελληνικά"],["algebra","Άλγεβρα"],["geometry","Γεωμετρία"],["physics","Φυσική"],["chemistry","Χημεία"],["biology","Βιολογία"],
      ["civics","Πολιτική Παιδεία"],["history","Ιστορία"],["religion","Θρησκευτικά / Ηθική"],["english","Αγγλικά"],["pe","Φυσική Αγωγή"],["informatics","Πληροφορική"],
      ["research-technology","Ερευνητική Εργασία στην Τεχνολογία"],["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"],["health","Αγωγή Υγείας"],
      ["architectural-drawing","Αρχές Γραμμικού και Αρχιτεκτονικού Σχεδίου"],["electrical-electronics","Αρχές Ηλεκτρολογίας και Ηλεκτρονικής"],["mechanics","Αρχές Μηχανολογίας"],
      ["economics","Αρχές Οικονομίας"],["composition","Βασικές Αρχές Σύνθεσης"],["agriculture","Γεωπονία και Αειφόρος Ανάπτυξη"]
    ])},
    "lyc-b":{id:"lyc-b",label:"Β΄ Λυκείου",subjects:list(EN_GENERAL_B),groupLabel:"Τομέας",groups:SECTOR_B},
    "lyc-c":{id:"lyc-c",label:"Γ΄ Λυκείου",subjects:list(EN_GENERAL_C),groupLabel:"Τομέας",groups:SECTOR_C},
    "lyc-d":{id:"lyc-d",label:"Δ΄ Λυκείου",subjects:list(EN_GENERAL_D),groupLabel:"Ειδικότητα",groups:SPEC_D}
  }};

  const VERIFIED_QUIZ_BY_SELECTION=Object.freeze({
    "special-gymnasium|a||language":"special-gym-a-language-comprehension",
    "special-gymnasium|a||math":"special-gym-a-math-problem-reading",
    "special-gymnasium|b||language":"special-gym-b-language-comprehension",
    "special-gymnasium|b||math":"special-gym-b-math-problem-reading",
    "special-gymnasium|c||language":"special-gym-c-language-comprehension",
    "special-gymnasium|c||math":"special-gym-c-math-problem-reading",
    "eneegyl|lyc-a||creative-zone":"eneegyl-a-zdd",
    "eneegyl|lyc-b|health|health-nutrition":"eneegyl-b-health-nutrition",
    "eneegyl|lyc-b|mechanical|thermodynamics":"eneegyl-b-mechanics-thermo-basics",
    "eneegyl|lyc-b|structures|topography":"eneegyl-b-structures-topography-basics",
    "eneegyl|lyc-b|agriculture|plant-production":"eneegyl-b-agriculture-plant-basics"
  });

  // Reuse the fixed, reviewed general-education banks only when both grade and
  // subject match directly. These remain clearly labelled support tests: they
  // do not claim that the annual Special Education syllabus is identical.
  const SUPPORT_QUIZ_BY_SELECTION=Object.freeze({
    "special-gymnasium|a||history":["middle","istoria-a-gymnasiou"],
    "special-gymnasium|a||english":["middle","english-a-gymnasiou"],
    "special-gymnasium|a||biology":["middle","biologia-a-gymnasiou"],
    "special-gymnasium|b||history":["middle","istoria-b-gymnasiou"],
    "special-gymnasium|b||english":["middle","english-b-gymnasiou"],
    "special-gymnasium|b||physics":["middle","physics-gymnasiou"],
    "special-gymnasium|b||biology":["middle","biologia-b-gymnasiou"],
    "special-gymnasium|c||history":["middle","istoria-g-gymnasiou"],
    "special-gymnasium|c||english":["middle","english-g-gymnasiou"],
    "special-gymnasium|c||physics":["middle","fysiki-g-gymnasiou"],
    "special-gymnasium|c||biology":["middle","biologia-g-gymnasiou"],

    "special-lyceum|a||new-greek":["high","ekthesi-a-lykeiou"],
    "special-lyceum|a||algebra":["high","mathimatika-a-lykeiou"],
    "special-lyceum|a||physics":["high","fysiki-a-lykeiou"],
    "special-lyceum|a||history":["high","istoria-a-lykeiou"],
    "special-lyceum|a||biology":["high","biologia-a-lykeiou"],
    "special-lyceum|b||new-greek":["high","ekthesi-b-lykeiou"],
    "special-lyceum|b||physics":["high","fysiki-b-lykeiou"],
    "special-lyceum|b||history":["high","istoria-b-lykeiou"],
    "special-lyceum|b||english":["high","english-b-lykeiou"],
    "special-lyceum|b||biology":["high","biologia-b-lykeiou"],
    "special-lyceum|c||new-greek":["high","ekthesi-g-lykeiou"],
    "special-lyceum|c||english":["high","english-g-lykeiou"],
    "special-lyceum|c|humanities|history":["high","istoria-g-lykeiou"],

    "eneegyl|gym-a||language":["middle","glossa-a-gymnasiou"],
    "eneegyl|gym-a||math":["middle","mathimatika-a-gymnasiou"],
    "eneegyl|gym-a||history":["middle","istoria-a-gymnasiou"],
    "eneegyl|gym-a||english":["middle","english-a-gymnasiou"],
    "eneegyl|gym-a||biology":["middle","biologia-a-gymnasiou"],
    "eneegyl|gym-b||language":["middle","glossa-b-gymnasiou"],
    "eneegyl|gym-b||math":["middle","mathimatika-b-gymnasiou"],
    "eneegyl|gym-b||physics":["middle","physics-gymnasiou"],
    "eneegyl|gym-b||history":["middle","istoria-b-gymnasiou"],
    "eneegyl|gym-b||english":["middle","english-b-gymnasiou"],
    "eneegyl|gym-b||biology":["middle","biologia-b-gymnasiou"],
    "eneegyl|gym-c||language":["middle","glossa-gymnasiou"],
    "eneegyl|gym-c||math":["middle","mathimatika-g-gymnasiou"],
    "eneegyl|gym-c||physics":["middle","fysiki-g-gymnasiou"],
    "eneegyl|gym-c||history":["middle","istoria-g-gymnasiou"],
    "eneegyl|gym-c||english":["middle","english-g-gymnasiou"],

    "eneegyl|lyc-a||new-greek":["high","ekthesi-a-lykeiou"],
    "eneegyl|lyc-a||algebra":["high","mathimatika-a-lykeiou"],
    "eneegyl|lyc-a||physics":["high","fysiki-a-lykeiou"],
    "eneegyl|lyc-a||history":["high","istoria-a-lykeiou"],
    "eneegyl|lyc-a||biology":["high","biologia-a-lykeiou"],
    "eneegyl|lyc-b||new-greek":["high","ekthesi-b-lykeiou"],
    "eneegyl|lyc-b||physics":["high","fysiki-b-lykeiou"],
    "eneegyl|lyc-b||english":["high","english-b-lykeiou"],
    "eneegyl|lyc-c||new-greek":["high","ekthesi-g-lykeiou"],
    "eneegyl|lyc-c||english":["high","english-g-lykeiou"]
  });

  // Grade D of EN.E.E.GY.-L. has no separate reviewed bank and no same-grade
  // general-education equivalent. Following the existing teacher-curriculum
  // precedent, the reviewed test of the closest lower grade (C) is offered
  // only as a clearly labelled study reference for the same-named subject.
  const ADJACENT_GRADE_SUPPORT_BY_SELECTION=Object.freeze({
    "eneegyl|gym-d||language":["middle","glossa-gymnasiou"],
    "eneegyl|gym-d||math":["middle","mathimatika-g-gymnasiou"],
    "eneegyl|gym-d||physics":["middle","fysiki-g-gymnasiou"],
    "eneegyl|gym-d||chemistry":["middle","chimeia-g-gymnasiou"],
    "eneegyl|gym-d||biology":["middle","biologia-g-gymnasiou"],
    "eneegyl|gym-d||history":["middle","istoria-g-gymnasiou"],
    "eneegyl|gym-d||english":["middle","english-g-gymnasiou"],
    "eneegyl|lyc-d||new-greek":["high","ekthesi-g-lykeiou"],
    "eneegyl|lyc-d||english":["high","english-g-lykeiou"]
  });

  // Short checks written directly from the official 2026-27 teaching
  // instructions for Special Education (E.A.E.) Gymnasiums. Every question
  // stays inside a unit listed in the official syllabus of that subject and grade.
  const OFFICIAL_SOURCE_TITLE="Επίσημες οδηγίες διδασκαλίας Γυμνασίων Ε.Α.Ε. 2026-2027";
  const ENEEGYL_SOURCE="https://www.minedu.gov.gr/site/70752-03-09-26-enkyklioi-me-ten-yle-odegies-mathematon-eneegy-l";
  const OFFICIAL_INSTRUCTION_QUIZ_BY_SELECTION=Object.freeze({
    "special-gymnasium|a||technology":{id:"special-gym-a-technology-official-2026-27",basis:"Τεχνολογία Α΄ Γυμνασίου Ε.Α.Ε.: μέθοδος ατομικής εργασίας, πηγές πληροφόρησης, εργαλεία και υλικά",questions:[
      {text:"Στην Α΄ Γυμνασίου, ποια μορφή εργασίας προβλέπεται κυρίως στην Τεχνολογία;",options:["Ατομική εργασία","Γραμμή παραγωγής"],correctIndex:0},
      {text:"Πριν αρχίσει μια τεχνολογική κατασκευή, τι χρειάζεται να κάνει ο μαθητής;",options:["Να επιλέξει τυχαία υλικά","Να ερευνήσει πηγές και να συγκεντρώσει πληροφορίες"],correctIndex:1},
      {text:"Ο καθορισμός των εργαλείων και των υλικών γίνεται με βάση τι;",options:["Τις ανάγκες του έργου","Το χρώμα της σχολικής τσάντας"],correctIndex:0}
    ]},
    "special-gymnasium|b||technology":{id:"special-gym-b-technology-official-2026-27",basis:"Τεχνολογία Β΄ Γυμνασίου Ε.Α.Ε.: ομαδική εργασία ή γραμμή παραγωγής και μελέτη της βιομηχανίας",questions:[
      {text:"Στη Β΄ Γυμνασίου, ποια μορφή εργασίας χρησιμοποιείται για τη μελέτη της βιομηχανίας;",options:["Μόνο ατομική αποστήθιση","Ομαδική εργασία ή γραμμή παραγωγής"],correctIndex:1},
      {text:"Τι είναι κεντρικό στην ανάπτυξη νέων προϊόντων και συστημάτων;",options:["Η δημιουργικότητα","Η αντιγραφή χωρίς έλεγχο"],correctIndex:0},
      {text:"Ποιοι παράγοντες μπορούν να επηρεάσουν την ανάπτυξη της τεχνολογίας;",options:["Οικονομικοί, πολιτικοί και περιβαλλοντικοί","Μόνο το όνομα του προϊόντος"],correctIndex:0}
    ]},
    "special-gymnasium|c||technology":{id:"special-gym-c-technology-official-2026-27",basis:"Τεχνολογία Γ΄ Γυμνασίου Ε.Α.Ε.: έρευνα και πειραματισμός, σχεδίαση έρευνας, δοκίμια και γραπτή εργασία",questions:[
      {text:"Ποια μέθοδος εφαρμόζεται κυρίως στην Τεχνολογία Γ΄ Γυμνασίου;",options:["Έρευνα και πειραματισμός","Αντιγραφή έτοιμης κατασκευής χωρίς έλεγχο"],correctIndex:0},
      {text:"Τι πρέπει να προηγείται ενός πειράματος;",options:["Η σχεδίαση της ερευνητικής διαδικασίας","Η ανακοίνωση αποτελέσματος χωρίς δοκιμή"],correctIndex:0},
      {text:"Πώς καταγράφονται οργανωμένα η διαδικασία και τα αποτελέσματα;",options:["Σε γραπτή εργασία","Μόνο προφορικά και χωρίς σημειώσεις"],correctIndex:0}
    ]},
    "special-gymnasium|a||informatics":{id:"special-gym-a-informatics-official-2026-27",basis:"Πληροφορική Α΄ Γυμνασίου Ε.Α.Ε.: Ψηφιακός Κόσμος, υλικό υπολογιστή, Κυβερνοασφάλεια",questions:[
      {text:"Ποιο από τα δύο είναι υλικό μέρος ενός υπολογιστή;",options:["Το πληκτρολόγιο","Ένα αρχείο κειμένου"],correctIndex:0},
      {text:"Ποια πρακτική προστατεύει καλύτερα έναν λογαριασμό;",options:["Ισχυρός και μοναδικός κωδικός","Ο ίδιος απλός κωδικός παντού"],correctIndex:0},
      {text:"Πριν ανοίξουμε έναν άγνωστο σύνδεσμο, τι είναι ασφαλέστερο;",options:["Να ελέγξουμε αποστολέα και διεύθυνση","Να τον ανοίξουμε αμέσως"],correctIndex:0}
    ]},
    "special-gymnasium|b||informatics":{id:"special-gym-b-informatics-official-2026-27",basis:"Πληροφορική Β΄ Γυμνασίου Ε.Α.Ε.: Ψηφιακός Κόσμος, Δίκτυα Υπολογιστών, Ανάλυση Δεδομένων με Υπολογιστικά Φύλλα",questions:[
      {text:"Ποια είναι η μικρότερη μονάδα ψηφιακής πληροφορίας;",options:["Το bit","Το μέτρο"],correctIndex:0},
      {text:"Τι επιτρέπει ένα δίκτυο υπολογιστών;",options:["Επικοινωνία και κοινή χρήση πόρων","Μόνο εκτύπωση χωρίς σύνδεση"],correctIndex:0},
      {text:"Ποιο εργαλείο είναι κατάλληλο για υπολογισμούς σε πίνακες δεδομένων;",options:["Υπολογιστικό φύλλο","Πρόγραμμα ζωγραφικής"],correctIndex:0}
    ]},
    "special-gymnasium|c||informatics":{id:"special-gym-c-informatics-official-2026-27",basis:"Πληροφορική Γ΄ Γυμνασίου Ε.Α.Ε.: Αλγοριθμική, Προγραμματισμός με Python (EduBlocks), Φυσική Υπολογιστική / Ρομποτικές Διατάξεις",questions:[
      {text:"Τι είναι ένας αλγόριθμος;",options:["Σαφής σειρά βημάτων για λύση προβλήματος","Τυχαία σειρά εντολών χωρίς στόχο"],correctIndex:0},
      {text:"Ποια γλώσσα αναφέρεται στις επίσημες οδηγίες της Γ΄ Γυμνασίου;",options:["Python","HTML ως γλώσσα προγραμματισμού ρομπότ"],correctIndex:0},
      {text:"Σε μια ρομποτική διάταξη, τι μπορεί να ανιχνεύει το περιβάλλον;",options:["Ένας αισθητήρας","Ένα στατικό αυτοκόλλητο"],correctIndex:0}
    ]},
    "special-gymnasium|c||economics":{id:"special-gym-c-economics-official-2026-27",basis:"Οικονομικά Γ΄ Γυμνασίου Ε.Α.Ε.: ανάγκες και αγαθά, στενότητα και κόστος ευκαιρίας, συντελεστές παραγωγής",questions:[
      {text:"Γιατί χρειάζεται να κάνουμε οικονομικές επιλογές;",options:["Επειδή οι πόροι είναι περιορισμένοι","Επειδή όλες οι ανάγκες ικανοποιούνται χωρίς όρια"],correctIndex:0},
      {text:"Τι ονομάζουμε κόστος ευκαιρίας;",options:["Την καλύτερη εναλλακτική που αφήνουμε όταν επιλέγουμε κάτι","Μόνο την τιμή ενός προϊόντος στο ταμείο"],correctIndex:0},
      {text:"Ποιο είναι συντελεστής παραγωγής;",options:["Η εργασία","Η ημερομηνία στο ημερολόγιο"],correctIndex:0}
    ]},
    "special-gymnasium|b||chemistry":{id:"special-gym-b-chemistry-official-2026-27",basis:"Χημεία Β΄ Γυμνασίου Ε.Α.Ε.: 1.2 Καταστάσεις των υλικών, 2.2 Το νερό ως διαλύτης, 3.1 Σύσταση του ατμοσφαιρικού αέρα",questions:[
      {text:"Ποια κατάσταση της ύλης έχει καθορισμένο σχήμα και καθορισμένο όγκο;",options:["Αέρια","Στερεή"],correctIndex:1},
      {text:"Διαλύουμε αλάτι στο νερό. Ποιο είναι ο διαλύτης;",options:["Το νερό","Το αλάτι"],correctIndex:0},
      {text:"Ποιο αέριο υπάρχει στη μεγαλύτερη αναλογία στον ατμοσφαιρικό αέρα;",options:["Το οξυγόνο","Το άζωτο"],correctIndex:1}
    ]},
    "special-gymnasium|c||chemistry":{id:"special-gym-c-chemistry-official-2026-27",basis:"Χημεία Γ΄ Γυμνασίου Ε.Α.Ε.: 1.5 Το pH των όξινων διαλυμάτων, 3.1 Εξουδετέρωση, 3.1.3 Καύση των υδρογονανθράκων",questions:[
      {text:"Ένα διάλυμα έχει pH 3. Τι είδους διάλυμα είναι;",options:["Όξινο","Βασικό"],correctIndex:0},
      {text:"Όταν ένα οξύ εξουδετερώνεται από μια βάση, ποια ουσία σχηματίζεται εκτός από νερό;",options:["Άλας","Οξυγόνο"],correctIndex:0},
      {text:"Ποια προϊόντα παράγονται κατά την πλήρη καύση ενός υδρογονάνθρακα;",options:["Οξυγόνο και άζωτο","Διοξείδιο του άνθρακα και νερό"],correctIndex:1}
    ]},
    "special-gymnasium|b||social-civic":{id:"special-gym-b-social-civic-official-2026-27",basis:"Κοινωνική και Πολιτική Αγωγή Β΄ Γυμνασίου Ε.Α.Ε.: Κεφ. 2 Κοινωνικές ομάδες, Κεφ. 3 Κοινωνικός ρόλος και κοινωνικοί κανόνες",questions:[
      {text:"Ποιο είναι παράδειγμα κοινωνικής ομάδας;",options:["Η σχολική τάξη","Άνθρωποι που περνούν τυχαία από την ίδια γωνιά"],correctIndex:0},
      {text:"Ποιο είναι παράδειγμα κοινωνικού κανόνα;",options:["Το ύψος ενός ανθρώπου","Σταματάμε στο κόκκινο φανάρι"],correctIndex:1},
      {text:"Τι περιγράφει ο κοινωνικός ρόλος;",options:["Τη συμπεριφορά που αναμένεται από ένα άτομο με μια κοινωνική θέση","Τον αριθμό των ανθρώπων μιας χώρας"],correctIndex:0}
    ]},
    "special-gymnasium|a||physics":{id:"special-gym-a-physics-official-2026-27",basis:"Φυσική Α΄ Γυμνασίου Ε.Α.Ε.: μετρήσεις μήκους, χρόνου, μάζας και πυκνότητας",questions:[
      {text:"Μετράμε ένα θρανίο πολλές φορές. Ποια τιμή μειώνει την επίδραση μικρών τυχαίων διαφορών;",options:["Ο μέσος όρος των μετρήσεων","Μόνο η μεγαλύτερη μέτρηση"],correctIndex:0},
      {text:"Ποιο όργανο είναι κατάλληλο για τη μέτρηση της μάζας;",options:["Ζυγός","Χρονόμετρο"],correctIndex:0},
      {text:"Πώς υπολογίζεται η πυκνότητα ενός σώματος;",options:["Μάζα προς όγκο","Όγκος προς χρόνο"],correctIndex:0}
    ]},
    "special-gymnasium|b||physics":{id:"special-gym-b-physics-official-2026-27",basis:"Φυσική Β΄ Γυμνασίου Ε.Α.Ε.: κίνηση, δυνάμεις, πίεση και ενέργεια",questions:[
      {text:"Πώς υπολογίζεται η μέση ταχύτητα;",options:["Διάστημα προς χρόνο","Χρόνος προς μάζα"],correctIndex:0},
      {text:"Τι συμβαίνει όταν η συνισταμένη δύναμη σε ακίνητο σώμα είναι μηδέν;",options:["Το σώμα παραμένει ακίνητο","Το σώμα επιταχύνεται υποχρεωτικά"],correctIndex:0},
      {text:"Ποια αρχή εξηγεί την άνωση σε βυθισμένο σώμα;",options:["Η αρχή του Αρχιμήδη","Ο νόμος της ανάκλασης"],correctIndex:0}
    ]},
    "special-gymnasium|c||physics":{id:"special-gym-c-physics-official-2026-27",basis:"Φυσική Γ΄ Γυμνασίου Ε.Α.Ε.: ηλεκτρικό ρεύμα, κυκλώματα, ταλαντώσεις και κύματα",questions:[
      {text:"Τι μετρά το αμπερόμετρο σε ένα ηλεκτρικό κύκλωμα;",options:["Την ένταση του ρεύματος","Τη μάζα του αγωγού"],correctIndex:0},
      {text:"Σε σύνδεση αντιστατών σε σειρά, τι είναι ίδιο σε όλους;",options:["Η ένταση του ρεύματος","Η αντίσταση κάθε αντιστάτη"],correctIndex:0},
      {text:"Τι μεταφέρει ένα μηχανικό κύμα;",options:["Ενέργεια χωρίς μόνιμη μεταφορά ύλης","Ύλη χωρίς ενέργεια"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||economics":{id:"eneegyl-lyc-a-economics-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Διοίκησης και Οικονομίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Αρχές Οικονομίας: ανάγκες και αγαθά, συντελεστές παραγωγής, ζήτηση και προσφορά",questions:[
      {text:"Ποιο από τα παρακάτω είναι συντελεστής παραγωγής;",options:["Η εργασία","Η απόδειξη αγοράς"],correctIndex:0},
      {text:"Σύμφωνα με τον νόμο της ζήτησης, όταν αυξάνεται η τιμή και όλα τα άλλα μένουν σταθερά, η ζητούμενη ποσότητα συνήθως…",options:["μειώνεται","αυξάνεται"],correctIndex:0},
      {text:"Τι δείχνει η καμπύλη παραγωγικών δυνατοτήτων;",options:["Τους μέγιστους εφικτούς συνδυασμούς παραγωγής","Μόνο τις τιμές ενός προϊόντος"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||mechanics":{id:"eneegyl-lyc-a-mechanics-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Μηχανολογίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Αρχές Μηχανολογίας: εφαρμογές παραγωγής και μετατροπής έργου και ενέργειας, εργαλεία και μηχανές",questions:[
      {text:"Ποιο σύστημα μεταφέρει θερμότητα από έναν ψυχρότερο χώρο προς το περιβάλλον;",options:["Το σύστημα ψύξης","Ένας απλός χάρακας"],correctIndex:0},
      {text:"Ποια εργασία ανήκει σε βασική μηχανολογική εφαρμογή;",options:["Συντήρηση μηχανήματος","Διόρθωση ορθογραφίας κειμένου"],correctIndex:0},
      {text:"Τι κάνει ένας κινητήρας;",options:["Μετατρέπει μια μορφή ενέργειας σε μηχανικό έργο","Μετρά αποκλειστικά το μήκος"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||agriculture":{id:"eneegyl-lyc-a-agriculture-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Γεωπονίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Γεωπονία και Αειφόρος Ανάπτυξη: αγροτική ανάπτυξη, εξέλιξη φυτών, βιοτεχνολογία και ενέργεια στη γεωργία",questions:[
      {text:"Ποια πρακτική ταιριάζει περισσότερο στην αειφόρο γεωργία;",options:["Ορθολογική χρήση νερού και εδάφους","Ανεξέλεγκτη σπατάλη νερού"],correctIndex:0},
      {text:"Η βιοτεχνολογία στη γεωργία αξιοποιεί κυρίως…",options:["βιολογικές διεργασίες και οργανισμούς","μόνο μηχανικά σχέδια κτιρίων"],correctIndex:0},
      {text:"Ποια ανανεώσιμη πηγή μπορεί να αξιοποιηθεί σε μια γεωργική εγκατάσταση;",options:["Η ηλιακή ενέργεια","Ο καπνός από ανεξέλεγκτη καύση"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||health":{id:"eneegyl-lyc-a-health-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Υγείας, Πρόνοιας και Ευεξίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Αγωγή Υγείας: ενεργητική ακρόαση, πρόληψη εξαρτήσεων, διατροφή και κυκλοφοριακή αγωγή",questions:[
      {text:"Τι χαρακτηρίζει την ενεργητική ακρόαση;",options:["Ακούμε προσεκτικά και ελέγχουμε ότι καταλάβαμε","Διακόπτουμε πριν ολοκληρώσει ο άλλος"],correctIndex:0},
      {text:"Ποια ενέργεια προστατεύει την υγεία ενός επιβάτη αυτοκινήτου;",options:["Η χρήση ζώνης ασφαλείας","Η μετακίνηση χωρίς ζώνη σε μικρές διαδρομές"],correctIndex:0},
      {text:"Ποια επιλογή συμβάλλει στην πρόληψη εξαρτήσεων;",options:["Έγκυρη ενημέρωση και αναζήτηση υποστήριξης","Απόκρυψη του προβλήματος και απομόνωση"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||architectural-drawing":{id:"eneegyl-lyc-a-architectural-drawing-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Δομικών Έργων 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Αρχές Γραμμικού και Αρχιτεκτονικού Σχεδίου: γραμμές, κλίμακα, διαστασιολόγηση και προβολές",questions:[
      {text:"Τι σημαίνει κλίμακα 1:50 σε ένα σχέδιο;",options:["1 μονάδα στο σχέδιο αντιστοιχεί σε 50 μονάδες στο πραγματικό αντικείμενο","50 μονάδες στο σχέδιο αντιστοιχούν πάντα σε 1 χιλιοστό"],correctIndex:0},
      {text:"Σε τι χρησιμεύει η διαστασιολόγηση;",options:["Δηλώνει τις πραγματικές διαστάσεις του αντικειμένου","Αλλάζει μόνο το χρώμα του σχεδίου"],correctIndex:0},
      {text:"Τι δείχνει μια κάτοψη κτιρίου;",options:["Οριζόντια τομή και διάταξη των χώρων","Μόνο την εξωτερική όψη από μπροστά"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||composition":{id:"eneegyl-lyc-a-composition-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Εφαρμοσμένων Τεχνών 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Βασικές Αρχές Σύνθεσης: τέχνη, εφαρμοσμένες τέχνες και γεωμετρικά στοιχεία σύνθεσης",questions:[
      {text:"Τι είναι σύνθεση στις εφαρμοσμένες τέχνες;",options:["Η οργανωμένη διάταξη οπτικών στοιχείων","Η τυχαία τοποθέτηση χωρίς σχέση"],correctIndex:0},
      {text:"Ποιο είναι βασικό γεωμετρικό στοιχείο μιας σύνθεσης;",options:["Η γραμμή","Η θερμοκρασία"],correctIndex:0},
      {text:"Ποια ανάλυση βοηθά να κατανοήσουμε μια αφίσα;",options:["Η εξέταση δομής, σχημάτων και σχέσεων των στοιχείων","Η μέτρηση μόνο του βάρους του χαρτιού"],correctIndex:0}
    ]},
    "eneegyl|lyc-a||research-technology":{id:"eneegyl-lyc-a-research-technology-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Ερευνητική Εργασία στην Τεχνολογία 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Ερευνητική Εργασία στην Τεχνολογία: επιλογή θέματος από ενδιαφέροντα, ομαδική εργασία, σχεδιασμός και τεκμηρίωση",questions:[
      {text:"Με ποιο κριτήριο επιλέγεται αρχικά το θέμα μιας ερευνητικής εργασίας;",options:["Με βάση ενδιαφέροντα και εκπαιδευτικές ή επαγγελματικές επιλογές της ομάδας","Με τυχαία επιλογή χωρίς συζήτηση"],correctIndex:0},
      {text:"Τι πρέπει να γίνει πριν από τη συλλογή αποτελεσμάτων;",options:["Να οριστούν ερώτημα και σχέδιο εργασίας","Να γραφτεί αυθαίρετα το συμπέρασμα"],correctIndex:0},
      {text:"Πώς στηρίζεται ένα συμπέρασμα ερευνητικής εργασίας;",options:["Με δεδομένα και καταγεγραμμένες πηγές","Μόνο με προσωπική προτίμηση"],correctIndex:0}
    ]},
    "eneegyl|lyc-b|administration-economy|accounting":{id:"eneegyl-lyc-b-accounting-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Διοίκησης και Οικονομίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Αρχές Λογιστικής: ενεργητικό, παθητικό, απογραφή και ισολογισμός",questions:[
      {text:"Πού κατατάσσονται τα περιουσιακά στοιχεία που ανήκουν στην επιχείρηση;",options:["Στο ενεργητικό","Στο πραγματικό παθητικό"],correctIndex:0},
      {text:"Τι καταγράφει η απογραφή;",options:["Αναλυτικά την περιουσία μιας επιχείρησης σε συγκεκριμένη στιγμή","Μόνο τις μελλοντικές πωλήσεις"],correctIndex:0},
      {text:"Ποια βασική ισότητα πρέπει να ισχύει στον ισολογισμό;",options:["Ενεργητικό = Παθητικό","Έσοδα = Αριθμός εργαζομένων"],correctIndex:0}
    ]},
    "eneegyl|lyc-b|administration-economy|marketing":{id:"eneegyl-lyc-b-marketing-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Διοίκησης και Οικονομίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Εισαγωγή στο Μάρκετινγκ: έννοια, φιλοσοφία, περιβάλλον και προγραμματισμός μάρκετινγκ",questions:[
      {text:"Ποιο είναι βασικό σημείο της φιλοσοφίας του μάρκετινγκ;",options:["Η κατανόηση των αναγκών του πελάτη","Η παραγωγή χωρίς να εξετάζεται η αγορά"],correctIndex:0},
      {text:"Τι εξετάζει το περιβάλλον μάρκετινγκ;",options:["Παράγοντες μέσα και έξω από την επιχείρηση που επηρεάζουν τις αποφάσεις","Μόνο το χρώμα του λογότυπου"],correctIndex:0},
      {text:"Γιατί γίνεται προγραμματισμός μάρκετινγκ;",options:["Για να οριστούν στόχοι και ενέργειες","Για να αποφεύγεται κάθε μέτρηση αποτελεσμάτων"],correctIndex:0}
    ]},
    "eneegyl|lyc-b|administration-economy|tourism":{id:"eneegyl-lyc-b-tourism-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Διοίκησης και Οικονομίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Θεωρία Τουρισμού: ατομικός, οικογενειακός, μαζικός, εσωτερικός και εξωτερικός τουρισμός",questions:[
      {text:"Πώς λέγεται ο τουρισμός που πραγματοποιείται μέσα στη χώρα μόνιμης κατοικίας;",options:["Εσωτερικός τουρισμός","Εξωτερικός τουρισμός"],correctIndex:0},
      {text:"Ποια μορφή οργανώνεται για μεγάλο αριθμό ταξιδιωτών με τυποποιημένες υπηρεσίες;",options:["Μαζικός τουρισμός","Ατομικός τουρισμός"],correctIndex:0},
      {text:"Ποια μπορεί να είναι συνέπεια της τουριστικής ανάπτυξης;",options:["Οικονομική, κοινωνική και περιβαλλοντική επίδραση","Καμία επίδραση στον προορισμό"],correctIndex:0}
    ]},
    "eneegyl|lyc-b|administration-economy|logistics":{id:"eneegyl-lyc-b-logistics-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Διοίκησης και Οικονομίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Εισαγωγή στην Εφοδιαστική: προμήθειες, αποθέματα, αποθήκευση, διανομή και μεταφορές",questions:[
      {text:"Ποια λειτουργία αποφασίζει πότε και πόσο υλικό πρέπει να παραγγελθεί;",options:["Η διαχείριση αποθεμάτων","Η επιλογή γραμματοσειράς"],correctIndex:0},
      {text:"Ποιος είναι βασικός στόχος της αποθήκευσης;",options:["Ασφαλής φύλαξη και σωστή διακίνηση προϊόντων","Τυχαία τοποθέτηση χωρίς καταγραφή"],correctIndex:0},
      {text:"Τι συνδέει τα προϊόντα από την προμήθεια έως τον πελάτη;",options:["Η εφοδιαστική αλυσίδα","Μόνο η διαφήμιση"],correctIndex:0}
    ]},
    "eneegyl|lyc-b|informatics|informatics-basics":{id:"eneegyl-lyc-b-informatics-basics-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Πληροφορικής 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Βασικά Θέματα Πληροφορικής: επίσημες σημειώσεις, όλα τα κεφάλαια",questions:[
      {text:"Ποια μονάδα εκτελεί τις εντολές ενός προγράμματος;",options:["Η κεντρική μονάδα επεξεργασίας","Η οθόνη"],correctIndex:0},
      {text:"Ποια μνήμη χάνει συνήθως τα δεδομένα της όταν κλείσει ο υπολογιστής;",options:["Η RAM","Ο αποθηκευτικός δίσκος"],correctIndex:0},
      {text:"Ποιο από τα παρακάτω είναι λογισμικό;",options:["Το λειτουργικό σύστημα","Το πληκτρολόγιο"],correctIndex:0}
    ]},
    "eneegyl|lyc-b|informatics|os-security":{id:"eneegyl-lyc-b-os-security-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Πληροφορικής 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων: επίσημες σημειώσεις και εξαιρέσεις ύλης",questions:[
      {text:"Ποια είναι βασική λειτουργία του λειτουργικού συστήματος;",options:["Διαχείριση υλικού και εκτέλεση εφαρμογών","Αντικατάσταση όλων των αρχείων με εικόνες"],correctIndex:0},
      {text:"Ποια πρακτική μειώνει τον κίνδυνο απώλειας δεδομένων;",options:["Τακτικό αντίγραφο ασφαλείας","Αποθήκευση μόνο σε ένα σημείο"],correctIndex:0},
      {text:"Ποια αρχή δίνει σε κάθε χρήστη μόνο τα δικαιώματα που χρειάζεται;",options:["Η αρχή του ελάχιστου προνομίου","Η κοινή χρήση ενός λογαριασμού από όλους"],correctIndex:0}
    ]},
    "eneegyl|lyc-c|health|first-aid":{id:"eneegyl-lyc-c-first-aid-official-2026-27",sourceTitle:"ΥΠΑΙΘΑ — ΕΝ.Ε.Ε.ΓΥ.-Λ. Υγείας, Πρόνοιας και Ευεξίας 2026-2027",sourceUrl:ENEEGYL_SOURCE,basis:"Πρώτες Βοήθειες: εκτίμηση συμβάντος, κλήση 112, αιμορραγίες και βασική υποστήριξη ζωτικών λειτουργιών",questions:[
      {text:"Πριν πλησιάσεις ένα ατύχημα, ποιο είναι το πρώτο βήμα;",options:["Να ελέγξεις ότι ο χώρος είναι ασφαλής","Να μετακινήσεις αμέσως κάθε τραυματία"],correctIndex:0},
      {text:"Ποιος αριθμός χρησιμοποιείται για επείγουσα βοήθεια σε όλη την Ευρωπαϊκή Ένωση;",options:["112","11888"],correctIndex:0},
      {text:"Σε έντονη εξωτερική αιμορραγία, ποια είναι βασική άμεση ενέργεια;",options:["Σταθερή άμεση πίεση με καθαρό υλικό","Αφαίρεση κάθε επιδέσμου για συνεχή έλεγχο"],correctIndex:0}
    ]}
  });

  function supportQuiz(tier,quizId,subject,adjacent){
    const raw=typeof QUIZZES!=="undefined"?QUIZZES?.[tier]?.[quizId]:null;
    if(!raw||!Array.isArray(raw.questions))return null;
    const questions=raw.questions.filter(q=>Array.isArray(q.options)&&q.options.some(o=>o.isCorrect)&&q.options.some(o=>!o.isCorrect)).slice(0,3).map((q,index)=>{
      const correct=q.options.find(o=>o.isCorrect),wrong=q.options.find(o=>!o.isCorrect);
      const options=index%2?[wrong,correct]:[correct,wrong];
      return {text:q.textEl||q.textEn,options:options.map(o=>o.textEl||o.textEn),correctIndex:index%2?1:0};
    });
    if(questions.length!==3)return null;
    if(adjacent)return {id:`special-education-adjacent-support-${quizId}`,subjectId:subject.id,subjectLabel:subject.label,scope:"verified-adjacent-grade-support-mapping",scopeLabel:"Σύντομο τεστ υποστήριξης από το σταθερό, επαληθευμένο τεστ της Γ΄ τάξης για το ομώνυμο μάθημα. Η Δ΄ τάξη δεν έχει δικό της επαληθευμένο τεστ και δεν παρουσιάζεται ως η ύλη της Δ΄ τάξης 2026–27.",questions};
    return {id:`special-education-support-${quizId}`,subjectId:subject.id,subjectLabel:subject.label,scope:"verified-general-support-mapping",scopeLabel:"Σύντομο τεστ υποστήριξης από το σταθερό, επαληθευμένο τεστ του ίδιου μαθήματος και της αντίστοιχης τάξης γενικής εκπαίδευσης. Δεν παρουσιάζεται ως πλήρης ή ταυτόσημη ύλη Ειδικής Εκπαίδευσης 2026–27.",questions};
  }

  function quizForSelection(schoolId,gradeId,groupId,subject){
    const canonicalSchool={"deaf-gymnasium":"special-gymnasium","deaf-lyceum":"special-lyceum"}[schoolId]||schoolId;
    const key=[canonicalSchool,gradeId,groupId||"",subject?.id||""].join("|");
    const official=OFFICIAL_INSTRUCTION_QUIZ_BY_SELECTION[key];
    if(official)return {
      id:official.id,
      subjectId:subject.id,
      subjectLabel:subject.label,
      scope:"verified-official-instruction-check",
      scopeLabel:"Περιορισμένος έλεγχος 3 ερωτήσεων, γραμμένος από ενότητες των επίσημων οδηγιών 2026-27 ("+official.basis+"). Δεν αποτελεί πλήρη έλεγχο της διδακτέας ή εξεταστέας ύλης.",
      sourceTitle:official.sourceTitle||OFFICIAL_SOURCE_TITLE,
      sourceUrl:official.sourceUrl||SCHOOLS?.[canonicalSchool]?.sourceUrl||"",
      questions:official.questions.map(q=>({text:q.text,options:[...q.options],correctIndex:q.correctIndex}))
    };
    const quizId=VERIFIED_QUIZ_BY_SELECTION[key];
    const raw=quizId?window.SPECIAL_EDUCATION_QUIZZES?.[quizId]:null;
    if(!raw||raw.status!=="ready"||!Array.isArray(raw.questions)){
      const support=SUPPORT_QUIZ_BY_SELECTION[key];
      if(support)return supportQuiz(support[0],support[1],subject,false);
      const adjacent=ADJACENT_GRADE_SUPPORT_BY_SELECTION[key];
      return adjacent?supportQuiz(adjacent[0],adjacent[1],subject,true):null;
    }
    return {
      id:quizId,
      subjectId:subject.id,
      subjectLabel:subject.label,
      scope:"verified-limited-curriculum-check",
      scopeLabel:"Περιορισμένος, επαληθευμένος έλεγχος της συγκεκριμένης ενότητας — δεν αποτελεί πλήρη έλεγχο της διδακτέας ή εξεταστέας ύλης 2026-27.",
      questions:raw.questions.map(q=>({text:q.q,options:[...q.options],correctIndex:q.correctIndex})),
      successMessage:raw.successMessage||"",
      retryMessage:raw.retryMessage||""
    };
  }

  const DEAF_GYM={...SPECIAL_GYM,id:"deaf-gymnasium",label:"Γυμνάσιο Κωφών και Βαρηκόων",curriculumAlias:"special-gymnasium",accessibility:"Ίδια επίσημη ύλη Ε.Α.Ε.· γραπτές και οπτικές οδηγίες, χωρίς αποκλειστική εξάρτηση από ήχο."};
  const DEAF_LYC={...SPECIAL_LYC,id:"deaf-lyceum",label:"Λύκειο Κωφών και Βαρηκόων",curriculumAlias:"special-lyceum",accessibility:"Ίδια επίσημη ύλη Ε.Α.Ε.· γραπτές και οπτικές οδηγίες, χωρίς αποκλειστική εξάρτηση από ήχο."};
  const SCHOOLS={"special-gymnasium":SPECIAL_GYM,"special-lyceum":SPECIAL_LYC,"deaf-gymnasium":DEAF_GYM,"deaf-lyceum":DEAF_LYC,"eneegyl":ENEEGYL};
  const availableSelectionCount=Object.entries(SCHOOLS).reduce((total,[schoolId,school])=>total+school.gradeOrder.reduce((gradeTotal,gradeId)=>{const grade=school.grades[gradeId];const common=(grade.subjects||[]).filter(subject=>quizForSelection(schoolId,gradeId,"",subject)).length;const grouped=(grade.groups||[]).reduce((sum,group)=>sum+(group.subjects||[]).filter(subject=>quizForSelection(schoolId,gradeId,group.id,subject)).length,0);return gradeTotal+common+grouped;},0),0);
  const DATA={version:11,schoolYear:"2026-2027",verificationDate:"2026-09-19",schoolOrder:["special-gymnasium","special-lyceum","deaf-gymnasium","deaf-lyceum","eneegyl"],schools:SCHOOLS,quizPolicy:{questions:3,optionsPerQuestion:2,oneConceptAtATime:true,noTricks:true,scopeLabel:"Περιορισμένος έλεγχος 3 ερωτήσεων. Ενεργοποιείται μόνο όταν υπάρχει πραγματικό τεστ του μαθήματος ή σαφώς επισημασμένο τεστ υποστήριξης."},verifiedQuizCount:Object.keys(VERIFIED_QUIZ_BY_SELECTION).length+Object.keys(OFFICIAL_INSTRUCTION_QUIZ_BY_SELECTION).length,supportQuizCount:Object.keys(SUPPORT_QUIZ_BY_SELECTION).length+Object.keys(ADJACENT_GRADE_SUPPORT_BY_SELECTION).length,totalAvailableQuizCount:availableSelectionCount,quizForSelection};

  window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA=Object.freeze(DATA);
})();
