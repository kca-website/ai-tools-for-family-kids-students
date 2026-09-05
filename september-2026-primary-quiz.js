/** September 2026 Primary quiz enrichment — data only, no DOM observers. */
(function(){
  "use strict";
  if (typeof QUIZZES === "undefined" || !QUIZZES.primary) return;
  const DATE = "2026-09-05";

  function addGap(id, labelEl, labelEn, explainEl, explainEn, tools){
    if (typeof GAP_TAGS === "undefined") return;
    GAP_TAGS[id] = Object.assign({}, GAP_TAGS[id] || {}, {
      id, labelEl, labelEn, explainEl, explainEn,
      recommendedToolIds: tools || ["ai-help", "chatgpt"],
      achievementEl: "Έξυπνος Ερευνητής",
      achievementEn: "Smart Explorer",
      positiveMessageEl: "Σκέφτεσαι πριν απαντήσεις — αυτό είναι το σημαντικό.",
      positiveMessageEn: "You think before answering — that is what matters.",
      skillTagEl: labelEl,
      skillTagEn: labelEn
    });
    if (typeof LEARNING_PATHS !== "undefined") {
      LEARNING_PATHS[id] = [
        {titleEl:"Δοκίμασε πρώτα μόνος/η",titleEn:"Try it yourself first",descriptionEl:"Ξαναδιάβασε την ερώτηση και εξήγησε με μία πρόταση τι ακριβώς ζητά πριν απαντήσεις.",descriptionEn:"Read the question again and explain in one sentence what it is really asking before answering.",toolId:null},
        {titleEl:"Ζήτησε καθοδήγηση, όχι λύση",titleEn:"Ask for guidance, not the answer",descriptionEl:"Στην AI Βοήθεια ζήτησε μία μικρή υπόδειξη ή μία ερώτηση τη φορά, χωρίς έτοιμη απάντηση.",descriptionEn:"In AI Help, ask for one small hint or one question at a time, without a ready-made answer.",toolId:"ai-help"},
        {titleEl:"Έλεγξε αν το κατάλαβες",titleEn:"Check your understanding",descriptionEl:"Δοκίμασε ένα παρόμοιο παράδειγμα χωρίς βοήθεια και εξήγησε πώς σκέφτηκες.",descriptionEn:"Try a similar example without help and explain your reasoning.",toolId:null}
      ];
    }
  }

  addGap("primary.language.text-thinking","Κατανόηση κειμένου ως συνόλου","Thinking about a text as a whole","Χρειάζεται εξάσκηση στο να συνδέει κύρια πληροφορία, σκοπό και τίτλο ενός μικρού κειμένου.","Needs practice connecting main information, purpose and title in a short text.",["ai-help","reading-coach","chatgpt"]);
  addGap("primary.math.problem-reasoning","Μαθηματικός συλλογισμός σε πρόβλημα","Mathematical problem reasoning","Βιάζεται να κάνει πράξη πριν καταλάβει τι ζητά πραγματικά το πρόβλημα.","Rushes into calculation before understanding what the problem is asking.",["ai-help","photomath","chatgpt"]);
  addGap("primary.history.source-sequence","Χρονολογική σκέψη και ιστορική πηγή","Chronology and historical sources","Χρειάζεται να ξεχωρίζει τι μπορεί να στηρίξει μια πηγή και τι είναι υπόθεση.","Needs practice distinguishing what a source supports from what is only an assumption.",["ai-help","google-arts-culture","chatgpt"]);
  addGap("primary.science.predict-explain","Πρόβλεψη, παρατήρηση και εξήγηση","Prediction, observation and explanation","Χρειάζεται εξάσκηση στη σειρά πρόβλεψη → παρατήρηση → σύγκριση → συμπέρασμα.","Needs practice with prediction → observation → comparison → conclusion.",["ai-help","phet","chatgpt"]);

  function q(id,textEl,textEn,correctEl,correctEn,wrong1El,wrong1En,wrong2El,wrong2En,gapTag){
    return {id,textEl,textEn,options:[
      {textEl:correctEl,textEn:correctEn,isCorrect:true},
      {textEl:wrong1El,textEn:wrong1En,isCorrect:false,gapTag},
      {textEl:wrong2El,textEn:wrong2En,isCorrect:false,gapTag}
    ]};
  }

  const additions = {
    "glossa-a-dimotikou": q("sep26-text-thinking-a","Η Άννα πήρε την ομπρέλα της γιατί έβρεχε. Ποιος τίτλος ταιριάζει καλύτερα;","Anna took her umbrella because it was raining. Which title fits best?","Μια βροχερή μέρα","A rainy day","Το καινούριο ποδήλατο","The new bicycle","Το γεύμα της Άννας","Anna's lunch","primary.language.text-thinking"),
    "glossa-b-dimotikou": q("sep26-text-thinking-b","Ο Μάριος πότισε το φυτό και μετά το έβαλε κοντά στο παράθυρο. Ποια είναι η βασική πληροφορία;","Marios watered the plant and then put it near the window. What is the main information?","Φρόντισε το φυτό του.","He took care of his plant.","Έχασε το τετράδιό του.","He lost his notebook.","Πήγε για ποδόσφαιρο.","He went to play football.","primary.language.text-thinking"),
    "glossa-c-dimotikou": q("sep26-text-thinking-c","«Η τάξη μάζεψε χαρτί για ανακύκλωση και γέμισε τρία κουτιά.» Ποια πρόταση λέει την κύρια ιδέα;","The class collected paper for recycling and filled three boxes. Which sentence gives the main idea?","Η τάξη συμμετείχε σε ανακύκλωση χαρτιού.","The class took part in paper recycling.","Τα κουτιά ήταν μπλε.","The boxes were blue.","Όλοι έφεραν το ίδιο χαρτί.","Everyone brought the same paper.","primary.language.text-thinking"),
    "glossa-d-dimotikou": q("sep26-text-thinking-d","«Το πάρκο απέκτησε νέα δέντρα και περισσότερη σκιά για τους επισκέπτες.» Ποιος τίτλος ταιριάζει καλύτερα;","The park got new trees and more shade for visitors. Which title fits best?","Περισσότερο πράσινο στο πάρκο","More greenery in the park","Ένας αγώνας δρόμου","A running race","Η ιστορία ενός ποδηλάτου","The story of a bicycle","primary.language.text-thinking"),
    "glossa-e-dimotikou": q("sep26-text-thinking-e","Σε ένα κείμενο αναφέρεται ότι το σχολείο έκλεισε τις βρύσες που έσταζαν και μείωσε την κατανάλωση νερού. Ποιο συμπέρασμα στηρίζεται καλύτερα;","A text says the school fixed dripping taps and reduced water use. Which conclusion is best supported?","Η επισκευή βοήθησε στην εξοικονόμηση νερού.","The repairs helped save water.","Το σχολείο σταμάτησε να χρησιμοποιεί νερό.","The school stopped using water.","Οι μαθητές δεν χρειάζονται πια βρύσες.","Students no longer need taps.","primary.language.text-thinking"),
    "glossa-st-dimotikou": q("sep26-text-thinking-st","Ένα άρθρο λέει: «Η αυλή χρειάζεται περισσότερη σκιά. Το καλοκαίρι η θερμοκρασία στην ακάλυπτη πλευρά είναι αισθητά υψηλότερη.» Ποιο μέρος λειτουργεί ως τεκμήριο;","An article says: 'The schoolyard needs more shade. In summer, the temperature on the uncovered side is noticeably higher.' Which part is evidence?","Η αναφορά στην υψηλότερη θερμοκρασία.","The reference to the higher temperature.","Η φράση «χρειάζεται περισσότερη σκιά».","The phrase 'needs more shade'.","Η λέξη «αυλή».","The word 'schoolyard'.","primary.language.text-thinking"),

    "math-a-dimotikou": q("sep26-problem-reasoning-a","Έχεις 7 μήλα και δίνεις 2. Πριν κάνεις πράξη, τι πρέπει να βρεις;","You have 7 apples and give away 2. Before calculating, what must you find?","Πόσα μήλα μένουν.","How many apples are left.","Τι χρώμα είναι τα μήλα.","What colour the apples are.","Πόσα πιάτα έχει η κουζίνα.","How many plates are in the kitchen.","primary.math.problem-reasoning"),
    "math-b-dimotikou": q("sep26-problem-reasoning-b","Έχεις 12 μολύβια και θέλεις να τα βάλεις ισόποσα σε 3 θήκες. Τι ζητά το πρόβλημα;","You have 12 pencils to share equally among 3 cases. What is the problem asking?","Πόσα μολύβια θα μπουν σε κάθε θήκη.","How many pencils go in each case.","Πόσο μακριές είναι οι θήκες.","How long the cases are.","Τι χρώμα έχουν τα μολύβια.","What colour the pencils are.","primary.math.problem-reasoning"),
    "math-c-dimotikou": q("sep26-problem-reasoning-c","Έχεις 24 αυτοκόλλητα και θέλεις να τα μοιράσεις ισόποσα σε 6 παιδιά. Ποια σχέση χρειάζεσαι;","You have 24 stickers to share equally among 6 children. Which relationship do you need?","Διαίρεση: 24 σε 6 ίσα μέρη.","Division: 24 into 6 equal parts.","Πρόσθεση 24 και 6.","Add 24 and 6.","Μέτρηση του ύψους των παιδιών.","Measure the children's height.","primary.math.problem-reasoning"),
    "math-d-dimotikou": q("sep26-problem-reasoning-d","Έχεις 20€ και αγοράζεις κάτι με 7€ και κάτι με 5€. Τι πρέπει να υπολογίσεις για να βρεις πόσα χρήματα μένουν;","You have €20 and buy something for €7 and something for €5. What must you calculate to find how much is left?","Πρώτα το συνολικό κόστος και μετά την αφαίρεση από τα 20€.","First the total cost, then subtract it from €20.","Μόνο 20 + 7 + 5.","Only 20 + 7 + 5.","Μόνο τη διαφορά 7 - 5.","Only the difference 7 - 5.","primary.math.problem-reasoning"),
    "math-e-dimotikou": q("sep26-problem-reasoning-e","Τέσσερα τετράδια κοστίζουν 2€ το καθένα. Πριν κάνεις πράξη, ποια πληροφορία συνδέεις;","Four notebooks cost €2 each. Before calculating, which information do you connect?","Τον αριθμό των τετραδίων με την τιμή του καθενός.","The number of notebooks with the price of each one.","Το χρώμα των τετραδίων με την ημέρα της εβδομάδας.","The notebook colour with the day of the week.","Το ύψος του μαθητή με την τιμή.","The student's height with the price.","primary.math.problem-reasoning"),
    "math-st-dimotikou": q("sep26-problem-reasoning-st","Μια συνταγή για 4 άτομα χρειάζεται 300 g αλεύρι. Θέλεις ποσότητα για 8 άτομα. Ποια σκέψη είναι σωστή πριν υπολογίσεις;","A recipe for 4 people needs 300 g of flour. You need enough for 8 people. Which reasoning is correct before calculating?","Τα άτομα διπλασιάζονται, άρα πρέπει να εξετάσω αν διπλασιάζεται και η ποσότητα.","The number of people doubles, so I should consider doubling the quantity.","Να αφαιρέσω 8 από 300.","Subtract 8 from 300.","Να διαιρέσω το 300 με το 8 χωρίς να σκεφτώ τη σχέση.","Divide 300 by 8 without considering the relationship.","primary.math.problem-reasoning"),

    "istoria-c-dimotikou": q("sep26-source-thinking-c","Βλέπεις μια παλιά εικόνα αγγείου. Τι μπορείς να πεις με μεγαλύτερη ασφάλεια μόνο από την εικόνα;","You see an old image of a vase. What can you say most safely from the image alone?","Τι μορφές και σκηνές απεικονίζονται.","Which figures and scenes are depicted.","Τι σκεφτόταν ο καλλιτέχνης κάθε στιγμή.","What the artist was thinking at every moment.","Ότι όλοι οι άνθρωποι ζούσαν ακριβώς έτσι.","That everyone lived exactly like this.","primary.history.source-sequence"),
    "istoria-d-dimotikou": q("sep26-source-thinking-d","Δύο πηγές περιγράφουν το ίδιο γεγονός διαφορετικά. Ποια είναι η καλύτερη πρώτη κίνηση;","Two sources describe the same event differently. What is the best first step?","Να συγκρίνω ποιος έγραψε κάθε πηγή και τι στοιχεία δίνει.","Compare who produced each source and what evidence it gives.","Να διαλέξω αμέσως αυτή που μου αρέσει περισσότερο.","Immediately choose the one I like more.","Να θεωρήσω ότι και οι δύο είναι σίγουρα λάθος.","Assume both are definitely wrong.","primary.history.source-sequence"),
    "istoria-e-dimotikou": q("sep26-source-thinking-e","Σε μια χρονογραμμή ένα γεγονός βρίσκεται πριν από ένα άλλο. Τι μπορούμε να πούμε με βεβαιότητα;","On a timeline one event is placed before another. What can we say for certain?","Ότι συνέβη νωρίτερα χρονικά.","It happened earlier in time.","Ότι προκάλεσε οπωσδήποτε το δεύτερο.","It definitely caused the second event.","Ότι ήταν πιο σημαντικό.","It was more important.","primary.history.source-sequence"),
    "istoria-st-dimotikou": q("sep26-source-thinking-st","Μια εφημερίδα της εποχής και ένα σχολικό βιβλίο μιλούν για το ίδιο γεγονός. Γιατί αξίζει να τα συγκρίνουμε;","A newspaper from the time and a school textbook discuss the same event. Why is it useful to compare them?","Για να δούμε διαφορετικές οπτικές και ποια στοιχεία χρησιμοποιεί κάθε πηγή.","To see different perspectives and what evidence each source uses.","Για να κρατήσουμε μόνο την πιο μεγάλη σε έκταση πηγή.","To keep only the longer source.","Για να αποφύγουμε να εξετάσουμε τα στοιχεία.","To avoid examining evidence.","primary.history.source-sequence"),

    "science-e-dimotikou": q("sep26-science-reasoning-e","Δύο ίδια φυτά έχουν ίδιο χώμα. Το ένα παίρνει νερό και το άλλο όχι. Ποια είναι η πιο σωστή διαδικασία;","Two identical plants have the same soil. One gets water and the other does not. What is the best approach?","Κάνω πρόβλεψη, παρατηρώ για μερικές μέρες και συγκρίνω τι συνέβη.","Make a prediction, observe for several days, and compare what happened.","Αποφασίζω το αποτέλεσμα πριν τα παρατηρήσω.","Decide the result before observing them.","Αλλάζω ταυτόχρονα νερό, χώμα και φως κάθε μέρα.","Change water, soil and light at the same time every day.","primary.science.predict-explain"),
    "science-st-dimotikou": q("sep26-science-reasoning-st","Θέλεις να ελέγξεις αν το φως επηρεάζει την ανάπτυξη ενός φυτού. Ποιο πείραμα είναι πιο δίκαιο;","You want to test whether light affects plant growth. Which experiment is fairest?","Κρατώ ίδια νερό, χώμα και είδος φυτού και αλλάζω μόνο το φως.","Keep water, soil and plant type the same and change only the light.","Αλλάζω ταυτόχρονα φως, νερό και χώμα.","Change light, water and soil at the same time.","Χρησιμοποιώ δύο τελείως διαφορετικά φυτά και αλλάζω όλα τα στοιχεία.","Use two completely different plants and change everything.","primary.science.predict-explain")
  };

  let added = 0;
  Object.entries(additions).forEach(([quizId, question])=>{
    const quiz = QUIZZES.primary[quizId];
    if (!quiz || !Array.isArray(quiz.questions)) return;
    if (!quiz.questions.some(x=>x.id===question.id)) {
      quiz.questions.push(question);
      added++;
    }
    quiz.curriculumRefreshDate = DATE;
  });

  window.AITOOLSKIDS_PRIMARY_QUIZ_REFRESH = Object.freeze({updated:DATE,added,targets:Object.keys(additions).length,mode:"data-only"});
})();
