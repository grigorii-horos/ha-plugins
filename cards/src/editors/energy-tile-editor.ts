import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  entitySelector,
  numberSelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-energy-tile-editor")
export class HorosEnergyTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      { name: "total", selector: entitySelector("sensor", "power") },
      {
        name: "consumers",
        required: true,
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "power" }],
          },
        },
      },
      { name: "limit", selector: numberSelector(1, 12) },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название",
      total: "Общая мощность",
      consumers: "Потребители",
      limit: "Сколько показывать",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      consumers: entityIdsOf(config.consumers as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      consumers: mergeEntityList<CartridgeConfig>(
        this._config?.consumers as (CartridgeConfig | string)[] | undefined,
        (data.consumers as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-energy-tile-editor": HorosEnergyTileEditor;
  }
}
