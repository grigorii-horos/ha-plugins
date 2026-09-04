import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-safety-tile-editor")
export class HorosSafetyTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      {
        name: "sensors",
        required: true,
        selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor" }] } },
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название",
      sensors: "Датчики",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (CartridgeConfig | string)[]),
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
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-safety-tile-editor": HorosSafetyTileEditor;
  }
}
