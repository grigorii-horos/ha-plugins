import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  entitySelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosPrinterTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "status";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "icon", selector: { icon: {} } },
      { name: "status", selector: entitySelector("sensor") },
      {
        name: "cartridges",
        required: true,
        selector: { entity: { multiple: true, filter: [{ domain: "sensor" }] } },
      },
      {
        name: "low_below",
        selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } },
      },
      {
        name: "sensors",
        selector: { entity: { multiple: true } },
      },
      contentSection("status", lang),
      interactionsSection("status", "none"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название принтера",
        status: "Состояние принтера",
        cartridges: "Картриджи",
        low_below: "Мало чернил ниже",
        sensors: "Прочее про принтер",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Printer name",
        status: "Printer status",
        cartridges: "Cartridges",
        low_below: "Low ink below",
        sensors: "Other printer sensors",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      cartridges: entityIdsOf(
        config.cartridges as (EntityItem | string)[]
      ),
      sensors: entityIdsOf(config.sensors as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      cartridges: mergeEntityList<EntityItem>(
        this._config?.cartridges as (EntityItem | string)[] | undefined,
        (data.cartridges as string[]) ?? []
      ),
      sensors: mergeEntityList<EntityItem>(
        this._config?.sensors as (EntityItem | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-printer-tile-editor", HorosPrinterTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-printer-tile-editor": HorosPrinterTileEditor;
  }
}
