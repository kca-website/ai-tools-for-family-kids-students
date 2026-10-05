(function(){
  "use strict";
  if(location.pathname!=="/ai-scenarios.html"||window.__aiPathsKeepsakeV1) return;
  window.__aiPathsKeepsakeV1=true;

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
    `;
    document.head.appendChild(s);
  }

  function certificateHtml(name){
    const en=lang()==="en";
    const safeName=esc((name||"").trim().slice(0,40));
    const locale=en?"en-GB":"el-GR";
    const date=new Intl.DateTimeFormat(locale,{day:"2-digit",month:"long",year:"numeric"}).format(new Date());
    const title=en?"AI & Digital Skills Master":"AI & Digital Skills Master";
    const subtitle=en?"Completion keepsake":"Αναμνηστικό ολοκλήρωσης";
    const awarded=en?"Awarded to":"Απονέμεται στο";
    const noName=en?"AI Paths Explorer":"Εξερευνητή AI Διαδρομών";
    const body=en
      ?"for completing all six AI literacy paths and the hidden final challenge, practising verification, digital safety, responsible learning, information judgement and thoughtful AI tool choice."
      :"για την ολοκλήρωση και των έξι διαδρομών AI literacy και της κρυφής τελικής πρόκλησης, με εξάσκηση στον έλεγχο πληροφοριών, την ψηφιακή ασφάλεια, την υπεύθυνη μάθηση και τη σωστή επιλογή εργαλείων AI.";
    const note=en?"Keepsake from aitools4kids.gr. This is not an official certification or accredited qualification.":"Αναμνηστικό από το aitools4kids.gr. Δεν αποτελεί επίσημη πιστοποίηση ή αναγνωρισμένο τίτλο.";
    const badges=BADGES.map(b=>`<span><b>${b[0]}</b>${esc(en?b[2]:b[1])}</span>`).join("");
    return `<!doctype html><html lang="${en?"en":"el"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subtitle)} - aitools4kids.gr</title><style>
      @page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{margin:0;background:#eef4f8;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#17202b}.page{min-height:185mm;background:linear-gradient(135deg,#fff 0%,#f4fbff 55%,#f8f3ff 100%);border:7px solid #1d5d8c;border-radius:22px;padding:24px 32px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden}.page:before,.page:after{content:"";position:absolute;border-radius:50%;opacity:.18}.page:before{width:260px;height:260px;background:#45a778;left:-110px;top:-110px}.page:after{width:320px;height:320px;background:#7659b7;right:-150px;bottom:-160px}.brand{display:flex;align-items:center;gap:10px;font-weight:850;color:#1d5d8c;font-size:18px;z-index:1}.brand img{width:42px;height:42px;border-radius:12px}.cup{font-size:58px;margin:10px 0 2px;z-index:1}.kicker{font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:#237356;font-size:14px;z-index:1}h1{font-size:37px;line-height:1.1;margin:8px 0 5px;z-index:1}.to{margin-top:12px;color:#637080;z-index:1}.name{font-family:Georgia,serif;font-size:34px;font-weight:700;margin:3px 0 10px;border-bottom:2px solid #d7c36c;padding:0 22px 5px;min-width:280px;z-index:1}.desc{max-width:790px;font-size:16px;line-height:1.55;margin:0 auto 14px;color:#425266;z-index:1}.badges{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:900px;z-index:1}.badges span{display:flex;align-items:center;gap:5px;background:#fff;border:1px solid #dbe6ed;padding:7px 10px;border-radius:999px;font-size:12px;font-weight:700}.badges b{font-size:17px}.meta{display:flex;gap:18px;margin-top:15px;font-size:13px;color:#637080;z-index:1}.note{margin-top:11px;font-size:10px;color:#7a8490;z-index:1}.actions{margin-top:14px;z-index:2}.actions button{border:0;border-radius:10px;background:#1d5d8c;color:#fff;padding:10px 16px;font-weight:800;cursor:pointer}@media print{body{background:#fff}.page{min-height:180mm}.actions{display:none}}
    </style></head><body><main class="page"><div class="brand"><img src="https://www.aitools4kids.gr/assets/icons/app-icon.svg" alt="">aitools4kids.gr</div><div class="cup">🏆</div><div class="kicker">${esc(subtitle)}</div><h1>${title}</h1><div class="to">${esc(awarded)}</div><div class="name">${safeName||esc(noName)}</div><p class="desc">${esc(body)}</p><div class="badges">${badges}</div><div class="meta"><span>${en?"Age path":"Ηλικιακή διαδρομή"}: ${esc(age())}</span><span>${en?"Completed":"Ολοκλήρωση"}: ${esc(date)}</span></div><div class="note">${esc(note)}</div><div class="actions"><button onclick="window.print()">${en?"Print / Save as PDF":"Εκτύπωση / Αποθήκευση ως PDF"}</button></div></main></body></html>`;
  }

  function openKeepsake(name){
    const w=window.open("","_blank","noopener,noreferrer");
    if(!w){alert(tr("Ο browser εμπόδισε το νέο παράθυρο. Επίτρεψε pop-ups για να ανοίξει το αναμνηστικό.","Your browser blocked the new window. Allow pop-ups to open the keepsake."));return}
    w.document.open();
    w.document.write(certificateHtml(name));
    w.document.close();
  }

  function enhanceMaster(){
    const master=$(".ai-master");
    if(!master||$("#aiKeepsake",master)) return;
    styles();
    const box=document.createElement("section");
    box.id="aiKeepsake";
    box.className="ai-keepsake";
    box.setAttribute("aria-labelledby","aiKeepsakeTitle");
    box.innerHTML=`<h4 id="aiKeepsakeTitle">🎁 ${tr("Πάρε το αναμνηστικό σου","Get your completion keepsake")}</h4><p>${tr("Γράψε προαιρετικά μόνο το μικρό σου όνομα. Δεν αποθηκεύεται και δεν στέλνεται πουθενά.","Optionally enter only your first name. It is not stored or sent anywhere.")}</p><div class="ai-keepsake__row"><label style="position:absolute;left:-9999px" for="aiKeepsakeName">${tr("Μικρό όνομα","First name")}</label><input id="aiKeepsakeName" maxlength="40" autocomplete="off" placeholder="${tr("Μικρό όνομα (προαιρετικό)","First name (optional)")}"><button class="btn btn--primary" type="button" id="aiKeepsakeBtn">${tr("Πάρε το αναμνηστικό σου","Open keepsake")}</button></div><small>${tr("Θα ανοίξει έτοιμη κάρτα για εκτύπωση ή αποθήκευση ως PDF. Δεν αποτελεί επίσημη πιστοποίηση.","A print-ready card will open so you can print it or save it as a PDF. It is not an official certification.")}</small>`;
    master.appendChild(box);
    $("#aiKeepsakeBtn",box).addEventListener("click",()=>openKeepsake($("#aiKeepsakeName",box).value));
  }

  function bind(){
    styles();
    const lab=$("#lab");
    if(!lab) return;
    new MutationObserver(enhanceMaster).observe(lab,{childList:true,subtree:true});
    new MutationObserver(()=>setTimeout(enhanceMaster,0)).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
    enhanceMaster();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind,{once:true}); else bind();
})();