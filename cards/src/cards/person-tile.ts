import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles } from "../core/levels";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  numericState,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import {
  levelColor,
  stripBatterySuffix,
  stripDeviceName,
} from "../core/labels";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { byClass, devicePool, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";
import { t } from "../core/i18n";

export interface PersonTileConfig extends TileBaseConfig {
  type: string;
  /** person or device_tracker — who this is and whether they are home. */
  person: string;
  /** The main device's battery, shown large. */
  battery?: string;
  /** Where exactly: a geocoded address or a zone. */
  location?: string;
  /** The battery of the other devices: watch, tablet, e-reader. */
  devices?: (EntityItem | string)[];
}

/**
 * A person: whether they are home, where exactly, and their devices' battery.
 *
 * Device batteries are drawn as bars — the same device as consumables and ink:
 * several homogeneous levels that have to be seen together.
 */
export class HorosPersonTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: PersonTileConfig;

  /** Level rows under the tile: roughly two per grid row. */
  protected override contentRows(): number {
    return this.levelRows(this._config?.devices?.length ?? 0) + this.fixedRows();
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/person-tile-editor");
    return document.createElement(
      "horos-person-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<PersonTileConfig> {
    return { person: "" };
  }

  public setConfig(config: PersonTileConfig): void {
    if (!config.person) {
      throw new Error("A person is required (person)");
    }
    // A person's portrait says more than a faceless icon, so we show it by
    // default when there is one.
    this.base = { show_entity_picture: true, ...config };
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const person = resolveRole(this.hass, config.person);
    const battery = resolveRole(this.hass, config.battery);
    const location = resolveRole(this.hass, config.location);

    const warning = this.missingRolesWarning([person, battery, location]);
    if (warning) return this.renderWarning(warning);

    const devices = (config.devices ?? [])
      .map((raw) => normalizeItem(raw))
      .map((item) => {
        const role = resolveRole(this.hass, item.entity);
        const level = numericState(role);
        const name =
          item.name ??
          stripBatterySuffix(
            stripDeviceName(
              role?.stateObj?.attributes.friendly_name,
              config.name
            )
          ) ??
          item.entity;
        return {
          entityId: item.entity,
          name,
          text: level === undefined ? t(this.hass, "value.unknown") : `${level}%`,
          ink: item.color ?? levelColor(level),
          level: level ?? 0,
          alarm: level !== undefined && level < 20,
          alarmIcon: "mdi:battery-alert-variant-outline",
        };
      });

    return this.renderTile({
      icon: "mdi:account",
      color: tileColor(person?.stateObj),
      primary:
        config.name ?? person?.stateObj?.attributes.friendly_name ?? t(this.hass, "person.title"),
      mainEntityId: person?.entityId,
      imageUrl: this.entityImage(person?.stateObj),
      secondary: composeSegments([
        unavailableSegment(this.hass, person),
        this.mainStateSegment(person),
        roleSegment(this.hass, location),
      ]),
      values: battery ? this.bigValues([{ key: "battery", role: battery }]) : [],
      customFeatures: devices.length
        ? renderLevels(devices, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-person-tile", HorosPersonTile, {
  type: "horos-person-tile",
  name: { ru: "Человек", en: "Person" },
  description: {
    ru: "Дома ли он, где именно и заряд его устройств",
    en: "Whether they are home, where exactly, and their devices' battery",
  },
  preview: true,
  suggest: (hass, entityId) => {
    if (computeDomain(entityId) !== "person") return null;
    // The phone is reached through the person's device_tracker: the battery sits
    // on the same device as the tracker. No names are parsed on the way.
    const trackers = (hass.states[entityId]?.attributes.device_trackers ??
      []) as string[];
    const battery = trackers
      .map((tracker) => byClass(hass, devicePool(hass, tracker), "sensor", "battery"))
      .find(Boolean);
    if (!battery) return null;
    return suggestion("custom:horos-person-tile", {
      person: entityId,
      battery,
    });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-person-tile": HorosPersonTile;
  }
}
