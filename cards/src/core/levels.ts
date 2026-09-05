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
  /** Bar fill, 0..100. */
  level: number;
  /** Needs attention. */
  alarm?: boolean;
  /** The alarm glyph: running out and overflowing get different ones. */
  alarmIcon?: string;
}

export const levelStyles = css`
  .levels {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
  }

  .level {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    width: 100%;
    padding: 2px 0;
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
   * A fraction, not auto width: otherwise names of different lengths drag the
   * bars around and the row stops reading as one scale.
   */
  .level .name {
    flex: 0 0 34%;
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

  /* The bar as in the stock hui-bar-gauge-card-feature, only thinner. */
  .level .bar {
    flex: 1 1 auto;
    display: flex;
    height: 8px;
    border-radius: var(--ha-border-radius-pill, 9999px);
    overflow: hidden;
  }

  .level .bar .fill {
    background-color: var(--ink);
    transition: width 400ms ease-in-out;
  }

  .level .bar .rest {
    flex: 1;
    background-color: var(--ink);
    opacity: 0.2;
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
  }
`;

export function renderLevels(
  rows: LevelRow[],
  onTap: (entityId: string) => void
): TemplateResult {
  return html`
    <div class="levels">
      ${rows.map(
        (row) => html`
          <button
            class="level ${row.alarm ? "low" : ""}"
            style="--ink: ${row.ink};"
            title="${row.name}: ${row.text}"
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
                : nothing}${row.name}
            </span>
            <span class="bar">
              <span
                class="fill"
                style="width: ${Math.max(0, Math.min(100, row.level))}%"
              ></span>
              <span class="rest"></span>
            </span>
            <span class="value">${row.text}</span>
          </button>
        `
      )}
    </div>
  `;
}
