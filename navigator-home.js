/* Navigator-first homepage layer. Loaded only on /. */
(function(){
  "use strict";

  function isHome(){ return location.pathname === "/" || location.pathname === ""; }
  if(!isHome()) return;

  const COPY={
    el:{
      title:"Βρες το σωστό AI εργαλείο για αυτό που θέλεις να κάνεις",
      subtitle:"Διάλεξε ηλικία ή ανάγκη. Θα σου δείξουμε ποια εργαλεία ταιριάζουν, πώς να τα χρησιμοποιήσεις σωστά και τι να προσέξεις — χωρίς να κάνουμε εμείς την εργασία.",
      flowLabel:"Πώς λειτουργεί ο οδηγός",
      flow:["Τι θέλεις να κάνεις","Βρες τι ταιριάζει","Δες πώς χρησιμοποιείται","Προχώρα μόνος σου"],
      main:"Βρες το κατάλληλο AI εργαλείο",
      mainNote:"Ξεκίνα από τη σχολική βαθμίδα και δες επιλεγμένα εργαλεία με ηλικιακά όρια, χρήση και προφυλάξεις.",
      quiz:"Δεν ξέρεις τι χρειάζεσαι; Κάνε το Γρήγορο Τεστ",
      quizSub:"Λίγες σύντομες ερωτήσεις για να εντοπίσεις πού χρειάζεται περισσότερη εξάσκηση. Χωρίς βαθμό και χωρίς διάγνωση.",
      helpBadge:"Δωρεάν AI Βοήθεια · προαιρετική",
      helpTitle:"Κόλλησες σε μια άσκηση; Πάρε μία μικρή υπόδειξη για να συνεχίσεις",
      helpSub:"Η AI Βοήθεια ξεκινά από τη δική σου προσπάθεια και καθοδηγεί με μία ερώτηση ή μικρή υπόδειξη τη φορά, χωρίς έτοιμη τελική απάντηση.",
      needsEyebrow:"Ξεκίνα από την ανάγκη σου",
      needsTitle:"Τι θέλεις να κάνεις;",
      needsSub:"Οι παρακάτω σελίδες δεν κάνουν το μάθημα για εσένα. Σε βοηθούν να διαλέξεις το σωστό εργαλείο και τον σωστό τρόπο χρήσης.",
      needs:[
        ["📄","Να μελετήσω PDF ή σημειώσεις","Εργαλεία για πηγές, σύνοψη και ερωτήσεις επανάληψης","/meleti-pdf-me-ai.html"],
        ["🔎","Να κάνω έρευνα με πηγές","Πώς βρίσκεις πληροφορίες και ελέγχεις από πού προέρχονται","/erevna-me-piges-ai.html"],
        ["🧠","Να φτιάξω flashcards και επανάληψη","Εργαλεία για κάρτες, τεστ και spaced repetition","/flashcards-epanalipsi-ai.html"],
        ["🎨","Να φτιάξω παρουσίαση ή αφίσα","Canva, Adobe Express και δημιουργικά εργαλεία με σωστά όρια","/parousiasi-afisa-ai.html"],
        ["📚","Να εξασκηθώ στην ανάγνωση ή στα Αγγλικά","Εργαλεία ανάγνωσης, προφοράς και γλωσσικής εξάσκησης","/anagnosi-agglika-ai.html"],
        ["✨","Να δημιουργήσω κάτι με AI","Εικόνα, ιδέες, οργάνωση και δημιουργικά projects χωρίς έτοιμη σχολική εργασία","/dimiourgiko-ai-gia-mathites.html"]
      ],
      secondary:[
        ["🤖","AI Βοήθεια","/middle/student/tutor"],
        ["👪","Για γονείς","/primary/guardian/tools"],
        ["🤟","Ελληνική Νοηματική","/sign-language.html"],
        ["🧭","Όλες οι διαδρομές","/ti-thelo-na-kano-me-ai.html"]
      ]
    },
    en:{
      title:"Find the right AI tool for what you need to do",
      subtitle:"Choose an age group or a task. We show which tools fit, how to use them well and what to watch out for — without doing the schoolwork for you.",
      flowLabel:"How the guide works",
      flow:["What do you need?","Find the right fit","See how to use it","Continue on your own"],
      main:"Find the right AI tool",
      mainNote:"Start from the school stage and see selected tools with age rules, use cases and cautions.",
      quiz:"Not sure what you need? Take the Quick Check",
      quizSub:"A few short questions to spot areas that may need more practice. No grade and no diagnosis.",
      helpBadge:"Free AI Help · optional",
      helpTitle:"Stuck on an exercise? Get one small hint so you can continue",
      helpSub:"AI Help starts from your own attempt and guides you with one question or small hint at a time, without handing over a final answer.",
      needsEyebrow:"Start from your task",
      needsTitle:"What do you want to do?",
      needsSub:"These pages do not teach the lesson for you. They help you choose the right tool and use it well.",
      needs:[
        ["📄","Study a PDF or notes","Tools for sources, summaries and revision questions","/meleti-pdf-me-ai.html"],
        ["🔎","Research with sources","How to find information and check where it comes from","/erevna-me-piges-ai.html"],
        ["🧠","Make flashcards and revise","Tools for cards, quizzes and spaced repetition","/flashcards-epanalipsi-ai.html"],
        ["🎨","Make a presentation or poster","Canva, Adobe Express and creative tools with clear limits","/parousiasi-afisa-ai.html"],
        ["📚","Practice reading or English","Reading, pronunciation and language-practice tools","/anagnosi-agglika-ai.html"],
        ["✨","Create something with AI","Images, ideas, organisation and creative projects without ready-made schoolwork","/dimiourgiko-ai-gia-mathites.html"]
      ],
      secondary:[
        ["🤖","AI Help","/middle/student/tutor"],
        ["👪","For parents","/primary/guardian/tools"],
        ["🤟","Greek Sign Language","/sign-language.html"],
        ["🧭","All routes","/ti-thelo-na-kano-me-ai.html"]
      ]
    }
  };

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang||"").toLowerCase().startsWith("en");
  }

  function ensureStyles(){
    if(document.querySelector('link[data-navigator-home="1"]')) return;
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="/navigator-home.css";
    link.dataset.navigatorHome="1";
    document.head.appendChild(link);
  }

  function ensureMainAction(hero){
    let wrap=hero.querySelector(".navigator-primary-action-wrap");
    if(wrap) return wrap;
    wrap=document.createElement("div");
    wrap.className="navigator-primary-action-wrap";
    wrap.innerHTML=`<div class="navigator-primary-action"><a class="navigator-primary-action__button" href="#chooseToolByZone">🧰 <span></span></a></div><p class="navigator-primary-action__note"></p>`;
    const quiz=hero.querySelector(".hero__quiz-cta-wrap");
    if(quiz) quiz.insertAdjacentElement("beforebegin",wrap);
    else hero.appendChild(wrap);
    return wrap;
  }

  function ensureNeeds(){
    let section=document.getElementById("navigatorNeeds");
    if(section) return section;
    const zoneGrid=document.getElementById("zoneGrid");
    if(!zoneGrid) return null;
    section=document.createElement("section");
    section.id="navigatorNeeds";
    section.className="navigator-needs";
    section.setAttribute("aria-labelledby","navigatorNeedsTitle");
    section.innerHTML=`
      <div class="navigator-needs__head">
        <p class="navigator-needs__eyebrow"></p>
        <h2 id="navigatorNeedsTitle"></h2>
        <p class="navigator-needs__sub"></p>
      </div>
      <div class="navigator-needs__grid"></div>
      <div class="navigator-secondary"></div>`;
    zoneGrid.insertAdjacentElement("afterend",section);
    return section;
  }

  function markZoneHeading(){
    const heading=document.querySelector('[data-i18n="chooseZoneHeading"]');
    if(heading) heading.id="chooseToolByZone";
  }

  function apply(){
    const hero=document.querySelector("#zoneSelectView .hero");
    if(!hero) return;
    ensureStyles();
    markZoneHeading();
    hero.classList.add("navigator-home-ready");
    const c=isEnglish()?COPY.en:COPY.el;

    const title=hero.querySelector(".hero__title");
    const subtitle=hero.querySelector(".hero__subtitle");
    if(title){ title.removeAttribute("data-i18n"); title.textContent=c.title; }
    if(subtitle){ subtitle.removeAttribute("data-i18n"); subtitle.textContent=c.subtitle; }

    const flowLabel=hero.querySelector(".hero__learning-loop-label");
    const flow=hero.querySelector(".hero__learning-loop-steps");
    if(flowLabel){ flowLabel.removeAttribute("data-i18n"); flowLabel.textContent=c.flowLabel; }
    if(flow){
      flow.innerHTML=c.flow.map((x)=>`<li>${x}</li>`).join("");
    }

    const main=ensureMainAction(hero);
    main.querySelector(".navigator-primary-action__button span").textContent=c.main;
    main.querySelector(".navigator-primary-action__note").textContent=c.mainNote;

    const quizTitle=hero.querySelector(".hero__quiz-cta-title");
    const quizSub=hero.querySelector(".hero__quiz-cta-sub");
    if(quizTitle){ quizTitle.removeAttribute("data-i18n"); quizTitle.textContent=c.quiz; }
    if(quizSub){ quizSub.removeAttribute("data-i18n"); quizSub.textContent=c.quizSub; }

    const helpBadge=hero.querySelector(".hero__ai-help-badge");
    const helpTitle=hero.querySelector("#heroAiHelpTitle");
    const helpSub=hero.querySelector(".hero__ai-help-copy > p:not(.hero__ai-help-note)");
    if(helpBadge){ helpBadge.removeAttribute("data-i18n"); helpBadge.textContent=c.helpBadge; }
    if(helpTitle){ helpTitle.removeAttribute("data-i18n"); helpTitle.textContent=c.helpTitle; }
    if(helpSub){ helpSub.removeAttribute("data-i18n"); helpSub.textContent=c.helpSub; }

    const section=ensureNeeds();
    if(section){
      section.querySelector(".navigator-needs__eyebrow").textContent=c.needsEyebrow;
      section.querySelector("#navigatorNeedsTitle").textContent=c.needsTitle;
      section.querySelector(".navigator-needs__sub").textContent=c.needsSub;
      section.querySelector(".navigator-needs__grid").innerHTML=c.needs.map(([icon,title,desc,href])=>
        `<a class="navigator-needs-card" href="${href}"><span class="navigator-needs-card__icon" aria-hidden="true">${icon}</span><span><strong>${title}</strong><span>${desc}</span></span></a>`
      ).join("");
      section.querySelector(".navigator-secondary").innerHTML=c.secondary.map(([icon,label,href])=>
        `<a class="navigator-secondary-link" href="${href}"><span aria-hidden="true">${icon}</span>${label}</a>`
      ).join("");
    }

    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content=isEnglish()
      ? "Free bilingual navigator for students and parents: choose the right AI tool by age, task and school need, with clear use guidance and age limits."
      : "Δωρεάν δίγλωσσος οδηγός για μαθητές και γονείς: βρες το σωστό AI εργαλείο ανά ηλικία, εργασία και σχολική ανάγκη, με σαφή χρήση και ηλικιακά όρια.";
  }

  function init(){
    apply();
    document.addEventListener("click",(event)=>{
      const target=event.target instanceof Element ? event.target : null;
      if(target?.closest("#langEl,#langEn")) setTimeout(apply,20);
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
