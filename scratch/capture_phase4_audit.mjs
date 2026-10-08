import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9288;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_audit_' + Date.now();
const artifactDir = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\fd1e93a5-8c32-482a-9669-88cb33e3198a';

const browser = spawn(edgePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  `--remote-debugging-port=${port}`,
  '--user-data-dir=' + userDataDir,
  'about:blank'
]);

function send(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function runAuditCaptures() {
  await delay(1200);

  const listRes = await fetch(`http://localhost:${port}/json`);
  const tabs = await listRes.json();
  const pageTab = tabs.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  await new Promise((res) => ws.addEventListener('open', res));

  let msgId = 1;
  await send(ws, msgId++, 'Page.enable');
  await send(ws, msgId++, 'DOM.enable');
  await send(ws, msgId++, 'Runtime.enable');

  // 1. Desktop Viewport (1440 x 900)
  await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000 ...');
  await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000' });
  await delay(2500);

  // ------------------------------------------------------------------
  // 01. Threshold
  // ------------------------------------------------------------------
  console.log('Capturing 01. Threshold...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `window.scrollTo(0, 0)`
  });
  await delay(1500);
  const snap1 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_01_threshold.png'), Buffer.from(snap1.data, 'base64'));

  // ------------------------------------------------------------------
  // 02. 6-Yard Unfurling beginning (~15-20% scroll)
  // ------------------------------------------------------------------
  console.log('Capturing 02. 6-Yard Unfurling beginning...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('unfurling');
      if (el) {
        const top = el.offsetTop + window.innerHeight * 0.6;
        window.scrollTo(0, top);
      }
    })()`
  });
  await delay(1200);
  const snap2 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_02_unfurling_beginning.png'), Buffer.from(snap2.data, 'base64'));

  // ------------------------------------------------------------------
  // 03. 6-Yard Unfurling climax (~75-85% scroll)
  // ------------------------------------------------------------------
  console.log('Capturing 03. 6-Yard Unfurling climax...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('unfurling');
      if (el) {
        const top = el.offsetTop + el.offsetHeight * 0.78;
        window.scrollTo(0, top);
      }
    })()`
  });
  await delay(1200);
  const snap3 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_03_unfurling_climax.png'), Buffer.from(snap3.data, 'base64'));

  // ------------------------------------------------------------------
  // 04. Collection opening (CollectionIntro + ContinuumHero)
  // ------------------------------------------------------------------
  console.log('Capturing 04. Collection opening...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('collection')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const snap4 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_04_collection_opening.png'), Buffer.from(snap4.data, 'base64'));

  // Also Continuum Hero
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('continuum')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap4b = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_04b_continuum_hero.png'), Buffer.from(snap4b.data, 'base64'));

  // ------------------------------------------------------------------
  // 05. Collection wall
  // ------------------------------------------------------------------
  console.log('Capturing 05. Collection wall...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('collection-wall')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1200);
  const snap5 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_05_collection_wall.png'), Buffer.from(snap5.data, 'base64'));

  // Archive grid
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('complete-archive')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const snap5b = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_05b_collection_grid.png'), Buffer.from(snap5b.data, 'base64'));

  // ------------------------------------------------------------------
  // 06. Monograph open
  // ------------------------------------------------------------------
  console.log('Capturing 06. Monograph open...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trigger = btns.find(b => b.textContent && b.textContent.includes('ENTER EXAMINATION FOLIO'));
      if (trigger) trigger.click();
    })()`
  });
  await delay(1200);
  const snap6 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_06_monograph_open.png'), Buffer.from(snap6.data, 'base64'));

  // Close monograph modal
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent && b.textContent.includes('CLOSE'));
      if (closeBtn) closeBtn.click();
    })()`
  });
  await delay(600);

  // ------------------------------------------------------------------
  // 07. Atelier opening
  // ------------------------------------------------------------------
  console.log('Capturing 07. Atelier opening...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('atelier')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1200);
  const snap7 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_07_atelier_opening.png'), Buffer.from(snap7.data, 'base64'));

  // ------------------------------------------------------------------
  // 08. Atelier middle (Plate 03 Interlock / Plate 04 Weight)
  // ------------------------------------------------------------------
  console.log('Capturing 08. Atelier middle (Plate 03)...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="03 — STRUCTURAL INTERLOCK"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap8 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_08_atelier_middle.png'), Buffer.from(snap8.data, 'base64'));

  // ------------------------------------------------------------------
  // 09. Living Heirloom (Plate 05)
  // ------------------------------------------------------------------
  console.log('Capturing 09. Living Heirloom (Plate 05)...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="05 — THE LIVING HEIRLOOM"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap9 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_09_living_heirloom.png'), Buffer.from(snap9.data, 'base64'));

  // ------------------------------------------------------------------
  // 10. Final dedication & departure (AtelierClosing)
  // ------------------------------------------------------------------
  console.log('Capturing 10. Final dedication...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('footer[aria-label*="Atelier Dedication"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap10 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_10_final_dedication.png'), Buffer.from(snap10.data, 'base64'));

  // ------------------------------------------------------------------
  // MOBILE AUDIT CAPTURES (390 x 844 iPhone 14 / modern device)
  // ------------------------------------------------------------------
  console.log('Switching to mobile viewport 390x844...');
  await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await delay(800);

  // Mobile 01: Threshold
  await send(ws, msgId++, 'Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
  await delay(800);
  const mSnap1 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_m01_threshold.png'), Buffer.from(mSnap1.data, 'base64'));

  // Mobile 02: 6-Yard Unfurling
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('unfurling');
      if (el) window.scrollTo(0, el.offsetTop + window.innerHeight * 0.7);
    })()`
  });
  await delay(1000);
  const mSnap2 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_m02_unfurling.png'), Buffer.from(mSnap2.data, 'base64'));

  // Mobile 03: Collection Wall
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('collection-wall')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const mSnap3 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_m03_collection_wall.png'), Buffer.from(mSnap3.data, 'base64'));

  // Mobile 04: Monograph Open
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trigger = btns.find(b => b.textContent && b.textContent.includes('ENTER EXAMINATION FOLIO'));
      if (trigger) trigger.click();
    })()`
  });
  await delay(1000);
  const mSnap4 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_m04_monograph_open.png'), Buffer.from(mSnap4.data, 'base64'));

  // Close monograph on mobile
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent && b.textContent.includes('CLOSE'));
      if (closeBtn) closeBtn.click();
    })()`
  });
  await delay(500);

  // Mobile 05: Atelier Opening
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('atelier')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const mSnap5 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_m05_atelier_opening.png'), Buffer.from(mSnap5.data, 'base64'));

  // Mobile 06: Living Heirloom & Dedication
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="05 — THE LIVING HEIRLOOM"]')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const mSnap6 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_m06_living_heirloom_closing.png'), Buffer.from(mSnap6.data, 'base64'));

  ws.close();
  browser.kill();
  console.log('Audit captures complete! All desktop & mobile artifacts written.');
  process.exit(0);
}

runAuditCaptures().catch((err) => {
  console.error('Audit capture failed:', err);
  browser.kill();
  process.exit(1);
});
