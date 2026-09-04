import { customElement } from "lit/decorators.js";
import {
  BaseCardEditor,
  appearanceSection,
  bigValuesSelector,
  entitySelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";

@customElement("horos-climate-tile-editor")
export class HorosClimateTileEditor extends BaseCardEditor {
  protected get entityField(): string {
    return "temperature";
  }

  protected get schema(): SchemaItem[] {
    return [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "temperature" },
      },
      {
        name: "temperature",
        required: true,
        selector: entitySelector("sensor", "temperature"),
      },
      { name: "humidity", selector: entitySelector("sensor", "humidity") },
      {
        name: "illuminance",
        selector: entitySelector("sensor", "illuminance"),
      },
      { name: "pm25", selector: entitySelector("sensor", "pm25") },
      {
        name: "big_values",
        selector: bigValuesSelector([
          { value: "temperature", label: "Температура" },
          { value: "humidity", label: "Влажность" },
          { value: "illuminance", label: "Освещённость" },
          { value: "pm25", label: "PM2.5" },
        ]),
      },
      appearanceSection("temperature"),
      interactionsSection("temperature", "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      name: "Название",
      temperature: "Температура",
      humidity: "Влажность",
      illuminance: "Освещённость",
      pm25: "PM2.5",
      big_values: "Крупно справа (не больше двух)",
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-climate-tile-editor": HorosClimateTileEditor;
  }
}
