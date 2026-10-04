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

    function start(){
      enhanceNotebookCard();
      attachGridObserver();

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