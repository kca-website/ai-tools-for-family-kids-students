/**
 * gel-2026-2027-update.js — FINAL v2.0.0 (2026-08-31)
 * ------------------------------------------------------------
 * Curriculum and diagnostic refresh for Greek General Lyceum (ΓΕΛ).
 *
 * Load order:
 *   curriculum-2026-2027-expansion.js
 *   official-curriculum-data.js
 *   gel-2026-2027-update.js   <-- this file
 *   ... tutor.js / app.js
 *
 * Sources:
 * - Annual teaching guidance 2026-27 (ΥΠΑΙΘΑ/ΙΕΠ collection):
 *   https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/
 * - Written-exam syllabus A/B/C General Lyceum 2026-27:
 *   https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027
 * - Panhellenic examinations syllabus 2027:
 *   https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2
 *
 * Design:
 * - Written A/B syllabus and verified Panhellenic scope are exposed as
 *   curriculum sections.
 * - Subjects whose detailed annual scope is published but not encoded
 *   paragraph-by-paragraph are marked as "detailed guidance map", not as
 *   verbatim official section titles.
 * - Every Tutor topic gets a learning path.
 * - Misaligned diagnostics from the previous expansion are replaced.
 * ------------------------------------------------------------
 */
(function () {
  "use strict";

  const VERSION = "2.0.0";
  const SCHOOL_YEAR = "2026-2027";
  const VERIFIED_ON = "2026-08-30";
  const DIDE_GUIDANCE = "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/";
  const GEL_EXAM = "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027";
  const PANHELLENIC_2027 = "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2";

  const SUBJECT_DATA = {
  "a": [
    {
      "id": "neoelliniki-a-lykeiou",
      "grade": "a",
      "labelEl": "Νεοελληνική Γλώσσα & Λογοτεχνία, Α' Λυκείου",
      "labelEn": "Modern Greek Language & Literature, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Γλώσσα, γλωσσική ποικιλία και οπτική γωνία",
          "Language, variation and point of view"
        ],
        [
          "Δημιουργικότητα της γλώσσας",
          "Language creativity"
        ],
        [
          "Γλωσσομάθεια και εκμάθηση ξένων γλωσσών",
          "Foreign-language learning"
        ],
        [
          "Αναλφαβητισμός",
          "Illiteracy"
        ],
        [
          "Διάλογος και επικοινωνία",
          "Dialogue and communication"
        ],
        [
          "Εφηβεία",
          "Adolescence"
        ],
        [
          "Αγάπη και ανθρώπινες σχέσεις",
          "Love and human relationships"
        ],
        [
          "Ενδυμασία και μόδα",
          "Clothing and fashion"
        ],
        [
          "Γηρατειά και νεότητα",
          "Old age and youth"
        ],
        [
          "Κωμικό και γέλιο",
          "Humour and laughter"
        ],
        [
          "Λογοτεχνία: φύλα και ταυτότητες",
          "Literature: gender and identities"
        ],
        [
          "Λογοτεχνία: παράδοση και μοντερνισμός στη νεοελληνική ποίηση",
          "Literature: tradition and modernism in modern Greek poetry"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "ekthesi-a-lykeiou"
    },
    {
      "id": "istoria-a-lykeiou",
      "grade": "a",
      "labelEl": "Ιστορία, Α' Λυκείου",
      "labelEn": "History, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Αίγυπτος: οικονομική, κοινωνική και πολιτική οργάνωση",
          "Egypt: economic, social and political organisation"
        ],
        [
          "Αίγυπτος: πολιτισμός",
          "Egyptian civilisation"
        ],
        [
          "Μυκηναϊκός πολιτισμός",
          "Mycenaean civilisation"
        ],
        [
          "Ομηρική εποχή και πρώτος ελληνικός αποικισμός",
          "Homeric age and first Greek colonisation"
        ],
        [
          "Ομηρική εποχή: οικονομική, κοινωνική και πολιτική οργάνωση",
          "Homeric age: economic, social and political organisation"
        ],
        [
          "Ομηρική εποχή: πολιτισμός",
          "Homeric age: civilisation"
        ],
        [
          "Αρχαϊκή εποχή και πόλη-κράτος",
          "Archaic age and the polis"
        ],
        [
          "Κλασική εποχή: Δηλιακή Συμμαχία και αθηναϊκή ηγεμονία",
          "Classical age: Delian League and Athenian hegemony"
        ],
        [
          "Περικλής και αθηναϊκή δημοκρατία",
          "Pericles and Athenian democracy"
        ],
        [
          "Πελοποννησιακός πόλεμος",
          "Peloponnesian War"
        ],
        [
          "Κρίση της πόλης-κράτους και πανελλήνια ιδέα",
          "Crisis of the polis and Panhellenic idea"
        ],
        [
          "Φίλιππος Β΄ και άνοδος της Μακεδονίας",
          "Philip II and the rise of Macedon"
        ],
        [
          "Μέγας Αλέξανδρος και εκστρατεία στην Ανατολή",
          "Alexander the Great and the eastern campaign"
        ],
        [
          "Πολιτισμός κλασικών χρόνων",
          "Classical civilisation"
        ],
        [
          "Ελληνιστικός κόσμος: βασικά χαρακτηριστικά",
          "Hellenistic world: key characteristics"
        ],
        [
          "Ελληνιστικά κέντρα και ελληνιστική κοινή",
          "Hellenistic centres and Koine Greek"
        ],
        [
          "Ίδρυση και οργάνωση της Ρώμης",
          "Foundation and organisation of Rome"
        ],
        [
          "Ρωμαϊκή πολιτεία και κοινωνία",
          "Roman Republic and society"
        ],
        [
          "Τιβέριος και Γάιος Γράκχος",
          "Tiberius and Gaius Gracchus"
        ],
        [
          "Οκταβιανός Αύγουστος: συγκέντρωση εξουσίας και μεταρρυθμίσεις",
          "Augustus: consolidation of power and reforms"
        ],
        [
          "Διάδοχοι του Αυγούστου και αυτοκρατορικό σύστημα",
          "Successors of Augustus and imperial system"
        ],
        [
          "Κρίση του 3ου αιώνα μ.Χ.",
          "Crisis of the 3rd century CE"
        ],
        [
          "Διοκλητιανός και αναδιοργάνωση της αυτοκρατορίας",
          "Diocletian and imperial reorganisation"
        ],
        [
          "Μέγας Κωνσταντίνος και εκχριστιανισμός",
          "Constantine and Christianisation"
        ],
        [
          "Εξελληνισμός του Ανατολικού Ρωμαϊκού κράτους",
          "Hellenisation of the Eastern Roman state"
        ],
        [
          "Ελληνοχριστιανική οικουμένη",
          "Greco-Christian ecumene"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "istoria-a-lykeiou"
    },
    {
      "id": "politiki-paideia-a-lykeiou",
      "grade": "a",
      "labelEl": "Πολιτική Παιδεία, Α' Λυκείου",
      "labelEn": "Civic Education, 10th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Κοινωνία και κοινωνική οργάνωση",
          "Society and social organisation"
        ],
        [
          "Κοινωνικοποίηση και κοινωνικοί θεσμοί",
          "Socialisation and social institutions"
        ],
        [
          "Κοινωνικές ομάδες, ανισότητες και στερεότυπα",
          "Social groups, inequalities and stereotypes"
        ],
        [
          "Το κράτος και οι λειτουργίες του",
          "The state and its functions"
        ],
        [
          "Πολίτης, πολιτειότητα και δημοκρατία",
          "Citizenship and democracy"
        ],
        [
          "Σύνταγμα και διάκριση των εξουσιών",
          "Constitution and separation of powers"
        ],
        [
          "Ατομικά, πολιτικά και κοινωνικά δικαιώματα",
          "Civil, political and social rights"
        ],
        [
          "Υποχρεώσεις και ενεργός συμμετοχή του πολίτη",
          "Duties and active citizenship"
        ],
        [
          "Βασικές οικονομικές ανάγκες και αγαθά",
          "Basic economic needs and goods"
        ],
        [
          "Παραγωγικοί συντελεστές και παραγωγή",
          "Factors of production and production"
        ],
        [
          "Αγορά, τιμές και ανταγωνισμός",
          "Markets, prices and competition"
        ],
        [
          "Χρήμα, τράπεζες και οικονομικές συναλλαγές",
          "Money, banks and economic transactions"
        ],
        [
          "Δημόσια οικονομικά και φορολογία",
          "Public finance and taxation"
        ],
        [
          "Ευρωπαϊκή Ένωση και παγκοσμιοποίηση",
          "European Union and globalisation"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "politiki-paideia-a-lykeiou"
    },
    {
      "id": "archaia-a-lykeiou",
      "grade": "a",
      "labelEl": "Αρχαία Ελληνική Γλώσσα & Γραμματεία, Α' Λυκείου",
      "labelEn": "Ancient Greek Language & Literature, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Θουκυδίδης: βίος, έργο, μέθοδος, δομή, γλώσσα και ύφος",
          "Thucydides: life, work, method, structure, language and style"
        ],
        [
          "Ξενοφών: βίος, έργο, ενδιαφέροντα και ιδέες",
          "Xenophon: life, work, interests and ideas"
        ],
        [
          "Θουκυδίδη Ιστορίαι Γ΄: Κερκυραϊκά, κεφ. 70–83 με τις επίσημες διακρίσεις μετάφρασης",
          "Thucydides Histories III: Corcyra, ch. 70–83 with official translation distinctions"
        ],
        [
          "Θεματικός άξονας: δύναμη και δίκαιο – ηθική του πολέμου",
          "Theme: power and justice – ethics of war"
        ],
        [
          "Ξενοφώντος Ελληνικά Β΄: Αιγός Ποταμοί και κατάλυση δημοκρατίας, επιλεγμένα χωρία",
          "Xenophon Hellenica II: Aegospotami and fall of democracy, selected passages"
        ],
        [
          "Θεματικός άξονας: στρατιωτική υπεροχή και πολιτική κυριαρχία",
          "Theme: military superiority and political domination"
        ],
        [
          "Γ΄ κλίση ουσιαστικών: φωνηεντόληκτα και υγρόληκτα",
          "Third-declension nouns: vowel and liquid stems"
        ],
        [
          "Γ΄ κλίση επιθέτων και μετοχών",
          "Third-declension adjectives and participles"
        ],
        [
          "Ανώμαλα παραθετικά επιθέτων",
          "Irregular adjective comparison"
        ],
        [
          "Κτητικές αντωνυμίες",
          "Possessive pronouns"
        ],
        [
          "Συνηρημένα ρήματα -άω, -έω, -όω",
          "Contract verbs -ao, -eo, -oo"
        ],
        [
          "Β΄ αόριστος",
          "Second aorist"
        ],
        [
          "Παθητικός μέλλοντας και αόριστος",
          "Passive future and aorist"
        ],
        [
          "Υγρόληκτα και ενρινόληκτα ρήματα",
          "Liquid and nasal stem verbs"
        ],
        [
          "Μέλλοντας ρημάτων σε -ίζω",
          "Future of verbs in -izo"
        ],
        [
          "Συντελικοί χρόνοι συμφωνόληκτων ρημάτων",
          "Perfect-system forms of consonant-stem verbs"
        ],
        [
          "Κατηγορούμενο και γενική κατηγορηματική",
          "Predicate and predicative genitive"
        ],
        [
          "Αντικείμενο άμεσο και έμμεσο – κατηγορούμενο του αντικειμένου",
          "Direct/indirect object and object complement"
        ],
        [
          "Απαρέμφατο και απρόσωπη σύνταξη",
          "Infinitive and impersonal constructions"
        ],
        [
          "Μετοχές και συντακτικές λειτουργίες",
          "Participles and syntactic functions"
        ],
        [
          "Σύγκριση και β΄ όρος σύγκρισης",
          "Comparison and second term of comparison"
        ],
        [
          "Ονοματικοί και επιρρηματικοί προσδιορισμοί",
          "Nominal and adverbial modifiers"
        ],
        [
          "Παρατακτική και υποτακτική σύνδεση",
          "Coordination and subordination"
        ],
        [
          "Ονοματικές, επιρρηματικές και υποθετικές προτάσεις",
          "Noun, adverbial and conditional clauses"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "archaia-a-lykeiou"
    },
    {
      "id": "thriskeftika-a-lykeiou",
      "grade": "a",
      "labelEl": "Θρησκευτικά, Α' Λυκείου",
      "labelEn": "Religious Studies, 10th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Αναζήτηση νοήματος και θρησκευτική εμπειρία",
          "Search for meaning and religious experience"
        ],
        [
          "Ο Θεός στην ορθόδοξη χριστιανική παράδοση",
          "God in Orthodox Christian tradition"
        ],
        [
          "Πρόσωπο, ελευθερία και ευθύνη",
          "Personhood, freedom and responsibility"
        ],
        [
          "Προσευχή, λατρεία και εκκλησιαστική κοινότητα",
          "Prayer, worship and church community"
        ],
        [
          "Αγάπη, συγχώρηση και ανθρώπινες σχέσεις",
          "Love, forgiveness and human relationships"
        ],
        [
          "Η Εκκλησία στον σύγχρονο κόσμο",
          "The Church in the modern world"
        ],
        [
          "Διάλογος με άλλες χριστιανικές παραδόσεις και θρησκείες",
          "Dialogue with other Christian traditions and religions"
        ],
        [
          "Θρησκεία, πολιτισμός και κοινωνία",
          "Religion, culture and society"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/"
    },
    {
      "id": "fysiki-a-lykeiou",
      "grade": "a",
      "labelEl": "Φυσική, Α' Λυκείου",
      "labelEn": "Physics, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "1.1.5 Ταχύτητα στην ευθύγραμμη ομαλή κίνηση",
          "Speed in uniform rectilinear motion"
        ],
        [
          "1.1.6 Μέση ταχύτητα",
          "Average speed"
        ],
        [
          "1.1.7 Στιγμιαία ταχύτητα",
          "Instantaneous speed"
        ],
        [
          "1.1.8 Επιτάχυνση στην ευθύγραμμη ομαλά μεταβαλλόμενη κίνηση",
          "Acceleration in uniformly varied motion"
        ],
        [
          "1.1.9 Εξισώσεις ταχύτητας και θέσης στην ομαλά μεταβαλλόμενη κίνηση",
          "Velocity and position equations in uniformly varied motion"
        ],
        [
          "1.2.1 Η έννοια της δύναμης",
          "Concept of force"
        ],
        [
          "1.2.2 Σύνθεση συγγραμμικών δυνάμεων",
          "Composition of collinear forces"
        ],
        [
          "1.2.3 Πρώτος νόμος του Νεύτωνα",
          "Newton's first law"
        ],
        [
          "1.2.4 Δεύτερος νόμος του Νεύτωνα",
          "Newton's second law"
        ],
        [
          "1.2.5 Βάρος",
          "Weight"
        ],
        [
          "1.2.6 Μάζα",
          "Mass"
        ],
        [
          "1.2.7 Ελεύθερη πτώση",
          "Free fall"
        ],
        [
          "1.3.1 Τρίτος νόμος του Νεύτωνα",
          "Newton's third law"
        ],
        [
          "1.3.2 Δυνάμεις επαφής και από απόσταση",
          "Contact and non-contact forces"
        ],
        [
          "1.3.3 Σύνθεση δυνάμεων στο επίπεδο",
          "Composition of coplanar forces"
        ],
        [
          "1.3.4 Ανάλυση δύναμης σε συνιστώσες",
          "Resolving a force into components"
        ],
        [
          "1.3.5 Συνισταμένη πολλών συνεπίπεδων δυνάμεων",
          "Resultant of multiple coplanar forces"
        ],
        [
          "1.3.6 Ισορροπία σώματος",
          "Equilibrium of a body"
        ],
        [
          "1.3.7 Τριβή",
          "Friction"
        ],
        [
          "1.3.9 Δεύτερος νόμος του Νεύτωνα σε διανυσματική/αλγεβρική μορφή",
          "Newton's second law in vector/algebraic form"
        ],
        [
          "2.1.1 Έργο δύναμης",
          "Work done by a force"
        ],
        [
          "2.1.2 Έργο βάρους και μεταβολή κινητικής ενέργειας",
          "Work of gravity and change in kinetic energy"
        ],
        [
          "2.1.3 Δυναμική ενέργεια",
          "Potential energy"
        ],
        [
          "2.1.4 Μηχανική ενέργεια",
          "Mechanical energy"
        ],
        [
          "2.1.5 Συντηρητικές δυνάμεις",
          "Conservative forces"
        ],
        [
          "2.1.6 Ισχύς",
          "Power"
        ],
        [
          "2.1.8 Τριβή και μηχανική ενέργεια",
          "Friction and mechanical energy"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "fysiki-a-lykeiou"
    },
    {
      "id": "chimeia-a-lykeiou",
      "grade": "a",
      "labelEl": "Χημεία, Α' Λυκείου",
      "labelEn": "Chemistry, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "1.1 Χημεία: σημασία και εφαρμογές",
          "Chemistry: importance and applications"
        ],
        [
          "1.2 Μάζα, όγκος, πυκνότητα και μετρήσεις",
          "Mass, volume, density and measurements"
        ],
        [
          "1.3 Δομή ατόμου – ατομικός και μαζικός αριθμός – ισότοπα",
          "Atomic structure – atomic and mass number – isotopes"
        ],
        [
          "1.5 Διαλύματα, συγκέντρωση και διαλυτότητα",
          "Solutions, concentration and solubility"
        ],
        [
          "2.1 Ηλεκτρονιακή δομή ατόμου",
          "Electronic structure of the atom"
        ],
        [
          "2.2 Περιοδικός πίνακας",
          "Periodic table"
        ],
        [
          "2.3 Ιοντικός και ομοιοπολικός δεσμός",
          "Ionic and covalent bonding"
        ],
        [
          "2.4 Αριθμός οξείδωσης, χημικοί τύποι και ονοματολογία",
          "Oxidation number, formulas and nomenclature"
        ],
        [
          "3.3 Οξείδια",
          "Oxides"
        ],
        [
          "3.5 Χημικές αντιδράσεις (με τις επίσημες εξαιρέσεις)",
          "Chemical reactions (with official exclusions)"
        ],
        [
          "3.6 Οξέα, βάσεις, οξείδια, άλατα και εξουδετέρωση",
          "Acids, bases, oxides, salts and neutralisation"
        ],
        [
          "4.1 Σχετική ατομική/μοριακή μάζα – mol – αριθμός Avogadro – γραμμομοριακός όγκος",
          "Relative atomic/molecular mass – mole – Avogadro number – molar gas volume"
        ],
        [
          "4.2 Καταστατική εξίσωση ιδανικών αερίων",
          "Ideal gas equation"
        ],
        [
          "4.3 Συγκέντρωση διαλύματος – αραίωση και ανάμιξη",
          "Solution concentration – dilution and mixing"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "chimeia-a-lykeiou"
    },
    {
      "id": "biologia-a-lykeiou",
      "grade": "a",
      "labelEl": "Βιολογία, Α' Λυκείου",
      "labelEn": "Biology, 10th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Κύτταρα, ιστοί, όργανα και συστήματα οργάνων",
          "Cells, tissues, organs and organ systems"
        ],
        [
          "Ερειστικό σύστημα: οστά και αρθρώσεις",
          "Skeletal system: bones and joints"
        ],
        [
          "Μυϊκό σύστημα και κίνηση",
          "Muscular system and movement"
        ],
        [
          "Πεπτικό σύστημα και θρέψη",
          "Digestive system and nutrition"
        ],
        [
          "Κυκλοφορικό σύστημα: αίμα, καρδιά και αγγεία",
          "Circulatory system: blood, heart and vessels"
        ],
        [
          "Λεμφικό σύστημα",
          "Lymphatic system"
        ],
        [
          "Αναπνευστικό σύστημα και ανταλλαγή αερίων",
          "Respiratory system and gas exchange"
        ],
        [
          "Απεκκριτικό σύστημα και νεφροί",
          "Excretory system and kidneys"
        ],
        [
          "Νευρικό σύστημα και νευρική ρύθμιση",
          "Nervous system and neural regulation"
        ],
        [
          "Αισθητήρια όργανα",
          "Sense organs"
        ],
        [
          "Ενδοκρινείς αδένες και ορμόνες",
          "Endocrine glands and hormones"
        ],
        [
          "Αναπαραγωγικό σύστημα",
          "Reproductive system"
        ],
        [
          "Ανάπτυξη και αναπαραγωγή του ανθρώπου",
          "Human development and reproduction"
        ],
        [
          "Ομοιόσταση και συντονισμός λειτουργιών",
          "Homeostasis and coordination of functions"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "biologia-a-lykeiou"
    },
    {
      "id": "algebra-a-lykeiou",
      "grade": "a",
      "labelEl": "Άλγεβρα, Α' Λυκείου",
      "labelEn": "Algebra, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Ε2 Σύνολα",
          "Sets"
        ],
        [
          "2.1 Πράξεις και ιδιότητες πραγματικών αριθμών",
          "Operations and properties of real numbers"
        ],
        [
          "2.2 Διάταξη πραγματικών αριθμών",
          "Ordering real numbers"
        ],
        [
          "2.3 Απόλυτη τιμή",
          "Absolute value"
        ],
        [
          "2.4 Ρίζες πραγματικών αριθμών",
          "Roots of real numbers"
        ],
        [
          "3.1 Εξισώσεις πρώτου βαθμού",
          "Linear equations"
        ],
        [
          "3.2 Εξισώσεις της μορφής x^ν = α",
          "Equations of the form x^n = a"
        ],
        [
          "3.3 Εξισώσεις δευτέρου βαθμού",
          "Quadratic equations"
        ],
        [
          "4.1 Ανισώσεις πρώτου βαθμού",
          "Linear inequalities"
        ],
        [
          "4.2 Ανισώσεις δευτέρου βαθμού",
          "Quadratic inequalities"
        ],
        [
          "5.1 Ακολουθίες",
          "Sequences"
        ],
        [
          "5.2 Αριθμητική πρόοδος",
          "Arithmetic progression"
        ],
        [
          "5.3 Γεωμετρική πρόοδος",
          "Geometric progression"
        ],
        [
          "6.1 Η έννοια της συνάρτησης",
          "Concept of a function"
        ],
        [
          "6.2 Γραφική παράσταση συνάρτησης",
          "Graph of a function"
        ],
        [
          "6.3 Η συνάρτηση f(x)=αx+β",
          "The function f(x)=ax+b"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "mathimatika-a-lykeiou"
    },
    {
      "id": "geometria-a-lykeiou",
      "grade": "a",
      "labelEl": "Γεωμετρία, Α' Λυκείου",
      "labelEn": "Geometry, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "2.16 Σχέσεις μεταξύ γωνιών",
          "Relations between angles"
        ],
        [
          "3.1 Είδη και στοιχεία τριγώνου",
          "Types and elements of triangles"
        ],
        [
          "3.2–3.4 Κριτήρια ισότητας τριγώνων",
          "Triangle congruence criteria"
        ],
        [
          "3.5 Μοναδικότητα καθέτου",
          "Uniqueness of perpendicular"
        ],
        [
          "3.6 Ισότητα ορθογωνίων τριγώνων",
          "Congruence of right triangles"
        ],
        [
          "3.7 Κύκλος – μεσοκάθετος – διχοτόμος",
          "Circle – perpendicular bisector – angle bisector"
        ],
        [
          "3.10 Εξωτερική γωνία τριγώνου",
          "Exterior angle of a triangle"
        ],
        [
          "3.11 Σχέσεις πλευρών και γωνιών τριγώνου",
          "Relations between triangle sides and angles"
        ],
        [
          "3.12 Τριγωνική ανισότητα",
          "Triangle inequality"
        ],
        [
          "3.14 Σχετικές θέσεις ευθείας και κύκλου",
          "Relative positions of line and circle"
        ],
        [
          "3.15 Εφαπτόμενα τμήματα",
          "Tangent segments"
        ],
        [
          "3.16 Σχετικές θέσεις δύο κύκλων",
          "Relative positions of two circles"
        ],
        [
          "3.17 Βασικές γεωμετρικές κατασκευές",
          "Basic geometric constructions"
        ],
        [
          "3.18 Κατασκευές τριγώνων",
          "Triangle constructions"
        ],
        [
          "4.2 Παράλληλες ευθείες και τέμνουσα",
          "Parallel lines and a transversal"
        ],
        [
          "4.4 Γωνίες με πλευρές παράλληλες",
          "Angles with parallel sides"
        ],
        [
          "4.5 Αξιοσημείωτοι κύκλοι τριγώνου",
          "Notable circles of a triangle"
        ],
        [
          "4.6 Άθροισμα γωνιών τριγώνου",
          "Sum of triangle angles"
        ],
        [
          "4.8 Άθροισμα γωνιών πολυγώνου",
          "Sum of polygon angles"
        ],
        [
          "5.2 Παραλληλόγραμμο",
          "Parallelogram"
        ],
        [
          "5.3 Ορθογώνιο",
          "Rectangle"
        ],
        [
          "5.4 Ρόμβος",
          "Rhombus"
        ],
        [
          "5.5 Τετράγωνο",
          "Square"
        ],
        [
          "5.6 Εφαρμογές στα τρίγωνα",
          "Applications to triangles"
        ],
        [
          "5.7 Βαρύκεντρο",
          "Centroid"
        ],
        [
          "5.8 Ορθόκεντρο",
          "Orthocentre"
        ],
        [
          "5.9 Ιδιότητα ορθογωνίου τριγώνου",
          "Right-triangle property"
        ],
        [
          "5.10 Τραπέζιο",
          "Trapezoid"
        ],
        [
          "5.11 Ισοσκελές τραπέζιο",
          "Isosceles trapezoid"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "geometria-a-lykeiou"
    },
    {
      "id": "pliroforiki-a-lykeiou",
      "grade": "a",
      "labelEl": "Εφαρμογές Πληροφορικής, Α' Λυκείου",
      "labelEn": "Computer Applications, 10th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Πληροφορική και ψηφιακές εφαρμογές στην καθημερινή ζωή",
          "Computing and digital applications in everyday life"
        ],
        [
          "Επίλυση προβλήματος και σχεδιασμός ψηφιακού έργου",
          "Problem solving and digital project design"
        ],
        [
          "Υπηρεσίες Παγκόσμιου Ιστού και Διαδικτύου",
          "Web and Internet services"
        ],
        [
          "HTML και βασική δημιουργία ιστοσελίδας",
          "HTML and basic web-page creation"
        ],
        [
          "Web 2.0 και κοινωνικά δίκτυα",
          "Web 2.0 and social networks"
        ],
        [
          "Υπολογιστικό νέφος (cloud computing)",
          "Cloud computing"
        ],
        [
          "Συνεργατικά έγγραφα και εργαλεία",
          "Collaborative documents and tools"
        ],
        [
          "Ψηφιακό περιεχόμενο και πολυμέσα",
          "Digital content and multimedia"
        ],
        [
          "Πνευματικά δικαιώματα και άδειες χρήσης",
          "Copyright and licences"
        ],
        [
          "Προσωπικά δεδομένα και ιδιωτικότητα",
          "Personal data and privacy"
        ],
        [
          "Ψηφιακή ταυτότητα και διαδικτυακή ασφάλεια",
          "Digital identity and online safety"
        ],
        [
          "Υπεύθυνη διαδικτυακή επικοινωνία",
          "Responsible online communication"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "pliroforiki-a-lykeiou"
    },
    {
      "id": "english-a-lykeiou",
      "grade": "a",
      "labelEl": "Αγγλικά, Α' Λυκείου",
      "labelEn": "English, 10th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Unit 2 — A refugee’s dreamland",
          "Unit 2 — A refugee’s dreamland"
        ],
        [
          "Unit 3 — On duty",
          "Unit 3 — On duty"
        ],
        [
          "Unit 4 — Vincent Van Gogh",
          "Unit 4 — Vincent Van Gogh"
        ],
        [
          "Unit 5 — Animal rights",
          "Unit 5 — Animal rights"
        ],
        [
          "Unit 6 — Fast fashion",
          "Unit 6 — Fast fashion"
        ],
        [
          "Unit 7 — Pride and Prejudice",
          "Unit 7 — Pride and Prejudice"
        ],
        [
          "Unit 8 — Social media",
          "Unit 8 — Social media"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "english-a-lykeiou"
    }
  ],
  "b": [
    {
      "id": "neoelliniki-b-lykeiou",
      "grade": "b",
      "labelEl": "Νεοελληνική Γλώσσα & Λογοτεχνία, Β' Λυκείου",
      "labelEn": "Modern Greek Language & Literature, 11th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Πληροφόρηση, είδηση και δημοσιογραφικός λόγος",
          "Information, news and journalistic discourse"
        ],
        [
          "Μέσα ενημέρωσης και αξιοπιστία πηγών",
          "Media and source reliability"
        ],
        [
          "Εργασία, επάγγελμα και επαγγελματικός προσανατολισμός",
          "Work, profession and career orientation"
        ],
        [
          "Στερεότυπα, προκαταλήψεις και κοινωνικές διακρίσεις",
          "Stereotypes, prejudice and social discrimination"
        ],
        [
          "Ρατσισμός και ανθρώπινα δικαιώματα",
          "Racism and human rights"
        ],
        [
          "Ελεύθερος χρόνος και ψυχαγωγία",
          "Leisure and entertainment"
        ],
        [
          "Τέχνη και πολιτισμός",
          "Art and culture"
        ],
        [
          "Επιστήμη και τεχνολογία",
          "Science and technology"
        ],
        [
          "Ψηφιακή επικοινωνία και κοινωνικά δίκτυα",
          "Digital communication and social networks"
        ],
        [
          "Περιβάλλον και βιώσιμη ανάπτυξη",
          "Environment and sustainable development"
        ],
        [
          "Επιχειρηματολογία: θέση, τεκμήρια και αντίλογος",
          "Argumentation: claim, evidence and counterargument"
        ],
        [
          "Οργάνωση παραγράφου και συνοχή κειμένου",
          "Paragraph organisation and text cohesion"
        ],
        [
          "Περίληψη και μετασχηματισμός πληροφοριών",
          "Summary and transformation of information"
        ],
        [
          "Λογοτεχνική ερμηνεία με κειμενικούς δείκτες",
          "Literary interpretation using textual evidence"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "ekthesi-b-lykeiou"
    },
    {
      "id": "istoria-b-lykeiou",
      "grade": "b",
      "labelEl": "Ιστορία, Β' Λυκείου",
      "labelEn": "History, 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Εσωτερική αναδιοργάνωση του Βυζαντίου",
          "Internal reorganisation of Byzantium"
        ],
        [
          "Εξελληνισμός του κράτους",
          "Hellenisation of the state"
        ],
        [
          "Εμφάνιση και εξάπλωση του Ισλάμ",
          "Rise and spread of Islam"
        ],
        [
          "Εικονομαχία",
          "Iconoclasm"
        ],
        [
          "Σκλαβηνίες και εγκαταστάσεις Σλάβων",
          "Sklaviniai and Slavic settlements"
        ],
        [
          "Καρολίδες και άνοδος της φραγκικής δύναμης",
          "Carolingians and rise of Frankish power"
        ],
        [
          "Το πρόβλημα των δύο αυτοκρατοριών",
          "The problem of the two empires"
        ],
        [
          "Προοίμιο της ακμής του Βυζαντίου",
          "Prelude to Byzantine prosperity"
        ],
        [
          "Βυζαντινή κοινωνία",
          "Byzantine society"
        ],
        [
          "Βυζαντινή διπλωματία",
          "Byzantine diplomacy"
        ],
        [
          "Σχίσμα των Εκκλησιών",
          "Schism of the Churches"
        ],
        [
          "Φεουδαρχικό σύστημα",
          "Feudal system"
        ],
        [
          "Οικονομικές μεταβολές στη Δυτική Ευρώπη",
          "Economic changes in Western Europe"
        ],
        [
          "Σταυροφορίες: αίτια και χαρακτήρας",
          "Crusades: causes and character"
        ],
        [
          "Δ΄ Σταυροφορία και άλωση της Κωνσταντινούπολης το 1204",
          "Fourth Crusade and sack of Constantinople in 1204"
        ],
        [
          "Ελληνικά κράτη: Τραπεζούντα, Ήπειρος και Νίκαια",
          "Greek successor states: Trebizond, Epirus and Nicaea"
        ],
        [
          "Οθωμανοί και άνοδος της οθωμανικής δύναμης",
          "Ottomans and rise of Ottoman power"
        ],
        [
          "Άλωση της Κωνσταντινούπολης το 1453",
          "Fall of Constantinople in 1453"
        ],
        [
          "Κρίση της φεουδαρχίας",
          "Crisis of feudalism"
        ],
        [
          "Αναγέννηση και Ανθρωπισμός",
          "Renaissance and Humanism"
        ],
        [
          "Μεγάλες γεωγραφικές ανακαλύψεις",
          "European voyages of discovery"
        ],
        [
          "Ευρώπη μετά τις ανακαλύψεις",
          "Europe after the discoveries"
        ],
        [
          "Κρίση της Καθολικής Εκκλησίας",
          "Crisis of the Catholic Church"
        ],
        [
          "Λούθηρος και Μεταρρύθμιση",
          "Luther and the Reformation"
        ],
        [
          "Αντιμεταρρύθμιση",
          "Counter-Reformation"
        ],
        [
          "Συνέπειες της Μεταρρύθμισης",
          "Consequences of the Reformation"
        ],
        [
          "Διαφωτισμός",
          "Enlightenment"
        ],
        [
          "Οικονομικές θεωρίες του Διαφωτισμού",
          "Economic theories of the Enlightenment"
        ],
        [
          "Αμερικανικός Πόλεμος Ανεξαρτησίας και ίδρυση των ΗΠΑ",
          "American War of Independence and founding of the USA"
        ],
        [
          "Γαλλική Επανάσταση: έκρηξη και πρώτες φάσεις",
          "French Revolution: outbreak and early phases"
        ],
        [
          "Ναπολεόντεια περίοδος",
          "Napoleonic era"
        ],
        [
          "Χαρακτήρας και έργο της Γαλλικής Επανάστασης",
          "Character and achievements of the French Revolution"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "istoria-b-lykeiou"
    },
    {
      "id": "archaia-b-lykeiou",
      "grade": "b",
      "labelEl": "Αρχαία Ελληνικά, Β' Λυκείου",
      "labelEn": "Ancient Greek, 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Ρητορική: φυσική ευγλωττία και γένεση συστηματικής ρητορικής",
          "Rhetoric: natural eloquence and birth of systematic rhetoric"
        ],
        [
          "Ρητορική και σοφιστική",
          "Rhetoric and sophistic"
        ],
        [
          "Είδη αττικού ρητορικού λόγου",
          "Genres of Attic oratory"
        ],
        [
          "Μέρη του ρητορικού λόγου",
          "Parts of a rhetorical speech"
        ],
        [
          "Λυσίας: βίος, έργο και αξία",
          "Lysias: life, work and importance"
        ],
        [
          "Υπέρ Μαντιθέου: εισαγωγή και ιστορικό πλαίσιο",
          "For Mantitheus: introduction and historical context"
        ],
        [
          "Υπέρ Μαντιθέου §§1–13",
          "For Mantitheus §§1–13"
        ],
        [
          "Υπέρ Μαντιθέου §§18–21",
          "For Mantitheus §§18–21"
        ],
        [
          "Αδίδακτο πεζό κείμενο αττικής διαλέκτου",
          "Unseen Attic prose text"
        ],
        [
          "Λεξιλόγιο και ετυμολογικές σχέσεις",
          "Vocabulary and etymological relations"
        ],
        [
          "Μορφολογία ουσιαστικών, επιθέτων και αντωνυμιών",
          "Morphology of nouns, adjectives and pronouns"
        ],
        [
          "Ρηματικοί χρόνοι και εγκλίσεις",
          "Verb tenses and moods"
        ],
        [
          "Απαρέμφατο και μετοχή",
          "Infinitive and participle"
        ],
        [
          "Συντακτικές λειτουργίες όρων της πρότασης",
          "Syntactic functions of sentence elements"
        ],
        [
          "Δευτερεύουσες προτάσεις",
          "Subordinate clauses"
        ],
        [
          "Υποθετικός λόγος και σύνθετα συντακτικά φαινόμενα",
          "Conditional constructions and complex syntax"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "archaia-b-lykeiou"
    },
    {
      "id": "latinika-b-lykeiou",
      "grade": "b",
      "labelEl": "Λατινικά, Β' Λυκείου",
      "labelEn": "Latin, 11th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Λατινική προφορά και βασικές αρχές μετάφρασης",
          "Latin pronunciation and basic translation principles"
        ],
        [
          "Κείμενα και λεξιλόγιο των διδακτικών ενοτήτων",
          "Texts and vocabulary of the taught units"
        ],
        [
          "Α΄ και Β΄ κλίση ουσιαστικών",
          "First and second noun declensions"
        ],
        [
          "Γ΄ κλίση ουσιαστικών",
          "Third noun declension"
        ],
        [
          "Επίθετα και συμφωνία ουσιαστικού–επιθέτου",
          "Adjectives and noun–adjective agreement"
        ],
        [
          "Αντωνυμίες",
          "Pronouns"
        ],
        [
          "Οριστική ενεργητικής φωνής",
          "Active indicative"
        ],
        [
          "Οριστική παθητικής φωνής",
          "Passive indicative"
        ],
        [
          "Απαρέμφατο",
          "Infinitive"
        ],
        [
          "Μετοχές",
          "Participles"
        ],
        [
          "Πτώσεις και συντακτικές λειτουργίες",
          "Cases and syntactic functions"
        ],
        [
          "Χρονικές, αιτιολογικές και αναφορικές σχέσεις",
          "Temporal, causal and relative relations"
        ],
        [
          "Απαρεμφατική σύνταξη",
          "Infinitive constructions"
        ],
        [
          "Μετατροπές γραμματικών τύπων μέσα στο κείμενο",
          "Morphological transformations in context"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "latinika-b-lykeiou"
    },
    {
      "id": "filosofia-b-lykeiou",
      "grade": "b",
      "labelEl": "Φιλοσοφία, Β' Λυκείου",
      "labelEn": "Philosophy, 11th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Τι είναι φιλοσοφία – φιλοσοφικά ερωτήματα",
          "What philosophy is – philosophical questions"
        ],
        [
          "Επιχείρημα, προκείμενες και συμπέρασμα",
          "Argument, premises and conclusion"
        ],
        [
          "Εγκυρότητα και ορθότητα συλλογισμών",
          "Validity and soundness of reasoning"
        ],
        [
          "Γλώσσα, έννοιες και ορισμοί",
          "Language, concepts and definitions"
        ],
        [
          "Γνώση, πεποίθηση και αλήθεια",
          "Knowledge, belief and truth"
        ],
        [
          "Σκεπτικισμός και όρια της γνώσης",
          "Scepticism and limits of knowledge"
        ],
        [
          "Επιστημονική γνώση και μέθοδος",
          "Scientific knowledge and method"
        ],
        [
          "Νους, σώμα και προσωπική ταυτότητα",
          "Mind, body and personal identity"
        ],
        [
          "Ελευθερία και αιτιοκρατία",
          "Freedom and determinism"
        ],
        [
          "Ηθική πράξη και κριτήρια ορθού",
          "Moral action and criteria of rightness"
        ],
        [
          "Ωφελιμισμός, δεοντολογία και αρετή",
          "Utilitarianism, deontology and virtue"
        ],
        [
          "Δικαιοσύνη, πολιτεία και δικαιώματα",
          "Justice, state and rights"
        ],
        [
          "Αισθητική και φιλοσοφία της τέχνης",
          "Aesthetics and philosophy of art"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "filosofia-b-lykeiou"
    },
    {
      "id": "thriskeftika-b-lykeiou",
      "grade": "b",
      "labelEl": "Θρησκευτικά, Β' Λυκείου",
      "labelEn": "Religious Studies, 11th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Θρησκεία και αναζήτηση του ιερού",
          "Religion and the search for the sacred"
        ],
        [
          "Χριστιανισμός: πίστη, κοινότητα και παράδοση",
          "Christianity: faith, community and tradition"
        ],
        [
          "Ορθόδοξη θεολογία και ανθρώπινο πρόσωπο",
          "Orthodox theology and the human person"
        ],
        [
          "Θρησκευτικές εκφράσεις στον πολιτισμό",
          "Religious expressions in culture"
        ],
        [
          "Ιουδαϊσμός",
          "Judaism"
        ],
        [
          "Ισλάμ",
          "Islam"
        ],
        [
          "Ινδουισμός και βουδισμός",
          "Hinduism and Buddhism"
        ],
        [
          "Θρησκευτικός πλουραλισμός και διάλογος",
          "Religious pluralism and dialogue"
        ],
        [
          "Θρησκεία, ειρήνη, βία και ανθρώπινα δικαιώματα",
          "Religion, peace, violence and human rights"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/"
    },
    {
      "id": "fysiki-b-lykeiou",
      "grade": "b",
      "labelEl": "Φυσική Προσανατολισμού Θετικών Σπουδών, Β' Λυκείου",
      "labelEn": "Physics (Science Orientation), 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Οριζόντια βολή",
          "Horizontal projectile motion"
        ],
        [
          "Ομαλή κυκλική κίνηση",
          "Uniform circular motion"
        ],
        [
          "Κεντρομόλος δύναμη",
          "Centripetal force"
        ],
        [
          "Σύστημα σωμάτων – εσωτερικές και εξωτερικές δυνάμεις",
          "System of bodies – internal and external forces"
        ],
        [
          "Κρούση",
          "Collision"
        ],
        [
          "Ορμή",
          "Momentum"
        ],
        [
          "Δύναμη και μεταβολή ορμής",
          "Force and change of momentum"
        ],
        [
          "Αρχή διατήρησης της ορμής",
          "Conservation of momentum"
        ],
        [
          "Μεγέθη που δεν διατηρούνται σε κρούση",
          "Quantities not conserved in a collision"
        ],
        [
          "Εφαρμογές διατήρησης ορμής",
          "Applications of momentum conservation"
        ],
        [
          "Ηλεκτρική δυναμική ενέργεια συστήματος φορτίων",
          "Electric potential energy of a system of charges"
        ],
        [
          "Σχέση έντασης και δυναμικού σε ομογενές ηλεκτρικό πεδίο",
          "Relation between field and potential in a uniform electric field"
        ],
        [
          "Κίνηση φορτισμένου σωματιδίου σε ηλεκτρικό πεδίο",
          "Motion of a charged particle in an electric field"
        ],
        [
          "Βαρυτικό πεδίο",
          "Gravitational field"
        ],
        [
          "Βαρυτικό πεδίο της Γης",
          "Earth's gravitational field"
        ],
        [
          "Ταχύτητα διαφυγής και μαύρες τρύπες",
          "Escape velocity and black holes"
        ],
        [
          "Σύγκριση ηλεκτροστατικού και βαρυτικού πεδίου",
          "Comparison of electrostatic and gravitational fields"
        ],
        [
          "Νόμοι αερίων",
          "Gas laws"
        ],
        [
          "Καταστατική εξίσωση ιδανικού αερίου",
          "Ideal gas equation"
        ],
        [
          "Κινητική θεωρία αερίων",
          "Kinetic theory of gases"
        ],
        [
          "Θερμοδυναμικό σύστημα και θερμοδυναμική ισορροπία",
          "Thermodynamic system and equilibrium"
        ],
        [
          "Αντιστρεπτές μεταβολές – έργο – θερμότητα – εσωτερική ενέργεια",
          "Reversible processes – work – heat – internal energy"
        ],
        [
          "Πρώτος θερμοδυναμικός νόμος",
          "First law of thermodynamics"
        ],
        [
          "Ειδικές θερμοδυναμικές μεταβολές",
          "Special thermodynamic processes"
        ],
        [
          "Θερμικές μηχανές",
          "Heat engines"
        ],
        [
          "Δεύτερος θερμοδυναμικός νόμος",
          "Second law of thermodynamics"
        ],
        [
          "Μηχανή Carnot",
          "Carnot engine"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "fysiki-b-lykeiou"
    },
    {
      "id": "chimeia-b-lykeiou",
      "grade": "b",
      "labelEl": "Χημεία, Β' Λυκείου",
      "labelEn": "Chemistry, 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "4.4 Στοιχειομετρικοί υπολογισμοί (με τις επίσημες εξαιρέσεις)",
          "4.4 Stoichiometric calculations (with official exclusions)"
        ],
        [
          "1.1 Εισαγωγή στην οργανική χημεία",
          "1.1 Introduction to organic chemistry"
        ],
        [
          "1.2 Ταξινόμηση οργανικών ενώσεων – ομόλογες σειρές",
          "1.2 Classification of organic compounds – homologous series"
        ],
        [
          "1.3 Ονοματολογία άκυκλων οργανικών ενώσεων",
          "1.3 Nomenclature of acyclic organic compounds"
        ],
        [
          "1.4 Ισομέρεια",
          "1.4 Isomerism"
        ],
        [
          "2.1 Πετρέλαιο – προϊόντα πετρελαίου – βενζίνη – καύση και καύσιμα",
          "2.1 Petroleum – products – gasoline – combustion and fuels"
        ],
        [
          "2.2 Νάφθα – πετροχημικά",
          "2.2 Naphtha – petrochemicals"
        ],
        [
          "2.3 Αλκάνια – μεθάνιο, φυσικό αέριο, βιοαέριο (με εξαιρέσεις)",
          "2.3 Alkanes – methane, natural gas, biogas (with exclusions)"
        ],
        [
          "2.4 Καυσαέρια – καταλύτες αυτοκινήτων",
          "2.4 Exhaust gases – catalytic converters"
        ],
        [
          "2.5 Αλκένια – αιθένιο/αιθυλένιο",
          "2.5 Alkenes – ethene/ethylene"
        ],
        [
          "2.6 Αλκίνια – αιθίνιο/ακετυλένιο (με εξαιρέσεις)",
          "2.6 Alkynes – ethyne/acetylene (with exclusions)"
        ],
        [
          "2.8 Ατμοσφαιρική ρύπανση – φαινόμενο θερμοκηπίου – τρύπα όζοντος",
          "2.8 Air pollution – greenhouse effect – ozone hole"
        ],
        [
          "3.1 Αλκοόλες",
          "3.1 Alcohols"
        ],
        [
          "3.2 Κορεσμένες μονοσθενείς αλκοόλες – αιθανόλη (με εξαιρέσεις)",
          "3.2 Saturated monohydric alcohols – ethanol (with exclusions)"
        ],
        [
          "4.1 Κορεσμένα μονοκαρβοξυλικά οξέα – αιθανικό οξύ",
          "4.1 Saturated monocarboxylic acids – ethanoic acid"
        ],
        [
          "5.2 Λίπη και έλαια (με την επίσημη εξαίρεση)",
          "5.2 Fats and oils (with official exclusion)"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "chimeia-b-lykeiou"
    },
    {
      "id": "biologia-b-lykeiou",
      "grade": "b",
      "labelEl": "Βιολογία Γενικής Παιδείας, Β' Λυκείου",
      "labelEn": "Biology (General Education), 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Άνθρωπος και Υγεία: παράγοντες που επηρεάζουν την υγεία",
          "Human health: factors affecting health"
        ],
        [
          "Μικροοργανισμοί και κατηγορίες παθογόνων",
          "Microorganisms and pathogen categories"
        ],
        [
          "Τρόποι μετάδοσης λοιμωδών νοσημάτων",
          "Transmission of infectious diseases"
        ],
        [
          "Μη ειδικοί μηχανισμοί άμυνας",
          "Non-specific defence mechanisms"
        ],
        [
          "Ειδική άμυνα και ανοσία",
          "Specific defence and immunity"
        ],
        [
          "Αντισώματα, αντιγόνα και ανοσολογική μνήμη",
          "Antibodies, antigens and immune memory"
        ],
        [
          "Προβλήματα στη λειτουργία του ανοσοβιολογικού συστήματος",
          "Immune system disorders"
        ],
        [
          "HIV/AIDS",
          "HIV/AIDS"
        ],
        [
          "Εξαρτησιογόνες ουσίες",
          "Addictive substances"
        ],
        [
          "Οικοσύστημα: δομή και λειτουργία",
          "Ecosystem: structure and function"
        ],
        [
          "Ροή ενέργειας",
          "Energy flow"
        ],
        [
          "Τροφικές αλυσίδες και τροφικά πλέγματα",
          "Food chains and food webs"
        ],
        [
          "Οικολογικές πυραμίδες",
          "Ecological pyramids"
        ],
        [
          "Κύκλος του άνθρακα",
          "Carbon cycle"
        ],
        [
          "Κύκλος του αζώτου",
          "Nitrogen cycle"
        ],
        [
          "Κύκλος του νερού",
          "Water cycle"
        ],
        [
          "Ερημοποίηση",
          "Desertification"
        ],
        [
          "Ρύπανση και φαινόμενο θερμοκηπίου",
          "Pollution and greenhouse effect"
        ],
        [
          "Ρύπανση υδάτων",
          "Water pollution"
        ],
        [
          "Ταξινόμηση οργανισμών και εξέλιξη",
          "Classification and evolution"
        ],
        [
          "Φυσική επιλογή",
          "Natural selection"
        ],
        [
          "Φυλογένεση",
          "Phylogeny"
        ],
        [
          "Εξέλιξη του ανθρώπου",
          "Human evolution"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "biologia-b-lykeiou"
    },
    {
      "id": "algebra-b-lykeiou",
      "grade": "b",
      "labelEl": "Άλγεβρα, Β' Λυκείου",
      "labelEn": "Algebra, 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "1.1 Γραμμικά συστήματα (με τις επίσημες εξαιρέσεις)",
          "Linear systems (with official exclusions)"
        ],
        [
          "2.1 Μονοτονία – ακρότατα – συμμετρίες συνάρτησης",
          "Monotonicity – extrema – symmetries of a function"
        ],
        [
          "2.2 Κατακόρυφες και οριζόντιες μετατοπίσεις καμπύλης",
          "Vertical and horizontal graph shifts"
        ],
        [
          "3.1 Τριγωνομετρικοί αριθμοί γωνίας",
          "Trigonometric ratios"
        ],
        [
          "3.2 Βασικές τριγωνομετρικές ταυτότητες",
          "Basic trigonometric identities"
        ],
        [
          "3.3 Αναγωγή στο πρώτο τεταρτημόριο",
          "Reduction to the first quadrant"
        ],
        [
          "3.4 Τριγωνομετρικές συναρτήσεις",
          "Trigonometric functions"
        ],
        [
          "3.5 Βασικές τριγωνομετρικές εξισώσεις",
          "Basic trigonometric equations"
        ],
        [
          "4.1 Πολυώνυμα",
          "Polynomials"
        ],
        [
          "4.2 Διαίρεση πολυωνύμων",
          "Polynomial division"
        ],
        [
          "4.3 Πολυωνυμικές εξισώσεις και ανισώσεις",
          "Polynomial equations and inequalities"
        ],
        [
          "4.4 Εξισώσεις και ανισώσεις που ανάγονται σε πολυωνυμικές",
          "Equations and inequalities reducible to polynomial form"
        ],
        [
          "5.1 Εκθετική συνάρτηση",
          "Exponential function"
        ],
        [
          "5.2 Λογάριθμοι",
          "Logarithms"
        ],
        [
          "5.3 Λογαριθμική συνάρτηση με βάση 10 και e",
          "Logarithmic function with base 10 and e"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "algebra-b-lykeiou"
    },
    {
      "id": "geometria-b-lykeiou",
      "grade": "b",
      "labelEl": "Γεωμετρία, Β' Λυκείου",
      "labelEn": "Geometry, 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "7.4 Ανάλογα ευθύγραμμα τμήματα",
          "Proportional line segments"
        ],
        [
          "7.5 Μήκος ευθύγραμμου τμήματος",
          "Length of a line segment"
        ],
        [
          "7.6 Διαίρεση τμήματος σε δοσμένο λόγο",
          "Division of a segment in a given ratio"
        ],
        [
          "7.7 Θεώρημα Θαλή",
          "Thales' theorem"
        ],
        [
          "8.1 Όμοια ευθύγραμμα σχήματα",
          "Similar plane figures"
        ],
        [
          "8.2 Κριτήρια ομοιότητας",
          "Similarity criteria"
        ],
        [
          "9.1 Ορθές προβολές",
          "Orthogonal projections"
        ],
        [
          "9.2 Πυθαγόρειο θεώρημα",
          "Pythagorean theorem"
        ],
        [
          "9.3 Γεωμετρικές κατασκευές",
          "Geometric constructions"
        ],
        [
          "9.4 Γενίκευση Πυθαγορείου θεωρήματος",
          "Generalised Pythagorean theorem"
        ],
        [
          "10.1 Πολυγωνικά χωρία",
          "Polygonal regions"
        ],
        [
          "10.2 Εμβαδόν και ισοδύναμα σχήματα",
          "Area and equivalent figures"
        ],
        [
          "10.3 Εμβαδά βασικών σχημάτων",
          "Areas of basic figures"
        ],
        [
          "10.4 Τύποι εμβαδού τριγώνου",
          "Triangle area formulas"
        ],
        [
          "10.5 Λόγος εμβαδών όμοιων σχημάτων",
          "Area ratio of similar figures"
        ],
        [
          "11.1 Κανονικά πολύγωνα",
          "Regular polygons"
        ],
        [
          "11.2 Ιδιότητες κανονικών πολυγώνων",
          "Properties of regular polygons"
        ],
        [
          "11.4 Προσέγγιση μήκους κύκλου",
          "Approximation of circumference"
        ],
        [
          "11.5 Μήκος τόξου",
          "Arc length"
        ],
        [
          "11.6 Προσέγγιση εμβαδού κύκλου",
          "Approximation of circle area"
        ],
        [
          "11.7 Εμβαδόν κυκλικού τομέα και τμήματος",
          "Area of sector and segment"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "geometria-b-lykeiou"
    },
    {
      "id": "mathimatika-b-prosanatolismou",
      "grade": "b",
      "labelEl": "Μαθηματικά Προσανατολισμού, Β' Λυκείου",
      "labelEn": "Mathematics (Orientation), 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "1.1 Η έννοια του διανύσματος",
          "Concept of a vector"
        ],
        [
          "1.2 Πρόσθεση και αφαίρεση διανυσμάτων",
          "Vector addition and subtraction"
        ],
        [
          "1.3 Πολλαπλασιασμός αριθμού με διάνυσμα",
          "Scalar multiplication"
        ],
        [
          "1.4 Συντεταγμένες διανύσματος",
          "Vector coordinates"
        ],
        [
          "1.5 Εσωτερικό γινόμενο διανυσμάτων",
          "Dot product"
        ],
        [
          "2.1 Εξίσωση ευθείας",
          "Equation of a line"
        ],
        [
          "2.2 Γενική μορφή εξίσωσης ευθείας",
          "General form of a line equation"
        ],
        [
          "2.3 Απόσταση σημείου από ευθεία και εμβαδόν τριγώνου",
          "Distance from point to line and triangle area"
        ],
        [
          "3.1 Κύκλος",
          "Circle"
        ],
        [
          "3.2 Παραβολή",
          "Parabola"
        ],
        [
          "3.3 Έλλειψη",
          "Ellipse"
        ],
        [
          "3.4 Υπερβολή",
          "Hyperbola"
        ],
        [
          "3.5 Γενική εξίσωση κωνικής",
          "General equation of a conic"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "mathimatika-b-prosanatolismou"
    },
    {
      "id": "pliroforiki-b-lykeiou",
      "grade": "b",
      "labelEl": "Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ, Β' Λυκείου",
      "labelEn": "Introduction to Computer Science, 11th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "1.1 Επιστήμη των Υπολογιστών",
          "1.1 Computer Science"
        ],
        [
          "2.1 Πρόβλημα",
          "2.1 Problem"
        ],
        [
          "2.2 Αλγόριθμοι (με τις επίσημες εξαιρέσεις)",
          "2.2 Algorithms (with official exclusions)"
        ],
        [
          "2.3 Προγραμματισμός (με τις επίσημες εξαιρέσεις)",
          "2.3 Programming (with official exclusions)"
        ],
        [
          "3.1 Λειτουργικά Συστήματα",
          "3.1 Operating Systems"
        ],
        [
          "3.2 Πληροφοριακά Συστήματα",
          "3.2 Information Systems"
        ],
        [
          "3.3 Δίκτυα",
          "3.3 Networks"
        ],
        [
          "3.4 Τεχνητή Νοημοσύνη",
          "3.4 Artificial Intelligence"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "pliroforiki-b-lykeiou",
      "noteEl": "Οι ενότητες ακολουθούν τη φετινή οδηγία διδασκαλίας. Για την ακριβή έκταση/εξαιρέσεις ανά υποενότητα ισχύει το επίσημο έγγραφο."
    },
    {
      "id": "english-b-lykeiou",
      "grade": "b",
      "labelEl": "Αγγλικά, Β' Λυκείου",
      "labelEn": "English, 11th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Unit 2 — Do we all live in the same world?",
          "Unit 2 — Do we all live in the same world?"
        ],
        [
          "Unit 3 — Renaissance arts and artists",
          "Unit 3 — Renaissance arts and artists"
        ],
        [
          "Unit 4 — Learning to fly",
          "Unit 4 — Learning to fly"
        ],
        [
          "Unit 5 — Addictions",
          "Unit 5 — Addictions"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "english-b-lykeiou"
    }
  ],
  "c": [
    {
      "id": "neoelliniki-g-lykeiou",
      "grade": "c",
      "labelEl": "Νεοελληνική Γλώσσα & Λογοτεχνία, Γ' Λυκείου",
      "labelEn": "Modern Greek Language & Literature, 12th Grade",
      "status": "panhellenic-map",
      "topics": [
        [
          "Κατανόηση μη λογοτεχνικού κειμένου",
          "Comprehension of non-literary text"
        ],
        [
          "Εντοπισμός θέματος, θέσης και προθέσεων συντάκτη",
          "Identifying topic, thesis and author purpose"
        ],
        [
          "Περίληψη / συνοπτική απόδοση μέρους κειμένου",
          "Summary / concise rendering of a text section"
        ],
        [
          "Τρόποι και μέσα πειθούς",
          "Modes and means of persuasion"
        ],
        [
          "Επιχειρήματα, τεκμήρια και αξιολόγηση συλλογισμού",
          "Arguments, evidence and evaluation of reasoning"
        ],
        [
          "Συνοχή, συνεκτικότητα και οργάνωση κειμένου",
          "Cohesion, coherence and text organisation"
        ],
        [
          "Γλωσσικές επιλογές, ύφος και επικοινωνιακό αποτέλεσμα",
          "Language choices, style and communicative effect"
        ],
        [
          "Μετασχηματισμοί λόγου",
          "Text and language transformations"
        ],
        [
          "Κατανόηση λογοτεχνικού κειμένου",
          "Comprehension of literary text"
        ],
        [
          "Κειμενικοί δείκτες και ερμηνευτικό σχόλιο",
          "Textual evidence and interpretive comment"
        ],
        [
          "Συσχέτιση λογοτεχνικού κειμένου με προσωπική/κοινωνική εμπειρία",
          "Relating literary text to personal/social experience"
        ],
        [
          "Παραγωγή λόγου με συγκεκριμένο επικοινωνιακό πλαίσιο",
          "Writing for a specified communicative context"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "ekthesi-g-lykeiou"
    },
    {
      "id": "istoria-g-lykeiou",
      "grade": "c",
      "labelEl": "Ιστορία Γενικής Παιδείας, Γ' Λυκείου",
      "labelEn": "History (General Education), 12th Grade",
      "status": "exam-verified",
      "topics": [
        [
          "Ευρώπη και κόσμος τον 19ο αιώνα",
          "Europe and the world in the 19th century"
        ],
        [
          "Εθνικά και φιλελεύθερα κινήματα",
          "National and liberal movements"
        ],
        [
          "Ελληνική Επανάσταση και συγκρότηση ελληνικού κράτους",
          "Greek Revolution and formation of the Greek state"
        ],
        [
          "Βιομηχανική Επανάσταση και κοινωνικές μεταβολές",
          "Industrial Revolution and social changes"
        ],
        [
          "Ιμπεριαλισμός και αποικιοκρατία",
          "Imperialism and colonialism"
        ],
        [
          "Βαλκανικοί Πόλεμοι",
          "Balkan Wars"
        ],
        [
          "Α΄ Παγκόσμιος Πόλεμος",
          "First World War"
        ],
        [
          "Ρωσική Επανάσταση",
          "Russian Revolution"
        ],
        [
          "Μικρασιατική Εκστρατεία και Καταστροφή",
          "Asia Minor Campaign and Catastrophe"
        ],
        [
          "Μεσοπόλεμος και οικονομική κρίση",
          "Interwar period and economic crisis"
        ],
        [
          "Φασισμός και ναζισμός",
          "Fascism and Nazism"
        ],
        [
          "Β΄ Παγκόσμιος Πόλεμος",
          "Second World War"
        ],
        [
          "Κατοχή και Αντίσταση στην Ελλάδα",
          "Occupation and Resistance in Greece"
        ],
        [
          "Ολοκαύτωμα",
          "Holocaust"
        ],
        [
          "Ψυχρός Πόλεμος",
          "Cold War"
        ],
        [
          "Αποαποικιοποίηση",
          "Decolonisation"
        ],
        [
          "Ευρωπαϊκή ενοποίηση",
          "European integration"
        ],
        [
          "Ελλάδα στη μεταπολεμική περίοδο",
          "Greece in the post-war period"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70567-29-07-26-kathorismos-exetasteas-yles-gia-ta-mathemata-ton-a-b-kai-g-taxeon-genikou-lykeiou-pou-exetazontai-graptos-stis-proagogikes-kai-apolyteries-exetaseis-gia-to-sch-etos-2026-2027",
      "quizId": "istoria-g-lykeiou"
    },
    {
      "id": "istoria-g-prosanatolismou",
      "grade": "c",
      "labelEl": "Ιστορία Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "History (Humanities Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Η ελληνική οικονομία μετά την Επανάσταση",
          "Greek economy after the Revolution"
        ],
        [
          "Η ελληνική οικονομία κατά τον 19ο αιώνα",
          "Greek economy in the 19th century"
        ],
        [
          "Εμπόριο και ναυτιλία",
          "Trade and shipping"
        ],
        [
          "Διανομή εθνικών γαιών",
          "Distribution of national lands"
        ],
        [
          "Εκμετάλλευση μεταλλείων",
          "Mining exploitation"
        ],
        [
          "Δημιουργία τραπεζικού συστήματος",
          "Creation of the banking system"
        ],
        [
          "Βιομηχανία και δημόσια έργα",
          "Industry and public works"
        ],
        [
          "Σιδηρόδρομοι",
          "Railways"
        ],
        [
          "Εξωτερικός δανεισμός και πτώχευση 1893",
          "Foreign borrowing and the 1893 bankruptcy"
        ],
        [
          "Διεθνής Οικονομικός Έλεγχος",
          "International Financial Control"
        ],
        [
          "Αγροτική μεταρρύθμιση και τσιφλίκια",
          "Agrarian reform and large estates"
        ],
        [
          "Βενιζελική οικονομική πολιτική και προσφυγική αποκατάσταση",
          "Venizelist economic policy and refugee rehabilitation"
        ],
        [
          "Διαμόρφωση και λειτουργία πολιτικών κομμάτων τον 19ο αιώνα",
          "Formation and function of political parties in the 19th century"
        ],
        [
          "Πελατειακά δίκτυα και εκλογικές πρακτικές",
          "Clientelist networks and electoral practices"
        ],
        [
          "Το Σύνταγμα του 1844 και τα κόμματα",
          "The 1844 Constitution and political parties"
        ],
        [
          "Νέα γενιά πολιτικών και Τρικούπης",
          "New generation of politicians and Trikoupis"
        ],
        [
          "Κίνημα στο Γουδί και άνοδος Βενιζέλου",
          "Goudi movement and rise of Venizelos"
        ],
        [
          "Εθνικός Διχασμός",
          "National Schism"
        ],
        [
          "Προσφυγικό ζήτημα στον 19ο αιώνα",
          "Refugee question in the 19th century"
        ],
        [
          "Πρόσφυγες από Μικρά Ασία, Πόντο και Ανατολική Θράκη",
          "Refugees from Asia Minor, Pontus and Eastern Thrace"
        ],
        [
          "Συνθήκη Λωζάννης και ανταλλαγή πληθυσμών",
          "Treaty of Lausanne and population exchange"
        ],
        [
          "Επιτροπή Αποκαταστάσεως Προσφύγων",
          "Refugee Settlement Commission"
        ],
        [
          "Αγροτική και αστική αποκατάσταση προσφύγων",
          "Rural and urban refugee settlement"
        ],
        [
          "Επιπτώσεις από την άφιξη των προσφύγων",
          "Consequences of refugee arrival"
        ],
        [
          "Κρητικό Ζήτημα: αυτονομία και Κρητική Πολιτεία",
          "Cretan Question: autonomy and Cretan State"
        ],
        [
          "Ελευθέριος Βενιζέλος και επανάσταση Θερίσου",
          "Eleftherios Venizelos and Theriso revolt"
        ],
        [
          "Ένωση της Κρήτης με την Ελλάδα",
          "Union of Crete with Greece"
        ],
        [
          "Παρευξείνιος Ελληνισμός και Πόντος",
          "Black Sea Hellenism and Pontus"
        ],
        [
          "Διωγμοί και ποντιακό ζήτημα",
          "Persecutions and the Pontic question"
        ],
        [
          "Προσπάθειες για ανεξάρτητη Δημοκρατία του Πόντου",
          "Efforts for an independent Republic of Pontus"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "istoria-g-prosanatolismou"
    },
    {
      "id": "archaia-g-lykeiou",
      "grade": "c",
      "labelEl": "Αρχαία Ελληνικά Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Ancient Greek (Humanities Orientation), 12th Grade",
      "status": "panhellenic-map",
      "topics": [
        [
          "Σωκράτης και σωκρατική μέθοδος",
          "Socrates and the Socratic method"
        ],
        [
          "Πλάτων: βίος, έργο και φιλοσοφικό πλαίσιο",
          "Plato: life, work and philosophical context"
        ],
        [
          "Πλάτωνος Πρωταγόρας: παιδεία και αρετή",
          "Plato's Protagoras: education and virtue"
        ],
        [
          "Πλάτωνος Πολιτεία: δικαιοσύνη, παιδεία και ιδανική πολιτεία",
          "Plato's Republic: justice, education and ideal state"
        ],
        [
          "Αλληγορία του σπηλαίου",
          "Allegory of the cave"
        ],
        [
          "Αριστοτέλης: βίος, έργο και μέθοδος",
          "Aristotle: life, work and method"
        ],
        [
          "Ηθικά Νικομάχεια: ευδαιμονία και αρετή",
          "Nicomachean Ethics: flourishing and virtue"
        ],
        [
          "Ηθική αρετή, μεσότητα και έξη",
          "Moral virtue, mean and habit"
        ],
        [
          "Πολιτικά: άνθρωπος ως πολιτικό ζώο",
          "Politics: human as a political animal"
        ],
        [
          "Πόλη, πολίτης και πολιτειακή οργάνωση",
          "Polis, citizen and political organisation"
        ],
        [
          "Διδαγμένο κείμενο: κατανόηση και ερμηνεία",
          "Taught text: comprehension and interpretation"
        ],
        [
          "Παράλληλο κείμενο και διακειμενικές σχέσεις",
          "Parallel text and intertextual relations"
        ],
        [
          "Αδίδακτο κείμενο: μετάφραση",
          "Unseen text: translation"
        ],
        [
          "Αδίδακτο: γραμματική",
          "Unseen text: grammar"
        ],
        [
          "Αδίδακτο: συντακτικό",
          "Unseen text: syntax"
        ],
        [
          "Λεξιλογικές και ετυμολογικές σχέσεις",
          "Lexical and etymological relations"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "archaia-g-lykeiou",
      "noteEl": "Οι θεματικές λειτουργούν ως αναλυτικός χάρτης προετοιμασίας. Για τα ακριβή διδαγμένα αποσπάσματα και τις εξαιρέσεις ισχύει αποκλειστικά η απόφαση Πανελλαδικών 2027."
    },
    {
      "id": "latinika-g-lykeiou",
      "grade": "c",
      "labelEl": "Λατινικά Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Latin (Humanities Orientation), 12th Grade",
      "status": "panhellenic-map",
      "topics": [
        [
          "Διδαγμένα λατινικά κείμενα της εξεταστέας ύλης 2027",
          "Taught Latin texts in the 2027 examinable syllabus"
        ],
        [
          "Μετάφραση και νοηματική απόδοση",
          "Translation and rendering meaning"
        ],
        [
          "Λεξιλόγιο και ετυμολογικές σχέσεις",
          "Vocabulary and etymological relations"
        ],
        [
          "Ουσιαστικά όλων των κλίσεων",
          "Nouns of all declensions"
        ],
        [
          "Επίθετα και παραθετικά",
          "Adjectives and degrees of comparison"
        ],
        [
          "Αντωνυμίες",
          "Pronouns"
        ],
        [
          "Ρήματα: χρόνοι οριστικής",
          "Verbs: indicative tenses"
        ],
        [
          "Υποτακτική",
          "Subjunctive"
        ],
        [
          "Προστακτική",
          "Imperative"
        ],
        [
          "Απαρέμφατο",
          "Infinitive"
        ],
        [
          "Μετοχές",
          "Participles"
        ],
        [
          "Γερουνδιακό και γερουνδιακός τύπος",
          "Gerund and gerundive"
        ],
        [
          "Σουπίνο",
          "Supine"
        ],
        [
          "Ακολουθία χρόνων",
          "Sequence of tenses"
        ],
        [
          "Απαρεμφατική σύνταξη",
          "Infinitive constructions"
        ],
        [
          "Μετοχική σύνταξη και αφαιρετική απόλυτη",
          "Participial constructions and ablative absolute"
        ],
        [
          "Δευτερεύουσες προτάσεις",
          "Subordinate clauses"
        ],
        [
          "Ευθύς και πλάγιος λόγος",
          "Direct and indirect speech"
        ],
        [
          "Μετατροπές σύνταξης",
          "Syntactic transformations"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "latinika-g-lykeiou",
      "noteEl": "Για τους ακριβείς αριθμούς κειμένων/παραγράφων και τυχόν εξαιρέσεις ισχύει η επίσημη απόφαση Πανελλαδικών 2027."
    },
    {
      "id": "thriskeftika-g-lykeiou",
      "grade": "c",
      "labelEl": "Θρησκευτικά, Γ' Λυκείου",
      "labelEn": "Religious Studies, 12th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Πίστη, γνώση και επιστήμη",
          "Faith, knowledge and science"
        ],
        [
          "Θρησκεία και σύγχρονος άνθρωπος",
          "Religion and the modern person"
        ],
        [
          "Βιοηθικά ζητήματα",
          "Bioethical issues"
        ],
        [
          "Τεχνολογία και ανθρώπινη ευθύνη",
          "Technology and human responsibility"
        ],
        [
          "Κοινωνική δικαιοσύνη και αλληλεγγύη",
          "Social justice and solidarity"
        ],
        [
          "Ειρήνη, βία και θρησκεία",
          "Peace, violence and religion"
        ],
        [
          "Οικολογία και ευθύνη για τη δημιουργία",
          "Ecology and responsibility for creation"
        ],
        [
          "Θρησκευτικός πλουραλισμός και διαθρησκειακός διάλογος",
          "Religious pluralism and interfaith dialogue"
        ],
        [
          "Ορθόδοξη μαρτυρία στον σύγχρονο κόσμο",
          "Orthodox witness in the modern world"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/"
    },
    {
      "id": "fysiki-g-lykeiou",
      "grade": "c",
      "labelEl": "Φυσική Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Physics (Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Απλή αρμονική ταλάντωση",
          "Simple harmonic motion"
        ],
        [
          "Ενέργεια στην απλή αρμονική ταλάντωση",
          "Energy in simple harmonic motion"
        ],
        [
          "Φθίνουσες ταλαντώσεις",
          "Damped oscillations"
        ],
        [
          "Εξαναγκασμένες ταλαντώσεις και συντονισμός",
          "Forced oscillations and resonance"
        ],
        [
          "Σύνθεση ταλαντώσεων",
          "Superposition of oscillations"
        ],
        [
          "Μηχανικά κύματα",
          "Mechanical waves"
        ],
        [
          "Εξίσωση αρμονικού κύματος",
          "Harmonic wave equation"
        ],
        [
          "Συμβολή κυμάτων",
          "Wave interference"
        ],
        [
          "Στάσιμα κύματα",
          "Standing waves"
        ],
        [
          "Ηλεκτρομαγνητικά κύματα",
          "Electromagnetic waves"
        ],
        [
          "Κρούσεις: ελαστική και ανελαστική",
          "Collisions: elastic and inelastic"
        ],
        [
          "Ορμή και διατήρηση ορμής",
          "Momentum and conservation of momentum"
        ],
        [
          "Στροφική κίνηση στερεού",
          "Rotational motion of a rigid body"
        ],
        [
          "Ροπή δύναμης",
          "Torque"
        ],
        [
          "Ροπή αδράνειας",
          "Moment of inertia"
        ],
        [
          "Στροφορμή",
          "Angular momentum"
        ],
        [
          "Διατήρηση στροφορμής",
          "Conservation of angular momentum"
        ],
        [
          "Έργο και ενέργεια περιστροφής",
          "Work and rotational energy"
        ],
        [
          "Μαγνητικό πεδίο",
          "Magnetic field"
        ],
        [
          "Δύναμη Laplace",
          "Laplace force"
        ],
        [
          "Δύναμη Lorentz",
          "Lorentz force"
        ],
        [
          "Κίνηση φορτισμένων σωματιδίων σε μαγνητικό πεδίο",
          "Motion of charged particles in magnetic field"
        ],
        [
          "Ηλεκτρομαγνητική επαγωγή",
          "Electromagnetic induction"
        ],
        [
          "Νόμος Faraday και κανόνας Lenz",
          "Faraday's law and Lenz's rule"
        ],
        [
          "Εναλλασσόμενο ρεύμα και βασικές εφαρμογές",
          "Alternating current and basic applications"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "fysiki-g-lykeiou"
    },
    {
      "id": "chimeia-g-lykeiou",
      "grade": "c",
      "labelEl": "Χημεία Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Chemistry (Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Οξειδοαναγωγή και αριθμός οξείδωσης",
          "Redox and oxidation number"
        ],
        [
          "Οξειδωτικά και αναγωγικά σώματα",
          "Oxidising and reducing agents"
        ],
        [
          "Ισοστάθμιση οξειδοαναγωγικών αντιδράσεων",
          "Balancing redox reactions"
        ],
        [
          "Ηλεκτρόλυση και εφαρμογές",
          "Electrolysis and applications"
        ],
        [
          "Ενθαλπία αντίδρασης",
          "Reaction enthalpy"
        ],
        [
          "Θερμοχημικές εξισώσεις",
          "Thermochemical equations"
        ],
        [
          "Νόμος Hess",
          "Hess's law"
        ],
        [
          "Ταχύτητα χημικής αντίδρασης",
          "Rate of chemical reaction"
        ],
        [
          "Παράγοντες που επηρεάζουν την ταχύτητα",
          "Factors affecting reaction rate"
        ],
        [
          "Μηχανισμός και ενέργεια ενεργοποίησης",
          "Mechanism and activation energy"
        ],
        [
          "Χημική ισορροπία και δυναμικός χαρακτήρας",
          "Chemical equilibrium and dynamic nature"
        ],
        [
          "Αρχή Le Chatelier",
          "Le Chatelier's principle"
        ],
        [
          "Σταθερά χημικής ισορροπίας",
          "Equilibrium constant"
        ],
        [
          "Οξέα και βάσεις Brønsted–Lowry",
          "Brønsted–Lowry acids and bases"
        ],
        [
          "Ιοντισμός οξέων και βάσεων",
          "Ionisation of acids and bases"
        ],
        [
          "pH και pOH",
          "pH and pOH"
        ],
        [
          "Ρυθμιστικά διαλύματα",
          "Buffer solutions"
        ],
        [
          "Υδρόλυση αλάτων",
          "Salt hydrolysis"
        ],
        [
          "Γινόμενο διαλυτότητας",
          "Solubility product"
        ],
        [
          "Οργανικές αντιδράσεις προσθήκης",
          "Organic addition reactions"
        ],
        [
          "Οργανικές αντιδράσεις υποκατάστασης",
          "Organic substitution reactions"
        ],
        [
          "Οργανικές αντιδράσεις απόσπασης",
          "Organic elimination reactions"
        ],
        [
          "Οξείδωση και αναγωγή οργανικών ενώσεων",
          "Oxidation and reduction of organic compounds"
        ],
        [
          "Εστεροποίηση και υδρόλυση",
          "Esterification and hydrolysis"
        ],
        [
          "Συνθετικές πορείες οργανικών ενώσεων",
          "Organic synthesis routes"
        ],
        [
          "Πολυμερή και πολυμερισμός",
          "Polymers and polymerisation"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "chimeia-g-lykeiou"
    },
    {
      "id": "biologia-g-lykeiou",
      "grade": "c",
      "labelEl": "Βιολογία Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Biology (Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Χημική σύσταση του κυττάρου και βιομόρια",
          "Cell chemical composition and biomolecules"
        ],
        [
          "Δομή και λειτουργία DNA",
          "DNA structure and function"
        ],
        [
          "Οργάνωση γενετικού υλικού",
          "Organisation of genetic material"
        ],
        [
          "Αντιγραφή DNA",
          "DNA replication"
        ],
        [
          "Μεταγραφή",
          "Transcription"
        ],
        [
          "Μετάφραση και γενετικός κώδικας",
          "Translation and genetic code"
        ],
        [
          "Ρύθμιση γονιδιακής έκφρασης",
          "Regulation of gene expression"
        ],
        [
          "Μεταλλάξεις",
          "Mutations"
        ],
        [
          "Μενδελική κληρονομικότητα",
          "Mendelian inheritance"
        ],
        [
          "Γονίδια στο ίδιο χρωμόσωμα και φυλοσύνδετη κληρονομικότητα",
          "Linked genes and sex-linked inheritance"
        ],
        [
          "Γενεαλογικά δέντρα",
          "Pedigrees"
        ],
        [
          "Μοριακή διάγνωση γενετικών ασθενειών",
          "Molecular diagnosis of genetic diseases"
        ],
        [
          "Τεχνολογία ανασυνδυασμένου DNA",
          "Recombinant DNA technology"
        ],
        [
          "Περιοριστικές ενδονουκλεάσες και φορείς κλωνοποίησης",
          "Restriction enzymes and cloning vectors"
        ],
        [
          "PCR",
          "PCR"
        ],
        [
          "Γονιδιωματικές και cDNA βιβλιοθήκες",
          "Genomic and cDNA libraries"
        ],
        [
          "Γενετικά τροποποιημένοι οργανισμοί",
          "Genetically modified organisms"
        ],
        [
          "Παραγωγή φαρμακευτικών πρωτεϊνών",
          "Production of pharmaceutical proteins"
        ],
        [
          "Γονιδιακή θεραπεία",
          "Gene therapy"
        ],
        [
          "Βιοτεχνολογία μικροοργανισμών",
          "Microbial biotechnology"
        ],
        [
          "Εφαρμογές βιοτεχνολογίας στη γεωργία και κτηνοτροφία",
          "Biotechnology applications in agriculture and livestock"
        ],
        [
          "Βιοηθικές διαστάσεις της γενετικής τεχνολογίας",
          "Bioethical aspects of genetic technology"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "biologia-g-lykeiou"
    },
    {
      "id": "mathimatika-g-genikis",
      "grade": "c",
      "labelEl": "Μαθηματικά Γενικής Παιδείας, Γ' Λυκείου",
      "labelEn": "Mathematics (General Education), 12th Grade",
      "status": "annual-guidance-map",
      "topics": [
        [
          "Περιγραφική στατιστική και τύποι δεδομένων",
          "Descriptive statistics and data types"
        ],
        [
          "Πίνακες συχνοτήτων",
          "Frequency tables"
        ],
        [
          "Γραφικές παραστάσεις δεδομένων",
          "Data visualisations"
        ],
        [
          "Μέτρα θέσης",
          "Measures of central tendency"
        ],
        [
          "Μέτρα διασποράς",
          "Measures of dispersion"
        ],
        [
          "Συνδυαστική και απαρίθμηση",
          "Combinatorics and counting"
        ],
        [
          "Έννοια πιθανότητας",
          "Concept of probability"
        ],
        [
          "Κανόνες πιθανότητας",
          "Probability rules"
        ],
        [
          "Δεσμευμένη πιθανότητα",
          "Conditional probability"
        ],
        [
          "Ανεξαρτησία ενδεχομένων",
          "Independence of events"
        ],
        [
          "Εφαρμογές στατιστικής και πιθανότητας σε πραγματικά δεδομένα",
          "Applications of statistics and probability to real data"
        ]
      ],
      "source": "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/",
      "quizId": "mathimatika-g-genikis"
    },
    {
      "id": "mathimatika-g-prosanatolismou",
      "grade": "c",
      "labelEl": "Μαθηματικά Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Mathematics (Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Συναρτήσεις: πεδίο ορισμού και πράξεις",
          "Functions: domain and operations"
        ],
        [
          "Σύνθεση συναρτήσεων",
          "Composition of functions"
        ],
        [
          "Μονοτονία και 1–1 συνάρτηση",
          "Monotonicity and one-to-one functions"
        ],
        [
          "Αντίστροφη συνάρτηση",
          "Inverse function"
        ],
        [
          "Όριο συνάρτησης",
          "Limit of a function"
        ],
        [
          "Ιδιότητες και πράξεις ορίων",
          "Properties and operations of limits"
        ],
        [
          "Όρια στο άπειρο και ασύμπτωτες",
          "Limits at infinity and asymptotes"
        ],
        [
          "Συνέχεια συνάρτησης",
          "Continuity"
        ],
        [
          "Θεώρημα Bolzano",
          "Bolzano theorem"
        ],
        [
          "Έννοια παραγώγου",
          "Concept of derivative"
        ],
        [
          "Κανόνες παραγώγισης",
          "Differentiation rules"
        ],
        [
          "Παράγωγος σύνθετης και αντίστροφης συνάρτησης",
          "Derivative of composite and inverse functions"
        ],
        [
          "Θεώρημα Rolle",
          "Rolle's theorem"
        ],
        [
          "Θεώρημα Μέσης Τιμής",
          "Mean Value Theorem"
        ],
        [
          "Μονοτονία και ακρότατα μέσω παραγώγου",
          "Monotonicity and extrema via derivatives"
        ],
        [
          "Κυρτότητα – κοίλανση – σημεία καμπής",
          "Convexity – concavity – inflection points"
        ],
        [
          "Ασύμπτωτες και πλήρης μελέτη συνάρτησης",
          "Asymptotes and complete function analysis"
        ],
        [
          "Εύρεση ριζών και πλήθους λύσεων",
          "Finding roots and number of solutions"
        ],
        [
          "Αρχική συνάρτηση",
          "Antiderivative"
        ],
        [
          "Αόριστο ολοκλήρωμα",
          "Indefinite integral"
        ],
        [
          "Ορισμένο ολοκλήρωμα",
          "Definite integral"
        ],
        [
          "Θεμελιώδες θεώρημα ολοκληρωτικού λογισμού",
          "Fundamental theorem of calculus"
        ],
        [
          "Εμβαδόν χωρίου",
          "Area of a region"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "mathimatika-g-prosanatolismou"
    },
    {
      "id": "oikonomia-g-lykeiou",
      "grade": "c",
      "labelEl": "Οικονομία Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Economics (Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Βασικό οικονομικό πρόβλημα και σπανιότητα",
          "Basic economic problem and scarcity"
        ],
        [
          "Παραγωγικές δυνατότητες και κόστος ευκαιρίας",
          "Production possibilities and opportunity cost"
        ],
        [
          "Καταμερισμός έργων, χρήμα και οικονομικό κύκλωμα",
          "Division of labour, money and circular flow"
        ],
        [
          "Ζήτηση και νόμος ζήτησης",
          "Demand and law of demand"
        ],
        [
          "Ατομική και αγοραία ζήτηση",
          "Individual and market demand"
        ],
        [
          "Ελαστικότητα ζήτησης ως προς την τιμή",
          "Price elasticity of demand"
        ],
        [
          "Εισόδημα και σταυροειδής ελαστικότητα",
          "Income and cross elasticity"
        ],
        [
          "Παραγωγή και συντελεστές παραγωγής",
          "Production and factors of production"
        ],
        [
          "Βραχυχρόνια συνάρτηση παραγωγής",
          "Short-run production function"
        ],
        [
          "Κόστος παραγωγής",
          "Cost of production"
        ],
        [
          "Προσφορά και νόμος προσφοράς",
          "Supply and law of supply"
        ],
        [
          "Ελαστικότητα προσφοράς",
          "Elasticity of supply"
        ],
        [
          "Ισορροπία αγοράς",
          "Market equilibrium"
        ],
        [
          "Κρατική παρέμβαση στις τιμές",
          "Government intervention in prices"
        ],
        [
          "Ακαθάριστο Εγχώριο Προϊόν",
          "Gross Domestic Product"
        ],
        [
          "Πραγματικό και ονομαστικό ΑΕΠ",
          "Real and nominal GDP"
        ],
        [
          "Δείκτης τιμών και πληθωρισμός",
          "Price index and inflation"
        ],
        [
          "Ανεργία",
          "Unemployment"
        ],
        [
          "Δημόσια οικονομικά και κρατικός προϋπολογισμός",
          "Public finance and government budget"
        ],
        [
          "Διεθνές εμπόριο και οικονομικές σχέσεις",
          "International trade and economic relations"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "oikonomia-g-lykeiou"
    },
    {
      "id": "pliroforiki-g-lykeiou",
      "grade": "c",
      "labelEl": "Πληροφορική Προσανατολισμού, Γ' Λυκείου",
      "labelEn": "Computer Science (Orientation), 12th Grade",
      "status": "panhellenic-verified",
      "topics": [
        [
          "Πρόβλημα και στάδια επίλυσης",
          "Problem and stages of problem solving"
        ],
        [
          "Αλγόριθμος και χαρακτηριστικά αλγορίθμου",
          "Algorithm and algorithm properties"
        ],
        [
          "Αναπαράσταση αλγορίθμων",
          "Algorithm representation"
        ],
        [
          "Δεδομένα και τύποι δεδομένων",
          "Data and data types"
        ],
        [
          "Μεταβλητές, σταθερές και εκφράσεις",
          "Variables, constants and expressions"
        ],
        [
          "Δομή ακολουθίας",
          "Sequence structure"
        ],
        [
          "Δομή επιλογής",
          "Selection structure"
        ],
        [
          "Πολλαπλή επιλογή",
          "Multiple selection"
        ],
        [
          "Δομές επανάληψης",
          "Iteration structures"
        ],
        [
          "Εμφωλευμένες δομές",
          "Nested structures"
        ],
        [
          "Πίνακες μιας διάστασης",
          "One-dimensional arrays"
        ],
        [
          "Πίνακες δύο διαστάσεων",
          "Two-dimensional arrays"
        ],
        [
          "Αναζήτηση σε πίνακα",
          "Searching arrays"
        ],
        [
          "Ταξινόμηση δεδομένων",
          "Sorting data"
        ],
        [
          "Τμηματικός προγραμματισμός",
          "Modular programming"
        ],
        [
          "Διαδικασίες και συναρτήσεις",
          "Procedures and functions"
        ],
        [
          "Παράμετροι και μεταβίβαση τιμών",
          "Parameters and parameter passing"
        ],
        [
          "Εμβέλεια μεταβλητών",
          "Variable scope"
        ],
        [
          "Στοίβα κλήσεων και εκτέλεση υποπρογραμμάτων",
          "Call stack and subprogram execution"
        ],
        [
          "Δομές δεδομένων: στοίβα και ουρά",
          "Data structures: stack and queue"
        ],
        [
          "Βασικές αρχές αντικειμενοστρεφούς σκέψης όπου προβλέπεται",
          "Basic object-oriented thinking where included"
        ],
        [
          "Έλεγχος ορθότητας και δοκιμές αλγορίθμου",
          "Correctness checking and algorithm testing"
        ],
        [
          "Εκσφαλμάτωση",
          "Debugging"
        ],
        [
          "Αποδοτικότητα και σύγκριση αλγοριθμικών λύσεων",
          "Efficiency and comparison of algorithmic solutions"
        ]
      ],
      "source": "https://www.minedu.gov.gr/site/70350-07-07-26-kathorismos-exetasteas-yles-gia-to-etos-2027-gia-ta-mathemata-pou-exetazontai-panelladika-gia-ten-eisagoge-sten-tritobathmia-ekpaideuse-apophoiton-g-taxes-emeresiou-genikou-lykeiou-kai-g-taxes-esperinou-genikou-lykeiou-2",
      "quizId": "pliroforiki-g-lykeiou"
    }
  ]
};
  const QUIZ_SPECS = [
  {
    "id": "istoria-a-lykeiou",
    "grade": "a",
    "labelEl": "Ιστορία, Α' Λυκείου",
    "labelEn": "History, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "mycenae",
        "labelEl": "Μυκηναϊκός πολιτισμός",
        "labelEn": "Mycenaean civilisation",
        "explainEl": "Χρειάζεται να ξεχωρίζει τον μυκηναϊκό από άλλες περιόδους.",
        "explainEn": "Χρειάζεται να ξεχωρίζει τον μυκηναϊκό από άλλες περιόδους.",
        "qEl": "Ποιο στοιχείο συνδέεται χαρακτηριστικά με τον μυκηναϊκό κόσμο;",
        "qEn": "Ποιο στοιχείο συνδέεται χαρακτηριστικά με τον μυκηναϊκό κόσμο;",
        "correctEl": "Τα ανακτορικά κέντρα όπως οι Μυκήνες και η Γραμμική Β.",
        "correctEn": "Τα ανακτορικά κέντρα όπως οι Μυκήνες και η Γραμμική Β.",
        "wrong1El": "Η δημοκρατία του Περικλή.",
        "wrong1En": "Η δημοκρατία του Περικλή.",
        "wrong2El": "Η Ρωμαϊκή Σύγκλητος.",
        "wrong2En": "Η Ρωμαϊκή Σύγκλητος."
      },
      {
        "slug": "delian",
        "labelEl": "Δηλιακή Συμμαχία",
        "labelEn": "Delian League",
        "explainEl": "Συγχέει τη Δηλιακή Συμμαχία με μεταγενέστερα γεγονότα.",
        "explainEn": "Συγχέει τη Δηλιακή Συμμαχία με μεταγενέστερα γεγονότα.",
        "qEl": "Ποια πόλη εξελίχθηκε σε ηγεμονική δύναμη της Δηλιακής Συμμαχίας;",
        "qEn": "Ποια πόλη εξελίχθηκε σε ηγεμονική δύναμη της Δηλιακής Συμμαχίας;",
        "correctEl": "Η Αθήνα.",
        "correctEn": "Η Αθήνα.",
        "wrong1El": "Η Ρώμη.",
        "wrong1En": "Η Ρώμη.",
        "wrong2El": "Η Αλεξάνδρεια.",
        "wrong2En": "Η Αλεξάνδρεια."
      },
      {
        "slug": "gracchi",
        "labelEl": "Γράκχοι",
        "labelEn": "Gracchi",
        "explainEl": "Χρειάζεται να συνδέσει τους Γράκχους με κοινωνικές και αγροτικές μεταρρυθμίσεις.",
        "explainEn": "Χρειάζεται να συνδέσει τους Γράκχους με κοινωνικές και αγροτικές μεταρρυθμίσεις.",
        "qEl": "Με ποιο ζήτημα συνδέονται κυρίως οι μεταρρυθμιστικές προσπάθειες των Γράκχων;",
        "qEn": "Με ποιο ζήτημα συνδέονται κυρίως οι μεταρρυθμιστικές προσπάθειες των Γράκχων;",
        "correctEl": "Με το αγροτικό και τις κοινωνικές ανισότητες στη Ρώμη.",
        "correctEn": "Με το αγροτικό και τις κοινωνικές ανισότητες στη Ρώμη.",
        "wrong1El": "Με την ίδρυση της Κωνσταντινούπολης.",
        "wrong1En": "Με την ίδρυση της Κωνσταντινούπολης.",
        "wrong2El": "Με την εικονομαχία.",
        "wrong2En": "Με την εικονομαχία."
      },
      {
        "slug": "constantine",
        "labelEl": "Μέγας Κωνσταντίνος",
        "labelEn": "Constantine",
        "explainEl": "Συγχέει τον Κωνσταντίνο με διαφορετικές φάσεις της Ρωμαϊκής ιστορίας.",
        "explainEn": "Συγχέει τον Κωνσταντίνο με διαφορετικές φάσεις της Ρωμαϊκής ιστορίας.",
        "qEl": "Ποια εξέλιξη συνδέεται με τον Μέγα Κωνσταντίνο;",
        "qEn": "Ποια εξέλιξη συνδέεται με τον Μέγα Κωνσταντίνο;",
        "correctEl": "Η ενίσχυση του Χριστιανισμού και η νέα πρωτεύουσα στην Κωνσταντινούπολη.",
        "correctEn": "Η ενίσχυση του Χριστιανισμού και η νέα πρωτεύουσα στην Κωνσταντινούπολη.",
        "wrong1El": "Η ίδρυση της Δηλιακής Συμμαχίας.",
        "wrong1En": "Η ίδρυση της Δηλιακής Συμμαχίας.",
        "wrong2El": "Η κατάκτηση της Περσίας από τον Αλέξανδρο.",
        "wrong2En": "Η κατάκτηση της Περσίας από τον Αλέξανδρο."
      }
    ]
  },
  {
    "id": "archaia-a-lykeiou",
    "grade": "a",
    "labelEl": "Αρχαία Ελληνικά, Α' Λυκείου",
    "labelEn": "Ancient Greek, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "thucydides",
        "labelEl": "Θουκυδίδης",
        "labelEn": "Thucydides",
        "explainEl": "Χρειάζεται να αναγνωρίζει τη μέθοδο και τον σκοπό του ιστορικού.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τη μέθοδο και τον σκοπό του ιστορικού.",
        "qEl": "Ο Θουκυδίδης επιδιώκει κυρίως να παρουσιάσει τα γεγονότα...",
        "qEn": "Ο Θουκυδίδης επιδιώκει κυρίως να παρουσιάσει τα γεγονότα...",
        "correctEl": "με έρευνα των αιτίων και κριτική αξιολόγηση μαρτυριών.",
        "correctEn": "με έρευνα των αιτίων και κριτική αξιολόγηση μαρτυριών.",
        "wrong1El": "ως μυθολογική αφήγηση χωρίς έλεγχο.",
        "wrong1En": "ως μυθολογική αφήγηση χωρίς έλεγχο.",
        "wrong2El": "μόνο ως ποιητικό έργο.",
        "wrong2En": "μόνο ως ποιητικό έργο."
      },
      {
        "slug": "corcyra",
        "labelEl": "Κερκυραϊκά",
        "labelEn": "Corcyra episode",
        "explainEl": "Χρειάζεται να κατανοεί το ιστορικό πλαίσιο της εμφύλιας σύγκρουσης στην Κέρκυρα.",
        "explainEn": "Χρειάζεται να κατανοεί το ιστορικό πλαίσιο της εμφύλιας σύγκρουσης στην Κέρκυρα.",
        "qEl": "Τα Κερκυραϊκά στον Θουκυδίδη συνδέονται με...",
        "qEn": "Τα Κερκυραϊκά στον Θουκυδίδη συνδέονται με...",
        "correctEl": "την εμφύλια σύγκρουση μέσα στο πλαίσιο του Πελοποννησιακού πολέμου.",
        "correctEn": "την εμφύλια σύγκρουση μέσα στο πλαίσιο του Πελοποννησιακού πολέμου.",
        "wrong1El": "τους Περσικούς πολέμους.",
        "wrong1En": "τους Περσικούς πολέμους.",
        "wrong2El": "τη ρωμαϊκή κατάκτηση.",
        "wrong2En": "τη ρωμαϊκή κατάκτηση."
      },
      {
        "slug": "contract",
        "labelEl": "Συνηρημένα ρήματα",
        "labelEn": "Contract verbs",
        "explainEl": "Δεν έχει σταθεροποιήσει τη συστολή των συνηρημένων ρημάτων.",
        "explainEn": "Δεν έχει σταθεροποιήσει τη συστολή των συνηρημένων ρημάτων.",
        "qEl": "Ποιο από τα παρακάτω είναι συνηρημένο ρήμα;",
        "qEn": "Ποιο από τα παρακάτω είναι συνηρημένο ρήμα;",
        "correctEl": "τιμάω/τιμῶ.",
        "correctEn": "τιμάω/τιμῶ.",
        "wrong1El": "λύω.",
        "wrong1En": "λύω.",
        "wrong2El": "γράφω.",
        "wrong2En": "γράφω."
      },
      {
        "slug": "participle",
        "labelEl": "Μετοχή",
        "labelEn": "Participle",
        "explainEl": "Χρειάζεται να αναγνωρίζει τη συντακτική λειτουργία της μετοχής.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τη συντακτική λειτουργία της μετοχής.",
        "qEl": "Η μετοχή στα αρχαία ελληνικά μπορεί να λειτουργεί...",
        "qEn": "Η μετοχή στα αρχαία ελληνικά μπορεί να λειτουργεί...",
        "correctEl": "ως επιθετική, κατηγορηματική ή επιρρηματική.",
        "correctEn": "ως επιθετική, κατηγορηματική ή επιρρηματική.",
        "wrong1El": "μόνο ως άρθρο.",
        "wrong1En": "μόνο ως άρθρο.",
        "wrong2El": "μόνο ως σύνδεσμος.",
        "wrong2En": "μόνο ως σύνδεσμος."
      }
    ]
  },
  {
    "id": "fysiki-a-lykeiou",
    "grade": "a",
    "labelEl": "Φυσική, Α' Λυκείου",
    "labelEn": "Physics, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "acceleration",
        "labelEl": "Επιτάχυνση",
        "labelEn": "Acceleration",
        "explainEl": "Συγχέει ταχύτητα και επιτάχυνση.",
        "explainEn": "Συγχέει ταχύτητα και επιτάχυνση.",
        "qEl": "Ένα σώμα αυξάνει την ταχύτητά του από 4 m/s σε 10 m/s σε 3 s. Η μέση επιτάχυνση είναι...",
        "qEn": "Ένα σώμα αυξάνει την ταχύτητά του από 4 m/s σε 10 m/s σε 3 s. Η μέση επιτάχυνση είναι...",
        "correctEl": "2 m/s².",
        "correctEn": "2 m/s².",
        "wrong1El": "6 m/s².",
        "wrong1En": "6 m/s².",
        "wrong2El": "14 m/s².",
        "wrong2En": "14 m/s²."
      },
      {
        "slug": "newton2",
        "labelEl": "2ος νόμος Νεύτωνα",
        "labelEn": "Newton's second law",
        "explainEl": "Χρειάζεται να συνδέει συνισταμένη δύναμη, μάζα και επιτάχυνση.",
        "explainEn": "Χρειάζεται να συνδέει συνισταμένη δύναμη, μάζα και επιτάχυνση.",
        "qEl": "Σε σώμα 2 kg ασκείται συνισταμένη δύναμη 6 N. Η επιτάχυνσή του είναι...",
        "qEn": "Σε σώμα 2 kg ασκείται συνισταμένη δύναμη 6 N. Η επιτάχυνσή του είναι...",
        "correctEl": "3 m/s².",
        "correctEn": "3 m/s².",
        "wrong1El": "12 m/s².",
        "wrong1En": "12 m/s².",
        "wrong2El": "0,33 m/s².",
        "wrong2En": "0,33 m/s²."
      },
      {
        "slug": "friction",
        "labelEl": "Τριβή",
        "labelEn": "Friction",
        "explainEl": "Συγχέει τη φορά της τριβής.",
        "explainEn": "Συγχέει τη φορά της τριβής.",
        "qEl": "Η τριβή ολίσθησης έχει συνήθως φορά...",
        "qEn": "Η τριβή ολίσθησης έχει συνήθως φορά...",
        "correctEl": "αντίθετη από τη σχετική κίνηση των επιφανειών.",
        "correctEn": "αντίθετη από τη σχετική κίνηση των επιφανειών.",
        "wrong1El": "πάντα προς τα πάνω.",
        "wrong1En": "πάντα προς τα πάνω.",
        "wrong2El": "πάντα ίδια με την ταχύτητα.",
        "wrong2En": "πάντα ίδια με την ταχύτητα."
      },
      {
        "slug": "work-energy",
        "labelEl": "Έργο και ενέργεια",
        "labelEn": "Work and energy",
        "explainEl": "Χρειάζεται να εφαρμόζει τη σχέση έργου και μεταβολής κινητικής ενέργειας.",
        "explainEn": "Χρειάζεται να εφαρμόζει τη σχέση έργου και μεταβολής κινητικής ενέργειας.",
        "qEl": "Το συνολικό έργο των δυνάμεων σε ένα σώμα ισούται με...",
        "qEn": "Το συνολικό έργο των δυνάμεων σε ένα σώμα ισούται με...",
        "correctEl": "τη μεταβολή της κινητικής του ενέργειας.",
        "correctEn": "τη μεταβολή της κινητικής του ενέργειας.",
        "wrong1El": "πάντα τη δυναμική του ενέργεια.",
        "wrong1En": "πάντα τη δυναμική του ενέργεια.",
        "wrong2El": "πάντα μηδέν.",
        "wrong2En": "πάντα μηδέν."
      }
    ]
  },
  {
    "id": "chimeia-a-lykeiou",
    "grade": "a",
    "labelEl": "Χημεία, Α' Λυκείου",
    "labelEn": "Chemistry, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "density",
        "labelEl": "Πυκνότητα",
        "labelEn": "Density",
        "explainEl": "Συγχέει μάζα, όγκο και πυκνότητα.",
        "explainEn": "Συγχέει μάζα, όγκο και πυκνότητα.",
        "qEl": "Σώμα μάζας 100 g έχει όγκο 50 mL. Η πυκνότητά του είναι...",
        "qEn": "Σώμα μάζας 100 g έχει όγκο 50 mL. Η πυκνότητά του είναι...",
        "correctEl": "2 g/mL.",
        "correctEn": "2 g/mL.",
        "wrong1El": "0,5 g/mL.",
        "wrong1En": "0,5 g/mL.",
        "wrong2El": "150 g/mL.",
        "wrong2En": "150 g/mL."
      },
      {
        "slug": "isotope",
        "labelEl": "Ισότοπα",
        "labelEn": "Isotopes",
        "explainEl": "Δεν ξεχωρίζει ατομικό και μαζικό αριθμό.",
        "explainEn": "Δεν ξεχωρίζει ατομικό και μαζικό αριθμό.",
        "qEl": "Ισότοπα του ίδιου στοιχείου έχουν ίδιο...",
        "qEn": "Ισότοπα του ίδιου στοιχείου έχουν ίδιο...",
        "correctEl": "ατομικό αριθμό και διαφορετικό αριθμό νετρονίων.",
        "correctEn": "ατομικό αριθμό και διαφορετικό αριθμό νετρονίων.",
        "wrong1El": "μαζικό αριθμό σε κάθε περίπτωση.",
        "wrong1En": "μαζικό αριθμό σε κάθε περίπτωση.",
        "wrong2El": "αριθμό νετρονίων και διαφορετικά πρωτόνια.",
        "wrong2En": "αριθμό νετρονίων και διαφορετικά πρωτόνια."
      },
      {
        "slug": "ionic-bond",
        "labelEl": "Ιοντικός δεσμός",
        "labelEn": "Ionic bond",
        "explainEl": "Συγχέει ιοντικό και ομοιοπολικό δεσμό.",
        "explainEn": "Συγχέει ιοντικό και ομοιοπολικό δεσμό.",
        "qEl": "Ο ιοντικός δεσμός προκύπτει κυρίως από...",
        "qEn": "Ο ιοντικός δεσμός προκύπτει κυρίως από...",
        "correctEl": "ηλεκτροστατική έλξη αντίθετα φορτισμένων ιόντων.",
        "correctEn": "ηλεκτροστατική έλξη αντίθετα φορτισμένων ιόντων.",
        "wrong1El": "κοινή χρήση πρωτονίων.",
        "wrong1En": "κοινή χρήση πρωτονίων.",
        "wrong2El": "εξαφάνιση ηλεκτρονίων.",
        "wrong2En": "εξαφάνιση ηλεκτρονίων."
      },
      {
        "slug": "mol",
        "labelEl": "Mol",
        "labelEn": "Mole",
        "explainEl": "Χρειάζεται να συνδέει το mol με τον αριθμό Avogadro.",
        "explainEn": "Χρειάζεται να συνδέει το mol με τον αριθμό Avogadro.",
        "qEl": "Ένα mol σωματιδίων περιέχει περίπου...",
        "qEn": "Ένα mol σωματιδίων περιέχει περίπου...",
        "correctEl": "6,02×10²³ σωματίδια.",
        "correctEn": "6,02×10²³ σωματίδια.",
        "wrong1El": "6,02×10⁶ σωματίδια.",
        "wrong1En": "6,02×10⁶ σωματίδια.",
        "wrong2El": "1.000 σωματίδια.",
        "wrong2En": "1.000 σωματίδια."
      }
    ]
  },
  {
    "id": "mathimatika-a-lykeiou",
    "grade": "a",
    "labelEl": "Άλγεβρα, Α' Λυκείου",
    "labelEn": "Algebra, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "absolute",
        "labelEl": "Απόλυτη τιμή",
        "labelEn": "Absolute value",
        "explainEl": "Συγχέει την απόλυτη τιμή με τον αντίθετο αριθμό.",
        "explainEn": "Συγχέει την απόλυτη τιμή με τον αντίθετο αριθμό.",
        "qEl": "|−7| είναι...",
        "qEn": "|−7| είναι...",
        "correctEl": "7.",
        "correctEn": "7.",
        "wrong1El": "−7.",
        "wrong1En": "−7.",
        "wrong2El": "0.",
        "wrong2En": "0."
      },
      {
        "slug": "quadratic",
        "labelEl": "Δευτεροβάθμια εξίσωση",
        "labelEn": "Quadratic equation",
        "explainEl": "Χρειάζεται εξάσκηση στις ρίζες δευτεροβάθμιας εξίσωσης.",
        "explainEn": "Χρειάζεται εξάσκηση στις ρίζες δευτεροβάθμιας εξίσωσης.",
        "qEl": "Οι ρίζες της x²−5x+6=0 είναι...",
        "qEn": "Οι ρίζες της x²−5x+6=0 είναι...",
        "correctEl": "2 και 3.",
        "correctEn": "2 και 3.",
        "wrong1El": "−2 και −3.",
        "wrong1En": "−2 και −3.",
        "wrong2El": "1 και 6.",
        "wrong2En": "1 και 6."
      },
      {
        "slug": "arith-prog",
        "labelEl": "Αριθμητική πρόοδος",
        "labelEn": "Arithmetic progression",
        "explainEl": "Δεν αναγνωρίζει τη σταθερή διαφορά.",
        "explainEn": "Δεν αναγνωρίζει τη σταθερή διαφορά.",
        "qEl": "Η ακολουθία 3, 7, 11, 15,... είναι αριθμητική πρόοδος με διαφορά...",
        "qEn": "Η ακολουθία 3, 7, 11, 15,... είναι αριθμητική πρόοδος με διαφορά...",
        "correctEl": "4.",
        "correctEn": "4.",
        "wrong1El": "3.",
        "wrong1En": "3.",
        "wrong2El": "8.",
        "wrong2En": "8."
      },
      {
        "slug": "linear-f",
        "labelEl": "Γραμμική συνάρτηση",
        "labelEn": "Linear function",
        "explainEl": "Χρειάζεται να συνδέει τον συντελεστή του x με την κλίση.",
        "explainEn": "Χρειάζεται να συνδέει τον συντελεστή του x με την κλίση.",
        "qEl": "Στη f(x)=−2x+5, η κλίση είναι...",
        "qEn": "Στη f(x)=−2x+5, η κλίση είναι...",
        "correctEl": "−2.",
        "correctEn": "−2.",
        "wrong1El": "5.",
        "wrong1En": "5.",
        "wrong2El": "2,5.",
        "wrong2En": "2,5."
      }
    ]
  },
  {
    "id": "geometria-a-lykeiou",
    "grade": "a",
    "labelEl": "Γεωμετρία, Α' Λυκείου",
    "labelEn": "Geometry, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "triangle-sum",
        "labelEl": "Άθροισμα γωνιών τριγώνου",
        "labelEn": "Triangle angle sum",
        "explainEl": "Δεν έχει σταθεροποιήσει το άθροισμα γωνιών τριγώνου.",
        "explainEn": "Δεν έχει σταθεροποιήσει το άθροισμα γωνιών τριγώνου.",
        "qEl": "Δύο γωνίες τριγώνου είναι 50° και 60°. Η τρίτη είναι...",
        "qEn": "Δύο γωνίες τριγώνου είναι 50° και 60°. Η τρίτη είναι...",
        "correctEl": "70°.",
        "correctEn": "70°.",
        "wrong1El": "110°.",
        "wrong1En": "110°.",
        "wrong2El": "80°.",
        "wrong2En": "80°."
      },
      {
        "slug": "triangle-ineq",
        "labelEl": "Τριγωνική ανισότητα",
        "labelEn": "Triangle inequality",
        "explainEl": "Χρειάζεται να ελέγχει αν τρία μήκη μπορούν να σχηματίσουν τρίγωνο.",
        "explainEn": "Χρειάζεται να ελέγχει αν τρία μήκη μπορούν να σχηματίσουν τρίγωνο.",
        "qEl": "Ποια τριάδα μπορεί να είναι πλευρές τριγώνου;",
        "qEn": "Ποια τριάδα μπορεί να είναι πλευρές τριγώνου;",
        "correctEl": "4, 5, 6.",
        "correctEn": "4, 5, 6.",
        "wrong1El": "2, 3, 6.",
        "wrong1En": "2, 3, 6.",
        "wrong2El": "1, 2, 4.",
        "wrong2En": "1, 2, 4."
      },
      {
        "slug": "parallelogram",
        "labelEl": "Παραλληλόγραμμο",
        "labelEn": "Parallelogram",
        "explainEl": "Συγχέει βασικές ιδιότητες τετραπλεύρων.",
        "explainEn": "Συγχέει βασικές ιδιότητες τετραπλεύρων.",
        "qEl": "Σε κάθε παραλληλόγραμμο οι απέναντι πλευρές είναι...",
        "qEn": "Σε κάθε παραλληλόγραμμο οι απέναντι πλευρές είναι...",
        "correctEl": "παράλληλες και ίσες.",
        "correctEn": "παράλληλες και ίσες.",
        "wrong1El": "πάντα κάθετες.",
        "wrong1En": "πάντα κάθετες.",
        "wrong2El": "πάντα διαφορετικού μήκους.",
        "wrong2En": "πάντα διαφορετικού μήκους."
      },
      {
        "slug": "centroid",
        "labelEl": "Βαρύκεντρο",
        "labelEn": "Centroid",
        "explainEl": "Δεν αναγνωρίζει το σημείο τομής των διαμέσων.",
        "explainEn": "Δεν αναγνωρίζει το σημείο τομής των διαμέσων.",
        "qEl": "Το βαρύκεντρο ενός τριγώνου είναι το σημείο τομής των...",
        "qEn": "Το βαρύκεντρο ενός τριγώνου είναι το σημείο τομής των...",
        "correctEl": "διαμέσων.",
        "correctEn": "διαμέσων.",
        "wrong1El": "υψών.",
        "wrong1En": "υψών.",
        "wrong2El": "διχοτόμων.",
        "wrong2En": "διχοτόμων."
      }
    ]
  },
  {
    "id": "pliroforiki-a-lykeiou",
    "grade": "a",
    "labelEl": "Εφαρμογές Πληροφορικής, Α' Λυκείου",
    "labelEn": "Computer Applications, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "html",
        "labelEl": "HTML",
        "labelEn": "HTML",
        "explainEl": "Δεν αναγνωρίζει τον ρόλο της HTML.",
        "explainEn": "Δεν αναγνωρίζει τον ρόλο της HTML.",
        "qEl": "Η HTML χρησιμοποιείται κυρίως για...",
        "qEn": "Η HTML χρησιμοποιείται κυρίως για...",
        "correctEl": "τη δομή και το περιεχόμενο μιας ιστοσελίδας.",
        "correctEn": "τη δομή και το περιεχόμενο μιας ιστοσελίδας.",
        "wrong1El": "την αντικατάσταση του λειτουργικού συστήματος.",
        "wrong1En": "την αντικατάσταση του λειτουργικού συστήματος.",
        "wrong2El": "την κρυπτογράφηση κάθε αρχείου.",
        "wrong2En": "την κρυπτογράφηση κάθε αρχείου."
      },
      {
        "slug": "cloud",
        "labelEl": "Υπολογιστικό νέφος",
        "labelEn": "Cloud computing",
        "explainEl": "Χρειάζεται να κατανοεί τι σημαίνει αποθήκευση/υπηρεσία cloud.",
        "explainEn": "Χρειάζεται να κατανοεί τι σημαίνει αποθήκευση/υπηρεσία cloud.",
        "qEl": "Ένα βασικό πλεονέκτημα του cloud είναι ότι...",
        "qEn": "Ένα βασικό πλεονέκτημα του cloud είναι ότι...",
        "correctEl": "αρχεία και υπηρεσίες μπορούν να είναι διαθέσιμα μέσω διαδικτύου από διαφορετικές συσκευές.",
        "correctEn": "αρχεία και υπηρεσίες μπορούν να είναι διαθέσιμα μέσω διαδικτύου από διαφορετικές συσκευές.",
        "wrong1El": "λειτουργεί μόνο χωρίς διαδίκτυο.",
        "wrong1En": "λειτουργεί μόνο χωρίς διαδίκτυο.",
        "wrong2El": "καταργεί την ανάγκη για κωδικούς.",
        "wrong2En": "καταργεί την ανάγκη για κωδικούς."
      },
      {
        "slug": "collab",
        "labelEl": "Συνεργατικά έγγραφα",
        "labelEn": "Collaborative documents",
        "explainEl": "Δεν έχει ξεκαθαρίσει τη συνεργασία σε κοινό έγγραφο.",
        "explainEn": "Δεν έχει ξεκαθαρίσει τη συνεργασία σε κοινό έγγραφο.",
        "qEl": "Σε ένα συνεργατικό έγγραφο οι χρήστες μπορούν, ανάλογα με τα δικαιώματα,...",
        "qEn": "Σε ένα συνεργατικό έγγραφο οι χρήστες μπορούν, ανάλογα με τα δικαιώματα,...",
        "correctEl": "να επεξεργάζονται το ίδιο αρχείο και να βλέπουν αλλαγές.",
        "correctEn": "να επεξεργάζονται το ίδιο αρχείο και να βλέπουν αλλαγές.",
        "wrong1El": "να αλλάζουν μόνο το όνομα του υπολογιστή.",
        "wrong1En": "να αλλάζουν μόνο το όνομα του υπολογιστή.",
        "wrong2El": "να διαβάζουν πάντα τους κωδικούς των άλλων.",
        "wrong2En": "να διαβάζουν πάντα τους κωδικούς των άλλων."
      },
      {
        "slug": "privacy",
        "labelEl": "Προσωπικά δεδομένα",
        "labelEn": "Personal data",
        "explainEl": "Χρειάζεται να αναγνωρίζει ασφαλείς πρακτικές.",
        "explainEn": "Χρειάζεται να αναγνωρίζει ασφαλείς πρακτικές.",
        "qEl": "Ποια είναι ασφαλέστερη πρακτική;",
        "qEn": "Ποια είναι ασφαλέστερη πρακτική;",
        "correctEl": "Δεν δημοσιεύω ευαίσθητα προσωπικά δεδομένα και ελέγχω τις ρυθμίσεις απορρήτου.",
        "correctEn": "Δεν δημοσιεύω ευαίσθητα προσωπικά δεδομένα και ελέγχω τις ρυθμίσεις απορρήτου.",
        "wrong1El": "Χρησιμοποιώ τον ίδιο απλό κωδικό παντού.",
        "wrong1En": "Χρησιμοποιώ τον ίδιο απλό κωδικό παντού.",
        "wrong2El": "Στέλνω κωδικούς μέσω δημόσιων σχολίων.",
        "wrong2En": "Στέλνω κωδικούς μέσω δημόσιων σχολίων."
      }
    ]
  },
  {
    "id": "biologia-a-lykeiou",
    "grade": "a",
    "labelEl": "Βιολογία, Α' Λυκείου",
    "labelEn": "Biology, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "circulation",
        "labelEl": "Κυκλοφορικό σύστημα",
        "labelEn": "Circulatory system",
        "explainEl": "Συγχέει τον ρόλο καρδιάς και αγγείων.",
        "explainEn": "Συγχέει τον ρόλο καρδιάς και αγγείων.",
        "qEl": "Ποια είναι βασική λειτουργία του κυκλοφορικού συστήματος;",
        "qEn": "Ποια είναι βασική λειτουργία του κυκλοφορικού συστήματος;",
        "correctEl": "Η μεταφορά ουσιών όπως οξυγόνο και θρεπτικά συστατικά.",
        "correctEn": "Η μεταφορά ουσιών όπως οξυγόνο και θρεπτικά συστατικά.",
        "wrong1El": "Η παραγωγή ούρων.",
        "wrong1En": "Η παραγωγή ούρων.",
        "wrong2El": "Η διάσπαση του φωτός.",
        "wrong2En": "Η διάσπαση του φωτός."
      },
      {
        "slug": "respiration",
        "labelEl": "Αναπνευστικό σύστημα",
        "labelEn": "Respiratory system",
        "explainEl": "Χρειάζεται να συνδέει κυψελίδες και ανταλλαγή αερίων.",
        "explainEn": "Χρειάζεται να συνδέει κυψελίδες και ανταλλαγή αερίων.",
        "qEl": "Η ανταλλαγή O₂ και CO₂ στους πνεύμονες γίνεται κυρίως...",
        "qEn": "Η ανταλλαγή O₂ και CO₂ στους πνεύμονες γίνεται κυρίως...",
        "correctEl": "στις πνευμονικές κυψελίδες.",
        "correctEn": "στις πνευμονικές κυψελίδες.",
        "wrong1El": "στο στομάχι.",
        "wrong1En": "στο στομάχι.",
        "wrong2El": "στα οστά.",
        "wrong2En": "στα οστά."
      },
      {
        "slug": "neuron",
        "labelEl": "Νευρικό σύστημα",
        "labelEn": "Nervous system",
        "explainEl": "Δεν αναγνωρίζει τον ρόλο των νευρώνων.",
        "explainEn": "Δεν αναγνωρίζει τον ρόλο των νευρώνων.",
        "qEl": "Οι νευρώνες είναι εξειδικευμένα κύτταρα για...",
        "qEn": "Οι νευρώνες είναι εξειδικευμένα κύτταρα για...",
        "correctEl": "λήψη και μεταβίβαση νευρικών σημάτων.",
        "correctEn": "λήψη και μεταβίβαση νευρικών σημάτων.",
        "wrong1El": "παραγωγή χολής.",
        "wrong1En": "παραγωγή χολής.",
        "wrong2El": "πήξη του αίματος.",
        "wrong2En": "πήξη του αίματος."
      },
      {
        "slug": "homeostasis",
        "labelEl": "Ομοιόσταση",
        "labelEn": "Homeostasis",
        "explainEl": "Χρειάζεται να κατανοεί τη διατήρηση σταθερού εσωτερικού περιβάλλοντος.",
        "explainEn": "Χρειάζεται να κατανοεί τη διατήρηση σταθερού εσωτερικού περιβάλλοντος.",
        "qEl": "Ομοιόσταση είναι...",
        "qEn": "Ομοιόσταση είναι...",
        "correctEl": "η ρύθμιση του εσωτερικού περιβάλλοντος σε σχετικά σταθερές συνθήκες.",
        "correctEn": "η ρύθμιση του εσωτερικού περιβάλλοντος σε σχετικά σταθερές συνθήκες.",
        "wrong1El": "η αύξηση όλων των λειτουργιών συνεχώς.",
        "wrong1En": "η αύξηση όλων των λειτουργιών συνεχώς.",
        "wrong2El": "η διακοπή της επικοινωνίας μεταξύ συστημάτων.",
        "wrong2En": "η διακοπή της επικοινωνίας μεταξύ συστημάτων."
      }
    ]
  },
  {
    "id": "politiki-paideia-a-lykeiou",
    "grade": "a",
    "labelEl": "Πολιτική Παιδεία, Α' Λυκείου",
    "labelEn": "Civic Education, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "separation",
        "labelEl": "Διάκριση εξουσιών",
        "labelEn": "Separation of powers",
        "explainEl": "Συγχέει τις βασικές κρατικές λειτουργίες.",
        "explainEn": "Συγχέει τις βασικές κρατικές λειτουργίες.",
        "qEl": "Η διάκριση των εξουσιών αποσκοπεί κυρίως...",
        "qEn": "Η διάκριση των εξουσιών αποσκοπεί κυρίως...",
        "correctEl": "στον περιορισμό της συγκέντρωσης εξουσίας και στον αμοιβαίο έλεγχο.",
        "correctEn": "στον περιορισμό της συγκέντρωσης εξουσίας και στον αμοιβαίο έλεγχο.",
        "wrong1El": "στην κατάργηση των νόμων.",
        "wrong1En": "στην κατάργηση των νόμων.",
        "wrong2El": "στην απαγόρευση των εκλογών.",
        "wrong2En": "στην απαγόρευση των εκλογών."
      },
      {
        "slug": "rights",
        "labelEl": "Δικαιώματα",
        "labelEn": "Rights",
        "explainEl": "Χρειάζεται να ξεχωρίζει δικαιώματα και υποχρεώσεις.",
        "explainEn": "Χρειάζεται να ξεχωρίζει δικαιώματα και υποχρεώσεις.",
        "qEl": "Το δικαίωμα ψήφου είναι κυρίως...",
        "qEn": "Το δικαίωμα ψήφου είναι κυρίως...",
        "correctEl": "πολιτικό δικαίωμα.",
        "correctEn": "πολιτικό δικαίωμα.",
        "wrong1El": "παραγωγικός συντελεστής.",
        "wrong1En": "παραγωγικός συντελεστής.",
        "wrong2El": "τραπεζική υπηρεσία.",
        "wrong2En": "τραπεζική υπηρεσία."
      },
      {
        "slug": "factors",
        "labelEl": "Παραγωγικοί συντελεστές",
        "labelEn": "Factors of production",
        "explainEl": "Συγχέει βασικές έννοιες οικονομίας.",
        "explainEn": "Συγχέει βασικές έννοιες οικονομίας.",
        "qEl": "Εργασία, γη και κεφάλαιο θεωρούνται...",
        "qEn": "Εργασία, γη και κεφάλαιο θεωρούνται...",
        "correctEl": "παραγωγικοί συντελεστές.",
        "correctEn": "παραγωγικοί συντελεστές.",
        "wrong1El": "είδη φόρων.",
        "wrong1En": "είδη φόρων.",
        "wrong2El": "μορφές πολιτεύματος.",
        "wrong2En": "μορφές πολιτεύματος."
      },
      {
        "slug": "citizenship",
        "labelEl": "Ενεργός πολίτης",
        "labelEn": "Active citizenship",
        "explainEl": "Χρειάζεται να συνδέει δημοκρατία και συμμετοχή.",
        "explainEn": "Χρειάζεται να συνδέει δημοκρατία και συμμετοχή.",
        "qEl": "Παράδειγμα ενεργού πολιτειότητας είναι...",
        "qEn": "Παράδειγμα ενεργού πολιτειότητας είναι...",
        "correctEl": "η ενημερωμένη συμμετοχή σε δημοκρατικές διαδικασίες και κοινές δράσεις.",
        "correctEn": "η ενημερωμένη συμμετοχή σε δημοκρατικές διαδικασίες και κοινές δράσεις.",
        "wrong1El": "η αποφυγή κάθε δημόσιας πληροφορίας.",
        "wrong1En": "η αποφυγή κάθε δημόσιας πληροφορίας.",
        "wrong2El": "η παραβίαση δικαιωμάτων άλλων.",
        "wrong2En": "η παραβίαση δικαιωμάτων άλλων."
      }
    ]
  },
  {
    "id": "english-a-lykeiou",
    "grade": "a",
    "labelEl": "Αγγλικά, Α' Λυκείου",
    "labelEn": "English, 10th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "refugee",
        "labelEl": "Unit 2 — Refugees",
        "labelEn": "Unit 2 — Refugees",
        "explainEl": "Needs to understand key vocabulary and ideas from the unit.",
        "explainEn": "Needs to understand key vocabulary and ideas from the unit.",
        "qEl": "Which word best describes a person forced to leave their country because of danger?",
        "qEn": "Which word best describes a person forced to leave their country because of danger?",
        "correctEl": "Refugee.",
        "correctEn": "Refugee.",
        "wrong1El": "Tourist.",
        "wrong1En": "Tourist.",
        "wrong2El": "Employer.",
        "wrong2En": "Employer."
      },
      {
        "slug": "animal-rights",
        "labelEl": "Unit 5 — Animal rights",
        "labelEn": "Unit 5 — Animal rights",
        "explainEl": "Needs to distinguish arguments about animal welfare.",
        "explainEn": "Needs to distinguish arguments about animal welfare.",
        "qEl": "An argument for animal welfare would most likely support...",
        "qEn": "An argument for animal welfare would most likely support...",
        "correctEl": "reducing unnecessary suffering.",
        "correctEn": "reducing unnecessary suffering.",
        "wrong1El": "ignoring living conditions.",
        "wrong1En": "ignoring living conditions.",
        "wrong2El": "removing every animal habitat.",
        "wrong2En": "removing every animal habitat."
      },
      {
        "slug": "fast-fashion",
        "labelEl": "Unit 6 — Fast fashion",
        "labelEn": "Unit 6 — Fast fashion",
        "explainEl": "Needs to connect fast fashion with environmental and labour issues.",
        "explainEn": "Needs to connect fast fashion with environmental and labour issues.",
        "qEl": "Fast fashion is often criticised because it can involve...",
        "qEn": "Fast fashion is often criticised because it can involve...",
        "correctEl": "high resource use, waste and poor labour conditions.",
        "correctEn": "high resource use, waste and poor labour conditions.",
        "wrong1El": "no production of clothing.",
        "wrong1En": "no production of clothing.",
        "wrong2El": "only hand-made local garments.",
        "wrong2En": "only hand-made local garments."
      },
      {
        "slug": "social-media",
        "labelEl": "Unit 8 — Social media",
        "labelEn": "Unit 8 — Social media",
        "explainEl": "Needs to recognise safe and critical social-media use.",
        "explainEn": "Needs to recognise safe and critical social-media use.",
        "qEl": "Before sharing a surprising claim on social media, the best first step is to...",
        "qEn": "Before sharing a surprising claim on social media, the best first step is to...",
        "correctEl": "check the source and corroborate it.",
        "correctEn": "check the source and corroborate it.",
        "wrong1El": "share it immediately.",
        "wrong1En": "share it immediately.",
        "wrong2El": "assume it is true because it is popular.",
        "wrong2En": "assume it is true because it is popular."
      }
    ]
  },
  {
    "id": "istoria-b-lykeiou",
    "grade": "b",
    "labelEl": "Ιστορία, Β' Λυκείου",
    "labelEn": "History, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "iconoclasm",
        "labelEl": "Εικονομαχία",
        "labelEn": "Iconoclasm",
        "explainEl": "Χρειάζεται να τοποθετεί την Εικονομαχία στο βυζαντινό πλαίσιο.",
        "explainEn": "Χρειάζεται να τοποθετεί την Εικονομαχία στο βυζαντινό πλαίσιο.",
        "qEl": "Η Εικονομαχία αφορούσε κυρίως...",
        "qEn": "Η Εικονομαχία αφορούσε κυρίως...",
        "correctEl": "τη διαμάχη για τη χρήση και τιμή των εικόνων.",
        "correctEn": "τη διαμάχη για τη χρήση και τιμή των εικόνων.",
        "wrong1El": "την ανακάλυψη της Αμερικής.",
        "wrong1En": "την ανακάλυψη της Αμερικής.",
        "wrong2El": "τη Γαλλική Επανάσταση.",
        "wrong2En": "τη Γαλλική Επανάσταση."
      },
      {
        "slug": "schism",
        "labelEl": "Σχίσμα Εκκλησιών",
        "labelEn": "Schism of the Churches",
        "explainEl": "Συγχέει το Σχίσμα με άλλες θρησκευτικές συγκρούσεις.",
        "explainEn": "Συγχέει το Σχίσμα με άλλες θρησκευτικές συγκρούσεις.",
        "qEl": "Το Σχίσμα του 1054 συνδέεται με τη ρήξη μεταξύ...",
        "qEn": "Το Σχίσμα του 1054 συνδέεται με τη ρήξη μεταξύ...",
        "correctEl": "Ανατολικής και Δυτικής Εκκλησίας.",
        "correctEn": "Ανατολικής και Δυτικής Εκκλησίας.",
        "wrong1El": "Βυζαντίου και Περσίας στον 6ο αιώνα.",
        "wrong1En": "Βυζαντίου και Περσίας στον 6ο αιώνα.",
        "wrong2El": "Γαλλίας και Αγγλίας στον Α΄ Παγκόσμιο.",
        "wrong2En": "Γαλλίας και Αγγλίας στον Α΄ Παγκόσμιο."
      },
      {
        "slug": "renaissance",
        "labelEl": "Αναγέννηση",
        "labelEn": "Renaissance",
        "explainEl": "Χρειάζεται να συνδέει Αναγέννηση και Ανθρωπισμό.",
        "explainEn": "Χρειάζεται να συνδέει Αναγέννηση και Ανθρωπισμό.",
        "qEl": "Ο Ανθρωπισμός της Αναγέννησης έδωσε ιδιαίτερη έμφαση...",
        "qEn": "Ο Ανθρωπισμός της Αναγέννησης έδωσε ιδιαίτερη έμφαση...",
        "correctEl": "στη μελέτη της κλασικής γραμματείας και στον άνθρωπο.",
        "correctEn": "στη μελέτη της κλασικής γραμματείας και στον άνθρωπο.",
        "wrong1El": "στην κατάργηση της τυπογραφίας.",
        "wrong1En": "στην κατάργηση της τυπογραφίας.",
        "wrong2El": "στην απομόνωση από τα αρχαία κείμενα.",
        "wrong2En": "στην απομόνωση από τα αρχαία κείμενα."
      },
      {
        "slug": "french-rev",
        "labelEl": "Γαλλική Επανάσταση",
        "labelEn": "French Revolution",
        "explainEl": "Χρειάζεται να αναγνωρίζει βασικές πολιτικές αρχές της Επανάστασης.",
        "explainEn": "Χρειάζεται να αναγνωρίζει βασικές πολιτικές αρχές της Επανάστασης.",
        "qEl": "Ποιο σύνθημα συνδέεται με τη Γαλλική Επανάσταση;",
        "qEn": "Ποιο σύνθημα συνδέεται με τη Γαλλική Επανάσταση;",
        "correctEl": "Ελευθερία, Ισότητα, Αδελφότητα.",
        "correctEn": "Ελευθερία, Ισότητα, Αδελφότητα.",
        "wrong1El": "Θεοκρατία, Φεουδαρχία, Απομόνωση.",
        "wrong1En": "Θεοκρατία, Φεουδαρχία, Απομόνωση.",
        "wrong2El": "Μόνο Βιομηχανία και Εμπόριο.",
        "wrong2En": "Μόνο Βιομηχανία και Εμπόριο."
      }
    ]
  },
  {
    "id": "archaia-b-lykeiou",
    "grade": "b",
    "labelEl": "Αρχαία Ελληνικά, Β' Λυκείου",
    "labelEn": "Ancient Greek, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "rhetoric",
        "labelEl": "Είδη ρητορικού λόγου",
        "labelEn": "Genres of rhetoric",
        "explainEl": "Συγχέει τα βασικά είδη αττικού ρητορικού λόγου.",
        "explainEn": "Συγχέει τα βασικά είδη αττικού ρητορικού λόγου.",
        "qEl": "Ποιο από τα παρακάτω είναι βασικό είδος αττικού ρητορικού λόγου;",
        "qEn": "Ποιο από τα παρακάτω είναι βασικό είδος αττικού ρητορικού λόγου;",
        "correctEl": "Δικανικός λόγος.",
        "correctEn": "Δικανικός λόγος.",
        "wrong1El": "Επικό έπος.",
        "wrong1En": "Επικό έπος.",
        "wrong2El": "Λυρικό μέλος.",
        "wrong2En": "Λυρικό μέλος."
      },
      {
        "slug": "lysias",
        "labelEl": "Λυσίας",
        "labelEn": "Lysias",
        "explainEl": "Χρειάζεται να συνδέει τον Λυσία με το ρητορικό έργο.",
        "explainEn": "Χρειάζεται να συνδέει τον Λυσία με το ρητορικό έργο.",
        "qEl": "Ο Λυσίας είναι γνωστός κυρίως ως...",
        "qEn": "Ο Λυσίας είναι γνωστός κυρίως ως...",
        "correctEl": "λογογράφος και ρήτορας.",
        "correctEn": "λογογράφος και ρήτορας.",
        "wrong1El": "τραγικός ποιητής.",
        "wrong1En": "τραγικός ποιητής.",
        "wrong2El": "ιστορικός της Ρώμης.",
        "wrong2En": "ιστορικός της Ρώμης."
      },
      {
        "slug": "mantitheus",
        "labelEl": "Υπέρ Μαντιθέου",
        "labelEn": "For Mantitheus",
        "explainEl": "Χρειάζεται να κατανοεί τον απολογητικό χαρακτήρα του λόγου.",
        "explainEn": "Χρειάζεται να κατανοεί τον απολογητικό χαρακτήρα του λόγου.",
        "qEl": "Στον «Υπέρ Μαντιθέου» ο ομιλητής επιχειρεί κυρίως...",
        "qEn": "Στον «Υπέρ Μαντιθέου» ο ομιλητής επιχειρεί κυρίως...",
        "correctEl": "να υπερασπιστεί το ήθος και τη δημόσια στάση του.",
        "correctEn": "να υπερασπιστεί το ήθος και τη δημόσια στάση του.",
        "wrong1El": "να περιγράψει φυσικό πείραμα.",
        "wrong1En": "να περιγράψει φυσικό πείραμα.",
        "wrong2El": "να αφηγηθεί την ίδρυση της Ρώμης.",
        "wrong2En": "να αφηγηθεί την ίδρυση της Ρώμης."
      },
      {
        "slug": "unseen",
        "labelEl": "Αδίδακτο κείμενο",
        "labelEn": "Unseen text",
        "explainEl": "Χρειάζεται να συνδυάζει μορφολογία και σύνταξη στην απόδοση αδίδακτου.",
        "explainEn": "Χρειάζεται να συνδυάζει μορφολογία και σύνταξη στην απόδοση αδίδακτου.",
        "qEl": "Για ασφαλή απόδοση ενός αδίδακτου κειμένου, πρώτο χρήσιμο βήμα είναι...",
        "qEn": "Για ασφαλή απόδοση ενός αδίδακτου κειμένου, πρώτο χρήσιμο βήμα είναι...",
        "correctEl": "να εντοπίσεις ρήματα, βασικούς όρους και συντακτικές σχέσεις.",
        "correctEn": "να εντοπίσεις ρήματα, βασικούς όρους και συντακτικές σχέσεις.",
        "wrong1El": "να μεταφράσεις τυχαία λέξη-λέξη.",
        "wrong1En": "να μεταφράσεις τυχαία λέξη-λέξη.",
        "wrong2El": "να αγνοήσεις τις πτώσεις.",
        "wrong2En": "να αγνοήσεις τις πτώσεις."
      }
    ]
  },
  {
    "id": "latinika-b-lykeiou",
    "grade": "b",
    "labelEl": "Λατινικά, Β' Λυκείου",
    "labelEn": "Latin, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "cases",
        "labelEl": "Λατινικές πτώσεις",
        "labelEn": "Latin cases",
        "explainEl": "Χρειάζεται να συνδέει πτώση και συντακτική λειτουργία.",
        "explainEn": "Χρειάζεται να συνδέει πτώση και συντακτική λειτουργία.",
        "qEl": "Η αιτιατική στα λατινικά χρησιμοποιείται συχνά για...",
        "qEn": "Η αιτιατική στα λατινικά χρησιμοποιείται συχνά για...",
        "correctEl": "άμεσο αντικείμενο.",
        "correctEn": "άμεσο αντικείμενο.",
        "wrong1El": "υποκείμενο παθητικού ρήματος μόνο.",
        "wrong1En": "υποκείμενο παθητικού ρήματος μόνο.",
        "wrong2El": "άρθρο.",
        "wrong2En": "άρθρο."
      },
      {
        "slug": "agreement",
        "labelEl": "Συμφωνία επιθέτου",
        "labelEn": "Adjective agreement",
        "explainEl": "Δεν έχει σταθεροποιήσει τη συμφωνία επιθέτου και ουσιαστικού.",
        "explainEn": "Δεν έχει σταθεροποιήσει τη συμφωνία επιθέτου και ουσιαστικού.",
        "qEl": "Ένα λατινικό επίθετο συμφωνεί με το ουσιαστικό του σε...",
        "qEn": "Ένα λατινικό επίθετο συμφωνεί με το ουσιαστικό του σε...",
        "correctEl": "γένος, αριθμό και πτώση.",
        "correctEn": "γένος, αριθμό και πτώση.",
        "wrong1El": "μόνο χρόνο.",
        "wrong1En": "μόνο χρόνο.",
        "wrong2El": "μόνο πρόσωπο.",
        "wrong2En": "μόνο πρόσωπο."
      },
      {
        "slug": "infinitive",
        "labelEl": "Απαρέμφατο",
        "labelEn": "Infinitive",
        "explainEl": "Χρειάζεται να αναγνωρίζει την απαρεμφατική σύνταξη.",
        "explainEn": "Χρειάζεται να αναγνωρίζει την απαρεμφατική σύνταξη.",
        "qEl": "Στην απαρεμφατική σύνταξη το απαρέμφατο λειτουργεί ως...",
        "qEn": "Στην απαρεμφατική σύνταξη το απαρέμφατο λειτουργεί ως...",
        "correctEl": "κεντρικός ρηματικός τύπος εξαρτημένης δήλωσης.",
        "correctEn": "κεντρικός ρηματικός τύπος εξαρτημένης δήλωσης.",
        "wrong1El": "πάντα επίθετο.",
        "wrong1En": "πάντα επίθετο.",
        "wrong2El": "πάντα πρόθεση.",
        "wrong2En": "πάντα πρόθεση."
      },
      {
        "slug": "translation",
        "labelEl": "Μετάφραση",
        "labelEn": "Translation",
        "explainEl": "Χρειάζεται να αποφεύγει μηχανική μετάφραση λέξη προς λέξη.",
        "explainEn": "Χρειάζεται να αποφεύγει μηχανική μετάφραση λέξη προς λέξη.",
        "qEl": "Κατά τη μετάφραση λατινικού κειμένου είναι σημαντικό να...",
        "qEn": "Κατά τη μετάφραση λατινικού κειμένου είναι σημαντικό να...",
        "correctEl": "εντοπίζεις πρώτα συντακτικές σχέσεις και ρηματικούς τύπους.",
        "correctEn": "εντοπίζεις πρώτα συντακτικές σχέσεις και ρηματικούς τύπους.",
        "wrong1El": "αγνοείς τις καταλήξεις.",
        "wrong1En": "αγνοείς τις καταλήξεις.",
        "wrong2El": "κρατάς υποχρεωτικά τη λατινική σειρά λέξεων.",
        "wrong2En": "κρατάς υποχρεωτικά τη λατινική σειρά λέξεων."
      }
    ]
  },
  {
    "id": "filosofia-b-lykeiou",
    "grade": "b",
    "labelEl": "Φιλοσοφία, Β' Λυκείου",
    "labelEn": "Philosophy, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "argument",
        "labelEl": "Επιχείρημα",
        "labelEn": "Argument",
        "explainEl": "Συγχέει επιχείρημα με απλή δήλωση.",
        "explainEn": "Συγχέει επιχείρημα με απλή δήλωση.",
        "qEl": "Ένα επιχείρημα αποτελείται από...",
        "qEn": "Ένα επιχείρημα αποτελείται από...",
        "correctEl": "προκείμενες που υποστηρίζουν ένα συμπέρασμα.",
        "correctEn": "προκείμενες που υποστηρίζουν ένα συμπέρασμα.",
        "wrong1El": "μόνο μία ερώτηση.",
        "wrong1En": "μόνο μία ερώτηση.",
        "wrong2El": "μόνο έναν ορισμό.",
        "wrong2En": "μόνο έναν ορισμό."
      },
      {
        "slug": "validity",
        "labelEl": "Εγκυρότητα",
        "labelEn": "Validity",
        "explainEl": "Χρειάζεται να ξεχωρίζει εγκυρότητα και αλήθεια προτάσεων.",
        "explainEn": "Χρειάζεται να ξεχωρίζει εγκυρότητα και αλήθεια προτάσεων.",
        "qEl": "Ένα παραγωγικό επιχείρημα είναι έγκυρο όταν...",
        "qEn": "Ένα παραγωγικό επιχείρημα είναι έγκυρο όταν...",
        "correctEl": "αν οι προκείμενες είναι αληθείς, το συμπέρασμα δεν μπορεί να είναι ψευδές.",
        "correctEn": "αν οι προκείμενες είναι αληθείς, το συμπέρασμα δεν μπορεί να είναι ψευδές.",
        "wrong1El": "το συμπέρασμα μας αρέσει.",
        "wrong1En": "το συμπέρασμα μας αρέσει.",
        "wrong2El": "έχει πολλές προκείμενες.",
        "wrong2En": "έχει πολλές προκείμενες."
      },
      {
        "slug": "knowledge",
        "labelEl": "Γνώση και πεποίθηση",
        "labelEn": "Knowledge and belief",
        "explainEl": "Δεν ξεχωρίζει γνώση από απλή πεποίθηση.",
        "explainEn": "Δεν ξεχωρίζει γνώση από απλή πεποίθηση.",
        "qEl": "Ποια ερώτηση είναι κατεξοχήν γνωσιολογική;",
        "qEn": "Ποια ερώτηση είναι κατεξοχήν γνωσιολογική;",
        "correctEl": "Πώς μπορούμε να γνωρίζουμε ότι μια πεποίθηση είναι αληθής;",
        "correctEn": "Πώς μπορούμε να γνωρίζουμε ότι μια πεποίθηση είναι αληθής;",
        "wrong1El": "Πόσα μέτρα είναι ένα χιλιόμετρο;",
        "wrong1En": "Πόσα μέτρα είναι ένα χιλιόμετρο;",
        "wrong2El": "Ποιο είναι το σύμβολο του οξυγόνου;",
        "wrong2En": "Ποιο είναι το σύμβολο του οξυγόνου;"
      },
      {
        "slug": "ethics",
        "labelEl": "Ηθική",
        "labelEn": "Ethics",
        "explainEl": "Χρειάζεται να αναγνωρίζει το πεδίο της ηθικής φιλοσοφίας.",
        "explainEn": "Χρειάζεται να αναγνωρίζει το πεδίο της ηθικής φιλοσοφίας.",
        "qEl": "Η ηθική φιλοσοφία εξετάζει κυρίως...",
        "qEn": "Η ηθική φιλοσοφία εξετάζει κυρίως...",
        "correctEl": "τι καθιστά μια πράξη ορθή ή λανθασμένη.",
        "correctEn": "τι καθιστά μια πράξη ορθή ή λανθασμένη.",
        "wrong1El": "την κίνηση των πλανητών.",
        "wrong1En": "την κίνηση των πλανητών.",
        "wrong2El": "μόνο τη γραμματική μιας γλώσσας.",
        "wrong2En": "μόνο τη γραμματική μιας γλώσσας."
      }
    ]
  },
  {
    "id": "fysiki-b-lykeiou",
    "grade": "b",
    "labelEl": "Φυσική Προσανατολισμού, Β' Λυκείου",
    "labelEn": "Physics (Orientation), 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "projectile",
        "labelEl": "Οριζόντια βολή",
        "labelEn": "Horizontal projectile",
        "explainEl": "Συγχέει την οριζόντια και κατακόρυφη συνιστώσα της κίνησης.",
        "explainEn": "Συγχέει την οριζόντια και κατακόρυφη συνιστώσα της κίνησης.",
        "qEl": "Σε οριζόντια βολή χωρίς αντίσταση αέρα, η οριζόντια ταχύτητα...",
        "qEn": "Σε οριζόντια βολή χωρίς αντίσταση αέρα, η οριζόντια ταχύτητα...",
        "correctEl": "παραμένει σταθερή.",
        "correctEn": "παραμένει σταθερή.",
        "wrong1El": "αυξάνεται λόγω βαρύτητας.",
        "wrong1En": "αυξάνεται λόγω βαρύτητας.",
        "wrong2El": "μηδενίζεται αμέσως.",
        "wrong2En": "μηδενίζεται αμέσως."
      },
      {
        "slug": "momentum",
        "labelEl": "Διατήρηση ορμής",
        "labelEn": "Conservation of momentum",
        "explainEl": "Χρειάζεται να εφαρμόζει τη διατήρηση ορμής σε μονωμένο σύστημα.",
        "explainEn": "Χρειάζεται να εφαρμόζει τη διατήρηση ορμής σε μονωμένο σύστημα.",
        "qEl": "Σε μονωμένο σύστημα σωμάτων κατά μια κρούση, η συνολική ορμή...",
        "qEn": "Σε μονωμένο σύστημα σωμάτων κατά μια κρούση, η συνολική ορμή...",
        "correctEl": "διατηρείται.",
        "correctEn": "διατηρείται.",
        "wrong1El": "πάντα μηδενίζεται.",
        "wrong1En": "πάντα μηδενίζεται.",
        "wrong2El": "πάντα διπλασιάζεται.",
        "wrong2En": "πάντα διπλασιάζεται."
      },
      {
        "slug": "gas",
        "labelEl": "Ιδανικό αέριο",
        "labelEn": "Ideal gas",
        "explainEl": "Δεν συνδέει πίεση, όγκο, θερμοκρασία και ποσότητα ύλης.",
        "explainEn": "Δεν συνδέει πίεση, όγκο, θερμοκρασία και ποσότητα ύλης.",
        "qEl": "Η καταστατική εξίσωση ιδανικού αερίου είναι...",
        "qEn": "Η καταστατική εξίσωση ιδανικού αερίου είναι...",
        "correctEl": "pV=nRT.",
        "correctEn": "pV=nRT.",
        "wrong1El": "F=ma.",
        "wrong1En": "F=ma.",
        "wrong2El": "E=mc².",
        "wrong2En": "E=mc²."
      },
      {
        "slug": "first-law",
        "labelEl": "1ος θερμοδυναμικός νόμος",
        "labelEn": "First law of thermodynamics",
        "explainEl": "Χρειάζεται να συνδέει θερμότητα, έργο και εσωτερική ενέργεια.",
        "explainEn": "Χρειάζεται να συνδέει θερμότητα, έργο και εσωτερική ενέργεια.",
        "qEl": "Ο πρώτος θερμοδυναμικός νόμος εκφράζει...",
        "qEn": "Ο πρώτος θερμοδυναμικός νόμος εκφράζει...",
        "correctEl": "διατήρηση ενέργειας σε θερμοδυναμικό σύστημα.",
        "correctEn": "διατήρηση ενέργειας σε θερμοδυναμικό σύστημα.",
        "wrong1El": "διατήρηση μόνο της ορμής.",
        "wrong1En": "διατήρηση μόνο της ορμής.",
        "wrong2El": "νόμο ηλεκτρικής αντίστασης.",
        "wrong2En": "νόμο ηλεκτρικής αντίστασης."
      }
    ]
  },
  {
    "id": "chimeia-b-lykeiou",
    "grade": "b",
    "labelEl": "Χημεία, Β' Λυκείου",
    "labelEn": "Chemistry, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "stoich",
        "labelEl": "Στοιχειομετρία",
        "labelEn": "Stoichiometry",
        "explainEl": "Χρειάζεται να συνδέει συντελεστές αντίδρασης με αναλογίες mol.",
        "explainEn": "Χρειάζεται να συνδέει συντελεστές αντίδρασης με αναλογίες mol.",
        "qEl": "Στην 2H₂ + O₂ → 2H₂O, 2 mol H₂ με περίσσεια O₂ δίνουν...",
        "qEn": "Στην 2H₂ + O₂ → 2H₂O, 2 mol H₂ με περίσσεια O₂ δίνουν...",
        "correctEl": "2 mol H₂O.",
        "correctEn": "2 mol H₂O.",
        "wrong1El": "1 mol H₂O.",
        "wrong1En": "1 mol H₂O.",
        "wrong2El": "4 mol H₂O.",
        "wrong2En": "4 mol H₂O."
      },
      {
        "slug": "homologous",
        "labelEl": "Ομόλογες σειρές",
        "labelEn": "Homologous series",
        "explainEl": "Συγχέει ομόλογη σειρά και ισομέρεια.",
        "explainEn": "Συγχέει ομόλογη σειρά και ισομέρεια.",
        "qEl": "Μια ομόλογη σειρά χαρακτηρίζεται κυρίως από...",
        "qEn": "Μια ομόλογη σειρά χαρακτηρίζεται κυρίως από...",
        "correctEl": "κοινή χαρακτηριστική ομάδα/γενικό τύπο και παρόμοιες χημικές ιδιότητες.",
        "correctEn": "κοινή χαρακτηριστική ομάδα/γενικό τύπο και παρόμοιες χημικές ιδιότητες.",
        "wrong1El": "ίδιο μοριακό τύπο για όλα τα μέλη.",
        "wrong1En": "ίδιο μοριακό τύπο για όλα τα μέλη.",
        "wrong2El": "ίδιο αριθμό ατόμων σε όλα τα μέλη.",
        "wrong2En": "ίδιο αριθμό ατόμων σε όλα τα μέλη."
      },
      {
        "slug": "nomenclature",
        "labelEl": "Ονοματολογία",
        "labelEn": "Nomenclature",
        "explainEl": "Χρειάζεται εξάσκηση στην ονοματολογία άκυκλων οργανικών ενώσεων.",
        "explainEn": "Χρειάζεται εξάσκηση στην ονοματολογία άκυκλων οργανικών ενώσεων.",
        "qEl": "Η ένωση CH₃–CH₂–CH₃ ονομάζεται...",
        "qEn": "Η ένωση CH₃–CH₂–CH₃ ονομάζεται...",
        "correctEl": "προπάνιο.",
        "correctEn": "προπάνιο.",
        "wrong1El": "προπένιο.",
        "wrong1En": "προπένιο.",
        "wrong2El": "αιθάνιο.",
        "wrong2En": "αιθάνιο."
      },
      {
        "slug": "combustion",
        "labelEl": "Καύση υδρογονανθράκων",
        "labelEn": "Hydrocarbon combustion",
        "explainEl": "Χρειάζεται να διακρίνει τέλεια και ατελή καύση.",
        "explainEn": "Χρειάζεται να διακρίνει τέλεια και ατελή καύση.",
        "qEl": "Στην τέλεια καύση υδρογονάνθρακα με αρκετό O₂ σχηματίζονται κυρίως...",
        "qEn": "Στην τέλεια καύση υδρογονάνθρακα με αρκετό O₂ σχηματίζονται κυρίως...",
        "correctEl": "CO₂ και H₂O.",
        "correctEn": "CO₂ και H₂O.",
        "wrong1El": "μόνο H₂.",
        "wrong1En": "μόνο H₂.",
        "wrong2El": "μόνο στερεός C.",
        "wrong2En": "μόνο στερεός C."
      }
    ]
  },
  {
    "id": "biologia-b-lykeiou",
    "grade": "b",
    "labelEl": "Βιολογία Γενικής Παιδείας, Β' Λυκείου",
    "labelEn": "Biology (General Education), 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "specific-immunity",
        "labelEl": "Ειδική ανοσία",
        "labelEn": "Specific immunity",
        "explainEl": "Συγχέει ειδική και μη ειδική άμυνα.",
        "explainEn": "Συγχέει ειδική και μη ειδική άμυνα.",
        "qEl": "Ποιο χαρακτηριστικό συνδέεται με την ειδική ανοσία;",
        "qEn": "Ποιο χαρακτηριστικό συνδέεται με την ειδική ανοσία;",
        "correctEl": "Ανοσολογική μνήμη.",
        "correctEn": "Ανοσολογική μνήμη.",
        "wrong1El": "Το δέρμα ως φυσικός φραγμός μόνο.",
        "wrong1En": "Το δέρμα ως φυσικός φραγμός μόνο.",
        "wrong2El": "Η ίδια ακριβώς αντίδραση σε κάθε αντιγόνο.",
        "wrong2En": "Η ίδια ακριβώς αντίδραση σε κάθε αντιγόνο."
      },
      {
        "slug": "hiv",
        "labelEl": "HIV/AIDS",
        "labelEn": "HIV/AIDS",
        "explainEl": "Χρειάζεται να κατανοεί ποιο σύστημα προσβάλλει ο HIV.",
        "explainEn": "Χρειάζεται να κατανοεί ποιο σύστημα προσβάλλει ο HIV.",
        "qEl": "Ο HIV επηρεάζει κυρίως...",
        "qEn": "Ο HIV επηρεάζει κυρίως...",
        "correctEl": "κύτταρα του ανοσοποιητικού συστήματος.",
        "correctEn": "κύτταρα του ανοσοποιητικού συστήματος.",
        "wrong1El": "τα ερυθρά αιμοσφαίρια μόνο.",
        "wrong1En": "τα ερυθρά αιμοσφαίρια μόνο.",
        "wrong2El": "τα οστά αποκλειστικά.",
        "wrong2En": "τα οστά αποκλειστικά."
      },
      {
        "slug": "food-web",
        "labelEl": "Τροφικό πλέγμα",
        "labelEn": "Food web",
        "explainEl": "Συγχέει τροφική αλυσίδα και πλέγμα.",
        "explainEn": "Συγχέει τροφική αλυσίδα και πλέγμα.",
        "qEl": "Ένα τροφικό πλέγμα δείχνει...",
        "qEn": "Ένα τροφικό πλέγμα δείχνει...",
        "correctEl": "πολλές αλληλοσυνδεόμενες τροφικές σχέσεις σε οικοσύστημα.",
        "correctEn": "πολλές αλληλοσυνδεόμενες τροφικές σχέσεις σε οικοσύστημα.",
        "wrong1El": "μία μόνο γραμμική σχέση πάντα.",
        "wrong1En": "μία μόνο γραμμική σχέση πάντα.",
        "wrong2El": "μόνο τον κύκλο του νερού.",
        "wrong2En": "μόνο τον κύκλο του νερού."
      },
      {
        "slug": "selection",
        "labelEl": "Φυσική επιλογή",
        "labelEn": "Natural selection",
        "explainEl": "Χρειάζεται να συνδέει διαφοροποίηση, αναπαραγωγική επιτυχία και εξέλιξη.",
        "explainEn": "Χρειάζεται να συνδέει διαφοροποίηση, αναπαραγωγική επιτυχία και εξέλιξη.",
        "qEl": "Η φυσική επιλογή ευνοεί χαρακτηριστικά που...",
        "qEn": "Η φυσική επιλογή ευνοεί χαρακτηριστικά που...",
        "correctEl": "αυξάνουν την αναπαραγωγική επιτυχία σε συγκεκριμένο περιβάλλον.",
        "correctEn": "αυξάνουν την αναπαραγωγική επιτυχία σε συγκεκριμένο περιβάλλον.",
        "wrong1El": "εμφανίζονται επειδή τα χρειάζεται ο οργανισμός.",
        "wrong1En": "εμφανίζονται επειδή τα χρειάζεται ο οργανισμός.",
        "wrong2El": "είναι πάντα τα μεγαλύτερα σε μέγεθος.",
        "wrong2En": "είναι πάντα τα μεγαλύτερα σε μέγεθος."
      }
    ]
  },
  {
    "id": "algebra-b-lykeiou",
    "grade": "b",
    "labelEl": "Άλγεβρα, Β' Λυκείου",
    "labelEn": "Algebra, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "monotonic",
        "labelEl": "Μονοτονία",
        "labelEn": "Monotonicity",
        "explainEl": "Χρειάζεται να διαβάζει αύξηση/μείωση συνάρτησης.",
        "explainEn": "Χρειάζεται να διαβάζει αύξηση/μείωση συνάρτησης.",
        "qEl": "Αν καθώς το x αυξάνει, οι τιμές της f(x) επίσης αυξάνουν σε ένα διάστημα, η f είναι...",
        "qEn": "Αν καθώς το x αυξάνει, οι τιμές της f(x) επίσης αυξάνουν σε ένα διάστημα, η f είναι...",
        "correctEl": "γνησίως αύξουσα στο διάστημα.",
        "correctEn": "γνησίως αύξουσα στο διάστημα.",
        "wrong1El": "σταθερή.",
        "wrong1En": "σταθερή.",
        "wrong2El": "άρτια υποχρεωτικά.",
        "wrong2En": "άρτια υποχρεωτικά."
      },
      {
        "slug": "trig",
        "labelEl": "Τριγωνομετρία",
        "labelEn": "Trigonometry",
        "explainEl": "Δεν έχει σταθεροποιήσει βασικές τιμές.",
        "explainEn": "Δεν έχει σταθεροποιήσει βασικές τιμές.",
        "qEl": "ημ30° = ...",
        "qEn": "ημ30° = ...",
        "correctEl": "1/2.",
        "correctEn": "1/2.",
        "wrong1El": "√3/2.",
        "wrong1En": "√3/2.",
        "wrong2El": "1.",
        "wrong2En": "1."
      },
      {
        "slug": "poly",
        "labelEl": "Πολυώνυμα",
        "labelEn": "Polynomials",
        "explainEl": "Χρειάζεται να εφαρμόζει διαίρεση/παραγοντοποίηση πολυωνύμων.",
        "explainEn": "Χρειάζεται να εφαρμόζει διαίρεση/παραγοντοποίηση πολυωνύμων.",
        "qEl": "Το x²−9 παραγοντοποιείται ως...",
        "qEn": "Το x²−9 παραγοντοποιείται ως...",
        "correctEl": "(x−3)(x+3).",
        "correctEn": "(x−3)(x+3).",
        "wrong1El": "(x−9)(x+1).",
        "wrong1En": "(x−9)(x+1).",
        "wrong2El": "(x−3)².",
        "wrong2En": "(x−3)²."
      },
      {
        "slug": "log",
        "labelEl": "Λογάριθμοι",
        "labelEn": "Logarithms",
        "explainEl": "Συγχέει λογάριθμο και δύναμη.",
        "explainEn": "Συγχέει λογάριθμο και δύναμη.",
        "qEl": "log₁₀(1000) = ...",
        "qEn": "log₁₀(1000) = ...",
        "correctEl": "3.",
        "correctEn": "3.",
        "wrong1El": "100.",
        "wrong1En": "100.",
        "wrong2El": "10.",
        "wrong2En": "10."
      }
    ]
  },
  {
    "id": "geometria-b-lykeiou",
    "grade": "b",
    "labelEl": "Γεωμετρία, Β' Λυκείου",
    "labelEn": "Geometry, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "thales",
        "labelEl": "Θεώρημα Θαλή",
        "labelEn": "Thales' theorem",
        "explainEl": "Χρειάζεται να συνδέει παράλληλες με ανάλογα τμήματα.",
        "explainEn": "Χρειάζεται να συνδέει παράλληλες με ανάλογα τμήματα.",
        "qEl": "Στο θεώρημα Θαλή, παράλληλες ευθείες που τέμνουν δύο τέμνουσες δημιουργούν...",
        "qEn": "Στο θεώρημα Θαλή, παράλληλες ευθείες που τέμνουν δύο τέμνουσες δημιουργούν...",
        "correctEl": "ανάλογα τμήματα.",
        "correctEn": "ανάλογα τμήματα.",
        "wrong1El": "πάντα ίσα τρίγωνα.",
        "wrong1En": "πάντα ίσα τρίγωνα.",
        "wrong2El": "πάντα ορθές γωνίες.",
        "wrong2En": "πάντα ορθές γωνίες."
      },
      {
        "slug": "similar",
        "labelEl": "Ομοιότητα",
        "labelEn": "Similarity",
        "explainEl": "Συγχέει ομοιότητα και ισότητα.",
        "explainEn": "Συγχέει ομοιότητα και ισότητα.",
        "qEl": "Δύο όμοια τρίγωνα έχουν...",
        "qEn": "Δύο όμοια τρίγωνα έχουν...",
        "correctEl": "ίσες αντίστοιχες γωνίες και ανάλογες πλευρές.",
        "correctEn": "ίσες αντίστοιχες γωνίες και ανάλογες πλευρές.",
        "wrong1El": "πάντα ίσα εμβαδά.",
        "wrong1En": "πάντα ίσα εμβαδά.",
        "wrong2El": "πάντα ίσες πλευρές.",
        "wrong2En": "πάντα ίσες πλευρές."
      },
      {
        "slug": "pythagoras",
        "labelEl": "Πυθαγόρειο θεώρημα",
        "labelEn": "Pythagorean theorem",
        "explainEl": "Χρειάζεται να εφαρμόζει το θεώρημα σε ορθογώνιο τρίγωνο.",
        "explainEn": "Χρειάζεται να εφαρμόζει το θεώρημα σε ορθογώνιο τρίγωνο.",
        "qEl": "Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 3 και 4, η υποτείνουσα είναι...",
        "qEn": "Σε ορθογώνιο τρίγωνο με κάθετες πλευρές 3 και 4, η υποτείνουσα είναι...",
        "correctEl": "5.",
        "correctEn": "5.",
        "wrong1El": "7.",
        "wrong1En": "7.",
        "wrong2El": "12.",
        "wrong2En": "12."
      },
      {
        "slug": "sector",
        "labelEl": "Κυκλικός τομέας",
        "labelEn": "Circular sector",
        "explainEl": "Χρειάζεται να συνδέει κεντρική γωνία και μέρος του κύκλου.",
        "explainEn": "Χρειάζεται να συνδέει κεντρική γωνία και μέρος του κύκλου.",
        "qEl": "Κυκλικός τομέας 90° αντιστοιχεί σε...",
        "qEn": "Κυκλικός τομέας 90° αντιστοιχεί σε...",
        "correctEl": "το 1/4 του κύκλου.",
        "correctEn": "το 1/4 του κύκλου.",
        "wrong1El": "το 1/2 του κύκλου.",
        "wrong1En": "το 1/2 του κύκλου.",
        "wrong2El": "όλον τον κύκλο.",
        "wrong2En": "όλον τον κύκλο."
      }
    ]
  },
  {
    "id": "mathimatika-b-prosanatolismou",
    "grade": "b",
    "labelEl": "Μαθηματικά Προσανατολισμού, Β' Λυκείου",
    "labelEn": "Mathematics (Orientation), 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "vector-add",
        "labelEl": "Πρόσθεση διανυσμάτων",
        "labelEn": "Vector addition",
        "explainEl": "Συγχέει τις συντεταγμένες στο άθροισμα.",
        "explainEn": "Συγχέει τις συντεταγμένες στο άθροισμα.",
        "qEl": "Αν α=(2,1) και β=(−1,3), τότε α+β=...",
        "qEn": "Αν α=(2,1) και β=(−1,3), τότε α+β=...",
        "correctEl": "(1,4).",
        "correctEn": "(1,4).",
        "wrong1El": "(3,−2).",
        "wrong1En": "(3,−2).",
        "wrong2El": "(−2,3).",
        "wrong2En": "(−2,3)."
      },
      {
        "slug": "dot",
        "labelEl": "Εσωτερικό γινόμενο",
        "labelEn": "Dot product",
        "explainEl": "Χρειάζεται να συνδέει εσωτερικό γινόμενο και καθετότητα.",
        "explainEn": "Χρειάζεται να συνδέει εσωτερικό γινόμενο και καθετότητα.",
        "qEl": "Αν δύο μη μηδενικά διανύσματα είναι κάθετα, το εσωτερικό γινόμενό τους είναι...",
        "qEn": "Αν δύο μη μηδενικά διανύσματα είναι κάθετα, το εσωτερικό γινόμενό τους είναι...",
        "correctEl": "0.",
        "correctEn": "0.",
        "wrong1El": "1.",
        "wrong1En": "1.",
        "wrong2El": "πάντα αρνητικό.",
        "wrong2En": "πάντα αρνητικό."
      },
      {
        "slug": "line",
        "labelEl": "Εξίσωση ευθείας",
        "labelEn": "Line equation",
        "explainEl": "Χρειάζεται να αναγνωρίζει την κλίση.",
        "explainEn": "Χρειάζεται να αναγνωρίζει την κλίση.",
        "qEl": "Στην y=3x−2 η κλίση είναι...",
        "qEn": "Στην y=3x−2 η κλίση είναι...",
        "correctEl": "3.",
        "correctEn": "3.",
        "wrong1El": "−2.",
        "wrong1En": "−2.",
        "wrong2El": "1/3.",
        "wrong2En": "1/3."
      },
      {
        "slug": "circle",
        "labelEl": "Κύκλος",
        "labelEn": "Circle",
        "explainEl": "Χρειάζεται να αναγνωρίζει τυπική εξίσωση κύκλου.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τυπική εξίσωση κύκλου.",
        "qEl": "Η x²+y²=9 παριστάνει κύκλο με ακτίνα...",
        "qEn": "Η x²+y²=9 παριστάνει κύκλο με ακτίνα...",
        "correctEl": "3.",
        "correctEn": "3.",
        "wrong1El": "9.",
        "wrong1En": "9.",
        "wrong2El": "81.",
        "wrong2En": "81."
      }
    ]
  },
  {
    "id": "pliroforiki-b-lykeiou",
    "grade": "b",
    "labelEl": "Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ, Β' Λυκείου",
    "labelEn": "Introduction to Computer Science, 11th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "algorithm",
        "labelEl": "Αλγόριθμος",
        "labelEn": "Algorithm",
        "explainEl": "Δεν αναγνωρίζει τα βασικά χαρακτηριστικά αλγορίθμου.",
        "explainEn": "Δεν αναγνωρίζει τα βασικά χαρακτηριστικά αλγορίθμου.",
        "qEl": "Ένας αλγόριθμος πρέπει να έχει...",
        "qEn": "Ένας αλγόριθμος πρέπει να έχει...",
        "correctEl": "σαφή και πεπερασμένα βήματα.",
        "correctEn": "σαφή και πεπερασμένα βήματα.",
        "wrong1El": "απαραίτητα άπειρα βήματα.",
        "wrong1En": "απαραίτητα άπειρα βήματα.",
        "wrong2El": "καμία συγκεκριμένη έξοδο.",
        "wrong2En": "καμία συγκεκριμένη έξοδο."
      },
      {
        "slug": "selection",
        "labelEl": "Δομή επιλογής",
        "labelEn": "Selection",
        "explainEl": "Συγχέει επιλογή και επανάληψη.",
        "explainEn": "Συγχέει επιλογή και επανάληψη.",
        "qEl": "Αν μια ενέργεια εκτελείται μόνο όταν ισχύει συνθήκη, χρησιμοποιούμε...",
        "qEn": "Αν μια ενέργεια εκτελείται μόνο όταν ισχύει συνθήκη, χρησιμοποιούμε...",
        "correctEl": "δομή επιλογής.",
        "correctEn": "δομή επιλογής.",
        "wrong1El": "μόνο δομή ακολουθίας.",
        "wrong1En": "μόνο δομή ακολουθίας.",
        "wrong2El": "κανένα αλγοριθμικό σχήμα.",
        "wrong2En": "κανένα αλγοριθμικό σχήμα."
      },
      {
        "slug": "os",
        "labelEl": "Λειτουργικό σύστημα",
        "labelEn": "Operating system",
        "explainEl": "Δεν έχει ξεκαθαρίσει τον ρόλο λειτουργικού συστήματος.",
        "explainEn": "Δεν έχει ξεκαθαρίσει τον ρόλο λειτουργικού συστήματος.",
        "qEl": "Βασικός ρόλος λειτουργικού συστήματος είναι...",
        "qEn": "Βασικός ρόλος λειτουργικού συστήματος είναι...",
        "correctEl": "η διαχείριση πόρων και η εκτέλεση προγραμμάτων.",
        "correctEn": "η διαχείριση πόρων και η εκτέλεση προγραμμάτων.",
        "wrong1El": "η αντικατάσταση του υλικού.",
        "wrong1En": "η αντικατάσταση του υλικού.",
        "wrong2El": "μόνο η ζωγραφική.",
        "wrong2En": "μόνο η ζωγραφική."
      },
      {
        "slug": "ai",
        "labelEl": "Τεχνητή Νοημοσύνη",
        "labelEn": "Artificial Intelligence",
        "explainEl": "Χρειάζεται να ξεχωρίζει εφαρμογές ΤΝ από συμβατικές λειτουργίες.",
        "explainEn": "Χρειάζεται να ξεχωρίζει εφαρμογές ΤΝ από συμβατικές λειτουργίες.",
        "qEl": "Σύστημα που μαθαίνει μοτίβα από δεδομένα για να κάνει προβλέψεις είναι παράδειγμα...",
        "qEn": "Σύστημα που μαθαίνει μοτίβα από δεδομένα για να κάνει προβλέψεις είναι παράδειγμα...",
        "correctEl": "εφαρμογής Τεχνητής Νοημοσύνης.",
        "correctEn": "εφαρμογής Τεχνητής Νοημοσύνης.",
        "wrong1El": "απλού καλωδίου δικτύου.",
        "wrong1En": "απλού καλωδίου δικτύου.",
        "wrong2El": "μηχανικού διακόπτη.",
        "wrong2En": "μηχανικού διακόπτη."
      }
    ]
  },
  {
    "id": "istoria-g-lykeiou",
    "grade": "c",
    "labelEl": "Ιστορία Γενικής Παιδείας, Γ' Λυκείου",
    "labelEn": "History (General Education), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "industrial",
        "labelEl": "Βιομηχανική Επανάσταση",
        "labelEn": "Industrial Revolution",
        "explainEl": "Χρειάζεται να συνδέει εκβιομηχάνιση και κοινωνικές μεταβολές.",
        "explainEn": "Χρειάζεται να συνδέει εκβιομηχάνιση και κοινωνικές μεταβολές.",
        "qEl": "Ποια μεταβολή συνδέεται άμεσα με τη Βιομηχανική Επανάσταση;",
        "qEn": "Ποια μεταβολή συνδέεται άμεσα με τη Βιομηχανική Επανάσταση;",
        "correctEl": "Η ανάπτυξη εργοστασιακής παραγωγής και αστικοποίηση.",
        "correctEn": "Η ανάπτυξη εργοστασιακής παραγωγής και αστικοποίηση.",
        "wrong1El": "Η επιστροφή αποκλειστικά στη φεουδαρχική οικονομία.",
        "wrong1En": "Η επιστροφή αποκλειστικά στη φεουδαρχική οικονομία.",
        "wrong2El": "Η κατάργηση των μηχανών.",
        "wrong2En": "Η κατάργηση των μηχανών."
      },
      {
        "slug": "ww1",
        "labelEl": "Α΄ Παγκόσμιος Πόλεμος",
        "labelEn": "First World War",
        "explainEl": "Συγχέει τα γεγονότα των δύο παγκοσμίων πολέμων.",
        "explainEn": "Συγχέει τα γεγονότα των δύο παγκοσμίων πολέμων.",
        "qEl": "Ο Α΄ Παγκόσμιος Πόλεμος άρχισε το...",
        "qEn": "Ο Α΄ Παγκόσμιος Πόλεμος άρχισε το...",
        "correctEl": "1914.",
        "correctEn": "1914.",
        "wrong1El": "1939.",
        "wrong1En": "1939.",
        "wrong2El": "1945.",
        "wrong2En": "1945."
      },
      {
        "slug": "asia-minor",
        "labelEl": "Μικρασιατική Καταστροφή",
        "labelEn": "Asia Minor Catastrophe",
        "explainEl": "Χρειάζεται να συνδέει το 1922 με προσφυγικές μετακινήσεις.",
        "explainEn": "Χρειάζεται να συνδέει το 1922 με προσφυγικές μετακινήσεις.",
        "qEl": "Η Μικρασιατική Καταστροφή του 1922 οδήγησε, μεταξύ άλλων,...",
        "qEn": "Η Μικρασιατική Καταστροφή του 1922 οδήγησε, μεταξύ άλλων,...",
        "correctEl": "σε μαζική άφιξη προσφύγων στην Ελλάδα.",
        "correctEn": "σε μαζική άφιξη προσφύγων στην Ελλάδα.",
        "wrong1El": "στην ίδρυση της ΕΟΚ.",
        "wrong1En": "στην ίδρυση της ΕΟΚ.",
        "wrong2El": "στο τέλος του Β΄ Παγκοσμίου Πολέμου.",
        "wrong2En": "στο τέλος του Β΄ Παγκοσμίου Πολέμου."
      },
      {
        "slug": "cold-war",
        "labelEl": "Ψυχρός Πόλεμος",
        "labelEn": "Cold War",
        "explainEl": "Χρειάζεται να κατανοεί τη μεταπολεμική διπολική αντιπαράθεση.",
        "explainEn": "Χρειάζεται να κατανοεί τη μεταπολεμική διπολική αντιπαράθεση.",
        "qEl": "Ο Ψυχρός Πόλεμος χαρακτηρίστηκε κυρίως από αντιπαράθεση...",
        "qEn": "Ο Ψυχρός Πόλεμος χαρακτηρίστηκε κυρίως από αντιπαράθεση...",
        "correctEl": "ΗΠΑ και Σοβιετικής Ένωσης και των συνασπισμών τους.",
        "correctEn": "ΗΠΑ και Σοβιετικής Ένωσης και των συνασπισμών τους.",
        "wrong1El": "Αθήνας και Σπάρτης.",
        "wrong1En": "Αθήνας και Σπάρτης.",
        "wrong2El": "Ρώμης και Καρχηδόνας.",
        "wrong2En": "Ρώμης και Καρχηδόνας."
      }
    ]
  },
  {
    "id": "istoria-g-prosanatolismou",
    "grade": "c",
    "labelEl": "Ιστορία Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "History (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "railways",
        "labelEl": "Ελληνική οικονομία – σιδηρόδρομοι",
        "labelEn": "Greek economy – railways",
        "explainEl": "Χρειάζεται να συνδέει τα δημόσια έργα με τον οικονομικό εκσυγχρονισμό.",
        "explainEn": "Χρειάζεται να συνδέει τα δημόσια έργα με τον οικονομικό εκσυγχρονισμό.",
        "qEl": "Η ανάπτυξη σιδηροδρομικού δικτύου στον 19ο αιώνα συνδέθηκε κυρίως με...",
        "qEn": "Η ανάπτυξη σιδηροδρομικού δικτύου στον 19ο αιώνα συνδέθηκε κυρίως με...",
        "correctEl": "την προσπάθεια εκσυγχρονισμού υποδομών και αγοράς.",
        "correctEn": "την προσπάθεια εκσυγχρονισμού υποδομών και αγοράς.",
        "wrong1El": "την κατάργηση των μεταφορών.",
        "wrong1En": "την κατάργηση των μεταφορών.",
        "wrong2El": "τη Βυζαντινή διπλωματία.",
        "wrong2En": "τη Βυζαντινή διπλωματία."
      },
      {
        "slug": "trikoupis",
        "labelEl": "Τρικούπης",
        "labelEn": "Trikoupis",
        "explainEl": "Χρειάζεται να συνδέει τον Τρικούπη με εκσυγχρονισμό και δανεισμό.",
        "explainEn": "Χρειάζεται να συνδέει τον Τρικούπη με εκσυγχρονισμό και δανεισμό.",
        "qEl": "Ο Χαρίλαος Τρικούπης συνδέεται ιδιαίτερα με...",
        "qEn": "Ο Χαρίλαος Τρικούπης συνδέεται ιδιαίτερα με...",
        "correctEl": "πρόγραμμα υποδομών και εκσυγχρονισμού του κράτους.",
        "correctEn": "πρόγραμμα υποδομών και εκσυγχρονισμού του κράτους.",
        "wrong1El": "την ίδρυση της Φιλικής Εταιρείας.",
        "wrong1En": "την ίδρυση της Φιλικής Εταιρείας.",
        "wrong2El": "την Άλωση του 1453.",
        "wrong2En": "την Άλωση του 1453."
      },
      {
        "slug": "refugees",
        "labelEl": "Προσφυγική αποκατάσταση",
        "labelEn": "Refugee settlement",
        "explainEl": "Χρειάζεται να αναγνωρίζει τον ρόλο της ΕΑΠ.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τον ρόλο της ΕΑΠ.",
        "qEl": "Η Επιτροπή Αποκαταστάσεως Προσφύγων είχε βασικό έργο...",
        "qEn": "Η Επιτροπή Αποκαταστάσεως Προσφύγων είχε βασικό έργο...",
        "correctEl": "την οργανωμένη αποκατάσταση προσφύγων μετά το 1922.",
        "correctEn": "την οργανωμένη αποκατάσταση προσφύγων μετά το 1922.",
        "wrong1El": "την οργάνωση των Βαλκανικών Πολέμων.",
        "wrong1En": "την οργάνωση των Βαλκανικών Πολέμων.",
        "wrong2El": "τη σύνταξη του Συντάγματος του 1844.",
        "wrong2En": "τη σύνταξη του Συντάγματος του 1844."
      },
      {
        "slug": "crete",
        "labelEl": "Κρητικό Ζήτημα",
        "labelEn": "Cretan Question",
        "explainEl": "Χρειάζεται να συνδέει Θέρισο και Βενιζέλο.",
        "explainEn": "Χρειάζεται να συνδέει Θέρισο και Βενιζέλο.",
        "qEl": "Η επανάσταση του Θερίσου συνδέεται με...",
        "qEn": "Η επανάσταση του Θερίσου συνδέεται με...",
        "correctEl": "τον Ελευθέριο Βενιζέλο και το Κρητικό Ζήτημα.",
        "correctEn": "τον Ελευθέριο Βενιζέλο και το Κρητικό Ζήτημα.",
        "wrong1El": "τον Ιωάννη Καποδίστρια και το 1828.",
        "wrong1En": "τον Ιωάννη Καποδίστρια και το 1828.",
        "wrong2El": "τον Διοκλητιανό.",
        "wrong2En": "τον Διοκλητιανό."
      }
    ]
  },
  {
    "id": "archaia-g-lykeiou",
    "grade": "c",
    "labelEl": "Αρχαία Ελληνικά Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Ancient Greek (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "cave",
        "labelEl": "Αλληγορία σπηλαίου",
        "labelEn": "Allegory of the cave",
        "explainEl": "Χρειάζεται να συνδέει την αλληγορία με παιδεία και γνώση.",
        "explainEn": "Χρειάζεται να συνδέει την αλληγορία με παιδεία και γνώση.",
        "qEl": "Στην αλληγορία του σπηλαίου, η έξοδος προς το φως συμβολίζει κυρίως...",
        "qEn": "Στην αλληγορία του σπηλαίου, η έξοδος προς το φως συμβολίζει κυρίως...",
        "correctEl": "την πορεία προς τη γνώση και την παιδεία.",
        "correctEn": "την πορεία προς τη γνώση και την παιδεία.",
        "wrong1El": "μια στρατιωτική νίκη.",
        "wrong1En": "μια στρατιωτική νίκη.",
        "wrong2El": "μια οικονομική συναλλαγή.",
        "wrong2En": "μια οικονομική συναλλαγή."
      },
      {
        "slug": "virtue",
        "labelEl": "Αριστοτέλης – αρετή",
        "labelEn": "Aristotle – virtue",
        "explainEl": "Χρειάζεται να κατανοεί τη μεσότητα.",
        "explainEn": "Χρειάζεται να κατανοεί τη μεσότητα.",
        "qEl": "Στον Αριστοτέλη, η ηθική αρετή συνδέεται με...",
        "qEn": "Στον Αριστοτέλη, η ηθική αρετή συνδέεται με...",
        "correctEl": "τη μεσότητα σε σχέση με εμάς και την έξη.",
        "correctEn": "τη μεσότητα σε σχέση με εμάς και την έξη.",
        "wrong1El": "την πλήρη απουσία επιλογής.",
        "wrong1En": "την πλήρη απουσία επιλογής.",
        "wrong2El": "τη γνώση χωρίς πράξη.",
        "wrong2En": "τη γνώση χωρίς πράξη."
      },
      {
        "slug": "political-animal",
        "labelEl": "Πολιτικό ζώο",
        "labelEn": "Political animal",
        "explainEl": "Χρειάζεται να συνδέει άνθρωπο και πόλη.",
        "explainEn": "Χρειάζεται να συνδέει άνθρωπο και πόλη.",
        "qEl": "Η φράση «ὁ ἄνθρωπος φύσει πολιτικὸν ζῷον» σημαίνει ότι ο άνθρωπος...",
        "qEn": "Η φράση «ὁ ἄνθρωπος φύσει πολιτικὸν ζῷον» σημαίνει ότι ο άνθρωπος...",
        "correctEl": "ολοκληρώνεται μέσα σε οργανωμένη κοινωνική/πολιτική κοινότητα.",
        "correctEn": "ολοκληρώνεται μέσα σε οργανωμένη κοινωνική/πολιτική κοινότητα.",
        "wrong1El": "πρέπει να ζει μόνος.",
        "wrong1En": "πρέπει να ζει μόνος.",
        "wrong2El": "είναι βιολογικά ίδιος με κάθε ζώο.",
        "wrong2En": "είναι βιολογικά ίδιος με κάθε ζώο."
      },
      {
        "slug": "unseen-syntax",
        "labelEl": "Αδίδακτο – σύνταξη",
        "labelEn": "Unseen text – syntax",
        "explainEl": "Χρειάζεται να εντοπίζει βασικές συντακτικές σχέσεις πριν μεταφράσει.",
        "explainEn": "Χρειάζεται να εντοπίζει βασικές συντακτικές σχέσεις πριν μεταφράσει.",
        "qEl": "Σε αδίδακτο κείμενο, η αναγνώριση ρήματος και υποκειμένου βοηθά κυρίως...",
        "qEn": "Σε αδίδακτο κείμενο, η αναγνώριση ρήματος και υποκειμένου βοηθά κυρίως...",
        "correctEl": "να οργανωθεί σωστά η συντακτική και νοηματική απόδοση.",
        "correctEn": "να οργανωθεί σωστά η συντακτική και νοηματική απόδοση.",
        "wrong1El": "να αγνοηθούν οι πτώσεις.",
        "wrong1En": "να αγνοηθούν οι πτώσεις.",
        "wrong2El": "να αλλάξει το αρχαίο κείμενο.",
        "wrong2En": "να αλλάξει το αρχαίο κείμενο."
      }
    ]
  },
  {
    "id": "latinika-g-lykeiou",
    "grade": "c",
    "labelEl": "Λατινικά Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Latin (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "sequence",
        "labelEl": "Ακολουθία χρόνων",
        "labelEn": "Sequence of tenses",
        "explainEl": "Χρειάζεται να συνδέει χρόνο εξάρτησης και υποτακτική.",
        "explainEn": "Χρειάζεται να συνδέει χρόνο εξάρτησης και υποτακτική.",
        "qEl": "Η ακολουθία χρόνων στα λατινικά αφορά...",
        "qEn": "Η ακολουθία χρόνων στα λατινικά αφορά...",
        "correctEl": "τη σχέση χρόνου του ρήματος εξάρτησης με τον χρόνο της υποτακτικής.",
        "correctEn": "τη σχέση χρόνου του ρήματος εξάρτησης με τον χρόνο της υποτακτικής.",
        "wrong1El": "την αλφαβητική σειρά λέξεων.",
        "wrong1En": "την αλφαβητική σειρά λέξεων.",
        "wrong2El": "μόνο τις πτώσεις ουσιαστικών.",
        "wrong2En": "μόνο τις πτώσεις ουσιαστικών."
      },
      {
        "slug": "ablative-absolute",
        "labelEl": "Αφαιρετική απόλυτη",
        "labelEn": "Ablative absolute",
        "explainEl": "Δεν αναγνωρίζει την ανεξάρτητη μετοχική κατασκευή.",
        "explainEn": "Δεν αναγνωρίζει την ανεξάρτητη μετοχική κατασκευή.",
        "qEl": "Η αφαιρετική απόλυτη αποτελείται τυπικά από...",
        "qEn": "Η αφαιρετική απόλυτη αποτελείται τυπικά από...",
        "correctEl": "όνομα/αντωνυμία και μετοχή σε αφαιρετική.",
        "correctEn": "όνομα/αντωνυμία και μετοχή σε αφαιρετική.",
        "wrong1El": "δύο ρήματα σε προστακτική.",
        "wrong1En": "δύο ρήματα σε προστακτική.",
        "wrong2El": "μόνο ένα επίρρημα.",
        "wrong2En": "μόνο ένα επίρρημα."
      },
      {
        "slug": "gerundive",
        "labelEl": "Γερουνδιακό",
        "labelEn": "Gerundive",
        "explainEl": "Χρειάζεται να αναγνωρίζει τη σημασία αναγκαιότητας σε κατάλληλες συντάξεις.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τη σημασία αναγκαιότητας σε κατάλληλες συντάξεις.",
        "qEl": "Το γερουνδιακό σε περιφραστική παθητική σύνταξη μπορεί να δηλώνει...",
        "qEn": "Το γερουνδιακό σε περιφραστική παθητική σύνταξη μπορεί να δηλώνει...",
        "correctEl": "αναγκαιότητα ή υποχρέωση.",
        "correctEn": "αναγκαιότητα ή υποχρέωση.",
        "wrong1El": "μόνο παρελθόντα χρόνο.",
        "wrong1En": "μόνο παρελθόντα χρόνο.",
        "wrong2El": "τόπο.",
        "wrong2En": "τόπο."
      },
      {
        "slug": "indirect",
        "labelEl": "Πλάγιος λόγος",
        "labelEn": "Indirect speech",
        "explainEl": "Χρειάζεται να αναγνωρίζει τις μεταβολές στον πλάγιο λόγο.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τις μεταβολές στον πλάγιο λόγο.",
        "qEl": "Στον πλάγιο λόγο αλλάζουν συχνά...",
        "qEn": "Στον πλάγιο λόγο αλλάζουν συχνά...",
        "correctEl": "ρηματικοί τύποι και χρονικές/προσωπικές αναφορές.",
        "correctEn": "ρηματικοί τύποι και χρονικές/προσωπικές αναφορές.",
        "wrong1El": "μόνο τα σημεία στίξης.",
        "wrong1En": "μόνο τα σημεία στίξης.",
        "wrong2El": "ποτέ κανένα γραμματικό στοιχείο.",
        "wrong2En": "ποτέ κανένα γραμματικό στοιχείο."
      }
    ]
  },
  {
    "id": "fysiki-g-lykeiou",
    "grade": "c",
    "labelEl": "Φυσική Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Physics (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "shm",
        "labelEl": "Απλή αρμονική ταλάντωση",
        "labelEn": "Simple harmonic motion",
        "explainEl": "Χρειάζεται να συνδέει δύναμη επαναφοράς και απομάκρυνση.",
        "explainEn": "Χρειάζεται να συνδέει δύναμη επαναφοράς και απομάκρυνση.",
        "qEl": "Σε ΑΑΤ η δύναμη επαναφοράς είναι...",
        "qEn": "Σε ΑΑΤ η δύναμη επαναφοράς είναι...",
        "correctEl": "ανάλογη και αντίθετη της απομάκρυνσης.",
        "correctEn": "ανάλογη και αντίθετη της απομάκρυνσης.",
        "wrong1El": "σταθερή και πάντα προς την ίδια κατεύθυνση.",
        "wrong1En": "σταθερή και πάντα προς την ίδια κατεύθυνση.",
        "wrong2El": "μηδενική σε κάθε θέση.",
        "wrong2En": "μηδενική σε κάθε θέση."
      },
      {
        "slug": "standing",
        "labelEl": "Στάσιμο κύμα",
        "labelEn": "Standing wave",
        "explainEl": "Συγχέει δεσμούς και κοιλίες.",
        "explainEn": "Συγχέει δεσμούς και κοιλίες.",
        "qEl": "Σε δεσμό στάσιμου κύματος το πλάτος είναι...",
        "qEn": "Σε δεσμό στάσιμου κύματος το πλάτος είναι...",
        "correctEl": "μηδέν.",
        "correctEn": "μηδέν.",
        "wrong1El": "μέγιστο.",
        "wrong1En": "μέγιστο.",
        "wrong2El": "πάντα ίσο με το μήκος κύματος.",
        "wrong2En": "πάντα ίσο με το μήκος κύματος."
      },
      {
        "slug": "angular",
        "labelEl": "Στροφορμή",
        "labelEn": "Angular momentum",
        "explainEl": "Χρειάζεται να εφαρμόζει διατήρηση στροφορμής.",
        "explainEn": "Χρειάζεται να εφαρμόζει διατήρηση στροφορμής.",
        "qEl": "Αν η εξωτερική ροπή σε σύστημα είναι μηδενική, η συνολική στροφορμή...",
        "qEn": "Αν η εξωτερική ροπή σε σύστημα είναι μηδενική, η συνολική στροφορμή...",
        "correctEl": "διατηρείται.",
        "correctEn": "διατηρείται.",
        "wrong1El": "πάντα μηδενίζεται.",
        "wrong1En": "πάντα μηδενίζεται.",
        "wrong2El": "πάντα αυξάνεται.",
        "wrong2En": "πάντα αυξάνεται."
      },
      {
        "slug": "faraday",
        "labelEl": "Ηλεκτρομαγνητική επαγωγή",
        "labelEn": "Electromagnetic induction",
        "explainEl": "Χρειάζεται να συνδέει μεταβολή μαγνητικής ροής και επαγωγική ΗΕΔ.",
        "explainEn": "Χρειάζεται να συνδέει μεταβολή μαγνητικής ροής και επαγωγική ΗΕΔ.",
        "qEl": "Σύμφωνα με τον νόμο Faraday, επαγωγική ΗΕΔ εμφανίζεται όταν...",
        "qEn": "Σύμφωνα με τον νόμο Faraday, επαγωγική ΗΕΔ εμφανίζεται όταν...",
        "correctEl": "μεταβάλλεται η μαγνητική ροή.",
        "correctEn": "μεταβάλλεται η μαγνητική ροή.",
        "wrong1El": "η μαγνητική ροή είναι πάντα μηδενική και σταθερή.",
        "wrong1En": "η μαγνητική ροή είναι πάντα μηδενική και σταθερή.",
        "wrong2El": "δεν υπάρχει κανένα μαγνητικό πεδίο.",
        "wrong2En": "δεν υπάρχει κανένα μαγνητικό πεδίο."
      }
    ]
  },
  {
    "id": "chimeia-g-lykeiou",
    "grade": "c",
    "labelEl": "Χημεία Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Chemistry (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "hess",
        "labelEl": "Νόμος Hess",
        "labelEn": "Hess's law",
        "explainEl": "Χρειάζεται να συνδέει ενθαλπία με αρχική/τελική κατάσταση.",
        "explainEn": "Χρειάζεται να συνδέει ενθαλπία με αρχική/τελική κατάσταση.",
        "qEl": "Ο νόμος Hess βασίζεται στο ότι η μεταβολή ενθαλπίας...",
        "qEn": "Ο νόμος Hess βασίζεται στο ότι η μεταβολή ενθαλπίας...",
        "correctEl": "εξαρτάται μόνο από αρχική και τελική κατάσταση.",
        "correctEn": "εξαρτάται μόνο από αρχική και τελική κατάσταση.",
        "wrong1El": "εξαρτάται πάντα από τον αριθμό ενδιάμεσων βημάτων.",
        "wrong1En": "εξαρτάται πάντα από τον αριθμό ενδιάμεσων βημάτων.",
        "wrong2El": "είναι πάντα μηδέν.",
        "wrong2En": "είναι πάντα μηδέν."
      },
      {
        "slug": "rate",
        "labelEl": "Χημική κινητική",
        "labelEn": "Chemical kinetics",
        "explainEl": "Χρειάζεται να κατανοεί παράγοντες ταχύτητας αντίδρασης.",
        "explainEn": "Χρειάζεται να κατανοεί παράγοντες ταχύτητας αντίδρασης.",
        "qEl": "Η αύξηση της θερμοκρασίας συνήθως...",
        "qEn": "Η αύξηση της θερμοκρασίας συνήθως...",
        "correctEl": "αυξάνει την ταχύτητα μιας αντίδρασης.",
        "correctEn": "αυξάνει την ταχύτητα μιας αντίδρασης.",
        "wrong1El": "μηδενίζει κάθε αντίδραση.",
        "wrong1En": "μηδενίζει κάθε αντίδραση.",
        "wrong2El": "δεν επηρεάζει ποτέ την κινητική.",
        "wrong2En": "δεν επηρεάζει ποτέ την κινητική."
      },
      {
        "slug": "lechatelier",
        "labelEl": "Le Chatelier",
        "labelEn": "Le Chatelier",
        "explainEl": "Συγχέει μετατόπιση ισορροπίας και αλλαγή σταθεράς.",
        "explainEn": "Συγχέει μετατόπιση ισορροπίας και αλλαγή σταθεράς.",
        "qEl": "Αν αυξήσουμε τη συγκέντρωση αντιδρώντος σε σύστημα ισορροπίας, το σύστημα τείνει...",
        "qEn": "Αν αυξήσουμε τη συγκέντρωση αντιδρώντος σε σύστημα ισορροπίας, το σύστημα τείνει...",
        "correctEl": "να μετατοπιστεί ώστε να καταναλώσει μέρος της προσθήκης.",
        "correctEn": "να μετατοπιστεί ώστε να καταναλώσει μέρος της προσθήκης.",
        "wrong1El": "να σταματήσει οριστικά.",
        "wrong1En": "να σταματήσει οριστικά.",
        "wrong2El": "να μην αλλάξει ποτέ.",
        "wrong2En": "να μην αλλάξει ποτέ."
      },
      {
        "slug": "ph",
        "labelEl": "pH",
        "labelEn": "pH",
        "explainEl": "Χρειάζεται να συνδέει pH και οξύτητα.",
        "explainEn": "Χρειάζεται να συνδέει pH και οξύτητα.",
        "qEl": "Σε υδατικό διάλυμα στους 25°C, pH<7 δηλώνει γενικά...",
        "qEn": "Σε υδατικό διάλυμα στους 25°C, pH<7 δηλώνει γενικά...",
        "correctEl": "όξινο διάλυμα.",
        "correctEn": "όξινο διάλυμα.",
        "wrong1El": "βασικό διάλυμα.",
        "wrong1En": "βασικό διάλυμα.",
        "wrong2El": "πάντα ουδέτερο διάλυμα.",
        "wrong2En": "πάντα ουδέτερο διάλυμα."
      }
    ]
  },
  {
    "id": "biologia-g-lykeiou",
    "grade": "c",
    "labelEl": "Βιολογία Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Biology (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "replication",
        "labelEl": "Αντιγραφή DNA",
        "labelEn": "DNA replication",
        "explainEl": "Χρειάζεται να κατανοεί τον ημισυντηρητικό χαρακτήρα.",
        "explainEn": "Χρειάζεται να κατανοεί τον ημισυντηρητικό χαρακτήρα.",
        "qEl": "Η αντιγραφή του DNA χαρακτηρίζεται ως ημισυντηρητική επειδή κάθε νέο μόριο έχει...",
        "qEn": "Η αντιγραφή του DNA χαρακτηρίζεται ως ημισυντηρητική επειδή κάθε νέο μόριο έχει...",
        "correctEl": "μία παλιά και μία νέα αλυσίδα.",
        "correctEn": "μία παλιά και μία νέα αλυσίδα.",
        "wrong1El": "δύο μόνο παλιές αλυσίδες.",
        "wrong1En": "δύο μόνο παλιές αλυσίδες.",
        "wrong2El": "δύο αλυσίδες RNA.",
        "wrong2En": "δύο αλυσίδες RNA."
      },
      {
        "slug": "transcription",
        "labelEl": "Μεταγραφή",
        "labelEn": "Transcription",
        "explainEl": "Συγχέει μεταγραφή και μετάφραση.",
        "explainEn": "Συγχέει μεταγραφή και μετάφραση.",
        "qEl": "Κατά τη μεταγραφή παράγεται...",
        "qEn": "Κατά τη μεταγραφή παράγεται...",
        "correctEl": "RNA με καλούπι μία αλυσίδα DNA.",
        "correctEn": "RNA με καλούπι μία αλυσίδα DNA.",
        "wrong1El": "DNA από πρωτεΐνη.",
        "wrong1En": "DNA από πρωτεΐνη.",
        "wrong2El": "πρωτεΐνη απευθείας από DNA χωρίς RNA.",
        "wrong2En": "πρωτεΐνη απευθείας από DNA χωρίς RNA."
      },
      {
        "slug": "mutation",
        "labelEl": "Μεταλλάξεις",
        "labelEn": "Mutations",
        "explainEl": "Χρειάζεται να ξεχωρίζει μετάλλαξη από ανασυνδυασμό.",
        "explainEn": "Χρειάζεται να ξεχωρίζει μετάλλαξη από ανασυνδυασμό.",
        "qEl": "Μετάλλαξη είναι...",
        "qEn": "Μετάλλαξη είναι...",
        "correctEl": "μόνιμη αλλαγή στη γενετική πληροφορία.",
        "correctEn": "μόνιμη αλλαγή στη γενετική πληροφορία.",
        "wrong1El": "κάθε προσωρινή αλλαγή θερμοκρασίας.",
        "wrong1En": "κάθε προσωρινή αλλαγή θερμοκρασίας.",
        "wrong2El": "μόνο η δημιουργία νέου ιστού.",
        "wrong2En": "μόνο η δημιουργία νέου ιστού."
      },
      {
        "slug": "pcr",
        "labelEl": "PCR",
        "labelEn": "PCR",
        "explainEl": "Χρειάζεται να κατανοεί τον σκοπό της PCR.",
        "explainEn": "Χρειάζεται να κατανοεί τον σκοπό της PCR.",
        "qEl": "Η PCR χρησιμοποιείται για...",
        "qEn": "Η PCR χρησιμοποιείται για...",
        "correctEl": "πολλαπλασιασμό συγκεκριμένης αλληλουχίας DNA.",
        "correctEn": "πολλαπλασιασμό συγκεκριμένης αλληλουχίας DNA.",
        "wrong1El": "μετάφραση mRNA σε πρωτεΐνη.",
        "wrong1En": "μετάφραση mRNA σε πρωτεΐνη.",
        "wrong2El": "μέτρηση αρτηριακής πίεσης.",
        "wrong2En": "μέτρηση αρτηριακής πίεσης."
      }
    ]
  },
  {
    "id": "mathimatika-g-prosanatolismou",
    "grade": "c",
    "labelEl": "Μαθηματικά Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Mathematics (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "limit",
        "labelEl": "Όριο",
        "labelEn": "Limit",
        "explainEl": "Χρειάζεται να ξεχωρίζει τιμή συνάρτησης και όριο.",
        "explainEn": "Χρειάζεται να ξεχωρίζει τιμή συνάρτησης και όριο.",
        "qEl": "Το lim(x→2)(x+3) είναι...",
        "qEn": "Το lim(x→2)(x+3) είναι...",
        "correctEl": "5.",
        "correctEn": "5.",
        "wrong1El": "2.",
        "wrong1En": "2.",
        "wrong2El": "3.",
        "wrong2En": "3."
      },
      {
        "slug": "derivative",
        "labelEl": "Παράγωγος",
        "labelEn": "Derivative",
        "explainEl": "Χρειάζεται να εφαρμόζει βασικούς κανόνες παραγώγισης.",
        "explainEn": "Χρειάζεται να εφαρμόζει βασικούς κανόνες παραγώγισης.",
        "qEl": "Η παράγωγος της f(x)=x³ είναι...",
        "qEn": "Η παράγωγος της f(x)=x³ είναι...",
        "correctEl": "3x².",
        "correctEn": "3x².",
        "wrong1El": "x².",
        "wrong1En": "x².",
        "wrong2El": "3x.",
        "wrong2En": "3x."
      },
      {
        "slug": "rolle",
        "labelEl": "Θεώρημα Rolle",
        "labelEn": "Rolle's theorem",
        "explainEl": "Χρειάζεται να αναγνωρίζει τις προϋποθέσεις του θεωρήματος.",
        "explainEn": "Χρειάζεται να αναγνωρίζει τις προϋποθέσεις του θεωρήματος.",
        "qEl": "Μία βασική προϋπόθεση του Rolle στο [a,b] είναι...",
        "qEn": "Μία βασική προϋπόθεση του Rolle στο [a,b] είναι...",
        "correctEl": "f(a)=f(b), μαζί με συνέχεια/παραγωγισιμότητα στις κατάλληλες περιοχές.",
        "correctEn": "f(a)=f(b), μαζί με συνέχεια/παραγωγισιμότητα στις κατάλληλες περιοχές.",
        "wrong1El": "f(a)≠f(b) υποχρεωτικά.",
        "wrong1En": "f(a)≠f(b) υποχρεωτικά.",
        "wrong2El": "η f να είναι ασυνεχής.",
        "wrong2En": "η f να είναι ασυνεχής."
      },
      {
        "slug": "integral",
        "labelEl": "Ορισμένο ολοκλήρωμα",
        "labelEn": "Definite integral",
        "explainEl": "Χρειάζεται να συνδέει ολοκλήρωμα και εμβαδόν με πρόσημο.",
        "explainEn": "Χρειάζεται να συνδέει ολοκλήρωμα και εμβαδόν με πρόσημο.",
        "qEl": "Για f(x)≥0 στο [a,b], το ∫ₐᵇf(x)dx παριστάνει...",
        "qEn": "Για f(x)≥0 στο [a,b], το ∫ₐᵇf(x)dx παριστάνει...",
        "correctEl": "το εμβαδόν κάτω από τη γραφική παράσταση και πάνω από τον άξονα x.",
        "correctEn": "το εμβαδόν κάτω από τη γραφική παράσταση και πάνω από τον άξονα x.",
        "wrong1El": "μόνο την κλίση στο a.",
        "wrong1En": "μόνο την κλίση στο a.",
        "wrong2El": "τον αριθμό 0 πάντα.",
        "wrong2En": "τον αριθμό 0 πάντα."
      }
    ]
  },
  {
    "id": "oikonomia-g-lykeiou",
    "grade": "c",
    "labelEl": "Οικονομία Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Economics (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "opportunity",
        "labelEl": "Κόστος ευκαιρίας",
        "labelEn": "Opportunity cost",
        "explainEl": "Χρειάζεται να συνδέει επιλογή και θυσία εναλλακτικής.",
        "explainEn": "Χρειάζεται να συνδέει επιλογή και θυσία εναλλακτικής.",
        "qEl": "Κόστος ευκαιρίας μιας επιλογής είναι...",
        "qEn": "Κόστος ευκαιρίας μιας επιλογής είναι...",
        "correctEl": "η καλύτερη εναλλακτική που θυσιάζεται.",
        "correctEn": "η καλύτερη εναλλακτική που θυσιάζεται.",
        "wrong1El": "πάντα η χρηματική τιμή μόνο.",
        "wrong1En": "πάντα η χρηματική τιμή μόνο.",
        "wrong2El": "κάθε φόρος.",
        "wrong2En": "κάθε φόρος."
      },
      {
        "slug": "demand",
        "labelEl": "Νόμος ζήτησης",
        "labelEn": "Law of demand",
        "explainEl": "Συγχέει μεταβολή ζητούμενης ποσότητας και ζήτησης.",
        "explainEn": "Συγχέει μεταβολή ζητούμενης ποσότητας και ζήτησης.",
        "qEl": "Με άλλους παράγοντες σταθερούς, όταν η τιμή ενός αγαθού αυξάνεται, η ζητούμενη ποσότητα συνήθως...",
        "qEn": "Με άλλους παράγοντες σταθερούς, όταν η τιμή ενός αγαθού αυξάνεται, η ζητούμενη ποσότητα συνήθως...",
        "correctEl": "μειώνεται.",
        "correctEn": "μειώνεται.",
        "wrong1El": "αυξάνεται πάντα.",
        "wrong1En": "αυξάνεται πάντα.",
        "wrong2El": "μένει υποχρεωτικά ίδια.",
        "wrong2En": "μένει υποχρεωτικά ίδια."
      },
      {
        "slug": "equilibrium",
        "labelEl": "Ισορροπία αγοράς",
        "labelEn": "Market equilibrium",
        "explainEl": "Χρειάζεται να συνδέει προσφορά και ζήτηση.",
        "explainEn": "Χρειάζεται να συνδέει προσφορά και ζήτηση.",
        "qEl": "Τιμή ισορροπίας είναι εκείνη όπου...",
        "qEn": "Τιμή ισορροπίας είναι εκείνη όπου...",
        "correctEl": "ζητούμενη και προσφερόμενη ποσότητα είναι ίσες.",
        "correctEn": "ζητούμενη και προσφερόμενη ποσότητα είναι ίσες.",
        "wrong1El": "η ζήτηση είναι πάντα μηδέν.",
        "wrong1En": "η ζήτηση είναι πάντα μηδέν.",
        "wrong2El": "η προσφορά απαγορεύεται.",
        "wrong2En": "η προσφορά απαγορεύεται."
      },
      {
        "slug": "real-gdp",
        "labelEl": "Πραγματικό ΑΕΠ",
        "labelEn": "Real GDP",
        "explainEl": "Χρειάζεται να ξεχωρίζει ονομαστικές και πραγματικές μεταβολές.",
        "explainEn": "Χρειάζεται να ξεχωρίζει ονομαστικές και πραγματικές μεταβολές.",
        "qEl": "Το πραγματικό ΑΕΠ χρησιμοποιεί σταθερές τιμές κυρίως για να...",
        "qEn": "Το πραγματικό ΑΕΠ χρησιμοποιεί σταθερές τιμές κυρίως για να...",
        "correctEl": "απομονώνει την επίδραση μεταβολών του επιπέδου τιμών.",
        "correctEn": "απομονώνει την επίδραση μεταβολών του επιπέδου τιμών.",
        "wrong1El": "μετρά μόνο τον πληθωρισμό.",
        "wrong1En": "μετρά μόνο τον πληθωρισμό.",
        "wrong2El": "αγνοεί την παραγωγή.",
        "wrong2En": "αγνοεί την παραγωγή."
      }
    ]
  },
  {
    "id": "pliroforiki-g-lykeiou",
    "grade": "c",
    "labelEl": "Πληροφορική Προσανατολισμού, Γ' Λυκείου",
    "labelEn": "Computer Science (Orientation), 12th Grade",
    "introEl": "4 σύντομες διαγνωστικές ερωτήσεις από βασικά σημεία της ύλης 2026–27. Δεν είναι διαγώνισμα και δεν καλύπτει όλη την ύλη.",
    "introEn": "4 short diagnostic questions from key parts of the 2026–27 syllabus. This is not an exam and does not cover the whole syllabus.",
    "items": [
      {
        "slug": "loop",
        "labelEl": "Επανάληψη",
        "labelEn": "Iteration",
        "explainEl": "Συγχέει τις δομές επανάληψης.",
        "explainEn": "Συγχέει τις δομές επανάληψης.",
        "qEl": "Όταν γνωρίζουμε εκ των προτέρων πόσες φορές θα επαναληφθεί ένα τμήμα, κατάλληλη δομή είναι συχνά...",
        "qEn": "Όταν γνωρίζουμε εκ των προτέρων πόσες φορές θα επαναληφθεί ένα τμήμα, κατάλληλη δομή είναι συχνά...",
        "correctEl": "ΓΙΑ.",
        "correctEn": "ΓΙΑ.",
        "wrong1El": "ΑΝ μόνο.",
        "wrong1En": "ΑΝ μόνο.",
        "wrong2El": "μία απλή εκχώρηση.",
        "wrong2En": "μία απλή εκχώρηση."
      },
      {
        "slug": "array",
        "labelEl": "Πίνακες",
        "labelEn": "Arrays",
        "explainEl": "Χρειάζεται να κατανοεί την αποθήκευση πολλών ομοειδών τιμών.",
        "explainEn": "Χρειάζεται να κατανοεί την αποθήκευση πολλών ομοειδών τιμών.",
        "qEl": "Ένας μονοδιάστατος πίνακας χρησιμοποιείται για...",
        "qEn": "Ένας μονοδιάστατος πίνακας χρησιμοποιείται για...",
        "correctEl": "πολλές τιμές του ίδιου τύπου με κοινό όνομα και δείκτη.",
        "correctEn": "πολλές τιμές του ίδιου τύπου με κοινό όνομα και δείκτη.",
        "wrong1El": "μία μόνο σταθερά χωρίς δείκτη.",
        "wrong1En": "μία μόνο σταθερά χωρίς δείκτη.",
        "wrong2El": "μόνο κείμενο ιστοσελίδας.",
        "wrong2En": "μόνο κείμενο ιστοσελίδας."
      },
      {
        "slug": "subprogram",
        "labelEl": "Υποπρογράμματα",
        "labelEn": "Subprograms",
        "explainEl": "Χρειάζεται να κατανοεί τμηματικό προγραμματισμό.",
        "explainEn": "Χρειάζεται να κατανοεί τμηματικό προγραμματισμό.",
        "qEl": "Βασικό πλεονέκτημα υποπρογραμμάτων είναι...",
        "qEn": "Βασικό πλεονέκτημα υποπρογραμμάτων είναι...",
        "correctEl": "η επαναχρησιμοποίηση και καλύτερη οργάνωση κώδικα.",
        "correctEn": "η επαναχρησιμοποίηση και καλύτερη οργάνωση κώδικα.",
        "wrong1El": "η κατάργηση όλων των μεταβλητών.",
        "wrong1En": "η κατάργηση όλων των μεταβλητών.",
        "wrong2El": "η απαγόρευση παραμέτρων.",
        "wrong2En": "η απαγόρευση παραμέτρων."
      },
      {
        "slug": "search",
        "labelEl": "Αναζήτηση",
        "labelEn": "Searching",
        "explainEl": "Χρειάζεται να αναγνωρίζει βασική σειριακή αναζήτηση.",
        "explainEn": "Χρειάζεται να αναγνωρίζει βασική σειριακή αναζήτηση.",
        "qEl": "Η σειριακή αναζήτηση εξετάζει στοιχεία...",
        "qEn": "Η σειριακή αναζήτηση εξετάζει στοιχεία...",
        "correctEl": "διαδοχικά μέχρι να βρει το ζητούμενο ή να τελειώσει ο πίνακας.",
        "correctEn": "διαδοχικά μέχρι να βρει το ζητούμενο ή να τελειώσει ο πίνακας.",
        "wrong1El": "μόνο το πρώτο στοιχείο.",
        "wrong1En": "μόνο το πρώτο στοιχείο.",
        "wrong2El": "πάντα με δυαδικό δέντρο.",
        "wrong2En": "πάντα με δυαδικό δέντρο."
      }
    ]
  }
];

  const catalog = window.AITOOLSKIDS_TUTOR_CATALOG;
  if (!catalog?.zones?.high || typeof GAP_TAGS === "undefined" ||
      typeof LEARNING_PATHS === "undefined" || typeof QUIZZES === "undefined") {
    console.warn("[GEL 2026-27 v2] Required curriculum objects are missing; update skipped.");
    return;
  }

  function coverageFor(spec) {
    if (spec.status === "exam-verified") {
      return {
        coverageStatus: "annual-exam-syllabus-verified",
        coverageLabelEl: "Επαληθευμένη εξεταστέα ύλη 2026–27",
        coverageLabelEn: "Verified 2026–27 written-exam syllabus",
        annualInstructionsStatus: "2026-27-verified",
        scopeNoteEl: "Οι ενότητες έχουν χαρτογραφηθεί πάνω στην επίσημη εξεταστέα ύλη των γραπτώς εξεταζόμενων μαθημάτων για το σχολικό έτος 2026–27. Ισχύουν πάντα οι ακριβείς εξαιρέσεις και παρατηρήσεις της υπουργικής απόφασης.",
        scopeNoteEn: "Sections are mapped to the official written-exam syllabus for school year 2026–27. Exact exclusions and notes in the Ministry decision always prevail.",
      };
    }
    if (spec.status === "panhellenic-verified") {
      return {
        coverageStatus: "panhellenic-2027-verified",
        coverageLabelEl: "Επαληθευμένη ύλη Πανελλαδικών 2027",
        coverageLabelEn: "Verified Panhellenic 2027 syllabus",
        annualInstructionsStatus: "2026-27-verified",
        scopeNoteEl: "Οι ενότητες αποτελούν αναλυτικό χάρτη της επίσημης εξεταστέας ύλης Πανελλαδικών 2027. Για ακριβή όρια, παραγράφους και εξαιρέσεις υπερισχύει η υπουργική απόφαση.",
        scopeNoteEn: "Sections form a detailed map of the official 2027 Panhellenic syllabus. The Ministry decision prevails for exact limits, paragraphs and exclusions.",
      };
    }
    if (spec.status === "panhellenic-map") {
      return {
        coverageStatus: "panhellenic-2027-detailed-map",
        coverageLabelEl: "Ύλη Πανελλαδικών 2027 — αναλυτικός χάρτης",
        coverageLabelEn: "Panhellenic 2027 syllabus — detailed map",
        annualInstructionsStatus: "2026-27-published",
        scopeNoteEl: "Η επίσημη ύλη Πανελλαδικών 2027 έχει δημοσιευτεί. Τα θέματα εδώ λειτουργούν ως αναλυτικός χάρτης μελέτης και όχι ως αυτούσια αντιγραφή των επίσημων τίτλων/παραγράφων.",
        scopeNoteEn: "The official 2027 Panhellenic syllabus is published. Topics here are a detailed study map, not verbatim official section/paragraph titles.",
      };
    }
    return {
      coverageStatus: "annual-guidance-detailed-map",
      coverageLabelEl: "Οδηγίες 2026–27 δημοσιευμένες — αναλυτικός χάρτης",
      coverageLabelEn: "2026–27 guidance published — detailed map",
      annualInstructionsStatus: "2026-27-published",
      scopeNoteEl: "Οι φετινές οδηγίες 2026–27 για το μάθημα έχουν δημοσιευτεί. Τα θέματα εδώ είναι αναλυτικός χάρτης πλοήγησης και δεν παρουσιάζονται ως αυτούσιοι επίσημοι τίτλοι, εκτός αν αυτό δηλώνεται ρητά.",
      scopeNoteEn: "The 2026–27 guidance for this subject is published. Topics here are a detailed navigation map and are not presented as verbatim official titles unless explicitly stated.",
    };
  }

  function buildSubject(spec) {
    const coverage = coverageFor(spec);
    const topics = (spec.topics || []).map((row, index) => ({
      id: `${spec.id}.topic-${index + 1}`,
      labelEl: row[0],
      labelEn: row[1] || row[0],
      explainEl: `Εστίαση στην ενότητα «${row[0]}» στο επίπεδο της ${spec.labelEl}. Ζήτησε υπόδειξη ή έλεγχο κατανόησης, όχι έτοιμη λύση.`,
      explainEn: `Focus on “${row[1] || row[0]}” at the level of ${spec.labelEn}. Ask for a hint or understanding check, not a finished answer.`,
    }));
    const source = spec.source || DIDE_GUIDANCE;
    return {
      id: spec.id,
      grade: spec.grade,
      subjectLabelEl: spec.labelEl,
      subjectLabelEn: spec.labelEn,
      ...(spec.quizId ? { quizId: spec.quizId } : {}),
      topics,
      curriculum: {
        schoolYear: SCHOOL_YEAR,
        verificationDate: VERIFIED_ON,
        ...coverage,
        officialSectionsEl: coverage.annualInstructionsStatus === "2026-27-verified" ? topics.map((x) => x.labelEl) : [],
        officialSectionsEn: coverage.annualInstructionsStatus === "2026-27-verified" ? topics.map((x) => x.labelEn) : [],
        annualInstructionsUrl: source,
        catalogUrl: source,
        examSyllabusUrl: spec.status === "exam-verified" ? GEL_EXAM :
                         spec.status.startsWith("panhellenic") ? PANHELLENIC_2027 : "",
        sourceLabelEl: spec.status === "exam-verified"
          ? "ΥΠΑΙΘΑ — Εξεταστέα ύλη ΓΕΛ 2026–27"
          : spec.status.startsWith("panhellenic")
            ? "ΥΠΑΙΘΑ — Εξεταστέα ύλη Πανελλαδικών 2027"
            : "ΥΠΑΙΘΑ/ΙΕΠ — Οδηγίες διδασκαλίας ΓΕΛ 2026–27",
        sourceLabelEn: spec.status === "exam-verified"
          ? "Ministry — GEL written-exam syllabus 2026–27"
          : spec.status.startsWith("panhellenic")
            ? "Ministry — Panhellenic examinations syllabus 2027"
            : "Ministry/IEP — GEL teaching guidance 2026–27",
        annualInstructionsNoteEl: spec.noteEl || "",
        annualInstructionsNoteEn: "",
      },
    };
  }

  const high2026 = {
    a: SUBJECT_DATA.a.map(buildSubject),
    b: SUBJECT_DATA.b.map(buildSubject),
    c: SUBJECT_DATA.c.map(buildSubject),
  };

  // Replace the previous high-school arrays in place. The catalog object itself
  // is frozen, but its grade arrays were intentionally left mutable.
  for (const grade of ["a", "b", "c"]) {
    const target = catalog.zones.high[grade];
    if (Array.isArray(target)) target.splice(0, target.length, ...high2026[grade]);
  }

  function learningPath(labelEl, labelEn) {
    return [
      {
        titleEl: "Δοκίμασε πρώτα μόνος/μόνη σου",
        titleEn: "Try it yourself first",
        descriptionEl: `Γράψε με 2–3 προτάσεις τι θυμάσαι για «${labelEl}» ή λύσε ένα μικρό σχετικό παράδειγμα χωρίς AI.`,
        descriptionEn: `Write 2–3 sentences about what you remember on “${labelEn}” or try a small related example without AI.`,
        toolId: null,
      },
      {
        titleEl: "Ζήτησε μία υπόδειξη",
        titleEn: "Ask for one hint",
        descriptionEl: `Στην AI Βοήθεια ζήτησε μία ερώτηση ή μία μικρή υπόδειξη για «${labelEl}». Μην ζητήσεις την τελική απάντηση.`,
        descriptionEn: `In AI Help ask for one question or one small hint about “${labelEn}”. Do not ask for the final answer.`,
        toolId: "ai-help",
      },
      {
        titleEl: "Έλεγξε αν το κατανόησες",
        titleEn: "Check your understanding",
        descriptionEl: `Εξήγησε το «${labelEl}» με δικά σου λόγια και ζήτησε ένα νέο μικρό παράδειγμα ή ερώτηση ελέγχου.`,
        descriptionEn: `Explain “${labelEn}” in your own words and ask for one new small example or check question.`,
        toolId: "ai-help",
      },
    ];
  }

  // Every Tutor curriculum topic must have a visible learning path.
  for (const grade of ["a", "b", "c"]) {
    for (const subject of high2026[grade]) {
      for (const t of subject.topics) {
        GAP_TAGS[t.id] = Object.assign({}, GAP_TAGS[t.id] || {}, {
          id: t.id,
          labelEl: t.labelEl,
          labelEn: t.labelEn,
          explainEl: t.explainEl,
          explainEn: t.explainEn,
          recommendedToolIds: ["ai-help", "chatgpt", "perplexity"],
          achievementEl: "Βήμα προόδου",
          achievementEn: "Progress step",
          positiveMessageEl: "Έχεις κατανοήσει αυτή τη βασική ενότητα!",
          positiveMessageEn: "You understand this key section!",
          skillTagEl: t.labelEl,
          skillTagEn: t.labelEn,
        });
        LEARNING_PATHS[t.id] = learningPath(t.labelEl, t.labelEn);
      }
    }
  }

  // Remove the old mixed B-Lyceum "Mathematics" diagnostic which combined
  // Algebra and Orientation Mathematics under one misleading title.
  if (QUIZZES.high) delete QUIZZES.high["mathimatika-b-lykeiou"];
  for (const oldGap of [
    "mathimatika-b-lykeiou.quadratic",
    "mathimatika-b-lykeiou.trigonometry",
    "mathimatika-b-lykeiou.vectors",
    "mathimatika-b-lykeiou.slope",
  ]) {
    delete GAP_TAGS[oldGap];
    delete LEARNING_PATHS[oldGap];
  }

  function registerQuiz(spec) {
    const questions = (spec.items || []).map((item, index) => {
      const gapId = `${spec.id}.${item.slug}`;
      GAP_TAGS[gapId] = {
        id: gapId,
        labelEl: item.labelEl,
        labelEn: item.labelEn,
        explainEl: item.explainEl,
        explainEn: item.explainEn || item.explainEl,
        recommendedToolIds: item.tools || ["ai-help", "chatgpt", "perplexity"],
        achievementEl: "Ερευνητής της γνώσης",
        achievementEn: "Knowledge Explorer",
        positiveMessageEl: "Κατανόησες αυτό το βασικό σημείο!",
        positiveMessageEn: "You understood this key point!",
        skillTagEl: item.labelEl,
        skillTagEn: item.labelEn,
      };
      LEARNING_PATHS[gapId] = learningPath(item.labelEl, item.labelEn);
      return {
        id: `q${index + 1}-${item.slug}`,
        textEl: item.qEl,
        textEn: item.qEn || item.qEl,
        options: [
          { textEl: item.correctEl, textEn: item.correctEn || item.correctEl, isCorrect: true },
          { textEl: item.wrong1El, textEn: item.wrong1En || item.wrong1El, isCorrect: false, gapTag: gapId },
          { textEl: item.wrong2El, textEn: item.wrong2En || item.wrong2El, isCorrect: false, gapTag: gapId },
        ],
      };
    });
    QUIZZES.high[spec.id] = {
      id: spec.id,
      grades: [spec.grade],
      subjectLabelEl: spec.labelEl,
      subjectLabelEn: spec.labelEn,
      titleEl: `Διαγνωστικός Χάρτης — ${spec.labelEl}`,
      titleEn: `Learning Compass — ${spec.labelEn}`,
      introEl: spec.introEl,
      introEn: spec.introEn,
      questions,
    };
  }

  for (const spec of QUIZ_SPECS) registerQuiz(spec);

  // Ensure catalog subjects point at diagnostics after all replacements.
  const quizIds = new Set(Object.keys(QUIZZES.high || {}));
  for (const grade of ["a", "b", "c"]) {
    for (const subject of high2026[grade]) {
      if (subject.quizId && !quizIds.has(subject.quizId)) delete subject.quizId;
      if (!subject.quizId && quizIds.has(subject.id)) subject.quizId = subject.id;
    }
  }

  // Correct the visible "last checked" date on the central page in both
  // languages. app.js still contains an older translation string, so a tiny
  // observer keeps this correct after language switches without replacing app.js.
  function syncLastCheckedDate() {
    const node = document.querySelector?.('[data-i18n="footerLastChecked"]');
    if (!node) return;
    const lang = (document.documentElement?.lang || "el").toLowerCase();
    const wanted = lang.startsWith("en")
      ? "Tools last checked: August 30, 2026"
      : "Τελευταίος έλεγχος εργαλείων: 30 Αυγούστου 2026";
    if (node.textContent.trim() !== wanted) node.textContent = wanted;
  }

  function installDateGuard() {
    syncLastCheckedDate();
    const node = document.querySelector?.('[data-i18n="footerLastChecked"]');
    if (!node || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => syncLastCheckedDate());
    observer.observe(node, { childList: true, characterData: true, subtree: true });
    document.addEventListener?.("click", (event) => {
      if (event.target?.closest?.("[data-lang], .lang-btn")) setTimeout(syncLastCheckedDate, 0);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installDateGuard, { once: true });
  } else {
    installDateGuard();
  }

  const totalSubjects = high2026.a.length + high2026.b.length + high2026.c.length;
  const totalTopics = high2026.a.concat(high2026.b, high2026.c)
    .reduce((sum, subject) => sum + subject.topics.length, 0);
  const totalHighQuizzes = Object.keys(QUIZZES.high || {}).length;

  window.AITOOLSKIDS_GEL_2026_2027_UPDATE = Object.freeze({
    version: VERSION,
    schoolYear: SCHOOL_YEAR,
    verifiedOn: VERIFIED_ON,
    officialGuidance: DIDE_GUIDANCE,
    officialExamSyllabus: GEL_EXAM,
    panhellenic2027: PANHELLENIC_2027,
    subjects: totalSubjects,
    topics: totalTopics,
    highDiagnostics: totalHighQuizzes,
    gradeCounts: Object.freeze({
      a: high2026.a.length,
      b: high2026.b.length,
      c: high2026.c.length,
    }),
  });

  console.info(
    `[GEL 2026-27 v${VERSION}] ${totalSubjects} subjects, ` +
    `${totalTopics} Tutor topics, ${totalHighQuizzes} high-school diagnostics.`
  );
})();
