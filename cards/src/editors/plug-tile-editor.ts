import { customElement } from "lit/decorators.js";
import {
  BaseCardEditor,
  appearanceSection,
  bigValuesSelector,
  booleanSelector,
  entitySelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";

@customElement("horos-plug-tile-editor")
export class HorosPlugTileEditor extends BaseCardEditor {
  protected get entityField(): string {
    return "switch";
  }

  protected get schema(): SchemaItem[] {
    return [
      {
        name: "name",
        selector: { entity_name: {} },
        context: { entity: "switch" },
      },
      { name: "switch", required: true, selector: entitySelector("switch") },
      { name: "power", selector: entitySelector("sensor", "power") },
      { name: "energy", selector: entitySelector("sensor", "energy") },
      {
        name: "big_values",
        selector: bigValuesSelector([
          { value: "power", label: "Мощность" },
          { value: "energy", label: "Энергия" },
          { value: "switch", label: "Состояние" },
        ]),
      },
      { name: "toggle_button", selector: booleanSelector },
      appearanceSection("switch"),
      interactionsSection("switch", "toggle"),
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      name: "Название",
      switch: "Выключатель",
      power: "Мощность",
      energy: "Энергия",
      big_values: "Крупно справа (не больше двух)",
      toggle_button: "Кнопка переключения под строкой",
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-plug-tile-editor": HorosPlugTileEditor;
  }
}
