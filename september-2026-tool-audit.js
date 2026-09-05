/** September 2026 tool audit — data only, no DOM observers. */
(function(){
  "use strict";
  if (typeof TOOLS === "undefined") return;
  const DATE = "2026-09-05";
  const DATE_EL = "5 Σεπτεμβρίου 2026";
  const DATE_EN = "5 September 2026";
  function patch(id, data){
    if (!TOOLS[id]) return;
    Object.assign(TOOLS[id], data || {}, {
      lastReviewed: DATE,
      lastReviewedEl: DATE_EL,
      lastReviewedEn: DATE_EN
    });
  }
  Object.keys(TOOLS).forEach((id) => patch(id, {}));

  patch("photomath", {minAge:13, minAgeNote:"13+. Κάτω των 13 η χρήση απαγορεύεται. Για ανήλικο χρήστη απαιτείται άδεια γονέα ή νόμιμου κηδεμόνα όπου προβλέπεται.", auditSource:"https://photomath.com/terms/"});
  patch("miro-ai", {minAge:16, minAgeNote:"16+. Οι τρέχοντες Όροι Χρήσης της Miro δεν επιτρέπουν χρήση από άτομα κάτω των 16 ετών.", auditSource:"https://miro.com/legal/terms-of-service/"});
  patch("symbolab", {minAge:16, minAgeNote:"Στον ΕΟΧ/ΕΕ και στο Ηνωμένο Βασίλειο: 16+. Για την Ελλάδα χρησιμοποιούμε το όριο του ΕΟΧ.", auditSource:"https://www.symbolab.com/terms-of-use"});
  patch("scite", {minAge:13, minAgeNote:"13+. Η χρήση από άτομα κάτω των 13 ετών απαγορεύεται από τους Όρους του Scite.", auditSource:"https://scite.ai/terms"});
  patch("elicit", {minAge:13, minAgeNote:"13+ για άμεση χρήση. Για ανηλίκους εξακολουθούν να ισχύουν οι τοπικοί κανόνες και η γονική επίβλεψη όπου απαιτείται.", auditSource:"https://elicit.com/operations/terms"});
  patch("replit-ai", {minAge:13, minAgeNote:"13+. Κάτω των 18 απαιτείται άδεια γονέα ή κηδεμόνα σύμφωνα με τους τρέχοντες Όρους της Replit.", auditSource:"https://replit.com/terms-of-service"});
  patch("grammarly", {minAge:16, minAgeNote:"Για προσωπικό λογαριασμό στην ΕΕ χρησιμοποιούμε 16+ ως ασφαλές όριο. Διαχειριζόμενοι λογαριασμοί Education ακολουθούν την πολιτική του οργανισμού/σχολείου.", auditSource:"https://www.grammarly.com/terms"});
  patch("canva-magic", {minAge:15, minAgeNote:"Για προσωπική χρήση στην Ελλάδα χρησιμοποιούμε 15+. Για μικρότερες ηλικίες υπάρχει ξεχωριστή σχολική διαδρομή Canva Education με επίβλεψη.", auditSource:"https://www.canva.com/el_gr/politikes/terms-of-use/"});
  patch("github-copilot", {minAge:15, minAgeNote:"Για προσωπικό λογαριασμό στην Ελλάδα χρησιμοποιούμε 15+ ως ασφαλές όριο, λαμβάνοντας υπόψη και το τοπικό όριο ψηφιακής συγκατάθεσης.", auditSource:"https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"});
  patch("quizlet", {minAge:13, minAgeNote:"Το Quizlet απευθύνεται κυρίως σε χρήστες 13+, με περιορισμένη εμπειρία/πρόσθετες δικλείδες για μικρότερους χρήστες όπου προβλέπεται.", auditSource:"https://quizlet.com/tos"});
  patch("magicschool", {minAge:18, minAgeNote:"Ο προσωπικός λογαριασμός εκπαιδευτικού είναι 18+. Οι μαθητές χρησιμοποιούν MagicStudent μόνο σε σχολικά/εκπαιδευτικά διαχειριζόμενο περιβάλλον.", auditSource:"https://www.magicschool.ai/privacy-security/student-data-policy"});
  patch("erla", {minAge:13, minAgeNote:"13+ ή το μεγαλύτερο νόμιμο όριο της χώρας.", auditSource:"https://erla.app/terms"});
  patch("elements-of-ai", {minAge:13, minAgeNote:"13+ με επαληθεύσιμη γονική/κηδεμονική συναίνεση όταν ο χρήστης είναι κάτω των 18.", auditSource:"https://community.elementsofai.com/terms"});
  patch("claude-academy", {minAge:15, minAgeNote:"Το 15+ εδώ είναι παιδαγωγική σύσταση για το εκπαιδευτικό περιεχόμενο της Academy. Το Claude.ai παραμένει 18+.", auditSource:"https://academy.claude.com/"});
  patch("chatgpt-edu", {minAge:15, pending:false, minAgeNote:"Στην Ελλάδα αφορά σχολικό πιλοτικό πρόγραμμα σε επιλεγμένα λύκεια και πρόσβαση μέσω συμμετέχουσας σχολικής μονάδας.", auditSource:"https://edugpt.sch.gr/features.php"});
  patch("khan-academy-kids", {minAge:2, minAgeNote:"Σχεδιασμένο επίσημα για παιδιά 2–8 ετών. Δεν είναι γενικός generative-AI chatbot.", auditSource:"https://learn.khanacademy.org/khan-academy-kids/"});

  ["chatgpt","gemini","notebooklm","copilot","claude","perplexity","phet","google-arts-culture","gemini-education","ai-help"].forEach((id)=>patch(id, {}));
  window.AITOOLSKIDS_TOOL_AUDIT = Object.freeze({updated:DATE, count:Object.keys(TOOLS).length, mode:"data-only"});
})();
