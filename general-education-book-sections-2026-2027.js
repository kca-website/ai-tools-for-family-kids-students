(function(){
  "use strict";
  const rows={
    "english-c-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/new/tautotita.php?course=DSDIM-C107",
      sections:[
        "Pre-Unit — Magic Letters",
        "Unit 1 — In the Fairytale Forest",
        "Unit 2 — The story of Bella the cat",
        "Unit 3 — The story of Pinocchio",
        "Unit 4 — The wind and the sun",
        "Unit 5 — Lusy's story",
        "Unit 6 — Beauty and the Beast",
        "Unit 7 — Planet Earth",
        "Unit 8 — Our World",
        "Extra Unit — Special days"
      ]
    },
    "english-d-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/new/tautotita.php?course=DSDIM-D101",
      sections:[
        "Unit 1 — Back to school",
        "Unit 2 — What's your favourite hobby or sport?",
        "Unit 3 — This is where I live",
        "Unit 4 — Time",
        "Unit 5 — Habits and customs",
        "Unit 6 — Animals",
        "Unit 7 — What are you doing?",
        "Unit 8 — Around the city",
        "Unit 9 — The school party",
        "Unit 10 — Enjoy your holidays"
      ]
    },
    "english-e-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/new/tautotita.php?course=DSDIM-E103",
      sections:[
        "Unit 1 — Internet friends around Europe",
        "Unit 2 — School life and the world around us",
        "Unit 3 — Places",
        "Unit 4 — Christmas everywhere",
        "Unit 5 — Ready for action",
        "Unit 6 — Good, better, best!",
        "Unit 7 — Going back in time",
        "Unit 8 — All about stories",
        "Unit 9 — Amazing people and places",
        "Unit 10 — Summer is here!"
      ]
    },
    "english-st-dimotikou":{
      sourceUrl:"https://ebooks.edu.gr/ebooks/v/html/8547/2270/Agglika_ST-Dimotikou_html-empl/",
      sections:[
        "Unit 1 — Our Multicultural Class",
        "Unit 2 — Going shopping",
        "Unit 3 — Imaginary creatures",
        "Unit 4 — The history of the aeroplane",
        "Unit 5 — Travelling through time",
        "Unit 6 — Me, myself and my future job",
        "Unit 7 — Share your experiences",
        "Unit 8 — Blow your own trumpet",
        "Unit 9 — Earth Day everyday",
        "Unit 10 — Time for fun"
      ]
    },
    "istoria-c-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSDIM-C103/88/701%2C2641/",
      sections:[
        "Ενότητα 1 — Η δημιουργία του κόσμου",
        "Ενότητα 2 — Ο Ηρακλής",
        "Ενότητα 3 — Ο Θησέας",
        "Ενότητα 4 — Η Αργοναυτική εκστρατεία",
        "Ενότητα 5 — Ο Τρωικός πόλεμος",
        "Ενότητα 6 — Οι περιπέτειες του Οδυσσέα",
        "Ενότητα 7 — Η εποχή του λίθου",
        "Ενότητα 8 — Ο Κυκλαδικός πολιτισμός",
        "Ενότητα 9 — Ο Μινωικός πολιτισμός",
        "Ενότητα 10 — Ο Μυκηναϊκός πολιτισμός"
      ]
    },
    "science-e-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSDIM-E107/154/1099%2C4022/",
      sections:[
        "Υλικά σώματα",
        "Μίγματα",
        "Ενέργεια",
        "Πεπτικό σύστημα",
        "Θερμότητα",
        "Ηλεκτρισμός",
        "Φως",
        "Ήχος"
      ]
    },
    "glossa-st-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSDIM-F102/416/2788%2C16955/",
      sections:[
        "Ενότητα 1 — Ταξίδια, τόποι, μεταφορικά μέσα",
        "Ενότητα 2 — Κατοικία",
        "Ενότητα 3 — 28η Οκτωβρίου",
        "Ενότητα 4 — Διατροφή",
        "Ενότητα 5 — 17η Νοέμβρη",
        "Ενότητα 6 — Η ζωή σε άλλους τόπους",
        "Ενότητα 7 — Η ζωή έξω από την πόλη",
        "Ενότητα 8 — Χριστούγεννα",
        "Ενότητα 9 — Συσκευές",
        "Ενότητα 10 — Ατυχήματα",
        "Ενότητα 11 — Συγγενικές σχέσεις",
        "Ενότητα 12 — 25η Μαρτίου",
        "Ενότητα 13 — Τρόποι ζωής και επαγγέλματα",
        "Ενότητα 14 — Πάσχα",
        "Ενότητα 15 — Κινηματογράφος - Θέατρο",
        "Ενότητα 16 — Μουσεία",
        "Ενότητα 17 — Πόλεμος και ειρήνη"
      ]
    },
    "istoria-st-dimotikou":{
      sourceUrl:"https://old.ebooks.edu.gr/new/tautotita.php?course=DSDIM-F114",
      sections:[
        "Ενότητα Α — Οι εξελίξεις στην Ευρώπη κατά τους Νεότερους Χρόνους (μέσα 15ου αιώνα - αρχές 19ου αιώνα)",
        "Ενότητα Β — Οι Έλληνες κάτω από την οθωμανική και τη λατινική κυριαρχία (1453-1821)",
        "Ενότητα Γ — Η Μεγάλη Επανάσταση (1821-1830)",
        "Ενότητα Δ — Η Ελλάδα στον 19ο αιώνα",
        "Ενότητα Ε — Η Ελλάδα στον 20ό αιώνα"
      ]
    },
    "mathimatika-g-gymnasiou":{
      sourceUrl:"https://www.ebooks.edu.gr/ebooks/v/html/8547/2212/Mathimatika_G-Gymnasiou_html-empl/",
      sections:[
        "Α΄ Μέρος · Κεφάλαιο 1 — Αλγεβρικές παραστάσεις",
        "Α΄ Μέρος · Κεφάλαιο 2 — Εξισώσεις - Ανισώσεις",
        "Α΄ Μέρος · Κεφάλαιο 3 — Συστήματα γραμμικών εξισώσεων",
        "Α΄ Μέρος · Κεφάλαιο 4 — Συναρτήσεις",
        "Α΄ Μέρος · Κεφάλαιο 5 — Πιθανότητες",
        "Β΄ Μέρος · Κεφάλαιο 1 — Γεωμετρία",
        "Β΄ Μέρος · Κεφάλαιο 2 — Τριγωνομετρία"
      ]
    },
    "fysiki-g-gymnasiou":{
      sourceUrl:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSGYM-C201/296/2071%2C7277/",
      sections:[
        "Κεφάλαιο 1 — Ηλεκτρική δύναμη και φορτίο",
        "Κεφάλαιο 2 — Ηλεκτρικό ρεύμα",
        "Κεφάλαιο 3 — Ηλεκτρική ενέργεια",
        "Κεφάλαιο 4 — Ταλαντώσεις",
        "Κεφάλαιο 5 — Μηχανικά κύματα",
        "Κεφάλαιο 6 — Φύση και διάδοση του φωτός",
        "Κεφάλαιο 7 — Ανάκλαση του φωτός",
        "Κεφάλαιο 8 — Διάθλαση του φωτός",
        "Κεφάλαιο 9 — Φακοί και οπτικά όργανα",
        "Κεφάλαιο 10 — Ο ατομικός πυρήνας",
        "Κεφάλαιο 11 — Πυρηνικές αντιδράσεις"
      ]
    },
    "biologia-b-gymnasiou":{
      sourceUrl:"https://old.ebooks.edu.gr/new/tautotita.php?course=DSGYM-C123",
      sections:[
        "Κεφάλαιο 1 — Οργάνωση της ζωής - Βιολογικά συστήματα",
        "Κεφάλαιο 2 — Οι οργανισμοί στο περιβάλλον τους",
        "Κεφάλαιο 3 — Μεταβολισμός",
        "Κεφάλαιο 4 — Οι ασθένειες και οι παράγοντες που σχετίζονται με την εμφάνισή τους",
        "Κεφάλαιο 5 — Διατήρηση και συνέχεια της ζωής",
        "Κεφάλαιο 6 — Γενετική μηχανική και βιοτεχνολογία",
        "Κεφάλαιο 7 — Εξέλιξη"
      ]
    },
    "istoria-b-gymnasiou":{
      sourceUrl:"https://ebooks.edu.gr/ebooks/v/html/8547/2198/Istoria_B-Gymnasiou_html-empl/",
      sections:[
        "Κεφάλαιο 1 — Οι πρώτοι αιώνες του Βυζαντίου (330-717)",
        "Κεφάλαιο 2 — Λαοί στον περίγυρο του Βυζαντινού κράτους",
        "Κεφάλαιο 3 — Περίοδος της μεγάλης ακμής του Βυζαντίου (717-1025)",
        "Κεφάλαιο 4 — Περίοδος της κρίσης του Βυζαντίου (1025-1453)",
        "Κεφάλαιο 5 — Ο πολιτισμός του Βυζαντίου",
        "Κεφάλαιο 6 — Η μεσαιωνική Ευρώπη",
        "Κεφάλαιο 7 — Η Ευρώπη στους νεότερους χρόνους (15ος-18ος αι.)"
      ]
    },
    "istoria-g-gymnasiou":{
      sourceUrl:"https://ebooks.edu.gr/ebooks/v/html/8547/5204/Istoria_G-Gymnasiou_html-empl/",
      sections:[
        "Κεφάλαιο 1 — Οι απαρχές του κόσμου",
        "Κεφάλαιο 2 — Η Ελληνική Επανάσταση του 1821 στο πλαίσιο της ανάδυσης των εθνικών ιδεών και του φιλελευθερισμού στην Ευρώπη",
        "Κεφάλαιο 3 — Οικονομικές, κοινωνικές και πολιτικές εξελίξεις στην Ευρώπη και στον κόσμο τον 19ο αιώνα",
        "Κεφάλαιο 4 — Το ελληνικό κράτος από την ίδρυσή του έως τις αρχές του 20ού αιώνα",
        "Κεφάλαιο 5 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 19ο αιώνα",
        "Κεφάλαιο 6 — Η Ελλάδα από το κίνημα στο Γουδί (1909) έως το τέλος των Βαλκανικών Πολέμων (1913)",
        "Κεφάλαιο 7 — Ο Α΄ Παγκόσμιος Πόλεμος και η Ρωσική Επανάσταση (1914-1918)",
        "Κεφάλαιο 8 — Ο Μικρασιατικός Πόλεμος (1919-1922)",
        "Κεφάλαιο 9 — Η εποχή του Μεσοπολέμου (1919-1939)",
        "Κεφάλαιο 10 — Ο Β΄ Παγκόσμιος Πόλεμος και η Ελλάδα",
        "Κεφάλαιο 11 — Διεθνείς εξελίξεις από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα",
        "Κεφάλαιο 12 — Η Ελλάδα από το τέλος του Β΄ Παγκοσμίου Πολέμου έως τα τέλη του 20ού αιώνα",
        "Κεφάλαιο 13 — Οι προσπάθειες ενοποίησης της Ευρώπης και η Ελλάδα",
        "Κεφάλαιο 14 — Επιστήμες, πνευματική και καλλιτεχνική δημιουργία κατά τον 20ό αιώνα"
      ]
    },
    "english-g-gymnasiou":{
      sourceUrl:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSGYM-C109/499/3246%2C21317/",
      sections:[
        "Unit 1 — A Wonderful World",
        "Unit 2 — Teen idols",
        "Unit 3 — Thrills and Spills!",
        "Unit 4 — Click on-Line!",
        "Unit 5 — The myths we live by",
        "Unit 6 — Keeping traditions and customs alive",
        "Unit 7 — Shades of Meaning!",
        "Unit 8 — Food for thought",
        "Unit 9 — What's the weather like?",
        "Unit 10 — Natural phenomena"
      ]
    }
  };
  window.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027=Object.freeze({
    version:"1.3.0",
    schoolYear:"2026-2027",
    get(id){ const row=rows[id]; return row?{sourceUrl:row.sourceUrl,sections:[...row.sections]}:null; },
    ids:Object.freeze(Object.keys(rows))
  });
})();