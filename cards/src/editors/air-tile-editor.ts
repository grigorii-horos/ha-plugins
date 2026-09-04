import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  bigValuesSelector,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-air-tile-editor")
export class HorosAirTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
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
      {
        name: "big_values",
        selector: bigValuesSelector([
          { value: "pm25", label: "PM2.5" },
          { value: "humidity", label: "Влажность" },
          { value: "temperature", label: "Температура" },
          { value: "power", label: "Мощность" },
        ]),
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название",
      appliance: "Прибор",
      pm25: "PM2.5",
      humidity: "Влажность",
      temperature: "Температура",
      power: "Мощность",
      sensors: "Что ещё сказать",
      alerts: "Сообщать, когда сработало",
      big_values: "Крупно справа (не больше трёх)",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (CartridgeConfig | string)[]),
      alerts: entityIdsOf(config.alerts as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      sensors: mergeEntityList<CartridgeConfig>(
        this._config?.sensors as (CartridgeConfig | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
      alerts: mergeEntityList<CartridgeConfig>(
        this._config?.alerts as (CartridgeConfig | string)[] | undefined,
        (data.alerts as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-air-tile-editor": HorosAirTileEditor;
  }
}
