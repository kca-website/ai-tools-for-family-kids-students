/**
 * guide-data.js
 * ------------------------------------------------------------
 * Οδηγός AI για Σχολικές Εργασίες – Έκδοση 2026
 * Δομημένος σαν το Magnific guide, προσαρμοσμένος στην εκπαίδευση.
 * ------------------------------------------------------------
 */

const GUIDE_CONTENT = {
  el: {
    title: "Ο Οδηγός AI για Σχολικές Εργασίες",
    subtitle: "40+ σελίδες γνώσης — δωρεάν. Διάβασέ το, εφάρμοσέ το, μοιράσου το.",
    parts: [
      {
        number: 1,
        title: "Πώς να φτιάχνεις prompts που ΔΕΝ γράφουν την εργασία για σένα",
        sections: [
          {
            heading: "Η φιλοσοφία",
            content: `<p>Ένα καλό prompt για σχολική εργασία δεν ζητάει έτοιμο κείμενο. Ζητάει <strong>κατεύθυνση, εξήγηση, κριτική</strong>. Ο μαθητής παραμένει ο συγγραφέας. Το AI είναι ο βοηθός που κάνει ερωτήσεις.</p>
            <p>Η διαφορά είναι μία λέξη: αντί για <strong>"γράψε μου"</strong> λες <strong>"βοήθησέ με να"</strong>.</p>`
          },
          {
            heading: "Οι 5 φάσεις ενός σωστού prompt",
            content: `
              <table class="guide-table">
                <thead><tr><th>Φάση</th><th>Prompt</th><th>Τι κάνει</th></tr></thead>
                <tbody>
                  <tr><td>Κατανόηση</td><td><em>"Δεν καταλαβαίνω τι ζητάει η άσκηση. Μπορείς να μου το εξηγήσεις με δικά σου λόγια;"</em></td><td>Το AI ξαναγράφει την εκφώνηση απλά.</td></tr>
                  <tr><td>Έρευνα</td><td><em>"Θέλω να γράψω για τον Β' Παγκόσμιο Πόλεμο. Ποια είναι τα 3 πιο σημαντικά γεγονότα που πρέπει να ξέρω;"</em></td><td>Το AI δίνει κατεύθυνση, όχι έτοιμη εργασία.</td></tr>
                  <tr><td>Οργάνωση</td><td><em>"Έχω αυτές τις ιδέες: [λίστα]. Πώς μπορώ να τις οργανώσω σε παραγράφους;"</em></td><td>Το AI προτείνει δομή, αλλά ο μαθητής γράφει.</td></tr>
                  <tr><td>Σύνθεση</td><td><em>"Έγραψα αυτή την παράγραφο: [κείμενο]. Τι της λείπει;"</em></td><td>Το AI κάνει κριτική, όχι ξαναγράψιμο.</td></tr>
                  <tr><td>Έλεγχος</td><td><em>"Έχω τελειώσει την εργασία. Πού υπάρχουν λογικά κενά;"</em></td><td>Το AI εντοπίζει αδυναμίες, αλλά ο μαθητής τις διορθώνει.</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "Banned words – λέξεις που καλούν το slop",
            content: `
              <div class="banned-list">
                <strong>🚫 Απαγορεύεται να γράψεις στα prompts:</strong>
                <ul>
                  <li>"Γράψε μου"</li>
                  <li>"Φτιάξε μου"</li>
                  <li>"Δώσε μου έτοιμο"</li>
                  <li>"Κάνε την εργασία"</li>
                  <li>"Αντί για μένα"</li>
                </ul>
                <p style="margin-top:12px;"><strong>✅ Αντικατάστησέ τα με:</strong></p>
                <ul>
                  <li>"Βοήθησέ με να"</li>
                  <li>"Πώς μπορώ να"</li>
                  <li>"Τι λείπει από"</li>
                  <li>"Πού κάνω λάθος"</li>
                </ul>
              </div>`
          }
        ]
      },
      {
        number: 2,
        title: "Το Pipeline – Από την ιδέα στην παράδοση",
        sections: [
          {
            heading: "6 βήματα για κάθε εργασία",
            content: `
              <table class="guide-table">
                <thead><tr><th>Βήμα</th><th>Τι κάνεις</th><th>Προτεινόμενο εργαλείο</th></tr></thead>
                <tbody>
                  <tr><td>1. Κατανόηση</td><td>Διάβασε την εκφώνηση 3 φορές. Γράψε με δικά σου λόγια τι ζητάει.</td><td>ChatGPT / Gemini</td></tr>
                  <tr><td>2. Ιδέες</td><td>Brainstorming. Γράψε ό,τι σου έρχεται στο μυαλό, χωρίς φίλτρο.</td><td>Miro AI / Xmind</td></tr>
                  <tr><td>3. Έρευνα</td><td>Βρες πληροφορίες από 3 διαφορετικές πηγές.</td><td>Perplexity / Elicit</td></tr>
                  <tr><td>4. Δομή</td><td>Οργάνωσε τις ιδέες σε περίγραμμα (εισαγωγή, κύρια σημεία, συμπέρασμα).</td><td>Notion AI / Obsidian</td></tr>
                  <tr><td>5. Σύνθεση</td><td>Γράψε μόνος σου. Το AI μόνο για ερωτήσεις.</td><td>—</td></tr>
                  <tr><td>6. Έλεγχος</td><td>Διάβασε δυνατά. Έλεγξε ορθογραφία, ροή, λογική.</td><td>Grammarly / Hemingway</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "Το μυστικό του pipeline",
            content: `<p>Το pipeline δεν είναι γραμμικό. Μπορείς να γυρνάς πίσω σε προηγούμενα βήματα όταν κολλάς. Το σημαντικό είναι να <strong>μην παραλείπεις το βήμα 5</strong> – τη σύνθεση με τα χέρια σου. Εκεί μαθαίνεις.</p>`
          }
        ]
      },
      {
        number: 3,
        title: "Πώς να αξιολογείς τις απαντήσεις του AI – Το 'Slop' της εκπαίδευσης",
        sections: [
          {
            heading: "Σημάδια ότι η απάντηση του AI είναι φτωχή",
            content: `
              <table class="guide-table">
                <thead><tr><th>Τι βλέπεις</th><th>Τι σημαίνει</th><th>Πώς το διορθώνεις</th></tr></thead>
                <tbody>
                  <tr><td>Γενικότητες χωρίς παραδείγματα</td><td>Το AI δεν ξέρει το θέμα</td><td>Ζήτα συγκεκριμένα παραδείγματα</td></tr>
                  <tr><td>Η γλώσσα είναι υπερβολικά επίσημη</td><td>Το AI γράφει "ακαδημαϊκά" χωρίς ουσία</td><td>Ζήτα να το πει απλά, σαν να εξηγεί σε φίλο</td></tr>
                  <tr><td>Επαναλαμβάνεται</td><td>Το AI δεν έχει βάθος</td><td>Ζήτα διαφορετικές οπτικές γωνίες</td></tr>
                  <tr><td>Δεν υπάρχουν πηγές</td><td>Το AI επινοεί</td><td>Ζήτα να παραθέσει πηγές ή να εξηγήσει πώς το ξέρει</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "Banned phrases που δείχνουν AI slop",
            content: `
              <div class="banned-list">
                <strong>🚫 Αν δεις αυτές τις φράσεις, η απάντηση είναι πιθανότατα επιφανειακή:</strong>
                <ul>
                  <li>"Είναι σημαντικό να..."</li>
                  <li>"Όπως είναι γνωστό..."</li>
                  <li>"Στη σύγχρονη εποχή..."</li>
                  <li>"Αναμφισβήτητα..."</li>
                  <li>"Αξίζει να σημειωθεί..."</li>
                </ul>
                <p style="margin-top:12px;"><strong>✅ Ζήτα αντ' αυτού:</strong> <em>"Πες μου ένα συγκεκριμένο παράδειγμα"</em> ή <em>"Πώς το ξέρεις αυτό;"</em></p>
              </div>`
          }
        ]
      },
      {
        number: 4,
        title: "Cheat Sheet – Όλα σε μία σελίδα",
        sections: [
          {
            heading: "Γρήγορες αναφορές",
            content: `
              <table class="guide-table">
                <thead><tr><th>Τομέας</th><th>Χρήσιμο prompt</th><th>Banned λέξη</th></tr></thead>
                <tbody>
                  <tr><td>Έκθεση</td><td><em>"Βοήθησέ με να οργανώσω τις ιδέες μου για..."</em></td><td>"Γράψε μου έκθεση"</td></tr>
                  <tr><td>Μαθηματικά</td><td><em>"Πού έκανα λάθος σε αυτή την άσκηση;"</em></td><td>"Λύσε μου την άσκηση"</td></tr>
                  <tr><td>Ιστορία</td><td><em>"Ποια είναι η πιο συνηθισμένη παρανόηση για..."</em></td><td>"Πες μου όλα για..."</td></tr>
                  <tr><td>Φυσική</td><td><em>"Εξήγησέ μου την έννοια σαν να είμαι 10 χρονών"</em></td><td>"Δώσε μου τον τύπο"</td></tr>
                  <tr><td>Ξένες γλώσσες</td><td><em>"Διόρθωσε το κείμενό μου αλλά εξήγησε κάθε αλλαγή"</em></td><td>"Μετάφρασέ το"</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "Η χρυσή αρχή",
            content: `<div class="guide-tip"><strong>💡 Θυμήσου:</strong> Το AI είναι εργαλείο σκέψης, όχι εργαλείο αντικατάστασης. Όσο περισσότερο γράφεις μόνος σου, τόσο πιο πολύ μαθαίνεις. Το AI είναι ο συνομιλητής σου, όχι ο συγγραφέας σου.</div>`
          }
        ]
      }
    ],
    cta: {
      title: "Μοιράσου το!",
      description: "Αυτός ο οδηγός είναι δωρεάν για όλους. Κάνε save, κάνε share, βοήθησε και άλλους να μάθουν πώς να χρησιμοποιούν το AI σωστά.",
      buttonText: "📌 Κατέβασε τον οδηγό σε PDF"
    }
  },
  en: {
    title: "The AI Guide for School Assignments",
    subtitle: "40+ pages of knowledge — free. Read it, apply it, share it.",
    parts: [
      {
        number: 1,
        title: "How to write prompts that DON'T do the assignment for you",
        sections: [
          {
            heading: "The philosophy",
            content: `<p>A good prompt for schoolwork doesn't ask for a ready-made text. It asks for <strong>direction, explanation, critique</strong>. The student remains the author. The AI is the assistant that asks questions.</p>
            <p>The difference is one word: instead of <strong>"write for me"</strong> you say <strong>"help me to"</strong>.</p>`
          },
          {
            heading: "The 5 phases of a good prompt",
            content: `
              <table class="guide-table">
                <thead><tr><th>Phase</th><th>Prompt</th><th>What it does</th></tr></thead>
                <tbody>
                  <tr><td>Understanding</td><td><em>"I don't understand what the assignment is asking. Can you explain it in your own words?"</em></td><td>AI rewrites the prompt simply.</td></tr>
                  <tr><td>Research</td><td><em>"I want to write about WWII. What are the 3 most important events I should know?"</em></td><td>AI gives direction, not a ready essay.</td></tr>
                  <tr><td>Organization</td><td><em>"I have these ideas: [list]. How can I organize them into paragraphs?"</em></td><td>AI suggests structure, student writes.</td></tr>
                  <tr><td>Composition</td><td><em>"I wrote this paragraph: [text]. What's missing?"</em></td><td>AI critiques, doesn't rewrite.</td></tr>
                  <tr><td>Review</td><td><em>"I've finished the assignment. Where are the logical gaps?"</em></td><td>AI spots weaknesses, student fixes them.</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "Banned words – the slop triggers",
            content: `
              <div class="banned-list">
                <strong>🚫 Never write in prompts:</strong>
                <ul>
                  <li>"Write for me"</li>
                  <li>"Make for me"</li>
                  <li>"Give me a ready"</li>
                  <li>"Do the assignment"</li>
                  <li>"Instead of me"</li>
                </ul>
                <p style="margin-top:12px;"><strong>✅ Replace with:</strong></p>
                <ul>
                  <li>"Help me to"</li>
                  <li>"How can I"</li>
                  <li>"What's missing from"</li>
                  <li>"Where am I wrong"</li>
                </ul>
              </div>`
          }
        ]
      },
      {
        number: 2,
        title: "The Pipeline – From idea to submission",
        sections: [
          {
            heading: "6 steps for every assignment",
            content: `
              <table class="guide-table">
                <thead><tr><th>Step</th><th>What to do</th><th>Recommended tool</th></tr></thead>
                <tbody>
                  <tr><td>1. Understanding</td><td>Read the prompt 3 times. Write in your own words what it asks.</td><td>ChatGPT / Gemini</td></tr>
                  <tr><td>2. Ideas</td><td>Brainstorm. Write everything that comes to mind, no filter.</td><td>Miro AI / Xmind</td></tr>
                  <tr><td>3. Research</td><td>Find information from 3 different sources.</td><td>Perplexity / Elicit</td></tr>
                  <tr><td>4. Structure</td><td>Organize ideas into an outline (intro, main points, conclusion).</td><td>Notion AI / Obsidian</td></tr>
                  <tr><td>5. Composition</td><td>Write it yourself. AI only for questions.</td><td>—</td></tr>
                  <tr><td>6. Review</td><td>Read aloud. Check spelling, flow, logic.</td><td>Grammarly / Hemingway</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "The secret of the pipeline",
            content: `<p>The pipeline is not linear. You can go back to previous steps when you get stuck. The important thing is to <strong>never skip step 5</strong> – writing with your own hands. That's where you learn.</p>`
          }
        ]
      },
      {
        number: 3,
        title: "How to evaluate AI answers – The 'slop' of education",
        sections: [
          {
            heading: "Signs of a poor AI answer",
            content: `
              <table class="guide-table">
                <thead><tr><th>What you see</th><th>What it means</th><th>How to fix it</th></tr></thead>
                <tbody>
                  <tr><td>Generalities with no examples</td><td>AI doesn't know the topic</td><td>Ask for specific examples</td></tr>
                  <tr><td>Overly formal language</td><td>AI writes "academically" with no substance</td><td>Ask it to say it simply, like explaining to a friend</td></tr>
                  <tr><td>Repeats itself</td><td>AI lacks depth</td><td>Ask for different perspectives</td></tr>
                  <tr><td>No sources</td><td>AI is making things up</td><td>Ask it to cite sources or explain how it knows</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "Banned phrases that signal AI slop",
            content: `
              <div class="banned-list">
                <strong>🚫 If you see these, the answer is likely shallow:</strong>
                <ul>
                  <li>"It is important to..."</li>
                  <li>"As is well known..."</li>
                  <li>"In the modern era..."</li>
                  <li>"Undoubtedly..."</li>
                  <li>"It is worth noting..."</li>
                </ul>
                <p style="margin-top:12px;"><strong>✅ Instead ask:</strong> <em>"Give me a concrete example"</em> or <em>"How do you know that?"</em></p>
              </div>`
          }
        ]
      },
      {
        number: 4,
        title: "Cheat Sheet – Everything in one page",
        sections: [
          {
            heading: "Quick references",
            content: `
              <table class="guide-table">
                <thead><tr><th>Subject</th><th>Useful prompt</th><th>Banned word</th></tr></thead>
                <tbody>
                  <tr><td>Essay</td><td><em>"Help me organize my ideas for..."</em></td><td>"Write me an essay"</td></tr>
                  <tr><td>Math</td><td><em>"Where did I go wrong in this exercise?"</em></td><td>"Solve the exercise"</td></tr>
                  <tr><td>History</td><td><em>"What's the most common misconception about..."</em></td><td>"Tell me everything about..."</td></tr>
                  <tr><td>Physics</td><td><em>"Explain the concept as if I'm 10 years old"</em></td><td>"Give me the formula"</td></tr>
                  <tr><td>Languages</td><td><em>"Correct my text but explain every change"</em></td><td>"Translate it"</td></tr>
                </tbody>
              </table>`
          },
          {
            heading: "The golden rule",
            content: `<div class="guide-tip"><strong>💡 Remember:</strong> AI is a thinking tool, not a replacement tool. The more you write yourself, the more you learn. AI is your conversation partner, not your ghostwriter.</div>`
          }
        ]
      }
    ],
    cta: {
      title: "Share it!",
      description: "This guide is free for everyone. Save it, share it, help others learn how to use AI correctly.",
      buttonText: "📌 Download the guide as PDF"
    }
  }
};