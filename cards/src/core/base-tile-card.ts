import {
  LitElement,
  html,
  nothing,
  type CSSResultGroup,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";
import { tileStyles } from "./tile-styles";
import type { HomeAssistant, HassEntity } from "./types";
import {
  SECONDARY_SEPARATOR,
  UNAVAILABLE_STATES,
  splitValueUnit,
  type ResolvedRole,
  type Segment,
} from "./format";
import type { KeyedRole } from "./big-values";
import {
  handleAction,
  hasAction,
  type ActionConfig,
  type ActionType,
} from "./actions";
import { ensureTileInternals } from "./ha-internals";
import { ROLE_ICONS } from "./role-icons";

export interface FormattedValue {
  value: string;
  unit?: string;
  /** Чья это величина: тап по ней открывает more-info именно этой сущности. */
  entityId?: string;
  /**
   * Иконка величины. «63%» само по себе может быть влажностью, зарядом или
   * местом на диске — иконка называет её, не занимая места под слово.
   */
  icon?: string;
}

export type FeaturesPosition = "bottom" | "inline";

/** Общие для всех карточек поля конфига — те же имена, что у штатного tile. */
export interface TileBaseConfig {
  name?: string;
  icon?: string;
  color?: string;
  vertical?: boolean;
  hide_state?: boolean;
  show_entity_picture?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  icon_tap_action?: ActionConfig;
  icon_hold_action?: ActionConfig;
  icon_double_tap_action?: ActionConfig;
  features?: Record<string, unknown>[];
  features_position?: FeaturesPosition;
}

export interface TileParts {
  icon: string;
  /** CSS-цвет для --tile-color; undefined оставляет нейтральный. */
  color?: string;
  primary: string;
  secondary?: Segment[];
  /** Главная сущность: к ней относятся действия карточки. */
  mainEntityId?: string;
  imageUrl?: string;
  /** Действие иконки по умолчанию, когда icon_tap_action не задан. */
  defaultIconAction?: ActionConfig;
  values?: FormattedValue[];
  /**
   * Features самой карточки — например шкала влажности у растения. Работают,
   * пока пользователь не задал свои: его список полностью замещает наш.
   */
  ownFeatures?: Record<string, unknown>[];
  /**
   * Своя линия features, когда штатной не хватает. Занимает то же место и ту
   * же высоту, что ряд features у плитки.
   */
  customFeatures?: TemplateResult;
}

/**
 * Общий каркас всех карточек.
 *
 * Вёрстка не своя: карточка собирается из компонентов штатной плитки HA.
 * `ha-tile-container` даёт подложку, ripple, распознавание жестов, индикатор
 * долгого нажатия и кольцо фокуса; `ha-tile-icon` и `ha-tile-info` — иконку и
 * тексты; `hui-card-features` — ряд features.
 *
 * Своего здесь только то, чего у плитки нет: правая колонка с крупными
 * значениями и отдельная цель тапа у каждой величины.
 */
export abstract class BaseTileCard extends LitElement {
  // Массив, а не одиночный CSSResult: наследники дописывают к нему свои стили.
  static styles: CSSResultGroup = [tileStyles];

  @property({ attribute: false }) public hass?: HomeAssistant;

  /** Компоненты HA подгружаются асинхронно, отсюда перерисовка. */
  @state() private _ready = false;

  /** Общие поля конфига. Наследник обязан их сюда положить в setConfig. */
  protected base: TileBaseConfig = {};

  private _entityId?: string;

  private _defaultIconAction?: ActionConfig;

  public getCardSize(): number {
    return 1;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    ensureTileInternals().then((ready) => {
      this._ready = ready;
    });
  }

  protected fireMoreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ---- действия --------------------------------------------------------

  private _handleAction(ev: CustomEvent): void {
    this._runAction(ev.detail.action as ActionType, false);
  }

  private _handleIconAction(ev: CustomEvent): void {
    ev.stopPropagation();
    this._runAction(ev.detail.action as ActionType, true);
  }

  private _runAction(action: ActionType, fromIcon: boolean): void {
    if (!this.hass) return;
    const config = fromIcon
      ? {
          entity: this._entityId,
          tap_action: this.base.icon_tap_action ?? this._defaultIconAction,
          hold_action: this.base.icon_hold_action,
          double_tap_action: this.base.icon_double_tap_action,
        }
      : {
          entity: this._entityId,
          tap_action: this.base.tap_action,
          hold_action: this.base.hold_action,
          double_tap_action: this.base.double_tap_action,
        };
    handleAction(this, this.hass, config, action);
  }

  // ---- отрисовка -------------------------------------------------------

  /** Плашка вместо карточки: конфиг невалиден или сущности нет в HA. */
  protected renderWarning(message: string): TemplateResult {
    return html`<ha-card><div class="warning">${message}</div></ha-card>`;
  }

  /** Сообщение о ненайденных сущностях, либо undefined если всё на месте. */
  protected missingRolesWarning(
    roles: (ResolvedRole | undefined)[]
  ): string | undefined {
    const missing = roles
      .filter((role): role is ResolvedRole => !!role && role.missing)
      .map((role) => role.entityId);
    if (!missing.length) return undefined;
    return missing.length === 1
      ? `Сущность не найдена: ${missing[0]}`
      : `Сущности не найдены: ${missing.join(", ")}`;
  }

  /**
   * Оборачивает величину в собственную цель тапа. Клик не всплывает до
   * подложки, поэтому открывается more-info этой сущности, а не главной.
   */
  protected renderClickable(
    content: unknown,
    entityId: string | undefined
  ): TemplateResult {
    if (!entityId) return html`<span>${content}</span>`;
    return html`<span
      class="clickable"
      @click=${(ev: Event) => {
        ev.stopPropagation();
        this.fireMoreInfo(entityId);
      }}
      >${content}</span
    >`;
  }

  protected renderTile(parts: TileParts): TemplateResult {
    const {
      icon,
      color,
      primary,
      secondary,
      mainEntityId,
      imageUrl,
      defaultIconAction,
      values,
      ownFeatures,
      customFeatures,
    } = parts;

    this._entityId = mainEntityId;
    this._defaultIconAction = defaultIconAction;

    if (!this._ready) {
      return this.renderWarning(
        "Не удалось загрузить компоненты Home Assistant"
      );
    }

    const tileColor = this.base.color
      ? cssColor(this.base.color)
      : (color ?? "var(--state-inactive-color)");

    const iconAction = this.base.icon_tap_action ?? defaultIconAction;
    const hasIconAction =
      hasAction(iconAction) ||
      hasAction(this.base.icon_hold_action) ||
      hasAction(this.base.icon_double_tap_action);

    // Список пользователя полностью замещает собственные features карточки.
    const features = this.base.features?.length
      ? this.base.features
      : ownFeatures;
    const position: FeaturesPosition = this.base.features_position ?? "bottom";

    return html`
      <ha-card style="--tile-color: ${tileColor};">
        <ha-tile-container
          .featurePosition=${position}
          .vertical=${Boolean(this.base.vertical)}
          .interactive=${true}
          .actionHandlerOptions=${{
            hasHold: hasAction(this.base.hold_action),
            hasDoubleClick: hasAction(this.base.double_tap_action),
          }}
          @action=${this._handleAction}
        >
          <ha-tile-icon
            slot="icon"
            class=${imageUrl ? "image" : ""}
            .interactive=${hasIconAction}
            .imageUrl=${imageUrl}
            .icon=${this.base.icon ?? icon}
            .actionHandlerOptions=${{
              hasHold: hasAction(this.base.icon_hold_action),
              hasDoubleClick: hasAction(this.base.icon_double_tap_action),
            }}
            @action=${this._handleIconAction}
          ></ha-tile-icon>

          <div slot="info" class="info ${this.base.vertical ? "vertical" : ""}">
            <ha-tile-info>
              <span slot="primary">${primary}</span>
              ${secondary?.length && !this.base.hide_state
                ? html`<span slot="secondary"
                    >${secondary.map(
                      (segment, index) => html`
                        ${index
                          ? html`<span>${SECONDARY_SEPARATOR}</span>`
                          : nothing}${this.renderClickable(
                          segment.text,
                          segment.entityId
                        )}
                      `
                    )}</span
                  >`
                : nothing}
            </ha-tile-info>
            ${values?.length
              ? html`<div class="values of-${values.length}">
                  ${values.map(
                    (item, index) => html`
                      ${index
                        ? html`<span class="values-separator">/</span>`
                        : nothing}
                      ${this.renderClickable(
                        html`${item.icon
                          ? html`<ha-icon
                              class="value-icon"
                              .icon=${item.icon}
                            ></ha-icon>`
                          : nothing}${item.value}${item.unit
                          ? html`<span class="unit"> ${item.unit}</span>`
                          : nothing}`,
                        item.entityId
                      )}
                    `
                  )}
                </div>`
              : nothing}
          </div>

          ${customFeatures
            ? html`<div slot="features" class="custom-features">
                ${customFeatures}
              </div>`
            : nothing}
          ${features?.length
            ? html`<hui-card-features
                slot=${position === "inline" ? "features-inline" : "features"}
                .hass=${this.hass}
                .context=${{ entity_id: mainEntityId }}
                .features=${features}
                .position=${position}
              ></hui-card-features>`
            : nothing}
        </ha-tile-container>
      </ha-card>
    `;
  }

  /**
   * Значения правой колонки. `icons` называет величину по ключу роли: без неё
   * два процента подряд неотличимы друг от друга.
   */
  protected bigValues(
    big: KeyedRole[],
    icons: Record<string, string> = ROLE_ICONS
  ): FormattedValue[] {
    return big
      .map((item): FormattedValue | undefined => {
        const formatted = this.formatted(item.role?.stateObj);
        return formatted
          ? {
              ...formatted,
              entityId: item.role?.entityId,
              icon: icons[item.key],
            }
          : undefined;
      })
      .filter((value): value is FormattedValue => !!value);
  }

  /**
   * Адрес картинки сущности — та же логика, что в _getImageUrl штатной плитки.
   * Камеры с их отдельным адресом по размеру не поддерживаются.
   */
  protected entityImage(stateObj: HassEntity | undefined): string | undefined {
    if (!this.base.show_entity_picture || !this.hass || !stateObj) {
      return undefined;
    }
    const picture =
      (stateObj.attributes.entity_picture_local as string | undefined) ||
      (stateObj.attributes.entity_picture as string | undefined);
    return picture ? this.hass.hassUrl(picture) : undefined;
  }

  /** Готовое к показу крупное значение. У недоступной сущности его нет. */
  protected formatted(
    stateObj: HassEntity | undefined
  ): FormattedValue | undefined {
    if (!this.hass || !stateObj) return undefined;
    if (UNAVAILABLE_STATES.has(stateObj.state)) return undefined;
    return splitValueUnit(
      this.hass.formatEntityState(stateObj),
      stateObj.attributes.unit_of_measurement
    );
  }
}

/** Цвет из конфига: имя палитры HA, "primary" или готовый CSS-цвет. */
export function cssColor(color: string): string {
  if (/^(#|rgb|hsl|var\()/.test(color)) return color;
  if (color === "state") return "var(--state-icon-color)";
  return `var(--${color}-color, var(--state-icon-color))`;
}
