(function(){
  "use strict";
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const Q=window.SPECIAL_EDUCATION_QUIZZES;
  const S=window.SPECIAL_EDUCATION_STATUS;
  if(!C?.entries || !L || !Q || !S?.rows) throw new Error("Special Education base datasets must load before economy sector data");

  const id="eneegyl-b-economy-accounting-basics";
  if(!C.entries[id]){
    C.entries[id]={
      id,
      schoolType:"eneegyl",
      grade:"B",
      gradeLabel:"Β΄ Λυκείου",
      sector:"Διοίκηση και Οικονομία",
      subject:"Αρχές Λογιστικής — επιχείρηση, περιουσία, Ενεργητικό και Παθητικό",
      subjectType:"Μάθημα Τομέα · επαληθευμένη μερική κάλυψη",
      status:"verified",
      coverageStatus:"partial",
      verificationBasis:"current-exam-syllabus",
      currentExamSyllabusStatus:"verified",
      annualInstructionsStatus:"source-indexed",
      verificationDate:"2026-09-06",
      protocol:"99340/Δ3 · 23/07/2026 · ΦΕΚ 4610/Β/24-07-2026",
      sourceTitle:"Εξεταστέα ύλη και τρόπος αξιολόγησης Β΄ τάξης Λυκείου ΕΝ.Ε.Ε.ΓΥ.-Λ. για το σχολικό έτος 2026-2027",
      sourceUrl:"https://www.minedu.gov.gr/site/70556-27-07-26-kathorismos-ton-graptos-exetazomenon-mathematon-stis-proagogikes-kai-apolyteries-exetaseis-ton-a-b-g-kai-d-taxeon-epal-pepal-kai-ton-lykeion-en-e-e-gy-l-gia-ten-trapeza-thematon-diabathmisemes-dyskolias",
      instructionSourceUrl:"https://www.minedu.gov.gr/protovathmia-defterovathmia/lykeio-draseis?catid=1183&id=70752%3A03-09-26-enkyklioi-me-ten-yle-odegies-mathematon-eneegy-l&view=article",
      textbookUrl:"https://ebooks.edu.gr/ebooks/v/html/8547/4714/Arches-Logistikis_A-EPAL_html-apli/index1_3.html",
      officialAnchors:[
        "Βιβλίο αναφοράς: «Αρχές Λογιστικής» των Κοντάκου Αρ., Μαργαρώνη Κ., Ζαρίφη Αν.",
        "Κεφάλαιο 1: Εισαγωγή – Βασικές Έννοιες",
        "1.1 Ανάγκες – αγαθά. Οικονομικοί Οργανισμοί",
        "1.2 Οι επιχειρήσεις",
        "1.3 Η περιουσία της επιχείρησης – Διακρίσεις της περιουσίας – Εφαρμογή",
        "1.4 Διακρίσεις του Ενεργητικού και του Παθητικού",
        "Η εξεταστέα ύλη του μαθήματος συνεχίζεται σε επόμενες ενότητες και κεφάλαια· εδώ ανοίγουμε μόνο το πρώτο θεμέλιο"
      ],
      verificationNote:"Η μαθησιακή ενότητα περιορίζεται σκόπιμα στις βασικές έννοιες του Κεφαλαίου 1. Δεν παρουσιάζεται ως πλήρης κάλυψη της εξεταστέας ύλης των Αρχών Λογιστικής. Οι απλές διατυπώσεις Ενεργητικού και Παθητικού ακολουθούν το επίσημο σχολικό βιβλίο."
    };

    L[id]={
      curriculumId:id,
      status:"ready",
      learnSimply:{
        lead:"Στη Λογιστική ξεκινάμε ξεχωρίζοντας τι έχει ή χρησιμοποιεί μια επιχείρηση και από πού προέρχονται οι πόροι που χρηματοδοτούν αυτά τα μέσα. Πρώτα καταλαβαίνουμε τις έννοιες και μετά περνάμε σε πίνακες και λογιστικές εγγραφές.",
        keyPoints:[
          "Η επιχείρηση έχει περιουσία που περιλαμβάνει μέσα δράσης, απαιτήσεις και υποχρεώσεις.",
          "Ενεργητικό είναι τα μέσα δράσης της επιχείρησης: αξίες και απαιτήσεις που χρησιμοποιεί για να πετύχει τον σκοπό της.",
          "Παθητικό είναι οι πηγές προέλευσης του Ενεργητικού, δηλαδή οι υποχρεώσεις προς τον φορέα της επιχείρησης και προς τρίτους.",
          "Δεν αρκεί να απομνημονεύουμε τις λέξεις· πρέπει να μπορούμε να βάζουμε ένα απλό παράδειγμα στη σωστή κατηγορία."
        ]
      },
      qa:[
        {q:"Τι είναι το Ενεργητικό με απλά λόγια;",a:"Είναι τα μέσα δράσης της επιχείρησης — οι αξίες και οι απαιτήσεις που χρησιμοποιεί για τη λειτουργία της."},
        {q:"Τι είναι το Παθητικό;",a:"Είναι οι πηγές από τις οποίες προέρχεται το Ενεργητικό, δηλαδή οι υποχρεώσεις προς τον φορέα της επιχείρησης και προς τρίτους."},
        {q:"Ένα μηχάνημα που χρησιμοποιεί η επιχείρηση σε ποια πλευρά ανήκει;",a:"Ως μέσο δράσης της επιχείρησης ανήκει στο Ενεργητικό."},
        {q:"Γιατί μαθαίνουμε πρώτα αυτές τις κατηγορίες;",a:"Γιατί πάνω σε αυτές στηρίζεται η επόμενη οργάνωση της οικονομικής κατάστασης και των λογαριασμών της επιχείρησης."}
      ],
      parentStudy:{
        intro:"Δούλεψε με 2-3 καθημερινά αντικείμενα ή παραδείγματα και ζήτησε από το παιδί να εξηγεί το «γιατί», όχι μόνο να λέει μία κατηγορία.",
        steps:[
          "Πες: «Μια μικρή επιχείρηση έχει ταμείο και ένα μηχάνημα». Ρώτησε ποια από αυτά είναι μέσα δράσης.",
          "Εξήγησε ότι ένα χρέος προς προμηθευτή δεν είναι αντικείμενο που χρησιμοποιούμε, αλλά υποχρέωση προς τρίτο.",
          "Ζήτησε να πει με δικά του λόγια τη διαφορά Ενεργητικού και Παθητικού χωρίς να κοιτάξει τον ορισμό.",
          "Αν μπερδευτεί, γύρνα στο ερώτημα: «Τι χρησιμοποιεί η επιχείρηση; Από πού προήλθαν οι πόροι;»."
        ]
      },
      practice:[
        "Μια επιχείρηση έχει μετρητά στο ταμείο. Είναι πιο κοντά στο Ενεργητικό ή στο Παθητικό; Εξήγησε γιατί.",
        "Μια επιχείρηση οφείλει χρήματα σε προμηθευτή. Σε ποια πλευρά θα τοποθετούσες αυτή την υποχρέωση;",
        "Γράψε ένα δικό σου παράδειγμα για μέσο δράσης της επιχείρησης και ένα για υποχρέωση προς τρίτο."
      ]
    };

    Q[id]={
      curriculumId:id,
      status:"ready",
      title:"Έλεγξε τις πρώτες έννοιες της Λογιστικής",
      intro:"Τρεις μικρές ερωτήσεις για Ενεργητικό και Παθητικό. Δεν είναι σχολικός βαθμός.",
      successMessage:"Ξεχωρίζεις τις πρώτες βασικές κατηγορίες. Το επόμενο βήμα θα είναι η οικονομική κατάσταση και ο ισολογισμός όταν χαρτογραφηθούν ως ξεχωριστή ενότητα.",
      retryMessage:"Ξαναδές τα δύο ερωτήματα: «Τι χρησιμοποιεί η επιχείρηση;» και «Από πού προέρχονται οι πόροι;» και μετά ξαναδοκίμασε.",
      questions:[
        {q:"Ποιο από τα παρακάτω είναι μέσο δράσης μιας επιχείρησης;",options:["Ένα μηχάνημα που χρησιμοποιεί στη λειτουργία της","Μια υποχρέωση προς προμηθευτή"],correctIndex:0},
        {q:"Σύμφωνα με το σχολικό βιβλίο, το Ενεργητικό περιλαμβάνει κυρίως…",options:["αξίες και απαιτήσεις της επιχείρησης","μόνο τις υποχρεώσεις προς τρίτους"],correctIndex:0},
        {q:"Το Παθητικό περιγράφει…",options:["τις πηγές προέλευσης του Ενεργητικού","μόνο τα μηχανήματα και τα εμπορεύματα"],correctIndex:0}
      ]
    };

    const source=C.sourceIndex.find(x=>x.id==="eneegyl-2026-economy");
    if(source){
      source.coverageStatus="partial";
      source.curriculumIds=[...new Set([...(source.curriculumIds||[]),id])];
    }

    const row={school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Β΄ · Αρχές Λογιστικής — επιχείρηση, περιουσία, Ενεργητικό και Παθητικό",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"};
    const firstPending=S.rows.findIndex(r=>r.learning!=="verified");
    S.rows.splice(firstPending<0?S.rows.length:firstPending,0,row);
  }

  // Bridge the already-verified 2026-27 Gymnasium curriculum into the
  // Special Gymnasium and the Gymnasium part of EN.E.E.GY.-L. for selection.
  // These are support mappings from the verified general Gymnasium guidance,
  // not a claim of a separate special-education syllabus.
  const CAT=window.AITOOLSKIDS_TUTOR_CATALOG;
  const SG=window.SPECIAL_GYMNASIUM_2026_2027;
  const EG=window.ENEEGYL_2026_2027_STRUCTURE;
  if(CAT){
    const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[΄’'·.,:;()\/\\-]/g,' ').replace(/\s+/g,' ').trim();
    const aliases={
      biology:['βιολογ'],physics:['φυσικ'],chemistry:['χημει'],math:['μαθηματικ','αλγεβρ','γεωμετρ'],
      language:['γλωσσ','νεοελλην'],literature:['λογοτεχν'],geography:['γεωλογ','γεωγραφ'],history:['ιστορι'],
      religion:['θρησκευ'],english:['αγγλικ'],technology:['τεχνολογ'],informatics:['πληροφορ']
    };
    const subjectMatch=(a,b,id)=>{
      const x=norm(a),y=norm(b); if(x.includes(y)||y.includes(x)) return true;
      return (aliases[id]||[]).some(k=>x.includes(norm(k))||y.includes(norm(k)));
    };
    const generalSubjects=grade=>CAT.getSubjects?.('middle',grade)||[];
    const mapTopics=(subjects,subject)=>{
      const found=subjects.find(s=>subjectMatch(s.subjectLabelEl,subject.label,subject.id));
      return found?(found.topics||[]).map(t=>t.labelEl).filter(Boolean):[];
    };
    const addEntry=(schoolType,grade,gradeLabel,subject,topics,suffix)=>{
      if(!topics.length) return;
      const key=`bridge-${schoolType}-${suffix}-${subject.id}`.replace(/[^a-z0-9-]/gi,'-').toLowerCase();
      if(C.entries[key]) return;
      C.entries[key]={
        id:key,schoolType,grade,gradeLabel,subject:subject.label,
        subjectType:'Υποστηρικτική χαρτογράφηση από επαληθευμένες οδηγίες Γυμνασίου 2026–27',
        status:'verified-reference',coverageStatus:'reference',verificationBasis:'general-gymnasium-2026-27',
        verificationDate:'2026-09-12',officialAnchors:topics,
        verificationNote:'Οι ενότητες προέρχονται από την επαληθευμένη ύλη Γυμνασίου 2026–27 του site και χρησιμοποιούνται ως πλαίσιο επιλογής. Δεν παρουσιάζονται ως ξεχωριστή ειδική εξεταστέα ύλη.'
      };
    };

    if(SG){
      Object.entries(SG.grades||{}).forEach(([gid,g])=>{
        if(!['a','b','c'].includes(gid)) return;
        const gen=generalSubjects(gid);
        (g.subjects||[]).forEach(subject=>addEntry('special-gymnasium',gid.toUpperCase(),g.label,subject,mapTopics(gen,subject),`gym-${gid}`));
      });
    }

    if(EG){
      ['gym-a','gym-b','gym-c'].forEach(gid=>{
        const g=EG.grades?.[gid]; if(!g) return;
        const short=gid.slice(-1),gen=generalSubjects(short);
        (g.subjects||[]).forEach(subject=>addEntry('eneegyl',short.toUpperCase(),g.label,subject,mapTopics(gen,subject),gid));
      });
    }
  }
})();