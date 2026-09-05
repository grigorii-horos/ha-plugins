import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments, resolveRole, type Segment } from "../core/format";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

export interface PresenceTileConfig extends TileBaseConfig {
  type: string;
  /** Presence sensors, one per area. */
  areas: (EntityItem | string)[];
}

/**
 * Presence by area.
 *
 * The card names only the occupied areas — usually one or two — instead of
 * listing all eight. The ones that lost connection are counted separately: an
 * area with nothing to say and an empty area are different things.
 */
export class HorosPresenceTile extends BaseTileCard {
  @state() private _config?: PresenceTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/presence-tile-editor");
    return document.createElement(
      "horos-presence-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PresenceTileConfig> {
    return { areas: [] };
  }

  public setConfig(config: PresenceTileConfig): void {
    if (!config.areas?.length) {
      throw new Error("At least one area is required (areas)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const occupied: Segment[] = [];
    const missing: string[] = [];
    let offline = 0;
    let total = 0;

    for (const raw of config.areas) {
      const area = normalizeItem(raw);
      const role = resolveRole(this.hass, area.entity);
      if (role?.missing) {
        missing.push(area.entity);
        continue;
      }
      total += 1;
      if (role?.unavailable) {
        offline += 1;
        continue;
      }
      if (role?.stateObj?.state === "on") {
        occupied.push({
          text:
            area.name ??
            role.stateObj.attributes.friendly_name ??
            area.entity,
          entityId: area.entity,
        });
      }
    }

    return this.renderTile({
      icon: occupied.length ? "mdi:home-account" : "mdi:home-outline",
      color: occupied.length
        ? "var(--state-icon-color)"
        : "var(--state-inactive-color)",
      primary: config.name ?? t(this.hass, "presence.title"),
      mainEntityId: occupied[0]?.entityId,
      secondary: composeSegments([
        ...(occupied.length ? occupied : [{ text: t(this.hass, "presence.empty", { count: total }) }]),
        offline
          ? { text: t(this.hass, "offline.count", { count: offline }) }
          : undefined,
        missing.length
          ? { text: t(this.hass, "list.missing", { count: missing.length }) }
          : undefined,
      ]),
      values: [
        {
          value: String(occupied.length),
          entityId: occupied[0]?.entityId,
          icon: "mdi:home-account",
        },
      ],
    });
  }
}

registerCard("horos-presence-tile", HorosPresenceTile, {
  type: "horos-presence-tile",
  name: { ru: "Присутствие", en: "Presence" },
  description: {
    ru: "В каких зонах сейчас есть кто-то",
    en: "Which areas have someone in them right now",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-presence-tile": HorosPresenceTile;
  }
}
