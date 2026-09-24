module.exports = async function handler(req, res) {
  const groqKey = process.env.GROQ_API_KEY;
  const model = 'openai/gpt-oss-120b';

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ configured: !!groqKey, model, audience: 'adult_preschool' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!groqKey) return res.status(503).json({ error: 'ai_not_configured', message: 'Η δημιουργία δραστηριότητας δεν είναι προσωρινά διαθέσιμη.' });

  const idea = String(req.body?.idea || '').trim();
  const mode = String(req.body?.mode || 'story');
  const age = String(req.body?.age || '5');
  const duration = String(req.body?.duration || '10');
  const place = String(req.body?.place || 'home');
  if (!idea || idea.length > 120) return res.status(400).json({ error: 'invalid_idea', message: 'Γράψε μία σύντομη ιδέα έως 120 χαρακτήρες.' });
  if (!['story','learn','offline'].includes(mode)) return res.status(400).json({ error: 'invalid_mode', message: 'Μη έγκυρος τύπος δραστηριότητας.' });
  if (!['4','5','6'].includes(age)) return res.status(400).json({ error: 'invalid_age', message: 'Διάλεξε ηλικία 4, 5 ή 6 ετών.' });
  if (!['5','10','15'].includes(duration)) return res.status(400).json({ error: 'invalid_duration', message: 'Διάλεξε διάρκεια 5, 10 ή 15 λεπτών.' });
  if (!['home','classroom'].includes(place)) return res.status(400).json({ error: 'invalid_place', message: 'Διάλεξε σπίτι ή τάξη.' });
  if (looksLikePersonalData(idea)) return res.status(400).json({ error: 'personal_data', message: 'Χρησιμοποίησε μόνο ένα γενικό θέμα, χωρίς όνομα, email, τηλέφωνο ή άλλα προσωπικά στοιχεία παιδιού.' });

  const curriculum = getCurriculumAlignment(idea, mode);

  const modeRule = mode === 'story'
    ? 'Give extra weight to a tiny imaginative story and conversation.'
    : mode === 'learn'
      ? 'Give extra weight to early-language, counting, shapes, sorting or pattern play. Never test, score or diagnose.'
      : 'Give extra weight to physical, craft, movement and screen-free play using ordinary household materials.';

  const system = `You create preschool activity ideas for ADULTS to do together with children ages 4 to 6.
This is not a child chatbot. Speak to the adult, not directly to the child.
Return ONLY valid JSON with these fields: story, words, game, make, offline, adultTip, visualTitle, visualCaption, visualEmoji1, visualEmoji2, visualEmoji3, visualBg, sceneType, sceneMood, scenePalette, sceneTitle, sceneCaption, sceneObjectCount, sceneAccent.
Rules:
1. Greek language only.
2. Age appropriate, playful, simple, short and concrete.
3. The child should create, move, talk, notice, sort, count or imagine. Do not make screen time the activity.
4. Never ask for or repeat names, school, location, health, disability, photos, voice, contact details or any personal information.
5. Never diagnose, grade, rank, assess development, claim a learning disorder, or make educational placement decisions.
6. No fear, violence, sexual content, unsafe challenges, medicines, fire, sharp tools, small-object hazards, food allergy advice or unsupervised physical risks.
7. Do not describe the output as therapy or professional advice.
8. Adult supervision is assumed. Mention it in adultTip only where useful.
9. Use common, low-risk household materials. If scissors/glue could be involved, explicitly say adult handles or supervises them.
10. Keep each field under 70 Greek words.
11. Adapt difficulty and instructions to the supplied age, available time and setting.
12. Avoid dash punctuation in Greek output. Prefer short sentences and headings.
13. For visualTitle and visualCaption, create a short child friendly visual card concept matching the theme.
14. visualEmoji1, visualEmoji2 and visualEmoji3 must each contain one friendly emoji only.
15. visualBg must be exactly one of: sky, mint, peach, lilac.
16. Choose sceneType from dinosaur, robot, animals, space, castle, colors, shapes, numbers, generic according to the adult's theme, not the story details. Butterfly is animals, rocket is space, counting up to five is numbers. Unmatched themes are generic.
17. sceneMood is calm, playful or curious. scenePalette is sky, mint, peach or lilac. sceneAccent is coral, teal, gold or violet. sceneTitle and sceneCaption are brief Greek phrases for the adult's visual card. sceneObjectCount is an integer from 1 to 5, and is 5 for counting to five. These fields describe one cartoon scene, not animation frames. No unsafe content or real people.
18. Align the whole activity with the supplied official preschool curriculum context. Each proposed task should clearly practice at least one of those areas through play, conversation, observation, movement or creation. Do not invent official curriculum codes or claim that your wording is an official learning outcome.
Official Greek Preschool Curriculum context selected by the application:
${curriculum.map(x => '- ' + x.field + ' > ' + x.unit + ' > ' + x.subunit).join('\\n')}
${modeRule}`;

  const user = `General theme supplied by the adult: ${idea}. Child age: ${age}. Time available: ${duration} minutes. Setting: ${place}.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${groqKey}` },
      body: JSON.stringify({
        model,
        messages:[{role:'system',content:system},{role:'user',content:user}],
        temperature:0.25,
        reasoning_effort:'low',
        include_reasoning:false,
        max_completion_tokens:2200,
        response_format:{
          type:'json_schema',
          json_schema:{
            name:'preschool_activity',
            strict:true,
            schema:{
              type:'object',
              additionalProperties:false,
              properties:{
                story:{type:'string'},
                words:{type:'string'},
                game:{type:'string'},
                make:{type:'string'},
                offline:{type:'string'},
                adultTip:{type:'string'},
                visualTitle:{type:'string'},
                visualCaption:{type:'string'},
                visualEmoji1:{type:'string'},
                visualEmoji2:{type:'string'},
                visualEmoji3:{type:'string'},
                visualBg:{type:'string',enum:['sky','mint','peach','lilac']},
                sceneType:{type:'string',enum:['dinosaur','robot','animals','space','castle','colors','shapes','numbers','generic']},
                sceneMood:{type:'string',enum:['calm','playful','curious']},
                scenePalette:{type:'string',enum:['sky','mint','peach','lilac']},
                sceneTitle:{type:'string'},
                sceneCaption:{type:'string'},
                sceneObjectCount:{type:'integer',minimum:1,maximum:5},
                sceneAccent:{type:'string',enum:['coral','teal','gold','violet']}
              },
              required:['story','words','game','make','offline','adultTip','visualTitle','visualCaption','visualEmoji1','visualEmoji2','visualEmoji3','visualBg','sceneType','sceneMood','scenePalette','sceneTitle','sceneCaption','sceneObjectCount','sceneAccent']
            }
          }
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const raw = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status || 502).json({ error:'provider_error', message:'Η δραστηριότητα δεν μπόρεσε να δημιουργηθεί.' });
    const text = String(raw?.choices?.[0]?.message?.content || '').trim();
    const activity = parseActivity(text, idea);
    if (!activity) return res.status(502).json({ error:'invalid_result', message:'Το AI δεν επέστρεψε σωστή δραστηριότητα. Δοκίμασε ξανά.' });
    res.setHeader('Cache-Control','no-store');
    activity.curriculum = curriculum;
    return res.status(200).json({ activity, model, provider:'groq' });
  } catch (err) {
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({ error:'server_error', message:err?.name === 'AbortError' ? 'Η υπηρεσία άργησε να απαντήσει.' : 'Η δραστηριότητα δεν μπόρεσε να δημιουργηθεί.' });
  }
};

function looksLikePersonalData(s) {
  return /@|https?:\/\/|\b\d{7,}\b|\b(email|τηλέφων|κινητό|διεύθυν|σχολείο μου|ονομάζεται|λέγεται)\b/i.test(s);
}
function parseActivity(text, idea) {
  try {
    const j = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));
    const keys=['story','words','game','make','offline','adultTip','visualTitle','visualCaption','visualEmoji1','visualEmoji2','visualEmoji3','visualBg'];
    if (!keys.every(k => typeof j[k] === 'string' && j[k].trim())) return null;
    const activity = Object.fromEntries(keys.map(k => [k, clean(j[k])]));
    const types = ['dinosaur','robot','animals','space','castle','colors','shapes','numbers','generic'];
    const palettes = ['sky','mint','peach','lilac'];
    const accents = ['coral','teal','gold','violet'];
    const moods = ['calm','playful','curious'];
    const known = knownSceneType(idea);
    activity.sceneType = known || (types.includes(j.sceneType) ? j.sceneType : 'generic');
    activity.sceneMood = moods.includes(j.sceneMood) ? j.sceneMood : 'playful';
    activity.scenePalette = palettes.includes(j.scenePalette) ? j.scenePalette : 'sky';
    activity.sceneAccent = accents.includes(j.sceneAccent) ? j.sceneAccent : 'teal';
    activity.sceneTitle = clean(typeof j.sceneTitle === 'string' ? j.sceneTitle : activity.visualTitle).replace(/[—–]/g, ',').slice(0,80) || activity.visualTitle;
    activity.sceneCaption = clean(typeof j.sceneCaption === 'string' ? j.sceneCaption : activity.visualCaption).replace(/[—–]/g, ',').slice(0,180) || activity.visualCaption;
    activity.sceneObjectCount = activity.sceneType === 'numbers' && /(?:μέχρι\s*(?:το\s*)?5|1\s*(?:ως|έως|μεχρι|-)\s*5)/i.test(idea)
      ? 5 : Number.isInteger(j.sceneObjectCount) ? Math.max(1,Math.min(5,j.sceneObjectCount)) : 3;
    return activity;
  } catch { return null; }
}
function getCurriculumAlignment(idea, mode) {
  const type = knownSceneType(idea);
  const theme = String(idea).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const alignments = [];
  const add = (field, unit, subunit, activityGoal) => {
    const key = field + '|' + unit + '|' + subunit;
    if (!alignments.some(x => (x.field + '|' + x.unit + '|' + x.subunit) === key)) {
      alignments.push({ field, unit, subunit, activityGoal });
    }
  };

  if (type === 'numbers') {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Μαθηματικά', 'Αριθμοί-Πράξεις και Άλγεβρα', 'Παιχνίδι με ποσότητες, μέτρηση, αντιστοίχιση και απλά αριθμητικά μοτίβα.');
  } else if (type === 'shapes') {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Μαθηματικά', 'Γεωμετρία και μετρήσεις', 'Παρατήρηση, αναγνώριση, σύγκριση και σύνθεση σχημάτων μέσα από παιχνίδι.');
  } else if (type === 'animals' || type === 'dinosaur') {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Φυσικές Επιστήμες', 'Ζωντανοί Οργανισμοί', 'Παρατήρηση χαρακτηριστικών, ομοιοτήτων, διαφορών και σχέσεων των ζωντανών οργανισμών.');
  } else if (type === 'space') {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Φυσικές Επιστήμες', 'Γη-Πλανητικό Σύστημα και Διάστημα', 'Διερεύνηση και συζήτηση βασικών ιδεών για τη Γη, τον ουρανό και το διάστημα.');
  } else if (type === 'robot') {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Τεχνολογία Κατασκευών', 'Παραδοσιακά και Σύγχρονα Τεχνολογικά Εργαλεία/Εξοπλισμός και Συσκευές', 'Παρατήρηση της λειτουργίας τεχνολογικών αντικειμένων και δημιουργική επίλυση απλών προβλημάτων.');
  } else if (type === 'colors') {
    add('Δ. Παιδί, Σώμα, Δημιουργία και Έκφραση', 'Τέχνες', 'Εικαστικές Τέχνες', 'Πειραματισμός με χρώματα, υλικά, σχήματα και προσωπική εικαστική έκφραση.');
  } else if (type === 'castle') {
    add('Β. Παιδί, Εαυτός και Κοινωνία', 'Κοινωνικές Επιστήμες', 'Ιστορία και Πολιτισμός', 'Παρατήρηση στοιχείων του παρελθόντος και δημιουργική σύνδεσή τους με ιστορίες και πολιτισμικές αναφορές.');
  } else if (/θαλασσ|νερ|βροχ|καιρ|συννεφ|ηλιο|φως|σκια|μαγνητ|παγ|λιων|water|weather|rain/.test(theme)) {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Φυσικές Επιστήμες', 'Ύλη και Φαινόμενα', 'Παρατήρηση, ερωτήσεις, απλές συγκρίσεις και διερεύνηση φυσικών φαινομένων μέσα από ασφαλές παιχνίδι.');
  } else if (/φυτ|λουλουδ|δεντρ|σπορ|φυλλ|plant|flower|tree/.test(theme)) {
    add('Γ. Παιδί και Θετικές Επιστήμες', 'Φυσικές Επιστήμες', 'Ζωντανοί Οργανισμοί', 'Παρατήρηση χαρακτηριστικών, αναγκών και αλλαγών των ζωντανών οργανισμών.');
  } else if (/συναισθημ|χαρ|λυπ|θυμ|φοβ|φιλι|φιλο|οικογεν|μοιραζ|συνεργ|emotion|friend|family/.test(theme)) {
    add('Β. Παιδί, Εαυτός και Κοινωνία', 'Προσωπική και Κοινωνικοσυναισθηματική Ανάπτυξη', 'Συναισθηματική Επίγνωση και Διαπροσωπικές Σχέσεις', 'Αναγνώριση συναισθημάτων, έκφραση αναγκών, ακρόαση και συνεργασία μέσα από ασφαλές παιχνίδι ρόλων.');
  } else if (/μουσικ|ρυθμ|τραγουδ|ηχ|music|rhythm|sound/.test(theme)) {
    add('Δ. Παιδί, Σώμα, Δημιουργία και Έκφραση', 'Τέχνες', 'Μουσική', 'Ακρόαση, διάκριση ήχων, ρυθμικό παιχνίδι και δημιουργική μουσική έκφραση.');
  } else if (/χορο|κινησ|πηδ|τρεχ|dance|move|movement/.test(theme)) {
    add('Δ. Παιδί, Σώμα, Δημιουργία και Έκφραση', 'Κινητική Αγωγή', 'Σώμα και Κίνηση', 'Δημιουργική κίνηση, συντονισμός και επίγνωση του σώματος μέσα από παιχνίδι.');
  }

  if (mode === 'story' || alignments.length === 0) {
    add('Α. Παιδί και Επικοινωνία', 'Γλώσσα', 'Προφορική Επικοινωνία', 'Αφήγηση, περιγραφή, λεξιλόγιο, ερωτήσεις και αναδιήγηση μέσα από παιχνίδι.');
  }
  if (mode === 'offline') {
    add('Δ. Παιδί, Σώμα, Δημιουργία και Έκφραση', 'Κινητική Αγωγή', 'Σώμα και Κίνηση', 'Μάθηση με κίνηση, συντονισμό, μίμηση και ενεργή συμμετοχή χωρίς οθόνη.');
  }

  return alignments.slice(0, 3);
}

function knownSceneType(idea) {
  const theme = String(idea).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if (/δεινοσαυρ|dinosaur/.test(theme)) return 'dinosaur';
  if (/ρομποτ|robot/.test(theme)) return 'robot';
  if (/πεταλουδ|ζω[αο]|αρκουδ|γατ|σκυλ|πουλ|animal|butterfly/.test(theme)) return 'animals';
  if (/καστρ|πυργ|castle/.test(theme)) return 'castle';
  if (/διαστημ|πυραυλ|πλανητ|αστερ|(?:^|\s)αστρ|space|rocket/.test(theme)) return 'space';
  if (/χρωμα|color/.test(theme)) return 'colors';
  if (/σχημα|κυκλ|τριγων|τετραγων|shape/.test(theme)) return 'shapes';
  if (/αριθμ|μετρα|μετρη|count|number/.test(theme)) return 'numbers';
  return null;
}
function clean(s) {
  return String(s).replace(/<[^>]+>/g,'').replace(/\s{3,}/g,' ').trim().slice(0,1200);
}
