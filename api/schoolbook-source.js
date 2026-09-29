// Fetch a small, section-scoped excerpt from official Greek schoolbook HTML pages.
// Official-book grounding coverage expands incrementally from verified HTML section patterns.

const BOOKS = {
  "istoria-b-gymnasiou": {
    title: "Μεσαιωνική και Νεότερη Ιστορία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2198/Istoria_B-Gymnasiou_html-empl/",
    mode: "history",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "mathimatika-b-gymnasiou": {
    title: "Μαθηματικά Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2196/Mathimatika_B-Gymnasiou_html-empl/",
    mode: "mathB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "chimeia-b-gymnasiou": {
    title: "Χημεία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2206/Chimeia_B-Gymnasiou_html-empl/",
    mode: "chemistryB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "geologia-geografia-b-gymnasiou": {
    title: "Γεωλογία - Γεωγραφία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2294/Geografia_B-Gymnasiou_html-empl/",
    mode: "geographyB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/"
  },
  "logotechnia-b-gymnasiou": {
    title: "Κείμενα Νεοελληνικής Λογοτεχνίας Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2246/Keimena-Neoellinikis-Logotechnias_B-Gymnasiou_html-empl/",
    mode: "literatureB",
    officialSourceRequired: true,
    schoolYear: "2026-2027",
    curriculumSource: "https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/",
    selectionPolicy: "teacher-choice-from-official-anthology"
  },
  "physics-gymnasiou": {
    title: "Φυσική Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/",
    mode: "numeric"
  },
  "biologia-a-gymnasiou": {
    title: "Βιολογία Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/",
    mode: "biologyA"
  },
  "biologia-b-gymnasiou": {
    title: "Βιολογία Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/",
    mode: "biologyB"
  },
  "biologia-g-gymnasiou": {
    title: "Βιολογία Β΄ και Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/",
    mode: "numeric"
  },
  "archaia-glossa-a-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2244/Archaia-Elliniki-Glossa_A-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "archaia-glossa-b-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2234/Archaia-Elliniki-Glossa_B-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "archaia-glossa-g-gymnasiou": {
    title: "Αρχαία Ελληνική Γλώσσα Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2238/Archaia-Elliniki-Glossa_G-Gymnasiou_html-empl/",
    mode: "unit2digit"
  },
  "odysseia-a-gymnasiou": {
    title: "Ομηρικά Έπη – Οδύσσεια Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2232/Omirika-Epi-Odysseia_A-Gymnasiou_html-empl/",
    mode: "odyssey"
  },
  "iliada-b-gymnasiou": {
    title: "Ομηρικά Έπη – Ιλιάδα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2296/Omirika-Epi-Iliada_B-Gymnasiou_empl/",
    mode: "iliadSequence"
  },
  "glossa-a-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Α΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2256/Neoelliniki-Glossa_A-Gymnasiou_html-empl/",
    mode: "modernGreekA",
    multi: true
  },
  "glossa-b-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Β΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2298/Neoelliniki-Glossa_B-Gymnasiou_empl/",
    mode: "modernGreekB",
    multi: true
  },
  "glossa-gymnasiou": {
    title: "Νεοελληνική Γλώσσα Γ΄ Γυμνασίου",
    base: "https://ebooks.edu.gr/ebooks/v/html/8547/2216/Neoelliniki-Glossa_G-Gymnasiou_html-empl/",
    mode: "modernGreekG",
    multi: true
  }
};

const ALIASES = {
  "math-b-gymnasiou": "mathimatika-b-gymnasiou",
  "chemistry-b-gymnasiou": "chimeia-b-gymnasiou",
  "geografia-b-gymnasiou": "geologia-geografia-b-gymnasiou",
  "geology-geography-b-gymnasiou": "geologia-geografia-b-gymnasiou",
  "keimena-logotechnias-b-gymnasiou": "logotechnia-b-gymnasiou",
  "neoelliniki-logotechnia-b-gymnasiou": "logotechnia-b-gymnasiou",
  "fysiki-b-gymnasiou": "physics-gymnasiou",
  "biology-a-gymnasiou": "biologia-a-gymnasiou",
  "biology-b-gymnasiou": "biologia-b-gymnasiou",
  "biology-g-gymnasiou": "biologia-g-gymnasiou"
};

// Exact 2026-27 History B curriculum allowlist, verified against the official
// IEP annual guidance. Parent nodes aggregate only their included descendants;
// pages that exist in the book but are absent from this map fail closed.
const HISTORY_B_2026_2027_PATHS = Object.freeze({
  "1": ["index1_1_1.html", "index1_2_1.html", "index1_2_2.html"],
  "1.1": ["index1_1_1.html"],
  "1.1.1": ["index1_1_1.html"],
  "1.2": ["index1_2_1.html", "index1_2_2.html"],
  "1.2.1": ["index1_2_1.html"],
  "1.2.2": ["index1_2_2.html"],
  "2": ["index2_1_1.html", "index2_1_2.html", "index2_2_1.html", "index2_2_2.html"],
  "2.1": ["index2_1_1.html", "index2_1_2.html"],
  "2.1.1": ["index2_1_1.html"],
  "2.1.2": ["index2_1_2.html"],
  "2.2": ["index2_2_1.html", "index2_2_2.html"],
  "2.2.1": ["index2_2_1.html"],
  "2.2.2": ["index2_2_2.html"],
  "3": ["index3_1_1.html", "index3_1_2.html", "index3_1_3.html", "index3_1_4.html", "index3_1_5.html", "index3_1_6.html", "index3_1_7.html", "index3_2_1.html", "index3_2_2.html"],
  "3.1": ["index3_1_1.html", "index3_1_2.html", "index3_1_3.html", "index3_1_4.html", "index3_1_5.html", "index3_1_6.html", "index3_1_7.html"],
  "3.1.1": ["index3_1_1.html"],
  "3.1.2": ["index3_1_2.html"],
  "3.1.3": ["index3_1_3.html"],
  "3.1.4": ["index3_1_4.html"],
  "3.1.5": ["index3_1_5.html"],
  "3.1.6": ["index3_1_6.html"],
  "3.1.7": ["index3_1_7.html"],
  "3.2": ["index3_2_1.html", "index3_2_2.html"],
  "3.2.1": ["index3_2_1.html"],
  "3.2.2": ["index3_2_2.html"],
  "4": ["index4_1_1.html", "index4_1_2.html", "index4_1_3.html", "index4_2_1.html", "index4_2_2.html", "index4_3_1.html", "index4_3_2.html"],
  "4.1": ["index4_1_1.html", "index4_1_2.html", "index4_1_3.html"],
  "4.1.1": ["index4_1_1.html"],
  "4.1.2": ["index4_1_2.html"],
  "4.1.3": ["index4_1_3.html"],
  "4.2": ["index4_2_1.html", "index4_2_2.html"],
  "4.2.1": ["index4_2_1.html"],
  "4.2.2": ["index4_2_2.html"],
  "4.3": ["index4_3_1.html", "index4_3_2.html"],
  "4.3.1": ["index4_3_1.html"],
  "4.3.2": ["index4_3_2.html"],
  "5": ["index5_1.html", "index5_4.html"],
  "5.1": ["index5_1.html"],
  "5.4": ["index5_4.html"],
  "6": ["index6_1_2.html", "index6_1_3.html"],
  "6.1": ["index6_1_2.html", "index6_1_3.html"],
  "6.1.2": ["index6_1_2.html"],
  "6.1.3": ["index6_1_3.html"],
  "7": ["index7_1_1.html", "index7_1_2.html", "index7_1_3.html", "index7_1_4.html", "index7_2.html"],
  "7.1": ["index7_1_1.html", "index7_1_2.html", "index7_1_3.html", "index7_1_4.html"],
  "7.1.1": ["index7_1_1.html"],
  "7.1.2": ["index7_1_2.html"],
  "7.1.3": ["index7_1_3.html"],
  "7.1.4": ["index7_1_4.html"],
  "7.2": ["index7_2.html"]
});

const MATH_B_2026_2027_PATHS = Object.freeze({
  "A.1.1": ["indexA1_1.html"],
  "A.1.2": ["indexA1_2.html"],
  "A.1.4": ["indexA1_4.html"],
  "A.2.1": ["indexA2_1.html"],
  "A.2.2": ["indexA2_2.html"],
  "A.2.3": ["indexA2_3.html"],
  "A.3.1": ["indexA3_1.html"],
  "A.3.2": ["indexA3_2.html"],
  "A.3.3": ["indexA3_3.html"],
  "A.3.4": ["indexA3_4.html"],
  "A.3.5": ["indexA3_5.html"],
  "A.4.1": ["indexA4_1.html"],
  "A.4.2": ["indexA4_2.html"],
  "A.4.5": ["indexA4_5.html"],
  "B.1.1": ["indexB1_1.html"],
  "B.1.2": ["indexB1_2.html"],
  "B.1.3": ["indexB1_3.html"],
  "B.1.4": ["indexB1_4.html"],
  "B.2.1": ["indexB2_1.html"],
  "B.2.2": ["indexB2_2.html"],
  "B.3.1": ["indexB3_1.html"],
  "B.3.2": ["indexB3_2.html"],
  "B.3.3": ["indexB3_3.html"],
  "B.3.5": ["indexB3_5.html"],
  "B.4.2": ["indexB4_2.html"],
  "B.4.3": ["indexB4_3.html"],
  "B.4.4": ["indexB4_4.html"],
  "B.4.6": ["indexB4_6.html"]
});

const CHEMISTRY_B_2026_2027_PATHS = Object.freeze({
  "1.1": ["index1_1.html"],
  "1.2": ["index1_2.html"],
  "1.3": ["index1_3.html"],
  "2.1": ["index2_1.html"],
  "2.2": ["index2_2_1.html", "index2_2_2.html"],
  "2.3": ["index2_3_1.html", "index2_3_2.html", "index2_3_3.html"],
  "2.4": ["index2_4.html"],
  "2.5": ["index2_5.html"],
  "2.6": ["index2_6.html", "index2_6_2.html"],
  "2.7": ["index2_7.html"],
  "2.8": ["index2_8.html"],
  "2.9": ["index2_9.html"],
  "2.10": ["index2_10.html"],
  "2.11": ["index2_11.html"],
  "3.1": ["index3_1.html"],
  "3.2": ["index3_2.html"],
  "3.3": ["index3_3.html"],
  "3.4": ["index3_4.html"],
  "4.2": ["index4_2.html"]
});

const GEOGRAPHY_B_2026_2027_PATHS = Object.freeze({
  "1": ["mat1_1.html"],
  "2": ["mat1_2.html"],
  "3": ["mat1_3.html"],
  "6": ["mat2_6.html"],
  "7": ["mat2_7.html"],
  "8": ["mat2_8.html"],
  "9": ["mat2_9.html"],
  "10": ["mat2_10.html"],
  "11": ["mat2_11.html"],
  "12": ["mat2_12.html"],
  "13": ["mat2_13.html"],
  "14": ["mat2_14.html"],
  "15": ["mat2_15.html"],
  "16": ["mat2_16.html"],
  "17": ["mat2_17.html"],
  "18": ["mat2_18.html"],
  "19": ["mat2_19.html"],
  "20": ["mat2_20.html"],
  "21": ["mat2_21.html"],
  "22": ["mat2_22.html"],
  "23": ["mat2_23.html"],
  "24": ["mat2_24.html"],
  "25": ["mat3_25.html"],
  "26": ["mat3_26.html"],
  "27": ["mat3_27.html"],
  "28": ["mat3_28.html"],
  "29": ["mat3_29.html"],
  "30": ["mat3_30.html"],
  "31": ["mat3_31.html"],
  "32": ["mat3_32.html"],
  "33": ["mat3_33.html"],
  "34": ["mat3_34.html"],
  "35": ["mat3_35.html"],
  "36": ["mat3_36.html"],
  "37": ["mat4_37.html"],
  "38": ["mat4_38.html"],
  "39": ["mat4_39.html"],
  "40": ["mat4_40.html"],
  "41": ["mat4_41.html"],
  "42": ["mat4_42.html"],
  "43": ["mat4_43.html"],
  "44": ["mat4_44.html"],
  "45": ["mat4_45.html"],
  "46": ["mat4_46.html"],
  "47": ["mat4_47.html"],
  "48": ["mat4_48.html"]
});

const LITERATURE_B_2026_2027_TEXTS = Object.freeze([
  {
    "path": "indexa_1.html",
    "titles": [
      "Πίνοντας ήλιο κορινθιακό"
    ]
  },
  {
    "path": "indexa_2.html",
    "titles": [
      "Ξυπνάμε και η θάλασσα ξυπνά μαζί μας"
    ]
  },
  {
    "path": "indexa_3.html",
    "titles": [
      "Αθήνα"
    ]
  },
  {
    "path": "indexa_4.html",
    "titles": [
      "Η πόλη"
    ]
  },
  {
    "path": "indexa_5.html",
    "titles": [
      "Χαλασμένες γειτονιές"
    ]
  },
  {
    "path": "indexa_6.html",
    "titles": [
      "Ένα παλιό μήνυμα για το σύγχρονο κόσμο"
    ]
  },
  {
    "path": "indexb_1.html",
    "titles": [
      "Ο Τάκη-Πλούμας"
    ]
  },
  {
    "path": "indexb_2.html",
    "titles": [
      "Η Άννα του Κλήδονα"
    ]
  },
  {
    "path": "indexb_3.html",
    "titles": [
      "Να 'σαι καλά, δάσκαλε!"
    ]
  },
  {
    "path": "indexb_4.html",
    "titles": [
      "Ο Καραγκιόζης. Ένα ελληνικό θέατρο σκιών"
    ]
  },
  {
    "path": "indexc_1.html",
    "titles": [
      "Η μάνα"
    ]
  },
  {
    "path": "indexc_2.html",
    "titles": [
      "Από το ημερολόγιο της Άννας Φρανκ"
    ]
  },
  {
    "path": "indexc_3.html",
    "titles": [
      "Οι Κυριακές στη θάλασσα"
    ]
  },
  {
    "path": "indexc_4.html",
    "titles": [
      "Νανούρισμα στο γιο μου"
    ]
  },
  {
    "path": "indexd_1.html",
    "titles": [
      "Στην εκκλησία"
    ]
  },
  {
    "path": "indexd_2.html",
    "titles": [
      "Τ' άσπρο ξωκλήσι"
    ]
  },
  {
    "path": "indexd_3.html",
    "titles": [
      "Κάποια Χριστούγεννα"
    ]
  },
  {
    "path": "indexd_4.html",
    "titles": [
      "Η ιστορία του δαχτυλιδιού"
    ]
  },
  {
    "path": "indexe_1.html",
    "titles": [
      "Ο Διγενής"
    ]
  },
  {
    "path": "indexe_2.html",
    "titles": [
      "Του Βασίλη"
    ]
  },
  {
    "path": "indexe_3.html",
    "titles": [
      "Εις Σάμον"
    ]
  },
  {
    "path": "indexe_4.html",
    "titles": [
      "Η καταστροφή των Ψαρών"
    ]
  },
  {
    "path": "indexe_5.html",
    "titles": [
      "Ερημωμένα χωριά"
    ]
  },
  {
    "path": "indexe_6.html",
    "titles": [
      "Από δόξα και θάνατο"
    ]
  },
  {
    "path": "indexe_7.html",
    "titles": [
      "Έξι χιλιάδες νέοι"
    ]
  },
  {
    "path": "indexe_8.html",
    "titles": [
      "Το συρματόπλεγμα του αίσχους"
    ]
  },
  {
    "path": "indexf_1.html",
    "titles": [
      "Όταν πρωτοκατέβηκα στη Σμύρνη"
    ]
  },
  {
    "path": "indexf_2.html",
    "titles": [
      "Πάσχα τ' Απρίλη"
    ]
  },
  {
    "path": "indexf_3.html",
    "titles": [
      "Χρονικό"
    ]
  },
  {
    "path": "indexf_4.html",
    "titles": [
      "Ένας αριθμός"
    ]
  },
  {
    "path": "indexg_1.html",
    "titles": [
      "Βγαίνοντας από το σχολειό"
    ]
  },
  {
    "path": "indexg_2.html",
    "titles": [
      "Μια Κυριακή στην Κνωσό"
    ]
  },
  {
    "path": "indexg_3.html",
    "titles": [
      "Η εξοχική Λευκάδα"
    ]
  },
  {
    "path": "indexg_4.html",
    "titles": [
      "Τόκιο"
    ]
  },
  {
    "path": "indexh_1.html",
    "titles": [
      "Θέλω να πα στην ξενιτιά",
      "Θέλω να πας στην ξενιτιά",
      "Ξενιτεμένο μου πουλί"
    ]
  },
  {
    "path": "indexh_2.html",
    "titles": [
      "Ο Κάσπαρ Χάουζερ στην έρημη χώρα"
    ]
  },
  {
    "path": "indexh_3.html",
    "titles": [
      "Η επιστροφή του Αντρέα"
    ]
  },
  {
    "path": "indexh_4.html",
    "titles": [
      "Για τον όρο «μετανάστες»"
    ]
  },
  {
    "path": "indexh_5.html",
    "titles": [
      "Γλυκό του κουταλιού"
    ]
  },
  {
    "path": "indexh_6.html",
    "titles": [
      "Δύο γράμματα της Χαράς"
    ]
  },
  {
    "path": "indexh_7.html",
    "titles": [
      "Αναμνήσεις της Κωνσταντίνας από τη Γερμανία"
    ]
  },
  {
    "path": "indexi_1.html",
    "titles": [
      "Καλλιπάτειρα"
    ]
  },
  {
    "path": "indexi_2.html",
    "titles": [
      "Η τρίπλα των ονείρων"
    ]
  },
  {
    "path": "indexi_3.html",
    "titles": [
      "Η τοπική ομάδα"
    ]
  },
  {
    "path": "indexi_4.html",
    "titles": [
      "Η εσχάτη των ποινών"
    ]
  },
  {
    "path": "indexj_1.html",
    "titles": [
      "Τα πουλιά δέλεαρ του Θεού"
    ]
  },
  {
    "path": "indexj_2.html",
    "titles": [
      "Γιατί;"
    ]
  },
  {
    "path": "indexj_3.html",
    "titles": [
      "Η κυρία Νίτσα"
    ]
  },
  {
    "path": "indexj_4.html",
    "titles": [
      "Και πάλι στο σχολείο..."
    ]
  },
  {
    "path": "indexj_5.html",
    "titles": [
      "Ο μικρός πρίγκιπας και η αλεπού"
    ]
  },
  {
    "path": "indexj_6.html",
    "titles": [
      "Μαλαισιακά τραγούδια"
    ]
  },
  {
    "path": "indexk_1.html",
    "titles": [
      "Θερμοπύλες"
    ]
  },
  {
    "path": "indexk_2.html",
    "titles": [
      "Όμως ο μπαμπάς δεν ερχόταν"
    ]
  },
  {
    "path": "indexk_3.html",
    "titles": [
      "Για ένα παιδί που κοιμάται"
    ]
  },
  {
    "path": "indexk_4.html",
    "titles": [
      "Το τραγούδι του Γιανγκ"
    ]
  },
  {
    "path": "indexl_1.html",
    "titles": [
      "Τι έπαιξα στο Λαύριο"
    ]
  },
  {
    "path": "indexl_2.html",
    "titles": [
      "Στην εποχή του τσιμέντου και της πολυκατοικίας"
    ]
  },
  {
    "path": "indexl_3.html",
    "titles": [
      "Γραφείον ευρέσεως εργασίας"
    ]
  },
  {
    "path": "indexl_4.html",
    "titles": [
      "Με το λεωφορείο"
    ]
  },
  {
    "path": "indexl_5.html",
    "titles": [
      "Ιστορία του λαβύρινθου"
    ]
  },
  {
    "path": "indexl_6.html",
    "titles": [
      "Τα λουλούδια της Χιροσίμα"
    ]
  },
  {
    "path": "indexl_7.html",
    "titles": [
      "Όταν πεθαίνει ένα παιδί"
    ]
  },
  {
    "path": "indexl_8.html",
    "titles": [
      "Στα καμένα"
    ]
  },
  {
    "path": "indexm_1.html",
    "titles": [
      "Οι γάτες των φορτηγών"
    ]
  },
  {
    "path": "indexm_2.html",
    "titles": [
      "Ο λύκος"
    ]
  },
  {
    "path": "indexm_3.html",
    "titles": [
      "Άνθρωποι και δελφίνια"
    ]
  },
  {
    "path": "indexm_4.html",
    "titles": [
      "Ο μεταξοσκώληκας"
    ]
  },
  {
    "path": "indexm_5.html",
    "titles": [
      "Ο σκαντζόχερος"
    ]
  }
]);

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const rawSubject = clean(req.query?.subject, 120);
  const topic = clean(req.query?.topic, 500);
  const subject = ALIASES[rawSubject] || rawSubject;
  const book = BOOKS[subject];

  if (!book || !topic) {
    return res.status(404).json({
      grounded: false,
      error: "source_not_mapped",
      message: "Δεν υπάρχει ακόμη χαρτογραφημένη επίσημη πηγή για αυτή την επιλογή."
    });
  }

  const directUrls = resolveDirectSourceUrls(subject, topic);
  if (book.officialSourceRequired && !directUrls.length) {
    return res.status(404).json({
      grounded: false,
      error: "section_not_resolved",
      bookTitle: book.title,
      schoolYear: book.schoolYear,
      curriculumSource: book.curriculumSource,
      message: "Η επιλογή δεν ανήκει στην επαληθευμένη ύλη 2026–27 ή δεν έχει ακριβή αντιστοίχιση σε επίσημη σελίδα."
    });
  }
  const path = directUrls.length ? "__direct__" : resolveSectionPath(book.mode, topic);
  if (!path) {
    return res.status(404).json({
      grounded: false,
      error: "section_not_resolved",
      bookTitle: book.title,
      message: "Δεν ταυτοποιήθηκε με ασφάλεια συγκεκριμένη σελίδα του σχολικού βιβλίου."
    });
  }

  try {
    let sourceUrls = [];
    let combinedText = "";

    if (directUrls.length) {
      sourceUrls = directUrls;
      const pages = await Promise.all(sourceUrls.map(fetchOfficialHtml));
      if (pages.some((html) => !html)) {
        return res.status(404).json({
          grounded: false,
          error: "official_source_unavailable",
          bookTitle: book.title,
          sourceUrls,
          message: "Μία ή περισσότερες επίσημες σελίδες της ενότητας δεν ήταν διαθέσιμες."
        });
      }
      combinedText = distributeOfficialPages(pages, sourceUrls, 42000);
    } else if (book.multi) {
      sourceUrls = await discoverUnitPages(book, path);
      if (!sourceUrls.length) {
        return res.status(404).json({
          grounded: false,
          error: "official_source_unavailable",
          bookTitle: book.title,
          message: "Δεν βρέθηκαν οι επίσημες υποσελίδες της συγκεκριμένης ενότητας."
        });
      }
      const pages = await Promise.all(sourceUrls.slice(0, 12).map(fetchOfficialHtml));
      combinedText = distributeOfficialPages(pages, sourceUrls, 42000);
    } else {
      const sourceUrl = new URL(path, book.base).toString();
      sourceUrls = [sourceUrl];
      const html = await fetchOfficialHtml(sourceUrl);
      if (!html) {
        return res.status(404).json({
          grounded: false,
          error: "official_source_unavailable",
          bookTitle: book.title,
          sourceUrl,
          message: "Η συγκεκριμένη σελίδα του επίσημου βιβλίου δεν ήταν διαθέσιμη."
        });
      }
      combinedText = htmlToText(html);
    }

    const scoped = applyCurriculumTextScope(subject, topic, combinedText);
    const useful = book.multi ? scoped.text : selectUsefulText(scoped.text, topic);
    const sourceUrl = sourceUrls[0] || book.base;

    if (useful.length < 500) {
      return res.status(404).json({
        grounded: false,
        error: "source_too_short",
        bookTitle: book.title,
        sourceUrl,
        message: "Βρέθηκε η επίσημη πηγή, αλλά δεν εξήχθη αρκετό κείμενο για ασφαλή απάντηση."
      });
    }

    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({
      grounded: true,
      subject,
      topic,
      bookTitle: book.title,
      schoolYear: book.schoolYear || null,
      curriculumSource: book.curriculumSource || null,
      curriculumExclusions: scoped.exclusions,
      curriculumScopeApplied: scoped.exclusions.length > 0,
      sourceUrl,
      sourceUrls,
      text: useful.slice(0, 42000)
    });
  } catch (err) {
    return res.status(502).json({
      grounded: false,
      error: "official_source_fetch_failed",
      bookTitle: book.title,
      message: "Δεν ήταν δυνατή η ανάκτηση της επίσημης σχολικής πηγής."
    });
  }
};

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

function resolveDirectSourceUrls(subject, topic) {
  const t = normalize(topic);
  const a = "https://ebooks.edu.gr/ebooks/v/html/8547/2250/Biologia_A-Gymnasiou_html-empl/";

  if (subject === "istoria-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveHistoryCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "mathimatika-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveMathBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "chimeia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveChemistryBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "geologia-geografia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveGeographyBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "logotechnia-b-gymnasiou") {
    const base = BOOKS[subject].base;
    return resolveLiteratureBCurriculumPaths(topic).map(path => new URL(path, base).toString());
  }

  if (subject === "biologia-a-gymnasiou") {
    // Current 2026–27 curriculum topics only. Do not expose the whole book as this year's syllabus.
    if (t.includes("οργανωση της ζωης") && t.includes("χαρακτηριστικ")) {
      return [a + "index1_1.html"];
    }
    if (t.includes("κυτταρο") && t.includes("μοναδα της ζωης")) {
      return [a + "index1_2.html"];
    }
    if (t.includes("οργανωση πολυκυτταρων οργανισμων")) {
      return [a + "index1_3.html"];
    }
    if (t.includes("αλληλεπιδρασεις και προσαρμογες")) {
      return [a + "index1_4.html"];
    }
    if (t.includes("φωτοσυνθεση")) {
      return [a + "index2_1.html"];
    }
    if (t.includes("προσληψη ουσιων και πεψη")) {
      return [a + "index2_2.html", a + "index2_3.html", a + "index2_4.html"];
    }
    if (t.includes("μεταφορα και αποβολη ουσιων")) {
      return [a + "index3_1.html", a + "index3_2.html", a + "index3_3.html", a + "index3_4.html"];
    }
    if (t.includes("αναπνοη στους οργανισμους και στον ανθρωπο")) {
      return [a + "index4_1.html", a + "index4_2.html", a + "index4_3.html", a + "index4_4.html"];
    }
    return [];
  }

  if (subject !== "biologia-b-gymnasiou") return [];
  const bg = "https://ebooks.edu.gr/ebooks/v/html/8547/2210/Biologia_B-G-Gymnasiou_html-empl/";

  if (t.includes("στηριξη και κινηση σε μονοκυτταρους οργανισμους και φυτα")) {
    return [a + "index5_1.html", a + "index5_2.html"];
  }
  if (t.includes("στηριξη και κινηση σε ζωα") || t.includes("μυοσκελετικο συστημα")) {
    return [a + "index5_3.html", a + "index5_4.html"];
  }
  if (t.includes("αναπαραγωγη σε μονοκυτταρους οργανισμους και φυτα")) {
    return [a + "index6_1.html", a + "index6_2.html"];
  }
  if (t.includes("αναπαραγωγη στα ζωα και στον ανθρωπο")) {
    return [a + "index6_3.html", a + "index6_4.html"];
  }
  if (t.includes("κυτταρο και επιπεδα οργανωσης")) {
    return [a + "index1_2.html", a + "index1_3.html"];
  }
  if (t.includes("ομοιοσταση και ασθενειες")) {
    return [bg + "index4_1.html", bg + "index4_2.html"];
  }
  if (t.includes("αμυντικοι μηχανισμοι του ανθρωπου")) {
    return [bg + "index4_3.html"];
  }
  if (t.includes("τροπος ζωης και ασθενειες")) {
    return [bg + "index4_4.html"];
  }
  return [];
}

function resolveSectionPath(mode, topic) {
  const t = String(topic || "");

  if (mode === "biologyA" || mode === "biologyB") return "";

  if (mode === "numeric") {
    let m = t.match(/^\s*(\d+)\.(\d+)\b/);
    if (m) return `index${m[1]}_${m[2]}.html`;

    m = t.match(/Κεφάλαιο\s+(\d+)/i);
    if (m) return `index${m[1]}.html`;
    return "";
  }

  if (mode === "unit2digit") {
    const m = t.match(/Ενότητα\s+(\d+)/i);
    if (!m) return "";
    return `index${String(m[1]).padStart(2, "0")}.html`;
  }

  if (mode === "odyssey") {
    const m = t.match(/^\s*(\d+)(?:η|ή|ὴ)?\s+Ενότητα/i) || t.match(/Ενότητα\s+(\d+)/i);
    if (!m) return "";
    return `index_${String(m[1]).padStart(2, "0")}.html`;
  }

  if (mode === "iliadSequence") {
    const m = t.match(/^\s*(\d+)(?:η|ή|ὴ)?\s+Ενότητα/i);
    if (!m) return "";
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < 1 || n > 21) return "";
    return `index${String(n + 1).padStart(2, "0")}.html`;
  }

  if (mode === "modernGreekA" || mode === "modernGreekG") {
    const m = t.match(/(\d+)(?:η|ή)?\s+(?:ενότητα|ENOTHTA)/i);
    if (!m) return "";
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < 1 || n > 10) return "";
    const letter = String.fromCharCode("b".charCodeAt(0) + n - 1);
    return `index${letter}_`;
  }

  if (mode === "modernGreekB") {
    const m = t.match(/(\d+)(?:η|ή)?\s+ενότητα/i);
    if (!m) return "";
    const n = Number(m[1]);
    if (!Number.isInteger(n) || n < 1 || n > 9) return "";
    return `en${n}_`;
  }

  if (mode === "history") {
    return resolveHistoryCurriculumPaths(t)[0] || "";
  }

  return "";
}

function resolveHistoryCurriculumPaths(topic) {
  const key = historyTopicKey(topic);
  return key && HISTORY_B_2026_2027_PATHS[key]
    ? [...HISTORY_B_2026_2027_PATHS[key]]
    : [];
}

function historyTopicKey(topic) {
  const value = String(topic || "");
  const chapterMatch = value.match(/Κεφάλαιο\s+(\d+)/i);
  if (!chapterMatch) return "";

  const chapter = chapterMatch[1];
  const beforeTitle = value.slice(chapterMatch.index + chapterMatch[0].length).split(/—/)[0];
  const segments = [...beforeTitle.matchAll(/·\s*([ΙI]{1,3}|\d+)/gi)].map(match => match[1]);
  if (!segments.length) return chapter;

  const romanMap = { "Ι": 1, "ΙΙ": 2, "ΙΙΙ": 3, "I": 1, "II": 2, "III": 3 };
  const first = segments[0].toUpperCase();
  const firstNumber = romanMap[first] || (/^\d+$/.test(first) ? Number(first) : 0);
  if (!firstNumber) return "";
  if (segments.length === 1) return `${chapter}.${firstNumber}`;

  const lesson = Number(segments[1]);
  return Number.isInteger(lesson) && lesson > 0 ? `${chapter}.${firstNumber}.${lesson}` : "";
}

function resolveMathBCurriculumPaths(topic) {
  const key = mathBTopicKey(topic);
  return key && MATH_B_2026_2027_PATHS[key]
    ? [...MATH_B_2026_2027_PATHS[key]]
    : [];
}

function mathBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/Μέρος\s+([ΑAΒB])\s*·\s*(\d+)\.(\d+)/i);
  if (!match) return "";

  const part = /[ΑA]/i.test(match[1]) ? "A" : "B";
  const chapter = Number(match[2]);
  const section = Number(match[3]);
  if (!Number.isInteger(chapter) || chapter < 1 || !Number.isInteger(section) || section < 1) return "";
  return `${part}.${chapter}.${section}`;
}

function resolveChemistryBCurriculumPaths(topic) {
  const key = chemistryBTopicKey(topic);
  return key && CHEMISTRY_B_2026_2027_PATHS[key]
    ? [...CHEMISTRY_B_2026_2027_PATHS[key]]
    : [];
}

function chemistryBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/(?:Γενική\s+Ενότητα\s+\d+\s*·\s*)?(\d+)\.(\d+)/i);
  if (!match) return "";
  const chapter = Number(match[1]);
  const section = Number(match[2]);
  if (!Number.isInteger(chapter) || chapter < 1 || !Number.isInteger(section) || section < 1) return "";
  return `${chapter}.${section}`;
}

function resolveGeographyBCurriculumPaths(topic) {
  const key = geographyBTopicKey(topic);
  return key && GEOGRAPHY_B_2026_2027_PATHS[key]
    ? [...GEOGRAPHY_B_2026_2027_PATHS[key]]
    : [];
}

function geographyBTopicKey(topic) {
  const value = String(topic || "");
  const match = value.match(/Μάθημα\s+(\d+)/i);
  if (!match) return "";
  const lesson = Number(match[1]);
  return Number.isInteger(lesson) && lesson > 0 ? String(lesson) : "";
}

function resolveLiteratureBCurriculumPaths(topic) {
  const value = normalize(topic);
  const matches = LITERATURE_B_2026_2027_TEXTS.filter(row =>
    row.titles.some(title => {
      const needle = normalize(title);
      return needle.length >= 6 && value.includes(needle);
    })
  );
  return [...new Set(matches.map(row => row.path))];
}

async function fetchOfficialHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "aitools4kids.gr educational source grounding",
      "Accept": "text/html,application/xhtml+xml"
    },
    redirect: "follow"
  });
  return response.ok ? response.text() : "";
}

async function discoverUnitPages(book, prefix) {
  const rootHtml = await fetchOfficialHtml(book.base);
  if (!rootHtml) return [];

  const hrefs = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(rootHtml))) {
    const href = String(m[1] || "").trim();
    const file = href.split(/[?#]/)[0].split("/").pop() || "";
    if (!file.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    if (!/\.html?$/i.test(file)) continue;
    const absolute = new URL(href, book.base).toString();
    if (!hrefs.includes(absolute)) hrefs.push(absolute);
  }

  // Some book roots expose only a subset of links to crawlers. Probe a bounded
  // sequence using the verified filename scheme and keep only successful pages.
  if (!hrefs.length) {
    const candidates = [];
    for (let i = 0; i <= 10; i++) {
      const ext = book.mode === "modernGreekA" ? ".htm" : ".html";
      candidates.push(new URL(prefix + i + ext, book.base).toString());
    }
    const checked = await Promise.all(candidates.map(async url => {
      try {
        const response = await fetch(url, {
          method: "HEAD",
          headers: { "User-Agent": "aitools4kids.gr educational source grounding" },
          redirect: "follow"
        });
        return response.ok ? url : "";
      } catch (_) { return ""; }
    }));
    checked.filter(Boolean).forEach(url => hrefs.push(url));
  }

  return hrefs.slice(0, 12);
}

function distributeOfficialPages(pages, urls, maxChars) {
  const rows = pages.map((html, i) => ({
    url: urls[i] || "",
    text: html ? htmlToText(html) : ""
  })).filter(row => row.text.length >= 120);
  if (!rows.length) return "";

  const overhead = rows.reduce((n, row) => n + (row.url ? row.url.length + 24 : 0), 0);
  const budget = Math.max(1200, maxChars - overhead);
  const perPage = Math.max(900, Math.floor(budget / rows.length));

  return rows.map(row => {
    const label = row.url ? "[Official page: " + row.url + "]\n" : "";
    const text = row.text;
    if (text.length <= perPage) return label + text;
    const head = Math.floor(perPage * 0.72);
    const tail = perPage - head;
    return label + text.slice(0, head) + "\n[… official page excerpt …]\n" + text.slice(-tail);
  }).join("\n\n").slice(0, maxChars);
}

function htmlToText(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6]|\/section)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeEntities(s) {
  const named = {
    nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
    laquo: "«", raquo: "»", ndash: "–", mdash: "—", middot: "·"
  };
  return String(s || "")
    .replace(/&([a-zA-Z]+);/g, (m, n) => Object.prototype.hasOwnProperty.call(named, n) ? named[n] : m)
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => {
      const code = parseInt(n, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyCurriculumTextScope(subject, topic, text) {
  let scoped = String(text || "");
  const exclusions = [];

  if (subject === "mathimatika-b-gymnasiou") {
    const key = mathBTopicKey(topic);

    if (key === "A.3.2") {
      exclusions.push("Δεν διδάσκονται η Εφαρμογή 2 της σελ. 62 και ο τύπος απόστασης δύο σημείων της σελ. 63.");
      scoped = scoped.replace(
        /\n2\s*\nΔίνεται το σημείο Α\(3, 2\)[\s\S]*?(?=\n4\s*\nΈχει διαπιστωθεί)/i,
        "\n"
      );
    }
    if (key === "A.3.4") {
      exclusions.push("Δεν διδάσκονται η εξίσωση αx + βy = γ ούτε τα σημεία τομής της με τους άξονες.");
      scoped = truncateAt(scoped, "Η εξίσωση της μορφής αx + βy = γ");
    }
    if (key === "A.4.1") {
      exclusions.push("Οι έννοιες πληθυσμός, μεταβλητή, δείγμα, δειγματοληψία, δημοσκόπηση, μέγεθος και αντιπροσωπευτικότητα δείγματος εξηγούνται αλλά δεν εξετάζονται.");
    }
    if (key === "A.4.5") {
      exclusions.push("Δεν διδάσκεται η μέση τιμή ομαδοποιημένης κατανομής.");
      scoped = truncateAt(scoped, "Μέση τιμή ομαδοποιημένης κατανομής");
    }
    if (key === "B.2.2") {
      exclusions.push("Δεν διδάσκεται η Παρατήρηση (β) της ενότητας 2.2.");
      scoped = scoped.replace(
        /β\)\s*Αν τώρα διαιρέσουμε το ημω με το συνω[\s\S]*?Άρα:\s*(?:Image\s*)?/i,
        ""
      );
    }
  }

  if (subject === "chimeia-b-gymnasiou") {
    const key = chemistryBTopicKey(topic);
    if (key === "2.10") {
      exclusions.push("Δεν διδάσκεται η παράγραφος «Χημικοί τύποι ιόντων και ιοντικών ενώσεων».");
      scoped = truncateAt(scoped, "Χημικοί τύποι ιόντων και ιοντικών ενώσεων");
    }
  }

  return { text: scoped.trim(), exclusions };
}

function truncateAt(text, marker) {
  const source = String(text || "");
  const i = normalize(source).indexOf(normalize(marker));
  if (i < 0) return source;

  // Normalized offsets are not exact; locate the literal marker first when possible.
  const literal = source.toLowerCase().indexOf(String(marker).toLowerCase());
  if (literal >= 0) return source.slice(0, literal).trim();

  // Greek accents may differ; use a conservative line scan when literal matching fails.
  const markerNorm = normalize(marker);
  const lines = source.split("\n");
  const kept = [];
  for (const line of lines) {
    if (normalize(line).includes(markerNorm)) break;
    kept.push(line);
  }
  return kept.join("\n").trim();
}

function selectUsefulText(text, topic) {
  const full = String(text || "").trim();
  if (full.length <= 42000) return full;

  const words = normalize(topic)
    .split(" ")
    .filter(w => w.length >= 4 && !["κεφαλαιο", "ενοτητα", "γυμνασιου"].includes(w))
    .slice(0, 12);

  if (!words.length) return full.slice(0, 42000);

  const norm = normalize(full);
  let best = -1;
  for (const word of words) {
    const i = norm.indexOf(word);
    if (i >= 0 && (best < 0 || i < best)) best = i;
  }

  // Normalized offsets are approximate; keep a broad window around the section body.
  if (best < 0) return full.slice(0, 42000);
  const start = Math.max(0, best - 4000);
  return full.slice(start, start + 42000);
}

module.exports._test = Object.freeze({
  historyTopicKey,
  resolveHistoryCurriculumPaths,
  mathBTopicKey,
  resolveMathBCurriculumPaths,
  chemistryBTopicKey,
  resolveChemistryBCurriculumPaths,
  geographyBTopicKey,
  resolveGeographyBCurriculumPaths,
  resolveLiteratureBCurriculumPaths,
  resolveSectionPath,
  HISTORY_B_2026_2027_PATHS,
  MATH_B_2026_2027_PATHS,
  CHEMISTRY_B_2026_2027_PATHS,
  GEOGRAPHY_B_2026_2027_PATHS,
  LITERATURE_B_2026_2027_TEXTS,
  applyCurriculumTextScope
});
