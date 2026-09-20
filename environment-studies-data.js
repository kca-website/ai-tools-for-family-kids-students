/**
 * environment-studies-data.js
 * Canonical Environment Studies diagnostics for Primary A-D.
 * Extracted from the former runtime integrity override on 2026-09-20.
 * Keeps the same GAP_TAGS, QUIZZES, LEARNING_PATHS and official-curriculum
 * alignment behavior while isolating the subject domain from generic patches.
 */
(function () {
  "use strict";

  const TODAY = "2026-09-20";
  function unique(arr) { return [...new Set((arr || []).filter(Boolean))]; }

// ---------- Environment Studies diagnostics (A-D Primary) ----------
  function gap(id, labelEl, labelEn, explainEl, explainEn) {
    GAP_TAGS[id] = {
      id, labelEl, labelEn, explainEl, explainEn,
      recommendedToolIds: ["ai-help","phet","google-arts-culture"],
      achievementEl:"Εξερευνητής του Περιβάλλοντος", achievementEn:"Environment Explorer",
      positiveMessageEl:"Παρατηρείς, συγκρίνεις και εξηγείς τον κόσμο γύρω σου!", positiveMessageEn:"You observe, compare and explain the world around you!",
      skillTagEl:"Μελέτη Περιβάλλοντος", skillTagEn:"Environment Studies"
    };
  }
  const envGaps = [
    ["env-a.living-nonliving","Ζωντανό ή μη ζωντανό","Living or non-living","Μπερδεύει τα ζωντανά όντα με αντικείμενα που απλώς κινούνται ή αλλάζουν θέση.","Confuses living things with objects that merely move or change position."],
    ["env-a.basic-needs","Βασικές ανάγκες ζωντανών οργανισμών","Basic needs of living things","Δεν συνδέει νερό, αέρα, τροφή/φως και κατάλληλο χώρο με τις ανάγκες των ζωντανών οργανισμών.","Does not connect water, air, food/light and suitable space with living things' needs."],
    ["env-a.seasons","Εποχές και καιρός","Seasons and weather","Μπερδεύει την εποχή με τον καθημερινό καιρό και δυσκολεύεται να συνδέσει αλλαγές στο περιβάλλον με τις εποχές.","Confuses seasons with day-to-day weather and struggles to connect environmental changes to seasons."],
    ["env-a.rules","Κανόνες στο σχολείο και στην ομάδα","Rules at school and in groups","Βλέπει τους κανόνες μόνο ως απαγορεύσεις και όχι ως τρόπο ασφάλειας, δικαιοσύνης και συνεργασίας.","Sees rules only as restrictions rather than a way to support safety, fairness and cooperation."],
    ["env-a.senses","Παρατήρηση με τις αισθήσεις","Observing with the senses","Δυσκολεύεται να επιλέξει ποια αίσθηση δίνει χρήσιμη πληροφορία σε μια απλή παρατήρηση.","Struggles to choose which sense provides useful information in a simple observation."],

    ["env-b.natural-humanmade","Φυσικό και ανθρωπογενές περιβάλλον","Natural and human-made environment","Μπερδεύει στοιχεία της φύσης με κατασκευές ή αλλαγές που έχει κάνει ο άνθρωπος.","Confuses natural features with things built or changed by people."],
    ["env-b.plant-needs","Τι χρειάζεται ένα φυτό","What a plant needs","Πιστεύει ότι ένα φυτό αναπτύσσεται χωρίς νερό/φως ή ότι αυτά δεν επηρεάζουν την ανάπτυξή του.","Believes a plant can grow without water/light or that these do not affect growth."],
    ["env-b.habitats","Ζώα και τόπος ζωής","Animals and habitats","Δεν συνδέει τα χαρακτηριστικά ενός ζώου με τις συνθήκες του τόπου όπου ζει.","Does not connect an animal's characteristics with the conditions of its habitat."],
    ["env-b.waste","Απορρίμματα και επαναχρησιμοποίηση","Waste and reuse","Μπερδεύει την επαναχρησιμοποίηση/ανακύκλωση με το απλό πέταγμα ενός αντικειμένου.","Confuses reuse/recycling with simply throwing an item away."],
    ["env-b.community","Υπηρεσίες της κοινότητας","Community services","Δυσκολεύεται να συνδέσει βασικές υπηρεσίες και επαγγέλματα με τις ανάγκες της κοινότητας.","Struggles to connect basic services and jobs with community needs."],

    ["env-c.cooperation","Συνεργασία και κανόνες","Cooperation and rules","Δεν κατανοεί πώς οι κανόνες και οι κοινές αποφάσεις βοηθούν μια ομάδα ή κοινότητα να λειτουργεί.","Does not understand how rules and shared decisions help a group or community function."],
    ["env-c.place","Φυσικά χαρακτηριστικά και ανθρώπινα έργα","Natural features and human works","Μπερδεύει βουνά, ποτάμια και άλλα φυσικά χαρακτηριστικά με δρόμους, γέφυρες και κτίρια.","Confuses mountains, rivers and other natural features with roads, bridges and buildings."],
    ["env-c.energy","Τροφή και ενέργεια","Food and energy","Δεν συνδέει την τροφή με την ενέργεια που χρειάζεται το σώμα για δραστηριότητες και ανάπτυξη.","Does not connect food with the energy the body needs for activity and growth."],
    ["env-c.environment-care","Φροντίδα του περιβάλλοντος","Caring for the environment","Δυσκολεύεται να ξεχωρίσει μια πράξη που μειώνει περιβαλλοντική επιβάρυνση από μια πράξη που την αυξάνει.","Struggles to distinguish actions that reduce environmental impact from those that increase it."],
    ["env-c.orientation","Χάρτης και προσανατολισμός","Maps and orientation","Δυσκολεύεται να χρησιμοποιήσει απλά σύμβολα/κατευθύνσεις για να βρει ή να περιγράψει μια θέση.","Struggles to use simple symbols/directions to locate or describe a position."],

    ["env-d.ecosystems","Οικοσύστημα","Ecosystem","Βλέπει φυτά, ζώα και μη ζωντανά στοιχεία χωριστά και δεν κατανοεί ότι αλληλεπιδρούν μέσα σε ένα οικοσύστημα.","Sees plants, animals and non-living elements separately and does not understand their interactions in an ecosystem."],
    ["env-d.food-relations","Σχέσεις τροφής στο οικοσύστημα","Feeding relationships","Δυσκολεύεται να συνδέσει οργανισμούς μέσα από απλές σχέσεις τροφής και εξάρτησης.","Struggles to connect organisms through simple feeding and dependency relationships."],
    ["env-d.landforms","Φυσικά χαρακτηριστικά του τόπου","Natural features of a place","Μπερδεύει βασικά φυσικά χαρακτηριστικά του τόπου και τον τρόπο που επηρεάζουν ανθρώπινες δραστηριότητες.","Confuses basic natural features of a place and how they affect human activities."],
    ["env-d.resources","Φυσικοί πόροι και υπεύθυνη χρήση","Natural resources and responsible use","Δεν διακρίνει εύκολα πότε ένας φυσικός πόρος χρησιμοποιείται υπεύθυνα ή σπαταλιέται.","Does not easily distinguish responsible resource use from waste."],
    ["env-d.projects","Έργα και ανάγκες της κοινότητας","Projects and community needs","Δυσκολεύεται να συνδέσει ένα δημόσιο έργο με την ανάγκη, τον σχεδιασμό, τα υλικά και τους ανθρώπους που απαιτούνται.","Struggles to connect a public project with the need, planning, materials and people required."],
  ];
  envGaps.forEach((x) => gap(...x));

  function opt(textEl,textEn,isCorrect,gapTag){ const o={textEl,textEn,isCorrect}; if(!isCorrect) o.gapTag=gapTag; return o; }
  function q(id,textEl,textEn,correctEl,correctEn,wrong1El,wrong1En,wrong2El,wrong2En,gapTag){ return {id,textEl,textEn,options:[opt(correctEl,correctEn,true),opt(wrong1El,wrong1En,false,gapTag),opt(wrong2El,wrong2En,false,gapTag)]}; }
  const envQuizzes = {
    "environment-a-dimotikou": { id:"environment-a-dimotikou", grades:["a"], subjectLabelEl:"Μελέτη Περιβάλλοντος, Α' Δημοτικού", subjectLabelEn:"Environment Studies, 1st Grade", titleEl:"Ο Χάρτης Εξάσκησης", titleEn:"The Practice Map", introEl:"5 σύντομες ερωτήσεις. Δεν είναι διαγώνισμα, δεν έχει βαθμό.", introEn:"5 short questions. It's not a graded test.", questions:[
      q("env-a-1","Ποιο από αυτά είναι ζωντανό;","Which of these is living?","Ένα δέντρο","A tree","Μια πέτρα","A stone","Ένα ποδήλατο","A bicycle","env-a.living-nonliving"),
      q("env-a-2","Τι χρειάζεται περισσότερο ένα φυτό για να μεγαλώσει;","What does a plant need most to grow?","Νερό και φως","Water and light","Παιχνίδια","Toys","Μόνο σκοτάδι","Only darkness","env-a.basic-needs"),
      q("env-a-3","Χιονίζει σήμερα. Αυτό μας λέει σίγουρα ποια εποχή είναι;","It is snowing today. Does that alone always tell us the season?","Όχι, ο καιρός μιας μέρας δεν είναι το ίδιο με την εποχή.","No. One day's weather is not the same as a season.","Ναι, πάντα είναι χειμώνας.","Yes, it is always winter.","Ναι, η εποχή αλλάζει κάθε μέρα.","Yes, the season changes every day.","env-a.seasons"),
      q("env-a-4","Γιατί έχουμε κανόνα να περιμένουμε τη σειρά μας;","Why do we have a rule to wait our turn?","Για να μπορούμε να συνεργαζόμαστε δίκαια.","So we can cooperate fairly.","Για να μη μιλάει ποτέ κανείς.","So nobody ever talks.","Επειδή οι κανόνες δεν έχουν λόγο.","Rules have no reason.","env-a.rules"),
      q("env-a-5","Ποια αίσθηση σε βοηθά να καταλάβεις αν ένα κουδούνι χτυπά;","Which sense helps you know if a bell is ringing?","Η ακοή","Hearing","Η γεύση","Taste","Η όσφρηση","Smell","env-a.senses"),
    ]},
    "environment-b-dimotikou": { id:"environment-b-dimotikou", grades:["b"], subjectLabelEl:"Μελέτη Περιβάλλοντος, Β' Δημοτικού", subjectLabelEn:"Environment Studies, 2nd Grade", titleEl:"Ο Χάρτης Εξάσκησης", titleEn:"The Practice Map", introEl:"5 σύντομες ερωτήσεις. Δεν είναι διαγώνισμα, δεν έχει βαθμό.", introEn:"5 short questions. It's not a graded test.", questions:[
      q("env-b-1","Ποιο είναι ανθρώπινο έργο;","Which is made by people?","Μια γέφυρα","A bridge","Ένα ποτάμι","A river","Ένα βουνό","A mountain","env-b.natural-humanmade"),
      q("env-b-2","Δύο ίδια φυτά έχουν ίδιο χώμα. Το ένα έχει νερό και φως, το άλλο μένει χωρίς νερό. Ποιο περιμένεις να αναπτυχθεί καλύτερα;","Two identical plants have the same soil. One gets water and light, the other gets no water. Which should grow better?","Αυτό με νερό και φως","The one with water and light","Αυτό χωρίς νερό","The one without water","Κανένα, το νερό δεν παίζει ρόλο","Neither; water makes no difference","env-b.plant-needs"),
      q("env-b-3","Γιατί μια πολική αρκούδα δυσκολεύεται να ζήσει σε μια πολύ ζεστή έρημο;","Why would a polar bear struggle in a very hot desert?","Το σώμα και οι ανάγκες της ταιριάζουν σε ψυχρό περιβάλλον.","Its body and needs are suited to a cold environment.","Επειδή όλα τα ζώα ζουν μόνο στο χιόνι.","Because all animals live only in snow.","Δεν έχει καμία σημασία ο τόπος ζωής.","Habitat does not matter.","env-b.habitats"),
      q("env-b-4","Ένα γυάλινο βάζο μπορεί να χρησιμοποιηθεί ξανά για αποθήκευση. Αυτό είναι...","A glass jar can be used again for storage. This is...","Επαναχρησιμοποίηση","Reuse","Απλό πέταγμα","Just throwing it away","Σπατάλη νερού","Wasting water","env-b.waste"),
      q("env-b-5","Ποια υπηρεσία βοηθά όταν υπάρχει φωτιά;","Which service helps when there is a fire?","Η Πυροσβεστική","The fire service","Η βιβλιοθήκη","The library","Το ταχυδρομείο","The post office","env-b.community"),
    ]},
    "environment-c-dimotikou": { id:"environment-c-dimotikou", grades:["c"], subjectLabelEl:"Μελέτη Περιβάλλοντος, Γ' Δημοτικού", subjectLabelEn:"Environment Studies, 3rd Grade", titleEl:"Ο Χάρτης Εξάσκησης", titleEn:"The Practice Map", introEl:"5 σύντομες ερωτήσεις. Δεν είναι διαγώνισμα, δεν έχει βαθμό.", introEn:"5 short questions. It's not a graded test.", questions:[
      q("env-c-1","Μια ομάδα θέλει να αποφασίσει πού θα πάει εκδρομή. Ποια διαδικασία βοηθά περισσότερο;","A group wants to decide where to go on a trip. What helps most?","Να ακούσουν προτάσεις και να συμφωνήσουν σε έναν κοινό τρόπο απόφασης.","Hear proposals and agree on a shared way to decide.","Να αποφασίσει κρυφά ένα άτομο για όλους.","One person secretly decides for everyone.","Να μην υπάρχει κανένας κανόνας.","Have no rules at all.","env-c.cooperation"),
      q("env-c-2","Ποιο ζευγάρι έχει πρώτα φυσικό χαρακτηριστικό και μετά ανθρώπινο έργο;","Which pair has a natural feature first and a human-made work second?","Ποτάμι: γέφυρα","River: bridge","Γέφυρα: ποτάμι","Bridge: river","Δρόμος: κτίριο","Road: building","env-c.place"),
      q("env-c-3","Γιατί χρειαζόμαστε τροφή;","Why do we need food?","Μας δίνει υλικά και ενέργεια για να λειτουργεί και να αναπτύσσεται το σώμα.","It provides materials and energy for the body to function and grow.","Μόνο για να περνά η ώρα.","Only to pass the time.","Δεν σχετίζεται καθόλου με το σώμα.","It has nothing to do with the body.","env-c.energy"),
      q("env-c-4","Ποια πράξη βοηθά περισσότερο το περιβάλλον;","Which action helps the environment most?","Χρησιμοποιώ ξανά μια τσάντα αντί να παίρνω καινούρια κάθε φορά.","Reuse a bag instead of taking a new one each time.","Αφήνω τη βρύση να τρέχει χωρίς λόγο.","Leave the tap running for no reason.","Πετάω σκουπίδια στο πάρκο.","Drop litter in the park.","env-c.environment-care"),
      q("env-c-5","Σε έναν απλό χάρτη, τι μας βοηθούν να καταλάβουμε τα σύμβολα και το υπόμνημα;","On a simple map, what do symbols and the legend help us understand?","Τι παριστάνουν τα σημάδια του χάρτη.","What the map symbols represent.","Τι ώρα είναι.","What time it is.","Πόσο ζυγίζει ένα αντικείμενο.","How much an object weighs.","env-c.orientation"),
    ]},
    "environment-d-dimotikou": { id:"environment-d-dimotikou", grades:["d"], subjectLabelEl:"Μελέτη Περιβάλλοντος, Δ' Δημοτικού", subjectLabelEn:"Environment Studies, 4th Grade", titleEl:"Ο Χάρτης Εξάσκησης", titleEn:"The Practice Map", introEl:"5 σύντομες ερωτήσεις. Δεν είναι διαγώνισμα, δεν έχει βαθμό.", introEn:"5 short questions. It's not a graded test.", questions:[
      q("env-d-1","Σε ένα οικοσύστημα, ποια πρόταση είναι πιο σωστή;","In an ecosystem, which statement is most accurate?","Ζωντανά και μη ζωντανά στοιχεία αλληλεπιδρούν μεταξύ τους.","Living and non-living elements interact.","Τα φυτά και τα ζώα δεν επηρεάζονται ποτέ από το νερό ή το έδαφος.","Plants and animals are never affected by water or soil.","Κάθε οργανισμός ζει εντελώς ανεξάρτητα.","Every organism lives completely independently.","env-d.ecosystems"),
      q("env-d-2","Αν μειωθεί πολύ η τροφή ενός ζώου σε ένα οικοσύστημα, τι μπορεί να συμβεί;","If an animal's food decreases greatly in an ecosystem, what may happen?","Ο πληθυσμός του μπορεί να μειωθεί ή να μετακινηθεί.","Its population may decrease or move.","Δεν αλλάζει ποτέ τίποτα.","Nothing ever changes.","Όλα τα ζώα γίνονται φυτά.","All animals become plants.","env-d.food-relations"),
      q("env-d-3","Ποιο είναι φυσικό χαρακτηριστικό ενός τόπου;","Which is a natural feature of a place?","Μια οροσειρά","A mountain range","Ένας αυτοκινητόδρομος","A motorway","Ένα εργοστάσιο","A factory","env-d.landforms"),
      q("env-d-4","Ποια επιλογή δείχνει πιο υπεύθυνη χρήση φυσικού πόρου;","Which option shows more responsible use of a natural resource?","Κλείνω τη βρύση όταν δεν χρειάζομαι νερό.","Turn off the tap when I do not need water.","Αφήνω όλα τα φώτα αναμμένα χωρίς λόγο.","Leave all lights on for no reason.","Πετάω καθαρό χαρτί χωρίς να το χρησιμοποιήσω.","Throw away clean paper without using it.","env-d.resources"),
      q("env-d-5","Πριν κατασκευαστεί ένα μεγάλο έργο στην κοινότητα, τι χρειάζεται πρώτα;","Before a large community project is built, what is needed first?","Να εντοπιστεί η ανάγκη και να γίνει σχεδιασμός.","Identify the need and plan the project.","Να ξεκινήσει χωρίς σχέδιο ή υλικά.","Start without a plan or materials.","Να αποφασίσει τυχαία ένας περαστικός.","A passer-by decides at random.","env-d.projects"),
    ]},
  };
  Object.assign(QUIZZES.primary, envQuizzes);

  // Add learning paths for new gaps and safely normalize ALL Primary paths.
  function makeEnvPath(g) {
    const labelEl=g.labelEl, labelEn=g.labelEn;
    return [
      { titleEl:"Παρατήρησε πρώτα μόνος/η", titleEn:"Observe first on your own", descriptionEl:`Σκέψου ένα παράδειγμα από την καθημερινότητα για «${labelEl}» και γράψε/πες τι πιστεύεις ότι συμβαίνει και γιατί.`, descriptionEn:`Think of an everyday example of “${labelEn}” and explain what you think happens and why.`, toolId:null },
      { titleEl:"Δες το με ασφαλή βοήθεια", titleEn:"Explore it with safe support", descriptionEl:`Χρησιμοποίησε μια σχετική προσομοίωση PhET ή υλικό Google Arts & Culture όπου ταιριάζει. Αν χρειάζεσαι εξήγηση, ζήτησε από γονέα/εκπαιδευτικό να ανοίξει μαζί σου την AI Βοήθεια και να σου κάνει μία ερώτηση τη φορά.`, descriptionEn:`Use a relevant PhET simulation or Google Arts & Culture resource where appropriate. If you need an explanation, ask a parent/teacher to open AI Help with you and use one question at a time.`, toolId:"ai-help" },
      { titleEl:"Δείξε ότι το κατάλαβες", titleEn:"Show that you understood", descriptionEl:`Εξήγησε με δικά σου λόγια το «${labelEl}» χρησιμοποιώντας ένα καινούριο παράδειγμα. Αν μπορείς να αιτιολογήσεις το “γιατί”, έχεις κάνει το πιο σημαντικό βήμα.`, descriptionEn:`Explain “${labelEn}” in your own words using a new example. If you can explain why, you have made the key step.`, toolId:null },
    ];
  }
  envGaps.forEach(([id]) => { LEARNING_PATHS[id] = makeEnvPath(GAP_TAGS[id]); });

  const primaryGapSubject = {};
  Object.values(QUIZZES.primary || {}).forEach((quiz) => {
    let subject = "general";
    const s = `${quiz.id} ${quiz.subjectLabelEl || ""}`.toLowerCase();
    if (/ιστορ|history|myth/.test(s)) subject="history";
    else if (/φυσικ|science|βιολογ|biology|χημ|chem|environment|περιβάλλον/.test(s)) subject="science";
    else if (/μαθη|math/.test(s)) subject="math";
    else if (/αγγλ|english|foreign/.test(s)) subject="foreign-language";
    else if (/γλώσσ|language|λογοτεχν|literature/.test(s)) subject="language";
    (quiz.questions || []).forEach((qq) => (qq.options || []).forEach((oo) => { if (oo.gapTag) primaryGapSubject[oo.gapTag] = subject; }));
  });

  const adultOnlyIds = new Set(["chatgpt","claude","perplexity","gemini","notebooklm","wolfram-alpha","copilot"]);
  function safeStepFor(id, subject, gapObj) {
    const labelEl = gapObj?.labelEl || id, labelEn = gapObj?.labelEn || id;
    if (subject === "history") return { titleEl:"Εξερεύνησε την Ιστορία και μετά ρώτα", titleEn:"Explore history, then ask", descriptionEl:`Δες ένα σχετικό αντικείμενο, τόπο ή ιστορικό θέμα στο Google Arts & Culture και σύγκρινέ το με το σχολικό βιβλίο. Αν κάτι δεν καταλαβαίνεις, ζήτησε από γονέα/εκπαιδευτικό να ανοίξει μαζί σου την AI Βοήθεια για «${labelEl}».`, descriptionEn:`Explore a related object, place or history topic in Google Arts & Culture and compare it with the textbook. If something is unclear, ask a parent/teacher to open AI Help with you for “${labelEn}”.`, toolId:"google-arts-culture" };
    if (subject === "science") return { titleEl:"Πειραματίσου και μετά εξήγησε", titleEn:"Experiment, then explain", descriptionEl:`Βρες σχετική προσομοίωση στο PhET (όπου υπάρχει), κάνε πρώτα μια πρόβλεψη και μετά δοκίμασέ την. Για το «${labelEl}», αν χρειάζεσαι καθοδήγηση, άνοιξε την AI Βοήθεια μαζί με γονέα/εκπαιδευτικό.`, descriptionEn:`Find a relevant PhET simulation where available, make a prediction first, then test it. For “${labelEn}”, use AI Help with a parent/teacher if you need guidance.`, toolId:"phet" };
    if (subject === "foreign-language") return { titleEl:"Κάνε μικρή εξάσκηση", titleEn:"Do a short practice", descriptionEl:`Κάνε 5 λεπτά εξάσκηση πάνω στο «${labelEl}» και προσπάθησε να εξηγήσεις μόνος/η ποιο λάθος διορθώνεις. Αν κολλήσεις, χρησιμοποίησε την AI Βοήθεια με γονέα/εκπαιδευτικό.`, descriptionEn:`Do five minutes of practice on “${labelEn}” and explain which mistake you are correcting. If stuck, use AI Help with a parent/teacher.`, toolId:"duolingo" };
    return { titleEl:"Ζήτησε καθοδήγηση, όχι λύση", titleEn:"Ask for guidance, not the answer", descriptionEl:`Άνοιξε την AI Βοήθεια μαζί με γονέα/εκπαιδευτικό για «${labelEl}». Πες πρώτα τι προσπάθησες και ζήτησε μία μόνο υπόδειξη ή ερώτηση κάθε φορά.`, descriptionEn:`Open AI Help with a parent/teacher for “${labelEn}”. First say what you tried and ask for one hint or question at a time.`, toolId:"ai-help" };
  }
  Object.keys(primaryGapSubject).forEach((id) => {
    const g = GAP_TAGS[id];
    if (!g) return;
    const subject = primaryGapSubject[id];
    const preferred = subject === "history" ? ["google-arts-culture","ai-help","perplexity"] : subject === "science" ? ["phet","google-arts-culture","ai-help","perplexity"] : subject === "language" ? ["reading-coach","ai-help"] : subject === "foreign-language" ? ["duolingo","ai-help"] : ["ai-help","photomath"];
    g.recommendedToolIds = unique([...preferred, ...(g.recommendedToolIds || [])]);

    const path = LEARNING_PATHS[id];
    if (!Array.isArray(path) || path.length < 2) return;
    // Step 2 is always normalized to a safe/explicit route for Primary.
    path[1] = safeStepFor(id, subject, g);
    // Any adult-only tool that survives in another step is replaced with a proof-of-learning step.
    path.forEach((step, idx) => {
      if (!step || !adultOnlyIds.has(step.toolId)) return;
      step.titleEl = idx === 2 ? "Δείξε ότι το κατάλαβες" : "Ζήτησε καθοδήγηση, όχι λύση";
      step.titleEn = idx === 2 ? "Show that you understood" : "Ask for guidance, not the answer";
      step.descriptionEl = idx === 2
        ? `Εξήγησε το «${g.labelEl}» με δικά σου λόγια ή λύσε ένα νέο παράδειγμα χωρίς βοήθεια. Αν θέλεις έλεγχο, χρησιμοποίησε την AI Βοήθεια μαζί με γονέα/εκπαιδευτικό.`
        : `Χρησιμοποίησε την AI Βοήθεια μαζί με γονέα/εκπαιδευτικό. Πες πρώτα τη δική σου προσπάθεια και ζήτησε μία υπόδειξη τη φορά.`;
      step.descriptionEn = idx === 2
        ? `Explain “${g.labelEn}” in your own words or solve a new example without help. For a check, use AI Help with a parent/teacher.`
        : `Use AI Help with a parent/teacher. Show your own attempt first and ask for one hint at a time.`;
      step.toolId = "ai-help";
    });
  });

  // AI Help appears as an additional recommendation in every diagnostic gap, all zones.
  Object.values(GAP_TAGS || {}).forEach((g) => { g.recommendedToolIds = unique(["ai-help", ...(g.recommendedToolIds || [])]); });

  // ---------- Official curriculum layer extension for Environment Studies ----------
  if (window.AITOOLSKIDS_OFFICIAL_CURRICULUM) {
    const old = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const byQuiz = Object.assign({}, old.byQuiz || {});
    const gapAlignment = Object.assign({}, old.gapAlignment || {});
    const sources = {
      a:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSDIM-A105/220/1607%2C5071/",
      b:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSGL110/288/2056%2C7101/",
      c:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSDIM102/524/3455%2C13984/",
      d:"https://old.ebooks.edu.gr/modules/ebook/show.php/DSDIM-D108/558/3661%2C15878/",
    };
    const titles = { a:"Μελέτη Περιβάλλοντος, Α' Δημοτικού", b:"Μελέτη Περιβάλλοντος, Β' Δημοτικού", c:"Μελέτη Περιβάλλοντος, Γ' Δημοτικού", d:"Μελέτη Περιβάλλοντος, Δ' Δημοτικού" };
    Object.entries(envQuizzes).forEach(([qid,quiz]) => {
      const grade=quiz.grades[0];
      byQuiz[qid] = {
        schoolYear:"2026-2027", verificationDate:TODAY, coverageStatus:"official-book-verified",
        coverageLabelEl:"Επίσημο σχολικό βιβλίο επιβεβαιωμένο: τα διαγνωστικά θέματα είναι ασφαλή topic anchors, όχι δήλωση πλήρους ετήσιας ύλης",
        coverageLabelEn:"Official textbook verified: diagnostic topics are safe topic anchors, not a claim of full annual syllabus",
        quizTitleEl:quiz.subjectLabelEl, quizTitleEn:quiz.subjectLabelEn,
        officialBook:{ titleEl:titles[grade]+": Βιβλίο Μαθητή", titleEn:quiz.subjectLabelEn+": Student Book", url:sources[grade] },
        officialSectionsEl:[], officialSectionsEn:[], catalogUrl:"https://www.ebooks.edu.gr/ebooks/v2/allcoursespdf.jsp",
        ministryUrl:"https://www.minedu.gov.gr/protovathmia/dimotiko",
        scopeNoteEl:"Η Μελέτη Περιβάλλοντος διδάσκεται στις τέσσερις πρώτες τάξεις του Δημοτικού και συνδυάζει φυσικό, κοινωνικό και ανθρωπογενές περιβάλλον. Το layer δεν ισχυρίζεται ότι κάθε topic anchor είναι επίσημος τίτλος κεφαλαίου ή όλη η ετήσια εξεταστέα ύλη.",
        scopeNoteEn:"Environment Studies is taught in the first four Primary grades and integrates natural, social and human-made environment. Topic anchors are not claimed as official section titles or the complete annual syllabus.",
        annualInstructionsStatus:"2026-27-annual-instructions-not-indexed", quizId:qid, zone:"primary",
        sourceDiscipline:"official-source-only; topic anchors are not official section titles unless explicitly verified"
      };
      (quiz.questions||[]).forEach((qq) => (qq.options||[]).forEach((oo) => { if (oo.gapTag) gapAlignment[oo.gapTag] = {
        gapId:oo.gapTag, quizId:qid, status:"official-course-topic-anchor", statusLabelEl:"Θέμα συνδεδεμένο με επιβεβαιωμένο επίσημο μάθημα/βιβλίο, όχι ακριβής τίτλος ενότητας", statusLabelEn:"Topic anchored to a verified official course/textbook, not an exact section title", sourceUrl:sources[grade]
      }; }));
    });
    const meta = Object.assign({}, old.meta || {});
    meta.version = "3.0.0"; meta.lastVerified = TODAY;
    meta.coverageSummary = Object.assign({}, meta.coverageSummary || {}, { allQuizEntries:Object.keys(byQuiz).length, allGapEntries:Object.keys(gapAlignment).length });
    window.AITOOLSKIDS_OFFICIAL_CURRICULUM = Object.freeze({
      meta:Object.freeze(meta), byQuiz:Object.freeze(byQuiz), gapAlignment:Object.freeze(gapAlignment),
      getByQuizId:(id)=>byQuiz[id]||null, getGapAlignment:(id)=>gapAlignment[id]||null,
    });
  }




})();
