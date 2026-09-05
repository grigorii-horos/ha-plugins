import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  FormCardEditor,
  bigValuesSelector,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosComputerTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "name", selector: textSelector },
      { name: "status", selector: { entity: {} } },
      { name: "cpu", selector: entitySelector("sensor") },
      { name: "memory", selector: entitySelector("sensor") },
      { name: "gpu", selector: entitySelector("sensor") },
      {
        name: "temperatures",
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "temperature" }],
          },
        },
      },
      { name: "disks", selector: { entity: { multiple: true } } },
      { name: "disks_free", selector: { entity: { multiple: true } } },
      { name: "sensors", selector: { entity: { multiple: true } } },
      {
        name: "alerts",
        selector: { entity: { multiple: true, filter: [{ domain: "binary_sensor" }] } },
      },
      {
        name: "big_values",
        selector: bigValuesSelector([
          { value: "temperature", label: lang === "ru" ? "Самая горячая точка" : "Hottest spot" },
          { value: "cpu", label: lang === "ru" ? "Процессор" : "CPU" },
          { value: "memory", label: lang === "ru" ? "Память" : "Memory" },
          { value: "gpu", label: lang === "ru" ? "Видеокарта" : "GPU" },
          { value: "disk", label: lang === "ru" ? "Самый полный диск" : "Fullest disk" },
        ]),
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        status: "Состояние",
        cpu: "Процессор",
        memory: "Память",
        gpu: "Видеокарта",
        temperatures: "Датчики температуры",
        disks: "Разделы диска (занято)",
        disks_free: "Разделы диска (свободно)",
        sensors: "Что ещё сказать",
        alerts: "Сообщать, когда сработало",
        big_values: "Крупно справа (не больше трёх)",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        status: "Status",
        cpu: "CPU",
        memory: "Memory",
        gpu: "GPU",
        temperatures: "Temperature sensors",
        disks: "Disks (used)",
        disks_free: "Disks (free)",
        sensors: "What else to show",
        alerts: "Report only when triggered",
        big_values: "Large on the right (up to three)",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (EntityItem | string)[]),
      alerts: entityIdsOf(config.alerts as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      sensors: mergeEntityList<EntityItem>(
        this._config?.sensors as (EntityItem | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
      alerts: mergeEntityList<EntityItem>(
        this._config?.alerts as (EntityItem | string)[] | undefined,
        (data.alerts as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-computer-tile-editor", HorosComputerTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-computer-tile-editor": HorosComputerTileEditor;
  }
}
