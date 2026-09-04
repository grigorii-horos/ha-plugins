import { customElement } from "lit/decorators.js";
import {
  BaseCardEditor,
  appearanceSection,
  bigValuesSelector,
  entitySelector,
  numberSelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";

@customElement("horos-plant-tile-editor")
export class HorosPlantTileEditor extends BaseCardEditor {
  protected get entityField(): string {
    return "moisture";
  }

  protected get schema(): SchemaItem[] {
    return [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "moisture" },
      },
      {
        name: "moisture",
        required: true,
        selector: entitySelector("sensor", "moisture"),
      },
      {
        name: "temperature",
        selector: entitySelector("sensor", "temperature"),
      },
      { name: "battery", selector: entitySelector("sensor", "battery") },
      { name: "dry_below", selector: numberSelector(0, 100, "%") },
      { name: "wet_above", selector: numberSelector(0, 100, "%") },
      {
        name: "big_values",
        selector: bigValuesSelector([
          { value: "moisture", label: "Влажность почвы" },
          { value: "temperature", label: "Температура почвы" },
          { value: "battery", label: "Заряд датчика" },
        ]),
      },
      appearanceSection("moisture"),
      interactionsSection("moisture", "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      name: "Название",
      moisture: "Влажность почвы",
      temperature: "Температура почвы",
      battery: "Заряд датчика",
      dry_below: "Ниже этого — сухо",
      wet_above: "Выше этого — залито",
      big_values: "Крупно справа (не больше двух)",
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-plant-tile-editor": HorosPlantTileEditor;
  }
}
