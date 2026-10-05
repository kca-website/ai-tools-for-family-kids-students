(function(){
  "use strict";
  if(location.pathname!=="/ai-scenarios.html"||window.__aiPathsKeepsakeV2) return;
  window.__aiPathsKeepsakeV2=true;

  const $=(s,r=document)=>r.querySelector(s);
  const lang=()=>document.documentElement.lang.toLowerCase().startsWith("en")?"en":"el";
  const tr=(el,en)=>lang()==="en"?en:el;
  const age=()=>$(".age button.active")?.dataset.age||"9-12";
  const BADGES=[
    ["🧠","Σήμα Ελέγχου AI","AI Verification Badge"],
    ["🔐","Σήμα Ψηφιακής Ασφάλειας","Digital Safety Badge"],
    ["🎒","Σήμα Έξυπνης Μελέτης","Smart Learning Badge"],
    ["🖼️","Σήμα Ελέγχου Πληροφορίας","Information Check Badge"],
    ["🧭","Σήμα Επιλογής AI","AI Tool Choice Badge"],
    ["🏆","Σήμα Κρίσης AI","AI Judgement Badge"]
  ];

  function esc(v){return String(v||"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"})[c])}

  function styles(){
    if($("#aiKeepsakeStyles")) return;
    const s=document.createElement("style");
    s.id="aiKeepsakeStyles";
    s.textContent=`
      .ai-keepsake{margin-top:22px;padding:18px;border-radius:18px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.24);text-align:left}
      .ai-keepsake h4{margin:0 0 7px;font-size:1.12rem}.ai-keepsake p{margin:0 0 13px!important;font-size:.9rem;color:#eee7f8!important}.ai-keepsake__row{display:flex;gap:9px;flex-wrap:wrap;align-items:stretch}.ai-keepsake input{flex:1 1 210px;min-height:46px;border:1px solid rgba(255,255,255,.38);border-radius:11px;padding:0 12px;background:#fff;color:#17202b;font:inherit}.ai-keepsake input:focus-visible{outline:3px solid #ffd85e;outline-offset:2px}.ai-keepsake button{min-height:46px}.ai-keepsake small{display:block;margin-top:9px;color:#dcd5e8;line-height:1.45}
      .ai-keepsake-preview{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.78);padding:24px;overflow:auto;display:grid;place-items:center}.ai-keepsake-preview[hidden]{display:none}.ai-keepsake-preview__shell{width:min(1120px,100%);background:#fff;border-radius:18px;padding:16px;box-shadow:0 24px 70px rgba(0,0,0,.3)}.ai-keepsake-preview__toolbar{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px}.ai-keepsake-preview__toolbar strong{color:#17202b}.ai-keepsake-preview__actions{display:flex;gap:8px;flex-wrap:wrap}.ai-keepsake-preview__actions button{border:0;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}.ai-keepsake-preview__print{background:#1d5d8c;color:#fff}.ai-keepsake-preview__close{background:#edf2f5;color:#17202b}
      .ai-certificate{min-height:185mm;background:linear-gradient(135deg,#fff 0%,#f4fbff 55%,#f8f3ff 100%);border:7px solid #1d5d8c;border-radius:22px;padding:24px 32px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden;color:#17202b}.ai-certificate:before,.ai-certificate:after{content:"";position:absolute;border-radius:50%;opacity:.18}.ai-certificate:before{width:260px;height:260px;background:#45a778;left:-110px;top:-110px}.ai-certificate:after{width:320px;height:320px;background:#7659b7;right:-150px;bottom:-160px}.ai-certificate .brand{display:flex;align-items:center;gap:10px;font-weight:850;color:#1d5d8c;font-size:18px;z-index:1}.ai-certificate .brand img{width:42px;height:42px;border-radius:12px}.ai-certificate .cup{font-size:58px;margin:10px 0 2px;z-index:1}.ai-certificate .kicker{font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:#237356;font-size:14px;z-index:1}.ai-certificate h1{font-size:37px;line-height:1.1;margin:8px 0 5px;z-index:1}.ai-certificate .to{margin-top:12px;color:#637080;z-index:1}.ai-certificate .name{font-family:Georgia,serif;font-size:34px;font-weight:700;margin:3px 0 10px;border-bottom:2px solid #d7c36c;padding:0 22px 5px;min-width:280px;z-index:1}.ai-certificate .desc{max-width:790px;font-size:16px;line-height:1.55;margin:0 auto 14px;color:#425266;z-index:1}.ai-certificate .badges{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:900px;z-index:1}.ai-certificate .badges span{display:flex;align-items:center;gap:5px;background:#fff;border:1px solid #dbe6ed;padding:7px 10px;border-radius:999px;font-size:12px;font-weight:700}.ai-certificate .badges b{font-size:17px}.ai-certificate .meta{display:flex;gap:18px;margin-top:15px;font-size:13px;color:#637080;z-index:1}.ai-certificate .note{margin-top:11px;font-size:10px;color:#7a8490;z-index:1}
      @media(max-width:760px){.ai-keepsake-preview{padding:8px}.ai-keepsake-preview__toolbar{align-items:flex-start;flex-direction:column}.ai-certificate{min-height:auto;padding:24px 16px}.ai-certificate h1{font-size:28px}.ai-certificate .name{font-size:27px;min-width:0;width:100%}.ai-certificate .meta{flex-direction:column;gap:3px}}
      @media print{@page{size:A4 landscape;margin:10mm}body>*:not(#aiKeepsakePreview){display:none!important}#aiKeepsakePreview{display:block!important;position:static!important;background:#fff!important;padding:0!important;overflow:visible!important}#aiKeepsakePreview .ai-keepsake-preview__shell{width:100%!important;max-width:none!important;padding:0!important;box-shadow:none!important;border-radius:0!important}#aiKeepsakePreview .ai-keepsake-preview__toolbar{display:none!important}#aiKeepsakePreview .ai-certificate{min-height:180mm!important}}
    `;
    document.head.appendChild(s);
  }

  function certificateMarkup(name){
    const en=lang()==="en";
    const safeName=esc((name||"").trim().slice(0,40));
    const locale=en?"en-GB":"el-GR";
    const date=new Intl.DateTimeFormat(locale,{day:"2-digit",month:"long",year:"numeric"}).format(new Date());
    const subtitle=en?"Completion keepsake":"Αναμνηστικό ολοκλήρωσης";
    const awarded=en?"Awarded to":"Απονέμεται στο";
    const noName=en?"AI Paths Explorer":"Εξερευνητή AI Διαδρομών";
    const body=en
      ?"for completing all six AI literacy paths and the hidden final challenge, practising verification, digital safety, responsible learning, information judgement and thoughtful AI tool choice."
      :"για την ολοκλήρωση και των έξι διαδρομών AI literacy και της κρυφής τελικής πρόκλησης, με εξάσκηση στον έλεγχο πληροφοριών, την ψηφιακή ασφάλεια, την υπεύθυνη μάθηση και τη σωστή επιλογή εργαλείων AI.";
    const note=en?"Keepsake from aitools4kids.gr. This is not an official certification or accredited qualification.":"Αναμνηστικό από το aitools4kids.gr. Δεν αποτελεί επίσημη πιστοποίηση ή αναγνωρισμένο τίτλο.";
    const badges=BADGES.map(b=>`<span><b>${b[0]}</b>${esc(en?b[2]:b[1])}</span>`).join("");
    return `<main class="ai-certificate"><div class="brand"><img src="/assets/icons/app-icon.svg" alt="">aitools4kids.gr</div><div class="cup">🏆</div><div class="kicker">${esc(subtitle)}</div><h1>AI & Digital Skills Master</h1><div class="to">${esc(awarded)}</div><div class="name">${safeName||esc(noName)}</div><p class="desc">${esc(body)}</p><div class="badges">${badges}</div><div class="meta"><span>${en?"Age path":"Ηλικιακή διαδρομή"}: ${esc(age())}</span><span>${en?"Completed":"Ολοκλήρωση"}: ${esc(date)}</span></div><div class="note">${esc(note)}</div></main>`;
  }

  function closePreview(){const p=$("#aiKeepsakePreview");if(!p)return;p.hidden=true;document.body.style.overflow="";$("#aiKeepsakeBtn")?.focus()}

  function openKeepsake(name){
    styles();
    let preview=$("#aiKeepsakePreview");
    if(!preview){
      preview=document.createElement("section");
      preview.id="aiKeepsakePreview";
      preview.className="ai-keepsake-preview";
      preview.hidden=true;
      preview.setAttribute("role","dialog");
      preview.setAttribute("aria-modal","true");
      document.body.appendChild(preview);
    }
    preview.setAttribute("aria-label",tr("Προεπισκόπηση αναμνηστικού ολοκλήρωσης","Completion keepsake preview"));
    preview.innerHTML=`<div class="ai-keepsake-preview__shell"><div class="ai-keepsake-preview__toolbar"><strong>🏆 ${tr("Το αναμνηστικό σου είναι έτοιμο","Your keepsake is ready")}</strong><div class="ai-keepsake-preview__actions"><button type="button" class="ai-keepsake-preview__close" id="aiKeepsakeClose">${tr("Κλείσιμο","Close")}</button><button type="button" class="ai-keepsake-preview__print" id="aiKeepsakePrint">${tr("Εκτύπωση / Αποθήκευση ως PDF","Print / Save as PDF")}</button></div></div>${certificateMarkup(name)}</div>`;
    preview.hidden=false;
    document.body.style.overflow="hidden";
    $("#aiKeepsakeClose",preview).onclick=closePreview;
    $("#aiKeepsakePrint",preview).onclick=()=>window.print();
    $("#aiKeepsakeClose",preview).focus();
  }

  function enhanceMaster(){
    const master=$(".ai-master");
    if(!master||$("#aiKeepsake",master)) return;
    styles();
    const box=document.createElement("section");
    box.id="aiKeepsake";
    box.className="ai-keepsake";
    box.setAttribute("aria-labelledby","aiKeepsakeTitle");
    box.innerHTML=`<h4 id="aiKeepsakeTitle">🎁 ${tr("Πάρε το αναμνηστικό σου","Get your completion keepsake")}</h4><p>${tr("Γράψε προαιρετικά μόνο το μικρό σου όνομα. Δεν αποθηκεύεται και δεν στέλνεται πουθενά.","Optionally enter only your first name. It is not stored or sent anywhere.")}</p><div class="ai-keepsake__row"><label style="position:absolute;left:-9999px" for="aiKeepsakeName">${tr("Μικρό όνομα","First name")}</label><input id="aiKeepsakeName" maxlength="40" autocomplete="off" placeholder="${tr("Μικρό όνομα (προαιρετικό)","First name (optional)")}"><button class="btn btn--primary" type="button" id="aiKeepsakeBtn">${tr("Πάρε το αναμνηστικό σου","View keepsake")}</button></div><small>${tr("Η κάρτα θα εμφανιστεί εδώ, χωρίς pop-up. Από εκεί μπορείς να την εκτυπώσεις ή να την αποθηκεύσεις ως PDF. Δεν αποτελεί επίσημη πιστοποίηση.","The card will open here without a pop-up. From there you can print it or save it as a PDF. It is not an official certification.")}</small>`;
    master.appendChild(box);
    $("#aiKeepsakeBtn",box).addEventListener("click",()=>openKeepsake($("#aiKeepsakeName",box).value));
  }

  function bind(){
    styles();
    const lab=$("#lab");
    if(!lab) return;
    new MutationObserver(enhanceMaster).observe(lab,{childList:true,subtree:true});
    new MutationObserver(()=>setTimeout(enhanceMaster,0)).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#aiKeepsakePreview")?.hidden)closePreview()});
    enhanceMaster();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind,{once:true}); else bind();
})();