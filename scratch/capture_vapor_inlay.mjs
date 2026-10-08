import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9345;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_prof_vpr_' + Date.now();
const artifactDir = 'C:\\Users\\shiva\\.gemini\\antigravity-ide\\brain\\fd1e93a5-8c32-482a-9669-88cb33e3198a';

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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await delay(3500);

  // Scroll to World 06 (Vapor Inlay is index 3 in compact worlds)
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[3]) arts[3].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1500);

  // Verify all img elements loaded in Vapor Inlay
  const imgStatus = await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); const vpr = arts[3]; if(!vpr) return { found: false }; const imgs = Array.from(vpr.querySelectorAll("img")); return { found: true, total: imgs.length, naturalWidths: imgs.map(i => ({ src: i.src, naturalWidth: i.naturalWidth, complete: i.complete })) }; })()',
    returnByValue: true,
  });
  console.log('Vapor Inlay Images Status:', JSON.stringify(imgStatus.result.value, null, 2));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(
    path.join(artifactDir, 'vapor_inlay_fixed_capture.png'),
    Buffer.from(snap.data, 'base64')
  );
  console.log('Vapor Inlay screenshot captured successfully!');
  browser.kill();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  browser.kill();
  process.exit(1);
});
