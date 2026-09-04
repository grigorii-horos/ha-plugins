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

@customElement("horos-server-tile-editor")
export class HorosServerTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      { name: "status", selector: { entity: {} } },
      { name: "disk", selector: entitySelector("sensor", "data_size") },
      { name: "download", selector: entitySelector("sensor", "data_rate") },
      { name: "upload", selector: entitySelector("sensor", "data_rate") },
      { name: "services", selector: { entity: { multiple: true } } },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Название",
      status: "Состояние",
      disk: "Свободное место",
      download: "Скорость приёма",
      upload: "Скорость отдачи",
      services: "Что ещё сказать",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      services: entityIdsOf(config.services as (CartridgeConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      services: mergeEntityList<CartridgeConfig>(
        this._config?.services as (CartridgeConfig | string)[] | undefined,
        (data.services as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-server-tile-editor": HorosServerTileEditor;
  }
}
