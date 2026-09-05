import {
  BaseCardEditor,
  appearanceSection,
  bigValuesSelector,
  entitySelector,
  numberSelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";
import { registerEditor } from "../core/register";

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
    return this.pick({
      ru: {
        name: "Название",
        moisture: "Влажность почвы",
        temperature: "Температура почвы",
        battery: "Заряд датчика",
        dry_below: "Ниже этого — сухо",
        wet_above: "Выше этого — залито",
        big_values: "Крупно справа (не больше двух)",
      },
      en: {
        name: "Name",
        moisture: "Soil moisture",
        temperature: "Soil temperature",
        battery: "Sensor battery",
        dry_below: "Dry below",
        wet_above: "Wet above",
        big_values: "Large on the right (up to two)",
      },
    });
  }
}

registerEditor("horos-plant-tile-editor", HorosPlantTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-plant-tile-editor": HorosPlantTileEditor;
  }
}
