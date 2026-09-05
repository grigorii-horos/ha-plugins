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

export class HorosTasksTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "lists", required: true, selector: { entity: { multiple: true, filter: { domain: "todo" } } } },
      { name: "calendar", selector: entitySelector("calendar") },
      contentSection(undefined, lang),
      interactionsSection(undefined, "more-info"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        lists: "Списки дел",
        calendar: "Календарь",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        lists: "To-do lists",
        calendar: "Calendar",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      lists: entityIdsOf(config.lists as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      lists: mergeEntityList<EntityItem>(
        this._config?.lists as (EntityItem | string)[] | undefined,
        (data.lists as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-tasks-tile-editor", HorosTasksTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-tasks-tile-editor": HorosTasksTileEditor;
  }
}
