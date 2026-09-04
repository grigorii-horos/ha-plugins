import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  cardName,
  composeSegments,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";

/** Порядок ролей во вторичной строке. Выключатель идёт первым. */
export const PLUG_ROLES = ["switch", "power", "energy"] as const;

export type PlugRole = (typeof PLUG_ROLES)[number];

export interface PlugTileConfig extends TileBaseConfig {
  type: string;
  switch: string;
  power?: string;
  energy?: string;
  toggle_button?: boolean;
  /** Что показать крупно справа. По умолчанию одна мощность. */
  big_values?: PlugRole[];
}

/**
 * Умная розетка. Мощность — крупным значением справа, во вторичной строке
 * состояние выключателя и накопленная энергия. Тап по иконке переключает.
 */
@customElement("horos-plug-tile")
export class HorosPlugTile extends BaseTileCard {
  @state() private _config?: PlugTileConfig;

  private _bigKeys: string[] = ["power"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/plug-tile-editor");
    return document.createElement("horos-plug-tile-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PlugTileConfig> {
    return { switch: "", power: "" };
  }

  public setConfig(config: PlugTileConfig): void {
    if (!config.switch) {
      throw new Error("Нужно указать выключатель (switch)");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "power", PLUG_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles: KeyedRole[] = PLUG_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const warning = this.missingRolesWarning(roles.map((item) => item.role));
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);
    const sw = roles[0].role!;
    const entityId = sw.entityId;

    return this.renderTile({
      icon: "mdi:power-plug",
      color: tileColor(sw.stateObj),
      primary: cardName(config.name, sw),
      secondary: composeSegments([
        // Одна из двух вернёт кусок: доступный выключатель даёт своё
        // состояние, недоступный — статус недоступности.
        unavailableSegment(this.hass, sw),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      mainEntityId: entityId,
      imageUrl: this.entityImage(sw.stateObj),
      defaultIconAction: defaultIconAction(entityId),
      values: this.bigValues(big),
      // Кнопка — штатная feature HA, своей вёрстки для неё больше нет.
      ownFeatures: config.toggle_button ? [{ type: "toggle" }] : undefined,
    });
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-plug-tile",
  name: "Розетка с потреблением",
  description: "Выключатель, текущая мощность и накопленная энергия в одной плитке",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-plug-tile": HorosPlugTile;
  }
}
