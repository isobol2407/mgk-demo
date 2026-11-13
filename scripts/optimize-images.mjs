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
