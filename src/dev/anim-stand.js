// Демо-стенд анимаций раунда «Анимации от Ковальски»: по табу на блок, у каждого
// «Было / Стало», подсказка, на что смотреть, и кнопка «Показать». Только в `npm run dev`.
// «Было» пишет ключ блока в <html data-was> и в адрес (?was=hero+menu), его читают сами блоки
// (src/client/was.js). Открытый таб — в адресе (?stand=menu), свёрнутость — в localStorage.
import './anim-stand.css';
import { openNext } from '../client/actions.js';

const phone = () => window.matchMedia('(max-width: 767px)').matches;
const narrow = () => window.matchMedia('(max-width: 1023px)').matches;
const top = (el, shift = 0) => el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - shift, behavior: 'instant' });
const quizDone = () => openNext('quiz_done', { ctx: { summary: 'Бюджет 3–5 млн, для семьи, новая, в ближайший месяц', id: 'stand' } });

const TABS = [
  {
    key: 'hero',
    name: 'Первый экран',
    hint: '<b>Появление первого экрана</b> (choreograph). Было: карусель выезжает раньше снимков, снимки падают ровным шагом 140 мс, всё по 900 мс. Стало: снимки ложатся по порядку чтения с затухающим шагом — 100, 220, 310 мс, карусель подхватывает волну на 280 мс и едет короче. Смотри, читается ли это одной волной, а не очередью. «Показать» перезагрузит страницу.',
    show: () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      location.reload();
    },
  },
  {
    key: 'menu',
    name: 'Меню',
    only: phone,
    note: 'Меню есть только на телефоне: сузь окно до 767 px или открой с телефона.',
    hint: '<b>Мобильное меню.</b> Было: появляется рывком. Стало: выезжает из-под шапки за 200 мс, уходит быстрее — за 150 мс. Смотри и открытие, и закрытие по пункту меню. Esc закрывает мгновенно — так и задумано: клавиатура не анимируется.',
    show: () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const b = document.querySelector('[data-burger]');
      if (b?.getAttribute('aria-expanded') !== 'true') b?.click();
    },
  },
  {
    key: 'steps',
    name: 'Как привозим',
    only: narrow,
    note: 'Список шагов виден до 1024 px (шире — таймлайн): сузь окно или открой с телефона.',
    hint: '<b>«Как привозим» на телефоне.</b> Было: статичный список. Стало: линии между шагами наливаются синим за прокруткой, цифра загорается, когда заливка до неё дошла; крутишь назад — откатывается. Смотри, не отвлекает ли от «Платите / Получаете».',
    show: () => top(document.querySelector('.steps__list'), window.innerHeight * 0.6),
  },
  {
    key: 'calc',
    name: 'Разбор цены',
    hint: '<b>Таблица в «Разборе цены».</b> Нажми строку со стрелкой. Было: пояснение появляется рывком. Стало: раскрывается за 300 мс, сворачивается за 200 мс — так же, как «Вопросы». Пощёлкай быстро: должно продолжать с текущей высоты, без скачков. «Показать» откроет расчёт и первую строку.',
    show: () => {
      top(document.getElementById('price'), 64);
      const open = document.querySelector('[data-flip-open]');
      const row = document.querySelector('[data-calc-row]');
      if (open?.offsetParent && open.getAttribute('aria-expanded') !== 'true') open.click();
      setTimeout(() => {
        row?.scrollIntoView({ block: 'center', behavior: 'instant' });
        row?.click();
      }, 950);
    },
  },
  {
    key: 'done',
    name: 'Готово',
    hint: '<b>Окно «Готово» после квиза.</b> Было: просто открывается. Стало: у «Готово: подборка под бюджет» прорисовывается круг, когда окно почти встало, за ним галочка. Это единственный «праздничный» момент на сайте — смотри, не слишком ли.',
    show: quizDone,
  },
  {
    key: 'sheet',
    name: 'Шторка',
    only: phone,
    note: 'Шторка — только на телефоне. Мышью ощущение другое: проверяй пальцем, http://192.168.1.24:4323',
    hint: '<b>Шторка «Что дальше» на телефоне</b> (gestures). Было: закрыть только кнопкой. Стало: потяни за полоску или заголовок вниз — окно идёт за пальцем, фон светлеет; бросок вниз или больше 40 % высоты закрывает, меньше — возвращает на место. Вверх тянется с сопротивлением.',
    show: quizDone,
  },
];

const html = document.documentElement;
const params = new URLSearchParams(location.search);
const wasSet = () => new Set((html.dataset.was ?? '').split(' ').filter(Boolean));
let current = Math.max(0, TABS.findIndex((t) => t.key === params.get('stand')));

const root = document.createElement('section');
root.className = 'astand';
root.setAttribute('aria-label', 'Стенд анимаций');
root.innerHTML = `
  <div class="astand__top">
    <span class="astand__name">Анимации</span>
    <div class="astand__tabs" role="tablist">${TABS.map((t, i) => `<button class="astand__tab" role="tab" data-i="${i}">${t.name}</button>`).join('')}</div>
    <button class="astand__fold" aria-label="Свернуть стенд" data-fold>–</button>
  </div>
  <div class="astand__body">
    <p class="astand__hint" data-hint></p>
    <p class="astand__note" data-note hidden></p>
    <div class="astand__row">
      <div class="astand__seg"><button data-mode="was">Было</button><button data-mode="now">Стало</button></div>
      <button class="astand__show" data-show>Показать</button>
    </div>
  </div>`;
document.body.append(root);

try {
  root.classList.toggle('is-folded', localStorage.getItem('astand-folded') === '1');
} catch {
  // хранилище недоступно — стенд просто развёрнут
}

function writeUrl() {
  const url = new URL(location);
  url.searchParams.set('stand', TABS[current].key);
  const w = [...wasSet()].join(' ');
  if (w) url.searchParams.set('was', w);
  else url.searchParams.delete('was');
  history.replaceState(null, '', url);
}

function render() {
  const t = TABS[current];
  const w = wasSet();
  root.querySelectorAll('.astand__tab').forEach((b, i) => {
    b.setAttribute('aria-selected', String(i === current));
    b.classList.toggle('is-was', w.has(TABS[i].key));
  });
  root.querySelector('[data-hint]').innerHTML = t.hint;
  const note = root.querySelector('[data-note]');
  note.hidden = !t.only || t.only();
  note.textContent = t.note ?? '';
  root.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.mode === 'was') === w.has(t.key))));
  root.querySelector('[data-fold]').textContent = root.classList.contains('is-folded') ? '+' : '–';
  writeUrl();
}

root.addEventListener('click', (e) => {
  const tab = e.target.closest('.astand__tab');
  if (tab) {
    current = Number(tab.dataset.i);
    root.classList.remove('is-folded');
    return render();
  }
  const mode = e.target.closest('[data-mode]');
  if (mode) {
    const w = wasSet();
    if (mode.dataset.mode === 'was') w.add(TABS[current].key);
    else w.delete(TABS[current].key);
    html.dataset.was = [...w].join(' ');
    if (!html.dataset.was) delete html.dataset.was;
    document.dispatchEvent(new CustomEvent('anim-stand'));
    return render();
  }
  if (e.target.closest('[data-show]')) {
    writeUrl();
    return TABS[current].show();
  }
  if (e.target.closest('[data-fold]')) {
    root.classList.toggle('is-folded');
    try {
      localStorage.setItem('astand-folded', root.classList.contains('is-folded') ? '1' : '0');
    } catch {
      // без хранилища свёрнутость не запомнится
    }
    render();
  }
});
window.addEventListener('resize', render);
render();
