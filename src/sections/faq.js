// 10. Вопросы, по референсу doko.studio. Тёмный блок: слева фото выдачи, фраза и кнопка
// «Задать свой вопрос», справа крупный заголовок и аккордеон с плюсами.
// Аккордеон на <details>: работает без скрипта, первый вопрос раскрыт.
import { esc } from '../lib/marks.js';
import { icon, photo, actionBtn } from '../lib/ui.js';

export function renderFaq(c) {
  const f = c.faq;
  if (!f?.list?.length) return '';
  const items = f.list
    .map(
      (x, i) => `
        <details class="qa"${i === 0 ? ' open' : ''}>
          <summary class="qa__q"><span>${esc(x.q)}</span>${icon('plus', 'qa__plus')}</summary>
          <p class="qa__a">${esc(x.a)}</p>
        </details>`,
    )
    .join('');
  return `
<section class="faq section section--ink" id="faq">
  <div class="container faq__grid">
    <div class="faq__aside">
      ${f.photo ? `<div class="faq__photo">${photo(f.photo, { alt: f.photoAlt ?? '', sizes: '(min-width: 1100px) 360px, 100vw' })}</div>` : ''}
      <p class="faq__lead">${esc(f.aside ?? 'Не нашли свой вопрос — напишите, ответим в мессенджере.')}</p>
      ${actionBtn('faq', { label: 'Задать свой вопрос', cls: 'btn btn--lime' })}
    </div>
    <div class="faq__main">
      <h2 class="display h2 faq__h">${esc(f.title)}</h2>
      <div class="faq__list">${items}</div>
    </div>
  </div>
</section>`;
}
