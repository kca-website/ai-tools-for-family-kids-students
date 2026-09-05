# Tutor consolidation audit — 2026-09-05

## Production source of truth
- Vercel project: `aitools4kids`
- GitHub repo: `kca-website/ai-tools-for-family-kids-students`
- Production branch: `main`
- Verified production commit: `ccaebb44c2887dca635b7aa63d4f0e7a4f680a5b`
- Production and GitHub `main` are aligned.

## Dynamic loader chain
`index.html` loads core files and `site-postfix.js`; `site-postfix.js` loads `pwa.js`; `pwa.js` then loads the September data patches plus the tutor extension files, `pwa-core.js` and `report-link.js`.

## Verified tutor public API
`tutor.js` exposes `window.AITutor = { render }`.

## Production wrapper chain before this branch
```text
window.AITutor.render (tutor.js)
  -> tutor-flashcards.js       : installPanel()
  -> tutor-study-tools.js      : installPanel()
  -> tutor-tools-layout.js     : moveToolsBelowChat()
  -> tutor-mobile-compact.js   : installMobileCompact()
  -> tutor-mobile-label-fix.js : schedule() -> applyLabel()
```

The order was behaviorally significant because every extension captured the previously exposed `window.AITutor.render` as `original` and reassigned the public method.

## Scope correction
Duplicate helper names such as `installPanel`, `tr`, `extractText` and `injectStyles` are not global today: the extension files use IIFEs. They would collide only if naively merged into one scope, so consolidated code must use semantic names.

## Current branch state
- `tutor-flashcards.js`, `tutor-study-tools.js`, `tutor-mobile-compact.js` and `tutor-mobile-label-fix.js` no longer reassign `window.AITutor.render`.
- They subscribe to the shared `aitools4kids:tutor-rendered` lifecycle event.
- `tutor-render-host.js` is the only remaining transitional render wrapper.
- The old standalone `tutor-tools-layout.js` has been removed.
- Its exact ordering behavior now lives in `tutor-render-host.js` and is registered before Mobile Compact, preserving the effective production order:
  `Flashcards -> Study Tools -> layout -> Mobile Compact -> mobile label`.
- `pwa.js` now lists runtime dependencies explicitly and deduplicates them.

## Mobile parity protection
The current branch intentionally keeps the original runtime `injectStyles()` behavior active for Flashcards, Study Tools and Mobile Compact.

`tutor-extensions.css` contains the extracted CSS as preparation for the later cleanup, but it is **not loaded as the authoritative stylesheet yet**. This avoids introducing an asynchronous stylesheet timing/FOUC change on phones during the behavior-preserving phase.

The actual Mobile Compact layout rules, selectors, breakpoints and DOM-building logic are otherwise unchanged. The only functional change in `tutor-mobile-compact.js` is replacing its `AITutor.render` wrapper with a listener for the shared render lifecycle event.

The final mobile wording helper also remains separate for now so `Αλλαγή επιλογών / Change selections` keeps the same post-render timing as production.

### Mobile guardrails for this sprint
- do not change the `700px` Mobile Compact breakpoint
- do not change the existing mobile selectors or DOM structure while lifecycle cleanup is in progress
- do not activate `tutor-extensions.css` as the only style source until it is loaded from the canonical page stylesheet path
- keep mobile label timing/copy unchanged until preview parity is confirmed
- no mobile redesign is part of this refactor

## Side effects retained
### tutor-flashcards.js
- injects its existing style block
- inserts `.tutor-flashcards`
- binds flashcard UI events
- binds changes on grade/subject/topic/age/consent
- reads/writes localStorage cache
- calls Puter AI only for new generation
- subscribes to shared tutor-render event

### tutor-study-tools.js
- injects its existing style block
- inserts `.tutor-study-tools`
- binds quiz/presentation UI events
- binds changes on grade/subject/topic/age/consent
- reads/writes localStorage cache
- calls Puter AI only for new generation
- subscribes to shared tutor-render event

### tutor-render-host.js
- only remaining reassignment of `window.AITutor.render`
- emits the shared render lifecycle event
- owns the established Flashcards -> Study Tools ordering below the chat composer
- no AI calls, polling or MutationObserver

### tutor-mobile-compact.js
- retains the existing mobile-only CSS injection and DOM behavior
- builds/updates mobile tutor helpers
- binds tutor fields, navigation, route and media-query events
- subscribes to the shared render lifecycle event

### tutor-mobile-label-fix.js
- only adjusts the mobile lesson-selection label
- listens to relevant clicks/changes
- schedules label refresh with `setTimeout(..., 0)`
- subscribes to the shared render lifecycle event

## Target architecture
### tutor.js
- sole owner of tutor render lifecycle
- sole writer of `window.AITutor.render`
- explicit feature call order or one documented lifecycle mechanism

### tutor-features.js
- flashcards behavior
- study-tools behavior
- unique helper names
- no reassignment of `window.AITutor.render`

### styles.css
- flashcards styles
- study-tools styles
- mobile tutor layout
- no JS style injection for purely presentational CSS

## Migration sequence
1. Work only on dedicated branch/preview.
2. Remove the independent render-wrapper chain while preserving output and timing. **In progress; independent wrappers removed.**
3. Remove standalone layout patch. **Done.**
4. Keep production mobile CSS behavior until parity is confirmed. **Done intentionally.**
5. Fold lifecycle emission into canonical `tutor.js` and remove `tutor-render-host.js`.
6. Fold mobile label logic into canonical mobile tutor logic only after mobile parity is confirmed.
7. Move extracted presentation CSS into the canonical stylesheet with early page loading, then remove legacy `injectStyles()` bodies.
8. Simplify `pwa.js` so it stops acting as an application patch loader.
9. Later, code-split the heavy data files by zone and load on demand.

## Do not change in this pass
- age/parental-consent rules
- Puter connection behavior
- model selection
- generation prompts
- localStorage keys/cache formats
- diagnostic scoring/GAP_TAGS/learning-path semantics
- mobile layout/copy beyond parity-preserving lifecycle wiring
- desktop UX except where required for parity

## Preview verification so far
- branch preview deployment for commit `f7b2e890271502ed66a5d45d24c66692ad516b8d` reached `READY`
- Vercel build completed without build errors
- no production deployment or merge has been made

## Preview smoke test still required before merge
- 3 zones × 2 roles on desktop and mobile
- EL -> EN -> EL
- tutor route/open/close/navigation
- flashcards generate/cache/regenerate
- study quiz generate/answer/cache
- presentation generate/navigate/copy
- lesson selectors update all study tools
- age/consent gates unchanged
- Diagnostic Compass unchanged
- zone switch after tutor use
- refresh on tutor route
- no console errors
- no 404s

## Rule after consolidation
No new file may independently reassign `window.AITutor.render`. Any future tutor feature must be invoked explicitly by tutor core or through one documented lifecycle mechanism owned by tutor core.