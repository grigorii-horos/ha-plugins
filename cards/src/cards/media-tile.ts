import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  resolveRole,
  unavailableSegment,
  type ResolvedRole,
} from "../core/format";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";
import { ROLE_ICONS } from "../core/role-icons";
import { areaOf, sameArea, suggestion } from "../core/suggest";

/** States in which a player is worth talking about. */
const BUSY = ["playing", "paused", "buffering"];

export interface MediaTileConfig extends TileBaseConfig {
  type: string;
  players: (EntityItem | string)[];
  /** @deprecated Removed in the Features panel instead. */
  controls?: boolean;
}

/**
 * The playback buttons, as the card's default feature: stock markup, switched
 * off by removing it in the editor's Features panel.
 */
export function mediaFeatures(
  config: MediaTileConfig | undefined
): Record<string, unknown>[] {
  // `controls: false` is how this used to be switched off; a config that still
  // says it keeps working.
  if (!config || config.controls === false) return [];
  return [{ type: "media-player-playback" }];
}

/**
 * The media players of the house in one tile.
 *
 * The stock media-control card is about one player and takes half a screen.
 * The question this card answers is different and smaller: is anything playing
 * in the house, what, and how loud. Whoever is playing takes the line — and the
 * controls, because that is the player you reach for.
 *
 * Volume fills the bar of every row: it is the one number a media player has
 * that a bar can honestly show.
 */
export class HorosMediaTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: MediaTileConfig;

  protected override contentRows(): number {
    return this.levelRows(this._config?.players.length ?? 0) + this.fixedRows();
  }

  protected override fixedRows(): number {
    return this.featureRows(mediaFeatures(this._config).length);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/media-tile-editor");
    return document.createElement(
      "horos-media-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<MediaTileConfig> {
    return { players: [] };
  }

  public setConfig(config: MediaTileConfig): void {
    if (!config.players?.length) {
      throw new Error("At least one player is required (players)");
    }
    this.base = config;
    this._config = config;
  }

  /** Volume in per cent; HA keeps it as 0..1. */
  private _volume(role: ResolvedRole | undefined): number | undefined {
    const raw = role?.stateObj?.attributes.volume_level as number | undefined;
    return raw === undefined ? undefined : Math.round(raw * 100);
  }

  /** What is playing: the title, or whatever the player can name instead. */
  private _title(role: ResolvedRole | undefined): string | undefined {
    const attrs = role?.stateObj?.attributes;
    if (!attrs) return undefined;
    return (
      (attrs.media_title as string | undefined) ??
      (attrs.app_name as string | undefined) ??
      (attrs.source as string | undefined)
    );
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const players = config.players
      .map((raw) => normalizeItem(raw))
      .map((item) => ({ item, role: resolveRole(this.hass, item.entity) }));

    const warning = this.missingRolesWarning(players.map((p) => p.role));
    if (warning) return this.renderWarning(warning);

    const busy = players.filter((p) =>
      BUSY.includes(p.role?.stateObj?.state ?? "")
    );
    // The one that is playing owns the line; failing that, the first listed.
    const main = busy[0] ?? players[0];
    const volume = this._volume(main.role);

    const rows: LevelRow[] = players.map(({ item, role }) => {
      const level = this._volume(role);
      const active = BUSY.includes(role?.stateObj?.state ?? "");
      return {
        entityId: item.entity,
        name: item.name ?? role?.stateObj?.attributes.friendly_name ?? item.entity,
        // The state, not the title: a row is a bar with a word at the end, and
        // a track name is a sentence — it pushed the volume bar off the card.
        // What is playing is named once, in the line above.
        text:
          role?.stateObj && this.hass
            ? this.hass.formatEntityState(role.stateObj)
            : t(this.hass, "value.unknown"),
        ink: item.color ?? tileColor(role?.stateObj),
        level: active ? (level ?? 0) : 0,
      };
    });

    return this.renderTile({
      icon: "mdi:play-box-multiple",
      color: tileColor(main.role?.stateObj),
      primary:
        config.name ??
        main.role?.stateObj?.attributes.friendly_name ??
        t(this.hass, "media.title"),
      mainEntityId: main.role?.entityId,
      defaultIconAction: defaultIconAction(main.role?.entityId),
      secondary: composeSegments([
        unavailableSegment(this.hass, main.role),
        {
          text: busy.length
            ? (this._title(main.role) ??
              t(this.hass, "media.playing", { count: busy.length }))
            : t(this.hass, "media.idle"),
          entityId: main.role?.entityId,
        },
      ]),
      values:
        volume === undefined
          ? []
          : [
              {
                value: String(volume),
                unit: "%",
                entityId: main.role?.entityId,
                icon: ROLE_ICONS.volume,
              },
            ],
      ownFeatures: mediaFeatures(config),
      customFeatures:
        players.length > 1
          ? renderLevels(rows, (entityId) => this.fireMoreInfo(entityId))
          : undefined,
    });
  }
}

registerCard("horos-media-tile", HorosMediaTile, {
  type: "horos-media-tile",
  name: { ru: "Медиа", en: "Media" },
  description: {
    ru: "Что играет в доме, где и насколько громко",
    en: "What is playing in the house, where, and how loud",
  },
  preview: true,
  suggest: (hass, entityId) => {
    if (!areaOf(hass, entityId)) return null;
    const players = sameArea(hass, entityId, "media_player");
    // One player is the stock media-control card's job.
    if (players.length < 2) return null;
    return suggestion("custom:horos-media-tile", {}, { players });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-media-tile": HorosMediaTile;
  }
}
