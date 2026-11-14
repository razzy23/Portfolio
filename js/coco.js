/* COCO case study — interactions (uses js/kit.js) */
(() => {
'use strict';
const { $, $$, toast, burst, reduce } = Kit;
const B = '../assets/work/coco/';
Kit.init({ colors: ['#F3734E', '#FDC62D', '#A49EF9', '#B1ECD3', '#fff'] });
const openLb = Kit.lightbox();

/* hero */
const brand = $('#brand');
brand.addEventListener('click', e => { brand.classList.remove('woof'); void brand.offsetWidth; brand.classList.add('woof'); toast('woof! 🐶'); burst(e.clientX, e.clientY, 36); });
const hp = $('#heroPhone');
hp.addEventListener('pointermove', e => { if (reduce || e.pointerType !== 'mouse') return; const r = hp.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; hp.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 16}deg)`; });
hp.addEventListener('pointerleave', () => { hp.style.transform = ''; });

/* screens */
const TABS = {
  onb: { n: 'Onboarding', steps: [
    { i: 'onboarding/ob-1', t: 'Welcome', d: 'Your one-stop-shop for all things pet related, with an “And Here’s How” prompt to start the tour.' },
    { i: 'onboarding/ob-2', t: 'All your pets’ information in one place', d: 'From their live vital metrics to current location; a glance at the dashboard is all that’s required.' },
    { i: 'onboarding/ob-3', t: 'Book an appointment with your local vet in minutes', d: 'Easy scheduling and repeat scheduling of vet appointments to make sure you never miss that annual shot again.' },
    { i: 'onboarding/ob-4', t: 'IOT devices: more control of your schedule', d: 'Set your device to dispense food at automatic intervals, or manually do so at the click of a button.' },
    { i: 'onboarding/ob-5', t: 'Recommendations specially curated for your pets', d: 'Explore the wide range of services and products by COCO.' }
  ] },
  app: { n: 'The app', steps: [
    { i: 'screens/login', t: 'Welcome back', d: 'The pets registered under your account, with a way to add a new one and continue.' },
    { i: 'screens/dashboard', t: 'Check up on your pets', d: 'A pet’s vital metrics as colour-coded tiles, with the pet picker along the bottom.' },
    { i: 'screens/bookings', t: 'Appointments', d: 'Emergency, current and schedule tabs, a month calendar, and the upcoming vet appointments listed below.' },
    { i: 'screens/ecommerce', t: 'Shop', d: 'Search, category chips, recommendations picked for the selected pet, and bundles.' },
    { i: 'screens/iot', t: 'Devices', d: 'Connected gadgets like the feeder: what is left in the bowl, next feeds and manual control.' }
  ] }
};
const walk = Kit.walk({ tabs: TABS, start: 'onb', src: (t, i, s) => `${B}${s.i}.jpg` });

/* pillars → screens */
const PILLARS = [
  { n: 1, t: 'All your pets’ information in one place', d: 'From their live vital metrics to current location; a glance at the dashboard is all that’s required.', c: '#F3734E', go: ['app', 1] },
  { n: 2, t: 'Book an appointment with your local vet in minutes', d: 'Easy scheduling and repeat scheduling of vet appointments to make sure you never miss that annual shot again.', c: '#FDC27C', go: ['app', 2] },
  { n: 3, t: 'IOT devices: more control of your schedule', d: 'Set your device to dispense food at automatic intervals, or manually do so at the click of a button.', c: '#B1ECD3', go: ['app', 4] },
  { n: 4, t: 'Recommendations specially curated for your pets', d: 'Explore the wide range of services and products by COCO.', c: '#A49EF9', go: ['app', 3] }
];
const goScreens = (tab, i) => { walk.go(tab, i); $('#screens').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
PILLARS.forEach((p, i) => {
  const b = document.createElement('button'); b.className = 'pillar reveal'; b.style.setProperty('--c', p.c); b.style.setProperty('--d', i * .07 + 's'); b.dataset.tip = 'see it in the app';
  b.innerHTML = `<span class="n">${p.n}</span><b></b><span class="t"></span><em>see it →</em>`; $('b', b).textContent = p.t; $('.t', b).textContent = p.d;
  b.addEventListener('click', () => goScreens(...p.go)); $('#pillars').append(b); Kit.observe(b);
});

/* journey */
const PH = [
  { n: 'Motivation', e: '😐', y: 88, tasks: ['Notice Bella’s food stocks are low', 'Open E-commerce page in app'], th: '“Oh c’mon we’re out of Bella’s Crunkles AGAIN???”', opp: ['Communicate availability of E-commerce functionality during onboarding process.', 'Have a separate tab for E-commerce activities'], go: ['onb', 4, 'See the onboarding →'] },
  { n: 'Explore', e: '🙂', y: 68, tasks: ['Set profile to Bella', 'Filter based on food'], th: '“Seems like they recommend new snacks based on what Bella preferred in the past as well.”', opp: ['Allow to filter items.', 'Recommend based on pet profiles.', 'Recommend other related items.'], go: ['app', 3, 'See the shop →'] },
  { n: 'Evaluate', e: '😌', y: 48, tasks: ['Click on item', 'Read item details', 'Set quantity', 'Add item to cart'], th: '“Let’s see if this would really be something Bella would like.”', opp: ['Present details about product clearly.', 'Save item in Cart', 'Forward to checkout.'] },
  { n: 'Purchase', e: '😄', y: 22, tasks: ['Read summary of cart', 'Click Checkout button'], th: '“Wow that was superbly convenient!”', opp: ['Show summary of cart.', 'Email user with Bill and notify Courier details through mobile.'] }
];
const xs = [50, 150, 250, 350];
const jPh = $('#jPhases'); let ji = 0, playing = 0;
const svg = $('#jCurve'), track = document.createElement('div'); track.className = 'j-track'; svg.replaceWith(track);
svg.setAttribute('viewBox', '0 0 400 100'); svg.innerHTML = `<path d="M50 88 C100 88 100 68 150 68 S200 48 250 48 S300 22 350 22" pathLength="1" class="base"/><path id="jDone" d="M50 88 C100 88 100 68 150 68 S200 48 250 48 S300 22 350 22" pathLength="1" class="done"/>`;
track.append(svg);
PH.forEach((p, i) => {
  const b = document.createElement('button'); b.className = 'j-ph'; b.innerHTML = `<i>${p.e}</i><span>${p.n}</span>`; b.setAttribute('role', 'tab'); b.addEventListener('click', () => { stopPlay(); show(i); }); jPh.append(b);
  const f = document.createElement('button'); f.className = 'j-fb'; f.textContent = p.e; f.style.left = (xs[i] / 4) + '%'; f.style.bottom = (100 - p.y) + '%'; f.setAttribute('aria-label', p.n); f.addEventListener('click', () => { stopPlay(); show(i); }); track.append(f);
});
function show(i) {
  ji = i; const p = PH[i];
  $$('.j-ph', jPh).forEach((b, k) => b.classList.toggle('on', k === i)); $$('.j-fb', track).forEach((b, k) => b.classList.toggle('on', k === i));
  $('#jDone').style.strokeDashoffset = 1 - i / 3;
  const fill = (id, arr) => { const u = $(id); u.innerHTML = ''; arr.forEach((t, k) => { const li = document.createElement('li'); li.textContent = t; li.style.animationDelay = k * .06 + 's'; u.append(li); }); };
  fill('#jTasks', p.tasks); fill('#jOpp', p.opp); $('#jThought').textContent = p.th;
  const face = $('#jFace'); face.textContent = p.e; face.classList.remove('pop'); void face.offsetWidth; face.classList.add('pop');
  const g = $('#jGo'); if (p.go) { g.hidden = false; g.textContent = p.go[2]; g.onclick = () => goScreens(p.go[0], p.go[1]); } else g.hidden = true;
}
function stopPlay() { clearInterval(playing); playing = 0; $('#jPlay').textContent = '▶ Play the journey'; }
$('#jPlay').addEventListener('click', e => {
  if (playing) return stopPlay();
  $('#jPlay').textContent = '■ Stop'; show(0);
  playing = setInterval(() => { if (ji >= 3) { stopPlay(); toast('Wow that was superbly convenient! 😄'); const r = $('#jFace').getBoundingClientRect(); burst(r.left, r.top, 50); } else show(ji + 1); }, 1900);
});
show(0);

/* design system */
const SW = [['Coral', '#F3734E'], ['Sunshine', '#FDC62D'], ['Lavender', '#A49EF9'], ['Mint', '#B1ECD3']];
SW.forEach(([n, h]) => { const b = document.createElement('button'); b.className = 'sw'; b.dataset.tip = 'copy ' + h; b.innerHTML = `<span class="box" style="--c:${h}"></span><b>${n}</b><code>${h}</code>`; b.addEventListener('click', () => { Kit.copy(h); toast('Copied ' + h); const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 20, 22); }); $('#swatches').append(b); });
const TYPES = [
  ['Display', "700 34px/1 'Space Grotesk'", '', 'Space Grotesk Bold · 34'], ['Title', "700 24px/1.1 'Space Grotesk'", '', 'Space Grotesk Bold · 24'], ['Subtitle', "400 20px/1.2 'Space Grotesk'", '', 'Space Grotesk Regular · 20'],
  ['Topics', "500 16px/1.3 'Saira'", '', 'Saira Medium · 16'], ['Body', "300 12px/1.4 'Saira'", '', 'Saira Light · 10'],
  ['Large button', "300 16px/1 'Poppins'", '1.2px', 'Poppins Light · 16 · caps', 1], ['Small button', "300 11px/1 'Poppins'", '1.25px', 'Poppins Light · 10 · caps', 1]
];
const tt = $('#tt');
function renderTypes() { const list = $('#typeList'); list.innerHTML = ''; const v = tt.value.trim(); TYPES.forEach(([n, f, ls, m, caps]) => { const r = document.createElement('div'); r.className = 'trow'; const s = document.createElement('span'); s.className = 's'; s.textContent = v || n; s.style.font = f; s.style.letterSpacing = ls || 'normal'; if (caps) s.style.textTransform = 'uppercase'; const sm = document.createElement('small'); sm.textContent = m; r.append(s, sm); list.append(r); }); }
tt.addEventListener('input', renderTypes); renderTypes();
const ICONS = {
  home: '<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>',
  feeder: '<path d="M4 15c0-3 3-5 8-5s8 2 8 5v2H4zM6 20h12v1.5H6zM9 6l3-2 3 2v3H9z"/>',
  shop: '<path d="M6 8h12l1 13H5zM9 8a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2"/>',
  vet: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>'
};
const TB = [['home', 'Home'], ['feeder', 'Feeder'], ['shop', 'Shop'], ['vet', 'Vet']]; const tb = $('#tabbar');
TB.forEach(([k, n], i) => { const b = document.createElement('button'); b.className = 'tb' + (i ? '' : ' on'); b.setAttribute('role', 'tab'); b.dataset.tip = n.toLowerCase(); b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg><span>${n}</span>`; b.addEventListener('click', () => $$('.tb', tb).forEach(x => x.classList.toggle('on', x === b))); tb.append(b); });
$('#compBtn').addEventListener('click', () => openLb(B + 'components.jpg', 'COCO UI components'));
})();
