import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { CartridgeConfig } from "../core/printer";

@customElement("horos-person-tile-editor")
export class HorosPersonTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      {
        name: "person",
        required: true,
        selector: {
          entity: {
            filter: [{ domain: "person" }, { domain: "device_tracker" }],
          },
        },
      },
      { name: "battery", selector: entitySelector("sensor", "battery") },
      { name: "location", selector: entitySelector("sensor") },
      {
        name: "devices",
        selector: {
          entity: {
            multiple: true,
            filter: [{ domain: "sensor", device_class: "battery" }],
          },
        },
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Имя",
      person: "Человек",
      battery: "Заряд основного устройства",
      location: "Где именно",
      devices: "Остальные устройства",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      devices: entityIdsOf(config.devices as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      devices: mergeEntityList<CartridgeConfig>(
        this._config?.devices as (CartridgeConfig | string)[] | undefined,
        (data.devices as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-person-tile-editor": HorosPersonTileEditor;
  }
}
