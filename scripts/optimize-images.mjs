// Готовит фото для страницы: исходники из media-src/ → WebP фиксированных размеров в public/media/.
// Запуск: npm run images. Исходники в git не попадают, в git лежит только результат и credits.json.
// Новое фото: положить файл в media-src/ и добавить строку в JOBS.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = resolve('media-src');
const OUT = resolve('public/media');
mkdirSync(OUT, { recursive: true });

// ratio: ширина / высота кадра на странице. widths: 1x и 2x.
const CAR = { ratio: 3 / 2, widths: [480, 960] };
const SHOT = { ratio: 4 / 3, widths: [240, 480] };
// Портреты команды с сайта МГК (mgk-auto.ru), исходник 560×560
const TEAM = { ratio: 4 / 5, widths: [280, 448], position: 'top' };

const JOBS = [
  { file: 'monjaro.jpg', name: 'monjaro', ...CAR },
  { file: 'cx5.jpg', name: 'cx5', ...CAR },
  { file: 'carnival.jpg', name: 'carnival', ...CAR },
  { file: 'santafe.jpg', name: 'santafe', ...CAR },
  { file: 'l7.jpg', name: 'l7', ...CAR },
  { file: 'x5.jpg', name: 'x5', ...CAR },
  { file: 'shot-monjaro.jpg', name: 'shot-1', ...SHOT },
  { file: 'shot-l7.jpg', name: 'shot-2', ...SHOT },
  { file: 'shot-cx5.jpg', name: 'shot-3', ...SHOT },
  { file: 'team-mirzahamdamov.png', name: 'team-mirzahamdamov', ...TEAM },
  { file: 'team-kosarev.png', name: 'team-kosarev', ...TEAM },
  { file: 'team-fedorov.png', name: 'team-fedorov', ...TEAM },
  { file: 'team-kazantsev.png', name: 'team-kazantsev', ...TEAM },
  { file: 'team-menshchikov.png', name: 'team-menshchikov', ...TEAM },
  { file: 'team-lambin.png', name: 'team-lambin', ...TEAM },
  // Модели до 160 л.с.: фото из карточек на сайте МГК
  { file: 'm160-cx5.jpg', name: 'm160-cx5', ...CAR },
  { file: 'm160-qashqai.jpg', name: 'm160-qashqai', ...CAR },
  { file: 'm160-seltos.png', name: 'm160-seltos', ...CAR },
  { file: 'm160-cx30.webp', name: 'm160-cx30', ...CAR },
  // Реальные фото из Telegram-канала МГК (экспорт 16.11.2026): сделки, модели до 160 л.с.,
  // осмотр BMW X3, выдачи у офиса. Ссылки на посты — в src/companies/mgk-avto.js
  { file: 'tg-q05.jpg', name: 'tg-q05', ...CAR },
  { file: 'tg-gac-s7.jpg', name: 'tg-gac-s7', ...CAR },
  { file: 'tg-x3.jpg', name: 'tg-x3', ...CAR },
  { file: 'tg-carnival.jpg', name: 'tg-carnival', ...CAR },
  { file: 'tg-a6.jpg', name: 'tg-a6', ...CAR },
  { file: 'tg-korando.jpg', name: 'tg-korando', ...CAR },
  { file: 'tg-troc.jpg', name: 'tg-troc', ...CAR },
  { file: 'tg-kx3.jpg', name: 'tg-kx3', ...CAR },
  { file: 'tg-vezel.jpg', name: 'tg-vezel', ...CAR },
  { file: 'tg-k3.jpg', name: 'tg-k3', ...CAR },
  { file: 'tg-x3-salon.jpg', name: 'tg-x3-salon', ...CAR },
  { file: 'tg-x3-screen.jpg', name: 'tg-x3-screen', ...CAR },
  { file: 'tg-x3-rear.jpg', name: 'tg-x3-rear', ...CAR },
  { file: 'tg-shot-1.jpg', name: 'tg-shot-1', ...SHOT },
  { file: 'tg-shot-3.jpg', name: 'tg-shot-3', ...SHOT },
  // Kia Mohave, которую забраковали на осмотре (пост t.me/mgk_auto/282)
  { file: 'tg-mohave.jpg', name: 'tg-mohave', ...CAR },
  { file: 'tg-mohave-front.jpg', name: 'tg-mohave-front', ...CAR },
  // Выдача у офиса МГК для блока «Вопросы» (пост t.me/mgk_auto/5988)
  { file: 'tg-faq.jpg', name: 'tg-faq', ...CAR },
];

for (const job of JOBS) {
  const src = resolve(SRC, job.file);
  if (!existsSync(src)) {
    console.warn(`нет исходника: ${job.file}`);
    continue;
  }
  for (const w of job.widths) {
    const h = Math.round(w / job.ratio);
    const out = resolve(OUT, `${job.name}-${w}.webp`);
    const info = await sharp(src)
      .resize(w, h, { fit: 'cover', position: job.position ?? 'centre' })
      .webp({ quality: 74 })
      .toFile(out);
    console.log(`${job.name}-${w}.webp  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} КБ`);
  }
}
