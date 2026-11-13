/* MadHack 2023 case study — interactions */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = '../assets/work/madhack/';

/* ---------- toast ---------- */
function toast(msg) {
  $$('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
  document.body.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 1800);
}

/* ---------- confetti (brand colours) ---------- */
const cv = $('#confetti'), cx = cv.getContext('2d'); let parts = [], raf = 0;
const COL = ['#54C5F7', '#02A8E1', '#EEEEFF', '#FFE92B', '#A259FF'];
const sizeCv = () => { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); };
sizeCv(); addEventListener('resize', sizeCv);
function burst(x, y, n = 90) {
  if (reduce) return;
  for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 18, vy: -Math.random() * 15 - 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, s: 6 + Math.random() * 9, c: COL[(Math.random() * COL.length) | 0], sh: (Math.random() * 3) | 0, life: 130 + Math.random() * 60 });
  if (raf) return;
  const step = () => {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += .42; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.strokeStyle = '#090429'; cx.lineWidth = 2; cx.beginPath();
      if (p.sh === 0) cx.rect(-p.s / 2, -p.s / 2, p.s, p.s); else if (p.sh === 1) cx.arc(0, 0, p.s / 2, 0, 6.3); else cx.rect(-p.s, -p.s / 3, p.s * 2, p.s * .66);
      cx.fill(); cx.stroke(); cx.restore();
    }
    raf = parts.length ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(n => io.observe(n));

/* ---------- section chips + progress ---------- */
const secs = $$('[data-title]'), chips = $('#chips');
secs.forEach(s => {
  const a = document.createElement('a'); a.href = '#' + s.id; a.textContent = s.dataset.title; a.dataset.for = s.id; chips.append(a);
});
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  $$('a', chips).forEach(a => { const on = a.dataset.for === e.target.id; a.classList.toggle('on', on); if (on) { const l = a.offsetLeft - chips.clientWidth / 2 + a.offsetWidth / 2; chips.scrollTo({ left: l, behavior: reduce ? 'auto' : 'smooth' }); } });
}), { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => spy.observe(s));
const bar = $('#bar');
const prog = () => { const h = document.documentElement; bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%'; };
addEventListener('scroll', prog, { passive: true }); prog();
$('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* ---------- cover: tilt + spin ---------- */
const card = $('#coverCard'), logo = $('#coverLogo');
card.addEventListener('pointermove', e => {
  if (reduce || e.pointerType !== 'mouse') return;
  const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  logo.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg) translate(${x * 14}px,${y * 14}px)`;
});
card.addEventListener('pointerleave', () => { logo.style.transform = ''; });
card.addEventListener('click', e => {
  card.classList.remove('spin'); void card.offsetWidth; card.classList.add('spin');
  burst(e.clientX, e.clientY, 40);
});

/* ---------- overview checklist ---------- */
const focus = $$('#focus li'); let handed = false;
focus.forEach(li => li.addEventListener('click', () => {
  li.classList.toggle('on');
  const n = focus.filter(x => x.classList.contains('on')).length;
  $('#meterFill').style.width = (n / focus.length * 100) + '%';
  $('#meterTxt').textContent = `${n}/${focus.length} handed over`;
  if (n === focus.length && !handed) {
    handed = true; const r = $('#focus').getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 40); toast('Brand handed over ✓ legacy preserved');
  }
  if (n < focus.length) handed = false;
}));

/* ---------- logo variations ---------- */
const L = BASE + 'logos/';
const VARS = [
  { k: 'main', n: 'Main logo', f: 'main.svg' }, { k: 'icon', n: 'Icon logo', f: 'icon.svg' },
  { k: 'white', n: 'Flat white logo', f: 'white.svg', needs: 'dark' }, { k: 'black', n: 'Flat black logo', f: 'black.svg' },
  { k: 'wm', n: 'Wordmark', f: 'wm-stack.svg' }, { k: 'wml', n: 'Wordmark - long', f: 'wm-long.svg' }, { k: 'fav', n: 'Favicon', f: 'favicon.svg' }
];
const stage = $('#stage'), sImg = $('#stageImg'), sLab = $('#stageLabel'), warn = $('#stageWarn'), vgrid = $('#vgrid');
let cur = VARS[0];
VARS.forEach(v => {
  const b = document.createElement('button'); b.className = 'vbtn' + (v === cur ? ' on' : ''); b.dataset.tip = 'preview';
  b.innerHTML = `<span class="vi"><img src="${L + v.f}" alt=""></span><span class="l">${v.n}</span>`;
  b.addEventListener('click', () => { cur = v; show(); $$('.vbtn', vgrid).forEach(x => x.classList.toggle('on', x === b)); });
  vgrid.append(b);
});
function show() {
  sImg.style.animation = 'none'; void sImg.offsetWidth; sImg.style.animation = '';
  sImg.src = L + cur.f; sImg.alt = cur.n; sLab.textContent = cur.n;
  warn.classList.toggle('show', cur.needs === 'dark' && stage.dataset.bg !== 'dark');
}
$$('.bgs button').forEach(b => b.addEventListener('click', () => {
  stage.dataset.bg = b.dataset.b; $$('.bgs button').forEach(x => x.classList.toggle('on', x === b)); show();
}));

/* ---------- colors ---------- */
function copy(t) { try { return navigator.clipboard.writeText(t); } catch (e) { return Promise.reject(); } }
$$('.sw').forEach(b => b.addEventListener('click', () => { copy(b.dataset.hex).catch(() => {}); toast(`Copied ${b.dataset.hex}`); const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 40, 24); }));
$$('#venn [data-k]').forEach(n => {
  const on = v => $$('#venn [data-k="' + n.dataset.k + '"]').forEach(x => x.classList.toggle('hot', v));
  n.addEventListener('pointerenter', () => on(true)); n.addEventListener('pointerleave', () => on(false));
});

/* ---------- type tester ---------- */
const tt = $('#tt');
function renderType() {
  const v = tt.value.trim();
  $$('.spec').forEach(s => {
    const txt = v || s.dataset.s;
    if (s.dataset.d) { const [a, ...rest] = txt.split(' '); s.innerHTML = '<span class="b"></span> <span class="w"></span>'; $('.b', s).textContent = a; $('.w', s).textContent = rest.join(' '); if (!rest.length) s.innerHTML = '<span class="b"></span>', $('.b', s).textContent = a; }
    else s.textContent = txt;
  });
}
tt.addEventListener('input', renderType);
$('#ttReset').addEventListener('click', () => { tt.value = ''; renderType(); });
renderType();

/* ---------- lightbox ---------- */
const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'); let group = [], gi = 0;
function openLb(list, i) { group = list; gi = i; paint(); lb.hidden = false; document.body.style.overflow = 'hidden'; }
function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
function paint() { const it = group[gi]; lbImg.src = it.src; lbImg.alt = it.cap; lbCap.textContent = `${it.cap}${group.length > 1 ? `  ·  ${gi + 1}/${group.length}` : ''}`; $('.prev', lb).style.display = $('.next', lb).style.display = group.length > 1 ? '' : 'none'; }
const step = d => { gi = (gi + d + group.length) % group.length; paint(); };
$('.x', lb).addEventListener('click', closeLb); $('.prev', lb).addEventListener('click', () => step(-1)); $('.next', lb).addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
});

/* elements grid */
const STAT = ['Thinker with a laptop', 'Bearded statue with a phone', 'Seated statue with a laptop', 'Roaring statue and laptop', 'Goddess statue with a phone', 'Dark seated thinker', 'Thinker with a phone', 'Statue checking a phone', 'Hourglass statue', 'Crowned statue with a chalice', 'Statue in a MadHack tee', 'Seated statue with a laptop'];
const eg = $('#egrid'), elist = STAT.map((n, i) => ({ src: `${BASE}elements/s${String(i + 1).padStart(2, '0')}.png`, cap: n }));
elist.forEach((it, i) => {
  const b = document.createElement('button'); b.className = 'tile reveal'; b.style.setProperty('--d', (i % 6) * .05 + 's'); b.dataset.tip = 'enlarge';
  b.innerHTML = `<img src="${it.src}" alt="${it.cap}" loading="lazy"><em>${String(i + 1).padStart(2, '0')}</em>`;
  b.addEventListener('click', () => openLb(elist, i)); eg.append(b); io.observe(b);
});

/* certificate */
$('.cert').addEventListener('click', e => openLb([{ src: e.currentTarget.dataset.lb, cap: e.currentTarget.dataset.cap }], 0));

/* ---------- swags: draggable on desktop ---------- */
const swags = $$('.swag'), swList = swags.filter(s => s.dataset.lb).map(s => ({ src: s.dataset.lb, cap: s.dataset.cap, el: s }));
let zc = 10;
swags.forEach(s => {
  s.dataset.tip = s.dataset.lb ? 'drag · click to enlarge' : 'drag me';
  let x = 0, y = 0, moved = false;
  s.addEventListener('pointerdown', e => {
    if (!matchMedia('(min-width:981px)').matches || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const sx = e.clientX - x, sy = e.clientY - y; moved = false; s.classList.remove('snap'); s.setPointerCapture(e.pointerId); s.style.zIndex = ++zc;
    const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (!moved && Math.hypot(dx - x, dy - y) < 5) return; moved = true; s.classList.add('dragging'); x = dx; y = dy; s.style.translate = `${x}px ${y}px`; };
    const up = () => { s.removeEventListener('pointermove', mv); s.removeEventListener('pointerup', up); s.classList.remove('dragging'); };
    s.addEventListener('pointermove', mv); s.addEventListener('pointerup', up);
  });
  s.addEventListener('click', () => {
    if (moved) { moved = false; return; }
    if (s.dataset.lb) openLb(swList, swList.findIndex(i => i.src === s.dataset.lb));
  });
});
// poster copies share one image; only show it once in the viewer
const seen = new Set(); for (let i = swList.length - 1; i >= 0; i--) { if (seen.has(swList[i].src)) swList.splice(i, 1); else seen.add(swList[i].src); }

})();
