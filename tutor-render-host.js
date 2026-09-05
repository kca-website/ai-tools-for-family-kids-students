/**
 * tutor-render-host.js
 * Transitional single after-render signal for tutor extensions.
 *
 * Flashcards, Study Tools, layout, mobile compact UI and the mobile label fix
 * now subscribe to one shared `aitools4kids:tutor-rendered` event instead of
 * independently reassigning AITutor.render.
 *
 * This host is the only remaining render wrapper during the consolidation pass.
 * Long-term target: emit the lifecycle from tutor.js itself and delete this file.
 */
(function () {
  "use strict";

  const EVENT_NAME = "aitools4kids:tutor-rendered";

  function emitRendered(context) {
    document.dispatchEvent(new CustomEvent(EVENT_NAME, {
      detail: { context: context || null },
    }));
  }

  function installHost() {
    if (!window.AITutor?.render || window.AITutor.__renderHostWrapped) return;
    const original = window.AITutor.render.bind(window.AITutor);
    window.AITutor.render = function (context) {
      const result = original(context);
      emitRendered(context);
      return result;
    };
    window.AITutor.__renderHostWrapped = true;
  }

  window.AITutorRenderHost = {
    eventName: EVENT_NAME,
    emitRendered,
  };

  installHost();
})();