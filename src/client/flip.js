// Блок 3: карточка диаграммы переворачивается в таблицу с полным расчётом.
// От 900 px — переворот (CSS, rotateY). На телефоне переворота нет: таблица раскрывается
// под диаграммой. При prefers-reduced-motion переворот заменён простой сменой содержимого (CSS).
// Скрытая сторона получает inert, чтобы в неё нельзя было попасть с клавиатуры.
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

  openBtn.addEventListener('click', () => {
    open = wide.matches ? true : !open;
    sync();
    if (open && wide.matches) closeBtn?.focus({ preventScroll: true });
  });
  closeBtn?.addEventListener('click', () => {
    open = false;
    sync();
    openBtn.focus({ preventScroll: true });
  });
  wide.addEventListener('change', sync);
  sync();

  // Строки таблицы раскрываются по клику
  root.querySelectorAll('[data-calc-row]').forEach((row) => {
    const more = document.getElementById(row.getAttribute('aria-controls'));
    row.addEventListener('click', () => {
      const expanded = row.getAttribute('aria-expanded') === 'true';
      row.setAttribute('aria-expanded', String(!expanded));
      if (more) more.hidden = expanded;
    });
  });
}
