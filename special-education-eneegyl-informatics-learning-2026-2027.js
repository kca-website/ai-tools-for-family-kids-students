(function(){
  "use strict";

  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const META=window.AITOOLSKIDS_ENEEGYL_INFORMATICS_2026_2027;
  if(!C?.entries||!L||!Q||!META?.entries) return;

  const entries=META.entries.map(id=>C.entries[id]).filter(Boolean);

  function pickIndexes(length){
    if(length<=3) return [...Array(length)].map((_,i)=>i);
    return [...new Set([0,Math.floor((length-1)/2),length-1])];
  }

  function makeLearning(entry){
    const anchors=entry.officialAnchors||[];
    const sample=pickIndexes(anchors.length).map(i=>anchors[i]);
    const single=anchors.length===1;
    return {
      curriculumId:entry.id,
      status:"ready",
      sourceBasis:entry.coverageStatus==="panhellenic-verified"
        ?"official-eneegyl-informatics-panhellenic-2027"
        :"official-eneegyl-informatics-2026-27",
      learnSimply:{
        lead:single
          ? `Για το μάθημα «${entry.subject}» η επίσημη οδηγία ορίζει το εύρος της ύλης συνοπτικά: «${anchors[0]}». Δεν σπάμε τεχνητά αυτή τη γραμμή σε κεφάλαια που δεν έχουν κωδικοποιηθεί ρητά στην πηγή. Χρησιμοποίησε την AI Βοήθεια πάνω στο πραγματικό κεφάλαιο ή την άσκηση που δουλεύεις.`
          : `Για το μάθημα «${entry.subject}» έχουν αποθηκευτεί ${anchors.length} συγκεκριμένες επίσημες ενότητες από την τρέχουσα ύλη/οδηγία. Η διαδρομή σε βοηθά να εντοπίσεις το σωστό κεφάλαιο και μετά να δουλέψεις τη δυσκολία σου με καθοδήγηση.`,
        keyPoints:single
          ? [anchors[0],"Η ακριβής ενότητα που δουλεύεις πρέπει να προέρχεται από το πραγματικό σχολικό υλικό.","Η AI χρησιμοποιείται για εξήγηση, υπόδειξη, debugging ή νέα εξάσκηση — όχι για έτοιμη παράδοση."]
          : [`Η επίσημη χαρτογράφηση περιλαμβάνει ${anchors.length} ενότητες.`,...sample.slice(0,3)]
      },
      qa:[
        {q:"Η διαδρομή προσθέτει δικά της κεφάλαια;",a:"Όχι. Χρησιμοποιεί μόνο την επίσημη χαρτογράφηση που έχει ήδη επαληθευτεί."},
        {q:"Τι κάνω αν το scope γράφει «όλα τα κεφάλαια εκτός…»;",a:"Δουλεύω το πραγματικό κεφάλαιο του βιβλίου/εργαστηρίου και ελέγχω ότι δεν ανήκει στις εξαιρέσεις της επίσημης οδηγίας."},
        {q:"Πώς χρησιμοποιώ την AI Βοήθεια στην Πληροφορική;",a:"Δίνω το συγκεκριμένο θέμα, κώδικα ή πρόβλημα και ζητώ μικρές υποδείξεις, εξήγηση ή έλεγχο βημάτων χωρίς έτοιμη τελική λύση."}
      ],
      parentStudy:{
        intro:"Στόχος είναι να ξέρει ο μαθητής ποιο ακριβώς θέμα δουλεύει και να ζητά στοχευμένη βοήθεια, όχι να παίρνει γενικές απαντήσεις.",
        steps:[
          "Εντόπισε πρώτα το πραγματικό κεφάλαιο ή εργαστηριακή ενότητα.",
          "Έλεγξε ότι βρίσκεται μέσα στο επίσημο scope του μαθήματος.",
          "Ζήτησε από τον μαθητή να περιγράψει πού ακριβώς κολλάει.",
          "Χρησιμοποίησε την AI Βοήθεια για μία υπόδειξη ή ερώτηση τη φορά και μετά νέα προσπάθεια."
        ]
      },
      practice:single
        ? [
            "Γράψε το ακριβές κεφάλαιο ή την άσκηση που δουλεύεις αυτή τη στιγμή.",
            "Έλεγξε αν ανήκει στις εξαιρέσεις που αναφέρει η επίσημη οδηγία.",
            "Ζήτησε από την AI μία μόνο υπόδειξη και μετά ξαναπροσπάθησε μόνος/η."
          ]
        : [
            "Διάλεξε μία επίσημη ενότητα από τη χαρτογράφηση και σύνδεσέ την με το πραγματικό υλικό του μαθήματος.",
            "Πες με μία πρόταση τι προσπαθείς να καταλάβεις ή να υλοποιήσεις μέσα σε αυτή την ενότητα.",
            "Χρησιμοποίησε την AI για καθοδήγηση και μετά κάνε μία νέα προσπάθεια χωρίς AI."
          ]
    };
  }

  function makeQuiz(entry){
    const a=entry.officialAnchors;
    return pickIndexes(a.length).slice(0,3).map((idx)=>{
      const correct=a[idx];
      let wrong=(idx+Math.max(1,Math.floor(a.length/2)))%a.length;
      if(wrong===idx) wrong=(idx+1)%a.length;
      const previous=idx>0?a[idx-1]:null;
      if(previous){
        return {
          q:`Στην επίσημη χαρτογράφηση, ποια ενότητα ακολουθεί το «${previous}»;`,
          options:[correct,a[wrong]],
          correctIndex:0
        };
      }
      return {
        q:"Ποια από τις δύο επιλογές εμφανίζεται πρώτη στην επαληθευμένη επίσημη λίστα αυτού του μαθήματος;",
        options:[correct,a[wrong]],
        correctIndex:0
      };
    });
  }

  const learningReady=[];
  const quizReady=[];
  entries.forEach((entry)=>{
    L[entry.id]=L[entry.id]||makeLearning(entry);
    learningReady.push(entry.id);

    if((entry.officialAnchors?.length||0)>=2){
      Q[entry.id]=Q[entry.id]||{
        curriculumId:entry.id,
        status:"ready",
        title:"Μικρός έλεγχος επίσημης ύλης",
        intro:"3 σύντομες ερωτήσεις με 2 επιλογές για να ελέγξεις αν βρίσκεις σωστά τις επίσημες ενότητες. Δεν είναι τεστ προγραμματιστικής ικανότητας.",
        successMessage:"Βρίσκεις σωστά τη δομή της επίσημης ύλης. Συνέχισε με AI Βοήθεια πάνω στο πραγματικό πρόβλημα ή κώδικα που δουλεύεις.",
        retryMessage:"Ξαναδές τη χαρτογράφηση και μετά ζήτησε στοχευμένη AI Βοήθεια στο σημείο που μπερδεύτηκες.",
        questions:makeQuiz(entry)
      };
      quizReady.push(entry.id);
    }
  });

  window.AITOOLSKIDS_ENEEGYL_INFORMATICS_LEARNING_2026_2027=Object.freeze({
    version:"1.0.0",
    verified:"2026-09-24",
    learningReady:Object.freeze([...learningReady]),
    quizReady:Object.freeze([...quizReady]),
    policy:"All 24 verified informatics subjects receive study routes. Only the 14 multi-anchor mappings receive quizzes."
  });
})();