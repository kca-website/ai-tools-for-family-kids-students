(function(){
  "use strict";

  const GENERAL_GUIDANCE="https://www.iep.edu.gr/wp-content/uploads/2026/09/162917_1_2026_09_08_%CE%95%CE%9E%CE%95_116898_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%93%CE%95%CE%9D_%CE%A0%CE%91%CE%99%CE%94%CE%95%CE%99%CE%91%CE%A3_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A1%CE%A6%CE%A3%CE%A546%CE%9D%CE%9A%CE%A0%CE%94_%CE%96%CE%9D9.pdf";
  const EPAL_HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/";
  const EPAL_GENERAL_HUB="https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-kai-p-epa-l-gia-to-scholiko-etos-2026-2027/";
  const FOREIGN_LANG="https://www.iep.edu.gr/wp-content/uploads/2026/09/162643_1_2026_08_28_%CE%95%CE%9E%CE%95_111814_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%9E%CE%95%CE%9D%CE%95%CE%A3_%CE%93%CE%9B%CE%A9%CE%A3%CE%A3%CE%95%CE%A3_%CE%95%CE%A0%CE%91%CE%9B_%CE%A0%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%A81%CE%9A646%CE%9D%CE%9A%CE%A0%CE%94_%CE%9573.pdf";
  const CS_BOOK="https://www.ebooks.edu.gr/ebooks/v/html/8547/2716/Pliroforiki_B-Lykeiou_html-empl/";
  const MARITIME_STRUCTURE="https://www.minedu.gov.gr/panelladikes-eksetaseis-pistopoiitika/anakoinwseis-ell-ex?id=1593&view=category";

  const INF_2026="https://www.iep.edu.gr/wp-content/uploads/2026/09/162082_1_2026_07_31_%CE%95%CE%9E%CE%95_103686_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%9A%CE%97%CE%A3_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A86%CE%9B646%CE%9D%CE%9A%CE%A0%CE%94_%CE%9542.pdf";
  const ELEC_2026="https://www.iep.edu.gr/wp-content/uploads/2026/09/162176_1_2026_08_04_%CE%95%CE%9E%CE%95_104811_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%97%CE%9B%CE%95%CE%9A%CE%A4%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A127%CE%9846%CE%9D%CE%9A%CE%A0%CE%94_%CE%A3%CE%A73.pdf";
  const ADMIN_2026="https://www.iep.edu.gr/wp-content/uploads/2026/09/162642_1_2026_08_28_%CE%95%CE%9E%CE%95111822_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%94%CE%99%CE%9F%CE%99%CE%9A_%CE%BA_%CE%9F%CE%99%CE%9A%CE%9F%CE%9D_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%82_2026_27_9%CE%919%CE%9D46%CE%9D%CE%9A%CE%A0%CE%94_%CE%A13%CE%A1-1.pdf";
  const MECH_2026="https://www.iep.edu.gr/wp-content/uploads/2026/09/162059_1_2026_07_31_%CE%95%CE%9E%CE%95_103738_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%9C%CE%97%CE%A7%CE%91%CE%9D%CE%9F%CE%9B_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_6%CE%A3%CE%9D%CE%A046%CE%9D%CE%9A%CE%A0%CE%94_%CE%98%CE%A8%CE%A5.pdf";
  const AGRI_2026="https://www.iep.edu.gr/wp-content/uploads/2026/09/162060_1_2026_07_31_%CE%95%CE%9E%CE%95_103630_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%93%CE%95%CE%A9%CE%A0%CE%9F%CE%9D%CE%99%CE%91%CE%A3_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A8%CE%9D2246%CE%9D%CE%9A%CE%A0%CE%94_%CE%98%CE%93%CE%A6.pdf";
  const ARTS_2026="https://www.iep.edu.gr/wp-content/uploads/2026/09/162056_1_2026_07_31_%CE%95%CE%9E%CE%95_103707_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%95%CE%A6%CE%91%CE%A1%CE%9C_%CE%A4%CE%95%CE%A7%CE%9D%CE%A9%CE%9D_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_9%CE%9B%CE%A3646%CE%9D%CE%9A%CE%A0%CE%94_9%CE%92%CE%9F.pdf";

  const NEW_GREEK={
    a:["Βιώματα, εμπειρίες και ενδιαφέροντα των εφήβων","Γνωριμία με τον κόσμο της επιστήμης και της τεχνολογίας","Ο άνθρωπος και η φύση","Ταξίδια","Όψεις της σύγχρονης ενημέρωσης","Πέρα από τα σύνορα"],
    b:["«Τη γλώσσα μού έδωσαν ελληνική»","Οι ανησυχίες των νέων","Εμείς και οι «άλλοι»","Διαδρομές στον χώρο της τέχνης","Ταξίδι στην ιστορία","Ο άνθρωπος ως πολίτης"],
    c:["Από τον 20ό στον 21ο αιώνα","Ο πολίτης και οι θεσμοί","Ζώντας την καθημερινότητα","Μιλώντας για προβλήματα του ανθρώπου και του κόσμου","Η Ελλάδα και ο κόσμος"]
  };

  const MATH_A=["Εισαγωγικό κεφάλαιο — Ε.2 Σύνολα","Κεφάλαιο 2 — Οι Πραγματικοί Αριθμοί","Κεφάλαιο 3 — Εξισώσεις","Κεφάλαιο 4 — Ανισώσεις","Κεφάλαιο 5 — Πρόοδοι","Κεφάλαιο 6 — Βασικές Έννοιες των Συναρτήσεων"];
  const CS_B=["Ενότητα 1 — Βασικές Έννοιες","Κεφάλαιο 1.1 — Επιστήμη των Υπολογιστών","Ενότητα 2 — Θέματα Θεωρητικής Επιστήμης των Υπολογιστών","Κεφάλαιο 2.1 — Πρόβλημα","Κεφάλαιο 2.2 — Αλγόριθμοι","Κεφάλαιο 2.3 — Προγραμματισμός","Ενότητα 3 — Θέματα Εφαρμοσμένης Επιστήμης των Υπολογιστών","Κεφάλαιο 3.1 — Λειτουργικά Συστήματα","Κεφάλαιο 3.2 — Πληροφοριακά Συστήματα","Κεφάλαιο 3.3 — Δίκτυα Υπολογιστών","Κεφάλαιο 3.4 — Τεχνητή Νοημοσύνη"];
  const CS_C=["Κεφάλαιο 1 — επίσημες σημειώσεις «Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ»","Κεφάλαιο 2 — επίσημες σημειώσεις «Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ»","Κεφάλαιο 3 — επίσημες σημειώσεις «Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ»"];
  const ENGLISH_A=["Unit 1","Unit 2","Unit 3","Unit 4","Unit 6","Unit 7"];

  const AGRI_TOPICS={
    rural:["Κεφάλαιο 2 — Βασικές έννοιες στην οικονομική της παραγωγής γεωργικών προϊόντων","Κεφάλαιο 3 — Μορφές γεωργικών εκμεταλλεύσεων","Κεφάλαιο 4 — Παράγοντες επιλογής της παραγωγικής κατεύθυνσης","Κεφάλαιο 5 — Συντελεστές γεωργικής παραγωγής","Κεφάλαιο 6 — Παραγωγικές δαπάνες"],
    environment:["Κεφάλαιο 1 — Εισαγωγή","Κεφάλαιο 2 — Φυτική παραγωγή και περιβάλλον","Κεφάλαιο 3 — Ζωική παραγωγή και περιβάλλον","Κεφάλαιο 4 — Δάσος και περιβάλλον","Κεφάλαιο 5 — Αλιεία και περιβάλλον"],
    plant:["Κεφάλαιο 2 — Περιγραφή του καλλιεργούμενου φυτού","Κεφάλαιο 3 — Χαρακτηρισμός σταδίων ανάπτυξης των καλλιεργούμενων φυτών","Κεφάλαιο 4 — Ο σπόρος","Κεφάλαιο 5 — Κατεργασία του εδάφους","Κεφάλαιο 6 — Η σπορά","Κεφάλαιο 7 — Λίπανση της καλλιέργειας","Κεφάλαιο 8 — Άρδευση της καλλιέργειας"],
    animal:["Κεφάλαιο 1 — Γενικά περί κτηνοτροφίας","Κεφάλαιο 2 — Τα κατοικίδια αγροτικά ζώα","Κεφάλαιο 4 — Οι επιδράσεις του περιβάλλοντος στο ζωικό οργανισμό","Κεφάλαιο 6 — Βελτίωση αγροτικών ζώων","Κεφάλαιο 7 — Αναπαραγωγή αγροτικών ζώων","Κεφάλαιο 8 — Συστήματα εκτροφής των ζώων","Κεφάλαιο 9 — Υγιεινή αγροτικών ζώων","Κεφάλαιο 10 — Διατροφή αγροτικών ζώων"],
    food:["Κεφάλαιο 1 — Εισαγωγή","Κεφάλαιο 2 — Σύσταση και κατηγορίες τροφίμων","Κεφάλαιο 3 — Βιομηχανία Τροφίμων","Κεφάλαιο 4 — Προμήθεια Πρώτης Ύλης","Κεφάλαιο 5 — Παραγωγή και Επεξεργασία","Κεφάλαιο 6 — Συσκευασία και αποθήκευση","Κεφάλαιο 7 — Έρευνα και ανάπτυξη της Βιομηχανίας Τροφίμων"],
    landscape:["Κεφάλαιο 1 — Αρχές στην αρχιτεκτονική τοπίου","Κεφάλαιο 3 — Φυτά: η λειτουργική και αισθητική τους αξία","Κεφάλαιο 4 — Εισαγωγικά στοιχεία για τον σχεδιασμό έργων στην αρχιτεκτονική τοπίου","Κεφάλαιο 8 — Η υποβάθμιση του φυσικού περιβάλλοντος από τον άνθρωπο"],
    installations:["Γεωργικές Εγκαταστάσεις — Κεφάλαιο 1: Μετρικά συστήματα και σχεδιάσεις","Γεωργικές Εγκαταστάσεις — Κεφάλαιο 2: Γεωργικές ξυλουργικές εργασίες","Γεωργικές Εγκαταστάσεις — Κεφάλαιο 6: Σύρματα – Περιφράξεις","Γεωργικές Εγκαταστάσεις — Κεφάλαιο 9: Οργάνωση εργαστηρίου γεωργικών εγκαταστάσεων","Γεωργικές Εγκαταστάσεις — Κεφάλαιο 11: Θερμοκήπια"]
  };

  const common=(id,label,topics=[],extra={})=>({id,label,topics:[...topics],...extra});
  const sectorSubject=(sector,id,label,topics=[],sourceUrl=EPAL_HUB)=>common(`b-${sector}-${id}`,`${sector} · ${label}`,topics,{sector,officialStructure:true,sourceUrl});
  const gateway=(grade,id,label)=>common(`${grade}-sector-${id}`,`${grade==='b'?'Τομέας':'Ειδικότητες Τομέα'}: ${label}`,[],{sectorGateway:true,sourceUrl:id==='maritime'?MARITIME_STRUCTURE:EPAL_HUB});

  const B_SECTOR_SUBJECTS=[
    sectorSubject("Πληροφορικής","programming-principles","Αρχές Προγραμματισμού Υπολογιστών",[],INF_2026),
    sectorSubject("Πληροφορικής","hardware-networks","Υλικό και Δίκτυα Υπολογιστών",[],INF_2026),
    sectorSubject("Πληροφορικής","informatics-basics","Βασικά Θέματα Πληροφορικής",[],INF_2026),
    sectorSubject("Πληροφορικής","os-security","Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων",[],INF_2026),
    sectorSubject("Πληροφορικής","web-design","Σχεδιασμός και Ανάπτυξη Ιστότοπων",[],INF_2026),
    sectorSubject("Πληροφορικής","sales-specs","Τεχνικά Θέματα Πωλήσεων & Προδιαγραφών Υλικού και Λογισμικού",[],INF_2026),

    sectorSubject("Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","electrotechnics","Ηλεκτροτεχνία (Κυκλώματα Συνεχούς και Εναλλασσόμενου Ρεύματος)",[],ELEC_2026),
    sectorSubject("Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","internal-installations","Εσωτερικές Ηλεκτρικές Εγκαταστάσεις και Ηλεκτρολογικό Σχέδιο",[],ELEC_2026),
    sectorSubject("Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","computer-networks-intro","Εισαγωγή στα Υπολογιστικά Συστήματα και στα Δίκτυα Επικοινωνιών",[],ELEC_2026),
    sectorSubject("Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","automation-sensors","Αυτοματισμοί, Αισθητήρες",[],ELEC_2026),
    sectorSubject("Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","analog-digital-electronics","Αναλογικά και Ψηφιακά Ηλεκτρονικά",[],ELEC_2026),

    sectorSubject("Διοίκησης και Οικονομίας","accounting","Αρχές Λογιστικής",[],ADMIN_2026),
    sectorSubject("Διοίκησης και Οικονομίας","marketing","Εισαγωγή στο Μάρκετινγκ",[],ADMIN_2026),
    sectorSubject("Διοίκησης και Οικονομίας","tourism","Θεωρία Τουρισμού και Εφαρμογές",[],ADMIN_2026),
    sectorSubject("Διοίκησης και Οικονομίας","logistics-intro","Εισαγωγή στην Εφοδιαστική (Logistics)",[],ADMIN_2026),
    sectorSubject("Διοίκησης και Οικονομίας","financial-excel","Χρηματοπιστωτικές Συναλλαγές – Λογιστικά Φύλλα (EXCEL)",[],ADMIN_2026),
    sectorSubject("Διοίκησης και Οικονομίας","law","Στοιχεία Δικαίου (Αστικό-Εμπορικό-Εργατικό-Τουριστικό)",[],ADMIN_2026),
    sectorSubject("Διοίκησης και Οικονομίας","business-math-statistics","Οικονομικά Μαθηματικά & Στατιστική",[],ADMIN_2026),

    sectorSubject("Μηχανολογίας","thermodynamics","Στοιχεία Τεχνικής Θερμοδυναμικής - Εφαρμογές",[],MECH_2026),
    sectorSubject("Μηχανολογίας","mechanics-strength","Μηχανική-Αντοχή Υλικών",[],MECH_2026),
    sectorSubject("Μηχανολογίας","machine-elements-design","Σχεδιασμός και Περιγραφή Στοιχείων Μηχανών",[],MECH_2026),
    sectorSubject("Μηχανολογίας","manufacturing","Τεχνολογία Μηχανολογικών Κατασκευών-Εφαρμογές",[],MECH_2026),
    sectorSubject("Μηχανολογίας","basic-electrical","Βασική Ηλεκτρολογία και Εφαρμογές",[],MECH_2026),

    sectorSubject("Εφαρμοσμένων Τεχνών","freehand-drawing","Ελεύθερο Σχέδιο",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","linear-drawing","Γραμμικό Σχέδιο",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","art-history","Ιστορία της Τέχνης",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","composition","Αρχές Σύνθεσης",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","computer-applied-arts","Εφαρμοσμένες Τέχνες με χρήση Η/Υ",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","photo","Ειδικό εργαστηριακό: Φωτογραφία και Ηλεκτρονική Επεξεργασία Εικόνας",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","textiles","Ειδικό εργαστηριακό: Τεχνολογία Υφαντικών Υλών",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","engraving-plastic","Ειδικό εργαστηριακό: Εργαστήριο Χαρακτικής-Πλαστικής",[],ARTS_2026),
    sectorSubject("Εφαρμοσμένων Τεχνών","wood","Ειδικό εργαστηριακό: Εισαγωγή στις Ξύλινες Κατασκευές",[],ARTS_2026),

    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","rural-development","Αρχές Αγροτικής Ανάπτυξης",AGRI_TOPICS.rural,AGRI_2026),
    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","environment-agriculture","Περιβάλλον και Γεωργία",AGRI_TOPICS.environment,AGRI_2026),
    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","plant-production","Φυτική Παραγωγή",AGRI_TOPICS.plant,AGRI_2026),
    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","animal-production","Ζωική Παραγωγή",AGRI_TOPICS.animal,AGRI_2026),
    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","food-technology","Τεχνολογία Τροφίμων",AGRI_TOPICS.food,AGRI_2026),
    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","landscape","Αρχές Αρχιτεκτονικής Τοπίου",AGRI_TOPICS.landscape,AGRI_2026),
    sectorSubject("Γεωπονίας, Τροφίμων και Περιβάλλοντος","agri-installations","Στοιχεία Γεωργικών Εγκαταστάσεων & Γεωργικά Μηχανήματα",AGRI_TOPICS.installations,AGRI_2026),

    gateway("b","structures","Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού"),
    gateway("b","health","Υγείας - Πρόνοιας - Ευεξίας"),
    gateway("b","maritime","Ναυτιλιακών Επαγγελμάτων")
  ];

  const C_SECTORS=[
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
      common("electrical-electronics","Αρχές Ηλεκτρολογίας και Ηλεκτρονικής",[],{sourceUrl:ELEC_2026}),
      common("health-education","Αγωγή Υγείας",[],{sourceUrl:EPAL_HUB}),
      common("economics","Αρχές Οικονομίας",[],{sourceUrl:ADMIN_2026}),
      common("composition","Βασικές Αρχές Σύνθεσης",[],{sourceUrl:ARTS_2026}),
      common("architectural-drawing","Αρχές Γραμμικού και Αρχιτεκτονικού Σχεδίου",[],{sourceUrl:EPAL_HUB}),
      common("mechanics","Αρχές Μηχανολογίας",[],{sourceUrl:MECH_2026}),
      common("agriculture-sustainability","Γεωπονία και Αειφόρος Ανάπτυξη",[],{sourceUrl:AGRI_2026}),
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
      ...B_SECTOR_SUBJECTS
    ],
    c:[
      common("new-greek","Νέα Ελληνικά",NEW_GREEK.c,{sourceUrl:GENERAL_GUIDANCE}),
      common("math","Μαθηματικά (Άλγεβρα + Γεωμετρία)",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("physics","Φυσική",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("chemistry","Χημεία",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ",CS_C,{sourceUrl:GENERAL_GUIDANCE}),
      common("pe","Φυσική Αγωγή",[],{sourceUrl:GENERAL_GUIDANCE}),
      common("english","Αγγλικά",[],{sourceUrl:FOREIGN_LANG,continuation:true}),
      ...C_SECTORS.map(([id,label])=>gateway("c",id,label))
    ]
  };

  const DATA=Object.freeze({
    version:"1.1.0",
    schoolYear:"2026-2027",
    verificationDate:"2026-09-12",
    sourceUrls:Object.freeze({generalGuidance:GENERAL_GUIDANCE,epalHub:EPAL_HUB,epalGeneralHub:EPAL_GENERAL_HUB,foreignLanguages:FOREIGN_LANG,maritimeStructure:MARITIME_STRUCTURE,informatics:INF_2026,electrical:ELEC_2026,administrationEconomy:ADMIN_2026,mechanical:MECH_2026,agriculture:AGRI_2026,appliedArts:ARTS_2026}),
    note:"Τα μαθήματα Γενικής Παιδείας ακολουθούν την τρέχουσα εγκύκλιο 2026–27. Στη Β΄ ΕΠΑ.Λ. εμφανίζονται πλέον τα πραγματικά μαθήματα των έξι τομέων που έχουν επαληθευτεί απευθείας στις τρέχουσες οδηγίες· Δομικά, Υγεία και Ναυτιλιακά παραμένουν προσωρινά ως πύλες μέχρι να ολοκληρωθεί η ίδια αυστηρή εξαγωγή. Στη Γ΄ τάξη διατηρούνται πύλες ειδικοτήτων μέχρι να περαστούν πλήρεις λίστες ανά ειδικότητα. Δεν επινοούνται κεφάλαια.",
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
