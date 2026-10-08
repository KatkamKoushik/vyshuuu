import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9255;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_qa_' + Date.now();
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
  return new Promise((resolve) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

setTimeout(async () => {
  try {
    const listRes = await fetch(`http://localhost:${port}/json`);
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    await new Promise((res) => ws.addEventListener('open', res));

    let msgId = 1;
    await send(ws, msgId++, 'Page.enable');
    await send(ws, msgId++, 'Runtime.enable');
    await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to http://localhost:3000...');
    await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1: Collection Wall Opening (Dual Juxtaposition)
    console.log('Capturing Collection Wall Opening...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('collection-wall');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    let snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'collection_opening.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved collection_opening.png');

    // Capture 2: Complete Archive Grid (Scrolled to show all 10 cards)
    console.log('Capturing Complete Archive 10-saree grid...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('collection-wall');
          if (el) {
            window.scrollBy({ top: 1200, behavior: 'instant' });
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'collection_all_10.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved collection_all_10.png');

    // Capture 3: Monograph for VYSH-ARC-01
    console.log('Capturing Continuum Monograph...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent && b.textContent.includes('EXPLORE CONTINUUM MONOGRAPH'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_vysh_arc_01.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_vysh_arc_01.png');

    // Close monograph
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('CLOSE'));
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture 4: Monograph for VYSH-KJV-02 (Madder Petni - 9 assets)
    console.log('Capturing Madder Petni Monograph (9 assets)...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const articles = Array.from(document.querySelectorAll('article'));
          const art = articles.find(a => a.textContent && a.textContent.includes('VYSH-KJV-02'));
          if (art) {
            const btn = art.querySelector('button');
            if (btn) btn.click();
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_vysh_kjv_02.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_vysh_kjv_02.png');

    // Switch to Edge movement in Madder Petni monograph
    console.log('Switching to dedicated 9th movement (Selvedge Edge) in Madder Petni...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const edgeBtn = btns.find(b => b.textContent && b.textContent.includes('DEDICATED SELVEDGE'));
          if (edgeBtn) edgeBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));

    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_vysh_kjv_02_edge.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_vysh_kjv_02_edge.png');

    // Close monograph
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('CLOSE'));
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture 5: Mobile Viewport Collection (390 x 844)
    console.log('Capturing Mobile Collection...');
    await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('collection-wall');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));

    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'collection_mobile.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved collection_mobile.png');

    console.log('All QA screenshots captured successfully.');
    ws.close();
    browser.kill();
    process.exit(0);
  } catch (err) {
    console.error('QA capture error:', err);
    browser.kill();
    process.exit(1);
  }
}, 2000);
