import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments, resolveRole, type Segment } from "../core/format";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

export interface PresenceTileConfig extends TileBaseConfig {
  type: string;
  /** Датчики присутствия по зонам. */
  areas: (CartridgeConfig | string)[];
}

/**
 * Присутствие по зонам.
 *
 * Карточка называет только занятые зоны — их обычно одна-две, а список всех
 * восьми читать незачем. Потерявшие связь считаются отдельно: зона, о которой
 * нечего сказать, и пустая зона — разные вещи.
 */
@customElement("horos-presence-tile")
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
      const area = normalizeCartridge(raw);
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

    if (missing.length) {
      return this.renderWarning(`Сущности не найдены: ${missing.join(", ")}`);
    }

    return this.renderTile({
      icon: occupied.length ? "mdi:home-account" : "mdi:home-outline",
      color: occupied.length
        ? "var(--state-icon-color)"
        : "var(--state-inactive-color)",
      primary: config.name ?? "Присутствие",
      mainEntityId: occupied[0]?.entityId,
      secondary: composeSegments([
        ...(occupied.length ? occupied : [{ text: `Пусто, ${total} зон` }]),
        offline ? { text: `${offline} без связи` } : undefined,
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

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-presence-tile",
  name: "Присутствие",
  description: "В каких зонах сейчас есть кто-то",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-presence-tile": HorosPresenceTile;
  }
}
