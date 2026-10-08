import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9242;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_' + Date.now();
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

    await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000' });
    
    // Wait until textures are fully loaded into WebGL uniforms
    let texturesReady = false;
    for (let attempts = 0; attempts < 30; attempts++) {
      await new Promise((r) => setTimeout(r, 500));
      const res = await send(ws, msgId++, 'Runtime.evaluate', {
        expression: 'window.__UNFURL_U__ && window.__UNFURL_U__.uHasTextures.value === 1.0',
        returnByValue: true
      });
      if (res.result.value === true) {
        texturesReady = true;
        console.log(`Textures ready after ${attempts * 500 + 500}ms`);
        break;
      }
    }
    if (!texturesReady) {
      console.warn('Textures not confirmed ready, proceeding anyway');
    }
    await new Promise((r) => setTimeout(r, 1000));

    const cadences = [
      { name: 'pass1B_45pct.png', pct: 0.45 },
      { name: 'pass1B_75pct.png', pct: 0.75 },
      { name: 'pass1B_92pct.png', pct: 0.92 },
    ];

    for (const c of cadences) {
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('unfurling');
            if (el) {
              const maxScroll = el.offsetHeight - window.innerHeight;
              const top = el.offsetTop + maxScroll * ${c.pct};
              window.scrollTo({ top: top, behavior: 'instant' });
            }
          })()
        `
      });

      // Wait 3.0 seconds for smooth viscous damping to complete
      await new Promise((r) => setTimeout(r, 3000));

      const status = await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `
          (() => {
            return {
              scrollY: window.scrollY,
              uniformP: window.__UNFURL_U__ ? window.__UNFURL_U__.uProgress.value : null
            };
          })()
        `,
        returnByValue: true
      });
      console.log(`Cadence ${c.pct}:`, status.result.value);

      const shotResult = await send(ws, msgId++, 'Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      const buffer = Buffer.from(shotResult.data, 'base64');
      const targetPath = artifactDir + '\\' + c.name;
      fs.writeFileSync(targetPath, buffer);
      console.log('Saved:', c.name, buffer.length, 'bytes');
    }

    ws.close();
    browser.kill();
    process.exit(0);
  } catch (err) {
    console.error('CDP Error:', err);
    browser.kill();
    process.exit(1);
  }
}, 1500);
