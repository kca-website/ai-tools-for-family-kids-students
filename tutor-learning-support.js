(function(){
  "use strict";
  const selected=new Set();
  const options=[
    ["small_steps","Μικρά βήματα","Small steps"],
    ["one_at_a_time","Ένα πράγμα τη φορά","One thing at a time"],
    ["simple_language","Πιο απλή γλώσσα","Simpler language"],
    ["visual","Οπτική εξήγηση","Visual explanation"],
    ["shorter","Λιγότερο κείμενο","Less text"],
    ["repeat","Επανάληψη βασικής ιδέας","Repeat key idea"]
  ];
  function english(){return (document.documentElement.lang||"").toLowerCase().startsWith("en")||!!document.getElementById("langEn")?.classList.contains("active");}
  function getPromptInstruction(){
    if(!selected.size)return "";
    const map={
      small_steps:"Break the task into very small steps.",
      one_at_a_time:"Present only one instruction or question at a time.",
      simple_language:"Use simpler vocabulary and shorter sentences without removing the academic meaning.",
      visual:"When useful, explain with a simple visual analogy, layout, table or spatial description.",
      shorter:"Keep the reply shorter than usual and remove non-essential detail.",
      repeat:"End each step with a one-sentence recap of the key idea."
    };
    return "LEARNING PRESENTATION PREFERENCES (user-selected, not a diagnosis):\n- "+[...selected].map(id=>map[id]).filter(Boolean).join("\n- ");
  }
  function mount(){
    const form=document.getElementById("tutorForm");
    if(!form||document.getElementById("tutorLearningSupport"))return;
    const en=english();
    const box=document.createElement("div");
    box.id="tutorLearningSupport";
    box.style.cssText="margin:0 0 12px;padding:11px 12px;border:1px solid #dbe4ee;border-radius:12px;background:#fbfdff;";
    box.innerHTML='<strong style="display:block;font-size:.84rem;margin-bottom:3px;">'+(en?"How should the explanation be presented?":"Πώς σε βοηθά να σου παρουσιάζεται η εξήγηση;")+'</strong>'+
      '<span style="display:block;font-size:.74rem;color:#64748b;margin-bottom:8px;">'+(en?"Optional. These are presentation preferences, not a diagnosis, and they are not stored as a learner profile.":"Προαιρετικό. Είναι προτιμήσεις παρουσίασης, όχι διάγνωση, και δεν αποθηκεύονται ως μαθητικό προφίλ.")+'</span>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+options.map(([id,el,enText])=>'<button type="button" data-support="'+id+'" aria-pressed="false" style="border:1px solid #cbd5e1;background:#fff;border-radius:999px;padding:6px 9px;font:inherit;font-size:.76rem;cursor:pointer;">'+(en?enText:el)+'</button>').join("")+'</div>';
    form.insertBefore(box,form.firstChild);
    box.querySelectorAll("[data-support]").forEach(btn=>btn.addEventListener("click",()=>{
      const id=btn.dataset.support;
      if(selected.has(id))selected.delete(id);else selected.add(id);
      const active=selected.has(id);
      btn.setAttribute("aria-pressed",String(active));
      btn.style.background=active?"#eaf7ef":"#fff";
      btn.style.borderColor=active?"#8bc9a9":"#cbd5e1";
    }));
  }
  document.addEventListener("aitools4kids:tutor-rendered",()=>setTimeout(mount,0));
  new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
  window.AITOOLSKIDS_TUTOR_SUPPORT=Object.freeze({getPromptInstruction,getSelectedIds:()=>[...selected]});
})();