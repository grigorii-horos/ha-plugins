import { nothing } from "lit";
import { state } from "lit/decorators.js";
import { BaseTileCard, type TileBaseConfig } from "../core/base-tile-card";
import { tileStyles } from "../core/tile-styles";
import { renderLevels, levelStyles, type LevelRow } from "../core/levels";
import {
  composeSegments,
  numericState,
  resolveRole,
  unavailableSegment,
} from "../core/format";
import { normalizeItem, type EntityItem } from "../core/entity-item";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import { t } from "../core/i18n";
import { ROLE_ICONS } from "../core/role-icons";
import { suggestion } from "../core/suggest";

export interface TasksTileConfig extends TileBaseConfig {
  type: string;
  /** The to-do lists. A `todo` entity's state is how much is left on it. */
  lists: (EntityItem | string)[];
  /** The calendar whose next event goes into the line. */
  calendar?: string;
}

/**
 * The to-do lists of the house in one tile, with what is coming up next.
 *
 * Home Assistant has a card per list, and each of them wants the height of a
 * screen to show items nobody reads from a dashboard. The question a dashboard
 * can answer is smaller: how much is left, on which list, and what is next.
 *
 * The bars are shares of the longest list, the same relative scale the energy
 * card uses: the row length answers "which list is the heavy one", not "what
 * per cent of it is done".
 */
export class HorosTasksTile extends BaseTileCard {
  static styles = [tileStyles, levelStyles];

  @state() private _config?: TasksTileConfig;

  protected override contentRows(): number {
    return this.levelRows(this._config?.lists.length ?? 0) + this.fixedRows();
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/tasks-tile-editor");
    return document.createElement(
      "horos-tasks-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<TasksTileConfig> {
    return { lists: [] };
  }

  public setConfig(config: TasksTileConfig): void {
    if (!config.lists?.length) {
      throw new Error("At least one list is required (lists)");
    }
    this.base = config;
    this._config = config;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const config = this._config;

    const calendar = resolveRole(this.hass, config.calendar);
    const lists = config.lists
      .map((raw) => normalizeItem(raw))
      .map((item) => {
        const role = resolveRole(this.hass, item.entity);
        return { item, role, count: numericState(role) ?? 0 };
      });

    const warning = this.missingRolesWarning([
      calendar,
      ...lists.map((list) => list.role),
    ]);
    if (warning) return this.renderWarning(warning);

    const total = lists.reduce((sum, list) => sum + list.count, 0);
    const busiest = Math.max(...lists.map((list) => list.count), 1);

    const rows: LevelRow[] = lists
      .filter((list) => list.count > 0)
      .map(({ item, role, count }) => ({
        entityId: item.entity,
        name: item.name ?? role?.stateObj?.attributes.friendly_name ?? item.entity,
        text: String(count),
        ink: item.color ?? "var(--state-icon-color, var(--primary-color))",
        level: (count / busiest) * 100,
      }));

    // The next event is a time, and the stock state-display is what formats
    // times here — it says "in 2 hours" the way the rest of HA does.
    const next = calendar?.stateObj?.attributes.message as string | undefined;

    return this.renderTile({
      icon: total ? "mdi:format-list-checks" : "mdi:check-all",
      color: total
        ? "var(--state-icon-color, var(--primary-color))"
        : "var(--success-color, #43a047)",
      primary: config.name ?? t(this.hass, "tasks.title"),
      mainEntityId: lists[0]?.item.entity,
      secondary: composeSegments([
        unavailableSegment(this.hass, calendar),
        { text: total ? undefined : t(this.hass, "tasks.none") },
        calendar
          ? {
              text: next ?? t(this.hass, "tasks.noEvents"),
              entityId: calendar.entityId,
            }
          : undefined,
      ]),
      values: total
        ? [
            {
              value: String(total),
              entityId: lists[0]?.item.entity,
              icon: ROLE_ICONS.tasks,
            },
          ]
        : [],
      customFeatures: rows.length
        ? renderLevels(rows, (entityId) => this.fireMoreInfo(entityId))
        : undefined,
    });
  }
}

registerCard("horos-tasks-tile", HorosTasksTile, {
  type: "horos-tasks-tile",
  name: { ru: "Задачи", en: "Tasks" },
  description: {
    ru: "Сколько дел на каждом списке и что ближайшее в календаре",
    en: "How much is left on each list, and what is coming up next",
  },
  preview: true,
  suggest: (hass, entityId) => {
    if (!entityId.startsWith("todo.")) return null;
    const lists = Object.keys(hass.states)
      .filter((id) => id.startsWith("todo.") && !hass.entities?.[id]?.hidden)
      .sort();
    const ordered = [entityId, ...lists.filter((id) => id !== entityId)];
    // A single list is what the stock to-do card is for.
    if (ordered.length < 2) return null;
    return suggestion("custom:horos-tasks-tile", {}, { lists: ordered });
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-tasks-tile": HorosTasksTile;
  }
}
