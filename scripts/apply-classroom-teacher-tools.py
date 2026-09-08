from pathlib import Path

root = Path(__file__).resolve().parents[1]
page = root / 'classroom.html'
text = page.read_text(encoding='utf-8')

style_link = '  <link rel="stylesheet" href="/classroom-teacher-tools.css" />\n'
if '/classroom-teacher-tools.css' not in text:
    text = text.replace('  <meta name="theme-color" content="#2E6F5E" />\n', '  <meta name="theme-color" content="#2E6F5E" />\n' + style_link, 1)

section = r'''
  <section class="teacher-tools" id="teacherTools" aria-labelledby="teacherToolsTitle">
    <div class="teacher-tools__head">
      <p class="teacher-tools__eyebrow" data-el="AI navigator για εκπαιδευτικούς" data-en="AI navigator for educators">AI navigator για εκπαιδευτικούς</p>
      <h2 id="teacherToolsTitle" data-el="Τι θέλεις να κάνεις σήμερα;" data-en="What do you need to do today?">Τι θέλεις να κάνεις σήμερα;</h2>
      <p data-el="Για κάθε δουλειά προτείνουμε το πιο κατάλληλο σημείο εκκίνησης. Όπου ο δικός μας AI Βοηθός αρκεί, ανοίγει ήδη ρυθμισμένος για τη συγκεκριμένη εργασία. Όπου ένα εξειδικευμένο εργαλείο είναι καλύτερο, το δείχνουμε καθαρά." data-en="For each job we suggest the best starting point. When our AI Teacher Assistant is enough, it opens already configured for that task. When a specialist tool is a better fit, we say so clearly.">Για κάθε δουλειά προτείνουμε το πιο κατάλληλο σημείο εκκίνησης. Όπου ο δικός μας AI Βοηθός αρκεί, ανοίγει ήδη ρυθμισμένος για τη συγκεκριμένη εργασία. Όπου ένα εξειδικευμένο εργαλείο είναι καλύτερο, το δείχνουμε καθαρά.</p>
    </div>
    <div class="teacher-tools__grid">
      <article class="teacher-tool-card">
        <div class="teacher-tool-card__icon" aria-hidden="true">🧩</div>
        <h3 data-el="Δραστηριότητα μαθήματος" data-en="Classroom activity">Δραστηριότητα μαθήματος</h3>
        <span class="teacher-tool-card__pick" data-el="Καλύτερη αρχή: Για την τάξη" data-en="Best start: Classroom View">Καλύτερη αρχή: Για την τάξη</span>
        <p data-el="Βαθμίδα, μάθημα και θέμα → learning-first δραστηριότητα 3 βημάτων με έλεγχο κατανόησης." data-en="Level, subject and topic → a learning-first 3-step activity with an understanding check.">Βαθμίδα, μάθημα και θέμα → learning-first δραστηριότητα 3 βημάτων με έλεγχο κατανόησης.</p>
        <div class="teacher-tool-card__actions"><a class="primary" href="#pickerTitle" data-el="Φτιάξε δραστηριότητα" data-en="Build activity">Φτιάξε δραστηριότητα</a><a href="/teacher-assistant.html?task=activity" data-el="Με AI Βοηθό" data-en="With AI Assistant">Με AI Βοηθό</a></div>
      </article>

      <article class="teacher-tool-card">
        <div class="teacher-tool-card__icon" aria-hidden="true">❓</div>
        <h3 data-el="Ερωτήσεις / mini quiz" data-en="Questions / mini quiz">Ερωτήσεις / mini quiz</h3>
        <span class="teacher-tool-card__pick" data-el="Πρόταση: AI Βοηθός μας" data-en="Recommended: our AI Assistant">Πρόταση: AI Βοηθός μας</span>
        <p data-el="Φτιάξε σύντομες ερωτήσεις και ξεχωριστό κλειδί απαντήσεων, προσαρμοσμένα στην τάξη και στο θέμα." data-en="Create short questions plus a separate answer key adapted to the grade and topic.">Φτιάξε σύντομες ερωτήσεις και ξεχωριστό κλειδί απαντήσεων, προσαρμοσμένα στην τάξη και στο θέμα.</p>
        <div class="teacher-tool-card__actions"><a class="primary" href="/teacher-assistant.html?task=questions" data-el="Φτιάξε ερωτήσεις" data-en="Create questions">Φτιάξε ερωτήσεις</a><a target="_blank" rel="noopener noreferrer" href="https://www.magicschool.ai/magic-tools" data-el="MagicSchool ↗" data-en="MagicSchool ↗">MagicSchool ↗</a></div>
      </article>

      <article class="teacher-tool-card">
        <div class="teacher-tool-card__icon" aria-hidden="true">📊</div>
        <h3 data-el="Rubric αξιολόγησης" data-en="Assessment rubric">Rubric αξιολόγησης</h3>
        <span class="teacher-tool-card__pick" data-el="Δύο καλές επιλογές" data-en="Two good options">Δύο καλές επιλογές</span>
        <p data-el="Ο δικός μας βοηθός δίνει γρήγορο πρώτο σχέδιο. Το MagicSchool έχει εξειδικευμένο Rubric Generator." data-en="Our assistant gives a quick first draft. MagicSchool has a dedicated Rubric Generator.">Ο δικός μας βοηθός δίνει γρήγορο πρώτο σχέδιο. Το MagicSchool έχει εξειδικευμένο Rubric Generator.</p>
        <div class="teacher-tool-card__actions"><a class="primary" href="/teacher-assistant.html?task=rubric" data-el="Φτιάξε rubric" data-en="Create rubric">Φτιάξε rubric</a><a target="_blank" rel="noopener noreferrer" href="https://www.magicschool.ai/tools/rubric-generator" data-el="Rubric Generator ↗" data-en="Rubric Generator ↗">Rubric Generator ↗</a></div>
      </article>

      <article class="teacher-tool-card">
        <div class="teacher-tool-card__icon" aria-hidden="true">📋</div>
        <h3 data-el="Καρτέλα παρατήρησης" data-en="Observation template">Καρτέλα παρατήρησης</h3>
        <span class="teacher-tool-card__pick" data-el="Πρόταση: κενό πρότυπο" data-en="Recommended: blank template">Πρόταση: κενό πρότυπο</span>
        <p data-el="Ο AI Βοηθός φτιάχνει μόνο τη δομή της καρτέλας. Τα στοιχεία του μαθητή συμπληρώνονται από εσένα εκτός AI." data-en="The AI Assistant creates only the structure. Student details are completed by you outside the AI.">Ο AI Βοηθός φτιάχνει μόνο τη δομή της καρτέλας. Τα στοιχεία του μαθητή συμπληρώνονται από εσένα εκτός AI.</p>
        <div class="teacher-tool-card__actions"><a class="primary" href="/teacher-assistant.html?task=observation" data-el="Φτιάξε κενή καρτέλα" data-en="Create blank template">Φτιάξε κενή καρτέλα</a><a target="_blank" rel="noopener noreferrer" href="https://www.magicschool.ai/tools/report-card-comments" data-el="Σχόλια αναφοράς ↗" data-en="Report comments ↗">Σχόλια αναφοράς ↗</a></div>
      </article>

      <article class="teacher-tool-card">
        <div class="teacher-tool-card__icon" aria-hidden="true">🪜</div>
        <h3 data-el="Διαφοροποίηση υλικού" data-en="Differentiate material">Διαφοροποίηση υλικού</h3>
        <span class="teacher-tool-card__pick" data-el="AI Βοηθός ή Brisk" data-en="AI Assistant or Brisk">AI Βοηθός ή Brisk</span>
        <p data-el="Φτιάξε έκδοση υποστήριξης, βασική και επέκτασης. Για αλλαγή επιπέδου/γλώσσας σε υπάρχον υλικό, το Brisk είναι πιο εξειδικευμένο." data-en="Create support, core and extension versions. For changing level/language in existing material, Brisk is more specialised.">Φτιάξε έκδοση υποστήριξης, βασική και επέκτασης. Για αλλαγή επιπέδου/γλώσσας σε υπάρχον υλικό, το Brisk είναι πιο εξειδικευμένο.</p>
        <div class="teacher-tool-card__actions"><a class="primary" href="/teacher-assistant.html?task=differentiate" data-el="Διαφοροποίησέ το" data-en="Differentiate it">Διαφοροποίησέ το</a><a target="_blank" rel="noopener noreferrer" href="https://www.briskteaching.com/solutions/teachers" data-el="Brisk ↗" data-en="Brisk ↗">Brisk ↗</a></div>
      </article>

      <article class="teacher-tool-card teacher-tool-card--external">
        <div class="teacher-tool-card__icon" aria-hidden="true">💬</div>
        <h3 data-el="Feedback σε πραγματική εργασία" data-en="Feedback on real student work">Feedback σε πραγματική εργασία</h3>
        <span class="teacher-tool-card__pick" data-el="Καλύτερη επιλογή: Brisk" data-en="Best fit: Brisk">Καλύτερη επιλογή: Brisk</span>
        <p data-el="Για feedback μέσα σε έγγραφα και teacher review πριν δημοσιευτεί, προτείνουμε το εξειδικευμένο Brisk. Στον δικό μας βοηθό χρησιμοποίησε μόνο ανώνυμο απόσπασμα." data-en="For document-based feedback with teacher review before posting, we recommend Brisk. In our assistant, use anonymised excerpts only.">Για feedback μέσα σε έγγραφα και teacher review πριν δημοσιευτεί, προτείνουμε το εξειδικευμένο Brisk. Στον δικό μας βοηθό χρησιμοποίησε μόνο ανώνυμο απόσπασμα.</p>
        <div class="teacher-tool-card__actions"><a class="primary" target="_blank" rel="noopener noreferrer" href="https://www.briskteaching.com/give-feedback" data-el="Άνοιξε Brisk ↗" data-en="Open Brisk ↗">Άνοιξε Brisk ↗</a><a href="/teacher-assistant.html?task=feedback" data-el="Ανώνυμο απόσπασμα" data-en="Anonymised excerpt">Ανώνυμο απόσπασμα</a></div>
      </article>
    </div>
    <div class="teacher-tools__privacy"><strong data-el="Κανόνας ιδιωτικότητας:" data-en="Privacy rule:">Κανόνας ιδιωτικότητας:</strong> <span data-el="μην εισάγεις ονοματεπώνυμα, στοιχεία επικοινωνίας, διαγνώσεις ή άλλα προσωπικά/ευαίσθητα δεδομένα μαθητών σε AI εργαλείο. Για καρτέλες δημιουργούμε κενό πρότυπο. Για feedback χρησιμοποιούμε ανώνυμο απόσπασμα." data-en="do not enter student names, contact details, diagnoses or other personal/sensitive data into an AI tool. For observation records we create a blank template. For feedback use an anonymised excerpt.">μην εισάγεις ονοματεπώνυμα, στοιχεία επικοινωνίας, διαγνώσεις ή άλλα προσωπικά/ευαίσθητα δεδομένα μαθητών σε AI εργαλείο. Για καρτέλες δημιουργούμε κενό πρότυπο. Για feedback χρησιμοποιούμε ανώνυμο απόσπασμα.</span></div>
  </section>
'''

marker = '  </section>\n\n  <section class="panel picker-panel" aria-labelledby="pickerTitle">'
if 'id="teacherTools"' not in text:
    if marker not in text:
        raise SystemExit('Classroom hero marker not found')
    text = text.replace(marker, '  </section>\n\n' + section + '\n  <section class="panel picker-panel" aria-labelledby="pickerTitle">', 1)

page.write_text(text, encoding='utf-8')

sitemap = root / 'seo-sitemap.xml'
if sitemap.exists():
    sx = sitemap.read_text(encoding='utf-8')
    if 'https://www.aitools4kids.gr/teacher-assistant.html' not in sx:
        entry = '  <url>\n    <loc>https://www.aitools4kids.gr/teacher-assistant.html</loc>\n    <lastmod>2026-09-08</lastmod>\n  </url>\n'
        sx = sx.replace('</urlset>', entry + '</urlset>')
        sitemap.write_text(sx, encoding='utf-8')

print('Applied classroom teacher-tool navigator and sitemap entry.')
