// 6. Проверка машины. Отвечает на сомнение «а если привезут битую или со скрученным пробегом».
// Главное — реальная история отказа: Kia Mohave, которую забраковали на осмотре.
// Рядом превью длинной статьи «Как мы проводим осмотр»: видно начало, текст уходит под край
// карточки. Вся карточка статьи открывает модалку «статья в блоге» (демо: на сайте — статья для SEO).
import { esc } from '../lib/marks.js';
import { icon, photo, extLink } from '../lib/ui.js';
import { actionAttrs } from '../lib/actions.js';

export function renderCheck(c) {
  const ins = c.inspection;
  if (!ins) return '';
  const st = ins.story;
  const art = ins.article;

  const story = st
    ? `
    <article class="story card">
      <div class="story__media">
        ${photo(st.photo, { alt: 'Kia Mohave 2021 на осмотре в Корее', sizes: '(min-width: 1100px) 680px, 100vw' })}
        <span class="story__tag">${icon('close')}<span>${esc(st.tag)}</span></span>
      </div>
      <div class="story__body">
        <p class="story__date">Осмотр в Корее · ${esc(st.date)}</p>
        <h3 class="story__title display">${esc(st.title)}</h3>
        <p class="story__text">${esc(st.text)}</p>
        ${extLink(esc(st.cta), st.postUrl, { cls: 'link story__link' })}
      </div>
    </article>`
    : '';

  const steps = ins.items
    .map(
      (x, i) => `
          <span class="read__step">
            <span class="read__n display">${i + 1}</span>
            <span class="read__h">${esc(x.title)}</span>
            <span class="read__p">${esc(x.text)}</span>
          </span>`,
    )
    .join('');
  const { tag, attrs } = actionAttrs('blog', { ctx: { title: art.title } });
  const article = art
    ? `
    <${tag} class="read card" ${attrs}>
      <span class="read__label">Статья</span>
      <span class="read__title display">${esc(art.title)}</span>
      <span class="read__lead">${esc(art.lead)}</span>
      <span class="read__steps">${steps}</span>
      ${(art.more ?? []).map((x) => `<span class="read__h2 display">${esc(x.h)}</span><span class="read__lead">${esc(x.p)}</span>`).join('')}
      <span class="read__more"><span class="btn btn--cobalt btn--sm read__btn">${esc(art.cta)}${icon('arrow-ur')}</span></span>
    </${tag}>`
    : '';

  return `
<section class="check section section--paper" id="check">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">${esc(ins.title)}</h2>
      <p class="sub">${esc(ins.sub)}</p>
    </header>
    <div class="check__grid">
      ${story}
      ${article}
    </div>
  </div>
</section>`;
}
