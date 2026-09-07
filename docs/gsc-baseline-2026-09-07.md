# Google Search Console baseline — 7 September 2026

Property: `sc-domain:aitools4kids.gr`

Settled Search Console data through: **5 September 2026**.

## Aggregate baseline

For 8 August–5 September 2026, the Search Console API returned:

- Clicks: **2**
- Impressions: **8**
- CTR: **25%**
- Average position: **4.75**

This dataset is extremely small, so percentages and average position are not yet stable enough to use as SEO targets.

## Query availability

The query-dimension report returned **0 query rows** for the same period. Search Console can withhold low-volume queries, so we do not currently have enough query-level evidence to choose 5–10 SEO landing pages without guessing.

## Page signals currently visible

The page-dimension report surfaced these URLs with at least one impression:

- `/` — 4 impressions, 2 clicks, avg position 3
- `/primary/guardian/tools` — 3 impressions, 1 click, avg position 2.67
- `/high/guardian/guide` — 1 impression, 0 clicks, avg position 8
- `/high/student/tutor` — 2 impressions, 0 clicks, avg position 2.5
- `/privacy-policy.html` — 2 impressions, 0 clicks, avg position 6.5
- `/tools/gemini.html` — 2 impressions, 0 clicks, avg position 8

Page rows can differ from aggregate totals because of Search Console privacy/aggregation behavior. Treat them as directional signals, not additive totals.

## Sitemap and indexing snapshot

The current sitemap contains **61 URLs**. The sitemap report currently shows 61 submitted and 0 indexed, but URL Inspection gives a more useful current sample and confirms that this sitemap-level count is not a reliable picture of actual indexing yet.

A 15-URL inspection sample on 7 September 2026 found:

- **13 URLs: Submitted and indexed**
- **2 URLs: URL unknown to Google**

Indexed examples include the homepage, methodology, primary tools, high-school guide/tutor and multiple tool pages (Gemini, ChatGPT, Copilot, NotebookLM, PhET, Canva, Desmos). All indexed sample URLs were crawlable, fetched successfully and indexing was allowed.

The two URLs currently unknown to Google are:

- `/accessibility.html`
- `/middle/student/tools`

Both were added to the GSC Wizard indexing tracker for follow-up. Their current absence from the index does not justify a structural site change by itself because the site is new and the broader inspection sample is healthy.

## Privacy-policy review

The current privacy policy already describes the optional Puter boundary, text/audio transfer, local-vs-third-party storage distinction, Vercel Analytics, age rules and the fact that age/parental-consent declarations are not technically verified. No corrective content change was justified by this review, so the policy was not rewritten merely for the sake of changing it.

## Decision for roadmap item #6

Do **not** create 5–10 GSC-led landing pages yet. There is not enough query-level evidence. Reassess once Search Console exposes a meaningful set of non-brand queries/impressions; until then, keep technical SEO accurate and avoid speculative page creation.
