// Renders public/og.png, the social preview card (1200x630 at 2x), from the landing page's hero.
// With the dev stack running: node web/scripts/og-card.cjs web/public/og.png
const { chromium } = require('playwright');
(async () => {
  const [out, scale] = [process.argv[2], Number(process.argv[3] || 2)];
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: scale, colorScheme: 'light' });
  await p.goto('http://landing.localhost:5190/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.evaluate(() => {
    const hero = document.querySelector('section.relative.overflow-hidden.border-b');
    const grid = hero.querySelector('svg.pointer-events-none').cloneNode(true);
    const diagram = [...hero.querySelectorAll('svg.h-full')][0].cloneNode(true);
    const primary = getComputedStyle(hero.querySelector('h1 .text-primary')).color;
    const logo = document.querySelector('header a svg, header a img').cloneNode(true);
    const heroBg = getComputedStyle(hero).backgroundImage;
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;overflow:hidden';
    const card = document.createElement('div');
    card.style.cssText = `position:relative;width:1200px;height:630px;overflow:hidden;background:#f8fafc;${heroBg !== 'none' ? 'background-image:' + heroBg : ''}`;
    card.innerHTML = `
      <div style="position:absolute;left:-180px;top:-220px;width:620px;height:620px;border-radius:50%;background:radial-gradient(closest-side, rgba(37,99,235,.16), transparent)"></div>
      <div style="position:absolute;right:-160px;bottom:-260px;width:640px;height:640px;border-radius:50%;background:radial-gradient(closest-side, rgba(14,165,233,.14), transparent)"></div>
      <div id="grid" style="position:absolute;inset:0;opacity:.9"></div>
      <div id="diagram" style="position:absolute;right:-60px;top:22px;width:710px;height:600px"></div>
      <div style="position:absolute;left:72px;top:0;bottom:0;width:500px;display:flex;flex-direction:column;justify-content:center">
        <div id="brand" style="display:flex;align-items:center;gap:12px;font-size:30px;font-weight:700;color:#0f172a;letter-spacing:-.01em"></div>
        <div style="margin-top:36px;font-size:58px;line-height:1.05;font-weight:800;letter-spacing:-.035em;color:#0f172a">Architecture diagrams that <span style="color:${primary}">explain themselves</span></div>
        <div style="margin-top:26px;font-size:23px;line-height:1.4;color:#475569">Isometric or flat views, docs on every component, and AI agents that keep it up to date.</div>
        <div style="margin-top:34px;display:flex;align-items:center;gap:14px">
          <span style="padding:10px 18px;border-radius:9px;background:${primary};color:#fff;font-size:20px;font-weight:600">isodraw.app</span>
          <span style="font-size:18px;color:#64748b">Free · try it with no sign-up</span>
        </div>
      </div>`;
    document.body.appendChild(card);
    grid.style.cssText = 'width:100%;height:100%';
    card.querySelector('#grid').appendChild(grid);
    diagram.style.cssText = 'width:100%;height:100%';
    diagram.removeAttribute('class');
    card.querySelector('#diagram').appendChild(diagram);
    logo.style.cssText = 'width:40px;height:40px';
    card.querySelector('#brand').append(logo, 'IsoDraw');
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await b.close();
})();
