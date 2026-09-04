import { defineConfig } from "vite";

// Dev-режим: HA грузит http://<этот-хост>:5188/src/main.ts как module-ресурс
// дашборда. Поэтому сервер слушает на всех интерфейсах и отдаёт CORS-заголовки.
// HMR отключён намеренно: переопределить уже зарегистрированный custom element
// в живой странице нельзя, обновление всё равно только через F5.
export default defineConfig({
  server: {
    host: true,
    // Не 5173: этот порт часто занимают другие проекты, а карточки грузятся
    // по абсолютному адресу — молчаливый увод на чужой сервер тут дорого стоит.
    port: 5188,
    strictPort: true,
    cors: true,
    hmr: false,
  },
  build: {
    target: "es2022",
    // Собранный файл лежит в dist/ корня репозитория и версионируется: HACS
    // ставит плагины прямо из репозитория и ищет файл именно там.
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "ha-plugins-cards.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
