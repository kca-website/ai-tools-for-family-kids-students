(function(){
  "use strict";

  const SRC={
    hub:"https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/",
    info:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162082_1_2026_07_31_%CE%95%CE%9E%CE%95_103686_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%A0%CE%9B%CE%97%CE%A1%CE%9F%CE%A6%CE%9F%CE%A1%CE%99%CE%9A%CE%97%CE%A3_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A86%CE%9B646%CE%9D%CE%9A%CE%A0%CE%94_%CE%9542.pdf",
    electrical:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162176_1_2026_08_04_%CE%95%CE%9E%CE%95_104811_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%97%CE%9B%CE%95%CE%9A%CE%A4%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A127%CE%9846%CE%9D%CE%9A%CE%A0%CE%94_%CE%A3%CE%A73.pdf",
    health:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162321_1_2026_08_10_%CE%95%CE%9E%CE%95_13661_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%A5%CE%93_%CE%A0%CE%A1_%CE%95%CE%A5%CE%95%CE%9E_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A8%CE%A7%CE%A3246%CE%9D%CE%9A%CE%A0%CE%94_%CE%A44%CE%95.pdf",
    admin:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162642_1_2026_08_28_%CE%95%CE%9E%CE%95111822_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%94%CE%99%CE%9F%CE%99%CE%9A_%CE%BA_%CE%9F%CE%99%CE%9A%CE%9F%CE%9D_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%82_2026_27_9%CE%919%CE%9D46%CE%9D%CE%9A%CE%A0%CE%94_%CE%A13%CE%A1-1.pdf",
    mechanical:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162059_1_2026_07_31_%CE%95%CE%9E%CE%95_103738_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%9C%CE%97%CE%A7%CE%91%CE%9D%CE%9F%CE%9B_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_6%CE%A3%CE%9D%CE%A046%CE%9D%CE%9A%CE%A0%CE%94_%CE%98%CE%A8%CE%A5.pdf",
    agriculture:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162060_1_2026_07_31_%CE%95%CE%9E%CE%95_103630_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%93%CE%95%CE%A9%CE%A0%CE%9F%CE%9D%CE%99%CE%91%CE%A3_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_%CE%A8%CE%9D2246%CE%9D%CE%9A%CE%A0%CE%94_%CE%98%CE%93%CE%A6.pdf",
    arts:"https://www.iep.edu.gr/wp-content/uploads/2026/09/162056_1_2026_07_31_%CE%95%CE%9E%CE%95_103707_%CE%8E%CE%BB%CE%B7_%CE%9F%CE%B4%CE%B7%CE%B3%CE%AF%CE%B5%CF%82_%CE%95%CE%A6%CE%91%CE%A1%CE%9C_%CE%A4%CE%95%CE%A7%CE%9D%CE%A9%CE%9D_%CE%91_%CE%92_%CE%93_%CE%95%CE%A0%CE%91%CE%9B_%CF%83%CF%87_%CE%AD%CF%84%CE%BF%CF%85%CF%82_2026_27_%CE%91%CE%94%CE%91_9%CE%9B%CE%A3646%CE%9D%CE%9A%CE%A0%CE%94_9%CE%92%CE%9F.pdf"
  };

  const mk=(id,label,sourceUrl,extra={})=>({id,label,topics:[],sourceUrl,officialStructure:true,...extra});
  const sp=(id,sector,label,sourceUrl,subjects)=>({id,sector,label,sourceUrl,subjects});

  const SPECIALTIES=[
    sp("info-apps","Πληροφορικής","Τεχνικός Εφαρμογών Πληροφορικής",SRC.info,["Προγραμματισμός Υπολογιστών","Δίκτυα Υπολογιστών","Προγραμματισμός Υπολογιστών (Εργαστήριο)","Δίκτυα Υπολογιστών (Εργαστήριο)","Πληροφοριακά Συστήματα σε Επιχειρήσεις και Οργανισμούς","Συστήματα Διαχείρισης Βάσεων Δεδομένων και Εφαρμογές τους στο Διαδίκτυο","Ειδικά Θέματα στον Προγραμματισμό Υπολογιστών","Σχεδιασμός και Ανάπτυξη Διαδικτυακών Εφαρμογών"]),
    sp("info-hw","Πληροφορικής","Τεχνικός Η/Υ και Δικτύων Η/Υ",SRC.info,["Προγραμματισμός Υπολογιστών","Δίκτυα Υπολογιστών","Προγραμματισμός Υπολογιστών (Εργαστήριο)","Δίκτυα Υπολογιστών (Εργαστήριο)","Πληροφοριακά Συστήματα σε Επιχειρήσεις και Οργανισμούς","Εγκατάσταση, Διαχείριση και Συντήρηση Υπολογιστικών Συστημάτων","Ειδικά Θέματα στο Υλικό και στα Δίκτυα Υπολογιστών","Τεχνική Υποστήριξη Υπολογιστικών Συστημάτων και Δικτυακών Υποδομών"]),

    sp("elec-electronics","Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","Τεχνικός Ηλεκτρονικών και Υπολογιστικών Συστημάτων, Εγκαταστάσεων, Δικτύων και Τηλεπικοινωνιών",SRC.electrical,["Ψηφιακά Συστήματα","Δίκτυα Υπολογιστών","Εφαρμοσμένα Ηλεκτρονικά - Κατασκευές","Εγκατάσταση και Διαχείριση Δικτύων – Συντήρηση Υπολογιστικών Συστημάτων","Συστήματα Ελέγχου και Ασφάλειας","Τηλεπικοινωνίες - Τηλεματική","Ρομποτική","Επεξεργασία Σήματος Ήχου και Εικόνας"]),
    sp("elec-installations","Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού","Τεχνικός Ηλεκτρολογικών Συστημάτων, Εγκαταστάσεων και Δικτύων",SRC.electrical,["Ηλεκτροτεχνία 2","Ηλεκτρικές Μηχανές","Ηλεκτρολογικές Εγκαταστάσεις 2","Εργαστήριο Ηλεκτροτεχνίας – Ηλεκτρικών Μηχανών","Αυτοματισμοί Προγραμματιζόμενης Λογικής"]),

    sp("admin-office","Διοίκησης και Οικονομίας","Υπάλληλος Διοίκησης και Οικονομικών Υπηρεσιών",SRC.admin,["Αρχές Οικονομικής Θεωρίας","Αρχές Οργάνωσης και Διοίκησης","Σύγχρονο Περιβάλλον Γραφείου","Φορολογική Πρακτική","Λογιστικές Εφαρμογές","Επικοινωνία και Δημόσιες Σχέσεις"]),
    sp("admin-logistics","Διοίκησης και Οικονομίας","Υπάλληλος Αποθήκης και Συστημάτων Εφοδιασμού",SRC.admin,["Αρχές Οικονομικής Θεωρίας","Αρχές Οργάνωσης και Διοίκησης","Οργάνωση και Διαχείριση Αποθηκών","Οργάνωση και Διαχείριση Μεταφορών","Εφαρμογές Εφοδιαστικής (Logistics)","Λογιστικές Εφαρμογές"]),
    sp("admin-marketing","Διοίκησης και Οικονομίας","Υπάλληλος Εμπορίας και Διαφήμισης",SRC.admin,["Αρχές Οικονομικής Θεωρίας","Αρχές Οργάνωσης και Διοίκησης","Σύγχρονο Περιβάλλον Γραφείου","Διαφήμιση (Εισαγωγή, Δημιουργία και Προβολή)","Επικοινωνία και Δημόσιες Σχέσεις","Εφαρμογές Marketing","Λογιστικές Εφαρμογές"]),
    sp("admin-tourism","Διοίκησης και Οικονομίας","Υπάλληλος Τουριστικών Επιχειρήσεων",SRC.admin,["Αρχές Οικονομικής Θεωρίας","Αρχές Οργάνωσης και Διοίκησης","Οργάνωση και Λειτουργία Τουριστικών Επιχειρήσεων","Οργάνωση και Λειτουργία Ξενοδοχειακών Επιχειρήσεων","Γεωγραφία Τουρισμού","Εφαρμογές στον Τουρισμό"]),

    sp("mech-installations","Μηχανολογίας","Τεχνικός Μηχανολογικών Εγκαταστάσεων και Κατασκευών",SRC.mechanical,["Στοιχεία Μηχανών","Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων","Μηχανουργική Τεχνολογία-Εργαλειομηχανές","Ανελκυστήρες-Ανυψωτικές Μηχανές","Στοιχεία Ψύξης - Κλιματισμού"]),
    sp("mech-heating","Μηχανολογίας","Τεχνικός Θερμικών και Υδραυλικών Εγκαταστάσεων και Τεχνολογίας Πετρελαίου και Φυσικού Αερίου",SRC.mechanical,["Στοιχεία Μηχανών","Στοιχεία Σχεδιασμού Κεντρικών Θερμάνσεων","Συντήρηση και Επισκευή Εγκαταστάσεων Καύσης Υγρών και Αερίων Καυσίμων","Ύδρευση - Αποχέτευση","Κατασκευή και Λειτουργία Κεντρικής Θέρμανσης","Σχέδιο Ειδικότητας"]),
    sp("mech-hvac","Μηχανολογίας","Τεχνικός Εγκαταστάσεων Ψύξης Αερισμού και Κλιματισμού",SRC.mechanical,["Στοιχεία Μηχανών","Στοιχεία Ψύξης-Κλιματισμού","Στοιχεία Ψύξης – Κλιματισμού (Εργαστήριο)","Εγκαταστάσεις Κλιματισμού","Σύστημα Ελέγχου, Ρύθμισης και Αυτοματισμού Εγκαταστάσεων Ψύξης και Κλιματισμού","Μηχανολογική Σχεδίαση Εγκαταστάσεων Ψύξης και Κλιματισμού"]),
    sp("mech-vehicles","Μηχανολογίας","Τεχνικός Οχημάτων",SRC.mechanical,["Στοιχεία Μηχανών","Μηχανές Εσωτερικής Καύσης ΙΙ","Μηχανές Εσωτερικής Καύσης ΙΙ (Εργαστήριο)","Συστήματα Αυτοκινήτου","Τεχνολογία Ελέγχων και Διαγνώσεων"]),
    sp("mech-aircraft","Μηχανολογίας","Τεχνικός Μηχανοσυνθέτης Αεροσκαφών",SRC.mechanical,["Στοιχεία Μηχανών","Κινητήρες Αεροσκαφών","Κινητήρες Αεροσκαφών (Εργαστήριο)","Δομή και Συστήματα Αεροσκαφών","Διαδικασίες Συντήρησης Αεροσκαφών","Τεχνολογία Αεροπορικού Υλικού"]),

    sp("agri-plant","Γεωπονίας, Τροφίμων και Περιβάλλοντος","Τεχνικός Φυτικής Παραγωγής",SRC.agriculture,["Σύγχρονες Γεωργικές Επιχειρήσεις","Αρχές Βιολογικής Γεωργίας","Δενδροκομία-Αμπελουργία","Φυτά Μεγάλης Καλλιέργειας-Κηπευτικές Καλλιέργειες","Αρδεύσεις Καλλιεργειών","Φυτοπροστασία"]),
    sp("agri-animal","Γεωπονίας, Τροφίμων και Περιβάλλοντος","Τεχνικός Ζωικής Παραγωγής",SRC.agriculture,["Σύγχρονες Γεωργικές Επιχειρήσεις","Αρχές Βιολογικής Γεωργίας","Διατροφή Αγροτικών Ζώων","Εκτροφή Αγροτικών Ζώων","Υδατοκαλλιέργειες","Μελισσοκομία-Σηροτροφία"]),
    sp("agri-food","Γεωπονίας, Τροφίμων και Περιβάλλοντος","Τεχνικός Τεχνολογίας Τροφίμων και Ποτών",SRC.agriculture,["Σύγχρονες Γεωργικές Επιχειρήσεις","Αρχές Βιολογικής Γεωργίας","Αρχές Επεξεργασίας Τροφίμων","Μεταποίηση Φυτικών Προϊόντων","Μεταποίηση Ζωικών Προϊόντων","Ασφάλεια Τροφίμων"]),
    sp("agri-landscape","Γεωπονίας, Τροφίμων και Περιβάλλοντος","Τεχνικός Ανθοκομίας και Αρχιτεκτονικής Τοπίου",SRC.agriculture,["Σύγχρονες Γεωργικές Επιχειρήσεις","Αρχές Βιολογικής Γεωργίας","Ανθοκομικά Φυτά","Εφαρμογές Αρδευτικών Δικτύων στην Κηποτεχνία","Σχεδιασμός Φυτοτεχνικών Έργων","Συντήρηση Κηποτεχνικών Εφαρμογών"]),

    sp("arts-graphics","Εφαρμοσμένων Τεχνών","Γραφικών Τεχνών",SRC.arts,["Ιστορία Σύγχρονης Τέχνης","Τεχνολογία Υλικών","Ελεύθερο Σχέδιο – Χρώμα","Γραφιστικές Εφαρμογές","Τεχνολογία Εκτυπώσεων","Ψηφιακή Σχεδίαση Εντύπων","Γραμματογραφία"]),
    sp("arts-jewelry","Εφαρμοσμένων Τεχνών","Αργυροχρυσοχοΐας",SRC.arts,["Ιστορία Σύγχρονης Τέχνης","Τεχνολογία Υλικών","Εργαστήριο Χειροποίητου Κοσμήματος","Εργαστήριο Αναπαραγωγικού Κοσμήματος – Σμάλτο","Σχέδιο Κοσμηματοποιίας","Εργαστήριο Πλαστικής – Μεταλλοπλαστικής"]),
    sp("arts-conservation","Εφαρμοσμένων Τεχνών","Συντήρησης Έργων Τέχνης – Αποκατάστασης",SRC.arts,["Ιστορία Σύγχρονης Τέχνης","Τεχνολογία Υλικών","Βασικές Τεχνικές Συντήρησης Έργων Τέχνης","Προστασία Πολιτιστικής Κληρονομιάς","Αντίγραφο Έργων Τέχνης","Σχεδιαστική Τεκμηρίωση Έργων Τέχνης"]),
    sp("arts-interior","Εφαρμοσμένων Τεχνών","Σχεδιασμού – Διακόσμησης Εσωτερικών Χώρων",SRC.arts,["Ιστορία Σύγχρονης Τέχνης","Τεχνολογία Υλικών","Ελεύθερο Σχέδιο – Χρώμα","Ψηφιακή Σχεδίαση","Διακόσμηση Εσωτερικών Χώρων","Διακοσμητική Σύνθεση – Τρισδιάστατη Μακέτα"]),
    sp("arts-fashion","Εφαρμοσμένων Τεχνών","Σχεδίασης και Παραγωγής Ενδύματος",SRC.arts,["Ιστορία Σύγχρονης Τέχνης","Τεχνολογία Υλικών","Τεχνολογία Προτύπων Κοπής (Πατρόν)","Ηλεκτρονική Σχεδίαση Βιομηχανικού Προϊόντος","Τεχνολογία Υφάσματος και Οργάνωση Συλλογής Ενδύματος","Ποιοτικός Έλεγχος Υφάσματος","Τεχνολογία Παραγωγή Ενδυμάτων"]),
    sp("arts-wood","Εφαρμοσμένων Τεχνών","Επιπλοποιίας – Ξυλογλυπτική",SRC.arts,["Ιστορία Σύγχρονης Τέχνης","Τεχνολογία Υλικών","Ξύλινες Κατασκευές","Συνδεσμολογία Επίπλου – Ξυλογλυπτική","Τεχνολογία Ξύλου – Μετρήσεις","Γραμμικό Σχέδιο","Ελεύθερο Σχέδιο"]),

    sp("health-nursing","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Νοσηλευτή",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Νοσηλευτική II","Στοιχεία Παθολογίας","Χειρουργική – Τεχνική Χειρουργείου","Στοιχεία Μαιευτικής-Γυναικολογίας"]),
    sp("health-labs","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Ιατρικών – Βιολογικών Εργαστηρίων",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Μικροβιολογία ΙΙ","Αιματολογία","Κλινική Βιοχημεία","Ανοσολογία"]),
    sp("health-childcare","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Βρεφονηπιοκόμων",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Παιδαγωγικό Περιβάλλον Βρεφονηπιακού Σταθμού","Αγωγή Βρέφους & Νηπίου","Στοιχεία Γενικής και Εξελικτικής Ψυχολογίας","Δημιουργική Απασχόληση στην Προσχολική Ηλικία ΙΙ","Μουσικοκινητική Αγωγή","Λογοτεχνία Προσχολικής Ηλικίας"]),
    sp("health-physio","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Φυσικοθεραπευτή",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Κινησιολογία","Φυσικοθεραπεία","Πρακτική Φυσικοθεραπεία","Μάλαξη","Φυσικά Μέσα και Εφαρμογή τους"]),
    sp("health-dental","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Οδοντοτεχνίτη",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Οργάνωση – Εξοπλισμός- Υλικά Οδοντοτεχνικού Εργαστηρίου","Οδοντοτεχνία ΙΙ","Ακίνητη Προσθετική","Ακίνητη Προσθετική και Πορσελάνη","Στοιχεία Ορθοδοντικής"]),
    sp("health-radiology","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Ακτινολογικών Εργαστηρίων",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Ακτινοπροστασία","Νεώτερες Απεικονιστικές Μέθοδοι","Ακτινοτεχνολογία ΙΙ","Ακτινοανατομική","Δεοντολογία Επαγγέλματος"]),
    sp("health-pharmacy","Υγείας - Πρόνοιας - Ευεξίας","Βοηθός Φαρμακείου",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Συνταγολογία – Νομοθεσία – Βιβλία Φαρμακείου","Φαρμακευτική Τεχνολογία ΙΙ","Κοσμητολογία","Στοιχεία Φαρμακογνωσίας","Φαρμακολογία-Τοξικολογία"]),
    sp("health-aesthetics","Υγείας - Πρόνοιας - Ευεξίας","Αισθητικής Τέχνης",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Μακιγιάζ","SPA και Λουτροθεραπεία","Σύγχρονη Αισθητική ΙΙ","Αισθητική Άκρων-Ονυχοπλαστική","Κοσμητολογία – Τεχνολογία Υλικών"]),
    sp("health-hairdressing","Υγείας - Πρόνοιας - Ευεξίας","Κομμωτικής Τέχνης",SRC.health,["Ανατομία-Φυσιολογία ΙΙ","Υγιεινή","Υγιεινή Κόμης Τριχωτού Κεφαλής- Τοξικολογία- Δερματολογία","Εργαστήριο Τεχνικών Εργασιών","Καλλιτεχνικά Χτενίσματα","Τεχνολογία Υλικών","Βασικές Εφαρμογές Κομμωτικής ΙΙ"])
  ];

  const B_HEALTH=[
    "Ανατομία-Φυσιολογία I","Πρώτες Βοήθειες","Υγεία και Διατροφή","Διαπροσωπικές Σχέσεις","Εργασιακό Περιβάλλον Τομέα","Μικροβιολογία Ι","Νοσηλευτική Ι","Δημιουργική Απασχόληση στην Προσχολική Ηλικία I","Σύγχρονη Αισθητική Ι","Εισαγωγή στη Φυσικοθεραπεία Ι","Βασικές Εφαρμογές Κομμωτικής Ι","Οδοντοτεχνία Ι","Φαρμακευτική Τεχνολογία Ι","Ακτινοτεχνολογία Ι"
  ];

  const baseGrade=id=>window.EPAL_2026_2027_TEACHER_STRUCTURE?.grades?.[id]||[];
  const baseGeneralC=()=>baseGrade("c").filter(x=>!x.sectorGateway);
  const specialtyById=id=>SPECIALTIES.find(x=>x.id===id)||SPECIALTIES[0];

  function ensureSpecialtyField(){
    const context=document.getElementById("context"),grade=document.getElementById("grade"),subject=document.getElementById("subject");
    if(!context||!grade||!subject) return null;
    let field=document.getElementById("epalSpecialtyField");
    if(!field){
      field=document.createElement("div");field.className="field";field.id="epalSpecialtyField";field.hidden=true;
      field.innerHTML='<label for="epalSpecialty">Τομέας / ειδικότητα ΕΠΑΛ</label><select id="epalSpecialty"></select>';
      subject.closest(".field")?.insertAdjacentElement("beforebegin",field);
      field.querySelector("select").addEventListener("change",()=>window.refreshSubjects?.());
    }
    const show=context.value==="epal"&&String(grade.value).toLowerCase()==="c";
    field.hidden=!show;
    const sel=field.querySelector("select");
    if(show && sel && !sel.options.length){
      SPECIALTIES.forEach(x=>{const o=document.createElement("option");o.value=x.id;o.textContent=`${x.sector} — ${x.label}`;sel.appendChild(o);});
    }
    return sel;
  }

  function install(){
    if(!window.EPAL_2026_2027_TEACHER_STRUCTURE||typeof window.refreshSubjects!=="function") return;
    const originalRefreshSubjects=window.refreshSubjects;
    const originalRefreshUnits=window.refreshUnits;
    const originalPromptText=window.promptText;

    window.epalSubjects=function(gid){
      const id=String(gid||document.getElementById("grade")?.value||"a").toLowerCase();
      if(id==="b"){
        const keep=baseGrade("b").filter(x=>x.id!=="b-sector-health");
        const health=B_HEALTH.map((label,i)=>mk(`b-health-${i+1}`,`Υγείας - Πρόνοιας - Ευεξίας · ${label}`,SRC.health,{sector:"Υγείας - Πρόνοιας - Ευεξίας"}));
        return [...keep,...health];
      }
      if(id!=="c") return baseGrade(id).map(x=>({...x,topics:[...(x.topics||[])]}));
      const sel=ensureSpecialtyField();
      const specialty=specialtyById(sel?.value);
      const specialtySubjects=specialty.subjects.map((label,i)=>mk(`c-${specialty.id}-${i+1}`,label,specialty.sourceUrl,{sector:specialty.sector,specialty:specialty.label}));
      const remainingGateways=[
        mk("c-sector-structures","Ειδικότητα Τομέα: Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού",SRC.hub,{sectorGateway:true}),
        mk("c-sector-maritime","Ειδικότητες Τομέα: Ναυτιλιακών Επαγγελμάτων",SRC.hub,{sectorGateway:true})
      ];
      return [...baseGeneralC(),...specialtySubjects,...remainingGateways];
    };

    window.refreshSubjects=function(){ensureSpecialtyField();return originalRefreshSubjects();};
    window.refreshUnits=function(){
      const out=originalRefreshUnits();
      const ctx=document.getElementById("context"),gr=document.getElementById("grade"),sel=document.getElementById("epalSpecialty"),note=document.getElementById("curriculumNote");
      if(ctx?.value==="epal"&&gr?.value==="c"&&sel&&!document.getElementById("customUnitField")?.hidden&&note){
        const s=specialtyById(sel.value);
        note.innerHTML=`<strong>✓ Επαληθευμένη ειδικότητα και μάθημα ΕΠΑΛ 2026–27.</strong> Η λίστα προέρχεται από τις τρέχουσες οδηγίες του ΙΕΠ για τον τομέα «${s.sector}». Δεν έχει ακόμη εξαχθεί αναλυτικό κεφάλαιο για αυτό το μάθημα, οπότε γράψε τον ακριβή τίτλο της ενότητας αντί να επινοηθεί.`;
      }
      return out;
    };

    if(typeof originalPromptText==="function"){
      window.promptText=function(){
        let text=originalPromptText();
        const ctx=document.getElementById("context"),gr=document.getElementById("grade"),sel=document.getElementById("epalSpecialty");
        if(ctx?.value==="epal"&&gr?.value==="c"&&sel){
          const s=specialtyById(sel.value);
          text=text.replace(/(Τάξη:[^\n]*\n)/,`$1Τομέας ΕΠΑΛ: ${s.sector}\nΕιδικότητα ΕΠΑΛ: ${s.label}\n`);
        }
        return text;
      };
    }

    const grade=document.getElementById("grade");
    if(grade) grade.addEventListener("change",()=>setTimeout(()=>window.refreshSubjects?.(),0));
    const context=document.getElementById("context");
    if(context) context.addEventListener("change",()=>setTimeout(()=>window.refreshSubjects?.(),0));

    ensureSpecialtyField();
    if(document.getElementById("context")?.value==="epal") window.refreshSubjects();
    window.AITOOLSKIDS_EPAL_C_SPECIALTIES_2026_2027=Object.freeze({version:"1.0.0",verified:"2026-09-12",count:SPECIALTIES.length,sources:Object.freeze({...SRC})});
  }

  if(typeof document==="undefined") return;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
