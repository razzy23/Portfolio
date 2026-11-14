/* Intergalactic case study — interactions */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const B = '../assets/work/intergalactic/';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- toast + confetti ---------- */
function toast(msg) {
  $$('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 1700);
}
const cv = $('#confetti'), cx = cv.getContext('2d'); let parts = [], raf = 0;
const sizeCv = () => { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); };
sizeCv(); addEventListener('resize', sizeCv);
function burst(x, y, n = 60) {
  if (reduce) return;
  const C = ['#7C5CFF', '#B9A6FF', '#E3E7EB', '#FFD479', '#6FD3FF'];
  for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 15, vy: -Math.random() * 13 - 3, r: 0, vr: (Math.random() - .5) * .3, s: 3 + Math.random() * 5, c: C[(Math.random() * C.length) | 0], life: 100 + Math.random() * 50 });
  if (raf) return;
  const step = () => {
    cx.clearRect(0, 0, innerWidth, innerHeight); parts = parts.filter(p => p.life > 0);
    for (const p of parts) { p.vy += .32; p.x += p.vx; p.y += p.vy; p.life--; cx.save(); cx.globalAlpha = Math.min(1, p.life / 40); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.s, 0, 6.3); cx.fill(); cx.restore(); }
    raf = parts.length ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}

/* ---------- starfield with mouse parallax ---------- */
(() => {
  const c = $('#stars'), g = c.getContext('2d'); let W, H, stars = [], mx = 0, my = 0, tx = 0, ty = 0;
  const init = () => { const r = devicePixelRatio || 1; W = c.width = innerWidth * r; H = c.height = innerHeight * r; g.setTransform(1, 0, 0, 1, 0, 0); stars = Array.from({ length: Math.round(innerWidth * innerHeight / 9000) }, () => ({ x: Math.random() * W, y: Math.random() * H, z: .2 + Math.random() * .8, p: Math.random() * 6.3 })); };
  init(); addEventListener('resize', init);
  addEventListener('pointermove', e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); }, { passive: true });
  const draw = t => {
    mx += (tx - mx) * .05; my += (ty - my) * .05; g.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = .35 + .65 * (reduce ? 1 : .5 + .5 * Math.sin(t / 900 + s.p));
      g.globalAlpha = a * s.z; g.fillStyle = '#E3E7EB';
      const x = ((s.x - mx * 60 * s.z * (devicePixelRatio || 1)) % W + W) % W, y = ((s.y - my * 60 * s.z * (devicePixelRatio || 1)) % H + H) % H;
      g.fillRect(x, y, s.z * 2.2, s.z * 2.2);
    }
    if (!reduce) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

/* ---------- reveal, chips, orbit ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
$$('.reveal').forEach(n => io.observe(n));
const chips = $('#chips'), secs = $$('section[data-title]');
secs.forEach(s => { const a = document.createElement('a'); a.href = '#' + s.id; a.textContent = s.dataset.title; a.dataset.for = s.id; chips.append(a); });
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  $$('a', chips).forEach(a => { const on = a.dataset.for === e.target.id; a.classList.toggle('on', on); if (on) chips.scrollTo({ left: a.offsetLeft - chips.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); });
}), { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => spy.observe(s));
const ship = $('#ship'), fill = $('#orbitFill');
const prog = () => { const h = document.documentElement, p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight); fill.style.width = (p * 100) + '%'; ship.style.left = (p * 100) + '%'; };
addEventListener('scroll', prog, { passive: true }); prog();
$('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
ship.addEventListener('click', () => toast('3… 2… 1… 🚀'));

/* ---------- hero phone tilt ---------- */
const hp = $('#heroPhone');
hp.addEventListener('pointermove', e => {
  if (reduce || e.pointerType !== 'mouse') return;
  const r = hp.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  hp.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`;
});
hp.addEventListener('pointerleave', () => { hp.style.transform = ''; });

/* ---------- walkthrough data ---------- */
const REQS = [
  'It should have a simple and intuitive user interface that guides users through the booking process step by step.',
  'The ability to search and compare travel options.',
  'The ability to view detailed information about their destination before making a decision.',
  'Ability to enter personal information and payment details easily.',
  'Access the booking information through the application.'
];
const TABS = {
  book: { n: 'Booking flow', steps: [
    { i: 'find', t: 'Find a shuttle', d: 'Pick where from and where to, choose a return trip, dates, and how many adults and children.', req: 0 },
    { i: 'available', t: 'Available shuttles', d: 'Options listed with class, journey time, transits and price, with a price filter to compare.', req: 1 },
    { i: 'billing', t: 'Billing details', d: 'The flight legs, passenger fares and offers itemised, with the total.' },
    { i: 'payment', t: 'Payment methods', d: 'Choose a saved card or add a new method, then confirm the trip.', req: 3 },
    { i: 'confirmed', t: 'Confirmed', d: 'A clear confirmation, and a way back to exploring.' }
  ] },
  explore: { n: 'Explore', steps: [
    { i: 'explore', t: 'Explore the planets', d: 'Destinations as a scrolling list, each with a way in.' },
    { i: 'moon', t: 'The Moon', d: 'Long-form information on the destination, with view packages and book a trip at the bottom.', req: 2 },
    { i: 'diemos', t: 'Diemos', d: 'The same layout, a different world, so detail pages stay easy to scan.', req: 2 },
    { i: 'saturn', t: 'Saturn', d: 'Highlights, activities and a hero image of the planet.', req: 2 }
  ] },
  inside: { n: 'Inside the app', steps: [
    { i: 'home', t: 'For you', d: 'Trending activities, frequent travels and upcoming trips on one screen.' },
    { i: 'search', t: 'Search', d: 'Search, then trending, categories, to-dos and events to browse.' },
    { i: 'notifications', t: 'Notifications', d: 'Offers and updates with filters for all, deals, trips and inquiries.' },
    { i: 'bookings', t: 'My bookings', d: 'Upcoming trips grouped by year, each with a view button.', req: 4 },
    { i: 'booking-detail', t: 'Booking detail', d: 'The trip at a glance, with a boarding QR on demand.', req: 4 }
  ] }
};
const wTabs = $('#walkTabs'), strip = $('#strip'), pImg = $('#phoneImg'), reqChip = $('#stepReq');
let tab = 'book', step = 0; const doneReq = new Set();

/* ---------- brief / requirements ---------- */
const reqList = $('#reqs');
REQS.forEach((r, i) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.innerHTML = `<span></span><i>see it →</i>`; $('span', b).textContent = r; b.dataset.tip = 'see where it landed';
  b.addEventListener('click', () => {
    markReq(i);
    for (const [k, t] of Object.entries(TABS)) { const si = t.steps.findIndex(s => s.req === i); if (si >= 0) { goWalk(k, si); break; } }
    $('#screens').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  li.append(b); reqList.append(li);
});
function markReq(i) {
  if (doneReq.has(i)) return; doneReq.add(i);
  $$('#reqs li')[i].classList.add('done');
  $('#reqFill').style.width = (doneReq.size / REQS.length * 100) + '%'; $('#reqTxt').textContent = `${doneReq.size}/${REQS.length} requirements checked`;
  if (doneReq.size === REQS.length) { toast('All 5 requirements covered ✓'); burst(innerWidth / 2, innerHeight / 2, 90); }
}

/* ---------- compare slider ---------- */
const PAIRS = [
  { k: 'find', hf: 'find', t: 'Find shuttle', n: 'From, to, dates and passengers.' },
  { k: 'available', hf: 'available', t: 'Available shuttles', n: 'Compare options by class, journey time and price.' },
  { k: 'billing', hf: 'billing', t: 'Billing details', n: 'Itemised fares and the total before paying.' },
  { k: 'payment', hf: 'payment', t: 'Payment methods', n: 'Pick a saved card or add a new one.' },
  { k: 'home', hf: 'home', t: 'Home', n: 'Trending activities, frequent travels and upcoming trips.' },
  { k: 'explore', hf: 'explore', t: 'Explore', n: 'A scrolling list of destinations.' },
  { k: 'destination', hf: 'moon', t: 'Destination', n: 'Long-form details before you decide to book.' },
  { k: 'bookings', hf: 'bookings', t: 'My bookings', n: 'Upcoming trips grouped by year.' },
  { k: 'booking-detail', hf: 'booking-detail', t: 'Booking detail', n: 'The trip at a glance, with a boarding QR.' },
  { k: 'search', hf: 'search', t: 'Search', n: 'Search with trending, categories and events.' },
  { k: 'notifications', hf: 'notifications', t: 'Notifications', n: 'Filter by all, deals, trips and inquiries.' }
];
const cmp = $('#cmp'), range = $('#cmpRange'), pairsEl = $('#pairs'); let pi = 0, sweeping = 0;
$('#cmpTotal').textContent = PAIRS.length;
PAIRS.forEach((p, i) => { const b = document.createElement('button'); b.className = 'pair' + (i ? '' : ' on'); b.textContent = p.t; b.setAttribute('role', 'tab'); b.addEventListener('click', () => { pi = i; showPair(); setP(50); }); pairsEl.append(b); });
function setP(v) { v = Math.max(0, Math.min(100, v)); cmp.style.setProperty('--p', v + '%'); range.value = v; }
function showPair() {
  const p = PAIRS[pi];
  $('#cmpWf').src = `${B}wf/${p.k}.jpg`; $('#cmpHf').src = `${B}hf/${p.hf}.jpg`;
  $('#cmpTitle').textContent = p.t; $('#cmpNote').textContent = p.n; $('#cmpNum').textContent = pi + 1;
  $$('.pair', pairsEl).forEach((b, i) => b.classList.toggle('on', i === pi));
}
let dragging = false;
const posFrom = e => { const r = cmp.getBoundingClientRect(); setP((e.clientX - r.left) / r.width * 100); };
cmp.addEventListener('pointerdown', e => { cancelAnimationFrame(sweeping); dragging = true; cmp.setPointerCapture(e.pointerId); posFrom(e); });
cmp.addEventListener('pointermove', e => { if (dragging) posFrom(e); });
cmp.addEventListener('pointerup', () => { dragging = false; });
cmp.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') setP(+range.value - 5); else if (e.key === 'ArrowRight') setP(+range.value + 5); });
range.addEventListener('input', () => { cancelAnimationFrame(sweeping); setP(+range.value); });
function sweep() {
  cancelAnimationFrame(sweeping); const t0 = performance.now(), D = 2600;
  const f = t => { const k = Math.min(1, (t - t0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; setP(100 * (1 - e)); if (k < 1) sweeping = requestAnimationFrame(f); };
  setP(100); sweeping = requestAnimationFrame(f);
}
$('#cmpSweep').addEventListener('click', sweep);
showPair(); setP(50);
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); setTimeout(sweep, 500); } }, { threshold: .5 }).observe(cmp);

/* ---------- design system ---------- */
const TYPES = [
  ['Header H1', "700 32px/1 'Space Grotesk'", '', 'Space Grotesk Bold · 32'],
  ['Header H2', "700 26px/1.12 'Space Grotesk'", '-1.5px', 'Space Grotesk Bold · 26'],
  ['Body Bold - 18px', "700 18px/1.5 'Saira'", '', 'Saira Bold · 18'],
  ['Body Medium - 16px', "500 16px/1.5 'Saira'", '', 'Saira Medium · 16'],
  ['Body Small - 14px', "400 14px/1.5 'Saira'", '', 'Saira Regular · 14'],
  ['Subtitles', "700 28px/1.1 'DM Sans'", '', 'DM Sans Bold · 32'],
  ['Buttons', "300 15px/1 'Saira'", '1.25px', 'Saira Light · 15 · caps', true],
  ['Info', "300 14px/1.14 'Space Grotesk'", '.2px', 'Space Grotesk Light · 14 · caps', true]
];
const tl = $('#typeList'), tt = $('#tt');
function renderTypes() {
  tl.innerHTML = ''; const v = tt.value.trim();
  TYPES.forEach(([name, font, ls, meta, caps]) => {
    const r = document.createElement('div'); r.className = 'trow';
    const s = document.createElement('span'); s.className = 's'; s.textContent = v || name; s.style.font = font; s.style.letterSpacing = ls || 'normal'; if (caps) s.style.textTransform = 'uppercase';
    const m = document.createElement('small'); m.textContent = meta; r.append(s, m); tl.append(r);
  });
}
tt.addEventListener('input', renderTypes); renderTypes();
const SW = [['Primary', '#020208'], ['Secondary', '#FFFFFF'], ['Accent', '#1F272F'], ['Accent', '#323F4B'], ['Text', '#E3E7EB']];
const swEl = $('#swatches');
SW.forEach(([n, h]) => {
  const b = document.createElement('button'); b.className = 'sw'; b.dataset.tip = 'copy ' + h; b.innerHTML = `<span class="box" style="--c:${h}"></span><b>${n}</b><code>${h}</code>`;
  b.addEventListener('click', () => { try { navigator.clipboard.writeText(h); } catch (e) {} toast('Copied ' + h); const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 20, 22); });
  swEl.append(b);
});
$$('#venn [data-k]').forEach(n => { const on = v => $$('#venn [data-k="' + n.dataset.k + '"]').forEach(x => x.classList.toggle('hot', v)); n.addEventListener('pointerenter', () => on(true)); n.addEventListener('pointerleave', () => on(false)); });
const stage = $('#logoStage');
stage.addEventListener('click', () => { stage.classList.remove('go'); void stage.offsetWidth; stage.classList.add('go'); const r = stage.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 40); setTimeout(() => stage.classList.remove('go'), 1200); });

/* ---------- walkthrough ---------- */
Object.entries(TABS).forEach(([k, t]) => { const b = document.createElement('button'); b.className = 'tab' + (k === tab ? ' on' : ''); b.textContent = t.n; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => goWalk(k, 0)); wTabs.append(b); });
function renderWalk(dir) {
  const T = TABS[tab], s = T.steps[step];
  $$('.tab', wTabs).forEach(b => b.classList.toggle('on', b.dataset.k === tab));
  pImg.className = ''; void pImg.offsetWidth; pImg.className = dir ? (dir > 0 ? 'in-next' : 'in-prev') : '';
  pImg.src = `${B}hf/${s.i}.jpg`; pImg.alt = `${T.n}: ${s.t}`;
  $('#count').textContent = `${step + 1} / ${T.steps.length}`;
  $('#stepLabel').textContent = `${T.n} · screen ${step + 1}`; $('#stepTitle').textContent = s.t; $('#stepNote').textContent = s.d;
  if (s.req != null) { reqChip.hidden = false; reqChip.innerHTML = `<b>Requirement ${s.req + 1}</b> · `; reqChip.append(REQS[s.req]); markReq(s.req); } else reqChip.hidden = true;
  strip.innerHTML = '';
  T.steps.forEach((x, i) => { const b = document.createElement('button'); b.className = 'thumb' + (i === step ? ' on' : ''); b.dataset.tip = x.t; b.innerHTML = `<img src="${B}hf/${x.i}.jpg" alt="" loading="lazy">`; b.addEventListener('click', () => { const dd = i - step; step = i; renderWalk(Math.sign(dd)); }); strip.append(b); });
  const on = $('.thumb.on', strip); if (on) strip.scrollTo({ left: on.offsetLeft - strip.clientWidth / 2 + on.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
}
function goWalk(k, i) { tab = k; step = Math.min(i, TABS[k].steps.length - 1); renderWalk(0); }
function move(d) { const n = TABS[tab].steps.length; step = (step + d + n) % n; renderWalk(d); }
$('#next').addEventListener('click', () => move(1)); $('#prev').addEventListener('click', () => move(-1));
const ph = $('#phone'); ph.dataset.tip = 'click · next screen'; let sx = null;
ph.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } });
ph.addEventListener('pointerdown', e => { sx = e.clientX; });
ph.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1); else if (e.pointerType === 'mouse') move(1); });
renderWalk(0); doneReq.clear(); $$('#reqs li').forEach(l => l.classList.remove('done')); $('#reqFill').style.width = '0'; $('#reqTxt').textContent = `0/${REQS.length} requirements checked`;

/* ---------- onboarding drag-scroll ---------- */
const onb = $('#onb'); let ox = 0, os = 0, od = false;
onb.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; od = true; ox = e.clientX; os = onb.scrollLeft; onb.classList.add('drag'); onb.setPointerCapture(e.pointerId); });
onb.addEventListener('pointermove', e => { if (od) onb.scrollLeft = os - (e.clientX - ox); });
const endDrag = () => { od = false; onb.classList.remove('drag'); };
onb.addEventListener('pointerup', endDrag); onb.addEventListener('pointercancel', endDrag);

/* ---------- lightbox ---------- */
const lb = $('#lb'), lbImg = $('#lbImg');
$('#show').addEventListener('click', () => { lbImg.src = $('#show img').src; lb.hidden = false; document.body.style.overflow = 'hidden'; });
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
$('.x', lb).addEventListener('click', closeLb); lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
})();
