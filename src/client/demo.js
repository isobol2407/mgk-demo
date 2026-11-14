// Плашка о демо-версии.
// 1. Переход как включение старого телевизора: блок схлопнут в светящуюся полоску,
//    полоска растягивается по ширине, потом раскрывается по высоте, шум вспыхивает и гаснет.
//    Только transform, filter и opacity: раскладка не двигается, на телефоне тоже лёгкое.
//    Срабатывает один раз, когда блок занял больше половины окна (раньше человек ещё
//    не доскроллил до текста и эффект пропускал). При reduced-motion не работает.
// 2. Пока плашка на экране, закреплённая кнопка «Написать» внизу телефона скрыта:
//    в плашке своя кнопка — написать мне.
export function initDemoNote() {
  const root = document.querySelector('[data-demo-note]');
  if (!root) return;
  const inner = root.querySelector('[data-demo-in]');
  const dock = document.querySelector('[data-dock]');

  if ('IntersectionObserver' in window && dock) {
    new IntersectionObserver(([e]) => dock.classList.toggle('is-off', e.isIntersecting), { threshold: 0.15 }).observe(root);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !inner || !('IntersectionObserver' in window) || !inner.animate) return;

  // Прячем содержимое только когда скрипт точно работает
  root.classList.add('is-off-air');
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      root.classList.remove('is-off-air');
      root.classList.add('is-switching');
      const anim = inner.animate(
        [
          { transform: 'scale(0.02, 0.004)', filter: 'brightness(4)', opacity: 1, offset: 0 },
          { transform: 'scale(1, 0.004)', filter: 'brightness(4)', offset: 0.35 },
          { transform: 'scale(1, 1.04)', filter: 'brightness(1.6)', offset: 0.75 },
          { transform: 'scale(1, 1)', filter: 'brightness(1)', opacity: 1, offset: 1 },
        ],
        { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
      );
      anim.onfinish = anim.oncancel = () => root.classList.remove('is-switching');
    },
    // Если блок выше окна (телефон), порог снижаем, чтобы он точно был достижим
    { threshold: Math.min(0.55, (window.innerHeight * 0.9) / Math.max(root.offsetHeight, 1)) },
  );
  io.observe(root);
}
