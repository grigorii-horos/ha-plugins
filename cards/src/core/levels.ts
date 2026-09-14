import { css, html, nothing, type TemplateResult } from "lit";

/**
 * Level rows — a features line where every level is a horizontal bar with a
 * label on the left and a value on the right.
 *
 * The idea comes from a tank printer: it has transparent tanks on the front and
 * you read the level by eye. The first version drew them as vertical flasks in a
 * row, but at the height of a stock features line five flasks turned into
 * slivers with nothing to make out. A horizontal row gives the same thing — a
 * fill up to the level in the colour of the contents — plus a label and a number.
 *
 * It works anywhere several homogeneous levels have to be seen together:
 * printer ink, vacuum consumables, device batteries, computer load.
 */

export interface LevelRow {
  entityId: string;
  /** The label on the left. */
  name: string;
  /** What is written on the right: "50 %", "no data". */
  text: string;
  /** CSS fill colour. */
  ink: string;
  /** Where the fill ends, 0..100. */
  level: number;
  /**
   * Where the fill starts, 0..100. A tank is full from the bottom and has none;
   * a day of weather is a span between its night and its afternoon, and a bar
   * that started at zero would say the night was the reading.
   */
  from?: number;
  /** A glyph before the name, in the row's own colour: the day's condition. */
  icon?: string;
  /** Needs attention. */
  alarm?: boolean;
  /** The alarm glyph: running out and overflowing get different ones. */
  alarmIcon?: string;
  /** On the charger: the bar has a light running along it. */
  charging?: boolean;
  /** The lower cutoff to mark on the track, 0..100. */
  minLimit?: number;
  /** The upper cutoff to mark on the track, 0..100. */
  maxLimit?: number;
  /**
   * What the marks mean, in the interface language. The words are composed by
   * the card because `hass` lives there; this module holds none of its own, so
   * the two plugins that share it can keep different dictionaries.
   */
  limitsText?: string;
}

export interface LevelsOptions {
  /**
   * The width of the label column, any CSS length.
   *
   * A third of the row by default — that is what a room name or a device name
   * needs. A card whose labels are known to be short (a weekday) asks for less,
   * otherwise the bars start a third of the way in with nothing beside them.
   */
  nameWidth?: string;
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

export const levelStyles = css`
  /*
   * The rows fill whatever height they are given and spread evenly in it —
   * the same thing hui-card-features does with its own spare room, so a list
   * of rows and a stack of features behave alike on a card of a fixed height.
   */
  .levels {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: var(--ha-space-1, 4px);
    height: 100%;
    min-height: 0;
  }

  /*
   * A row is its line of text and nothing more — no padding of its own.
   *
   * Three rows have to fit in one layout row, which is 64px of content: 3 * 14
   * of text plus two 4px gaps and the 12px of padding under the last one comes
   * to 62. Padding on the row itself pushed that to 74, and a card told to be
   * two rows tall then had its list spill over the bottom edge — the padding
   * under the last bar disappeared and the bar sat on the card's border.
   *
   * padding: 0 is written out because a button without it takes the browser's
   * own 1px 6px and the bars stop lining up with the texts above.
   */
  .level {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    cursor: pointer;
    border-radius: var(--ha-border-radius-sm, 6px);
  }

  .level:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 2px;
  }

  /*
   * One width for every row, not auto: otherwise names of different lengths
   * drag the bars around and the list stops reading as one scale. A fraction
   * of the row by default, because a name is as long as the card is wide; a
   * card with short labels sets --level-name to a length of its own.
   */
  .level .name {
    flex: 0 0 var(--level-name, 34%);
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .level .name ha-icon {
    flex: none;
    color: var(--error-color, #db4437);
    --mdc-icon-size: 14px;
  }

  /* The row's own glyph is not an alarm and is not painted like one. */
  .level .name ha-icon.mark {
    color: var(--ink);
  }

  /*
   * The bar as in the stock hui-bar-gauge-card-feature, only thinner.
   *
   * The fill is placed on the track rather than flowing before it: a span has
   * to start away from the left edge, and a flex row can only grow from it.
   */
  .level .bar {
    flex: 1 1 auto;
    position: relative;
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    overflow: hidden;
  }

  .level .bar .track {
    position: absolute;
    inset: 0;
    background-color: var(--ink);
    opacity: 0.2;
  }

  /*
   * The fill is a pill of its own, not a rectangle the track happens to round
   * off. Clipping alone rounds only the end that touches the track's edge, so
   * a battery bar came out with a knife-cut right end while a weather span next
   * to it was rounded at both — one list of bars, two shapes.
   */
  .level .bar .fill {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    background-color: var(--ink);
    transition:
      width 400ms ease-in-out,
      inset-inline-start 400ms ease-in-out;
  }

  /*
   * A span is never thinner than it is tall: a day whose night and afternoon
   * are the same would otherwise have no bar at all. A level starts at zero and
   * has no such floor — an empty tank must be able to show nothing.
   */
  .level .bar .fill.span {
    min-width: 8px;
  }

  /*
   * Charging: a shimmer runs along the fill.
   *
   * Taken as is from ha-smart-charging, which draws its own battery bars on the
   * same dashboards: a soft white band twice the width of the bar, drifting at
   * an even pace. Two plugins of ours must not have two different ways of
   * saying "charging" next to each other. What is deliberately not taken is
   * that card's pulsing thumb at the end of the fill — a level row is a scale
   * to be read, not a slider to be dragged.
   */
  .level .bar .fill.charging {
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

  /*
   * The cutoffs: where a charge is topped up from and where it is stopped.
   *
   * Taken from ha-smart-charging, whose socket rows draw the same two marks —
   * a level row and a socket row show the same battery on one dashboard, so a
   * limit must look the same in both. Two thin marks and no band between them:
   * at eight pixels of height a translucent band only muddies the fill colour,
   * which is the thing actually being read.
   */
  .level .bar .tick-min,
  .level .bar .tick-max {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    border-radius: 1px;
    z-index: 2;
    transform: translateX(-50%);
  }

  .level .bar .tick-min {
    background: var(--info-color, #0288d1);
  }

  .level .bar .tick-max {
    background: var(--primary-text-color);
    opacity: 0.85;
  }

  .level .value {
    flex: none;
    min-width: 3.2em;
    text-align: end;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
  }

  .level.low .value {
    color: var(--error-color, #db4437);
  }

  @media (prefers-reduced-motion: reduce) {
    .level .bar .fill {
      transition: none;
    }

    /* Motion is off, but charging still has to be visible: the band stands still. */
    .level .bar .fill.charging {
      animation: none;
    }
  }
`;

export function renderLevels(
  rows: LevelRow[],
  onTap: (entityId: string) => void,
  options?: LevelsOptions
): TemplateResult {
  return html`
    <div
      class="levels"
      style=${options?.nameWidth
        ? `--level-name: ${options.nameWidth};`
        : nothing}
    >
      ${rows.map(
        (row) => html`
          <button
            class="level ${row.alarm ? "low" : ""}"
            style="--ink: ${row.ink};"
            title="${row.name}: ${row.text}${row.limitsText
              ? ` · ${row.limitsText}`
              : ""}"
            @click=${(ev: Event) => {
              ev.stopPropagation();
              onTap(row.entityId);
            }}
          >
            <span class="name">
              ${row.alarm
                ? html`<ha-icon
                    icon=${row.alarmIcon ?? "mdi:alert-circle"}
                  ></ha-icon>`
                : row.icon
                  ? html`<ha-icon class="mark" icon=${row.icon}></ha-icon>`
                  : nothing}${row.name}
            </span>
            <span class="bar">
              <span class="track"></span>
              <span
                class="fill ${row.from === undefined ? "" : "span"} ${row.charging
                  ? "charging"
                  : ""}"
                style="inset-inline-start: ${clamp(
                  row.from ?? 0
                )}%; width: ${Math.max(
                  0,
                  clamp(row.level) - clamp(row.from ?? 0)
                )}%"
              ></span>
              ${row.minLimit === undefined
                ? nothing
                : html`<span
                    class="tick-min"
                    style="inset-inline-start: ${clamp(row.minLimit)}%"
                  ></span>`}
              ${row.maxLimit === undefined
                ? nothing
                : html`<span
                    class="tick-max"
                    style="inset-inline-start: ${clamp(row.maxLimit)}%"
                  ></span>`}
            </span>
            <span class="value">${row.text}</span>
          </button>
        `
      )}
    </div>
  `;
}
