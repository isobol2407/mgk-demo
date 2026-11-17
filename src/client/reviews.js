// Отзывы: перелистывание сообщений в большой карточке стрелками, по кругу.
export function initReviews() {
  const root = document.querySelector('[data-rv]');
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-rv-slide]')];
  let i = 0;
  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.hidden = k !== i;
      s.classList.toggle('is-active', k === i);
    });
  };
  root.querySelector('[data-rv-prev]')?.addEventListener('click', () => show(i - 1));
  root.querySelector('[data-rv-next]')?.addEventListener('click', () => show(i + 1));
}
