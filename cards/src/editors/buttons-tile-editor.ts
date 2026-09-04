import { customElement } from "lit/decorators.js";
import {
  COMMON_LABELS,
  FormCardEditor,
  numberSelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { ButtonConfig } from "../core/buttons";

@customElement("horos-buttons-tile-editor")
export class HorosButtonsTileEditor extends FormCardEditor {
  protected get schema(): SchemaItem[] {
    return [
      { name: "name", selector: textSelector },
      { name: "icon", selector: { icon: {} } },
      { name: "columns", selector: numberSelector(1, 6) },
      {
        name: "buttons",
        required: true,
        selector: {
          entity: {
            multiple: true,
            filter: [
              { domain: "script" },
              { domain: "scene" },
              { domain: "button" },
              { domain: "input_button" },
              { domain: "switch" },
            ],
          },
        },
      },
    ];
  }

  protected get labels(): Record<string, string> {
    return {
      ...COMMON_LABELS,
      name: "Заголовок",
      columns: "Кнопок в ряд",
      buttons: "Кнопки",
    };
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      buttons: entityIdsOf(config.buttons as (ButtonConfig | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      buttons: mergeEntityList<ButtonConfig>(
        this._config?.buttons as (ButtonConfig | string)[] | undefined,
        (data.buttons as string[]) ?? []
      ),
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "horos-buttons-tile-editor": HorosButtonsTileEditor;
  }
}
