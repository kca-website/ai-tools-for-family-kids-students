# Free-first AI resources — staged rollout (31 October 2026)

This branch is deliberately **not** a production activation. Vercel deployment for work/* is disabled in vercel.json. Existing Cloudflare → Groq → Gemini behavior stays the same until the owner changes environment settings.

## What changed

- The **adult teacher** \`internet_search\` workflow still requires explicit consent and a selected subject, grade and chapter. It now searches **Tavily basic → Brave Search**, returning actual HTTPS result URLs and labeled snippets. The pre-existing **Gemini Google Search grounding** remains a fallback if neither free service returns enough results, unless disabled by an environment switch. Search results are untrusted excerpts — **not verified schoolbook passages**. Student study grounding still uses approved ebooks.edu.gr sources, never general web results.
- The AI router now understands **Mistral EU, OpenRouter explicit :free models, and Vercel AI Gateway**. All are **off by default** and absent from the default provider order. Each requires an explicit enable flag, key and model allowlist. No random model choice or unsupported multimodal routing.
- AI Study's **Άκουσέ το / Listen** still prefers device speech synthesis. When the device lacks an appropriate Greek/English voice or fails before starting, it can try the optional **Azure Speech F0** REST endpoint. The endpoint remains off by default and refuses activation without owner confirmation that the SKU is specifically **F0**. It is deployed only in EU Azure Speech regions and never logs text/audio.
- The existing model/provider schoolbook requirements and Gemini behavior were not rewritten.

## Environment variables / order of setup

### 1. Tavily — first meaningful addition
Create a free account at https://tavily.com and a server-side API key. In Vercel → Project → Settings → Environment Variables set:

    TAVILY_API_KEY=<secret>

Use the free plan only; confirm its live monthly limits in the account before switching on. The implementation uses basic searches, 6 results, no generated answer and no raw-page extraction. Searches contain **only subject/grade/chapter/topic metadata**, never the student's uploaded document. Search engines can return inaccurate/excerpted information: the UI must not label it an official textbook.

### 2. Brave Search — optional search fallback
Set:

    BRAVE_SEARCH_API_KEY=<secret>

Brave may require a credit card for verification. Explicitly inspect billing settings and automatic credit purchases before enabling. If no key exists, Tavily failure simply continues to the existing Gemini web grounding. The local code does not buy credits.

For strict no-paid teacher web search **after Tavily/Brave is configured**:

    TEACHER_GEMINI_WEB_FALLBACK_ENABLED=false

With this set, exhausted free search returns an honest failure instead of silently spending on a Gemini grounded-search call.

### 3. Azure Speech — optional Greek narration
Create an **Azure Speech resource with F0 SKU**, in an EU region such as West Europe; verify F0 in the portal. **Do not create an S0 resource** to use this fallback. Add:

    AZURE_SPEECH_KEY=<secret>
    AZURE_SPEECH_REGION=westeurope
    AZURE_SPEECH_F0_CONFIRMED=true
    AZURE_SPEECH_ENABLED=true

The code deliberately requires both \`AZURE_SPEECH_F0_CONFIRMED\` and \`AZURE_SPEECH_ENABLED\` to be true. Without them, the endpoint responds 503 and browser speech continues unchanged. Greek default voice: \`el-GR-AthinaNeural\`; English default: \`en-US-JennyNeural\`. Each TTS request is capped at 6,000 characters; the client splits long lessons into up to six pieces and never silently truncates a chapter. Browser speech remains the first choice.

**Important:** same-origin filtering and per-request limits reduce accidental usage, but are not authentication or a global rate limit; F0 account quotas and server monitoring are still required. Never claim that a monthly cost ceiling is guaranteed by an app-local counter in Vercel serverless functions.

### 4. Mistral — synthetic benchmark ONLY until cleared
Before using real prompts, verify account-level free limits, training opt-out, EU endpoint and DPA/subprocessor terms. Suggested synthetic-only configuration:

    MISTRAL_API_KEY=<secret>
    MISTRAL_ALLOWED_MODELS=<exact model ID from your account>
    MISTRAL_MODEL=<same model ID>
    MISTRAL_ENABLED=true

**Do not** include \`mistral\` in public \`AI_PROVIDER_ORDER\` until independent Greek schoolbook benchmark and privacy review pass. Mistral Free does not provide the same zero-data-retention controls as a paid enterprise path.

### 5. OpenRouter — last-resort, exact allowlist
Account without funded credits is limited; routing to \`openrouter/free\` (random choice) is **not supported by this implementation**.

    OPENROUTER_API_KEY=<secret>
    OPENROUTER_FREE_MODELS=<fully qualified exact model ID ending in :free>
    OPENROUTER_MODEL=<same exact ID>
    OPENROUTER_ENABLED=true

Only select a model whose downstream processing policies and Greek educational quality have been reviewed. \`openrouter\` must not be enabled on child-facing public traffic before that review.

### 6. Vercel AI Gateway — optional small credit buffer, not a quota multiplier
Verify the account is still eligible for the recurring free credit, check the model's cost and ZDR/provider policy, disable automatic top-ups. Configure only if approved:

    AI_GATEWAY_API_KEY=<secret>
    AI_GATEWAY_ALLOWED_MODELS=<approved exact model ID>
    AI_GATEWAY_MODEL=<same ID>
    AI_GATEWAY_ENABLED=true

This only adds an optional routing target; it **does not** create extra free Groq or Cloudflare quota. A gateway request can consume the gateway's own model credit.

### 7. Task-aware provider order
The default **remains**:

    AI_PROVIDER_ORDER=cloudflare,groq,gemini

Only after each provider is approved, add enabled ones by order, for example:

    AI_PROVIDER_ORDER=cloudflare,groq,mistral,openrouter,gateway,gemini

This is an **example**, not a recommendation to activate all of them for children. Do not add unapproved providers to real student routes. The router uses the existing safety and grounding prompts; it does not turn an unsupported third-party answer into an official schoolbook response.

### 8. Gemini paid spend controls — NOT YET a hard €5 cap
The switch below **does enforce zero Gemini inference spend** from this router by removing Gemini from the eligible provider list:

    GEMINI_PAID_FALLBACK_ENABLED=false

Leaving it unspecified preserves the legacy paid Gemini fallback. **This PR does not implement a true global €5/month hard cap.** That requires a durable, atomic, account-wide budget ledger (not per-instance memory), conservative pre-authorization of cost and reconciliation with the provider's actual billing, including concurrency and retries. Google Cloud budget notifications alone are not a hard stop. Until this exists and passes tests, do **not** advertise an application-side €5 hard cap.

## Test and validation

Execute locally on the branch:

    node tests/free-ai-resources-smoke.cjs
    node tests/ai-provider-router-smoke.mjs
    node tests/audio-provider-fallback.cjs
    node tests/audio-lesson-latency-smoke.mjs

Perform manual end-to-end tests for: teacher consent and citations; Tavily 429 → Brave; both free search providers unavailable; browser with and without Greek TTS voice; Stop button during Azure playback; reading all chunks of a whole section; Azure F0 quota exhaustion; unsupported providers and absent keys; and user-visible fallback status.

No real provider API calls or billed tests are performed by the smoke test. Production deployment, API key creation, privacy-vendor approval and billing activation require a separate user action.
