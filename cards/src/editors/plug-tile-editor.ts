import {
  BaseCardEditor,
  contentSection,
  bigValuesSelector,
  entitySelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { plugFeatures, type PlugTileConfig } from "../cards/plug-tile";

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

  protected override defaultFeatures(): Record<string, unknown>[] {
    const config = this._config as unknown as PlugTileConfig | undefined;
    return plugFeatures(config);
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        name: "Название",
        switch: "Выключатель",
        power: "Мощность",
        energy: "Энергия",
        big_values: "Крупно справа (не больше двух)",
      },
      en: {
        name: "Name",
        switch: "Switch",
        power: "Power",
        energy: "Energy",
        big_values: "Large on the right (up to two)",
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
