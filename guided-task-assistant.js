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

  const CONFIG={
    pdf:{
      title:"Δούλεψε πάνω στις σημειώσεις σου",
      intro:"Επικόλλησε ένα μικρό απόσπασμα ή τις δικές σου σημειώσεις. Ο βοηθός θα δουλέψει μόνο πάνω σε αυτό που του δίνεις.",
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

  function init(){
    const root=document.querySelector("[data-guided-assistant]");
    if(!root) return;
    const kind=root.getAttribute("data-guided-assistant");
    const cfg=CONFIG[kind];
    if(!cfg) return;
    root.innerHTML =
      '<div class="guided__head"><span class="guided__spark">✦</span><div><h2>'+escapeHtml(cfg.title)+'</h2><p>'+escapeHtml(cfg.intro)+'</p></div></div>'+
      '<label class="guided__label" for="guidedMode">Τι θέλεις να κάνουμε;</label>'+
      '<select id="guidedMode" class="guided__select">'+cfg.modes.map(x=>'<option value="'+escapeHtml(x[0])+'">'+escapeHtml(x[1])+'</option>').join("")+'</select>'+
      '<label class="guided__label" for="guidedInput">'+escapeHtml(cfg.label)+'</label>'+
      '<textarea id="guidedInput" class="guided__input" placeholder="'+escapeHtml(cfg.placeholder)+'"></textarea>'+
      '<p class="guided__privacy">Μην γράφεις όνομα, σχολείο, τηλέφωνο, στοιχεία υγείας ή άλλα προσωπικά δεδομένα.</p>'+
      '<button id="guidedGo" class="guided__button" type="button">Βοήθησέ με</button>'+
      '<div id="guidedStatus" class="guided__status" role="status" aria-live="polite"></div>'+
      '<div id="guidedResult" class="guided__result" tabindex="0" aria-live="polite"><p class="guided__placeholder">Το αποτέλεσμα θα εμφανιστεί εδώ.</p></div>';

    const btn=root.querySelector("#guidedGo"), input=root.querySelector("#guidedInput"), mode=root.querySelector("#guidedMode"), result=root.querySelector("#guidedResult"), status=root.querySelector("#guidedStatus");
    btn.addEventListener("click",async()=>{
      const value=input.value.trim();
      if(!value){ status.textContent="Γράψε πρώτα λίγο υλικό ή το θέμα σου."; input.focus(); return; }
      btn.disabled=true; status.textContent="Ετοιμάζω την απάντηση…"; result.innerHTML='<p class="guided__placeholder">Δουλεύω πάνω σε αυτό που έγραψες…</p>';
      try{
        const r=await fetch("/api/tutor-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          system:cfg.system,
          prompt:cfg.prompts[mode.value]+"\n\nΥλικό χρήστη:\n"+value,
          audience:"study_user",mode:"organize",task:"guided_task",subject:cfg.subject
        })});
        const data=await r.json().catch(()=>({}));
        if(!r.ok) throw new Error(data.message||"Η υπηρεσία δεν μπόρεσε να απαντήσει.");
        result.innerHTML=renderMarkdown(data.text);
        status.textContent="Έτοιμο.";
        result.focus();
      }catch(err){
        result.innerHTML='<p>'+escapeHtml(err.message||"Παρουσιάστηκε σφάλμα.")+'</p>';
        status.textContent="";
      }finally{ btn.disabled=false; }
    });
  }

  window.AITOOLSKIDS_GUIDED={renderMarkdown,init};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();