import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  formatAttribute,
  formatUnavailable,
  resolveRole,
  roleSegment,
  splitValueUnit,
  unavailableSegment,
  type ResolvedRole,
} from "../core/format";
import { resolveBigKeys, splitRoles, type KeyedRole } from "../core/big-values";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import { stripDeviceName } from "../core/labels";
import { countDemand, zoneState, type ZoneState } from "../core/heating";
import { defaultIconAction } from "../core/actions";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

/** The order of roles in the secondary line. */
export const HEATING_ROLES = ["power", "energy"] as const;

export type HeatingRole = (typeof HEATING_ROLES)[number];

export interface HeatingTileConfig extends TileBaseConfig {
  type: string;
  /** What the boiler is doing right now, if something says so. */
  mode?: string;
  /** The burner: the only part that actually spends fuel. */
  burner?: string;
  /** The circulation pump: heat is moving even when nothing is burning. */
  pump?: string;
  /** Power to the boiler — a plug, a relay. The icon switches it. */
  switch?: string;
  power?: string;
  energy?: string;
  /** The rooms the heat goes to: a climate entity each, one row each. */
  zones?: (EntityItem | string)[];
  /** What to show large on the right. The power draw by default. */
  big_values?: HeatingRole[];
}

/**
 * The heating system as one thing: a boiler and the rooms it heats.
 *
 * Heating is the one system in a house that is spread across every room and has
 * no entity of its own. The boiler is in the kitchen, the demand is in the
 * bedroom, the bill is on a socket, and a dashboard ends up with the three in
 * three different places — so the question "why is it burning right now" has no
 * card to ask.
 *
 * Here the boiler is the tile's line: what it is doing, what it draws, what it
 * has spent. The rooms are the rows below, each with what it is at and what it
 * was asked for, and a bar that fills for the ones asking for heat. That is the
 * answer to the question: the burner is on because these two rooms are cold.
 *
 * A room that reports no `hvac_action` is not counted as quiet — it is left out
 * of the count entirely. See `core/heating.ts` for why.
 */
export class HorosHeatingTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: HeatingTileConfig;

  private _bigKeys: string[] = ["power"];

  protected override contentRows(): number {
    return this.levelRows(this._config?.zones?.length ?? 0) + this.fixedRows();
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/heating-tile-editor");
    return document.createElement(
      "horos-heating-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<HeatingTileConfig> {
    return { zones: [] };
  }

  public setConfig(config: HeatingTileConfig): void {
    if (!config.mode && !config.burner && !config.pump && !config.switch) {
      throw new Error(
        "The boiler needs at least one entity: mode, burner, pump or switch"
      );
    }
    this._bigKeys = resolveBigKeys(config.big_values, "power", HEATING_ROLES);
    this.base = config;
    this._config = config;
  }

  /** What the row says on the right: where the room is and where it was sent. */
  private _zoneText(
    role: ResolvedRole | undefined,
    zone: ZoneState
  ): string | undefined {
    if (zone === "offline") return formatUnavailable(this.hass, role);
    const stateObj = role?.stateObj;
    if (!stateObj) return undefined;

    const current = formatAttribute(this.hass, stateObj, "current_temperature");
    const target = formatAttribute(this.hass, stateObj, "temperature");
    // Both carry the same unit, and printed twice it crowds the bar out of the
    // row — so the first one keeps only its number. What trails the target's
    // digits is that unit, whatever HA decided it is.
    if (current && target) {
      const unit = target.replace(/^[\d\s\u00a0.,+-]+/, "");
      return `${splitValueUnit(current, unit).value} → ${target}`;
    }
    return current ?? target ?? this.hass?.formatEntityState(stateObj);
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const mode = resolveRole(this.hass, config.mode);
    const burner = resolveRole(this.hass, config.burner);
    const pump = resolveRole(this.hass, config.pump);
    const boiler = resolveRole(this.hass, config.switch);
    const roles: KeyedRole[] = HEATING_ROLES.map((key) => ({
      key,
      role: resolveRole(this.hass, config[key]),
    }));

    const zones = (config.zones ?? [])
      .map((raw) => normalizeItem(raw))
      .map((item) => {
        const role = resolveRole(this.hass, item.entity);
        return { item, role, zone: zoneState(role?.stateObj) };
      });

    const warning = this.missingRolesWarning([
      mode,
      burner,
      pump,
      boiler,
      ...roles.map((item) => item.role),
      ...zones.map((zone) => zone.role),
    ]);
    if (warning) return this.renderWarning(warning);

    const burning = burner?.stateObj?.state === "on";
    const pumping = pump?.stateObj?.state === "on";
    const head = mode ?? boiler ?? burner ?? pump;
    const { calling, reporting, offline } = countDemand(
      zones.map((zone) => zone.zone)
    );

    const rows: LevelRow[] = zones.map(({ item, role, zone }) => ({
      entityId: item.entity,
      name:
        item.name ??
        stripDeviceName(role?.stateObj?.attributes.friendly_name, config.name) ??
        item.entity,
      text: this._zoneText(role, zone) ?? "",
      ink: item.color ?? tileColor(role?.stateObj),
      // The bar is the demand, not the temperature: a room either has the
      // boiler working for it or it does not.
      level: zone === "heating" ? 100 : 0,
      alarm: zone === "offline",
      alarmIcon: "mdi:lan-disconnect",
    }));

    return this.renderTile({
      icon: burning
        ? "mdi:fire"
        : pumping
          ? "mdi:pump"
          : "mdi:water-boiler",
      color: burning
        ? tileColor(burner!.stateObj)
        : pumping
          ? tileColor(pump!.stateObj)
          : tileColor(head?.stateObj),
      primary: config.name ?? t(this.hass, "heating.title"),
      mainEntityId: head?.entityId,
      // The icon is the boiler's own switch where there is one; without it
      // there is nothing on this card that is safe to toggle.
      defaultIconAction: config.switch
        ? defaultIconAction(config.switch)
        : { action: "none" },
      secondary: composeSegments([
        unavailableSegment(this.hass, head),
        this.mainStateSegment(head === mode ? mode : head),
        // Who is asking is the card's whole point, so it is always said. That
        // nobody is asking is only worth a word when the boiler has no mode
        // sensor to say "standby" for itself.
        calling
          ? {
              text: t(this.hass, "heating.calling", {
                count: calling,
                total: reporting,
              }),
            }
          : reporting && !mode
            ? { text: t(this.hass, "heating.quiet") }
            : undefined,
        offline
          ? { text: t(this.hass, "offline.count", { count: offline }) }
          : undefined,
        ...splitRoles(roles, this._bigKeys).rest.map((item) =>
          roleSegment(this.hass, item.role)
        ),
      ]),
      values: this.bigValues(splitRoles(roles, this._bigKeys).big),
      customFeatures: rows.length
        ? renderLevels(rows, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-heating-tile", HorosHeatingTile, {
  type: "horos-heating-tile",
  name: { ru: "Отопление", en: "Heating" },
  description: {
    ru: "Котёл и комнаты, которые просят у него тепла, одной плиткой",
    en: "The boiler and the rooms asking it for heat, in one tile",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-heating-tile": HorosHeatingTile;
  }
}
