import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  numberSelector,
  booleanSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";

export class HorosUpdatesTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "limit", selector: numberSelector(1, 20) },
      { name: "include_skipped", selector: booleanSelector },
      { name: "ignore", selector: { entity: { multiple: true, filter: { domain: "update" } } } },
      contentSection(undefined, lang),
      interactionsSection(undefined, "more-info"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        limit: "Сколько называть поимённо",
        include_skipped: "Считать и пропущенные версии",
        ignore: "Не считать",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        limit: "How many to name",
        include_skipped: "Count skipped versions too",
        ignore: "Do not count",
      },
    });
  }
}

registerEditor("horos-updates-tile-editor", HorosUpdatesTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-updates-tile-editor": HorosUpdatesTileEditor;
  }
}
