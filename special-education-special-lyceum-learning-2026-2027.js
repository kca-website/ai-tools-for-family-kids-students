(function(){
  "use strict";

  const SLA=window.AITOOLSKIDS_SPECIAL_LYCEUM_ANNUAL_2026_2027;
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  if(!SLA?.entries || !C?.entries || !L || !Q) return;

  const EXACT=Object.values(SLA.entries).filter((entry)=>
    entry?.status==="verified" &&
    entry?.coverageStatus==="exact" &&
    entry?.frameworkOnly!==true &&
    Array.isArray(entry?.officialAnchors) &&
    entry.officialAnchors.length>0
  );

  function sampleAnchors(entry,count=5){
    const a=entry.officialAnchors;
    if(a.length<=count) return [...a];
    const picks=[0,Math.floor((a.length-1)*.25),Math.floor((a.length-1)*.5),Math.floor((a.length-1)*.75),a.length-1];
    return [...new Set(picks)].map(i=>a[i]).slice(0,count);
  }

  function makeQuiz(entry){
    const a=entry.officialAnchors;
    const q=[];
    const first=a[0], middle=a[Math.floor(a.length/2)], last=a[a.length-1];
    const distractor=(correct,index)=>{
      const candidate=a[(index+Math.max(1,Math.floor(a.length/3)))%a.length];
      return candidate===correct ? "Δεν περιλαμβάνεται στην επαληθευμένη λίστα της συγκεκριμένης διαδρομής" : candidate;
    };
    [first,middle,last].forEach((correct,index)=>{
      q.push({
        q:"Ποια από τις δύο επιλογές ανήκει στην επαληθευμένη ύλη αυτής της διαδρομής;",
        options:[correct,distractor(correct,index)],
        correctIndex:0
      });
    });
    return q;
  }

  function baseLearning(entry){
    const samples=sampleAnchors(entry);
    return {
      curriculumId:entry.id,
      status:"ready",
      sourceBasis:"official-special-lyceum-2026-27-exact",
      learnSimply:{
        lead:`Για το μάθημα «${entry.subject}» η επίσημη οδηγία Ε.Α.Ε. 2026–27 δίνει συγκεκριμένη, επαληθευμένη λίστα ύλης. Η διαδρομή εδώ δεν προσθέτει δικά της κεφάλαια: οργανώνει την επίσημη λίστα σε μικρότερα βήματα ώστε να ξέρεις τι μελετάς και τι όχι.`,
        keyPoints:[
          `Η επαληθευμένη λίστα περιλαμβάνει ${entry.officialAnchors.length} ενότητες/επιλογές.`,
          `Ενδεικτικά σημεία της επίσημης λίστας: ${samples.slice(0,2).join(" · ")}.`,
          `Η πλήρης λίστα παραμένει ορατή στη χαρτογράφηση της σελίδας και συνδέεται με την επίσημη πηγή.`
        ]
      },
      qa:[
        {q:"Από πού προκύπτουν οι ενότητες αυτής της διαδρομής;",a:"Από την επίσημη οδηγία Ε.Α.Ε. 2026–27 που είναι συνδεδεμένη με το συγκεκριμένο μάθημα."},
        {q:"Η διαδρομή προσθέτει δικά της κεφάλαια;",a:"Όχι. Χρησιμοποιεί μόνο τις επαληθευμένες επίσημες ενότητες που υπάρχουν ήδη στη χαρτογράφηση."},
        {q:"Τι κάνω αν το μάθημα που έχω μπροστά μου δεν ταιριάζει με την εμφανιζόμενη ενότητα;",a:"Χρησιμοποιώ την επίσημη πηγή και το πραγματικό κεφάλαιο ή την άσκηση που μου έχει δώσει ο/η εκπαιδευτικός, χωρίς να θεωρώ ότι η AI υπερισχύει της σχολικής οδηγίας."}
      ],
      parentStudy:{
        intro:"Χρησιμοποίησε την επίσημη λίστα σαν χάρτη και όχι σαν λίστα αποστήθισης. Δούλεψε μία ενότητα τη φορά.",
        steps:[
          "Άνοιξε μαζί με τον μαθητή τη χαρτογράφηση και διάλεξε μία μόνο επίσημη ενότητα.",
          "Ζήτησε να διαβάσει τον τίτλο και να πει με δικά του λόγια τι καταλαβαίνει ότι θα μελετήσει.",
          "Σύνδεσε τη σχολική σελίδα/άσκηση που έχει μπροστά του με τον αντίστοιχο επίσημο τίτλο.",
          "Στο τέλος έλεγξε μόνο αν μπορεί να αναγνωρίσει σωστά σε ποια ενότητα δουλεύει."
        ]
      },
      practice:[
        `Διάλεξε μία από τις ${entry.officialAnchors.length} επίσημες ενότητες και γράψε τον τίτλο της ακριβώς όπως εμφανίζεται.`,
        "Βρες στη σχολική σου εργασία ποια επίσημη ενότητα ταιριάζει περισσότερο.",
        "Διάλεξε δύο επίσημες ενότητες και εξήγησε ποια δουλεύεις τώρα και ποια όχι ακόμη."
      ]
    };
  }

  function informaticsLearning(entry){
    const base=baseLearning(entry);
    const anchors=entry.officialAnchors;
    const groups=[];
    const addGroup=(name,re)=>{const found=anchors.filter(x=>re.test(x));if(found.length)groups.push(`${name}: ${found.slice(0,3).join(" · ")}`);};
    addGroup("Προγραμματισμός",/προγραμματισ|αλγόριθμ|αντικειμενοστρεφ/i);
    addGroup("Web / Διαδίκτυο",/web|διαδίκτυ|html|css|ιστό/i);
    addGroup("Νέφος / συνεργασία",/νέφ|συνεργασία|απόσταση/i);
    addGroup("Ασφάλεια / δεδομένα",/ασφάλ|ιδιωτικ|δεδομένα|πνευματικ/i);
    addGroup("Συστήματα / δίκτυα",/λειτουργικ|πληροφοριακ|δίκτυ|τεχνητή νοημοσύνη/i);
    if(groups.length){
      base.learnSimply.keyPoints=[
        `Η επίσημη λίστα περιλαμβάνει ${anchors.length} συγκεκριμένες ενότητες/επιλογές.`,
        ...groups.slice(0,3)
      ];
      base.practice=[
        "Διάλεξε από την επίσημη λίστα μία ενότητα προγραμματισμού ή αλγορίθμων και γράψε τον ακριβή τίτλο της.",
        "Διάλεξε μία ενότητα Web/Διαδικτύου ή συστημάτων και σύνδεσέ την με το κεφάλαιο που κάνεις τώρα.",
        "Αν υπάρχει ενότητα ασφάλειας ή προσωπικών δεδομένων στη λίστα σου, βρες τον ακριβή τίτλο της."
      ];
    }
    return base;
  }

  function biologyLearning(entry){
    const base=baseLearning(entry);
    const anchors=entry.officialAnchors;
    const themes=[];
    const add=(name,re)=>{const found=anchors.filter(x=>re.test(x));if(found.length)themes.push(`${name}: ${found.slice(0,3).join(" · ")}`);};
    add("Κύτταρο / οργανισμός",/κύτταρ|ιστ|όργανα|οργανισμ/i);
    add("Κυκλοφορικό",/κυκλοφορ|καρδιά|αίμα|αγγεία/i);
    add("Νευρικό",/νευρ/i);
    add("Αναπαραγωγή / ανάπτυξη",/αναπαραγωγ|γονιμοπ|έμβρυ|τοκετ/i);
    add("Οικολογία / μικροοργανισμοί / βιοτεχνολογία",/οικολογ|μικροοργαν|βιοτεχνολογ|γονιδ|dna|rna/i);
    if(themes.length){
      base.learnSimply.keyPoints=[
        `Η επίσημη λίστα περιλαμβάνει ${anchors.length} συγκεκριμένες ενότητες/παραγράφους.`,
        ...themes.slice(0,4)
      ];
      base.practice=[
        "Διάλεξε μία επίσημη ενότητα Βιολογίας και γράψε σε ποιο κεφάλαιο ή θέμα ανήκει.",
        "Βρες δύο επίσημες ενότητες που ανήκουν στην ίδια ευρύτερη θεματική.",
        "Έλεγξε στην επίσημη λίστα αν το κεφάλαιο που κάνεις στο σχολείο περιλαμβάνεται πριν χρησιμοποιήσεις την AI για εξάσκηση."
      ];
    }
    return base;
  }

  function latinLearning(entry){
    const base=baseLearning(entry);
    const anchors=entry.officialAnchors;
    base.learnSimply.lead=`Για τα «${entry.subject}» η επίσημη οδηγία 2026–27 ορίζει συγκεκριμένο εύρος ενοτήτων. Επειδή η πηγή χρησιμοποιεί κυρίως επίσημη αρίθμηση και όχι πάντα περιγραφικούς τίτλους, δεν επινοούμε ονόματα ή γραμματικά θέματα που δεν αναφέρονται ρητά.`;
    base.learnSimply.keyPoints=[
      `Η επαληθευμένη λίστα περιλαμβάνει ${anchors.length} επίσημες ενότητες/μαθήματα.`,
      `Αρχή της λίστας: ${anchors[0]}.`,
      `Τέλος της λίστας: ${anchors[anchors.length-1]}.`
    ];
    base.practice=[
      "Γράψε ποια επίσημη ενότητα/μάθημα δουλεύεις τώρα, χρησιμοποιώντας την αρίθμηση της λίστας.",
      "Βρες την προηγούμενη και την επόμενη επίσημη ενότητα στη σειρά.",
      "Έλεγξε ότι η ενότητα που μελετάς βρίσκεται μέσα στο επαληθευμένο εύρος της τάξης σου."
    ];
    return base;
  }

  const ready=[];
  EXACT.forEach((entry)=>{
    let learning=baseLearning(entry);
    if(entry.subjectId==="informatics") learning=informaticsLearning(entry);
    else if(entry.subjectId==="biology") learning=biologyLearning(entry);
    else if(entry.subjectId==="latin") learning=latinLearning(entry);

    L[entry.id]=learning;
    Q[entry.id]={
      curriculumId:entry.id,
      status:"ready",
      title:"Μικρός έλεγχος επίσημης ύλης",
      intro:"3 σύντομες ερωτήσεις με 2 επιλογές. Δεν είναι βαθμός και δεν αντικαθιστά σχολικό τεστ.",
      successMessage:"Αναγνωρίζεις σωστά βασικά σημεία της επαληθευμένης επίσημης λίστας.",
      retryMessage:"Άνοιξε ξανά τη χαρτογράφηση της επίσημης ύλης και ξαναδοκίμασε μία ενότητα τη φορά.",
      questions:makeQuiz(entry)
    };
    ready.push(entry.id);
  });

  window.AITOOLSKIDS_SPECIAL_LYCEUM_LEARNING_2026_2027=Object.freeze({
    version:"1.0.0",
    verified:"2026-09-24",
    ready:Object.freeze([...ready]),
    exactOnly:true,
    note:"Learning paths and 3x2 quizzes are enabled only for exact section-level mappings from official E.A.E. 2026-27 guidance. Framework-only mappings remain excluded."
  });
})();