// Шторка «Что произойдёт дальше» на телефоне: смахнуть вниз за верх окна (полоска и заголовок).
// По правилам скилла gestures (Vaul — React-библиотека, у нас чистый JS, поэтому своё):
//  · пока палец на экране — окно идёт за ним 1:1, без кривых; вверх — с сопротивлением (×0.2);
//  · фон тускнеет из того же источника — сдвига окна (--drag), а не отдельной анимацией;
//  · отпустили: закрываем, если утянули больше 40 % высоты или бросили быстро
//    (расстояние / время > 0.4 px/мс — порог Vaul для шторок; 0.11 из Sonner — для всплывашек,
//    на шторке он закрывал от случайного короткого рывка), иначе быстро возвращаем на место;
//  · отпускание — CSS-переход с кривой шторки Vaul cubic-bezier(0.32, 0.72, 0, 1), не кадры;
//  · кнопки и ссылки в шапке жест не начинают. При reduced-motion отпускание короче (150 мс).
import { was } from './was.js';

const CURVE = 'cubic-bezier(0.32, 0.72, 0, 1)';

export function initSheet(dialog) {
  const phone = window.matchMedia('(max-width: 767px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let drag = null;

  const reset = () => {
    dialog.classList.remove('is-dragging');
    dialog.style.removeProperty('transform');
    dialog.style.removeProperty('transition');
    dialog.style.removeProperty('--drag');
  };
  dialog.addEventListener('close', reset);

  dialog.addEventListener('pointerdown', (e) => {
    if (!phone.matches || was('sheet') || !dialog.open || dialog.dataset.closing) return;
    if (!e.target.closest('.next__grab, .next__head') || e.target.closest('button, a')) return;
    // Окно ещё доезжает после открытия — завершаем, чтобы палец взял его с места
    dialog.getAnimations().forEach((a) => a.finish());
    drag = { id: e.pointerId, y0: e.clientY, t0: e.timeStamp, y: 0, h: dialog.offsetHeight || 1 };
    try {
      dialog.setPointerCapture(e.pointerId);
    } catch {
      // указатель уже отпущен — жест всё равно доведём по pointerup
    }
    dialog.classList.add('is-dragging');
    dialog.style.transition = 'none';
  });

  dialog.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y0;
    drag.y = dy > 0 ? dy : dy * 0.2;
    dialog.style.transform = `translateY(${drag.y}px)`;
    dialog.style.setProperty('--drag', Math.min(1, Math.max(0, drag.y / drag.h)).toFixed(3));
  });

  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    dialog.classList.remove('is-dragging');
    const speed = d.y / Math.max(1, e.timeStamp - d.t0); // px/мс, вниз — положительная
    const dismiss = d.y > d.h * 0.4 || (d.y > 40 && speed > 0.4);
    const ms = reduce.matches ? 150 : dismiss ? 300 : 250;
    dialog.style.transition = `transform ${ms}ms ${CURVE}`;
    if (dismiss) {
      dialog.style.transform = 'translateY(100%)';
      dialog.style.setProperty('--drag', '1');
      dialog.dataset.closing = '1';
      setTimeout(() => {
        delete dialog.dataset.closing;
        dialog.close();
      }, ms);
    } else {
      dialog.style.transform = 'translateY(0)';
      dialog.style.setProperty('--drag', '0');
      setTimeout(() => !drag && dialog.open && reset(), ms);
    }
  };
  dialog.addEventListener('pointerup', release);
  dialog.addEventListener('pointercancel', release);
}
