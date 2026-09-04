/**
 * Пороги влажности почвы. Отдельным модулем без DOM, чтобы логику можно было
 * проверять тестами, не поднимая браузерное окружение.
 */

export const DEFAULT_DRY_BELOW = 30;
export const DEFAULT_WET_ABOVE = 70;

export type MoistureStatus = "dry" | "ok" | "wet" | "unknown";

/** Границы включаются в норму: ровно на пороге растение ещё не сухое. */
export function moistureStatus(
  value: number | undefined,
  dryBelow: number,
  wetAbove: number
): MoistureStatus {
  if (value === undefined) return "unknown";
  if (value < dryBelow) return "dry";
  if (value > wetAbove) return "wet";
  return "ok";
}

/** Цвета берём из семантических токенов темы, своих не заводим. */
export const MOISTURE_COLOR: Record<MoistureStatus, string> = {
  dry: "var(--warning-color)",
  ok: "var(--success-color)",
  wet: "var(--info-color)",
  unknown: "var(--state-inactive-color)",
};

export const MOISTURE_ICON: Record<MoistureStatus, string> = {
  dry: "mdi:water-off",
  ok: "mdi:sprout",
  wet: "mdi:water-alert",
  unknown: "mdi:sprout",
};
