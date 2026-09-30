# QA suite – aitools4kids.gr

Read-only ως προς τον κώδικα του site· όλα τα αρχεία βρίσκονται στο `qa/` (εκτός από το workflow `.github/workflows/qa-weekly.yml`, που πρέπει να είναι εκεί για να το τρέξει το GitHub).

```bash
cd qa && npm ci                      # μία φορά (Chromium: PLAYWRIGHT_BROWSERS_PATH ή `npx playwright install chromium`)
npm run qa                           # πλήρης έλεγχος (~8–10 λεπτά)
npm run smoke                        # < 2 λεπτά (API handlers με mock + @smoke Playwright)
BASE_URL=https://www.aitools4kids.gr npm run qa      # browser tests + live checks στο production
```

| Εντολή | Τι κάνει |
|---|---|
| `npm run qa` | inventory → node tests (API handlers με mock providers + self-tests) → Playwright Chromium desktop + mobile 375 px (+ WebKit αν είναι εγκατεστημένο) → crawl όλων των σελίδων → **live** security headers / AI smoke / link check (παραλείπονται με σαφές μήνυμα αν το site δεν είναι προσβάσιμο από τον runner) |
| `npm run smoke` | ίδια βασικά, μόνο `@smoke` tests |
| `npm run links[:sl\|:tools]` | link check (ΕΝΓ και κατάλογος εργαλείων σε ξεχωριστά reports) |
| `npm run ai-smoke [-- --guardrails --ratelimit-probe]` | ≤ 30 requests (προεπιλογή ≈ 14, 2 πραγματικές κλήσεις μοντέλου) |
| `npm run headers` | CSP/HSTS/XFO/Referrer/Permissions, redirects www↔apex, CORS API |
| `npm run lighthouse` | 8 σελίδες × mobile/desktop (τοπικά: το Performance ΔΕΝ είναι αντιπροσωπευτικό) |

## Πώς διαβάζονται τα αποτελέσματα
* Τα γνωστά ευρήματα είναι κωδικοποιημένα ως **expected failures** (`test.fail(...)` με το ID του ευρήματος, π.χ. `F-01`) και ως τεστ `FINDING API-xx`. Όταν διορθωθεί ένα εύρημα το αντίστοιχο τεστ θα *περάσει* και το Playwright θα το αναφέρει ως αποτυχία («expected to fail but passed») – τότε αφαίρεσε το `test.fail`.
* `results/` περιέχει τα JSON (crawl, axe, storage, third-party, SEO, no-JS, lighthouse, links).
* `e2e/fixtures.mjs`: `mockAI` (καμία κλήση σε πάροχο), `qa` (συλλογή σφαλμάτων/τρίτων hosts), έλεγχος για διαρροή μεταφραστικών κλειδιών.
* Τοπικός server (`scripts/lib.mjs → startLocalServer`) αναπαράγει το routing του `vercel.json` χωρίς security headers (όπως ακριβώς θα τα σέρβιρε το repo).

## Ό,τι δεν αυτοματοποιείται
Δες `UAT.csv` (75 σενάρια: πραγματικό κινητό, Safari iOS, screen readers, guardrails με πραγματικό μοντέλο, απόρρητο).
`python3 scripts/build-uat.py` το ξαναδημιουργεί (UTF-8 με BOM για Excel).

## Προσοχή
Ο φάκελος `qa/` (και ειδικά `REPORT.md`) **θα σερβίρεται δημόσια από το Vercel** αν γίνει merge στο `main`, αφού το `vercel.json` έχει `handle: filesystem` και το `.vercelignore` εξαιρεί μόνο το `benchmark`. Πρόσθεσε `qa` στο `.vercelignore` πριν το merge.
