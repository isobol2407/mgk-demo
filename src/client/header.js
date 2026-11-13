// Шапка: белая после первого экрана, мобильное меню, закреплённая кнопка на телефоне.
export function initHeader() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('[data-hero]');
  const dock = document.querySelector('[data-dock]');
  if (!header) return;

  const onScroll = () => {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const past = heroBottom <= header.offsetHeight;
    header.classList.toggle('is-solid', past);
    // Кнопка внизу экрана появляется после первого экрана
    dock?.classList.toggle('is-visible', past);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  const burger = header.querySelector('[data-burger]');
  const menu = header.querySelector('[data-menu]');
  if (!burger || !menu) return;
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    header.classList.toggle('menu-open', open);
    menu.hidden = !open;
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));
}
