import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  bigValuesSelector,
  entitySelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosAirTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "appliance";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      {
        name: "appliance",
        required: true,
        selector: {
          entity: {
            filter: [
              { domain: "fan" },
              { domain: "humidifier" },
              { domain: "switch" },
            ],
          },
        },
      },
      { name: "pm25", selector: entitySelector("sensor", "pm25") },
      { name: "humidity", selector: entitySelector("sensor", "humidity") },
      { name: "temperature", selector: entitySelector("sensor", "temperature") },
      { name: "power", selector: entitySelector("sensor", "power") },
      { name: "sensors", selector: { entity: { multiple: true } } },
      {
        name: "alerts",
        selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor" }] } },
      },
      contentSection("appliance", lang, [
        {
          name: "big_values",
          selector: bigValuesSelector([
            { value: "pm25", label: "PM2.5" },
            { value: "humidity", label: lang === "ru" ? "Влажность" : "Humidity" },
            { value: "temperature", label: lang === "ru" ? "Температура" : "Temperature" },
            { value: "power", label: lang === "ru" ? "Мощность" : "Power" },
          ]),
        },
      ]),
      interactionsSection("appliance", "toggle"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        appliance: "Прибор",
        pm25: "PM2.5",
        humidity: "Влажность",
        temperature: "Температура",
        power: "Мощность",
        sensors: "Что ещё сказать",
        alerts: "Сообщать, когда сработало",
        big_values: "Крупно справа (не больше трёх)",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        appliance: "Appliance",
        pm25: "PM2.5",
        humidity: "Humidity",
        temperature: "Temperature",
        power: "Power",
        sensors: "What else to show",
        alerts: "Report only when triggered",
        big_values: "Large on the right (up to three)",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (EntityItem | string)[]),
      alerts: entityIdsOf(config.alerts as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      sensors: mergeEntityList<EntityItem>(
        this._config?.sensors as (EntityItem | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
      alerts: mergeEntityList<EntityItem>(
        this._config?.alerts as (EntityItem | string)[] | undefined,
        (data.alerts as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-air-tile-editor", HorosAirTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-air-tile-editor": HorosAirTileEditor;
  }
}
