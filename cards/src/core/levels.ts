import { css, html, nothing, type TemplateResult } from "lit";

/**
 * Строки уровней — линия features, где каждый уровень показан горизонтальной
 * полосой с подписью слева и значением справа.
 *
 * Приём взят у бакового принтера: спереди у него прозрачные ёмкости, и уровень
 * в них видно глазом. Первая версия рисовала их вертикальными колбами в один
 * ряд, но на высоте штатной линии features пять колб превращались в полоски,
 * в которых ничего не разобрать. Горизонтальная строка даёт то же самое —
 * заливку до уровня цветом содержимого, — но с подписью и числом.
 *
 * Работает везде, где несколько однородных уровней надо увидеть вместе:
 * чернила принтера, расходники пылесоса, батарейки устройств, загрузка
 * компьютера.
 */

export interface LevelRow {
  entityId: string;
  /** Подпись слева. */
  name: string;
  /** Что написано справа: «50 %», «нет данных». */
  text: string;
  /** CSS-цвет заливки. */
  ink: string;
  /** Заполненность полосы 0..100. */
  level: number;
  /** Требует внимания. */
  alarm?: boolean;
  /** Значок тревоги: у кончающегося и у переполненного он разный. */
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
   * Доля, а не автоширина: иначе имена разной длины растаскивают полосы, и
   * ряд перестаёт читаться как одна шкала.
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

  /* Полоса как у штатной hui-bar-gauge-card-feature, только тоньше. */
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
