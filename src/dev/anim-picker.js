// Переключатель вариантов анимации для спорных мест аудита «Анимации от Ковальски».
// Только в `npm run dev` (подключается из main.js), в сборку не попадает.
// У каждого спорного блока свой пикер; виден тот, чей блок сейчас на экране.
// Выбор пишется в атрибут на <html> (data-anim-*), его читают скрипты блоков,
// и в адрес страницы (?deals=2&quiz=1&faq=2), чтобы пережить перезагрузку.
// Внешний вид и клавиши — дословно по PICKER.md скилла prototype: 1–N и ←/→ для видимого пикера.
import './anim-picker.css';

const BLOCKS = [
  { param: 'deals', attr: 'animDeals', section: '#deals', items: [['fade', 'Проявление'], ['wave', 'Волна'], ['none', 'Без анимации']] },
  { param: 'quiz', attr: 'animQuiz', section: '#pick', items: [['slide', 'Сдвиг'], ['none', 'Без анимации']] },
  { param: 'faq', attr: 'animFaq', section: '#faq', items: [['fast', 'Быстро'], ['old', 'Как было']] },
];

const phone = window.matchMedia('(max-width: 767px)');
const pickers = [];

BLOCKS.forEach((b) => {
  const section = document.querySelector(b.section);
  if (!section) return;
  const nav = document.createElement('nav');
  nav.className = 'proto-picker';
  nav.setAttribute('aria-label', 'Prototype variants');
  nav.hidden = true;
  nav.innerHTML =
    '<span class="proto-picker-highlight" aria-hidden="true"></span>' +
    b.items.map(([, label]) => `<button class="proto-picker-item">${label}</button>`).join('');
  document.body.append(nav);
  const highlight = nav.querySelector('.proto-picker-highlight');
  const items = [...nav.querySelectorAll('.proto-picker-item')];
  const p = { b, nav, section, items, current: 0, ratio: 0 };

  p.move = () => {
    const el = items[p.current];
    highlight.style.width = el.offsetWidth + 'px';
    highlight.style.transform = `translateX(${el.offsetLeft}px)`;
  };
  p.set = (i) => {
    if (i < 0 || i >= items.length) return;
    p.current = i;
    items.forEach((el, j) => {
      el.toggleAttribute('data-active', j === i);
      if (j === i) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
    p.move();
    document.documentElement.dataset[b.attr] = b.items[i][0];
    const url = new URL(location);
    url.searchParams.set(b.param, i + 1);
    history.replaceState(null, '', url);
  };
  items.forEach((el, i) => el.addEventListener('click', () => p.set(i)));
  const requested = parseInt(new URLSearchParams(location.search).get(b.param), 10);
  p.set(requested >= 1 && requested <= items.length ? requested - 1 : 0);
  pickers.push(p);
});

// Виден пикер блока, который занимает больше всего экрана. На телефоне внизу кнопка
// «Написать в Telegram», поэтому пикер сверху (единственная разрешённая правка PICKER.md)
let active = null;
function update() {
  const best = pickers.filter((p) => p.ratio > 0.15).sort((a, c) => c.ratio - a.ratio)[0] ?? null;
  pickers.forEach((p) => {
    p.nav.hidden = p !== best;
    if (phone.matches) p.nav.setAttribute('data-position', 'top');
    else p.nav.removeAttribute('data-position');
  });
  if (best && best !== active) {
    best.move();
    requestAnimationFrame(() => requestAnimationFrame(() => best.nav.setAttribute('data-ready', '')));
  }
  active = best;
}
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      const p = pickers.find((x) => x.section === e.target);
      if (p) p.ratio = e.intersectionRect.height / window.innerHeight;
    });
    update();
  },
  { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1] },
);
pickers.forEach((p) => io.observe(p.section));
window.addEventListener('resize', () => {
  active?.move();
  update();
});

document.addEventListener('keydown', (e) => {
  if (!active) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const n = active.items.length;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= n) active.set(num - 1);
  else if (e.key === 'ArrowRight') active.set((active.current + 1) % n);
  else if (e.key === 'ArrowLeft') active.set((active.current - 1 + n) % n);
});
