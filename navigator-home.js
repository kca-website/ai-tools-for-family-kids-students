/* Homepage task routes + Special Education placement.
 * Important: this file must NOT rewrite the agreed hero, Practice Map or AI Help copy.
 * The visible top-of-homepage source of truth remains index.html/app.js.
 */
(function(){
  "use strict";

  function isHome(){ return location.pathname === "/" || location.pathname === ""; }
  if(!isHome()) return;

  const COPY={
    el:{
      specialTitle:"Ειδικά σχολεία",
      specialAge:"Ειδικό Γυμνάσιο · Ειδικό Λύκειο · ΕΝ.Ε.Ε.ΓΥ.-Λ.",
      specialDesc:"Διάλεξε τύπο ειδικού σχολείου και βρες την αντίστοιχη σχολική διαδρομή, ύλη και διαθέσιμη υποστήριξη.",
      needsEyebrow:"Ξεκίνα από την ανάγκη σου",
      needsTitle:"Τι θέλεις να κάνεις;",
      needsSub:"Οι παρακάτω σελίδες σε βοηθούν να διαλέξεις το σωστό εργαλείο και τον σωστό τρόπο χρήσης. Δεν κάνουν την εργασία για εσένα.",
      needs:[
        ["📄","Να μελετήσω PDF ή σημειώσεις","Εργαλεία για πηγές, σύνοψη και ερωτήσεις επανάληψης","/meleti-pdf-me-ai.html"],
        ["🔎","Να κάνω έρευνα με πηγές","Πώς βρίσκεις πληροφορίες και ελέγχεις από πού προέρχονται","/erevna-me-piges-ai.html"],
        ["🧠","Να φτιάξω flashcards και επανάληψη","Εργαλεία για κάρτες, τεστ και spaced repetition","/flashcards-epanalipsi-ai.html"],
        ["🎨","Να φτιάξω παρουσίαση ή αφίσα","Canva, Adobe Express και δημιουργικά εργαλεία με σωστά όρια","/parousiasi-afisa-ai.html"],
        ["📚","Να εξασκηθώ στην ανάγνωση ή στα Αγγλικά","Εργαλεία ανάγνωσης, προφοράς και γλωσσικής εξάσκησης","/anagnosi-agglika-ai.html"],
        ["✨","Να δημιουργήσω κάτι με AI","Εικόνα, ιδέες, οργάνωση και δημιουργικά projects χωρίς έτοιμη σχολική εργασία","/dimiourgiko-ai-gia-mathites.html"]
      ],
      secondary:[
        ["👪","Για γονείς","/primary/guardian/tools"],
        ["🤟","Ελληνική Νοηματική","/sign-language.html"],
        ["🧭","Όλες οι διαδρομές","/ti-thelo-na-kano-me-ai.html"]
      ]
    },
    en:{
      specialTitle:"Special schools",
      specialAge:"Special Gymnasium · Special Lyceum · EN.E.E.GY.-L.",
      specialDesc:"Choose the special-school type and open the matching school route, curriculum and available support.",
      needsEyebrow:"Start from your task",
      needsTitle:"What do you want to do?",
      needsSub:"These pages help you choose the right tool and the right way to use it. They do not do the schoolwork for you.",
      needs:[
        ["📄","Study a PDF or notes","Tools for sources, summaries and revision questions","/en/study-pdf-with-ai.html"],
        ["🔎","Research with sources","How to find information and check where it comes from","/en/research-with-sources-ai.html"],
        ["🧠","Make flashcards and revise","Tools for cards, quizzes and spaced repetition","/en/flashcards-revision-ai.html"],
        ["🎨","Make a presentation or poster","Canva, Adobe Express and creative tools with clear limits","/en/presentation-poster-ai.html"],
        ["📚","Practice reading or English","Reading, pronunciation and language-practice tools","/en/reading-english-ai.html"],
        ["✨","Create something with AI","Images, ideas, organisation and creative projects without ready-made schoolwork","/en/creative-ai-for-students.html"]
      ],
      secondary:[
        ["👪","For parents","/primary/guardian/tools"],
        ["🤟","Greek Sign Language","/sign-language.html"],
        ["🧭","All routes","/en/what-do-you-want-to-do-with-ai.html"]
      ]
    }
  };

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang||"").toLowerCase().startsWith("en");
  }

  function removeSeparatedSpecialEducation(){
    const old=document.getElementById("specialEducationHomeFeature");
    if(old && !document.getElementById("zoneGrid")?.contains(old)) old.remove();
  }

  function ensureSpecialSchoolCard(){
    const grid=document.getElementById("zoneGrid");
    if(!grid) return null;
    let card=document.getElementById("specialSchoolZoneCard");
    if(!card){
      card=document.createElement("a");
      card.id="specialSchoolZoneCard";
      card.className="zone-card navigator-special-school-card";
      card.dataset.zone="special";
      card.href="/special-education.html";
      card.innerHTML='<div class="zone-card__icon" aria-hidden="true">🏫</div><h3 class="zone-card__label"></h3><p class="zone-card__age"></p><p class="zone-card__desc"></p>';
    }
    if(card.parentElement!==grid) grid.appendChild(card);
    return card;
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

  function apply(){
    removeSeparatedSpecialEducation();
    const c=isEnglish()?COPY.en:COPY.el;

    const card=ensureSpecialSchoolCard();
    if(card){
      card.querySelector(".zone-card__label").textContent=c.specialTitle;
      card.querySelector(".zone-card__age").textContent=c.specialAge;
      card.querySelector(".zone-card__desc").textContent=c.specialDesc;
      card.setAttribute("aria-label",`${c.specialTitle}: ${c.specialAge}`);
    }

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
  }

  function scheduleApply(){
    apply();
    setTimeout(apply,40);
    setTimeout(apply,180);
  }

  function init(){
    scheduleApply();
    document.addEventListener("click",(event)=>{
      const target=event.target instanceof Element ? event.target : null;
      if(target?.closest("#langEl,#langEn,#backToZones")) setTimeout(scheduleApply,20);
    });
    window.addEventListener("popstate",scheduleApply);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
