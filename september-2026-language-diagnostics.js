/** September 2026 Greek Language diagnostics — data only, no DOM observers. */
(function(){
  "use strict";
  if (typeof QUIZZES === "undefined") return;
  const DATE = "2026-09-05";

  function unique(arr){ return [...new Set((arr || []).filter(Boolean))]; }
  function addGap(id,labelEl,labelEn,explainEl,explainEn){
    if (typeof GAP_TAGS !== "undefined") {
      GAP_TAGS[id] = Object.assign({}, GAP_TAGS[id] || {}, {
        id,labelEl,labelEn,explainEl,explainEn,
        recommendedToolIds: unique(["ai-help","chatgpt", ...((GAP_TAGS[id] || {}).recommendedToolIds || [])]),
        achievementEl:"Κριτικός Αναγνώστης",
        achievementEn:"Critical Reader",
        positiveMessageEl:"Διαβάζεις το κείμενο ως σύνολο, όχι σαν λίστα κανόνων.",
        positiveMessageEn:"You read the text as a whole, not as a list of rules.",
        skillTagEl:"Νεοελληνική Γλώσσα",
        skillTagEn:"Modern Greek Language"
      });
    }
    if (typeof LEARNING_PATHS !== "undefined") {
      LEARNING_PATHS[id] = [
        {titleEl:"Διάβασε το κείμενο σαν σύνολο",titleEn:"Read the text as a whole",descriptionEl:`Βρες μόνος/η το σημείο που σχετίζεται με «${labelEl}» και εξήγησε γιατί.`,descriptionEn:`Find the part related to “${labelEn}” and explain why.`,toolId:null},
        {titleEl:"Ζήτησε μία ερώτηση τη φορά",titleEn:"Ask one question at a time",descriptionEl:`Στην AI Βοήθεια πες «βοήθησέ με να καταλάβω το ${labelEl}, χωρίς να μου δώσεις την απάντηση».`,descriptionEn:`Ask AI Help to guide you on “${labelEn}” without giving the answer.`,toolId:"ai-help"},
        {titleEl:"Μετέφερε τη δεξιότητα",titleEn:"Transfer the skill",descriptionEl:`Εφάρμοσε τη δεξιότητα «${labelEl}» σε δεύτερο μικρό κείμενο χωρίς βοήθεια.`,descriptionEn:`Apply “${labelEn}” to a second short text without help.`,toolId:null}
      ];
    }
  }

  [
    ["language.main-idea","Κύρια ιδέα και ουσιώδεις πληροφορίες","Main idea and essential information","Δυσκολεύεται να ξεχωρίσει την κεντρική ιδέα από επιμέρους λεπτομέρεια.","Struggles to distinguish the central idea from a detail."],
    ["language.cohesion","Συνοχή και λογικές σχέσεις","Cohesion and logical relationships","Δυσκολεύεται να καταλάβει πώς οι δείκτες συνδέουν τις ιδέες ενός κειμένου.","Struggles to understand how textual markers link ideas."],
    ["language.purpose-register","Σκοπός, αποδέκτης και ύφος","Purpose, audience and register","Δεν προσαρμόζει εύκολα τις γλωσσικές επιλογές στον σκοπό και τον αποδέκτη.","Struggles to adapt language to purpose and audience."],
    ["language.argument-evidence","Επιχείρημα και τεκμήριο","Argument and evidence","Μπερδεύει έναν ισχυρισμό με το στοιχείο που πραγματικά τον στηρίζει.","Confuses a claim with supporting evidence."],
    ["language.summary-paraphrase","Περίληψη και παράφραση","Summary and paraphrase","Κρατά δευτερεύουσες λεπτομέρειες ή αντιγράφει αντί να πυκνώνει το νόημα.","Keeps minor details or copies instead of condensing meaning."],
    ["language.inference","Ρητό και υπονοούμενο νόημα","Explicit and implied meaning","Δυσκολεύεται να στηρίξει ερμηνεία σε στοιχεία του κειμένου.","Struggles to support an inference with textual evidence."]
  ].forEach(x=>addGap(...x));

  function opt(textEl,textEn,isCorrect,gapTag){
    const item = {textEl,textEn,isCorrect};
    if (!isCorrect) item.gapTag = gapTag;
    return item;
  }
  function q(id,textEl,textEn,correct,wrong1,wrong2,gapTag){
    return {id,textEl,textEn,options:[
      opt(correct[0],correct[1],true),
      opt(wrong1[0],wrong1[1],false,gapTag),
      opt(wrong2[0],wrong2[1],false,gapTag)
    ]};
  }
  function questions(zone,grade){
    const p = `sep26-${zone}-${grade}`;
    const rows = [
      q(`${p}-main`,`Διάβασε: «Το σχολείο άνοιξε τη βιβλιοθήκη και τα διαλείμματα. Μέσα σε έναν μήνα οι δανεισμοί διπλασιάστηκαν». Ποια είναι η βασική πληροφορία;`,`Read: ‘The school opened the library during breaks. Within a month, loans doubled.’ What is the key information?`,["Η ευκολότερη πρόσβαση συνδέθηκε με περισσότερους δανεισμούς.","Easier access was linked with more borrowing."],["Η βιβλιοθήκη έχει πολλά βιβλία.","The library has many books."],["Όλοι οι μαθητές αγαπούν το διάβασμα.","All students love reading."],"language.main-idea"),
      q(`${p}-cohesion`,`Στο «Η ομάδα δοκίμασε ξανά, επειδή το πρώτο πείραμα απέτυχε», τι σχέση δηλώνει το «επειδή»;`,`In ‘The team tried again because the first experiment failed’, what relation does ‘because’ show?`,["Αιτία.","Cause."],["Χρονική σειρά.","Time sequence."],["Αντίθεση.","Contrast."],"language.cohesion"),
      q(`${p}-register`,`Θέλεις να ζητήσεις από τον διευθυντή άδεια για σχολική δράση. Ποια διατύπωση ταιριάζει περισσότερο;`,`You want to ask the principal for permission for a school activity. Which wording fits best?`,["«Θα θέλαμε να ζητήσουμε την έγκρισή σας για…»","‘We would like to request your approval for…’"],["«Έλα, κάν’ το, θα είναι τέλειο!»","‘Come on, do it, it’ll be great!’"],["«Δεν με νοιάζει τι θα πείτε, θα το κάνουμε.»","‘I don’t care what you say, we’ll do it.’"],"language.purpose-register"),
      q(`${p}-evidence`,`Ισχυρισμός: «Η αυλή χρειάζεται περισσότερη σκιά». Ποιο στοιχείο τον στηρίζει καλύτερα;`,`Claim: ‘The schoolyard needs more shade.’ Which evidence supports it best?`,["Μετρήσεις δείχνουν ότι το μεγαλύτερο μέρος της αυλής μένει στον ήλιο τις μεσημεριανές ώρες.","Measurements show most of the yard remains in direct sun at midday."],["Μου αρέσουν τα δέντρα.","I like trees."],["Η αυλή είναι δίπλα στο σχολείο.","The yard is next to the school."],"language.argument-evidence"),
      q(`${p}-summary`,`Ποια πρόταση είναι καλύτερη περίληψη; «Οι μαθητές φύτεψαν βότανα, κατέγραφαν κάθε εβδομάδα την ανάπτυξή τους και στο τέλος συνέκριναν τα αποτελέσματα».`,`Which is the best summary? ‘Students planted herbs, recorded their growth weekly, and compared the results at the end.’`,["Οι μαθητές παρακολούθησαν συστηματικά την ανάπτυξη φυτών και συνέκριναν τα δεδομένα τους.","Students systematically monitored plant growth and compared their data."],["Οι μαθητές φύτεψαν βότανα την πρώτη μέρα.","Students planted herbs on the first day."],["Τα βότανα ήταν πράσινα και υπήρχαν πολλές εβδομάδες.","The herbs were green and there were many weeks."],"language.summary-paraphrase")
    ];
    if ((zone === "middle" && grade === "c") || zone === "high") {
      rows.push(q(`${p}-inference`,`Σε άρθρο ο συντάκτης γράφει «Η λύση ακούγεται εύκολη· τα στοιχεία όμως επιμένουν να τη διαψεύδουν». Τι συμπεραίνουμε;`,`An article says, ‘The solution sounds easy; the evidence, however, keeps contradicting it.’ What can we infer?`,["Ο συντάκτης αμφισβητεί την απλή λύση επειδή δεν στηρίζεται στα δεδομένα.","The author doubts the simple solution because evidence does not support it."],["Ο συντάκτης θεωρεί ότι δεν χρειάζονται στοιχεία.","The author thinks evidence is unnecessary."],["Ο συντάκτης συμφωνεί απόλυτα με την εύκολη λύση.","The author fully agrees with the easy solution."],"language.inference"));
    }
    return rows;
  }

  function isGreekLanguageQuiz(item){
    const s = `${item?.subjectLabelEl || ""} ${item?.id || ""}`.toLowerCase();
    return /νεοελλην|γλώσσα/.test(s) && !/αγγλ|english|ξέν/.test(s);
  }

  let updated = 0;
  ["middle","high"].forEach(zone=>Object.values(QUIZZES[zone] || {}).forEach(item=>{
    if (!isGreekLanguageQuiz(item)) return;
    const grade = (item.grades || ["a"])[0];
    item.questions = questions(zone,grade);
    item.introEl = "5–6 σύντομες ερωτήσεις πάνω σε κείμενο, συνοχή, ύφος και επιχειρηματολογία. Δεν είναι τεστ αποστήθισης γραμματικών όρων.";
    item.introEn = "5–6 short questions on text meaning, cohesion, register and argumentation. This is not a grammar-term memorization test.";
    item.curriculumRefreshDate = DATE;
    updated++;
  }));

  window.AITOOLSKIDS_LANGUAGE_DIAGNOSTIC_REFRESH = Object.freeze({updated:DATE,quizCount:updated,mode:"data-only"});
})();
