import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "../core/types";
import { ensureFeaturesEditor } from "../core/ha-internals";

export interface SchemaItem {
  name: string;
  required?: boolean;
  selector?: Record<string, unknown>;
  /** Раскрывающаяся группа или сетка — так же, как в редакторе штатной плитки. */
  type?: string;
  flatten?: boolean;
  icon?: string;
  schema?: SchemaItem[];
  /**
   * Связывает поле формы с сущностью карточки. Без этого редактор действий не
   * знает, к чему относится действие, и не подставляет сущность в more-info,
   * toggle и цель сервиса.
   */
  context?: Record<string, string>;
}

/**
 * Общая база GUI-редакторов: форма собирается из схемы, а не пишется руками.
 * Каждая роль карточки — свой ha-entity-picker, отфильтрованный по смыслу.
 */
/**
 * Минимальная форма: схема, подписи, ha-form. Ей пользуются карточки-сетки,
 * у которых нет ни ролей плитки, ни features.
 */
export abstract class FormCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected _config?: Record<string, unknown>;

  protected abstract get schema(): SchemaItem[];

  protected abstract get labels(): Record<string, string>;

  public setConfig(config: Record<string, unknown>): void {
    this._config = config;
  }

  /** Что показать форме. По умолчанию — сам конфиг. */
  protected get formData(): Record<string, unknown> {
    return this._config ?? {};
  }

  /** Что положить в конфиг из формы. */
  protected fromForm(data: Record<string, unknown>): Record<string, unknown> {
    return data;
  }

  private _computeLabel = (item: SchemaItem): string =>
    this.labels[item.name] ?? COMMON_LABELS[item.name] ?? item.name;

  protected fireConfigChanged(config: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this.fireConfigChanged(
      this.fromForm(ev.detail.value as Record<string, unknown>)
    );
  }

  protected renderForm() {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.formData}
        .schema=${this.schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  protected render() {
    return this.renderForm();
  }
}

export abstract class BaseCardEditor extends FormCardEditor {
  @state() private _featuresEditorReady = false;

  /** Имя поля конфига с главной сущностью — для контекста features. */
  protected abstract get entityField(): string;

  public connectedCallback(): void {
    super.connectedCallback();
    ensureFeaturesEditor().then((ready) => {
      this._featuresEditorReady = ready;
    });
  }

  /**
   * Форма показывает раскладку картинками (content_layout), а в конфиге лежит
   * булево vertical — ровно как в редакторе штатной плитки.
   */
  protected override get formData(): Record<string, unknown> {
    const { vertical, ...rest } = this._config ?? {};
    return {
      ...rest,
      content_layout: vertical ? "vertical" : "horizontal",
    };
  }

  private _featuresChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: {
          config: { ...this._config, features: ev.detail.features },
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const { content_layout, ...rest } = data;
    const config: Record<string, unknown> = { ...rest };
    if (content_layout === "vertical") config.vertical = true;
    return config;
  }

  protected override render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      ${this.renderForm()}
      ${this._featuresEditorReady
        ? html`
            <hui-card-features-editor
              .hass=${this.hass}
              .context=${{
                entity_id: this._config[this.entityField] as string,
              }}
              .features=${(this._config.features ?? []) as unknown[]}
              label="Features"
              @features-changed=${this._featuresChanged}
            ></hui-card-features-editor>
          `
        : nothing}
    `;
  }
}

/**
 * Разделы «Внешний вид» и «Взаимодействия» — общие для всех карточек, с теми
 * же именами полей, селекторами и контекстами, что в редакторе штатного tile.
 *
 * `entityField` — имя поля конфига с главной сущностью карточки. У штатной
 * плитки это всегда `entity`, у нас — роль: `switch`, `temperature`, `moisture`.
 */
export const appearanceSection = (entityField: string): SchemaItem => ({
  name: "appearance",
  type: "expandable",
  flatten: true,
  icon: "mdi:text-short",
  schema: [
    {
      name: "",
      type: "grid",
      schema: [
        {
          name: "icon",
          selector: { icon: {} },
          context: { icon_entity: entityField },
        },
        {
          name: "color",
          // include_state обязателен: без него значение "state" считается
          // недопустимым и поле подсвечивается как ошибочное.
          selector: { ui_color: { default_color: "state", include_state: true } },
        },
        { name: "show_entity_picture", selector: { boolean: {} } },
        { name: "hide_state", selector: { boolean: {} } },
      ],
    },
    {
      name: "content_layout",
      required: true,
      selector: {
        select: {
          mode: "box",
          options: [
            {
              value: "horizontal",
              label: "Горизонтальная",
              image: {
                src: "/static/images/form/tile_content_layout_horizontal.svg",
                src_dark:
                  "/static/images/form/tile_content_layout_horizontal_dark.svg",
                flip_rtl: true,
              },
            },
            {
              value: "vertical",
              label: "Вертикальная",
              image: {
                src: "/static/images/form/tile_content_layout_vertical.svg",
                src_dark:
                  "/static/images/form/tile_content_layout_vertical_dark.svg",
                flip_rtl: true,
              },
            },
          ],
        },
      },
    },
  ],
});

const actionContext = (entityField: string) => ({
  entity_id: entityField,
  area_id: "area",
});

export const interactionsSection = (
  entityField: string,
  defaultIconAction: string
): SchemaItem => ({
  name: "interactions",
  type: "expandable",
  flatten: true,
  icon: "mdi:gesture-tap",
  schema: [
    {
      name: "tap_action",
      selector: { ui_action: { default_action: "more-info" } },
      context: actionContext(entityField),
    },
    { name: "", type: "divider" },
    {
      name: "icon_tap_action",
      selector: { ui_action: { default_action: defaultIconAction } },
      context: actionContext(entityField),
    },
    {
      name: "",
      type: "optional_actions",
      flatten: true,
      schema: [
        "hold_action",
        "icon_hold_action",
        "double_tap_action",
        "icon_double_tap_action",
      ].map((name) => ({
        name,
        selector: { ui_action: { default_action: "none" } },
        context: actionContext(entityField),
      })),
    },
  ],
});

export const COMMON_LABELS: Record<string, string> = {
  appearance: "Внешний вид",
  interactions: "Взаимодействия",
  icon: "Иконка",
  color: "Цвет",
  content_layout: "Раскладка",
  show_entity_picture: "Картинка сущности",
  hide_state: "Скрыть вторичную строку",
  tap_action: "Тап по карточке",
  hold_action: "Долгое нажатие на карточку",
  double_tap_action: "Двойной тап по карточке",
  icon_tap_action: "Тап по иконке",
  icon_hold_action: "Долгое нажатие на иконку",
  icon_double_tap_action: "Двойной тап по иконке",
};

/** Селектор сущности, суженный до домена и класса устройства. */
export const entitySelector = (
  domain: string,
  deviceClass?: string
): Record<string, unknown> => ({
  entity: {
    filter: deviceClass ? { domain, device_class: deviceClass } : { domain },
  },
});

export const numberSelector = (
  min: number,
  max: number,
  unit?: string
): Record<string, unknown> => ({
  number: { min, max, mode: "box", unit_of_measurement: unit },
});

export const textSelector: Record<string, unknown> = { text: {} };

/** Выбор ролей для правой колонки: не больше двух, иначе строка разваливается. */
export const bigValuesSelector = (
  options: { value: string; label: string }[]
): Record<string, unknown> => ({
  select: { multiple: true, mode: "list", options },
});

export const booleanSelector: Record<string, unknown> = { boolean: {} };
