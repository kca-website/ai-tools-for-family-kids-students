/**
 * tutor-tools-layout.js
 * Keeps the conversational AI Help as the primary experience.
 * Flashcards, quiz and presentation tools are moved below the chat composer.
 * No observers, polling or AI calls.
 */
(function () {
  "use strict";

  function moveToolsBelowChat() {
    const chat = document.querySelector("#tutorMount .tutor-chat");
    if (!chat) return;

    const flashcards = chat.querySelector(".tutor-flashcards");
    const studyTools = chat.querySelector(".tutor-study-tools");
    if (!flashcards && !studyTools) return;

    // append() moves existing nodes to the end of .tutor-chat, after the composer.
    // Preserve the intended order: Flashcards first, then Quiz / Presentation.
    if (flashcards) chat.appendChild(flashcards);
    if (studyTools) chat.appendChild(studyTools);
  }

  function wrapTutorRender() {
    if (!window.AITutor?.render || window.AITutor.__toolsLayoutWrapped) return;
    const original = window.AITutor.render.bind(window.AITutor);
    window.AITutor.render = function (context) {
      const result = original(context);
      moveToolsBelowChat();
      return result;
    };
    window.AITutor.__toolsLayoutWrapped = true;
  }

  wrapTutorRender();
  moveToolsBelowChat();
})();