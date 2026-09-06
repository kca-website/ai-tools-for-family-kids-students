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
    ["special-education-special-lyceum","/special-education-special-lyceum-data.js"],
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
      .tutor-school-track-note{display:block;margin-top:5px;color:#64748b;font-size:.72rem;line-height:1.4}
      .tutor-field--school-track select{border-color:#93c5fd;background:#f8fbff}
      .tutor-field--school-track.is-loading select{opacity:.65;pointer-events:none}
      @media(max-width:620px){.tutor-field--school-track{margin-bottom:10px}.tutor-field--school-track select{width:100%;max-width:100%}}
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

  function buildSpecialGrades(grade,track,preferred){
    const ids=[...new Set(exposedFor(track).map((x)=>x.gradeId))];
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

  function enhance(context){
    const ctx=context?.zoneId?context:routeContext();
    if(!ctx?.zoneId||!["middle","high"].includes(ctx.zoneId)||!ctx.roleId) return;
    const settings=document.querySelector("#tutorMount .tutor-settings");
    const grade=document.getElementById("tutorGrade");
    const subject=document.getElementById("tutorSubject");
    if(!settings||!grade||!subject||document.getElementById("tutorSchoolTrack")) return;

    injectStyles();
    const baseGrades=storeBaseGrades(grade);
    const field=document.createElement("label");
    field.className="tutor-field tutor-field--school-track";
    field.innerHTML=`<span>${text("label")}</span><select id="tutorSchoolTrack"></select><small class="tutor-school-track-note">${text("note")}</small>`;
    grade.closest(".tutor-field")?.insertAdjacentElement("beforebegin",field);
    const select=field.querySelector("select");
    addTrackOptions(select);

    const urlRequest=readUrlRequest();
    const pending=pendingSwitch&&pendingSwitch.roleId===ctx.roleId&&pendingSwitch.targetZone===ctx.zoneId?pendingSwitch:null;
    if(pending) pendingSwitch=null;
    const saved=stateByRole.get(ctx.roleId);
    const requested=pending||urlRequest||saved||{track:defaultTrackForZone(ctx.zoneId)};
    const track=TRACKS[requested.track]?requested.track:defaultTrackForZone(ctx.zoneId);

    grade.addEventListener("change",()=>{
      const active=select.value||defaultTrackForZone(ctx.zoneId);
      const state=stateByRole.get(ctx.roleId)||{track:active};
      state.grade=grade.value;
      stateByRole.set(ctx.roleId,state);
      queueMicrotask(()=>filterSubjects(active,state.subject||null));
    });

    select.addEventListener("change",async()=>{
      const chosen=select.value;
      const def=TRACKS[chosen];
      if(!def) return;
      const currentGrade=grade.value;
      if(def.zoneId!==ctx.zoneId||(def.special&&!specialRuntimeReady())){
        try{ await rerenderForTrack(ctx,chosen,null,null,field); }
        catch(_){
          field.classList.remove("is-loading");
          field.querySelector(".tutor-school-track-note").textContent=text("note");
          select.value=defaultTrackForZone(ctx.zoneId);
        }
        return;
      }
      applyTrackInPlace(ctx,chosen,currentGrade,null,select,grade,baseGrades);
    });

    // A direct special-school URL can arrive before its data has been loaded.
    if(TRACKS[track].special&&!specialRuntimeReady()){
      select.value=track;
      rerenderForTrack(ctx,track,requested.grade||null,requested.subject||null,field).catch(()=>{
        field.classList.remove("is-loading");
        field.querySelector(".tutor-school-track-note").textContent=text("note");
        select.value=defaultTrackForZone(ctx.zoneId);
      });
      return;
    }

    if(TRACKS[track].zoneId!==ctx.zoneId){
      rerenderForTrack(ctx,track,requested.grade||null,requested.subject||null,field).catch(()=>{});
      return;
    }

    applyTrackInPlace(ctx,track,requested.grade||null,requested.subject||null,select,grade,baseGrades);
  }

  document.addEventListener(RENDER_EVENT,(event)=>enhance(event.detail?.context||null));
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>enhance(null),{once:true});
  else enhance(null);

  window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_UI=Object.freeze({
    version:4,enhance,ensureSpecialRuntime,
    tracks:Object.freeze(Object.keys(TRACKS))
  });
})();