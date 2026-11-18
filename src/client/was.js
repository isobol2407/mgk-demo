// «Было / Стало» для демо-стенда анимаций (src/dev/anim-stand.js, только в dev).
// Стенд пишет ключи блоков в <html data-was="menu calc …">; блок с таким ключом ведёт себя
// как до раунда «Анимации от Ковальски». Без атрибута (на настоящем сайте) — всегда «Стало».
// Ключи: hero, menu, steps, calc, done, sheet.
export const was = (key) => (document.documentElement.dataset.was ?? '').split(' ').includes(key);
