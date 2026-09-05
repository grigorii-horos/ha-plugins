import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  cardName,
  composeSegments,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { byClass, devicePool, filled, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";

/** The order of roles in the secondary line is fixed and not configurable. */
export const CLIMATE_ROLES = [
  "temperature",
  "humidity",
  "illuminance",
  "pm25",
] as const;

export type ClimateRole = (typeof CLIMATE_ROLES)[number];

export interface ClimateTileConfig extends TileBaseConfig {
  type: string;
  temperature: string;
  humidity?: string;
  illuminance?: string;
  pm25?: string;
  /** What to show large on the right. One temperature by default. */
  big_values?: ClimateRole[];
}

/**
 * Room climate. Large on the right — the temperature, optionally one more value
 * after a slash. The rest goes to the secondary line in CLIMATE_ROLES order.
 */
export class HorosClimateTile extends BaseTileCard {
  @state() private _config?: ClimateTileConfig;

  private _bigKeys: string[] = ["temperature"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/climate-tile-editor");
    return document.createElement(
      "horos-climate-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<ClimateTileConfig> {
    return { temperature: "", humidity: "" };
  }

  public setConfig(config: ClimateTileConfig): void {
    if (!config.temperature) {
      throw new Error("A temperature entity is required (temperature)");
    }
    this._bigKeys = resolveBigKeys(
      config.big_values,
      "temperature",
      CLIMATE_ROLES
    );
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles: KeyedRole[] = CLIMATE_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const warning = this.missingRolesWarning(roles.map((item) => item.role));
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);
    const main = roles[0].role;

    return this.renderTile({
      icon: "mdi:thermometer",
      color: tileColor(main?.stateObj),
      primary: cardName(config.name, main),
      imageUrl: this.entityImage(main?.stateObj),
      defaultIconAction: defaultIconAction(main?.entityId),
      secondary: composeSegments([
        unavailableSegment(this.hass, main),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      mainEntityId: main?.entityId,
      values: this.bigValues(big),
    });
  }
}

registerCard("horos-climate-tile", HorosClimateTile, {
  type: "horos-climate-tile",
  name: { ru: "Климат комнаты", en: "Room climate" },
  description: {
    ru: "Температура, влажность, освещённость и PM2.5 одной комнаты в одной плитке",
    en: "Temperature, humidity, illuminance and PM2.5 of one room in a single tile",
  },
  preview: true,
  suggest: (hass, entityId) => {
    if (computeDomain(entityId) !== "sensor") return null;
    const pool = devicePool(hass, entityId);
    const roles = {
      temperature: byClass(hass, pool, "sensor", "temperature"),
      humidity: byClass(hass, pool, "sensor", "humidity"),
      illuminance: byClass(hass, pool, "sensor", "illuminance"),
      pm25: byClass(hass, pool, "sensor", "pm25"),
    };
    // One temperature is what the stock tile is for; this card starts at the
    // second role.
    if (!roles.temperature || filled(roles) < 2) return null;
    return suggestion("custom:horos-climate-tile", roles);
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-climate-tile": HorosClimateTile;
  }
}
