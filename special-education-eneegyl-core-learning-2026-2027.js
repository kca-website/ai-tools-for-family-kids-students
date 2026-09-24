(function(){
  "use strict";

  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  if(!C?.entries||!L||!Q) return;

  const SUBJECTS=new Set(["math","physics","chemistry","new-greek","english"]);
  const entries=Object.values(C.entries).filter((entry)=>
    entry?.schoolType==="eneegyl" &&
    SUBJECTS.has(entry?.subjectId) &&
    entry?.status==="verified" &&
    Array.isArray(entry?.officialAnchors) &&
    entry.officialAnchors.length>0 &&
    String(entry?.gradeId||"").startsWith("lyc-")
  );

  function pickIndexes(length){
    if(length<=3) return [...Array(length)].map((_,i)=>i);
    return [...new Set([0,Math.floor((length-1)/2),length-1])];
  }

  function makeLearning(entry){
    const anchors=entry.officialAnchors;
    const single=anchors.length===1;
    const samples=pickIndexes(anchors.length).map(i=>anchors[i]);
    return {
      curriculumId:entry.id,
      status:"ready",
      sourceBasis:entry.coverageStatus==="panhellenic-verified"
        ?"official-eneegyl-core-panhellenic"
        :"official-eneegyl-core-2026-27",
      learnSimply:{
        lead:single
          ? `Για το μάθημα «${entry.subject}» η επίσημη οδηγία αποτυπώνει το scope συνοπτικά: «${anchors[0]}». Η διαδρομή δεν το διασπά αυθαίρετα σε κεφάλαια. Χρησιμοποίησε το πραγματικό σχολικό κείμενο/άσκηση και ζήτησε στοχευμένη βοήθεια μόνο πάνω σε αυτό.`
          : `Για το μάθημα «${entry.subject}» έχουν επαληθευτεί ${anchors.length} συγκεκριμένες ενότητες/επιλογές της ύλης 2026–27. Η διαδρομή χρησιμοποιεί μόνο αυτές τις επίσημες αναφορές για να σε οδηγήσει από την επιλογή ενότητας σε στοχευμένη AI καθοδήγηση και νέα προσπάθεια.`,
        keyPoints:single
          ? [anchors[0],"Η ακριβής άσκηση ή το κείμενο προέρχεται από το πραγματικό σχολικό υλικό.","Η AI χρησιμοποιείται για καθοδήγηση και έλεγχο κατανόησης, όχι για έτοιμη λύση."]
          : [`Η χαρτογράφηση περιλαμβάνει ${anchors.length} επίσημες ενότητες/επιλογές.`,...samples.slice(0,3)]
      },
      qa:[
        {q:"Οι ενότητες εδώ είναι επίσημες;",a:"Ναι. Εμφανίζονται μόνο στοιχεία που έχουν ήδη επαληθευτεί από την αντίστοιχη επίσημη οδηγία 2026–27."},
        {q:"Η AI αντικαθιστά το βιβλίο ή την οδηγία;",a:"Όχι. Πρώτα εντοπίζεις την πραγματική ενότητα και μετά χρησιμοποιείς την AI για μικρές υποδείξεις, εξήγηση ή νέα εξάσκηση."},
        {q:"Πώς ελέγχω αν πραγματικά κατάλαβα;",a:"Μετά την καθοδήγηση απαντάς σε νέα ερώτηση ή εξηγείς τη σκέψη σου χωρίς να κοιτάξεις την AI απάντηση."}
      ],
      parentStudy:{
        intro:"Η επίσημη χαρτογράφηση λειτουργεί ως χάρτης. Το παιδί πρέπει πρώτα να ξέρει σε ποια πραγματική ενότητα βρίσκεται και μετά να ζητά συγκεκριμένη βοήθεια.",
        steps:[
          "Διάλεξε μία επίσημη ενότητα από τη χαρτογράφηση.",
          "Άνοιξε το πραγματικό σχολικό βιβλίο, κείμενο ή άσκηση.",
          "Ζήτησε από τον μαθητή να εξηγήσει πού ακριβώς δυσκολεύεται.",
          "Χρησιμοποίησε την AI Βοήθεια για μία μικρή υπόδειξη τη φορά και μετά νέα προσπάθεια χωρίς AI."
        ]
      },
      practice:[
        "Διάλεξε μία επίσημη ενότητα και σύνδεσέ την με το πραγματικό σχολικό υλικό σου.",
        "Πες με μία πρόταση τι ήδη καταλαβαίνεις και ποιο είναι το σημείο δυσκολίας.",
        "Μετά την AI καθοδήγηση, λύσε ή εξήγησε ένα νέο παράδειγμα χωρίς να κοιτάξεις την προηγούμενη απάντηση."
      ]
    };
  }

  function makeQuiz(entry){
    const anchors=entry.officialAnchors;
    return pickIndexes(anchors.length).slice(0,3).map((idx)=>{
      const correct=anchors[idx];
      let wrong=(idx+Math.max(1,Math.floor(anchors.length/2)))%anchors.length;
      if(wrong===idx) wrong=(idx+1)%anchors.length;
      if(idx>0){
        return {
          q:`Στην επαληθευμένη επίσημη λίστα, ποια ενότητα ακολουθεί το «${anchors[idx-1]}»;`,
          options:[correct,anchors[wrong]],
          correctIndex:0
        };
      }
      return {
        q:"Ποια από τις δύο επιλογές εμφανίζεται πρώτη στην επαληθευμένη επίσημη χαρτογράφηση αυτού του μαθήματος;",
        options:[correct,anchors[wrong]],
        correctIndex:0
      };
    });
  }

  const learningReady=[];
  const quizReady=[];

  entries.forEach((entry)=>{
    if(!L[entry.id]) L[entry.id]=makeLearning(entry);
    learningReady.push(entry.id);

    if(entry.officialAnchors.length>=2){
      if(!Q[entry.id]){
        Q[entry.id]={
          curriculumId:entry.id,
          status:"ready",
          title:"Μικρός έλεγχος επίσημης ύλης",
          intro:"3 σύντομες ερωτήσεις με 2 επιλογές για να ελέγξεις ότι βρίσκεσαι στη σωστή επίσημη ενότητα. Δεν είναι τεστ περιεχομένου ούτε βαθμός.",
          successMessage:"Βρίσκεις σωστά τη δομή της επίσημης ύλης. Συνέχισε με AI Βοήθεια πάνω στην πραγματική άσκηση ή ενότητα.",
          retryMessage:"Ξαναδές τη χαρτογράφηση και μετά ζήτησε AI καθοδήγηση στο σημείο που μπερδεύτηκες.",
          questions:makeQuiz(entry)
        };
      }
      quizReady.push(entry.id);
    }
  });

  window.AITOOLSKIDS_ENEEGYL_CORE_LEARNING_2026_2027=Object.freeze({
    version:"1.0.0",
    verified:"2026-09-24",
    learningReady:Object.freeze([...learningReady]),
    quizReady:Object.freeze([...quizReady]),
    subjects:Object.freeze(["Μαθηματικά","Φυσική","Χημεία","Νέα Ελληνικά","Αγγλικά"]),
    policy:"Only verified official ENEEGYL anchors are used. Single-anchor scope entries receive study routes but no synthetic quiz."
  });
})();