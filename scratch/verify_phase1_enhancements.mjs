import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9330;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_prof_p1_' + Date.now();
const artifactDir = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\fd1e93a5-8c32-482a-9669-88cb33e3198a';
const appUrl = 'http://localhost:3000';

const browser = spawn(edgePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + userDataDir,
  'about:blank',
]);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  await delay(1200);
  const list = await (await fetch('http://localhost:' + port + '/json')).json();
  const pageTab = list.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || list[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const curId = id++;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === curId) {
          ws.removeEventListener('message', h);
          m.error ? rej(m.error) : res(m.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

  const capture = async (name) => {
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, name), Buffer.from(snap.data, 'base64'));
    console.log(`[CAPTURED] ${name}`);
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Navigating to ' + appUrl + '...');
  await send('Page.navigate', { url: appUrl });
  await delay(3500);

  // 1. Threshold (Desktop)
  await capture('phase1_01_desktop_threshold.png');

  // 2. Simulate cursor movement to trigger Chiaroscuro light & plate hover in Continuum
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('continuum');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await delay(1200);

  // Dispatch mousemove over continuum hero plate
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 720,
    y: 500,
  });
  await delay(500);
  await capture('phase1_02_desktop_continuum.png');

  // 3. Gossamer Kora (Light Zone)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('gossamer');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await delay(1200);
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 720,
    y: 450,
  });
  await delay(500);
  await capture('phase1_03_desktop_gossamer.png');

  // 4. Archive Worlds (Collection Wall)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('collection-wall');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await delay(1200);
  await capture('phase1_04_desktop_archive_worlds.png');

  // 5. Atelier Chamber
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('atelier');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await delay(1200);
  await capture('phase1_05_desktop_atelier.png');

  // 6. Mobile Viewport Check (390 x 844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await delay(800);

  // Mobile Threshold
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 0)',
  });
  await delay(800);
  await capture('phase1_06_mobile_threshold.png');

  // Mobile Continuum
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('continuum');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await delay(800);
  await capture('phase1_07_mobile_continuum.png');

  // Mobile Archive Worlds
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('collection-wall');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await delay(800);
  await capture('phase1_08_mobile_archive_worlds.png');

  // 7. Verify reduced motion overrides
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await delay(600);
  await capture('phase1_09_reduced_motion.png');

  console.log('PHASE 1 VERIFICATION COMPLETE');
  browser.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('ERROR in verification:', err);
  browser.kill();
  process.exit(1);
});
