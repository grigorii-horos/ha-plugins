import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  FormCardEditor,
  entitySelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

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
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        status: "Состояние",
        disk: "Свободное место",
        download: "Скорость приёма",
        upload: "Скорость отдачи",
        services: "Что ещё сказать",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        status: "Status",
        disk: "Free space",
        download: "Download speed",
        upload: "Upload speed",
        services: "What else to show",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      services: entityIdsOf(config.services as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      services: mergeEntityList<EntityItem>(
        this._config?.services as (EntityItem | string)[] | undefined,
        (data.services as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-server-tile-editor", HorosServerTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-server-tile-editor": HorosServerTileEditor;
  }
}
