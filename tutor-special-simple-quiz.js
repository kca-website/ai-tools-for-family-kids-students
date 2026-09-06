/**
 * Simplified AI-generated quiz adapter for Special Education tutor tracks.
 *
 * The generic study-tools quiz remains untouched for General Gymnasium/Lyceum.
 * When the active school is Special Gymnasium, Special Lyceum or EN.E.E.GY.-L.,
 * the generic quiz button is temporarily replaced with a dedicated 3-question,
 * 2-option generator. Switching back restores the original button and handler.
 */
(function(){
  "use strict";

  const RENDER_EVENT="aitools4kids:tutor-rendered";
  const MODEL="openai/gpt-4.1-nano";
  const STORE_KEY="aitools4kids_special_simple_quiz_v1";
  const SPECIAL_TRACKS=new Set(["special-gymnasium","special-lyceum","eneegyl"]);
  const stateByPanel=new WeakMap();
  let policyPromise=null;

  function isEnglish(){
    return document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang||"").toLowerCase().startsWith("en");
  }

  function text(key){
    const en=isEnglish();
    const T={
      create:["📝 Φτιάξε απλό quiz 3 ερωτήσεων","📝 Create a simple 3-question quiz"],
      saved:["Άνοιξε αποθηκευμένο απλό quiz","Open saved simple quiz"],
      again:["Νέο απλό quiz","New simple quiz"],
      generating:["Δημιουργείται απλό quiz…","Creating simple quiz…"],
      needConnect:["Συνδέσου πρώτα με Puter.","Connect to Puter first."],
      failed:["Δεν μπόρεσα να δημιουργήσω σωστό απλό quiz. Δεν έγινε αυτόματη δεύτερη κλήση.","I could not create a valid simple quiz. No automatic second call was made."],
      cached:["Φορτώθηκε από τον browser χωρίς νέα χρήση AI.","Loaded from this browser with no new AI usage."],
      stored:["Αποθηκεύτηκε στον browser για αυτό το θέμα.","Saved in this browser for this topic."],
      question:["Ερώτηση","Question"],
      of:["από","of"],
      score:["Σκορ","Score"],
      correct:["✓ Σωστό","✓ Correct"],
      wrong:["✗ Δοκίμασε ξανά στην επόμενη","✗ Try again on the next one"],
      why:["Γιατί","Why"],
      prev:["← Προηγούμενη","← Previous"],
      next:["Επόμενη →","Next →"],
      done:["Ολοκλήρωσες το απλό quiz.","You completed the simple quiz."],
      note:["Προσαρμοσμένο για Ειδική Εκπαίδευση: 3 σύντομες ερωτήσεις, 2 επιλογές, μία έννοια τη φορά.","Adapted for Special Education: 3 short questions, 2 options, one idea at a time."]
    };
    return (T[key]||[key,key])[en?1:0];
  }

  function track(){
    return document.getElementById("tutorSchoolTrack")?.value ||
      document.getElementById("tutorMount")?.dataset?.schoolTrack ||
      new URLSearchParams(location.search).get("schoolTrack") || "";
  }

  function isSpecialTrack(value){
    const policy=window.SPECIAL_EDUCATION_ASSESSMENT_POLICY;
    return policy?.isSpecialTrack ? policy.isSpecialTrack(value) : SPECIAL_TRACKS.has(String(value||""));
  }

  function appendPolicy(){
    if(window.SPECIAL_EDUCATION_ASSESSMENT_POLICY) return Promise.resolve(window.SPECIAL_EDUCATION_ASSESSMENT_POLICY);
    if(policyPromise) return policyPromise;
    const existing=document.querySelector('script[data-special-assessment-policy="1"]');
    if(existing){
      policyPromise=new Promise((resolve)=>{
        if(window.SPECIAL_EDUCATION_ASSESSMENT_POLICY) resolve(window.SPECIAL_EDUCATION_ASSESSMENT_POLICY);
        else existing.addEventListener("load",()=>resolve(window.SPECIAL_EDUCATION_ASSESSMENT_POLICY),{once:true});
      });
      return policyPromise;
    }
    policyPromise=new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="/special-education-assessment-policy.js";
      script.async=false;
      script.dataset.specialAssessmentPolicy="1";
      script.onload=()=>resolve(window.SPECIAL_EDUCATION_ASSESSMENT_POLICY);
      script.onerror=()=>reject(new Error("Failed to load Special Education assessment policy"));
      document.head.appendChild(script);
    }).catch((err)=>{ policyPromise=null; throw err; });
    return policyPromise;
  }

  function selectInfo(id){
    const el=document.getElementById(id);
    return {value:el?.value||"",label:el?.selectedOptions?.[0]?.textContent?.trim()||""};
  }

  function context(){
    const grade=selectInfo("tutorGrade");
    const subject=selectInfo("tutorSubject");
    const topic=selectInfo("tutorTopic");
    return {
      track:track(),
      gradeId:grade.value,grade:grade.label,
      subjectId:subject.value,subject:subject.label,
      topicId:topic.value,topic:topic.label,
      contextText:document.getElementById("tutorContextBox")?.innerText?.trim()||"",
      lang:isEnglish()?"en":"el"
    };
  }

  function cacheKey(c){ return [c.track,c.lang,c.gradeId,c.subjectId,c.topicId].join("|"); }
  function readStore(){
    try{
      const data=JSON.parse(localStorage.getItem(STORE_KEY)||"null");
      return data&&typeof data==="object"?data:{version:1,entries:{}};
    }catch(_){ return {version:1,entries:{}}; }
  }
  function getCached(c){ return readStore().entries?.[cacheKey(c)]||null; }
  function saveCached(c,questions){
    try{
      const store=readStore();
      store.entries=store.entries||{};
      store.entries[cacheKey(c)]={questions,createdAt:Date.now()};
      const keys=Object.keys(store.entries).sort((a,b)=>(store.entries[b]?.createdAt||0)-(store.entries[a]?.createdAt||0));
      keys.slice(12).forEach((key)=>delete store.entries[key]);
      localStorage.setItem(STORE_KEY,JSON.stringify(store));
    }catch(_){ }
  }

  function extractText(resp){
    if(typeof resp==="string") return resp;
    if(typeof resp?.text==="string") return resp.text;
    const content=resp?.message?.content;
    if(typeof content==="string") return content;
    if(Array.isArray(content)) return content.map((x)=>typeof x==="string"?x:(x?.text||"")).join("").trim();
    return "";
  }

  function parseQuestions(raw){
    const text=String(raw||"").trim().replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"");
    const start=text.indexOf("{");
    const end=text.lastIndexOf("}");
    if(start<0||end<=start) throw new Error("No JSON object");
    const data=JSON.parse(text.slice(start,end+1));
    const questions=(Array.isArray(data.questions)?data.questions:[]).map((q)=>({
      q:String(q?.q||q?.question||"").trim().slice(0,240),
      options:Array.isArray(q?.options)?q.options.map((x)=>String(x||"").trim().slice(0,180)).filter(Boolean).slice(0,2):[],
      correct:Number(q?.correct),
      explanation:String(q?.explanation||"").trim().slice(0,260)
    })).filter((q)=>q.q&&q.options.length===2&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<=1&&q.explanation).slice(0,3);
    if(questions.length!==3) throw new Error("Expected exactly three simple questions");
    return questions;
  }

  function prompt(c){
    const language=c.lang==="en"?"English":"Greek";
    const policy=window.SPECIAL_EDUCATION_ASSESSMENT_POLICY;
    const extra=policy?.aiPromptRules||"Create 3 very short questions with exactly 2 options. One basic idea at a time. No exam-level difficulty or trick wording.";
    return `Create a SIMPLE PRACTICE QUIZ for a learner in Special Education.\n\nSchool: ${c.track}\nGrade: ${c.grade||"selected grade"}\nSubject: ${c.subject||"selected subject"}\nTopic: ${c.topic||"selected topic"}\n\nVerified/site context:\n${c.contextText||"Use only the selected subject/topic context."}\n\n${extra}\n\nAdditional rules:\n- Write in ${language}.\n- Stay inside the selected subject/topic. Do not invent syllabus coverage.\n- Ask only concrete, basic understanding questions.\n- Exactly 3 questions and exactly 2 options per question.\n- correct must be 0 or 1.\n- explanation must be one short sentence.\n- Return STRICT JSON only, no markdown.\n\nRequired shape:\n{"questions":[{"q":"short question","options":["A","B"],"correct":0,"explanation":"one short sentence"}]}`;
  }

  function setStatus(panel,value,error=false){
    const node=panel.querySelector(".tutor-study-tools__status");
    if(!node) return;
    node.textContent=value||"";
    node.style.color=error?"#b91c1c":"#64748b";
  }

  function render(panel,questions,cached){
    panel.querySelector(".tutor-study-tools__result")?.remove();
    const result=document.createElement("div");
    result.className="tutor-study-tools__result";
    result.dataset.type="quiz-special-simple";
    panel.appendChild(result);
    const local={index:0,answers:{}};

    function draw(){
      result.replaceChildren();
      const item=questions[local.index];
      const answered=Object.prototype.hasOwnProperty.call(local.answers,local.index);
      const chosen=local.answers[local.index];
      const score=Object.entries(local.answers).filter(([i,a])=>questions[Number(i)]?.correct===a).length;

      const note=document.createElement("div");
      note.style.cssText="margin-bottom:8px;padding:7px 9px;border-radius:8px;background:#f0fdf4;color:#3f6212;font-size:.75rem;line-height:1.4";
      note.textContent=text("note");
      const meta=document.createElement("div"); meta.className="study-quiz__meta";
      const pos=document.createElement("span"); pos.textContent=`${text("question")} ${local.index+1} ${text("of")} ${questions.length}`;
      const sc=document.createElement("span"); sc.textContent=`${text("score")}: ${score}/${Object.keys(local.answers).length}`;
      meta.append(pos,sc);
      const q=document.createElement("div"); q.className="study-quiz__question"; q.textContent=item.q;
      const options=document.createElement("div"); options.className="study-quiz__options";
      item.options.forEach((label,i)=>{
        const btn=document.createElement("button"); btn.type="button"; btn.className="study-quiz__option"; btn.textContent=label;
        if(answered){
          btn.disabled=true;
          if(i===item.correct) btn.classList.add("is-correct");
          if(i===chosen&&chosen!==item.correct) btn.classList.add("is-wrong");
          if(i===chosen) btn.classList.add("is-selected");
        }
        btn.addEventListener("click",()=>{ if(!answered){ local.answers[local.index]=i; draw(); } });
        options.appendChild(btn);
      });
      result.append(note,meta,q,options);
      if(answered){
        const fb=document.createElement("div"); fb.className="study-quiz__feedback";
        fb.textContent=`${chosen===item.correct?text("correct"):text("wrong")}. ${text("why")}: ${item.explanation}`;
        result.appendChild(fb);
      }
      const nav=document.createElement("div"); nav.className="study-quiz__nav";
      const prev=document.createElement("button"); prev.type="button"; prev.className="tutor-study-tools__btn"; prev.textContent=text("prev"); prev.disabled=local.index===0;
      prev.addEventListener("click",()=>{ local.index-=1; draw(); });
      const next=document.createElement("button"); next.type="button"; next.className="tutor-study-tools__btn tutor-study-tools__btn--primary"; next.textContent=text("next"); next.disabled=local.index>=questions.length-1;
      next.addEventListener("click",()=>{ local.index+=1; draw(); });
      nav.append(prev,next); result.appendChild(nav);
      if(Object.keys(local.answers).length===questions.length) setStatus(panel,`${text("done")} ${text("score")}: ${score}/${questions.length}`);
    }
    draw();
    setStatus(panel,cached?text("cached"):text("stored"));
    syncPanel(panel);
  }

  async function generate(panel){
    if(panel.dataset.specialQuizBusy==="1") return;
    const c=context();
    const input=document.getElementById("tutorInput");
    if(!input||input.disabled||!window.puter?.ai?.chat){ setStatus(panel,text("needConnect"),true); return; }
    panel.dataset.specialQuizBusy="1";
    const btn=panel.querySelector('[data-special-simple-quiz="1"]');
    if(btn) btn.disabled=true;
    setStatus(panel,text("generating"));
    try{
      await appendPolicy();
      const response=await window.puter.ai.chat(prompt(c),{model:MODEL,normalize:true,max_tokens:950,temperature:0.2});
      const questions=parseQuestions(extractText(response));
      saveCached(c,questions);
      render(panel,questions,false);
    }catch(err){
      console.error("Special Education simple quiz generation failed",err);
      setStatus(panel,text("failed"),true);
    }finally{
      panel.dataset.specialQuizBusy="0";
      if(btn) btn.disabled=false;
      syncPanel(panel);
    }
  }

  function openOrGenerate(panel){
    const c=context();
    const cached=getCached(c);
    const current=panel.querySelector(".tutor-study-tools__result")?.dataset?.type;
    if(cached&&current!=="quiz-special-simple"){ render(panel,cached.questions,true); return; }
    generate(panel);
  }

  function syncPanel(panel){
    if(!panel) return;
    let state=stateByPanel.get(panel);
    if(!state){ state={original:null,special:null,lastTrack:""}; stateByPanel.set(panel,state); }
    const activeTrack=track();
    const special=isSpecialTrack(activeTrack);
    let q=panel.querySelector('[data-study-tool="quiz"]');

    if(special){
      if(!q) return;
      if(q.dataset.specialSimpleQuiz!=="1"){
        state.original=q;
        const replacement=q.cloneNode(true);
        replacement.dataset.specialSimpleQuiz="1";
        replacement.addEventListener("click",()=>openOrGenerate(panel));
        q.replaceWith(replacement);
        state.special=replacement;
        q=replacement;
      }
      if(state.lastTrack&&state.lastTrack!==activeTrack) panel.querySelector(".tutor-study-tools__result")?.remove();
      const current=panel.querySelector(".tutor-study-tools__result")?.dataset?.type;
      q.textContent=current==="quiz-special-simple"?text("again"):(getCached(context())?text("saved"):text("create"));
      appendPolicy().catch(()=>{});
    }else if(q?.dataset.specialSimpleQuiz==="1"&&state.original){
      q.replaceWith(state.original);
      panel.querySelector(".tutor-study-tools__result")?.remove();
      setStatus(panel,"");
    }
    state.lastTrack=activeTrack;
  }

  function syncAll(){
    document.querySelectorAll("#tutorMount .tutor-study-tools").forEach(syncPanel);
  }
  function schedule(){ setTimeout(syncAll,0); }

  document.addEventListener(RENDER_EVENT,schedule);
  document.addEventListener("change",(event)=>{
    const target=event.target instanceof Element?event.target:null;
    if(target?.matches("#tutorSchoolTrack,#tutorGrade,#tutorSubject,#tutorTopic,#tutorAge,#tutorConsent")) schedule();
  });
  document.addEventListener("click",(event)=>{
    const target=event.target instanceof Element?event.target:null;
    if(target?.closest("#langEl,#langEn")) schedule();
  });
  window.addEventListener("popstate",schedule);
  schedule();

  window.AITOOLSKIDS_SPECIAL_SIMPLE_QUIZ=Object.freeze({version:1,sync:syncAll,isSpecialTrack});
})();