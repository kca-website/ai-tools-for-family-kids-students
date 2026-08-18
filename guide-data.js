/**
 * guide-data.js
 * Περιεχόμενο του Οδηγού (Guide) – δομημένο για απόδοση σε HTML και PDF.
 */

const GUIDE_DATA = {
  el: {
    title: "Ο Οδηγός AI για Σχολικές Εργασίες – Έκδοση 2026",
    sections: [
      {
        id: "part1",
        title: "Μέρος 1️⃣: Πώς να φτιάχνεις prompts που ΔΕΝ γράφουν την εργασία για σένα",
        content: `
          <p>Αντί να ζητάς από το AI να κάνει τη δουλειά σου, μάθε να το χρησιμοποιείς ως συνομιλητή. Ο σωστός prompt είναι αυτός που σε βάζει να σκεφτείς.</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Φάση</th><th>Παράδειγμα Prompt</th><th>Τι κάνει</th></tr></thead>
              <tbody>
                <tr><td>Κατανόηση</td><td>"Δεν καταλαβαίνω τι ζητάει η άσκηση. Μπορείς να μου το εξηγήσεις με δικά σου λόγια;"</td><td>Το AI ξαναγράφει την εκφώνηση απλά.</td></tr>
                <tr><td>Έρευνα</td><td>"Θέλω να γράψω για τον Β' Παγκόσμιο Πόλεμο. Ποια είναι τα 3 πιο σημαντικά γεγονότα που πρέπει να ξέρω;"</td><td>Το AI δίνει κατεύθυνση, όχι έτοιμη εργασία.</td></tr>
                <tr><td>Οργάνωση</td><td>"Έχω αυτές τις ιδέες: [λίστα]. Πώς μπορώ να τις οργανώσω σε παραγράφους;"</td><td>Το AI προτείνει δομή, αλλά ο μαθητής γράφει.</td></tr>
                <tr><td>Σύνθεση</td><td>"Έγραψα αυτή την παράγραφο: [κείμενο]. Τι της λείπει;"</td><td>Το AI κάνει κριτική, όχι ξαναγράψιμο.</td></tr>
                <tr><td>Έλεγχος</td><td>"Έχω τελειώσει την εργασία. Πού υπάρχουν λογικά κενά;"</td><td>Το AI εντοπίζει αδυναμίες, αλλά ο μαθητής τις διορθώνει.</td></tr>
              </tbody>
            </table>
          </div>
          <h4>🚫 Banned words για prompts σε σχολική εργασία:</h4>
          <ul>
            <li>"Γράψε μου"</li>
            <li>"Φτιάξε μου"</li>
            <li>"Δώσε μου έτοιμο"</li>
            <li>"Κάνε την εργασία"</li>
            <li>"Αντί για μένα"</li>
          </ul>
          <p><strong>Αντικατάσταση με:</strong> "Βοήθησέ με να", "Πώς μπορώ να", "Τι λείπει από", "Πού κάνω λάθος".</p>
        `
      },
      {
        id: "part2",
        title: "Μέρος 2️⃣: Το Pipeline – Από την ιδέα στην παράδοση",
        content: `
          <p>Μια 6-βηματική διαδικασία για κάθε σχολική εργασία, με ποιο εργαλείο σε κάθε βήμα:</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Βήμα</th><th>Τι κάνεις</th><th>Προτεινόμενο εργαλείο</th></tr></thead>
              <tbody>
                <tr><td>1. Κατανόηση</td><td>Διάβασε την εκφώνηση 3 φορές. Γράψε με δικά σου λόγια τι ζητάει.</td><td>ChatGPT / Gemini (εξήγηση)</td></tr>
                <tr><td>2. Ιδέες</td><td>Brainstorming. Γράψε ό,τι σου έρχεται στο μυαλό, χωρίς φίλτρο.</td><td>Miro AI / Xmind</td></tr>
                <tr><td>3. Έρευνα</td><td>Βρες πληροφορίες από 3 διαφορετικές πηγές.</td><td>Perplexity / Elicit</td></tr>
                <tr><td>4. Δομή</td><td>Οργάνωσε τις ιδέες σε περίγραμμα (εισαγωγή, κύρια σημεία, συμπέρασμα).</td><td>Notion AI / Obsidian</td></tr>
                <tr><td>5. Σύνθεση</td><td>Γράψε μόνος σου. Το AI μόνο για ερωτήσεις.</td><td>—</td></tr>
                <tr><td>6. Έλεγχος</td><td>Διάβασε δυνατά. Έλεγξε ορθογραφία, ροή, λογική.</td><td>Grammarly / Hemingway</td></tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        id: "part3",
        title: "Μέρος 3️⃣: Πώς να αξιολογείς τις απαντήσεις του AI – Το 'Slop' της εκπαίδευσης",
        content: `
          <p>Όπως το Magnific δείχνει το "slop" στις εικόνες, εμείς δείχνουμε το <strong>"slop" στην εκπαίδευση</strong>.</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Τι βλέπεις</th><th>Τι σημαίνει</th><th>Πώς το διορθώνεις</th></tr></thead>
              <tbody>
                <tr><td>Γενικότητες χωρίς παραδείγματα</td><td>Το AI δεν ξέρει το θέμα</td><td>Ζήτα συγκεκριμένα παραδείγματα</td></tr>
                <tr><td>Η γλώσσα είναι υπερβολικά επίσημη</td><td>Το AI γράφει "ακαδημαϊκά" χωρίς ουσία</td><td>Ζήτα να το πει απλά, σαν να εξηγεί σε φίλο</td></tr>
                <tr><td>Επαναλαμβάνεται</td><td>Το AI δεν έχει βάθος</td><td>Ζήτα διαφορετικές οπτικές γωνίες</td></tr>
                <tr><td>Δεν υπάρχουν πηγές</td><td>Το AI επινοεί</td><td>Ζήτα να παραθέσει πηγές ή να εξηγήσει πώς το ξέρει</td></tr>
              </tbody>
            </table>
          </div>
          <h4>🚫 Banned phrases που δείχνουν AI slop:</h4>
          <ul>
            <li>"Είναι σημαντικό να..."</li>
            <li>"Όπως είναι γνωστό..."</li>
            <li>"Στη σύγχρονη εποχή..."</li>
            <li>"Αναμφισβήτητα..."</li>
          </ul>
        `
      },
      {
        id: "part4",
        title: "Μέρος 4️⃣: Επίσημες πηγές του ΙΕΠ",
        content: `
          <p>Το Ινστιτούτο Εκπαιδευτικής Πολιτικής (ΙΕΠ) διαθέτει δημόσιες, δωρεάν πλατφόρμες που μπορούν να συμπληρώσουν τη χρήση AI εργαλείων. Δεν χρειάζεται λογαριασμός για να τις εξερευνήσεις.</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Πλατφόρμα</th><th>Τι προσφέρει</th><th>Σύνδεσμος</th></tr></thead>
              <tbody>
                <tr>
                  <td>Αίσωπος</td>
                  <td>Εκατοντάδες επιστημονικά και παιδαγωγικά πιστοποιημένα ψηφιακά διδακτικά σενάρια, ανά βαθμίδα και μάθημα.</td>
                  <td><a href="https://aesop.iep.edu.gr" target="_blank" rel="noopener">aesop.iep.edu.gr ↗</a></td>
                </tr>
                <tr>
                  <td>Τράπεζα Θεμάτων Διαβαθμισμένης Δυσκολίας</td>
                  <td>Αναζήτηση θεμάτων εξετάσεων Λυκείου ανά μάθημα, με ενδεικτικές απαντήσεις.</td>
                  <td><a href="https://trapeza.iep.edu.gr" target="_blank" rel="noopener">trapeza.iep.edu.gr ↗</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>Σημείωση:</strong> Αυτό το εργαλείο δεν σχετίζεται με το ΙΕΠ ούτε είναι επίσημος συνεργάτης του. Οι παραπάνω σύνδεσμοι δίνονται ως χρήσιμες, δημόσια διαθέσιμες πηγές.</p>
        `
      },
      {
        id: "part5",
        title: "Μέρος 5️⃣: Cheat Sheet – Όλα σε μία σελίδα",
        content: `
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Τομέας</th><th>Χρήσιμο prompt</th><th>Banned λέξη</th></tr></thead>
              <tbody>
                <tr><td>Έκθεση</td><td>"Βοήθησέ με να οργανώσω τις ιδέες μου για..."</td><td>"Γράψε μου έκθεση"</td></tr>
                <tr><td>Μαθηματικά</td><td>"Πού έκανα λάθος σε αυτή την άσκηση;"</td><td>"Λύσε μου την άσκηση"</td></tr>
                <tr><td>Ιστορία</td><td>"Ποια είναι η πιο συνηθισμένη παρανόηση για..."</td><td>"Πες μου όλα για..."</td></tr>
                <tr><td>Φυσική</td><td>"Εξήγησέ μου την έννοια σαν να είμαι 10 χρονών"</td><td>"Δώσε μου τον τύπο"</td></tr>
                <tr><td>Ξένες γλώσσες</td><td>"Διόρθωσε το κείμενό μου αλλά εξήγησε κάθε αλλαγή"</td><td>"Μετάφρασέ το"</td></tr>
              </tbody>
            </table>
          </div>
          <div class="guide-principle">
            <p><strong>Η χρυσή αρχή:</strong> Το AI είναι εργαλείο σκέψης, όχι εργαλείο αντικατάστασης. Όσο περισσότερο γράφεις μόνος σου, τόσο πιο πολύ μαθαίνεις. Το AI είναι ο συνομιλητής σου, όχι ο συγγραφέας σου.</p>
          </div>
          <p><strong>Μοιράσου το!</strong> Αυτός ο οδηγός είναι δωρεάν για όλους. Κάνε save, κάνε share, βοήθησε και άλλους να μάθουν πώς να χρησιμοποιούν το AI σωστά.</p>
          <button id="pdfDownloadBtn" class="guide-download-btn">📄 Κατέβασε τον οδηγό σε PDF</button>
        `
      }
    ]
  },
  en: {
    title: "The AI Guide for School Assignments – 2026 Edition",
    sections: [
      {
        id: "part1",
        title: "Part 1️⃣: How to craft prompts that DON'T write the assignment for you",
        content: `
          <p>Instead of asking AI to do the work for you, learn to use it as a conversation partner. The right prompt makes you think.</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Phase</th><th>Example Prompt</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td>Understanding</td><td>"I don't understand what the exercise is asking. Can you explain it in your own words?"</td><td>AI rephrases the assignment simply.</td></tr>
                <tr><td>Research</td><td>"I want to write about WWII. What are the 3 most important events I should know?"</td><td>AI gives direction, not a ready-made essay.</td></tr>
                <tr><td>Organization</td><td>"I have these ideas: [list]. How can I organize them into paragraphs?"</td><td>AI suggests structure, but the student writes.</td></tr>
                <tr><td>Composition</td><td>"I wrote this paragraph: [text]. What is it missing?"</td><td>AI critiques, doesn't rewrite.</td></tr>
                <tr><td>Review</td><td>"I've finished the assignment. Where are the logical gaps?"</td><td>AI identifies weaknesses, student fixes them.</td></tr>
              </tbody>
            </table>
          </div>
          <h4>🚫 Banned words for school prompts:</h4>
          <ul>
            <li>"Write for me"</li>
            <li>"Make for me"</li>
            <li>"Give me ready"</li>
            <li>"Do the assignment"</li>
            <li>"Instead of me"</li>
          </ul>
          <p><strong>Replace with:</strong> "Help me to", "How can I", "What's missing from", "Where am I wrong".</p>
        `
      },
      {
        id: "part2",
        title: "Part 2️⃣: The Pipeline – From idea to submission",
        content: `
          <p>A 6-step process for any school assignment, with the right tool for each step:</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Step</th><th>What you do</th><th>Suggested tool</th></tr></thead>
              <tbody>
                <tr><td>1. Understanding</td><td>Read the prompt 3 times. Write in your own words what it's asking.</td><td>ChatGPT / Gemini (explanation)</td></tr>
                <tr><td>2. Ideas</td><td>Brainstorm. Write down whatever comes to mind, no filter.</td><td>Miro AI / Xmind</td></tr>
                <tr><td>3. Research</td><td>Find information from 3 different sources.</td><td>Perplexity / Elicit</td></tr>
                <tr><td>4. Structure</td><td>Organize your ideas into an outline (intro, main points, conclusion).</td><td>Notion AI / Obsidian</td></tr>
                <tr><td>5. Composition</td><td>Write it yourself. AI only for questions.</td><td>—</td></tr>
                <tr><td>6. Review</td><td>Read it out loud. Check spelling, flow, logic.</td><td>Grammarly / Hemingway</td></tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        id: "part3",
        title: "Part 3️⃣: How to evaluate AI answers – The 'slop' of education",
        content: `
          <p>Just like Magnific reveals "slop" in images, here we reveal <strong>"slop" in education</strong>.</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>What you see</th><th>What it means</th><th>How to fix it</th></tr></thead>
              <tbody>
                <tr><td>Generalities with no examples</td><td>AI doesn't actually know the topic</td><td>Ask for specific examples</td></tr>
                <tr><td>The language is overly formal</td><td>AI is writing "academically" with no real substance</td><td>Ask it to say it simply, like explaining to a friend</td></tr>
                <tr><td>It keeps repeating itself</td><td>AI has no real depth here</td><td>Ask for different angles or perspectives</td></tr>
                <tr><td>No sources given</td><td>AI is making things up</td><td>Ask it to cite sources or explain how it knows</td></tr>
              </tbody>
            </table>
          </div>
          <h4>🚫 Banned phrases that signal AI slop:</h4>
          <ul>
            <li>"It is important to..."</li>
            <li>"As is well known..."</li>
            <li>"In today's modern world..."</li>
            <li>"Undoubtedly..."</li>
          </ul>
        `
      },
      {
        id: "part4",
        title: "Part 4️⃣: Official IEP (Greek Institute of Educational Policy) sources",
        content: `
          <p>The Institute of Educational Policy (ΙΕΠ) runs free, public platforms that can complement the use of AI tools. No account is needed to explore them.</p>
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Platform</th><th>What it offers</th><th>Link</th></tr></thead>
              <tbody>
                <tr>
                  <td>Aesop</td>
                  <td>Hundreds of scientifically and pedagogically certified digital teaching scenarios, by grade level and subject.</td>
                  <td><a href="https://aesop.iep.edu.gr" target="_blank" rel="noopener">aesop.iep.edu.gr ↗</a></td>
                </tr>
                <tr>
                  <td>Graded Difficulty Question Bank</td>
                  <td>Search past high-school exam questions by subject, with indicative answers.</td>
                  <td><a href="https://trapeza.iep.edu.gr" target="_blank" rel="noopener">trapeza.iep.edu.gr ↗</a></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>Note:</strong> This tool is not affiliated with ΙΕΠ nor an official partner. The links above are shared as useful, publicly available resources.</p>
        `
      },
      {
        id: "part5",
        title: "Part 5️⃣: Cheat Sheet – Everything on one page",
        content: `
          <div class="guide-table-wrapper">
            <table class="guide-table">
              <thead><tr><th>Subject</th><th>Useful prompt</th><th>Banned phrase</th></tr></thead>
              <tbody>
                <tr><td>Essay</td><td>"Help me organize my ideas about..."</td><td>"Write my essay for me"</td></tr>
                <tr><td>Math</td><td>"Where did I go wrong in this exercise?"</td><td>"Solve this exercise for me"</td></tr>
                <tr><td>History</td><td>"What's the most common misconception about..."</td><td>"Tell me everything about..."</td></tr>
                <tr><td>Physics</td><td>"Explain this concept to me like I'm 10"</td><td>"Give me the formula"</td></tr>
                <tr><td>Foreign languages</td><td>"Correct my text but explain every change"</td><td>"Translate this for me"</td></tr>
              </tbody>
            </table>
          </div>
          <div class="guide-principle">
            <p><strong>The golden rule:</strong> AI is a thinking tool, not a replacement tool. The more you write yourself, the more you learn. AI is your conversation partner, not your author.</p>
          </div>
          <p><strong>Share it!</strong> This guide is free for everyone. Save it, share it, help others learn how to use AI the right way.</p>
          <button id="pdfDownloadBtn" class="guide-download-btn">📄 Download the guide as PDF</button>
        `
      }
    ]
  }
};
