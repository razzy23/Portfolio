/* =========================================================
   Rav — portfolio · interaction layer
   ========================================================= */
(() => {
'use strict';

const D = window.SITE;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const isTyping = t => t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

/* ---------- state ---------- */
const KEY = 'rav-portfolio-v1';
const S = { xp: 0, found: [], seen: [], sound: false, dark: false };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const level = () => Math.floor(S.xp / 100) + 1;

const SECRETS = {
  konami:    { name: 'Old school',        hint: 'A famous cheat code from 1986.',               solved: '↑ ↑ ↓ ↓ ← → ← → B A' },
  logo:      { name: 'Logo spin',         hint: 'The logo craves attention.',                   solved: 'Click the R five times, fast.' },
  poke:      { name: 'Personal space',    hint: 'Rav does not enjoy being poked. Keep going.',  solved: 'Click Rav 7 times.' },
  figma:     { name: 'Shape rain',        hint: 'Say the name of the tool this site wears.',    solved: 'Type "figma" anywhere.' },
  dark:      { name: 'Night shift',       hint: 'One key flips the lights.',                    solved: 'Press D.' },
  context:   { name: 'Inspector',         hint: 'Right-click like a developer.',                solved: 'Right-click → Copy as CSS.' },
  sudo:      { name: 'Sudo',              hint: 'Quick actions has a sense of humor.',          solved: 'Type "sudo" in quick actions.' },
  sleep:     { name: 'Sleepy Rav',        hint: 'Do nothing. Seriously. For 20 seconds.',       solved: 'Stay idle for 20s, then wake him.' },
  boomerang: { name: 'Boomerang',         hint: 'Folders do not belong on Rav. Try it.',        solved: 'Drop a folder onto Rav.' }
};
const SECRET_COUNT = Object.keys(SECRETS).length;

/* ---------- sound (off by default) ---------- */
let ac;
function tone(f, d = .08, type = 'square', v = .035, delay = 0) {
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), s = ac.currentTime + delay;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(.0001, s + d);
    o.connect(g).connect(ac.destination); o.start(s); o.stop(s + d + .02);
  } catch (e) {}
}
const sfx = {
  click: () => tone(520, .05),
  open:  () => { tone(392, .07); tone(587, .12, 'square', .035, .07); },
  close: () => tone(300, .08),
  secret:() => [523, 659, 784, 1047].forEach((f, i) => tone(f, .14, 'square', .04, i * .08)),
  lvl:   () => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, .16, 'triangle', .06, i * .07)),
  pop:   () => tone(700, .04, 'sine', .06)
};

/* ---------- toasts / xp / secrets ---------- */
const toastBox = $('#toasts');
function toast(title, sub, kind) {
  const t = el('div', 'toast' + (kind === 'plain' ? ' plain' : ''),
    (kind === 'plain' ? '' : `<span class="t-ico">${kind === 'lvl' ? '▲' : '★'}</span>`) +
    `<div><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`);
  toastBox.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, kind === 'plain' ? 2200 : 3800);
}

const hud = $('#hud');
function renderHud() {
  $('#lvl').textContent = level();
  $('#xpfill').style.width = (S.xp % 100) + '%';
  $('#xptxt').textContent = (S.xp % 100) + '/100 xp';
  $('#secrets').textContent = `★ ${S.found.length}/${SECRET_COUNT}`;
}
function addXP(n) {
  const before = level();
  S.xp += n; save(); renderHud();
  hud.classList.remove('bump'); void hud.offsetWidth; hud.classList.add('bump');
  if (level() > before) { toast('Level up!', `You are now level ${level()}`, 'lvl'); sfx.lvl(); burst(innerWidth * .1, innerHeight - 40, 40); }
}
function once(key, xp) { if (!S.seen.includes(key)) { S.seen.push(key); addXP(xp); } }
function unlock(id) {
  if (S.found.includes(id)) return false;
  S.found.push(id); save();
  toast('Secret unlocked', `${SECRETS[id].name} · +25 xp`);
  sfx.secret(); burst(innerWidth / 2, 120, 70);
  addXP(25);
  if (S.found.length === SECRET_COUNT) setTimeout(() => { toast('All secrets found!', 'You are officially too curious.'); rain(90, true); }, 900);
  const a = wins.get('ach'); if (a) a.refresh && a.refresh();
  return true;
}

/* ---------- confetti ---------- */
const cv = $('#confetti'), cctx = cv.getContext('2d');
const COL = ['#F24E1E', '#FF7262', '#A259FF', '#1ABCFE', '#0ACF83', '#FFE92B'];
let parts = [], raf = 0;
function sizeCanvas() { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cctx.setTransform(r, 0, 0, r, 0, 0); }
function spawn(p) { parts.push(Object.assign({ r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, c: COL[(Math.random() * COL.length) | 0], shape: (Math.random() * 4) | 0, life: 220 }, p)); }
function burst(x, y, n = 60) {
  if (reduce) return;
  for (let i = 0; i < n; i++) spawn({ x, y, vx: (Math.random() - .5) * 16, vy: -Math.random() * 14 - 3, g: .42, s: 6 + Math.random() * 8, life: 110 + Math.random() * 60 });
  loop();
}
function rain(n = 70, big = false) {
  if (reduce) return;
  for (let i = 0; i < n; i++) spawn({ x: Math.random() * innerWidth, y: -30 - Math.random() * innerHeight * .7, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, g: .05, s: big ? 14 + Math.random() * 14 : 10 + Math.random() * 10, life: 600 });
  loop();
}
function drawPart(p) {
  cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.r); cctx.fillStyle = p.c; cctx.strokeStyle = '#1b1918'; cctx.lineWidth = 2;
  const s = p.s; cctx.beginPath();
  if (p.shape === 0) cctx.rect(-s / 2, -s / 2, s, s);
  else if (p.shape === 1) cctx.arc(0, 0, s / 2, 0, 6.29);
  else if (p.shape === 2) { if (cctx.roundRect) cctx.roundRect(-s, -s / 2, s * 2, s, s / 2); else cctx.rect(-s, -s / 2, s * 2, s); }
  else { cctx.arc(0, 0, s / 2, Math.PI, 0); cctx.closePath(); }
  cctx.fill(); cctx.stroke(); cctx.restore();
}
function loop() {
  if (raf) return;
  const step = () => {
    cctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 60);
    for (const p of parts) { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--; drawPart(p); }
    raf = parts.length ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}

/* ---------- generic drag helper ---------- */
function drag(handle, { start, move, end, ignore }) {
  handle.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (ignore && e.target.closest(ignore)) return;
    const sx = e.clientX, sy = e.clientY; let moved = false; const st = start(e);
    try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    const mv = ev => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true; move(dx, dy, st, ev);
    };
    const up = ev => {
      handle.removeEventListener('pointermove', mv);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      if (moved) { handle._moved = true; setTimeout(() => handle._moved = false, 0); }
      end && end(moved, st, ev);
    };
    handle.addEventListener('pointermove', mv);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  });
}

/* =========================================================
   Windows
   ========================================================= */
const winLayer = $('#windows');
const wins = new Map();
let zTop = 100, cascade = 0;

function focusWin(w) { w.style.zIndex = ++zTop; }
function openWindow(id, { title, color, build, width, from }) {
  const existing = wins.get(id);
  if (existing) { focusWin(existing.el); existing.el.classList.remove('shake'); void existing.el.offsetWidth; existing.el.classList.add('shake'); return existing; }

  const win = el('section', 'win');
  win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', title);
  win.style.setProperty('--wc', color || 'var(--yellow)');
  if (width) win.style.width = `min(${width}px, 94vw)`;
  const bar = el('div', 'win-bar', `<span class="win-ico"></span><span class="win-title">${esc(title)}</span><button class="win-x" aria-label="Close window">✕</button>`);
  const body = el('div', 'win-body');
  const rec = { el: win, body, refresh: null };
  build(body, rec);
  win.append(bar, body); winLayer.append(win); focusWin(win);

  const r = win.getBoundingClientRect();
  const off = (cascade++ % 5) * 26 - 52;
  const left = clamp((innerWidth - r.width) / 2 + off, 8, Math.max(8, innerWidth - r.width - 8));
  const top = clamp((innerHeight - r.height) / 2 + off, 64, Math.max(64, innerHeight - r.height - 8));
  win.style.left = left + 'px'; win.style.top = top + 'px';
  if (from) { const f = from.getBoundingClientRect(); win.style.transformOrigin = `${f.left + f.width / 2 - left}px ${f.top + f.height / 2 - top}px`; }

  win.addEventListener('pointerdown', () => focusWin(win));
  $('.win-x', bar).addEventListener('click', () => closeWindow(id));
  drag(bar, {
    ignore: '.win-x',
    start: () => ({ l: parseFloat(win.style.left), t: parseFloat(win.style.top) }),
    move: (dx, dy, s) => {
      win.style.left = clamp(s.l + dx, -win.offsetWidth + 80, innerWidth - 80) + 'px';
      win.style.top = clamp(s.t + dy, 0, innerHeight - 40) + 'px';
    }
  });
  wins.set(id, rec); sfx.open();
  return rec;
}
function closeWindow(id) {
  const w = wins.get(id); if (!w) return;
  wins.delete(id); w.el.classList.add('closing'); sfx.close();
  setTimeout(() => w.el.remove(), 200);
}
function topWindowId() {
  let best = null, z = -1;
  wins.forEach((w, id) => { const v = +w.el.style.zIndex || 0; if (v > z) { z = v; best = id; } });
  return best;
}

/* ---------- window contents ---------- */
function openCategory(key, from) {
  const c = D.categories[key];
  once('open-' + key, 10);
  openWindow('cat-' + key, {
    title: c.file, color: c.color, from, width: 760,
    build(body) {
      const list = () => {
        body.innerHTML = `<div class="crumbs"><span>Drafts</span><i>/</i><b>${esc(c.title)}</b><span class="chip">${c.items.length} ${c.items.length === 1 ? 'file' : 'files'}</span></div>
          <p class="blurb">${esc(c.blurb)}</p><div class="grid"></div>`;
        const grid = $('.grid', body);
        if (!c.items.length) { grid.replaceWith(el('div', 'empty', '<b>Empty folder</b><span>New work is on its way.</span>')); body.scrollTop = 0; return; }
        c.items.forEach((it, i) => {
          const b = el('button', 'card');
          b.innerHTML = `<span class="thumb${it.contain ? ' contain' : ''}" style="--c:${it.bg || c.tint};--l:${c.color}">${it.cover ? `<img src="${esc(it.cover)}" alt="">` : `<span class="glyph">${esc(c.glyph)}</span>`}${it.sample ? '<em class="sample">sample</em>' : ''}</span>
            <span class="meta"><b>${esc(it.title)}</b><small>${esc(it.year)} · ${esc(it.role)}</small></span>`;
          b.addEventListener('click', () => detail(i));
          grid.append(b);
        });
        body.scrollTop = 0;
      };
      const detail = i => {
        const it = c.items[i]; once(`proj-${key}-${i}`, 5); sfx.click();
        body.innerHTML = `<div class="detail">
          <div class="crumbs"><button class="btn ghost" data-back>← files</button><span>${esc(c.title)}</span><i>/</i><b>${esc(it.title)}</b></div>
          <span class="thumb${it.contain ? ' contain' : ''}" style="--c:${it.bg || c.tint};--l:${c.color}">${it.cover ? `<img src="${esc(it.cover)}" alt="">` : `<span class="glyph">${esc(c.glyph)}</span>`}${it.sample ? '<em class="sample">sample</em>' : ''}</span>
          <h2>${esc(it.title)}</h2><p>${esc(it.desc)}</p>
          <dl><dt>Role</dt><dd>${esc(it.role)}</dd><dt>Year</dt><dd>${esc(it.year)}</dd></dl>
          <div class="tags">${it.tools.map(t => `<span class="tag" style="--tc:${c.color}">${esc(t)}</span>`).join('')}</div>
          <div class="btn-row"><a class="btn" href="${esc(it.link || '#')}"${/^https?:/.test(it.link || '') ? ' target="_blank" rel="noopener"' : ''}>${esc(it.cta || 'View project ↗')}</a>
          <button class="btn ghost" data-next>Next file →</button></div></div>`;
        $('[data-back]', body).addEventListener('click', list);
        $('[data-next]', body).addEventListener('click', () => detail((i + 1) % c.items.length));
        body.scrollTop = 0;
      };
      list();
    }
  });
}

function openWork(from) {
  once('open-work', 5); pulseFolders();
  openWindow('work', {
    title: 'my-work.fig', color: '#FFE92B', from, width: 520,
    build(body, rec) {
      body.innerHTML = `<h2>my work</h2><p>Four folders. Pick one — or close this and click the ones on the page.</p><ul class="work-list"></ul>`;
      const ul = $('.work-list', body);
      Object.entries(D.categories).forEach(([k, c]) => {
        const li = el('li'); const b = el('button', 'work-row', `<b>${esc(c.title)}</b><small>${c.items.length ? c.items.length + (c.items.length === 1 ? ' file' : ' files') : 'coming soon'}</small><span class="arrow">→</span>`);
        b.style.setProperty('--tint', c.tint);
        b.addEventListener('click', () => openCategory(k, b)); li.append(b); ul.append(li);
      });
    }
  });
}

function openAbout(from) {
  once('open-about', 10);
  const A = D.about;
  openWindow('about', {
    title: 'about.fig', color: '#FF9ACB', from, width: 720,
    build(body) {
      const css = `.rav {\n  role: <span class="v">designer + developer</span>;\n  also: <span class="v">video editor</span>;\n  fuel: <span class="v">coffee</span>;\n}`;
      body.innerHTML = `<div class="about">
        <div><div class="mini-arch"><img src="assets/rav.png" alt="Rav"></div></div>
        <div><h2>${esc(A.headline)}</h2>${A.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
          <div class="facts">${A.facts.map(f => `<div class="fact"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></div>`).join('')}</div>
          <div class="autolayout"><div class="tags" style="margin:0">${A.skills.map((s, i) => `<span class="tag" style="--tc:${['#A259FF', '#0D99FF', '#0ACF83', '#F24E1E', '#FFB800', '#F23C9E'][i % 6]}">${esc(s)}</span>`).join('')}</div></div>
          <div class="code"><button data-copy>Copy</button><pre>${css}</pre></div>
        </div></div>`;
      $('[data-copy]', body).addEventListener('click', e => {
        copy(`.rav {\n  role: designer + developer;\n  also: video editor;\n  fuel: coffee;\n}`);
        e.target.textContent = 'Copied ✓'; setTimeout(() => e.target.textContent = 'Copy', 1400);
      });
    }
  });
}

function openContact(from) {
  once('open-contact', 10);
  openWindow('contact', {
    title: 'contact.fig', color: '#7B9CF0', from, width: 560,
    build(body) {
      body.innerHTML = `<h2>say hi</h2>
        <div class="thread"><div class="avatar">R</div><div><b>Rav</b><small>just now</small><p style="margin:4px 0 0">Got a project, a question, or a weird idea? Leave a comment — it lands in my inbox.</p></div></div>
        <form class="composer">
          <input name="name" placeholder="Your name" required autocomplete="name">
          <textarea name="msg" rows="4" placeholder="Add a comment…" required></textarea>
          <div class="btn-row" style="margin:0"><button class="btn" type="submit">Post comment ↗</button></div>
        </form>
        <ul class="links">${D.portfolios.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`).join('')}</ul>`;
      if (!D.email) { $('form', body).remove(); $('.thread p', body).textContent = 'Find me on the profiles below.'; return; }
      $('form', body).addEventListener('submit', e => {
        e.preventDefault();
        const f = new FormData(e.target);
        const subj = encodeURIComponent(`Hello from ${f.get('name')} (via your portfolio)`);
        const bod = encodeURIComponent(`${f.get('msg')}\n\n— ${f.get('name')}`);
        toast('Opening your mail app…', 'Comment posted ✓', 'plain'); once('sent', 15);
        location.href = `mailto:${D.email}?subject=${subj}&body=${bod}`;
      });
    }
  });
}

function openAchievements(from) {
  openWindow('ach', {
    title: 'achievements.fig', color: '#0ACF83', from, width: 520,
    build(body, rec) {
      rec.refresh = () => {
        const n = S.found.length, pct = Math.round(n / SECRET_COUNT * 100);
        body.innerHTML = `<h2>level ${level()}</h2><p>${S.xp} xp total · ${n}/${SECRET_COUNT} secrets found</p>
          <div class="progress"><i style="width:${pct}%"></i></div>
          <ul class="ach">${Object.entries(SECRETS).map(([k, s]) => {
            const got = S.found.includes(k);
            return `<li class="${got ? 'got' : ''}"><span class="star">${got ? '★' : '☆'}</span><div><b>${got ? esc(s.name) : '???'}</b><small>${esc(got ? s.solved : s.hint)}</small></div></li>`;
          }).join('')}</ul>
          <div class="btn-row"><button class="btn ghost" data-reset>Reset progress</button></div>`;
        $('[data-reset]', body).addEventListener('click', () => {
          if (confirm('Reset all XP and secrets?')) { S.xp = 0; S.found = []; S.seen = []; save(); renderHud(); rec.refresh(); }
        });
      };
      rec.refresh();
    }
  });
}

function openHelp(from) {
  openWindow('help', {
    title: 'shortcuts.fig', color: '#FFE92B', from, width: 460,
    build(body) {
      const rows = [['V', 'Move'], ['R', 'Rectangle — drag to draw'], ['P', 'Pen — scribble anywhere'], ['C', 'Comment — drop a pin'], ['⌘/Ctrl Z', 'Undo last drawing'],
        ['/  or  ⌘K', 'Quick actions'], ['D', '???'], ['Esc', 'Close / back to Move'], ['Right-click', 'Context menu']];
      body.innerHTML = `<h2>shortcuts</h2><p>Same keys as the app this site is dressed up as.</p><div class="keys">${rows.map(r => `<kbd>${esc(r[0])}</kbd><span>${esc(r[1])}</span>`).join('')}</div>`;
    }
  });
}

/* =========================================================
   Stage: folders, stickies, hero
   ========================================================= */
const stage = $('#stage'), hero = $('#hero');

function addSel(target, withDim = true) {
  const s = el('span', 'sel', '<i></i><i></i><i></i><i></i>' + (withDim ? '<b></b>' : ''));
  target.append(s);
  const upd = () => { const b = $('b', s); if (!b) return; const r = target.getBoundingClientRect(); b.textContent = target === hero ? `Rav — ${Math.round(r.width)} × ${Math.round(r.height)}` : `${Math.round(r.width)} × ${Math.round(r.height * 1)}`; };
  target.addEventListener('pointerenter', upd); target.addEventListener('focus', upd);
}
addSel(hero);

function makeDraggable(node, { onDrop } = {}) {
  let x = 0, y = 0;
  const setPos = () => { node.style.setProperty('--dx', x + 'px'); node.style.setProperty('--dy', y + 'px'); };
  node._reset = () => { x = 0; y = 0; node.classList.add('snap'); setPos(); setTimeout(() => node.classList.remove('snap'), 650); };
  drag(node, {
    start: () => { node.classList.remove('snap'); return { x, y }; },
    move: (dx, dy, s) => { node.classList.add('dragging'); x = s.x + dx; y = s.y + dy; setPos(); },
    end: moved => { node.classList.remove('dragging'); if (moved) { sfx.pop(); onDrop && onDrop(node); } }
  });
}

$$('.folder').forEach(f => {
  addSel(f);
  const cnt = D.categories[f.dataset.cat].items.length;
  if (cnt) f.querySelector('.f-inner').append(el('span', 'f-count', String(cnt)));
  makeDraggable(f, {
    onDrop: node => {
      const a = node.getBoundingClientRect(), h = hero.getBoundingClientRect();
      const cx = a.left + a.width / 2, cy = a.top + a.height / 2;
      if (cx > h.left + h.width * .15 && cx < h.right - h.width * .15 && cy > h.top + h.height * .1) {
        unlock('boomerang'); say("hey, that's my spot!", 2400, { x: cx, y: cy - 30 }); node._reset();
      }
    }
  });
  f.addEventListener('click', e => { if (f._moved) { e.preventDefault(); return; } sfx.click(); openCategory(f.dataset.cat, f); });
});
$$('.sticky').forEach(s => makeDraggable(s));

function pulseFolders() { $$('.folder').forEach(f => { f.classList.remove('pulse'); void f.offsetWidth; f.classList.add('pulse'); setTimeout(() => f.classList.remove('pulse'), 1300); }); }

/* poke Rav */
const ARCHES = ['#FF7262', '#A259FF', '#1ABCFE', '#0ACF83', '#FFB800', '#FFE92B'];
const POKES = ['ow.', 'hey!', 'personal space!', 'that tickles', 'stop it :)', 'ok ok i get it', '…you are persistent'];
let pokes = 0;
hero.addEventListener('click', e => {
  pokes++; sfx.pop();
  hero.classList.remove('poke'); void hero.offsetWidth; hero.classList.add('poke');
  hero.style.setProperty('--arch-color', ARCHES[(pokes - 1) % ARCHES.length]);
  say(POKES[Math.min(pokes - 1, POKES.length - 1)], 2200, { x: e.clientX, y: e.clientY });
  if (pokes >= 7 && unlock('poke')) { hero.classList.add('wiggle'); setTimeout(() => hero.classList.remove('wiggle'), 1000); }
});

/* logo */
const logo = $('#logo'); let logoClicks = [];
logo.addEventListener('click', e => {
  e.preventDefault(); sfx.click();
  const now = Date.now(); logoClicks = logoClicks.filter(t => now - t < 3000); logoClicks.push(now);
  if (logoClicks.length >= 5) { logoClicks = []; logo.classList.remove('spin'); void logo.offsetWidth; logo.classList.add('spin'); unlock('logo'); }
});

/* nav */
$$('[data-open]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault(); sfx.click();
  ({ about: openAbout, work: openWork, contact: openContact })[a.dataset.open](a);
}));

/* =========================================================
   Visitor pointer: random colour, speech bubble on hover / interaction
   ========================================================= */
const ptr = $('#pointer'), pill = $('.pill', ptr);
const PCOL = ['#FF7262', '#A259FF', '#1ABCFE', '#0ACF83', '#FFB800', '#F23C9E', '#7B9CF0', '#FF8A3D'];
let pcol = '', tip = '', sayText = '', sayUntil = 0, sayT = 0, shown = '', sleeping = false, lastAct = Date.now();
function randColor() { let c; do { c = PCOL[(Math.random() * PCOL.length) | 0]; } while (c === pcol); pcol = c; ptr.style.setProperty('--pc', c); }
randColor();
function render() {
  const saying = performance.now() < sayUntil, text = saying ? sayText : tip;
  if (text) {
    if (text !== shown) { pill.textContent = text; shown = text; pill.style.animation = 'none'; void pill.offsetWidth; pill.style.animation = ''; }
    ptr.classList.add('talk'); ptr.classList.toggle('say', saying);
  } else { ptr.classList.remove('talk', 'say'); shown = ''; }
}
function say(text, ms = 2600) {
  sayText = text; sayUntil = performance.now() + ms; ptr.classList.add('show'); render();
  clearTimeout(sayT); sayT = setTimeout(() => { render(); if (coarse && !tip) ptr.classList.remove('show'); }, ms + 30);
}
function tipFor(t) {
  if (!t || !t.closest) return '';
  const d = t.closest('[data-tip]'); if (d) return d.dataset.tip;
  if (t.closest('.tool-layer')) return { rect: 'drag to draw', pen: 'scribble!', comment: 'drop a comment' }[tool] || '';
  if (t.closest('.win-x')) return 'close';
  if (t.closest('.win-bar')) return 'drag me';
  if (t.closest('.card')) return 'open file';
  if (t.closest('.work-row')) return 'open →';
  if (t.closest('.links a, a.btn')) return 'visit ↗';
  if (t.closest('.palette li')) return 'run';
  if (t.closest('.ctx')) return '';
  if (t.closest('button, a')) return 'click';
  return '';
}
function place(e) {
  ptr.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  ptr.classList.toggle('flip', e.clientX > innerWidth - 240);
  ptr.classList.toggle('below', e.clientY < 70);
}
function sleep() { sleeping = true; say('zzz…', 600000); }
function activity() {
  lastAct = Date.now();
  if (sleeping) { sleeping = false; say('…oh! hi 👋', 2200); unlock('sleep'); }
}
addEventListener('pointermove', e => { activity(); place(e); if (e.pointerType === 'mouse') ptr.classList.add('show'); }, { passive: true });
addEventListener('pointerdown', e => {
  activity(); place(e);
  if (e.pointerType === 'mouse') { randColor(); ptr.classList.add('click'); setTimeout(() => ptr.classList.remove('click'), 160); }
}, { passive: true });
addEventListener('pointerover', e => {
  ptr.classList.toggle('hide', isTyping(e.target));
  tip = e.pointerType === 'mouse' ? tipFor(e.target) : ''; render();
});
document.documentElement.addEventListener('mouseleave', () => ptr.classList.remove('show'));
setInterval(() => { if (!sleeping && Date.now() - lastAct > 20000) sleep(); }, 1000);

/* tooltips: move title="" into data-tip so the bubble replaces native tooltips */
$$('[title]').forEach(n => { if (!n.getAttribute('aria-label')) n.setAttribute('aria-label', n.title); n.dataset.tip = n.title; n.removeAttribute('title'); });
$$('[data-open]').forEach(n => n.dataset.tip = 'open ' + n.textContent.trim());
$$('.folder').forEach(n => n.dataset.tip = 'open ' + D.categories[n.dataset.cat].title);
$$('.sticky').forEach(n => n.dataset.tip = 'drag me');
hero.dataset.tip = 'poke me'; logo.dataset.tip = 'home?';
makeDraggable($('.rav-tag'));

/* portfolio links on the stage */
(() => {
  const box = el('div', 'plinks', '<span class="plabel">find me elsewhere ↓</span>'), row = el('div', 'prow');
  D.portfolios.forEach((p, i) => {
    const a = el('a', 'pitem', `<span class="ptile${p.pad ? ' pad' : ''}" style="--tb:${esc(p.bg)}"><img src="${esc(p.img)}" alt="" draggable="false"></span><small>${esc(p.label.toLowerCase())}</small>`);
    a.href = p.url; a.target = '_blank'; a.rel = 'noopener'; a.draggable = false; a.style.setProperty('--i', i);
    a.dataset.tip = p.label.toLowerCase() + ' ↗'; a.setAttribute('aria-label', `${p.label} (opens in a new tab)`);
    makeDraggable(a);
    a.addEventListener('click', e => { if (a._moved) { e.preventDefault(); return; } once('link-' + p.key, 5); sfx.click(); });
    row.append(a);
  });
  box.append(row); stage.append(box);
})();

/* =========================================================
   Tools: rect / pen / comment
   ========================================================= */
const ink = $('#ink'), layer = $('#toolLayer'), swatch = $('#swatch');
const SW = ['#FF7262', '#FFE92B', '#0ACF83', '#1ABCFE', '#A259FF', '#1b1918'];
let swI = 0, tool = 'move'; const layers = [];
const NS = 'http://www.w3.org/2000/svg';
const swColor = () => SW[swI];
swatch.style.setProperty('--sw', swColor());
swatch.addEventListener('click', () => { swI = (swI + 1) % SW.length; swatch.style.setProperty('--sw', swColor()); sfx.click(); });

function setTool(t) {
  tool = t; document.body.dataset.tool = t;
  $$('.toolbar .tool[data-tool]').forEach(b => b.classList.toggle('is-on', b.dataset.tool === t));
  $$('.pin.compose').forEach(p => p.remove());
}
$$('.toolbar .tool[data-tool]').forEach(b => b.addEventListener('click', () => { setTool(b.dataset.tool); sfx.click(); }));
$('#paletteBtn').addEventListener('click', () => openPalette());

let draft = null;
layer.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const x = e.clientX, y = e.clientY;
  if (tool === 'comment') { composePin(x, y); return; }
  layer.setPointerCapture(e.pointerId);
  if (tool === 'pen') {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${x} ${y}`); p.style.stroke = swColor();
    if (swColor() === '#1b1918') p.style.stroke = 'var(--ink)';
    ink.append(p); draft = { type: 'pen', node: p, d: `M${x} ${y}` };
  } else if (tool === 'rect') {
    const g = document.createElementNS(NS, 'g');
    const sh = document.createElementNS(NS, 'rect'), r = document.createElementNS(NS, 'rect');
    sh.setAttribute('fill', 'var(--ink)'); r.setAttribute('fill', swColor()); r.setAttribute('stroke', 'var(--ink)'); r.setAttribute('stroke-width', 2.5); r.setAttribute('rx', 4); sh.setAttribute('rx', 4);
    g.append(sh, r); ink.append(g); draft = { type: 'rect', node: g, sh, r, x, y };
  }
});
layer.addEventListener('pointermove', e => {
  if (!draft) return;
  if (draft.type === 'pen') { draft.d += ` L${e.clientX} ${e.clientY}`; draft.node.setAttribute('d', draft.d); }
  else {
    const x = Math.min(draft.x, e.clientX), y = Math.min(draft.y, e.clientY), w = Math.abs(e.clientX - draft.x), h = Math.abs(e.clientY - draft.y);
    [[draft.sh, 5], [draft.r, 0]].forEach(([n, o]) => { n.setAttribute('x', x + o); n.setAttribute('y', y + o); n.setAttribute('width', w); n.setAttribute('height', h); });
  }
});
const endDraw = () => {
  if (!draft) return;
  const small = draft.type === 'rect' ? (+draft.r.getAttribute('width') || 0) < 6 : false;
  if (small) draft.node.remove(); else { layers.push(draft.node); once('drew', 5); sfx.pop(); }
  draft = null;
};
layer.addEventListener('pointerup', endDraw); layer.addEventListener('pointercancel', endDraw);

function composePin(x, y) {
  $$('.pin.compose').forEach(p => p.remove());
  const pin = el('div', 'pin compose', 'Y');
  pin.style.left = x + 'px'; pin.style.top = y + 'px';
  const bub = el('div', 'bubble', '<input placeholder="Add a comment…" maxlength="80" aria-label="Comment text">');
  pin.append(bub); document.body.append(pin);
  const inp = $('input', bub); inp.focus();
  pin.addEventListener('pointerdown', e => e.stopPropagation());
  inp.addEventListener('keydown', e => {
    if (e.key === 'Escape') { pin.remove(); e.stopPropagation(); }
    if (e.key === 'Enter' && inp.value.trim()) {
      pin.classList.remove('compose'); bub.innerHTML = `<b>You</b>${esc(inp.value.trim())}`;
      layers.push(pin); once('comment', 5); sfx.pop(); setTool('move');
      say('nice comment 👀', 2000);
    }
  });
}
function undo() { const n = layers.pop(); if (n) n.remove(); }
function clearDrawings() { while (layers.length) layers.pop().remove(); toast('Canvas cleared', '', 'plain'); }

/* =========================================================
   Theme, party, copy
   ========================================================= */
function setDark(on, fromKey) {
  S.dark = on; save();
  document.documentElement.dataset.theme = on ? 'dark' : 'light';
  if (fromKey) unlock('dark');
}
function party() {
  document.body.classList.add('party'); burst(innerWidth / 2, innerHeight / 2, 120); rain(60); sfx.lvl();
  say('PARTY MODE 🎉', 3000); setTimeout(() => document.body.classList.remove('party'), 8000);
}
async function copy(text) { try { await navigator.clipboard.writeText(text); } catch (e) {} }
function copyCss() {
  const r = hero.getBoundingClientRect();
  copy(`.arch {\n  width: ${Math.round(r.width)}px;\n  height: ${Math.round(r.height)}px;\n  background: ${getComputedStyle(hero).getPropertyValue('--arch-color').trim() || '#FFE92B'};\n  border-radius: 50% 50% 0 50%;\n}`);
  toast('Copied as CSS', 'Dev mode: on', 'plain'); unlock('context');
}
function setSound(on) {
  S.sound = on; save(); $('#soundBtn').setAttribute('aria-pressed', on);
  if (on) { sfx.open(); toast('Sound on', '', 'plain'); }
}
$('#soundBtn').addEventListener('click', () => setSound(!S.sound));
$('#helpBtn').addEventListener('click', e => openHelp(e.currentTarget));
hud.addEventListener('click', () => openAchievements(hud));

/* =========================================================
   Command palette  ( / or ⌘K )
   ========================================================= */
const pWrap = $('#paletteWrap'), pInput = $('#paletteInput'), pList = $('#paletteList');
let pItems = [], pSel = 0;
const ACTIONS = () => [
  { ic: '◐', label: 'Open: About', run: () => openAbout() },
  { ic: '▤', label: 'Open: My work', run: () => openWork() },
  { ic: '◧', label: 'Open: UI/UX', run: () => openCategory('uiux') },
  { ic: '‹›', label: 'Open: Web', run: () => openCategory('web') },
  { ic: 'Aa', label: 'Open: Graphics', run: () => openCategory('graphics') },
  { ic: '▶', label: 'Open: Video', run: () => openCategory('video') },
  { ic: '✉', label: 'Open: Contact', run: () => openContact() },
  { ic: '★', label: 'Achievements', run: () => openAchievements() },
  { ic: '☾', label: S.dark ? 'Switch to light mode' : 'Switch to dark mode', hint: 'D', run: () => setDark(!S.dark, true) },
  { ic: '♪', label: S.sound ? 'Sound: turn off' : 'Sound: turn on', run: () => setSound(!S.sound) },
  { ic: '✺', label: 'Party mode', run: party },
  { ic: '⌫', label: 'Clear drawings', hint: '⌘Z', run: clearDrawings },
  { ic: '?', label: 'Keyboard shortcuts', run: () => openHelp() },
  { ic: '↺', label: 'Reset the arch colour', run: () => hero.style.removeProperty('--arch-color') }
];
function renderPalette() {
  const q = pInput.value.trim().toLowerCase();
  let items = ACTIONS().filter(a => a.label.toLowerCase().includes(q));
  if (q.startsWith('sudo')) items = [{ ic: '#', label: q, hint: 'enter', run: () => { toast('rav is not in the sudoers file.', 'This incident will be reported.', 'plain'); unlock('sudo'); } }];
  pItems = items; pSel = clamp(pSel, 0, Math.max(0, items.length - 1));
  pList.innerHTML = '';
  if (!items.length) pList.append(el('li', '', '<span class="ic">∅</span>No results'));
  items.forEach((a, i) => {
    const li = el('li', i === pSel ? 'sel-i' : '', `<span class="ic">${esc(a.ic)}</span>${esc(a.label)}${a.hint ? `<span class="hint">${esc(a.hint)}</span>` : ''}`);
    li.setAttribute('role', 'option');
    li.addEventListener('mousemove', () => { if (pSel !== i) { pSel = i; renderPalette(); } });
    li.addEventListener('click', () => runPalette(i));
    pList.append(li);
  });
}
function runPalette(i) { const a = pItems[i]; if (!a) return; closePalette(); sfx.click(); a.run(); }
function openPalette() { pWrap.hidden = false; pInput.value = ''; pSel = 0; renderPalette(); pInput.focus(); sfx.pop(); }
function closePalette() { pWrap.hidden = true; pInput.blur(); }
pInput.addEventListener('input', () => { pSel = 0; renderPalette(); });
pInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); pSel = (pSel + 1) % Math.max(1, pItems.length); renderPalette(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); pSel = (pSel - 1 + pItems.length) % Math.max(1, pItems.length); renderPalette(); }
  else if (e.key === 'Enter') { e.preventDefault(); runPalette(pSel); }
});
pWrap.addEventListener('pointerdown', e => { if (e.target === pWrap) closePalette(); });

/* =========================================================
   Context menu
   ========================================================= */
const ctx = $('#ctx');
function showCtx(x, y) {
  const items = [
    ['Quick actions…', '/', openPalette], ['Copy as CSS', '', copyCss], ['Copy link', '', () => { copy(location.href); toast('Link copied', '', 'plain'); }], null,
    [S.dark ? 'Light mode' : 'Dark mode', 'D', () => setDark(!S.dark, true)], ['Party mode', '', party], null,
    ['Hire Rav', '', () => openContact()]
  ];
  ctx.innerHTML = '';
  items.forEach(it => {
    if (!it) { ctx.append(el('hr')); return; }
    const li = el('li', '', `${esc(it[0])}<span>${esc(it[1])}</span>`); li.setAttribute('role', 'menuitem');
    li.addEventListener('click', () => { hideCtx(); it[2](); }); ctx.append(li);
  });
  ctx.hidden = false;
  const r = ctx.getBoundingClientRect();
  ctx.style.left = clamp(x, 6, innerWidth - r.width - 6) + 'px'; ctx.style.top = clamp(y, 6, innerHeight - r.height - 6) + 'px';
}
const hideCtx = () => { ctx.hidden = true; };
addEventListener('contextmenu', e => {
  if (isTyping(e.target) || e.target.closest('.win,.palette')) return;
  e.preventDefault(); showCtx(e.clientX, e.clientY);
});
addEventListener('pointerdown', e => { if (!ctx.hidden && !e.target.closest('.ctx')) hideCtx(); });
addEventListener('scroll', hideCtx, true); addEventListener('blur', hideCtx);

/* =========================================================
   Keyboard
   ========================================================= */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kBuf = [], tBuf = '';
addEventListener('keydown', e => {
  activity();
  const typing = isTyping(e.target);
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pWrap.hidden ? openPalette() : closePalette(); return; }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); undo(); return; }
  if (e.key === 'Escape') {
    if (!pWrap.hidden) return closePalette();
    if (!ctx.hidden) return hideCtx();
    if ($('.pin.compose')) return $('.pin.compose').remove();
    if (tool !== 'move') return setTool('move');
    const id = topWindowId(); if (id) closeWindow(id);
    return;
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

  // secret sequences
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kBuf.push(k); kBuf = kBuf.slice(-KONAMI.length);
  if (kBuf.join() === KONAMI.join()) { kBuf = []; if (unlock('konami')) party(); else party(); }
  if (e.key.length === 1) { tBuf = (tBuf + k).slice(-8); if (tBuf.endsWith('figma')) { tBuf = ''; rain(80, true); unlock('figma'); } }

  if (e.key === '/') { e.preventDefault(); openPalette(); return; }
  if (e.key === '?') { openHelp(); return; }
  const map = { v: 'move', r: 'rect', p: 'pen', c: 'comment' };
  if (map[k]) { setTool(map[k]); sfx.click(); }
  else if (k === 'd') setDark(!S.dark, true);
});

/* =========================================================
   Boot
   ========================================================= */
function openFromHash() {
  const h = location.hash.slice(1);
  if (h === 'about') openAbout(); else if (h === 'work') openWork(); else if (h === 'contact') openContact();
  else if (D.categories[h]) openCategory(h);
}
function start() {
  document.body.classList.add('ready');
  openFromHash();
}
function init() {
  document.documentElement.dataset.theme = S.dark ? 'dark' : 'light';
  $('#soundBtn').setAttribute('aria-pressed', S.sound);
  renderHud(); sizeCanvas(); addEventListener('resize', sizeCanvas);
  let quick = false; try { quick = sessionStorage.getItem('rav-booted') === '1'; sessionStorage.setItem('rav-booted', '1'); } catch (e) {}
  const boot = $('#boot');
  if (quick || reduce) { boot.classList.add('done'); start(); }
  else setTimeout(() => { boot.classList.add('done'); start(); }, 1000);
}
init();

console.log('%c R ', 'background:#FFE92B;color:#1b1918;font:700 20px monospace;border:2px solid #1b1918', '\nHey, a fellow developer 👋  There are 9 secrets on this page. Konami works.');
})();
