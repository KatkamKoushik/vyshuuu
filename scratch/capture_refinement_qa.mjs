import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9277;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_refine_' + Date.now();
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
    await new Promise((r) => setTimeout(r, 2500));

    // 1. Capture Collection Wall Chapter Marks & Index
    console.log('Capturing Refined Collection Chapter Marks...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const h = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('THE COMPLETE ARCHIVE'));
          if (h) {
            h.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));
    let snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'collection_refined_chapter_marks.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved collection_refined_chapter_marks.png');

    // 2. Open Continuum Monograph (Refined Archival Folio)
    console.log('Opening Refined Continuum Monograph...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent && b.textContent.includes('ENTER EXAMINATION FOLIO'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));
    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_refined_arc01.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_refined_arc01.png');

    // 3. Switch to Movement 03 (Fold) in Continuum Monograph
    console.log('Switching to Movement 03 in Monograph...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const btn = btns.find(b => b.textContent && b.textContent.includes('Viscous Fold Memory'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));
    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_refined_movement_switch.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_refined_movement_switch.png');

    // Close Monograph
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('CLOSE'));
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    // 4. Open Madder Petni Monograph (9 movements)
    console.log('Opening Madder Petni Monograph...');
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
    // Wait for modal & high-res image to load
    await new Promise((r) => setTimeout(r, 4000));
    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_refined_madder_petni.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_refined_madder_petni.png');

    // Close Monograph
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('CLOSE'));
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1000));

    // 5. Scroll to Bottom to Capture Return Navigation Action
    console.log('Capturing Return Navigation Action at bottom...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('footer');
          if (footer) {
            footer.scrollIntoView({ behavior: 'instant', block: 'end' });
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 1500));
    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'collection_refined_return_action.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved collection_refined_return_action.png');

    // 6. Mobile Viewport (390 x 844)
    console.log('Capturing Refined Mobile View...');
    await send(ws, msgId++, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('complete-archive');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 2000));
    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'collection_refined_mobile.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved collection_refined_mobile.png');

    // 7. Mobile Monograph View
    console.log('Capturing Refined Mobile Monograph...');
    await send(ws, msgId++, 'Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('INSPECT STUDY FOLIO'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise((r) => setTimeout(r, 3500));
    snap = await send(ws, msgId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'monograph_refined_mobile.png'), Buffer.from(snap.data, 'base64'));
    console.log('Saved monograph_refined_mobile.png');

    console.log('All Refinement QA captures complete.');
    ws.close();
    browser.kill();
    process.exit(0);
  } catch (err) {
    console.error('Error in refinement capture:', err);
    browser.kill();
    process.exit(1);
  }
}, 1500);
