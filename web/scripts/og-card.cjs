// Renders public/og.png, the social preview card (1200x630 at 2x), from the landing page's hero.
// With the dev stack running: node web/scripts/og-card.cjs web/public/og.png [scale] [light|dark]
const { chromium } = require('playwright');
(async () => {
  const [out, scale, theme] = [process.argv[2], Number(process.argv[3] || 2), process.argv[4] || 'light'];
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: scale, colorScheme: theme });
  await p.goto('http://landing.localhost:5190/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.evaluate((dark) => {
    // The card's own colors, matched to the app's light and dark themes.
    const c = dark
      ? { bg: '#020617', ink: '#f8fafc', onPrimary: '#020617', body: '#94a3b8', muted: '#64748b', glowA: 'rgba(59,130,246,.22)', glowB: 'rgba(14,165,233,.16)' }
      : { bg: '#f8fafc', ink: '#0f172a', onPrimary: '#ffffff', body: '#475569', muted: '#64748b', glowA: 'rgba(37,99,235,.16)', glowB: 'rgba(14,165,233,.14)' };
    const hero = document.querySelector('section.relative.overflow-hidden.border-b');
    const grid = hero.querySelector('svg.pointer-events-none').cloneNode(true);
    const diagram = [...hero.querySelectorAll('svg.h-full')][0].cloneNode(true);
    const primary = getComputedStyle(hero.querySelector('h1 .text-primary')).color;
    const logo = document.querySelector('header a svg, header a img').cloneNode(true);
    const heroBg = getComputedStyle(hero).backgroundImage;
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;overflow:hidden';
    const card = document.createElement('div');
    card.style.cssText = `position:relative;width:1200px;height:630px;overflow:hidden;background:${c.bg};${heroBg !== 'none' ? 'background-image:' + heroBg : ''}`;
    card.innerHTML = `
      <div style="position:absolute;left:-180px;top:-220px;width:620px;height:620px;border-radius:50%;background:radial-gradient(closest-side, ${c.glowA}, transparent)"></div>
      <div style="position:absolute;right:-160px;bottom:-260px;width:640px;height:640px;border-radius:50%;background:radial-gradient(closest-side, ${c.glowB}, transparent)"></div>
      <div id="grid" style="position:absolute;inset:0;opacity:.9"></div>
      <div id="diagram" style="position:absolute;right:-60px;top:22px;width:710px;height:600px"></div>
      <div style="position:absolute;left:72px;top:0;bottom:0;width:500px;display:flex;flex-direction:column;justify-content:center">
        <div id="brand" style="display:flex;align-items:center;gap:12px;font-size:30px;font-weight:700;color:${c.ink};letter-spacing:-.01em"></div>
        <div style="margin-top:36px;font-size:58px;line-height:1.05;font-weight:800;letter-spacing:-.035em;color:${c.ink}">Architecture diagrams that <span style="color:${primary}">explain themselves</span></div>
        <div style="margin-top:26px;font-size:23px;line-height:1.4;color:${c.body}">Isometric or flat views, docs on every component, and AI agents that keep it up to date.</div>
        <div style="margin-top:34px;display:flex;align-items:center;gap:14px">
          <span style="padding:10px 18px;border-radius:9px;background:${primary};color:${c.onPrimary};font-size:20px;font-weight:600">isodraw.app</span>
          <span style="font-size:18px;color:${c.muted}">Free · try it with no sign-up</span>
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
  }, theme === 'dark');
  await p.waitForTimeout(300);
  await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await b.close();
})();
