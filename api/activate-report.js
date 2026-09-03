export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  // Temporary one-time activation helper. The destination address is never sent to the browser.
  const codes = [107, 107, 111, 117, 115, 116, 97, 115, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
  const recipient = codes.map((code) => String.fromCharCode(code)).join("");

  try {
    const payload = new URLSearchParams({
      _subject: "Ενεργοποίηση φόρμας αναφοράς aitools4kids.gr",
      _url: "https://www.aitools4kids.gr/report-error.html",
      message: "Ενεργοποίηση της φόρμας αναφοράς λάθους για το aitools4kids.gr."
    });

    const response = await fetch(`https://formsubmit.co/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "text/html",
        "Referer": "https://www.aitools4kids.gr/report-error.html"
      },
      body: payload.toString()
    });

    return res.status(response.ok ? 200 : 502).json({ ok: response.ok, status: response.status });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
}
