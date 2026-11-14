/* Travello case study — interactions (uses js/kit.js) */
(() => {
'use strict';
const { $, $$, toast, burst, reduce } = Kit;
const B = '../assets/work/travello/';
Kit.init({ colors: ['#FFA564', '#272F49', '#FAF8F5', '#FFD3AF', '#8FA0D8'] });

/* hero */
const lb = $('#logoBtn');
lb.addEventListener('click', e => { lb.classList.remove('rise'); void lb.offsetWidth; lb.classList.add('rise'); toast('☀️ Where to next?'); burst(e.clientX, e.clientY, 36); });
const hpz = $('#heroPhones');
hpz.addEventListener('pointermove', e => { if (reduce || e.pointerType !== 'mouse') return; const r = hpz.getBoundingClientRect(); hpz.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5) * 24 + 'px'); hpz.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5) * 18 + 'px'); hpz.classList.add('t'); });
hpz.addEventListener('pointerleave', () => hpz.classList.remove('t'));

/* screens */
const TABS = {
  in: { n: 'Get in', steps: [
    { i: 'splash', t: 'Splash', d: 'The Travello logo and “Where to next?”, then sign in with Google, sign in, or sign up.' },
    { i: 'login', t: 'Welcome', d: 'A simple username and password form with forgot password and a sign-up link.' }
  ] },
  discover: { n: 'Discover', steps: [
    { i: 'home', t: 'Discover', d: 'New handpicked locations just for you, best winter picks, and places similar to your previous trips.' },
    { i: 'foryou', t: 'A place, up close', d: 'South coast Mirissa in Sri Lanka: rating, tags like beach, surfing and whale watching, a description, and a book this trip button.' },
    { i: 'search', t: 'Search', d: 'Where to next? Browse by categories like mountains, beaches and hotels, to-dos like hiking and skiing, and the most searched this month.' }
  ] },
  plan: { n: 'Plan', steps: [
    { i: 'booking', t: 'Book a trip', d: 'Pick the destination country and site, departure and arrival dates, a travel package, and whether to book through an agent.' }
  ] },
  remember: { n: 'Remember', steps: [
    { i: 'trips', t: 'My trips', d: 'Contribute photos, reviews and experiences, then see your wishlist, a timeline map and saved locations.', chips: ['Add Photo', 'Add Review', 'Experience'] },
    { i: 'profile', t: 'Profile', d: 'Your stats and a gallery of the places you have been.', stats: [['Total trips completed', 24], ['Wishlist', 9], ['Review score', 19], ['Photo upload score', 1350]] },
    { i: 'settings', t: 'Settings', d: 'User settings, notifications, privacy and security, language, terms, about and log out.' }
  ] }
};
const extra = $('#stepExtra');
const walk = Kit.walk({ tabs: TABS, start: 'discover', src: (t, i, s) => `${B}screens/${s.i}.jpg`, onStep: (t, i, s) => {
  extra.innerHTML = '';
  (s.chips || []).forEach(c => { const e = document.createElement('span'); e.className = 'pillchip'; e.textContent = c; extra.append(e); });
  (s.stats || []).forEach(([l, n]) => {
    const e = document.createElement('div'); e.className = 'stat'; e.innerHTML = '<b>0</b><small></small>'; $('small', e).textContent = l; extra.append(e);
    const b = $('b', e); const t0 = performance.now(), D = reduce ? 1 : 900;
    const f = now => { const k = Math.min(1, (now - t0) / D); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
} });
const goScreens = (tab, i) => { walk.go(tab, i); $('#screens').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };

/* three things */
const TRIO = [
  { n: 1, t: 'Discover', d: 'Handpicked locations just for you, winter picks, and places like the ones you have loved before.', c: '#FFD3AF', go: ['discover', 0] },
  { n: 2, t: 'Plan', d: 'Search by category or to-do, open a place up close, and book the trip.', c: '#C9D3F5', go: ['plan', 0] },
  { n: 3, t: 'Remember', d: 'A wishlist, a timeline map, saved locations and a profile full of your own photos.', c: '#CDEBD9', go: ['remember', 0] }
];
TRIO.forEach((p, i) => {
  const b = document.createElement('button'); b.className = 'tcard reveal'; b.style.setProperty('--c', p.c); b.style.setProperty('--d', i * .08 + 's'); b.dataset.tip = 'see the screens';
  b.innerHTML = `<span class="n">${p.n}</span><b></b><span class="t"></span><em>see it →</em>`; $('b', b).textContent = p.t; $('.t', b).textContent = p.d;
  b.addEventListener('click', () => goScreens(...p.go)); $('#trio').append(b); Kit.observe(b);
});

/* persona */
const PTABS = {
  goals: { n: 'Goals', items: [['Find out about and visit every possible location on the face of the Earth', ['discover', 2, 'search']], ['Keep track of her trips and maintain a portfolio as a traveller', ['remember', 0, 'my trips']]] },
  needs: { n: 'Needs', items: [['Looking for an application that lets her achieve her goals', ['discover', 0, 'home']], ['Having an application that serves as a timeline of fond memories gathered during her time travelling', ['remember', 0, 'timeline']]] },
  pain: { n: 'Pain points', items: [['Usual websites have outdated info', ['discover', 0, 'fresh picks']], ['Other websites do not have a tracking feature', ['remember', 0, 'my trips']], ['Most websites and apps do not offer good user experience']] }
};
const pTabs = $('#pTabs'), pList = $('#pList');
function showP(k) {
  $$('.tab', pTabs).forEach(b => b.classList.toggle('on', b.dataset.k === k)); pList.innerHTML = '';
  PTABS[k].items.forEach(([t, go], i) => {
    const li = document.createElement('li'); li.style.animationDelay = i * .07 + 's'; const sp = document.createElement('span'); sp.textContent = t; li.append(sp);
    if (go) { const b = document.createElement('button'); b.textContent = go[2] + ' →'; b.dataset.tip = 'see it in the app'; b.addEventListener('click', () => goScreens(go[0], go[1])); li.append(b); }
    pList.append(li);
  });
}
Object.entries(PTABS).forEach(([k, t]) => { const b = document.createElement('button'); b.className = 'tab'; b.textContent = t.n; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => showP(k)); pTabs.append(b); });
showP('goals');
const SL = [['Introvert', 'Extrovert', 74], ['Analytical', 'Creative', 74], ['Busy', 'Time rich', 52], ['Messy', 'Organized', 86], ['Independent', 'Team player', 52]];
const sl = $('#sliders');
SL.forEach(([a, b, v], i) => { const r = document.createElement('div'); r.className = 'slider'; r.innerHTML = `<span class="l"></span><div class="tr"><i class="dot" style="--v:50%;--dl:${i * .12}s"></i></div><span class="r"></span>`; $('.l', r).textContent = a; $('.r', r).textContent = b; sl.append(r); });
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); $$('.dot', sl).forEach((d, i) => { d.style.setProperty('--v', SL[i][2] + '%'); d.parentElement.parentElement.parentElement.classList.add('in'); }); } }, { threshold: .4 }).observe(sl);
})();
