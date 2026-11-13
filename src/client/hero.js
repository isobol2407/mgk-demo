// Первый экран: видео в заголовке подгружается после того, как страница показала текст.
// Без звука, зациклено. При prefers-reduced-motion не запускается: остаётся постер.
export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  if (!video) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start = () => {
    video.preload = 'auto';
    video.muted = true;
    video.play().catch(() => {}); // если файл не загрузился или автозапуск запрещён, остаётся постер
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
