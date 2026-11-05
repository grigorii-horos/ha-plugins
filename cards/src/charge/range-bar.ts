import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { levelColor } from "../core/labels";
import { clampLimit } from "./charge";

type Which = "min" | "max";

/**
 * The charge tile's control line: the battery level as a fill, the two charging
 * limits as handles on the same scale.
 *
 * Home Assistant has no two-handle slider feature, so this one is ours. It
 * writes nothing itself: it fires `limit-change` once a drag ends (or once per
 * arrow key), and the card calls the service. A write on every pointer move
 * would send dozens of `set_value` calls per drag, each one re-running the
 * charging automation.
 *
 * The scale is the battery's 0–100 %, not the helper's own min/max: a handle
 * stands where that charge level is on the fill.
 */
export class HorosChargeRange extends LitElement {
  @property({ type: Number }) public level?: number;
  @property({ type: Number }) public min?: number;
  @property({ type: Number }) public max?: number;
  @property({ type: Number }) public step = 1;
  /** The range the limit entities accept. */
  @property({ type: Number }) public lo = 0;
  @property({ type: Number }) public hi = 100;
  @property({ type: Boolean }) public charging = false;

  /**
   * The track's width in px, kept by a ResizeObserver: whether both numbers fit
   * inside the band depends on pixels, not on percentages.
   */
  @state() public trackWidth = 0;

  private _resize?: ResizeObserver;

  public connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver === "undefined") return;
    this._resize = new ResizeObserver((entries) => {
      this.trackWidth = entries[0]?.contentRect.width ?? 0;
    });
    this._resize.observe(this);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resize?.disconnect();
    this._resize = undefined;
  }

  /** The value of the handle being dragged, before it is written. */
  @state() private _drag?: { which: Which; value: number };

  static styles = css`
    :host {
      display: block;
      height: var(--feature-height, 42px);
    }

    .track {
      position: relative;
      height: 100%;
      border-radius: var(--feature-border-radius, 12px);
      overflow: hidden;
      touch-action: none;
    }

    /* The empty part of the scale, tinted with the fill's own colour as level bars are. */
    .track::before {
      content: "";
      position: absolute;
      inset: 0;
      background-color: var(--ink);
      opacity: 0.2;
    }

    .fill {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      background-color: var(--ink);
      transition: width 400ms ease-in-out;
    }

    /*
     * Charging: the shimmer of levels.ts, copied value for value. It is the
     * household's one way of saying "charging" (ha-smart-charging draws the same);
     * keep the two in step.
     */
    .fill.charging {
      background-image: linear-gradient(
        90deg,
        rgb(255 255 255 / 0) 0%,
        rgb(255 255 255 / 0.3) 50%,
        rgb(255 255 255 / 0) 100%
      );
      background-size: 200% 100%;
      animation: level-charging 2s linear infinite;
    }

    @keyframes level-charging {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }

    /* The band the automation leaves alone. */
    .band {
      position: absolute;
      inset-block: 0;
      background-color: var(--primary-text-color);
      opacity: 0.08;
      pointer-events: none;
    }

    /*
     * A handle: a wide transparent hit area (a 6px pill is too thin for a
     * finger) around a visible pill.
     */
    .handle {
      position: absolute;
      inset-block: 0;
      width: 24px;
      transform: translateX(-50%);
      cursor: ew-resize;
      outline: none;
    }

    .handle::after {
      content: "";
      position: absolute;
      inset-block: 25%;
      inset-inline-start: 9px;
      width: 6px;
      border-radius: var(--ha-border-radius-pill, 9999px);
      background-color: var(--primary-text-color);
    }

    .handle:focus-visible::after {
      box-shadow: 0 0 0 2px var(--primary-color);
    }

    .label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--ha-font-size-s, 12px);
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      pointer-events: none;
      white-space: nowrap;
    }

    /*
     * Inside the band, where the ends of the scale cannot cut them off; when the
     * band is too narrow for two numbers they step outside the handles instead.
     */
    .label.min {
      transform: translate(10px, -50%);
    }

    .label.max {
      transform: translate(calc(-100% - 10px), -50%);
    }

    .label.min.outside {
      transform: translate(calc(-100% - 10px), -50%);
    }

    .label.max.outside {
      transform: translate(10px, -50%);
    }

    @media (prefers-reduced-motion: reduce) {
      .fill {
        transition: none;
      }

      .fill.charging {
        animation: none;
      }
    }
  `;

  private _value(which: Which): number | undefined {
    return this._drag?.which === which ? this._drag.value : this[which];
  }

  private _other(which: Which): number | undefined {
    return this._value(which === "min" ? "max" : "min");
  }

  private _clamp(which: Which, value: number): number {
    return clampLimit(which, value, this._other(which), this.step, this.lo, this.hi);
  }

  private _emit(which: Which, value: number): void {
    if (value === this[which]) return;
    this.dispatchEvent(
      new CustomEvent("limit-change", {
        detail: { which, value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onKey(which: Which, event: KeyboardEvent): void {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? this.step
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -this.step
          : 0;
    const current = this[which];
    if (!delta || current === undefined) return;
    event.preventDefault();
    this._emit(which, this._clamp(which, current + delta));
  }

  private _valueAt(event: PointerEvent): number {
    const track = this.shadowRoot!.querySelector(".track") as HTMLElement;
    const rect = track.getBoundingClientRect();
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 0;
    return Math.min(1, Math.max(0, ratio)) * 100;
  }

  private _onDown(which: Which, event: PointerEvent): void {
    if (this[which] === undefined) return;
    // The tile underneath would take the press for a tap on the card.
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._drag = { which, value: this[which]! };
  }

  private _onMove(which: Which, event: PointerEvent): void {
    if (this._drag?.which !== which) return;
    this._drag = { which, value: this._clamp(which, this._valueAt(event)) };
  }

  private _onUp(which: Which, event: PointerEvent): void {
    if (this._drag?.which !== which) return;
    event.stopPropagation();
    const { value } = this._drag;
    this._drag = undefined;
    this._emit(which, value);
  }

  /**
   * Whether the two numbers fit between the handles: each is about 2.5em of
   * text plus the 10px gap to its handle. Unknown width counts as fitting.
   */
  private _labelsOutside(): boolean {
    const min = this._value("min");
    const max = this._value("max");
    if (!this.trackWidth || min === undefined || max === undefined) return false;
    return ((max - min) / 100) * this.trackWidth < 64;
  }

  private _handle(which: Which, outside: boolean) {
    const value = this._value(which);
    if (value === undefined) return nothing;
    const position = `${Math.min(100, Math.max(0, value))}%`;
    return html`
      <div
        class="handle ${which}"
        role="slider"
        tabindex="0"
        aria-label=${which}
        aria-valuemin=${this.lo}
        aria-valuemax=${this.hi}
        aria-valuenow=${value}
        style=${styleMap({ left: position })}
        @keydown=${(event: KeyboardEvent) => this._onKey(which, event)}
        @pointerdown=${(event: PointerEvent) => this._onDown(which, event)}
        @pointermove=${(event: PointerEvent) => this._onMove(which, event)}
        @pointerup=${(event: PointerEvent) => this._onUp(which, event)}
        @pointercancel=${() => (this._drag = undefined)}
        @click=${(event: Event) => event.stopPropagation()}
      ></div>
      <span class="label ${which} ${outside ? "outside" : ""}" style=${styleMap({ left: position })}
        >${value}</span
      >
    `;
  }

  protected render() {
    const level = this.level;
    const min = this._value("min");
    const max = this._value("max");
    const outside = this._labelsOutside();
    return html`
      <div class="track" style=${styleMap({ "--ink": levelColor(level) })}>
        <div
          class="fill ${this.charging ? "charging" : ""}"
          style=${styleMap({ width: `${Math.min(100, Math.max(0, level ?? 0))}%` })}
        ></div>
        ${min !== undefined && max !== undefined
          ? html`<div
              class="band"
              style=${styleMap({ left: `${min}%`, width: `${max - min}%` })}
            ></div>`
          : nothing}
        ${this._handle("min", outside)} ${this._handle("max", outside)}
      </div>
    `;
  }
}

if (!customElements.get("horos-charge-range")) {
  customElements.define("horos-charge-range", HorosChargeRange);
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-charge-range": HorosChargeRange;
  }
}
