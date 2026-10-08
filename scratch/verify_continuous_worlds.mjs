import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9308;
const userDataDir = 'C:\\Users\\shiva\\AppData\\Local\\Temp\\edge_prof_cont_' + Date.now();
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

  // 1. Capture World 02: Obsidian Korvai (Bronze Chamber)
  console.log('\n--- CAPTURING WORLD 02: OBSIDIAN KORVAI ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[0]) arts[0].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_02_obsidian_korvai.png');

  // Verify continuous gliding: offset change over 4 seconds
  const offset0 = await send('Runtime.evaluate', {
    expression:
      '(() => { const tr = document.querySelector("#collection-wall article .will-change-transform"); return tr ? tr.style.transform : "none"; })()',
    returnByValue: true,
  });
  console.log('Track transform at t=0s:', offset0.result.value);

  await delay(4000);

  const offset4 = await send('Runtime.evaluate', {
    expression:
      '(() => { const tr = document.querySelector("#collection-wall article .will-change-transform"); return tr ? tr.style.transform : "none"; })()',
    returnByValue: true,
  });
  console.log('Track transform at t=4s (continuous glide):', offset4.result.value);
  await capture('refined_world_02_gliding.png');

  // 2. Capture World 03: Shikar Gah in Shadow (Silver Sanctum)
  console.log('\n--- CAPTURING WORLD 03: SHIKAR GAH ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[1]) arts[1].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_03_shikar_gah.png');

  // 3. Capture World 05: Tapestry Dusk (Copper Hall)
  console.log('\n--- CAPTURING WORLD 05: TAPESTRY DUSK ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[2]) arts[2].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_05_tapestry_dusk.png');

  // 4. Capture World 06: Vapor Inlay (Mist Gallery)
  console.log('\n--- CAPTURING WORLD 06: VAPOR INLAY ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[3]) arts[3].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_06_vapor_inlay.png');

  // 5. Capture World 07: Obsidian Khat Grid (Khat Studio)
  console.log('\n--- CAPTURING WORLD 07: KHAT GRID ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[4]) arts[4].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_07_khat_grid.png');

  // 6. Capture World 09: Liquid Metal (Palladium Vault)
  console.log('\n--- CAPTURING WORLD 09: LIQUID METAL ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[6]) arts[6].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_09_liquid_metal.png');

  // 7. Capture World 10: Madder Petni (Sacred Sanctuary)
  console.log('\n--- CAPTURING WORLD 10: MADDER PETNI ---');
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[7]) arts[7].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  await capture('refined_world_10_madder_petni.png');

  // 8. Mobile Viewport Check (390 x 844)
  console.log('\n--- TESTING MOBILE RESPONSIVENESS & OVERFLOW ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await delay(1200);
  await send('Runtime.evaluate', {
    expression:
      '(() => { const arts = document.querySelectorAll("#collection-wall article"); if(arts[0]) arts[0].scrollIntoView({ behavior: "instant", block: "center" }); })()',
  });
  await delay(1200);
  const mobileOverflow = await send('Runtime.evaluate', {
    expression:
      '(() => { return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth }; })()',
    returnByValue: true,
  });
  console.log('Mobile Overflow Result:', mobileOverflow.result.value);
  await capture('refined_mobile_world_02.png');

  console.log('\nALL REFINED CAPTURES COMPLETE!');
  browser.kill();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  browser.kill();
  process.exit(1);
});
