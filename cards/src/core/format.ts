/**
 * Разрешение ролей конфига в готовые к отрисовке значения.
 *
 * Форматирование целиком отдано `hass.formatEntityState`: единицы, округление,
 * десятичный разделитель и локаль получаются те же, что во всём остальном HA.
 * Своего форматирования тут нет и быть не должно.
 */
import type { HassEntity, HomeAssistant } from "./types";

export const UNAVAILABLE_STATES = new Set(["unavailable", "unknown"]);

export const SECONDARY_SEPARATOR = " · ";

export interface ResolvedRole {
  entityId: string;
  stateObj?: HassEntity;
  /** Сущности нет в HA — почти всегда опечатка в конфиге. */
  missing: boolean;
  /** Сущность есть, но данных нет: unavailable или unknown. */
  unavailable: boolean;
}

export function resolveRole(
  hass: HomeAssistant | undefined,
  entityId: string | undefined
): ResolvedRole | undefined {
  if (!entityId) return undefined;
  const stateObj = hass?.states[entityId];
  return {
    entityId,
    stateObj,
    missing: !stateObj,
    unavailable: !!stateObj && UNAVAILABLE_STATES.has(stateObj.state),
  };
}

/**
 * Готовая к показу строка для роли, либо undefined — если показывать нечего.
 * Необязательная роль без данных просто исчезает из вторичной строки, вся
 * карточка при этом продолжает работать.
 */
export function formatRole(
  hass: HomeAssistant | undefined,
  role: ResolvedRole | undefined
): string | undefined {
  if (!hass || !role || !role.stateObj || role.missing || role.unavailable) {
    return undefined;
  }
  return hass.formatEntityState(role.stateObj);
}

/**
 * Кусок вторичной строки. Знает свою сущность, чтобы тап по нему открывал
 * more-info именно про неё, а не про главную сущность карточки.
 */
export interface Segment {
  text: string;
  entityId?: string;
}

/** Собирает вторичную строку, выбрасывая незаполненные роли. */
export function composeSegments(parts: (Segment | undefined)[]): Segment[] {
  return parts.filter(
    (part): part is Segment => !!part && part.text.trim() !== ""
  );
}

/** Кусок строки для роли, либо undefined — если показывать нечего. */
export function roleSegment(
  hass: HomeAssistant | undefined,
  role: ResolvedRole | undefined
): Segment | undefined {
  const text = formatRole(hass, role);
  return text ? { text, entityId: role?.entityId } : undefined;
}

/** Кусок строки со статусом недоступности сущности. */
export function unavailableSegment(
  hass: HomeAssistant | undefined,
  role: ResolvedRole | undefined
): Segment | undefined {
  const text = formatUnavailable(hass, role);
  return text ? { text, entityId: role?.entityId } : undefined;
}

/**
 * Текст статуса для роли, которая недоступна. Нужен вторичной строке: главное
 * значение в правой колонке при этом не показывается вовсе, иначе длинное
 * слово вроде "Unavailable" встаёт на место числа и ломает строку.
 */
export function formatUnavailable(
  hass: HomeAssistant | undefined,
  role: ResolvedRole | undefined
): string | undefined {
  if (!hass || !role?.stateObj || !role.unavailable) return undefined;
  return hass.formatEntityState(role.stateObj);
}

/** Число из состояния сущности, либо undefined если оно нечисловое. */
export function numericState(
  role: ResolvedRole | undefined
): number | undefined {
  if (!role?.stateObj) return undefined;
  const value = Number(role.stateObj.state);
  return Number.isFinite(value) ? value : undefined;
}

/** Имя карточки: из конфига, иначе имя главной сущности. */
export function cardName(
  configName: string | undefined,
  role: ResolvedRole | undefined
): string {
  if (configName) return configName;
  return role?.stateObj?.attributes.friendly_name ?? role?.entityId ?? "";
}

/** Отделяет единицу измерения, чтобы показать её мельче основного числа. */
export function splitValueUnit(
  formatted: string,
  unit: string | undefined
): { value: string; unit?: string } {
  if (!unit) return { value: formatted };
  if (!formatted.endsWith(unit)) return { value: formatted };
  const value = formatted.slice(0, formatted.length - unit.length).trimEnd();
  return value ? { value, unit } : { value: formatted };
}
