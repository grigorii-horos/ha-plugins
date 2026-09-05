import { nothing } from "lit";
import { state } from "lit/decorators.js";
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
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

/** The order of roles in the secondary line. */
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
  /** Whether the computer is alive: lwt, device_tracker, anything with a state. */
  status?: string;
  cpu?: string;
  memory?: string;
  gpu?: string;
  /** Every temperature sensor. The hottest one is shown. */
  temperatures?: string[];
  /** Disk partitions as per cent used. The fullest one is shown. */
  disks?: string[];
  /**
   * Disk partitions as per cent **free** — what the HA companion app for macOS
   * reports, for one. The one with the least free space is shown. A separate role
   * rather than the same one: confusing "used" with "free" means silently showing
   * 32% where it is really 68%.
   */
  disks_free?: string[];
  /** What else to say on the second line: who is at the computer, what is playing. */
  sensors?: (EntityItem | string)[];
  /** Binary sensors worth mentioning only once they have fired. */
  alerts?: (EntityItem | string)[];
  /** What to show large on the right. Temperature by default. */
  big_values?: ComputerRole[];
}

/**
 * A computer.
 *
 * The value is not in showing twelve temperature sensors and three disk
 * partitions, but in reducing them to one number each: how hot and how full. The
 * extreme sensor becomes an ordinary role, so a tap on the value opens exactly
 * the one that is extreme right now.
 *
 * Load is drawn as bars — the same device as ink and consumables, but with the
 * colours inverted: for load a high level is the bad one.
 */
export class HorosComputerTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: ComputerTileConfig;

  /** Level rows under the tile: roughly two per grid row. */
  protected override contentRows(): number {
    return Math.ceil((4) / 2);
  }

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
        "At least one entity is required: cpu, memory, temperatures or disks"
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

  /** The card's roles: the lists are already reduced to their extreme sensor. */
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

  /** The partition with the least free space left. */
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
      text:
        level === undefined
          ? t(this.hass, "value.unknown")
          : `${Math.round(level)}%`,
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
      .map((raw) => normalizeItem(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([
      status,
      ...roles.map((item) => item.role),
      ...extras,
    ]);
    if (warning) return this.renderWarning(warning);

    // Reboots and updates are mentioned only when they actually matter.
    const alerts = (config.alerts ?? [])
      .map((raw) => normalizeItem(raw))
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
      this._levelRow(t(this.hass, "level.cpu"), roles[1].role),
      this._levelRow(t(this.hass, "level.memory"), roles[2].role),
      this._levelRow(t(this.hass, "level.gpu"), roles[3].role),
      this._levelRow(t(this.hass, "level.disk"), roles[4].role),
      // Free space is a resource that runs out, so both the colour and the alarm
      // here behave like a battery's, not like load's.
      freeDisk
        ? {
            entityId: freeDisk.entityId,
            name: t(this.hass, "level.diskFree"),
            text:
              freeLevel === undefined
                ? t(this.hass, "value.unknown")
                : `${Math.round(freeLevel)}%`,
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
      primary: config.name ?? t(this.hass, "computer.title"),
      mainEntityId:
        status?.entityId ?? roles[0].role?.entityId ?? freeDisk?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, status),
        ...alerts,
        ...extras.map((extra) => roleSegment(this.hass, extra)),
      // Load and disks are already shown as bars with their own labels.
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

registerCard("horos-computer-tile", HorosComputerTile, {
  type: "horos-computer-tile",
  name: { ru: "Компьютер", en: "Computer" },
  description: {
    ru: "Самая горячая точка, загрузка и диски в одной плитке",
    en: "Hottest spot, load and disks in a single tile",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-computer-tile": HorosComputerTile;
  }
}
