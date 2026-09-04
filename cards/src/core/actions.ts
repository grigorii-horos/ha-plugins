/**
 * Действия по тапу — та же семантика, что в
 * home-assistant/frontend: src/panels/lovelace/common/handle-action.ts.
 *
 * Их модуль наружу не публикуется, поэтому повторяем поведение: те же имена
 * действий, те же сервисы переключения по доменам, то же подтверждение.
 */
import { computeDomain } from "./state-color";
import type { HomeAssistant } from "./types";

export interface BaseActionConfig {
  action: string;
  confirmation?: {
    text?: string;
    title?: string;
    confirm_text?: string;
    dismiss_text?: string;
  };
}

export interface ActionConfig extends BaseActionConfig {
  entity?: string;
  navigation_path?: string;
  navigation_replace?: boolean;
  url_path?: string;
  perform_action?: string;
  /** @deprecated оставлено для старых конфигов, заменено на perform_action */
  service?: string;
  target?: Record<string, unknown>;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
}

export interface ActionsConfig {
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export type ActionType = "tap" | "hold" | "double_tap";

/** Жест вооружается только если действие задано и это не "none". */
export function hasAction(config?: ActionConfig): boolean {
  return config !== undefined && config.action !== "none";
}

const STATES_OFF = ["closed", "locked", "off"];

/** Домены, которые штатная плитка считает переключаемыми. */
const DOMAINS_TOGGLE = new Set([
  "fan",
  "input_boolean",
  "light",
  "switch",
  "group",
  "automation",
  "humidifier",
  "valve",
]);

/**
 * Действие иконки по умолчанию — копия getEntityDefaultTileIconAction из HA.
 * Переключаемое переключается, всё остальное иконкой не реагирует: тап всё
 * равно провалится на подложку карточки и откроет more-info.
 */
export function defaultIconAction(entityId: string | undefined): ActionConfig {
  if (!entityId) return { action: "none" };
  const domain = computeDomain(entityId);
  const toggleable =
    DOMAINS_TOGGLE.has(domain) ||
    ["button", "input_button", "scene"].includes(domain);
  return { action: toggleable ? "toggle" : "none" };
}

/** Домены с нестандартным переключением — копия SPECIAL_TOGGLE_ACTIONS из HA. */
const SPECIAL_TOGGLE_ACTIONS: Record<string, { on: string; off?: string }> = {
  button: { on: "press" },
  camera: { on: "turn_on", off: "turn_off" },
  climate: { on: "turn_on", off: "turn_off" },
  cover: { on: "open_cover", off: "close_cover" },
  input_button: { on: "press" },
  lock: { on: "unlock", off: "lock" },
  media_player: { on: "turn_on", off: "turn_off" },
  scene: { on: "turn_on" },
  siren: { on: "turn_on", off: "turn_off" },
  valve: { on: "open_valve", off: "close_valve" },
};

export function toggleAction(domain: string, turnOn: boolean): string {
  const special = SPECIAL_TOGGLE_ACTIONS[domain];
  if (special) return (turnOn ? special.on : special.off) ?? special.on;
  return turnOn ? "turn_on" : "turn_off";
}

export function toggleEntity(hass: HomeAssistant, entityId: string): void {
  const stateObj = hass.states[entityId];
  if (!stateObj) return;
  const domain = computeDomain(entityId);
  const serviceDomain = domain === "group" ? "homeassistant" : domain;
  const turnOn = STATES_OFF.includes(stateObj.state);
  hass.callService(serviceDomain, toggleAction(domain, turnOn), {
    entity_id: entityId,
  });
}

function fire(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true })
  );
}

/** Переход внутри HA: тем же способом, что common/navigate.ts. */
function navigate(path: string, replace?: boolean): void {
  if (replace) {
    window.history.replaceState(null, "", path);
  } else {
    window.history.pushState(null, "", path);
  }
  window.dispatchEvent(new CustomEvent("location-changed", { detail: {} }));
}

/**
 * Подтверждение действия. Диалог берём у HA через loadCardHelpers — это
 * единственный официально доступный custom-картам путь к их диалогам.
 */
async function confirmed(
  node: HTMLElement,
  config: ActionConfig
): Promise<boolean> {
  if (!config.confirmation) return true;
  const loader = (
    window as unknown as { loadCardHelpers?: () => Promise<unknown> }
  ).loadCardHelpers;
  if (!loader) return window.confirm(config.confirmation.text ?? "Подтвердить?");

  const helpers = (await loader()) as {
    showConfirmationDialog?: (
      node: HTMLElement,
      params: Record<string, unknown>
    ) => Promise<boolean>;
  };
  if (!helpers.showConfirmationDialog) {
    return window.confirm(config.confirmation.text ?? "Подтвердить?");
  }
  return helpers.showConfirmationDialog(node, {
    text: config.confirmation.text,
    title: config.confirmation.title,
    confirmText: config.confirmation.confirm_text,
    dismissText: config.confirmation.dismiss_text,
  });
}

export async function handleAction(
  node: HTMLElement,
  hass: HomeAssistant,
  config: ActionsConfig,
  action: ActionType
): Promise<void> {
  let actionConfig: ActionConfig | undefined;
  if (action === "double_tap") actionConfig = config.double_tap_action;
  else if (action === "hold") actionConfig = config.hold_action;
  else actionConfig = config.tap_action;

  // Как в HA: отсутствие настройки означает more-info, а не бездействие.
  if (!actionConfig) actionConfig = { action: "more-info" };

  if (!(await confirmed(node, actionConfig))) return;

  switch (actionConfig.action) {
    case "none":
      break;

    case "more-info": {
      const entityId = actionConfig.entity || config.entity;
      if (entityId) fire(node, "hass-more-info", { entityId });
      break;
    }

    case "toggle": {
      const entityId = actionConfig.entity || config.entity;
      if (entityId) toggleEntity(hass, entityId);
      break;
    }

    case "navigate":
      if (actionConfig.navigation_path) {
        navigate(actionConfig.navigation_path, actionConfig.navigation_replace);
      }
      break;

    case "url":
      if (actionConfig.url_path) {
        window.open(actionConfig.url_path, "_blank", "noreferrer");
      }
      break;

    case "perform-action":
    case "call-service": {
      const target = actionConfig.perform_action || actionConfig.service;
      if (!target) break;
      const [domain, service] = target.split(".", 2);
      hass.callService(domain, service, {
        ...(actionConfig.data ?? actionConfig.service_data ?? {}),
        ...(actionConfig.target ?? {}),
      });
      break;
    }

    case "fire-dom-event":
      fire(node, "ll-custom", actionConfig);
      break;

    default:
      // assist и прочие диалоги HA наружу не отдаёт — молча не делаем вид,
      // что сработало.
      // eslint-disable-next-line no-console
      console.warn(
        `horos-cards: действие "${actionConfig.action}" не поддержано`
      );
  }
}
