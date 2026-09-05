import {
  BaseCardEditor,
  contentSection,
  bigValuesSelector,
  booleanSelector,
  entitySelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";

export class HorosPlugTileEditor extends BaseCardEditor {
  protected get entityField(): string {
    return "switch";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "switch", required: true, selector: entitySelector("switch") },
      { name: "power", selector: entitySelector("sensor", "power") },
      { name: "energy", selector: entitySelector("sensor", "energy") },
      { name: "toggle_button", selector: booleanSelector },
      contentSection("switch", lang, [
        {
          name: "big_values",
          selector: bigValuesSelector([
            { value: "power", label: lang === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: lang === "ru" ? "Энергия" : "Energy" },
            { value: "switch", label: lang === "ru" ? "Состояние" : "State" },
          ]),
        },
      ]),
      interactionsSection("switch", "toggle"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        name: "Название",
        switch: "Выключатель",
        power: "Мощность",
        energy: "Энергия",
        big_values: "Крупно справа (не больше двух)",
        toggle_button: "Кнопка переключения под строкой",
      },
      en: {
        name: "Name",
        switch: "Switch",
        power: "Power",
        energy: "Energy",
        big_values: "Large on the right (up to two)",
        toggle_button: "Toggle button below the row",
      },
    });
  }
}

registerEditor("horos-plug-tile-editor", HorosPlugTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-plug-tile-editor": HorosPlugTileEditor;
  }
}
