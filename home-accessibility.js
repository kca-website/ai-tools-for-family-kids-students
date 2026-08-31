/** Homepage refinements for the Greek Sign Language school-concept library. */
(function(){
  "use strict";

  function isEnglish(){
    return !!document.getElementById("langEn")?.classList.contains("active");
  }

  function refine(){
    const en = isEnglish();
    const subtitle = document.querySelector('[data-i18n="heroSubtitle"]');

    if (subtitle) {
      subtitle.textContent = en
        ? "See where practice is needed, find the right AI tool, and learn how to use it effectively. Diagnostic tests, personalized learning paths, guided AI Help and accessible educational resources for students aged 6–18, parents and educators."
        : "Δες πού χρειάζεται εξάσκηση, βρες το κατάλληλο AI εργαλείο και μάθε πώς να το χρησιμοποιείς σωστά. Διαγνωστικά τεστ, εξατομικευμένα learning paths, AI Βοήθεια και προσβάσιμο εκπαιδευτικό υλικό για μαθητές 6–18, γονείς και εκπαιδευτικούς.";
    }

    const badges = document.querySelector(".hero__badges");
    if (badges && !document.getElementById("heroGslBadge")) {
      const badge = document.createElement("span");
      badge.id = "heroGslBadge";
      badge.className = "badge badge--accent";
      const privacy = badges.querySelector(".privacy-badge-details");
      if (privacy) badges.insertBefore(badge, privacy);
      else badges.appendChild(badge);
    }

    const gslBadge = document.getElementById("heroGslBadge");
    if (gslBadge) gslBadge.textContent = en ? "Accessible GSL resources" : "Προσβάσιμο υλικό ΕΝΓ";

    const panel = document.getElementById("signLanguageFeature");
    if (panel) {
      const badge = en ? "New · Accessibility" : "Νέο · Προσβασιμότητα";
      const title = en
        ? "🤟 School concepts in Greek Sign Language (GSL)"
        : "🤟 Έννοιες στην Ελληνική Νοηματική Γλώσσα";
      const text = en
        ? "More than 200 school concepts and learning terms, with simple explanations, educational visuals and direct GSL videos from IEP and the University of Thessaly."
        : "Πάνω από 200 σχολικές έννοιες και όροι μάθησης, με απλή εξήγηση, εκπαιδευτική εικόνα και απευθείας βίντεο ΕΝΓ από το ΙΕΠ και το Πανεπιστήμιο Θεσσαλίας.";
      const cta = en ? "Explore 200+ concepts →" : "Δες 200+ έννοιες →";
      const signature = [en, title, text, cta].join("|");

      if (panel.dataset.gslSignature !== signature) {
        panel.dataset.gslSignature = signature;
        panel.innerHTML = `<div style="min-width:min(100%,520px);flex:1;"><div style="display:inline-block;margin-bottom:7px;padding:4px 9px;border-radius:999px;background:#dbeafe;color:#1e40af;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.03em;">${badge}</div><div style="font-family:var(--font-heading);font-weight:800;font-size:1.08rem;color:#1f2937;margin-bottom:5px;">${title}</div><div style="font-size:.9rem;line-height:1.5;color:#475569;max-width:720px;">${text}</div></div><a href="/sign-language.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 15px;border-radius:10px;background:#2e6ba3;color:#fff;text-decoration:none;font-weight:800;white-space:nowrap;">${cta}</a>`;
      }
    }

    const description = en
      ? "Free bilingual learning guide for students 6–18, parents and educators: diagnostic practice map, learning paths, AI tool recommendations, guided AI Help and accessible educational resources, including 200+ Greek Sign Language concepts."
      : "Δωρεάν δίγλωσσος οδηγός μάθησης για μαθητές 6–18, γονείς και εκπαιδευτικούς: διαγνωστικός χάρτης, learning paths, προτάσεις AI εργαλείων, καθοδηγούμενη AI Βοήθεια και προσβάσιμο εκπαιδευτικό υλικό, μαζί με πάνω από 200 έννοιες στην Ελληνική Νοηματική Γλώσσα.";

    const meta = document.querySelector('meta[name="description"]');
    const og = document.querySelector('meta[property="og:description"]');
    const twitter = document.querySelector('meta[name="twitter:description"]');
    if (meta) meta.content = description;
    if (og) og.content = description;
    if (twitter) twitter.content = description;
  }

  function scheduleRefine(){
    [0, 40, 180, 500].forEach(ms => setTimeout(refine, ms));
  }

  scheduleRefine();
  document.addEventListener("DOMContentLoaded", scheduleRefine);
  document.getElementById("langEl")?.addEventListener("click", scheduleRefine);
  document.getElementById("langEn")?.addEventListener("click", scheduleRefine);
})();
