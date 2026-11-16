/* RevolUX 3.0 case study — interactions (uses js/kit.js) */
(() => {
'use strict';
const { $, $$, toast, burst, reduce, copy } = Kit;
Kit.init({ colors: ['#2BE04B', '#1DE9D5', '#E6F03C', '#2E5BD9', '#FFFFFF'] });
const A = '../assets/work/revolux/';
const open = Kit.lightbox();

/* score */
let score = 0; const sc = $('#score'), box = sc.parentElement;
function add(n) {
  score += n; const s = String(score).padStart(6, '0'); sc.textContent = s; $('#final').textContent = s;
  box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump');
}

/* cover */
$('#start').addEventListener('click', e => { add(1000); burst(e.clientX, e.clientY, 30); $('#concept').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
const crt = $('#crt'); let coins = 0;
crt.addEventListener('click', e => { coins++; crt.classList.add('on'); $('#coin').textContent = `Credit ${String(coins).padStart(2, '0')}`; add(100); burst(e.clientX, e.clientY, 14); });

/* echo type */
const echo = $('#echo'), DEF = 'Are you ready ?';
function setEcho(t) { $$('span', echo).forEach(s => s.textContent = t || DEF); echo.classList.remove('pop'); void echo.offsetWidth; echo.classList.add('pop'); }
setEcho(''); $('#echoIn').addEventListener('input', e => setEcho(e.target.value));

/* terminal: types the real design-tip copy when it scrolls into view */
const TIP = 'They say comparison is the thief of joy for a reason.', typed = $('#typed');
if (reduce) typed.textContent = TIP;
else new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect(); let i = 0; const t = setInterval(() => { typed.textContent = TIP.slice(0, ++i); if (i >= TIP.length) clearInterval(t); }, 38); }, { threshold: .6 }).observe(typed);

/* palette */
const PAL = [['Arcade black', '#001C08'], ['Player green', '#2BE04B'], ['Vector cyan', '#1DE9D5'], ['Phosphor yellow', '#E6F03C'], ['CRT blue', '#2E5BD9'], ['Screen white', '#FFFFFF']];
$('#pal').innerHTML = PAL.map(([n, h]) => `<button class="sw" data-hex="${h}" data-tip="copy ${h}"><i style="--c:${h}"></i><span><b>${n}</b><small>${h}</small></span></button>`).join('');
$$('.sw').forEach(b => b.addEventListener('click', () => { copy(b.dataset.hex); toast(`Copied ${b.dataset.hex}`); add(50); }));

/* carousel: drag to scroll */
const pano = $('#pano'); let down = false, sx = 0, sl = 0, moved = false;
pano.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = pano.scrollLeft; pano.classList.add('drag'); pano.setPointerCapture(e.pointerId); });
pano.addEventListener('pointermove', e => { if (down) pano.scrollLeft = sl - (e.clientX - sx); });
['pointerup', 'pointercancel'].forEach(t => pano.addEventListener(t, () => { down = false; pano.classList.remove('drag'); }));
pano.addEventListener('scroll', () => { if (!moved && pano.scrollLeft > 40) { moved = true; add(300); } }, { passive: true });

/* posts grid */
const POSTS = [
  ['post1.jpg', 'Teaser', 'Teaser post: Are you ready? Await to witness next revolution'],
  ['loading.jpg', 'Loading…', 'Awareness session happening soon, with a retro computer showing a loading screen'],
  ['tomorrow.jpg', 'Countdown', 'Awareness session happening tomorrow, 6:00 PM via Zoom'],
  ['ws1.jpg', 'Workshop 1', 'Workshop 1: Figma Fundamentals'],
  ['ws2.jpg', 'Workshop 2', 'Workshop 2: Design process and UI/UX guidelines'],
  ['tip.jpg', 'Design tip', 'Design tip post in a terminal window: Comparing the work']
];
$('#grid').innerHTML = POSTS.map(([f, n, alt], i) => `<button class="shot reveal" style="--d:${(i % 3) * .06}s" data-src="${f}" data-alt="${alt}" data-tip="zoom in"><img src="${A + f}" alt="${alt}" width="1080" height="1080" loading="lazy"><span class="px">${n}</span></button>`).join('');
$$('#grid .reveal').forEach(n => Kit.observe(n));

/* open any piece; score once each, bonus when all are seen */
const shots = $$('.shot');
shots.forEach(b => b.addEventListener('click', e => {
  open(A + b.dataset.src, b.dataset.alt);
  if (b.classList.contains('seen')) return;
  b.classList.add('seen'); add(500);
  if (shots.every(x => x.classList.contains('seen'))) { add(5000); toast('★ All stages clear! +5000'); burst(e.clientX, e.clientY, 80); }
}));
})();
