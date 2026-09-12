window.SPECIAL_EDUCATION_STATUS = {
  lastUpdated: "2026-09-12",
  legend: {verified:"Επαληθευμένο",indexed:"Επίσημη πηγή εντοπίστηκε",pending:"Σε αναμονή χαρτογράφησης"},
  rows: [
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Ζώνη Δημιουργικών Δραστηριοτήτων",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Β΄ · Υγεία και Διατροφή — βασικές έννοιες",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Β΄ · Στοιχεία Τεχνικής Θερμοδυναμικής – Εφαρμογές — βασικές έννοιες",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Β΄ · Τοπογραφία — βασικές έννοιες και μετρήσεις",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Β΄ · Φυτική Παραγωγή — φυτό, ανάπτυξη και σπόρος",curriculum:"verified",learning:"verified",quiz:"verified",tutorContext:"verified"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Αρχές Οικονομίας / Τομέας Διοίκησης & Οικονομίας",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Αρχές Γραμμικού & Αρχιτεκτονικού Σχεδίου / Τομέας Δομικών",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Αγωγή Υγείας / Τομέας Υγείας-Πρόνοιας-Ευεξίας",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Βασικές Αρχές Σύνθεσης / Εφαρμοσμένες Τέχνες",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Ερευνητική Εργασία στην Τεχνολογία",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Αρχές Μηχανολογίας / Τομέας Μηχανολογίας",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Β΄-Δ΄ · Τομέας Πληροφορικής",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"ΕΝ.Ε.Ε.ΓΥ.-Λ.",scope:"Α΄ · Γεωπονία και Αειφόρος Ανάπτυξη / Τομέας Γεωπονίας",curriculum:"indexed",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"Ειδικό Γυμνάσιο",scope:"Α΄ · Μαθηματικά",curriculum:"pending",learning:"pending",quiz:"pending",tutorContext:"pending"},
    {school:"Ειδικό Γυμνάσιο",scope:"Α΄ · Νεοελληνική Γλώσσα",curriculum:"pending",learning:"pending",quiz:"pending",tutorContext:"pending"}
  ]
};

(function(){
  "use strict";
  if(typeof document==="undefined") return;

  function enhanceSpecialEducationPage(){
    const hero=document.querySelector(".sp-hero");
    if(!hero) return;

    const icon=hero.querySelector(".sp-hero__icon");
    if(icon) icon.textContent="🏫";

    const aiLink=hero.querySelector(".sp-unified-ai");
    if(!aiLink || document.getElementById("spParentGuideLink")) return;

    const guide=document.createElement("a");
    guide.id="spParentGuideLink";
    guide.href="/special-education-parent-guide.html";
    guide.textContent="👪 Οδηγός γονέα";
    guide.style.cssText="display:inline-flex;align-items:center;justify-content:center;margin:14px 0 0 8px;min-height:44px;padding:10px 15px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#334155;text-decoration:none;font-weight:800;box-sizing:border-box;";
    aiLink.insertAdjacentElement("afterend",guide);

    const style=document.createElement("style");
    style.textContent="@media(max-width:840px){#spParentGuideLink{width:100%;margin-left:0!important;text-align:center}}";
    document.head.appendChild(style);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",enhanceSpecialEducationPage,{once:true});
  else enhanceSpecialEducationPage();
})();

(function(){
  "use strict";
  if(typeof document==="undefined") return;
  const files=[
    "/teacher-curriculum-extensions-2026-2027.js",
    "/teacher-curriculum-epal-2026-2027.js",
    "/teacher-curriculum-epal-c-specialties-2026-2027.js",
    "/teacher-curriculum-epal-c-final-sectors-2026-2027.js",
    "/teacher-curriculum-epal-runtime-guard.js",
    "/teacher-curriculum-epal-panhellenic-2027.js",
    "/teacher-curriculum-special-extra-2026-2027.js"
  ];
  if(document.readyState==="loading"){
    files.forEach(src=>document.write(`<script src="${src}"><\/script>`));
  }else{
    files.forEach(src=>{const s=document.createElement("script");s.src=src;document.head.appendChild(s);});
  }
})();
