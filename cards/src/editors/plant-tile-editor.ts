import {
  BaseCardEditor,
  contentSection,
  bigValuesSelector,
  entitySelector,
  numberSelector,
  interactionsSection,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { plantFeatures, type PlantTileConfig } from "../cards/plant-tile";

export class HorosPlantTileEditor extends BaseCardEditor {
  protected get entityField(): string {
    return "moisture";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
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
      contentSection("moisture", lang, [
        {
          name: "big_values",
          selector: bigValuesSelector([
            { value: "moisture", label: lang === "ru" ? "Влажность почвы" : "Soil moisture" },
            { value: "temperature", label: lang === "ru" ? "Температура почвы" : "Soil temperature" },
            { value: "battery", label: lang === "ru" ? "Заряд датчика" : "Sensor battery" },
          ]),
        },
      ]),
      interactionsSection("moisture", "none"),
    ];
  }

  protected override defaultFeatures(): Record<string, unknown>[] {
    const config = this._config as unknown as PlantTileConfig | undefined;
    return plantFeatures(this.hass, config);
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
