/**
 * tutor-render-host.js
 * Transitional single after-render signal for tutor extensions.
 *
 * During consolidation, the larger Flashcards / Study Tools / Mobile Compact
 * files still wrap AITutor.render themselves. This host is loaded after those
 * legacy wrappers and becomes the single outer lifecycle hook. Smaller UI-only
 * extensions subscribe to the event below instead of wrapping render again.
 *
 * Long-term target: move this lifecycle into tutor.js and remove all wrappers.
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
