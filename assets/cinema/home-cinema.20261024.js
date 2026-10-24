/* Homepage cinematic scroll v1 (2026-10-24).
 * Scope: "/" only, and only while #zoneSelectView is the visible view.
 *
 * How it works
 * - Each "scene" (finder, helper cards, promo, tiles, footer…) gets a scroll-linked
 *   progress value --cine-p (0 → 1). It is NOT a timed fade: the value follows the
 *   scroll position, so scrolling back up plays the scene in reverse.
 * - Scene geometry is measured from the layout (offsetTop chain, transform-free), so a
 *   frame only reads window.scrollY and writes CSS custom properties. No layout reads
 *   inside the scroll loop.
 * - A short inertial follow (lerp) smooths notched mouse wheels into a continuous
 *   "camera" move; trackpads and touch stay 1:1 because they already deliver
 *   continuous deltas. Native scrolling is never hijacked or auto-scrolled.
 * - Nothing is hidden before the first scroll, and everything that starts inside the
 *   first viewport is always shown at full strength.
 *   The end of the page is always reachable: the reveal end-point is capped to the
 *   maximum scroll position so the last scenes finish exactly at the bottom.
 * - Safe defaults: the CSS only hides anything when <html> has .cine-on, which this
 *   script adds after its first successful frame. No JS, a JS error, or
 *   prefers-reduced-motion → normal static page.
 */
(function(){
  "use strict";

  const ROOT = document.documentElement;
  const VERSION = "20261024";
  if(window.AITOOLSKIDS_HOME_CINEMA) return;

  /* selector, kind. Kinds map to CSS in home-cinema.<version>.css */
  const SCENES = [
    ["#zoneSelectView .home-v9-intro > .hero__quiz-cta-wrap", "rise"],
    ["#homeV9Finder", "card"],
    ["#homeV8HelpersMount .home-v9-ways > section", "card"],
    ["#homeAiPathsPromo", "frame"],
    ["#homeV9MoreTitle", "heading"],
    ["#homeV9More .home-v9-more__grid > *", "card"],
    ["#zoneSelectView > .not-guide-box", "rise"],
    [".site-footer__inner > *", "rise"]
  ];

  const ENTER_SPAN = 0.42;     /* fraction of the viewport over which a scene plays */
  const FINISH_LINE = 0.62;    /* scene is complete when its top reaches 62% of the viewport */
  const MIN_SPAN = 0.16;       /* never squeeze a scene into less than this (end of page) */
  const STAGGER = 0.07;        /* per-column delay for scenes that sit on the same row */
  const HERO_SPAN = 0.85;      /* hero exit plays over the first 85% of a viewport of scroll */
  const FOLLOW = 0.2;          /* inertial follow per 60fps frame */
  const JUMP = 0.45;           /* larger single-frame changes snap instead of easing */

  const reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

  let scenes = [];
  let heroValue = 0;
  let progressValue = 0;
  let viewport = 0;
  let maxScroll = 0;
  let rafId = 0;
  let lastTime = 0;
  let enabled = false;
  let measureQueued = false;
  let scanQueued = false;
  let held = null;
  let armed = false;
  let backdrop = null;
  let rail = null;

  const clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;

  function isHome(){
    return location.pathname === "/" || location.pathname === "";
  }

  function homeVisible(){
    const view = document.getElementById("zoneSelectView");
    return !!view && !view.hidden && isHome();
  }

  function shouldRun(){
    return homeVisible() && !(reduceQuery && reduceQuery.matches);
  }

  /* Layout position independent of CSS transforms. */
  function layoutTop(el){
    let top = 0;
    let node = el;
    while(node){
      top += node.offsetTop || 0;
      node = node.offsetParent;
    }
    return top;
  }

  function layoutLeft(el){
    let left = 0;
    let node = el;
    while(node){
      left += node.offsetLeft || 0;
      node = node.offsetParent;
    }
    return left;
  }

  function collect(){
    const seen = new Set();
    const found = [];
    SCENES.forEach(([selector, kind]) => {
      document.querySelectorAll(selector).forEach((el) => {
        if(seen.has(el)) return;
        seen.add(el);
        found.push({el, kind});
      });
    });
    return found;
  }

  function scan(){
    scanQueued = false;
    if(!enabled) return;
    const previous = new Map(scenes.map((s) => [s.el, s]));
    const next = collect().map(({el, kind}) => {
      const old = previous.get(el);
      if(old){ previous.delete(el); return old; }
      /* New nodes (first run, language switch, re-render) start at rest: no transform,
         no flash. Motion styles only apply once a frame moves them below 1. */
      el.setAttribute("data-cine-done", "");
      el.setAttribute("data-cine", kind);
      return {el, kind, start:0, end:1, current:-1, written:-1, done:true};
    });
    previous.forEach((s) => clearScene(s));
    scenes = next;
    measure();
  }

  function queueScan(){
    if(scanQueued || !enabled) return;
    scanQueued = true;
    requestAnimationFrame(scan);
  }

  function measure(){
    measureQueued = false;
    if(!enabled) return;
    viewport = window.innerHeight || ROOT.clientHeight || 1;
    maxScroll = Math.max(0, ROOT.scrollHeight - viewport);
    const rows = [];
    scenes.forEach((s) => {
      if(!s.el.isConnected || !s.el.offsetParent && getComputedStyle(s.el).position !== "fixed"){
        s.hidden = true;
        return;
      }
      s.hidden = false;
      s.top = layoutTop(s.el);
      s.left = layoutLeft(s.el);
      let row = rows.find((r) => Math.abs(r.top - s.top) < 24);
      if(!row){ row = {top:s.top, items:[]}; rows.push(row); }
      row.items.push(s);
    });
    rows.forEach((row) => {
      row.items.sort((a, b) => a.left - b.left);
      row.items.forEach((s, index) => {
        const delay = index * STAGGER * viewport;
        /* Starts inside the first viewport: always fully visible. */
        if(s.top < viewport){
          s.start = -Infinity;
          s.end = -Infinity;
          return;
        }
        let end = Math.min(s.top - viewport * FINISH_LINE + delay, maxScroll);
        let start = s.top - viewport + delay;
        if(end - start < viewport * MIN_SPAN) start = end - viewport * MIN_SPAN;
        if(end - start > viewport * ENTER_SPAN) start = end - viewport * ENTER_SPAN;
        s.start = start;
        s.end = end;
      });
    });
    requestFrame();
  }

  function queueMeasure(){
    if(measureQueued || !enabled) return;
    measureQueued = true;
    requestAnimationFrame(measure);
  }

  function targetFor(s, y){
    if(!armed) return 1;
    if(s.hidden || s.end === -Infinity) return 1;
    if(y >= s.end) return 1;
    if(y <= s.start) return 0;
    return (y - s.start) / (s.end - s.start);
  }

  function write(s, value){
    /* A scene under an active press stays where it was pressed: the release then lands
       on the same control, so the click is never lost to a moving target. */
    if(s.el === held) return;
    const rounded = Math.round(value * 1000) / 1000;
    if(rounded === s.written) return;
    s.written = rounded;
    s.el.style.setProperty("--cine-p", String(rounded));
    const done = rounded >= 1;
    if(done !== s.done){
      s.done = done;
      if(done) s.el.setAttribute("data-cine-done", "");
      else s.el.removeAttribute("data-cine-done");
    }
  }

  function frame(time){
    rafId = 0;
    if(!enabled) return;
    const dt = lastTime ? Math.min(64, time - lastTime) : 16.7;
    lastTime = time;
    const k = 1 - Math.pow(1 - FOLLOW, dt / 16.7);
    const y = window.scrollY || window.pageYOffset || 0;
    let moving = false;

    for(const s of scenes){
      const target = targetFor(s, y);
      /* Jumps (anchor links, scrollIntoView, scrollbar drag) land at rest immediately,
         so what is under the pointer is never still easing into place. */
      if(s.current < 0 || Math.abs(target - s.current) > JUMP) s.current = target;
      else s.current += (target - s.current) * k;
      if(Math.abs(target - s.current) < 0.002) s.current = target;
      else moving = true;
      write(s, s.current);
    }

    const heroTarget = clamp01(y / (viewport * HERO_SPAN));
    heroValue += (heroTarget - heroValue) * k;
    if(Math.abs(heroTarget - heroValue) < 0.002) heroValue = heroTarget; else moving = true;
    ROOT.style.setProperty("--cine-hero", heroValue.toFixed(3));

    const progressTarget = maxScroll > 0 ? clamp01(y / maxScroll) : 1;
    progressValue += (progressTarget - progressValue) * k;
    if(Math.abs(progressTarget - progressValue) < 0.001) progressValue = progressTarget; else moving = true;
    ROOT.style.setProperty("--cine-progress", progressValue.toFixed(4));

    if(!ROOT.classList.contains("cine-on")) ROOT.classList.add("cine-on");
    if(moving) requestFrame();
    else lastTime = 0;
  }

  function requestFrame(){
    if(!rafId && enabled) rafId = requestAnimationFrame(frame);
  }

  function clearScene(s){
    s.el.removeAttribute("data-cine");
    s.el.removeAttribute("data-cine-done");
    s.el.style.removeProperty("--cine-p");
  }

  function ensureDecor(){
    const hero = document.querySelector("#zoneSelectView .hero");
    if(hero && (!backdrop || !hero.contains(backdrop))){
      backdrop = document.createElement("div");
      backdrop.className = "cine-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.innerHTML = '<span class="cine-backdrop__glow cine-backdrop__glow--sky"></span><span class="cine-backdrop__glow cine-backdrop__glow--mint"></span><span class="cine-backdrop__glow cine-backdrop__glow--sun"></span>';
      hero.prepend(backdrop);
    }
    if(!rail){
      rail = document.createElement("div");
      rail.className = "cine-rail";
      rail.setAttribute("aria-hidden", "true");
      document.body.appendChild(rail);
    }
  }

  function enable(){
    if(enabled) return;
    enabled = true;
    ensureDecor();
    scan();
  }

  function disable(){
    if(!enabled) return;
    enabled = false;
    if(rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    lastTime = 0;
    scenes.forEach(clearScene);
    scenes = [];
    ROOT.classList.remove("cine-on");
    ROOT.style.removeProperty("--cine-hero");
    ROOT.style.removeProperty("--cine-progress");
    backdrop?.remove();
    rail?.remove();
    backdrop = null;
    rail = null;
  }

  function sync(){
    if(shouldRun()) enable();
    else disable();
  }

  let lastScrollY = 0;
  function onScroll(){
    if(!enabled) return;
    const y = window.scrollY || window.pageYOffset || 0;
    /* Until the visitor scrolls, every scene rests in place. On the first scroll only the
       scenes that are still below the fold switch to their pre-reveal state, where that
       switch cannot be seen. */
    armed = true;
    /* A jump of more than half a viewport (anchor, scrollIntoView, scrollbar drag, Home/End)
       settles synchronously, before the next paint and before any click can be aimed. */
    if(Math.abs(y - lastScrollY) > viewport * 0.5){
      for(const s of scenes){
        s.current = targetFor(s, y);
        write(s, s.current);
      }
    }
    lastScrollY = y;
    requestFrame();
  }

  function onPointerDown(event){
    if(!enabled) return;
    held = event.target instanceof Element ? event.target.closest("[data-cine]") : null;
  }

  function onPointerRelease(){
    if(!held) return;
    held = null;
    requestFrame();
  }

  function onFocusIn(event){
    /* Keyboard users: a focused control is always fully visible, even mid-scene. */
    if(!enabled) return;
    const target = event.target instanceof Element ? event.target.closest("[data-cine]") : null;
    if(!target) return;
    const s = scenes.find((scene) => scene.el === target);
    if(s){ s.current = 1; write(s, 1); }
  }

  function init(){
    sync();
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", queueMeasure, {passive:true});
    window.addEventListener("orientationchange", queueMeasure, {passive:true});
    window.addEventListener("load", queueMeasure, {once:true});
    window.addEventListener("popstate", () => setTimeout(sync, 0));
    window.addEventListener("pageshow", () => { sync(); queueMeasure(); });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("pointerdown", onPointerDown, {capture:true, passive:true});
    window.addEventListener("pointerup", onPointerRelease, {capture:true, passive:true});
    window.addEventListener("pointercancel", onPointerRelease, {capture:true, passive:true});
    window.addEventListener("blur", onPointerRelease);
    document.addEventListener("toggle", queueMeasure, true); /* <details> open/close */
    document.fonts?.ready?.then(queueMeasure);
    reduceQuery?.addEventListener?.("change", sync);

    if("ResizeObserver" in window){
      new ResizeObserver(queueMeasure).observe(document.body);
    }
    if("MutationObserver" in window){
      const view = document.getElementById("zoneSelectView");
      if(view){
        new MutationObserver(() => { sync(); queueScan(); }).observe(view, {childList:true, subtree:true, attributes:true, attributeFilter:["hidden"]});
      }
    }
  }

  window.AITOOLSKIDS_HOME_CINEMA = {
    version: VERSION,
    get enabled(){ return enabled; },
    get scenes(){ return scenes.map((s) => ({kind:s.kind, id:s.el.id || s.el.className, progress:s.current})); },
    refresh(){ sync(); queueScan(); }
  };

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
