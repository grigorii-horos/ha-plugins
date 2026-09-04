import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { stripDeviceName } from "../core/labels";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

/** Порядок ролей во вторичной строке. */
export const AIR_ROLES = ["pm25", "humidity", "temperature", "power"] as const;

export type AirRole = (typeof AIR_ROLES)[number];

export interface AirTileConfig extends TileBaseConfig {
  type: string;
  /** Сам прибор: fan, humidifier или switch. Тап по иконке его переключает. */
  appliance: string;
  pm25?: string;
  humidity?: string;
  temperature?: string;
  power?: string;
  /** Что ещё сказать: скорость, режим. */
  sensors?: (CartridgeConfig | string)[];
  /** Сообщать, только когда сработало: пора менять фильтр. */
  alerts?: (CartridgeConfig | string)[];
  /** Что показать крупно справа. По умолчанию PM2.5. */
  big_values?: AirRole[];
}

/**
 * Приборы, которые занимаются воздухом: очиститель, рекуператор, увлажнитель,
 * осушитель. У всех разный домен, но вопрос один — работает ли и что с
 * воздухом.
 *
 * Прибор задаётся одной ролью `appliance` любого домена, поэтому карточка
 * годится и для `fan`, и для `humidifier`, и для розетки, к которой прибор
 * просто подключён.
 */
@customElement("horos-air-tile")
export class HorosAirTile extends BaseTileCard {
  @state() private _config?: AirTileConfig;

  private _bigKeys: string[] = ["pm25"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/air-tile-editor");
    return document.createElement("horos-air-tile-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<AirTileConfig> {
    return { appliance: "" };
  }

  public setConfig(config: AirTileConfig): void {
    if (!config.appliance) {
      throw new Error("Нужно указать прибор (appliance)");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "pm25", AIR_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const appliance = resolveRole(this.hass, config.appliance);
    const roles: KeyedRole[] = AIR_ROLES.map((key) => {
      const role = resolveRole(this.hass, config[key]);
      // Выключенный очиститель IKEA отдаёт PM2.5 равным -1. Концентрация не
      // бывает отрицательной, поэтому это не «ноль», а «нет данных», и
      // выносить такую цифру заголовком карточки нельзя.
      if (key === "pm25") {
        const value = numericState(role);
        if (value !== undefined && value < 0) return { key, role: undefined };
      }
      return { key, role };
    });
    const extras = (config.sensors ?? [])
      .map((raw) => normalizeCartridge(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([
      appliance,
      ...roles.map((item) => item.role),
      ...extras,
    ]);
    if (warning) return this.renderWarning(warning);

    const alerts = (config.alerts ?? [])
      .map((raw) => normalizeCartridge(raw))
      .map((alert) => ({ alert, role: resolveRole(this.hass, alert.entity) }))
      .filter(({ role }) => role?.stateObj?.state === "on")
      .map(({ alert, role }) => ({
        text:
          alert.name ??
          stripDeviceName(
            role?.stateObj?.attributes.friendly_name,
            config.name
          ) ??
          alert.entity,
        entityId: alert.entity,
      }));

    const { big, rest } = splitRoles(roles, this._bigKeys);

    return this.renderTile({
      icon: config.humidity ? "mdi:air-humidifier" : "mdi:air-filter",
      color: tileColor(appliance?.stateObj),
      primary:
        config.name ??
        appliance?.stateObj?.attributes.friendly_name ??
        "Воздух",
      mainEntityId: appliance?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, appliance),
        ...alerts,
        roleSegment(this.hass, appliance),
        ...extras.map((extra) => roleSegment(this.hass, extra)),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      values: this.bigValues(big),
    });
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-air-tile",
  name: "Воздух",
  description: "Очиститель, рекуператор, увлажнитель — прибор и что с воздухом",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-air-tile": HorosAirTile;
  }
}
