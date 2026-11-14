/* Shared helpers for case-study pages (toast, confetti, reveal, chips, screen viewer, lightbox).
   Pages: Coco, Travello. Older pages keep their own scripts. */
window.Kit = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    $$('.toast').forEach(t => t.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status'); document.body.append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 1700);
  }

  /* confetti */
  let colors = ['#000'], parts = [], raf = 0, cv, cx;
  function sizeCv() { if (!cv) return; const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); }
  function burst(x, y, n = 50) {
    if (reduce || !cv) return;
    for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 15, vy: -Math.random() * 13 - 3, r: Math.random() * 6, vr: (Math.random() - .5) * .4, s: 6 + Math.random() * 8, c: colors[(Math.random() * colors.length) | 0], life: 110 + Math.random() * 50 });
    if (raf) return;
    const step = () => {
      cx.clearRect(0, 0, innerWidth, innerHeight); parts = parts.filter(p => p.life > 0);
      for (const p of parts) { p.vy += .4; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.strokeStyle = '#111'; cx.lineWidth = 2; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); cx.strokeRect(-p.s / 2, -p.s / 2, p.s, p.s); cx.restore(); }
      raf = parts.length ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
  }

  /* reveal + section chips + progress */
  function init(opts = {}) {
    colors = opts.colors || colors; cv = $('#confetti'); if (cv) { cx = cv.getContext('2d'); sizeCv(); addEventListener('resize', sizeCv); }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
    $$('.reveal').forEach(n => io.observe(n)); Kit.observe = n => io.observe(n);
    const chips = $('#chips'), secs = $$('section[data-title]');
    secs.forEach(s => { const a = document.createElement('a'); a.href = '#' + s.id; a.textContent = s.dataset.title; a.dataset.for = s.id; chips.append(a); });
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      $$('a', chips).forEach(a => { const on = a.dataset.for === e.target.id; a.classList.toggle('on', on); if (on) chips.scrollTo({ left: a.offsetLeft - chips.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); });
    }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => spy.observe(s));
    const bar = $('#bar');
    const prog = () => { const h = document.documentElement, p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight); if (bar) bar.style.width = (p * 100) + '%'; opts.onProgress && opts.onProgress(p); };
    addEventListener('scroll', prog, { passive: true }); addEventListener('resize', prog); prog();
    const top = $('#toTop'); if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  }

  /* copy helper */
  const copy = t => { try { return navigator.clipboard.writeText(t); } catch (e) { return Promise.resolve(); } };

  /* lightbox for a single image */
  function lightbox() {
    const lb = $('#lb'), img = $('#lbImg'); if (!lb) return () => {};
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
    $('.x', lb).addEventListener('click', close); lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
    return (src, alt = '') => { img.src = src; img.alt = alt; lb.hidden = false; document.body.style.overflow = 'hidden'; };
  }

  /* phone screen viewer */
  function walk(cfg) {
    const { tabs, src, onStep, start = Object.keys(tabs)[0] } = cfg;
    const tabsEl = $('#walkTabs'), strip = $('#strip'), img = $('#phoneImg'), phone = $('#phone');
    let tab = start, step = 0;
    Object.entries(tabs).forEach(([k, t]) => { const b = document.createElement('button'); b.className = 'tab' + (k === tab ? ' on' : ''); b.textContent = t.n; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => go(k, 0)); tabsEl.append(b); });
    function render(dir) {
      const T = tabs[tab], s = T.steps[step];
      $$('.tab', tabsEl).forEach(b => b.classList.toggle('on', b.dataset.k === tab));
      img.className = ''; void img.offsetWidth; img.className = dir ? (dir > 0 ? 'in-next' : 'in-prev') : '';
      img.src = src(tab, step, s); img.alt = `${T.n}: ${s.t}`;
      $('#count').textContent = `${step + 1} / ${T.steps.length}`;
      $('#stepLabel').textContent = `${T.n} · screen ${step + 1}`; $('#stepTitle').textContent = s.t; $('#stepNote').textContent = s.d;
      strip.innerHTML = '';
      T.steps.forEach((x, i) => { const b = document.createElement('button'); b.className = 'thumb' + (i === step ? ' on' : ''); b.dataset.tip = x.t; b.innerHTML = `<img src="${src(tab, i, x)}" alt="" loading="lazy">`; b.addEventListener('click', () => { const dd = i - step; step = i; render(Math.sign(dd)); }); strip.append(b); });
      const on = $('.thumb.on', strip); if (on) strip.scrollTo({ left: on.offsetLeft - strip.clientWidth / 2 + on.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      onStep && onStep(tab, step, s, T);
    }
    function go(k, i = 0) { tab = k; step = Math.min(i, tabs[k].steps.length - 1); render(0); }
    function move(d) { const n = tabs[tab].steps.length; step = (step + d + n) % n; render(d); }
    $('#next').addEventListener('click', () => move(1)); $('#prev').addEventListener('click', () => move(-1));
    phone.dataset.tip = 'click · next screen'; let sx = null;
    phone.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } });
    phone.addEventListener('pointerdown', e => { sx = e.clientX; });
    phone.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1); else if (e.pointerType === 'mouse') move(1); });
    render(0);
    return { go, move };
  }

  return { $, $$, reduce, toast, burst, init, copy, lightbox, walk };
})();
