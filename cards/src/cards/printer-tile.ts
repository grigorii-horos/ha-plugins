import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles } from "../core/levels";
import { composeSegments, resolveRole, roleSegment } from "../core/format";
import { tileColor } from "../core/state-color";
import {
  cartridgeCssColor,
  cartridgeColor,
  cartridgeLabel,
  readMarker,
  type MarkerReading,
} from "../core/printer";
import { normalizeItem, type EntityItem } from "../core/entity-item";

/** Внутреннее представление одного картриджа перед отрисовкой. */
interface PrinterTank {
  entityId: string;
  name?: string;
  ink: string;
  marker?: MarkerReading;
  text: string;
}
import type { HassEntity, LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

export interface PrinterTileConfig extends TileBaseConfig {
  type: string;
  /** Сущность состояния принтера: печатает, простаивает, ошибка. */
  status?: string;
  /** Сенсоры уровня чернил. */
  cartridges: (EntityItem | string)[];
  /** Что угодно ещё про принтер: наработка, счётчик страниц, ошибки. */
  sensors?: (EntityItem | string)[];
  /**
   * Свой порог «мало чернил». Не задан — берётся marker_low_level самого
   * принтера. На поглотитель отработки не влияет: у него тревога наоборот,
   * когда он полон.
   */
  low_below?: number;
}

/**
 * Принтер обычной плиткой: строка с именем и состоянием, под ней одна линия
 * features с уровнями чернил.
 *
 * Уровень показан колбами, а не полоской: Canon G-серии — баковый принтер,
 * у него спереди прозрачные ёмкости, и они стоят как раз рядком. Полоса
 * features и есть этот рядок, каждая колба залита своими чернилами снизу.
 *
 * Крупным значением справа стоят самые кончающиеся чернила — то, ради чего на
 * принтер вообще смотрят: пора ли покупать.
 */
export class HorosPrinterTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: PrinterTileConfig;

  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  protected override contentRows(): number {
    return Math.ceil(((this._config?.cartridges.length ?? 0) + (this._config?.sensors?.length ?? 0)) / 2);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/printer-tile-editor");
    return document.createElement(
      "horos-printer-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PrinterTileConfig> {
    return { cartridges: [] };
  }

  public setConfig(config: PrinterTileConfig): void {
    if (!config.cartridges?.length) {
      throw new Error("Нужно указать хотя бы один картридж (cartridges)");
    }
    this.base = config;
    this._config = config;
  }

  private get _printerName(): string | undefined {
    if (this._config?.name) return this._config.name;
    const status = this._config?.status
      ? this.hass?.states[this._config.status]
      : undefined;
    return status?.attributes.friendly_name;
  }

  private _tanks(): PrinterTank[] {
    if (!this._config || !this.hass) return [];
    const printerName = this._printerName;

    return this._config.cartridges
      .map((raw) => normalizeItem(raw))
      .map((cartridge) => {
        const stateObj = this.hass!.states[cartridge.entity];
        return {
          entityId: cartridge.entity,
          name:
            cartridge.name ??
            cartridgeLabel(stateObj?.attributes.friendly_name, printerName),
          ink: cartridgeCssColor(
            cartridge.color ?? cartridgeColor(cartridge.entity) ?? "grey"
          ),
          marker: stateObj
            ? readMarker(
                stateObj.state,
                stateObj.attributes,
                this._config!.low_below
              )
            : undefined,
          text: stateObj ? this.hass!.formatEntityState(stateObj) : "—",
        };
      });
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const tanks = this._tanks();
    const missing = tanks.filter((tank) => !tank.marker && tank.text === "—");
    if (missing.length) {
      return this.renderWarning(
        `Сущности не найдены: ${missing.map((t) => t.entityId).join(", ")}`
      );
    }

    // Крупно — самые кончающиеся расходуемые чернила: ради этого и смотрят.
    const consumable = tanks.filter((tank) => tank.marker && !tank.marker.fills);
    const worst = consumable.reduce<PrinterTank | undefined>(
      (lowest, tank) =>
        !lowest || tank.marker!.fill < lowest.marker!.fill ? tank : lowest,
      undefined
    );

    const status = this._config.status
      ? resolveRole(this.hass, this._config.status)
      : undefined;
    const extras = (this._config.sensors ?? [])
      .map((raw) => normalizeItem(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const statusObj: HassEntity | undefined = status?.stateObj;

    return this.renderTile({
      icon: "mdi:printer",
      color: statusObj ? tileColor(statusObj) : "var(--state-icon-color)",
      primary: this._printerName ?? t(this.hass, "printer.title"),
      secondary: composeSegments([
        roleSegment(this.hass, status),
        ...extras.map((extra) => roleSegment(this.hass, extra)),
      ]),
      mainEntityId: this._config.status ?? worst?.entityId,
      values: worst
        ? [
            {
              value: String(Math.round(worst.marker!.fill)),
              unit: "%",
              entityId: worst.entityId,
              icon: "mdi:water",
            },
          ]
        : [],
      customFeatures: renderLevels(
        tanks.map((tank) => ({
          entityId: tank.entityId,
          name: tank.name ?? tank.entityId,
          text: tank.text,
          ink: tank.ink,
          level: tank.marker?.fill ?? 0,
          alarm: tank.marker?.alarm ?? false,
          alarmIcon: tank.marker?.fills ? "mdi:delete-alert" : undefined,
        })),
        (entityId) => this.fireMoreInfo(entityId)
      ),
    });
  }
}

registerCard("horos-printer-tile", HorosPrinterTile, {
  type: "horos-printer-tile",
  name: { ru: "Принтер", en: "Printer" },
  description: {
    ru: "Уровни чернил и состояние принтера в одной плитке",
    en: "Ink levels and printer status in a single tile",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-printer-tile": HorosPrinterTile;
  }
}
