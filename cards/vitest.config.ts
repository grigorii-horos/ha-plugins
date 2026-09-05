import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Логику проверяем в node, разметку — в happy-dom: полноценные карточки
    // там не собрать (они опираются на компоненты HA), но собственные шаблоны
    // проверяются целиком.
    environment: "node",
    environmentMatchGlobs: [["test/render/**", "happy-dom"]],
  },
});
