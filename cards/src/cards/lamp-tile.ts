import { css, html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { tileColor } from "../core/state-color";
import {
  composeSegments,
  resolveRole,
  roleSegment,
  unavailableSegment,
} from "../core/format";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import { buttonLabel, type ButtonConfig } from "../core/buttons";
import { handleAction } from "../core/actions";
import { ensureControls } from "../core/ha-internals";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";

/** The steps a lamp is nudged by, in the order they belong on the row. */
const STEPS = [
  { key: "dim", icon: "mdi:brightness-4" },
  { key: "bright", icon: "mdi:brightness-7" },
  { key: "warm", icon: "mdi:weather-sunset" },
  { key: "cold", icon: "mdi:snowflake" },
] as const;

export type LampStep = (typeof STEPS)[number]["key"];

export interface LampTileConfig extends TileBaseConfig {
  type: string;
  /**
   * Where the lamp's state lives, if anywhere: an `input_boolean` somebody
   * flips alongside the script, a plug, a real light. Without it the card says
   * nothing about the state, because an infrared lamp tells nobody anything.
   */
  state?: string;
  /** What the icon runs. Without it the icon toggles `state`, if there is one. */
  power?: string;
  /** One script per step; the row shows only the ones that are set. */
  dim?: string;
  bright?: string;
  warm?: string;
  cold?: string;
  /** Whole looks: night mode, full brightness, a colour cycle. */
  presets?: (ButtonConfig | string)[];
  /**
   * Where the current look is kept, if anything keeps it: an `input_select` set
   * by the same script. It only decides which preset is drawn as chosen.
   */
  preset_state?: string;
  /** Anything else worth a word: a brightness helper, the last preset used. */
  sensors?: (EntityItem | string)[];
  /** The stock brightness slider, when `state` is a real light. On by default. */
  brightness?: boolean;
  /** Names next to the preset icons. On by default: five icons say nothing. */
  preset_labels?: boolean;
}

/**
 * A lamp that is driven by scripts, drawn as a lamp rather than as a keypad.
 *
 * Infrared lamps and cheap strips have nothing to switch: they are a remote
 * control, and Home Assistant reaches them through one script per press —
 * brighter, dimmer, warmer, night mode. Laid out as a grid of square buttons
 * that is eight cards for one lamp, and it reads as a keypad, not as a light.
 *
 * So the scripts go in as roles, not as a list: `bright` and `dim` are the two
 * halves of one control, `warm` and `cold` of another, presets are the looks
 * the lamp can take. The card then draws them in Home Assistant's own control
 * language — the button group its cover feature uses, the segmented selector
 * its climate modes use — so a script lamp sits next to a real light without
 * announcing that it is a lesser thing.
 *
 * The state stays a separate, optional role on purpose: with an infrared lamp
 * nobody knows whether it is on, and a card must not pretend otherwise.
 */
export class HorosLampTile extends BaseTileCard {
  static styles = [
    tileStyles,
    css`
      /*
       * The sizes are the stock feature's own: hui-card-features sets these
       * variables for the features it hosts, and our row lives outside it.
       */
      .lamp-controls {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
        pointer-events: auto;
      }

      ha-control-button-group {
        --control-button-group-spacing: 12px;
        --control-button-group-thickness: 42px;
      }

      ha-control-button-group > ha-control-button {
        flex-basis: 20px;
        --control-button-padding: 0px;
      }

      ha-control-button {
        --control-button-border-radius: 12px;
        --control-button-focus-color: var(--tile-color);
      }

      ha-control-select {
        --control-select-color: var(--tile-color);
        --control-select-padding: 0;
        --control-select-thickness: 42px;
        --control-select-border-radius: 12px;
        --control-select-button-border-radius: 12px;
      }
    `,
  ];

  @state() private _config?: LampTileConfig;

  /** The controls come with the feature bundles, which load on their own time. */
  @state() private _controlsReady = false;

  public connectedCallback(): void {
    super.connectedCallback();
    void ensureControls().then((ready) => {
      this._controlsReady = ready;
    });
  }

  protected override contentRows(): number {
    const config = this._config;
    if (!config) return 0;
    const rows =
      (STEPS.some(({ key }) => config[key]) ? 1 : 0) +
      (config.presets?.length ? 1 : 0);
    // Every row of controls is about half a grid row tall.
    return Math.ceil(rows / 2);
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/lamp-tile-editor");
    return document.createElement(
      "horos-lamp-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<LampTileConfig> {
    return { bright: "", dim: "" };
  }

  public setConfig(config: LampTileConfig): void {
    const hasAnything =
      STEPS.some(({ key }) => config[key]) ||
      config.presets?.length ||
      config.power;
    if (!hasAnything) {
      throw new Error(
        "A lamp needs at least one script: bright, dim, warm, cold, power or presets"
      );
    }
    this.base = config;
    this._config = config;
  }

  /** Runs a script the way a tap action would, confirmations and all. */
  private _run(entityId: string): void {
    if (!this.hass) return;
    void handleAction(
      this,
      this.hass,
      {
        tap_action: {
          action: "perform-action",
          perform_action: "homeassistant.turn_on",
          target: { entity_id: entityId },
        },
      },
      "tap"
    );
  }

  private _stepLabel(key: LampStep): string {
    return t(this.hass, `lamp.${key}`);
  }

  /** The two halves of brightness and of colour, in one stock button group. */
  private _renderSteps(config: LampTileConfig): TemplateResult | typeof nothing {
    const steps = STEPS.filter(({ key }) => config[key]);
    if (!steps.length) return nothing;
    return html`
      <ha-control-button-group>
        ${steps.map(
          ({ key, icon }) => html`
            <ha-control-button
              .label=${this._stepLabel(key)}
              @click=${() => this._run(config[key]!)}
            >
              <ha-icon .icon=${icon}></ha-icon>
            </ha-control-button>
          `
        )}
      </ha-control-button-group>
    `;
  }

  /** The looks the lamp can take, as the segmented selector HA uses for modes. */
  private _renderPresets(
    config: LampTileConfig
  ): TemplateResult | typeof nothing {
    if (!config.presets?.length) return nothing;
    const presets = config.presets.map((raw) =>
      typeof raw === "string" ? { entity: raw } : raw
    );
    const current = this.hass?.states[config.preset_state ?? ""]?.state;

    return html`
      <ha-control-select
        .options=${presets.map((preset) => {
          const stateObj = this.hass?.states[preset.entity];
          const label =
            preset.name ??
            buttonLabel(stateObj?.attributes.friendly_name) ??
            preset.entity;
          const icon =
            preset.icon ?? (stateObj?.attributes.icon as string | undefined);
          return {
            value: preset.entity,
            label,
            ariaLabel: label,
            icon: icon ? html`<ha-icon .icon=${icon}></ha-icon>` : undefined,
          };
        })}
        .value=${presets.find((preset) => preset.name === current)?.entity ??
        current}
        ?hide-option-label=${config.preset_labels === false}
        @value-changed=${(event: CustomEvent<{ value: string }>) =>
          this._run(event.detail.value)}
      >
      </ha-control-select>
    `;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const lamp = resolveRole(this.hass, config.state);
    const extras = (config.sensors ?? [])
      .map((raw) => normalizeItem(raw))
      .map((sensor) => resolveRole(this.hass, sensor.entity));

    const warning = this.missingRolesWarning([lamp, ...extras]);
    if (warning) return this.renderWarning(warning);

    const isLight = config.state?.startsWith("light.");

    return this.renderTile({
      icon: config.icon ?? "mdi:coach-lamp-variant",
      color: lamp ? tileColor(lamp.stateObj) : "var(--state-icon-color)",
      primary: config.name ?? t(this.hass, "lamp.title"),
      mainEntityId: lamp?.entityId,
      // The icon is the lamp's switch: it runs the power script where there is
      // one, and falls back to toggling whatever holds the state.
      defaultIconAction: config.power
        ? {
            action: "perform-action",
            perform_action: "homeassistant.turn_on",
            target: { entity_id: config.power },
          }
        : lamp
          ? { action: "toggle" }
          : { action: "none" },
      secondary: composeSegments([
        unavailableSegment(this.hass, lamp),
        this.mainStateSegment(lamp),
        ...extras.map((extra) => roleSegment(this.hass, extra)),
      ]),
      // A real light keeps its stock slider: nothing we draw beats it.
      ownFeatures:
        isLight && config.brightness !== false
          ? [{ type: "light-brightness" }]
          : undefined,
      customFeatures: this._controlsReady
        ? html`<div class="lamp-controls">
            ${this._renderSteps(config)}${this._renderPresets(config)}
          </div>`
        : undefined,
    });
  }
}

registerCard("horos-lamp-tile", HorosLampTile, {
  type: "horos-lamp-tile",
  name: { ru: "Лампа на скриптах", en: "Script lamp" },
  description: {
    ru: "ИК-лампа или лента: ярче, теплее и режимы — скриптами, но как у лампы",
    en: "An IR lamp or a strip: brighter, warmer and presets, driven by scripts",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-lamp-tile": HorosLampTile;
  }
}
