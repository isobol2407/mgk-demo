// Блок «Так проверяем каждую машину», движение «Рельс»: шкала слева от шагов наливается
// за прокруткой — заливка идёт за «линией чтения» на 60 % высоты окна и откатывается назад
// при прокрутке вверх. Шаг загорается, когда заливка дошла до его точки, результаты выезжают
// следом, на плашке «забраковали» шкала красная. Считается только пока блок рядом с экраном.
// При reduced-motion и без IntersectionObserver шкала залита целиком (CSS по умолчанию).
const clamp = (v) => Math.min(1, Math.max(0, v));

export function initCheck() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.querySelectorAll('[data-check]').forEach((list) => {
    const steps = [...list.querySelectorAll('.how__step')];
    const stop = list.querySelector('.how__stop');
    const fork = list.querySelector('.how__fork');
    let raf = 0;

    function frame() {
      raf = 0;
      const h = list.offsetHeight;
      const fill = clamp((window.innerHeight * 0.6 - list.getBoundingClientRect().top) / h) * h;
      list.style.setProperty('--f', (fill / h).toFixed(4));
      steps.forEach((s) => {
        const mid = s.offsetTop + s.offsetHeight / 2;
        s.classList.toggle('is-on', fill >= mid - 2);
        s.style.setProperty('--c', clamp((fill - mid) / 72).toFixed(3));
      });
      if (stop) stop.style.setProperty('--p', clamp((fill - stop.offsetTop) / stop.offsetHeight).toFixed(3));
      if (fork) fork.classList.toggle('is-on', fill >= fork.offsetTop + fork.offsetHeight / 2);
    }
    const req = () => raf || (raf = requestAnimationFrame(frame));

    list.classList.add('is-live');
    frame();
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
