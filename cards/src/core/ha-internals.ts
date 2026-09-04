/**
 * Доступ к внутренним компонентам HA-фронтенда.
 *
 * Карточки не повторяют вёрстку штатной плитки, а собираются из её же
 * компонентов: `ha-tile-container` (подложка, ripple, жесты, индикатор
 * зажатия, фокус), `ha-tile-icon`, `ha-tile-info`, `hui-card-features`.
 *
 * Наружу они не экспортируются, но регистрируются в общем реестре элементов
 * страницы, когда HA подгружает бандл штатной плитки. Поэтому мы просим HA
 * создать обычный tile — исключительно ради побочного эффекта импорта — и
 * дожидаемся регистрации.
 */

const REGISTRATION_TIMEOUT = 5000;

/** Всё, из чего собирается карточка. */
const REQUIRED_ELEMENTS = [
  "ha-tile-container",
  "ha-tile-icon",
  "ha-tile-info",
  "hui-card-features",
] as const;

let pending: Promise<boolean> | undefined;
let pendingEditor: Promise<boolean> | undefined;

interface CardHelpers {
  createCardElement?: (config: Record<string, unknown>) => HTMLElement;
}

function whenDefined(tag: string, timeout: number): Promise<boolean> {
  if (customElements.get(tag)) return Promise.resolve(true);
  return Promise.race([
    customElements.whenDefined(tag).then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeout)),
  ]);
}

async function loadTileBundle(): Promise<void> {
  const loader = (
    window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> }
  ).loadCardHelpers;
  if (!loader) return;
  try {
    const helpers = await loader();
    // Сам элемент не нужен, нужен побочный эффект импорта бандла плитки.
    helpers.createCardElement?.({ type: "tile", entity: "sun.sun" });
  } catch {
    // Конфиг мог не подойти — на импорт это не влияет.
  }
}

/** true — компоненты плитки доступны и карточку можно собрать. */
export function ensureTileInternals(): Promise<boolean> {
  if (pending) return pending;

  pending = (async () => {
    if (REQUIRED_ELEMENTS.every((tag) => customElements.get(tag))) return true;
    await loadTileBundle();
    const results = await Promise.all(
      REQUIRED_ELEMENTS.map((tag) => whenDefined(tag, REGISTRATION_TIMEOUT))
    );
    return results.every(Boolean);
  })();

  return pending;
}

/**
 * Редактор features живёт в бандле редактора плитки — отдельном от бандла
 * самой плитки. Просим HA собрать её редактор, чтобы получить его.
 */
export function ensureFeaturesEditor(): Promise<boolean> {
  if (pendingEditor) return pendingEditor;

  pendingEditor = (async () => {
    if (customElements.get("hui-card-features-editor")) return true;
    await ensureTileInternals();

    const tileCard = customElements.get("hui-tile-card") as
      | { getConfigElement?: () => Promise<HTMLElement> }
      | undefined;
    try {
      await tileCard?.getConfigElement?.();
    } catch {
      // Нам нужен только побочный эффект импорта.
    }

    return whenDefined("hui-card-features-editor", REGISTRATION_TIMEOUT);
  })();

  return pendingEditor;
}
