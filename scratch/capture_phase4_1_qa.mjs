import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9299;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_p41_' + Date.now();
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

async function runQA() {
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

  // -------------------------------------------------------------
  // DESKTOP CAPTURES (1440 x 900)
  // -------------------------------------------------------------
  await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000 ...');
  await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000' });
  await delay(2500);

  // 1. Desktop 6-Yard Unfurling (~40% scroll)
  console.log('Capturing Desktop 1: 6-Yard Unfurling...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('unfurling');
      if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight * 0.4);
    })()`
  });
  await delay(1200);
  const snapD1 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_1_d01_unfurling.png'), Buffer.from(snapD1.data, 'base64'));

  // 2. Desktop Gossamer section with Masthead (Light section test)
  console.log('Capturing Desktop 2: Gossamer section with Masthead...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('gossamer')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1200);
  const snapD2 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_1_d02_gossamer_masthead.png'), Buffer.from(snapD2.data, 'base64'));

  // 3. Desktop Collection Wall (Heading contrast test)
  console.log('Capturing Desktop 3: Collection Wall...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('collection-wall')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1200);
  const snapD3 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_1_d03_collection_wall.png'), Buffer.from(snapD3.data, 'base64'));

  // -------------------------------------------------------------
  // MOBILE CAPTURES (390 x 844 iPhone 14)
  // -------------------------------------------------------------
  console.log('Switching to mobile viewport 390x844...');
  await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await delay(800);

  // 4. Mobile 6-Yard Unfurling (Cloth first, compact bottom card test)
  console.log('Capturing Mobile 4: 6-Yard Unfurling...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('unfurling');
      if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight * 0.45);
    })()`
  });
  await delay(1500);
  const snapM1 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_1_m04_unfurling.png'), Buffer.from(snapM1.data, 'base64'));

  // 5. Mobile Gossamer section with Masthead (Light section test)
  console.log('Capturing Mobile 5: Gossamer section with Masthead...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('gossamer')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1200);
  const snapM2 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_1_m05_gossamer_masthead.png'), Buffer.from(snapM2.data, 'base64'));

  // 6. Mobile Collection Wall (Heading contrast test)
  console.log('Capturing Mobile 6: Collection Wall...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('collection-wall')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1200);
  const snapM3 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'phase4_1_m06_collection_wall.png'), Buffer.from(snapM3.data, 'base64'));

  ws.close();
  browser.kill();
  console.log('Phase 4.1 QA captures complete!');
  process.exit(0);
}

runQA().catch((err) => {
  console.error('QA capture failed:', err);
  browser.kill();
  process.exit(1);
});
