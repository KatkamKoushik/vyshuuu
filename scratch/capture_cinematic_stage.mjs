import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9265;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_stage_' + Date.now();
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
    await delay(3200);

    // -------------------------------------------------------------
    // DESKTOP (1440 x 900)
    // -------------------------------------------------------------
    await send(ws, msgIdRef.id++, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await delay(1000);

    // Scroll to #collection-wall (The World Selector Doorway)
    await evalInPage(ws, msgIdRef, `(() => {
      const el = document.getElementById('collection-wall');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1500);

    // Shot 1: The Collection Wall World Selector
    await captureShot(ws, msgIdRef, 'stage_desktop_01_world_selector.png');

    // Click on Madder Petni to enter its world
    const selectMadder = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const madder = articles.find(a => a.textContent && a.textContent.includes('Madder Petni'));
      if (madder) {
        madder.click();
        return 'CLICKED_MADDER_WORLD';
      }
      return 'MADDER_NOT_FOUND';
    })()`);
    console.log('Select Madder World:', selectMadder);
    await delay(1500);

    // Scroll to #cinematic-stage
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) stage.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1200);

    // Shot 2: Madder Petni - Stage Observation 01 (Hero Specimen in nocturnal madder)
    await captureShot(ws, msgIdRef, 'stage_desktop_02_madder_plate01.png');

    // Scrub halfway down the stage scroll track
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) {
        const top = stage.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + stage.offsetHeight * 0.45, behavior: 'instant' });
      }
    })()`);
    await delay(1200);

    // Shot 3: Madder Petni - Intermediate Observation (Deep Rubia drapery / gold border)
    await captureShot(ws, msgIdRef, 'stage_desktop_03_madder_intermediate.png');

    // Scrub to culmination (near 95% of stage track)
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) {
        const top = stage.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + stage.offsetHeight * 0.92, behavior: 'instant' });
      }
    })()`);
    await delay(1400);

    // Shot 4: Madder Petni - Culmination held without looping ([CULMINATION HELD], EXAMINE TEXTILE)
    await captureShot(ws, msgIdRef, 'stage_desktop_04_madder_culmination.png');

    // Click EXAMINE TEXTILE -> opens Monograph
    const clickExamine = await evalInPage(ws, msgIdRef, `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const examineBtn = btns.find(b => b.textContent && b.textContent.includes('EXAMINE TEXTILE'));
      if (examineBtn) {
        examineBtn.click();
        return 'OPENED_MONOGRAPH';
      }
      return 'EXAMINE_BTN_NOT_FOUND';
    })()`);
    console.log('Click Examine:', clickExamine);
    await delay(1500);

    // Shot 5: Deep Technical Monograph Folio opened from stage
    await captureShot(ws, msgIdRef, 'stage_desktop_05_monograph.png');

    // Close monograph
    await evalInPage(ws, msgIdRef, `(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('CLOSE'));
      if (closeBtn) closeBtn.click();
    })()`);
    await delay(1000);

    // -------------------------------------------------------------
    // MOBILE (390 x 844)
    // -------------------------------------------------------------
    await send(ws, msgIdRef.id++, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await delay(1000);

    // Scroll back to collection wall
    await evalInPage(ws, msgIdRef, `(() => {
      const el = document.getElementById('collection-wall');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1200);

    // Shot 6: Mobile Archive World Selector
    await captureShot(ws, msgIdRef, 'stage_mobile_01_world_selector.png');

    // Scroll to mobile stage
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) stage.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1200);

    // Shot 7: Mobile Cinematic Textile Stage
    await captureShot(ws, msgIdRef, 'stage_mobile_02_cinematic_stage.png');

    ws.close();
    browser.kill();
    console.log('CINEMATIC TEXTILE STAGE CAPTURES COMPLETE.');
    process.exit(0);
  } catch (err) {
    console.error('Error during capture:', err);
    browser.kill();
    process.exit(1);
  }
}

run();
