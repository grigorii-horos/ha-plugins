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
} from "../core/format";
import { levelColor } from "../core/labels";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

/** Порядок ролей во вторичной строке. */
export const COVER_ROLES = ["illuminance", "battery"] as const;

export type CoverRole = (typeof COVER_ROLES)[number];

/** Биты supported_features домена cover. */
const COVER_OPEN = 1;
const COVER_CLOSE = 2;
const COVER_SET_POSITION = 4;

export interface CoverTileConfig extends TileBaseConfig {
  type: string;
  cover: string;
  /**
   * Отдельный сенсор положения. Нужен только тем шторам, которые не умеют
   * задавать положение сами: у остальных его показывает штатный слайдер.
   */
  position?: string;
  /** Кнопки открыть/закрыть и слайдер положения. По умолчанию включены. */
  controls?: boolean;
  illuminance?: string;
  battery?: string;
  /** Что показать крупно справа. По умолчанию освещённость. */
  big_values?: CoverRole[];
}

/**
 * Шторы: открыть, закрыть, задать положение прямо с карточки.
 *
 * Управление — штатные features HA (`cover-open-close`, `cover-position`),
 * своих кнопок не рисуем. Набор подбирается по `supported_features` самой
 * шторы: слайдер положения предлагается только той, что умеет его задавать.
 *
 * Своя полоса положения остаётся лишь для штор без такого умения — у
 * остальных её работу делает слайдер, и рисовать обе значит показать одно и
 * то же дважды.
 */
export class HorosCoverTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: CoverTileConfig;

  /** Строки уровней под плиткой: примерно две на одну строку сетки. */
  protected override contentRows(): number {
    return Math.ceil((2) / 2);
  }

  private _bigKeys: string[] = ["illuminance"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/cover-tile-editor");
    return document.createElement(
      "horos-cover-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<CoverTileConfig> {
    return { cover: "" };
  }

  public setConfig(config: CoverTileConfig): void {
    if (!config.cover) {
      throw new Error("Нужно указать штору (cover)");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "illuminance", COVER_ROLES);
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const cover = resolveRole(this.hass, config.cover);
    const position = resolveRole(this.hass, config.position);
    const roles: KeyedRole[] = COVER_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const warning = this.missingRolesWarning([
      cover,
      position,
      ...roles.map((item) => item.role),
    ]);
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);

    const supported = Number(
      cover?.stateObj?.attributes.supported_features ?? 0
    );
    const canSetPosition = (supported & COVER_SET_POSITION) !== 0;
    const canOpenClose = (supported & (COVER_OPEN | COVER_CLOSE)) !== 0;

    const controls: Record<string, unknown>[] = [];
    if (config.controls !== false) {
      if (canSetPosition) controls.push({ type: "cover-position" });
      if (canOpenClose) controls.push({ type: "cover-open-close" });
    }

    // Своя полоса нужна только там, где слайдера не будет.
    const open = numericState(position);
    const levels: LevelRow[] =
      position && !canSetPosition
        ? [
            {
              entityId: position.entityId,
              name: t(this.hass, "level.open"),
              text:
                open === undefined
                  ? t(this.hass, "value.unknown")
                  : `${Math.round(open)}%`,
              ink: levelColor(open),
              level: open ?? 0,
            },
          ]
        : [];

    return this.renderTile({
      icon: "mdi:curtains",
      color: tileColor(cover?.stateObj),
      primary:
        config.name ?? cover?.stateObj?.attributes.friendly_name ?? t(this.hass, "cover.title"),
      mainEntityId: cover?.entityId,
      secondary: composeSegments([
        unavailableSegment(this.hass, cover),
        roleSegment(this.hass, cover),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      values: this.bigValues(big),
      ownFeatures: controls.length ? controls : undefined,
      customFeatures: levels.length
        ? renderLevels(levels, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-cover-tile", HorosCoverTile, {
  type: "horos-cover-tile",
  name: "Curtains",
  description: "How far open, how bright outside, and battery",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-cover-tile": HorosCoverTile;
  }
}
