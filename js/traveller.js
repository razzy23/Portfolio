/* Traveller case study — interactions */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const B = '../assets/work/traveller/';

/* ---------- toast + confetti ---------- */
function toast(msg) {
  $$('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 1600);
}
const cv = $('#confetti'), cx = cv.getContext('2d'); let parts = [], raf = 0;
const sizeCv = () => { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); };
sizeCv(); addEventListener('resize', sizeCv);
function burst(x, y, n = 50) {
  if (reduce) return;
  const C = ['#FFB81C', '#2B4C9B', '#FFE27A', '#BFE3FF', '#FFBFEA'];
  for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 15, vy: -Math.random() * 13 - 3, r: Math.random() * 6, vr: (Math.random() - .5) * .4, s: 6 + Math.random() * 8, c: C[(Math.random() * C.length) | 0], life: 110 + Math.random() * 50 });
  if (raf) return;
  const step = () => {
    cx.clearRect(0, 0, innerWidth, innerHeight); parts = parts.filter(p => p.life > 0);
    for (const p of parts) { p.vy += .4; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.strokeStyle = '#14182B'; cx.lineWidth = 2; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); cx.strokeRect(-p.s / 2, -p.s / 2, p.s, p.s); cx.restore(); }
    raf = parts.length ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}

/* ---------- reveal, chips, road progress ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
$$('.reveal').forEach(n => io.observe(n));
const chips = $('#chips'), secs = $$('section[data-title]');
secs.forEach(s => { const a = document.createElement('a'); a.href = '#' + s.id; a.textContent = s.dataset.title; a.dataset.for = s.id; chips.append(a); });
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  $$('a', chips).forEach(a => { const on = a.dataset.for === e.target.id; a.classList.toggle('on', on); if (on) chips.scrollTo({ left: a.offsetLeft - chips.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); });
}), { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => spy.observe(s));
const tuk = $('#tuk'), road = $('.road');
const prog = () => { const h = document.documentElement, p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight); tuk.style.left = (15 + p * (road.clientWidth - 30)) + 'px'; };
addEventListener('scroll', prog, { passive: true }); addEventListener('resize', prog); prog();
tuk.addEventListener('click', () => { tuk.classList.remove('honk'); void tuk.offsetWidth; tuk.classList.add('honk'); toast('beep beep! 🛺'); });
$('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* ---------- research board ---------- */
const board = $('#board'), hint = $('#boardHint'); let pain = null;
$$('[data-pain]').forEach(b => b.addEventListener('click', () => {
  pain = pain === b.dataset.pain ? null : b.dataset.pain;
  board.classList.toggle('picked', !!pain);
  $$('[data-pain]').forEach(x => x.classList.toggle('on', x.dataset.pain === pain));
  let n = 0; $$('.sol').forEach(s => { const hit = s.dataset.from === pain; s.classList.toggle('hit', hit); if (hit) n++; });
  hint.textContent = pain ? `${n} solutions answer this problem — tap one to see it in the designs.` : 'Nothing selected — all solutions shown.';
}));
$$('.sol').forEach(s => s.addEventListener('click', () => {
  if (board.classList.contains('picked') && !s.classList.contains('hit')) return;
  const [tab, step] = s.dataset.go.split(':'); goWalk(tab, +step);
  $('#screens').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}));

/* ---------- flows ---------- */
const FLOWS = [
  { k: 'onboarding', n: 'Onboarding', f: 'onboarding.png', alt: 'Onboarding flow: select language, registration, verification' },
  { k: 'book-trip', n: 'Book a trip', f: 'book-trip.png', alt: 'Book a trip flow: destination, pickup, route options, then public transport details, ticket booking or private vehicle' },
  { k: 'private-vehicle', n: 'Private vehicle', f: 'private-vehicle.png', alt: 'Private vehicle booking flow' },
  { k: 'ticket-booking', n: 'Train & bus tickets', f: 'ticket-booking.png', alt: 'Ticket booking flow for trains and highway buses' },
  { k: 'transport-info', n: 'Transport info', f: 'transport-info.png', alt: 'Information and support flow for trains and highway buses' }
];
const fTabs = $('#flowTabs'), fImg = $('#flowImg'); let fi = 0;
FLOWS.forEach((f, i) => { const b = document.createElement('button'); b.className = 'tab' + (i ? '' : ' on'); b.textContent = f.n; b.setAttribute('role', 'tab'); b.addEventListener('click', () => { fi = i; showFlow(); $$('.tab', fTabs).forEach(x => x.classList.toggle('on', x === b)); }); fTabs.append(b); });
function showFlow() { const f = FLOWS[fi]; fImg.style.animation = 'none'; void fImg.offsetWidth; fImg.style.animation = ''; fImg.src = `${B}flows/${f.f}`; fImg.alt = f.alt; }
showFlow();
$('#flowCap').innerHTML = [['#E2CCFF', 'onboarding'], ['#BEE3FF', 'user step'], ['#AFF3C7', 'private ride'], ['#FFE59A', 'ticket booking'], ['#FFC9C4', 'information'], ['#F24E1E', 'cancel path']].map(([c, t]) => `<i style="--c:${c}">${t}</i>`).join('');
const lb = $('#lb'), lbImg = $('#lbImg');
$('#flowView').addEventListener('click', () => { lbImg.src = fImg.src; lbImg.alt = fImg.alt; lb.hidden = false; document.body.style.overflow = 'hidden'; });
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
$('.x', lb).addEventListener('click', closeLb); lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

/* ---------- walkthrough ---------- */
const S = B + 'screens/';
const TABS = {
  ride: { n: 'Book a ride', steps: [
    { i: 'trip-1', t: 'Enter pickup & destination', d: 'Start from the current location, type where to, or pick from recent places.' },
    { i: 'trip-2', t: 'Choose vehicle types', d: 'Pick one or several vehicle types, each with a price and arrival time, then search for drivers.', dec: 0 },
    { i: 'trip-3', t: 'Ride details', d: 'Review the route and prices, add another vehicle, then find drivers or cancel.' },
    { i: 'trip-4', t: 'We found a driver', d: 'Driver, plate, vehicle and fare in one card. Accept, or ask for another driver.', dec: 1 },
    { i: 'trip-5', t: 'Driver on the way', d: 'Live position on the map, with calling and sending a location picture one tap away.', dec: 2 }
  ], dec: [
    ['Ability to pick multiple modes', 'PickMe got this feature right recently, the ability to select multiple modes helps in getting a ride faster. This works when the user doesn’t mind using any mode.'],
    ['Picture of the vehicle', 'What the user will first see is the vehicle rather than the driver, so we’ve made that the picture for the driver on this app. Not everyone is well versed in their car brands and models.'],
    ['Main actions first', 'Quick action buttons for calling the driver and sending a location picture etc.']
  ] },
  tickets: { n: 'Train & bus tickets', steps: [
    { i: 'ticket-1', t: 'Pick a mode', d: 'Starting station, destination and time, with bus and train as simple toggles.' },
    { i: 'ticket-2', t: 'Recommended routes', d: 'Route options with duration, schedule and an estimated fare.', dec: 0 },
    { i: 'ticket-3', t: 'Book the bus ticket', d: 'Choose a departure from the bottom sheet, or switch to finding a ride to the station.' },
    { i: 'ticket-4', t: 'Confirm & download', d: 'A ticket that looks like the paper one, ready to pay for and download.', dec: 1 }
  ], dec: [
    ['Streamlined information', 'Following the style of Google maps to display just the main information for public transport modes. We’ve also decided to add an estimate for the fare.'],
    ['Ticket matching a physical ticket', 'The sense of familiarity given through skeuomorphism.']
  ] },
  pickup: { n: 'Pickup & trust', steps: [
    { i: 'chat-1', t: 'Chat with landmarks', d: 'Quick replies and a photo of the pickup spot, right inside the chat.', dec: 0 },
    { i: 'call-1', t: 'Call the driver', d: 'The driver’s vehicle stays on screen, with a one-tap switch to video.' },
    { i: 'call-2', t: 'Show the landmark live', d: 'Turn the camera on and show the driver exactly where you are.', dec: 1 },
    { i: 'arrive-1', t: 'Driver has arrived', d: 'Driver and vehicle photos plus a PIN to prove identity.', dec: 2 },
    { i: 'arrive-2', t: 'On your way', d: 'Pickup and drop-off, ETA and trip sharing, nothing else.' },
    { i: 'arrive-3', t: 'Destination reached', d: 'The fare to pay and a single End trip button.' }
  ], dec: [
    ['Easier chat options', 'The chat feature to have more options like sending images of the pickup location. Features that can be added on would be to have a live translator on chat so the users can communicate in their native language.'],
    ['Videocall options', 'This feature is introduced with the sole purpose of assisting the driver with identifying the pickup location through landmarks.'],
    ['Pickup information, driver and vehicle pictures', 'Following a style focusing on the readability while offering only the main options. For the safety of users, both driver and vehicle pictures will be mandatory and presented to the user, the system will not allow fake images and the user can decline the ride at any time if the pictures don’t match the driver or car.']
  ] },
  driver: { n: 'Driver app', steps: [
    { i: 'drv-1', t: 'Ride request nearby', d: 'A card over the map: pickup, drop-off and fare, with Ignore or More details.', dec: 0 },
    { i: 'drv-2', t: 'Trip details', d: 'Passenger, route and fare, then accept or go back.' },
    { i: 'drv-3', t: 'At the pickup point', d: 'Confirm the pickup, cancel, or open the chat.' },
    { i: 'drv-4', t: 'Landmark popup', d: 'The passenger’s landmark photo appears right on the map.', dec: 1 },
    { i: 'drv-5', t: 'Reply without leaving the map', d: 'Messages pop up over the map, with a quick reply field.', dec: 1 },
    { i: 'drv-6', t: 'Chat', d: 'Quick replies like “I am here” and “I can’t find you”, plus photos.' },
    { i: 'drv-7', t: 'Request a video call', d: 'Ask the passenger to switch to video to find them.', dec: 2 },
    { i: 'drv-8', t: 'Next request at the destination', d: 'New ride requests surface where the driver already is.' },
    { i: 'drv-9', t: 'Trip completed', d: 'The amount to collect and a single Done button.' }
  ], dec: [
    ['Built for use on the go', 'The driver app is built with minimal requirement for interactions, only 1-2 actions at a time, built in map etc. But it also provides the relevant details unlike other applications. A main customer pain point being the driver asking “where is the destination”. Since asking this from a tourist would have the best response.'],
    ['Message popups', 'The messages from the passenger will pop up on the driver’s map area so that the main focus screen won’t have to be hindered by going to a chat page.'],
    ['Videocall request', 'Again for the purpose of locating the tourist, the option to request a videocall has been provided to the driver.']
  ] },
  signup: { n: 'Sign-up', steps: [
    { i: 'signup-1', t: 'Welcome', d: 'Email and password, with sign up and log in in one place.' },
    { i: 'signup-2', t: 'Get to know you', d: 'Just name, email, contact number and a password.', dec: 0 },
    { i: 'signup-3', t: 'Verify', d: 'Click the link in the email or enter the code.' },
    { i: 'signup-4', t: 'All set', d: 'Verified, and the account is set up in the background.', dec: 1 }
  ], dec: [
    ['Keeping it simple and straightforward', 'customers have been using similar apps for a while. Since the app follows more or less the same processes it doesn’t require a complicated onboarding.'],
    ['Profile building as you go', 'Rather than starting off by entering all the information that can be entered into the system, we start with the minimum requirements and later at the user’s convenience the information can be added on.']
  ] }
};
const wTabs = $('#walkTabs'), strip = $('#strip'), pImg = $('#phoneImg'), pDot = $('#phoneDot');
let tab = 'ride', step = 0;
Object.entries(TABS).forEach(([k, t]) => { const b = document.createElement('button'); b.className = 'tab' + (k === tab ? ' on' : ''); b.textContent = t.n; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => goWalk(k, 0)); wTabs.append(b); });
function renderWalk(dir) {
  const T = TABS[tab], s = T.steps[step];
  $$('.tab', wTabs).forEach(b => b.classList.toggle('on', b.dataset.k === tab));
  pImg.className = dir ? (dir > 0 ? 'in-next' : 'in-prev') : ''; void pImg.offsetWidth; pImg.className = dir ? (dir > 0 ? 'in-next' : 'in-prev') : '';
  pImg.src = `${S}${s.i}.png`; pImg.alt = `${T.n}: ${s.t}`;
  $('#count').textContent = `${step + 1} / ${T.steps.length}`;
  $('#stepLabel').textContent = `${T.n} · step ${step + 1}`; $('#stepTitle').textContent = s.t; $('#stepNote').textContent = s.d;
  pDot.hidden = s.dec == null;
  const dl = $('#decisions'); dl.innerHTML = '';
  T.dec.forEach((d, i) => {
    const b = document.createElement('button'); b.className = 'dec' + (s.dec === i ? ' on' : '');
    const first = T.steps.findIndex(x => x.dec === i);
    b.innerHTML = `<small class="n">design decision ${i + 1}${first >= 0 ? ` · step ${first + 1}` : ''}</small><b></b><span></span>`; $('b', b).textContent = d[0]; $('span', b).textContent = d[1];
    b.addEventListener('click', () => { if (first >= 0 && first !== step) { const dd = first - step; step = first; renderWalk(Math.sign(dd)); } });
    dl.append(b);
  });
  strip.innerHTML = '';
  T.steps.forEach((x, i) => { const b = document.createElement('button'); b.className = 'thumb' + (i === step ? ' on' : ''); b.dataset.tip = x.t; b.innerHTML = `<img src="${S}${x.i}.png" alt="" loading="lazy">`; b.addEventListener('click', () => { const dd = i - step; step = i; renderWalk(Math.sign(dd)); }); strip.append(b); });
  const on = $('.thumb.on', strip); if (on) strip.scrollTo({ left: on.offsetLeft - strip.clientWidth / 2 + on.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
}
function goWalk(k, i) { tab = k; step = Math.min(i, TABS[k].steps.length - 1); renderWalk(0); }
function move(d) { const n = TABS[tab].steps.length; step = (step + d + n) % n; renderWalk(d); }
$('#next').addEventListener('click', () => move(1)); $('#prev').addEventListener('click', () => move(-1));
$('#phone').addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } });
let sx = null;
$('#phone').addEventListener('pointerdown', e => { sx = e.clientX; });
$('#phone').addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1); else if (e.pointerType === 'mouse') move(1); });
$('#phone').dataset.tip = 'click · next screen';
renderWalk(0);

/* ---------- roadmap ---------- */
const STOPS = ['Adapting to new destinations.', 'Introducing features like ride-sharing or vehicle rentals.', 'Expanding into broader tourism services, to make travel easier and more enjoyable for everyone.'];
const stops = $$('.stop'), rmTuk = $('#rmTuk'), stopText = $('#stopText'); let si = 0;
function stopTo(i, celebrate) {
  si = i; stops.forEach((s, k) => s.classList.toggle('on', k === i));
  rmTuk.style.left = (16.66 + i * 33.33) + '%'; stopText.textContent = STOPS[i];
  if (celebrate) { const r = stops[i].getBoundingClientRect(); burst(r.left + r.width / 2, r.top + 20, 30); }
}
stops.forEach(s => s.addEventListener('click', () => stopTo(+s.dataset.i, true)));
stopTo(0);
})();
