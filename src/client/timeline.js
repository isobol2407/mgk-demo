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
  }

  function frame() {
    raf = 0;
    const r = root.getBoundingClientRect();
    const travel = root.offsetHeight - stage.offsetHeight;
    const progress = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 1;
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

  function setup() {
    const live = wide.matches && !reduce.matches;
    root.classList.toggle('is-live', live);
    root.classList.toggle('is-static', !live);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (live) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      frame();
    } else {
      track.style.transform = '';
      paint(days + 10);
    }
  }
  wide.addEventListener('change', setup);
  reduce.addEventListener('change', setup);
  setup();
}
