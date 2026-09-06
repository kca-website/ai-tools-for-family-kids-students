/**
 * Special Education assessment policy.
 *
 * Special Gymnasium, Special Lyceum and EN.E.E.GY.-L. do NOT reuse the
 * general-school assessment difficulty. Static checks are short, direct and
 * limited to two choices. AI-generated practice quizzes use the same profile.
 */
(function(){
  "use strict";

  const SPECIAL_TRACKS=new Set(["special-gymnasium","special-lyceum","eneegyl"]);
  const POLICY=Object.freeze({
    version:1,
    id:"special-education-simple-v1",
    tracks:Object.freeze([...SPECIAL_TRACKS]),
    maxQuestions:3,
    optionsPerQuestion:2,
    principles:Object.freeze([
      "Μία βασική έννοια ανά ερώτηση.",
      "Σύντομη και κυριολεκτική διατύπωση, χωρίς παγίδες ή σύνθετες αρνήσεις.",
      "Δύο καθαρές επιλογές απάντησης.",
      "Συγκεκριμένο παράδειγμα πριν από αφηρημένη ή πολυβηματική σκέψη.",
      "Η δυσκολία είναι χαμηλότερη από το αντίστοιχο quiz γενικού σχολείου.",
      "Ο έλεγχος είναι εργαλείο κατανόησης και εξάσκησης, όχι σχολικός βαθμός."
    ]),
    aiPromptRules:[
      "SPECIAL EDUCATION ASSESSMENT MODE.",
      "Create exactly 3 very short practice questions.",
      "Use exactly 2 answer options per question.",
      "Test one basic idea at a time.",
      "Use short, literal sentences and familiar vocabulary.",
      "Prefer a concrete everyday example when possible.",
      "Do not use trick questions, double negatives, dense wording, obscure facts or multi-step exam-style reasoning.",
      "Difficulty must be clearly lower than the equivalent General Gymnasium/Lyceum quiz.",
      "Give a one-sentence explanation after each answer.",
      "Return strict JSON only."
    ].join("\n"),
    isSpecialTrack(track){ return SPECIAL_TRACKS.has(String(track||"")); }
  });

  window.SPECIAL_EDUCATION_ASSESSMENT_POLICY=POLICY;

  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  if(!Q) return;

  function twoOptions(question){
    const options=Array.isArray(question?.options)?question.options.filter((x)=>String(x||"").trim()):[];
    const originalCorrect=Number(question?.correctIndex);
    if(options.length<=2){
      question.options=options.slice(0,2);
      question.correctIndex=Number.isInteger(originalCorrect)&&originalCorrect>=0&&originalCorrect<question.options.length?originalCorrect:0;
      return question;
    }
    const correct=Number.isInteger(originalCorrect)&&originalCorrect>=0&&originalCorrect<options.length?originalCorrect:0;
    const wrong=options.findIndex((_,i)=>i!==correct);
    const indexes=correct===0?[correct,wrong]:[wrong,correct];
    question.options=indexes.map((i)=>options[i]);
    question.correctIndex=indexes.indexOf(correct);
    return question;
  }

  function normalizeQuiz(quiz){
    if(!quiz||!Array.isArray(quiz.questions)) return;
    quiz.assessmentProfile=POLICY.id;
    quiz.maxQuestions=POLICY.maxQuestions;
    quiz.optionsPerQuestion=POLICY.optionsPerQuestion;
    quiz.intro="3 πολύ απλές ερωτήσεις, μία ιδέα τη φορά. Δεν είναι σχολικός βαθμός.";
    quiz.questions=quiz.questions.slice(0,POLICY.maxQuestions).map(twoOptions);
  }

  // The first two Special Gymnasium checks are deliberately rewritten in a
  // simpler form instead of merely removing one distractor from the old quiz.
  if(Q["special-gym-a-language-comprehension"]){
    Object.assign(Q["special-gym-a-language-comprehension"],{
      title:"Πολύ σύντομος έλεγχος κατανόησης",
      intro:"3 πολύ απλές ερωτήσεις, μία ιδέα τη φορά. Δεν είναι σχολικός βαθμός.",
      successMessage:"Κατάλαβες τα βασικά. Μπορείς να συνεχίσεις με μία μικρή άσκηση.",
      retryMessage:"Δες ξανά το βασικό βήμα και ξαναδοκίμασε χωρίς βιασύνη.",
      questions:[
        {q:"Η λέξη «σύγκρινε» τι ζητά;",options:["Να βρω ομοιότητες ή διαφορές.","Να αντιγράψω όλο το κείμενο."],correctIndex:0},
        {q:"Πριν απαντήσω, τι βρίσκω πρώτα;",options:["Τι μου ζητά η ερώτηση.","Την πιο μεγάλη λέξη."],correctIndex:0},
        {q:"Αν η απάντηση είναι στο κείμενο, τι κάνω;",options:["Βρίσκω τη σωστή πληροφορία.","Αντιγράφω όλες τις παραγράφους."],correctIndex:0}
      ]
    });
  }

  if(Q["special-gym-a-math-problem-reading"]){
    Object.assign(Q["special-gym-a-math-problem-reading"],{
      title:"Πολύ σύντομος έλεγχος προβλήματος",
      intro:"3 πολύ απλές ερωτήσεις, μία ιδέα τη φορά. Δεν είναι σχολικός βαθμός.",
      successMessage:"Ξεχωρίζεις τα βασικά βήματα ενός προβλήματος.",
      retryMessage:"Ξαναδές: τι ζητά το πρόβλημα και ποια στοιχεία χρειάζομαι.",
      questions:[
        {q:"Πριν κάνω πράξεις, τι βρίσκω;",options:["Τι ζητά το πρόβλημα.","Τον πιο μεγάλο αριθμό."],correctIndex:0},
        {q:"Χρησιμοποιώ όλους τους αριθμούς;",options:["Μόνο όσους χρειάζονται.","Πάντα όλους."],correctIndex:0},
        {q:"Στο τέλος τι ελέγχω;",options:["Αν η απάντηση ταιριάζει στο πρόβλημα.","Αν έκανα πολλές πράξεις."],correctIndex:0}
      ]
    });
  }

  Object.values(Q).forEach((quiz)=>{
    const curriculumId=quiz?.curriculumId;
    const schoolType=C?.entries?.[curriculumId]?.schoolType;
    if(SPECIAL_TRACKS.has(schoolType)) normalizeQuiz(quiz);
  });
})();