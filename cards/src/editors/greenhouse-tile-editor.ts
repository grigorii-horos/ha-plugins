import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  booleanSelector,
  contentSection,
  interactionsSection,
  bigValuesSelector,
  entitySelector,
  numberSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { GreenhousePlant } from "../cards/greenhouse-tile";

export class HorosGreenhouseTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      {
        name: "plants",
        required: true,
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "moisture" }],
          },
        },
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "dry_below", selector: numberSelector(0, 100, "%") },
          { name: "wet_above", selector: numberSelector(0, 100, "%") },
        ],
      },
      {
        name: "temperature",
        selector: entitySelector("sensor", "temperature"),
      },
      { name: "humidity", selector: entitySelector("sensor", "humidity") },
      {
        name: "illuminance",
        selector: entitySelector("sensor", "illuminance"),
      },
      contentSection(undefined, lang, [
        {
          name: "big_values",
          selector: bigValuesSelector([
            {
              value: "temperature",
              label: lang === "ru" ? "Температура воздуха" : "Air temperature",
            },
            {
              value: "humidity",
              label: lang === "ru" ? "Влажность воздуха" : "Air humidity",
            },
            {
              value: "illuminance",
              label: lang === "ru" ? "Освещённость" : "Light",
            },
          ]),
        },
        { name: "levels", selector: booleanSelector },
      ]),
      interactionsSection(undefined, "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        plants: "Растения",
        levels: "Строки растений",
        dry_below: "Ниже этого — сухо",
        wet_above: "Выше этого — залито",
        temperature: "Температура воздуха",
        humidity: "Влажность воздуха",
        illuminance: "Освещённость",
        big_values: "Крупно справа (не больше трёх)",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        plants: "Plants",
        levels: "Plant rows",
        dry_below: "Dry below",
        wet_above: "Wet above",
        temperature: "Air temperature",
        humidity: "Air humidity",
        illuminance: "Light",
        big_values: "Large on the right (up to three)",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      plants: entityIdsOf(config.plants as (GreenhousePlant | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      // The thresholds a plant was given by hand in YAML survive a pick here.
      plants: mergeEntityList<GreenhousePlant>(
        this._config?.plants as (GreenhousePlant | string)[] | undefined,
        (data.plants as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-greenhouse-tile-editor", HorosGreenhouseTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-greenhouse-tile-editor": HorosGreenhouseTileEditor;
  }
}
