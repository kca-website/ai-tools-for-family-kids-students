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

## Verified render wrapper chain
```text
window.AITutor.render (tutor.js)
  -> tutor-flashcards.js       : installPanel()
  -> tutor-study-tools.js      : installPanel()
  -> tutor-tools-layout.js     : moveToolsBelowChat()
  -> tutor-mobile-compact.js   : installMobileCompact()
  -> tutor-mobile-label-fix.js : schedule() -> applyLabel()
```

The order is behaviorally significant because every extension captures the previously exposed `window.AITutor.render` as `original` and reassigns the public method.

## Scope correction
Duplicate helper names such as `installPanel`, `tr`, `extractText` and `injectStyles` are not global today: the extension files use IIFEs. They would collide only if naively merged into one scope, so the consolidated code must use semantic names such as `installFlashcardsPanel`, `installStudyToolsPanel`, `installMobileTutorUi`, `applyMobileSelectionLabel` and `extractPuterText`.

## Side effects
### tutor-flashcards.js
- injects its own style block
- inserts `.tutor-flashcards`
- binds flashcard UI events
- binds changes on grade/subject/topic/age/consent
- reads/writes localStorage cache
- calls Puter AI only for new generation
- wraps `window.AITutor.render`

### tutor-study-tools.js
- injects its own style block
- inserts `.tutor-study-tools`
- binds quiz/presentation UI events
- binds changes on grade/subject/topic/age/consent
- reads/writes localStorage cache
- calls Puter AI only for new generation
- wraps `window.AITutor.render`

### tutor-tools-layout.js
- no AI calls, observer or polling
- moves Flashcards then Study Tools to the end of `.tutor-chat`
- wraps `window.AITutor.render`

### tutor-mobile-compact.js
- injects a large mobile-only style block
- builds/updates mobile tutor helpers
- binds tutor fields, navigation, route and media-query events
- wraps `window.AITutor.render`

### tutor-mobile-label-fix.js
- only adjusts the mobile lesson-selection label
- listens to relevant clicks/changes
- schedules label refresh with `setTimeout(..., 0)`
- wraps `window.AITutor.render`

## Target architecture
### tutor.js
- sole owner of tutor render lifecycle
- sole writer of `window.AITutor.render`
- explicit feature call order

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

### Explicit render order
```js
renderTutorCore(context);
installFlashcardsPanel(context);
installStudyToolsPanel(context);
applyStudyToolsLayout(context);
installMobileTutorUi(context);
applyMobileSelectionLabel(context);
```

## Migration sequence
1. Work only on a dedicated branch/preview.
2. Move pure CSS from JS to `styles.css`.
3. Replace the wrapper chain with explicit tutor lifecycle hooks.
4. Preserve Flashcards and Study Tools behavior exactly in the first pass.
5. Remove `tutor-tools-layout.js` by rendering tools in the intended order from the start.
6. Fold `tutor-mobile-label-fix.js` into canonical mobile tutor logic.
7. After parity is verified, simplify `pwa.js` and merge feature files further.
8. Later, code-split the heavy data files by zone and load on demand.

## Do not change in this pass
- age/parental-consent rules
- Puter connection behavior
- model selection
- generation prompts
- localStorage keys/cache formats
- diagnostic scoring/GAP_TAGS/learning-path semantics
- desktop UX except where required for parity

## Preview smoke test
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
No new file may reassign `window.AITutor.render`. Any future tutor feature must be invoked explicitly by tutor core or through one documented plugin mechanism owned by tutor core.
