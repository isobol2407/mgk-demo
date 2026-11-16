// 8. Отзывы. Оформлены как сообщения в Telegram: пузырь, имя, город, машина.
// Это вёрстка, а не снимки экрана. Тексты дословно из настоящих отзывов, у каждого
// подпись, откуда он взят, и ссылка на оригинал. Справа рейтинги со ссылками на карты.
import { esc } from '../lib/marks.js';
import { extLink, proofHTML } from '../lib/ui.js';

export function renderReviews(c) {
  const r = c.reviews;
  if (!r?.list?.length) return '';
  const items = r.list
    .map(
      (x) => `
        <li class="msg">
          <p class="msg__from"><b>${esc(x.name)}</b> · ${esc(x.city)}</p>
          <p class="msg__car">${esc(x.car)}</p>
          <p class="msg__text">${esc(x.text)}</p>
          ${extLink(esc(r.source.label), r.source.url, { cls: 'msg__src' })}
        </li>`,
    )
    .join('');
  const y = c.ratings?.yandex;
  return `
<section class="reviews-sec section section--paper" id="reviews">
  <div class="container">
    <header class="reviews-sec__head">
      <h2 class="display h2">${esc(r.title)}</h2>
      ${proofHTML(c, { variant: 'links', cls: 'reviews-sec__proof' })}
    </header>
    <ul class="msgs">${items}</ul>
    ${y?.url ? `<p class="reviews-sec__more">${extLink('Все отзывы на Яндекс.Картах', y.url, { cls: 'link' })}</p>` : ''}
  </div>
</section>`;
}
