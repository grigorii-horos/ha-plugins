import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import {
  cardName,
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { byClass, deviceClassOf, devicePool, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";
import {
  DEFAULT_DRY_BELOW,
  DEFAULT_WET_ABOVE,
  MOISTURE_COLOR,
  MOISTURE_ICON,
  moistureStatus,
} from "../core/moisture";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";

/** The order of roles in the secondary line. Soil moisture goes first. */
export const PLANT_ROLES = ["moisture", "temperature", "battery"] as const;

export type PlantRole = (typeof PLANT_ROLES)[number];

export interface PlantTileConfig extends TileBaseConfig {
  type: string;
  moisture: string;
  temperature?: string;
  battery?: string;
  dry_below?: number;
  wet_above?: number;
  /** What to show large on the right. Soil moisture alone by default. */
  big_values?: PlantRole[];
}

/**
 * A plant. Soil moisture as the large value on the right, and the same moisture
 * in the stock bar below the line. The thresholds only set the colour of the bar
 */
export class HorosPlantTile extends BaseTileCard {
  @state() private _config?: PlantTileConfig;

  private _bigKeys: string[] = ["moisture"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/plant-tile-editor");
    return document.createElement(
      "horos-plant-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PlantTileConfig> {
    return { moisture: "" };
  }

  public setConfig(config: PlantTileConfig): void {
    if (!config.moisture) {
      throw new Error("A soil moisture entity is required (moisture)");
    }
    const dryBelow = config.dry_below ?? DEFAULT_DRY_BELOW;
    const wetAbove = config.wet_above ?? DEFAULT_WET_ABOVE;
    if (dryBelow >= wetAbove) {
      throw new Error("dry_below must be smaller than wet_above");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "moisture", PLANT_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles: KeyedRole[] = PLANT_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const warning = this.missingRolesWarning(roles.map((item) => item.role));
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);
    const moisture = roles[0].role;

    // The gauge is always about soil moisture, whatever stands large on the right.
    const value = numericState(moisture);
    const status = moistureStatus(
      value,
      config.dry_below ?? DEFAULT_DRY_BELOW,
      config.wet_above ?? DEFAULT_WET_ABOVE
    );

    return this.renderTile({
      icon: MOISTURE_ICON[status],
      color: MOISTURE_COLOR[status],
      primary: cardName(config.name, moisture),
      imageUrl: this.entityImage(moisture?.stateObj),
      defaultIconAction: defaultIconAction(moisture?.entityId),
      secondary: composeSegments([
        unavailableSegment(this.hass, moisture),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      mainEntityId: moisture?.entityId,
      values: this.bigValues(big),
      // The gauge is a stock HA feature, not a bar of our own. It takes its
      // colour from --tile-color, that is, from our dryness thresholds.
      ownFeatures:
        value === undefined ? undefined : [{ type: "bar-gauge", min: 0, max: 100 }],
    });
  }
}

registerCard("horos-plant-tile", HorosPlantTile, {
  type: "horos-plant-tile",
  name: { ru: "Растение", en: "Plant" },
  description: {
    ru: "Влажность почвы с порогами сухости, температура почвы и заряд датчика",
    en: "Soil moisture with dryness thresholds, soil temperature and sensor battery",
  },
  preview: true,
  suggest: (hass, entityId) => {
    // Soil moisture has a device class of its own in HA: no name guessing needed.
    if (
      computeDomain(entityId) !== "sensor" ||
      deviceClassOf(hass, entityId) !== "moisture"
    ) {
      return null;
    }
    const pool = devicePool(hass, entityId);
    return suggestion("custom:horos-plant-tile", {
      moisture: entityId,
      temperature: byClass(hass, pool, "sensor", "temperature"),
      battery: byClass(hass, pool, "sensor", "battery"),
    });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-plant-tile": HorosPlantTile;
  }
}
