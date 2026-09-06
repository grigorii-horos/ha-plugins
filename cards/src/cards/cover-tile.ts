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
import { byClass, byDomain, devicePool, filled, suggestion } from "../core/suggest";
import { t } from "../core/i18n";

/** The order of roles in the secondary line. */
export const COVER_ROLES = ["illuminance", "battery"] as const;

export type CoverRole = (typeof COVER_ROLES)[number];

/** supported_features bits of the cover domain. */
const COVER_OPEN = 1;
const COVER_CLOSE = 2;
const COVER_SET_POSITION = 4;

export interface CoverTileConfig extends TileBaseConfig {
  type: string;
  cover: string;
  /**
   * A separate position sensor. Only covers that cannot set a position themselves
   * need it: on the rest the stock slider shows it.
   */
  position?: string;
  /** Open/close buttons and the position slider. On by default. */
  controls?: boolean;
  illuminance?: string;
  battery?: string;
  /** What to show large on the right. Illuminance by default. */
  big_values?: CoverRole[];
}

/**
 * Covers: open, close and set a position straight from the card.
 *
 * The controls are stock HA features (`cover-open-close`, `cover-position`); we
 * draw no buttons of our own. The set is picked from the cover's own
 * `supported_features`: the slider is only offered to a cover that can set one.
 *
 * Our own position bar is left only for covers without that ability — on the
 * rest the slider does its job, and drawing both would show the same thing
 * twice.
 */
export class HorosCoverTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: CoverTileConfig;

  /** One row for our own bar, plus whatever controls sit under it. */
  protected override contentRows(): number {
    return this.levelRows(1) + this.fixedRows();
  }

  protected override fixedRows(): number {
    return this.featureRows(this._controls().length);
  }

  /**
   * The stock controls this cover can take. A cover that cannot be sent to a
   * position gets no slider, and one that cannot be opened gets no buttons —
   * asked in one place so the height and the markup cannot disagree.
   */
  private _controls(): Record<string, unknown>[] {
    if (this._config?.controls === false) return [];
    const supported = Number(
      this.hass?.states[this._config?.cover ?? ""]?.attributes
        .supported_features ?? 0
    );
    const controls: Record<string, unknown>[] = [];
    if ((supported & COVER_SET_POSITION) !== 0) {
      controls.push({ type: "cover-position" });
    }
    if ((supported & (COVER_OPEN | COVER_CLOSE)) !== 0) {
      controls.push({ type: "cover-open-close" });
    }
    return controls;
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
      throw new Error("A cover is required (cover)");
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
    const controls = this._controls();

    // Our own bar is only needed where there will be no slider.
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
        this.mainStateSegment(cover),
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
  name: { ru: "Шторы", en: "Curtains" },
  description: {
    ru: "Насколько открыты, светло ли снаружи и сколько заряда",
    en: "How far open, how bright outside, and battery",
  },
  preview: true,
  suggest: (hass, entityId) => {
    const pool = devicePool(hass, entityId);
    const roles = {
      cover: byDomain(pool, "cover"),
      illuminance: byClass(hass, pool, "sensor", "illuminance"),
      battery: byClass(hass, pool, "sensor", "battery"),
    };
    if (!roles.cover || filled(roles) < 2) return null;
    return suggestion("custom:horos-cover-tile", roles);
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-cover-tile": HorosCoverTile;
  }
}
