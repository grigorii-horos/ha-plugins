import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
  type Segment,
} from "../core/format";
import { stripDeviceName } from "../core/labels";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

export interface EnergyTileConfig extends TileBaseConfig {
  type: string;
  /** Общая мощность дома, идёт крупно. */
  total?: string;
  /** Сенсоры мощности отдельных потребителей. */
  consumers: (CartridgeConfig | string)[];
  /** Сколько потребителей показывать. */
  limit?: number;
}

export const DEFAULT_CONSUMER_LIMIT = 5;

/**
 * Кто в доме ест электричество.
 *
 * Потребители показаны строками уровней, но уровень здесь не «сколько
 * осталось», а доля от самого прожорливого: длина полосы отвечает на вопрос
 * «кто больше», а не «сколько процентов». Поэтому шкала общая и относительная.
 *
 * Нулевые потребители не показываются: строка с пустой полосой ничего не
 * говорит, а место занимает. Потерявшие связь наоборот пересчитываются вслух —
 * молчащий ваттметр легко принять за выключенный прибор.
 */
@customElement("horos-energy-tile")
export class HorosEnergyTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: EnergyTileConfig;

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
      throw new Error("Нужно указать хотя бы одного потребителя (consumers)");
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
      const consumer = normalizeCartridge(raw);
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

    if (missing.length) {
      return this.renderWarning(`Сущности не найдены: ${missing.join(", ")}`);
    }

    active.sort((a, b) => b.watts - a.watts);
    const shown = active.slice(0, config.limit ?? DEFAULT_CONSUMER_LIMIT);
    const peak = shown[0]?.watts ?? 0;

    // Полоса — доля от самого прожорливого, а не процент от чего-то.
    const levels: LevelRow[] = shown.map(({ row, watts }) => ({
      ...row,
      level: peak > 0 ? (watts / peak) * 100 : 0,
    }));

    const notes: (Segment | undefined)[] = [
      unavailableSegment(this.hass, total),
      active.length
        ? { text: `${active.length} потребляют` }
        : { text: "Никто не потребляет" },
      offline.length ? { text: `${offline.length} без связи` } : undefined,
    ];

    return this.renderTile({
      icon: "mdi:flash",
      color: "var(--amber-color, #ffc107)",
      primary: config.name ?? "Энергия",
      mainEntityId: total?.entityId ?? shown[0]?.row.entityId,
      secondary: composeSegments([roleSegment(this.hass, total), ...notes]),
      values: total ? this.bigValues([{ key: "total", role: total }]) : [],
      customFeatures: levels.length
        ? renderLevels(levels, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-energy-tile",
  name: "Энергия",
  description: "Кто в доме ест электричество, от самого прожорливого",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-energy-tile": HorosEnergyTile;
  }
}
