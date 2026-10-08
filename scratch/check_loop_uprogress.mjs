import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9240;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_' + Date.now();
const browser = spawn(edgePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=1440,900',
  '--remote-debugging-port=' + port,
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
    const listRes = await fetch('http://localhost:' + port + '/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise((res) => ws.addEventListener('open', res));

    let msgId = 1;
    await send(ws, msgId++, 'Page.enable');
    await send(ws, msgId++, 'Runtime.enable');
    await send(ws, msgId++, 'Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 4000));

    for (const pct of [0.45, 0.75, 0.92]) {
      await send(ws, msgId++, 'Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('unfurling');
            const maxScroll = el.offsetHeight - window.innerHeight;
            const top = el.offsetTop + maxScroll * ${pct};
            window.scrollTo({ top: top, behavior: 'instant' });
          })()
        `
      });
      await new Promise((r) => setTimeout(r, 2500));
      const val = await send(ws, msgId++, 'Runtime.evaluate', {
        expression: 'window.__UNFURL_U__ ? window.__UNFURL_U__.uProgress.value : null',
        returnByValue: true
      });
      console.log('pct:', pct, 'uniform uProgress:', val.result.value);
    }
    ws.close();
    browser.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    browser.kill();
    process.exit(1);
  }
}, 1500);
