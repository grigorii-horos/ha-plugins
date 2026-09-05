import { state } from "lit/decorators.js";
import { BaseGridCard } from "../core/base-grid-card";
import type { LovelaceCardEditor } from "../core/types";
import { registerCard } from "../core/register";
import {
  buttonLabel,
  normalizeButton,
  type ButtonConfig,
} from "../core/buttons";

export const DEFAULT_BUTTON_COLUMNS = 3;

export interface ButtonsTileConfig {
  type: string;
  name?: string;
  icon?: string;
  columns?: number;
  buttons: (ButtonConfig | string)[];
}

/**
 * Сетка кнопок, вызывающих скрипты.
 *
 * Каждая ячейка — штатная карточка `button` HA, заголовок — штатная `heading`.
 * Своей вёрстки нет: карточка нужна затем, чтобы вместо десятка блоков в
 * конфиге был один список.
 */
export class HorosButtonsTile extends BaseGridCard {
  @state() private _config?: ButtonsTileConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../editors/buttons-tile-editor");
    return document.createElement(
      "horos-buttons-tile-editor"
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<ButtonsTileConfig> {
    return { buttons: [] };
  }

  public setConfig(config: ButtonsTileConfig): void {
    if (!config.buttons?.length) {
      throw new Error("Нужно указать хотя бы одну кнопку (buttons)");
    }
    this._config = config;
    this.rebuild();
  }

  protected columns(): number {
    return this._config?.columns ?? DEFAULT_BUTTON_COLUMNS;
  }

  protected headingConfig(): Record<string, unknown> | undefined {
    if (!this._config?.name) return undefined;
    return {
      type: "heading",
      heading: this._config.name,
      heading_style: "subtitle",
      icon: this._config.icon,
      tap_action: { action: "none" },
    };
  }

  protected childConfigs(): Record<string, unknown>[] {
    if (!this._config) return [];
    return this._config.buttons.map((raw) => {
      const button = normalizeButton(raw);
      const stateObj = this.hass?.states[button.entity];
      return {
        type: "button",
        entity: button.entity,
        name: button.name ?? buttonLabel(stateObj?.attributes.friendly_name),
        icon: button.icon,
        show_state: false,
        tap_action: { action: "toggle" },
      };
    });
  }
}

registerCard("horos-buttons-tile", HorosButtonsTile, {
  type: "horos-buttons-tile",
  name: { ru: "Кнопки скриптов", en: "Script buttons" },
  description: {
    ru: "Сетка кнопок, вызывающих скрипты, под общим заголовком",
    en: "A grid of buttons running scripts, under one heading",
  },
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "horos-buttons-tile": HorosButtonsTile;
  }
}
