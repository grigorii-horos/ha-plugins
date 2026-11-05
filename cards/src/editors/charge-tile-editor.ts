import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  entitySelector,
  interactionsSection,
  numberSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { batteryIds, type ChargeTileConfig } from "../cards/charge-tile";

export class HorosChargeTileEditor extends BaseCardEditor {
  /**
   * No main entity for the features panel: the control line is the card's own
   * and is not removable (see the card).
   */
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    const limit = {
      entity: { filter: [{ domain: "input_number" }, { domain: "number" }] },
    };
    return [
      {
        name: "battery",
        required: true,
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "battery" }],
          },
        },
      },
      { name: "switch", required: true, selector: entitySelector("switch") },
      { name: "min", required: true, selector: limit },
      { name: "max", required: true, selector: limit },
      { name: "force", selector: entitySelector("timer") },
      { name: "stale_after", selector: numberSelector(0, 86400, "s") },
      contentSection(undefined, lang),
      interactionsSection(undefined, "more-info"),
    ];
  }

  /** The form always edits a list, whatever the YAML holds. */
  protected override get formData(): Record<string, unknown> {
    const data = super.formData;
    return {
      ...data,
      battery: batteryIds(data as unknown as ChargeTileConfig),
    };
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        battery: "Заряд (первый числовой)",
        switch: "Порт зарядки",
        min: "Нижний предел",
        max: "Верхний предел",
        force: "Таймер принудительной зарядки",
        stale_after: "Нет данных через, секунд",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        battery: "Battery (first numeric)",
        switch: "Charger port",
        min: "Lower limit",
        max: "Upper limit",
        force: "Forced charge timer",
        stale_after: "No data after, seconds",
      },
    });
  }
}

registerEditor("horos-charge-tile-editor", HorosChargeTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-charge-tile-editor": HorosChargeTileEditor;
  }
}
