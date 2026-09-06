import {
  COMMON_LABELS_EN,
  COMMON_LABELS_RU,
  BaseCardEditor,
  contentSection,
  interactionsSection,
  booleanSelector,
  type SchemaItem,
} from "./base-editor";
import { languageOf } from "../core/i18n";
import { registerEditor } from "../core/register";
import { mediaFeatures, type MediaTileConfig } from "../cards/media-tile";
import { entityIdsOf, mergeEntityList } from "../core/entity-lists";
import type { EntityItem } from "../core/entity-item";

export class HorosMediaTileEditor extends BaseCardEditor {
  protected get entityField(): string | undefined {
    return undefined;
  }

  protected get schema(): SchemaItem[] {
    const lang = languageOf(this.hass);
    return [
      {
        name: "players",
        required: true,
        selector: {
          entity: { multiple: true, filter: { domain: "media_player" } },
        },
      },
      contentSection(undefined, lang, [
        { name: "levels", selector: booleanSelector },
      ]),
      interactionsSection(undefined, "more-info"),
    ];
  }

  /** The playback buttons act on the first player in the list. */
  protected override get featuresEntity(): string | undefined {
    const players = (this._config?.players ?? []) as (EntityItem | string)[];
    return entityIdsOf(players)[0];
  }

  protected override defaultFeatures(): Record<string, unknown>[] {
    const config = this._config as unknown as MediaTileConfig | undefined;
    return mediaFeatures(config);
  }

  protected get labels(): Record<string, string> {
    return this.pick({
      ru: {
        ...COMMON_LABELS_RU,
        levels: "Строки плееров",
        name: "Название",
        players: "Проигрыватели",
      },
      en: {
        ...COMMON_LABELS_EN,
        levels: "Player rows",
        name: "Name",
        players: "Players",
      },
    });
  }

  protected override get formData(): Record<string, unknown> {
    const config = this._config ?? {};
    return {
      ...config,
      players: entityIdsOf(config.players as (EntityItem | string)[]),
    };
  }

  protected override fromForm(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      ...data,
      players: mergeEntityList<EntityItem>(
        this._config?.players as (EntityItem | string)[] | undefined,
        (data.players as string[]) ?? [],
      ),
    };
  }
}

registerEditor("horos-media-tile-editor", HorosMediaTileEditor);

declare global {
  interface HTMLElementTagNameMap {
    "horos-media-tile-editor": HorosMediaTileEditor;
  }
}
