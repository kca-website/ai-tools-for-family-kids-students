(function(){"use strict";

/*
 * October 2026 educational-AI additions.
 * Keep these runtime additions here so we can extend the catalogue without
 * duplicating entries that already exist in data.js. This file is loaded
 * after data.js on every school path.
 */
if(typeof TOOLS!=="undefined"){
  const additions={
    "goblin-tools":{
      id:"goblin-tools",
      name:"Goblin Tools",
      url:"https://goblin.tools/",
      category:"organization",
      logo:null,
      shortDescEl:"Μικρά AI εργαλεία για οργάνωση, διάσπαση σύνθετων εργασιών σε βήματα, διατύπωση κειμένου και διαχείριση καθημερινών δυσκολιών. Ιδιαίτερα χρήσιμο για εκτελεστικές λειτουργίες.",
      shortDescEn:"Small AI tools for organization, breaking complex tasks into steps, rewriting text and handling everyday tasks. Especially useful for executive-function support.",
      minAgeNote:"Δεν έχει επιβεβαιωθεί ειδικός παιδικός λογαριασμός ή σαφές minimum age. Για μικρότερους μαθητές προτείνεται χρήση με γονέα/εκπαιδευτικό και χωρίς προσωπικά δεδομένα.",
      isGreek:false
    },
    "questionwell":{
      id:"questionwell",
      name:"QuestionWell",
      url:"https://questionwell.org/",
      category:"learning-tool",
      logo:null,
      shortDescEl:"Εργαλείο για εκπαιδευτικούς που δημιουργεί ερωτήσεις, quiz, exit tickets, rubrics, guided notes και άλλο υλικό από θέμα, κείμενο, ιστοσελίδα ή YouTube.",
      shortDescEn:"Teacher tool that creates questions, quizzes, exit tickets, rubrics, guided notes and other materials from a topic, text, website or YouTube.",
      minAgeNote:"Προτείνεται εδώ για χρήση από εκπαιδευτικό. Οι μαθητές συμμετέχουν σε δραστηριότητες που έχει δημιουργήσει ή αναθέσει ο εκπαιδευτικός.",
      schoolOnly:true,
      isGreek:false
    },
    "eduaide":{
      id:"eduaide",
      name:"Eduaide",
      url:"https://www.eduaide.ai/",
      category:"learning-tool",
      logo:null,
      shortDescEl:"AI toolkit για εκπαιδευτικούς: σχέδια μαθήματος, φύλλα εργασίας, οργανωτές, δραστηριότητες, rubrics, αξιολογήσεις, διαφοροποίηση και μετάφραση εκπαιδευτικού υλικού.",
      shortDescEn:"AI toolkit for educators: lesson plans, worksheets, organizers, activities, rubrics, assessments, differentiation and translation of teaching materials.",
      minAgeNote:"Εργαλείο για εκπαιδευτικούς. Η επίσημη τεκμηρίωση αναφέρει μετάφραση υλικού σε 26+ γλώσσες, συμπεριλαμβανομένων των Ελληνικών.",
      schoolOnly:true,
      isGreek:true
    }
  };
  Object.keys(additions).forEach(function(id){if(!TOOLS[id]) TOOLS[id]=additions[id];});
}

function addPathTool(zone,role,item){
  if(typeof PATHS==="undefined"||!PATHS[zone]||!PATHS[zone][role]||!Array.isArray(PATHS[zone][role].tools)) return;
  if(PATHS[zone][role].tools.some(function(x){return x&&x.toolId===item.toolId;})) return;
  PATHS[zone][role].tools.push(item);
}

/* Parent / educator recommendations */
["primary","middle","high"].forEach(function(zone){
  addPathTool(zone,"guardian",{
    toolId:"diffit",
    useCaseEl:"Για εκπαιδευτικό: προσαρμογή του ίδιου μαθήματος σε διαφορετικά επίπεδα και ανάγκες μαθητών.",
    useCaseEn:"For educators: adapt the same lesson to different learner levels and needs.",
    howToEl:"Δώσε το αρχικό κείμενο ή θέμα και χρησιμοποίησε τα εργαλεία διαφοροποίησης, scaffolding και έτοιμου υλικού.",
    howToEn:"Provide the source text or topic and use differentiation, scaffolding and ready-to-use material tools.",
    cautionEl:"Έλεγξε πάντα το παραγόμενο υλικό πριν δοθεί σε μαθητές.",
    cautionEn:"Always review generated material before giving it to students."
  });
  addPathTool(zone,"guardian",{
    toolId:"brisk",
    useCaseEl:"Για εκπαιδευτικό: δημιουργία μαθήματος, quiz, rubric, feedback ή παρουσίασης πάνω σε Docs, PDF, YouTube και ιστοσελίδες.",
    useCaseEn:"For educators: create lessons, quizzes, rubrics, feedback or presentations from Docs, PDFs, YouTube and webpages.",
    howToEl:"Δούλεψε πάνω στο υλικό που ήδη χρησιμοποιείς και ζήτησε από το Brisk να το μετατρέψει σε διδακτικό πόρο.",
    howToEn:"Work from material you already use and ask Brisk to turn it into a teaching resource.",
    cautionEl:"Η πλατφόρμα υποστηρίζει πολλές γλώσσες, αλλά η υποστήριξη Ελληνικών δεν έχει επιβεβαιωθεί ρητά από δημόσια επίσημη λίστα.",
    cautionEn:"The platform supports many languages, but Greek has not been explicitly verified in a public official language list."
  });
  addPathTool(zone,"guardian",{
    toolId:"questionwell",
    useCaseEl:"Για εκπαιδευτικό: γρήγορη δημιουργία ερωτήσεων, quiz, exit ticket, rubric ή σημειώσεων από υπάρχον υλικό.",
    useCaseEn:"For educators: quickly create questions, quizzes, exit tickets, rubrics or notes from existing material.",
    howToEl:"Βάλε κείμενο, θέμα, σύνδεσμο ή YouTube και δημιούργησε το είδος αξιολόγησης που χρειάζεσαι.",
    howToEn:"Add text, a topic, link or YouTube source and create the assessment format you need.",
    cautionEl:"Η υποστήριξη Ελληνικών δεν έχει επιβεβαιωθεί επίσημα· έλεγξε το αποτέλεσμα πριν το χρησιμοποιήσεις στην τάξη.",
    cautionEn:"Greek support has not been officially verified; review the output before classroom use."
  });
  addPathTool(zone,"guardian",{
    toolId:"eduaide",
    useCaseEl:"Για εκπαιδευτικό: οργάνωση ολόκληρου μαθήματος, φύλλα εργασίας, αξιολόγηση, διαφοροποίηση και μετάφραση υλικού στα Ελληνικά.",
    useCaseEn:"For educators: plan full lessons, worksheets, assessment, differentiation and translation of materials into Greek.",
    howToEl:"Ξεκίνα από στόχο, θέμα ή υπάρχον υλικό και δημιούργησε επεξεργάσιμο διδακτικό πόρο. Τα Ελληνικά υποστηρίζονται ρητά στη λειτουργία μετάφρασης.",
    howToEn:"Start from an objective, topic or source material and create an editable teaching resource. Greek is explicitly supported in translation.",
    cautionEl:"Όπως με κάθε generative-AI εργαλείο, ο εκπαιδευτικός πρέπει να ελέγχει ακρίβεια, επίπεδο δυσκολίας και αντιστοίχιση με την ελληνική ύλη.",
    cautionEn:"As with any generative-AI tool, educators should review accuracy, difficulty and alignment with the local curriculum."
  });
});

addPathTool("primary","guardian",{
  toolId:"goblin-tools",
  useCaseEl:"Όταν ένα παιδί δυσκολεύεται να ξεκινήσει ή να οργανώσει μια εργασία, σπάστε την μαζί σε μικρά βήματα.",
  useCaseEn:"When a child struggles to start or organize a task, break it into small steps together.",
  howToEl:"Χρησιμοποίησε κυρίως Magic ToDo ή Taskmaster μαζί με το παιδί.",
  howToEn:"Use Magic ToDo or Taskmaster together with the child.",
  cautionEl:"Δεν έχει επιβεβαιωθεί ειδική παιδική εμπειρία ή επίσημη υποστήριξη Ελληνικών· για Δημοτικό χρησιμοποίησέ το μόνο με ενήλικα.",
  cautionEn:"A dedicated child experience and official Greek support have not been verified; for primary ages use only with an adult."
});

["middle","high"].forEach(function(zone){
  addPathTool(zone,"guardian",{
    toolId:"snorkl",
    useCaseEl:"Για εκπαιδευτικό: δραστηριότητες όπου ο μαθητής εξηγεί τη σκέψη του με φωνή, γραφή ή σχεδίαση και λαμβάνει AI feedback.",
    useCaseEn:"For educators: activities where students explain their thinking by voice, writing or drawing and receive AI feedback.",
    howToEl:"Χρησιμοποίησέ το για έλεγχο κατανόησης και αιτιολόγηση, όχι μόνο για σωστό/λάθος.",
    howToEn:"Use it for checking understanding and reasoning, not only right/wrong answers.",
    cautionEl:"Υποστηρίζει 65+ γλώσσες, αλλά δεν έχει επιβεβαιωθεί δημόσια ότι τα Ελληνικά περιλαμβάνονται στη λίστα.",
    cautionEn:"It supports 65+ languages, but Greek has not been publicly verified in the language list."
  });
  addPathTool(zone,"student",{
    toolId:"goblin-tools",
    useCaseEl:"Όταν μια εργασία σου φαίνεται μεγάλη ή δεν ξέρεις από πού να αρχίσεις, σπάσε την σε μικρά βήματα.",
    useCaseEn:"When a task feels too big or you do not know where to start, break it into small steps.",
    howToEl:"Χρησιμοποίησε Magic ToDo ή Taskmaster για οργάνωση — όχι για να κάνει την εργασία αντί για εσένα.",
    howToEn:"Use Magic ToDo or Taskmaster for organization, not to do the work for you.",
    cautionEl:"Μην γράφεις προσωπικά ή ευαίσθητα δεδομένα. Η υποστήριξη Ελληνικών δεν έχει επιβεβαιωθεί επίσημα.",
    cautionEn:"Do not enter personal or sensitive data. Greek support has not been officially verified."
  });
});

const O={
"chatgpt-edu":["yes","Ελληνικό σχολικό πρόγραμμα/περιβάλλον χρήσης με υποστήριξη ελληνικών."],
"erla":["yes","Η καταχώριση δηλώνει ρητά υποστήριξη Ελληνικών."],
"autodraw":["neutral","Η βασική χρήση είναι σχεδίαση χωρίς ανάγκη κειμένου."],
"elements-of-ai":["yes","Υπάρχει πλήρης ελληνική έκδοση του μαθήματος."],
"claude-academy":["no","Το εκπαιδευτικό περιεχόμενο που ελέγχθηκε είναι στα αγγλικά."],
"chatgpt":["yes","Μπορεί να χρησιμοποιηθεί για ερωτήσεις και απαντήσεις στα ελληνικά, με έλεγχο ακρίβειας."],
"gemini":["yes","Η καταχώριση του εργαλείου επιβεβαιώνει χρήση στα ελληνικά."],
"copilot":["partial","Υποστηρίζει ελληνικό κείμενο, αλλά επιμέρους εκπαιδευτικές λειτουργίες μπορεί να διαφέρουν."],
"claude":["partial","Μπορεί να απαντά σε ελληνικό κείμενο, χωρίς πλήρη ελληνικοποίηση όλης της εμπειρίας."],
"grammarly":["no","Το βασικό προϊόν παραμένει προσανατολισμένο κυρίως στην αγγλική γραφή."],
"khan-academy-kids":["no","Το βασικό περιεχόμενο που ελέγχθηκε δεν αποτελεί ελληνική μαθησιακή εμπειρία."],
"notebooklm":["yes","Μπορεί να δουλέψει πάνω σε ελληνικές πηγές και να παράγει ελληνικό κείμενο."],
"perplexity":["yes","Δέχεται ελληνικά ερωτήματα και μπορεί να απαντά στα ελληνικά με πηγές."],
"wolfram-alpha":["neutral","Η βασική χρήση είναι συμβολικοί και αριθμητικοί υπολογισμοί."],
"quizlet":["partial","Ελληνικό περιεχόμενο σε κάρτες/όρους είναι εφικτό, όχι όμως όλες οι λειτουργίες ελληνικοποιημένες."],
"deepl":["yes","Τα Ελληνικά υποστηρίζονται ως γλώσσα μετάφρασης."],
"anki":["neutral","Οι κάρτες μπορούν να περιέχουν ελληνικό κείμενο και η βασική λειτουργία είναι γλωσσικά ουδέτερη."],
"zotero":["neutral","Η οργάνωση πηγών και βιβλιογραφίας είναι κατά βάση γλωσσικά ουδέτερη."],
"google-lens":["partial","Μπορεί να αναγνωρίζει ή να αναζητά ελληνικό κείμενο, ανάλογα με την εικόνα και την υπηρεσία."],
"gamma":["partial","Μπορεί να παραχθεί ελληνικό περιεχόμενο, με διαφοροποιήσεις ανά λειτουργία."],
"notion":["partial","Το περιεχόμενο μπορεί να είναι ελληνικό, χωρίς πλήρη ελληνικοποίηση όλων των AI λειτουργιών."],
"digital-tutoring":["yes","Επίσημη ελληνική εκπαιδευτική υπηρεσία."],
"photomath":["neutral","Η βασική μαθηματική αναγνώριση και επίλυση είναι κυρίως συμβολική."],
"canva-magic":["partial","Υπάρχει ελληνική χρήση και περιεχόμενο, αλλά η κάλυψη των AI λειτουργιών μπορεί να διαφέρει."],
"github-copilot":["partial","Ο κώδικας είναι γλωσσικά ουδέτερος και οι εξηγήσεις μπορούν να ζητηθούν στα ελληνικά."],
"duolingo":["partial","Υπάρχει μάθηση Ελληνικών σε ορισμένες διαδρομές, όχι πλήρης ελληνική βάση για όλες τις λειτουργίες."],
"symbolab":["neutral","Η βασική μαθηματική χρήση είναι συμβολική."],
"desmos":["neutral","Γραφήματα και μαθηματικές εκφράσεις είναι κατά βάση γλωσσικά ουδέτερα."],
"geogebra":["yes","Υπάρχει ελληνική τοπικοποίηση και η μαθηματική χρήση είναι σε μεγάλο βαθμό γλωσσικά ουδέτερη."],
"hemingway":["no","Το εργαλείο είναι προσανατολισμένο στην αγγλική γραφή."],
"ai-help":["yes","Η AI Βοήθεια του aitools4kids.gr λειτουργεί στα ελληνικά και χρησιμοποιεί ελληνικό σχολικό πλαίσιο."],
"phet":["yes","Πολλές προσομοιώσεις διαθέτουν ελληνική μετάφραση και η αλληλεπίδραση είναι κυρίως οπτική."],
"google-arts-culture":["partial","Υπάρχει ελληνικό περιεχόμενο σε μέρος της υπηρεσίας, όχι ομοιόμορφα παντού."],
"gemini-education":["yes","Μπορεί να χρησιμοποιηθεί για ελληνικό σχολικό περιεχόμενο, με τους αντίστοιχους σχολικούς όρους."],
"eduaide":["yes","Η επίσημη σελίδα του Eduaide περιλαμβάνει ρητά τα Greek στις 26+ γλώσσες μετάφρασης."],
"brisk":["unknown","Το Brisk δηλώνει υποστήριξη 58 γλωσσών, αλλά δεν εντοπίστηκε δημόσια επίσημη λίστα που να επιβεβαιώνει ρητά τα Ελληνικά."],
"snorkl":["unknown","Το Snorkl δηλώνει feedback/μετάφραση σε 65+ γλώσσες, αλλά δεν εντοπίστηκε δημόσια επίσημη λίστα που να επιβεβαιώνει ρητά τα Ελληνικά."],
"diffit":["unknown","Υπάρχει επιλογή γλώσσας, αλλά δεν έχει επιβεβαιωθεί επίσημα ότι περιλαμβάνονται τα Ελληνικά."],
"questionwell":["unknown","Υπάρχει επιλογή γλώσσας, αλλά δεν έχει επιβεβαιωθεί επίσημα ότι περιλαμβάνονται τα Ελληνικά."],
"goblin-tools":["unknown","Δεν έχει επιβεβαιωθεί επίσημη ελληνική διεπαφή ή ρητή υποστήριξη Ελληνικών."]
};
const baseIds=typeof ACCESSIBILITY_INFO!=="undefined"?Object.keys(ACCESSIBILITY_INFO):[];
const ids=Array.from(new Set(baseIds.concat(Object.keys(O))));
const I={};
ids.forEach(id=>{const v=O[id];I[id]=Object.freeze(v?{status:v[0],noteEl:v[1],noteEn:v[1]}:{status:"unknown",noteEl:"Δεν έχει επιβεβαιωθεί επαρκώς η υποστήριξη ελληνικών για το συγκεκριμένο εργαλείο.",noteEn:"Greek-language support has not yet been sufficiently verified for this tool."});});
window.GREEK_SUPPORT_INFO=Object.freeze(I);
window.AITOOLSKIDS_GREEK_SUPPORT_META=Object.freeze({version:2,reviewed:"2026-10-06",canonicalCount:ids.length});
})();