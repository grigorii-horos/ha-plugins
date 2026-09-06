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
import { byClass, byDomain, devicePool, filled, suggestion } from "../core/suggest";

/** The order of roles in the secondary line. The switch goes first. */
export const PLUG_ROLES = ["switch", "power", "energy"] as const;

export type PlugRole = (typeof PLUG_ROLES)[number];

export interface PlugTileConfig extends TileBaseConfig {
  type: string;
  switch: string;
  power?: string;
  energy?: string;
  toggle_button?: boolean;
  /** What to show large on the right. Power alone by default. */
  big_values?: PlugRole[];
}

/**
 * A smart plug. Power as the large value on the right, the switch state and the
 * accumulated energy in the secondary line. A tap on the icon toggles it.
 */
export class HorosPlugTile extends BaseTileCard {
  @state() private _config?: PlugTileConfig;

  private _bigKeys: string[] = ["power"];

  protected override fixedRows(): number {
    return this.featureRows(this._config?.toggle_button ? 1 : 0);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/plug-tile-editor");
    return document.createElement("horos-plug-tile-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PlugTileConfig> {
    return { switch: "", power: "" };
  }

  public setConfig(config: PlugTileConfig): void {
    if (!config.switch) {
      throw new Error("A switch is required (switch)");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "power", PLUG_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles: KeyedRole[] = PLUG_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const warning = this.missingRolesWarning(roles.map((item) => item.role));
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);
    const sw = roles[0].role!;
    const entityId = sw.entityId;

    return this.renderTile({
      icon: "mdi:power-plug",
      color: tileColor(sw.stateObj),
      primary: cardName(config.name, sw),
      secondary: composeSegments([
        // One of the two returns a piece: an available switch gives its state,
        // an unavailable one its unavailability status.
        unavailableSegment(this.hass, sw),
        // The switch is the card's main entity, so its state can be shown
        // through state_content, just like on the stock tile.
        ...rest.map((item) =>
          item.key === "switch"
            ? this.mainStateSegment(item.role)
            : roleSegment(this.hass, item.role)
        ),
      ]),
      mainEntityId: entityId,
      imageUrl: this.entityImage(sw.stateObj),
      defaultIconAction: defaultIconAction(entityId),
      values: this.bigValues(big),
      // The button is a stock HA feature; there is no markup of our own left for it.
      ownFeatures: config.toggle_button ? [{ type: "toggle" }] : undefined,
    });
  }
}

registerCard("horos-plug-tile", HorosPlugTile, {
  type: "horos-plug-tile",
  name: { ru: "Розетка", en: "Smart plug" },
  description: {
    ru: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
    en: "Switch, current power draw and accumulated energy in a single tile",
  },
  preview: true,
  suggest: (hass, entityId) => {
    const pool = devicePool(hass, entityId);
    const roles = {
      switch: byDomain(pool, "switch"),
      power: byClass(hass, pool, "sensor", "power"),
      energy: byClass(hass, pool, "sensor", "energy"),
    };
    // A plug with no metering is no different from a tile with a toggle.
    if (!roles.switch || filled(roles) < 2) return null;
    return suggestion("custom:horos-plug-tile", roles);
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-plug-tile": HorosPlugTile;
  }
}
