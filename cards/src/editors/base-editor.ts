import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "../core/types";
import { ensureFeaturesEditor } from "../core/ha-internals";
import { languageOf } from "../core/i18n";

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

  /**
   * Подписи на языке пользователя. Держим их парой прямо у карточки, а не в
   * общем словаре: одно и то же поле в разных карточках называется по-разному —
   * «Заряд», «Заряд датчика», «Заряд основного устройства».
   */
  protected pick(dicts: {
    ru: Record<string, string>;
    en: Record<string, string>;
  }): Record<string, string> {
    return languageOf(this.hass) === "ru" ? dicts.ru : dicts.en;
  }

  /** Подсказки под полями. У штатной плитки такая есть под цветом. */
  protected _computeHelper = (item: SchemaItem): string | undefined =>
    item.name === "color"
      ? this.pick({
          ru: {
            color:
              "Неактивное состояние (например, off или closed) окрашено не будет.",
          },
          en: {
            color:
              "Inactive state (for example, off or closed) will not be coloured.",
          },
        }).color
      : undefined;

  protected _computeLabel = (item: SchemaItem): string =>
    this.labels[item.name] ??
    this.pick({ ru: COMMON_LABELS_RU, en: COMMON_LABELS_EN })[item.name] ??
    item.name;

  protected fireConfigChanged(config: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected _valueChanged(ev: CustomEvent): void {
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
        .computeHelper=${this._computeHelper}
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

  /**
   * Имя поля конфига с главной сущностью. У карточек, собранных из списка
   * равноправных сущностей, её нет — тогда features не предлагаются: их
   * нечему адресовать.
   */
  protected abstract get entityField(): string | undefined;

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

  /** Раздел features повторяет разметку редактора штатной плитки. */
  private _renderFeatures() {
    const entityId = this.entityField
      ? (this._config?.[this.entityField] as string | undefined)
      : undefined;
    if (!entityId) return nothing;

    const features = (this._config?.features ?? []) as unknown[];
    const labels = this.pick({ ru: COMMON_LABELS_RU, en: COMMON_LABELS_EN });
    const positions = this.pick({
      ru: { bottom: "Снизу", inline: "В строке" },
      en: { bottom: "Bottom", inline: "Inline" },
    });

    return html`
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:list-box"></ha-icon>
        <h3 slot="header">${labels.features}</h3>
        <div class="content">
          <hui-card-features-editor
            .hass=${this.hass}
            .context=${{ entity_id: entityId }}
            .features=${features}
            @features-changed=${this._featuresChanged}
          ></hui-card-features-editor>
          ${features.length
            ? html`
                <ha-form
                  .hass=${this.hass}
                  .data=${this._config}
                  .schema=${[
                    {
                      name: "features_position",
                      required: true,
                      selector: {
                        select: {
                          mode: "box",
                          options: [
                            { value: "bottom", label: positions.bottom },
                            { value: "inline", label: positions.inline },
                          ],
                        },
                      },
                    },
                  ]}
                  .computeLabel=${this._computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              `
            : nothing}
        </div>
      </ha-expansion-panel>
    `;
  }

  protected override render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      ${this.renderForm()}
      ${this._featuresEditorReady ? this._renderFeatures() : nothing}
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
export const contentSection = (
  /**
   * Поле с главной сущностью. У части карточек её нет вовсе — батарейки,
   * присутствие, безопасность собраны из списка равноправных сущностей, —
   * и тогда имя вводится обычным текстом, а иконке нечего подсказывать.
   */
  entityField: string | undefined,
  language: string,
  /** Наше расширение раздела: что вынести крупно вправо. */
  extra: SchemaItem[] = []
): SchemaItem => ({
  name: "content",
  type: "expandable",
  flatten: true,
  icon: "mdi:text-short",
  schema: [
    entityField
      ? {
          name: "name",
          selector: { entity_name: {} },
          context: { entity: entityField },
        }
      : { name: "name", selector: { text: {} } },
    {
      name: "",
      type: "grid",
      schema: [
        {
          name: "icon",
          selector: { icon: {} },
          ...(entityField ? { context: { icon_entity: entityField } } : {}),
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
    ...(entityField
      ? [
          {
            name: "state_content",
            selector: { ui_state_content: { allow_context: true } },
            context: { filter_entity: entityField },
          },
          { name: "time_format", selector: { ui_time_format: {} } },
        ]
      : []),
    {
      name: "content_layout",
      required: true,
      selector: {
        select: {
          mode: "box",
          options: [
            {
              value: "horizontal",
              label: language === "ru" ? "Горизонтальная" : "Horizontal",
              image: {
                src: "/static/images/form/tile_content_layout_horizontal.svg",
                src_dark:
                  "/static/images/form/tile_content_layout_horizontal_dark.svg",
                flip_rtl: true,
              },
            },
            {
              value: "vertical",
              label: language === "ru" ? "Вертикальная" : "Vertical",
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
    ...extra,
  ],
});

const actionContext = (entityField: string | undefined) =>
  entityField ? { entity_id: entityField, area_id: "area" } : undefined;

export const interactionsSection = (
  entityField: string | undefined,
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

export const COMMON_LABELS_RU: Record<string, string> = {
  content: "Содержимое",
  state_content: "Что показывать про сущность",
  time_format: "Формат времени",
  interactions: "Взаимодействия",
  icon: "Иконка",
  color: "Цвет",
  content_layout: "Раскладка",
  show_entity_picture: "Показывать картинку сущности",
  hide_state: "Скрыть состояние",
  features: "Features",
  features_position: "Расположение features",
  tap_action: "Тап по карточке",
  hold_action: "Долгое нажатие на карточку",
  double_tap_action: "Двойной тап по карточке",
  icon_tap_action: "Тап по иконке",
  icon_hold_action: "Долгое нажатие на иконку",
  icon_double_tap_action: "Двойной тап по иконке",
};

export const COMMON_LABELS_EN: Record<string, string> = {
  content: "Content",
  state_content: "State content",
  time_format: "Time format",
  interactions: "Interactions",
  icon: "Icon",
  color: "Colour",
  content_layout: "Layout",
  show_entity_picture: "Show entity picture",
  hide_state: "Hide state",
  features: "Features",
  features_position: "Features position",
  tap_action: "Tap on card",
  hold_action: "Hold on card",
  double_tap_action: "Double tap on card",
  icon_tap_action: "Tap on icon",
  icon_hold_action: "Hold on icon",
  icon_double_tap_action: "Double tap on icon",
};

/** Прежнее имя: подписи по умолчанию для тех, кто ещё не переведён. */
export const COMMON_LABELS = COMMON_LABELS_RU;

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

/**
 * Выбор ролей для правой колонки. Варианты приходят парой языков: подписи
 * внутри селектора HA не переводит, это наши строки.
 */
export const bigValuesSelector = (
  options: { value: string; label: string }[]
): Record<string, unknown> => ({
  select: { multiple: true, mode: "list", options },
});

export const booleanSelector: Record<string, unknown> = { boolean: {} };
