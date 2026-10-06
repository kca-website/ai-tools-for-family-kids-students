(function(){
  "use strict";
  const PDFJS_URL="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
  const PDFJS_WORKER_URL="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  let libPromise=null;

  async function loadPdfJs(){
    if(!libPromise){
      libPromise=import(PDFJS_URL).then((lib)=>{
        if(lib.GlobalWorkerOptions) lib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER_URL;
        return lib;
      });
    }
    return libPromise;
  }

  async function read(file, options){
    const opts=Object.assign({maxBytes:15*1024*1024,maxPages:80,maxChars:50000},options||{});
    if(!file) throw new Error("no_file");
    const isPdf=file.type==="application/pdf" || /\.pdf$/i.test(file.name||"");
    if(!isPdf) throw new Error("not_pdf");
    if(file.size>opts.maxBytes) throw new Error("file_too_large");

    const pdfjs=await loadPdfJs();
    const data=await file.arrayBuffer();
    const pdf=await pdfjs.getDocument({data}).promise;
    const pageLimit=Math.min(pdf.numPages,opts.maxPages);
    const pages=[];
    let totalChars=0;
    let truncated=false;

    for(let n=1;n<=pageLimit;n++){
      const page=await pdf.getPage(n);
      const content=await page.getTextContent();
      const text=content.items
        .map((item)=>typeof item.str==="string"?item.str:"")
        .join(" ")
        .replace(/\s+/g," ")
        .trim();
      if(!text) continue;
      const prefix="[Page "+n+"]\n";
      const room=opts.maxChars-totalChars-prefix.length;
      if(room<=0){truncated=true;break;}
      const slice=text.slice(0,room);
      pages.push(prefix+slice);
      totalChars+=prefix.length+slice.length;
      if(slice.length<text.length){truncated=true;break;}
    }
    if(pdf.numPages>pageLimit) truncated=true;
    const text=pages.join("\n\n").trim();
    if(!text) throw new Error("no_selectable_text");
    return {
      name:file.name||"document.pdf",
      text,
      pagesRead:pageLimit,
      totalPages:pdf.numPages,
      chars:text.length,
      truncated
    };
  }

  window.AITOOLSKIDS_PDF={read,loadPdfJs};

  // AI Study: NotebookLM guidance. Keep this isolated from the study flow.
  // IMPORTANT: never observe the whole document while mutating the same subtree;
  // that caused a MutationObserver feedback loop and froze study.html.
  if(location.pathname==="/study.html" || location.pathname==="/study"){
    const STYLE_ID="notebookLmStudyGuideStyles";
    let observer=null;
    let updating=false;

    function isEn(){
      return (document.documentElement.lang||"el").toLowerCase().startsWith("en");
    }

    function ensureNotebookStyles(){
      if(document.getElementById(STYLE_ID)) return;
      const style=document.createElement("style");
      style.id=STYLE_ID;
      style.textContent='.notebooklm-enhanced{border:1px solid var(--border,#dfe6ee);border-radius:10px;background:#fff;padding:10px}.notebooklm-enhanced .notebooklm-main-link{display:block;text-decoration:none;color:inherit}.notebooklm-enhanced .notebooklm-main-link strong{display:block}.notebooklm-enhanced .notebooklm-main-link span{display:block;color:var(--muted,#5a6270);font-size:.82rem;margin-top:2px}.notebooklm-guide{margin-top:9px;padding-top:8px;border-top:1px solid var(--border,#dfe6ee);font-size:.79rem;color:var(--muted,#5a6270)}.notebooklm-guide summary{cursor:pointer;font-weight:750;color:var(--blue,#2e6ba3);list-style-position:inside}.notebooklm-guide ol{margin:8px 0 5px;padding-left:1.25rem}.notebooklm-guide li{margin:4px 0}.notebooklm-tip{margin:7px 0 0;font-size:.76rem}';
      document.head.appendChild(style);
    }

    function notebookCopy(en){
      return {
        description: en
          ? "For deeper study, upload the schoolbook PDF. NotebookLM can find the key points, create source-grounded summaries and generate an Audio Overview."
          : "Για ακόμη καλύτερη μελέτη, ανέβασε το PDF του σχολικού βιβλίου. Το NotebookLM μπορεί να εντοπίσει τα βασικά σημεία, να δημιουργήσει σύνοψη και Audio Overview βασισμένα στις πηγές σου.",
        details: en
          ? '<summary>How do I use it?</summary><ol><li>Open NotebookLM and create a new notebook.</li><li>Upload the PDF of the correct schoolbook or only the pages of the unit you are studying.</li><li>Ask it to summarize the most important points of that unit.</li><li>From Studio, you can also create an Audio Overview.</li></ol><p class="notebooklm-tip"><strong>Tip:</strong> Using only the relevant unit/pages usually gives a more focused result and avoids mixing unrelated material.</p>'
          : '<summary>Πώς το χρησιμοποιώ;</summary><ol><li>Άνοιξε το NotebookLM και δημιούργησε νέο notebook.</li><li>Ανέβασε το PDF του σωστού σχολικού βιβλίου ή μόνο τις σελίδες της ενότητας που μελετάς.</li><li>Ζήτησε να συνοψίσει τα σημαντικότερα σημεία της συγκεκριμένης ενότητας.</li><li>Από το Studio μπορείς να δημιουργήσεις και Audio Overview.</li></ol><p class="notebooklm-tip"><strong>Συμβουλή:</strong> Αν χρησιμοποιήσεις μόνο τη σχετική ενότητα/σελίδες, το αποτέλεσμα συνήθως είναι πιο συγκεκριμένο και δεν μπλέκει άσχετο υλικό.</p>'
      };
    }

    function enhanceNotebookCard(){
      if(updating) return;
      const grid=document.getElementById("altAiGrid");
      if(!grid) return;

      updating=true;
      try{
        const en=isEn();
        const lang=en?"en":"el";
        const copy=notebookCopy(en);

        grid.querySelectorAll('a.alt-ai-card[href="https://notebooklm.google/"]').forEach((card)=>{
          if(card.closest('.notebooklm-enhanced')) return;
          ensureNotebookStyles();
          const wrap=document.createElement("div");
          wrap.className="notebooklm-enhanced";
          wrap.dataset.lang=lang;
          const link=card.cloneNode(true);
          link.className="notebooklm-main-link";
          const description=link.querySelector("span");
          if(description) description.textContent=copy.description;
          const details=document.createElement("details");
          details.className="notebooklm-guide";
          details.innerHTML=copy.details;
          wrap.appendChild(link);
          wrap.appendChild(details);
          card.replaceWith(wrap);
        });

        grid.querySelectorAll('.notebooklm-enhanced').forEach((wrap)=>{
          if(wrap.dataset.lang===lang) return;
          const description=wrap.querySelector('.notebooklm-main-link span');
          const details=wrap.querySelector('.notebooklm-guide');
          if(description) description.textContent=copy.description;
          if(details) details.innerHTML=copy.details;
          wrap.dataset.lang=lang;
        });
      } finally {
        updating=false;
      }
    }

    function attachGridObserver(){
      const grid=document.getElementById("altAiGrid");
      if(!grid || observer) return;
      observer=new MutationObserver(()=>{
        // Only react when an unenhanced NotebookLM card was actually rendered.
        if(grid.querySelector('a.alt-ai-card[href="https://notebooklm.google/"]')) enhanceNotebookCard();
      });
      observer.observe(grid,{childList:true,subtree:false});
    }

    // Flashcards are strict JSON and the server validates all numbers/formulae
    // against the verified source. Some models add presentation-only prefixes
    // such as "1.", "2." inside q/a strings. Those harmless ordinals can be
    // mistaken for unsupported textbook facts. Prevent them at generation time;
    // factual numbers/formulae are still checked server-side exactly as before.
    function installStudyRequestConsistencyGuard(){
      if(window.__AITOOLSKIDS_STUDY_FETCH_GUARD__) return;
      window.__AITOOLSKIDS_STUDY_FETCH_GUARD__=true;
      const nativeFetch=window.fetch.bind(window);
      window.fetch=async function(input,init){
        const url=typeof input==="string"?input:String(input?.url||"");
        if((url==="/api/tutor-assistant"||url.endsWith("/api/tutor-assistant"))&&init&&typeof init.body==="string"){
          try{
            const payload=JSON.parse(init.body);
            if(payload?.task==="flashcards"||payload?.activity==="flashcards"){
              const rule=isEn()
                ? "FLASHCARD FORMAT SAFETY: Return exactly the requested JSON shape. Do not prefix q or a text with card numbers, ordinals, list numbers or labels. Do not invent numerical examples, quantities or formula notation; use a number or formula only when it is explicitly present in the active source."
                : "ΑΣΦΑΛΗΣ ΜΟΡΦΗ ΚΑΡΤΩΝ: Επίστρεψε ακριβώς το ζητούμενο JSON. Μην βάζεις αρίθμηση, τακτικούς αριθμούς, αριθμούς λίστας ή ετικέτες στην αρχή των πεδίων q ή a. Μην επινοείς αριθμητικά παραδείγματα, ποσότητες ή συμβολισμούς τύπων· χρησιμοποίησε αριθμό ή τύπο μόνο όταν υπάρχει ρητά στην ενεργή πηγή.";
              payload.context=String(payload.context||"").trim()+"\n\n"+rule;
              init={...init,body:JSON.stringify(payload)};
            }
          }catch(_){/* keep the original request unchanged */}
        }
        return nativeFetch(input,init);
      };
    }

    async function primaryReviewedAudio(subjectId,topic,signal){
      const en=isEn();
      const grade=document.getElementById("grade")?.selectedOptions?.[0]?.textContent?.trim()||"";
      const subject=document.getElementById("subject")?.selectedOptions?.[0]?.textContent?.trim()||subjectId;
      const strict=en
        ? "Create a concise spoken mini-lesson for a primary-school learner about the selected topic. Use only stable, widely accepted primary-school facts. Avoid uncertain dates, numbers, names and advanced detail. Do not invent textbook claims. Keep it clear and age-appropriate."
        : "Φτιάξε ένα σύντομο προφορικό μικρομάθημα για μαθητή Δημοτικού πάνω στο επιλεγμένο θέμα. Χρησιμοποίησε μόνο σταθερές και ευρέως αποδεκτές γνώσεις επιπέδου Δημοτικού. Απόφυγε αβέβαιες ημερομηνίες, αριθμούς, ονόματα και προχωρημένες λεπτομέρειες. Μην επινοείς πράγματα σαν να προέρχονται από σχολικό βιβλίο. Γράψε καθαρά και κατάλληλα για την ηλικία.";
      const res=await fetch("/api/tutor-assistant",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        signal,
        body:JSON.stringify({
          context:strict,
          prompt:(en?"Topic: ":"Θέμα: ")+topic,
          audience:"study_user",
          task:"guided_task",
          mode:"understand",
          activity:"audio",
          cacheEligible:false,
          grade,subject,subjectId,topic,
          studyContext:{sourcePolicy:"primary_ai_reviewed"},
          documentText:"",documentName:"",documentKind:"",documentSourceUrl:""
        })
      });
      const body=await res.json().catch(()=>({}));
      if(!res.ok||!body?.text)throw new Error(body?.message||(en?"The primary-school audio lesson did not pass the AI check.":"Το ακουστικό μάθημα Δημοτικού δεν πέρασε τον έλεγχο AI."));
      return body;
    }

    // Audio prefers exact official grounding. Primary-school topics are allowed a
    // second-pass AI-reviewed fallback when an exact section is not mapped yet.
    async function runVerifiedAudioDirectly(button){
      const en=isEn();
      const subjectEl=document.getElementById("subject");
      const topicPick=document.getElementById("topicPick");
      const topicCustom=document.getElementById("topicCustom");
      const output=document.getElementById("aiOutput");
      const workspace=document.getElementById("aiWorkspace");
      if(!subjectEl||!output||!workspace)return false;

      let subjectId=String(subjectEl.value||"").trim();
      if(/^history-[cdest]+-dimotikou$/.test(subjectId))subjectId=subjectId.replace(/^history-/,"istoria-");
      const opt=topicPick?.selectedOptions?.[0];
      const topic=String(topicCustom?.value||"").trim() || String(opt?.dataset?.label||opt?.textContent||"").trim();
      if(!subjectId||!topic)return false;

      workspace.classList.remove("hidden");
      document.querySelector("main.grid")?.classList.add("study-result-open");
      const title=document.getElementById("workspaceTitle");
      if(title)title.textContent=en?"Listen to it":"Άκουσέ το";
      // Say up front that it can take up to a minute, with a running timer and progress bar,
      // so the learner knows it is working and does not leave.
      output.innerHTML='<div class="ai-loading"><strong class="ai-loading__text"></strong>'+
        '<div class="ai-loading__bar" aria-hidden="true"><span></span></div>'+
        '<p class="ai-loading__note" role="status">'+(en
          ?'This can take up to 1 minute. Please keep this page open — the audio lesson is being prepared.'
          :'Μπορεί να χρειαστεί έως 1 λεπτό. Μην κλείσεις τη σελίδα — το ακουστικό μάθημα ετοιμάζεται.')+'</p></div>';
      const startedAt=Date.now();
      const renderLoading=()=>{
        const box=output.querySelector(".ai-loading");
        const label=box?.querySelector(".ai-loading__text");
        if(!label)return false;
        const sec=Math.round((Date.now()-startedAt)/1000);
        label.textContent=(en?"Preparing your audio lesson from the official textbook… ":"Το AI ετοιμάζει το ακουστικό μάθημα από το επίσημο βιβλίο… ")+sec+"″";
        const bar=box.querySelector(".ai-loading__bar span");
        if(bar)bar.style.width=Math.min(95,Math.round(sec/60*100))+"%";
        const note=box.querySelector(".ai-loading__note");
        if(note&&sec>=60&&!note.dataset.late){note.dataset.late="1";note.textContent=en?"Almost ready — long sections need a little longer.":"Σχεδόν έτοιμο — οι μεγάλες ενότητες θέλουν λίγο ακόμη.";}
        return true;
      };
      renderLoading();
      const ticker=setInterval(()=>{if(!renderLoading())clearInterval(ticker)},1000);
      // Hard deadline: never leave the learner on an endless "preparing".
      const controller=new AbortController();
      const deadline=setTimeout(()=>controller.abort(),110000);
      document.getElementById("answerBox")?.classList.add("hidden");
      document.getElementById("puterFallback")?.classList.add("hidden");
      document.getElementById("audioControls")?.classList.add("hidden");
      document.getElementById("resultTools")?.classList.add("hidden");
      document.getElementById("altAi")?.classList.add("hidden");
      const provider=document.getElementById("providerStatus");
      if(provider)provider.textContent="";
      if(button)button.disabled=true;

      try{
        const res=await fetch("/api/source-summary",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          signal:controller.signal,
          body:JSON.stringify({subjectId,topic,sourceTitle:"",language:en?"en":"el",activity:"audio"})
        });
        let body=await res.json().catch(()=>({}));
        let primaryFallback=false;
        if((!res.ok||!body?.text) && /-dimotikou$/i.test(subjectId)){
          body=await primaryReviewedAudio(subjectId,topic,controller.signal);
          primaryFallback=true;
        }else if(res.status===422&&body?.error==="insufficient_verified_evidence"&&window.AITOOLSKIDS_SPECIAL_AUDIO_FALLBACK){
          // Ε.Α.Ε.: no simple lesson could be verified; use the grounded study tutor instead of failing.
          body={text:await window.AITOOLSKIDS_SPECIAL_AUDIO_FALLBACK(),verified:false};
        }else if(!res.ok||!body?.text){
          throw new Error(body?.message||(en?"Could not create the audio lesson.":"Δεν δημιουργήθηκε το ακουστικό μάθημα."));
        }
        output.textContent=body.text;
        if(provider)provider.textContent=primaryFallback
          ?(en?"Two-stage AI check · no exact textbook excerpt":"Έλεγχος AI δύο σταδίων · χωρίς ακριβές απόσπασμα βιβλίου")
          : body.verified
            ?(en?"Summary of the key ideas, checked against the official section.":"Σύνοψη των βασικών σημείων, ελεγμένη πάνω στην επίσημη ενότητα.")
            :(en?"Official-source summary":"Σύνοψη επίσημης πηγής");
        document.getElementById("audioControls")?.classList.remove("hidden");
        document.getElementById("resultTools")?.classList.remove("hidden");
        document.getElementById("altAi")?.classList.remove("hidden");
        setTimeout(enhanceNotebookCard,0);
      }catch(err){
        output.textContent=err?.name==="AbortError"
          ?(en?"This took too long. Please press «Listen to it» again.":"Η προετοιμασία άργησε πολύ. Πάτησε ξανά «Άκουσέ το» για νέα προσπάθεια.")
          :(err?.message||String(err));
      }finally{
        clearInterval(ticker);clearTimeout(deadline);
        if(button)button.disabled=false;
        workspace.scrollIntoView({behavior:"smooth",block:"nearest"});
      }
      return true;
    }

    function attachAudioGuard(){
      document.addEventListener("click",async(event)=>{
        const button=event.target?.closest?.('[data-action="audio"]');
        if(!button)return;
        // Uploaded notes intentionally keep the existing client flow, because
        // /api/source-summary is only for official schoolbook material.
        const clearNotes=document.getElementById("clearNotes");
        if(clearNotes&&!clearNotes.classList.contains("hidden"))return;
        event.preventDefault();
        event.stopImmediatePropagation();
        await runVerifiedAudioDirectly(button);
      },true);
    }

    function start(){
      installStudyRequestConsistencyGuard();
      enhanceNotebookCard();
      attachGridObserver();
      attachAudioGuard();

      // Language changes do not need a DOM-wide childList observer.
      new MutationObserver(()=>enhanceNotebookCard()).observe(document.documentElement,{
        attributes:true,
        attributeFilter:["lang"]
      });

      // In case altAiGrid itself is created after this script, check briefly without
      // touching the rest of the page or the AI request/response lifecycle.
      if(!document.getElementById("altAiGrid")){
        let attempts=0;
        const timer=setInterval(()=>{
          attempts+=1;
          enhanceNotebookCard();
          attachGridObserver();
          if(document.getElementById("altAiGrid") || attempts>=20) clearInterval(timer);
        },250);
      }
    }

    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
    else start();
  }
})();