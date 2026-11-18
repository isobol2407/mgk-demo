// Блок 3: карточка диаграммы переворачивается в таблицу с полным расчётом.
// От 900 px — переворот (CSS, rotateY). На телефоне переворота нет: таблица раскрывается
// под диаграммой. При prefers-reduced-motion переворот заменён простой сменой содержимого (CSS).
// Скрытая сторона получает inert, чтобы в неё нельзя было попасть с клавиатуры.
import { was } from './was.js';

export function initFlip(root) {
  const front = root.querySelector('[data-flip-front]');
  const back = root.querySelector('[data-flip-back]');
  const openBtn = root.querySelector('[data-flip-open]');
  const closeBtn = root.querySelector('[data-flip-close]');
  if (!front || !back || !openBtn) return;
  const wide = window.matchMedia('(min-width: 900px)');
  let open = false;

  function sync() {
    root.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    back.toggleAttribute('inert', !open);
    // На десктопе лицевая сторона при перевороте скрыта, на телефоне она остаётся на месте
    front.toggleAttribute('inert', open && wide.matches);
  }

  const openCalc = () => {
    open = wide.matches ? true : !open;
    sync();
    if (open && wide.matches) closeBtn?.focus({ preventScroll: true });
  };
  const closeCalc = () => {
    open = false;
    sync();
    openBtn.focus({ preventScroll: true });
  };
  // Переворот по клику на всю карточку, а не только на кнопку.
  // Клики по кнопкам и ссылкам внутри (строки таблицы) обрабатываются как обычно.
  const isControl = (e) => e.target.closest('button, a') && !e.target.closest('[data-flip-open], [data-flip-close]');
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openCalc();
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCalc();
  });
  front.addEventListener('click', (e) => {
    if (!isControl(e) && !window.getSelection()?.toString()) openCalc();
  });
  back.addEventListener('click', (e) => {
    if (wide.matches && open && !isControl(e) && !window.getSelection()?.toString()) closeCalc();
  });
  wide.addEventListener('change', sync);
  sync();

  // Строки таблицы раскрываются по клику: как «Вопросы» — высота и проявление за 300 мс,
  // сворачивание быстрее, 200 мс (find-animation-opportunities). Повторный клик посреди
  // движения продолжает с текущей высоты. Без анимации при reduced-motion и в «Было» стенда.
  const reduceRows = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  root.querySelectorAll('[data-calc-row]').forEach((row) => {
    const more = document.getElementById(row.getAttribute('aria-controls'));
    let anim = null;
    row.addEventListener('click', () => {
      const expanded = row.getAttribute('aria-expanded') === 'true';
      row.setAttribute('aria-expanded', String(!expanded));
      if (!more) return;
      const from = more.hidden ? 0 : more.offsetHeight;
      anim?.cancel();
      anim = null;
      if (was('calc') || reduceRows.matches || !more.animate) {
        more.hidden = expanded;
        return;
      }
      more.hidden = false;
      const full = more.offsetHeight;
      const pad = getComputedStyle(more).paddingBottom;
      const frame = (h) => ({ height: `${h}px`, paddingBottom: h ? pad : '0px', opacity: h ? 1 : 0, overflow: 'hidden' });
      if (expanded) {
        anim = more.animate([frame(from), frame(0)], { duration: 200, easing: EASE, fill: 'forwards' });
        anim.onfinish = () => {
          more.hidden = true;
          anim?.cancel();
          anim = null;
        };
      } else {
        anim = more.animate([frame(from), frame(full)], { duration: 300, easing: EASE });
        anim.onfinish = () => (anim = null);
      }
    });
  });
}
