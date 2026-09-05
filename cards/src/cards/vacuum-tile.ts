import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { levelColor, stripDeviceName } from "../core/labels";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

export interface VacuumTileConfig extends TileBaseConfig {
  type: string;
  vacuum: string;
  battery?: string;
  /** Режим уборки, статус зарядки — что ещё сказать во второй строке. */
  sensors?: (EntityItem | string)[];
  /** Ресурс расходников в процентах: щётки, фильтр, швабра. */
  consumables?: (EntityItem | string)[];
  /** Ниже этого ресурса расходник просит замены. */
  low_below?: number;
}

export const DEFAULT_CONSUMABLE_LOW = 20;

/**
 * Робот-пылесос. В строке — что он сейчас делает и сколько заряда, в линии
 * features — ресурс расходников колбами.
 *
 * Расходники и чернила принтера — одна и та же задача: несколько однородных
 * уровней, которые надо увидеть вместе и понять, что скоро кончится.
 */
export class HorosVacuumTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: VacuumTileConfig;

  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  protected override contentRows(): number {
    return Math.ceil((this._config?.consumables?.length ?? 0) / 2);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/vacuum-tile-editor");
    return document.createElement(
      "horos-vacuum-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<VacuumTileConfig> {
    return { vacuum: "" };
  }

  public setConfig(config: VacuumTileConfig): void {
    if (!config.vacuum) {
      throw new Error("Нужно указать пылесос (vacuum)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const vacuum = resolveRole(this.hass, config.vacuum);
    const battery = resolveRole(this.hass, config.battery);
    const extras = (config.sensors ?? [])
      .map((raw) => normalizeItem(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([vacuum, battery, ...extras]);
    if (warning) return this.renderWarning(warning);

    const deviceName = vacuum?.stateObj?.attributes.friendly_name;
    const low = config.low_below ?? DEFAULT_CONSUMABLE_LOW;

    const consumables = (config.consumables ?? [])
      .map((raw) => normalizeItem(raw))
      .map((item) => {
        const role = resolveRole(this.hass, item.entity);
        const level = numericState(role) ?? 0;
        const name =
          item.name ??
          stripDeviceName(role?.stateObj?.attributes.friendly_name, deviceName);
        return {
          entityId: item.entity,
          name: name ?? item.entity,
          text: `${level}%`,
          // Цветом плитки красить нельзя: у стоящего на базе пылесоса он
          // неактивный, и все колбы выходят одинаково серыми. Красим по
          // уровню — вопрос у расходника тот же, что у батарейки.
          ink: item.color ?? levelColor(level),
          level,
          alarm: level < low,
        };
      });

    return this.renderTile({
      icon: "mdi:robot-vacuum",
      color: tileColor(vacuum?.stateObj),
      primary: config.name ?? deviceName ?? t(this.hass, "vacuum.title"),
      mainEntityId: vacuum?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, vacuum),
        this.mainStateSegment(vacuum),
        ...extras.map((extra) => roleSegment(this.hass, extra)),
      ]),
      values: battery ? this.bigValues([{ key: "battery", role: battery }]) : [],
      customFeatures: consumables.length
        ? renderLevels(consumables, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-vacuum-tile", HorosVacuumTile, {
  type: "horos-vacuum-tile",
  name: { ru: "Пылесос", en: "Vacuum" },
  description: {
    ru: "Состояние робота, заряд и ресурс расходников в одной плитке",
    en: "Robot status, battery and consumable life in a single tile",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-vacuum-tile": HorosVacuumTile;
  }
}
