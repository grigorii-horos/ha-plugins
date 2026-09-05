import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  entitySelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosPersonTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "person";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      {
        name: "person",
        required: true,
        selector: {
          entity: {
            filter: [{ domain: "person" }, { domain: "device_tracker" }],
          },
        },
      },
      { name: "battery", selector: entitySelector("sensor", "battery") },
      { name: "location", selector: entitySelector("sensor") },
      {
        name: "devices",
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "battery" }],
          },
        },
      },
      contentSection("person", lang),
      interactionsSection("person", "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Имя",
        person: "Человек",
        battery: "Заряд основного устройства",
        location: "Где именно",
        devices: "Остальные устройства",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        person: "Person",
        battery: "Main device battery",
        location: "Location",
        devices: "Other devices",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      devices: entityIdsOf(config.devices as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      devices: mergeEntityList<EntityItem>(
        this._config?.devices as (EntityItem | string)[] | undefined,
        (data.devices as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-person-tile-editor", HorosPersonTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-person-tile-editor": HorosPersonTileEditor;
  }
}
