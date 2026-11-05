import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  resolveRole,
  unavailableSegment,
  UNAVAILABLE_STATES,
} from "../core/format";
import { defaultIconAction } from "../core/actions";
import { ensureControls } from "../core/ha-internals";
import { t } from "../core/i18n";
import { registerCard } from "../core/register";
import type { LovelaceCardEditor, LovelaceGridOptions } from "../core/types";
import {
  chargeStatus,
  isFresh,
  lastReport,
  minutesLeft,
  pickLevel,
} from "../charge/charge";
import "../charge/range-bar";

export interface ChargeTileConfig extends TileBaseConfig {
  type: string;
  /** One battery sensor, or several for the same battery: the first numeric wins. */
  battery: string | string[];
  /** The port that powers the charger. */
  switch: string;
  /** The charging limits: `input_number` or `number` entities. */
  min: string;
  max: string;
  /** A timer: while it runs the automation charges regardless of max. */
  force?: string;
  /** Seconds after which an unchanged report counts as no data. */
  stale_after?: number;
}

/** The battery list as written, normalised to an array. */
export const batteryIds = (config: Pick<ChargeTileConfig, "battery">): string[] =>
  (Array.isArray(config.battery) ? config.battery : [config.battery]).filter(
    (id): id is string => typeof id === "string" && id !== ""
  );

/**
 * A device kept between two charge limits by a Home Assistant automation.
 *
 * The line says what the automation is doing; under it the battery level is a
 * fill with the two limits as handles, and a button starts a 30-minute forced
 * charge (the `force` timer; the duration is the timer's own). The card decides
 * nothing: it shows state, writes the limits and starts or cancels the timer.
 *
 * Exactly two layout rows, always: the control line is the card, not an
 * optional extra, so `features` and `levels: false` do not apply here.
 */
export class HorosChargeTile extends BaseTileCard {
  static styles = [
    tileStyles,
    css`
      .charge-line {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--ha-card-feature-gap, 12px);
      }

      horos-charge-range {
        flex: 1 1 0;
        min-width: 0;
      }

      ha-control-button {
        flex: none;
        width: auto;
        min-width: var(--feature-height, 42px);
        height: var(--feature-height, 42px);
        --control-button-border-radius: var(--feature-border-radius, 12px);
        --control-button-padding: 0 var(--ha-space-3, 12px);
        --control-button-background-color: var(--tile-color);
        --control-button-icon-color: var(--tile-color);
        font-size: var(--ha-font-size-s, 12px);
      }

      ha-control-button.active {
        --control-button-background-color: var(--state-active-color, #ffc107);
        --control-button-icon-color: var(--state-active-color, #ffc107);
        --control-button-background-opacity: 0.3;
      }

      .force {
        display: flex;
        align-items: center;
        gap: var(--ha-space-1, 4px);
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .force ha-icon {
        --mdc-icon-size: 18px;
      }
    `,
  ];

  @state() private _config?: ChargeTileConfig;

  @state() private _controlsReady = false;

  /** Re-renders the minutes left while a forced charge runs. */
  private _tick?: ReturnType<typeof setInterval>;

  public connectedCallback(): void {
    super.connectedCallback();
    void ensureControls().then((ready) => {
      this._controlsReady = ready;
    });
    // Minutes and "no data since" both move with the clock, not with states.
    this._tick = setInterval(() => this.requestUpdate(), 30_000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) clearInterval(this._tick);
    this._tick = undefined;
  }

  protected override contentRows(): number {
    return 1;
  }

  protected override fixedRows(): number {
    return 1;
  }

  public override getGridOptions(): LovelaceGridOptions {
    // Full width by default: at half a section the scale is too short to aim at.
    return { ...super.getGridOptions(), columns: 12, rows: 2, min_rows: 2 };
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/charge-tile-editor");
    return document.createElement("horos-charge-tile-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<ChargeTileConfig> {
    return { battery: [], switch: "", min: "", max: "" };
  }

  public setConfig(config: ChargeTileConfig): void {
    if (!batteryIds(config).length) throw new Error("A battery sensor is required (battery)");
    if (!config.switch) throw new Error("A switch is required (switch)");
    if (!config.min || !config.max) throw new Error("Both limits are required (min, max)");
    // The control line is the card itself; see the class comment.
    const { features: _features, levels: _levels, ...base } = config;
    this.base = base;
    this._config = config;
  }

  private _number(entityId: string | undefined, attribute?: string): number | undefined {
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    if (!stateObj) return undefined;
    const raw = attribute ? stateObj.attributes[attribute] : stateObj.state;
    if (raw === undefined || raw === null || UNAVAILABLE_STATES.has(String(raw))) {
      return undefined;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  }

  private _setLimit(event: CustomEvent<{ which: "min" | "max"; value: number }>): void {
    const config = this._config;
    if (!config || !this.hass) return;
    const entityId = config[event.detail.which];
    this.hass.callService(entityId.split(".")[0], "set_value", {
      entity_id: entityId,
      value: event.detail.value,
    });
  }

  private _toggleForce(event: Event): void {
    event.stopPropagation();
    const force = this._config?.force;
    if (!force || !this.hass) return;
    const active = this.hass.states[force]?.state === "active";
    this.hass.callService("timer", active ? "cancel" : "start", { entity_id: force });
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;
    const hass = this.hass;
    const ids = batteryIds(config);
    const now = new Date();

    const sw = resolveRole(hass, config.switch);
    const warning = this.missingRolesWarning([
      sw,
      resolveRole(hass, config.min),
      resolveRole(hass, config.max),
      resolveRole(hass, config.force),
      // A battery list is fine with one of its sensors gone, not with all.
      ids.every((id) => !hass.states[id]) ? resolveRole(hass, ids[0]) : undefined,
    ]);
    if (warning) return this.renderWarning(warning);

    const { entityId: levelId, level } = pickLevel(hass, ids);
    const mainId = levelId ?? ids[0];
    const on = sw?.stateObj?.state === "on";
    const forceObj = config.force ? hass.states[config.force] : undefined;
    const forced = forceObj?.state === "active";
    const left = minutesLeft(forceObj?.attributes.finishes_at as string | undefined, now);
    const min = this._number(config.min);
    const max = this._number(config.max);
    const status = chargeStatus({
      forced,
      minutesLeft: left,
      fresh: isFresh(hass, ids, config.stale_after, now),
      on,
      min,
      max,
      since: lastReport(hass, ids),
    });

    const levelObj = hass.states[mainId];
    const tile = this.renderTile({
      icon: "mdi:watch",
      // Lit while the port is on; the battery itself is always "active".
      color: on ? tileColor(sw?.stateObj) : "var(--state-inactive-color)",
      primary: config.name ?? levelObj?.attributes.friendly_name ?? t(hass, "charge.title"),
      secondary: composeSegments([
        unavailableSegment(hass, sw) ?? {
          text: t(hass, status.key, status.params),
          entityId: forced ? config.force : config.switch,
        },
      ]),
      mainEntityId: mainId,
      defaultIconAction: defaultIconAction(mainId),
      values:
        level === undefined
          ? []
          : [{ value: String(Math.round(level)), unit: "%", entityId: mainId }],
      customFeatures: html`<div class="charge-line">
        <horos-charge-range
          .level=${level}
          .min=${min}
          .max=${max}
          .step=${this._number(config.min, "step") ?? 1}
          .lo=${this._number(config.min, "min") ?? 0}
          .hi=${this._number(config.max, "max") ?? 100}
          .charging=${on}
          @limit-change=${this._setLimit}
        ></horos-charge-range>
        ${config.force && this._controlsReady
          ? html`<ha-control-button
              class=${forced ? "active" : ""}
              .label=${t(hass, "charge.force")}
              @click=${this._toggleForce}
            >
              <span class="force">
                <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                ${forced
                  ? t(hass, "charge.forceLeft", { minutes: left })
                  : t(hass, "charge.force")}
              </span>
            </ha-control-button>`
          : nothing}
      </div>`,
    });
    // Two rows, fixed: the card fills its slot, see :host([filled]).
    this.toggleAttribute("filled", true);
    return tile;
  }
}

registerCard("horos-charge-tile", HorosChargeTile, {
  type: "horos-charge-tile",
  name: { ru: "Зарядка", en: "Charge" },
  description: {
    ru: "Заряд, пределы зарядки и принудительная зарядка одного устройства",
    en: "Battery, charging limits and a forced charge for one device",
  },
  preview: false,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-charge-tile": HorosChargeTile;
  }
}
