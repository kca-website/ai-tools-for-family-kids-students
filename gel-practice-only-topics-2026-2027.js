(function(root){
  "use strict";
  // 2026–27 GEL labels without a verified standalone official textbook source.
  // These are NOT official schoolbook units; they require learner-provided text.
  const entries=Object.freeze([
    {
      "subjectId": "ekthesi-a-lykeiou",
      "label": "Λογοτεχνία: φύλα και ταυτότητες",
      "sourceTopicId": "ekthesi-a-lykeiou.official-section-11",
      "reviewStatus": "broad-literary-theme-without-verified-text"
    },
    {
      "subjectId": "ekthesi-a-lykeiou",
      "label": "Λογοτεχνία: παράδοση και μοντερνισμός στη νεοελληνική ποίηση",
      "sourceTopicId": "ekthesi-a-lykeiou.official-section-12",
      "reviewStatus": "broad-literary-theme-without-verified-text"
    },
    {
      "subjectId": "archaia-b-lykeiou",
      "label": "Αδίδακτο πεζό κείμενο αττικής διαλέκτου",
      "sourceTopicId": "archaia-b-lykeiou.topic-9",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "ekthesi-b-lykeiou",
      "label": "Τρόποι πειθούς",
      "sourceTopicId": "ekthesi-b.persuasion-modes-confusion",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "ekthesi-b-lykeiou",
      "label": "Αντίκρουση αντίθετης άποψης",
      "sourceTopicId": "ekthesi-b.thesis-antithesis-missing",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "ekthesi-b-lykeiou",
      "label": "Ισορροπία δοκιμίου",
      "sourceTopicId": "ekthesi-b.essay-structure-imbalance",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "ekthesi-b-lykeiou",
      "label": "Εγκυρότητα επιχειρήματος και τεκμήριο",
      "sourceTopicId": "neoelliniki-b-lykeiou.topic-2",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "ekthesi-b-lykeiou",
      "label": "Παράφραση και ενσωμάτωση πηγής",
      "sourceTopicId": "neoelliniki-b-lykeiou.topic-4",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "english-g-lykeiou",
      "label": "Μεικτοί υποθετικοί λόγοι",
      "sourceTopicId": "efl-c-lyk.mixed-conditionals",
      "reviewStatus": "no-confirmed-2026-27-book-unit"
    },
    {
      "subjectId": "english-g-lykeiou",
      "label": "Αντεστραμμένη σύνταξη",
      "sourceTopicId": "efl-c-lyk.inversion-emphasis",
      "reviewStatus": "no-confirmed-2026-27-book-unit"
    },
    {
      "subjectId": "english-g-lykeiou",
      "label": "Ακαδημαϊκές συνάψεις",
      "sourceTopicId": "efl-c-lyk.academic-collocations",
      "reviewStatus": "no-confirmed-2026-27-book-unit"
    },
    {
      "subjectId": "english-g-lykeiou",
      "label": "Παθητική φωνή σε επίσημο ύφος",
      "sourceTopicId": "efl-c-lyk.passive-voice-formal",
      "reviewStatus": "no-confirmed-2026-27-book-unit"
    },
    {
      "subjectId": "english-g-lykeiou",
      "label": "Phrasal vs επίσημο ρήμα",
      "sourceTopicId": "efl-c-lyk.phrasal-vs-formal-verb",
      "reviewStatus": "no-confirmed-2026-27-book-unit"
    },
    {
      "subjectId": "archaia-g-lykeiou",
      "label": "Διδαγμένο κείμενο: κατανόηση και ερμηνεία",
      "sourceTopicId": "archaia-g-lykeiou.topic-11",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "archaia-g-lykeiou",
      "label": "Παράλληλο κείμενο και διακειμενικές σχέσεις",
      "sourceTopicId": "archaia-g-lykeiou.topic-12",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "archaia-g-lykeiou",
      "label": "Αδίδακτο κείμενο: μετάφραση",
      "sourceTopicId": "archaia-g-lykeiou.topic-13",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "archaia-g-lykeiou",
      "label": "Αδίδακτο: γραμματική",
      "sourceTopicId": "archaia-g-lykeiou.topic-14",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "archaia-g-lykeiou",
      "label": "Αδίδακτο: συντακτικό",
      "sourceTopicId": "archaia-g-lykeiou.topic-15",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "archaia-g-lykeiou",
      "label": "Λεξιλογικές και ετυμολογικές σχέσεις",
      "sourceTopicId": "archaia-g-lykeiou.topic-16",
      "reviewStatus": "practice-skill-not-exact-book-unit"
    },
    {
      "subjectId": "oikonomia-g-lykeiou",
      "label": "Εισόδημα και σταυροειδής ελαστικότητα",
      "sourceTopicId": "oikonomia-g-lykeiou.topic-7",
      "reviewStatus": "out-of-current-verified-examinable-scope"
    },
    {
      "subjectId": "oikonomia-g-lykeiou",
      "label": "Διεθνές εμπόριο και οικονομικές σχέσεις",
      "sourceTopicId": "oikonomia-g-lykeiou.topic-20",
      "reviewStatus": "out-of-current-verified-examinable-scope"
    }
  ]);
  const api=Object.freeze({
    count: entries.length, entries,
    forSubject(subjectId){
      return entries.filter(row=>row.subjectId===String(subjectId||""));
    },
    get(subjectId,label){
      return entries.find(row=>row.subjectId===subjectId && row.label===label)||null;
    }
  });
  if(typeof window!=="undefined")window.AITOOLSKIDS_GEL_PRACTICE_ONLY=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:null);
