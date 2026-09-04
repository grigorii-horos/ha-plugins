import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
  type ResolvedRole,
} from "../core/format";
import { levelColor, loadColor, stripDeviceName } from "../core/labels";
import { pickExtreme } from "../core/reduce";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

/** Порядок ролей во вторичной строке. */
export const COMPUTER_ROLES = [
  "temperature",
  "cpu",
  "memory",
  "gpu",
  "disk",
] as const;

export type ComputerRole = (typeof COMPUTER_ROLES)[number];

export interface ComputerTileConfig extends TileBaseConfig {
  type: string;
  /** Жив ли компьютер: lwt, device_tracker, что угодно с состоянием. */
  status?: string;
  cpu?: string;
  memory?: string;
  gpu?: string;
  /** Все датчики температуры. Показывается самый горячий. */
  temperatures?: string[];
  /** Разделы диска в процентах занятого. Показывается самый заполненный. */
  disks?: string[];
  /**
   * Разделы диска в процентах **свободного** — так отдаёт, например,
   * приложение HA для macOS. Показывается тот, где свободного меньше всего.
   * Отдельная роль, а не та же самая: перепутать «занято» и «свободно» — это
   * молча показать 32% там, где на самом деле 68%.
   */
  disks_free?: string[];
  /** Что ещё сказать во второй строке: кто за компом, что играет. */
  sensors?: (CartridgeConfig | string)[];
  /** Бинарные сенсоры, о которых стоит сказать, только когда они сработали. */
  alerts?: (CartridgeConfig | string)[];
  /** Что показать крупно справа. По умолчанию температура. */
  big_values?: ComputerRole[];
}

/**
 * Компьютер.
 *
 * Ценность не в том, чтобы показать двенадцать датчиков температуры и три
 * раздела диска, а в том, чтобы свести их к одному числу: насколько горячо и
 * насколько забито. Крайний датчик становится обычной ролью, поэтому тап по
 * значению открывает именно тот, который сейчас крайний.
 *
 * Загрузка показана колбами — тем же приёмом, что чернила и расходники, но
 * цвет обратный: у нагрузки высокий уровень это плохо.
 */
@customElement("horos-computer-tile")
export class HorosComputerTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: ComputerTileConfig;

  private _bigKeys: string[] = ["temperature"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/computer-tile-editor");
    return document.createElement(
      "horos-computer-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<ComputerTileConfig> {
    return { cpu: "" };
  }

  public setConfig(config: ComputerTileConfig): void {
    if (
      !config.cpu &&
      !config.memory &&
      !config.temperatures?.length &&
      !config.disks?.length &&
      !config.disks_free?.length
    ) {
      throw new Error(
        "Нужна хотя бы одна сущность: cpu, memory, temperatures или disks"
      );
    }
    this._bigKeys = resolveBigKeys(
      config.big_values,
      "temperature",
      COMPUTER_ROLES
    );
    this.base = config;
    this._config = config;
  }

  /** Роли карточки: списки уже сведены к крайнему датчику. */
  private _roles(): KeyedRole[] {
    const config = this._config!;
    return [
      {
        key: "temperature",
        role: pickExtreme(this.hass, config.temperatures, "max"),
      },
      { key: "cpu", role: resolveRole(this.hass, config.cpu) },
      { key: "memory", role: resolveRole(this.hass, config.memory) },
      { key: "gpu", role: resolveRole(this.hass, config.gpu) },
      { key: "disk", role: pickExtreme(this.hass, config.disks, "max") },
    ];
  }

  /** Раздел с наименьшим запасом свободного места. */
  private _freeDisk(): ResolvedRole | undefined {
    return pickExtreme(this.hass, this._config?.disks_free, "min");
  }

  private _levelRow(
    name: string,
    role: ResolvedRole | undefined
  ): LevelRow | undefined {
    if (!role) return undefined;
    const level = numericState(role);
    return {
      entityId: role.entityId,
      name,
      text: level === undefined ? "нет данных" : `${Math.round(level)}%`,
      ink: loadColor(level),
      level: level ?? 0,
      alarm: level !== undefined && level >= 90,
      alarmIcon: "mdi:alert-circle",
    };
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles = this._roles();
    const status = resolveRole(this.hass, config.status);
    const extras = (config.sensors ?? [])
      .map((raw) => normalizeCartridge(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([
      status,
      ...roles.map((item) => item.role),
      ...extras,
    ]);
    if (warning) return this.renderWarning(warning);

    // О перезагрузке и обновлениях говорим, только когда они действительно нужны.
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

    const { big } = splitRoles(roles, this._bigKeys);

    const freeDisk = this._freeDisk();
    const freeLevel = numericState(freeDisk);

    const levels = [
      this._levelRow("CPU", roles[1].role),
      this._levelRow("Память", roles[2].role),
      this._levelRow("GPU", roles[3].role),
      this._levelRow("Диск", roles[4].role),
      // Свободное место — ресурс, который кончается, поэтому и цвет, и тревога
      // здесь как у батарейки, а не как у загрузки.
      freeDisk
        ? {
            entityId: freeDisk.entityId,
            name: "Свободно",
            text: freeLevel === undefined ? "нет данных" : `${Math.round(freeLevel)}%`,
            ink: levelColor(freeLevel),
            level: freeLevel ?? 0,
            alarm: freeLevel !== undefined && freeLevel < 10,
            alarmIcon: "mdi:harddisk",
          }
        : undefined,
    ].filter((row): row is LevelRow => !!row);

    return this.renderTile({
      icon: "mdi:desktop-tower-monitor",
      color: status ? tileColor(status.stateObj) : "var(--state-icon-color)",
      primary: config.name ?? "Компьютер",
      mainEntityId:
        status?.entityId ?? roles[0].role?.entityId ?? freeDisk?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, status),
        ...alerts,
        ...extras.map((extra) => roleSegment(this.hass, extra)),
        // Загрузка и диски уже показаны полосами со своими подписями.
        ...(this._bigKeys.includes("temperature")
          ? []
          : [roleSegment(this.hass, roles[0].role)]),
      ]),
      values: this.bigValues(big),
      customFeatures: levels.length
        ? renderLevels(levels, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-computer-tile",
  name: "Компьютер",
  description: "Самая горячая точка, загрузка и диски одной плиткой",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-computer-tile": HorosComputerTile;
  }
}
