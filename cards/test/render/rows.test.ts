import { describe, expect, it } from "vitest";
import { BaseTileCard, type TileBaseConfig } from "../../src/core/base-tile-card";

/**
 * The two row counts a card reports to the dashboard grid.
 *
 * `getCardSize` is how tall the card is; `min_rows` is how small it may be made,
 * and those are different questions: a list of level rows lives with whatever
 * height it is given, a row of buttons is 42px and stays 42px. Getting the
 * second one wrong lets the grid crop the controls off a card.
 */
class TestCard extends BaseTileCard {
  public rows = 0;
  public controls = 0;
  /** What the card would put under the line if the config said nothing. */
  public own: Record<string, unknown>[] = [];

  public setConfig(config: TileBaseConfig): void {
    this.base = config;
  }

  protected override contentRows(): number {
    return this.levelRows(this.rows) + this.fixedRows();
  }

  protected override fixedRows(): number {
    return this.controls + this.featureRows(this.own);
  }

  protected render() {
    return null;
  }
}

// A custom element class cannot be constructed with `new` until it is defined.
customElements.define("test-tile-card", TestCard);

const card = (
  config: TileBaseConfig = {},
  rows = 0,
  controls = 0,
  own: Record<string, unknown>[] = []
): TestCard => {
  const element = document.createElement("test-tile-card") as TestCard;
  element.setConfig(config);
  element.rows = rows;
  element.controls = controls;
  element.own = own;
  return element;
};

describe("how many rows a card asks for", () => {
  it("a card with nothing under the line is one row and cannot shrink further", () => {
    const tile = card();
    expect(tile.getCardSize()).toBe(1);
    expect(tile.getGridOptions().min_rows).toBe(1);
  });

  it("two level rows share one layout row", () => {
    expect(card({}, 4).getCardSize()).toBe(3);
    expect(card({}, 5).getCardSize()).toBe(4);
  });

  it("a list may be squeezed: it does not raise the minimum", () => {
    expect(card({}, 6).getGridOptions().min_rows).toBe(1);
  });

  it("controls may not: every one of them keeps its row", () => {
    const tile = card({}, 4, 2);
    expect(tile.getCardSize()).toBe(5);
    expect(tile.getGridOptions().min_rows).toBe(3);
  });

  it("features count as controls, one row each", () => {
    const tile = card({ features: [{ type: "toggle" }, { type: "cover-open-close" }] });
    expect(tile.getCardSize()).toBe(3);
    expect(tile.getGridOptions().min_rows).toBe(3);
  });

  it("an inline first feature shares the line and the rest pair up", () => {
    const tile = card({
      features_position: "inline",
      features: [{ type: "toggle" }, { type: "a" }, { type: "b" }],
    });
    expect(tile.getGridOptions().min_rows).toBe(2);
  });

  it("with the card's own line off there is nothing left to count", () => {
    const tile = card({ levels: false }, 6);
    expect(tile.getCardSize()).toBe(1);
    expect(tile.getGridOptions().min_rows).toBe(1);
  });

  it("switching the line off does not touch the controls under it", () => {
    // `levels` is about the card's own rows; the features list is its own thing.
    const tile = card({ levels: false, features: [{ type: "toggle" }] }, 6);
    expect(tile.getCardSize()).toBe(2);
    expect(tile.getGridOptions().min_rows).toBe(2);
  });

  it("the card's own features count when the config says nothing", () => {
    const tile = card({}, 0, 0, [{ type: "toggle" }, { type: "a" }]);
    expect(tile.getCardSize()).toBe(3);
    expect(tile.getGridOptions().min_rows).toBe(3);
  });

  it("an emptied list means none of them, not back to the defaults", () => {
    // This is what removing the last feature in the editor writes, and it has
    // to mean what it says.
    const tile = card({ features: [] }, 0, 0, [
      { type: "toggle" },
      { type: "a" },
    ]);
    expect(tile.getCardSize()).toBe(1);
    expect(tile.getGridOptions().min_rows).toBe(1);
  });

  it("a vertical card may be made narrower", () => {
    expect(card({ vertical: true }).getGridOptions().min_columns).toBe(3);
  });
});

declare global {
  interface HTMLElementTagNameMap {
    "test-tile-card": TestCard;
  }
}
