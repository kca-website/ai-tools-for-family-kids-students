(function(){
  "use strict";
  if(location.pathname!=="/study.html" && location.pathname!=="/study") return;

  // Runtime safety gate. Keep only mappings that fail live source grounding out
  // of the learner selector. The current verified secondary inventory is clean.
  const runtimeBlockedSecondarySubjects=new Set([]);
  const runtimeBlockedSecondaryTopics=new Map([]);
  const grounding=window.AITOOLSKIDS_SECONDARY_GROUNDING_AVAILABILITY;
  if(grounding?.has){
    window.AITOOLSKIDS_SECONDARY_GROUNDING_AVAILABILITY=Object.freeze({
      schoolYear:grounding.schoolYear,
      subjects:grounding.subjects,
      has(subjectId,label){
        const sid=String(subjectId||"");
        if(runtimeBlockedSecondarySubjects.has(sid))return false;
        if(runtimeBlockedSecondaryTopics.get(sid)?.has(String(label||"").trim()))return false;
        return grounding.has(subjectId,label);
      }
    });
  }

  const actions={
    mindmap:{
      titleEl:"Mind Map ενότητας",titleEn:"Unit Mind Map",serverActivity:"summary",mode:"review",
      labelEl:"Mind Map",labelEn:"Mind Map",subEl:"έννοιες και σχέσεις σε δενδροειδή μορφή",subEn:"concepts and relationships in a tree",
      ruleEl:"Φτιάξε ένα σύντομο Mind Map της ενεργής πηγής. Βάλε στο κέντρο το βασικό θέμα και 3–6 κύριους κλάδους με σύντομους υποκλάδους. Χρησιμοποίησε μόνο έννοιες και σχέσεις που υποστηρίζονται ρητά από την πηγή. Δώσε καθαρή ιεραρχία σε markdown, όχι πίνακα.",
      ruleEn:"Create a compact Mind Map of the active source. Put the main topic at the centre and use 3–6 main branches with short sub-branches. Use only concepts and relationships explicitly supported by the source. Return clear hierarchical markdown, not a table."
    },
    infographic:{
      titleEl:"Πληροφοριακό γράφημα",titleEn:"Infographic",serverActivity:"creative",mode:"organize",
      labelEl:"Infographic",labelEn:"Infographic",subEl:"δομή για οπτική σύνοψη της ενότητας",subEn:"a visual-summary structure for the unit",
      ruleEl:"Δημιούργησε περιεχόμενο για εκπαιδευτικό infographic από την ενεργή πηγή: 1 σύντομος τίτλος, 4–6 μικρές ενότητες, πολύ σύντομα bullets, βασικοί όροι και μόνο αριθμοί ή ημερομηνίες που υπάρχουν ρητά στην πηγή. Για κάθε ενότητα πρότεινε ένα απλό εικονίδιο ή οπτικό μοτίβο χωρίς να επινοείς νέο γεγονός. Μην το μετατρέψεις σε έτοιμη σχολική εργασία.",
      ruleEn:"Create educational infographic-ready content from the active source: one short title, 4–6 compact sections, very short bullets, key terms, and only numbers or dates explicitly present in the source. Suggest one simple icon or visual motif per section without inventing facts. Do not turn it into a ready-to-submit assignment."
    },
    slides:{
      titleEl:"Διαφάνειες μελέτης",titleEn:"Study slides",serverActivity:"presentation",mode:"organize",
      labelEl:"Διαφάνειες",labelEn:"Slides",subEl:"σκελετός 6 διαφανειών από την ενότητα",subEn:"a 6-slide scaffold from the unit",
      ruleEl:"Φτιάξε σκελετό 6 διαφανειών για μελέτη της ενεργής πηγής. Για κάθε διαφάνεια δώσε τίτλο, 2–4 σύντομα bullets και μία πρόταση για οπτικό στοιχείο που προκύπτει από την πηγή. Η τελευταία διαφάνεια να είναι αυτοέλεγχος με 2 σύντομες ερωτήσεις. Μην γράψεις έτοιμη εργασία προς παράδοση και μην προσθέσεις πληροφορίες εκτός πηγής.",
      ruleEn:"Create a 6-slide study scaffold from the active source. For each slide give a title, 2–4 short bullets and one source-supported visual suggestion. Make the last slide a self-check with two short questions. Do not create a ready-to-submit assignment or add information outside the source."
    },
    datatable:{
      titleEl:"Πίνακας δεδομένων",titleEn:"Data table",serverActivity:"summary",mode:"organize",
      labelEl:"Πίνακας δεδομένων",labelEn:"Data table",subEl:"σύγκριση στοιχείων μόνο όταν ταιριάζει",subEn:"compare facts only when the source supports it",
      ruleEl:"Εξέτασε αν η ενεργή πηγή περιέχει στοιχεία που έχουν νόημα να συγκριθούν σε πίνακα. Αν ναι, φτιάξε έναν μικρό markdown πίνακα 3–6 γραμμών με στήλες που προκύπτουν φυσικά από την πηγή. Αν όχι, πες καθαρά ότι η συγκεκριμένη ενότητα δεν προσφέρεται για πίνακα δεδομένων και δώσε 3 βασικά σημεία αντί γι' αυτό. Μην επινοήσεις καμία τιμή, κατηγορία ή ημερομηνία.",
      ruleEn:"Check whether the active source contains facts that are meaningfully comparable in a table. If yes, create a small markdown table with 3–6 rows and columns that arise naturally from the source. If not, clearly say this unit is not suited to a data table and give three key points instead. Do not invent any value, category or date."
    }
  };

  let pendingAction="";
  let pendingDisclosure=false;
  let outputObserver=null;

  function isEn(){return (document.documentElement.lang||"el").toLowerCase().startsWith("en")}
  function disclosureText(){
    return isEn()
      ? "Also available free in NotebookLM: its Studio offers similar study formats, subject to usage limits. aitools4kids.gr is independent and is not affiliated with Google or NotebookLM."
      : "Υπάρχουν δωρεάν και στο NotebookLM: το Studio προσφέρει αντίστοιχες μορφές μελέτης, με όρια χρήσης. Το aitools4kids.gr είναι ανεξάρτητο και δεν συνδέεται με τη Google ή το NotebookLM.";
  }

  function ensureStyles(){
    if(document.getElementById("studyStudioExtraStyles"))return;
    const style=document.createElement("style");
    style.id="studyStudioExtraStyles";
    style.textContent='.study-studio-note{grid-column:1/-1;margin:4px 0 0;padding:8px 10px;border-radius:9px;background:#f6f8fb;color:#475569;font-size:.76rem;line-height:1.4}.study-studio-output-note{margin-top:12px;padding:9px 10px;border-top:1px solid var(--border,#dfe6ee);color:var(--muted,#5a6270);font-size:.78rem}.study-studio-output-note a{font-weight:800}';
    document.head.appendChild(style);
  }

  function mainActionGrid(){
    const anchor=document.querySelector('[data-action="audio"], [data-action="flashcards"], [data-action="quickreview"], [data-action="explain"]');
    if(!anchor)return null;
    return anchor.closest('.study-actions.learning-choice-grid') || anchor.closest('.study-actions') || anchor.parentElement;
  }

  function installActions(){
    if(document.querySelector('[data-studio-extra="1"]'))return;
    const grid=mainActionGrid();
    if(!grid)return;
    ensureStyles();
    Object.entries(actions).forEach(([key,cfg])=>{
      if(document.querySelector('[data-studio-action="'+key+'"]'))return;
      const b=document.createElement("button");
      b.type="button";
      b.className="study-action";
      b.dataset.action="quickreview";
      b.dataset.studioAction=key;
      b.dataset.studioExtra="1";
      b.innerHTML='<span></span><span></span>';
      grid.appendChild(b);
    });
    const note=document.createElement('p');
    note.id='studyStudioNotebookNote';
    note.className='study-studio-note';
    grid.appendChild(note);
    localize();
  }

  function localize(){
    const en=isEn();
    const note=document.getElementById('studyStudioNotebookNote');
    if(note)note.textContent=disclosureText();
    document.querySelectorAll('[data-studio-extra="1"]').forEach(b=>{
      const cfg=actions[b.dataset.studioAction],spans=b.querySelectorAll('span');
      if(!cfg)return;
      if(spans[0])spans[0].textContent=en?cfg.labelEn:cfg.labelEl;
      if(spans[1])spans[1].textContent=en?cfg.subEn:cfg.subEl;
    });
  }

  function appendDisclosure(){
    if(!pendingDisclosure)return;
    const out=document.getElementById("aiOutput");
    if(!out||out.querySelector('.ai-loading')||!out.textContent.trim())return;
    if(!out.querySelector('.study-studio-output-note')){
      const note=document.createElement('div');
      note.className='study-studio-output-note';
      note.append(document.createTextNode(isEn()?'Free alternative: ':'Δωρεάν εναλλακτική: '));
      const a=document.createElement('a');a.href='https://notebooklm.google/';a.target='_blank';a.rel='noopener noreferrer';a.textContent='NotebookLM';note.appendChild(a);
      note.append(document.createTextNode(isEn()?' offers these kinds of Studio outputs too, with a free Standard tier subject to usage limits.':' προσφέρει επίσης τέτοιες λειτουργίες Studio, με δωρεάν Standard έκδοση και όρια χρήσης.'));
      out.appendChild(note);
    }
    pendingDisclosure=false;
  }

  function watchOutput(){
    const out=document.getElementById("aiOutput");if(!out||outputObserver)return;
    outputObserver=new MutationObserver(appendDisclosure);
    outputObserver.observe(out,{childList:true,subtree:true,characterData:true});
  }

  function installFetchAdapter(){
    if(window.__AITOOLSKIDS_STUDIO_EXTRAS_FETCH__)return;
    window.__AITOOLSKIDS_STUDIO_EXTRAS_FETCH__=true;
    const nativeFetch=window.fetch.bind(window);
    window.fetch=async function(input,init){
      const url=typeof input==='string'?input:String(input?.url||'');
      if((url==='/api/tutor-assistant'||url.endsWith('/api/tutor-assistant'))&&init&&typeof init.body==='string'){
        try{
          const payload=JSON.parse(init.body),cfg=pendingAction&&payload?.activity==='quickreview'?actions[pendingAction]:null;
          if(cfg){
            payload.activity=cfg.serverActivity;
            payload.task='guided_task';
            payload.mode=cfg.mode;
            const rule=isEn()?cfg.ruleEn:cfg.ruleEl;
            payload.context=String(payload.context||'').trim()+'\n\nSTUDIO SOURCE-GROUNDED OUTPUT:\n'+rule;
            payload.prompt=String(payload.prompt||'').trim()+'\n\n'+rule;
            if(payload.studyContext&&typeof payload.studyContext==='object')payload.studyContext.studyAction=pendingAction||'studio_extra';
            init={...init,body:JSON.stringify(payload)};
            pendingAction='';
          }
        }catch(_){/* keep original request */}
      }
      return nativeFetch(input,init);
    };
  }

  function addNotebookAlternative(){
    const grid=document.getElementById('altAiGrid');if(!grid||grid.querySelector('a[href="https://notebooklm.google/"]'))return;
    const a=document.createElement('a');a.className='alt-ai-card';a.href='https://notebooklm.google/';a.target='_blank';a.rel='noopener noreferrer';
    a.innerHTML='<strong>NotebookLM</strong><span>'+(isEn()?'Free Standard tier with limits; Studio includes source-grounded study formats.':'Δωρεάν Standard έκδοση με όρια· το Studio περιλαμβάνει μορφές μελέτης πάνω σε πηγές.')+'</span>';
    grid.appendChild(a);
  }

  installActions();
  watchOutput();
  installFetchAdapter();

  document.addEventListener('click',(event)=>{
    const b=event.target?.closest?.('[data-studio-extra="1"]');if(!b)return;
    pendingAction=b.dataset.studioAction||'';
    pendingDisclosure=true;
    const cfg=actions[pendingAction];
    setTimeout(()=>{
      const title=document.getElementById('workspaceTitle');if(title&&cfg)title.textContent=isEn()?cfg.titleEn:cfg.titleEl;
      addNotebookAlternative();
    },0);
  });

  new MutationObserver(()=>localize()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();