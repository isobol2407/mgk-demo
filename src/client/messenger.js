// Кнопки в MAX и ВКонтакте: готовый текст в ссылку подставить нельзя, поэтому по клику
// копируем его в буфер и показываем короткое сообщение. Чат открывается обычной ссылкой.
let toastTimer = 0;

export function toast(text) {
  const el = document.querySelector('[data-toast]');
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 3200);
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
