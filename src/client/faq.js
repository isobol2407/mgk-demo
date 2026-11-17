// Вопросы: плавное раскрытие <details>. Высота плавно доезжает до новой (Web Animations),
// ответ проявляется, плюс поворачивается в крестик. Без скрипта и при reduced-motion
// <details> работает как обычно, мгновенно.
const DUR = 420;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function initFaq() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.qa').forEach((item) => {
    const summary = item.querySelector('summary');
    const answer = item.querySelector('.qa__a');
    let anim = null;

    summary.addEventListener('click', (e) => {
      if (reduce.matches) return;
      e.preventDefault();
      const from = item.offsetHeight;
      anim?.cancel();
      const closing = item.open && !item.classList.contains('is-closing');
      if (closing) {
        item.classList.add('is-closing');
        const to = summary.offsetHeight;
        anim = item.animate({ height: [`${from}px`, `${to}px`] }, { duration: DUR, easing: EASE });
        answer.animate({ opacity: [1, 0] }, { duration: DUR / 2, fill: 'forwards' });
        anim.onfinish = () => {
          item.open = false;
          item.classList.remove('is-closing');
          answer.getAnimations().forEach((a) => a.cancel());
          anim = null;
        };
      } else {
        item.classList.remove('is-closing');
        item.open = true;
        const to = item.offsetHeight;
        anim = item.animate({ height: [`${from}px`, `${to}px`] }, { duration: DUR, easing: EASE });
        answer.animate(
          { opacity: [0, 1], transform: ['translateY(-6px)', 'none'] },
          { duration: DUR, delay: 80, easing: EASE, fill: 'backwards' },
        );
        anim.onfinish = () => (anim = null);
      }
    });
  });
}
