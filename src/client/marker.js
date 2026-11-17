// Маркер под суммой экономии (.money): лаймовая подложка «прокрашивается» слева направо,
// когда сумма появляется на экране. Без IntersectionObserver видна сразу,
// чтобы подложка не осталась пустой при сбое. При reduced-motion CSS показывает её сразу.
export function initMarkers() {
  const items = [...document.querySelectorAll('.money')];
  if (!items.length) return;
  const showAll = () => items.forEach((el) => el.classList.add('is-in'));
  if (!('IntersectionObserver' in window)) return showAll();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }),
    { threshold: 0.6 },
  );
  items.forEach((el) => io.observe(el));
}
