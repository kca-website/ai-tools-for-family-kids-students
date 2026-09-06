/**
 * School-track selector for AI Help.
 * Subscribes to the shared tutor-render event; never wraps AITutor.render.
 */
(function(){
  "use strict";

  const RENDER_EVENT="aitools4kids:tutor-rendered";
  const STYLE_ID="aitools4kidsSpecialEducationTutorUi";
  const stateByContext=new Map();

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
      verifiedOnly:["Εμφανίζονται μόνο ενότητες με επαληθευμένη επίσημη βάση 2026–27.","Only units with a verified official 2026–27 basis are shown."],
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
    return item && entries[item.id]?.gradeLabel ? entries[item.id].gradeLabel : gradeId.toUpperCase();
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

  function filterSubjects(ctx,track){
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
      subject.selectedIndex=0;
    }
    subject.dispatchEvent(new Event("change",{bubbles:true}));
    const mount=document.getElementById("tutorMount");
    if(mount) mount.dataset.schoolTrack=track;
  }

  function switchTrack(ctx,select,grade,baseGrades,track){
    const key=contextKey(ctx);
    const previous=stateByContext.get(key) || {track:"general",generalGrade:grade.value};
    if(previous.track==="general" && grade.value) previous.generalGrade=grade.value;
    previous.track=track;
    stateByContext.set(key,previous);

    if(track==="general"){
      restoreBaseGrades(grade,baseGrades,previous.generalGrade);
    }else{
      buildSpecialGrades(grade,ctx,track,grade.value);
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
    const saved=stateByContext.get(key);
    const requested=saved?.track && [...select.options].some((o)=>o.value===saved.track && !o.disabled)?saved.track:"general";

    grade.addEventListener("change",()=>{
      const active=select.value || "general";
      queueMicrotask(()=>filterSubjects(ctx,active));
    });
    select.addEventListener("change",()=>switchTrack(ctx,select,grade,baseGrades,select.value || "general"));

    if(requested==="general"){
      select.value="general";
      filterSubjects(ctx,"general");
    }else{
      switchTrack(ctx,select,grade,baseGrades,requested);
    }
  }

  document.addEventListener(RENDER_EVENT,(event)=>enhance(event.detail?.context || null));
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>enhance(null),{once:true});
  else enhance(null);

  window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_UI=Object.freeze({version:1,enhance});
})();