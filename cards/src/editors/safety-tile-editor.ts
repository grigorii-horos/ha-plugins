import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosSafetyTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      {
        name: "sensors",
        required: true,
        selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor" }] } },
      },
      contentSection(undefined, lang),
      interactionsSection(undefined, "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        sensors: "Датчики",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        sensors: "Sensors",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (EntityItem | string)[]),
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
    };
  }
}

registerEditor("horos-safety-tile-editor", HorosSafetyTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-safety-tile-editor": HorosSafetyTileEditor;
  }
}
