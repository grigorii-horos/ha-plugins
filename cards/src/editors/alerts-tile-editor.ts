import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  numberSelector,
  booleanSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosAlertsTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      { name: "alerts", required: true, selector: { entity: { multiple: true } } },
      { name: "limit", selector: numberSelector(1, 20) },
      { name: "watch_offline", selector: booleanSelector },
      contentSection(undefined, lang),
      interactionsSection(undefined, "more-info"),
    ];
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        name: "Название",
        alerts: "Оповещения",
        limit: "Сколько называть поимённо",
        watch_offline: "Считать потерю связи оповещением",
      },
      en: {
        ...COMMON_LABELS_EN,
        name: "Name",
        alerts: "Alerts",
        limit: "How many to name",
        watch_offline: "Count a lost connection as an alert",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      alerts: entityIdsOf(config.alerts as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      ...data,
      alerts: mergeEntityList<EntityItem>(
        this._config?.alerts as (EntityItem | string)[] | undefined,
        (data.alerts as string[]) ?? []
      ),
    };
  }
}

registerEditor("horos-alerts-tile-editor", HorosAlertsTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-alerts-tile-editor": HorosAlertsTileEditor;
  }
}
