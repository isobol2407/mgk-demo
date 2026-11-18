// Кнопки в MAX и ВКонтакте: готовый текст в ссылку подставить нельзя, поэтому по клику
// копируем его в буфер и показываем короткое сообщение. Чат открывается обычной ссылкой.
let toastTimer = 0;
let hideTimer = 0;

// Сообщение появляется снизу за 200 мс и уходит быстрее, за 150 мс (стили .toast в base.css).
// Повторный клик во время показа просто продлевает его: переход прерывается с текущего места
export function toast(text) {
  const el = document.querySelector('[data-toast]');
  if (!el) return;
  el.textContent = text;
  clearTimeout(toastTimer);
  clearTimeout(hideTimer);
  if (el.hidden) {
    el.hidden = false;
    void el.offsetWidth; // стартовое состояние до .is-in, иначе переход не сыграет
  }
  el.classList.add('is-in');
  toastTimer = setTimeout(() => {
    el.classList.remove('is-in');
    hideTimer = setTimeout(() => (el.hidden = true), 150);
  }, 3200);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function initMessengerLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-copy]');
    if (!link) return;
    copyText(link.dataset.copy).then((ok) => ok && toast('Текст сообщения скопирован: вставьте его в чат'));
  });
}
