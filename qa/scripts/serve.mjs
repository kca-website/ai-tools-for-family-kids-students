// Starts the vercel.json-emulating static server on a fixed port (used by Playwright webServer).
import { startLocalServer } from './lib.mjs';
const { url } = await startLocalServer(Number(process.env.QA_PORT || 4173));
console.log('QA local server on', url);
