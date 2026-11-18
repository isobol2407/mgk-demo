// «Как привозим» на телефоне и планшете (до 1024 px, где вместо таймлайна список шагов):
// линии между шагами наливаются синим за прокруткой — заливка идёт за «линией чтения»
// на 60 % высоты окна и откатывается назад при прокрутке вверх, как «Рельс» в проверке машины.
// Цифра загорается, когда заливка дошла до её середины.
// Производительность: положения меряются один раз и при изменении размера списка; на кадре —
// одно чтение раскладки и запись transform прямо в элементы. Слушаем, только пока список рядом.
import { was } from './was.js';

const clamp = (v) => Math.min(1, Math.max(0, v));

export function initStepsLine() {
  const list = document.querySelector('.steps__list');
  if (!list || !('IntersectionObserver' in window)) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 1023px)');
  const steps = [...list.querySelectorAll('.step')].map((el) => ({
    el,
    fill: el.querySelector('.step__fill'),
    n: el.querySelector('.step__n'),
    top: 0,
    mid: 0,
    lineTop: 0,
    lineH: 1,
    on: null,
  }));
  let raf = 0;

  function measure() {
    steps.forEach((s) => {
      s.top = s.el.offsetTop;
      s.mid = s.top + s.n.offsetTop + s.n.offsetHeight / 2;
      s.lineTop = s.top + s.fill.offsetTop;
      s.lineH = s.fill.offsetHeight || 1;
    });
  }

  function frame() {
    raf = 0;
    const live = narrow.matches && !reduce.matches && !was('steps') && list.offsetHeight > 0;
    if (live !== list.classList.contains('is-live')) {
      list.classList.toggle('is-live', live);
      if (live) measure();
    }
    if (!live) return;
    const fill = window.innerHeight * 0.6 - list.getBoundingClientRect().top;
    steps.forEach((s) => {
      const on = fill >= s.mid;
      if (on !== s.on) {
        s.on = on;
        s.el.classList.toggle('is-on', on);
      }
      s.fill.style.transform = `scaleY(${clamp((fill - s.lineTop) / s.lineH).toFixed(4)})`;
    });
  }
  const req = () => raf || (raf = requestAnimationFrame(frame));

  new ResizeObserver(() => {
    if (list.classList.contains('is-live')) measure();
    req();
  }).observe(list);
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        window.addEventListener('scroll', req, { passive: true });
        window.addEventListener('resize', req);
        req();
      } else {
        window.removeEventListener('scroll', req);
        window.removeEventListener('resize', req);
      }
    },
    { rootMargin: '25% 0px' },
  ).observe(list);
  // Стенд переключил «Было / Стало» — перерисовать
  document.addEventListener('anim-stand', req);
  req();
}
