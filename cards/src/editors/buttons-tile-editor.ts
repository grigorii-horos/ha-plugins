import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  FormCardEditor,
  numberSelector,
  textSelector,
  type SchemaItem,
} from "./base-editor";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { ButtonConfig } from "../core/buttons";

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
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Заголовок",
        columns: "Кнопок в ряд",
        buttons: "Кнопки",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Heading",
        columns: "Buttons per row",
        buttons: "Buttons",
      },
    });
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

registerEditor("horos-buttons-tile-editor", HorosButtonsTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-buttons-tile-editor": HorosButtonsTileEditor;
  }
}
