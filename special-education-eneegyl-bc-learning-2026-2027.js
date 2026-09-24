(function(){
  "use strict";

  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  if(!C?.entries||!L||!Q) return;

  const TARGETS=Object.values(C.entries).filter((entry)=>
    entry?.schoolType==="eneegyl" &&
    ["B","C"].includes(String(entry?.grade||"").toUpperCase()) &&
    entry?.status==="verified" &&
    entry?.requiresExactUnit!==true &&
    Array.isArray(entry?.officialAnchors) &&
    entry.officialAnchors.length>0 &&
    entry?.coverageStatus==="official-course-guidance"
  );

  function pickIndexes(length){
    if(length<=3) return [...Array(length)].map((_,i)=>i);
    return [...new Set([0,Math.floor((length-1)/2),length-1])];
  }

  function shortLabel(anchor){
    const text=String(anchor||"").trim();
    const parts=text.split(/\s+[—–-]\s+/);
    if(parts.length>1) return parts.slice(1).join(" — ");
    return text.replace(/^\d+(?:η|ο|α|β|γ|δ)?\s*(?:Φάση|Ενότητα|Κεφάλαιο)?\s*[:.]?\s*/i,"")||text;
  }

  function makeQuiz(entry){
    const anchors=entry.officialAnchors;
    return pickIndexes(anchors.length).slice(0,3).map((idx,n)=>{
      const correct=anchors[idx];
      let distractorIndex=(idx+Math.max(1,Math.floor(anchors.length/2)))%anchors.length;
      if(distractorIndex===idx) distractorIndex=(idx+1)%anchors.length;
      const distractor=anchors[distractorIndex];
      const clue=shortLabel(correct);
      return {
        q:`Σε ποια από τις δύο επίσημες ενότητες αντιστοιχεί το θέμα «${clue}»;`,
        options:[correct,distractor],
        correctIndex:0
      };
    });
  }

  function makeLearning(entry){
    const anchors=entry.officialAnchors;
    const sample=pickIndexes(anchors.length).map(i=>anchors[i]);
    return {
      curriculumId:entry.id,
      status:"ready",
      sourceBasis:"official-eneegyl-2026-27-exact",
      learnSimply:{
        lead:`Για το μάθημα «${entry.subject}» έχουν χαρτογραφηθεί ${anchors.length} συγκεκριμένες επίσημες ενότητες από την τρέχουσα οδηγία ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27. Η διαδρομή δεν προσθέτει δικά της κεφάλαια: σε βοηθά να προσανατολιστείς στην πραγματική ύλη και μετά να δουλέψεις το ακριβές σημείο με καθοδήγηση.`,
        keyPoints:[
          `Η χαρτογράφηση περιλαμβάνει ${anchors.length} επίσημες ενότητες/στάδια.`,
          ...sample.slice(0,3)
        ]
      },
      qa:[
        {q:"Από πού προκύπτουν οι ενότητες αυτής της διαδρομής;",a:"Από την επίσημη οδηγία ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27 που έχει συνδεθεί με το συγκεκριμένο μάθημα."},
        {q:"Η διαδρομή δημιουργεί επιπλέον κεφάλαια;",a:"Όχι. Χρησιμοποιεί μόνο τις ήδη επαληθευμένες επίσημες ενότητες."},
        {q:"Πώς χρησιμοποιώ την AI Βοήθεια;",a:"Διαλέγω πρώτα την πραγματική ενότητα που δουλεύω και ζητώ εξήγηση, μικρές υποδείξεις ή νέα εξάσκηση πάνω σε αυτήν — όχι έτοιμη λύση."}
      ],
      parentStudy:{
        intro:"Χρησιμοποίησε τη χαρτογράφηση σαν χάρτη. Πρώτα βεβαιωθείτε ότι δουλεύετε τη σωστή επίσημη ενότητα και μετά ζητήστε βοήθεια μόνο γι’ αυτή.",
        steps:[
          "Διάλεξε μαζί με τον μαθητή μία επίσημη ενότητα από τη λίστα.",
          "Σύνδεσέ την με το πραγματικό βιβλίο, φύλλο εργασίας ή σημειώσεις του σχολείου.",
          "Ζήτησε από τον μαθητή να πει με δικά του λόγια τι πιστεύει ότι αφορά.",
          "Αν υπάρχει δυσκολία, χρησιμοποίησε την AI Βοήθεια για μία ερώτηση ή μικρή υπόδειξη τη φορά."
        ]
      },
      practice:[
        "Διάλεξε μία επίσημη ενότητα και γράψε τον τίτλο της όπως εμφανίζεται στη χαρτογράφηση.",
        "Βρες ποια επίσημη ενότητα ταιριάζει στο σχολικό υλικό που έχεις μπροστά σου.",
        "Μετά τη μελέτη, εξήγησε με μία πρόταση τι δούλεψες χωρίς να κοιτάξεις τη λίστα."
      ]
    };
  }

  const ready=[];
  TARGETS.forEach((entry)=>{
    if(!L[entry.id]) L[entry.id]=makeLearning(entry);
    if(!Q[entry.id]){
      Q[entry.id]={
        curriculumId:entry.id,
        status:"ready",
        title:"Μικρός έλεγχος επίσημης ύλης",
        intro:"3 σύντομες ερωτήσεις με 2 επιλογές για να δεις αν βρίσκεις σωστά την ενότητα που δουλεύεις. Δεν είναι βαθμός ούτε τεστ γνώσεων περιεχομένου.",
        successMessage:"Βρίσκεις σωστά τις ενότητες της επίσημης ύλης. Συνέχισε με AI Βοήθεια πάνω στο ακριβές κεφάλαιο που μελετάς.",
        retryMessage:"Ξαναδές τη χαρτογράφηση και δοκίμασε ξανά. Μετά ζήτησε από την AI Βοήθεια να σε καθοδηγήσει στο σημείο που μπερδεύτηκες.",
        questions:makeQuiz(entry)
      };
    }
    ready.push(entry.id);
  });

  window.AITOOLSKIDS_ENEEGYL_BC_EXACT_LEARNING_2026_2027=Object.freeze({
    version:"1.0.0",
    verified:"2026-09-24",
    ready:Object.freeze([...ready]),
    exactOnly:true,
    quizPolicy:"The 3x2 quiz checks navigation/recognition of verified official units only; it does not invent content questions."
  });
})();