/**
 * Минимальный срез типов HA-фронтенда, который нам нужен. Полные типы живут в
 * home-assistant/frontend и наружу не публикуются, поэтому описываем сами —
 * только то, чем реально пользуемся.
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    device_class?: string;
    unit_of_measurement?: string;
    icon?: string;
    [key: string]: unknown;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  localize: (key: string, ...args: unknown[]) => string;
  formatEntityState: (stateObj: HassEntity, state?: string) => string;
  /** Абсолютный адрес по относительному пути HA — нужен для картинок сущностей. */
  hassUrl: (path?: string) => string;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>
  ) => Promise<unknown>;
}

/** Роль в макете карточки: какая сущность каким смыслом заполняет слот. */
export interface Role {
  /** Ключ роли в конфиге, например "humidity". */
  key: string;
  /** entity_id из конфига, если роль заполнена. */
  entityId?: string;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: Record<string, unknown>): void;
}

export interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }

  interface HASSDomEvents {
    "hass-more-info": { entityId: string };
    "config-changed": { config: Record<string, unknown> };
  }
}
