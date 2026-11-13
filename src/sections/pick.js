// 5. Подбор и контакты. Первый вопрос квиза стоит прямо в блоке, остальные в модалке.
// Рядом карточка «Каталог одним сообщением», ниже контакты.
import { esc, isAsk, askBadge, isHidden } from '../lib/marks.js';
import { icon, chatBtn, extLink, telHref } from '../lib/ui.js';
import { chatAttrs, primaryKey, messengerLabel, messengerIcon } from '../lib/messenger.js';

const budgetOptions = (c) => [...c.budgets.map((b) => ({ id: b.id, label: b.label })), { id: 'unknown', label: c.quiz.unknownLabel }];

export function renderPick(c) {
  const key = primaryKey(c);
  const opts = budgetOptions(c)
    .map((o) => `<button class="opt" type="button" data-quiz-open="${o.id}">${esc(o.label)}</button>`)
    .join('');
  const [mainChannel, ...otherChannels] = c.catalog.channels;
  const catalogOther = otherChannels
    .map((k) => chatBtn(c, { key: k, text: c.messages.catalog, label: messengerLabel(c, k), cls: 'btn--line' }))
    .join('');

  const offices = c.contacts.offices
    .map(
      (o) => `
        <li class="office">
          <h3 class="office__city display">${esc(o.city)}</h3>
          <p>${esc(o.address)}</p>
          <p>${isAsk(o.phone) ? askBadge(o.phone) : `<a class="office__tel" href="${telHref(o.phone)}">${esc(o.phone)}</a>`}</p>
        </li>`,
    )
    .join('');
  const messengers = c.contacts.messengers
    .filter((k) => c.messengers[k])
    .map((k) => {
      const m = c.messengers[k];
      const href = k === 'telegram' ? `https://t.me/${m.chat}` : m.chat || m.url;
      return `<li><a class="contact-link" href="${esc(href)}" target="_blank" rel="noopener">${icon(messengerIcon(k))}<span>${esc(m.label)}</span></a></li>`;
    })
    .join('');
  const y = c.ratings.yandex;
  const a = c.ratings.avito;
  const reviews = [y ? extLink('Яндекс.Карты', y.url, { cls: 'link link--on-cobalt' }) : '', a ? extLink('Авито', a.url, { cls: 'link link--on-cobalt' }) : '']
    .filter(Boolean)
    .map((x) => `<li>${x}</li>`)
    .join('');
  const office = c.contacts.officePhoto;
  const officePhoto = isHidden(office)
    ? ''
    : isAsk(office)
    ? `<div class="snap snap--empty" style="--tilt:4deg"><span>${askBadge(office)}</span></div>`
    : `<div class="snap" style="--tilt:4deg"><img src="${esc(office)}" alt="Офис ${esc(c.name)}" loading="lazy" width="960" height="640" /></div>`;

  return `
<section class="pick section section--cobalt" id="pick">
  <div class="container">
    <div class="pick__grid">
      <div class="pick__quiz">
        <h2 class="display h2">Не выбрали машину? Подберём под бюджет</h2>
        <p class="sub">Три вопроса. В ответ пришлём 3–5 вариантов с ценой под ключ.</p>
        <p class="pick__q display h3" id="pick-q">Какой бюджет под ключ?</p>
        <div class="pick__opts" role="group" aria-labelledby="pick-q">${opts}</div>
        <p class="pick__note">Номер телефона не нужен, ответим в мессенджере.</p>
      </div>
      <aside class="catalog card">
        <h3 class="display h3">${esc(c.catalog.title)}</h3>
        <p>${esc(c.catalog.text)}</p>
        <div class="catalog__act">
          ${chatBtn(c, { key: mainChannel, text: c.messages.catalog, label: `Получить в ${messengerLabel(c, mainChannel)}`, cls: 'btn--cobalt btn--block' })}
          <div class="catalog__other">${catalogOther}</div>
        </div>
      </aside>
    </div>

    <div class="contacts" id="contacts">
      <h2 class="display contacts__title">Приезжайте в офис или напишите</h2>
      <ul class="contacts__offices">${offices}</ul>
      <div class="contacts__col">
        <p class="contacts__label">Мессенджеры</p>
        <ul class="contacts__links">${messengers}</ul>
      </div>
      <div class="contacts__col">
        <p class="contacts__label">Отзывы</p>
        <ul class="contacts__reviews">${reviews}</ul>
      </div>
      ${officePhoto ? `<div class="contacts__photo">${officePhoto}</div>` : ''}
    </div>
  </div>
</section>`;
}

// Модалка квиза: три шага и финальный экран. Открывается сразу на втором шаге
// с уже выбранным бюджетом. Поведение в src/client/quiz.js.
export function renderQuiz(c) {
  const key = primaryKey(c);
  const budgets = budgetOptions(c)
    .map((o) => `<button class="opt opt--ink" type="button" aria-pressed="false" data-quiz-budget="${o.id}">${esc(o.label)}</button>`)
    .join('');
  const conditions = c.quiz.conditions
    .map((o) => `<button class="opt opt--ink" type="button" aria-pressed="false" data-quiz-condition="${o.id}">${esc(o.label)}</button>`)
    .join('');
  const channels = c.quiz.channels
    .filter((k) => c.messengers[k])
    .map((k) => `<button class="opt opt--ink" type="button" aria-pressed="false" data-quiz-channel="${k}">${icon(messengerIcon(k))}<span>${esc(messengerLabel(c, k))}</span></button>`)
    .join('');

  return `
<dialog class="quiz" data-quiz aria-label="Подбор машины: три вопроса">
  <div class="quiz__box">
    <header class="quiz__head">
      <p class="quiz__step" data-quiz-step>Шаг 2 из 3</p>
      <button class="icon-btn quiz__close" type="button" aria-label="Закрыть" data-quiz-close>${icon('close')}</button>
      <div class="quiz__bar" aria-hidden="true"><i></i><i></i><i></i></div>
    </header>
    <div class="quiz__pane" data-quiz-pane="1" hidden>
      <h2 class="quiz__title display" tabindex="-1">Какой бюджет под ключ?</h2>
      <div class="quiz__opts">${budgets}</div>
    </div>
    <div class="quiz__pane" data-quiz-pane="2">
      <h2 class="quiz__title display" tabindex="-1">Новая или с пробегом?</h2>
      <div class="quiz__opts">${conditions}</div>
    </div>
    <div class="quiz__pane" data-quiz-pane="3" hidden>
      <h2 class="quiz__title display" tabindex="-1">Куда прислать подборку?</h2>
      <div class="quiz__opts">${channels}</div>
    </div>
    <div class="quiz__pane" data-quiz-pane="done" hidden>
      <h2 class="quiz__title display" tabindex="-1">Готово.</h2>
      <p class="quiz__text">Откройте чат и отправьте сообщение, подборка придёт туда.</p>
      <p class="quiz__msg" data-quiz-msg></p>
      <a class="btn btn--cobalt btn--lg quiz__go" ${chatAttrs(c, key, '')} data-quiz-go><svg class="i" aria-hidden="true"><use href="#i-${messengerIcon(key)}" data-quiz-go-icon /></svg><span data-quiz-go-label>Открыть ${esc(messengerLabel(c, key))}</span></a>
      <p class="quiz__hint" data-quiz-hint hidden>Текст сообщения скопируется при нажатии: вставьте его в чат.</p>
    </div>
    <footer class="quiz__foot">
      <button class="link link--ink" type="button" data-quiz-back>${icon('chevron-l')}Назад</button>
    </footer>
  </div>
</dialog>`;
}
