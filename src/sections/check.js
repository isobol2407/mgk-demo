// 6. Проверка машины. Отвечает на сомнение «а если привезут битую или со скрученным пробегом».
// Слева подход к проверке от и до (по постам канала МГК), справа реальная история отказа:
// Kia Mohave, которую забраковали на осмотре. Карточка истории целиком открывает модалку
// «статья в блоге» (демо): на готовом сайте здесь статья для SEO.
import { esc } from '../lib/marks.js';
import { icon, photo, extLink } from '../lib/ui.js';
import { actionAttrs } from '../lib/actions.js';
import { reportHref } from '../lib/links.js';

export function renderCheck(c) {
  const ins = c.inspection;
  if (!ins) return '';
  const report = c.steps.report;
  const items = ins.items
    .map(
      (x, i) => `
        <li class="check__item">
          <span class="check__n display" aria-hidden="true">${i + 1}</span>
          <div><h3 class="check__name">${esc(x.title)}</h3><p>${esc(x.text)}</p></div>
        </li>`,
    )
    .join('');
  const st = ins.story;
  const { tag, attrs } = actionAttrs('blog', { ctx: { title: st.title, postUrl: st.postUrl } });
  const story = st
    ? `
    <${tag} class="story card" ${attrs}>
      <span class="story__media">
        ${photo(st.photo, { alt: 'Kia Mohave 2021 на осмотре в Корее', sizes: '(min-width: 1100px) 520px, 100vw' })}
        <span class="story__tag">${icon('close')}<span>${esc(st.tag)}</span></span>
      </span>
      <span class="story__body">
        <span class="story__date">Осмотр в Корее · ${esc(st.date)}</span>
        <span class="story__title display">${esc(st.title)}</span>
        <span class="story__text">${esc(st.text)}</span>
        <span class="link story__cta">${esc(st.cta)}${icon('arrow-ur')}</span>
      </span>
    </${tag}>`
    : '';
  return `
<section class="check section section--paper" id="check">
  <div class="container check__grid">
    <div class="check__body">
      <h2 class="display h2">${esc(ins.title)}</h2>
      <p class="sub">${esc(ins.sub)}</p>
      <ol class="check__list">${items}</ol>
      ${extLink(esc(report.label ?? 'Пример отчёта в Telegram'), reportHref(c), { cls: 'link check__link' })}
    </div>
    ${story}
  </div>
</section>`;
}
