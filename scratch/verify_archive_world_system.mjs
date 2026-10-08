import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9278;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_archive_' + Date.now();
const artifactDir = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\fd1e93a5-8c32-482a-9669-88cb33e3198a';
const appUrl = 'http://localhost:3000';

const browser = spawn(edgePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  `--remote-debugging-port=${port}`,
  '--user-data-dir=' + userDataDir,
  'about:blank',
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

async function evalInPage(ws, msgIdRef, script) {
  const res = await send(ws, msgIdRef.id++, 'Runtime.evaluate', {
    expression: script,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) {
    throw new Error('Eval failed: ' + JSON.stringify(res.exceptionDetails));
  }
  return res.result ? res.result.value : null;
}

async function capture(ws, msgIdRef, name) {
  const res = await send(ws, msgIdRef.id++, 'Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(res.data, 'base64');
  const outPath = path.join(artifactDir, name);
  fs.writeFileSync(outPath, buf);
  console.log(`[CAPTURED] ${name} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function run() {
  console.log('Connecting to browser on port ' + port + '...');
  await delay(1200);
  const listRes = await fetch(`http://localhost:${port}/json`);
  const tabs = await listRes.json();
  const pageTab = tabs.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  await new Promise((res) => ws.addEventListener('open', res));
  console.log('Connected to CDP WebSocket');

  const msgId = { id: 1 };
  await send(ws, msgId.id++, 'Page.enable');
  await send(ws, msgId.id++, 'DOM.enable');

  console.log('Navigating to ' + appUrl + '...');
  await send(ws, msgId.id++, 'Page.navigate', { url: appUrl });
  await delay(3500);

  // 1. Verify Continuum Archetype (FROZEN / UNTOUCHED)
  console.log('\n--- VERIFYING CONTINUUM ARCHETYPE (FROZEN) ---');
  await evalInPage(ws, msgId, `
    const el = document.getElementById('continuum');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await delay(1200);
  const continuumCheck = await evalInPage(ws, msgId, `
    (() => {
      const el = document.getElementById('continuum');
      const seq = document.querySelector('section[aria-label="Continuum Archetype Editorial Sequence"]');
      const title = el?.querySelector('h3')?.textContent?.trim();
      const plates = seq?.querySelectorAll('img')?.length || 0;
      return { found: !!el, title, sequencePlates: plates };
    })()
  `);
  console.log('Continuum Check:', JSON.stringify(continuumCheck, null, 2));
  await capture(ws, msgId, 'verify_01_continuum_frozen.png');

  // 2. Verify Black -> Light / Gossamer Kora (FROZEN / UNTOUCHED)
  console.log('\n--- VERIFYING GOSSAMER KORA LIGHT CORRIDOR (FROZEN) ---');
  await evalInPage(ws, msgId, `
    (() => {
      const el = document.getElementById('gossamer');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()
  `);
  await delay(1200);
  const gossamerCheck = await evalInPage(ws, msgId, `
    (() => {
      const el = document.getElementById('gossamer');
      const transition = document.querySelector('section[aria-label="Colour and Material Transition"]');
      const seq = document.querySelector('section[aria-label="Gossamer Kora Editorial Sequence"]');
      const title = el?.querySelector('h3')?.textContent?.trim();
      const plates = seq?.querySelectorAll('img')?.length || 0;
      return { found: !!el, title, hasTransition: !!transition, sequencePlates: plates };
    })()
  `);
  console.log('Gossamer Check:', JSON.stringify(gossamerCheck, null, 2));
  await capture(ws, msgId, 'verify_02_gossamer_frozen.png');

  // 3. Verify Archive Continuum Header & 8 Compact Worlds
  console.log('\n--- VERIFYING ARCHIVE WORLDS IN COLLECTION WALL ---');
  await evalInPage(ws, msgId, `
    (() => {
      const el = document.getElementById('collection-wall');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()
  `);
  await delay(1500);
  await capture(ws, msgId, 'verify_03_archive_header.png');

  const worldsData = await evalInPage(ws, msgId, `
    (() => {
      const articles = Array.from(document.querySelectorAll('#collection-wall article'));
      return articles.map((art) => {
        const title = art.querySelector('h3')?.textContent?.trim();
        const code = art.querySelector('header span')?.textContent?.trim();
        const bg = window.getComputedStyle(art).backgroundColor;
        const plateImgs = art.querySelectorAll('img');
        const firstImgWidth = plateImgs[0]?.getBoundingClientRect()?.width || 0;
        const containerWidth = art.querySelector('.overflow-hidden')?.getBoundingClientRect()?.width || 0;
        return {
          title,
          code,
          bg,
          plateCount: plateImgs.length,
          firstImgWidth: Math.round(firstImgWidth),
          containerWidth: Math.round(containerWidth),
          approxVisible: containerWidth > 0 ? (containerWidth / firstImgWidth).toFixed(1) : '0'
        };
      });
    })()
  `);
  console.log('Found Archive Worlds:', JSON.stringify(worldsData, null, 2));

  // 4. Capture World 02: Obsidian Korvai
  await evalInPage(ws, msgId, `
    (() => {
      const articles = document.querySelectorAll('#collection-wall article');
      if (articles[0]) articles[0].scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await delay(1200);
  await capture(ws, msgId, 'verify_04_world_02_obsidian_korvai.png');

  // 5. Test Horizontal Auto-Drift on World 02
  console.log('\nTesting horizontal auto-drift across 5 seconds...');
  const initialTransform = await evalInPage(ws, msgId, `
    (() => {
      const track = document.querySelector('#collection-wall article .will-change-transform');
      return track ? track.style.transform : 'none';
    })()
  `);
  console.log('Initial track transform:', initialTransform);
  await delay(5000); // Wait for auto-advance
  const advancedTransform = await evalInPage(ws, msgId, `
    (() => {
      const track = document.querySelector('#collection-wall article .will-change-transform');
      return track ? track.style.transform : 'none';
    })()
  `);
  console.log('Advanced track transform:', advancedTransform);
  await capture(ws, msgId, 'verify_05_world_02_auto_drifted.png');

  // 6. Capture World 05: Tapestry Dusk & World 06: Vapor Inlay
  await evalInPage(ws, msgId, `
    (() => {
      const articles = document.querySelectorAll('#collection-wall article');
      if (articles[2]) articles[2].scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await delay(1200);
  await capture(ws, msgId, 'verify_06_world_05_tapestry_dusk.png');

  // 7. Capture World 09: Liquid Metal & World 10: Madder Petni
  await evalInPage(ws, msgId, `
    (() => {
      const articles = document.querySelectorAll('#collection-wall article');
      if (articles[7]) articles[7].scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await delay(1200);
  await capture(ws, msgId, 'verify_07_world_10_madder_petni.png');

  // 8. Verify Document Overflow on Desktop
  const desktopOverflow = await evalInPage(ws, msgId, `
    (() => {
      const sw = document.documentElement.scrollWidth;
      const iw = window.innerWidth;
      return { scrollWidth: sw, innerWidth: iw, hasHorizontalOverflow: sw > iw };
    })()
  `);
  console.log('Desktop Overflow Check:', desktopOverflow);

  // 9. Mobile Viewport Verification (390 x 844)
  console.log('\n--- VERIFYING MOBILE VIEWPORT (390 x 844) ---');
  await send(ws, msgId.id++, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await delay(1200);

  const mobileOverflow = await evalInPage(ws, msgId, `
    (() => {
      const sw = document.documentElement.scrollWidth;
      const iw = window.innerWidth;
      const articles = Array.from(document.querySelectorAll('#collection-wall article'));
      const world0 = articles[0];
      const imgW = world0?.querySelector('img')?.getBoundingClientRect()?.width || 0;
      return {
        scrollWidth: sw,
        innerWidth: iw,
        hasHorizontalOverflow: sw > iw,
        imgWidth: Math.round(imgW),
      };
    })()
  `);
  console.log('Mobile Check:', mobileOverflow);
  await capture(ws, msgId, 'verify_08_mobile_world_02.png');

  // 10. Verify Atelier Chamber following Archive
  console.log('\n--- VERIFYING ATELIER TRANSITION ---');
  await evalInPage(ws, msgId, `
    (() => {
      const el = document.getElementById('atelier');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()
  `);
  await delay(1200);
  const atelierCheck = await evalInPage(ws, msgId, `
    (() => {
      const el = document.getElementById('atelier');
      const title = el?.querySelector('h2')?.textContent?.trim();
      const plates = el?.querySelectorAll('img')?.length || 0;
      return { found: !!el, title, plateCount: plates };
    })()
  `);
  console.log('Atelier Check:', atelierCheck);
  await capture(ws, msgId, 'verify_09_atelier_entrance.png');

  console.log('\n========================================');
  console.log('ALL FORENSIC VERIFICATIONS COMPLETE!');
  console.log('========================================');

  browser.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  browser.kill();
  process.exit(1);
});
