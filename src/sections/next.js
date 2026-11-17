// Модалка «Что произойдёт дальше». Одна на всю страницу, содержимое подставляет
// src/client/actions.js из конфига src/lib/actions.js. На телефоне выезжает снизу.
import { esc } from '../lib/marks.js';
import { icon } from '../lib/ui.js';
import { messengerLabel, messengerIcon } from '../lib/messenger.js';

export function renderNextModal(c) {
  const keys = ['telegram', 'max', 'vk'].filter((k) => c.messengers[k]);
  const pills = keys
    .map((k) => `<li class="next__msgr" data-next-key="${k}">${icon(messengerIcon(k))}<span>${esc(messengerLabel(c, k))}</span></li>`)
    .join('');
  const channel = c.messengers.telegram?.channel ?? '#';
  return `
<dialog class="next" data-next aria-labelledby="next-title">
  <div class="next__box">
    <header class="next__head">
      <h2 class="next__title display" id="next-title" tabindex="-1" data-next-heading>Что произойдёт дальше</h2>
      <button class="icon-btn next__close" type="button" aria-label="Закрыть" data-next-close>${icon('close')}</button>
    </header>
    <p class="next__sub" data-next-sub></p>
    <ol class="next__steps" data-next-steps></ol>
    <div class="next__choice" data-next-choice>
      <ul class="next__msgrs" aria-label="Мессенджер">${pills}</ul>
      <p class="next__hint">Клиент выбирает, где ему удобнее. Номер телефона не нужен.</p>
    </div>
    <div class="next__act">
      <button class="btn btn--cobalt" type="button" data-next-close>Понятно</button>
      <a class="link next__tg" href="${esc(channel)}" target="_blank" rel="noopener" data-next-link><span data-next-link-label>Открыть Telegram МГК</span>${icon('arrow-ur')}</a>
    </div>
    <p class="next__demo" data-next-demo>Это демо. На готовом сайте сразу откроется бот, а заявка попадёт в вашу CRM.</p>
  </div>
</dialog>`;
}
