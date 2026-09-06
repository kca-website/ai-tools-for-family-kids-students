(function(){
  "use strict";

  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const S=window.SPECIAL_EDUCATION_STATUS;
  if(!C?.entries || !L || !Q || !S?.rows) throw new Error("Special Education base datasets must load before Special Gymnasium data");

  const TIMETABLE="https://www.iep.edu.gr/wp-content/uploads/2026/04/%CE%A9%CE%A0_%CE%93%CE%A5%CE%9C%CE%9D_%CE%95%CE%91%CE%95.pdf";
  const HUB="https://www.minedu.gov.gr/eidiki-entaksiaki-ekpaidefsi";
  const ADAPTATIONS="https://prosvasimo.iep.edu.gr/el/89-yparxon-ekpaideutiko-logismiko";
  const VERIFIED="2026-09-06";

  const subject=(id,label,hours)=>({id,label,hours});
  const shared={
    language:subject("language","Γλωσσική Διδασκαλία",4),
    literature:subject("literature","Νεοελληνική Λογοτεχνία",2),
    ancientLanguage:subject("ancient-language","Αρχαία Ελληνική Γλώσσα",2),
    ancientTranslation:subject("ancient-translation","Αρχαία Ελληνικά από Μετάφραση",2),
    math:subject("math","Μαθηματικά",4),
    history:subject("history","Ιστορία",2),
    religion:subject("religion","Θρησκευτικά / Ηθική",2),
    english:subject("english","Αγγλικά",2),
    pe:subject("pe","Φυσική Αγωγή",2),
    technology:subject("technology","Τεχνολογία",1),
    music:subject("music","Μουσική",1),
    art:subject("art","Καλλιτεχνικά",1)
  };

  window.SPECIAL_GYMNASIUM_2026_2027={
    version:1,
    schoolYear:"2026-2027",
    verificationDate:VERIFIED,
    status:"verified-structure",
    officialHubUrl:HUB,
    timetableSourceUrl:TIMETABLE,
    timetableReference:"Υ.Α. 44101/Δ3 · ΦΕΚ Β΄ 2111/09-04-2026",
    scopeNote:"Το ωρολόγιο πρόγραμμα επαληθεύει τάξεις, μαθήματα και ώρες. Δεν χρησιμοποιείται ως απόδειξη συγκεκριμένων κεφαλαίων διδακτέας ή εξεταστέας ύλης.",
    preliminary:{
      label:"Προκαταρκτική τάξη",
      totalHours:34,
      subjects:[
        subject("greek","Ελληνική Γλώσσα",15),
        subject("math","Μαθηματικά",5),
        subject("communication-support","Υποστηρικτική Επικοινωνία / ΕΝΓ / Εναλλακτική Επικοινωνία",4),
        subject("pe","Φυσική Αγωγή",2),
        subject("arts","Αισθητική Αγωγή",2),
        subject("support-programs","Προγράμματα Υποστήριξης",4),
        subject("skills-labs","Εργαστήρια Δεξιοτήτων",2)
      ]
    },
    grades:{
      a:{label:"Α΄ Γυμνασίου",totalHours:34,subjects:[
        shared.language,shared.literature,shared.ancientLanguage,shared.ancientTranslation,shared.math,
        subject("physics","Φυσική",1),subject("biology","Βιολογία",1),subject("geography","Γεωλογία-Γεωγραφία",1),
        shared.history,shared.religion,shared.english,subject("home-economics","Οικιακή Οικονομία",2),shared.pe,
        shared.technology,subject("informatics","Πληροφορική",2),shared.music,shared.art,subject("skills-labs","Εργαστήρια Δεξιοτήτων",2)
      ]},
      b:{label:"Β΄ Γυμνασίου",totalHours:34,subjects:[
        shared.language,shared.literature,shared.ancientLanguage,shared.ancientTranslation,shared.math,
        subject("physics","Φυσική",2),subject("chemistry","Χημεία",1),subject("biology","Βιολογία",1),subject("geography","Γεωλογία-Γεωγραφία",2),
        shared.history,shared.religion,shared.english,subject("social-civic","Κοινωνική και Πολιτική Αγωγή",1),shared.pe,
        shared.technology,subject("informatics","Πληροφορική",1),shared.music,shared.art,subject("skills-labs","Εργαστήρια Δεξιοτήτων",1)
      ]},
      c:{label:"Γ΄ Γυμνασίου",totalHours:34,subjects:[
        shared.language,shared.literature,shared.ancientLanguage,shared.ancientTranslation,shared.math,
        subject("physics","Φυσική",2),subject("chemistry","Χημεία",1),subject("biology","Βιολογία",1),
        shared.history,shared.religion,shared.english,subject("social-civic","Κοινωνική και Πολιτική Αγωγή",2),subject("economics","Οικονομικά",1),shared.pe,
        shared.technology,subject("informatics","Πληροφορική",1),shared.music,shared.art,subject("skills-labs","Εργαστήρια Δεξιοτήτων",1)
      ]}
    },
    adaptationResources:{
      hub:ADAPTATIONS,
      language:{label:"Προσαρμογές αναλυτικών προγραμμάτων για το μάθημα της Γλώσσας στο Γυμνάσιο",url:ADAPTATIONS},
      math:{label:"Προσαρμογές αναλυτικών προγραμμάτων για τα Μαθηματικά στο Γυμνάσιο",url:ADAPTATIONS},
      sciences:{label:"Προσαρμογές αναλυτικών προγραμμάτων για τις Φυσικές Επιστήμες στο Γυμνάσιο",url:ADAPTATIONS}
    },
    tutorPolicy:{
      genericTopicEl:"Δούλεψε πάνω στο συγκεκριμένο κεφάλαιο, κείμενο ή άσκηση που έχεις μπροστά σου",
      genericTopicEn:"Work on the exact chapter, text or exercise you currently have",
      warningEl:"Η τάξη και το μάθημα είναι επαληθευμένα από το ωρολόγιο 2026-27. Δεν έχει δηλωθεί εδώ ξεχωριστά επαληθευμένο κεφάλαιο Ε.Α.Ε.: ο μαθητής ή ο γονιός πρέπει να δώσει το συγκεκριμένο θέμα/άσκηση.",
      warningEn:"The grade and subject are verified from the 2026-27 timetable. No separate E.A.E. chapter scope is claimed here: the learner or parent should provide the exact topic/exercise."
    }
  };

  function addLearningUnit({id,subjectLabel,adaptationLabel,keyPoints,qa,parentSteps,practice,quiz}){
    if(C.entries[id]) return;
    C.entries[id]={
      id,
      schoolType:"special-gymnasium",
      grade:"A",
      gradeLabel:"Α΄ Γυμνασίου",
      subject:subjectLabel,
      subjectType:"Μαθησιακή υποστήριξη · όχι δήλωση διδακτέας ύλης",
      status:"verified",
      coverageStatus:"support-skill",
      verificationBasis:"official-timetable-plus-eae-adaptation",
      officialTimetableStatus:"verified",
      adaptationResourceStatus:"verified",
      annualInstructionsStatus:"not-claimed",
      verificationDate:VERIFIED,
      protocol:"Υ.Α. 44101/Δ3 · ΦΕΚ Β΄ 2111/09-04-2026",
      sourceTitle:"Ωρολόγιο πρόγραμμα Γυμνασίου Ε.Α.Ε. από το σχολικό έτος 2026-2027",
      sourceUrl:TIMETABLE,
      instructionSourceUrl:HUB,
      adaptationSourceUrl:ADAPTATIONS,
      adaptationSourceTitle:adaptationLabel,
      officialAnchors:[
        `Το μάθημα «${subjectLabel.split(" — ")[0]}» περιλαμβάνεται στην Α΄ Γυμνασίου Ε.Α.Ε. στο ισχύον ωρολόγιο πρόγραμμα 2026-2027.`,
        `Επίσημο υποστηρικτικό υλικό ΙΕΠ/Prosvasimo: ${adaptationLabel}.`,
        "Η ενότητα του site είναι δεξιότητα υποστήριξης της μελέτης και δεν παρουσιάζεται ως κατάλογος της φετινής διδακτέας ή εξεταστέας ύλης."
      ],
      verificationNote:"Επαληθεύτηκαν η σχολική δομή/μάθημα για το 2026-2027 και η ύπαρξη επίσημου υλικού προσαρμογών Ε.Α.Ε. Η συγκεκριμένη μικρή μαθησιακή ενότητα είναι πρωτότυπο υλικό υποστήριξης του site και δεν αντικαθιστά το εξατομικευμένο πρόγραμμα ή τις οδηγίες του/της εκπαιδευτικού."
    };

    L[id]={
      curriculumId:id,status:"ready",
      learnSimply:{lead:keyPoints.lead,keyPoints:keyPoints.items},
      qa,
      parentStudy:{intro:"Στόχος είναι να βοηθήσεις το παιδί να οργανώσει τη σκέψη του, χωρίς να κάνεις την άσκηση αντί γι’ αυτό.",steps:parentSteps},
      practice
    };
    Q[id]={curriculumId:id,status:"ready",...quiz};
  }

  addLearningUnit({
    id:"special-gym-a-language-comprehension",
    subjectLabel:"Γλωσσική Διδασκαλία — καταλαβαίνω την εκφώνηση και βρίσκω τις βασικές πληροφορίες",
    adaptationLabel:"Προσαρμογές αναλυτικών προγραμμάτων για το μάθημα της Γλώσσας στο Γυμνάσιο",
    keyPoints:{lead:"Πριν γράψουμε απάντηση, ξεκαθαρίζουμε τι ακριβώς ζητά η εκφώνηση και ποιες πληροφορίες του κειμένου είναι πραγματικά χρήσιμες.",items:[
      "Διαβάζω πρώτα ολόκληρη την εκφώνηση χωρίς να βιαστώ να απαντήσω.",
      "Κυκλώνω ή λέω με δικά μου λόγια το ρήμα που δείχνει τι πρέπει να κάνω: βρες, εξήγησε, σύγκρινε, γράψε.",
      "Ψάχνω στο κείμενο μόνο τις πληροφορίες που απαντούν σε αυτό που ζητείται.",
      "Απαντώ με μικρή καθαρή πρόταση και μετά ελέγχω αν πράγματι απάντησα στην ερώτηση."
    ]},
    qa:[
      {q:"Τι κάνω πρώτο όταν μια εκφώνηση μου φαίνεται μεγάλη;",a:"Τη διαβάζω ολόκληρη και βρίσκω ποια λέξη μου λέει τι πρέπει να κάνω."},
      {q:"Αν η ερώτηση λέει «σύγκρινε», αρκεί να περιγράψω μόνο το ένα πράγμα;",a:"Όχι. Χρειάζεται να κοιτάξω και τα δύο και να πω ομοιότητα ή/και διαφορά."},
      {q:"Πρέπει να αντιγράψω όλη την παράγραφο;",a:"Όχι. Επιλέγω τη βασική πληροφορία και απαντώ όσο γίνεται με δικά μου λόγια."}
    ],
    parentSteps:[
      "Διάβασε την εκφώνηση μαζί του μία φορά χωρίς να δώσεις απάντηση.",
      "Ρώτησε: «Ποια λέξη σου λέει τι πρέπει να κάνεις;».",
      "Ζήτησε να δείξει στο κείμενο μία μόνο πληροφορία που χρειάζεται.",
      "Στο τέλος ρώτησε: «Η πρότασή σου απαντά ακριβώς σε αυτό που ζητάει;»."
    ],
    practice:[
      "Σε μια εκφώνηση που λέει «Βρες δύο λόγους…», υπογράμμισε τη λέξη που δείχνει την ενέργεια και τον αριθμό των στοιχείων που χρειάζονται.",
      "Πάρε μια μικρή παράγραφο από το βιβλίο σου και πες την κύρια πληροφορία με μία πρόταση.",
      "Γράψε μία σύντομη απάντηση και μετά έλεγξε αν περιέχει πληροφορία που δεν χρειάζεται."
    ],
    quiz:{
      title:"Μικρό διαγνωστικό κατανόησης εκφώνησης",
      intro:"Τρεις σύντομες ερωτήσεις. Δεν είναι σχολικός βαθμός.",
      successMessage:"Ξεχωρίζεις τι ζητά η εκφώνηση και πώς βρίσκουμε τη χρήσιμη πληροφορία.",
      retryMessage:"Ξαναδές τα δύο βήματα: «τι μου ζητά;» και «ποια πληροφορία χρειάζομαι;». Μετά ξαναδοκίμασε.",
      questions:[
        {q:"Η εκφώνηση λέει «Σύγκρινε τους δύο ήρωες». Τι πρέπει να κάνεις;",options:["Να βρεις ομοιότητες ή/και διαφορές και των δύο","Να γράψεις μόνο ποιος σου αρέσει περισσότερο","Να αντιγράψεις όλο το κείμενο"],correctIndex:0},
        {q:"Ποιο είναι καλό πρώτο βήμα σε μεγάλη εκφώνηση;",options:["Να βρω τη λέξη που δείχνει τι πρέπει να κάνω","Να γράψω αμέσως την πρώτη σκέψη","Να διαβάσω μόνο την τελευταία λέξη"],correctIndex:0},
        {q:"Όταν η απάντηση βρίσκεται στο κείμενο, τι βοηθά περισσότερο;",options:["Να εντοπίσω τη σχετική πληροφορία και να απαντήσω καθαρά","Να αντιγράψω όλες τις παραγράφους","Να προσθέσω άσχετες πληροφορίες"],correctIndex:0}
      ]
    }
  });

  addLearningUnit({
    id:"special-gym-a-math-problem-reading",
    subjectLabel:"Μαθηματικά — καταλαβαίνω τι ζητά ένα πρόβλημα πριν κάνω πράξεις",
    adaptationLabel:"Προσαρμογές αναλυτικών προγραμμάτων για τα Μαθηματικά στο Γυμνάσιο",
    keyPoints:{lead:"Σε ένα μαθηματικό πρόβλημα δεν ξεκινάμε από την πράξη. Πρώτα ξεχωρίζουμε τι ξέρουμε, τι ζητείται και ποια σχέση συνδέει τα δεδομένα.",items:[
      "Λέω με δικά μου λόγια τι ζητά το πρόβλημα.",
      "Γράφω ή κυκλώνω μόνο τα δεδομένα που χρειάζομαι.",
      "Σκέφτομαι ποια σχέση ή πράξη ταιριάζει πριν αρχίσω υπολογισμούς.",
      "Στο τέλος ελέγχω αν η απάντηση έχει νόημα και αν απαντά στο ζητούμενο."
    ]},
    qa:[
      {q:"Γιατί δεν κάνουμε αμέσως πράξη;",a:"Επειδή πρώτα πρέπει να ξέρουμε τι ζητείται και ποια δεδομένα συνδέονται με αυτό."},
      {q:"Χρειάζονται πάντα όλοι οι αριθμοί της εκφώνησης;",a:"Όχι απαραίτητα. Ελέγχουμε ποιοι αριθμοί είναι χρήσιμοι για το συγκεκριμένο ερώτημα."},
      {q:"Τι ελέγχω στο τέλος;",a:"Αν το αποτέλεσμα είναι λογικό, έχει σωστή μονάδα όπου χρειάζεται και απαντά στο ζητούμενο."}
    ],
    parentSteps:[
      "Κάλυψε για λίγο τους αριθμούς και ρώτησε: «Τι συμβαίνει σε αυτό το πρόβλημα;».",
      "Μετά ρώτησε: «Τι ακριβώς θέλουμε να βρούμε;».",
      "Ζήτησε να κυκλώσει μόνο τα δεδομένα που πιστεύει ότι χρειάζεται και να εξηγήσει γιατί.",
      "Μην πεις την πράξη. Ρώτησε: «Τι θα άλλαζε ή τι θα συνδύαζες για να βρεις αυτό που ζητά;»."
    ],
    practice:[
      "Πάρε ένα πρόβλημα από το βιβλίο σου και γράψε χωριστά: Δεδομένα / Ζητούμενο.",
      "Χωρίς να λύσεις το πρόβλημα, εξήγησε ποια πράξη ή σχέση σκέφτεσαι και γιατί.",
      "Μετά τη λύση, κάνε έναν γρήγορο έλεγχο: είναι το αποτέλεσμα λογικό για την ιστορία του προβλήματος;"
    ],
    quiz:{
      title:"Μικρό διαγνωστικό ανάγνωσης μαθηματικού προβλήματος",
      intro:"Τρεις ερωτήσεις για το πώς οργανώνουμε ένα πρόβλημα πριν το λύσουμε.",
      successMessage:"Ξεχωρίζεις δεδομένα, ζητούμενο και έλεγχο αποτελέσματος.",
      retryMessage:"Ξαναδές τη σειρά: ζητούμενο → χρήσιμα δεδομένα → σχέση/πράξη → έλεγχος.",
      questions:[
        {q:"Πριν κάνεις πράξεις σε ένα πρόβλημα, τι είναι πιο χρήσιμο να βρεις;",options:["Τι ακριβώς ζητά το πρόβλημα","Ποιος αριθμός είναι μεγαλύτερος","Πόσες γραμμές έχει η εκφώνηση"],correctIndex:0},
        {q:"Αν μια εκφώνηση έχει πολλούς αριθμούς, τι κάνεις;",options:["Επιλέγω ποιοι συνδέονται με το ζητούμενο","Χρησιμοποιώ υποχρεωτικά όλους","Προσθέτω πάντα όλους"],correctIndex:0},
        {q:"Μετά τον υπολογισμό, ποιος έλεγχος είναι χρήσιμος;",options:["Αν η απάντηση είναι λογική και απαντά στο ζητούμενο","Αν χρησιμοποίησα το πιο μεγάλο νούμερο","Αν η πράξη είχε πολλά βήματα"],correctIndex:0}
      ]
    }
  });

  C.schools.specialGymnasium=Object.assign({},C.schools.specialGymnasium,{
    status:"active-verified-structure",
    note:"Το ωρολόγιο 2026-2027 έχει επαληθευτεί. Η πλήρης λίστα τάξεων/μαθημάτων εμφανίζεται χωριστά από τη λεπτομερή διδακτέα ύλη."
  });

  S.rows=S.rows.filter((row)=>row.school!=="Ειδικό Γυμνάσιο");
  S.rows.push(
    {school:"Ειδικό Γυμνάσιο",scope:"Α΄-Γ΄ · επίσημη δομή μαθημάτων 2026-2027",curriculum:"verified",learning:"indexed",quiz:"indexed",tutorContext:"verified"},
    {school:"Ειδικό Γυμνάσιο",scope:"Α΄ · Γλωσσική Διδασκαλία — καταλαβαίνω την εκφώνηση και βρίσκω τις βασικές πληροφορίες",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"},
    {school:"Ειδικό Γυμνάσιο",scope:"Α΄ · Μαθηματικά — καταλαβαίνω τι ζητά ένα πρόβλημα πριν κάνω πράξεις",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"}
  );
})();