import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { stripDeviceName } from "../core/labels";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { byClass, byDomain, devicePool, filled, suggestion } from "../core/suggest";
import { t } from "../core/i18n";

/** The order of roles in the secondary line. */
export const AIR_ROLES = ["pm25", "humidity", "temperature", "power"] as const;

export type AirRole = (typeof AIR_ROLES)[number];

export interface AirTileConfig extends TileBaseConfig {
  type: string;
  /** The appliance itself: fan, humidifier or switch. A tap on the icon toggles it. */
  appliance: string;
  pm25?: string;
  humidity?: string;
  temperature?: string;
  power?: string;
  /** What else to say: speed, mode. */
  sensors?: (EntityItem | string)[];
  /** Report only once it fires: time to change the filter. */
  alerts?: (EntityItem | string)[];
  /** What to show large on the right. PM2.5 by default. */
  big_values?: AirRole[];
}

/**
 * Appliances that deal with air: purifier, recuperator, humidifier,
 * dehumidifier. Different domains, one question — is it running and what is
 * happening to the air.
 *
 * The appliance is one `appliance` role of any domain, so the card fits a `fan`,
 * a `humidifier`, and equally a plug the appliance simply happens to be plugged
 * into.
 */
export class HorosAirTile extends BaseTileCard {
  @state() private _config?: AirTileConfig;

  private _bigKeys: string[] = ["pm25"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/air-tile-editor");
    return document.createElement("horos-air-tile-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<AirTileConfig> {
    return { appliance: "" };
  }

  public setConfig(config: AirTileConfig): void {
    if (!config.appliance) {
      throw new Error("An appliance is required (appliance)");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "pm25", AIR_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const appliance = resolveRole(this.hass, config.appliance);
    const roles: KeyedRole[] = AIR_ROLES.map((key) => {
      const role = resolveRole(this.hass, config[key]);
      // A switched-off IKEA purifier reports PM2.5 as -1. A concentration is
      // never negative, so that is not "zero" but "no data", and a figure like
      // that must not be put in the card's headline.
      if (key === "pm25") {
        const value = numericState(role);
        if (value !== undefined && value < 0) return { key, role: undefined };
      }
      return { key, role };
    });
    const extras = (config.sensors ?? [])
      .map((raw) => normalizeItem(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([
      appliance,
      ...roles.map((item) => item.role),
      ...extras,
    ]);
    if (warning) return this.renderWarning(warning);

    const alerts = (config.alerts ?? [])
      .map((raw) => normalizeItem(raw))
      .map((alert) => ({ alert, role: resolveRole(this.hass, alert.entity) }))
      .filter(({ role }) => role?.stateObj?.state === "on")
      .map(({ alert, role }) => ({
        text:
          alert.name ??
          stripDeviceName(
            role?.stateObj?.attributes.friendly_name,
            config.name
          ) ??
          alert.entity,
        entityId: alert.entity,
      }));

    const { big, rest } = splitRoles(roles, this._bigKeys);

    return this.renderTile({
      icon: config.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: tileColor(appliance?.stateObj),
      primary:
        config.name ??
        appliance?.stateObj?.attributes.friendly_name ??
        t(this.hass, "air.title"),
      mainEntityId: appliance?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, appliance),
        ...alerts,
        this.mainStateSegment(appliance),
        ...extras.map((extra) => roleSegment(this.hass, extra)),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      values: this.bigValues(big),
    });
  }
}

registerCard("horos-air-tile", HorosAirTile, {
  type: "horos-air-tile",
  name: { ru: "Воздух", en: "Air" },
  description: {
    ru: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
    en: "Purifier, recuperator, humidifier — the appliance and the air",
  },
  preview: true,
  suggest: (hass, entityId) => {
    const pool = devicePool(hass, entityId);
    const roles = {
      appliance: byDomain(pool, "fan", "humidifier"),
      pm25: byClass(hass, pool, "sensor", "pm25"),
      humidity: byClass(hass, pool, "sensor", "humidity"),
      temperature: byClass(hass, pool, "sensor", "temperature"),
      power: byClass(hass, pool, "sensor", "power"),
    };
    if (!roles.appliance || filled(roles) < 2) return null;
    return suggestion("custom:horos-air-tile", roles);
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-air-tile": HorosAirTile;
  }
}
