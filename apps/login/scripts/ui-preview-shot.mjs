// Screenshots the dev-only /preview-idps page (branded IdP buttons) for quick
// visual validation. Normally driven by `pnpm ui-preview`, which starts the dev
// server, waits for the route, runs this, and tears the server down again.
// See src/app/(preview)/README.md.
//
// Standalone use (against an already-running server):
//   PREVIEW_URL=http://127.0.0.1:3100/preview-idps node scripts/ui-preview-shot.mjs
import { chromium } from "@playwright/test";

const url = process.env.PREVIEW_URL || "http://127.0.0.1:3100/preview-idps";
const out = process.env.PREVIEW_OUT || "screenshots/idp-brands.png";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1100 },
    deviceScaleFactor: 2,
  });
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  if (!res || !res.ok()) {
    throw new Error(`preview route ${url} returned ${res ? res.status() : "no response"}`);
  }
  await page.waitForTimeout(1000); // let the client useEffect setTheme() paint
  await page.screenshot({ path: out, fullPage: true });
  console.log(`✓ saved ${out}`);
} finally {
  await browser.close();
}
