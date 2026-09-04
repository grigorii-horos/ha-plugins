import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  bigValuesSelector,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-computer-tile-editor")
export class HorosComputerTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
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
          { value: "temperature", label: "Самая горячая точка" },
          { value: "cpu", label: "Процессор" },
          { value: "memory", label: "Память" },
          { value: "gpu", label: "Видеокарта" },
          { value: "disk", label: "Самый полный диск" },
        ]),
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
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
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      sensors: entityIdsOf(config.sensors as (CartridgeConfig | string)[]),
      alerts: entityIdsOf(config.alerts as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      sensors: mergeEntityList<CartridgeConfig>(
        this._config?.sensors as (CartridgeConfig | string)[] | undefined,
        (data.sensors as string[]) ?? []
      ),
      alerts: mergeEntityList<CartridgeConfig>(
        this._config?.alerts as (CartridgeConfig | string)[] | undefined,
        (data.alerts as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-computer-tile-editor": HorosComputerTileEditor;
  }
}
