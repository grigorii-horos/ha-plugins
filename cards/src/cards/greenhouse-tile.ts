import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import {
  composeSegments,
  formatUnavailable,
  formatRole,
  numericState,
  resolveRole,
  roleSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import { stripMoistureSuffix } from "../core/labels";
import {
  DEFAULT_DRY_BELOW,
  DEFAULT_WET_ABOVE,
  MOISTURE_COLOR,
  moistureStatus,
  type MoistureStatus,
} from "../core/moisture";
import {
  countPlants,
  greenhouseStatus,
  GREENHOUSE_ICON,
  type PlantReport,
} from "../core/greenhouse";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { allOfClass, deviceClassOf, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";
import { t } from "../core/i18n";

/** The order of roles in the secondary line: the air around the plants. */
export const GREENHOUSE_ROLES = [
  "temperature",
  "humidity",
  "illuminance",
] as const;

export type GreenhouseRole = (typeof GREENHOUSE_ROLES)[number];

/**
 * One plant: its soil moisture sensor, and how dry it is allowed to get.
 *
 * The thresholds are per plant on purpose. A cactus at 20% is fine and a fern
 * at 20% is dying, so a single pair of numbers for the whole shelf would make
 * the bars lie about half of it.
 */
export interface GreenhousePlant extends EntityItem {
  dry_below?: number;
  wet_above?: number;
}

export interface GreenhouseTileConfig extends TileBaseConfig {
  type: string;
  /** The plants: a soil moisture sensor each, one row each. */
  plants: (GreenhousePlant | string)[];
  temperature?: string;
  humidity?: string;
  illuminance?: string;
  /** The thresholds for the plants that do not set their own. */
  dry_below?: number;
  wet_above?: number;
  /** What to show large on the right. The air temperature by default. */
  big_values?: GreenhouseRole[];
}

/**
 * Every plant in one tile.
 *
 * The plant card answers "how is this one doing", and that is the right card
 * for a plant with a name. A shelf of them is a different question — "does
 * anything need watering today" — and eight separate tiles answer it worst of
 * all: the eye has to walk the whole dashboard and compare numbers by hand.
 *
 * So the plants become rows, each a bar of soil moisture in the colour of its
 * own thresholds, and the tile's line answers the question outright: how many
 * are asking for water. Above them stands the air they share — temperature,
 * humidity, light — because a whole shelf drying out at once is usually about
 * the room, not the plants.
 */
export class HorosGreenhouseTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: GreenhouseTileConfig;

  private _bigKeys: string[] = ["temperature"];

  protected override contentRows(): number {
    return this.levelRows(this._config?.plants?.length ?? 0) + this.fixedRows();
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/greenhouse-tile-editor");
    return document.createElement(
      "horos-greenhouse-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<GreenhouseTileConfig> {
    return { plants: [] };
  }

  public setConfig(config: GreenhouseTileConfig): void {
    if (!config.plants?.length) {
      throw new Error("At least one plant is required (plants)");
    }
    const dryBelow = config.dry_below ?? DEFAULT_DRY_BELOW;
    const wetAbove = config.wet_above ?? DEFAULT_WET_ABOVE;
    if (dryBelow >= wetAbove) {
      throw new Error("dry_below must be smaller than wet_above");
    }
    this._bigKeys = resolveBigKeys(
      config.big_values,
      "temperature",
      GREENHOUSE_ROLES
    );
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const roles: KeyedRole[] = GREENHOUSE_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const rows: LevelRow[] = [];
    const reports: PlantReport[] = [];
    // A renamed entity must not blank the card, and must not pass unmentioned
    // either: the row goes, the count of what is gone stays.
    const missing: string[] = [];

    for (const raw of config.plants) {
      const plant = normalizeItem(raw) as GreenhousePlant;
      const role = resolveRole(this.hass, plant.entity);
      if (role?.missing) {
        missing.push(plant.entity);
        continue;
      }
      const level = numericState(role);
      const status: MoistureStatus = moistureStatus(
        level,
        plant.dry_below ?? config.dry_below ?? DEFAULT_DRY_BELOW,
        plant.wet_above ?? config.wet_above ?? DEFAULT_WET_ABOVE
      );
      const offline = Boolean(role?.unavailable);
      reports.push({ status, offline });

      rows.push({
        entityId: plant.entity,
        name:
          plant.name ??
          stripMoistureSuffix(role?.stateObj?.attributes.friendly_name) ??
          plant.entity,
        text:
          formatUnavailable(this.hass, role) ??
          formatRole(this.hass, role) ??
          t(this.hass, "value.unknown"),
        ink: plant.color ?? MOISTURE_COLOR[status],
        // A silent sensor gets an empty bar, not a full one: an empty bar reads
        // as "nothing is known here", a full one as "soaked".
        level: level ?? 0,
        // Dry is the one that needs a hand today. Soaked shows in the colour.
        alarm: offline || status === "dry",
        alarmIcon: offline ? "mdi:lan-disconnect" : "mdi:water-off",
      });
    }

    const count = countPlants(reports);
    const status = greenhouseStatus(count);
    const { big, rest } = splitRoles(roles, this._bigKeys);

    return this.renderTile({
      icon: GREENHOUSE_ICON[status],
      color: MOISTURE_COLOR[status],
      primary: config.name ?? t(this.hass, "greenhouse.title"),
      // The card is about the set, so it has no main entity to act on: the
      // driest plant is the one thing worth opening from here.
      mainEntityId: rows.find((row) => row.alarm)?.entityId,
      secondary: composeSegments([
        count.thirsty
          ? {
              text: t(this.hass, "greenhouse.thirsty", {
                count: count.thirsty,
                total: count.reporting,
              }),
            }
          : count.reporting
            ? {
                text: t(this.hass, "greenhouse.watered", {
                  count: count.reporting,
                }),
              }
            : undefined,
        count.soaked
          ? { text: t(this.hass, "greenhouse.soaked", { count: count.soaked }) }
          : undefined,
        count.offline
          ? { text: t(this.hass, "offline.count", { count: count.offline }) }
          : undefined,
        missing.length
          ? { text: t(this.hass, "list.missing", { count: missing.length }) }
          : undefined,
        ...rest.map((item) => roleSegment(this.hass, item.role)),
      ]),
      values: this.bigValues(big),
      customFeatures: rows.length
        ? renderLevels(rows, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-greenhouse-tile", HorosGreenhouseTile, {
  type: "horos-greenhouse-tile",
  name: { ru: "Оранжерея", en: "Greenhouse" },
  description: {
    ru: "Все растения полосками влажности почвы и воздух, которым они дышат",
    en: "Every plant as a bar of soil moisture, and the air they share",
  },
  preview: true,
  suggest: (hass, entityId) => {
    // Soil moisture has a device class of its own in HA: no name guessing. A
    // binary moisture sensor is a leak detector, not a plant — the unit tells
    // them apart, and so the safety card keeps its own.
    if (
      computeDomain(entityId) !== "sensor" ||
      deviceClassOf(hass, entityId) !== "moisture"
    ) {
      return null;
    }
    const plants = allOfClass(hass, entityId, "sensor", ["moisture"]);
    // One plant is the plant card's job; a shelf of them is this one's.
    if (plants.length < 2) return null;
    return suggestion("custom:horos-greenhouse-tile", {}, { plants });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-greenhouse-tile": HorosGreenhouseTile;
  }
}
