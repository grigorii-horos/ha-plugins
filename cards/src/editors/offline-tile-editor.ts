import {
  BaseCardEditor,
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  contentSection,
  interactionsSection,
  numberSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";

export class HorosOfflineTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "limit", selector: numberSelector(1, 12) },
      { name: "ignore", selector: { entity: { multiple: true } } },
      contentSection(undefined, lang),
      interactionsSection(undefined, "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        limit: "Сколько устройств называть",
        ignore: "Молчание этих — норма",
      },
      en: {
        ...COMMON_LABELS_EN,
        limit: "How many devices to name",
        ignore: "Silence of these is normal",
      },
    });
  }
}

registerEditor("horos-offline-tile-editor", HorosOfflineTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-offline-tile-editor": HorosOfflineTileEditor;
  }
}
