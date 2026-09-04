import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles } from "../core/levels";
import { composeSegments, resolveRole, roleSegment } from "../core/format";
import { tileColor } from "../core/state-color";
import {
  cartridgeCssColor,
  cartridgeColor,
  cartridgeLabel,
  normalizeCartridge,
  readMarker,
  type CartridgeConfig,
  type MarkerReading,
} from "../core/printer";

/** Внутреннее представление одного картриджа перед отрисовкой. */
interface PrinterTank {
  entityId: string;
  name?: string;
  ink: string;
  marker?: MarkerReading;
  text: string;
}
import type { HassEntity, LovelaceCardEditor } from "../core/types";

export interface PrinterTileConfig extends TileBaseConfig {
  type: string;
  /** Сущность состояния принтера: печатает, простаивает, ошибка. */
  status?: string;
  /** Сенсоры уровня чернил. */
  cartridges: (CartridgeConfig | string)[];
  /** Что угодно ещё про принтер: наработка, счётчик страниц, ошибки. */
  sensors?: (CartridgeConfig | string)[];
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
@customElement("horos-printer-tile")
export class HorosPrinterTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: PrinterTileConfig;

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
      .map((raw) => normalizeCartridge(raw))
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
      .map((raw) => normalizeCartridge(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const statusObj: HassEntity | undefined = status?.stateObj;

    return this.renderTile({
      icon: "mdi:printer",
      color: statusObj ? tileColor(statusObj) : "var(--state-icon-color)",
      primary: this._printerName ?? "Принтер",
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

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-printer-tile",
  name: "Принтер",
  description: "Состояние принтера и уровни чернил колбами в одной плитке",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-printer-tile": HorosPrinterTile;
  }
}
