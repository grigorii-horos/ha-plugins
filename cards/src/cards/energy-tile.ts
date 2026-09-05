import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import {
  composeSegments,
  numericState,
  resolveRole,
  unavailableSegment,
  type Segment,
} from "../core/format";
import { stripDeviceName } from "../core/labels";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

export interface EnergyTileConfig extends TileBaseConfig {
  type: string;
  /** The whole house's power, shown large. */
  total?: string;
  /** Power sensors of individual consumers. */
  consumers: (EntityItem | string)[];
  /** How many consumers to show. */
  limit?: number;
}

export const DEFAULT_CONSUMER_LIMIT = 5;

/**
 * Who in the house is eating electricity.
 *
 * Consumers are shown as level rows, but the level here is not "how much is
 * left" — it is a share of the hungriest one: the bar length answers "who draws
 * more", not "what per cent". Hence one shared, relative scale.
 *
 * Consumers drawing nothing are not shown: a row with an empty bar says nothing
 * and takes room. The ones that lost connection are counted out loud instead —
 * a silent power meter is easy to mistake for a switched-off appliance.
 */
export class HorosEnergyTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: EnergyTileConfig;

  /** Level rows under the tile: roughly two per grid row. */
  protected override contentRows(): number {
    return Math.ceil((Math.min(this._config?.consumers.length ?? 0, this._config?.limit ?? 5)) / 2);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/energy-tile-editor");
    return document.createElement(
      "horos-energy-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<EnergyTileConfig> {
    return { consumers: [] };
  }

  public setConfig(config: EnergyTileConfig): void {
    if (!config.consumers?.length) {
      throw new Error("At least one consumer is required (consumers)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const total = resolveRole(this.hass, config.total);
    const missing: string[] = [];
    const offline: string[] = [];
    const active: { row: Omit<LevelRow, "level">; watts: number }[] = [];

    for (const raw of config.consumers) {
      const consumer = normalizeItem(raw);
      const role = resolveRole(this.hass, consumer.entity);
      if (role?.missing) {
        missing.push(consumer.entity);
        continue;
      }
      const name =
        consumer.name ??
        stripDeviceName(role?.stateObj?.attributes.friendly_name, config.name) ??
        consumer.entity;
      if (role?.unavailable) {
        offline.push(name);
        continue;
      }
      const watts = numericState(role);
      if (watts === undefined || watts <= 0) continue;

      active.push({
        watts,
        row: {
          entityId: consumer.entity,
          name,
          text: this.hass.formatEntityState(role!.stateObj!),
          ink: consumer.color ?? "var(--amber-color, #ffc107)",
        },
      });
    }

    active.sort((a, b) => b.watts - a.watts);
    const shown = active.slice(0, config.limit ?? DEFAULT_CONSUMER_LIMIT);
    const peak = shown[0]?.watts ?? 0;

    // The bar is a share of the hungriest one, not a per cent of anything.
    const levels: LevelRow[] = shown.map(({ row, watts }) => ({
      ...row,
      level: peak > 0 ? (watts / peak) * 100 : 0,
    }));

    const notes: (Segment | undefined)[] = [
      unavailableSegment(this.hass, total),
      active.length
        ? { text: t(this.hass, "energy.consuming", { count: active.length }) }
        : { text: t(this.hass, "energy.idle") },
      offline.length
        ? { text: t(this.hass, "offline.count", { count: offline.length }) }
        : undefined,
      missing.length
        ? { text: t(this.hass, "list.missing", { count: missing.length }) }
        : undefined,
    ];

    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: config.name ?? t(this.hass, "energy.title"),
      mainEntityId: total?.entityId ?? shown[0]?.row.entityId,
      secondary: composeSegments([this.mainStateSegment(total), ...notes]),
      values: total ? this.bigValues([{ key: "total", role: total }]) : [],
      customFeatures: levels.length
        ? renderLevels(levels, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-energy-tile", HorosEnergyTile, {
  type: "horos-energy-tile",
  name: { ru: "Энергия", en: "Energy" },
  description: {
    ru: "Кто в доме ест электричество, от самого прожорливого",
    en: "Who in the house draws power, hungriest first",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-energy-tile": HorosEnergyTile;
  }
}
