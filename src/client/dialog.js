// Закрытие модалок (<dialog>) с анимацией: открытие было в CSS, закрытие — короче и быстрее.
// Телефон, модалка «Что дальше»: шторка уезжает вниз. Остальное: лёгкое растворение со сдвигом.
// Esc закрывает мгновенно (нативно): действие с клавиатуры не анимируем (remove-animations).
// При reduced-motion — тоже сразу.
const SHEET = 'cubic-bezier(0.32, 0.72, 0, 1)'; // --ease-drawer
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // --ease
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const phone = window.matchMedia('(max-width: 767px)');

export function closeDialog(dialog, { instant = false } = {}) {
  if (!dialog?.open || dialog.dataset.closing) return;
  if (instant || reduce.matches || !dialog.animate) return dialog.close();
  dialog.dataset.closing = '1';
  const sheet = phone.matches && dialog.matches('.next');
  const anim = dialog.animate(
    sheet
      ? [{ transform: 'none' }, { transform: 'translateY(100%)' }]
      : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px)' }],
    { duration: 200, easing: sheet ? SHEET : EASE, fill: 'forwards' },
  );
  try {
    dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: EASE, fill: 'forwards', pseudoElement: '::backdrop' });
  } catch {
    // Старые браузеры не анимируют ::backdrop — фон просто исчезнет вместе с окном
  }
  const done = () => {
    delete dialog.dataset.closing;
    dialog.close();
    dialog.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  };
  anim.onfinish = done;
  anim.oncancel = done;
}

