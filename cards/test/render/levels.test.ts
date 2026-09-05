import { describe, expect, it, beforeEach } from "vitest";
import { render } from "lit";
import { renderLevels, type LevelRow } from "../../src/core/levels";

/**
 * The markup of the level rows. Every visual bug this session was caught by
 * screenshots taken by hand — these checks cover at least what we draw ourselves.
 */
describe("level rows", () => {
  let host: HTMLDivElement;
  const rows: LevelRow[] = [
    { entityId: "sensor.cyan", name: "Cyan", text: "50 %", ink: "cyan", level: 50 },
    {
      entityId: "sensor.mc",
      name: "MC",
      text: "10 %",
      ink: "grey",
      level: 12.5,
      alarm: true,
      alarmIcon: "mdi:delete-alert",
    },
  ];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
  });

  const draw = (
    list: LevelRow[] = rows,
    onTap: (entityId: string) => void = () => {}
  ) => {
    render(renderLevels(list, onTap), host);
    return host;
  };

  it("every row gets its own button", () => {
    expect(draw().querySelectorAll("button.level")).toHaveLength(2);
  });

  it("the label and the value are visible as text, not only in the tooltip", () => {
    const first = draw().querySelector("button.level")!;
    expect(first.querySelector(".name")!.textContent).toContain("Cyan");
    expect(first.querySelector(".value")!.textContent).toContain("50 %");
  });

  it("the fill matches the level exactly", () => {
    const fills = draw().querySelectorAll<HTMLElement>(".bar .fill");
    expect(fills[0].style.width).toBe("50%");
    expect(fills[1].style.width).toBe("12.5%");
  });

  it("the level is clamped to the bar bounds", () => {
    const wild = draw([
      { ...rows[0], level: -20 },
      { ...rows[1], level: 250 },
    ]).querySelectorAll<HTMLElement>(".bar .fill");
    expect(wild[0].style.width).toBe("0%");
    expect(wild[1].style.width).toBe("100%");
  });

  it("the colour of the contents reaches the row", () => {
    expect(draw().querySelector<HTMLElement>("button.level")!.style
      .getPropertyValue("--ink")).toBe("cyan");
  });

  it("an alarm is marked with its own glyph, a calm row has none", () => {
    const buttons = draw().querySelectorAll("button.level");
    expect(buttons[0].querySelector("ha-icon")).toBeNull();
    expect(buttons[1].querySelector("ha-icon")!.getAttribute("icon")).toBe(
      "mdi:delete-alert"
    );
    expect(buttons[1].classList.contains("low")).toBe(true);
  });

  it("the tooltip names both the row and the value", () => {
    expect(draw().querySelector("button.level")!.getAttribute("title")).toBe(
      "Cyan: 50 %"
    );
  });

  it("a tap reports its own entity and does not bubble to the card", () => {
    const tapped: string[] = [];
    let bubbled = 0;
    const el = draw(rows, (id) => tapped.push(id));
    el.addEventListener("click", () => (bubbled += 1));
    el.querySelectorAll<HTMLElement>("button.level")[1].click();
    expect(tapped).toEqual(["sensor.mc"]);
    expect(bubbled).toBe(0);
  });

  it("an empty list draws an empty row instead of crashing", () => {
    expect(draw([]).querySelectorAll("button.level")).toHaveLength(0);
  });
});
