// Блок «Так проверяем каждую машину», движение «Рельс»: шкала слева от шагов наливается
// за прокруткой — заливка идёт за «линией чтения» на 60 % высоты окна и откатывается назад
// при прокрутке вверх. Шаг загорается, когда заливка дошла до его точки, результаты выезжают
// следом, на плашке «забраковали» шкала красная. Считается только пока блок рядом с экраном.
// При reduced-motion и без IntersectionObserver шкала залита целиком (CSS по умолчанию).
//
// Производительность (аудит «Анимации от Ковальски»): положения шагов меряются один раз
// и при изменении размера списка (ResizeObserver), на кадре — одно чтение раскладки,
// дальше только запись transform и opacity прямо в элементы.
const clamp = (v) => Math.min(1, Math.max(0, v));

export function initCheck() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.querySelectorAll('[data-check]').forEach((wrap) => {
    const list = wrap.querySelector('.how');
    const fill = wrap.querySelector('.how__fill');
    if (!list || !fill) return;
    const steps = [...list.querySelectorAll('.how__step')].map((el) => ({ el, res: el.querySelector('.how__res'), mid: 0, on: null }));
    const stop = list.querySelector('.how__stop');
    const stopRail = stop?.querySelector('.how__stop-rail');
    const fork = list.querySelector('.how__fork');
    let h = 1;
    let stopTop = 0;
    let stopH = 1;
    let forkMid = 0;
    let last = -1;
    let raf = 0;

    function measure() {
      h = list.offsetHeight || 1;
      steps.forEach((s) => (s.mid = s.el.offsetTop + s.el.offsetHeight / 2));
      if (stop) {
        stopTop = stop.offsetTop;
        stopH = stop.offsetHeight || 1;
      }
      if (fork) forkMid = fork.offsetTop + fork.offsetHeight / 2;
      last = -1;
    }

    function frame() {
      raf = 0;
      const f = clamp((window.innerHeight * 0.6 - list.getBoundingClientRect().top) / h) * h;
      if (Math.abs(f - last) < 0.5) return;
      last = f;
      fill.style.transform = `scaleY(${(f / h).toFixed(4)})`;
      steps.forEach((s) => {
        const on = f >= s.mid - 2;
        if (on !== s.on) {
          s.on = on;
          s.el.classList.toggle('is-on', on);
        }
        if (s.res) {
          const c = clamp((f - s.mid) / 72);
          s.res.style.opacity = c.toFixed(3);
          s.res.style.transform = `translateX(${((1 - c) * -12).toFixed(2)}px)`;
        }
      });
      if (stop) {
        const p = clamp((f - stopTop) / stopH);
        if (stopRail) stopRail.style.transform = `scaleY(${p.toFixed(3)})`;
        stop.style.opacity = (0.2 + p * 0.8).toFixed(3);
      }
      fork?.classList.toggle('is-on', f >= forkMid);
    }
    const req = () => raf || (raf = requestAnimationFrame(frame));

    list.classList.add('is-live');
    measure();
    frame();
    new ResizeObserver(() => {
      measure();
      req();
    }).observe(list);
    // Слушаем прокрутку, только пока блок рядом с экраном
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
  });
}
