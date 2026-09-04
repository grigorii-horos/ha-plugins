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

@customElement("horos-vacuum-tile-editor")
export class HorosVacuumTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      { name: "vacuum", required: true, selector: entitySelector("vacuum") },
      { name: "battery", selector: entitySelector("sensor", "battery") },
      { name: "sensors", selector: { entity: { multiple: true } } },
      { name: "consumables", selector: { entity: { multiple: true } } },
      { name: "low_below", selector: numberSelector(0, 100, "%") },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название",
      vacuum: "Пылесос",
      battery: "Заряд",
      sensors: "Что ещё сказать",
      consumables: "Расходники",
      low_below: "Просит замены ниже",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (CartridgeConfig | string)[]),
      consumables: entityIdsOf(config.consumables as (CartridgeConfig | string)[]),
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
      consumables: mergeEntityList<CartridgeConfig>(
        this._config?.consumables as (CartridgeConfig | string)[] | undefined,
        (data.consumables as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-vacuum-tile-editor": HorosVacuumTileEditor;
  }
}
