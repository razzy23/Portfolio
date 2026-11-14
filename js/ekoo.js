/* ekoo case study — interactions (uses js/kit.js) */
(() => {
'use strict';
const { $, $$, toast, burst, reduce } = Kit;
const B = '../assets/work/ekoo/';
Kit.init({ colors: ['#0DBA85', '#74DDE0', '#07494A', '#CDE6FF', '#F3FAF7'] });

/* hero */
const br = $('#brand');
br.addEventListener('click', e => { br.classList.add('spin'); setTimeout(() => br.classList.remove('spin'), 700); toast('🌿 travel lighter'); burst(e.clientX, e.clientY, 36); });

/* tab builder */
function tabs(el, items, cb, first) {
  items.forEach(([k, n]) => { const b = document.createElement('button'); b.className = 'tab'; b.textContent = n; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => { $$('.tab', el).forEach(x => x.classList.toggle('on', x === b)); cb(k); }); el.append(b); });
  $$('.tab', el)[first || 0].click();
}

/* problem */
const PROB = {
  problem: ['The problem', 'Sri Lanka’s tourism lacks a sustainable and community-focused approach, leaving eco-travellers and local economies disconnected.'],
  goal: ['The goal', 'To bridge the gap between eco-conscious travellers and Sri Lankan communities with a mobile app that promotes sustainable tourism practices and empowers communities to connect with, and benefit from, tourism directly.'],
  product: ['The product', 'ekoo connects adventure-loving travellers with community-driven experiences in Sri Lanka. This eco-friendly app lets you explore sustainably while directly supporting local communities.']
};
const pText = $('#pText'), pKick = $('#pKick');
tabs($('#pTabs'), Object.entries(PROB).map(([k, v]) => [k, v[0]]), k => {
  pKick.textContent = PROB[k][0]; pText.style.animation = 'none'; void pText.offsetWidth; pText.style.animation = ''; pText.textContent = PROB[k][1];
});
$$('.stat b').forEach(b => {
  const n = +b.dataset.n;
  new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect(); const t0 = performance.now(), D = reduce ? 1 : 900; const f = now => { const k = Math.min(1, (now - t0) / D); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, { threshold: .6 }).observe(b);
});

/* process */
const STEPS = [
  ['Understanding the problem', 'We discussed what should be designed and what can be designed in the given timeframe.'],
  ['Research / benchmarking', 'We started by researching how travellers practise sustainability today, and did a competitor analysis.'],
  ['Ideate', 'After research we had a list of ideas for the app. We discussed how they could work in Sri Lanka and which would benefit the community most.'],
  ['Wireframing', 'According to the features we selected while ideating, we made digital wireframes.'],
  ['Designing & prototyping', 'Based on the wireframes, we designed the final look and feel, then built the interactions to suit the audience.', true],
  ['Analysing', 'A final check before hand-off: alignments, font sizes and weights, spelling and grammar.']
];
const stepsEl = $('#steps');
function showStep(i) {
  $$('.stp', stepsEl).forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('done', j < i); });
  $('#stepK').textContent = `Step ${i + 1} of ${STEPS.length}`;
  const p = $('#stepT'); p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; p.textContent = STEPS[i][1];
  $('#stepMine').hidden = !STEPS[i][2];
}
STEPS.forEach((s, i) => { const b = document.createElement('button'); b.className = 'stp' + (s[2] ? ' me' : ''); b.innerHTML = `<i>${i + 1}</i><span></span>`; $('span', b).textContent = s[0]; b.setAttribute('role', 'tab'); b.addEventListener('click', () => showStep(i)); stepsEl.append(b); });
showStep(0);

/* competitors */
const COMP = {
  wander: ['Wanderlog', 'Trip planning and itinerary creation: plan trips, organise travel details, collaborate with companions and discover nearby attractions and activities.', ['Create trip itineraries, add notes and photos, sync travel details across devices.', 'Discover and research attractions and activities, with varying detail on sustainability practices.', 'Integrates with booking platforms, but booking directly through Wanderlog is less likely.'], 'General travellers planning trips worldwide.'],
  trip: ['Tripadvisor', 'User-generated reviews and ratings for hotels, restaurants and attractions worldwide, so travellers can inform their decisions.', ['Submit reviews, photos and ratings for various services.', 'Search for specific locations and browse listings with reviews and ratings.', 'Some travel planning tools and limited price comparison.', 'Filtering and searching is a core feature.'], 'A broad audience of general travellers planning trips worldwide.'],
  vac: ['Visit A City', 'Helping travellers plan sightseeing trips within specific cities around the world.', ['Pre-made itineraries with suggestions for landmarks, historical sites and popular attractions.', 'Customise itineraries to some extent by adding or removing attractions.', 'Book tours and activities, offline maps, basic info on opening hours and accessibility.', 'Focus on filtering and searching.'], 'A broad audience of general travellers planning trips worldwide.'],
  agoda: ['Agoda', 'Online travel booking with a broad range of accommodation options globally: hotels, hostels, vacation rentals and alternatives.', ['Search and book accommodation across locations and price points.', 'Filter by date, price, location, amenities and guest rating.', 'Travel deals, last-minute booking and integration with other travel services.', 'Core focus on filtering and searching.'], 'Travellers with diverse budgets and preferences looking for a user-friendly platform to compare and book lodging.']
};
const comp = $('#comp');
tabs($('#cTabs'), Object.entries(COMP).map(([k, v]) => [k, v[0]]), k => {
  const [, focus, feats, aud] = COMP[k]; comp.innerHTML = '';
  const mk = (h, inner) => { const d = document.createElement('div'); d.className = 'cbox'; d.innerHTML = `<h4>${h}</h4>`; d.append(inner); comp.append(d); };
  const p1 = document.createElement('p'); p1.textContent = focus; mk('Focus', p1);
  const ul = document.createElement('ul'); feats.forEach(f => { const li = document.createElement('li'); li.textContent = f; ul.append(li); }); mk('Features', ul);
  const p2 = document.createElement('p'); p2.textContent = aud; mk('Target audience', p2);
});

/* wireframe vs hi-fi */
const WF = {
  home: ['Home', 'wf/wf1.jpg', 's/home.jpg'],
  trip: ['Trip', 'wf/wf3.jpg', 's/trip.jpg'],
  rest: ['Restaurants', 'wf/wf2.jpg', 's/rest.jpg'],
  blog: ['Blog', 'wf/wf4.jpg', 's/blog.jpg']
};
const wfS = $('#wfScr'), hfS = $('#hfScr'); let lock = false;
const sync = (a, b) => a.addEventListener('scroll', () => {
  if (lock) { lock = false; return; }
  const m = a.scrollHeight - a.clientHeight, n = b.scrollHeight - b.clientHeight; if (m <= 0 || n <= 0) return;
  lock = true; b.scrollTop = a.scrollTop / m * n;
}, { passive: true });
sync(wfS, hfS); sync(hfS, wfS);
tabs($('#wTabs'), Object.entries(WF).map(([k, v]) => [k, v[0]]), k => {
  const w = WF[k]; $('#wfImg').src = B + w[1]; $('#wfImg').alt = `${w[0]} wireframe`; $('#hfImg').src = B + w[2]; $('#hfImg').alt = `${w[0]} hi-fi design`;
  wfS.scrollTop = 0; hfS.scrollTop = 0;
});

/* designs: scrollable screens with annotated sections (y values in px of the 720px-wide export) */
const SCR = {
  home: { n: 'Home', src: 's/home.jpg', h: 2548, t: 'Home', d: 'Everything a traveller needs to start planning, in one scroll.', spots: [
    ['Banner', 0, 510, 'Start planning', 'A big call to action to start planning a vacation.'],
    ['Categories', 550, 900, 'Categories', 'Easy access to everything from sustainable food to community service.'],
    ['Near you', 930, 1340, 'Places near you', 'Destinations picked using the traveller’s location.'],
    ['Curated', 1370, 1850, 'Curated content', 'Content curated from the traveller’s location and the destinations they look at.'],
    ['Questions', 1890, 2320, 'Questions', 'Travellers can ask for help or request a carpool. Each card shows the type of question, a title, the slots still needed, and whether it is private or public.'],
    ['Navbar', 2345, 2548, 'Navigation bar', 'Home for the overview, Trips to plan by destination or route, + to add content, For You for quick access to content and filters, and Profile for content, trips and stats.']
  ] },
  trip: { n: 'Trips', src: 's/trip.jpg', h: 2052, t: 'Trip: Colombo', d: 'Search a destination and everything about it is in one place.', spots: [
    ['Search', 85, 190, 'Search', 'Search for a destination to plan around it.'],
    ['Intro', 193, 703, 'Destination intro', 'A banner with a short introduction to the place.'],
    ['Categories', 740, 1075, 'Categories', 'Filter experiences by category, such as restaurants, attractions and community service.'],
    ['Articles', 1110, 1295, 'Popular articles', 'Popular articles on the destination are sourced automatically with AI.'],
    ['Blogs', 1330, 1800, 'Blogs', 'Blogs by creators who have been there.']
  ] },
  rest: { n: 'Restaurants', src: 's/rest.jpg', h: 1600, t: 'Category: restaurants', d: 'Experiences ranked by the community, not by who paid.', spots: [
    ['Ranking', 193, 510, 'Ranked, and transparent about it', 'The title says how results are ranked: by the community, on service quality, food and ambience.'],
    ['Review', 645, 790, 'A highlight from the review', 'Each result leads with a highlight from a real review, ranked by the community.'],
    ['Creator', 805, 855, 'Who said it', 'The reviewer’s name, level and country sit under the review.'],
    ['Map / Save', 795, 850, 'Map and Save', 'Map opens Google Maps to the place and Save keeps it for later.']
  ] },
  foryou: { n: 'For You', src: 's/foryou.jpg', h: 1600, t: 'For You', d: 'A feed built from what the traveller has been looking at.', spots: [
    ['Intro', 0, 512, 'Based on recent activity', 'Content shown here is based on the traveller’s recent activity and location.'],
    ['Restaurants', 540, 985, 'Restaurants', 'The same ranked result card, reused here so it feels familiar.'],
    ['Articles', 1020, 1205, 'Articles', 'A top-places article for the destination.'],
    ['Blogs', 1240, 1400, 'Blogs', 'Stories from other travellers.']
  ] },
  blog: { n: 'Blog', src: 's/blog.jpg', h: 2392, t: 'Blog', d: 'Stories from travellers, written to be skimmed or read.', spots: [
    ['Header', 80, 510, 'Reading time and date', 'Reading time to motivate a read, and the upload date for context. The author’s name, level and country are right there.'],
    ['Story', 550, 1155, 'The story', 'Easy-to-read body text.'],
    ['TLDR', 1180, 1575, 'TLDR', 'A summary box with the points to look out for.'],
    ['Comments', 1620, 1895, 'Comments', 'Like, reply and share, with the number of replies.'],
    ['Related', 1925, 2190, 'More related stories', 'More stories to keep reading.']
  ] },
  profile: { n: 'Profile', src: 's/profile.jpg', h: 1600, t: 'Profile', d: 'Progress that rewards responsible travel.', spots: [
    ['Level', 495, 575, 'Level', 'A progress bar shows the traveller’s level, here Level 4: Journeyman.'],
    ['Stats', 610, 945, 'Statistics', 'Trips and Guides stats: trips, carpools and activities.'],
    ['Account', 1000, 1235, 'Account', 'Edit details or delete the account.']
  ] }
};
const sheetImg = $('#sheetImg'), vp = $('#vp'), hlb = $('#hlbox'), spotsEl = $('#spots'), note = $('#spotNote');
let cur = 'home', curSpot = -1;
function placeBox(s) {
  const H = SCR[cur].h; hlb.hidden = false; hlb.style.top = (s[1] / H * 100) + '%'; hlb.style.height = ((s[2] - s[1]) / H * 100) + '%';
}
function pickSpot(i, scroll = true) {
  const S = SCR[cur], s = S.spots[i]; curSpot = i;
  $$('.spot', spotsEl).forEach((b, j) => b.classList.toggle('on', j === i));
  placeBox(s);
  note.innerHTML = '<b></b><span></span>'; $('b', note).textContent = s[3]; $('span', note).textContent = s[4];
  note.classList.remove('pop'); void note.offsetWidth; note.classList.add('pop');
  if (scroll) { const px = sheetImg.clientHeight * (s[1] / S.h); vp.scrollTo({ top: Math.max(0, px - 24), behavior: reduce ? 'auto' : 'smooth' }); }
}
function showScreen(k) {
  cur = k; curSpot = -1; const S = SCR[k];
  sheetImg.src = B + S.src; sheetImg.alt = S.t; vp.scrollTop = 0; hlb.hidden = true;
  $('#stepLabel').textContent = `${S.n} · screen`; $('#stepTitle').textContent = S.t; $('#stepNote').textContent = S.d;
  spotsEl.innerHTML = '';
  S.spots.forEach((s, i) => { const b = document.createElement('button'); b.className = 'spot'; b.innerHTML = `<i>${i + 1}</i><span></span>`; $('span', b).textContent = s[0]; b.addEventListener('click', () => pickSpot(i)); spotsEl.append(b); });
  note.innerHTML = '<span>Tap a section on the phone, or pick one above.</span>';
}
tabs($('#walkTabs'), Object.entries(SCR).map(([k, v]) => [k, v.n]), showScreen);
$('#sheet').addEventListener('click', e => {
  const r = sheetImg.getBoundingClientRect(), y = (e.clientY - r.top) / r.height * SCR[cur].h;
  const hits = SCR[cur].spots.map((s, i) => [s, i]).filter(([s]) => y >= s[1] && y <= s[2]);
  if (!hits.length) return;
  hits.sort((a, b) => (a[0][2] - a[0][1]) - (b[0][2] - b[0][1])); pickSpot(hits[0][1], false);
});
$('#sheet').dataset.tip = 'tap a section';
})();
