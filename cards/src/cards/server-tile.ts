import { nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { normalizeCartridge, type CartridgeConfig } from "../core/printer";
import type { LovelaceCardEditor } from "../core/types";

/** Порядок ролей во вторичной строке. */
export const SERVER_ROLES = ["disk", "download", "upload"] as const;

export type ServerRole = (typeof SERVER_ROLES)[number];

export interface ServerTileConfig extends TileBaseConfig {
  type: string;
  /** Жив ли сервер: любая сущность, чьё состояние стоит видеть первым. */
  status?: string;
  disk?: string;
  download?: string;
  upload?: string;
  /** Что ещё сказать во второй строке: блокировки, торренты, синхронизация. */
  services?: (CartridgeConfig | string)[];
  /** Что показать крупно справа. По умолчанию свободное место. */
  big_values?: ServerRole[];
}

/**
 * Домашний сервер: место на диске, скорости и состояние сервисов в одной
 * плитке вместо трёх интеграций, разбросанных по дашборду.
 */
@customElement("horos-server-tile")
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
        "Нужна хотя бы одна сущность: status, disk или download"
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
      .map((raw) => normalizeCartridge(raw))
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
      primary: config.name ?? "Домашний сервер",
      mainEntityId: status?.entityId ?? roles[0].role?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, status),
        roleSegment(this.hass, status),
        ...rest.map((item) => {
          const segment = roleSegment(this.hass, item.role);
          if (!segment) return undefined;
          // Приём и отдача часто равны нулю и без пометки неразличимы.
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

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "horos-server-tile",
  name: "Домашний сервер",
  description: "Диск, скорости и состояние сервисов в одной плитке",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-server-tile": HorosServerTile;
  }
}
