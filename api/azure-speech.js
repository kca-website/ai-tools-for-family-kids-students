'use strict';
// Optional Azure Speech F0 fallback. Disabled until the owner verifies that the resource SKU is F0.
// This endpoint is same-origin and intentionally never logs supplied text or generated audio.
const EU_REGIONS = new Set(['westeurope', 'northeurope', 'francecentral', 'germanywestcentral', 'swedencentral', 'italynorth']);
const MAX_CHARS = 6000;
const cleanXml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const on = v => /^(true|1|on)$/i.test(String(v || '').trim());

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (!on(process.env.AZURE_SPEECH_ENABLED) || !on(process.env.AZURE_SPEECH_F0_CONFIRMED)) {
    return res.status(503).json({ error: 'speech_not_configured' });
  }
  const region = String(process.env.AZURE_SPEECH_REGION || '').toLowerCase().trim();
  if (!process.env.AZURE_SPEECH_KEY || !EU_REGIONS.has(region)) {
    return res.status(503).json({ error: 'speech_not_configured' });
  }
  // Browser requests must come from this deployment, not arbitrary third-party pages.
  const origin = String(req.headers.origin || '');
  const host = String(req.headers.host || '').toLowerCase();
  try {
    const target = new URL(origin);
    if (target.protocol !== 'https:' && !(target.protocol === 'http:' && /^localhost(?::\d+)?$/.test(host))) {
      return res.status(403).json({ error: 'origin_rejected' });
    }
    if (target.host.toLowerCase() !== host) return res.status(403).json({ error: 'origin_rejected' });
  } catch { return res.status(403).json({ error: 'origin_rejected' }); }
  const language = req.body?.language === 'en' ? 'en' : 'el';
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (text.length < 30 || text.length > MAX_CHARS) {
    return res.status(413).json({ error: 'speech_text_size', maxChars: MAX_CHARS });
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) return res.status(422).json({ error: 'invalid_text' });
  const voice = language === 'en' ? 'en-US-JennyNeural' : 'el-GR-AthinaNeural';
  const locale = language === 'en' ? 'en-US' : 'el-GR';
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' +
    locale + '"><voice name="' + voice + '">' + cleanXml(text) + '</voice></speak>';
  try {
    const signal = AbortSignal.timeout(18000);
    const response = await fetch('https://' + region + '.tts.speech.microsoft.com/cognitiveservices/v1', {
      method: 'POST', signal,
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        'User-Agent': 'AITools4Kids-FreeSpeechFallback',
      },
      body: ssml,
    });
    if (!response.ok) {
      // Never log the provider response: it could include request information.
      return res.status(response.status === 429 ? 429 : 502).json({ error: 'speech_provider_unavailable' });
    }
    const binary = Buffer.from(await response.arrayBuffer());
    if (!binary.length || binary.length > 2_000_000) {
      return res.status(502).json({ error: 'invalid_speech_audio' });
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', String(binary.length));
    return res.status(200).end(binary);
  } catch {
    return res.status(504).json({ error: 'speech_timeout' });
  }
};
module.exports.config = { maxDuration: 30 };
