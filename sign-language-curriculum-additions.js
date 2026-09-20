/** Curriculum-linked Greek Sign Language additions — 20 Sep 2026.
 *  Only terms with a verified school-curriculum mapping are included here.
 *  Video files remain hosted by IEP; visuals use open educational/media sources.
 */
(function(){
  "use strict";

  const SOURCE_POLITICS = {
    page:"https://prosvasimo.iep.edu.gr/el/lexiko-politikh-zoh-me-nohma",
    label:"Λεξικό ΕΝΓ: Πολιτική ζωή με νόημα"
  };
  const SOURCE_SCHOOL = {
    page:"https://prosvasimo.iep.edu.gr/el/lexiko-sxoleio-proswpika-antikeimena",
    label:"Λεξικό ΕΝΓ: Σχολείο / προσωπικά αντικείμενα"
  };

  const MEDIA = {
    pnyx:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/View%20of%20the%20Pnyx%20plateau%20in%20Athens%20%2850959890047%29.jpg?width=1000",
      alt:"Η Πνύκα στην Αθήνα, χώρος συνδεδεμένος με τη λειτουργία της αρχαίας αθηναϊκής δημοκρατίας",
      credit:"Εικόνα: George E. Koronaios · Wikimedia Commons",
      source:"https://commons.wikimedia.org/wiki/File:View_of_the_Pnyx_plateau_in_Athens_(50959890047).jpg"
    },
    kapodistrias:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Ioannis%20Kapodistrias%20%281776-1831%29.jpg?width=1000",
      alt:"Πορτρέτο του Ιωάννη Καποδίστρια",
      credit:"Εικόνα: Δ. Τσόκος · Public domain",
      source:"https://commons.wikimedia.org/wiki/File:Ioannis_Kapodistrias_(1776-1831).jpg"
    },
    letter:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Mail-envelope.svg?width=1000",
      alt:"Εικονογράφηση φακέλου επιστολής",
      credit:"Εικόνα: Amada44 · Public domain",
      source:"https://commons.wikimedia.org/wiki/File:Mail-envelope.svg"
    },
    experiment:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Laboratory%20Glassware.jpg?width=1000",
      alt:"Εργαστηριακά γυάλινα σκεύη για πειράματα",
      credit:"Εικόνα: Michael Pereckas · CC BY 2.0",
      source:"https://commons.wikimedia.org/wiki/File:Laboratory_Glassware.jpg"
    },
    internet:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Internet%20map%201024.jpg?width=1000",
      alt:"Οπτική απεικόνιση δικτύων του Διαδικτύου",
      credit:"Εικόνα: The Opte Project · CC BY 2.5",
      source:"https://commons.wikimedia.org/wiki/File:Internet_map_1024.jpg"
    },
    euro:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Euro%20symbol%20black.svg?width=1000",
      alt:"Το σύμβολο του ευρώ",
      credit:"Εικόνα: Verdy_p · Public domain",
      source:"https://commons.wikimedia.org/wiki/File:Euro_symbol_black.svg"
    },
    parliament:{
      image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Greek%20Parliament%20and%20Syntagma%20Square.jpg?width=1000",
      alt:"Το Ελληνικό Κοινοβούλιο και η Πλατεία Συντάγματος",
      credit:"Εικόνα: Annatsach · CC BY-SA 4.0",
      source:"https://commons.wikimedia.org/wiki/File:Greek_Parliament_and_Syntagma_Square.jpg"
    }
  };

  const rows = [
    {
      name:"Άμεση δημοκρατία", subject:"history",
      desc:"Μορφή δημοκρατίας όπου οι πολίτες συμμετέχουν οι ίδιοι στη λήψη πολιτικών αποφάσεων, όπως στην κλασική Αθήνα.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Amesh_dhmokratia.webm",
      source:SOURCE_POLITICS, media:MEDIA.pnyx, grades:["l1"]
    },
    {
      name:"Δημοκρατία", subject:"history",
      desc:"Πολίτευμα στο οποίο η πολιτική εξουσία θεμελιώνεται στη συμμετοχή και τη βούληση των πολιτών μέσα από θεσμούς και κανόνες.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Dhmokratia.webm",
      source:SOURCE_POLITICS, media:MEDIA.pnyx, grades:["g1"]
    },
    {
      name:"Καποδίστριας", subject:"history",
      desc:"Ο Ιωάννης Καποδίστριας ήταν ο πρώτος Κυβερνήτης του ανεξάρτητου ελληνικού κράτους και ανέλαβε τη διακυβέρνηση το 1828.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Kapodistrias.webm",
      source:SOURCE_POLITICS, media:MEDIA.kapodistrias, grades:["d6"]
    },
    {
      name:"Επιστολή", subject:"language",
      desc:"Η επιστολή είναι γραπτό μήνυμα προς συγκεκριμένο παραλήπτη και οργανώνεται συνήθως με προσφώνηση, κύριο κείμενο και κλείσιμο.",
      video:"https://prosvasimo.iep.edu.gr/videos/glwssa_ab/Epistoli.webm",
      source:SOURCE_SCHOOL, media:MEDIA.letter, grades:["d5"]
    },
    {
      name:"Πείραμα", subject:"science",
      desc:"Το πείραμα είναι οργανωμένη δοκιμή ή παρατήρηση που γίνεται με συγκεκριμένα βήματα για να ελεγχθεί μια ιδέα ή μια σχέση μεταβλητών.",
      video:"https://prosvasimo.iep.edu.gr/videos/Meleth_Perivalontos/Peirama.webm",
      source:SOURCE_SCHOOL, media:MEDIA.experiment, grades:["g3"]
    },
    {
      name:"Κοινωνία της Πληροφορίας", subject:"civics",
      desc:"Κοινωνία όπου η παραγωγή, η πρόσβαση και η ανταλλαγή πληροφοριών μέσω ψηφιακών τεχνολογιών έχουν κεντρικό ρόλο.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Koinwnia_ths_Plhroforias.webm",
      source:SOURCE_POLITICS, media:MEDIA.internet, grades:["l1"]
    },
    {
      name:"Πληθωρισμός", subject:"civics",
      desc:"Ο πληθωρισμός είναι η γενική και διαρκής άνοδος του επιπέδου των τιμών, που μειώνει την αγοραστική δύναμη του χρήματος.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Plhthwrismos.webm",
      source:SOURCE_POLITICS, media:MEDIA.euro, grades:["l1"]
    },
    {
      name:"Κόμμα", subject:"civics",
      desc:"Πολιτικό κόμμα είναι οργανωμένη ομάδα που επιδιώκει να εκπροσωπήσει πολιτικές απόψεις και να συμμετέχει στη δημοκρατική πολιτική διαδικασία.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Komma.webm",
      source:SOURCE_POLITICS, media:MEDIA.parliament, grades:["l1"]
    },
    {
      name:"Πολίτης", subject:"civics",
      desc:"Πολίτης είναι μέλος μιας πολιτικής κοινότητας με αναγνωρισμένα δικαιώματα και υποχρεώσεις και δυνατότητα συμμετοχής στη δημόσια ζωή.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Poliths.webm",
      source:SOURCE_POLITICS, media:MEDIA.parliament, grades:["l1"]
    },
    {
      name:"Κράτος", subject:"civics",
      desc:"Το κράτος είναι οργανωμένη πολιτική οντότητα με θεσμούς, νόμους και δημόσιες λειτουργίες σε συγκεκριμένη επικράτεια.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Kratos.webm",
      source:SOURCE_POLITICS, media:MEDIA.parliament, grades:["l1"]
    },
    {
      name:"Ιδιωτικοποίηση", subject:"civics",
      desc:"Ιδιωτικοποίηση είναι η μεταβίβαση ιδιοκτησίας ή διαχείρισης μιας δημόσιας επιχείρησης ή δραστηριότητας σε ιδιωτικό φορέα.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Idiwtikopoihsh.webm",
      source:SOURCE_POLITICS, media:MEDIA.parliament, grades:["l1"]
    },
    {
      name:"Παραπληροφόρηση", subject:"civics",
      desc:"Παραπληροφόρηση είναι η διάδοση ψευδών ή παραπλανητικών πληροφοριών που μπορούν να δημιουργήσουν λανθασμένη εικόνα για ένα θέμα.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Paraplhroforhsh.webm",
      source:SOURCE_POLITICS, media:MEDIA.internet, grades:["l1"]
    },
    {
      name:"Ελληνοποίηση", subject:"civics",
      desc:"Στο συγκεκριμένο σχολικό πλαίσιο το λήμμα συνδέεται με ζητήματα απόκτησης της ελληνικής ιθαγένειας και πολιτογράφησης. Ο όρος μπορεί να χρησιμοποιείται και με άλλες σημασίες.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Ellhnopoihsh.webm",
      source:SOURCE_POLITICS, media:MEDIA.parliament, grades:["l1"]
    },
    {
      name:"Σύνταγμα", subject:"civics",
      desc:"Το Σύνταγμα είναι το θεμελιώδες νομικό κείμενο του κράτους και καθορίζει βασικούς θεσμούς, δικαιώματα και κανόνες λειτουργίας της πολιτείας.",
      video:"https://prosvasimo.iep.edu.gr/videos/Politikh-zoh-me-nohma/Syntagma.webm",
      source:SOURCE_POLITICS, media:MEDIA.parliament, grades:["l1"]
    }
  ];

  const subjectLabels = {
    history:"🏛️ Ιστορία",
    language:"📝 Γλώσσα",
    science:"🔬 Φυσικές Επιστήμες / Τεχνολογία",
    civics:"🏛️ Πολιτική Παιδεία"
  };

  const concepts = rows.map((row)=>({
    name:row.name,
    subject:row.subject,
    subjectLabel:subjectLabels[row.subject],
    desc:row.desc,
    video:row.video,
    sourcePage:row.source.page,
    sourceLabel:row.source.label,
    image:row.media.image,
    imageAlt:row.media.alt,
    imageCredit:row.media.credit,
    imageSource:row.media.source
  }));

  window.SIGN_LANGUAGE_CONCEPTS=(window.SIGN_LANGUAGE_CONCEPTS||[]).concat(concepts);
  const gradeMap=window.SIGN_LANGUAGE_GRADE_MAP=window.SIGN_LANGUAGE_GRADE_MAP||{};
  rows.forEach((row)=>{ gradeMap[row.name]=row.grades.slice(); });
})();