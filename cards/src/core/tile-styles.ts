import { css } from "lit";

/**
 * Своих стилей здесь минимум.
 *
 * Геометрия, типографика, ripple, кольцо фокуса и раскладка приходят из
 * компонентов HA — `ha-tile-container`, `ha-tile-icon`, `ha-tile-info`.
 * Ниже только то, чего у плитки нет: правая колонка с крупными значениями,
 * отдельные цели тапа и плашка ошибки.
 *
 * Блок про фокус и цвет иконки — из `tile-card-style.ts` штатной плитки.
 */
export const tileStyles = css`
  :host {
    --tile-color: var(--state-inactive-color, #7b7b7b);
    display: block;
  }

  ha-card {
    height: 100%;
    transition:
      box-shadow 180ms ease-in-out,
      border-color 180ms ease-in-out;
  }

  ha-card:has(ha-tile-container[focused]) {
    --shadow-default: var(--ha-card-box-shadow, 0 0 0 0 transparent);
    --shadow-focus: 0 0 0 1px var(--tile-color);
    border-color: var(--tile-color);
    box-shadow: var(--shadow-default), var(--shadow-focus);
  }

  ha-tile-icon {
    --tile-icon-color: var(--tile-color);
  }

  hui-card-features {
    --feature-color: var(--tile-color);
  }

  /* Тексты и правая колонка стоят в одной строке слота info. */
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    min-width: 0;
    gap: 6px;
  }

  .info ha-tile-info {
    flex: 1;
    min-width: 0;
  }

  .info.vertical {
    flex-direction: column;
    gap: 0;
  }

  /*
   * Единственное отступление от канона tile: главные значения вынесены в
   * правую колонку крупным шрифтом. Каждое следующее значение опускает шрифт
   * на ступень, иначе колонка съедает имя карточки.
   */
  .values {
    flex: none;
    display: flex;
    align-items: baseline;
    gap: 4px;
    white-space: nowrap;
    color: var(--primary-text-color);
    font-size: var(--ha-font-size-xl, 20px);
    line-height: var(--ha-line-height-condensed, 1.2);
  }

  .values.of-2 {
    font-size: var(--ha-font-size-l, 16px);
  }

  .values.of-3 {
    font-size: var(--ha-font-size-m, 14px);
    gap: 2px;
  }

  .values-separator {
    color: var(--secondary-text-color);
  }

  .unit {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
  }

  /*
   * Второе отступление: величины кликабельны по отдельности, тап по каждой
   * открывает more-info её сущности. Содержимое плитки событий не принимает,
   * поэтому цели тапа включают их обратно.
   */
  .clickable {
    cursor: pointer;
    pointer-events: auto;
  }
  .clickable:hover {
    opacity: 0.7;
  }

  /* Своя линия features: те же отступы, что у штатного ряда. */
  .custom-features {
    display: block;
    padding: 0 var(--ha-space-3, 12px) var(--ha-space-3, 12px);
    pointer-events: auto;
  }

  .warning {
    display: block;
    padding: var(--ha-space-3, 12px);
    color: var(--warning-color, #ffa600);
    font-size: var(--ha-font-size-m, 14px);
  }
`;
