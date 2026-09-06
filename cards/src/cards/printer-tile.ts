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

/** The internal shape of one cartridge before rendering. */
interface PrinterTank {
  entityId: string;
  name?: string;
  ink: string;
  marker?: MarkerReading;
  text: string;
}
import type { HassEntity, LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { devicePool, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";
import { t } from "../core/i18n";

export interface PrinterTileConfig extends TileBaseConfig {
  type: string;
  /** The printer state entity: printing, idle, error. */
  status?: string;
  /** Ink level sensors. */
  cartridges: (EntityItem | string)[];
  /** Anything else about the printer: uptime, page counter, errors. */
  sensors?: (EntityItem | string)[];
  /**
   * A custom "ink low" threshold. Unset means the printer's own
   * marker_low_level is used. It does not affect the waste ink absorber: its
   * alarm is the other way round, when it is full.
   */
  low_below?: number;
}

/**
 * A printer as an ordinary tile: a line with the name and state, and below it
 * one features line with the ink levels.
 *
 * The level is drawn as bars rather than one strip: the Canon G series is a tank
 * printer, its transparent tanks sit on the front in exactly such a row. The
 * features line is that row, each tank filled from the bottom with its own ink.
 *
 * The large value on the right is the ink closest to running out — the thing a
 * printer is looked at for at all: is it time to buy more.
 */
export class HorosPrinterTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: PrinterTileConfig;

  /** Level rows under the tile: roughly two per grid row. */
  protected override contentRows(): number {
    return (
      this.levelRows(
        (this._config?.cartridges.length ?? 0) +
          (this._config?.sensors?.length ?? 0)
      ) + this.fixedRows()
    );
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
      throw new Error("At least one cartridge is required (cartridges)");
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
        `Entities not found: ${missing.map((t) => t.entityId).join(", ")}`
      );
    }

    // Large: the consumable ink closest to running out — the reason for looking.
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
  suggest: (hass, entityId) => {
    const pool = devicePool(hass, entityId);
    // A printer marker announces itself: IPP puts marker_type in the attributes.
    const cartridges = pool.filter(
      (id) => hass.states[id]?.attributes.marker_type !== undefined
    );
    if (!cartridges.length) return null;
    const status = pool.find(
      (id) =>
        computeDomain(id) === "sensor" &&
        !cartridges.includes(id) &&
        Number.isNaN(Number(hass.states[id]?.state))
    );
    return suggestion(
      "custom:horos-printer-tile",
      { status },
      { cartridges }
    );
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-printer-tile": HorosPrinterTile;
  }
}
