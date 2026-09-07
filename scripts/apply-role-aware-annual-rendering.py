from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Missing expected snippet in {path}: {old[:160]!r}')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one match in {path}, found {count}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')

# Give Student/Parent a plain-language annual note while retaining the detailed
# protocol/IEP-act note for educators.
replace_once(
    'official-annual-instructions-2026-2027.js',
    "      noteEn: 'The annual circular reference for '+ref.subjectEn+' has been identified ('+ref.protocol+', IEP act '+ref.iepAct+'). A direct URL to the official attachment has not yet been recorded in the layer, so this reference is not used as proof of exact annual alignment for a topic.',\n      sourceUrl: META.middleMinistryHubUrl,",
    "      noteEn: 'The annual circular reference for '+ref.subjectEn+' has been identified ('+ref.protocol+', IEP act '+ref.iepAct+'). A direct URL to the official attachment has not yet been recorded in the layer, so this reference is not used as proof of exact annual alignment for a topic.',\n      publicNoteEl: 'Έχει εντοπιστεί σχετική εγκύκλιος 2026–27 για το μάθημα. Μέχρι να καταχωριστεί άμεσο επίσημο αρχείο, δεν τη χρησιμοποιούμε ως απόδειξη ότι ένα συγκεκριμένο θέμα ανήκει ακριβώς στη φετινή ύλη.',\n      publicNoteEn: 'A relevant 2026–27 circular has been identified for this subject. Until a direct official file is recorded, we do not use it as proof that a specific topic is exactly part of this year’s syllabus.',\n      sourceUrl: META.middleMinistryHubUrl,"
)

# Curriculum Map: simplify pending annual status and note for Student/Parent.
replace_once(
    'xartis-ylis.html',
    "    else if(annual.indexOf('direct-official-url-pending')>=0){ annualText=lang==='el'?'Εγκύκλιος εντοπισμένη · άμεσο επίσημο αρχείο εκκρεμεί':'Circular identified · direct official file pending'; }",
    "    else if(annual.indexOf('direct-official-url-pending')>=0){ annualText=role==='teacher' ? (lang==='el'?'Εγκύκλιος εντοπισμένη · άμεσο επίσημο αρχείο εκκρεμεί':'Circular identified · direct official file pending') : (lang==='el'?'Σχετική εγκύκλιος εντοπισμένη · επίσημη τεκμηρίωση εκκρεμεί':'Relevant circular identified · official documentation pending'); }"
)

replace_once(
    'xartis-ylis.html',
    "    var annualNote=annualInfo ? (lang==='el' ? (annualInfo.noteEl||'') : (annualInfo.noteEn||annualInfo.noteEl||'')) : (lang==='el' ? (e.annualInstructionsNoteEl||'') : (e.annualInstructionsNoteEn||''));",
    "    var pendingAnnual=annual.indexOf('direct-official-url-pending')>=0;\n    var annualNote=annualInfo ? (role!=='teacher' && pendingAnnual ? (lang==='el' ? (annualInfo.publicNoteEl||annualInfo.noteEl||'') : (annualInfo.publicNoteEn||annualInfo.noteEn||annualInfo.noteEl||'')) : (lang==='el' ? (annualInfo.noteEl||'') : (annualInfo.noteEn||annualInfo.noteEl||''))) : (lang==='el' ? (e.annualInstructionsNoteEl||'') : (e.annualInstructionsNoteEn||''));"
)

replace_once(
    'xartis-ylis.html',
    "    if(annualInfo && annualInfo.sourceUrl) s.push(sourceLink(annualInfo.sourceUrl,lang==='el'?(annualInfo.sourceLabelEl||'Ετήσιες οδηγίες 2026–27'):(annualInfo.sourceLabelEn||annualInfo.sourceLabelEl||'2026–27 annual guidance')));\n    document.getElementById('sources').innerHTML=s.join('');",
    "    if(annualInfo && annualInfo.sourceUrl) s.push(sourceLink(annualInfo.sourceUrl,lang==='el'?(annualInfo.sourceLabelEl||'Ετήσιες οδηγίες 2026–27'):(annualInfo.sourceLabelEn||annualInfo.sourceLabelEl||'2026–27 annual guidance')));\n    if(role==='teacher' && annualInfo && annualInfo.discoverySourceUrl) s.push(sourceLink(annualInfo.discoverySourceUrl,lang==='el'?'Πηγή εντοπισμού εγκυκλίου (μη επίσημη)':'Circular discovery source (non-official)'));\n    document.getElementById('sources').innerHTML=s.join('');"
)

# Classroom View is educator-only: expose the discovery source, clearly labelled
# as non-official, whenever the official attachment itself is still pending.
replace_once(
    'classroom.html',
    "    if(annualInfo&&annualInfo.sourceUrl)sources.push('<a class=\"source-link annual-source\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(annualInfo.sourceUrl)+'\">'+esc(lang==='el'?(annualInfo.sourceLabelEl||'Ετήσιες οδηγίες 2026–27'):(annualInfo.sourceLabelEn||annualInfo.sourceLabelEl||'2026–27 annual guidance'))+' ↗</a>');\n    document.getElementById('sourceRow').innerHTML=sources.join('');",
    "    if(annualInfo&&annualInfo.sourceUrl)sources.push('<a class=\"source-link annual-source\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(annualInfo.sourceUrl)+'\">'+esc(lang==='el'?(annualInfo.sourceLabelEl||'Ετήσιες οδηγίες 2026–27'):(annualInfo.sourceLabelEn||annualInfo.sourceLabelEl||'2026–27 annual guidance'))+' ↗</a>');\n    if(annualInfo&&annualInfo.discoverySourceUrl)sources.push('<a class=\"source-link discovery-source\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(annualInfo.discoverySourceUrl)+'\">'+esc(lang==='el'?'Πηγή εντοπισμού εγκυκλίου (μη επίσημη)':'Circular discovery source (non-official)')+' ↗</a>');\n    document.getElementById('sourceRow').innerHTML=sources.join('');"
)

# Extend annual smoke coverage to the role-aware rendering and discovery links.
replace_once(
    'tests/annual-guidance-smoke.mjs',
    "  assert.ok(await map.locator('#sources a').filter({ hasText: 'Ξένες Γλώσσες Δημοτικού' }).count(), 'Primary English annual source is missing');\n\n  const classroom = await browser.newPage({ viewport: { width: 390, height: 844 } });",
    "  assert.ok(await map.locator('#sources a').filter({ hasText: 'Ξένες Γλώσσες Δημοτικού' }).count(), 'Primary English annual source is missing');\n\n  await map.getByRole('button', { name: 'Γυμνάσιο' }).click();\n  await selectLabel(map, '#subject', 'Μαθηματικά');\n  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Σχετική εγκύκλιος εντοπισμένη · επίσημη τεκμηρίωση εκκρεμεί');\n  const studentAnnualNote = await map.locator('#scopeNote').innerText();\n  assert.doesNotMatch(studentAnnualNote, /111798\/Δ2\/28-08-2026|63\/30-07-2026/, 'Student/Parent view should not show protocol or IEP act numbers');\n  assert.equal(await map.locator('#sources a').filter({ hasText: 'Πηγή εντοπισμού εγκυκλίου' }).count(), 0, 'Student/Parent view should not expose the non-official discovery source');\n\n  await map.getByRole('button', { name: 'Εκπαιδευτικός' }).click();\n  const teacherAnnualNote = await map.locator('#scopeNote').innerText();\n  assert.match(teacherAnnualNote, /111798\/Δ2\/28-08-2026/);\n  assert.match(teacherAnnualNote, /63\/30-07-2026/);\n  const teacherDiscovery = map.locator('#sources a').filter({ hasText: 'Πηγή εντοπισμού εγκυκλίου (μη επίσημη)' });\n  assert.equal(await teacherDiscovery.count(), 1, 'Educator view should expose the discovery source');\n  assert.equal(await teacherDiscovery.getAttribute('href'), 'https://edu.klimaka.gr/mathimata/gymnasiou/3032-odhgies-mathimatika-a-gymnasiou');\n\n  const classroom = await browser.newPage({ viewport: { width: 390, height: 844 } });"
)

replace_once(
    'tests/annual-guidance-smoke.mjs',
    "  assert.doesNotMatch(middleText, /ακριβής.*αντιστοίχιση|exact annual alignment verified/i);\n\n  const resolverState = await classroom.evaluate(() => {",
    "  assert.doesNotMatch(middleText, /ακριβής.*αντιστοίχιση|exact annual alignment verified/i);\n  const classroomDiscovery = classroom.locator('.discovery-source');\n  assert.equal(await classroomDiscovery.count(), 1, 'Classroom should expose the non-official discovery source for pending Middle guidance');\n  assert.equal(await classroomDiscovery.getAttribute('href'), 'https://edu.klimaka.gr/mathimata/gymnasiou/3032-odhgies-mathimatika-a-gymnasiou');\n\n  const resolverState = await classroom.evaluate(() => {"
)

print('role-aware annual rendering patch applied')
