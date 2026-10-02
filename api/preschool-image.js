function browserRequestAllowed(req) {
  const headers = req?.headers || {};
  const fetchSite = String(headers['sec-fetch-site'] || headers['Sec-Fetch-Site'] || '').toLowerCase();
  if (fetchSite === 'cross-site') return false;

  const origin = String(headers.origin || headers.Origin || '').trim();
  if (!origin) return true;

  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' && host !== 'localhost' && host !== '127.0.0.1') return false;
    if (host === 'www.aitools4kids.gr' || host === 'aitools4kids.gr') return true;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    return /^aitools4kids(?:-[a-z0-9-]+)*-kcawebsite\.vercel\.app$/.test(host);
  } catch (_) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  const model = '@cf/black-forest-labs/flux-1-schnell';

  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json({ configured: !!(accountId && token), model });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  if (!browserRequestAllowed(req)) {
    return res.status(403).json({ error: 'cross_site_request_blocked', message: 'Cross-site requests are not allowed.' });
  }
  const contentType = String(req.headers?.['content-type'] || req.headers?.['Content-Type'] || '').toLowerCase();
  if (contentType && !contentType.includes('application/json')) {
    return res.status(415).json({ error: 'unsupported_media_type', message: 'Use application/json.' });
  }


  if (!accountId || !token) {
    return res.status(503).json({ error: 'not_configured', message: 'Η δημιουργία εικόνας δεν είναι προσωρινά διαθέσιμη.' });
  }

  const idea = String(req.body?.idea || '').trim();
  const age = String(req.body?.age || '5');
  const mode = String(req.body?.mode || 'story');

  if (!idea || idea.length > 100) {
    return res.status(400).json({ error: 'invalid_idea', message: 'Χρησιμοποίησε ένα σύντομο γενικό θέμα έως 100 χαρακτήρες.' });
  }
  if (!['4', '5', '6'].includes(age)) {
    return res.status(400).json({ error: 'invalid_age', message: 'Μη έγκυρη ηλικία.' });
  }
  if (!['story', 'learn', 'offline'].includes(mode)) {
    return res.status(400).json({ error: 'invalid_mode', message: 'Μη έγκυρος τύπος δραστηριότητας.' });
  }
  if (looksLikePersonalData(idea)) {
    return res.status(400).json({ error: 'personal_data', message: 'Χρησιμοποίησε μόνο γενικό θέμα, χωρίς προσωπικά στοιχεία παιδιού.' });
  }

  const cleanIdea = idea.replace(/[<>\\{}\[\]]/g, ' ').replace(/\s+/g, ' ').slice(0, 100);
  // The image model only understands English, so the picture must be driven by an
  // English subject that names exactly what the adult asked for. Priority:
  // 1) the activity model's imageSubjectEn, 2) a curated dictionary of common
  // preschool themes, 3) machine translation of the Greek idea.
  const subjectEn = String(req.body?.subjectEn || '').replace(/\s+/g, ' ').trim();
  const englishSubject = /^[A-Za-z][A-Za-z ,'-]{2,119}$/.test(subjectEn) ? subjectEn : '';
  const builtIn = pictureSubject(cleanIdea);
  const subject = englishSubject
    || knownPictureSubject(cleanIdea)
    || (builtIn !== GENERIC_SUBJECT ? builtIn : '')
    || await translatedSubject(cleanIdea, accountId, token)
    || GENERIC_SUBJECT;
  const modeHint = mode === 'story'
    ? 'storybook scene'
    : mode === 'learn'
      ? 'playful early learning scene with simple shapes and objects'
      : 'screen-free play and craft inspired scene';

  const prompt = [
    `The picture shows exactly this: ${subject}.`,
    'This subject must be clearly recognizable, large and in the center. Do not replace it with a different animal, character or object.',
    `Style: ${modeHint}.`,
    `A charming picture-book illustration suitable for age ${age}.`,
    'Only the named non-human subject and a simple setting. No humans, no children, no families, no portraits.',
    'Pastel colors, simple rounded shapes, warm light, clean composition, one clear focal subject.',
    'Safe and calm for ages 4 to 6. No violence, fear, weapons, medicine, fire, sharp tools or dangerous situations.',
    'No letters, no words, no writing, no symbols or characters of any alphabet, no logos, no watermark, no UI, no photorealism.',
    'Square educational illustration, polished children\'s book style.'
  ].join(' ');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          steps: 4
        }),
        signal: controller.signal
      }
    );
    clearTimeout(timeout);

    const body = await response.json().catch(() => ({}));
    if (!response.ok || body?.success === false) {
      console.error('Cloudflare Workers AI error', JSON.stringify({
        status: response.status,
        errors: body?.errors || body?.error || null
      }));
      return res.status(response.status || 502).json({
        error: 'provider_error',
        message: 'Η εικόνα δεν μπόρεσε να δημιουργηθεί αυτή τη στιγμή.'
      });
    }

    const image = body?.result?.image || body?.image;
    if (!image || typeof image !== 'string') {
      return res.status(502).json({ error: 'invalid_image', message: 'Η υπηρεσία δεν επέστρεψε έγκυρη εικόνα.' });
    }

    return res.status(200).json({
      dataURI: `data:image/jpeg;base64,${image}`,
      model
    });
  } catch (err) {
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({
      error: 'server_error',
      message: err?.name === 'AbortError'
        ? 'Η δημιουργία εικόνας άργησε να απαντήσει. Δοκίμασε ξανά.'
        : 'Η εικόνα δεν μπόρεσε να δημιουργηθεί.'
    });
  }
};

function looksLikePersonalData(s) {
  const value = String(s || '').normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase();
  return /@|https?:\/\/|\d{7,}|(?:^|[^\p{L}\p{N}_])(?:email|τηλεφων\p{L}*|κινητ(?:ο|ου|α|ων)|διευθυνσ\p{L}*|σχολειο μου|ονομαζεται|λεγεται)(?=$|[^\p{L}\p{N}_])/iu.test(value);
}

const GENERIC_SUBJECT = 'one friendly cartoon object inspired by the theme, with no humans';

const SUBJECT_DICTIONARY = [
  [/ανεμοστροβιλ|σιφουν|τυφων|\btornado(?:s|es)?\b|\bwhirlwind(?:s|es)?\b/, 'a cute cartoon tornado: one clearly visible soft white funnel-shaped whirlwind, a spinning cone of wind touching the grass, with a few colorful leaves twirling around it, in a calm sunny meadow, friendly and not scary, nothing broken'],
  [/ανεμ|αερα(?:κι)?(?:\s|$)|\bwind(?:s|es)?\b/, 'soft swirling wind lines blowing colorful leaves and a little kite over a meadow'],
  [/καταιγιδ|μπορ|\bstorm(?:s|es)?\b/, 'a soft gray cloud with gentle raindrops and a small rainbow, calm and friendly'],
  [/βροχ|\brain(?:s|es)?\b/, 'a smiling rain cloud with gentle raindrops falling on flowers and puddles'],
  [/χιον|\bsnow(?:s|es)?\b/, 'a friendly snowman in a soft snowy garden with falling snowflakes'],
  [/ηλι(?:ος|ου|ο)|\bsun(?:s|es)?\b/, 'a smiling cartoon sun shining over green hills'],
  [/ουρανιο τοξο|\brainbow(?:s|es)?\b/, 'a bright rainbow over soft clouds and green hills'],
  [/συννεφ|\bcloud(?:s|es)?\b/, 'fluffy smiling clouds in a blue sky'],
  [/καιρ|\bweather(?:s|es)?\b/, 'a cartoon sun peeking from behind a soft rain cloud with a small rainbow'],
  [/φθινοπωρ|\bautumn(?:s|es)?\b/, 'colorful autumn leaves falling from a tree'],
  [/ανοιξ|\bspring(?:s|es)?\b/, 'blooming spring flowers with a butterfly in a meadow'],
  [/καλοκαιρ|\bsummer(?:s|es)?\b/, 'a sunny beach with a sandcastle and a beach ball'],
  [/χειμων|\bwinter(?:s|es)?\b/, 'a snowy winter landscape with pine trees and a snowman'],
  [/σκυλ|σκυλακ|κουταβ|\bdog(?:s|es)?\b|\bpuppy(?:s|es)?\b/, 'one friendly cartoon puppy dog with floppy ears'],
  [/γατ|γατακ|\bcat(?:s|es)?\b|\bkitten(?:s|es)?\b/, 'one friendly cartoon kitten'],
  [/πουλ|πουλακ|\bbird(?:s|es)?\b/, 'one small friendly cartoon bird on a branch'],
  [/ψαρ|\bfish(?:s|es)?\b/, 'one colorful friendly cartoon fish in clear water'],
  [/αλογ|\bhorse(?:s|es)?\b/, 'one friendly cartoon horse in a meadow'],
  [/αγελαδ|\bcow(?:s|es)?\b/, 'one friendly cartoon cow in a green field'],
  [/προβατ|\bsheep(?:s|es)?\b/, 'one fluffy friendly cartoon sheep'],
  [/κοτ(?:α|ουλ)|\bchicken(?:s|es)?\b/, 'one friendly cartoon hen with little chicks'],
  [/παπ(?:ι|ακι|ια)|\bduck(?:s|es)?\b/, 'one friendly cartoon duckling on a pond'],
  [/κουνελ|\brabbit(?:s|es)?\b|\bbunny(?:s|es)?\b/, 'one friendly cartoon bunny rabbit'],
  [/αρκουδ|\bbear(?:s|es)?\b/, 'one friendly cartoon teddy-like bear'],
  [/ελεφαντ|\belephant(?:s|es)?\b/, 'one friendly cartoon baby elephant'],
  [/λιονταρ|\blion(?:s|es)?\b/, 'one friendly cartoon lion cub'],
  [/καμηλοπαρδαλ|\bgiraffe(?:s|es)?\b/, 'one friendly cartoon giraffe'],
  [/μαιμου|πιθηκ|\bmonkey(?:s|es)?\b/, 'one friendly cartoon monkey'],
  [/χελων|\bturtle(?:s|es)?\b/, 'one friendly cartoon turtle'],
  [/βατραχ|\bfrog(?:s|es)?\b/, 'one friendly cartoon frog on a lily pad'],
  [/μελισσ|\bbee(?:s|es)?\b/, 'one friendly cartoon bee near flowers'],
  [/πιγκουιν|\bpenguin(?:s|es)?\b/, 'one friendly cartoon penguin on ice'],
  [/δελφιν|\bdolphin(?:s|es)?\b/, 'one friendly cartoon dolphin jumping over waves'],
  [/φαλαιν|\bwhale(?:s|es)?\b/, 'one friendly cartoon whale in the sea'],
  [/χταποδ|\boctopus(?:s|es)?\b/, 'one friendly cartoon octopus'],
  [/σαλιγκαρ|\bsnail(?:s|es)?\b/, 'one friendly cartoon snail'],
  [/μυρμηγκ|\bant(?:s|es)?\b/, 'one friendly cartoon ant carrying a leaf'],
  [/κουκουβαγι|\bowl(?:s|es)?\b/, 'one friendly cartoon owl on a branch'],
  [/αλεπου|\bfox(?:s|es)?\b/, 'one friendly cartoon fox'],
  [/σκαντζοχοιρ|\bhedgehog(?:s|es)?\b/, 'one friendly cartoon hedgehog'],
  [/τρεν|\btrain(?:s|es)?\b/, 'one colorful toy train'],
  [/αυτοκινητ|αμαξ|\bcar(?:s|es)?\b/, 'one colorful friendly toy car'],
  [/λεωφορει|\bbus(?:s|es)?\b/, 'one friendly yellow cartoon bus'],
  [/αεροπλαν|\bairplane(?:s|es)?\b|\bplane(?:s|es)?\b/, 'one friendly cartoon airplane in the sky'],
  [/καραβ|πλοι|βαρκ|\bboat(?:s|es)?\b|\bship(?:s|es)?\b/, 'one friendly cartoon sailing boat on calm water'],
  [/ποδηλατ|\bbicycle(?:s|es)?\b|\bbike(?:s|es)?\b/, 'one colorful bicycle'],
  [/θαλασσ|\bsea(?:s|es)?\b|\bbeach(?:s|es)?\b/, 'a calm sea with gentle waves, shells and sand'],
  [/βουν|\bmountain(?:s|es)?\b/, 'gentle green mountains under a blue sky'],
  [/δασ(?:ος|ους|η)|\bforest(?:s|es)?\b/, 'a friendly green forest with round trees'],
  [/δεντρ|\btree(?:s|es)?\b/, 'one big friendly tree with green leaves'],
  [/λουλουδ|\bflower(?:s|es)?\b/, 'colorful flowers in a garden'],
  [/φυτ|σπορ|\bplant(?:s|es)?\b|\bseed(?:s|es)?\b/, 'a small green sprout growing from soil in a flower pot'],
  [/φρουτ|μηλ|πορτοκαλ|μπαναν|\bfruit(?:s|es)?\b/, 'a bowl of colorful fruits: apple, orange and banana'],
  [/λαχανικ|\bvegetable(?:s|es)?\b/, 'colorful vegetables: carrot, tomato and cucumber'],
  [/μουσικ|ρυθμ|τραγουδ|\bmusic(?:s|es)?\b|\brhythm(?:s|es)?\b/, 'colorful toy musical instruments: a small drum, a xylophone and maracas'],
  [/συναισθημ|χαρ(?:α|ουμεν)|λυπ|θυμ|φοβ|\bemotion(?:s|es)?\b|\bfeeling(?:s|es)?\b/, 'four round cartoon faces like soft emoji showing happy, sad, surprised and calm'],
  [/φεγγαρ|σεληνη|\bmoon(?:s|es)?\b/, 'a smiling crescent moon among soft stars'],
  [/αστερ|\bstar(?:s|es)?\b/, 'bright friendly stars in a night sky'],
  [/μπαλον|\bballoon(?:s|es)?\b/, 'colorful balloons floating in the sky'],
  [/μπαλ|\bball(?:s|es)?\b/, 'colorful bouncing balls'],
  [/βιβλι|\bbook(?:s|es)?\b/, 'an open colorful picture book'],
  [/σπιτ|\bhouse(?:s|es)?\b|\bhome(?:s|es)?\b/, 'a cozy cartoon house with a garden'],
  [/χριστουγενν|\bchristmas(?:s|es)?\b/, 'a decorated Christmas tree with presents'],
  [/πασχα|\beaster(?:s|es)?\b/, 'colorful decorated eggs in a basket'],
  [/γενεθλι|\bbirthday(?:s|es)?\b/, 'a birthday cake with balloons'],
];

function knownPictureSubject(idea) {
  const theme = idea.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  for (const [pattern, subject] of SUBJECT_DICTIONARY) {
    if (pattern.test(theme)) return subject;
  }
  return '';
}

async function translatedSubject(idea, accountId, token) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/@cf/meta/m2m100-1.2b`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: idea, source_lang: 'el', target_lang: 'en' }),
        signal: controller.signal
      }
    );
    clearTimeout(timeout);
    const body = await response.json().catch(() => ({}));
    const text = String(body?.result?.translated_text || '').replace(/[^A-Za-z ,'-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!response.ok || text.length < 2) return '';
    return `one friendly cartoon picture of ${text.slice(0, 80)}`;
  } catch (_) {
    return '';
  }
}

function pictureSubject(idea) {
  const theme = idea.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/δεινοσαυρ|dinosaur/.test(theme)) return 'one friendly round green cartoon dinosaur alone among soft plants';
  if (/ρομποτ|robot/.test(theme)) return 'one friendly rounded toy robot alone';
  if (/πεταλουδ|butterfly/.test(theme)) return 'one colorful butterfly above simple flowers';
  if (/πυραυλ|rocket/.test(theme)) return 'one friendly toy rocket among pastel planets and stars, without fire';
  if (/διαστημ|πλανητ|space/.test(theme)) return 'one pastel planet and a friendly toy spaceship among stars';
  if (/καστρ|castle/.test(theme)) return 'one pastel storybook castle with flags and clouds';
  if (/χρωμα|color/.test(theme)) return 'a group of large colorful balls arranged in a cheerful pattern';
  if (/σχημα|shape/.test(theme)) return 'large colorful circles, squares and triangles in a simple pattern';
  if (/αριθμ|number|count/.test(theme)) return 'five large colorful toy blocks arranged for counting, without written numerals';
  if (/ζω[αο]|animal/.test(theme)) return 'one friendly cartoon animal in a calm garden';
  return GENERIC_SUBJECT;
}

module.exports._phase9Test = { looksLikePersonalData, knownPictureSubject };
