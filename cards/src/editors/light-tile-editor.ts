import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  entitySelector,
  booleanSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosLightTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "group";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "lights", required: true, selector: { entity: { multiple: true, filter: { domain: "light" } } } },
      { name: "group", selector: entitySelector("light") },
      { name: "brightness", selector: booleanSelector },
      contentSection("group", lang),
      interactionsSection("group", "toggle"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        lights: "Лампы",
        group: "Группа (главная сущность)",
        brightness: "Слайдер яркости группы",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        lights: "Lights",
        group: "Group (the main entity)",
        brightness: "Brightness slider for the group",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      lights: entityIdsOf(config.lights as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      lights: mergeEntityList<EntityItem>(
        this._config?.lights as (EntityItem | string)[] | undefined,
        (data.lights as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-light-tile-editor", HorosLightTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-light-tile-editor": HorosLightTileEditor;
  }
}
