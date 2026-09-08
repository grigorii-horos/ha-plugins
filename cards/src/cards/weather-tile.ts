import { nothing, type PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import {
  BaseTileCard,
  type FormattedValue,
  type TileBaseConfig,
} from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import {
  composeSegments,
  resolveRole,
  splitValueUnit,
  unavailableSegment,
} from "../core/format";
import { resolveBigKeys } from "../core/big-values";
import {
  forecastBars,
  supportsDailyForecast,
  weatherColor,
  weatherIcon,
  weatherUnit,
  WEATHER_ATTRIBUTES,
  WEATHER_ATTR_ICONS,
  WEATHER_BARS,
  type ForecastBar,
  type ForecastDay,
  type WeatherBar,
} from "../core/weather";
import type { HassEntity, LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { suggestion } from "../core/suggest";
import { computeDomain, tileColor } from "../core/state-color";
import { languageOf, t } from "../core/i18n";

/** A week, because that is the horizon a daily forecast is worth reading at. */
export const DEFAULT_DAYS = 7;

/** The longest daily forecast any integration hands out is around a fortnight. */
const MAX_DAYS = 14;

/**
 * What the line says about today when the config says nothing: the condition
 * and the numbers that decide what to wear. Whatever went large is dropped from
 * it — it would otherwise be written twice.
 */
const DEFAULT_LINE = ["humidity", "wind_speed"];

/**
 * Large on the right by default. Two numbers, not one: how warm it is outside
 * is only half the answer in summer, and humidity is the half that decides
 * whether that warmth is bearable. An entity that does not report it simply
 * shows the temperature — a missing value is skipped, not written as "Unknown".
 */
const DEFAULT_BIG = ["temperature", "humidity"];

/** Weekday abbreviations are a few letters everywhere; the bars get the rest. */
const NAME_WIDTH = "4.5em";

export interface WeatherTileConfig extends TileBaseConfig {
  type: string;
  /** The weather entity. Everything on the card comes out of this one. */
  weather: string;
  /** How many days of the forecast to draw. Seven by default. */
  days?: number;
  /** What the bars measure. The temperature span by default. */
  bar?: WeatherBar;
  /** What to show large on the right: up to three weather attributes. */
  big_values?: string[];
}

/**
 * The week in one tile.
 *
 * A weather entity keeps everything it knows in attributes and its forecast
 * nowhere at all — HA stopped putting it in the state machine and now streams
 * it to whoever subscribes. The stock tile therefore shows one word,
 * "partlycloudy", and the stock weather card is a wide block of numbers that
 * does not sit in a row of tiles.
 *
 * So: the line is today — the condition and the wind, with the temperature and
 * the humidity large on the right — and under it one row per day, the way the
 * other list cards do it. The bar is a span, from the night to the afternoon,
 * drawn against the whole week's range: a week of numbers is bad at showing
 * which days stand out, and a row of bars is good at exactly that. Each day is
 * painted in the colour of its own condition, HA's own, so the rainy stretch
 * shows up as a band of blue before a single number is read.
 */
export class HorosWeatherTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: WeatherTileConfig;

  /** The forecast as it arrives over the websocket. */
  @state() private _forecast?: ForecastDay[];

  private _bigKeys: string[] = DEFAULT_BIG;

  private _subscribed?: Promise<() => Promise<void>>;

  private _subscribedTo?: string;

  protected override contentRows(): number {
    return this.levelRows(this._days().length || this._wanted()) +
      this.fixedRows();
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/weather-tile-editor");
    return document.createElement(
      "horos-weather-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<WeatherTileConfig> {
    return { weather: "" };
  }

  public setConfig(config: WeatherTileConfig): void {
    if (!config.weather) {
      throw new Error("A weather entity is required (weather)");
    }
    if (
      config.days !== undefined &&
      (!Number.isInteger(config.days) ||
        config.days < 1 ||
        config.days > MAX_DAYS)
    ) {
      throw new Error(`days must be a whole number between 1 and ${MAX_DAYS}`);
    }
    if (config.bar && !WEATHER_BARS.includes(config.bar)) {
      throw new Error(
        `Unknown bar: ${config.bar}. Allowed: ${WEATHER_BARS.join(", ")}`
      );
    }
    this._bigKeys = resolveBigKeys(
      config.big_values,
      DEFAULT_BIG,
      WEATHER_ATTRIBUTES
    );
    this.base = config;
    this._config = config;
  }

  // ---- the forecast subscription --------------------------------------

  public override connectedCallback(): void {
    super.connectedCallback();
    this._subscribe();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe();
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    // `hass` changes on every state in the house; the subscription is renewed
    // only when there is none, or when the card was pointed at another entity.
    if (changed.has("_config") || !this._subscribed) this._subscribe();
  }

  private _unsubscribe(): void {
    this._subscribed?.then((unsub) => unsub()).catch(() => undefined);
    this._subscribed = undefined;
    this._subscribedTo = undefined;
  }

  private _subscribe(): void {
    const entityId = this._config?.weather;
    if (this._subscribed && this._subscribedTo === entityId) return;
    this._unsubscribe();

    const stateObj = entityId ? this.hass?.states[entityId] : undefined;
    if (
      !this.isConnected ||
      !this.hass?.connection ||
      !entityId ||
      !stateObj ||
      !supportsDailyForecast(stateObj)
    ) {
      return;
    }

    this._subscribedTo = entityId;
    const pending = this.hass.connection.subscribeMessage<{
      forecast: ForecastDay[] | null;
    }>(
      (event) => {
        this._forecast = event.forecast ?? [];
      },
      {
        type: "weather/subscribe_forecast",
        forecast_type: "daily",
        entity_id: entityId,
      }
    );
    this._subscribed = pending;
    // A subscription that never comes up must not block the next attempt.
    pending.catch(() => {
      if (this._subscribed === pending) this._unsubscribe();
    });
  }

  // ---- rendering -------------------------------------------------------

  private _wanted(): number {
    return this._config?.days ?? DEFAULT_DAYS;
  }

  /** The days actually drawn: what was asked for, or what the forecast has. */
  private _days(): ForecastDay[] {
    return (this._forecast ?? []).slice(0, this._wanted());
  }

  /** The weekday label, in the user's own language. */
  private _weekday(datetime: string): string {
    const date = new Date(datetime);
    if (Number.isNaN(date.getTime())) return datetime;
    return new Intl.DateTimeFormat(languageOf(this.hass), {
      weekday: "short",
    }).format(date);
  }

  /** An attribute value with its unit split off, ready for a large value. */
  private _attribute(
    stateObj: HassEntity,
    attribute: string,
    value?: number
  ): FormattedValue | undefined {
    const raw = value ?? stateObj.attributes[attribute];
    if (raw === undefined || raw === null) return undefined;
    const unit = weatherUnit(stateObj, attribute);
    const formatted =
      this.hass?.formatEntityAttributeValue?.(stateObj, attribute, value) ??
      `${raw}${unit ? ` ${unit}` : ""}`;
    return splitValueUnit(formatted, unit);
  }

  /**
   * What is written on the right of a row.
   *
   * A temperature row names both ends of its span: the night without a unit,
   * the afternoon with one. A slash between them, not the arrow the heating
   * card uses — there an arrow is the truth, the room is on its way to the
   * target; here both numbers are simply the day, and the arrow read as if the
   * morning were heading for the afternoon. Everything else is one reading.
   */
  private _rowText(
    stateObj: HassEntity,
    bar: WeatherBar,
    item: ForecastBar
  ): string {
    if (item.high === undefined) return t(this.hass, "value.unknown");
    const high = this._attribute(
      stateObj,
      bar === "temperature" ? "temperature" : bar,
      item.high
    );
    if (!high) return t(this.hass, "value.unknown");
    const highText = `${high.value}${high.unit ? ` ${high.unit}` : ""}`;
    if (bar !== "temperature" || item.low === undefined || item.low === item.high) {
      return highText;
    }
    const low = this._attribute(stateObj, "templow", item.low);
    return low ? `${low.value} / ${highText}` : highText;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const role = resolveRole(this.hass, config.weather);
    if (role?.missing) {
      return this.renderWarning(
        t(this.hass, "entity.missing.one", { list: config.weather })
      );
    }
    const stateObj = role!.stateObj!;

    const bar: WeatherBar = config.bar ?? "temperature";
    const days = this._days();
    const bars = forecastBars(days, bar);

    const rows: LevelRow[] = days.map((day, index) => ({
      entityId: config.weather,
      name: this._weekday(day.datetime),
      text: this._rowText(stateObj, bar, bars[index]),
      ink: weatherColor(day.condition),
      icon: weatherIcon(day.condition),
      from: bars[index].from,
      level: bars[index].level,
    }));

    // Only the attributes the entity actually reports: a weather integration
    // without humidity would otherwise put "Unknown" on the line.
    const line = [
      "state",
      ...DEFAULT_LINE.filter(
        (attribute) =>
          !this._bigKeys.includes(attribute) &&
          stateObj.attributes[attribute] !== undefined &&
          stateObj.attributes[attribute] !== null
      ),
    ];

    const values: FormattedValue[] = [];
    for (const key of this._bigKeys) {
      const value = this._attribute(stateObj, key);
      if (!value) continue;
      values.push({
        ...value,
        entityId: config.weather,
        icon: WEATHER_ATTR_ICONS[key],
      });
    }

    return this.renderTile({
      icon: weatherIcon(stateObj.state),
      color: tileColor(stateObj),
      primary: config.name ?? stateObj.attributes.friendly_name ?? config.weather,
      mainEntityId: config.weather,
      secondary: composeSegments([
        unavailableSegment(this.hass, role),
        this.mainStateSegment(role, line),
        // A forecast the integration does not offer is worth saying out loud:
        // the card is otherwise a tile with an empty half.
        !supportsDailyForecast(stateObj)
          ? { text: t(this.hass, "weather.noForecast") }
          : undefined,
      ]),
      values,
      customFeatures: rows.length
        ? renderLevels(rows, (entityId) => this.fireMoreInfo(entityId), {
            nameWidth: NAME_WIDTH,
          })
        : undefined,
    });
  }
}

registerCard("horos-weather-tile", HorosWeatherTile, {
  type: "horos-weather-tile",
  name: { ru: "Погода", en: "Weather" },
  description: {
    ru: "Погода на сегодня в строке и неделя полосками температуры",
    en: "Today on the line and the week as bars of temperature",
  },
  preview: true,
  suggest: (_hass, entityId) => {
    // A weather entity is a domain of its own: nothing to guess. The stock tile
    // shows one word of it, and the week is not in the state machine at all.
    if (computeDomain(entityId) !== "weather") return null;
    return suggestion("custom:horos-weather-tile", { weather: entityId });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-weather-tile": HorosWeatherTile;
  }
}
