import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-printer-tile-editor")
export class HorosPrinterTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      { name: "icon", selector: { icon: {} } },
      { name: "status", selector: entitySelector("sensor") },
      {
        name: "cartridges",
        required: true,
        selector: { entity: { multiple: true, filter: [{ domain: "sensor" }] } },
      },
      {
        name: "low_below",
        selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } },
      },
      {
        name: "sensors",
        selector: { entity: { multiple: true } },
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название принтера",
      status: "Состояние принтера",
      cartridges: "Картриджи",
      low_below: "Мало чернил ниже",
      sensors: "Прочее про принтер",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      cartridges: entityIdsOf(
        config.cartridges as (CartridgeConfig | string)[]
      ),
      sensors: entityIdsOf(config.sensors as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      cartridges: mergeEntityList<CartridgeConfig>(
        this._config?.cartridges as (CartridgeConfig | string)[] | undefined,
        (data.cartridges as string[]) ?? []
      ),
      sensors: mergeEntityList<CartridgeConfig>(
        this._config?.sensors as (CartridgeConfig | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-printer-tile-editor": HorosPrinterTileEditor;
  }
}
