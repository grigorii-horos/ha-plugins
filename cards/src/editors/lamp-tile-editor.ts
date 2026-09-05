import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  entitySelector,
  booleanSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

/** Anything pressable can drive a lamp: a script, a scene, a button. */
const pressableSelector = {
  entity: {
    filter: [
      { domain: "script" },
      { domain: "scene" },
      { domain: "button" },
      { domain: "input_button" },
    ],
  },
};

export class HorosLampTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return "state";
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "state", selector: entitySelector("input_boolean") },
      { name: "power", selector: pressableSelector },
      { name: "bright", selector: pressableSelector },
      { name: "dim", selector: pressableSelector },
      { name: "warm", selector: pressableSelector },
      { name: "cold", selector: pressableSelector },
      {
        name: "presets",
        selector: { entity: { ...pressableSelector.entity, multiple: true } },
      },
      { name: "preset_state", selector: entitySelector("input_select") },
      { name: "sensors", selector: { entity: { multiple: true } } },
      { name: "brightness", selector: booleanSelector },
      { name: "preset_labels", selector: booleanSelector },
      contentSection("state", lang),
      interactionsSection("state", "toggle"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        state: "Где лежит состояние",
        power: "Включить/выключить",
        bright: "Ярче",
        dim: "Тусклее",
        warm: "Теплее",
        cold: "Холоднее",
        presets: "Режимы",
        preset_state: "Где лежит текущий режим",
        sensors: "Что ещё сказать",
        brightness: "Слайдер яркости (для настоящей лампы)",
        preset_labels: "Подписи у режимов",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        state: "Where the state lives",
        power: "Power on/off",
        bright: "Brighter",
        dim: "Dimmer",
        warm: "Warmer",
        cold: "Colder",
        presets: "Presets",
        preset_state: "Where the current preset lives",
        sensors: "What else to show",
        brightness: "Brightness slider (for a real light)",
        preset_labels: "Names next to the presets",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      presets: entityIdsOf(config.presets as (EntityItem | string)[]),
      sensors: entityIdsOf(config.sensors as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      presets: mergeEntityList<EntityItem>(
        this._config?.presets as (EntityItem | string)[] | undefined,
        (data.presets as string[]) ?? []
      ),
      sensors: mergeEntityList<EntityItem>(
        this._config?.sensors as (EntityItem | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-lamp-tile-editor", HorosLampTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-lamp-tile-editor": HorosLampTileEditor;
  }
}
