/**
 * School-track selector for AI Help.
 * Subscribes to the shared tutor-render event; never wraps AITutor.render.
 * Supports safe deep links from the Special Education page.
 */
(function(){
  "use strict";

  const RENDER_EVENT="aitools4kids:tutor-rendered";
  const STYLE_ID="aitools4kidsSpecialEducationTutorUi";
  const stateByContext=new Map();
  const appliedUrlRequests=new Set();

  function isEnglish(){
    return document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function text(key){
    const en=isEnglish();
    const T={
      label:["Σχολική διαδρομή","School track"],
      general:["Γενικό σχολείο","General school"],
      eneegyl:["ΕΝ.Ε.Ε.ΓΥ.-Λ.","EN.E.E.GY.-L."],
      specialGym:["Ειδικό Γυμνάσιο","Special Gymnasium"],
      pending:["σε επαλήθευση","verification pending"],
      verifiedOnly:["Εμφανίζονται μόνο στοιχεία με επαληθευμένη επίσημη βάση 2026–27. Όπου δεν έχει χαρτογραφηθεί ξεχωριστή ύλη, δίνεις εσύ το συγκεκριμένο θέμα/άσκηση.","Only items with a verified official 2026–27 basis are shown. Where no separate syllabus scope is mapped, provide the exact topic/exercise yourself."],
      noContent:["Δεν υπάρχει ακόμη επαληθευμένο περιεχόμενο","No verified content yet"]
    };
    return (T[key] || [key,key])[en?1:0];
  }

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .tutor-school-track-note{display:block;margin-top:5px;color:#64748b;font-size:.72rem;line-height:1.4}
      .tutor-field--school-track select{border-color:#c4b5fd;background:#fcfbff}
      @media(max-width:620px){.tutor-field--school-track{margin-bottom:10px}.tutor-field--school-track select{width:100%;max-width:100%}}
    `;
    document.head.appendChild(style);
  }

  function routeContext(){
    const parts=location.pathname.split("/").filter(Boolean);
    return {
      zoneId:["primary","middle","high"].includes(parts[0])?parts[0]:null,
      roleId:["guardian","student"].includes(parts[1])?parts[1]:null,
      lang:isEnglish()?"en":"el"
    };
  }

  function specialMeta(){ return window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG || null; }

  function exposedFor(zoneId,schoolType,gradeId=null){
    const items=specialMeta()?.exposed || [];
    return items.filter((x)=>x.zoneId===zoneId && x.schoolType===schoolType && (!gradeId || x.gradeId===gradeId));
  }

  function gradeLabel(gradeId,schoolType){
    const entries=window.SPECIAL_EDUCATION_CURRICULUM?.entries || {};
    const item=exposedFor(schoolType==="eneegyl"?"high":"middle",schoolType,gradeId)[0];
    if(item?.gradeLabel) return item.gradeLabel;
    if(item && entries[item.id]?.gradeLabel) return entries[item.id].gradeLabel;
    return gradeId.toUpperCase();
  }

  function contextKey(ctx){ return `${ctx.zoneId || ""}|${ctx.roleId || ""}`; }

  function storeBaseGrades(grade){
    return [...grade.options].map((o)=>({value:o.value,text:o.textContent,disabled:o.disabled}));
  }

  function restoreBaseGrades(grade,baseGrades,preferred){
    grade.replaceChildren();
    baseGrades.forEach((row)=>{
      const option=document.createElement("option");
      option.value=row.value;
      option.textContent=row.text;
      option.disabled=!!row.disabled;
      grade.appendChild(option);
    });
    if(preferred && [...grade.options].some((o)=>o.value===preferred)) grade.value=preferred;
  }

  function buildSpecialGrades(grade,ctx,track,preferred){
    const items=exposedFor(ctx.zoneId,track);
    const ids=[...new Set(items.map((x)=>x.gradeId))];
    grade.replaceChildren();
    ids.forEach((id)=>{
      const option=document.createElement("option");
      option.value=id;
      option.textContent=gradeLabel(id,track);
      grade.appendChild(option);
    });
    if(preferred && ids.includes(preferred)) grade.value=preferred;
  }

  function isSpecialSubjectId(id){
    return (specialMeta()?.exposed || []).some((x)=>x.id===id);
  }

  function filterSubjects(ctx,track,preferredSubject=null){
    const subject=document.getElementById("tutorSubject");
    const grade=document.getElementById("tutorGrade");
    if(!subject || !grade) return;
    const allowed=new Set(exposedFor(ctx.zoneId,track,grade.value).map((x)=>x.id));

    [...subject.options].forEach((option)=>{
      const special=isSpecialSubjectId(option.value);
      const keep=track==="general"?!special:allowed.has(option.value);
      if(!keep) option.remove();
    });

    if(!subject.options.length){
      const option=document.createElement("option");
      option.value="";
      option.disabled=true;
      option.textContent=text("noContent");
      subject.appendChild(option);
      subject.disabled=true;
    }else{
      subject.disabled=false;
      if(preferredSubject && [...subject.options].some((o)=>o.value===preferredSubject)) subject.value=preferredSubject;
      else subject.selectedIndex=0;
    }
    subject.dispatchEvent(new Event("change",{bubbles:true}));
    const mount=document.getElementById("tutorMount");
    if(mount) mount.dataset.schoolTrack=track;
  }

  function readUrlRequest(ctx,select){
    const key=contextKey(ctx);
    if(appliedUrlRequests.has(key)) return null;
    const params=new URLSearchParams(location.search);
    const track=params.get("schoolTrack") || "";
    const grade=params.get("grade") || "";
    const subject=params.get("subject") || "";
    if(!track || ![...select.options].some((o)=>o.value===track && !o.disabled)) return null;
    if(track==="eneegyl" && ctx.zoneId!=="high") return null;
    if(track==="special-gymnasium" && ctx.zoneId!=="middle") return null;
    appliedUrlRequests.add(key);
    return {track,grade,subject};
  }

  function switchTrack(ctx,select,grade,baseGrades,track,preferredGrade=null,preferredSubject=null){
    const key=contextKey(ctx);
    const previous=stateByContext.get(key) || {track:"general",generalGrade:grade.value};
    if(previous.track==="general" && grade.value) previous.generalGrade=grade.value;
    previous.track=track;
    if(track!=="general"){
      previous.specialGrade=preferredGrade || previous.specialGrade || grade.value;
      previous.pendingSubject=preferredSubject || null;
    }
    stateByContext.set(key,previous);

    if(track==="general"){
      restoreBaseGrades(grade,baseGrades,previous.generalGrade);
    }else{
      buildSpecialGrades(grade,ctx,track,preferredGrade || previous.specialGrade || grade.value);
      previous.specialGrade=grade.value;
    }
    select.value=track;
    grade.dispatchEvent(new Event("change",{bubbles:true}));
  }

  function enhance(context){
    const ctx=context?.zoneId?context:routeContext();
    if(!ctx?.zoneId || ctx.zoneId==="primary") return;
    const settings=document.querySelector("#tutorMount .tutor-settings");
    const grade=document.getElementById("tutorGrade");
    const subject=document.getElementById("tutorSubject");
    if(!settings || !grade || !subject || document.getElementById("tutorSchoolTrack")) return;

    injectStyles();
    const baseGrades=storeBaseGrades(grade);
    const field=document.createElement("label");
    field.className="tutor-field tutor-field--school-track";
    field.innerHTML=`<span>${text("label")}</span><select id="tutorSchoolTrack"></select><small class="tutor-school-track-note">${text("verifiedOnly")}</small>`;
    const gradeField=grade.closest(".tutor-field");
    gradeField?.insertAdjacentElement("beforebegin",field);
    const select=field.querySelector("select");

    const general=document.createElement("option");
    general.value="general";
    general.textContent=text("general");
    select.appendChild(general);

    if(ctx.zoneId==="high" && exposedFor("high","eneegyl").length){
      const option=document.createElement("option");
      option.value="eneegyl";
      option.textContent=text("eneegyl");
      select.appendChild(option);
    }

    if(ctx.zoneId==="middle"){
      const available=exposedFor("middle","special-gymnasium").length>0;
      const option=document.createElement("option");
      option.value="special-gymnasium";
      option.textContent=available?text("specialGym"):`${text("specialGym")} — ${text("pending")}`;
      option.disabled=!available;
      select.appendChild(option);
    }

    const key=contextKey(ctx);
    const urlRequest=readUrlRequest(ctx,select);
    const saved=stateByContext.get(key);
    const requestedTrack=urlRequest?.track || (saved?.track && [...select.options].some((o)=>o.value===saved.track && !o.disabled)?saved.track:"general");

    grade.addEventListener("change",()=>{
      const active=select.value || "general";
      const state=stateByContext.get(key) || {track:active};
      if(active!=="general") state.specialGrade=grade.value;
      const preferred=state.pendingSubject || null;
      stateByContext.set(key,state);
      queueMicrotask(()=>{
        filterSubjects(ctx,active,preferred);
        if(state.pendingSubject===preferred) state.pendingSubject=null;
      });
    });

    select.addEventListener("change",()=>switchTrack(ctx,select,grade,baseGrades,select.value || "general"));

    if(requestedTrack==="general"){
      select.value="general";
      filterSubjects(ctx,"general");
    }else{
      switchTrack(ctx,select,grade,baseGrades,requestedTrack,urlRequest?.grade || saved?.specialGrade || null,urlRequest?.subject || null);
    }
  }

  document.addEventListener(RENDER_EVENT,(event)=>enhance(event.detail?.context || null));
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>enhance(null),{once:true});
  else enhance(null);

  window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_UI=Object.freeze({version:3,enhance});
})();