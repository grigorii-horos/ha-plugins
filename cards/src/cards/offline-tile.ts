import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments } from "../core/format";
import { findOffline, type OfflineGroup } from "../core/offline";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

export interface OfflineTileConfig extends TileBaseConfig {
  type: string;
  /** How many devices to name explicitly. */
  limit?: number;
  /** Entities whose silence is normal. */
  ignore?: string[];
  /** Domains not counted at all. Unset means the service ones. */
  ignore_domains?: string[];
}

export const DEFAULT_OFFLINE_LIMIT = 4;

/**
 * What in the house stopped responding.
 *
 * A recurring theme: the gas sensor was silent for months, four power meters
 * turned up by accident, lamps and air conditioners while going through the
 * devices. A broken device's silence is indistinguishable from a healthy one's.
 *
 * The one card that walks the states itself: listing nine hundred entities by
 * hand is not possible, and the selection rule is objective.
 */
export class HorosOfflineTile extends BaseTileCard {
  @state() private _config?: OfflineTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/offline-tile-editor");
    return document.createElement(
      "horos-offline-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<OfflineTileConfig> {
    return {};
  }

  public setConfig(config: OfflineTileConfig): void {
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const groups: OfflineGroup[] = findOffline(this.hass, {
      ignore: config.ignore,
      ignoreDomains: config.ignore_domains,
    });

    const limit = config.limit ?? DEFAULT_OFFLINE_LIMIT;
    const named = groups.slice(0, limit);
    const rest = groups.length - named.length;

    return this.renderTile({
      icon: groups.length ? "mdi:lan-disconnect" : "mdi:lan-check",
      color: groups.length
        ? "var(--warning-color, #ffa600)"
        : "var(--success-color, #43a047)",
      primary: config.name ?? t(this.hass, "offline.title"),
      mainEntityId: groups[0]?.entityId,
      secondary: composeSegments(
        groups.length
          ? [
              ...named.map((group) => ({
                text:
                  group.count > 1 ? `${group.name} (${group.count})` : group.name,
                entityId: group.entityId,
              })),
              rest > 0 ? { text: t(this.hass, "offline.more", { count: rest }) } : undefined,
            ]
          : [{ text: t(this.hass, "offline.allAnswer") }]
      ),
      values: groups.length
        ? [
            {
              value: String(groups.length),
              entityId: groups[0]?.entityId,
              icon: "mdi:devices",
            },
          ]
        : [],
    });
  }
}

registerCard("horos-offline-tile", HorosOfflineTile, {
  type: "horos-offline-tile",
  name: { ru: "Не отвечает", en: "Not responding" },
  description: {
    ru: "Что перестало отвечать, посчитанное по устройствам",
    en: "Devices that went silent, grouped by device",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-offline-tile": HorosOfflineTile;
  }
}
