(function(){
  "use strict";

  const MAX_RESULTS=9;
  let coreItems=[];
  let signItems=[];
  let higherItems=[];
  let activeIndex=-1;
  let higherPromise=null;
  let signPromise=null;

  const ICONS={section:"🧭",tool:"🧰",tutor:"🤖",path:"🪜",quiz:"🧩",sign:"🤟",higher:"🎓",teacher:"🏫",accessibility:"♿"};

  function isHome(){return location.pathname==="/"||location.pathname==="";}
  function isEn(){return (document.documentElement.lang||"").toLowerCase().startsWith("en");}
  function norm(value){
    return String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("el").replace(/ς/g,"σ").replace(/[^a-z0-9α-ω]+/gi," ").replace(/\s+/g," ").trim();
  }
  function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function gradeLabel(zone,grade,en=false){
    const map={
      primary:{a:["Α΄ Δημοτικού","1st Grade"],b:["Β΄ Δημοτικού","2nd Grade"],c:["Γ΄ Δημοτικού","3rd Grade"],d:["Δ΄ Δημοτικού","4th Grade"],e:["Ε΄ Δημοτικού","5th Grade"],st:["ΣΤ΄ Δημοτικού","6th Grade"]},
      middle:{a:["Α΄ Γυμνασίου","7th Grade"],b:["Β΄ Γυμνασίου","8th Grade"],c:["Γ΄ Γυμνασίου","9th Grade"]},
      high:{a:["Α΄ Λυκείου","10th Grade"],b:["Β΄ Λυκείου","11th Grade"],c:["Γ΄ Λυκείου","12th Grade"]}
    };
    return map[zone]?.[grade]?.[en?1:0]||String(grade||"");
  }
  function zoneLabel(zone,en=false){
    return ({primary:["Δημοτικό","Primary"],middle:["Γυμνάσιο","Middle School"],high:["Λύκειο","High School"]}[zone]||[zone,zone])[en?1:0];
  }
  function roleFor(zone){return zone==="high"?"student":"guardian";}
  function route(zone,view,params={}){
    const q=new URLSearchParams(params);
    return `/${zone}/${roleFor(zone)}/${view}${q.toString()?"?"+q.toString():""}`;
  }
  function make(raw){
    const searchable=norm([
      raw.titleEl,raw.titleEn,raw.detailEl,raw.detailEn,
      ...(raw.keywords||[])
    ].join(" "));
    return Object.freeze(Object.assign({priority:0,type:"section",searchable},raw));
  }

  function staticItems(){
    return [
      make({type:"section",priority:35,titleEl:"Ελληνικός Χάρτης Ύλης 2026–27",titleEn:"Greek Curriculum Map 2026–27",detailEl:"Μαθήματα, τάξεις, τεκμηρίωση και επίσημες πηγές.",detailEn:"Subjects, grades, documentation and official sources.",href:"/xartis-ylis.html",keywords:["ύλη κεφάλαια curriculum ΙΕΠ μάθημα ενότητα"]}),
      make({type:"teacher",priority:38,titleEl:"Για εκπαιδευτικούς",titleEn:"For educators",detailEl:"AI Βοηθός, σχέδιο μαθήματος, φύλλο εργασίας, πακέτο 45΄, PDF και QR.",detailEn:"AI assistant, lesson plan, worksheet, 45-minute package, PDF and QR.",href:"/teacher-assistant.html",keywords:["εκπαιδευτικός καθηγητής δάσκαλος φύλλο εργασίας lesson plan classroom qr"]}),
      make({type:"section",priority:34,titleEl:"Ειδική Εκπαίδευση",titleEn:"Special Education",detailEl:"Ειδικό Γυμνάσιο, Ειδικό Λύκειο και ΕΝ.Ε.Ε.ΓΥ.-Λ.",detailEn:"Special Middle School, Special High School and ENEEGYL.",href:"/special-education.html",keywords:["ειδική αγωγή εαε ενεεγυλ special education"]}),
      make({type:"accessibility",priority:34,titleEl:"Προσβασιμότητα εργαλείων",titleEn:"Tool accessibility",detailEl:"Τεκμηριωμένος έλεγχος προσβασιμότητας των canonical εργαλείων.",detailEn:"Documented accessibility review of canonical tools.",href:"/accessibility.html",keywords:["προσβασιμότητα accessibility screen reader dyslexia δυσλεξία"]}),
      make({type:"tutor",priority:36,titleEl:"Προσαρμογές AI Βοήθειας",titleEn:"AI Help presentation preferences",detailEl:"Μικρά βήματα, ένα πράγμα τη φορά, απλούστερη γλώσσα, οπτική εξήγηση και λιγότερο κείμενο.",detailEn:"Small steps, one thing at a time, simpler language, visual explanation and less text.",href:"/primary/guardian/tutor",keywords:["δυσλεξία δεπυ adhd μαθησιακές δυσκολίες μικρά βήματα απλή γλώσσα οπτική εξήγηση"]}),
      make({type:"section",priority:35,titleEl:"Νηπιαγωγείο 4–6",titleEn:"Preschool 4–6",detailEl:"Δημιουργικές δραστηριότητες με ενήλικα ως χειριστή.",detailEn:"Creative activities with an adult operating the AI.",href:"/preschool",keywords:["προσχολική νηπιαγωγείο preschool 4 5 6"]}),
      make({type:"sign",priority:38,titleEl:"Ελληνική Νοηματική",titleEn:"Greek Sign Language",detailEl:"167 σχολικές έννοιες με εξήγηση και επίσημο βίντεο ΕΝΓ.",detailEn:"167 school concepts with explanations and official GSL videos.",href:"/sign-language.html",keywords:["ενγ νοηματική κωφός κωφοί sign language gsl 167"]}),
      make({type:"higher",priority:36,titleEl:"Φοιτητές ΑΕΙ",titleEn:"University students",detailEl:"Πιλοτική υποστήριξη ανά πανεπιστήμιο, τμήμα, έτος, μάθημα και θεματική.",detailEn:"Pilot support by university, department, year, course and topic.",href:"/higher-education-pilot.html",keywords:["αει πανεπιστήμιο φοιτητής φοιτητές university college πάτρα νομική βιολογία πληροφορική"]}),
      make({type:"section",priority:30,titleEl:"Μελέτη PDF με AI",titleEn:"Study a PDF with AI",detailEl:"Διάβασε εκπαιδευτικό PDF και δούλεψε πάνω στο περιεχόμενό του.",detailEn:"Read an educational PDF and work with its content.",href:"/meleti-pdf-me-ai.html",keywords:["pdf αρχείο διάβασμα μελέτη"]}),
      make({type:"section",priority:30,titleEl:"Έρευνα με πηγές",titleEn:"Research with sources",detailEl:"Οργάνωσε έρευνα και έλεγξε πηγές αντί να παίρνεις έτοιμη απάντηση.",detailEn:"Organise research and verify sources instead of taking a ready-made answer.",href:"/erevna-me-piges-ai.html",keywords:["έρευνα πηγές research sources βιβλιογραφία"]}),
      make({type:"section",priority:30,titleEl:"Οργάνωση μελέτης",titleEn:"Study organisation",detailEl:"Σπάσε το διάβασμα σε βήματα και χρησιμοποίησε AI με συγκεκριμένο σκοπό.",detailEn:"Break study into steps and use AI for a defined purpose.",href:"/organosi-meletis-ai.html",keywords:["οργάνωση διάβασμα μελέτη πρόγραμμα study plan"]}),
      make({type:"section",priority:24,titleEl:"Διαφάνεια AI",titleEn:"AI transparency",detailEl:"Ενεργό μοντέλο, δεδομένα, feedback και βασικοί κανόνες.",detailEn:"Active model, data, feedback and core rules.",href:"/ai-transparency.html",keywords:["privacy απόρρητο ai act μοντέλο groq gpt oss"]})
    ];
  }

  function buildToolItems(){
    if(typeof TOOLS==="undefined") return [];
    return Object.entries(TOOLS).map(([id,t])=>make({
      type:"tool",priority:22,
      titleEl:t.name||id,titleEn:t.name||id,
      detailEl:t.shortDescEl||t.shortDescEn||"AI εργαλείο",
      detailEn:t.shortDescEn||t.shortDescEl||"AI tool",
      href:"/tools/"+encodeURIComponent(id)+".html",
      keywords:[id,t.category,t.greekTips,t.isGreek?"ελληνικό Greek":""]
    }));
  }

  function buildCatalogItems(){
    const catalog=window.AITOOLSKIDS_TUTOR_CATALOG;
    const out=[];
    if(!catalog?.zones) return out;
    for(const zone of ["primary","middle","high"]){
      const grades=catalog.zones[zone]||{};
      for(const [grade,subjects] of Object.entries(grades)){
        if(!Array.isArray(subjects)) continue;
        for(const subject of subjects){
          const subjectTitleEl=subject.subjectLabelEl||subject.labelEl||subject.id;
          const subjectTitleEn=subject.subjectLabelEn||subject.labelEn||subjectTitleEl;
          const common={grade,subject:subject.id,mode:"understand"};
          out.push(make({
            type:"tutor",priority:32,titleEl:subjectTitleEl,titleEn:subjectTitleEn,
            detailEl:`${zoneLabel(zone)} · ${gradeLabel(zone,grade)} · Άνοιγμα στην AI Βοήθεια`,
            detailEn:`${zoneLabel(zone,true)} · ${gradeLabel(zone,grade,true)} · Open in AI Help`,
            href:route(zone,"tutor",common),
            keywords:[zone,grade,subject.curriculum?.sourceLabelEl,subject.curriculum?.coverageLabelEl]
          }));
          for(const topic of subject.topics||[]){
            const labelEl=topic.labelEl||topic.titleEl||topic.id;
            const labelEn=topic.labelEn||topic.titleEn||labelEl;
            out.push(make({
              type:"tutor",priority:29,titleEl:labelEl,titleEn:labelEn,
              detailEl:`${subjectTitleEl} · ${gradeLabel(zone,grade)}`,
              detailEn:`${subjectTitleEn} · ${gradeLabel(zone,grade,true)}`,
              href:route(zone,"tutor",Object.assign({},common,{topicText:labelEl})),
              keywords:[subjectTitleEl,subjectTitleEn,topic.explainEl,topic.explainEn,zoneLabel(zone),gradeLabel(zone,grade)]
            }));
          }
        }
      }
    }
    return out;
  }

  function buildQuizItems(){
    const out=[];
    if(typeof QUIZZES==="undefined") return out;
    const seenGap=new Set();
    for(const [zone,quizzes] of Object.entries(QUIZZES)){
      if(!["primary","middle","high"].includes(zone)||!quizzes) continue;
      for(const quiz of Object.values(quizzes)){
        const grade=quiz.grades?.[0]||"";
        out.push(make({
          type:"quiz",priority:26,titleEl:quiz.subjectLabelEl||quiz.titleEl||quiz.id,titleEn:quiz.subjectLabelEn||quiz.titleEn||quiz.id,
          detailEl:"Χάρτης Εξάσκησης · "+gradeLabel(zone,grade),detailEn:"Practice Map · "+gradeLabel(zone,grade,true),
          href:route(zone,"quiz",grade?{grade}:{ }),
          keywords:[quiz.titleEl,quiz.titleEn,quiz.introEl,quiz.introEn]
        }));
        for(const q of quiz.questions||[]){
          for(const opt of q.options||[]){
            const gapId=opt.gapTag;
            if(!gapId||seenGap.has(gapId)||typeof GAP_TAGS==="undefined"||!GAP_TAGS[gapId]) continue;
            seenGap.add(gapId);
            const gap=GAP_TAGS[gapId];
            out.push(make({
              type:"path",priority:31,
              titleEl:gap.labelEl||gapId,titleEn:gap.labelEn||gap.labelEl||gapId,
              detailEl:`${quiz.subjectLabelEl||"Μάθημα"} · ${typeof LEARNING_PATHS!=="undefined"&&LEARNING_PATHS[gapId]?"Μονοπάτι Μάθησης":"Χάρτης Εξάσκησης"}`,
              detailEn:`${quiz.subjectLabelEn||"Subject"} · ${typeof LEARNING_PATHS!=="undefined"&&LEARNING_PATHS[gapId]?"Learning Path":"Practice Map"}`,
              href:route(zone,"quiz",Object.assign(grade?{grade}:{},{gap:gapId})),
              keywords:[gap.explainEl,gap.explainEn,gap.skillTagEl,gap.skillTagEn,quiz.subjectLabelEl,quiz.subjectLabelEn]
            }));
          }
        }
      }
    }
    return out;
  }

  function rebuildCore(){
    const items=[...staticItems(),...buildToolItems(),...buildCatalogItems(),...buildQuizItems()];
    const unique=new Map();
    items.forEach(item=>{const key=item.type+"|"+item.href+"|"+item.titleEl;if(!unique.has(key))unique.set(key,item);});
    coreItems=[...unique.values()];
  }

  function loadScript(src,id){
    const existing=document.querySelector('script[data-home-search-data="'+id+'"]');
    if(existing?.dataset.loaded==="1") return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const s=existing||document.createElement("script");
      if(!existing){s.src=src;s.async=true;s.dataset.homeSearchData=id;document.head.appendChild(s);}
      s.addEventListener("load",()=>{s.dataset.loaded="1";resolve();},{once:true});
      s.addEventListener("error",reject,{once:true});
    });
  }

  function loadSign(){
    if(signPromise) return signPromise;
    signPromise=loadScript("/sign-language-curriculum.js","sign").then(()=>{
      const defs=window.SIGN_LANGUAGE_GRADE_DEFS||{};
      const map=window.SIGN_LANGUAGE_GRADE_MAP||{};
      signItems=Object.entries(map).map(([name,grades])=>make({
        type:"sign",priority:33,titleEl:name,titleEn:name,
        detailEl:"Ελληνική Νοηματική · "+(grades||[]).map(id=>defs[id]?.labelEl).filter(Boolean).join(", "),
        detailEn:"Greek Sign Language · "+(grades||[]).map(id=>defs[id]?.labelEn).filter(Boolean).join(", "),
        href:"/sign-language.html?q="+encodeURIComponent(name),
        keywords:["ΕΝΓ Ελληνική Νοηματική GSL sign language"]
      }));
    }).catch(()=>{signItems=[];});
    return signPromise;
  }

  function wantsHigher(query){
    return /(αει|πανεπισ|φοιτη|university|college|aueb|uoa|nkua|upatras|patras|πειραιωσ|piraeus|νομικ|law school|τει|βιολογ.*πατρ)/.test(norm(query));
  }

  function loadHigher(){
    if(higherPromise) return higherPromise;
    higherPromise=loadScript("/higher-education-data.js","higher").then(()=>{
      const data=window.AITOOLSKIDS_HIGHER_EDUCATION;
      const out=[];
      if(!data) return;
      for(const [instId,inst] of Object.entries(data.institutions||{})){
        out.push(make({
          type:"higher",priority:34,titleEl:inst.nameEl,titleEn:inst.nameEn||inst.nameEl,
          detailEl:"ΑΕΙ · επίλεξε τμήμα και μάθημα",detailEn:"University · choose department and course",
          href:"/higher-education-pilot.html",
          keywords:[instId,...(inst.legacyAliases||[])]
        }));
      }
      for(const [depId,dep] of Object.entries(data.departments||{})){
        const inst=data.institutions?.[dep.institutionId];
        out.push(make({
          type:"higher",priority:35,titleEl:dep.departmentEl||depId,titleEn:dep.departmentEn||dep.departmentEl||depId,
          detailEl:inst?.nameEl||"ΑΕΙ",detailEn:inst?.nameEn||inst?.nameEl||"University",
          href:"/higher-education-pilot.html?department="+encodeURIComponent(depId),
          keywords:[depId,dep.schoolEl,inst?.nameEl,inst?.nameEn]
        }));
        (dep.courses||[]).forEach((course,index)=>{
          out.push(make({
            type:"higher",priority:37,titleEl:course.titleEl||course.code||"Μάθημα",titleEn:course.titleEn||course.titleEl||course.code||"Course",
            detailEl:`${dep.departmentEl||depId}${course.year?" · "+course.year+"ο έτος":""}${course.semester?" · "+course.semester+"ο εξάμηνο":""}`,
            detailEn:`${dep.departmentEn||dep.departmentEl||depId}${course.year?" · Year "+course.year:""}${course.semester?" · Semester "+course.semester:""}`,
            href:"/higher-education-pilot.html?department="+encodeURIComponent(depId)+"&course="+index,
            keywords:[course.code,inst?.nameEl,inst?.nameEn,dep.schoolEl,...(course.topics||[])]
          }));
        });
      }
      higherItems=out;
    }).catch(()=>{higherItems=[];});
    return higherPromise;
  }

  function score(item,query){
    const q=norm(query);
    if(!q) return 0;
    const tokens=q.split(" ").filter(Boolean);
    const title=norm((item.titleEl||"")+" "+(item.titleEn||""));
    const detail=norm((item.detailEl||"")+" "+(item.detailEn||""));
    const all=item.searchable;
    let s=item.priority||0;
    if(title===q)s+=120;
    else if(title.startsWith(q))s+=80;
    else if(title.includes(q))s+=60;
    if(tokens.every(t=>title.includes(t)))s+=48;
    if(tokens.every(t=>all.includes(t)))s+=32;
    else if(tokens.some(t=>all.includes(t)))s+=10;
    if(detail.includes(q))s+=18;
    if(!tokens.every(t=>all.includes(t)))s-=18;
    return s;
  }

  function resultsFor(query){
    const q=norm(query);
    if(q.length<2) return [];
    return [...coreItems,...signItems,...higherItems]
      .map(item=>({item,score:score(item,q)}))
      .filter(x=>x.score>20)
      .sort((a,b)=>b.score-a.score||String(a.item.titleEl).localeCompare(String(b.item.titleEl),"el"))
      .slice(0,MAX_RESULTS)
      .map(x=>x.item);
  }

  function mount(){
    if(!isHome()) return false;
    const shell=document.getElementById("homeV8Shell");
    if(!shell) return false;
    if(document.getElementById("homeGlobalSearch")) return true;

    rebuildCore();
    loadSign().then(()=>{const input=document.getElementById("homeGlobalSearchInput");if(input?.value) render(input.value);});

    const box=document.createElement("section");
    box.id="homeGlobalSearch";
    box.className="home-global-search";
    box.setAttribute("aria-label","Site search");
    box.innerHTML=`
      <label class="home-global-search__label" for="homeGlobalSearchInput"></label>
      <div class="home-global-search__field">
        <span class="home-global-search__icon" aria-hidden="true">🔎</span>
        <input id="homeGlobalSearchInput" class="home-global-search__input" type="search" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="homeGlobalSearchResults">
        <button type="button" class="home-global-search__clear" aria-label="Καθαρισμός αναζήτησης">×</button>
      </div>
      <div id="homeGlobalSearchResults" class="home-global-search__results" role="listbox" hidden></div>`;
    const heading=shell.querySelector("#homeV8FinderTitle");
    shell.insertBefore(box,heading||shell.firstChild);

    const input=box.querySelector("input");
    const clear=box.querySelector(".home-global-search__clear");
    updateLanguage();

    let timer=0;
    input.addEventListener("input",()=>{
      activeIndex=-1;
      box.classList.toggle("has-query",!!input.value);
      clearTimeout(timer);
      timer=setTimeout(async()=>{
        if(wantsHigher(input.value)){await loadHigher();}
        render(input.value);
      },80);
    });
    input.addEventListener("focus",()=>{if(input.value.trim())render(input.value);});
    input.addEventListener("keydown",(e)=>{
      const links=[...box.querySelectorAll(".home-global-search__item")];
      if(e.key==="Escape"){close();input.blur();return;}
      if(!links.length)return;
      if(e.key==="ArrowDown"){e.preventDefault();activeIndex=Math.min(activeIndex+1,links.length-1);paintActive(links);}
      else if(e.key==="ArrowUp"){e.preventDefault();activeIndex=Math.max(activeIndex-1,0);paintActive(links);}
      else if(e.key==="Enter"&&activeIndex>=0){e.preventDefault();links[activeIndex].click();}
    });
    clear.addEventListener("click",()=>{input.value="";box.classList.remove("has-query");close();input.focus();});
    document.addEventListener("click",(e)=>{if(!box.contains(e.target))close();});
    document.addEventListener("click",(e)=>{if(e.target.closest("#langEl,#langEn"))setTimeout(()=>{updateLanguage();if(input.value)render(input.value);},0);});
    return true;
  }

  function paintActive(links){
    links.forEach((a,i)=>a.classList.toggle("is-active",i===activeIndex));
    links[activeIndex]?.scrollIntoView({block:"nearest"});
  }

  function updateLanguage(){
    const box=document.getElementById("homeGlobalSearch");if(!box)return;
    const en=isEn(),input=box.querySelector("input"),label=box.querySelector("label"),clear=box.querySelector(".home-global-search__clear");
    label.textContent=en?"Search all aitools4kids":"Ψάξε σε όλο το aitools4kids";
    input.placeholder=en?"e.g. fractions, Ancient Greek, dyslexia, presentation...":"π.χ. κλάσματα, δυσλεξία, Αρχαία, παρουσίαση…";
    input.setAttribute("aria-label",en?"Search tools, subjects, learning paths and sections":"Αναζήτηση εργαλείων, μαθημάτων, μονοπατιών και ενοτήτων");
    clear.setAttribute("aria-label",en?"Clear search":"Καθαρισμός αναζήτησης");
  }

  function close(){
    const box=document.getElementById("homeGlobalSearch"),panel=document.getElementById("homeGlobalSearchResults"),input=document.getElementById("homeGlobalSearchInput");
    if(panel)panel.hidden=true;
    if(input)input.setAttribute("aria-expanded","false");
    activeIndex=-1;
    box?.querySelectorAll(".is-active").forEach(x=>x.classList.remove("is-active"));
  }

  function render(raw){
    const panel=document.getElementById("homeGlobalSearchResults"),input=document.getElementById("homeGlobalSearchInput");
    if(!panel||!input)return;
    const query=String(raw||"").trim(),en=isEn();
    if(norm(query).length<2){close();return;}
    const rows=resultsFor(query);
    input.setAttribute("aria-expanded","true");
    panel.hidden=false;
    if(!rows.length){
      panel.innerHTML='<div class="home-global-search__empty">'+(en?"No result yet. Try a subject, tool or school level.":"Δεν βρέθηκε αποτέλεσμα. Δοκίμασε μάθημα, εργαλείο ή βαθμίδα.")+'</div><div class="home-global-search__privacy">'+(en?"Search stays in your browser. The query is not sent to AI or analytics.":"Η αναζήτηση μένει στον browser σου. Το ερώτημα δεν στέλνεται σε AI ή analytics.")+'</div>';
      return;
    }
    const typeLabel={
      section:["Ενότητα","Section"],tool:["Εργαλείο","Tool"],tutor:["AI Βοήθεια","AI Help"],path:["Μονοπάτι","Learning Path"],quiz:["Χάρτης","Practice Map"],sign:["ΕΝΓ","GSL"],higher:["ΑΕΙ","University"],teacher:["Εκπαιδευτικοί","Educators"],accessibility:["Πρόσβαση","Accessibility"]
    };
    panel.innerHTML='<div class="home-global-search__head"><span>'+(en?"Best matches":"Καλύτερα αποτελέσματα")+'</span><span>'+rows.length+'</span></div>'+
      rows.map((item,i)=>`<a class="home-global-search__item" role="option" id="homeSearchOption${i}" href="${esc(item.href)}">
        <span class="home-global-search__item-icon" aria-hidden="true">${ICONS[item.type]||"🔎"}</span>
        <span class="home-global-search__item-copy"><span class="home-global-search__item-title">${esc(en?(item.titleEn||item.titleEl):item.titleEl)}</span><span class="home-global-search__item-detail">${esc(en?(item.detailEn||item.detailEl):item.detailEl)}</span></span>
        <span class="home-global-search__item-type">${esc((typeLabel[item.type]||[item.type,item.type])[en?1:0])}</span>
      </a>`).join("")+
      '<div class="home-global-search__privacy">'+(en?"Search stays in your browser. The query is not sent to AI or analytics.":"Η αναζήτηση μένει στον browser σου. Το ερώτημα δεν στέλνεται σε AI ή analytics.")+'</div>';
  }

  const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();