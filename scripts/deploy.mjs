// Выкладка собранного сайта (dist/) на хостинг по FTP.
// Запуск: `npm run deploy` (сначала собирает сайт, потом заливает).
// Доступы берутся из .env.deploy (не попадает в git), образец в .env.deploy.example.
import { Client } from 'basic-ftp';
import { existsSync } from 'node:fs';

if (!existsSync('.env.deploy')) {
  console.error('Нет файла .env.deploy. Скопируй .env.deploy.example в .env.deploy и впиши пароль.');
  process.exit(1);
}
process.loadEnvFile('.env.deploy');

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIR, SITE_URL } = process.env;
for (const [key, value] of Object.entries({ FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIR })) {
  if (!value) {
    console.error(`В .env.deploy не заполнено ${key}.`);
    process.exit(1);
  }
}
// Защита от заливки в корень аккаунта: папка сайта должна быть указана явно.
if (!FTP_DIR.split('/').filter((part) => part && part !== '.').length) {
  console.error(`FTP_DIR="${FTP_DIR}" — это корень аккаунта. Укажи папку сайта, например public_html или mgk.sobol-studio.ru/public_html`);
  process.exit(1);
}
if (!existsSync('dist/index.html')) {
  console.error('Нет dist/index.html: сборка не прошла.');
  process.exit(1);
}

const connect = async (secure) => {
  const client = new Client(30_000);
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASSWORD, secure });
  return client;
};

let client;
try {
  client = await connect(true);
  console.log('Подключение по FTPS (шифрованное).');
} catch {
  client = await connect(false);
  console.warn('FTPS недоступен, подключение по обычному FTP.');
}

try {
  const home = await client.pwd();
  await client.ensureDir(FTP_DIR);
  // Старые файлы сборки с хешами в именах иначе копятся: assets/ заменяем целиком.
  try {
    await client.removeDir('assets');
  } catch {
    // папки ещё нет: первая выкладка
  }
  await client.cd(home);
  await client.uploadFromDir('dist', FTP_DIR);
  console.log(`Готово: ${SITE_URL || FTP_DIR}`);
} finally {
  client.close();
}
