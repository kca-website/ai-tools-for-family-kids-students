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
    version:"1.0.0",
    schoolYear:"2026-2027",
    get(id){ const row=rows[id]; return row?{sourceUrl:row.sourceUrl,sections:[...row.sections]}:null; },
    ids:Object.freeze(Object.keys(rows))
  });
})();