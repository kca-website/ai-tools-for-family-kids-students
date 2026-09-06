/**
 * EN.E.E.GY.-L. official 2026-2027 school structure.
 *
 * IMPORTANT: school structure and mapped learning coverage are different things.
 * The school always exposes 8 grades (4 Gymnasium + 4 Lyceum). Detailed learning
 * units are added only where separately verified data exists.
 *
 * Current timetable basis:
 * - Gymnasium: YA 45396/D3/14-04-2026, FEK B 2259/22-04-2026
 * - Lyceum: YA 44451/D3/08-04-2026, FEK B 2149/16-04-2026
 */
(function(){
  "use strict";

  const GYM_SOURCE="https://diavgeia.gov.gr/decision/view/6%CE%9C%CE%99%CE%A646%CE%9D%CE%9A%CE%A0%CE%94-%CE%9F%CE%935";
  const LYC_SOURCE="https://diavgeia.gov.gr/decision/view/%CE%A877%CE%9A46%CE%9D%CE%9A%CE%A0%CE%94-9%CE%95%CE%9B";
  const INSTRUCTIONS="https://www.minedu.gov.gr/site/70752-03-09-26-enkyklioi-me-ten-yle-odegies-mathematon-eneegy-l";

  const gymBase={
    language:{label:"Νεοελληνική Γλώσσα και Γραμματεία"},
    literature:{label:"Νεοελληνική Λογοτεχνία"},
    ancientTranslated:{label:"Αρχαία Ελληνικά Κείμενα από Μετάφραση"},
    math:{label:"Μαθηματικά"},
    physics:{label:"Φυσική"},
    chemistry:{label:"Χημεία"},
    biology:{label:"Βιολογία"},
    geography:{label:"Γεωλογία - Γεωγραφία"},
    history:{label:"Ιστορία"},
    religion:{label:"Θρησκευτικά / Ηθική"},
    english:{label:"Αγγλικά"},
    technology:{label:"Τεχνολογία"},
    informatics:{label:"Πληροφορική"},
    homeEconomics:{label:"Οικιακή Οικονομία"},
    civics:{label:"Κοινωνική και Πολιτική Αγωγή"},
    economics:{label:"Οικονομικά"},
    pe:{label:"Φυσική Αγωγή"},
    musicTheatre:{label:"Μουσική / Θεατρική Αγωγή"},
    arts:{label:"Καλλιτεχνικά"},
    career:{label:"Σχολικός Επαγγελματικός Προσανατολισμός"},
    creativeZone:{label:"Ζώνη Δημιουργικών Δραστηριοτήτων"},
    skills:{label:"Εργαστήρια Δεξιοτήτων"}
  };
  const g=(id)=>({id,label:gymBase[id].label});

  const lycGeneralA=[
    ["new-greek","Νέα Ελληνικά"],
    ["math","Μαθηματικά (Άλγεβρα + Γεωμετρία)"],
    ["natural-sciences","Φυσικές Επιστήμες (Φυσική + Χημεία + Βιολογία)"],
    ["civics","Πολιτική Παιδεία"],
    ["history","Ιστορία"],
    ["religion","Θρησκευτικά / Ηθική"],
    ["english","Αγγλικά"],
    ["pe","Φυσική Αγωγή"],
    ["informatics","Πληροφορική"]
  ];
  const lycOrientationA=[
    ["research-technology","Ερευνητική Εργασία στην Τεχνολογία"],
    ["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"]
  ];
  const lycElectivesA=[
    ["health","Αγωγή Υγείας"],
    ["architectural-drawing","Αρχές Γραμμικού και Αρχιτεκτονικού Σχεδίου"],
    ["electrical-electronics","Αρχές Ηλεκτρολογίας και Ηλεκτρονικής"],
    ["mechanics","Αρχές Μηχανολογίας"],
    ["economics","Αρχές Οικονομίας"],
    ["composition","Βασικές Αρχές Σύνθεσης"],
    ["agriculture-sustainability","Γεωπονία και Αειφόρος Ανάπτυξη"]
  ];

  const sectors=[
    ["agriculture","Γεωπονίας, Τροφίμων και Περιβάλλοντος"],
    ["administration-economy","Διοίκησης και Οικονομίας"],
    ["structures","Δομικών Έργων, Δομημένου Περιβάλλοντος και Αρχιτεκτονικού Σχεδιασμού"],
    ["applied-arts","Εφαρμοσμένων Τεχνών"],
    ["electrical","Ηλεκτρολογίας, Ηλεκτρονικής και Αυτοματισμού"],
    ["mechanical","Μηχανολογίας"],
    ["informatics","Πληροφορικής"],
    ["health","Υγείας - Πρόνοιας - Ευεξίας"]
  ];

  const generalBC=[
    ["new-greek","Νέα Ελληνικά"],
    ["math","Μαθηματικά (Άλγεβρα + Γεωμετρία)"],
    ["natural-sciences","Φυσικές Επιστήμες (Φυσική + Χημεία)"],
    ["english","Αγγλικά"],
    ["pe","Φυσική Αγωγή"],
    ["computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ"],
    ["creative-zone","Ζώνη Δημιουργικών Δραστηριοτήτων"]
  ];
  const generalD=[
    ["new-greek","Νέα Ελληνικά"],
    ["math","Μαθηματικά (Άλγεβρα + Γεωμετρία)"],
    ["physics","Φυσική"],
    ["english","Αγγλικά"],
    ["computer-science","Εισαγωγή στις Αρχές της Επιστήμης των Η/Υ"]
  ];

  function rows(list,type="general"){
    return list.map(([id,label])=>({id,label,type}));
  }
  function sectorRows(prefix,labelPrefix){
    return sectors.map(([id,label])=>({
      id:`${prefix}-${id}`,
      label:`${labelPrefix}: ${label}`,
      type:"sector-gateway",
      sector:label,
      requiresExactLesson:true
    }));
  }

  const STRUCTURE={
    version:1,
    schoolYear:"2026-2027",
    verificationDate:"2026-09-06",
    schoolType:"eneegyl",
    label:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",
    totalGrades:8,
    structureNote:"4 τάξεις Γυμνασίου + 4 τάξεις Λυκείου. Η εμφάνιση μιας τάξης ή μαθήματος δεν σημαίνει ότι έχει ήδη χαρτογραφηθεί πλήρης ύλη στο site.",
    sourceUrls:{gymnasium:GYM_SOURCE,lyceum:LYC_SOURCE,annualInstructions:INSTRUCTIONS},
    gradeOrder:["gym-a","gym-b","gym-c","gym-d","lyc-a","lyc-b","lyc-c","lyc-d"],
    grades:{
      "gym-a":{id:"gym-a",level:"gymnasium",letter:"A",label:"Α΄ Γυμνασίου",sourceUrl:GYM_SOURCE,subjects:[
        g("language"),g("literature"),g("ancientTranslated"),g("math"),g("physics"),g("biology"),g("geography"),g("history"),g("religion"),g("english"),g("technology"),g("informatics"),g("homeEconomics"),g("pe"),g("musicTheatre"),g("arts"),g("career"),g("creativeZone"),g("skills")
      ]},
      "gym-b":{id:"gym-b",level:"gymnasium",letter:"B",label:"Β΄ Γυμνασίου",sourceUrl:GYM_SOURCE,subjects:[
        g("language"),g("literature"),g("ancientTranslated"),g("math"),g("physics"),g("chemistry"),g("biology"),g("geography"),g("history"),g("religion"),g("english"),g("technology"),g("informatics"),g("pe"),g("musicTheatre"),g("arts"),g("career"),g("creativeZone"),g("skills")
      ]},
      "gym-c":{id:"gym-c",level:"gymnasium",letter:"C",label:"Γ΄ Γυμνασίου",sourceUrl:GYM_SOURCE,subjects:[
        g("language"),g("literature"),g("ancientTranslated"),g("math"),g("physics"),g("geography"),g("history"),g("religion"),g("english"),g("technology"),g("informatics"),g("civics"),g("pe"),g("musicTheatre"),g("arts"),g("career"),g("creativeZone"),g("skills")
      ]},
      "gym-d":{id:"gym-d",level:"gymnasium",letter:"D",label:"Δ΄ Γυμνασίου",sourceUrl:GYM_SOURCE,subjects:[
        g("language"),g("literature"),g("ancientTranslated"),g("math"),g("physics"),g("chemistry"),g("biology"),g("history"),g("religion"),g("english"),g("technology"),g("informatics"),g("civics"),g("economics"),g("pe"),g("musicTheatre"),g("arts"),g("career"),g("creativeZone"),g("skills")
      ]},
      "lyc-a":{id:"lyc-a",level:"lyceum",letter:"A",label:"Α΄ Λυκείου",sourceUrl:LYC_SOURCE,subjects:[
        ...rows(lycGeneralA,"general"),...rows(lycOrientationA,"orientation"),...rows(lycElectivesA,"elective")
      ],note:"Τα 7 μαθήματα επιλογής προσφέρονται ανάλογα με τους τομείς που λειτουργούν στη σχολική μονάδα. Οι μαθητές/τριες επιλέγουν τρία σύμφωνα με το ισχύον ωρολόγιο πρόγραμμα."},
      "lyc-b":{id:"lyc-b",level:"lyceum",letter:"B",label:"Β΄ Λυκείου",sourceUrl:LYC_SOURCE,subjects:[
        ...rows([...generalBC,["work-safety","ΣΕΠ - Ασφάλεια και Υγεία στο χώρο Εργασίας"]],"general"),...sectorRows("b-sector","Τομέας")
      ],note:"Τα τεχνολογικά-επαγγελματικά μαθήματα εξαρτώνται από τον τομέα της σχολικής μονάδας."},
      "lyc-c":{id:"lyc-c",level:"lyceum",letter:"C",label:"Γ΄ Λυκείου",sourceUrl:LYC_SOURCE,subjects:[
        ...rows(generalBC,"general"),...sectorRows("c-sector","Τομέας")
      ],note:"Τα τεχνολογικά-επαγγελματικά μαθήματα εξαρτώνται από τον τομέα της σχολικής μονάδας."},
      "lyc-d":{id:"lyc-d",level:"lyceum",letter:"D",label:"Δ΄ Λυκείου",sourceUrl:LYC_SOURCE,subjects:[
        ...rows(generalD,"general"),...sectorRows("d-specialty","Μαθήματα ειδικότητας - τομέας")
      ],note:"Στη Δ΄ Λυκείου τα επαγγελματικά μαθήματα εξαρτώνται από την ειδικότητα. Η AI Βοήθεια ζητά το ακριβές μάθημα/κεφάλαιο όταν δεν υπάρχει ακόμη αναλυτική χαρτογράφηση."
      }
    }
  };

  window.ENEEGYL_2026_2027_STRUCTURE=Object.freeze(STRUCTURE);
})();