/* Random-colour pointer with a speech bubble on hover — shared by case-study pages.
   Put data-tip="…" on anything that should show a bubble. */
(() => {
  const ptr = document.getElementById('pointer'); if (!ptr) return;
  const pill = ptr.querySelector('.pill');
  const COL = ['#FF7262', '#A259FF', '#1ABCFE', '#0ACF83', '#FFB800', '#F23C9E', '#7B9CF0', '#FF8A3D'];
  let pc = '', tip = '', shown = '';
  const rand = () => { let c; do { c = COL[(Math.random() * COL.length) | 0]; } while (c === pc); pc = c; ptr.style.setProperty('--pc', c); };
  rand();
  const tipFor = t => {
    if (!t || !t.closest) return '';
    const d = t.closest('[data-tip]'); if (d) return d.dataset.tip;
    if (t.closest('.lb .x')) return 'close';
    if (t.closest('button, a')) return 'click';
    return '';
  };
  const render = () => {
    if (tip) {
      if (tip !== shown) { pill.textContent = tip; shown = tip; pill.style.animation = 'none'; void pill.offsetWidth; pill.style.animation = ''; }
      ptr.classList.add('talk');
    } else { ptr.classList.remove('talk'); shown = ''; }
  };
  const place = e => {
    ptr.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    ptr.classList.toggle('flip', e.clientX > innerWidth - 240);
    ptr.classList.toggle('below', e.clientY < 70);
  };
  addEventListener('pointermove', e => { place(e); if (e.pointerType === 'mouse') ptr.classList.add('show'); }, { passive: true });
  addEventListener('pointerdown', e => { place(e); if (e.pointerType === 'mouse') { rand(); ptr.classList.add('click'); setTimeout(() => ptr.classList.remove('click'), 160); } }, { passive: true });
  addEventListener('pointerover', e => {
    ptr.classList.toggle('hide', !!e.target.closest && !!e.target.closest('input,textarea'));
    tip = e.pointerType === 'mouse' ? tipFor(e.target) : ''; render();
  });
  document.documentElement.addEventListener('mouseleave', () => ptr.classList.remove('show'));
})();
