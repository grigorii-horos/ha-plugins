import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import {
  levelColor,
  stripBatterySuffix,
  stripDeviceName,
} from "../core/labels";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

export interface PersonTileConfig extends TileBaseConfig {
  type: string;
  /** person или device_tracker — кто это и дома ли он. */
  person: string;
  /** Заряд основного устройства, он идёт крупно. */
  battery?: string;
  /** Где именно: геокодированный адрес или зона. */
  location?: string;
  /** Заряд остальных устройств: часы, планшет, читалка. */
  devices?: (CartridgeConfig | string)[];
}

/**
 * Человек: дома ли, где именно и сколько заряда на его устройствах.
 *
 * Заряды устройств показаны колбами — тем же приёмом, что расходники и
 * чернила: несколько однородных уровней, которые надо увидеть вместе.
 */
@customElement("horos-person-tile")
export class HorosPersonTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: PersonTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/person-tile-editor");
    return document.createElement(
      "horos-person-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PersonTileConfig> {
    return { person: "" };
  }

  public setConfig(config: PersonTileConfig): void {
    if (!config.person) {
      throw new Error("Нужно указать человека (person)");
    }
    // Портрет человека говорит больше безликой иконки, поэтому по умолчанию
    // показываем его, если он есть.
    this.base = { show_entity_picture: true, ...config };
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const person = resolveRole(this.hass, config.person);
    const battery = resolveRole(this.hass, config.battery);
    const location = resolveRole(this.hass, config.location);

    const warning = this.missingRolesWarning([person, battery, location]);
    if (warning) return this.renderWarning(warning);

    const devices = (config.devices ?? [])
      .map((raw) => normalizeCartridge(raw))
      .map((item) => {
        const role = resolveRole(this.hass, item.entity);
        const level = numericState(role);
        const name =
          item.name ??
          stripBatterySuffix(
            stripDeviceName(
              role?.stateObj?.attributes.friendly_name,
              config.name
            )
          ) ??
          item.entity;
        return {
          entityId: item.entity,
          name,
          text: level === undefined ? "нет данных" : `${level}%`,
          ink: item.color ?? levelColor(level),
          level: level ?? 0,
          alarm: level !== undefined && level < 20,
          alarmIcon: "mdi:battery-alert-variant-outline",
        };
      });

    return this.renderTile({
      icon: "mdi:account",
      color: tileColor(person?.stateObj),
      primary:
        config.name ?? person?.stateObj?.attributes.friendly_name ?? "Человек",
      mainEntityId: person?.entityId,
      imageUrl: this.entityImage(person?.stateObj),
      secondary: composeSegments([
        unavailableSegment(this.hass, person),
        roleSegment(this.hass, person),
        roleSegment(this.hass, location),
      ]),
      values: battery ? this.bigValues([{ key: "battery", role: battery }]) : [],
      customFeatures: devices.length
        ? renderLevels(devices, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-person-tile",
  name: "Человек",
  description: "Дома ли, где именно и заряд его устройств",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-person-tile": HorosPersonTile;
  }
}
