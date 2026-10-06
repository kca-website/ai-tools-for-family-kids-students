"use strict";

// Γυμνάσιο: explicit AI Study topic → official ebooks.edu.gr page(s) for topics that had no exact,
// listed source. Each topic points to every page of the book that
// teaches it (a chapter topic → all of its subsections). Pages were checked against the book's
// own table of contents on 2026-10-06. Topics without a matching book section are left out on
// purpose (fail closed): Βιολογία Α΄ «Επιστήμη της Βιολογίας…» (the book has no such section),
// Φυσική Α΄ «Μέτρηση όγκου» / «Μέτρηση πυκνότητας» (not among the book's 12 chapters).
(function (root) {
  const BIO_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/";
  const BIO_BG = "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/";
  const PHYS_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2314/Fysiki_A-Gymnasiou_html-empl/";
  const GEO_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2286/Geografia_A-Gymnasiou_html-empl/";
  const CHEM_G = "https://ebooks.edu.gr/ebooks/v/html/8547/2208/Chimeia_G-Gymnasiou_html-empl/";
  const CHEM_B = "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/";
  const PHYS_G = "https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/";
  const MATH_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2748/Mathimatika_A-Gymnasiou_html-empl/";
  const MATH_B = "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/";
  const MATH_G = "https://ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/";
  const HIST_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2290/Istoria_A-Gymnasiou_html-empl/";
  const HIST_B = "https://ebooks.edu.gr/ebooks/v/html/8547/2198/Istoria_B-Gymnasiou_html-empl/";
  const HIST_G = "https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/";
  const LIT_A = "https://ebooks.edu.gr/ebooks/v/html/8547/2228/Keimena-Neoellinikis-Logotechnias_A-Gymnasiou_html-empl/";
  const LIT_G = "https://ebooks.edu.gr/ebooks/v/html/8547/2218/Keimena-Neoellinikis-Logotechnias_G-Gymnasiou_html-empl/";
  const GEO_B = "https://ebooks.edu.gr/ebooks/v/html/8547/2294/Geografia_B-Gymnasiou_html-empl/";
  const pages = (base, ...files) => files.map((f) => base + f);
  const range = (base, prefix, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${base}${prefix}${from + i}.html`);

  const SUBJECTS = Object.freeze({
    "biologia-a-gymnasiou": Object.freeze({
      "Οργάνωση της ζωής: χαρακτηριστικά οργανισμών": pages(BIO_A, "index1_1.html"),
      "Κύτταρο: η μονάδα της ζωής": pages(BIO_A, "index1_2.html"),
      "Οργάνωση πολυκύτταρων οργανισμών": pages(BIO_A, "index1_3.html"),
      "Αλληλεπιδράσεις και προσαρμογές (προαιρετικό)": pages(BIO_A, "index1_4.html"),
      "Φωτοσύνθεση": pages(BIO_A, "index2_1.html"),
      "Πρόσληψη ουσιών και πέψη": range(BIO_A, "index2_", 2, 4),
      "Μεταφορά και αποβολή ουσιών": range(BIO_A, "index3_", 1, 4),
      "Αναπνοή στους οργανισμούς και στον άνθρωπο": range(BIO_A, "index4_", 1, 4),
      "Κεφ. 1: Οργάνωση της ζωής: χαρακτηριστικά οργανισμών, κύτταρο, πολυκύτταρη οργάνωση, ταξινόμηση, προσαρμογές": range(BIO_A, "index1_", 1, 4),
      "Κεφ. 2: Πρόσληψη ουσιών και πέψη: φωτοσύνθεση, μονοκύτταροι, ζωικοί οργανισμοί, άνθρωπος": range(BIO_A, "index2_", 1, 4),
      "Κεφ. 3: Μεταφορά και αποβολή ουσιών": range(BIO_A, "index3_", 1, 4),
      "Κεφ. 4: Αναπνοή": range(BIO_A, "index4_", 1, 4),
      "Κεφ. 5: Στήριξη και κίνηση": range(BIO_A, "index5_", 1, 4),
      "Κεφ. 6: Αναπαραγωγή": range(BIO_A, "index6_", 1, 4),
      "Κεφ. 7: Ερεθιστικότητα: νευρικό σύστημα, αισθητήρια όργανα, ενδοκρινικό σύστημα": range(BIO_A, "index7_", 1, 4)
    }),
    "biologia-g-gymnasiou": Object.freeze({
      "Μόρια της ζωής": pages(BIO_BG, "index1_1.html"),
      "Κύτταρο: η μονάδα της ζωής": pages(BIO_BG, "index1_2.html"),
      "Ισορροπία και λειτουργία οικοσυστημάτων": range(BIO_BG, "index2_", 1, 3),
      "Γενετικό υλικό, γονίδια και χρωμοσώματα": pages(BIO_BG, "index5_1.html"),
      "Ροή γενετικής πληροφορίας και αλληλόμορφα": pages(BIO_BG, "index5_2.html", "index5_3.html"),
      "Κυτταρική διαίρεση και κληρονομικότητα": pages(BIO_BG, "index5_4.html", "index5_5.html"),
      "Μεταλλάξεις": pages(BIO_BG, "index5_6.html"),
      "Εξέλιξη και εξέλιξη του ανθρώπου": pages(BIO_BG, "index7_1.html", "index7_2.html"),
      "Γ΄ · 5.1 — Το γενετικό υλικό οργανώνεται σε χρωμοσώματα": pages(BIO_BG, "index5_1.html"),
      "Γ΄ · 5.5 — Κληρονομικότητα": pages(BIO_BG, "index5_5.html"),
      "Γ΄ · 7.1 — Η εξέλιξη και οι μαρτυρίες της": pages(BIO_BG, "index7_1.html"),
      // Prerequisite unit taught from the Α΄ Γυμνασίου book.
      "Α΄ · 6.1 — Αναπαραγωγή (προαπαιτούμενη βασική έννοια)": pages(BIO_A, "index6_1.html")
    }),
    "fysiki-a-gymnasiou": Object.freeze({
      "Μετρήσεις μήκους και μέση τιμή": pages(PHYS_A, "index1.html"),
      "Μετρήσεις χρόνου και ακρίβεια": pages(PHYS_A, "index2.html"),
      "Μετρήσεις μάζας και διαγράμματα": pages(PHYS_A, "index3.html"),
      "Θερμοκρασία και βαθμονόμηση": pages(PHYS_A, "index4.html"),
      "Θερμότητα, θερμοκρασία και θερμική ισορροπία": pages(PHYS_A, "index5.html"),
      "Ηλεκτρικό βραχυκύκλωμα και ασφάλεια": pages(PHYS_A, "index10.html"),
      "Από τον ηλεκτρισμό στον μαγνητισμό": pages(PHYS_A, "index11.html"),
      "Από τον μαγνητισμό στον ηλεκτρισμό": pages(PHYS_A, "index12.html")
    }),
    "chimeia-g-gymnasiou": Object.freeze({
      "Οξέα, βάσεις και κλίμακα pH": pages(CHEM_G, "index1_1.html", "index1_2.html"),
      "Εξουδετέρωση και άλατα": pages(CHEM_G, "index1_3.html", "index1_4.html"),
      "Οξέα, βάσεις και άλατα στην καθημερινή ζωή": pages(CHEM_G, "index1_5.html"),
      "Περιοδικός πίνακας: μέταλλα και αμέταλλα": pages(CHEM_G, "index2_1.html"),
      "Αλκάλια, μέταλλα, κράματα και άνθρακας": pages(CHEM_G, "index2_2.html", "index2_3.html", "index2_4.html"),
      "Υδρογονάνθρακες, καύση και καύσιμα": pages(CHEM_G, "index3_1.html"),
      "Πετρέλαιο, φυσικό αέριο και πετροχημικά": pages(CHEM_G, "index3_2.html"),
      "Πολυμερισμός και πλαστικά": pages(CHEM_G, "index3_2.html"),
      "Αιθανόλη και επίδραση στον οργανισμό": pages(CHEM_G, "index3_3.html"),
      // Prerequisites taught from the Β΄ Γυμνασίου book.
      "Β΄ · 2.6 — Χημικές ενώσεις και χημικά στοιχεία (προαπαιτούμενο)": pages(CHEM_B, "index2_6.html"),
      "Β΄ · 2.6.2 — Μείγματα και χημικές ενώσεις (προαπαιτούμενο)": pages(CHEM_B, "index2_6_2.html"),
      "Β΄ · 2.9 — Υποατομικά σωματίδια / δομή ατόμου (προαπαιτούμενο)": pages(CHEM_B, "index2_9.html")
    }),
    "fysiki-g-gymnasiou": Object.freeze({
      "Ηλεκτρική δύναμη, φορτίο και ηλεκτρικό πεδίο": pages(PHYS_G, "index1.html"),
      "Ηλεκτρικό ρεύμα και κυκλώματα": pages(PHYS_G, "index2.html"),
      "Αντίσταση, νόμος του Ohm και συνδεσμολογία": pages(PHYS_G, "index2.html"),
      "Αποτελέσματα, ενέργεια και ισχύς ηλεκτρικού ρεύματος": pages(PHYS_G, "index3.html"),
      "Ταλαντώσεις και εκκρεμές": pages(PHYS_G, "index4.html"),
      "Μηχανικά κύματα και ήχος": pages(PHYS_G, "index5.html"),
      "Φως, διάδοση και ανάκλαση": pages(PHYS_G, "index6.html", "index7.html"),
      "Διάθλαση, ανάλυση φωτός και χρώμα": pages(PHYS_G, "index8.html")
    }),
    "mathimatika-a-gymnasiou": Object.freeze({
      "Α.1.5 — Χαρακτήρες διαιρετότητας - ΜΚΔ - ΕΚΠ - Ανάλυση αριθμού σε γινόμενο πρώτων παραγόντων": pages(MATH_A, "indexA1_5.html"),
      "Α.6.2 — Λόγος δύο αριθμών - Αναλογία": pages(MATH_A, "indexA6_2.html"),
      "Α.7.2 — Απόλυτη τιμή ρητού - Αντίθετοι ρητοί - Σύγκριση ρητών": pages(MATH_A, "indexA7_2.html")
    }),
    "mathimatika-g-gymnasiou": Object.freeze({
      "Γ΄ · Α.2.1 — Η εξίσωση αx + β = 0": pages(MATH_G, "indexA2_1.html"),
      "Γ΄ · Α.1.4 — Πολλαπλασιασμός πολυωνύμων / επιμεριστική ιδιότητα": pages(MATH_G, "indexA1_4.html"),
      "Β΄ · Β.1.4 — Πυθαγόρειο θεώρημα (προαπαιτούμενη γνώση που εξετάζει ο διαγνωστικός στόχος)": pages(MATH_B, "indexB1_4.html"),
      "Πρόσημο πλην": pages(MATH_G, "indexA2_1.html"),
      "Ισότητα ως ισορροπία": pages(MATH_G, "indexA2_1.html"),
      "Επιμεριστική με αρνητικό": pages(MATH_G, "indexA1_4.html"),
      "Πυθαγόρειο με κάθετη πλευρά": pages(MATH_B, "indexB1_4.html")
    }),
    "istoria-a-gymnasiou": Object.freeze({
      "Κεφάλαιο 2 · 2, 3 και 5 — Κυκλαδικός, Μινωικός και Μυκηναϊκός πολιτισμός": pages(HIST_A, "index_02_02.html", "index_02_03.html", "index_02_05.html"),
      "Κεφάλαιο 4 · 5 — Αθήνα: Πορεία προς τη δημοκρατία": pages(HIST_A, "index_04_05.html"),
      "Κεφάλαιο 6 · 1 — Τα αίτια και οι αφορμές του Πελοποννησιακού Πολέμου - Ο Αρχιδάμειος Πόλεμος": pages(HIST_A, "index_06_01.html"),
      "Κεφάλαιο 7 · 4 — Το έργο του Αλεξάνδρου": pages(HIST_A, "index_07_04.html")
    }),
    "istoria-b-gymnasiou": Object.freeze({
      // The Hellenistic and Roman background is taught from the Α΄ Γυμνασίου book (chapter Θ).
      "Ελληνιστικός πολιτισμός": pages(HIST_A, "index_09_05.html", "index_09_06.html"),
      "Ρωμαϊκή κατάκτηση της Ελλάδας": pages(HIST_A, "index_09_03.html", "index_09_04.html"),
      "Μετάβαση στο Βυζάντιο": pages(HIST_B, "index1_1_1.html"),
      "Φεουδαρχία στη Δυτική Ευρώπη": pages(HIST_B, "index6_1_3.html")
    }),
    "istoria-g-gymnasiou": Object.freeze({
      "Ενότητα 5 — Ο ελληνισμός από τα μέσα του 18ου αι. έως τις αρχές του 19ου αι.": pages(HIST_G, "index2_5.html"),
      "Ενότητα 7 — Η Φιλική Εταιρεία και η κήρυξη της ελληνικής επανάστασης στις παραδουνάβιες ηγεμονίες": pages(HIST_G, "index2_7.html"),
      "Ενότητα 8 — Η εξέλιξη της ελληνικής επανάστασης (1821-1827)": pages(HIST_G, "index2_8.html"),
      "Ενότητα 9 — Πρώτες προσπάθειες των επαναστατημένων Ελλήνων για συγκρότηση κράτους": pages(HIST_G, "index2_9.html"),
      "Έναρξη της Επανάστασης": pages(HIST_G, "index2_8.html"),
      "Ενότητα κατά την Επανάσταση": pages(HIST_G, "index2_9.html"),
      "Ίδρυση Φιλικής Εταιρείας": pages(HIST_G, "index2_7.html"),
      "Εκπαίδευση επί Τουρκοκρατίας": pages(HIST_G, "index2_5.html")
    }),
    // «Η Ελλάδα μέσα στην Ευρώπη» does not match a single lesson of the book; left unmapped.
    "geografia-b-gymnasiou": Object.freeze({
      "Γεωγραφική και σχετική θέση": pages(GEO_B, "mat1_1.html", "mat1_2.html"),
      "Η θέση της Ευρώπης στον κόσμο": pages(GEO_B, "mat1_3.html"),
      "Γεωλογική ιστορία και ανάγλυφο της Ευρώπης": pages(GEO_B, "mat2_6.html", "mat2_7.html"),
      "Κλίμα, ποτάμια, λίμνες και θάλασσες της Ευρώπης": pages(GEO_B, "mat2_12.html", "mat2_19.html", "mat2_21.html"),
      "Φυσικές περιοχές και βλάστηση της Ευρώπης": pages(GEO_B, "mat2_11.html", "mat2_24.html"),
      "Κάτοικοι, πληθυσμός και πολιτισμός της Ευρώπης": pages(GEO_B, "mat3_29.html", "mat3_30.html", "mat3_32.html"),
      "Ευρωπαϊκή Ένωση και ευρωπαϊκά κράτη": pages(GEO_B, "mat3_25.html", "mat3_26.html", "mat3_27.html"),
      "Παραγωγή και οικονομία της Ευρώπης": pages(GEO_B, "mat4_37.html", "mat4_38.html", "mat4_41.html", "mat4_45.html")
    }),
    // Κείμενα Νεοελληνικής Λογοτεχνίας: every text of the official anthology (teacher's choice, as in Β΄).
    "logotechnia-a-gymnasiou": Object.freeze({
      "Γεώργιος Δροσίνης — «Θαλασσινά τραγούδια»": pages(LIT_A, "index01_01.html"),
      "Γιάννης Ρίτσος και Οδυσσέας Ελύτης — «Τζιτζίκια στήσαν το χορό», «Κάτω στης μαργαρίτας το αλωνάκι»": pages(LIT_A, "index01_02.html"),
      "Ίταλο Καλβίνο — «Μανιτάρια στην πόλη»": pages(LIT_A, "index01_03.html"),
      "Λαϊκό παραμύθι — «Το πιο γλυκό ψωμί»": pages(LIT_A, "index02_01.html"),
      "Αντώνης Μόλλας — «Η πείνα του Καραγκιόζη»": pages(LIT_A, "index02_02.html"),
      "Δημοτικό τραγούδι — «Ύπνε μου και έπάρε μου το»": pages(LIT_A, "index02_03.html"),
      "Μαρία Ιορδανίδου — «Τα φαντάσματα»": pages(LIT_A, "index02_04.html"),
      "Κοσμάς Πολίτης — «Τα τσερκένια»": pages(LIT_A, "index02_05.html"),
      "Άγγελος Σικελιανός — «Της μάνας μου»": pages(LIT_A, "index03_01.html"),
      "Εμμανουήλ Ροΐδης — «Η εορτή του πατρός μου»": pages(LIT_A, "index03_02.html"),
      "Λάμπρος Πορφύρας — «Το στερνό παραμύθι»": pages(LIT_A, "index03_03.html"),
      "Λέων Τολστόι — «Ο παππούς και το εγγονάκι»": pages(LIT_A, "index03_04.html"),
      "Ζωρζ Σαρή — «Νινέτ»": pages(LIT_A, "index03_05.html"),
      "Τούλα Τίγκα — «Τα πράγματα στρώνουν περισσότερο»": pages(LIT_A, "index03_06.html"),
      "Αλέξανδρος Παπαδιαμάντης — «Στην Παναγία τη Σαλονικιά»": pages(LIT_A, "index04_01.html"),
      "Κ.Π. Καβάφης — «Δέησις»": pages(LIT_A, "index04_02.html"),
      "Στράτης Μυριβήλης — «Η λιτανεία»": pages(LIT_A, "index04_03.html"),
      "Κάρολος Ντίκενς — «Παραμονή Χριστουγέννων»": pages(LIT_A, "index04_04.html"),
      "Παντελής Καλιότσος — «Πασχαλινή ιστορία»": pages(LIT_A, "index04_05.html"),
      "Κλέφτικο τραγούδι — «Ένας αϊτός περήφανος»": pages(LIT_A, "index05_01.html"),
      "Γιάννης Βλαχογιάννης — «Η έξοδο»": pages(LIT_A, "index05_02.html"),
      "Παντελής Πρεβελάκης — «Ο Κρητικός – Η Πολιτεία»": pages(LIT_A, "index05_03.html"),
      "Γιώργος Θεοτοκάς — «Ανήμερα της 28ης Οκτωβρίου 1940»": pages(LIT_A, "index05_04.html"),
      "Δημήτρης Ψαθάς — «Ο πιτσιρίκοι»": pages(LIT_A, "index05_05.html"),
      "Κύπρος Χρυσάνθης — «17 του Νοέμβρη 1973 (Χαράματα)»": pages(LIT_A, "index05_06.html"),
      "Κώστας Κρυστάλλης — «Ηλιοβασίλεμα»": pages(LIT_A, "index06_01.html"),
      "Νίκος Καζαντζάκης — «Η Νέα Παιδαγωγική»": pages(LIT_A, "index06_02.html"),
      "Νίκος Θέμελης — «Η αφήγηση του αρχιμάστορα»": pages(LIT_A, "index06_03.html"),
      "Ευγενία Φακίνου — «Η ζωή στη Σύμη»": pages(LIT_A, "index06_04.html"),
      "Ντίνος Δημόπουλος — «Ο Σαρλό και το αθάνατο νερό»": pages(LIT_A, "index06_05.html"),
      "Νάνος Βαλαωρίτης — «Με πλοίο»": pages(LIT_A, "index07_01.html"),
      "Κώστας Ουράνης — «Το θέλγητρο της Ανδαλουσίας»": pages(LIT_A, "index07_02.html"),
      "Τατιάνα Γκρίτση-Μιλλιέξ — «Οδοιπορικό στην Ινδία»": pages(LIT_A, "index07_03.html"),
      "Τζων Φώουλς — «Κοιτώντας την Αθήνα»": pages(LIT_A, "index07_04.html"),
      "Μιχάλης Γκανάς — «Γυάλινα Γιάννινα»": pages(LIT_A, "index07_05.html"),
      "Ιωάννης Βηλαράς — «Πουλάκι»": pages(LIT_A, "index08_01.html"),
      "Γιώργος Θεοτοκάς — «Ο Δημοτικός Κήπος του Ταξιμιού»": pages(LIT_A, "index08_02.html"),
      "Διδώ Σωτηρίου — «Ταξίδι χωρίς επιστροφή»": pages(LIT_A, "index08_03.html"),
      "Θανάσης Βαλτινός — «Η καλή μέρα απ' το πρωί φαίνεται»": pages(LIT_A, "index08_04.html"),
      "Μαρούλα Κλιάφα — «Ο δρόμος για τον Παράδεισο είναι μακρύς»": pages(LIT_A, "index08_05.html"),
      "Κωστής Παλαμάς — «Ο Ολυμπιακός ύμνος»": pages(LIT_A, "index09_01.html"),
      "Πέτρος Χάρης — «Δρόμος 100 μέτρων»": pages(LIT_A, "index09_02.html"),
      "Αγγελική Βαρελλά — «Η νίκη του Σπύρου Λούη»": pages(LIT_A, "index09_03.html"),
      "Ειρήνη Μάρρα — «Τα κόκκινα λουστρίνια»": pages(LIT_A, "index10_01.html"),
      "Δημοτικό τραγούδι — «Κόρη που λάμπει»": pages(LIT_A, "index10_02.html"),
      "Λίτσα Ψαραύτη — «Ο Κωνσταντής»": pages(LIT_A, "index10_03.html"),
      "Γιάννης Ρίτσος — «Πρωινό άστρο»": pages(LIT_A, "index10_04.html"),
      "Αργύρης Εφταλιώτης — «Αγάπης λόγια»": pages(LIT_A, "index10_05.html"),
      "Οδυσσέας Ελύτης — «Όλα τα πήρε το καλοκαίρι»": pages(LIT_A, "index10_06.html"),
      "Όσκαρ Ουάιλντ — «Ο πιστός φίλος»": pages(LIT_A, "index10_07.html"),
      "Μιμίκα Κρανάκη — «Ένα τόπι χρωματιστό»": pages(LIT_A, "index10_08.html"),
      "Λαϊκό παραμύθι — «Ο φτωχός και τα γρόσια»": pages(LIT_A, "index11_01.html"),
      "Τέλλος Άγρας & Νικηφόρος Βρετάκος — «Το ξανθό παιδί», «Το παιδί με τα σπίρτα»": pages(LIT_A, "index11_02.html"),
      "Άντον Τσέχωφ — «Ο Βάνκας»": pages(LIT_A, "index11_03.html"),
      "Μαρία Πυλιώτου — «Λεώνη»": pages(LIT_A, "index11_04.html"),
      "Αντώνης Σαμαράκης — «Γραφείον ιδεών»": pages(LIT_A, "index12_01.html"),
      "Λουίς Σεπούλβεδα — «Το μαύρο κύμα»": pages(LIT_A, "index12_02.html"),
      "Κρίτων Αθανασούλης — «Παράπονο σκύλου»": pages(LIT_A, "index12_03.html"),
      "Ελένη Σαραντίτη — «Όπως τα βλέπει κανείς…»": pages(LIT_A, "index12_04.html"),
      "Ανδρέας Καρκαβίτσας — «Το μνήμα της μάνας»": pages(LIT_A, "index13_01.html"),
      "Γρηγόριος Ξενόπουλος — «Η γάτα του παπά»": pages(LIT_A, "index13_02.html"),
      "Ηλίας Βενέζης — «Η Δάφνη»": pages(LIT_A, "index13_03.html"),
      "Λιλή Ζωγράφου — «Στρίγκλα και καλλονή»": pages(LIT_A, "index13_04.html"),
      "Γιώργος Σκαμπαρδώνης — «Η Βαγγελιώ-δεν-είσαι-εντάξει»": pages(LIT_A, "index13_05.html"),
      "Τζακ Λόντον — «Ο αδάμαστος»": pages(LIT_A, "index13_06.html")
    }),
    // Κείμενα Νεοελληνικής Λογοτεχνίας: every text of the official anthology (teacher's choice, as in Β΄).
    "logotechnia-g-gymnasiou": Object.freeze({
      "Δημοτικά Νανουρίσματα — «Να μου το πάρεις ύπνε μου», «Κοιμήσου αστρί»": pages(LIT_G, "index01_01.html"),
      "Δημοτικό τραγούδι — «Της Πάργας»": pages(LIT_G, "index01_02.html"),
      "Δημοτικό τραγούδι — «Του γιοφυριού της Άρτας»": pages(LIT_G, "index01_03.html"),
      "Γεώργιος Χορτάτσης — «Ερωφίλη»": pages(LIT_G, "index02_01.html"),
      "Βιτσέντσος Κορνάρος — «Ερωτόκριτος»": pages(LIT_G, "index02_02.html"),
      "Μαρίνος Τζάνε Μπουνιαλής — «Κρητικός Πόλεμος»": pages(LIT_G, "index02_03.html"),
      "Ρήγας Βελεστινλής — «Θούριος»": pages(LIT_G, "index03_01.html"),
      "Αθανάσιος Χριστόπουλος — «Τώρα»": pages(LIT_G, "index03_02.html"),
      "Ανώνυμος — «Ο Ρωσσαγγλογάλλος»": pages(LIT_G, "index03_03.html"),
      "Αδαμάντιος Κοραής — «Ο Παπατρέχας»": pages(LIT_G, "index03_04.html"),
      "Λόρδος Μπάυρον — «Το προσκύνημα του Τσάιλντ Χάρολντ»": pages(LIT_G, "index03_05.html"),
      "Γιάννης Μακρυγιάννης — «Απομνημονεύματα»": pages(LIT_G, "index04_01.html"),
      "Ελισάβετ Μουτζάν-Μαρτινέγκου — «Αυτοβιογραφία»": pages(LIT_G, "index04_02.html"),
      "Παναγής Σκουζές — «Ο βίος μου»": pages(LIT_G, "index04_03.html"),
      "Ανδρέας Κάλβος — «Εις Πάργαν»": pages(LIT_G, "index05_01.html"),
      "Διονύσιος Σολωμός — «Ελεύθεροι Πολιορκημένοι»": pages(LIT_G, "index05_02.html"),
      "Αριστοτέλης Βαλαωρίτης — «Ο Δήμος και το καριοφίλι του»": pages(LIT_G, "index05_03.html"),
      "Ανδρέας Λασκαράτος — «Ο κακός μαθητής»": pages(LIT_G, "index05_04.html"),
      "Λορέντζος Μαβίλης — «Λήθη»": pages(LIT_G, "index05_05.html"),
      "Αλέξανδρος Σούτσος — «Ο επιστάτης των εθνικών οικοδομών επί Ι. Καποδίστρια»": pages(LIT_G, "index06_01.html"),
      "Σπυρίδων Βασιλειάδης — «Η χαρά»": pages(LIT_G, "index06_02.html"),
      "Σάμιουελ Τ. Κόλεριτζ — «Δουλειά χωρίς ελπίδα»": pages(LIT_G, "index06_03.html"),
      "Γρηγόριος Παλαιολόγος — «Ο ζωγράφος»": pages(LIT_G, "index06_04.html"),
      "Εμμανουήλ Ροΐδης — «Τα υαλοπωλεία»": pages(LIT_G, "index06_05.html"),
      "Γεώργιος Βιζυηνός — «Στο χαρέμι»": pages(LIT_G, "index07_01.html"),
      "Αλέξανδρος Παπαδιαμάντης — «Τ' αγνάντεμα»": pages(LIT_G, "index07_02.html"),
      "Άντον Τσέχωφ — «Ο Παχύς και ο Αδύνατος»": pages(LIT_G, "index07_03.html"),
      "Ανδρέας Καρκαβίτσας — «Ο Ζητιάνος»": pages(LIT_G, "index07_04.html"),
      "Κωστής Παλαμάς — «Ίαμβοι και ανάπαιστοι»": pages(LIT_G, "index07_05.html"),
      "Κωστής Παλαμάς — «Ύμνος στον Παρθενώνα»": pages(LIT_G, "index07_06.html"),
      "Κ.Π. Καβάφης — «Φωνές»": pages(LIT_G, "index07_07.html"),
      "Κ.Π. Καβάφης — «Όσο μπορείς»": pages(LIT_G, "index07_08.html"),
      "Κ.Π. Καβάφης — «Στα 200 π.Χ.»": pages(LIT_G, "index07_09.html"),
      "Γρηγόριος Ξενόπουλος — «Ο τύπος και η ουσία»": pages(LIT_G, "index07_10.html"),
      "Κωνσταντίνος Θεοτόκης — «Η τέχνη του αγιογράφου»": pages(LIT_G, "index07_11.html"),
      "Πηνελόπη Δέλτα — «Πρώτες ενθυμήσεις»": pages(LIT_G, "index07_12.html"),
      "Άγγελος Σικελιανός — «Γιατί βαθιά μου δόξασα»": pages(LIT_G, "index07_13.html"),
      "Κώστας Βάρναλης — «Ορέστης»": pages(LIT_G, "index07_14.html"),
      "Ναπολέων Λαπαθιώτης — «Νυχτερινό»": pages(LIT_G, "index07_15.html"),
      "Κ.Γ. Καρυωτάκης — «Σαν δέσμη από τριαντάφυλλα, Βράδυ»": pages(LIT_G, "index08_01.html"),
      "Μαρία Πολυδούρη — «Γιατί μ' αγάπησες»": pages(LIT_G, "index08_02.html"),
      "Γιάννης Σκαρίμπας — «Ουλαλούμ»": pages(LIT_G, "index08_03.html"),
      "Ζυλ Λαφόργκ — «Μοιρολόι φεγγαριού στην επαρχία»": pages(LIT_G, "index08_04.html"),
      "Άγγελος Τερζάκης — «Ο ματωμένος λυρισμός»": pages(LIT_G, "index08_05.html"),
      "Στράτης Μυριβήλης — «Τα ζα»": pages(LIT_G, "index08_06.html"),
      "Νίκος Καζαντζάκης — «Βίος και Πολιτεία του Αλέξη Ζορμπά»": pages(LIT_G, "index08_07.html"),
      "Γιώργος Σεφέρης — «Με τον τρόπο του Γ.Σ.»": pages(LIT_G, "index08_08.html"),
      "Γιώργος Σεφέρης — «Τρία χαϊκού»": pages(LIT_G, "index08_09.html"),
      "Γιώργος Σεφέρης — «Ομιλία στη Στοκχόλμη»": pages(LIT_G, "index08_10.html"),
      "Ανδρέας Εμπειρίκος — «Τριαντάφυλλα στο παράθυρο»": pages(LIT_G, "index08_11.html"),
      "Νίκος Εγγονόπουλος — «Μπολιβάρ»": pages(LIT_G, "index08_12.html"),
      "Οδυσσέας Ελύτης — «Το Άξιον Εστί. Η Γένεσις. Τα Πάθη, Ε΄»": pages(LIT_G, "index08_13.html"),
      "Οδυσσέας Ελύτης — «Δώρο ασημένιο ποίημα»": pages(LIT_G, "index08_14.html"),
      "Γιάννης Ρίτσος — «Αρχαίο θέατρο»": pages(LIT_G, "index08_15.html"),
      "Γιάννης Ρίτσος — «Ρωμιοσύνη»": pages(LIT_G, "index08_16.html"),
      "Νίκος Καββαδίας — «Kuro Siwo»": pages(LIT_G, "index08_17.html"),
      "Φραντς Κάφκα — «Ποσειδώνας»": pages(LIT_G, "index08_18.html"),
      "Γιώργος Θεοτοκάς — «Η διαδήλωση»": pages(LIT_G, "index08_19.html"),
      "Μ. Καραγάτσης — «Ένας Ρώσος συνταγματάρχης στη Λάρισα»": pages(LIT_G, "index08_20.html"),
      "Κοσμάς Πολίτης — «Η γνωριμία με τη Μόνικα»": pages(LIT_G, "index08_21.html"),
      "Μέλπω Αξιώτη — «Η ψυχή του νησιού»": pages(LIT_G, "index08_22.html"),
      "Μίλτος Σαχτούρης — «Τα δώρα»": pages(LIT_G, "index09_01.html"),
      "Μανόλης Αναγνωστάκης — «Στο παιδί μου»": pages(LIT_G, "index09_02.html"),
      "Κική Δημουλά — «Τα πάθη της βροχής»": pages(LIT_G, "index09_03.html"),
      "Τζένη Μαστοράκη — «Οι μεγάλοι»": pages(LIT_G, "index09_04.html"),
      "Δημήτρης Χατζής — «Η τελευταία αρκούδα του Πίνδου»": pages(LIT_G, "index09_05.html"),
      "Αντώνης Σαμαράκης — «Ζητείται ελπίς»": pages(LIT_G, "index09_06.html"),
      "Κώστας Ταχτσής — «Κι έχουμε πόλεμο!»": pages(LIT_G, "index09_07.html"),
      "Ρέα Γαλανάκη — «Η μεταμφίεση»": pages(LIT_G, "index09_08.html")
    }),
    "geografia-a-gymnasiou": Object.freeze({
      "Χάρτες: είδη, υπόμνημα και κλίμακα": pages(GEO_A, "matA1_3.html", "matA1_4.html", "matA1_5.html"),
      "Γεωγραφικές συντεταγμένες και προσανατολισμός": pages(GEO_A, "matA1_1.html", "matA1_2.html"),
      "Η Γη στο ηλιακό σύστημα": pages(GEO_A, "matB1_1.html"),
      "Λιθόσφαιρα: ανάγλυφο και τεκτονικές πλάκες": pages(GEO_A, "matB4_2.html", "matB4_3.html", "matB4_4.html"),
      "Υδρόσφαιρα: ωκεανοί, θάλασσες και ποτάμια": pages(GEO_A, "matB3_1.html", "matB3_2.html", "matB3_4.html"),
      "Ατμόσφαιρα, καιρός και κλίμα": pages(GEO_A, "matB2_1.html", "matB2_2.html"),
      "Βιόσφαιρα και φυσικά οικοσυστήματα": pages(GEO_A, "matB5_1.html"),
      "Ανθρωπογενές περιβάλλον: πληθυσμός και οικισμοί": pages(GEO_A, "matC1_1.html", "matC1_2.html", "matC1_4.html", "matC1_5.html"),
      "Ήπειροι: συνθετική εργασία (προαιρετική εμβάθυνση)": range(GEO_A, "matD", 1, 7).map((u) => u.replace(/\.html$/, "_0.html"))
    })
  });

  // PDF-only books: [label, first PDF page, last PDF page, heading printed on the first page].
  // Θρησκευτικά Γυμνασίου: no 2026–27 IEP restriction is published for the course, so every
  // thematic unit of the current official book is in scope.
  const PDF_SUBJECTS = Object.freeze({
    "thriskeftika-a-gymnasiou": Object.freeze({
      title: "Θρησκευτικά Α΄ Γυμνασίου — Ένα ταξίδι ζωής: Η συνάντηση Θεού και ανθρώπου μέσα από τις βιβλικές διηγήσεις",
      viewUrl: "https://ebooks.edu.gr/ebooks/v/pdf/8547/5229/21-0201-01_V3_Thriskeutika_A-Gymnasiou_Vivlio-Mathiti/",
      downloadUrl: "https://ebooks.edu.gr/ebooks/d/8547/5229/21-0201-01_V3_Thriskeutika_A-Gymnasiou_Vivlio-Mathiti.pdf",
      units: Object.freeze([
        ["Α΄ Θεματική Ενότητα — Η Αγία Γραφή: Η συνάντηση Θεού και ανθρώπου καταγράφεται σε κείμενα", 7, 22, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Αγία Γραφή: Η συνάντηση"],
        ["Β΄ Θεματική Ενότητα — Θεός και άνθρωπος στην Ορθόδοξη Παράδοση: μια σχέση ζωής", 23, 40, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Θεός και άνθρωπος στην Ορθόδοξη"],
        ["Γ΄ Θεματική Ενότητα — Πού είναι ο Θεός; Η σχέση ζωής περνάει μέσα από δοκιμασίες", 41, 56, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Πού είναι ο Θεός; Η"],
        ["Δ΄ Θεματική Ενότητα — Ο Θεός γίνεται άνθρωπος: Το πιο συγκλονιστικό γεγονός της ιστορίας του ανθρώπου", 57, 93, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ο Θεός γίνεται άνθρωπος: Το"],
        ["Ε΄ Θεματική Ενότητα — Ένας καινούριος κόσμος ξεπροβάλλει: Χριστός ανέστη!", 94, 113, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ένας καινούριος κόσμος ξεπροβάλλει: Χριστός"],
        ["ΣΤ΄ Θεματική Ενότητα — Η Εκκλησία μεταμορφώνει τον κόσμο", 114, 132, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ H Εκκλησία μεταμορφώνει τον κόσμο"],
        ["Ζ΄ Θεματική Ενότητα — Η Εκκλησία ως κιβωτός σ’ ένα ταξίδι χωρίς τέλος", 133, 152, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Εκκλησία ως κιβωτός σ’"]
      ])
    }),
    "thriskeftika-g-gymnasiou": Object.freeze({
      title: "Θρησκευτικά Γ΄ Γυμνασίου — Η μαρτυρία της Ορθόδοξης Εκκλησίας στον σύγχρονο κόσμο",
      viewUrl: "https://ebooks.edu.gr/ebooks/v/pdf/8547/5231/21-0221-01_V1_Thriskeutika_G-Gymnasiou_Vivlio-Mathiti/",
      downloadUrl: "https://ebooks.edu.gr/ebooks/d/8547/5231/21-0221-01_V1_Thriskeutika_G-Gymnasiou_Vivlio-Mathiti.pdf",
      units: Object.freeze([
        ["Α΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σήμερα", 6, 11, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Ορθόδοξη Εκκλησία σήμερα"],
        ["Β΄ Θεματική Ενότητα — Η πρόταση ζωής της Ορθόδοξης Εκκλησίας", 12, 30, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η πρόταση ζωής της Ορθόδοξης"],
        ["Γ΄ Θεματική Ενότητα — Ιεραποστολή και Διακονία: Η ζωή της Ορθόδοξης Εκκλησίας αγκαλιάζει τον κόσμο ολάκερο!", 31, 34, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ιεραποστολή και Διακονία: Η ζωή"],
        ["Δ΄ Θεματική Ενότητα — Ο σεβασμός του άλλου στην Ορθόδοξη παράδοση", 35, 41, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Ο σεβασμός του άλλου στην"],
        ["Ε΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σε διάλογο με τον δυτικό Χριστιανισμό", 42, 63, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Η Ορθόδοξη Εκκλησία σε διάλογο"],
        ["ΣΤ΄ Θεματική Ενότητα — Μονοθεϊστικές θρησκείες: Ιουδαϊσμός και Ισλάμ", 64, 78, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Μονοθεϊστικές θρησκείες: Ιουδαϊσμός και Ισλάμ"],
        ["Ζ΄ Θεματική Ενότητα — Θρησκείες της Ανατολής", 79, 94, "ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ Θρησκείες της Ανατολής"]
      ])
    })
  });
  const PDF_MAX_SPAN = 40;

  const fold = (value) => String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

  // API-side subject ids that differ from the AI Study id.
  const ALIASES = Object.freeze({ "geologia-geografia-b-gymnasiou": "geografia-b-gymnasiou" });

  function urlsFor(subjectId, topic) {
    const id = String(subjectId || "");
    const table = SUBJECTS[id] || SUBJECTS[ALIASES[id]];
    if (!table) return [];
    const key = Object.keys(table).find((label) => fold(label) === fold(topic));
    return key ? table[key].slice() : [];
  }

  function pdfFor(subjectId, topic) {
    const book = PDF_SUBJECTS[String(subjectId || "")];
    if (!book) return null;
    const unit = book.units.find(([label]) => fold(label) === fold(topic));
    if (!unit) return null;
    const [label, pdfPage, pdfPageEnd, heading] = unit;
    return { subjectId, label, pdfPage, pdfPageEnd, heading, title: book.title, viewUrl: book.viewUrl, downloadUrl: book.downloadUrl };
  }

  const api = Object.freeze({
    schoolYear: "2026-2027",
    subjects: SUBJECTS,
    pdfSubjects: PDF_SUBJECTS,
    pdfMaxSpan: PDF_MAX_SPAN,
    urlsFor,
    pdfFor,
    labels: (subjectId) => SUBJECTS[subjectId] ? Object.keys(SUBJECTS[subjectId]) : (PDF_SUBJECTS[subjectId]?.units || []).map(([label]) => label)
  });
  if (root) root.AITOOLSKIDS_GYMNASIUM_BOOK_SECTIONS = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
