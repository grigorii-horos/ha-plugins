import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  FormCardEditor,
  entitySelector,
  numberSelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

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
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        vacuum: "Пылесос",
        battery: "Заряд",
        sensors: "Что ещё сказать",
        consumables: "Расходники",
        low_below: "Просит замены ниже",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        vacuum: "Vacuum",
        battery: "Battery",
        sensors: "What else to show",
        consumables: "Consumables",
        low_below: "Needs replacing below",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (EntityItem | string)[]),
      consumables: entityIdsOf(config.consumables as (EntityItem | string)[]),
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
      consumables: mergeEntityList<EntityItem>(
        this._config?.consumables as (EntityItem | string)[] | undefined,
        (data.consumables as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-vacuum-tile-editor", HorosVacuumTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-vacuum-tile-editor": HorosVacuumTileEditor;
  }
}
