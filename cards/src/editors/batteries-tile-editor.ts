import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  numberSelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-batteries-tile-editor")
export class HorosBatteriesTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      {
        name: "batteries",
        required: true,
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "battery" }],
          },
        },
      },
      { name: "low_below", selector: numberSelector(0, 100, "%") },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название",
      batteries: "Батарейки",
      low_below: "Показывать ниже",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      batteries: entityIdsOf(config.batteries as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      batteries: mergeEntityList<CartridgeConfig>(
        this._config?.batteries as (CartridgeConfig | string)[] | undefined,
        (data.batteries as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-batteries-tile-editor": HorosBatteriesTileEditor;
  }
}
