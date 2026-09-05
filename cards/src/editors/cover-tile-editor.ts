import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  FormCardEditor,
  bigValuesSelector,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { registerEditor } from "../core/register";

export class HorosCoverTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      { name: "cover", required: true, selector: entitySelector("cover") },
      { name: "position", selector: entitySelector("sensor") },
      { name: "illuminance", selector: entitySelector("sensor", "illuminance") },
      { name: "battery", selector: entitySelector("sensor", "battery") },
      { name: "controls", selector: { boolean: {} } },
      {
        name: "big_values",
        selector: bigValuesSelector([
          { value: "illuminance", label: "Освещённость" },
          { value: "battery", label: "Заряд" },
        ]),
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
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
