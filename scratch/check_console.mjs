import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9230;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_profile_' + Date.now();

const browser = spawn(edgePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  `--remote-debugging-port=${port}`,
  '--user-data-dir=' + userDataDir,
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const res = await fetch(`http://localhost:${port}/json`);
    const tabs = await res.json();
    const t = tabs.find(x => x.type === 'page' && !x.url.startsWith('edge://')) || tabs[0];
    const w = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise(r => w.addEventListener('open', r));

    w.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('CONSOLE:', msg.params.message.level, msg.params.message.text);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('RUNTIME:', msg.params.type, msg.params.args.map(a => a.value || a.description || JSON.stringify(a)));
      }
    });

    w.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
    w.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

    // Scroll to 45%
    setTimeout(() => {
      w.send(JSON.stringify({
        id: 3,
        method: 'Runtime.evaluate',
        params: {
          expression: `
            const el = document.getElementById('unfurling');
            const maxScroll = el.offsetHeight - window.innerHeight;
            window.scrollTo({ top: el.offsetTop + maxScroll * 0.45, behavior: 'instant' });
          `
        }
      }));
    }, 2000);

    setTimeout(() => {
      w.close();
      browser.kill();
      process.exit(0);
    }, 5000);
  } catch (err) {
    console.error(err);
    browser.kill();
    process.exit(1);
  }
}, 1500);
