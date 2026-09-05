/**
 * tutor-tools-layout.js
 * Keeps the conversational AI Help as the primary experience.
 * Flashcards, quiz and presentation tools are moved below the chat composer.
 * No observers, polling or AI calls.
 *
 * Consolidation note: this file no longer reassigns window.AITutor.render.
 * It subscribes to the single transitional tutor render host instead.
 */
(function () {
  "use strict";

  const RENDER_EVENT = "aitools4kids:tutor-rendered";

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

  document.addEventListener(RENDER_EVENT, moveToolsBelowChat);
  moveToolsBelowChat();
})();