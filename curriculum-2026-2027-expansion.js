/**
 * curriculum-2026-2027-expansion.js
 * ------------------------------------------------------------
 * Tutor-first curriculum expansion (2026-08-30).
 *
 * Middle-school science, geography, technology and religious-studies
 * topics are mapped to the annual 2026-27 Ministry/IEP instructions
 * published through the Directorate of Secondary Education of Heraklion.
 * High-school additions use the latest complete IEP annual-instructions
 * collection currently available (2025-26) and are explicitly marked as
 * prior-year reference material, never as verified 2026-27 scope.
 *
 * This file is loaded after quiz-data.js and learning-paths-data.js, so it
 * can safely add diagnostics without rewriting the large generated files.
 * ------------------------------------------------------------
 */
(function () {
  "use strict";

  const MIDDLE_INDEX = "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/";
  const HIGH_REFERENCE = "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/";

  function topics(subjectId, rows) {
    return rows.map((row, index) => ({
      id: `${subjectId}.topic-${index + 1}`,
      labelEl: row[0],
      labelEn: row[1],
      explainEl: row[2] || `Εστίαση στην κατανόηση της ενότητας «${row[0]}» με βάση το σχολικό βιβλίο και τη φετινή οδηγία.`,
      explainEn: row[3] || `Focus on understanding “${row[1]}” using the school textbook and the annual teaching guidance.`,
      optional: row[4] === true,
    }));
  }

  function verifiedSubject({ id, grade, labelEl, labelEn, rows, sourceLabelEl }) {
    const list = topics(id, rows);
    return {
      id, grade, subjectLabelEl: labelEl, subjectLabelEn: labelEn,
      topics: list,
      curriculum: {
        schoolYear: "2026-2027",
        coverageStatus: "annual-guidance-detailed-map",
        coverageLabelEl: "Αναλυτικός χάρτης επίσημων οδηγιών 2026–27",
        coverageLabelEn: "Detailed map of official 2026–27 guidance",
        officialSectionsEl: [],
        officialSectionsEn: [],
        mappedTopicsEl: list.map((x) => x.labelEl),
        mappedTopicsEn: list.map((x) => x.labelEn),
        scopeNoteEl: "Οι επιλογές είναι τεκμηριωμένος αναλυτικός χάρτης των επίσημων οδηγιών 2026–27, όχι κατ’ ανάγκη αυτούσιοι τίτλοι κεφαλαίων ή πλήρης εξεταστέα ύλη.",
        scopeNoteEn: "These choices are a documented navigation map of the official 2026–27 guidance, not necessarily verbatim chapter titles or a complete examinable syllabus.",
        annualInstructionsStatus: "2026-27-guidance-published",
        annualInstructionsUrl: MIDDLE_INDEX,
        catalogUrl: MIDDLE_INDEX,
        sourceLabelEl,
        sourceLabelEn: `${labelEn} teaching guidance 2026–27`,
        verificationDate: "2026-09-23",
      },
    };
  }

  function referenceSubject({ id, grade, labelEl, labelEn, rows }) {
    const list = topics(id, rows);
    return {
      id, grade, subjectLabelEl: labelEl, subjectLabelEn: labelEn,
      topics: list,
      curriculum: {
        schoolYear: "2026-2027",
        coverageStatus: "official-current-year-reference",
        coverageLabelEl: "Επίσημες οδηγίες 2026–27 δημοσιευμένες · εκκρεμεί ακριβής χαρτογράφηση",
        coverageLabelEn: "Official 2026–27 guidance published · exact mapping pending",
        officialSectionsEl: [],
        officialSectionsEn: [],
        scopeNoteEl: "Οι επίσημες οδηγίες ΓΕΛ 2026–27 έχουν δημοσιευτεί. Τα υπάρχοντα θέματα του site παραμένουν μόνο άγκυρες πλοήγησης μέχρι να ελεγχθούν ένα προς ένα απέναντι στην τρέχουσα οδηγία· δεν παρουσιάζονται ως αυτούσια φετινή διδακτέα ή εξεταστέα ύλη.",
        scopeNoteEn: "Official 2026–27 GEL guidance has been published. Existing site topics remain navigation anchors until checked one by one against the current guidance; they are not presented as the exact taught or examinable scope.",
        annualInstructionsStatus: "2026-27-guidance-published",
        annualInstructionsUrl: HIGH_REFERENCE,
        catalogUrl: HIGH_REFERENCE,
        sourceLabelEl: "ΙΕΠ · Οδηγίες Γενικού Λυκείου 2026–27",
        sourceLabelEn: "IEP · General Lyceum guidance 2026–27",
        verificationDate: "2026-09-23",
      },
    };
  }

  const middle = {
    a: [
      verifiedSubject({
        id: "logotechnia-a-gymnasiou", grade: "a", labelEl: "Κείμενα Νεοελληνικής Λογοτεχνίας, Α' Γυμνασίου", labelEn: "Modern Greek Literature Texts, 7th Grade",
        sourceLabelEl: "Κείμενα του επίσημου ανθολογίου (ελεύθερη επιλογή του εκπαιδευτικού)",
        rows: [
          ["Γεώργιος Δροσίνης — «Θαλασσινά τραγούδια»", "Γεώργιος Δροσίνης — «Θαλασσινά τραγούδια»"],
          ["Γιάννης Ρίτσος και Οδυσσέας Ελύτης — «Τζιτζίκια στήσαν το χορό», «Κάτω στης μαργαρίτας το αλωνάκι»", "Γιάννης Ρίτσος και Οδυσσέας Ελύτης — «Τζιτζίκια στήσαν το χορό», «Κάτω στης μαργαρίτας το αλωνάκι»"],
          ["Ίταλο Καλβίνο — «Μανιτάρια στην πόλη»", "Ίταλο Καλβίνο — «Μανιτάρια στην πόλη»"],
          ["Λαϊκό παραμύθι — «Το πιο γλυκό ψωμί»", "Λαϊκό παραμύθι — «Το πιο γλυκό ψωμί»"],
          ["Αντώνης Μόλλας — «Η πείνα του Καραγκιόζη»", "Αντώνης Μόλλας — «Η πείνα του Καραγκιόζη»"],
          ["Δημοτικό τραγούδι — «Ύπνε μου και έπάρε μου το»", "Δημοτικό τραγούδι — «Ύπνε μου και έπάρε μου το»"],
          ["Μαρία Ιορδανίδου — «Τα φαντάσματα»", "Μαρία Ιορδανίδου — «Τα φαντάσματα»"],
          ["Κοσμάς Πολίτης — «Τα τσερκένια»", "Κοσμάς Πολίτης — «Τα τσερκένια»"],
          ["Άγγελος Σικελιανός — «Της μάνας μου»", "Άγγελος Σικελιανός — «Της μάνας μου»"],
          ["Εμμανουήλ Ροΐδης — «Η εορτή του πατρός μου»", "Εμμανουήλ Ροΐδης — «Η εορτή του πατρός μου»"],
          ["Λάμπρος Πορφύρας — «Το στερνό παραμύθι»", "Λάμπρος Πορφύρας — «Το στερνό παραμύθι»"],
          ["Λέων Τολστόι — «Ο παππούς και το εγγονάκι»", "Λέων Τολστόι — «Ο παππούς και το εγγονάκι»"],
          ["Ζωρζ Σαρή — «Νινέτ»", "Ζωρζ Σαρή — «Νινέτ»"],
          ["Τούλα Τίγκα — «Τα πράγματα στρώνουν περισσότερο»", "Τούλα Τίγκα — «Τα πράγματα στρώνουν περισσότερο»"],
          ["Αλέξανδρος Παπαδιαμάντης — «Στην Παναγία τη Σαλονικιά»", "Αλέξανδρος Παπαδιαμάντης — «Στην Παναγία τη Σαλονικιά»"],
          ["Κ.Π. Καβάφης — «Δέησις»", "Κ.Π. Καβάφης — «Δέησις»"],
          ["Στράτης Μυριβήλης — «Η λιτανεία»", "Στράτης Μυριβήλης — «Η λιτανεία»"],
          ["Κάρολος Ντίκενς — «Παραμονή Χριστουγέννων»", "Κάρολος Ντίκενς — «Παραμονή Χριστουγέννων»"],
          ["Παντελής Καλιότσος — «Πασχαλινή ιστορία»", "Παντελής Καλιότσος — «Πασχαλινή ιστορία»"],
          ["Κλέφτικο τραγούδι — «Ένας αϊτός περήφανος»", "Κλέφτικο τραγούδι — «Ένας αϊτός περήφανος»"],
          ["Γιάννης Βλαχογιάννης — «Η έξοδο»", "Γιάννης Βλαχογιάννης — «Η έξοδο»"],
          ["Παντελής Πρεβελάκης — «Ο Κρητικός – Η Πολιτεία»", "Παντελής Πρεβελάκης — «Ο Κρητικός – Η Πολιτεία»"],
          ["Γιώργος Θεοτοκάς — «Ανήμερα της 28ης Οκτωβρίου 1940»", "Γιώργος Θεοτοκάς — «Ανήμερα της 28ης Οκτωβρίου 1940»"],
          ["Δημήτρης Ψαθάς — «Ο πιτσιρίκοι»", "Δημήτρης Ψαθάς — «Ο πιτσιρίκοι»"],
          ["Κύπρος Χρυσάνθης — «17 του Νοέμβρη 1973 (Χαράματα)»", "Κύπρος Χρυσάνθης — «17 του Νοέμβρη 1973 (Χαράματα)»"],
          ["Κώστας Κρυστάλλης — «Ηλιοβασίλεμα»", "Κώστας Κρυστάλλης — «Ηλιοβασίλεμα»"],
          ["Νίκος Καζαντζάκης — «Η Νέα Παιδαγωγική»", "Νίκος Καζαντζάκης — «Η Νέα Παιδαγωγική»"],
          ["Νίκος Θέμελης — «Η αφήγηση του αρχιμάστορα»", "Νίκος Θέμελης — «Η αφήγηση του αρχιμάστορα»"],
          ["Ευγενία Φακίνου — «Η ζωή στη Σύμη»", "Ευγενία Φακίνου — «Η ζωή στη Σύμη»"],
          ["Ντίνος Δημόπουλος — «Ο Σαρλό και το αθάνατο νερό»", "Ντίνος Δημόπουλος — «Ο Σαρλό και το αθάνατο νερό»"],
          ["Νάνος Βαλαωρίτης — «Με πλοίο»", "Νάνος Βαλαωρίτης — «Με πλοίο»"],
          ["Κώστας Ουράνης — «Το θέλγητρο της Ανδαλουσίας»", "Κώστας Ουράνης — «Το θέλγητρο της Ανδαλουσίας»"],
          ["Τατιάνα Γκρίτση-Μιλλιέξ — «Οδοιπορικό στην Ινδία»", "Τατιάνα Γκρίτση-Μιλλιέξ — «Οδοιπορικό στην Ινδία»"],
          ["Τζων Φώουλς — «Κοιτώντας την Αθήνα»", "Τζων Φώουλς — «Κοιτώντας την Αθήνα»"],
          ["Μιχάλης Γκανάς — «Γυάλινα Γιάννινα»", "Μιχάλης Γκανάς — «Γυάλινα Γιάννινα»"],
          ["Ιωάννης Βηλαράς — «Πουλάκι»", "Ιωάννης Βηλαράς — «Πουλάκι»"],
          ["Γιώργος Θεοτοκάς — «Ο Δημοτικός Κήπος του Ταξιμιού»", "Γιώργος Θεοτοκάς — «Ο Δημοτικός Κήπος του Ταξιμιού»"],
          ["Διδώ Σωτηρίου — «Ταξίδι χωρίς επιστροφή»", "Διδώ Σωτηρίου — «Ταξίδι χωρίς επιστροφή»"],
          ["Θανάσης Βαλτινός — «Η καλή μέρα απ' το πρωί φαίνεται»", "Θανάσης Βαλτινός — «Η καλή μέρα απ' το πρωί φαίνεται»"],
          ["Μαρούλα Κλιάφα — «Ο δρόμος για τον Παράδεισο είναι μακρύς»", "Μαρούλα Κλιάφα — «Ο δρόμος για τον Παράδεισο είναι μακρύς»"],
          ["Κωστής Παλαμάς — «Ο Ολυμπιακός ύμνος»", "Κωστής Παλαμάς — «Ο Ολυμπιακός ύμνος»"],
          ["Πέτρος Χάρης — «Δρόμος 100 μέτρων»", "Πέτρος Χάρης — «Δρόμος 100 μέτρων»"],
          ["Αγγελική Βαρελλά — «Η νίκη του Σπύρου Λούη»", "Αγγελική Βαρελλά — «Η νίκη του Σπύρου Λούη»"],
          ["Ειρήνη Μάρρα — «Τα κόκκινα λουστρίνια»", "Ειρήνη Μάρρα — «Τα κόκκινα λουστρίνια»"],
          ["Δημοτικό τραγούδι — «Κόρη που λάμπει»", "Δημοτικό τραγούδι — «Κόρη που λάμπει»"],
          ["Λίτσα Ψαραύτη — «Ο Κωνσταντής»", "Λίτσα Ψαραύτη — «Ο Κωνσταντής»"],
          ["Γιάννης Ρίτσος — «Πρωινό άστρο»", "Γιάννης Ρίτσος — «Πρωινό άστρο»"],
          ["Αργύρης Εφταλιώτης — «Αγάπης λόγια»", "Αργύρης Εφταλιώτης — «Αγάπης λόγια»"],
          ["Οδυσσέας Ελύτης — «Όλα τα πήρε το καλοκαίρι»", "Οδυσσέας Ελύτης — «Όλα τα πήρε το καλοκαίρι»"],
          ["Όσκαρ Ουάιλντ — «Ο πιστός φίλος»", "Όσκαρ Ουάιλντ — «Ο πιστός φίλος»"],
          ["Μιμίκα Κρανάκη — «Ένα τόπι χρωματιστό»", "Μιμίκα Κρανάκη — «Ένα τόπι χρωματιστό»"],
          ["Λαϊκό παραμύθι — «Ο φτωχός και τα γρόσια»", "Λαϊκό παραμύθι — «Ο φτωχός και τα γρόσια»"],
          ["Τέλλος Άγρας & Νικηφόρος Βρετάκος — «Το ξανθό παιδί», «Το παιδί με τα σπίρτα»", "Τέλλος Άγρας & Νικηφόρος Βρετάκος — «Το ξανθό παιδί», «Το παιδί με τα σπίρτα»"],
          ["Άντον Τσέχωφ — «Ο Βάνκας»", "Άντον Τσέχωφ — «Ο Βάνκας»"],
          ["Μαρία Πυλιώτου — «Λεώνη»", "Μαρία Πυλιώτου — «Λεώνη»"],
          ["Αντώνης Σαμαράκης — «Γραφείον ιδεών»", "Αντώνης Σαμαράκης — «Γραφείον ιδεών»"],
          ["Λουίς Σεπούλβεδα — «Το μαύρο κύμα»", "Λουίς Σεπούλβεδα — «Το μαύρο κύμα»"],
          ["Κρίτων Αθανασούλης — «Παράπονο σκύλου»", "Κρίτων Αθανασούλης — «Παράπονο σκύλου»"],
          ["Ελένη Σαραντίτη — «Όπως τα βλέπει κανείς…»", "Ελένη Σαραντίτη — «Όπως τα βλέπει κανείς…»"],
          ["Ανδρέας Καρκαβίτσας — «Το μνήμα της μάνας»", "Ανδρέας Καρκαβίτσας — «Το μνήμα της μάνας»"],
          ["Γρηγόριος Ξενόπουλος — «Η γάτα του παπά»", "Γρηγόριος Ξενόπουλος — «Η γάτα του παπά»"],
          ["Ηλίας Βενέζης — «Η Δάφνη»", "Ηλίας Βενέζης — «Η Δάφνη»"],
          ["Λιλή Ζωγράφου — «Στρίγκλα και καλλονή»", "Λιλή Ζωγράφου — «Στρίγκλα και καλλονή»"],
          ["Γιώργος Σκαμπαρδώνης — «Η Βαγγελιώ-δεν-είσαι-εντάξει»", "Γιώργος Σκαμπαρδώνης — «Η Βαγγελιώ-δεν-είσαι-εντάξει»"],
          ["Τζακ Λόντον — «Ο αδάμαστος»", "Τζακ Λόντον — «Ο αδάμαστος»"],
        ],
      }),
      verifiedSubject({
        id: "fysiki-a-gymnasiou", grade: "a", labelEl: "Φυσική, Α' Γυμνασίου", labelEn: "Physics, 7th Grade",
        sourceLabelEl: "Οδηγίες Φυσικής Γυμνασίου 2026–27",
        rows: [
          ["Μετρήσεις μήκους και μέση τιμή", "Length measurements and mean value"],
          ["Μετρήσεις χρόνου και ακρίβεια", "Time measurements and accuracy"],
          ["Μετρήσεις μάζας και διαγράμματα", "Mass measurements and graphs"],
          ["Μέτρηση όγκου", "Volume measurement"],
          ["Μέτρηση πυκνότητας", "Density measurement"],
          ["Θερμοκρασία και βαθμονόμηση", "Temperature and calibration"],
          ["Θερμότητα, θερμοκρασία και θερμική ισορροπία", "Heat, temperature and thermal equilibrium"],
          ["Ηλεκτρικό βραχυκύκλωμα και ασφάλεια", "Short circuits and electrical safety"],
          ["Από τον ηλεκτρισμό στον μαγνητισμό", "From electricity to magnetism"],
          ["Από τον μαγνητισμό στον ηλεκτρισμό", "From magnetism to electricity"],
        ],
      }),
      verifiedSubject({
        id: "biologia-a-gymnasiou", grade: "a", labelEl: "Βιολογία, Α' Γυμνασίου", labelEn: "Biology, 7th Grade",
        sourceLabelEl: "Οδηγίες Βιολογίας Α' Γυμνασίου 2026–27",
        rows: [
          ["Οργάνωση της ζωής: χαρακτηριστικά οργανισμών", "Organisation of life: characteristics of organisms"],
          ["Κύτταρο: η μονάδα της ζωής", "The cell: unit of life"],
          ["Οργάνωση πολυκύτταρων οργανισμών", "Organisation of multicellular organisms"],
          ["Αλληλεπιδράσεις και προσαρμογές (προαιρετικό)", "Interactions and adaptations (optional)", null, null, true],
          ["Φωτοσύνθεση", "Photosynthesis"],
          ["Πρόσληψη ουσιών και πέψη", "Intake of substances and digestion"],
          ["Μεταφορά και αποβολή ουσιών", "Transport and excretion"],
          ["Αναπνοή στους οργανισμούς και στον άνθρωπο", "Respiration in organisms and humans"],
        ],
      }),
      verifiedSubject({
        id: "geografia-a-gymnasiou", grade: "a", labelEl: "Γεωλογία:Γεωγραφία, Α' Γυμνασίου", labelEn: "Geology:Geography, 7th Grade",
        sourceLabelEl: "Οδηγίες Γεωλογίας:Γεωγραφίας Α':Β' Γυμνασίου 2026–27",
        rows: [
          ["Χάρτες: είδη, υπόμνημα και κλίμακα", "Maps: types, legend and scale"],
          ["Γεωγραφικές συντεταγμένες και προσανατολισμός", "Coordinates and orientation"],
          ["Η Γη στο ηλιακό σύστημα", "Earth in the Solar System"],
          ["Λιθόσφαιρα: ανάγλυφο και τεκτονικές πλάκες", "Lithosphere: relief and tectonic plates"],
          ["Υδρόσφαιρα: ωκεανοί, θάλασσες και ποτάμια", "Hydrosphere: oceans, seas and rivers"],
          ["Ατμόσφαιρα, καιρός και κλίμα", "Atmosphere, weather and climate"],
          ["Βιόσφαιρα και φυσικά οικοσυστήματα", "Biosphere and natural ecosystems"],
          ["Ανθρωπογενές περιβάλλον: πληθυσμός και οικισμοί", "Human environment: population and settlements"],
          ["Ήπειροι: συνθετική εργασία (προαιρετική εμβάθυνση)", "Continents: project work (optional extension)", null, null, true],
        ],
      }),
      verifiedSubject({
        id: "technologia-a-gymnasiou", grade: "a", labelEl: "Τεχνολογία, Α' Γυμνασίου", labelEn: "Technology, 7th Grade",
        sourceLabelEl: "Οδηγίες Τεχνολογίας Α':Β':Γ' Γυμνασίου 2026–27",
        rows: [
          ["Τεχνολογικό περιβάλλον και τεχνολογικοί άξονες", "Technological environment and technology domains"],
          ["Επιλογή και μελέτη τεχνολογικού αντικειμένου", "Selecting and studying a technological object"],
          ["Ατομική εργασία: σχεδιασμός και κατασκευή", "Individual project: design and construction"],
          ["Τεχνικό σχέδιο, υλικά και εργαλεία", "Technical drawing, materials and tools"],
          ["Παρουσίαση και αξιολόγηση της κατασκευής", "Presenting and evaluating the construction"],
        ],
      }),
      verifiedSubject({
        id: "thriskeftika-a-gymnasiou", grade: "a", labelEl: "Θρησκευτικά, Α' Γυμνασίου", labelEn: "Religious Studies, 7th Grade",
        sourceLabelEl: "Θεματικές ενότητες του επίσημου βιβλίου μαθητή",
        rows: [
          ["Α΄ Θεματική Ενότητα — Η Αγία Γραφή: Η συνάντηση Θεού και ανθρώπου καταγράφεται σε κείμενα", "Α΄ Θεματική Ενότητα — Η Αγία Γραφή: Η συνάντηση Θεού και ανθρώπου καταγράφεται σε κείμενα"],
          ["Β΄ Θεματική Ενότητα — Θεός και άνθρωπος στην Ορθόδοξη Παράδοση: μια σχέση ζωής", "Β΄ Θεματική Ενότητα — Θεός και άνθρωπος στην Ορθόδοξη Παράδοση: μια σχέση ζωής"],
          ["Γ΄ Θεματική Ενότητα — Πού είναι ο Θεός; Η σχέση ζωής περνάει μέσα από δοκιμασίες", "Γ΄ Θεματική Ενότητα — Πού είναι ο Θεός; Η σχέση ζωής περνάει μέσα από δοκιμασίες"],
          ["Δ΄ Θεματική Ενότητα — Ο Θεός γίνεται άνθρωπος: Το πιο συγκλονιστικό γεγονός της ιστορίας του ανθρώπου", "Δ΄ Θεματική Ενότητα — Ο Θεός γίνεται άνθρωπος: Το πιο συγκλονιστικό γεγονός της ιστορίας του ανθρώπου"],
          ["Ε΄ Θεματική Ενότητα — Ένας καινούριος κόσμος ξεπροβάλλει: Χριστός ανέστη!", "Ε΄ Θεματική Ενότητα — Ένας καινούριος κόσμος ξεπροβάλλει: Χριστός ανέστη!"],
          ["ΣΤ΄ Θεματική Ενότητα — Η Εκκλησία μεταμορφώνει τον κόσμο", "ΣΤ΄ Θεματική Ενότητα — Η Εκκλησία μεταμορφώνει τον κόσμο"],
          ["Ζ΄ Θεματική Ενότητα — Η Εκκλησία ως κιβωτός σ’ ένα ταξίδι χωρίς τέλος", "Ζ΄ Θεματική Ενότητα — Η Εκκλησία ως κιβωτός σ’ ένα ταξίδι χωρίς τέλος"],
        ],
      }),
    ],
    b: [
      verifiedSubject({
        id: "physics-gymnasiou", grade: "b", labelEl: "Φυσική, Β' Γυμνασίου", labelEn: "Physics, 8th Grade",
        sourceLabelEl: "Οδηγίες Φυσικής Γυμνασίου 2026–27",
        rows: [
          ["Φυσικά μεγέθη, μονάδες και πυκνότητα", "Physical quantities, units and density"],
          ["Θέση, μετατόπιση και ταχύτητα", "Position, displacement and speed"],
          ["Δυνάμεις, σύνθεση και νόμοι του Νεύτωνα", "Forces, composition and Newton's laws"],
          ["Πίεση, υδροστατική και ατμοσφαιρική πίεση", "Pressure, hydrostatic and atmospheric pressure"],
          ["Άνωση και αρχή του Αρχιμήδη", "Buoyancy and Archimedes' principle"],
          ["Έργο, ενέργεια, ισχύς και απόδοση", "Work, energy, power and efficiency"],
          ["Θερμότητα και θερμική διαστολή", "Heat and thermal expansion"],
        ],
      }),
      verifiedSubject({
        id: "chimeia-b-gymnasiou", grade: "b", labelEl: "Χημεία, Β' Γυμνασίου", labelEn: "Chemistry, 8th Grade",
        sourceLabelEl: "Οδηγίες Χημείας Β' Γυμνασίου 2026–27",
        rows: [
          ["Εισαγωγή στη Χημεία και ασφάλεια εργαστηρίου", "Introduction to Chemistry and laboratory safety"],
          ["Καταστάσεις και φυσικές ιδιότητες των υλικών", "States and physical properties of materials"],
          ["Νερό, μείγματα και διαλύματα", "Water, mixtures and solutions"],
          ["Περιεκτικότητα διαλύματος", "Solution concentration"],
          ["Διαχωρισμός μειγμάτων και ρύπανση νερού", "Separating mixtures and water pollution"],
          ["Χημικά στοιχεία, ενώσεις και αντιδράσεις", "Elements, compounds and chemical reactions"],
          ["Άτομα, μόρια, ιόντα και χημικές εξισώσεις", "Atoms, molecules, ions and chemical equations"],
          ["Ατμοσφαιρικός αέρας και περιβαλλοντική ρύπανση", "Atmospheric air and environmental pollution"],
        ],
      }),
      verifiedSubject({
        id: "biologia-b-gymnasiou", grade: "b", labelEl: "Βιολογία, Β' Γυμνασίου", labelEn: "Biology, 8th Grade",
        sourceLabelEl: "Οδηγίες Βιολογίας Β' Γυμνασίου 2026–27",
        rows: [
          ["Στήριξη και κίνηση σε μονοκύτταρους οργανισμούς και φυτά", "Support and movement in unicellular organisms and plants"],
          ["Στήριξη και κίνηση σε ζώα: μυοσκελετικό σύστημα", "Support and movement in animals: musculoskeletal system"],
          ["Αναπαραγωγή σε μονοκύτταρους οργανισμούς και φυτά", "Reproduction in unicellular organisms and plants"],
          ["Αναπαραγωγή στα ζώα και στον άνθρωπο", "Reproduction in animals and humans"],
          ["Κύτταρο και επίπεδα οργάνωσης (προαιρετικό)", "Cell and levels of organisation (optional)", null, null, true],
          ["Ομοιόσταση και ασθένειες", "Homeostasis and disease"],
          ["Αμυντικοί μηχανισμοί του ανθρώπου", "Human defence mechanisms"],
          ["Τρόπος ζωής και ασθένειες", "Lifestyle and disease"],
        ],
      }),
      verifiedSubject({
        id: "geografia-b-gymnasiou", grade: "b", labelEl: "Γεωλογία:Γεωγραφία, Β' Γυμνασίου", labelEn: "Geology:Geography, 8th Grade",
        sourceLabelEl: "Οδηγίες Γεωλογίας:Γεωγραφίας Α':Β' Γυμνασίου 2026–27",
        rows: [
          ["Γεωγραφική και σχετική θέση", "Geographic and relative position"],
          ["Η θέση της Ευρώπης στον κόσμο", "Europe's position in the world"],
          ["Γεωλογική ιστορία και ανάγλυφο της Ευρώπης", "Geological history and relief of Europe"],
          ["Κλίμα, ποτάμια, λίμνες και θάλασσες της Ευρώπης", "Climate, rivers, lakes and seas of Europe"],
          ["Φυσικές περιοχές και βλάστηση της Ευρώπης", "Natural regions and vegetation of Europe"],
          ["Κάτοικοι, πληθυσμός και πολιτισμός της Ευρώπης", "People, population and culture of Europe"],
          ["Ευρωπαϊκή Ένωση και ευρωπαϊκά κράτη", "European Union and European states"],
          ["Παραγωγή και οικονομία της Ευρώπης", "Production and economy of Europe"],
          ["Η Ελλάδα μέσα στην Ευρώπη", "Greece within Europe"],
        ],
      }),
      verifiedSubject({
        id: "technologia-b-gymnasiou", grade: "b", labelEl: "Τεχνολογία, Β' Γυμνασίου", labelEn: "Technology, 8th Grade",
        sourceLabelEl: "Οδηγίες Τεχνολογίας Α':Β':Γ' Γυμνασίου 2026–27",
        rows: [
          ["Βιομηχανική παραγωγή και οργάνωση", "Industrial production and organisation"],
          ["Ομαδική επιλογή και μελέτη βιομηχανίας", "Team selection and study of an industry"],
          ["Ρόλοι, τμήματα και ροή παραγωγής", "Roles, departments and production flow"],
          ["Κατασκευή ομοιώματος και τεχνική τεκμηρίωση", "Model construction and technical documentation"],
          ["Ομαδική παρουσίαση και αξιολόγηση", "Team presentation and evaluation"],
        ],
      }),
      verifiedSubject({
        id: "thriskeftika-b-gymnasiou", grade: "b", labelEl: "Θρησκευτικά, Β' Γυμνασίου", labelEn: "Religious Studies, 8th Grade",
        sourceLabelEl: "Επίσημο βιβλίο μαθητή · Θρησκευτικά Β΄ Γυμνασίου",
        rows: [
          ["1 — Η Εκκλησία εξαπλώνεται στην οικουμένη", "1 — The Church spreads throughout the world"],
          ["2 — Ιεροσόλυμα: Η πρώτη χριστιανική κοινότητα", "2 — Jerusalem: The first Christian community"],
          ["3 — Από διώκτης των Χριστιανών, Απόστολος των Εθνών", "3 — From persecutor of Christians to Apostle to the Nations"],
          ["4 — Το τέλος των διωγμών και ένα νέο ιστορικό ξεκίνημα για την Εκκλησία", "4 — The end of the persecutions and a new historical beginning for the Church"],
          ["5 — Η Εκκλησία οργανώνεται", "5 — The Church is organised"],
          ["6 — Ελληνισμός και Χριστιανισμός. Η συνάντηση δύο τρόπων σκέψης και ζωής", "6 — Hellenism and Christianity: the meeting of two ways of thought and life"],
          ["7 — Η σύνθεση Χριστιανισμού και Ελληνισμού αποτυπώνεται στην τέχνη", "7 — The synthesis of Christianity and Hellenism is expressed in art"],
          ["8 — Συζητώντας για τα όριά μας", "8 — Discussing our limits"],
          ["9 — Η χριστιανική Εκκλησία αποφασίζει και ορίζει την πίστη", "9 — The Christian Church decides and defines the faith"],
          ["10 — Η δύναμη της εικόνας", "10 — The power of the image"],
          ["11 — Η απεικόνιση του Θεού στη βιβλική παράδοση και στη ζωή της Ορθόδοξης Εκκλησίας", "11 — Depicting God in the biblical tradition and the life of the Orthodox Church"],
          ["12 — Εικονομαχία: Η τιμητική προσκύνηση των εικόνων υπό διωγμό", "12 — Iconoclasm: the veneration of icons under persecution"],
          ["13 — Η θεολογία και το κάλλος της Ορθόδοξης εικονογραφίας", "13 — The theology and beauty of Orthodox iconography"],
          ["14 — Μετά την Άλωση της Πόλης", "14 — After the Fall of Constantinople"],
          ["15 — Η δύναμη του λαϊκού πολιτισμού", "15 — The power of folk culture"],
          ["16 — Από την οικουμενική Ορθοδοξία στις εθνικές Εκκλησίες", "16 — From universal Orthodoxy to national Churches"],
        ],
      }),
    ],
    c: [
      verifiedSubject({
        id: "logotechnia-g-gymnasiou", grade: "c", labelEl: "Κείμενα Νεοελληνικής Λογοτεχνίας, Γ' Γυμνασίου", labelEn: "Modern Greek Literature Texts, 9th Grade",
        sourceLabelEl: "Κείμενα του επίσημου ανθολογίου (ελεύθερη επιλογή του εκπαιδευτικού)",
        rows: [
          ["Δημοτικά Νανουρίσματα — «Να μου το πάρεις ύπνε μου», «Κοιμήσου αστρί»", "Δημοτικά Νανουρίσματα — «Να μου το πάρεις ύπνε μου», «Κοιμήσου αστρί»"],
          ["Δημοτικό τραγούδι — «Της Πάργας»", "Δημοτικό τραγούδι — «Της Πάργας»"],
          ["Δημοτικό τραγούδι — «Του γιοφυριού της Άρτας»", "Δημοτικό τραγούδι — «Του γιοφυριού της Άρτας»"],
          ["Γεώργιος Χορτάτσης — «Ερωφίλη»", "Γεώργιος Χορτάτσης — «Ερωφίλη»"],
          ["Βιτσέντσος Κορνάρος — «Ερωτόκριτος»", "Βιτσέντσος Κορνάρος — «Ερωτόκριτος»"],
          ["Μαρίνος Τζάνε Μπουνιαλής — «Κρητικός Πόλεμος»", "Μαρίνος Τζάνε Μπουνιαλής — «Κρητικός Πόλεμος»"],
          ["Ρήγας Βελεστινλής — «Θούριος»", "Ρήγας Βελεστινλής — «Θούριος»"],
          ["Αθανάσιος Χριστόπουλος — «Τώρα»", "Αθανάσιος Χριστόπουλος — «Τώρα»"],
          ["Ανώνυμος — «Ο Ρωσσαγγλογάλλος»", "Ανώνυμος — «Ο Ρωσσαγγλογάλλος»"],
          ["Αδαμάντιος Κοραής — «Ο Παπατρέχας»", "Αδαμάντιος Κοραής — «Ο Παπατρέχας»"],
          ["Λόρδος Μπάυρον — «Το προσκύνημα του Τσάιλντ Χάρολντ»", "Λόρδος Μπάυρον — «Το προσκύνημα του Τσάιλντ Χάρολντ»"],
          ["Γιάννης Μακρυγιάννης — «Απομνημονεύματα»", "Γιάννης Μακρυγιάννης — «Απομνημονεύματα»"],
          ["Ελισάβετ Μουτζάν-Μαρτινέγκου — «Αυτοβιογραφία»", "Ελισάβετ Μουτζάν-Μαρτινέγκου — «Αυτοβιογραφία»"],
          ["Παναγής Σκουζές — «Ο βίος μου»", "Παναγής Σκουζές — «Ο βίος μου»"],
          ["Ανδρέας Κάλβος — «Εις Πάργαν»", "Ανδρέας Κάλβος — «Εις Πάργαν»"],
          ["Διονύσιος Σολωμός — «Ελεύθεροι Πολιορκημένοι»", "Διονύσιος Σολωμός — «Ελεύθεροι Πολιορκημένοι»"],
          ["Αριστοτέλης Βαλαωρίτης — «Ο Δήμος και το καριοφίλι του»", "Αριστοτέλης Βαλαωρίτης — «Ο Δήμος και το καριοφίλι του»"],
          ["Ανδρέας Λασκαράτος — «Ο κακός μαθητής»", "Ανδρέας Λασκαράτος — «Ο κακός μαθητής»"],
          ["Λορέντζος Μαβίλης — «Λήθη»", "Λορέντζος Μαβίλης — «Λήθη»"],
          ["Αλέξανδρος Σούτσος — «Ο επιστάτης των εθνικών οικοδομών επί Ι. Καποδίστρια»", "Αλέξανδρος Σούτσος — «Ο επιστάτης των εθνικών οικοδομών επί Ι. Καποδίστρια»"],
          ["Σπυρίδων Βασιλειάδης — «Η χαρά»", "Σπυρίδων Βασιλειάδης — «Η χαρά»"],
          ["Σάμιουελ Τ. Κόλεριτζ — «Δουλειά χωρίς ελπίδα»", "Σάμιουελ Τ. Κόλεριτζ — «Δουλειά χωρίς ελπίδα»"],
          ["Γρηγόριος Παλαιολόγος — «Ο ζωγράφος»", "Γρηγόριος Παλαιολόγος — «Ο ζωγράφος»"],
          ["Εμμανουήλ Ροΐδης — «Τα υαλοπωλεία»", "Εμμανουήλ Ροΐδης — «Τα υαλοπωλεία»"],
          ["Γεώργιος Βιζυηνός — «Στο χαρέμι»", "Γεώργιος Βιζυηνός — «Στο χαρέμι»"],
          ["Αλέξανδρος Παπαδιαμάντης — «Τ' αγνάντεμα»", "Αλέξανδρος Παπαδιαμάντης — «Τ' αγνάντεμα»"],
          ["Άντον Τσέχωφ — «Ο Παχύς και ο Αδύνατος»", "Άντον Τσέχωφ — «Ο Παχύς και ο Αδύνατος»"],
          ["Ανδρέας Καρκαβίτσας — «Ο Ζητιάνος»", "Ανδρέας Καρκαβίτσας — «Ο Ζητιάνος»"],
          ["Κωστής Παλαμάς — «Ίαμβοι και ανάπαιστοι»", "Κωστής Παλαμάς — «Ίαμβοι και ανάπαιστοι»"],
          ["Κωστής Παλαμάς — «Ύμνος στον Παρθενώνα»", "Κωστής Παλαμάς — «Ύμνος στον Παρθενώνα»"],
          ["Κ.Π. Καβάφης — «Φωνές»", "Κ.Π. Καβάφης — «Φωνές»"],
          ["Κ.Π. Καβάφης — «Όσο μπορείς»", "Κ.Π. Καβάφης — «Όσο μπορείς»"],
          ["Κ.Π. Καβάφης — «Στα 200 π.Χ.»", "Κ.Π. Καβάφης — «Στα 200 π.Χ.»"],
          ["Γρηγόριος Ξενόπουλος — «Ο τύπος και η ουσία»", "Γρηγόριος Ξενόπουλος — «Ο τύπος και η ουσία»"],
          ["Κωνσταντίνος Θεοτόκης — «Η τέχνη του αγιογράφου»", "Κωνσταντίνος Θεοτόκης — «Η τέχνη του αγιογράφου»"],
          ["Πηνελόπη Δέλτα — «Πρώτες ενθυμήσεις»", "Πηνελόπη Δέλτα — «Πρώτες ενθυμήσεις»"],
          ["Άγγελος Σικελιανός — «Γιατί βαθιά μου δόξασα»", "Άγγελος Σικελιανός — «Γιατί βαθιά μου δόξασα»"],
          ["Κώστας Βάρναλης — «Ορέστης»", "Κώστας Βάρναλης — «Ορέστης»"],
          ["Ναπολέων Λαπαθιώτης — «Νυχτερινό»", "Ναπολέων Λαπαθιώτης — «Νυχτερινό»"],
          ["Κ.Γ. Καρυωτάκης — «Σαν δέσμη από τριαντάφυλλα, Βράδυ»", "Κ.Γ. Καρυωτάκης — «Σαν δέσμη από τριαντάφυλλα, Βράδυ»"],
          ["Μαρία Πολυδούρη — «Γιατί μ' αγάπησες»", "Μαρία Πολυδούρη — «Γιατί μ' αγάπησες»"],
          ["Γιάννης Σκαρίμπας — «Ουλαλούμ»", "Γιάννης Σκαρίμπας — «Ουλαλούμ»"],
          ["Ζυλ Λαφόργκ — «Μοιρολόι φεγγαριού στην επαρχία»", "Ζυλ Λαφόργκ — «Μοιρολόι φεγγαριού στην επαρχία»"],
          ["Άγγελος Τερζάκης — «Ο ματωμένος λυρισμός»", "Άγγελος Τερζάκης — «Ο ματωμένος λυρισμός»"],
          ["Στράτης Μυριβήλης — «Τα ζα»", "Στράτης Μυριβήλης — «Τα ζα»"],
          ["Νίκος Καζαντζάκης — «Βίος και Πολιτεία του Αλέξη Ζορμπά»", "Νίκος Καζαντζάκης — «Βίος και Πολιτεία του Αλέξη Ζορμπά»"],
          ["Γιώργος Σεφέρης — «Με τον τρόπο του Γ.Σ.»", "Γιώργος Σεφέρης — «Με τον τρόπο του Γ.Σ.»"],
          ["Γιώργος Σεφέρης — «Τρία χαϊκού»", "Γιώργος Σεφέρης — «Τρία χαϊκού»"],
          ["Γιώργος Σεφέρης — «Ομιλία στη Στοκχόλμη»", "Γιώργος Σεφέρης — «Ομιλία στη Στοκχόλμη»"],
          ["Ανδρέας Εμπειρίκος — «Τριαντάφυλλα στο παράθυρο»", "Ανδρέας Εμπειρίκος — «Τριαντάφυλλα στο παράθυρο»"],
          ["Νίκος Εγγονόπουλος — «Μπολιβάρ»", "Νίκος Εγγονόπουλος — «Μπολιβάρ»"],
          ["Οδυσσέας Ελύτης — «Το Άξιον Εστί. Η Γένεσις. Τα Πάθη, Ε΄»", "Οδυσσέας Ελύτης — «Το Άξιον Εστί. Η Γένεσις. Τα Πάθη, Ε΄»"],
          ["Οδυσσέας Ελύτης — «Δώρο ασημένιο ποίημα»", "Οδυσσέας Ελύτης — «Δώρο ασημένιο ποίημα»"],
          ["Γιάννης Ρίτσος — «Αρχαίο θέατρο»", "Γιάννης Ρίτσος — «Αρχαίο θέατρο»"],
          ["Γιάννης Ρίτσος — «Ρωμιοσύνη»", "Γιάννης Ρίτσος — «Ρωμιοσύνη»"],
          ["Νίκος Καββαδίας — «Kuro Siwo»", "Νίκος Καββαδίας — «Kuro Siwo»"],
          ["Φραντς Κάφκα — «Ποσειδώνας»", "Φραντς Κάφκα — «Ποσειδώνας»"],
          ["Γιώργος Θεοτοκάς — «Η διαδήλωση»", "Γιώργος Θεοτοκάς — «Η διαδήλωση»"],
          ["Μ. Καραγάτσης — «Ένας Ρώσος συνταγματάρχης στη Λάρισα»", "Μ. Καραγάτσης — «Ένας Ρώσος συνταγματάρχης στη Λάρισα»"],
          ["Κοσμάς Πολίτης — «Η γνωριμία με τη Μόνικα»", "Κοσμάς Πολίτης — «Η γνωριμία με τη Μόνικα»"],
          ["Μέλπω Αξιώτη — «Η ψυχή του νησιού»", "Μέλπω Αξιώτη — «Η ψυχή του νησιού»"],
          ["Μίλτος Σαχτούρης — «Τα δώρα»", "Μίλτος Σαχτούρης — «Τα δώρα»"],
          ["Μανόλης Αναγνωστάκης — «Στο παιδί μου»", "Μανόλης Αναγνωστάκης — «Στο παιδί μου»"],
          ["Κική Δημουλά — «Τα πάθη της βροχής»", "Κική Δημουλά — «Τα πάθη της βροχής»"],
          ["Τζένη Μαστοράκη — «Οι μεγάλοι»", "Τζένη Μαστοράκη — «Οι μεγάλοι»"],
          ["Δημήτρης Χατζής — «Η τελευταία αρκούδα του Πίνδου»", "Δημήτρης Χατζής — «Η τελευταία αρκούδα του Πίνδου»"],
          ["Αντώνης Σαμαράκης — «Ζητείται ελπίς»", "Αντώνης Σαμαράκης — «Ζητείται ελπίς»"],
          ["Κώστας Ταχτσής — «Κι έχουμε πόλεμο!»", "Κώστας Ταχτσής — «Κι έχουμε πόλεμο!»"],
          ["Ρέα Γαλανάκη — «Η μεταμφίεση»", "Ρέα Γαλανάκη — «Η μεταμφίεση»"],
        ],
      }),
      verifiedSubject({
        id: "fysiki-g-gymnasiou", grade: "c", labelEl: "Φυσική, Γ' Γυμνασίου", labelEn: "Physics, 9th Grade",
        sourceLabelEl: "Οδηγίες Φυσικής Γυμνασίου 2026–27",
        rows: [
          ["Ηλεκτρική δύναμη, φορτίο και ηλεκτρικό πεδίο", "Electric force, charge and electric field"],
          ["Ηλεκτρικό ρεύμα και κυκλώματα", "Electric current and circuits"],
          ["Αντίσταση, νόμος του Ohm και συνδεσμολογία", "Resistance, Ohm's law and circuit connections"],
          ["Αποτελέσματα, ενέργεια και ισχύς ηλεκτρικού ρεύματος", "Effects, energy and power of electric current"],
          ["Ταλαντώσεις και εκκρεμές", "Oscillations and the pendulum"],
          ["Μηχανικά κύματα και ήχος", "Mechanical waves and sound"],
          ["Φως, διάδοση και ανάκλαση", "Light, propagation and reflection"],
          ["Διάθλαση, ανάλυση φωτός και χρώμα", "Refraction, dispersion and colour"],
        ],
      }),
      verifiedSubject({
        id: "chimeia-g-gymnasiou", grade: "c", labelEl: "Χημεία, Γ' Γυμνασίου", labelEn: "Chemistry, 9th Grade",
        sourceLabelEl: "Οδηγίες Χημείας Γ' Γυμνασίου 2026–27",
        rows: [
          ["Οξέα, βάσεις και κλίμακα pH", "Acids, bases and the pH scale"],
          ["Εξουδετέρωση και άλατα", "Neutralisation and salts"],
          ["Οξέα, βάσεις και άλατα στην καθημερινή ζωή", "Acids, bases and salts in everyday life"],
          ["Περιοδικός πίνακας: μέταλλα και αμέταλλα", "Periodic table: metals and non-metals"],
          ["Αλκάλια, μέταλλα, κράματα και άνθρακας", "Alkalis, metals, alloys and carbon"],
          ["Υδρογονάνθρακες, καύση και καύσιμα", "Hydrocarbons, combustion and fuels"],
          ["Πετρέλαιο, φυσικό αέριο και πετροχημικά", "Petroleum, natural gas and petrochemicals"],
          ["Πολυμερισμός και πλαστικά", "Polymerisation and plastics"],
          ["Αιθανόλη και επίδραση στον οργανισμό", "Ethanol and its effects on the body"],
        ],
      }),
      verifiedSubject({
        id: "biologia-g-gymnasiou", grade: "c", labelEl: "Βιολογία, Γ' Γυμνασίου", labelEn: "Biology, 9th Grade",
        sourceLabelEl: "Οδηγίες Βιολογίας Γ' Γυμνασίου 2026–27",
        rows: [
          ["Μόρια της ζωής", "Molecules of life"],
          ["Κύτταρο: η μονάδα της ζωής", "The cell: unit of life"],
          ["Ισορροπία και λειτουργία οικοσυστημάτων", "Balance and function of ecosystems"],
          ["Γενετικό υλικό, γονίδια και χρωμοσώματα", "Genetic material, genes and chromosomes"],
          ["Ροή γενετικής πληροφορίας και αλληλόμορφα", "Flow of genetic information and alleles"],
          ["Κυτταρική διαίρεση και κληρονομικότητα", "Cell division and heredity"],
          ["Μεταλλάξεις", "Mutations"],
          ["Εξέλιξη και εξέλιξη του ανθρώπου", "Evolution and human evolution"],
        ],
      }),
      verifiedSubject({
        id: "technologia-g-gymnasiou", grade: "c", labelEl: "Τεχνολογία, Γ' Γυμνασίου", labelEn: "Technology, 9th Grade",
        sourceLabelEl: "Οδηγίες Τεχνολογίας Α':Β':Γ' Γυμνασίου 2026–27",
        rows: [
          ["Ερευνητικό ερώτημα και υπόθεση", "Research question and hypothesis"],
          ["Μεταβλητές και σχεδιασμός πειράματος", "Variables and experimental design"],
          ["Συλλογή, οργάνωση και γραφική αναπαράσταση δεδομένων", "Collecting, organising and graphing data"],
          ["Ανάλυση αποτελεσμάτων και συμπεράσματα", "Analysing results and drawing conclusions"],
          ["Έκθεση έρευνας και ομαδική παρουσίαση", "Research report and team presentation"],
        ],
      }),
      verifiedSubject({
        id: "thriskeftika-g-gymnasiou", grade: "c", labelEl: "Θρησκευτικά, Γ' Γυμνασίου", labelEn: "Religious Studies, 9th Grade",
        sourceLabelEl: "Θεματικές ενότητες του επίσημου βιβλίου μαθητή",
        rows: [
          ["Α΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σήμερα", "Α΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σήμερα"],
          ["Β΄ Θεματική Ενότητα — Η πρόταση ζωής της Ορθόδοξης Εκκλησίας", "Β΄ Θεματική Ενότητα — Η πρόταση ζωής της Ορθόδοξης Εκκλησίας"],
          ["Γ΄ Θεματική Ενότητα — Ιεραποστολή και Διακονία: Η ζωή της Ορθόδοξης Εκκλησίας αγκαλιάζει τον κόσμο ολάκερο!", "Γ΄ Θεματική Ενότητα — Ιεραποστολή και Διακονία: Η ζωή της Ορθόδοξης Εκκλησίας αγκαλιάζει τον κόσμο ολάκερο!"],
          ["Δ΄ Θεματική Ενότητα — Ο σεβασμός του άλλου στην Ορθόδοξη παράδοση", "Δ΄ Θεματική Ενότητα — Ο σεβασμός του άλλου στην Ορθόδοξη παράδοση"],
          ["Ε΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σε διάλογο με τον δυτικό Χριστιανισμό", "Ε΄ Θεματική Ενότητα — Η Ορθόδοξη Εκκλησία σε διάλογο με τον δυτικό Χριστιανισμό"],
          ["ΣΤ΄ Θεματική Ενότητα — Μονοθεϊστικές θρησκείες: Ιουδαϊσμός και Ισλάμ", "ΣΤ΄ Θεματική Ενότητα — Μονοθεϊστικές θρησκείες: Ιουδαϊσμός και Ισλάμ"],
          ["Ζ΄ Θεματική Ενότητα — Θρησκείες της Ανατολής", "Ζ΄ Θεματική Ενότητα — Θρησκείες της Ανατολής"],
        ],
      }),
    ],
  };

  const high = {
    a: [
      referenceSubject({ id:"chimeia-a-lykeiou", grade:"a", labelEl:"Χημεία, Α' Λυκείου", labelEn:"Chemistry, 10th Grade", rows:[
        ["Δομή ατόμου και περιοδικός πίνακας","Atomic structure and the periodic table"], ["Χημικοί δεσμοί","Chemical bonds"],
        ["Χημικές αντιδράσεις και στοιχειομετρία","Chemical reactions and stoichiometry"], ["Διαλύματα και συγκεντρώσεις","Solutions and concentrations"] ] }),
      referenceSubject({ id:"archaia-a-lykeiou", grade:"a", labelEl:"Αρχαία Ελληνικά, Α' Λυκείου", labelEn:"Ancient Greek, 10th Grade", rows:[
        ["Κατανόηση και ερμηνεία αρχαίου κειμένου","Understanding and interpreting ancient texts"], ["Γραμματική και μορφολογία","Grammar and morphology"],
        ["Συντακτικό","Syntax"], ["Μετάφραση και λεξιλόγιο","Translation and vocabulary"] ] }),
      referenceSubject({ id:"pliroforiki-a-lykeiou", grade:"a", labelEl:"Πληροφορική, Α' Λυκείου", labelEn:"Computer Science, 10th Grade", rows:[
        ["Δεδομένα και πληροφορία","Data and information"], ["Αλγόριθμοι και αναπαράσταση λύσεων","Algorithms and solution representation"],
        ["Προγραμματιστικές δομές","Programming structures"], ["Δίκτυα, διαδίκτυο και ψηφιακή ασφάλεια","Networks, the internet and digital safety"] ] }),
      referenceSubject({ id:"politiki-paideia-a-lykeiou", grade:"a", labelEl:"Πολιτική Παιδεία, Α' Λυκείου", labelEn:"Civic Education, 10th Grade", rows:[
        ["Κοινωνία, θεσμοί και κοινωνικοποίηση","Society, institutions and socialisation"], ["Πολίτης, δημοκρατία και δικαιώματα","Citizenship, democracy and rights"],
        ["Οικονομία και βασικές οικονομικές έννοιες","Economy and basic economic concepts"] ] }),
    ],
    b: [
      referenceSubject({ id:"mathimatika-b-lykeiou", grade:"b", labelEl:"Μαθηματικά, Β' Λυκείου", labelEn:"Mathematics, 11th Grade", rows:[
        ["Συστήματα και ιδιότητες συναρτήσεων","Systems and properties of functions"], ["Τριγωνομετρία","Trigonometry"],
        ["Πολυώνυμα και εξισώσεις","Polynomials and equations"], ["Διανύσματα και αναλυτική γεωμετρία","Vectors and analytic geometry"] ] }),
      referenceSubject({ id:"chimeia-b-lykeiou", grade:"b", labelEl:"Χημεία, Β' Λυκείου", labelEn:"Chemistry, 11th Grade", rows:[
        ["Θερμοχημεία και ταχύτητα αντίδρασης","Thermochemistry and reaction rates"], ["Χημική ισορροπία","Chemical equilibrium"],
        ["Οξέα, βάσεις και ιοντική ισορροπία","Acids, bases and ionic equilibrium"], ["Οργανική χημεία","Organic chemistry"] ] }),
      referenceSubject({ id:"archaia-b-lykeiou", grade:"b", labelEl:"Αρχαία Ελληνικά, Β' Λυκείου", labelEn:"Ancient Greek, 11th Grade", rows:[
        ["Ερμηνεία διδαγμένου κειμένου","Interpretation of taught text"], ["Αδίδακτο κείμενο","Unseen text"], ["Γραμματική και συντακτικό","Grammar and syntax"] ] }),
      referenceSubject({ id:"latinika-b-lykeiou", grade:"b", labelEl:"Λατινικά, Β' Λυκείου", labelEn:"Latin, 11th Grade", rows:[
        ["Μετάφραση λατινικού κειμένου","Latin text translation"], ["Λατινική γραμματική","Latin grammar"], ["Λατινικό συντακτικό","Latin syntax"] ] }),
      referenceSubject({ id:"filosofia-b-lykeiou", grade:"b", labelEl:"Φιλοσοφία, Β' Λυκείου", labelEn:"Philosophy, 11th Grade", rows:[
        ["Φιλοσοφικά ερωτήματα και επιχειρήματα","Philosophical questions and arguments"], ["Γνώση και αλήθεια","Knowledge and truth"],
        ["Ηθική και πολιτική φιλοσοφία","Ethics and political philosophy"] ] }),
    ],
    c: [
      referenceSubject({ id:"mathimatika-g-lykeiou", grade:"c", labelEl:"Μαθηματικά, Γ' Λυκείου", labelEn:"Mathematics, 12th Grade", rows:[
        ["Όρια και συνέχεια","Limits and continuity"], ["Παράγωγος και εφαρμογές","Derivatives and applications"],
        ["Ολοκληρώματα","Integrals"], ["Μελέτη συναρτήσεων","Function analysis"] ] }),
      referenceSubject({ id:"fysiki-g-lykeiou", grade:"c", labelEl:"Φυσική, Γ' Λυκείου", labelEn:"Physics, 12th Grade", rows:[
        ["Κρούσεις και ορμή","Collisions and momentum"], ["Μηχανική στερεού σώματος","Rigid-body mechanics"],
        ["Ταλαντώσεις και κύματα","Oscillations and waves"], ["Ηλεκτρομαγνητισμός","Electromagnetism"] ] }),
      referenceSubject({ id:"chimeia-g-lykeiou", grade:"c", labelEl:"Χημεία, Γ' Λυκείου", labelEn:"Chemistry, 12th Grade", rows:[
        ["Διαμοριακές δυνάμεις και καταστάσεις ύλης","Intermolecular forces and states of matter"], ["Θερμοχημεία και χημική κινητική","Thermochemistry and chemical kinetics"],
        ["Χημική και ιοντική ισορροπία","Chemical and ionic equilibrium"], ["Οργανική χημεία και μηχανισμοί","Organic chemistry and mechanisms"] ] }),
      referenceSubject({ id:"archaia-g-lykeiou", grade:"c", labelEl:"Αρχαία Ελληνικά, Γ' Λυκείου", labelEn:"Ancient Greek, 12th Grade", rows:[
        ["Φιλοσοφικός λόγος και ερμηνεία","Philosophical discourse and interpretation"], ["Αδίδακτο κείμενο","Unseen text"], ["Γραμματική και συντακτικό","Grammar and syntax"] ] }),
      referenceSubject({ id:"latinika-g-lykeiou", grade:"c", labelEl:"Λατινικά, Γ' Λυκείου", labelEn:"Latin, 12th Grade", rows:[
        ["Μετάφραση και ερμηνεία","Translation and interpretation"], ["Γραμματικά φαινόμενα","Grammar topics"], ["Συντακτικά φαινόμενα","Syntax topics"] ] }),
      referenceSubject({ id:"pliroforiki-g-lykeiou", grade:"c", labelEl:"Πληροφορική, Γ' Λυκείου", labelEn:"Computer Science, 12th Grade", rows:[
        ["Ανάλυση προβλήματος και αλγόριθμοι","Problem analysis and algorithms"], ["Δομές επιλογής και επανάληψης","Selection and iteration"],
        ["Πίνακες και υποπρογράμματα","Arrays and subprograms"], ["Αποδοτικότητα και έλεγχος αλγορίθμων","Algorithm efficiency and testing"] ] }),
      referenceSubject({ id:"oikonomia-g-lykeiou", grade:"c", labelEl:"Οικονομία, Γ' Λυκείου", labelEn:"Economics, 12th Grade", rows:[
        ["Βασικές οικονομικές έννοιες και ανάγκες","Basic economic concepts and needs"], ["Ζήτηση και προσφορά","Demand and supply"],
        ["Παραγωγή και κόστος","Production and cost"], ["Μορφές αγοράς","Market structures"] ] }),
    ],
  };

  function getSubjects(zoneId, gradeId) {
    return (zoneId === "middle" ? middle : zoneId === "high" ? high : {})[gradeId] || [];
  }

  function getSubject(zoneId, gradeId, subjectId) {
    return getSubjects(zoneId, gradeId).find((x) => x.id === subjectId) || null;
  }

  window.AITOOLSKIDS_TUTOR_CATALOG = Object.freeze({
    meta: Object.freeze({ schoolYear: "2026-2027", lastVerified: "2026-09-23", middleIndex: MIDDLE_INDEX, highReference: HIGH_REFERENCE }),
    zones: Object.freeze({ middle: Object.freeze(middle), high: Object.freeze(high) }),
    getSubjects,
    getSubject,
  });

  // Expand the broad zone filters so the new school subjects are visible outside the Tutor too.
  if (typeof SUBJECTS !== "undefined" && Array.isArray(SUBJECTS)) {
    [
      { id:"technology", icon:"💻", labelEl:"Τεχνολογία & Πληροφορική", labelEn:"Technology & Computing" },
      { id:"civics", icon:"🏛️", labelEl:"Κοινωνικές Επιστήμες", labelEn:"Social Sciences" },
      { id:"religion", icon:"🤝", labelEl:"Θρησκευτικά", labelEn:"Religious Studies" },
    ].forEach((item) => { if (!SUBJECTS.some((x) => x.id === item.id)) SUBJECTS.push(item); });
  }
  if (typeof CURRICULUM !== "undefined") {
    CURRICULUM.middle.technology = { toolIds:["ai-help","phet","chatgpt"], noteEl:"Σχεδιασμός, κατασκευές, βιομηχανική παραγωγή και ερευνητική μέθοδος.", noteEn:"Design, construction, industrial production and research method." };
    CURRICULUM.middle.civics = { toolIds:["ai-help","perplexity","chatgpt"], noteEl:"Έρευνα κοινωνικών θεμάτων με έλεγχο πηγών και οργάνωση επιχειρημάτων.", noteEn:"Research social topics with source checking and argument organisation." };
    CURRICULUM.middle.religion = { toolIds:["ai-help","perplexity","google-arts-culture"], noteEl:"Κατανόηση θεματικών ενοτήτων με σεβασμό, ιστορικό πλαίσιο και έλεγχο πηγών.", noteEn:"Understanding themes respectfully, with historical context and source checking." };
    CURRICULUM.high.technology = { toolIds:["ai-help","chatgpt","wolfram-alpha"], noteEl:"Αλγόριθμοι, προγραμματισμός, δεδομένα και ερευνητική μεθοδολογία.", noteEn:"Algorithms, programming, data and research methodology." };
    CURRICULUM.high.civics = { toolIds:["ai-help","perplexity","chatgpt"], noteEl:"Πολιτική Παιδεία, Φιλοσοφία και Οικονομία με τεκμηριωμένη επιχειρηματολογία.", noteEn:"Civics, Philosophy and Economics through evidence-based argument." };
    CURRICULUM.high.religion = { toolIds:["ai-help","perplexity","google-arts-culture"], noteEl:"Μελέτη θρησκευτικών και διαπολιτισμικών θεμάτων με αξιόπιστες πηγές.", noteEn:"Study of religious and intercultural topics with reliable sources." };
  }

  // ---------- New middle-school diagnostics ----------
  function makePath(labelEl, labelEn) {
    return [
      { titleEl:"Δοκίμασε πρώτα", titleEn:"Try first", descriptionEl:`Γράψε τι ήδη γνωρίζεις για «${labelEl}» και λύσε ένα μικρό παράδειγμα χωρίς βοήθεια.`, descriptionEn:`Write what you already know about “${labelEn}” and try one small example unaided.`, toolId:null },
      { titleEl:"Ζήτησε μία υπόδειξη", titleEn:"Ask for one hint", descriptionEl:`Άνοιξε την AI Βοήθεια και ζήτησε μία ερώτηση ή υπόδειξη για «${labelEl}», όχι έτοιμη λύση.`, descriptionEn:`Open AI Help and ask for one question or hint about “${labelEn}”, not a finished answer.`, toolId:"ai-help" },
      { titleEl:"Έλεγξε ότι το κατάλαβες", titleEn:"Check your understanding", descriptionEl:`Εξήγησε το «${labelEl}» με δικά σου λόγια και απάντησε σε ένα νέο παράδειγμα.`, descriptionEn:`Explain “${labelEn}” in your own words and answer one new example.`, toolId:"ai-help" },
    ];
  }

  function registerDiagnostic(spec) {
    if (typeof QUIZZES === "undefined" || typeof GAP_TAGS === "undefined" || typeof LEARNING_PATHS === "undefined") return;
    const questions = spec.items.map((item, index) => {
      const gapId = `${spec.id}.${item.slug}`;
      GAP_TAGS[gapId] = {
        id:gapId, labelEl:item.labelEl, labelEn:item.labelEn,
        explainEl:item.explainEl, explainEn:item.explainEn,
        recommendedToolIds:["ai-help","phet","chatgpt","perplexity"],
        achievementEl:"Ερευνητής της γνώσης", achievementEn:"Knowledge Explorer",
        positiveMessageEl:"Έχεις κατανοήσει αυτή τη βασική έννοια!", positiveMessageEn:"You understand this key idea!",
        skillTagEl:item.labelEl, skillTagEn:item.labelEn,
      };
      LEARNING_PATHS[gapId] = makePath(item.labelEl, item.labelEn);
      return {
        id:`q${index + 1}-${item.slug}`,
        textEl:item.qEl, textEn:item.qEn,
        options:[
          { textEl:item.correctEl, textEn:item.correctEn, isCorrect:true },
          { textEl:item.wrong1El, textEn:item.wrong1En, isCorrect:false, gapTag:gapId },
          { textEl:item.wrong2El, textEn:item.wrong2En, isCorrect:false, gapTag:gapId },
        ],
      };
    });
    const zoneId = spec.zone || "middle";
    QUIZZES[zoneId][spec.id] = {
      id:spec.id, grades:[spec.grade], subjectLabelEl:spec.subjectLabelEl, subjectLabelEn:spec.subjectLabelEn,
      titleEl:`Χάρτης Εξάσκησης: ${spec.shortEl}`, titleEn:`Practice Map: ${spec.shortEn}`,
      introEl:spec.introEl || `${questions.length} σύντομες ερωτήσεις από βασικές έννοιες της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν έχει βαθμό.`,
      introEn:spec.introEn || `${questions.length} short questions on key 2026–27 topics. This is not an exam and has no grade.`,
      questions,
    };
  }

  const Q = (slug,labelEl,labelEn,explainEl,explainEn,qEl,qEn,correctEl,correctEn,wrong1El,wrong1En,wrong2El,wrong2En) => ({slug,labelEl,labelEn,explainEl,explainEn,qEl,qEn,correctEl,correctEn,wrong1El,wrong1En,wrong2El,wrong2En});

  registerDiagnostic({ id:"fysiki-a-gymnasiou", grade:"a", subjectLabelEl:"Φυσική, Α' Γυμνασίου", subjectLabelEn:"Physics, 7th Grade", shortEl:"Φυσική Α' Γυμνασίου", shortEn:"7th Grade Physics", items:[
    Q("mean","Μέση τιμή μετρήσεων","Mean of measurements","Χρειάζεται εξάσκηση στον υπολογισμό μέσης τιμής από επαναλαμβανόμενες μετρήσεις.","Needs practice calculating a mean from repeated measurements.","Τρεις μετρήσεις μήκους είναι 9, 10 και 11 cm. Ποια είναι η μέση τιμή;","Three length measurements are 9, 10 and 11 cm. What is the mean?","10 cm","10 cm","30 cm","30 cm","9 cm","9 cm"),
    Q("density","Πυκνότητα","Density","Συγχέει την πυκνότητα με τη μάζα ή τον όγκο.","Confuses density with mass or volume.","Ένα σώμα έχει μάζα 200 g και όγκο 100 cm³. Ποια είναι η πυκνότητά του;","An object has mass 200 g and volume 100 cm³. What is its density?","2 g/cm³","2 g/cm³","300 g/cm³","300 g/cm³","0,5 g/cm³","0.5 g/cm³"),
    Q("thermal-equilibrium","Θερμική ισορροπία","Thermal equilibrium","Χρειάζεται να συνδέσει τη ροή θερμότητας με την εξίσωση θερμοκρασιών.","Needs to connect heat transfer with equal temperatures.","Πότε δύο σώματα που αγγίζονται βρίσκονται σε θερμική ισορροπία;","When are two touching objects in thermal equilibrium?","Όταν έχουν την ίδια θερμοκρασία.","When they have the same temperature.","Όταν έχουν την ίδια μάζα.","When they have the same mass.","Όταν είναι και τα δύο στερεά.","When both are solids."),
    Q("short-circuit","Ηλεκτρική ασφάλεια","Electrical safety","Δεν αναγνωρίζει τον κίνδυνο ενός βραχυκυκλώματος.","Does not recognise the danger of a short circuit.","Γιατί είναι επικίνδυνο ένα βραχυκύκλωμα;","Why is a short circuit dangerous?","Μπορεί να περάσει πολύ μεγάλο ρεύμα και να προκληθεί υπερθέρμανση.","A very large current can flow and cause overheating.","Επειδή σταματά πάντα κάθε ρεύμα.","Because it always stops all current.","Επειδή κάνει την μπαταρία βαρύτερη.","Because it makes the battery heavier."),
    Q("electromagnet","Ηλεκτρισμός και μαγνητισμός","Electricity and magnetism","Χρειάζεται να κατανοήσει ότι το ηλεκτρικό ρεύμα δημιουργεί μαγνητικό πεδίο.","Needs to understand that electric current creates a magnetic field.","Τι δημιουργείται γύρω από ένα σύρμα όταν το διαρρέει ηλεκτρικό ρεύμα;","What is created around a wire carrying electric current?","Μαγνητικό πεδίο.","A magnetic field.","Μόνο φως.","Only light.","Κενό αέρα.","A vacuum."),
  ] });

  registerDiagnostic({ id:"chimeia-b-gymnasiou", grade:"b", subjectLabelEl:"Χημεία, Β' Γυμνασίου", subjectLabelEn:"Chemistry, 8th Grade", shortEl:"Χημεία Β' Γυμνασίου", shortEn:"8th Grade Chemistry", items:[
    Q("states","Καταστάσεις υλικών","States of matter","Συγχέει τις αλλαγές φυσικής κατάστασης.","Confuses changes of state.","Πώς λέγεται η μετατροπή ενός υγρού σε αέριο από την επιφάνειά του;","What is the change of a liquid into gas from its surface called?","Εξάτμιση.","Evaporation.","Πήξη.","Freezing.","Υγροποίηση.","Condensation."),
    Q("mixtures","Μείγματα και διαλύματα","Mixtures and solutions","Δεν διακρίνει ομογενές από ετερογενές μείγμα.","Cannot distinguish homogeneous from heterogeneous mixtures.","Ποιο είναι ομογενές μείγμα;","Which is a homogeneous mixture?","Αλατόνερο όπου έχει διαλυθεί όλο το αλάτι.","Salt water in which all salt has dissolved.","Νερό με άμμο.","Water with sand.","Λάδι με νερό.","Oil with water."),
    Q("concentration","Περιεκτικότητα διαλύματος","Solution concentration","Χρειάζεται εξάσκηση στην έννοια της επί τοις εκατό περιεκτικότητας.","Needs practice with percentage concentration.","Διάλυμα 10% w/v περιέχει...","A 10% w/v solution contains...","10 g διαλυμένης ουσίας σε 100 mL διαλύματος.","10 g solute in 100 mL solution.","10 mL νερού σε 10 g ουσίας.","10 mL water in 10 g substance.","100 g ουσίας σε 10 mL διαλύματος.","100 g substance in 10 mL solution."),
    Q("atom-molecule","Άτομα και μόρια","Atoms and molecules","Συγχέει το άτομο με το μόριο.","Confuses atoms with molecules.","Ένα μόριο νερού H₂O αποτελείται από...","One water molecule H₂O consists of...","Δύο άτομα υδρογόνου και ένα άτομο οξυγόνου.","Two hydrogen atoms and one oxygen atom.","Δύο μόρια υδρογόνου και δύο οξυγόνου.","Two hydrogen molecules and two oxygen molecules.","Ένα μόνο άτομο.","One atom only."),
    Q("reaction","Χημική αντίδραση","Chemical reaction","Δεν αναγνωρίζει ότι σε χημική αντίδραση σχηματίζονται νέες ουσίες.","Does not recognise that new substances form in a chemical reaction.","Ποιο δείχνει ότι έγινε χημική αντίδραση;","Which indicates a chemical reaction occurred?","Σχηματίστηκαν ουσίες με νέες ιδιότητες.","Substances with new properties formed.","Άλλαξε μόνο το σχήμα ενός στερεού.","Only a solid's shape changed.","Λιώσαμε πάγο και έγινε νερό.","Ice melted into water."),
  ] });

  registerDiagnostic({ id:"geografia-a-gymnasiou", grade:"a", subjectLabelEl:"Γεωλογία:Γεωγραφία, Α' Γυμνασίου", subjectLabelEn:"Geology:Geography, 7th Grade", shortEl:"Γεωγραφία Α' Γυμνασίου", shortEn:"7th Grade Geography", items:[
    Q("coordinates","Γεωγραφικές συντεταγμένες","Geographic coordinates","Συγχέει γεωγραφικό πλάτος και μήκος.","Confuses latitude and longitude.","Το γεωγραφικό πλάτος μετριέται σε σχέση με...","Latitude is measured relative to...","Τον Ισημερινό.","The Equator.","Τον πρώτο μεσημβρινό.","The prime meridian.","Τον Βόρειο Πόλο μόνο.","The North Pole only."),
    Q("scale","Κλίμακα χάρτη","Map scale","Χρειάζεται να συνδέσει απόσταση χάρτη και πραγματική απόσταση.","Needs to connect map distance to real distance.","Σε κλίμακα 1:100.000, 1 cm στον χάρτη αντιστοιχεί σε...","At a 1:100,000 scale, 1 cm on the map represents...","1 km στην πραγματικότητα.","1 km in reality.","100 km στην πραγματικότητα.","100 km in reality.","100 m στην πραγματικότητα.","100 m in reality."),
    Q("plates","Τεκτονικές πλάκες","Tectonic plates","Δεν συνδέει τις κινήσεις πλακών με σεισμούς και ηφαίστεια.","Does not link plate movement with earthquakes and volcanoes.","Οι περισσότεροι σεισμοί συμβαίνουν...","Most earthquakes occur...","Κοντά στα όρια τεκτονικών πλακών.","Near tectonic plate boundaries.","Μόνο στο κέντρο των ηπείρων.","Only at the centres of continents.","Μόνο κάτω από ποτάμια.","Only beneath rivers."),
    Q("water-cycle","Κύκλος νερού","Water cycle","Συγχέει τις βασικές διαδικασίες του κύκλου του νερού.","Confuses key processes in the water cycle.","Ποια διαδικασία μεταφέρει νερό από την επιφάνεια προς την ατμόσφαιρα;","Which process moves water from the surface to the atmosphere?","Η εξάτμιση.","Evaporation.","Η απορροή.","Runoff.","Η κατακρήμνιση.","Precipitation."),
    Q("population-density","Πυκνότητα πληθυσμού","Population density","Συγχέει συνολικό πληθυσμό και πυκνότητα πληθυσμού.","Confuses total population and population density.","Η πυκνότητα πληθυσμού υπολογίζεται ως...","Population density is calculated as...","Πληθυσμός διά έκταση.","Population divided by area.","Έκταση διά πληθυσμό.","Area divided by population.","Πληθυσμός επί έκταση.","Population times area."),
  ] });

  registerDiagnostic({ id:"geografia-b-gymnasiou", grade:"b", subjectLabelEl:"Γεωλογία:Γεωγραφία, Β' Γυμνασίου", subjectLabelEn:"Geology:Geography, 8th Grade", shortEl:"Γεωγραφία Β' Γυμνασίου", shortEn:"8th Grade Geography", items:[
    Q("relative-position","Σχετική θέση","Relative position","Δεν διακρίνει απόλυτη από σχετική θέση.","Cannot distinguish absolute from relative position.","Ποια περιγραφή δείχνει σχετική θέση;","Which description gives a relative position?","Η Ελλάδα βρίσκεται νότια της Βουλγαρίας.","Greece is south of Bulgaria.","Η Αθήνα βρίσκεται περίπου στις 38° Β.","Athens is near 38° N.","Ένα σημείο έχει συντεταγμένες 40° Β, 22° Α.","A point has coordinates 40° N, 22° E."),
    Q("relief","Ανάγλυφο της Ευρώπης","Relief of Europe","Χρειάζεται να συνδέσει γεωλογικές διεργασίες με το ευρωπαϊκό ανάγλυφο.","Needs to connect geological processes with European relief.","Οι Άλπεις σχηματίστηκαν κυρίως από...","The Alps formed mainly through...","Σύγκλιση τεκτονικών πλακών.","Convergence of tectonic plates.","Απόθεση άμμου από ποτάμια μόνο.","Sand deposition by rivers only.","Τήξη παγετώνων μόνο.","Melting glaciers only."),
    Q("climate","Κλίμα της Ευρώπης","Climate of Europe","Δεν συνδέει γεωγραφική θέση και θαλάσσια επίδραση με το κλίμα.","Does not link location and maritime influence with climate.","Τι επηρεάζει έντονα το κλίμα της δυτικής Ευρώπης;","What strongly influences Western Europe's climate?","Ο Ατλαντικός Ωκεανός και τα θαλάσσια ρεύματα.","The Atlantic Ocean and ocean currents.","Μόνο η απόσταση από τον Ισημερινό.","Only distance from the Equator.","Η έλλειψη θαλασσών.","The absence of seas."),
    Q("eu","Ευρωπαϊκή Ένωση","European Union","Συγχέει την Ευρώπη ως ήπειρο με την Ευρωπαϊκή Ένωση.","Confuses Europe as a continent with the European Union.","Ποια πρόταση είναι σωστή;","Which statement is correct?","Δεν ανήκουν όλα τα ευρωπαϊκά κράτη στην Ευρωπαϊκή Ένωση.","Not every European country belongs to the European Union.","Ευρώπη και Ευρωπαϊκή Ένωση είναι ακριβώς το ίδιο.","Europe and the European Union are exactly the same.","Η Ευρωπαϊκή Ένωση είναι ήπειρος.","The European Union is a continent."),
    Q("sectors","Τομείς παραγωγής","Economic sectors","Συγχέει πρωτογενή, δευτερογενή και τριτογενή τομέα.","Confuses primary, secondary and tertiary sectors.","Σε ποιον τομέα ανήκει η μεταποίηση πρώτων υλών σε προϊόντα;","Which sector turns raw materials into products?","Στον δευτερογενή τομέα.","The secondary sector.","Στον πρωτογενή τομέα.","The primary sector.","Στον τριτογενή τομέα.","The tertiary sector."),
  ] });

  registerDiagnostic({ id:"technologia-g-gymnasiou", grade:"c", subjectLabelEl:"Τεχνολογία, Γ' Γυμνασίου", subjectLabelEn:"Technology, 9th Grade", shortEl:"Τεχνολογία Γ' Γυμνασίου", shortEn:"9th Grade Technology", items:[
    Q("hypothesis","Ερευνητική υπόθεση","Research hypothesis","Χρειάζεται να διατυπώνει ελέγξιμη και σαφή υπόθεση.","Needs to formulate a clear, testable hypothesis.","Ποια είναι ελέγξιμη ερευνητική υπόθεση;","Which is a testable research hypothesis?","Αν αυξηθεί το φως, τότε το φυτό θα μεγαλώσει περισσότερο μέσα σε δύο εβδομάδες.","If light increases, the plant will grow more over two weeks.","Τα φυτά είναι ωραία.","Plants are nice.","Ίσως συμβαίνουν πολλά πράγματα.","Perhaps many things happen."),
    Q("variables","Μεταβλητές πειράματος","Experimental variables","Συγχέει ανεξάρτητη, εξαρτημένη και ελεγχόμενες μεταβλητές.","Confuses independent, dependent and controlled variables.","Σε πείραμα για την επίδραση του φωτός στην ανάπτυξη φυτού, ποια είναι η ανεξάρτητη μεταβλητή;","In an experiment on light's effect on plant growth, what is the independent variable?","Η ποσότητα φωτός.","The amount of light.","Το ύψος του φυτού που μετράμε.","The plant height we measure.","Το συμπέρασμα της έρευνας.","The research conclusion."),
    Q("fair-test","Δίκαιη δοκιμή","Fair test","Δεν κρατά σταθερές τις συνθήκες που δεν εξετάζει.","Does not control conditions not being tested.","Για δίκαιη σύγκριση δύο φυτών αλλάζουμε μόνο...","For a fair comparison of two plants we change only...","Τη μεταβλητή που εξετάζουμε.","The variable being tested.","Όλες τις συνθήκες ταυτόχρονα.","All conditions at once.","Το αποτέλεσμα αφού ολοκληρωθεί το πείραμα.","The result after the experiment ends."),
    Q("graph","Γραφική αναπαράσταση δεδομένων","Graphing data","Χρειάζεται να επιλέγει άξονες και μονάδες σύμφωνα με τις μεταβλητές.","Needs to select axes and units based on the variables.","Σε γράφημα ανάπτυξης φυτού με τον χρόνο, στον οριζόντιο άξονα βάζουμε συνήθως...","In a plant-growth-over-time graph, the horizontal axis usually shows...","Τον χρόνο.","Time.","Το τελικό συμπέρασμα.","The final conclusion.","Το όνομα της ομάδας.","The team name."),
    Q("conclusion","Συμπέρασμα έρευνας","Research conclusion","Βγάζει συμπέρασμα χωρίς να το συνδέει με δεδομένα.","Draws conclusions without linking them to data.","Ένα έγκυρο συμπέρασμα πρέπει κυρίως να...","A valid conclusion should mainly...","Απαντά στο ερώτημα χρησιμοποιώντας τα δεδομένα.","Answer the question using the data.","Επαναλαμβάνει μόνο τον τίτλο.","Only repeat the title.","Αγνοεί αποτελέσματα που δεν συμφωνούν με την υπόθεση.","Ignore results that disagree with the hypothesis."),
  ] });

  const highDiagnosticIntroEl = "4 σύντομες διαγνωστικές ερωτήσεις σε βασικές έννοιες του μαθήματος. Βάση αναφοράς είναι η τελευταία πλήρης επίσημη συλλογή οδηγιών· δεν παρουσιάζεται ως επαληθευμένη ύλη 2026–27.";
  const highDiagnosticIntroEn = "4 short diagnostic questions on foundational course concepts. The latest complete official guidance collection is used as a reference; this is not presented as verified 2026–27 scope.";

  registerDiagnostic({ zone:"high", id:"chimeia-a-lykeiou", grade:"a", subjectLabelEl:"Χημεία, Α' Λυκείου", subjectLabelEn:"Chemistry, 10th Grade", shortEl:"Χημεία Α' Λυκείου", shortEn:"10th Grade Chemistry", introEl:highDiagnosticIntroEl, introEn:highDiagnosticIntroEn, items:[
    Q("atom-structure","Δομή ατόμου","Atomic structure","Συγχέει φορτίο και θέση πρωτονίων, νετρονίων και ηλεκτρονίων.","Confuses the charge and location of protons, neutrons and electrons.","Ποιο σωματίδιο έχει αρνητικό φορτίο;","Which particle has a negative charge?","Το ηλεκτρόνιο.","The electron.","Το πρωτόνιο.","The proton.","Το νετρόνιο.","The neutron."),
    Q("periodic-group","Ομάδες περιοδικού πίνακα","Periodic-table groups","Δεν συνδέει την ίδια ομάδα με παρόμοιες χημικές ιδιότητες.","Does not connect membership of the same group with similar chemical properties.","Στοιχεία της ίδιας κύριας ομάδας του περιοδικού πίνακα έχουν συνήθως...","Elements in the same main group of the periodic table usually have...","Παρόμοιες χημικές ιδιότητες.","Similar chemical properties.","Τον ίδιο μαζικό αριθμό.","The same mass number.","Τον ίδιο αριθμό νετρονίων.","The same number of neutrons."),
    Q("bond","Χημικός δεσμός","Chemical bonding","Συγχέει ιοντικό και ομοιοπολικό δεσμό.","Confuses ionic and covalent bonding.","Ο ιοντικός δεσμός συνδέεται κυρίως με...","Ionic bonding mainly involves...","Μεταφορά ηλεκτρονίων και έλξη αντίθετα φορτισμένων ιόντων.","Electron transfer and attraction between oppositely charged ions.","Κοινή χρήση πρωτονίων.","Sharing protons.","Εξαφάνιση ηλεκτρονίων.","Electrons disappearing."),
    Q("equation","Ισοστάθμιση χημικής εξίσωσης","Balancing a chemical equation","Δεν εφαρμόζει τη διατήρηση των ατόμων στην ισοστάθμιση.","Does not apply conservation of atoms when balancing equations.","Γιατί ισοσταθμίζουμε μια χημική εξίσωση;","Why do we balance a chemical equation?","Για να υπάρχει ίδιος αριθμός ατόμων κάθε στοιχείου στα δύο μέλη.","So each element has the same number of atoms on both sides.","Για να αλλάξουμε τους χημικούς τύπους.","To change the chemical formulas.","Για να μη φαίνονται τα προϊόντα.","To hide the products."),
  ] });

  registerDiagnostic({ zone:"high", id:"mathimatika-b-lykeiou", grade:"b", subjectLabelEl:"Μαθηματικά, Β' Λυκείου", subjectLabelEn:"Mathematics, 11th Grade", shortEl:"Μαθηματικά Β' Λυκείου", shortEn:"11th Grade Mathematics", introEl:highDiagnosticIntroEl, introEn:highDiagnosticIntroEn, items:[
    Q("quadratic","Δευτεροβάθμια εξίσωση","Quadratic equations","Χρειάζεται εξάσκηση στην παραγοντοποίηση και στις ρίζες δευτεροβάθμιας εξίσωσης.","Needs practice with factorisation and roots of quadratic equations.","Ποιες είναι οι ρίζες της x² − 5x + 6 = 0;","What are the roots of x² − 5x + 6 = 0?","x = 2 και x = 3","x = 2 and x = 3","x = −2 και x = −3","x = −2 and x = −3","x = 1 και x = 6","x = 1 and x = 6"),
    Q("trigonometry","Βασικές τριγωνομετρικές τιμές","Basic trigonometric values","Δεν ανακαλεί ή δεν αιτιολογεί βασικές τριγωνομετρικές τιμές.","Cannot recall or justify basic trigonometric values.","Ποια είναι η τιμή του ημ30°;","What is sin 30°?","1/2","1/2","√3/2","√3/2","1","1"),
    Q("vectors","Πρόσθεση διανυσμάτων","Vector addition","Συγχέει τις συντεταγμένες στο άθροισμα διανυσμάτων.","Confuses coordinates when adding vectors.","Αν α=(2,1) και β=(−1,3), τότε α+β=...","If a=(2,1) and b=(−1,3), then a+b=...","(1,4)","(1,4)","(3,−2)","(3,−2)","(−2,3)","(−2,3)"),
    Q("slope","Κλίση ευθείας","Slope of a line","Χρειάζεται να συνδέσει την εξίσωση ευθείας με την κλίση της.","Needs to connect a line equation with its slope.","Ποια είναι η κλίση της ευθείας y=3x−2;","What is the slope of y=3x−2?","3","3","−2","−2","1/3","1/3"),
  ] });

  registerDiagnostic({ zone:"high", id:"pliroforiki-a-lykeiou", grade:"a", subjectLabelEl:"Πληροφορική, Α' Λυκείου", subjectLabelEn:"Computer Science, 10th Grade", shortEl:"Πληροφορική Α' Λυκείου", shortEn:"10th Grade Computer Science", introEl:highDiagnosticIntroEl, introEn:highDiagnosticIntroEn, items:[
    Q("algorithm","Έννοια αλγορίθμου","Algorithm concept","Δεν αναγνωρίζει τα βασικά χαρακτηριστικά ενός αλγορίθμου.","Does not recognise the basic properties of an algorithm.","Ένας αλγόριθμος πρέπει να...","An algorithm must...","Αποτελείται από σαφή, πεπερασμένα βήματα.","Consist of clear, finite steps.","Μην τελειώνει ποτέ.","Never terminate.","Δίνει διαφορετικό νόημα σε κάθε βήμα κάθε φορά.","Give each step a different meaning each time."),
    Q("selection","Δομή επιλογής","Selection structure","Συγχέει την επιλογή με την επανάληψη.","Confuses selection with iteration.","Ποια δομή χρησιμοποιούμε όταν μια ενέργεια εξαρτάται από μια συνθήκη;","Which structure is used when an action depends on a condition?","Δομή επιλογής (ΑΝ...ΤΟΤΕ).","Selection (IF...THEN).","Ακολουθία χωρίς συνθήκη.","Sequence with no condition.","Μόνο δομή επανάληψης.","Iteration only."),
    Q("loop","Δομή επανάληψης","Iteration structure","Δεν αναγνωρίζει πότε χρειάζεται επανάληψη εντολών.","Does not recognise when commands need to repeat.","Θέλουμε να εμφανίσουμε τους αριθμούς 1 έως 100. Ποια δομή είναι καταλληλότερη;","We want to display numbers 1 to 100. Which structure is most suitable?","Δομή επανάληψης.","An iteration structure.","Μία μόνο εντολή επιλογής χωρίς επανάληψη.","A single selection with no iteration.","Καμία αλγοριθμική δομή.","No algorithmic structure."),
    Q("phishing","Ψηφιακή ασφάλεια και phishing","Digital safety and phishing","Δεν αναγνωρίζει βασικές ενδείξεις ηλεκτρονικής εξαπάτησης.","Does not recognise basic signs of phishing.","Λαμβάνεις μήνυμα που ζητά επειγόντως τον κωδικό σου μέσω άγνωστου συνδέσμου. Τι κάνεις;","A message urgently asks for your password through an unknown link. What do you do?","Δεν ανοίγω τον σύνδεσμο και ελέγχω τον αποστολέα από επίσημο κανάλι.","Do not open the link and verify the sender through an official channel.","Στέλνω αμέσως τον κωδικό.","Send the password immediately.","Προωθώ το μήνυμα σε όλους.","Forward the message to everyone."),
  ] });
})();
