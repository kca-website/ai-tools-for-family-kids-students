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
        title: "Μέρος 4️⃣: Cheat Sheet – Όλα σε μία σελίδα",
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
      // ... (τα υπόλοιπα μέρη στα Αγγλικά, αντίστοιχα)
    ]
  }
};
