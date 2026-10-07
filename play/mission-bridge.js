(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    params = new URLSearchParams(location.search),
    mission = params.get("mission"),
    returnTo = params.get("return");
  if (!mission) return;
  const MISSIONS = {
    "decimals.longer_is_larger": {
      label: "Σύγκριση δεκαδικών",
      world: "Math City",
    },
  };
  const current = MISSIONS[mission];
  if (!current) return;
  const style = document.createElement("style");
  style.textContent =
    ".route-mission-note{margin:12px 0 4px;padding:11px 13px;border-radius:13px;background:#f2edff;border:1px solid #d9ceff;color:#543b99;font-weight:800;font-size:13px;line-height:1.4}.route-return{background:#fff!important;color:#6548b4!important;border:1px solid #d8ccff!important}";
  document.head.appendChild(style);
  const intro = document.querySelector(".intro-card>div:last-child");
  if (intro) {
    const note = document.createElement("div");
    note.className = "route-mission-note";
    note.innerHTML = `🎯 Αποστολή από την AI Διαδρομή: <strong>${current.label}</strong>`;
    intro.querySelector(".actions")?.insertAdjacentElement("beforebegin", note);
  }
  const start = $("start");
  if (start) start.textContent = "Ξεκίνα την αποστολή";
  function returnHref() {
    try {
      const v = JSON.parse(
        sessionStorage.getItem("aitools4kids-play-return") || "null",
      );
      if (v?.gap === mission) {
        const u = new URL(v.url, location.origin);
        if (u.origin === location.origin) {
          u.searchParams.set("gap", mission);
          return u.pathname + u.search + u.hash;
        }
      }
    } catch {}
    return "/primary/student/quiz?gap=" + encodeURIComponent(mission);
  }
  function addReturn() {
    if (returnTo !== "path" || $("finish")?.hidden) return;
    const title = $("finishTitle")?.textContent || "";
    if (!title.includes("Math City")) return;
    const actions = $("finish")?.querySelector(".actions.center");
    if (!actions || actions.querySelector(".route-return")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn soft route-return";
    b.textContent = "← Πίσω στην AI Διαδρομή";
    b.onclick = () => {
      location.href = returnHref();
    };
    actions.prepend(b);
  }
  if (returnTo === "path") {
    const a = document.createElement("a");
    a.className = "route-return route-return-world";
    a.href = returnHref();
    a.textContent = "← Πίσω στην AI Διαδρομή";
    $("world").appendChild(a);
    const introLink = a.cloneNode(true);
    introLink.className = "btn soft route-return";
    intro?.querySelector(".actions")?.appendChild(introLink);
  }
  const finish = $("finish");
  if (finish && "MutationObserver" in window)
    new MutationObserver(addReturn).observe(finish, {
      attributes: true,
      attributeFilter: ["hidden"],
      childList: true,
      subtree: true,
    });
  addReturn();
})();
