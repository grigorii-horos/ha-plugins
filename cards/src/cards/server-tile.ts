import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

/** The order of roles in the secondary line. */
export const SERVER_ROLES = ["disk", "download", "upload"] as const;

export type ServerRole = (typeof SERVER_ROLES)[number];

export interface ServerTileConfig extends TileBaseConfig {
  type: string;
  /** Whether the server is alive: any entity whose state is worth seeing first. */
  status?: string;
  disk?: string;
  download?: string;
  upload?: string;
  /** What else to say on the second line: locks, torrents, synchronisation. */
  services?: (EntityItem | string)[];
  /** What to show large on the right. Free space by default. */
  big_values?: ServerRole[];
}

/**
 * A home server: disk space, throughput and the state of services in a single
 * tile instead of three integrations scattered across the dashboard.
 */
export class HorosServerTile extends BaseTileCard {
  @state() private _config?: ServerTileConfig;

  private _bigKeys: string[] = ["disk"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/server-tile-editor");
    return document.createElement(
      "horos-server-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<ServerTileConfig> {
    return { disk: "" };
  }

  public setConfig(config: ServerTileConfig): void {
    if (!config.disk && !config.download && !config.status) {
      throw new Error(
        "At least one entity is required: status, disk or download"
      );
    }
    this._bigKeys = resolveBigKeys(config.big_values, "disk", SERVER_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles: KeyedRole[] = SERVER_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));
    const status = resolveRole(this.hass, config.status);
    const services = (config.services ?? [])
      .map((raw) => normalizeItem(raw))
      .map((service) => resolveRole(this.hass, service.entity));

    const warning = this.missingRolesWarning([
      status,
      ...roles.map((item) => item.role),
      ...services,
    ]);
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);

    return this.renderTile({
      icon: "mdi:server",
      color: status ? tileColor(status.stateObj) : "var(--state-icon-color)",
      primary: config.name ?? t(this.hass, "server.title"),
      mainEntityId: status?.entityId ?? roles[0].role?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, status),
        this.mainStateSegment(status),
        ...rest.map((item) => {
          const segment = roleSegment(this.hass, item.role);
          if (!segment) return undefined;
          // Download and upload are often both zero and unlabelled they blur together.
          const mark =
            item.key === "download" ? "↓ " : item.key === "upload" ? "↑ " : "";
          return { ...segment, text: mark + segment.text };
        }),
        ...services.map((service) => roleSegment(this.hass, service)),
      ]),
      values: this.bigValues(big),
    });
  }
}

registerCard("horos-server-tile", HorosServerTile, {
  type: "horos-server-tile",
  name: { ru: "Домашний сервер", en: "Home server" },
  description: {
    ru: "Диск, скорости и состояние сервисов в одной плитке",
    en: "Disk, speeds and service status in a single tile",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-server-tile": HorosServerTile;
  }
}
