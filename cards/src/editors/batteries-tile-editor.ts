import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  numberSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosBatteriesTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
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
      contentSection(undefined, lang),
      interactionsSection(undefined, "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        batteries: "Батарейки",
        low_below: "Показывать ниже",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        batteries: "Batteries",
        low_below: "Show below",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      batteries: entityIdsOf(config.batteries as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      batteries: mergeEntityList<EntityItem>(
        this._config?.batteries as (EntityItem | string)[] | undefined,
        (data.batteries as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-batteries-tile-editor", HorosBatteriesTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-batteries-tile-editor": HorosBatteriesTileEditor;
  }
}
