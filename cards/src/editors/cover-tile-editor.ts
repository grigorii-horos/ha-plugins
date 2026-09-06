import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  booleanSelector,
  contentSection,
  interactionsSection,
  bigValuesSelector,
  entitySelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";

export class HorosCoverTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "cover";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "cover", required: true, selector: entitySelector("cover") },
      { name: "position", selector: entitySelector("sensor") },
      {
        name: "illuminance",
        selector: entitySelector("sensor", "illuminance"),
      },
      { name: "battery", selector: entitySelector("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      contentSection("cover", lang, [
        {
          name: "big_values",
          selector: bigValuesSelector([
            {
              value: "illuminance",
              label: lang === "ru" ? "Освещённость" : "Illuminance",
            },
            { value: "battery", label: lang === "ru" ? "Заряд" : "Battery" },
          ]),
        },
        { name: "levels", selector: booleanSelector },
      ]),
      interactionsSection("cover", "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        levels: "Строка положения",
        name: "Название",
        cover: "Штора",
        position: "Насколько открыто",
        illuminance: "Освещённость",
        battery: "Заряд",
        controls: "Кнопки управления",
        big_values: "Крупно справа (не больше трёх)",
      },
      en: {
        ...COMMON_LABELS_EN,
        levels: "Position row",
        name: "Name",
        cover: "Cover",
        position: "Position",
        illuminance: "Illuminance",
        battery: "Battery",
        controls: "Controls",
        big_values: "Large on the right (up to three)",
      },
    });
  }
}

registerEditor("horos-cover-tile-editor", HorosCoverTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-cover-tile-editor": HorosCoverTileEditor;
  }
}
