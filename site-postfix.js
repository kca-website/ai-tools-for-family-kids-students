/** Small DOM-only cleanup loaded after app.js. */
(function(){
  "use strict";
  function fixFooter(){
    const el=document.querySelector('.site-footer__last-checked');
    if(!el) return;
    const en=(document.getElementById('langEn')?.classList.contains('active'));
    el.textContent=en ? 'Tools last checked: 29 August 2026' : 'Τελευταίος έλεγχος εργαλείων: 29 Αυγούστου 2026';
  }
  queueMicrotask(fixFooter);
  document.getElementById('langEl')?.addEventListener('click',()=>setTimeout(fixFooter,0));
  document.getElementById('langEn')?.addEventListener('click',()=>setTimeout(fixFooter,0));
})();
