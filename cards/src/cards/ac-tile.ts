import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileColor } from "../core/state-color";
import {
  cardName,
  composeSegments,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";
import {
  areaOf,
  byClass,
  byDomain,
  devicePool,
  filled,
  sameArea,
  suggestion,
} from "../core/suggest";

/** The order of roles in the secondary line. */
export const AC_ROLES = ["temperature", "humidity", "power"] as const;

export type AcRole = (typeof AC_ROLES)[number];

export interface AcTileConfig extends TileBaseConfig {
  type: string;
  /** The climate entity: an air conditioner, a heat pump, a radiator valve. */
  climate: string;
  /** What the room actually is, as opposed to what the unit reports. */
  temperature?: string;
  humidity?: string;
  /** What it costs to run: the plug the unit is on. */
  power?: string;
  /** Anything else worth a word: mode, fan speed, filter. */
  sensors?: (EntityItem | string)[];
  /** Mode buttons and the target temperature under the line. On by default. */
  controls?: boolean;
  /** What to show large on the right. The room temperature by default. */
  big_values?: AcRole[];
}

/**
 * An air conditioner, told apart from the room it stands in.
 *
 * A climate entity knows its own target and what its own sensor reads, and
 * those two are not the room: the unit measures the air at its intake. So the
 * room's temperature and humidity are separate roles, filled from the room's
 * own sensors, and the unit's target stays where the stock features show it.
 *
 * Power belongs here for the same reason a plug card has it: the honest answer
 * to "should I leave it running" is a number in watts.
 */
export class HorosAcTile extends BaseTileCard {
  @state() private _config?: AcTileConfig;

  private _bigKeys: string[] = ["temperature"];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/ac-tile-editor");
    return document.createElement("horos-ac-tile-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<AcTileConfig> {
    return { climate: "" };
  }

  public setConfig(config: AcTileConfig): void {
    if (!config.climate) {
      throw new Error("A climate entity is required (climate)");
    }
    this._bigKeys = resolveBigKeys(config.big_values, "temperature", AC_ROLES);
    this.base = config;
    this._config = config;
  }

  protected override contentRows(): number {
    // Two stock features stack under the line: the modes and the target.
    return this._config?.controls === false ? 0 : 2;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const climate = resolveRole(this.hass, config.climate);
    const roles: KeyedRole[] = AC_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));
    const extras = (config.sensors ?? [])
      .map((raw) => normalizeItem(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([
      climate,
      ...roles.map((item) => item.role),
      ...extras,
    ]);
    if (warning) return this.renderWarning(warning);

    const { big, rest } = splitRoles(roles, this._bigKeys);

    return this.renderTile({
      icon: "mdi:air-conditioner",
      color: tileColor(climate?.stateObj),
      primary: cardName(config.name, climate) ?? t(this.hass, "ac.title"),
      mainEntityId: climate?.entityId,
      defaultIconAction: defaultIconAction(climate?.entityId),
      secondary: composeSegments([
        unavailableSegment(this.hass, climate),
        this.mainStateSegment(climate),
        ...rest.map((item) => roleSegment(this.hass, item.role)),
        ...extras.map((extra) => roleSegment(this.hass, extra)),
      ]),
      values: this.bigValues(big),
      // Modes and the target temperature are stock features: the climate domain
      // has more shapes than a card should try to draw.
      ownFeatures:
        config.controls === false
          ? undefined
          : [{ type: "climate-hvac-modes" }, { type: "target-temperature" }],
    });
  }
}

registerCard("horos-ac-tile", HorosAcTile, {
  type: "horos-ac-tile",
  name: { ru: "Кондиционер", en: "Air conditioner" },
  description: {
    ru: "Климатический прибор, воздух в комнате и цена работы",
    en: "A climate unit, the air in the room, and what running it costs",
  },
  preview: true,
  suggest: (hass, entityId) => {
    const pool = devicePool(hass, entityId);
    const climate = byDomain(pool, "climate");
    if (!climate) return null;
    // The unit measures its own intake; the room is measured by the room's
    // sensors, and the area is what says which ones those are.
    const room = areaOf(hass, climate)
      ? sameArea(hass, climate, "sensor")
      : [];
    const roles = {
      climate,
      temperature: byClass(hass, room, "sensor", "temperature"),
      humidity: byClass(hass, room, "sensor", "humidity"),
      power: byClass(hass, pool, "sensor", "power"),
    };
    if (filled(roles) < 2) return null;
    return suggestion("custom:horos-ac-tile", roles);
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-ac-tile": HorosAcTile;
  }
}
