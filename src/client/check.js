// Блок «Так проверяем каждую машину»: шаги появляются, когда список виден.
// На телефоне прокрашивается линия маршрута и точки, на десктопе шаги проявляются по очереди.
// Без IntersectionObserver и при reduced-motion всё видно сразу.
export function initCheck() {
  document.querySelectorAll('[data-check]').forEach((el) => {
    const show = () => el.classList.add('is-in');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return show();
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        show();
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
  });
}
