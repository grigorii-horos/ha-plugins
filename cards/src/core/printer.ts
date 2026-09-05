/**
 * Разбор сущностей принтера. Отдельным модулем без DOM, чтобы логику можно
 * было проверять тестами, не поднимая браузерное окружение.
 */

import { stripDeviceName } from "./labels";
import { normalizeItem, type EntityItem } from "./entity-item";

/**
 * Цвет картриджа по имени сущности. У HA нет палитрового «magenta», ближайший
 * по смыслу — purple; так же он выглядит и в интерфейсе принтера.
 */
const CARTRIDGE_COLORS: [RegExp, string][] = [
  [/black|pgbk|_bk(_|$)/i, "black"],
  [/cyan/i, "cyan"],
  [/magenta/i, "purple"],
  [/yellow/i, "yellow"],
  // MC — сервисный бак, а не чернила. Своим оттенком, иначе он
  // неотличим от чёрного: тот красится цветом текста и тоже выходит серым.
  [/_mc(_|$)|maintenance/i, "blue-grey"],
];

export function cartridgeColor(entityId: string): string | undefined {
  const match = CARTRIDGE_COLORS.find(([pattern]) => pattern.test(entityId));
  return match?.[1];
}

/**
 * Готовый CSS-цвет капли.
 *
 * Чёрные чернила нельзя красить в чистый чёрный: на тёмной теме капля сливается
 * с фоном карточки. Берём цвет текста — он чёрный на светлой теме и белый на
 * тёмной, то есть ведёт себя ровно как «цвет чернил на бумаге».
 */
export function cartridgeCssColor(color: string): string {
  if (color === "black") return "var(--primary-text-color)";
  if (/^(#|rgb|hsl|var\()/.test(color)) return color;
  return `var(--${color}-color, var(--state-icon-color))`;
}

/** Имя картриджа без имени принтера — оно уже сказано заголовком карточки. */
export const cartridgeLabel = stripDeviceName;

/** Прежние имена: картридж — частный случай элемента списка. */
export type CartridgeConfig = EntityItem;
export const normalizeCartridge = normalizeItem;

/**
 * Разбор маркера принтера.
 *
 * IPP отдаёт вместе с уровнем и его смысл. Чернильный картридж расходуется:
 * тревога, когда уровень падает ниже marker_low_level. Поглотитель отработки
 * (marker_type "waste-ink") наоборот наполняется: у него low_level нулевой, а
 * тревога — когда уровень дорос до marker_high_level.
 *
 * Считать «мало» одинаково для обоих нельзя: у поглотителя низкий уровень —
 * это хорошо.
 */
export type MarkerAttributes = Record<string, unknown>;

export interface MarkerReading {
  /** Наполненность ёмкости в процентах от её вместимости, 0..100. */
  fill: number;
  /** Требует внимания: чернила кончаются или поглотитель полон. */
  alarm: boolean;
  /** Наполняется (поглотитель) или расходуется (чернила). */
  fills: boolean;
}

const numberOr = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export function readMarker(
  state: string,
  attributes: MarkerAttributes,
  /** Свой порог для расходуемых чернил, если задан в конфиге. */
  lowOverride?: number
): MarkerReading | undefined {
  const value = Number(state);
  if (!Number.isFinite(value)) return undefined;

  const high = numberOr(attributes.marker_high_level, 100);
  const low = numberOr(attributes.marker_low_level, 0);
  const fills = String(attributes.marker_type ?? "").includes("waste");

  const fill = high > 0 ? Math.max(0, Math.min(100, (value / high) * 100)) : 0;

  const alarm = fills
    ? value >= high
    : value <= (lowOverride ?? low);

  return { fill, alarm, fills };
}
