import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments, numericState, resolveRole } from "../core/format";
import { batteryColor, stripBatterySuffix } from "../core/labels";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

export interface BatteriesTileConfig extends TileBaseConfig {
  type: string;
  batteries: (EntityItem | string)[];
  /** Below this charge a battery makes the list. */
  low_below?: number;
}

export const DEFAULT_BATTERY_LOW = 30;

interface BatteryEntry {
  entityId: string;
  name: string;
  level: number;
}

/**
 * The batteries in the house.
 *
 * The card deliberately shows not every battery but only the ones running down:
 * nobody reads a list of forty rows, and the card asks exactly one question —
 * what needs replacing. When nothing does, it says so.
 */
export class HorosBatteriesTile extends BaseTileCard {
  @state() private _config?: BatteriesTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/batteries-tile-editor");
    return document.createElement(
      "horos-batteries-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<BatteriesTileConfig> {
    return { batteries: [] };
  }

  public setConfig(config: BatteriesTileConfig): void {
    if (!config.batteries?.length) {
      throw new Error("At least one battery is required (batteries)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;
    const low = config.low_below ?? DEFAULT_BATTERY_LOW;

    const entries: BatteryEntry[] = [];
    const missing: string[] = [];

    for (const raw of config.batteries) {
      const battery = normalizeItem(raw);
      const role = resolveRole(this.hass, battery.entity);
      if (role?.missing) {
        missing.push(battery.entity);
        continue;
      }
      const level = numericState(role);
      if (level === undefined) continue;
      entries.push({
        entityId: battery.entity,
        name:
          battery.name ??
          stripBatterySuffix(role?.stateObj?.attributes.friendly_name) ??
          battery.entity,
        level,
      });
    }

    const draining = entries
      .filter((entry) => entry.level < low)
      .sort((a, b) => a.level - b.level);
    const worst = draining[0];

    return this.renderTile({
      icon: worst ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: batteryColor(worst?.level),
      primary: config.name ?? t(this.hass, "batteries.title"),
      mainEntityId: worst?.entityId,
      secondary: composeSegments([
        ...(draining.length
          ? draining.map((entry) => ({
              text: `${entry.name} ${entry.level}%`,
              entityId: entry.entityId,
            }))
          : [
              {
                text: t(this.hass, "batteries.allFull", {
                  count: entries.length,
                }),
              },
            ]),
        // A row that disappeared is dropped, but staying silent about it is not
        // an option: a list card must not go dark over one renamed entity, and
        // must not pretend the entity was never there.
        ...(missing.length
          ? [{ text: t(this.hass, "list.missing", { count: missing.length }) }]
          : []),
      ]),
      values: worst
        ? [
            {
              value: String(worst.level),
              unit: "%",
              entityId: worst.entityId,
              icon: "mdi:battery",
            },
          ]
        : [],
    });
  }
}

registerCard("horos-batteries-tile", HorosBatteriesTile, {
  type: "horos-batteries-tile",
  name: { ru: "Батарейки", en: "Batteries" },
  description: {
    ru: "Только садящиеся батарейки, от самой пустой",
    en: "Only the batteries that are running down, emptiest first",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-batteries-tile": HorosBatteriesTile;
  }
}
