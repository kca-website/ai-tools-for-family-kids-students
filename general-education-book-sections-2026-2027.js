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
    version:"1.1.0",
    schoolYear:"2026-2027",
    get(id){ const row=rows[id]; return row?{sourceUrl:row.sourceUrl,sections:[...row.sections]}:null; },
    ids:Object.freeze(Object.keys(rows))
  });
})();