from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Missing expected snippet in {path}: {old[:120]!r}')
    if text.count(old) != 1:
        raise SystemExit(f'Expected exactly one match in {path}, found {text.count(old)}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')

# Load the annual-guidance source layer next to the existing curriculum layer.
for path in ('xartis-ylis.html', 'classroom.html'):
    replace_once(
        path,
        '<script src="/official-curriculum-data.js"></script>\n<script>',
        '<script src="/official-curriculum-data.js"></script>\n<script src="/official-annual-instructions-2026-2027.js"></script>\n<script>'
    )

replace_once(
    'xartis-ylis.html',
    "  var layer = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;\n  if(!layer){ document.getElementById('empty').textContent='Ο Χάρτης Ύλης δεν μπόρεσε να φορτωθεί.'; return; }",
    "  var layer = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;\n  var annualLayer = window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027;\n  if(!layer){ document.getElementById('empty').textContent='Ο Χάρτης Ύλης δεν μπόρεσε να φορτωθεί.'; return; }"
)

replace_once(
    'xartis-ylis.html',
    "    var annual=(e.annualInstructionsStatus||'');\n    var annualText;\n    if(annual.indexOf('not-indexed')>=0){ annualText=lang==='el'?'Δεν έχει κωδικοποιηθεί ακόμη πλήρως':'Not fully encoded yet'; }\n    else if(annual){ annualText=lang==='el'?'Καταχωρισμένο / επαληθευμένο':'Encoded / verified'; }\n    else { annualText=lang==='el'?'Δεν αναφέρεται ξεχωριστό status':'No separate status recorded'; }\n    document.getElementById('annualStatus').textContent=annualText;",
    "    var annualInfo=annualLayer && annualLayer.resolve ? annualLayer.resolve(e) : null;\n    var annual=(annualInfo && annualInfo.status) || (e.annualInstructionsStatus||'');\n    var annualText;\n    if(annual==='official-annual-guidance-published'){ annualText=lang==='el'?'Επίσημες οδηγίες 2026–27 δημοσιευμένες':'Official 2026–27 guidance published'; }\n    else if(annual.indexOf('direct-official-url-pending')>=0){ annualText=lang==='el'?'Εγκύκλιος εντοπισμένη · άμεσο επίσημο αρχείο εκκρεμεί':'Circular identified · direct official file pending'; }\n    else if(annual.indexOf('not-indexed')>=0){ annualText=lang==='el'?'Δεν έχει κωδικοποιηθεί ακόμη πλήρως':'Not fully encoded yet'; }\n    else if(annual){ annualText=lang==='el'?'Καταχωρισμένο / επαληθευμένο':'Encoded / verified'; }\n    else { annualText=lang==='el'?'Δεν αναφέρεται ξεχωριστό status':'No separate status recorded'; }\n    document.getElementById('annualStatus').textContent=annualText;"
)

replace_once(
    'xartis-ylis.html',
    "    var annualNote=lang==='el' ? (e.annualInstructionsNoteEl||'') : (e.annualInstructionsNoteEn||'');",
    "    var annualNote=annualInfo ? (lang==='el' ? (annualInfo.noteEl||'') : (annualInfo.noteEn||annualInfo.noteEl||'')) : (lang==='el' ? (e.annualInstructionsNoteEl||'') : (e.annualInstructionsNoteEn||''));"
)

replace_once(
    'xartis-ylis.html',
    "    if(e.ministryUrl) s.push(sourceLink(e.ministryUrl,lang==='el'?'Υπουργείο Παιδείας':'Ministry of Education'));\n    document.getElementById('sources').innerHTML=s.join('');",
    "    if(e.ministryUrl) s.push(sourceLink(e.ministryUrl,lang==='el'?'Υπουργείο Παιδείας':'Ministry of Education'));\n    if(annualInfo && annualInfo.sourceUrl) s.push(sourceLink(annualInfo.sourceUrl,lang==='el'?(annualInfo.sourceLabelEl||'Ετήσιες οδηγίες 2026–27'):(annualInfo.sourceLabelEn||annualInfo.sourceLabelEl||'2026–27 annual guidance')));\n    document.getElementById('sources').innerHTML=s.join('');"
)

replace_once(
    'classroom.html',
    "    .hint{font-size:.88rem;color:var(--muted);margin:12px 0 0}.warning{background:var(--warn);border:1px solid #ead7a3;border-radius:13px;padding:13px 15px;color:#5b4719;margin-top:14px}.warning strong{display:block;margin-bottom:3px}",
    "    .hint{font-size:.88rem;color:var(--muted);margin:12px 0 0}.warning{background:var(--warn);border:1px solid #ead7a3;border-radius:13px;padding:13px 15px;color:#5b4719;margin-top:14px}.warning.verified{background:var(--soft);border-color:#cfe4da;color:#31564a}.warning strong{display:block;margin-bottom:3px}"
)

replace_once(
    'classroom.html',
    "  var layer=window.AITOOLSKIDS_OFFICIAL_CURRICULUM;\n  var workspace=document.getElementById('workspace');",
    "  var layer=window.AITOOLSKIDS_OFFICIAL_CURRICULUM;\n  var annualLayer=window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027;\n  var workspace=document.getElementById('workspace');"
)

replace_once(
    'classroom.html',
    "    var annual=document.getElementById('annualWarning'), annualStatus=e.annualInstructionsStatus||'';\n    if(annualStatus.indexOf('not-indexed')>=0){annual.hidden=false;annual.innerHTML='<strong>'+(lang==='el'?'Προσοχή στην ετήσια ύλη':'Annual-scope caution')+'</strong>'+esc(local(e.annualInstructionsNoteEl,e.annualInstructionsNoteEn)||(lang==='el'?'Η ετήσια οδηγία 2026–27 δεν έχει ακόμη κωδικοποιηθεί πλήρως για αυτό το μάθημα.':'The 2026–27 annual guidance has not yet been fully encoded for this subject.'));}else annual.hidden=true;",
    "    var annual=document.getElementById('annualWarning');\n    var annualInfo=annualLayer && annualLayer.resolve ? annualLayer.resolve(e) : null;\n    var annualStatus=(annualInfo && annualInfo.status) || e.annualInstructionsStatus || '';\n    annual.classList.remove('verified');\n    if(annualStatus==='official-annual-guidance-published'){\n      annual.hidden=false;annual.classList.add('verified');\n      annual.innerHTML='<strong>'+(lang==='el'?'Ετήσιες οδηγίες 2026–27 δημοσιευμένες':'Official 2026–27 guidance published')+'</strong>'+esc(local(annualInfo.noteEl,annualInfo.noteEn));\n    }else if(annualStatus.indexOf('direct-official-url-pending')>=0){\n      annual.hidden=false;\n      annual.innerHTML='<strong>'+(lang==='el'?'Ετήσια εγκύκλιος εντοπισμένη — τεκμηρίωση σε εξέλιξη':'Annual circular identified — documentation in progress')+'</strong>'+esc(local(annualInfo.noteEl,annualInfo.noteEn));\n    }else if(annualStatus.indexOf('not-indexed')>=0){\n      annual.hidden=false;annual.innerHTML='<strong>'+(lang==='el'?'Προσοχή στην ετήσια ύλη':'Annual-scope caution')+'</strong>'+esc(local(e.annualInstructionsNoteEl,e.annualInstructionsNoteEn)||(lang==='el'?'Η ετήσια οδηγία 2026–27 δεν έχει ακόμη κωδικοποιηθεί πλήρως για αυτό το μάθημα.':'The 2026–27 annual guidance has not yet been fully encoded for this subject.'));\n    }else annual.hidden=true;"
)

replace_once(
    'classroom.html',
    "    if(e.officialBook&&e.officialBook.url)sources.push('<a class=\"source-link\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(e.officialBook.url)+'\">'+(lang==='el'?'Επίσημο βιβλίο':'Official book')+' ↗</a>');\n    document.getElementById('sourceRow').innerHTML=sources.join('');",
    "    if(e.officialBook&&e.officialBook.url)sources.push('<a class=\"source-link\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(e.officialBook.url)+'\">'+(lang==='el'?'Επίσημο βιβλίο':'Official book')+' ↗</a>');\n    if(annualInfo&&annualInfo.sourceUrl)sources.push('<a class=\"source-link annual-source\" target=\"_blank\" rel=\"noopener\" href=\"'+esc(annualInfo.sourceUrl)+'\">'+esc(lang==='el'?(annualInfo.sourceLabelEl||'Ετήσιες οδηγίες 2026–27'):(annualInfo.sourceLabelEn||annualInfo.sourceLabelEl||'2026–27 annual guidance'))+' ↗</a>');\n    document.getElementById('sourceRow').innerHTML=sources.join('');"
)

print('annual guidance patch applied')
