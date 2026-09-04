import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  bigValuesSelector,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";

@customElement("horos-cover-tile-editor")
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
    return {
      ...COMMON_LABELS,
      name: "Название",
      cover: "Штора",
      position: "Насколько открыто",
      illuminance: "Освещённость",
      battery: "Заряд",
      controls: "Кнопки управления",
      big_values: "Крупно справа (не больше трёх)",
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-cover-tile-editor": HorosCoverTileEditor;
  }
}
