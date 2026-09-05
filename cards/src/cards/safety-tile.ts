import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { composeSegments, resolveRole, type Segment } from "../core/format";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { allOfClass, deviceClassOf, suggestion } from "../core/suggest";
import { computeDomain } from "../core/state-color";
import { t } from "../core/i18n";

export interface SafetyTileConfig extends TileBaseConfig {
  type: string;
  /** Leak, smoke and gas sensors — everything that is supposed to stay quiet. */
  sensors: (EntityItem | string)[];
}

/**
 * Safety.
 *
 * Normally the card keeps quiet in a single line. An alarm is not only a sensor
 * that fired: **an unavailable sensor is an alarm too**, because it guards
 * nothing. A broken sensor's silence is indistinguishable from a healthy one's
 * unless something says so.
 */
export class HorosSafetyTile extends BaseTileCard {
  @state() private _config?: SafetyTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/safety-tile-editor");
    return document.createElement(
      "horos-safety-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<SafetyTileConfig> {
    return { sensors: [] };
  }

  public setConfig(config: SafetyTileConfig): void {
    if (!config.sensors?.length) {
      throw new Error("At least one sensor is required (sensors)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const triggered: Segment[] = [];
    const silent: Segment[] = [];
    const missing: string[] = [];
    let total = 0;

    for (const raw of config.sensors) {
      const sensor = normalizeItem(raw);
      const role = resolveRole(this.hass, sensor.entity);
      if (role?.missing) {
        missing.push(sensor.entity);
        continue;
      }
      total += 1;
      const name =
        sensor.name ??
        role?.stateObj?.attributes.friendly_name ??
        sensor.entity;

      if (role?.unavailable) {
        silent.push({ text: t(this.hass, "safety.offline", { name }), entityId: sensor.entity });
      } else if (role?.stateObj?.state === "on") {
        triggered.push({ text: name, entityId: sensor.entity });
      }
    }

    const alarm = triggered.length > 0;
    const problems = [...triggered, ...silent];

    return this.renderTile({
      icon: alarm
        ? "mdi:shield-alert"
        : silent.length
          ? "mdi:shield-off-outline"
          : "mdi:shield-check",
      color: alarm
        ? "var(--error-color, #db4437)"
        : silent.length
          ? "var(--warning-color, #ffa600)"
          : "var(--success-color, #43a047)",
      primary: config.name ?? t(this.hass, "safety.title"),
      mainEntityId: problems[0]?.entityId,
      secondary: composeSegments([
        ...(problems.length
          ? problems
          : [{ text: t(this.hass, "safety.calm", { count: total }) }]),
        ...(missing.length
          ? [{ text: t(this.hass, "list.missing", { count: missing.length }) }]
          : []),
      ]),
    });
  }
}

registerCard("horos-safety-tile", HorosSafetyTile, {
  type: "horos-safety-tile",
  name: { ru: "Безопасность", en: "Safety" },
  description: {
    ru: "Протечка, дым, газ — и датчики, потерявшие связь",
    en: "Leak, smoke, gas — and sensors that lost connection",
  },
  preview: true,
  suggest: (hass, entityId) => {
    const classes = ["moisture", "gas", "smoke", "carbon_monoxide", "safety"];
    if (
      computeDomain(entityId) !== "binary_sensor" ||
      !classes.includes(deviceClassOf(hass, entityId) ?? "")
    ) {
      return null;
    }
    return suggestion(
      "custom:horos-safety-tile",
      {},
      { sensors: allOfClass(hass, entityId, "binary_sensor", classes) }
    );
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-safety-tile": HorosSafetyTile;
  }
}
