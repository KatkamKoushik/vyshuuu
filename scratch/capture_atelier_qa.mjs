import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9277;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_atelier_' + Date.now();
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

async function capture() {
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

  // Desktop 1440x900 Viewport
  await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3004...');
  await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3004' });
  await delay(2500);

  // Test masthead navigation to Atelier
  console.log('Navigating via Masthead to #atelier...');
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const atlLink = links.find(l => l.getAttribute('href') === '#atelier');
      if (atlLink) atlLink.click();
      else document.getElementById('atelier')?.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await delay(1500);

  // 1. Desktop Atelier introduction
  const snap1 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p1Path = path.join(artifactDir, 'atelier_qa_01_intro.png');
  fs.writeFileSync(p1Path, Buffer.from(snap1.data, 'base64'));
  console.log('Captured:', p1Path);

  // Scroll to Plate 01
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="01 — WARP TENSION"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap2 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p2Path = path.join(artifactDir, 'atelier_qa_02_plate01.png');
  fs.writeFileSync(p2Path, Buffer.from(snap2.data, 'base64'));
  console.log('Captured:', p2Path);

  // Scroll to Plate 02
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="02 — WEFT CADENCE"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap3 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p3Path = path.join(artifactDir, 'atelier_qa_03_plate02.png');
  fs.writeFileSync(p3Path, Buffer.from(snap3.data, 'base64'));
  console.log('Captured:', p3Path);

  // Scroll to Plate 03
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="03 — STRUCTURAL INTERLOCK"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap4 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p4Path = path.join(artifactDir, 'atelier_qa_04_plate03.png');
  fs.writeFileSync(p4Path, Buffer.from(snap4.data, 'base64'));
  console.log('Captured:', p4Path);

  // Scroll to Plate 04
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="04 — TACTILE WEIGHT"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap5 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p5Path = path.join(artifactDir, 'atelier_qa_05_plate04.png');
  fs.writeFileSync(p5Path, Buffer.from(snap5.data, 'base64'));
  console.log('Captured:', p5Path);

  // Scroll to Plate 05
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="05 — THE LIVING HEIRLOOM"]')?.scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await delay(1000);
  const snap6 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p6Path = path.join(artifactDir, 'atelier_qa_06_plate05.png');
  fs.writeFileSync(p6Path, Buffer.from(snap6.data, 'base64'));
  console.log('Captured:', p6Path);

  // Scroll to transition into AtelierClosing
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('footer[aria-label*="Atelier Dedication"]')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const snap7 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p7Path = path.join(artifactDir, 'atelier_qa_07_closing_transition.png');
  fs.writeFileSync(p7Path, Buffer.from(snap7.data, 'base64'));
  console.log('Captured:', p7Path);

  // Mobile 390x844 Viewport
  console.log('Switching to mobile viewport 390x844...');
  await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await delay(1000);

  // Mobile Atelier section
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.getElementById('atelier')?.scrollIntoView({ behavior: 'instant' })`
  });
  await delay(1000);
  const snap8 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p8Path = path.join(artifactDir, 'atelier_qa_08_mobile_chamber.png');
  fs.writeFileSync(p8Path, Buffer.from(snap8.data, 'base64'));
  console.log('Captured:', p8Path);

  // Mobile Plate 05 / Transition into closing
  await send(ws, msgId++, 'Runtime.evaluate', {
    expression: `document.querySelector('article[aria-label*="05 — THE LIVING HEIRLOOM"]')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await delay(1000);
  const snap9 = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
  const p9Path = path.join(artifactDir, 'atelier_qa_09_mobile_plate05_closing.png');
  fs.writeFileSync(p9Path, Buffer.from(snap9.data, 'base64'));
  console.log('Captured:', p9Path);

  ws.close();
  browser.kill();
  console.log('All 9 visual QA screenshots successfully captured.');
  process.exit(0);
}

capture().catch((err) => {
  console.error('Capture error:', err);
  browser.kill();
  process.exit(1);
});
