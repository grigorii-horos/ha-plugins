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
  /** Датчики присутствия по зонам. */
  areas: (EntityItem | string)[];
}

/**
 * Присутствие по зонам.
 *
 * Карточка называет только занятые зоны — их обычно одна-две, а список всех
 * восьми читать незачем. Потерявшие связь считаются отдельно: зона, о которой
 * нечего сказать, и пустая зона — разные вещи.
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
      throw new Error("Нужно указать хотя бы одну зону (areas)");
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
  name: "Presence",
  description: "Which areas have someone in them right now",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-presence-tile": HorosPresenceTile;
  }
}
