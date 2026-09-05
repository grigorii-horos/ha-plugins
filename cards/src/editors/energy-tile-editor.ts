import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  entitySelector,
  numberSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosEnergyTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "total";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
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
      contentSection("total", lang),
      interactionsSection("total", "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        total: "Общая мощность",
        consumers: "Потребители",
        limit: "Сколько показывать",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        total: "Total power",
        consumers: "Consumers",
        limit: "How many to show",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      consumers: entityIdsOf(config.consumers as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      consumers: mergeEntityList<EntityItem>(
        this._config?.consumers as (EntityItem | string)[] | undefined,
        (data.consumers as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-energy-tile-editor", HorosEnergyTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-energy-tile-editor": HorosEnergyTileEditor;
  }
}
