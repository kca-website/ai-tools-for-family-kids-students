# Tool Nutrition Labels — scope

Roadmap item #3 is intentionally compact and non-invasive.

- Renders a collapsed `details` block inside existing tool cards.
- Uses only already-curated guide data: minimum age, current descriptions/notes, accessibility evidence and last-reviewed date.
- Cost, Greek-language and account indicators are conservative text-derived summaries. If the existing guide data does not support a field, the UI says that it has not yet been verified.
- The account indicator is explicitly not presented as a full privacy audit.
- No external API calls, cookies, accounts, analytics or paid services are added.
- No MutationObserver or polling is used; existing card changes are handled by lightweight event-delegated refreshes.
- Mobile smoke coverage is included before preview/production.
