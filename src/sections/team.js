// 7. Команда. Отвечает на сомнение «кому я отдаю деньги». Не биографии, а лица:
// портрет, имя и роль. Ниже строка про остальных и кнопка к адресам офисов.
import { esc } from '../lib/marks.js';
import { icon, photo } from '../lib/ui.js';

export function renderTeam(c) {
  const t = c.team;
  if (!t?.people?.length) return '';
  const people = t.people
    .map(
      (p, i) => `
        <li class="person">
          <span class="snap person__photo" style="--tilt:${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg">${photo(p.photo, { alt: p.name, widths: [280, 448], ratio: 4 / 5, sizes: '(min-width: 1100px) 200px, 44vw' })}</span>
          <span class="person__name">${esc(p.name)}</span>
          <span class="person__role">${esc(p.role)}</span>
        </li>`,
    )
    .join('');
  const offices = c.contacts.offices.map((o) => `${esc(o.city)}, ${esc(o.address)}`).join(' · ');
  return `
<section class="team section section--cobalt" id="team">
  <div class="container">
    <header class="sec-head">
      <h2 class="display h2">${esc(t.title)}${t.titleAccent ? ` <span class="h-accent">${esc(t.titleAccent)}</span>` : ''}</h2>
      <p class="sub">${esc(t.sub)}</p>
    </header>
    <ul class="team__grid">${people}</ul>
    <div class="team__foot">
      <p class="team__more">${esc(t.more)}<br />${icon('pin')}${offices}</p>
      <a class="btn btn--white" href="#contacts">${icon('pin')}<span>Приехать в офис</span></a>
    </div>
  </div>
</section>`;
}
