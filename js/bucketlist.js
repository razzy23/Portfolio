/* Bucket List case study — interactions (uses js/kit.js) */
(() => {
'use strict';
const { $, $$, toast, burst, reduce, copy } = Kit;
Kit.init({ colors: ['#B57C0D', '#DDB257', '#E2D194', '#202B19', '#F8F4E9'] });

const MONTHS = [
  ['JAN', 'Northern Lights', 'linear-gradient(160deg,#2f8f7a,#0d2a33)'],
  ['FEB', 'Cherry Blossoms & Snow Festival', 'linear-gradient(160deg,#e9a3b8,#7b3b57)'],
  ['MAR', 'Cape Town International Jazz Festival', 'linear-gradient(160deg,#4b4a9a,#161433)'],
  ['APR', 'Swiss Alps & Tulips', 'linear-gradient(160deg,#d6455a,#e8b64c)'],
  ['MAY', 'Machu Picchu & Cusco', 'linear-gradient(160deg,#b9683b,#4a2a1a)'],
  ['JUN', 'Alaska Cruise & Montreal Jazz', 'linear-gradient(160deg,#5aa3c4,#17354a)'],
  ['JUL', 'The Great Migration', 'linear-gradient(160deg,#d9a13f,#6b3d12)'],
  ['AUG', 'Almaty Mountain Escape', 'linear-gradient(160deg,#6d8a78,#26332c)'],
  ['SEP', 'Cape Town · Winelands · Safari', 'linear-gradient(160deg,#8e2f4a,#3a1020)'],
  ['OCT', 'Lisbon, Porto & Barcelona', 'linear-gradient(160deg,#3a79b8,#c8693a)'],
  ['NOV', 'Dubai from Above', 'linear-gradient(160deg,#d8b27a,#3f4a63)'],
  ['DEC', 'Christmas Markets of Central Europe', 'linear-gradient(160deg,#a8322f,#1f4a36)']
];

/* tab builder */
function tabs(el, items, cb, first = 0) {
  items.forEach(([k, n]) => { const b = document.createElement('button'); b.className = 'tab'; b.textContent = n; b.dataset.k = k; b.setAttribute('role', 'tab'); b.addEventListener('click', () => { $$('.tab', el).forEach(x => x.classList.toggle('on', x === b)); cb(k); }); el.append(b); });
  $$('.tab', el)[first].click();
}
function countUp(b) {
  const n = +b.dataset.n, plus = b.dataset.plus ? '+' : '';
  new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect(); const t0 = performance.now(), D = reduce ? 1 : 1100;
    const f = now => { const k = Math.min(1, (now - t0) / D); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('en') + (k === 1 ? plus : ''); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, { threshold: .6 }).observe(b);
}
$$('[data-n]').forEach(countUp);

/* hero */
const br = $('#brand');
br.addEventListener('click', e => { br.classList.add('spin'); setTimeout(() => br.classList.remove('spin'), 600); toast('✦ one journey, every month'); burst(e.clientX, e.clientY, 36); });
const leaf = $('#leaf'); let li = 0;
function setLeaf(i) {
  li = (i + 12) % 12; const [m, d, g] = MONTHS[li];
  leaf.classList.remove('turn'); void leaf.offsetWidth; leaf.classList.add('turn');
  leaf.style.setProperty('--g', g); $('#leafMo').textContent = m; $('#leafDest').textContent = d; $('#leafNo').textContent = String(li + 1).padStart(2, '0') + ' / 12';
}
setLeaf(0); leaf.addEventListener('click', () => setLeaf(li + 1));
if (!reduce) setInterval(() => { if (!document.hidden && !leaf.matches(':hover')) setLeaf(li + 1); }, 3800);

/* brief */
const BRIEF = {
  brief: ['The brief', 'A marketing home for a high-end product line: one fully realised journey for every month of the year. The site had to feel simple, elegant and unhurried, so the destinations could do the talking.'],
  audience: ['The audience', 'A mature, discerning traveller: couples, small private groups and families who want privacy, seamless planning and a trip that is about experiences, not just destinations.'],
  mood: ['The mood', 'Luxurious yet minimal, with the romance and period elegance of a Bridgerton-style drama. Think candlelit warmth, gold on cream, and no clutter to get between you and the view.'],
  tracking: ['The measuring', 'The client wanted to learn which trips drew the most interest and which converted. That meant setting up a Meta Pixel to track behaviour, my first time doing so.']
};
const bText = $('#bText'), bKick = $('#bKick');
tabs($('#bTabs'), Object.entries(BRIEF).map(([k, v]) => [k, v[0]]), k => {
  bKick.textContent = BRIEF[k][0]; bText.style.animation = 'none'; void bText.offsetWidth; bText.style.animation = ''; bText.textContent = BRIEF[k][1];
});

/* live demo: scale an iframe of the real site into its frame, loaded on demand */
const SITE = 'https://goholidays.lk/bucketlist/';
function fit(vp, f, w) { const s = vp.clientWidth / w; f.style.width = w + 'px'; f.style.height = (vp.clientHeight / s) + 'px'; f.style.transform = `scale(${s})`; }
$$('.load').forEach(btn => btn.addEventListener('click', () => {
  const vp = $('#' + btn.dataset.for), w = +btn.dataset.w;
  const f = document.createElement('iframe'); f.src = SITE; f.title = 'Bucket List by Go Holidays (live site)'; f.loading = 'lazy'; f.setAttribute('allow', 'fullscreen');
  vp.append(f); fit(vp, f, w); btn.remove(); new ResizeObserver(() => fit(vp, f, w)).observe(vp); toast('Loading the live site…');
}));
tabs($('#vTabs'), [['desk', 'Desktop'], ['ph', 'Phone']], k => { $('#desk').hidden = k !== 'desk'; $('#ph').hidden = k !== 'ph'; $$('.vp iframe').forEach(f => { const vp = f.parentElement; fit(vp, f, vp.id === 'deskVp' ? 1440 : 390); }); });

/* brand look */
const look = $('#look'), themeBtn = $('#themeBtn');
const TOK = {
  light: [['Marble ground', '#F8F4E9'], ['Parchment', '#F2EAD8'], ['Deep olive text', '#202B19'], ['Muted olive', '#47543C'], ['Bronze gold', '#B57C0D'], ['Deep gold', '#6B4A06']],
  dark: [['Night olive', '#0F120A'], ['Coal', '#171B0F'], ['Warm white text', '#F2EFE2'], ['Soft cream', '#D8D4BF'], ['Antique gold', '#BFA04A'], ['Champagne', '#E2D194']]
};
function swatches() {
  const dark = look.dataset.theme === 'dark';
  $('#swatches').innerHTML = TOK[dark ? 'dark' : 'light'].map(([n, h]) => `<button class="sw" data-hex="${h}" data-tip="copy ${h}"><i style="--c:${h}"></i><span><b>${n}</b><small>${h}</small></span></button>`).join('');
  $$('.sw').forEach(b => b.addEventListener('click', () => { copy(b.dataset.hex); toast(`Copied ${b.dataset.hex}`); }));
}
swatches();
themeBtn.addEventListener('click', e => {
  const dark = look.dataset.theme !== 'dark'; look.dataset.theme = dark ? 'dark' : 'light';
  themeBtn.textContent = dark ? '☀ Back to light' : '☾ Try dark mode'; themeBtn.setAttribute('aria-pressed', String(dark)); swatches(); burst(e.clientX, e.clientY, 18);
});
const TYPES = [
  ['Display · Lavish, Cormorant Garamond', "'Lavish','Cormorant Garamond',serif", '400'],
  ['Italic accent · Libre Baskerville', "'Libre Baskerville',serif", '400;italic'],
  ['Body · Poppins Light', "'Poppins',sans-serif", '300']
];
const tl = $('#typeList'), tt = $('#tt'), SAMPLE = 'Travel deeper';
TYPES.forEach(([n, f, w]) => { const d = document.createElement('div'); d.className = 'ty'; const it = w.includes('italic'); d.innerHTML = `<small>${n}</small><div style="font-family:${f};font-weight:${parseInt(w)};${it ? 'font-style:italic;' : ''}">${SAMPLE}</div>`; tl.append(d); });
tt.addEventListener('input', () => $$('.ty div', tl).forEach(x => x.textContent = tt.value || SAMPLE));

/* process */
const STEPS = [
  ['Research', 'Getting to know the product line and the audience it is for: mature, discerning travellers who expect calm, considered design. This set the direction for everything after.'],
  ['Design language', 'Defining the look in Figma: marble and gold, serif type, generous space and slow motion, in light and dark. I designed the logo, the cards and the story as one system.'],
  ['Development', 'Building the site with Claude: the intro story, the month carousel, itinerary pages, dark mode and the Meta Pixel, then launching and watching the numbers.']
];
const sc = $('#steps'), sK = $('#stepK'), sT = $('#stepT');
STEPS.forEach(([n, t], i) => {
  const b = document.createElement('button'); b.className = 'stp'; b.setAttribute('role', 'tab'); b.innerHTML = `<i>${i + 1}</i>${n}`;
  b.addEventListener('click', () => { $$('.stp', sc).forEach(x => x.classList.toggle('on', x === b)); sK.textContent = `Phase ${i + 1} of 3`; sT.style.animation = 'none'; void sT.offsetWidth; sT.style.animation = ''; sT.textContent = t; });
  sc.append(b);
});
$('.stp', sc).click();
})();
