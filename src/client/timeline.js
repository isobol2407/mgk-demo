// Таймлайн «Как привозим» (по референсу gohelper.io).
// Блок закрепляется на экране, пока страница прокручивается: прокрутка двигает «сегодня»
// по шкале дней. Шкала едет вбок, этапы дорастают слева направо, в конце выскакивает
// плашка «Ключи у вас». Только transform и clip-path, без перерасчёта раскладки.
// От 1024 px и без reduced-motion. Иначе — шкала целиком, без закрепления (CSS .is-static).
export function initTimeline() {
  const root = document.querySelector('[data-tl]');
  if (!root) return;
  const stage = root.querySelector('[data-tl-stage]');
  const track = root.querySelector('[data-tl-track]');
  const bars = [...root.querySelectorAll('[data-tl-bar]')];
  const goal = root.querySelector('[data-tl-goal]');
  const doc = root.querySelector('[data-tl-doc]');
  const card = root.querySelector('.tl__card');
  const days = Number(root.dataset.days);

  const wide = window.matchMedia('(min-width: 1024px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;

  function paint(day) {
    bars.forEach((b) => {
      const from = Number(b.dataset.from);
      const to = Number(b.dataset.to);
      const p = Math.min(1, Math.max(0, (day - from) / (to - from)));
      b.style.setProperty('--p', p.toFixed(3));
      b.classList.toggle('is-on', p > 0);
    });
    goal?.classList.toggle('is-on', day >= Number(goal.dataset.day));
    doc?.classList.toggle('is-on', day >= Number(doc.dataset.day));
  }

  function frame() {
    raf = 0;
    const r = root.getBoundingClientRect();
    const travel = root.offsetHeight - stage.offsetHeight;
    const progress = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 1;
    // Подлёт: пока блок поднимается к верху экрана, карточка раскрывается до краёв экрана
    const grow = Math.min(1, Math.max(0, 1 - r.top / (window.innerHeight * 0.7)));
    card.style.setProperty('--g', grow.toFixed(3));
    // Чуть дальше конца шкалы, чтобы последняя полоса успела дорасти
    const day = progress * (days + 4);
    paint(day);
    // «Сегодня» держится на 60 % ширины карточки, шкала едет под ним
    const view = track.parentElement.clientWidth;
    const full = track.scrollWidth;
    const x = Math.min(full - view, Math.max(0, (day / days) * full - view * 0.6));
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  }
  const onScroll = () => raf || (raf = requestAnimationFrame(frame));

  // Высота строки — из места, которое карточка занимает до низа экрана: плашки крупнее на высоких окнах
  const grid = root.querySelector('.tl__grid');
  const rows = Number(getComputedStyle(track).getPropertyValue('--rows')) || 1;
  function fitRows() {
    root.style.removeProperty('--row-h');
    const cs = getComputedStyle(card);
    const inner = card.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const other = track.offsetHeight - grid.offsetHeight + 12; // шапка шкалы и нижний запас сетки
    const h = Math.min(72, Math.max(36, Math.floor((inner - other) / rows)));
    root.style.setProperty('--row-h', `${h}px`);
    pinDoc();
  }
  // Полоса шире своих дней, если текст длиннее: комментарий ставим к её настоящему правому краю
  function pinDoc() {
    if (!doc) return;
    const bar = bars[Number(doc.dataset.bar)];
    if (bar) doc.style.left = `${bar.offsetLeft + bar.offsetWidth}px`;
  }
  const onResize = () => {
    fitRows();
    onScroll();
  };

  function setup() {
    const live = wide.matches && !reduce.matches;
    root.classList.toggle('is-live', live);
    root.classList.toggle('is-static', !live);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (live) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      fitRows();
      frame();
    } else {
      root.style.removeProperty('--row-h');
      pinDoc();
      track.style.transform = '';
      card.style.setProperty('--g', '0');
      paint(days + 10);
    }
  }
  wide.addEventListener('change', setup);
  reduce.addEventListener('change', setup);
  setup();
  // Ширина полос зависит от шрифта: после его загрузки пересчитываем
  document.fonts?.ready.then(() => (root.classList.contains('is-live') ? onResize() : pinDoc()));
}
