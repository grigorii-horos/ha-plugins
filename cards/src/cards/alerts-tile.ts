import { nothing } from "lit";
import { state } from "lit/decorators.js";
import {
  BaseTileCard,
  cssColor,
  type TileBaseConfig,
} from "../core/base-tile-card";
import { composeSegments, resolveRole, type Segment } from "../core/format";
import { normalizeItem } from "../core/entity-item";
import { isFiring, type AlertItem } from "../core/alerts";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { allOfClass, deviceClassOf, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";
import { t } from "../core/i18n";

/** How many are named before the line turns into "and N more". */
const DEFAULT_ALERTS_LIMIT = 4;

export interface AlertsTileConfig extends TileBaseConfig {
  type: string;
  alerts: (AlertItem | string)[];
  /** How many fired alerts to name explicitly. */
  limit?: number;
  /**
   * Count an alert that lost connection as a problem of its own. On by default:
   * an alert that cannot fire is not the same as an alert that is quiet.
   */
  watch_offline?: boolean;
}

/**
 * Everything the house should only mention when it happens, in one tile.
 *
 * Several cards already carry an `alerts` role — a filter that wants changing,
 * a computer asking to reboot — because those belong next to the device they
 * are about. What was missing is the tile for the ones that belong to nothing
 * in particular, and for the case where there are five of them.
 *
 * The card is quiet by design: while nothing has fired it is a single line
 * saying how many things it is watching. That is what makes it worth a place
 * on a dashboard — a card that always shows something gets read as decoration.
 *
 * **An alert that lost connection is itself an alert.** A binary sensor that is
 * `unavailable` will not fire when the thing it watches happens, and its
 * silence looks exactly like good news.
 */
export class HorosAlertsTile extends BaseTileCard {
  @state() private _config?: AlertsTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/alerts-tile-editor");
    return document.createElement(
      "horos-alerts-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<AlertsTileConfig> {
    return { alerts: [] };
  }

  public setConfig(config: AlertsTileConfig): void {
    if (!config.alerts?.length) {
      throw new Error("At least one alert is required (alerts)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;
    const watchOffline = config.watch_offline !== false;

    const fired: Segment[] = [];
    const silent: Segment[] = [];
    const missing: string[] = [];
    let tint: string | undefined;
    let watched = 0;

    for (const raw of config.alerts) {
      const item = normalizeItem(raw) as AlertItem;
      const role = resolveRole(this.hass, item.entity);
      if (role?.missing) {
        missing.push(item.entity);
        continue;
      }
      watched += 1;
      const name =
        item.name ?? role?.stateObj?.attributes.friendly_name ?? item.entity;

      if (role?.unavailable) {
        if (watchOffline) {
          silent.push({
            text: t(this.hass, "alerts.offline", { name }),
            entityId: item.entity,
          });
        }
        continue;
      }
      if (isFiring(item, role?.stateObj?.state)) {
        fired.push({ text: name, entityId: item.entity });
        // The first alert with a colour of its own paints the tile: whoever
        // gave it a colour meant it to be recognised without reading.
        tint = tint ?? (item.color ? cssColor(item.color) : undefined);
      }
    }

    const problems = [...fired, ...silent];
    const limit = config.limit ?? DEFAULT_ALERTS_LIMIT;
    const named = problems.slice(0, limit);
    const rest = problems.length - named.length;

    return this.renderTile({
      icon: fired.length
        ? "mdi:alert"
        : silent.length
          ? "mdi:bell-off-outline"
          : "mdi:bell-check-outline",
      color:
        tint ??
        (fired.length
          ? "var(--error-color, #db4437)"
          : silent.length
            ? "var(--warning-color, #ffa600)"
            : "var(--success-color, #43a047)"),
      primary: config.name ?? t(this.hass, "alerts.title"),
      mainEntityId: problems[0]?.entityId,
      secondary: composeSegments([
        ...(problems.length
          ? named
          : [{ text: t(this.hass, "alerts.calm", { count: watched }) }]),
        rest > 0 ? { text: t(this.hass, "offline.more", { count: rest }) } : undefined,
        ...(missing.length
          ? [{ text: t(this.hass, "list.missing", { count: missing.length }) }]
          : []),
      ]),
      values: fired.length
        ? [
            {
              value: String(fired.length),
              entityId: fired[0]?.entityId,
              icon: "mdi:alert-outline",
            },
          ]
        : [],
    });
  }
}

registerCard("horos-alerts-tile", HorosAlertsTile, {
  type: "horos-alerts-tile",
  name: { ru: "Оповещения", en: "Alerts" },
  description: {
    ru: "Всё, о чём стоит сказать только когда оно случилось, одной плиткой",
    en: "Everything worth mentioning only once it happens, in one tile",
  },
  preview: true,
  suggest: (hass, entityId) => {
    // `problem` and `tamper` are the device classes that exist to be quiet.
    const classes = ["problem", "tamper"];
    if (
      computeDomain(entityId) !== "binary_sensor" ||
      !classes.includes(deviceClassOf(hass, entityId) ?? "")
    ) {
      return null;
    }
    return suggestion(
      "custom:horos-alerts-tile",
      {},
      { alerts: allOfClass(hass, entityId, "binary_sensor", classes) }
    );
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-alerts-tile": HorosAlertsTile;
  }
}
