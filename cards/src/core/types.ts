/**
 * The minimal slice of HA frontend types that we need. The full ones live in
 * home-assistant/frontend and are not published, so we describe them here —
 * only what is actually used.
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
  /** An absolute URL from an HA relative path — needed for entity pictures. */
  hassUrl: (path?: string) => string;
  /** The entity registry: needed to tell which device an entity belongs to. */
  entities?: Record<string, { device_id?: string; hidden?: boolean }>;
  /** The device registry: names for grouping. */
  devices?: Record<string, { name?: string; name_by_user?: string }>;
  /** The user's interface language. */
  language?: string;
  locale?: { language?: string };
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>
  ) => Promise<unknown>;
}

/** A role in the card layout: which entity fills which slot with which meaning. */
export interface Role {
  /** The role key in the config, "humidity" for example. */
  key: string;
  /** The entity_id from the config, if the role is filled. */
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

/** What HA lays a card out with on a sections dashboard. */
export interface LovelaceGridOptions {
  columns?: number | "full";
  rows?: number | "auto";
  min_columns?: number;
  min_rows?: number;
  max_columns?: number;
  max_rows?: number;
}
