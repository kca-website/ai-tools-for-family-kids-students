/**
 * Unified school selector for AI Help.
 *
 * One AI Help/Puter experience can switch between General Gymnasium, General
 * Lyceum, Special Gymnasium, Special Lyceum and EN.E.E.GY.-L. Special Education
 * data is lazy-loaded only after a special-school selection/deep link.
 *
 * Subscribes to the shared tutor-render event; never wraps AITutor.render.
 */
(function(){
  "use strict";

  const RENDER_EVENT="aitools4kids:tutor-rendered";
  const STYLE_ID="aitools4kidsSpecialEducationTutorUi";
  const stateByRole=new Map();
  let specialRuntimePromise=null;
  let pendingSwitch=null;

  const TRACKS=Object.freeze({
    "general-middle":{zoneId:"middle",special:false},
    "general-high":{zoneId:"high",special:false},
    "special-gymnasium":{zoneId:"middle",special:true},
    "special-lyceum":{zoneId:"high",special:true},
    "eneegyl":{zoneId:"high",special:true}
  });

  const SPECIAL_SCRIPTS=[
    ["special-education-curriculum","/special-education-curriculum-data.js"],
    ["special-education-learning","/special-education-learning-data.js"],
    ["special-education-quiz","/special-education-quiz-data.js"],
    ["special-education-economy","/special-education-sector-economy-data.js"],
    ["special-education-special-gymnasium","/special-education-special-gymnasium-data.js"],
    ["special-gym-annual-2026-2027","/teacher-curriculum-special-gym-annual-2026-2027.js"],
    ["special-lyceum-annual-2026-2027","/teacher-curriculum-special-lyceum-annual-2026-2027.js"],
    ["special-education-special-lyceum-learning","/special-education-special-lyceum-learning-2026-2027.js"],
    ["special-education-special-lyceum","/special-education-special-lyceum-data.js"],
    ["special-education-eneegyl-structure","/special-education-eneegyl-structure-data.js"],
    ["eneegyl-official-sectors-2026-2027","/teacher-curriculum-eneegyl-official-sectors-2026-2027.js"],
    ["eneegyl-informatics-2026-2027","/teacher-curriculum-eneegyl-informatics-2026-2027.js"],
    ["special-education-eneegyl-informatics-learning","/special-education-eneegyl-informatics-learning-2026-2027.js"],
    ["special-education-eneegyl-a-learning","/special-education-eneegyl-a-learning-2026-2027.js"],
    ["special-education-eneegyl-bc-learning","/special-education-eneegyl-bc-learning-2026-2027.js"],
    ["special-education-framework-learning","/special-education-framework-learning-2026-2027.js"],
    ["eneegyl-chemistry-2026-2027","/teacher-curriculum-eneegyl-chemistry-2026-2027.js"],
    ["eneegyl-math-2026-2027","/teacher-curriculum-eneegyl-math-2026-2027.js"],
    ["eneegyl-physics-2026-2027","/teacher-curriculum-eneegyl-physics-2026-2027.js"],
    ["eneegyl-new-greek-2026-2027","/teacher-curriculum-eneegyl-new-greek-2026-2027.js"],
    ["eneegyl-english-2026-2027","/teacher-curriculum-eneegyl-english-2026-2027.js"],
    ["special-education-tutor-context","/special-education-tutor-context.js"],
    ["special-education-tutor-catalog","/special-education-tutor-catalog.js"]
  ];

  function isEnglish(){
    return document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang||"").toLowerCase().startsWith("en");
  }

  function text(key){
    const en=isEnglish();
    const T={
      label:["Σχολείο","School"],
      generalMiddle:["Γενικό Γυμνάσιο","General Middle School"],
      generalHigh:["Γενικό Λύκειο","General Lyceum"],
      specialGym:["Ειδικό Γυμνάσιο","Special Gymnasium"],
      specialLyceum:["Ειδικό Λύκειο","Special Lyceum"],
      eneegyl:["ΕΝ.Ε.Ε.ΓΥ.-Λ.","EN.E.E.GY.-L."],
      note:["Διάλεξε σχολείο, μετά τάξη και μάθημα. Η ίδια AI Βοήθεια προσαρμόζει το πλαίσιο χωρίς να αλλάζεις εργαλείο.","Choose school, then grade and subject. The same AI Help adapts its context without changing tools."],
      loading:["Φόρτωση σχολικού πλαισίου…","Loading school context…"],
      noContent:["Δεν υπάρχει ακόμη διαθέσιμο περιεχόμενο","No content available yet"]
    };
    return (T[key]||[key,key])[en?1:0];
  }

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .tutor-special-context{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:10px 12px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff;color:#334155}
      .tutor-special-context__copy{min-width:0}
      .tutor-special-context__copy strong{display:block;font-size:.84rem;color:#1e3a5f}
      .tutor-special-context__copy small{display:block;margin-top:2px;font-size:.72rem;line-height:1.35;color:#64748b}
      .tutor-special-context__back{flex:0 0 auto;font-size:.74rem;font-weight:800;color:#2563eb;text-decoration:none;white-space:nowrap}
      .tutor-special-context__back:hover{text-decoration:underline}
      .tutor-special-context.is-loading{opacity:.7}
      @media(max-width:620px){.tutor-special-context{align-items:flex-start;flex-direction:column}.tutor-special-context__back{white-space:normal}}
    `;
    document.head.appendChild(style);
  }

  function routeContext(){
    const parts=location.pathname.split("/").filter(Boolean);
    return {
      zoneId:["middle","high"].includes(parts[0])?parts[0]:null,
      roleId:["guardian","student"].includes(parts[1])?parts[1]:null,
      lang:isEnglish()?"en":"el"
    };
  }

  function appendScript(id,src){
    if(document.querySelector(`script[data-special-education-runtime="${id}"]`)) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src=src;
      script.async=false;
      script.dataset.specialEducationRuntime=id;
      script.onload=()=>resolve();
      script.onerror=()=>reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function specialRuntimeReady(){
    return !!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG;
  }

  function ensureSpecialRuntime(){
    if(specialRuntimeReady()) return Promise.resolve(window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG);
    if(specialRuntimePromise) return specialRuntimePromise;
    specialRuntimePromise=(async()=>{
      for(const [id,src] of SPECIAL_SCRIPTS) await appendScript(id,src);
      if(!specialRuntimeReady()) throw new Error("Special Education catalog did not initialize.");
      // The shared action adapter loads before this lazy catalog. Apply it now so
      // the first Special Education render already contains all support actions.
      window.AITOOLSKIDS_SPECIAL_TUTOR_ACTIONS?.apply?.();
      return window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG;
    })().catch((err)=>{
      specialRuntimePromise=null;
      console.error("Special Education runtime failed to load.",err);
      throw err;
    });
    return specialRuntimePromise;
  }

  function specialMeta(){ return window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG||null; }
  function exposedFor(track,gradeId=null){
    const def=TRACKS[track];
    const items=specialMeta()?.exposed||[];
    return items.filter((x)=>x.zoneId===def?.zoneId&&x.schoolType===track&&(!gradeId||x.gradeId===gradeId));
  }

  function gradeLabel(gradeId,track){
    const item=exposedFor(track,gradeId)[0];
    if(item?.gradeLabel) return item.gradeLabel;
    const entry=window.SPECIAL_EDUCATION_CURRICULUM?.entries?.[item?.id];
    if(entry?.gradeLabel) return entry.gradeLabel;
    if(track==="special-lyceum") return `${gradeId.toUpperCase()}΄ Λυκείου`;
    if(track==="special-gymnasium") return `${gradeId.toUpperCase()}΄ Γυμνασίου`;
    return gradeId.toUpperCase();
  }

  function isSpecialSubjectId(id){
    return (specialMeta()?.exposed||[]).some((x)=>x.id===id);
  }

  function storeBaseGrades(grade){
    return [...grade.options].map((o)=>({value:o.value,text:o.textContent,disabled:o.disabled}));
  }

  function restoreBaseGrades(grade,baseGrades,preferred){
    grade.replaceChildren();
    baseGrades.forEach((row)=>{
      const option=document.createElement("option");
      option.value=row.value; option.textContent=row.text; option.disabled=!!row.disabled;
      grade.appendChild(option);
    });
    if(preferred&&[...grade.options].some((o)=>o.value===preferred)) grade.value=preferred;
  }

  function orderedSpecialGradeIds(track){
    const ids=[...new Set(exposedFor(track).map((x)=>x.gradeId))];
    if(track!=="eneegyl") return ids;
    const official=window.ENEEGYL_2026_2027_STRUCTURE?.gradeOrder||[];
    return [...official.filter((id)=>ids.includes(id)),...ids.filter((id)=>!official.includes(id))];
  }

  function buildSpecialGrades(grade,track,preferred){
    const ids=orderedSpecialGradeIds(track);
    grade.replaceChildren();
    ids.forEach((id)=>{
      const option=document.createElement("option");
      option.value=id; option.textContent=gradeLabel(id,track); grade.appendChild(option);
    });
    if(preferred&&ids.includes(preferred)) grade.value=preferred;
  }

  function filterSubjects(track,preferredSubject=null){
    const subject=document.getElementById("tutorSubject");
    const grade=document.getElementById("tutorGrade");
    if(!subject||!grade) return;
    const special=TRACKS[track]?.special;
    const allowed=special?new Set(exposedFor(track,grade.value).map((x)=>x.id)):null;

    [...subject.options].forEach((option)=>{
      const optionIsSpecial=isSpecialSubjectId(option.value);
      const keep=special?allowed.has(option.value):!optionIsSpecial;
      if(!keep) option.remove();
    });

    if(!subject.options.length){
      const option=document.createElement("option");
      option.value=""; option.disabled=true; option.textContent=text("noContent");
      subject.appendChild(option); subject.disabled=true;
    }else{
      subject.disabled=false;
      if(preferredSubject&&[...subject.options].some((o)=>o.value===preferredSubject)) subject.value=preferredSubject;
      else subject.selectedIndex=0;
    }
    subject.dispatchEvent(new Event("change",{bubbles:true}));
    const mount=document.getElementById("tutorMount");
    if(mount) mount.dataset.schoolTrack=track;
  }

  function defaultTrackForZone(zoneId){ return zoneId==="middle"?"general-middle":"general-high"; }

  function readUrlRequest(){
    const params=new URLSearchParams(location.search);
    const track=params.get("schoolTrack")||"";
    if(!TRACKS[track]?.special) return null;
    return {track,grade:params.get("grade")||"",subject:params.get("subject")||""};
  }

  function cleanUrl(targetZone,roleId,track=null,grade=null,subject=null){
    const params=new URLSearchParams();
    if(track&&TRACKS[track]?.special){
      params.set("schoolTrack",track);
      if(grade) params.set("grade",grade);
      if(subject) params.set("subject",subject);
    }
    const query=params.toString();
    return `/${targetZone}/${roleId}/tutor${query?`?${query}`:""}`;
  }

  async function rerenderForTrack(ctx,track,grade=null,subject=null,field=null){
    const def=TRACKS[track];
    if(!def) return;
    if(def.special){
      field?.classList.add("is-loading");
      const note=field?.querySelector(".tutor-school-track-note");
      if(note) note.textContent=text("loading");
      await ensureSpecialRuntime();
    }
    pendingSwitch={track,grade,subject,roleId:ctx.roleId,targetZone:def.zoneId};
    stateByRole.set(ctx.roleId,{track,grade,subject});
    history.replaceState({},"",cleanUrl(def.zoneId,ctx.roleId,track,grade,subject));
    window.AITutor?.render?.({zoneId:def.zoneId,roleId:ctx.roleId,lang:isEnglish()?"en":"el"});
  }

  function applyTrackInPlace(ctx,track,grade,subject,select,gradeEl,baseGrades){
    const def=TRACKS[track];
    if(!def) return;
    if(def.special) buildSpecialGrades(gradeEl,track,grade||gradeEl.value);
    else restoreBaseGrades(gradeEl,baseGrades,grade||gradeEl.value);
    select.value=track;
    gradeEl.dispatchEvent(new Event("change",{bubbles:true}));
    queueMicrotask(()=>filterSubjects(track,subject||null));
    stateByRole.set(ctx.roleId,{track,grade:gradeEl.value,subject:subject||null});
    history.replaceState({},"",cleanUrl(def.zoneId,ctx.roleId,track,gradeEl.value,subject));
  }

  function addTrackOptions(select){
    const rows=[
      ["general-middle",text("generalMiddle")],
      ["general-high",text("generalHigh")],
      ["special-gymnasium",text("specialGym")],
      ["special-lyceum",text("specialLyceum")],
      ["eneegyl",text("eneegyl")]
    ];
    rows.forEach(([value,label])=>{
      const option=document.createElement("option");
      option.value=value; option.textContent=label; select.appendChild(option);
    });
  }

  function specialTrackLabel(track){
    if(track==="special-gymnasium") return text("specialGym");
    if(track==="special-lyceum") return text("specialLyceum");
    if(track==="eneegyl") return text("eneegyl");
    return "";
  }

  function enhance(context){
    const ctx=context?.zoneId?context:routeContext();
    if(!ctx?.zoneId||!["middle","high"].includes(ctx.zoneId)||!ctx.roleId) return;

    const urlRequest=readUrlRequest();

    // Normal Gymnasium/Lyceum pages stay clean. Special-school selection lives
    // on /special-education.html and enters the tutor through a deep link.
    if(!urlRequest){
      document.getElementById("tutorSpecialSchoolContext")?.remove();
      return;
    }

    const settings=document.querySelector("#tutorMount .tutor-settings");
    const grade=document.getElementById("tutorGrade");
    const subject=document.getElementById("tutorSubject");
    if(!settings||!grade||!subject) return;

    injectStyles();

    let field=document.getElementById("tutorSpecialSchoolContext");
    if(!field){
      field=document.createElement("div");
      field.id="tutorSpecialSchoolContext";
      field.className="tutor-special-context";
      grade.closest(".tutor-field")?.insertAdjacentElement("beforebegin",field);
    }

    field.innerHTML=`<div class="tutor-special-context__copy"><strong>${specialTrackLabel(urlRequest.track)}</strong><small>${isEnglish()?"Special Education context selected from the dedicated page.":"Πλαίσιο Ειδικής Αγωγής από την ειδική σελίδα. Τάξη και μάθημα προσαρμόζονται εδώ χωρίς να αναμειγνύονται με το Γενικό Λύκειο/Γυμνάσιο."}</small></div><a class="tutor-special-context__back" href="/special-education.html">${isEnglish()?"← Special Education":"← Ειδική Αγωγή"}</a>`;

    const requested=urlRequest;
    const track=requested.track;
    const def=TRACKS[track];
    if(!def?.special) return;

    const applySpecial=()=>{
      buildSpecialGrades(grade,track,requested.grade||grade.value);
      grade.dispatchEvent(new Event("change",{bubbles:true}));
      queueMicrotask(()=>filterSubjects(track,requested.subject||null));
      history.replaceState({},"",cleanUrl(def.zoneId,ctx.roleId,track,grade.value,requested.subject||null));
    };

    if(!specialRuntimeReady()){
      field.classList.add("is-loading");
      ensureSpecialRuntime().then(()=>{
        applySpecial();
        field.classList.remove("is-loading");
      }).catch(()=>{
        field.classList.remove("is-loading");
      });
      return;
    }

    applySpecial();
  }
  document.addEventListener(RENDER_EVENT,(event)=>enhance(event.detail?.context||null));
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>enhance(null),{once:true});
  else enhance(null);

  window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_UI=Object.freeze({
    version:7,enhance,ensureSpecialRuntime,
    tracks:Object.freeze(Object.keys(TRACKS))
  });
})();
