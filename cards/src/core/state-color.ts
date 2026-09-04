/**
 * Цвет иконки по состоянию — тот же алгоритм, что в
 * home-assistant/frontend: src/common/entity/state_color.ts.
 *
 * Переиспользовать их модуль нельзя, он не публикуется наружу, поэтому
 * повторяем логику. Смысл в том, чтобы карточка окрашивалась ровно так же,
 * как штатная плитка, и подхватывала пользовательские темы.
 */
import type { HassEntity } from "./types";

const UNAVAILABLE = "unavailable";
const UNKNOWN = "unknown";
const OFF = "off";

const TIMESTAMP_STATE_DOMAINS = new Set(["button", "input_button", "scene"]);

const STATE_COLORED_DOMAIN = new Set([
  "alarm_control_panel",
  "alert",
  "automation",
  "binary_sensor",
  "calendar",
  "camera",
  "climate",
  "cover",
  "device_tracker",
  "fan",
  "group",
  "humidifier",
  "input_boolean",
  "lawn_mower",
  "light",
  "lock",
  "media_player",
  "person",
  "plant",
  "remote",
  "schedule",
  "script",
  "siren",
  "sun",
  "switch",
  "timer",
  "update",
  "vacuum",
  "valve",
  "water_heater",
  "weather",
]);

export const computeDomain = (entityId: string): string =>
  entityId.substring(0, entityId.indexOf("."));

/** Тот же slugify, которым HA собирает имена CSS-переменных состояния. */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "unknown";

export function stateActive(stateObj: HassEntity, state?: string): boolean {
  const domain = computeDomain(stateObj.entity_id);
  const compareState = state !== undefined ? state : stateObj.state;

  if (TIMESTAMP_STATE_DOMAINS.has(domain)) {
    return compareState !== UNAVAILABLE;
  }
  if (compareState === UNAVAILABLE || compareState === UNKNOWN) {
    return false;
  }
  if (compareState === OFF && domain !== "alert") {
    return false;
  }

  switch (domain) {
    case "alarm_control_panel":
      return compareState !== "disarmed";
    case "alert":
      return compareState !== "idle";
    case "cover":
    case "valve":
      return compareState !== "closed";
    case "device_tracker":
    case "person":
      return compareState !== "not_home";
    case "lawn_mower":
      return !["docked", "paused"].includes(compareState);
    case "lock":
      return compareState !== "locked";
    case "media_player":
      return compareState !== "standby";
    case "vacuum":
      return !["idle", "docked", "paused"].includes(compareState);
    case "plant":
      return compareState === "problem";
    case "group":
      return ["on", "home", "open", "locked", "problem"].includes(compareState);
    case "timer":
      return compareState === "active";
    case "camera":
      return ["streaming", "recording"].includes(compareState);
    default:
      return true;
  }
}

/** Собирает цепочку var(--a, var(--b, ...)) — как computeCssVariable в HA. */
export const cssVariableChain = (props: string[]): string | undefined =>
  props.reduceRight<string | undefined>(
    (fallback, variable) => `var(${variable}${fallback ? `, ${fallback}` : ""})`,
    undefined
  );

/** Цвет заряда батареи — у HA для него отдельное правило. */
const batteryStateColorProperty = (state: string): string | undefined => {
  const value = Number(state);
  if (isNaN(value)) return undefined;
  if (value >= 70) return "--state-sensor-battery-high-color";
  if (value >= 30) return "--state-sensor-battery-medium-color";
  return "--state-sensor-battery-low-color";
};

export function stateColorCss(
  stateObj: HassEntity | undefined,
  fallback?: string
): string | undefined {
  if (!stateObj) return fallback;
  if (stateObj.state === UNAVAILABLE) {
    return "var(--state-unavailable-color)";
  }

  const domain = computeDomain(stateObj.entity_id);
  const deviceClass = stateObj.attributes.device_class;

  if (domain === "sensor" && deviceClass === "battery") {
    const property = batteryStateColorProperty(stateObj.state);
    if (property) return `var(${property})`;
  }

  if (!STATE_COLORED_DOMAIN.has(domain)) {
    // Числовые сенсоры HA не окрашивает — плитка остаётся нейтральной.
    return fallback;
  }

  const active = stateActive(stateObj);
  const stateKey = slugify(stateObj.state);
  const activeKey = active ? "active" : "inactive";

  const properties: string[] = [];
  if (deviceClass) {
    properties.push(`--state-${domain}-${deviceClass}-${stateKey}-color`);
  }
  properties.push(
    `--state-${domain}-${stateKey}-color`,
    `--state-${domain}-${activeKey}-color`,
    `--state-${activeKey}-color`
  );

  return cssVariableChain(properties);
}

/**
 * Цвет плитки ровно по логике hui-tile-card: если у состояния есть свой цвет —
 * берём его, иначе активная сущность красится в --state-icon-color, а
 * неактивная остаётся нейтральной.
 */
export function tileColor(stateObj: HassEntity | undefined): string {
  if (!stateObj) return "var(--state-inactive-color)";
  const stateColor = stateColorCss(stateObj);
  if (stateColor) return stateColor;
  return stateActive(stateObj)
    ? "var(--state-icon-color)"
    : "var(--state-inactive-color)";
}
