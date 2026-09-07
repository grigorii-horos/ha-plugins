import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  booleanSelector,
  contentSection,
  interactionsSection,
  bigValuesSelector,
  numberSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { WEATHER_BARS } from "../core/weather";

/** The names of the quantities, ours: HA does not translate selector labels. */
const BAR_LABELS: Record<string, { ru: string; en: string }> = {
  temperature: { ru: "Температура, от ночи до дня", en: "Temperature, night to day" },
  precipitation: { ru: "Осадки", en: "Precipitation" },
  precipitation_probability: { ru: "Вероятность осадков", en: "Chance of rain" },
  humidity: { ru: "Влажность", en: "Humidity" },
  wind_speed: { ru: "Ветер", en: "Wind" },
};

const ATTRIBUTE_LABELS: Record<string, { ru: string; en: string }> = {
  temperature: { ru: "Температура", en: "Temperature" },
  apparent_temperature: { ru: "Ощущается как", en: "Feels like" },
  dew_point: { ru: "Точка росы", en: "Dew point" },
  humidity: { ru: "Влажность", en: "Humidity" },
  pressure: { ru: "Давление", en: "Pressure" },
  wind_speed: { ru: "Ветер", en: "Wind" },
  cloud_coverage: { ru: "Облачность", en: "Cloud coverage" },
  uv_index: { ru: "УФ-индекс", en: "UV index" },
  visibility: { ru: "Видимость", en: "Visibility" },
};

export class HorosWeatherTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "weather";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass) === "ru" ? "ru" : "en";
    return [
      {
        name: "weather",
        required: true,
        selector: { entity: { filter: [{ domain: "weather" }] } },
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "days", selector: numberSelector(1, 14) },
          {
            name: "bar",
            selector: {
              select: {
                mode: "dropdown",
                options: WEATHER_BARS.map((value) => ({
                  value,
                  label: BAR_LABELS[value][lang],
                })),
              },
            },
          },
        ],
      },
      contentSection("weather", languageOf(this.hass), [
        {
          name: "big_values",
          selector: bigValuesSelector(
            Object.keys(ATTRIBUTE_LABELS).map((value) => ({
              value,
              label: ATTRIBUTE_LABELS[value][lang],
            }))
          ),
        },
        { name: "levels", selector: booleanSelector },
      ]),
      interactionsSection("weather", "more-info"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        weather: "Погода",
        days: "Дней в прогнозе",
        bar: "Что показывают полоски",
        levels: "Строки прогноза",
        big_values: "Крупно справа (не больше трёх)",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        weather: "Weather",
        days: "Days in the forecast",
        bar: "What the bars measure",
        levels: "Forecast rows",
        big_values: "Large on the right (up to three)",
      },
    });
  }
}

registerEditor("horos-weather-tile-editor", HorosWeatherTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-weather-tile-editor": HorosWeatherTileEditor;
  }
}
