import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  formatUnavailable,
  resolveRole,
  unavailableSegment,
  type ResolvedRole,
} from "../core/format";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import { stripDeviceName } from "../core/labels";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";
import { ROLE_ICONS } from "../core/role-icons";
import { areaOf, sameArea, suggestion } from "../core/suggest";

/** Brightness comes as 0..255; the bar and the label want per cent. */
const MAX_BRIGHTNESS = 255;

export interface LightTileConfig extends TileBaseConfig {
  type: string;
  lights: (EntityItem | string)[];
  /**
   * The entity the tile line is about — a light group, usually. Without it the
   * line speaks for the whole list and the icon toggles nothing.
   */
  group?: string;
  /** A brightness slider for the group under the line. On when a group is set. */
  brightness?: boolean;
}

/**
 * The lights of a room in one tile.
 *
 * A light is not interesting on its own — the stock tile covers that. What is
 * hard to see is the room as a whole: which of the five are on and how bright.
 * So every light gets a level row, and the bar is its brightness.
 *
 * A light that is off keeps its row with an empty bar rather than disappearing:
 * the question here is "what is on", and an answer needs the ones that are not.
 *
 * A light that lost connection is neither on nor off, and saying "all off" about
 * a room whose lamps stopped answering is the card telling a comfortable lie.
 * Those are counted separately and named on the line.
 */
export class HorosLightTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: LightTileConfig;

  protected override contentRows(): number {
    return Math.ceil((this._config?.lights.length ?? 0) / 2);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/light-tile-editor");
    return document.createElement(
      "horos-light-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<LightTileConfig> {
    return { lights: [] };
  }

  public setConfig(config: LightTileConfig): void {
    if (!config.lights?.length) {
      throw new Error("At least one light is required (lights)");
    }
    this.base = config;
    this._config = config;
  }

  /** Brightness in per cent, or undefined when the light is off or has none. */
  private _brightness(role: ResolvedRole | undefined): number | undefined {
    if (!role?.stateObj || role.stateObj.state !== "on") return undefined;
    const raw = role.stateObj.attributes.brightness as number | undefined;
    return raw === undefined ? undefined : Math.round((raw / MAX_BRIGHTNESS) * 100);
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const group = resolveRole(this.hass, config.group);
    const items = config.lights.map((raw) => normalizeItem(raw));
    const lights = items.map((item) => ({
      item,
      role: resolveRole(this.hass, item.entity),
    }));

    const warning = this.missingRolesWarning([
      group,
      ...lights.map((light) => light.role),
    ]);
    if (warning) return this.renderWarning(warning);

    const on = lights.filter((light) => light.role?.stateObj?.state === "on");
    const offline = lights.filter((light) => light.role?.unavailable);
    const answering = lights.length - offline.length;
    const main = group ?? on[0]?.role ?? lights[0].role;
    const groupName = group?.stateObj?.attributes.friendly_name;

    const rows: LevelRow[] = lights.map(({ item, role }) => {
      const level = this._brightness(role);
      const lit = role?.stateObj?.state === "on";
      // What HA itself calls that state: "Unavailable", "Unknown", translated.
      const offlineText = formatUnavailable(this.hass, role);
      return {
        entityId: item.entity,
        name:
          item.name ??
          stripDeviceName(role?.stateObj?.attributes.friendly_name, groupName) ??
          item.entity,
        // A dimmable light says how bright, a plain one only that it is on.
        text:
          offlineText ??
          (lit
            ? level === undefined
              ? t(this.hass, "light.on")
              : `${level}%`
            : t(this.hass, "light.off")),
        ink: item.color ?? tileColor(role?.stateObj),
        level: lit ? (level ?? 100) : 0,
      };
    });

    const brightness = this._brightness(main);

    return this.renderTile({
      icon: "mdi:lightbulb-group",
      color: tileColor(main?.stateObj),
      primary: config.name ?? groupName ?? t(this.hass, "light.title"),
      mainEntityId: main?.entityId,
      defaultIconAction: defaultIconAction(main?.entityId),
      secondary: composeSegments([
        unavailableSegment(this.hass, group),
        // With nothing answering there is no "on out of" to state: the count
        // would be about lights nobody can see.
        answering === 0
          ? undefined
          : {
              text: on.length
                ? t(this.hass, "light.count", {
                    count: on.length,
                    total: answering,
                  })
                : t(this.hass, "light.allOff"),
            },
        offline.length
          ? {
              text: t(this.hass, "offline.count", { count: offline.length }),
              entityId: offline[0].item.entity,
            }
          : undefined,
      ]),
      values:
        brightness === undefined
          ? []
          : [
              {
                value: String(brightness),
                unit: "%",
                entityId: main?.entityId,
                icon: ROLE_ICONS.brightness,
              },
            ],
      // The slider is a stock HA feature, and it only makes sense for a group:
      // a single slider cannot mean five different lights.
      ownFeatures:
        group && config.brightness !== false
          ? [{ type: "light-brightness" }]
          : undefined,
      customFeatures: renderLevels(rows, (entityId) =>
        this.fireMoreInfo(entityId)
      ),
    });
  }
}

registerCard("horos-light-tile", HorosLightTile, {
  type: "horos-light-tile",
  name: { ru: "Свет", en: "Lights" },
  description: {
    ru: "Свет комнаты одной плиткой: что горит и насколько ярко",
    en: "A room's lights in one tile: what is on and how bright",
  },
  preview: true,
  suggest: (hass, entityId) => {
    // The area is what makes a set of lights a room's lights.
    if (!areaOf(hass, entityId)) return null;
    const lights = sameArea(hass, entityId, "light");
    if (lights.length < 2) return null;
    return suggestion("custom:horos-light-tile", {}, { lights });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-light-tile": HorosLightTile;
  }
}
