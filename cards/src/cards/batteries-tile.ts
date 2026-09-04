import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments, numericState, resolveRole } from "../core/format";
import { batteryColor, stripBatterySuffix } from "../core/labels";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

export interface BatteriesTileConfig extends TileBaseConfig {
  type: string;
  batteries: (CartridgeConfig | string)[];
  /** Ниже этого заряда батарейка попадает в список. */
  low_below?: number;
}

export const DEFAULT_BATTERY_LOW = 30;

interface BatteryEntry {
  entityId: string;
  name: string;
  level: number;
}

/**
 * Батарейки дома.
 *
 * Карточка сознательно показывает не все батарейки, а только садящиеся:
 * список из сорока строк никто не читает, а вопрос у неё ровно один — что
 * пора менять. Когда менять нечего, она так и говорит.
 */
@customElement("horos-batteries-tile")
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
      throw new Error("Нужно указать хотя бы одну батарейку (batteries)");
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
      const battery = normalizeCartridge(raw);
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

    if (missing.length) {
      return this.renderWarning(`Сущности не найдены: ${missing.join(", ")}`);
    }

    const draining = entries
      .filter((entry) => entry.level < low)
      .sort((a, b) => a.level - b.level);
    const worst = draining[0];

    return this.renderTile({
      icon: worst ? "mdi:battery-alert-variant-outline" : "mdi:battery",
      color: batteryColor(worst?.level),
      primary: config.name ?? "Батарейки",
      mainEntityId: worst?.entityId,
      secondary: composeSegments(
        draining.length
          ? draining.map((entry) => ({
              text: `${entry.name} ${entry.level}%`,
              entityId: entry.entityId,
            }))
          : [{ text: `Все заряжены, ${entries.length} шт.` }]
      ),
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

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-batteries-tile",
  name: "Батарейки",
  description: "Только садящиеся батарейки, от самой пустой",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-batteries-tile": HorosBatteriesTile;
  }
}
