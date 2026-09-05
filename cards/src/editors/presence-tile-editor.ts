import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  FormCardEditor,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosPresenceTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      {
        name: "areas",
        required: true,
        selector: {
          entity: {
            multiple: true,
            filter: [
              { domain: "binary_sensor", device_class: "occupancy" },
              { domain: "binary_sensor", device_class: "presence" },
              { domain: "binary_sensor", device_class: "motion" },
            ],
          },
        },
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        areas: "Зоны",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        areas: "Areas",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      areas: entityIdsOf(config.areas as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      areas: mergeEntityList<EntityItem>(
        this._config?.areas as (EntityItem | string)[] | undefined,
        (data.areas as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-presence-tile-editor", HorosPresenceTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-presence-tile-editor": HorosPresenceTileEditor;
  }
}
