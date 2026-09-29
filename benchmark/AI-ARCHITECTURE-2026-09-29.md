# AI architecture decision — 2026-09-29

Status: **accepted for benchmarking; production changes remain gated by results**

## Production generation

- Student AI Study: official schoolbook grounding → safe official-content cache → Cloudflare Workers AI → Groq fallback.
- Smart routing remains off until the model benchmark passes the documented gates.
- Model choice is per task, not one model for everything.
- Quiz / true-false remain 120B-first until a dedicated interactive-turn validator exists.

## Untrusted input safety

Prompt Guard is **not** applied to server-constructed AI Study buttons using verified official-book text.

It is considered only for:
- free AI Help dialogue;
- student answers in interactive AI Study;
- custom/free-form topic fields;
- the seven helper text boxes;
- text extracted from uploaded PDF/Word/images/OCR.

Files are treated as untrusted input because prompt-injection instructions may be embedded inside documents.

Before production use, Prompt Guard 2 86M must pass the Greek/Greeklish benchmark, including long-text chunking. Safeguard 20B is evaluated separately for contextual child-safety cases. Neither is enabled merely because the provider advertises multilingual/safety support.

## Privacy and providers

- No raw child conversations, uploaded files, notes, or personal material are cached.
- Official public schoolbook content may be cached.
- Puter remains explicit opt-in under the site's existing age gate; never a hidden fallback.
- Gemini API is excluded from the current production architecture.
- Mistral direct, OpenRouter, Hugging Face, Duck.ai wrappers, Botpress and Rasa are not added now.
- If a new provider/safety service is enabled later, AI Transparency and Privacy Policy are updated the same day.

## Cost / abuse controls

Target: €0/month while usage remains inside free allocations.

Do not introduce an arbitrary daily user cap. Use AI_METRIC data first, then derive a rate limit from observed p95 legitimate usage plus margin. Production quota/error fallback remains provider-aware.
