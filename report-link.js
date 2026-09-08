/* Replace the public GitHub issue link with the internal report form.
 * Also applies the final September 2026 deep-research corrections after the
 * runtime tool audit, without rewriting the large curriculum/data files.
 */
(function(){
  "use strict";

  const ISSUE_PART="github.com/kca-website/ai-tools-for-family-kids-students/issues/new";

  function patchReportLinks(){
    document.querySelectorAll(`a[href*="${ISSUE_PART}"]`).forEach((link)=>{
      const source=encodeURIComponent(location.href);
      link.href=`/report-error.html?source=${source}`;
      link.removeAttribute("target");
      link.removeAttribute("rel");
    });
  }

  function patchTool(id,data){
    if(typeof TOOLS==="undefined" || !TOOLS[id]) return;
    Object.assign(TOOLS[id],data);
  }

  function applyDeepResearchCorrections(){
    if(typeof TOOLS==="undefined") return;

    /* Official provider terms / Greece-specific account-age corrections. */
    patchTool("photomath",{
      minAge:13,
      minAgeNote:"13+. Κάτω των 13 η χρήση απαγορεύεται από τους επίσημους Όρους της Photomath. Αν ο χρήστης θεωρείται ανήλικος στη χώρα του, απαιτείται άδεια γονέα ή νόμιμου κηδεμόνα.",
      auditSource:"https://photomath.com/terms/"
    });
    patchTool("scite",{
      minAge:13,
      minAgeNote:"13+. Η χρήση από άτομα κάτω των 13 ετών απαγορεύεται από τους επίσημους Όρους του Scite.",
      auditSource:"https://scite.ai/terms"
    });
    patchTool("canva-magic",{
      minAge:15,
      minAgeNote:"Για προσωπική χρήση στην Ελλάδα ο οδηγός εφαρμόζει 15+. Οι Όροι του Canva δεν επιτρέπουν σε «παιδιά» να χρησιμοποιούν την υπηρεσία εκτός Canva Education και ορίζουν ως παιδί όποιον είναι κάτω από 13 ή κάτω από το υψηλότερο τοπικό όριο νόμιμης συγκατάθεσης για επεξεργασία δεδομένων. Στην Ελλάδα το σχετικό όριο είναι 15.",
      auditSource:"https://www.canva.com/el_gr/politikes/terms-of-use/"
    });
    patchTool("notebooklm",{
      minAge:15,
      minAgeNote:"Προσωπική χρήση στην Ελλάδα: 15+ (ισχύον όριο διαχείρισης Google Account / ηλικία συγκατάθεσης). Μέσω Google Workspace for Education είναι διαθέσιμο σε χρήστες όλων των ηλικιών όταν το ενεργοποιεί το σχολείο. Ορισμένες λειτουργίες μπορεί να είναι μόνο για 18+.",
      auditSource:"https://support.google.com/notebooklm/answer/16164461"
    });

    /* Editorial recommendations must not be presented as provider age limits. */
    patchTool("autodraw",{
      category:"creative",
      minAge:6,
      minAgeNote:"Η ένδειξη 6+ είναι παιδαγωγική πρόταση του aitools4kids και όχι επίσημο ηλικιακό όριο του AutoDraw. Είναι δωρεάν εργαλείο του Google Creative Lab και η βασική χρήση δεν απαιτεί λογαριασμό."
    });
    patchTool("reading-coach",{
      minAge:6,
      minAgeNote:"Η ένδειξη 6+ είναι παιδαγωγική πρόταση του aitools4kids, όχι δηλωμένο ελάχιστο όριο της Microsoft. Η Microsoft τεκμηριώνει ελληνικά (el-GR) για την εφαρμογή Reading Coach, το Paste a Passage και το Word Practice. Το Create a Story έχει ξεχωριστή λίστα γλωσσών και δεν περιλαμβάνει ελληνικά στην τρέχουσα τεκμηρίωση.",
      shortDescEl:"Δωρεάν εργαλείο εξάσκησης αναγνωστικής ευχέρειας: ακούει την ανάγνωση και δίνει εξατομικευμένη ανατροφοδότηση για λέξεις και προφορά, με λειτουργίες προσβασιμότητας.",
      shortDescEn:"Free reading-fluency practice tool that listens to reading and gives personalized feedback on words and pronunciation, with accessibility features.",
      greekTips:"Τα ελληνικά (el-GR) υποστηρίζονται στην εφαρμογή, στο Paste a Passage και στο Word Practice. Το Create a Story έχει διαφορετική, μικρότερη λίστα γλωσσών και προς το παρόν δεν περιλαμβάνει ελληνικά."
    });

    /* Remove misleading Greek-EdTech categorisation from non-Greek services. */
    patchTool("magicschool",{category:"organization"});
    patchTool("erla",{category:"language"});

    /* Remove unsupported “designed specifically for dyslexia” wording wherever it
       survives inside recommendation rows. */
    if(typeof PATHS!=="undefined"){
      Object.values(PATHS||{}).forEach((roles)=>Object.values(roles||{}).forEach((path)=>{
        (path?.tools||[]).forEach((row)=>{
          if(row.toolId!=="reading-coach") return;
          if(typeof row.useCaseEl==="string"){
            row.useCaseEl=row.useCaseEl
              .replace(/Σχεδιασμένο ειδικά για δυσλεξία και αναγνωστικές δυσκολίες\.?/gi,"Χρήσιμο για στοχευμένη εξάσκηση αναγνωστικής ευχέρειας.")
              .replace(/ιδιαίτερα χρήσιμο για παιδί με δυσκολίες στην ανάγνωση ή δυσλεξία/gi,"χρήσιμο για στοχευμένη εξάσκηση στην ανάγνωση");
          }
          if(typeof row.useCaseEn==="string"){
            row.useCaseEn=row.useCaseEn
              .replace(/designed specifically for dyslexia and reading difficulties\.?/gi,"Useful for targeted reading-fluency practice.")
              .replace(/especially useful for a child with reading difficulties or dyslexia/gi,"useful for targeted reading practice");
          }
          row.cautionEl="Τα ελληνικά (el-GR) υποστηρίζονται στην εφαρμογή, στο Paste a Passage και στο Word Practice. Το Create a Story έχει διαφορετική λίστα γλωσσών και δεν περιλαμβάνει ελληνικά στην τρέχουσα τεκμηρίωση.";
          row.cautionEn="Greek (el-GR) is supported in the app, Paste a Passage and Word Practice. Create a Story uses a different language list and does not currently include Greek.";
        });
      }));
    }

    /* Learning protocol: attempt -> guided hint -> independent check.
       The UI is explicitly built around three steps, so step 3 becomes a genuine
       no-AI verification instead of another solver/chatbot call. */
    const primaryGapIds=new Set();
    if(typeof QUIZZES!=="undefined"){
      Object.values(QUIZZES?.primary||{}).forEach((quiz)=>{
        (quiz?.questions||[]).forEach((question)=>{
          (question?.options||[]).forEach((option)=>{
            if(option?.gapTag) primaryGapIds.add(option.gapTag);
          });
        });
      });
    }

    if(typeof LEARNING_PATHS!=="undefined"){
      Object.entries(LEARNING_PATHS||{}).forEach(([gapId,steps])=>{
        if(!Array.isArray(steps) || steps.length<3) return;

        if(primaryGapIds.has(gapId)){
          steps.slice(0,2).forEach((step)=>{
            const tool=step?.toolId ? TOOLS[step.toolId] : null;
            if(!tool || typeof tool.minAge!=="number" || tool.minAge<=12) return;
            step.descriptionEl="Αν το εργαλείο επιτρέπεται για την ηλικία σου, ζήτησε μόνο μία μικρή υπόδειξη. Αν όχι, ζήτησε από γονέα/εκπαιδευτικό μία υπόδειξη ή χρησιμοποίησε το βιβλίο/τις σημειώσεις σου. Μετά ξαναπροσπάθησε μόνος/η.";
            step.descriptionEn="If the tool is allowed for your age, ask for one small hint only. Otherwise ask a parent/teacher for a hint or use your textbook/notes. Then try again on your own.";
          });
        }

        if(steps[2]?.toolId){
          steps[2]={
            titleEl:"Τελικός έλεγχος χωρίς AI",
            titleEn:"Final check without AI",
            descriptionEl:"Κλείσε τα εργαλεία και λύσε μόνος/η μία νέα, παρόμοια ερώτηση. Αν μπορείς να εξηγήσεις και γιατί δουλεύει το βήμα, το έχεις καταλάβει. Αν όχι, γύρνα στην υπόδειξη και ξαναπροσπάθησε.",
            descriptionEn:"Close the tools and solve one new, similar question on your own. If you can also explain why the step works, you have understood it. If not, return to the hint and try again.",
            toolId:null
          };
        }
      });
    }

    window.AITOOLSKIDS_DEEP_RESEARCH_FIXES=Object.freeze({
      version:"1.0.0",
      verifiedOn:"2026-09-09",
      correctedTools:["photomath","scite","canva-magic","notebooklm","autodraw","reading-coach","magicschool","erla"],
      learningPathProtocol:"attempt-guided-help-independent-check"
    });

    /* The nutrition-label runtime listens for change events and will rebuild any
       open cards from the corrected data. */
    document.dispatchEvent(new Event("change"));
  }

  patchReportLinks();
  applyDeepResearchCorrections();
  document.addEventListener("DOMContentLoaded",()=>{
    patchReportLinks();
    applyDeepResearchCorrections();
  },{once:true});

  const observer=new MutationObserver(patchReportLinks);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),15000);
})();
