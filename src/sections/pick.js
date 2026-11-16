// 5. Подбор и контакты. Первый вопрос квиза стоит прямо в блоке, остальные в модалке.
// Ниже контакты. Каталог одним сообщением — в блоке «Машины до 160 л.с.».
import { esc, isAsk, askBadge, isHidden } from '../lib/marks.js';
import { icon, chatBtn, telHref } from '../lib/ui.js';
import { chatAttrs, primaryKey, messengerLabel, messengerIcon } from '../lib/messenger.js';

const budgetOptions = (c) => [...c.budgets.map((b) => ({ id: b.id, label: b.label })), { id: 'unknown', label: c.quiz.unknownLabel }];

export function renderPick(c) {
  const key = primaryKey(c);
  const opts = budgetOptions(c)
    .map((o) => `<button class="opt" type="button" data-quiz-open="${o.id}">${esc(o.label)}</button>`)
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
  // Отзывы в том же виде, что мессенджеры: иконка и подпись, одна ссылка = один стиль
  const reviewLink = (label, url, ic) =>
    isAsk(url) ? `<span class="contact-link">${icon(ic)}<span>${label}</span></span>` : `<a class="contact-link" href="${esc(url)}" target="_blank" rel="noopener">${icon(ic)}<span>${label}</span></a>`;
  const reviews = [y ? reviewLink('Яндекс.Карты', y.url, 'star') : '', a ? reviewLink('Авито', a.url, 'avito') : '']
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
        <p class="pick__q display h3" id="pick-q">Выберите бюджет</p>
        <div class="pick__opts" role="group" aria-labelledby="pick-q">${opts}</div>
      </div>
    </div>

    <div class="contacts" id="contacts">
      <h2 class="display contacts__title">Пишите, звоните или приезжайте в офис</h2>
      <ul class="contacts__offices">${offices}</ul>
      <div class="contacts__col">
        <h3 class="contacts__label display">Мессенджеры</h3>
        <ul class="contacts__links">${messengers}</ul>
      </div>
      <div class="contacts__col">
        <h3 class="contacts__label display">Отзывы</h3>
        <ul class="contacts__reviews">${reviews}</ul>
      </div>
      ${officePhoto ? `<div class="contacts__photo">${officePhoto}</div>` : ''}
    </div>
  </div>
</section>`;
}

// Гифка в плашке демо. Не скачиваем к себе: показываем с серверов Giphy (WebP легче GIF в 3 раза).
const DEMO_GIF = 'https://media.giphy.com/media/bQtUQp1wRZIUujzJ7E';
// Кнопка в плашке ведёт в личный Telegram Ильи, а не в чат компании
const DEMO_AUTHOR_TG = 'https://t.me/isobol';

// Служебная плашка о демо-версии: под контактами, серая с «телевизионным» шумом,
// чтобы читалась как сообщение поверх сайта, а не его часть.
export function renderDemoNote(c) {
  if (c.display?.demoNote === false) return '';
  return `
<aside class="demo-note" aria-label="О демо-версии" data-demo-note>
  <div class="container demo-note__in" data-demo-in>
    <p class="demo-note__title">Это демо: показаны 5 самых важных блоков</p>
    <div class="demo-note__body">
    <p class="demo-note__text">Всего в готовом сайте будет 10 блоков. Здесь те, от которых зависит, напишет человек или нет.</p>
    <p class="demo-note__text">Машины, цены и сроки на странице — демонстрационные. В тексты и порядок блоков заложены приёмы, которые поднимают конверсию. Когда возьмёмся за ваш сайт, подстроим каждый момент под ваш бизнес.</p>
    <p class="demo-note__text">Заявки с сайта подключим туда, где вам удобно: Telegram, MAX, Битрикс24 или другая CRM.</p>
    <a class="demo-note__cta" href="${DEMO_AUTHOR_TG}" target="_blank" rel="noopener"><i class="demo-note__rec" aria-hidden="true"></i>${icon('tg')}<span>Написать мне в Telegram</span></a>
    </div>
    <figure class="demo-note__gif">
      <picture>
        <source srcset="${DEMO_GIF}/giphy.webp" type="image/webp" />
        <img src="${DEMO_GIF}/giphy.gif" width="480" height="400" alt="Майкл Скотт из сериала «Офис»" loading="lazy" decoding="async" />
      </picture>
      <figcaption>via GIPHY</figcaption>
    </figure>
  </div>
</aside>`;
}

// Модалка квиза: 6 шагов. Открывается с первого шага (кнопка «Подобрать машину» на первом
// экране) или сразу со второго, если бюджет выбран в блоке. После выбора мессенджера
// квиз закрывается и открывается модалка «Что произойдёт дальше» со сводкой ответов.
// Поведение в src/client/quiz.js.
export function renderQuiz(c) {
  const q = c.quiz;
  const opts = (list, attr) =>
    list.map((o) => `<button class="opt opt--ink" type="button" aria-pressed="false" ${attr}="${o.id}">${esc(o.label)}</button>`).join('');
  const budgets = opts(budgetOptions(c), 'data-quiz-budget');
  const channels = q.channels
    .filter((k) => c.messengers[k])
    .map((k) => `<button class="opt opt--ink" type="button" aria-pressed="false" data-quiz-channel="${k}">${icon(messengerIcon(k))}<span>${esc(messengerLabel(c, k))}</span></button>`)
    .join('');
  const pane = (n, title, body, hidden = true) => `
    <div class="quiz__pane" data-quiz-pane="${n}"${hidden ? ' hidden' : ''}>
      <h2 class="quiz__title display" tabindex="-1">${title}</h2>
      ${body}
    </div>`;

  return `
<dialog class="quiz" data-quiz aria-label="Подбор машины: шесть вопросов">
  <div class="quiz__box">
    <header class="quiz__head">
      <p class="quiz__step" data-quiz-step>Шаг 1 из 6</p>
      <button class="icon-btn quiz__close" type="button" aria-label="Закрыть" data-quiz-close>${icon('close')}</button>
      <div class="quiz__bar" aria-hidden="true">${'<i></i>'.repeat(6)}</div>
    </header>
    ${pane(1, 'Какой бюджет под ключ?', `<div class="quiz__opts">${budgets}</div>`, false)}
    ${pane(2, 'Для чего машина?', `<div class="quiz__opts">${opts(q.purposes, 'data-quiz-purpose')}</div>`)}
    ${pane(3, 'Новая или с пробегом?', `<div class="quiz__opts">${opts(q.conditions, 'data-quiz-condition')}</div>`)}
    ${pane(
      4,
      'Есть модель на примете?',
      `<form class="quiz__model" data-quiz-model-form>
        <label class="field"><span class="vh">Модель</span><input name="model" type="text" placeholder="Например, Mazda CX-5" autocomplete="off" data-quiz-model /></label>
        <div class="quiz__model-act">
          <button class="btn btn--cobalt" type="submit">Дальше</button>
          <button class="link link--ink quiz__skip" type="button" data-quiz-skip>Пропустить</button>
        </div>
      </form>`,
    )}
    ${pane(5, 'Когда хотите получить машину?', `<div class="quiz__opts">${opts(q.timings, 'data-quiz-timing')}</div>`)}
    ${pane(6, 'Куда прислать подборку?', `<div class="quiz__opts">${channels}</div><p class="quiz__hint">Номер телефона не нужен.</p>`)}
    <footer class="quiz__foot">
      <button class="link link--ink" type="button" data-quiz-back>${icon('chevron-l')}Назад</button>
    </footer>
  </div>
</dialog>`;
}
