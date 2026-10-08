import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9270;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_journey_' + Date.now();
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

    await send(ws, msgIdRef.id++, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log(`Navigating to ${appUrl}...`);
    await send(ws, msgIdRef.id++, 'Page.navigate', { url: appUrl });
    await delay(3200);

    // ------------------------------------------------------------------------
    // STEP 1: Archive Index
    // ------------------------------------------------------------------------
    console.log('STEP 1: Navigating to Archive Doorway...');
    await evalInPage(ws, msgIdRef, `(() => {
      const el = document.getElementById('collection-wall');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1500);
    await captureShot(ws, msgIdRef, 'journey_01_archive.png');

    // ------------------------------------------------------------------------
    // STEP 2 & 3: Select Madder Petni -> atmosphere transition -> Plate 01
    // ------------------------------------------------------------------------
    console.log('STEP 2 & 3: Selecting Madder Petni...');
    const selectMadder = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const madder = articles.find(a => a.textContent && a.textContent.includes('Madder Petni'));
      if (madder) {
        madder.click();
        return 'CLICKED_MADDER';
      }
      return 'MADDER_NOT_FOUND';
    })()`);
    console.log('Select result:', selectMadder);
    await delay(1400);

    // View Plate 01 on stage
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) stage.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1200);
    await captureShot(ws, msgIdRef, 'journey_02_madder_plate01.png');

    // ------------------------------------------------------------------------
    // STEP 4: Automatic Plate 02 (Idle drift after generous hold)
    // ------------------------------------------------------------------------
    console.log('STEP 4: Waiting for gentle idle drift to Plate 02...');
    await delay(4800); // 4.2s drift interval
    await captureShot(ws, msgIdRef, 'journey_03_madder_plate02_autodrift.png');

    // ------------------------------------------------------------------------
    // STEP 5: Scroll to Plate 04
    // ------------------------------------------------------------------------
    console.log('STEP 5: User scrolls down to Plate 04...');
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) {
        const top = stage.getBoundingClientRect().top + window.scrollY;
        // Plate 04 is around 38% of scroll distance
        window.scrollTo({ top: top + stage.offsetHeight * 0.38, behavior: 'instant' });
      }
    })()`);
    await delay(1200);
    await captureShot(ws, msgIdRef, 'journey_04_madder_plate04_scroll.png');

    // ------------------------------------------------------------------------
    // STEP 6: Idle drift kicks in -> Plate 05
    // ------------------------------------------------------------------------
    console.log('STEP 6: Waiting for idle drift to Plate 05...');
    await delay(4800);
    await captureShot(ws, msgIdRef, 'journey_05_madder_plate05_autodrift.png');

    // ------------------------------------------------------------------------
    // STEP 7: Manual reverse to Plate 03 (Click button '03' on timeline thread)
    // ------------------------------------------------------------------------
    console.log('STEP 7: User manually reverses to Plate 03...');
    const jumpPlate03 = await evalInPage(ws, msgIdRef, `(() => {
      const nav = document.querySelector('nav[aria-label="Cinematic Plate Navigation"]');
      if (nav) {
        const btns = Array.from(nav.querySelectorAll('button'));
        if (btns.length >= 3) {
          btns[2].click(); // Plate 03 (0-indexed: 2)
          return 'CLICKED_PLATE_03';
        }
      }
      return 'NAV_NOT_FOUND';
    })()`);
    console.log('Jump result:', jumpPlate03);
    await delay(1400);
    await captureShot(ws, msgIdRef, 'journey_06_madder_manual_reverse_plate03.png');

    // ------------------------------------------------------------------------
    // STEP 8 & 9: Continue to final plate -> culmination hold
    // ------------------------------------------------------------------------
    console.log('STEP 8 & 9: Scrolling to final culmination plate...');
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) {
        const top = stage.getBoundingClientRect().top + window.scrollY;
        const scrollableDist = stage.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + scrollableDist * 0.94, behavior: 'instant' });
      }
    })()`);
    await delay(1500);
    await captureShot(ws, msgIdRef, 'journey_07_madder_culmination_hold.png');

    // Wait 5s to confirm culmination holds and NEVER loops back
    console.log('Waiting 5s to confirm culmination holds without looping...');
    await delay(5000);
    await captureShot(ws, msgIdRef, 'journey_08_madder_culmination_held_verified.png');

    // ------------------------------------------------------------------------
    // STEP 10: Examine Textile -> Open Monograph
    // ------------------------------------------------------------------------
    console.log('STEP 10: Opening Monograph examination folio...');
    const openExamine = await evalInPage(ws, msgIdRef, `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const examineBtn = btns.find(b => b.textContent && b.textContent.includes('EXAMINE TEXTILE'));
      if (examineBtn) {
        examineBtn.click();
        return 'OPENED_MONOGRAPH';
      }
      return 'EXAMINE_BTN_NOT_FOUND';
    })()`);
    console.log('Open Monograph:', openExamine);
    await delay(1600);
    await captureShot(ws, msgIdRef, 'journey_09_monograph_open.png');

    // ------------------------------------------------------------------------
    // STEP 11: Close Monograph -> Return to Madder stage
    // ------------------------------------------------------------------------
    console.log('STEP 11: Closing Monograph...');
    await evalInPage(ws, msgIdRef, `(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('CLOSE'));
      if (closeBtn) closeBtn.click();
    })()`);
    await delay(1200);
    await captureShot(ws, msgIdRef, 'journey_10_return_madder_stage.png');

    // ------------------------------------------------------------------------
    // STEP 12: Reset -> Return to Archive index
    // ------------------------------------------------------------------------
    console.log('STEP 12: Resetting atmosphere and returning to Archive...');
    const clickReset = await evalInPage(ws, msgIdRef, `(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('RESET TO ARCHIVE'));
      if (resetBtn) {
        resetBtn.click();
        return 'CLICKED_RESET';
      }
      return 'RESET_BTN_NOT_FOUND';
    })()`);
    console.log('Reset result:', clickReset);
    await delay(1500);
    await captureShot(ws, msgIdRef, 'journey_11_reset_neutral_archive.png');

    // ------------------------------------------------------------------------
    // STEP 13: Select Liquid Metal -> Direct world-to-world transition
    // ------------------------------------------------------------------------
    console.log('STEP 13: Selecting Liquid Metal Continuum...');
    const selectLiquid = await evalInPage(ws, msgIdRef, `(() => {
      const articles = Array.from(document.querySelectorAll('article'));
      const liquid = articles.find(a => a.textContent && a.textContent.includes('Liquid Metal Continuum'));
      if (liquid) {
        liquid.click();
        return 'CLICKED_LIQUID';
      }
      return 'LIQUID_NOT_FOUND';
    })()`);
    console.log('Select Liquid result:', selectLiquid);
    await delay(1400);

    // Scroll to Liquid Metal stage
    await evalInPage(ws, msgIdRef, `(() => {
      const stage = document.getElementById('cinematic-stage');
      if (stage) stage.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1200);
    await captureShot(ws, msgIdRef, 'journey_12_liquid_metal_stage.png');

    // ------------------------------------------------------------------------
    // STEP 14: Scroll past into Atelier -> Reset to nocturnal darkroom obsidian
    // ------------------------------------------------------------------------
    console.log('STEP 14: Scrolling past stage into Atelier...');
    await evalInPage(ws, msgIdRef, `(() => {
      const atelier = document.getElementById('atelier');
      if (atelier) atelier.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`);
    await delay(1600);
    await captureShot(ws, msgIdRef, 'journey_13_atelier_entrance.png');

    ws.close();
    browser.kill();
    console.log('USER JOURNEY VERIFICATION COMPLETE.');
    process.exit(0);
  } catch (err) {
    console.error('Journey execution error:', err);
    browser.kill();
    process.exit(1);
  }
}

run();
