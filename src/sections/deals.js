// 2. Привезённые машины. Лента карточек сделок с двумя фильтрами: бюджет и «новые / с пробегом».
// Только уже привезённые машины, без предложений из каталога. Фильтра по стране нет.
import { esc, val, demoBadge, isAsk, isHidden } from '../lib/marks.js';
import { icon, photo, chatBtn, extLink } from '../lib/ui.js';
import { primaryKey, messengerLabel, chatAttrs } from '../lib/messenger.js';
import { mln, days, saving, budgetOf } from '../lib/format.js';

const CONDITION = { new: 'Новый', used: 'С пробегом' };

function dealCardHTML(c, d) {
  return `
    <article class="deal card" data-deal data-budget="${budgetOf(d.turnkey, c.budgets)}" data-condition="${d.condition}">
      <div class="deal__media">
        ${photo(d.photo, { alt: `${d.model}, ${d.year}: выдача ${d.cityIn}`, sizes: '(min-width: 1100px) 380px, (min-width: 768px) 45vw, 80vw' })}
        <span class="deal__date">${esc(d.date)}</span>
      </div>
      <div class="deal__body">
        <h3 class="deal__model display">${esc(d.model)}, ${d.year}</h3>
        <p class="deal__meta">${CONDITION[d.condition]} · ${esc(d.city)} · ${days(d.days)}</p>
        ${d.badge ? `<p class="deal__badge">${esc(d.badge)}</p>` : ''}
        <dl class="prices">
          <div class="prices__row"><dt>Такая же в России</dt><dd>${mln(d.priceRu)}</dd></div>
          <div class="prices__row"><dt>Под ключ ${esc(d.from)}</dt><dd>${mln(d.turnkey)}</dd></div>
          <div class="prices__row prices__row--save"><dt>Экономия${d.demo ? ` ${demoBadge()}` : ''}</dt><dd>${mln(saving(d))}</dd></div>
        </dl>
        <div class="deal__act">
          ${chatBtn(c, { text: c.messages.sameCar(d), label: 'Хочу такую же', cls: 'btn--cobalt btn--sm' })}
          ${extLink('Пост о выдаче', d.post, { cls: 'link link--ink' })}
        </div>
        ${d.breakdown ? `<a class="link deal__more" href="#price">Разбор цены${icon('arrow-down')}</a>` : ''}
      </div>
    </article>`;
}

function reviewsHTML(c) {
  const y = c.ratings.yandex;
  const a = c.ratings.avito;
  const items = [];
  if (y && !isHidden(y.rating)) {
    const text = `${icon('star')}<span>${val(y.rating)} · ${val(y.count)} отзывов на Яндекс.Картах</span>`;
    items.push(isAsk(y.url) ? `<span class="reviews__item">${text}</span>` : `<a class="reviews__item" href="${esc(y.url)}" target="_blank" rel="noopener">${text}${icon('arrow-ur')}</a>`);
  }
  if (a && !isHidden(a.count)) {
    const text = `${a.rating ? `${icon('star')}<span>${val(a.rating)} · ` : '<span>'}${val(a.count)} отзывов на Авито</span>`;
    items.push(isAsk(a.url) ? `<span class="reviews__item">${text}</span>` : `<a class="reviews__item" href="${esc(a.url)}" target="_blank" rel="noopener">${text}${icon('arrow-ur')}</a>`);
  }
  return items.length ? `<ul class="reviews">${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';
}

export function renderDeals(c) {
  const key = primaryKey(c);
  const label = messengerLabel(c, key);
  const channel = c.messengers.telegram?.channel ?? '#';
  const chips = c.budgets
    .map((b) => `<button class="chip" type="button" aria-pressed="false" data-budget-filter="${b.id}">${esc(b.label)}</button>`)
    .join('');
  const seg = [
    ['all', 'Все'],
    ['new', 'Новые'],
    ['used', 'С пробегом'],
  ]
    .map(([id, text], i) => `<button class="seg__btn" type="button" aria-pressed="${i === 0}" data-condition-filter="${id}">${text}</button>`)
    .join('');

  return `
<section class="deals section section--paper" id="deals" data-deals>
  <div class="container">
    <header class="deals__head">
      <div>
        <p class="eyebrow">Привезённые машины</p>
        <h2 class="display h2">Что уже привезли на ваш бюджет</h2>
        <p class="sub deals__sub">По каждой машине: цена под ключ, срок и пост о выдаче. ${extLink(`Все машины в ${esc(label)}`, channel)}</p>
      </div>
      ${reviewsHTML(c)}
    </header>
    <div class="deals__bar">
      <div class="chips" role="group" aria-label="Бюджет под ключ">${chips}</div>
      <div class="seg" role="group" aria-label="Состояние машины">${seg}</div>
      <div class="deals__nav">
        <button class="arrow" type="button" aria-label="Предыдущие машины" data-rail-prev disabled>${icon('chevron-l')}</button>
        <button class="arrow" type="button" aria-label="Следующие машины" data-rail-next>${icon('chevron-r')}</button>
      </div>
    </div>
    <p class="vh" aria-live="polite" data-deals-status></p>
  </div>
  <div class="rail" data-rail tabindex="0" role="group" aria-label="Лента привезённых машин">
    ${c.deals.map((d) => dealCardHTML(c, d)).join('')}
    <div class="deal deal--state" data-state="few" hidden>
      <p class="deal__state-text display">В этом бюджете показали не всё. Остальные машины — в Telegram-канале</p>
      <a class="btn btn--white" href="${esc(channel)}" target="_blank" rel="noopener">${icon('tg')}<span>Открыть канал</span></a>
    </div>
    <div class="deal deal--state" data-state="empty" hidden>
      <p class="deal__state-text display">В этом бюджете пока не привозили. Напишите, посчитаем под вас</p>
      <a class="btn btn--white" ${chatAttrs(c, key, c.messages.budget)} data-empty-link>${icon('tg')}<span>Написать в ${esc(label)}</span></a>
    </div>
    <a class="deal deal--state deal--end" data-state="end" href="${esc(channel)}" target="_blank" rel="noopener">
      <span class="deal__state-text display">${isHidden(c.dealsMore) ? 'Остальные машины' : `Ещё ${val(c.dealsMore)} машин`} — в Telegram-канале</span>
      <span class="deal__end-arrow">${icon('arrow-ur')}</span>
    </a>
  </div>
</section>`;
}
