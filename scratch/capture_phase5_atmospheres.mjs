import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9260;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_phase5_' + Date.now();
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
  });
  return res.result?.value;
}

async function captureShot(ws, msgIdRef, filename) {
  const snap = await send(ws, msgIdRef.id++, 'Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(artifactDir, filename);
  fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
  console.log(`[CAPTURED] ${filename}`);
  return outPath;
}

async function run() {
  try {
    await delay(1200);
    const listRes = await fetch(`http://localhost:${port}/json`);
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    await new Promise((res) => ws.addEventListener('open', res));

    const msgIdRef = { id: 1 };
    await send(ws, msgIdRef.id++, 'Page.enable');
    await send(ws, msgIdRef.id++, 'DOM.enable');
    await send(ws, msgIdRef.id++, 'Runtime.enable');

    console.log(`Navigating to ${appUrl}...`);
    await send(ws, msgIdRef.id++, 'Page.navigate', { url: appUrl });
    await delay(3000);

    // -------------------------------------------------------------
    // DESKTOP RUN (1440 x 900)
    // -------------------------------------------------------------
    await send(ws, msgIdRef.id++, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await delay(1000);

    // Scroll to #complete-archive
    await evalInPage(ws, msgIdRef, `(() => {
      const el = document.getElementById('complete-archive');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1500);

    // Shot 1: Desktop Neutral Archive
    await captureShot(ws, msgIdRef, 'phase5_desktop_01_neutral_archive.png');

    // Select Obsidian Korvai (Study 02)
    const selectKorvai = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const korvai = articles.find(a => a.textContent && a.textContent.includes('Obsidian Korvai'));
      if (korvai) {
        korvai.click();
        return 'CLICKED_KORVAI';
      }
      return 'KORVAI_NOT_FOUND';
    })()`);
    console.log('Select Obsidian Korvai:', selectKorvai);
    await delay(1600); // allow 1.2s smooth room transition

    // Shot 2: Desktop Obsidian Korvai Atmosphere
    await captureShot(ws, msgIdRef, 'phase5_desktop_02_obsidian_korvai.png');

    // Direct transition to Madder Petni (Study 10) - Tests Correction 05 direct transition
    const selectMadder = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const madder = articles.find(a => a.textContent && a.textContent.includes('Madder Petni'));
      if (madder) {
        madder.click();
        return 'CLICKED_MADDER';
      }
      return 'MADDER_NOT_FOUND';
    })()`);
    console.log('Select Madder Petni:', selectMadder);
    await delay(1600);

    // Shot 3: Desktop Madder Petni Atmosphere
    await captureShot(ws, msgIdRef, 'phase5_desktop_03_madder_petni.png');

    // Direct transition to Liquid Metal Continuum (Study 09)
    const selectLiquid = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const liquid = articles.find(a => a.textContent && a.textContent.includes('Liquid Metal Continuum'));
      if (liquid) {
        liquid.click();
        return 'CLICKED_LIQUID';
      }
      return 'LIQUID_NOT_FOUND';
    })()`);
    console.log('Select Liquid Metal:', selectLiquid);
    await delay(1600);

    // Shot 4: Desktop Liquid Metal Atmosphere
    await captureShot(ws, msgIdRef, 'phase5_desktop_04_liquid_metal.png');

    // Open Monograph Folio for Liquid Metal (or Madder Petni)
    const openFolio = await evalInPage(ws, msgIdRef, `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const folioBtn = btns.find(b => b.textContent && b.textContent.includes('INSPECT FOLIO'));
      if (folioBtn) {
        folioBtn.click();
        return 'OPENED_FOLIO: ' + folioBtn.textContent.trim();
      }
      return 'FOLIO_BTN_NOT_FOUND';
    })()`);
    console.log('Open Monograph:', openFolio);
    await delay(1500);

    // Shot 5: Desktop Monograph Active Atmosphere
    await captureShot(ws, msgIdRef, 'phase5_desktop_05_monograph_active.png');

    // Close monograph
    await evalInPage(ws, msgIdRef, `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent && b.textContent.includes('CLOSE'));
      if (closeBtn) closeBtn.click();
    })()`);
    await delay(1000);

    // -------------------------------------------------------------
    // MOBILE RUN (390 x 844)
    // -------------------------------------------------------------
    await send(ws, msgIdRef.id++, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await delay(1000);

    // Reset atmosphere to neutral first for mobile baseline
    await evalInPage(ws, msgIdRef, `(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('RESET TO NEUTRAL'));
      if (resetBtn) resetBtn.click();
      const el = document.getElementById('complete-archive');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1400);

    // Shot 6: Mobile Neutral Archive
    await captureShot(ws, msgIdRef, 'phase5_mobile_01_neutral_archive.png');

    // Mobile: Tap to commit Madder Petni atmosphere
    const mobileMadder = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const madder = articles.find(a => a.textContent && a.textContent.includes('Madder Petni'));
      if (madder) {
        madder.click();
        madder.scrollIntoView({ behavior: 'instant', block: 'center' });
        return 'CLICKED_MOBILE_MADDER';
      }
      return 'MADDER_NOT_FOUND';
    })()`);
    console.log('Mobile Select Madder Petni:', mobileMadder);
    await delay(1600);

    // Shot 7: Mobile Madder Petni Atmosphere
    await captureShot(ws, msgIdRef, 'phase5_mobile_02_madder_petni.png');

    // Mobile: Open Monograph
    const mobileFolio = await evalInPage(ws, msgIdRef, `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const folioBtn = btns.find(b => b.textContent && b.textContent.includes('INSPECT FOLIO'));
      if (folioBtn) {
        folioBtn.click();
        return 'CLICKED_MOBILE_FOLIO';
      }
      return 'FOLIO_NOT_FOUND';
    })()`);
    console.log('Mobile Open Folio:', mobileFolio);
    await delay(1500);

    // Shot 8: Mobile Monograph Active Atmosphere
    await captureShot(ws, msgIdRef, 'phase5_mobile_03_monograph_active.png');

    ws.close();
    browser.kill();
    console.log('PHASE 5 ATMOSPHERE SUITE CAPTURE COMPLETE.');
    process.exit(0);
  } catch (err) {
    console.error('Capture error:', err);
    browser.kill();
    process.exit(1);
  }
}

run();
