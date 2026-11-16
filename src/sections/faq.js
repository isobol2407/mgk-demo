// 10. Вопросы. Аккордеон на <details>: работает без скрипта, первый вопрос раскрыт.
// Под ним кнопка «Задать свой вопрос» в мессенджер с готовым началом сообщения.
import { esc } from '../lib/marks.js';
import { icon, actionBtn } from '../lib/ui.js';

export function renderFaq(c) {
  const f = c.faq;
  if (!f?.list?.length) return '';
  const items = f.list
    .map(
      (x, i) => `
        <details class="qa"${i === 0 ? ' open' : ''}>
          <summary class="qa__q"><span>${esc(x.q)}</span>${icon('chevron-d', 'qa__chev')}</summary>
          <p class="qa__a">${esc(x.a)}</p>
        </details>`,
    )
    .join('');
  return `
<section class="faq section section--paper" id="faq">
  <div class="container faq__grid">
    <div class="faq__head">
      <h2 class="display h2">${esc(f.title)}</h2>
      <p class="sub">Не нашли свой вопрос — напишите, ответим в мессенджере.</p>
      ${actionBtn('faq', { label: 'Задать свой вопрос', cls: 'btn btn--cobalt' })}
    </div>
    <div class="faq__list">${items}</div>
  </div>
</section>`;
}
