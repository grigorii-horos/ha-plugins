import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  bigValuesSelector,
  entitySelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosHeatingTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "mode";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "mode", selector: entitySelector("sensor") },
      {
        name: "burner",
        selector: entitySelector("binary_sensor", "heat"),
      },
      {
        name: "pump",
        selector: entitySelector("binary_sensor", "heat"),
      },
      {
        name: "switch",
        selector: { entity: { filter: [{ domain: "switch" }] } },
      },
      { name: "power", selector: entitySelector("sensor", "power") },
      { name: "energy", selector: entitySelector("sensor", "energy") },
      {
        name: "zones",
        selector: { entity: { multiple: true, filter: [{ domain: "climate" }] } },
      },
      contentSection("mode", lang, [
        {
          name: "big_values",
          selector: bigValuesSelector([
            { value: "power", label: lang === "ru" ? "Мощность" : "Power" },
            { value: "energy", label: lang === "ru" ? "Энергия" : "Energy" },
          ]),
        },
      ]),
      interactionsSection("mode", "more-info"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        mode: "Что котёл делает сейчас",
        burner: "Горелка",
        pump: "Насос",
        switch: "Питание котла",
        power: "Мощность",
        energy: "Энергия",
        zones: "Комнаты",
        big_values: "Крупно справа (не больше трёх)",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        mode: "What the boiler is doing",
        burner: "Burner",
        pump: "Pump",
        switch: "Power to the boiler",
        power: "Power",
        energy: "Energy",
        zones: "Rooms",
        big_values: "Large on the right (up to three)",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      zones: entityIdsOf(config.zones as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      zones: mergeEntityList<EntityItem>(
        this._config?.zones as (EntityItem | string)[] | undefined,
        (data.zones as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-heating-tile-editor", HorosHeatingTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-heating-tile-editor": HorosHeatingTileEditor;
  }
}
