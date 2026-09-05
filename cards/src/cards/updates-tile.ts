import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments } from "../core/format";
import { findUpdates, type UpdateItem } from "../core/updates";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";
import { ROLE_ICONS } from "../core/role-icons";
import { suggestion } from "../core/suggest";

/** How many are named before the line turns into "and N more". */
const DEFAULT_UPDATES_LIMIT = 4;

export interface UpdatesTileConfig extends TileBaseConfig {
  type: string;
  /** How many to name explicitly. */
  limit?: number;
  /** Updates that are not going to be installed and need not be counted. */
  ignore?: string[];
  /** Count the versions the owner has skipped as well. Off by default. */
  include_skipped?: boolean;
}

/**
 * What in the house asks to be updated.
 *
 * Home Assistant scatters `update` entities across every integration and add-on
 * it has, and each one is a tile saying "nothing to do" on a good day. One tile
 * answering for all of them is the whole point.
 *
 * Nothing is listed in the config: the rule is objective, an `update` entity
 * that is `on`. Skipped versions stay out unless asked for — an update already
 * waved away is not news.
 */
export class HorosUpdatesTile extends BaseTileCard {
  @state() private _config?: UpdatesTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/updates-tile-editor");
    return document.createElement(
      "horos-updates-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<UpdatesTileConfig> {
    return {};
  }

  public setConfig(config: UpdatesTileConfig): void {
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const all: UpdateItem[] = findUpdates(this.hass, { ignore: config.ignore });
    const pending = config.include_skipped
      ? all
      : all.filter((item) => !item.skipped);

    const limit = config.limit ?? DEFAULT_UPDATES_LIMIT;
    const named = pending.slice(0, limit);
    const rest = pending.length - named.length;

    return this.renderTile({
      icon: pending.length ? "mdi:package-up" : "mdi:package-variant-closed-check",
      color: pending.length
        ? "var(--info-color, #2196f3)"
        : "var(--success-color, #43a047)",
      primary: config.name ?? t(this.hass, "updates.title"),
      mainEntityId: pending[0]?.entityId,
      secondary: composeSegments(
        pending.length
          ? [
              ...named.map((item) => ({
                text: item.version ? `${item.name} ${item.version}` : item.name,
                entityId: item.entityId,
              })),
              rest > 0
                ? { text: t(this.hass, "offline.more", { count: rest }) }
                : undefined,
            ]
          : [{ text: t(this.hass, "updates.upToDate") }]
      ),
      values: pending.length
        ? [
            {
              value: String(pending.length),
              entityId: pending[0]?.entityId,
              icon: ROLE_ICONS.updates,
            },
          ]
        : [],
    });
  }
}

registerCard("horos-updates-tile", HorosUpdatesTile, {
  type: "horos-updates-tile",
  name: { ru: "Обновления", en: "Updates" },
  description: {
    ru: "Что в доме просит обновления, одной плиткой вместо тридцати",
    en: "What in the house asks to be updated, one tile instead of thirty",
  },
  preview: true,
  suggest: (_hass, entityId) => {
    // Any update entity leads to the card that speaks for all of them.
    if (!entityId.startsWith("update.")) return null;
    return suggestion("custom:horos-updates-tile", {});
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-updates-tile": HorosUpdatesTile;
  }
}
