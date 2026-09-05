/**
 * tutor-render-host.js
 * Transitional single after-render signal for tutor extensions.
 *
 * Flashcards, Study Tools, Mobile Compact and the mobile label fix subscribe to
 * one shared `aitools4kids:tutor-rendered` event instead of independently
 * reassigning AITutor.render.
 *
 * This host is the only remaining render wrapper during the consolidation pass.
 * It also owns the legacy study-tool ordering so a separate layout patch is no
 * longer required. Long-term target: emit the lifecycle from tutor.js itself.
 */
(function () {
  "use strict";

  const EVENT_NAME = "aitools4kids:tutor-rendered";

  function moveToolsBelowChat() {
    const chat = document.querySelector("#tutorMount .tutor-chat");
    if (!chat) return;

    const flashcards = chat.querySelector(".tutor-flashcards");
    const studyTools = chat.querySelector(".tutor-study-tools");
    if (!flashcards && !studyTools) return;

    // Preserve the established production order after the composer.
    if (flashcards) chat.appendChild(flashcards);
    if (studyTools) chat.appendChild(studyTools);
  }

  function emitRendered(context) {
    document.dispatchEvent(new CustomEvent(EVENT_NAME, {
      detail: { context: context || null },
    }));
  }

  // Register before Mobile Compact is loaded. Event listeners run in registration
  // order, matching production: Flashcards -> Study Tools -> layout -> mobile UI.
  document.addEventListener(EVENT_NAME, moveToolsBelowChat);

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
    moveToolsBelowChat,
  };

  installHost();
  moveToolsBelowChat();
})();