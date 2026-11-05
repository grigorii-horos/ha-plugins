import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { tileColor } from "../core/state-color";
import { levelColor } from "../core/labels";
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
  lastReportedTemplate,
  minutesLeft,
  nextPeriod,
  pickLevel,
} from "../charge/charge";
import "../charge/range-bar";

export interface ChargeTileConfig extends TileBaseConfig {
  type: string;
  /** One battery sensor, or several for the same battery: the first numeric wins. */
  battery: string | string[];
  /** The port that powers the charger. Optional, like every role but battery. */
  switch?: string;
  /** The charging limits: `input_number` or `number` entities. */
  min?: string;
  max?: string;
  /** A timer: while it runs the automation charges regardless of max. */
  force?: string;
  /**
   * An `input_number` of hours: how often the automation powers the port for a
   * short pulse while there is no battery data. Optional; no button without it.
   */
  pulse_every?: string;
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

  /** The newest report as HA knows it; see isFresh for why it is asked for. */
  @state() private _reported?: Date;

  private _unsubscribe?: Promise<() => Promise<void>>;

  private _subscribeReported(): void {
    const config = this._config;
    const connection = this.hass?.connection;
    if (this._unsubscribe || !config?.stale_after || !connection || !this.isConnected) {
      return;
    }
    this._unsubscribe = connection
      .subscribeMessage<{ result?: unknown }>(
        (message) => {
          const seconds = Number(message.result);
          this._reported =
            message.result !== "" && Number.isFinite(seconds)
              ? new Date(seconds * 1000)
              : undefined;
        },
        { type: "render_template", template: lastReportedTemplate(batteryIds(config)) }
      )
      .catch(() => {
        // Without it the card falls back to the state's own stamps.
        this._unsubscribe = undefined;
        return async () => undefined;
      });
  }

  private _unsubscribeReported(): void {
    void this._unsubscribe?.then((unsubscribe) => unsubscribe()).catch(() => undefined);
    this._unsubscribe = undefined;
    this._reported = undefined;
  }

  protected override updated(changed: Map<string, unknown>): void {
    super.updated?.(changed);
    this._subscribeReported();
  }

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
    this._unsubscribeReported();
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
    // The control line is the card itself; see the class comment.
    const { features: _features, levels: _levels, ...base } = config;
    this.base = base;
    // A new battery list or stale_after needs a template of its own.
    this._unsubscribeReported();
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
    if (!entityId) return;
    void this.hass
      .callService(entityId.split(".")[0], "set_value", {
        entity_id: entityId,
        value: event.detail.value,
      })
      .catch(() => undefined);
  }

  /** Set by a long press so the click that follows it is not taken as a tap. */
  private _held = false;

  private _holdTimer?: ReturnType<typeof setTimeout>;

  private _periodDown(): void {
    this._held = false;
    clearTimeout(this._holdTimer);
    // The same 500 ms the stock tile waits before calling a press a hold.
    this._holdTimer = setTimeout(() => {
      this._held = true;
      if (this._config?.pulse_every) this.fireMoreInfo(this._config.pulse_every);
    }, 500);
  }

  private _periodUp(): void {
    clearTimeout(this._holdTimer);
  }

  private _periodTap(event: Event): void {
    event.stopPropagation();
    if (this._held) {
      this._held = false;
      return;
    }
    const entityId = this._config?.pulse_every;
    if (!entityId || !this.hass) return;
    const value = nextPeriod(
      this._number(entityId),
      this._number(entityId, "step") ?? 1,
      this._number(entityId, "min") ?? 1,
      this._number(entityId, "max") ?? 48
    );
    void this.hass
      .callService(entityId.split(".")[0], "set_value", { entity_id: entityId, value })
      .catch(() => undefined);
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
      resolveRole(hass, config.pulse_every),
      // A battery list is fine with one of its sensors gone, not with all.
      ids.every((id) => !hass.states[id]) ? resolveRole(hass, ids[0]) : undefined,
    ]);
    if (warning) return this.renderWarning(warning);

    const { entityId: levelId, level } = pickLevel(hass, ids);
    const mainId = levelId ?? ids[0];
    // undefined, not false, when there is no port: "not charging" would be a guess.
    const on = sw ? sw.stateObj?.state === "on" : undefined;
    const forceObj = config.force ? hass.states[config.force] : undefined;
    const forced = forceObj?.state === "active";
    const left = minutesLeft(forceObj?.attributes.finishes_at as string | undefined, now);
    const min = this._number(config.min);
    const max = this._number(config.max);
    const status = chargeStatus({
      forced,
      minutesLeft: left,
      fresh: isFresh(hass, ids, config.stale_after, now, this._reported),
      on,
      pulse: Boolean(config.pulse_every),
      min,
      max,
      since: this._reported ?? lastReport(hass, ids),
    });

    const levelObj = hass.states[mainId];
    const tile = this.renderTile({
      icon: "mdi:watch",
      // Lit while the port is on; the battery itself is always "active". With
      // no port there is nothing to be on, and the icon takes the battery colour.
      color: sw
        ? on
          ? tileColor(sw.stateObj)
          : "var(--state-inactive-color)"
        : levelColor(level),
      primary: config.name ?? levelObj?.attributes.friendly_name ?? t(hass, "charge.title"),
      secondary: composeSegments([
        unavailableSegment(hass, sw) ??
          (status
            ? {
                text: t(hass, status.key, status.params),
                entityId: forced ? config.force : (config.switch ?? mainId),
              }
            : undefined),
      ]),
      mainEntityId: mainId,
      // With a port the icon switches it by hand — the card works without the
      // automation too. The action names the port itself: the card's main
      // entity is the battery, and a toggle aimed at a sensor does nothing.
      defaultIconAction: config.switch
        ? { action: "toggle", entity: config.switch }
        : defaultIconAction(mainId),
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
          .charging=${on ?? false}
          @limit-change=${this._setLimit}
        ></horos-charge-range>
        ${config.pulse_every && this._controlsReady
          ? html`<ha-control-button
              .label=${t(hass, "charge.everyLabel")}
              title=${t(hass, "charge.everyLabel")}
              @pointerdown=${this._periodDown}
              @pointerup=${this._periodUp}
              @pointercancel=${this._periodUp}
              @pointerleave=${this._periodUp}
              @click=${this._periodTap}
            >
              <span class="force">
                <ha-icon icon="mdi:timer-sync-outline"></ha-icon>
                ${t(hass, "charge.every", {
                  hours: this._number(config.pulse_every) ?? "—",
                })}
              </span>
            </ha-control-button>`
          : nothing}
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
