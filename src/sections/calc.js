// «Нашли машину? Посчитаем её под ключ». Сразу после «Разбора цены»: человек только что
// увидел, из чего складывается цена, и может прислать свою машину. Поле для ссылки,
// кнопка в мессенджер, рядом MAX и ВКонтакте. На демо кнопки открывают модалку calc_link,
// ссылка в поле не обязательна.
import { icon, actionBtn } from '../lib/ui.js';
import { messengerLabel } from '../lib/messenger.js';
import { REPLY_TIME } from '../lib/actions.js';

export function renderCalc(c) {
  const others = ['max', 'vk']
    .filter((k) => c.messengers[k])
    .map((k) => actionBtn('calc_link', { key: k, label: messengerLabel(c, k), cls: 'link calc-link__alt', iconKey: false }))
    .join('<span aria-hidden="true">·</span>');
  return `
<section class="calc-link section" id="calc">
  <div class="container calc-link__grid">
    <div class="calc-link__text">
      <h2 class="display h2">Пришлите ссылку на машину, посчитаем под ключ</h2>
      <p class="sub">Подойдёт объявление с Encar, Che168, Авито или Дрома.</p>
      <ul class="calc-link__list">
        <li>${icon('check', 'calc-link__ico')}<span>Машина в Корее или Китае: посчитаем цену под ключ в Ижевске или Казани и проверим историю.</span></li>
        <li>${icon('check', 'calc-link__ico')}<span>Машина в России: найдём такую же за рубежом и покажем разницу.</span></li>
      </ul>
    </div>
    <form class="calc-link__form card" data-action-form onsubmit="return false" aria-label="Расчёт по ссылке">
      <label class="field">
        <span class="vh">Ссылка на объявление</span>
        <input name="url" type="url" inputmode="url" placeholder="Ссылка на объявление" autocomplete="off" />
      </label>
      ${actionBtn('calc_link', { label: 'Посчитать в Telegram', cls: 'btn btn--cobalt btn--block' })}
      <p class="calc-link__alts">или в ${others}</p>
      <p class="calc-link__note">Ответим в течение ${REPLY_TIME}. Бесплатно и без обязательств.</p>
    </form>
  </div>
</section>`;
}
