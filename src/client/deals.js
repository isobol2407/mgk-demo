// Лента привезённых машин: два фильтра (бюджет и состояние), стрелки и три особых состояния.
//   в фильтре 1–2 машины → после них карточка «показали не всё» с кнопкой в канал;
//   в фильтре пусто      → карточка «пока не привозили» с кнопкой в мессенджер;
//   иначе                → последняя карточка «Ещё N машин — в Telegram-канале».
import { chatUrl, primaryKey } from '../lib/messenger.js';

export function initDeals(root, company) {
  const rail = root.querySelector('[data-rail]');
  if (!rail) return;
  const cards = [...rail.querySelectorAll('[data-deal]')];
  const states = Object.fromEntries([...rail.querySelectorAll('[data-state]')].map((el) => [el.dataset.state, el]));
  const budgetBtns = [...root.querySelectorAll('[data-budget-filter]')];
  const condBtns = [...root.querySelectorAll('[data-condition-filter]')];
  const status = root.querySelector('[data-deals-status]');
  const emptyLink = rail.querySelector('[data-empty-link]');
  const prev = root.querySelector('[data-rail-prev]');
  const next = root.querySelector('[data-rail-next]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  let budget = ''; // пусто: любой бюджет
  let condition = 'all';

  const updateArrows = () => {
    if (!prev || !next) return;
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };

  function apply() {
    let shown = 0;
    cards.forEach((card) => {
      const ok = (!budget || card.dataset.budget === budget) && (condition === 'all' || card.dataset.condition === condition);
      card.hidden = !ok;
      if (ok) shown++;
    });
    const filtered = Boolean(budget) || condition !== 'all';
    states.empty.hidden = shown !== 0;
    // Когда в фильтре пусто, «Следить» уже есть в пустом состоянии: карточку не дублируем
    const watch = rail.querySelector('[data-watch-card]');
    if (watch) watch.hidden = shown === 0;
    states.few.hidden = !(filtered && shown >= 1 && shown <= 2);
    states.end.hidden = shown === 0 || !states.few.hidden;

    budgetBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.budgetFilter === budget)));
    condBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.conditionFilter === condition)));

    // Кнопка в пустом состоянии: в сообщение подставляется выбранный бюджет
    if (emptyLink) {
      const label = company.budgets.find((b) => b.id === budget)?.label ?? '';
      emptyLink.href = chatUrl(company, primaryKey(company), company.messages.budget + label);
    }
    if (status) status.textContent = shown ? `Показано машин: ${shown}` : 'В этом бюджете пока не привозили';
    rail.scrollTo({ left: 0 });
    updateArrows();
  }

  budgetBtns.forEach((b) =>
    b.addEventListener('click', () => {
      // Повторное нажатие снимает фильтр
      budget = budget === b.dataset.budgetFilter ? '' : b.dataset.budgetFilter;
      apply();
    }),
  );
  condBtns.forEach((b) =>
    b.addEventListener('click', () => {
      condition = b.dataset.conditionFilter;
      apply();
    }),
  );

  const step = () => {
    const first = cards.find((c) => !c.hidden) ?? rail.firstElementChild;
    return (first?.offsetWidth ?? 320) + parseFloat(getComputedStyle(rail).columnGap || '16');
  };
  const scrollBy = (dir) => rail.scrollBy({ left: dir * step(), behavior: reduce.matches ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => scrollBy(-1));
  next?.addEventListener('click', () => scrollBy(1));
  rail.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  apply();
}
