// Шапка: белая сразу после начала прокрутки, мобильное меню, закреплённая кнопка на телефоне.
// Меню появляется из-под шапки: проявление и сдвиг 8 px за 200 мс, уходит быстрее — 150 мс
// (find-animation-opportunities). Esc закрывает мгновенно: клавиатура не анимируется.
import { was } from './was.js';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function initHeader() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('[data-hero]');
  const dock = document.querySelector('[data-dock]');
  if (!header) return;

  const onScroll = () => {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const past = heroBottom <= header.offsetHeight;
    // Шапка белеет сразу, как только страницу начали листать
    header.classList.toggle('is-solid', window.scrollY > 4);
    // Кнопка внизу экрана появляется после первого экрана
    dock?.classList.toggle('is-visible', past);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  const burger = header.querySelector('[data-burger]');
  const menu = header.querySelector('[data-menu]');
  if (!burger || !menu) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let anim = null;
  const setMenu = (open, instant = false) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    header.classList.toggle('menu-open', open);
    anim?.cancel();
    anim = null;
    if (instant || was('menu') || !menu.animate || (!open && menu.hidden)) {
      menu.hidden = !open;
      return;
    }
    const shut = { opacity: 0, transform: reduce.matches ? 'none' : 'translateY(-8px)' };
    const shown = { opacity: 1, transform: 'none' };
    if (open) {
      menu.hidden = false;
      anim = menu.animate([shut, shown], { duration: 200, easing: EASE });
    } else {
      anim = menu.animate([shown, shut], { duration: 150, easing: EASE, fill: 'forwards' });
      anim.onfinish = () => {
        menu.hidden = true;
        anim?.cancel();
        anim = null;
      };
    }
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false, true);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));
}
