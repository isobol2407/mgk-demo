// 8. Отзывы, по референсу gohelper.io. Один экран: слева большая карточка с перелистыванием
// настоящих отзывов с сайта МГК в виде сообщений Telegram, справа четыре карточки
// со скринами переписок (пока размытые заглушки: по клику — «здесь будут ваши отзывы»).
// Под отзывом — рейтинги со ссылками на Яндекс.Карты и Авито. Перелистывание — src/client/reviews.js.
import { esc } from '../lib/marks.js';
import { icon, extLink } from '../lib/ui.js';
import { actionAttrs } from '../lib/actions.js';

// Размытая заглушка скрина переписки: пузыри разной длины вместо текста
function chatStub(seed) {
  const widths = [[70, 45, 80], [55, 85, 40, 60], [80, 50, 65], [45, 75, 55, 70]][seed % 4];
  return `<span class="rv-stub" aria-hidden="true">${widths
    .map((w, i) => `<span class="rv-stub__b${i % 2 ? ' rv-stub__b--me' : ''}" style="width:${w}%"></span>`)
    .join('')}</span>`;
}

export function renderReviews(c) {
  const r = c.reviews;
  if (!r?.list?.length) return '';
  const slides = r.list
    .map(
      (x, i) => `
        <figure class="rv-slide${i === 0 ? ' is-active' : ''}" data-rv-slide${i === 0 ? '' : ' hidden'}>
          <blockquote class="rv-msg">
            <span class="rv-msg__from"><b>${esc(x.name)}</b> · ${esc(x.city)}</span>
            <span class="rv-msg__text">${esc(x.text)}</span>
          </blockquote>
          <figcaption class="rv-slide__car">${esc(x.car)}</figcaption>
        </figure>`,
    )
    .join('');
  const shots = (r.shots ?? [])
    .map((s, i) => {
      const { tag, attrs } = actionAttrs('reviews', { ctx: { title: s.title } });
      return `
        <${tag} class="rv-shot" ${attrs}>
          <span class="rv-shot__t display">${esc(s.title)}</span>
          <span class="rv-shot__screen">${chatStub(i)}</span>
        </${tag}>`;
    })
    .join('');
  // Рейтинги со ссылками: все отзывы на Яндекс.Картах и Авито
  const rate = (v, label) =>
    v && v.url ? `<li>${extLink(`<b>${esc(v.rating)} ★</b> ${label}`, v.url, { cls: 'rv-rate' })}</li>` : '';
  const rates = rate(c.ratings?.yandex, 'все отзывы на Яндекс.Картах') + rate(c.ratings?.avito, 'на Авито');
  return `
<section class="rv section section--paper" id="reviews">
  <div class="container">
    <div class="rv__grid">
      <div class="rv-main card">
        <h2 class="display h2 rv-main__h">${esc(r.title)}</h2>
        <div class="rv-main__slider" data-rv>
          <button class="rv-arrow rv-arrow--prev" type="button" aria-label="Предыдущий отзыв" data-rv-prev>${icon('chevron-l')}</button>
          <div class="rv-main__slides" aria-live="polite">${slides}</div>
          <button class="rv-arrow rv-arrow--next" type="button" aria-label="Следующий отзыв" data-rv-next>${icon('chevron-r')}</button>
        </div>
        <ul class="rv-main__rates">${rates}</ul>
      </div>
      <div class="rv__shots">${shots}</div>
    </div>
  </div>
</section>`;
}
