// Server-side Groq proxy for the teacher assistant.
module.exports = async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = 'openai/gpt-oss-120b';

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ configured: !!apiKey, model });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!apiKey) {
    return res.status(503).json({
      error: 'groq_not_configured',
      message: 'Groq is not configured on this deployment.'
    });
  }

  try {
    const { system, prompt } = req.body || {};
    if (!system || !prompt) {
      return res.status(400).json({ error: 'Missing prompt.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const terminologyGuard = `\n\nΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ ΑΚΡΙΒΕΙΑΣ:\n- Μην επινοείς ποτέ επιστημονικούς, βιολογικούς, χημικούς, ιατρικούς ή παιδαγωγικούς όρους.\n- Χρησιμοποίησε μόνο καθιερωμένη ελληνική σχολική ορολογία και διεθνώς αναγνωρισμένους όρους.\n- Αν δεν είσαι βέβαιος για έναν όρο, παράλειψέ τον ή γράψε απλά ότι χρειάζεται επιβεβαίωση· μην κατασκευάζεις λέξεις.\n- Για Βιολογία/Φυσικές Επιστήμες, προτίμησε τη βασική ορολογία του σχολικού βιβλίου.\n- Μην παρουσιάζεις ως πραγματικό ένζυμο, όργανο, ουσία ή διαδικασία κάτι που δεν είσαι βέβαιος ότι υπάρχει.\n- Όταν ο χρήστης έχει δώσει συγκεκριμένο κεφάλαιο/ενότητα, μείνε αυστηρά σε αυτό και μην προσθέτεις άσχετες έννοιες.\n- Το υλικό πρέπει να είναι κατάλληλο για την επιλεγμένη τάξη, όχι πανεπιστημιακού επιπέδου.`;
    const terminologyGuard = `\n\nΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ ΑΚΡΙΒΕΙΑΣ:\n- Μην επινοείς ποτέ επιστημονικούς, βιολογικούς, χημικούς, ιατρικούς ή παιδαγωγικούς όρους.\n- Χρησιμοποίησε μόνο καθιερωμένη ελληνική σχολική ορολογία και διεθνώς αναγνωρισμένους όρους.\n- Αν δεν είσαι βέβαιος για έναν όρο, παράλειψέ τον ή γράψε απλά ότι χρειάζεται επιβεβαίωση· μην κατασκευάζεις λέξεις.\n- Για Βιολογία/Φυσικές Επιστήμες, προτίμησε τη βασική ορολογία του σχολικού βιβλίου.\n- Μην παρουσιάζεις ως πραγματικό ένζυμο, όργανο, ουσία ή διαδικασία κάτι που δεν είσαι βέβαιος ότι υπάρχει.\n- Στη Χημεία μην μεταφράζεις τις διεθνείς μονάδες ή σύμβολα: γράφε mol/L, g/L, % w/v ή % m/V, όχι ελληνικοποιημένες μορφές όπως «μολ/Λ» ή «μπολ/Λ».\n- Όταν ο χρήστης έχει δώσει συγκεκριμένο κεφάλαιο/ενότητα, μείνε αυστηρά σε αυτό και μην προσθέτεις άσχετες έννοιες.\n- Το υλικό πρέπει να είναι κατάλληλο για την επιλεγμένη τάξη, όχι πανεπιστημιακού επιπέδου.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system + terminologyGuard },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_completion_tokens: 2200
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data?.error?.message || 'Groq request failed.';
      return res.status(response.status).json({ error: 'groq_error', message: providerMessage });
    }

    const text = sanitizeTeacherAssistantOutput(data?.choices?.[0]?.message?.content || '');
    if (!text) return res.status(502).json({ error: 'empty_result', message: 'No result returned.' });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ text, model });
  } catch (err) {
    const timedOut = err?.name === 'AbortError';
    return res.status(timedOut ? 504 : 500).json({
      error: timedOut ? 'timeout' : 'server_error',
      message: timedOut ? 'The AI service took too long to respond.' : 'Could not generate a result.'
    });
  }
};

function sanitizeTeacherAssistantOutput(text) {
  return String(text || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|section|article|ul|ol|li|table|thead|tbody|tr|td|th)>/gi, '\n')
    .replace(/<\/?(?:p|div|span|strong|b|em|i|section|article|ul|ol|li|table|thead|tbody|tr|td|th)[^>]*>/gi, '')
    .replace(/\bμπολ\s*\/\s*Λ\b/gi, 'mol/L')
    .replace(/\bμολ\s*\/\s*Λ\b/gi, 'mol/L')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
