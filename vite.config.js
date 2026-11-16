import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

// Компания выбирается переменной COMPANY: один файл в src/companies/ = одна компания.
//   npm run dev                      → МГК Авто
//   COMPANY=foxavto npm run build    → src/companies/foxavto.js
const COMPANY = process.env.COMPANY || 'mgk-avto';
const companyFile = resolve(`src/companies/${COMPANY}.js`);
if (!existsSync(companyFile)) {
  throw new Error(`Нет файла компании: src/companies/${COMPANY}.js`);
}

// Страница собирается в готовый HTML на этапе сборки: заголовок и тексты видны сразу, без ожидания JS.
// Разметку блоков возвращают src/sections/*.js, данные берутся из файла компании.
const renderPage = () => {
  let server;
  const load = async (file) =>
    server ? server.ssrLoadModule(file) : import(pathToFileURL(file).href);
  return {
    name: 'render-page',
    configureServer(s) {
      server = s;
    },
    async transformIndexHtml(html) {
      const company = (await load(companyFile)).default;
      const { renderPage: render } = await load(resolve('src/page.js'));
      const page = render(company);
      return html
        .replace('<!--page:title-->', page.title)
        .replace('<!--page:description-->', page.description)
        .replace('<!--page:body-->', page.body);
    },
    handleHotUpdate({ file, server: s }) {
      if (/\/src\/(sections|companies|lib)\/|\/src\/page\.js$/.test(file)) {
        s.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
};

// 4321 и 4322 заняты другими проектами
export default defineConfig({
  // Относительные пути: сайт работает в любой папке (GitHub Pages, FTP, свой домен).
  base: './',
  plugins: [renderPage()],
  resolve: { alias: { '@company': companyFile } },
  server: { port: 4323, strictPort: true },
  preview: { port: 4323, strictPort: true },
});
