(function(){
  "use strict";

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function renderMarkdown(text){
    const lines=String(text||"").replace(/\r\n?/g,"\n").split("\n");
    let html="", list=null;
    const closeList=()=>{ if(list){ html += list==="ol" ? "</ol>" : "</ul>"; list=null; } };
    const inline=(s)=>escapeHtml(s)
      .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
      .replace(/__([^_]+)__/g,"<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g,"<em>$1</em>");

    for(const raw of lines){
      const line=raw.trim();
      if(!line){ closeList(); continue; }
      let m;
      if((m=line.match(/^#{1,3}\s+(.+)$/))){
        closeList(); html += "<h4>"+inline(m[1])+"</h4>"; continue;
      }
      if((m=line.match(/^\d+[.)]\s+(.+)$/))){
        if(list!=="ol"){ closeList(); html+="<ol>"; list="ol"; }
        html += "<li>"+inline(m[1])+"</li>"; continue;
      }
      if((m=line.match(/^[-•]\s+(.+)$/))){
        if(list!=="ul"){ closeList(); html+="<ul>"; list="ul"; }
        html += "<li>"+inline(m[1])+"</li>"; continue;
      }
      closeList();
      html += "<p>"+inline(line)+"</p>";
    }
    closeList();
    return html || "<p>Δεν επιστράφηκε αποτέλεσμα.</p>";
  }


  let pdfReaderPromise=null;
  function ensurePdfReader(){
    if(window.AITOOLSKIDS_PDF) return Promise.resolve(window.AITOOLSKIDS_PDF);
    if(pdfReaderPromise) return pdfReaderPromise;
    pdfReaderPromise=new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src="/pdf-text-reader.js";
      s.async=true;
      s.onload=()=>window.AITOOLSKIDS_PDF?resolve(window.AITOOLSKIDS_PDF):reject(new Error("PDF reader unavailable"));
      s.onerror=()=>reject(new Error("PDF reader unavailable"));
      document.head.appendChild(s);
    });
    return pdfReaderPromise;
  }

  const CONFIG={
    pdf:{
      title:"Δούλεψε πάνω στις σημειώσεις σου",
      intro:"Ανέβασε PDF ή επικόλλησε ένα μικρό απόσπασμα/τις δικές σου σημειώσεις. Το PDF διαβάζεται τοπικά στον browser και ο βοηθός δουλεύει πάνω στο εξαγόμενο κείμενο.",
      label:"Κείμενο ή σημειώσεις",
      placeholder:"Επικόλλησε εδώ ένα απόσπασμα από τις σημειώσεις σου ή γράψε με δικά σου λόγια τι περιέχουν.",
      modes:[
        ["understand","Εξήγησέ μου τι λέει με απλά λόγια"],
        ["questions","Φτιάξε ερωτήσεις κατανόησης"],
        ["structure","Οργάνωσέ το σε βασικές ιδέες"],
        ["review","Φτιάξε μικρό πλάνο επανάληψης"]
      ],
      prompts:{
        understand:"Εξήγησε το υλικό με απλά λόγια, χωρίς να προσθέσεις πληροφορίες που δεν υπάρχουν στο κείμενο. Στο τέλος κάνε 1 ερώτηση ελέγχου κατανόησης.",
        questions:"Φτιάξε 5 σύντομες ερωτήσεις κατανόησης αποκλειστικά από το υλικό. Μην δώσεις αμέσως τις απαντήσεις.",
        structure:"Οργάνωσε το υλικό σε 3-6 βασικές ιδέες και υποσημεία. Μην προσθέσεις νέα πραγματολογικά στοιχεία.",
        review:"Φτιάξε ένα μικρό πλάνο επανάληψης με σειρά προτεραιότητας βασισμένο μόνο στο υλικό."
      },
      system:"Είσαι βοηθός μελέτης πάνω σε υλικό που παρέχει ο χρήστης. Μην εισάγεις άγνωστα γεγονότα. Αν κάτι δεν υπάρχει στο υλικό, πες ότι δεν υποστηρίζεται από το κείμενο.",
      subject:"Μελέτη PDF/σημειώσεων"
    },
    research:{
      title:"Οργάνωσε την έρευνά σου",
      intro:"Γράψε θέμα, ερευνητικό ερώτημα ή έναν ισχυρισμό. Ο βοηθός οργανώνει την έρευνα· δεν προσποιείται ότι έκανε web search.",
      label:"Θέμα ή ισχυρισμός",
      placeholder:"π.χ. Πώς επηρέασε η βιομηχανική επανάσταση τις πόλεις; ή: «Η τεχνητή νοημοσύνη μειώνει πάντα τη δημιουργικότητα».",
      modes:[
        ["question","Κάνε το ερώτημά μου πιο συγκεκριμένο"],
        ["keywords","Δώσε λέξεις-κλειδιά για αναζήτηση"],
        ["sources","Πες μου τι πηγές πρέπει να ψάξω"],
        ["claim","Δώσε checklist ελέγχου ενός ισχυρισμού"]
      ],
      prompts:{
        question:"Μετέτρεψε το θέμα σε 2-3 πιο συγκεκριμένα ερευνητικά ερωτήματα. Μην απαντήσεις στα ερωτήματα.",
        keywords:"Δώσε ελληνικές και αγγλικές λέξεις-κλειδιά/φράσεις αναζήτησης για το θέμα. Μην ισχυριστείς ότι βρήκες πηγές.",
        sources:"Πρότεινε τύπους πηγών που πρέπει να αναζητήσει ο μαθητής και κριτήρια αξιοπιστίας. Μην επινοήσεις συγκεκριμένες πηγές ή URLs.",
        claim:"Δώσε βήμα-βήμα checklist για να ελεγχθεί ο ισχυρισμός: τι στοιχεία χρειάζονται, ποιες αντίθετες εξηγήσεις να ελεγχθούν και πώς να διασταυρωθούν οι πηγές."
      },
      system:"Είσαι βοηθός σχεδιασμού έρευνας. Δεν έχεις web browsing σε αυτή τη λειτουργία. Ποτέ μην ισχυρίζεσαι ότι αναζήτησες ή βρήκες τρέχουσες πηγές. Οργάνωσε ερωτήματα, keywords, τύπους πηγών και κριτήρια ελέγχου.",
      subject:"Έρευνα με πηγές"
    },
    flashcards:{
      title:"Φτιάξε επανάληψη από δικό σου υλικό",
      intro:"Βάλε όρους, ορισμούς ή ένα μικρό απόσπασμα. Ο βοηθός το μετατρέπει σε εξάσκηση — όχι σε έτοιμη σχολική εργασία.",
      label:"Υλικό επανάληψης",
      placeholder:"π.χ. Μίτωση: ... / Μείωση: ... ή επικόλλησε ένα μικρό απόσπασμα από τις σημειώσεις σου.",
      modes:[
        ["cards","Φτιάξε flashcards"],
        ["quiz","Φτιάξε μικρό quiz"],
        ["recall","Κάνε ερωτήσεις ανάκλησης"],
        ["mistakes","Βρες τι μπερδεύεται εύκολα"]
      ],
      prompts:{
        cards:"Φτιάξε 8 σύντομες flashcards ερώτηση → απάντηση αποκλειστικά από το υλικό. Κάθε κάρτα να έχει μία μόνο βασική ιδέα.",
        quiz:"Φτιάξε 5 ερωτήσεις πολλαπλής επιλογής με 3 επιλογές. Μην αποκαλύψεις τις σωστές απαντήσεις μέχρι το τέλος.",
        recall:"Φτιάξε 6 ερωτήσεις ενεργητικής ανάκλησης χωρίς απαντήσεις, από εύκολη σε δυσκολότερη.",
        mistakes:"Εντόπισε 3-5 σημεία του υλικού που είναι πιθανό να μπερδευτούν μεταξύ τους και δώσε σύντομο τρόπο διάκρισης, χωρίς να προσθέσεις άγνωστη ύλη."
      },
      system:"Είσαι βοηθός επανάληψης. Χρησιμοποίησε μόνο το υλικό που παρέχει ο χρήστης. Μην επινοείς επίσημη ύλη, ορισμούς ή γεγονότα.",
      subject:"Flashcards και επανάληψη"
    },
    presentation:{
      title:"Στήσε την παρουσίασή σου",
      intro:"Γράψε θέμα και όσα ήδη ξέρεις. Ο βοηθός φτιάχνει δομή και ιδέες διαφανειών — όχι έτοιμο παραδοτέο.",
      label:"Θέμα και δικές σου σημειώσεις",
      placeholder:"π.χ. Παρουσίαση για την κλιματική αλλαγή. Έχω ήδη: αίτια, συνέπειες, 2 παραδείγματα...",
      modes:[
        ["outline","Φτιάξε δομή διαφανειών"],
        ["visual","Πρότεινε οπτικά στοιχεία"],
        ["speaker","Φτιάξε σύντομες σημειώσεις ομιλητή"],
        ["access","Έλεγξε την προσβασιμότητα της ιδέας"]
      ],
      prompts:{
        outline:"Φτιάξε σκελετό 6-8 διαφανειών με τίτλο και μία σύντομη οδηγία για το τι πρέπει να βάλει ο μαθητής σε κάθε διαφάνεια. Μην γράψεις έτοιμες παραγράφους.",
        visual:"Πρότεινε για κάθε βασικό σημείο έναν κατάλληλο τύπο οπτικού (γράφημα, εικόνα, timeline, διάγραμμα) και τι πρέπει να δείχνει.",
        speaker:"Μετέτρεψε τα σημεία σε σύντομες σημειώσεις ομιλητή-υπενθυμίσεις, όχι σε πλήρες κείμενο παρουσίασης.",
        access:"Δώσε checklist προσβασιμότητας για την παρουσίαση: αντίθεση, μέγεθος γραμματοσειράς, alt text, υπότιτλοι, αποφυγή υπερφόρτωσης και καθαρή σειρά."
      },
      system:"Είσαι βοηθός σχεδιασμού παρουσίασης. Ο μαθητής κρατά την ιδέα και το περιεχόμενο. Δίνεις δομή, οπτική οργάνωση και accessibility checks, όχι έτοιμο παραδοτέο.",
      subject:"Παρουσίαση/αφίσα"
    },
    language:{
      title:"Κάνε στοχευμένη γλωσσική εξάσκηση",
      intro:"Γράψε πρόταση, μικρό κείμενο ή λέξεις που σε δυσκολεύουν. Ο βοηθός θα σε βάλει να εξασκηθείς, όχι να αντιγράψεις έτοιμη απάντηση.",
      label:"Λέξεις ή μικρό κείμενο",
      placeholder:"π.χ. I went to school yesterday but I don't understand when to use did / was / went.",
      modes:[
        ["errors","Βάλε με να βρω τα λάθη"],
        ["vocab","Φτιάξε εξάσκηση λεξιλογίου"],
        ["simple","Εξήγησε τον κανόνα απλά"],
        ["read","Σπάσε το κείμενο σε μικρές μονάδες ανάγνωσης"]
      ],
      prompts:{
        errors:"Με βάση το κείμενο, δημιούργησε 4 παρόμοιες προτάσεις με μικρά λάθη για να τα εντοπίσει ο μαθητής. Μη δώσεις τις διορθώσεις πριν προσπαθήσει.",
        vocab:"Διάλεξε έως 8 χρήσιμες λέξεις από το κείμενο και φτιάξε άσκηση αντιστοίχισης ή συμπλήρωσης κενού.",
        simple:"Εξήγησε τον σχετικό γλωσσικό κανόνα απλά και δώσε 2 μικρά παραδείγματα. Μετά κάνε μία ερώτηση στον μαθητή.",
        read:"Χώρισε το κείμενο σε μικρές φράσεις/νοηματικές μονάδες για ευκολότερη ανάγνωση και σημείωσε πού να κάνει φυσικές παύσεις. Μην ισχυριστείς ότι άκουσες την προφορά του."
      },
      system:"Είσαι βοηθός γλωσσικής εξάσκησης. Δίνεις μικρές ασκήσεις και εξηγήσεις. Δεν ισχυρίζεσαι ότι άκουσες φωνή αν δεν έχει δοθεί ήχος και δεν κάνεις επίσημη αξιολόγηση προφοράς.",
      subject:"Ανάγνωση και Αγγλικά"
    },
    creative:{
      title:"Μετέτρεψε μια ιδέα σε δικό σου project",
      intro:"Γράψε τι θέλεις να δημιουργήσεις και τι μήνυμα θέλεις να περάσεις. Ο βοηθός σε βοηθά να σχεδιάσεις — όχι να σου παραδώσει έτοιμο έργο.",
      label:"Η ιδέα σου",
      placeholder:"π.χ. Θέλω να φτιάξω αφίσα για την ανακύκλωση. Θέλω να δείχνει 3 πρακτικά πράγματα που μπορεί να κάνει ένας μαθητής.",
      modes:[
        ["concept","Δώσε 3 διαφορετικές κατευθύνσεις"],
        ["storyboard","Φτιάξε storyboard / δομή"],
        ["visual","Πρότεινε οπτικό ύφος και στοιχεία"],
        ["prompt","Βοήθησέ με να γράψω καλύτερο prompt"]
      ],
      prompts:{
        concept:"Δώσε 3 διαφορετικές δημιουργικές κατευθύνσεις που βασίζονται στην ιδέα του χρήστη. Για καθεμία γράψε μόνο concept, στόχο και τι θα χρειαστεί να φτιάξει ο ίδιος.",
        storyboard:"Μετέτρεψε την ιδέα σε storyboard 4-6 βημάτων/καρέ ή σε απλή δομή project. Μην γράψεις το τελικό κείμενο ή εικόνα.",
        visual:"Πρότεινε χρωματική λογική, σύνθεση, εικονίδια/τύπους εικόνας και ιεραρχία πληροφορίας με έμφαση σε καθαρότητα και προσβασιμότητα.",
        prompt:"Κάνε 3 ερωτήσεις για να ξεκαθαρίσει ο χρήστης σκοπό, κοινό και ύφος. Μετά δώσε template prompt με κενά που θα συμπληρώσει ο ίδιος."
      },
      system:"Είσαι βοηθός δημιουργικού σχεδιασμού. Η ιδέα, οι επιλογές και το τελικό έργο ανήκουν στον χρήστη. Δίνεις κατευθύνσεις, δομή και ερωτήσεις, όχι έτοιμο σχολικό παραδοτέο.",
      subject:"Δημιουργικό project"
    }
  };

  const CONFIG_EN={
    pdf:{
      title:"Work with your notes",
      intro:"Upload a PDF or paste a short excerpt/your own notes. The PDF is read locally in your browser and the helper works from the extracted text.",
      label:"Text or notes",
      placeholder:"Paste a short excerpt from your notes or write what they cover in your own words.",
      modes:[["understand","Explain it in simpler language"],["questions","Create understanding questions"],["structure","Organise it into key ideas"],["review","Make a short revision plan"]],
      prompts:{
        understand:"Explain the material in simple language without adding facts that are not in the text. End with one understanding-check question.",
        questions:"Create 5 short understanding questions based only on the material. Do not reveal the answers immediately.",
        structure:"Organise the material into 3-6 key ideas and subpoints. Do not add new factual content.",
        review:"Create a short revision plan in priority order based only on the material."
      },
      system:"You are a study helper working only from material supplied by the user. Do not introduce unsupported facts. If something is not in the material, say so.",
      subject:"PDF/notes study"
    },
    research:{
      title:"Organise your research",
      intro:"Enter a topic, research question or claim. The helper plans the research; it does not pretend to have searched the web.",
      label:"Topic or claim",
      placeholder:"e.g. How did the Industrial Revolution change cities? or: 'AI always reduces creativity.'",
      modes:[["question","Make my research question more specific"],["keywords","Give me search keywords"],["sources","Tell me what kinds of sources to look for"],["claim","Give me a claim-checking checklist"]],
      prompts:{
        question:"Turn the topic into 2-3 more specific research questions. Do not answer them.",
        keywords:"Give useful English search terms and phrases, plus alternative keywords where helpful. Do not claim to have found sources.",
        sources:"Suggest source types to look for and reliability criteria. Do not invent specific sources or URLs.",
        claim:"Give a step-by-step checklist for testing the claim: what evidence is needed, what alternative explanations to check, and how to cross-check sources."
      },
      system:"You are a research-planning helper. You do not have web browsing in this mode. Never claim to have searched or found current sources. Organise questions, keywords, source types and verification criteria.",
      subject:"Research with sources"
    },
    flashcards:{
      title:"Turn your own material into revision",
      intro:"Add terms, definitions or a short excerpt. The helper turns it into practice, not a ready-made school assignment.",
      label:"Revision material",
      placeholder:"e.g. Mitosis: ... / Meiosis: ... or paste a short excerpt from your notes.",
      modes:[["cards","Make flashcards"],["quiz","Make a short quiz"],["recall","Create active-recall questions"],["mistakes","Spot ideas that are easy to mix up"]],
      prompts:{
        cards:"Create 8 short question → answer flashcards using only the material. Keep one key idea per card.",
        quiz:"Create 5 multiple-choice questions with 3 options each. Do not reveal the correct answers until the end.",
        recall:"Create 6 active-recall questions without answers, from easier to harder.",
        mistakes:"Identify 3-5 parts of the material that could easily be confused and give a short way to distinguish them, without adding unsupported content."
      },
      system:"You are a revision helper. Use only the material supplied by the user. Do not invent syllabus content, definitions or facts.",
      subject:"Flashcards and revision"
    },
    presentation:{
      title:"Plan your presentation",
      intro:"Enter the topic and what you already know. The helper builds structure and visual ideas, not a finished submission.",
      label:"Topic and your notes",
      placeholder:"e.g. Presentation about climate change. I already have: causes, effects, two examples...",
      modes:[["outline","Create a slide outline"],["visual","Suggest visuals"],["speaker","Create short speaker notes"],["access","Check accessibility"]],
      prompts:{
        outline:"Create a 6-8 slide outline with a title and one short instruction for what the student should add to each slide. Do not write ready-made paragraphs.",
        visual:"For each main point, suggest a suitable visual type (chart, image, timeline, diagram) and what it should show.",
        speaker:"Turn the points into short speaker-note prompts, not a full script.",
        access:"Give an accessibility checklist covering contrast, font size, alt text, captions, information overload and reading order."
      },
      system:"You are a presentation-planning helper. The learner keeps ownership of the idea and content. Give structure, visual organisation and accessibility checks, not a ready-to-submit presentation.",
      subject:"Presentation/poster"
    },
    language:{
      title:"Do focused language practice",
      intro:"Enter a sentence, short text or words you find difficult. The helper creates practice instead of giving you something to copy.",
      label:"Words or short text",
      placeholder:"e.g. I went to school yesterday but I don't understand when to use did / was / went.",
      modes:[["errors","Make me spot the mistakes"],["vocab","Create vocabulary practice"],["simple","Explain the rule simply"],["read","Break the text into reading chunks"]],
      prompts:{
        errors:"Based on the text, create 4 similar sentences with small mistakes for the learner to find. Do not give the corrections before they try.",
        vocab:"Choose up to 8 useful words from the text and create a matching or gap-fill exercise.",
        simple:"Explain the relevant language rule simply and give 2 short examples. Then ask one question.",
        read:"Break the text into short meaning units for easier reading and mark natural pause points. Do not claim to have heard the learner's pronunciation."
      },
      system:"You are a language-practice helper. Give short exercises and explanations. Do not claim to have heard audio when none was provided, and do not make formal pronunciation assessments.",
      subject:"Reading and English"
    },
    creative:{
      title:"Turn an idea into your own project",
      intro:"Describe what you want to create and the message you want to communicate. The helper helps you plan, not submit a finished project.",
      label:"Your idea",
      placeholder:"e.g. I want to make a recycling poster with three practical things a student can do.",
      modes:[["concept","Give me 3 different directions"],["storyboard","Create a storyboard / structure"],["visual","Suggest a visual style"],["prompt","Help me write a better prompt"]],
      prompts:{
        concept:"Give 3 different creative directions based on the user's idea. For each one, give only the concept, goal and what the learner would need to create themselves.",
        storyboard:"Turn the idea into a 4-6 step/frame storyboard or simple project structure. Do not write the final text or image.",
        visual:"Suggest colour logic, composition, icon/image types and information hierarchy with an emphasis on clarity and accessibility.",
        prompt:"Ask 3 questions to clarify purpose, audience and style. Then provide a fill-in-the-blanks prompt template the user completes themselves."
      },
      system:"You are a creative-planning helper. The idea, choices and final work belong to the user. Give directions, structure and questions, not a ready-to-submit school product.",
      subject:"Creative project"
    }
  };

  function init(){
    const root=document.querySelector("[data-guided-assistant]");
    if(!root) return;
    const kind=root.getAttribute("data-guided-assistant");
    const isEn=(document.documentElement.lang||"").toLowerCase().startsWith("en");
    const cfg=(isEn ? CONFIG_EN : CONFIG)[kind];
    if(!cfg) return;
    root.innerHTML =
      '<div class="guided__head"><span class="guided__spark">✦</span><div><h2>'+escapeHtml(cfg.title)+'</h2><p>'+escapeHtml(cfg.intro)+'</p></div></div>'+
      '<label class="guided__label" for="guidedMode">'+(isEn?"What would you like to do?":"Τι θέλεις να κάνουμε;")+'</label>'+
      '<select id="guidedMode" class="guided__select">'+cfg.modes.map(x=>'<option value="'+escapeHtml(x[0])+'">'+escapeHtml(x[1])+'</option>').join("")+'</select>'+
      '<label class="guided__label" for="guidedInput">'+escapeHtml(cfg.label)+'</label>'+
      (kind==="pdf" ? '<div class="guided__upload"><label class="guided__upload-btn" for="guidedPdfFile">'+(isEn?"Choose PDF":"Επίλεξε PDF")+'</label><input id="guidedPdfFile" type="file" accept="application/pdf,.pdf"><span id="guidedPdfStatus" class="guided__upload-status" aria-live="polite"></span></div>' : '')+
      '<textarea id="guidedInput" class="guided__input" placeholder="'+escapeHtml(cfg.placeholder)+'"></textarea>'+
      '<p class="guided__privacy">'+(isEn?"Do not enter your name, school, phone number, health information or other personal data.":"Μην γράφεις όνομα, σχολείο, τηλέφωνο, στοιχεία υγείας ή άλλα προσωπικά δεδομένα.")+'</p>'+
      '<button id="guidedGo" class="guided__button" type="button">'+(isEn?"Help me":"Βοήθησέ με")+'</button>'+
      '<div id="guidedStatus" class="guided__status" role="status" aria-live="polite"></div>'+
      '<div id="guidedResult" class="guided__result" tabindex="0" aria-live="polite"><p class="guided__placeholder">'+(isEn?"The result will appear here.":"Το αποτέλεσμα θα εμφανιστεί εδώ.")+'</p></div>';

    const btn=root.querySelector("#guidedGo"), input=root.querySelector("#guidedInput"), mode=root.querySelector("#guidedMode"), result=root.querySelector("#guidedResult"), status=root.querySelector("#guidedStatus");
    const pdfFile=root.querySelector("#guidedPdfFile"), pdfStatus=root.querySelector("#guidedPdfStatus");
    if(pdfFile){
      pdfFile.addEventListener("change",async()=>{
        const file=pdfFile.files&&pdfFile.files[0];
        if(!file) return;
        pdfStatus.textContent=isEn?"Reading PDF locally…":"Διαβάζω το PDF τοπικά…";
        pdfFile.disabled=true;
        try{
          const reader=await ensurePdfReader();
          const doc=await reader.read(file,{maxChars:42000,maxPages:70});
          input.value=doc.text;
          pdfStatus.textContent=(isEn?"Loaded ":"Φορτώθηκαν ")+doc.totalPages+(isEn?" pages":" σελίδες")+(doc.truncated?(isEn?" · long document, using the first readable part":" · μεγάλο αρχείο, χρησιμοποιείται το πρώτο αναγνώσιμο μέρος"):"");
        }catch(err){
          const code=String(err&&err.message||err);
          pdfStatus.textContent=code==="no_selectable_text"
            ? (isEn?"No selectable text was found. This may be a scanned/image PDF.":"Δεν βρέθηκε επιλέξιμο κείμενο. Ίσως είναι σαρωμένο PDF/εικόνα.")
            : code==="file_too_large"
              ? (isEn?"The PDF is too large (max 15 MB).":"Το PDF είναι πολύ μεγάλο (έως 15 MB).")
              : (isEn?"The PDF could not be read.":"Δεν μπόρεσα να διαβάσω το PDF.");
        }finally{pdfFile.disabled=false;}
      });
    }
    btn.addEventListener("click",async()=>{
      const value=input.value.trim();
      if(!value){ status.textContent=isEn?"Enter a little material or your topic first.":"Γράψε πρώτα λίγο υλικό ή το θέμα σου."; input.focus(); return; }
      btn.disabled=true; status.textContent=isEn?"Preparing the response…":"Ετοιμάζω την απάντηση…"; result.innerHTML='<p class="guided__placeholder">'+(isEn?"Working with what you entered…":"Δουλεύω πάνω σε αυτό που έγραψες…")+'</p>';
      try{
        const r=await fetch("/api/tutor-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          system:cfg.system,
          prompt:cfg.prompts[mode.value]+"\n\n"+(isEn?"User material:\n":"Υλικό χρήστη:\n")+value,
          audience:"study_user",mode:"organize",task:"guided_task",subject:cfg.subject
        })});
        const data=await r.json().catch(()=>({}));
        if(!r.ok) throw new Error(data.message||(isEn?"The service could not respond.":"Η υπηρεσία δεν μπόρεσε να απαντήσει."));
        result.innerHTML=renderMarkdown(data.text);
        status.textContent=isEn?"Ready.":"Έτοιμο.";
        result.focus();
      }catch(err){
        result.innerHTML='<p>'+escapeHtml(err.message||(isEn?"An error occurred.":"Παρουσιάστηκε σφάλμα."))+'</p>';
        status.textContent="";
      }finally{ btn.disabled=false; }
    });
  }

  window.AITOOLSKIDS_GUIDED={renderMarkdown,init};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();