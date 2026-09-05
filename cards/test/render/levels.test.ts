import { describe, expect, it, beforeEach } from "vitest";
import { render } from "lit";
import { renderLevels, type LevelRow } from "../../src/core/levels";

/**
 * Разметка строк уровней. Все визуальные ошибки этой сессии ловились
 * скриншотами вручную — эти проверки закрывают хотя бы то, что мы рисуем сами.
 */
describe("строки уровней", () => {
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

  it("на каждую строку своя кнопка", () => {
    expect(draw().querySelectorAll("button.level")).toHaveLength(2);
  });

  it("подпись и значение видны текстом, а не только в подсказке", () => {
    const first = draw().querySelector("button.level")!;
    expect(first.querySelector(".name")!.textContent).toContain("Cyan");
    expect(first.querySelector(".value")!.textContent).toContain("50 %");
  });

  it("заливка ровно по уровню", () => {
    const fills = draw().querySelectorAll<HTMLElement>(".bar .fill");
    expect(fills[0].style.width).toBe("50%");
    expect(fills[1].style.width).toBe("12.5%");
  });

  it("уровень зажимается в границы полосы", () => {
    const wild = draw([
      { ...rows[0], level: -20 },
      { ...rows[1], level: 250 },
    ]).querySelectorAll<HTMLElement>(".bar .fill");
    expect(wild[0].style.width).toBe("0%");
    expect(wild[1].style.width).toBe("100%");
  });

  it("цвет содержимого приходит в строку", () => {
    expect(draw().querySelector<HTMLElement>("button.level")!.style
      .getPropertyValue("--ink")).toBe("cyan");
  });

  it("тревога помечена своим значком, спокойная строка без него", () => {
    const buttons = draw().querySelectorAll("button.level");
    expect(buttons[0].querySelector("ha-icon")).toBeNull();
    expect(buttons[1].querySelector("ha-icon")!.getAttribute("icon")).toBe(
      "mdi:delete-alert"
    );
    expect(buttons[1].classList.contains("low")).toBe(true);
  });

  it("подсказка называет и строку, и значение", () => {
    expect(draw().querySelector("button.level")!.getAttribute("title")).toBe(
      "Cyan: 50 %"
    );
  });

  it("тап отдаёт свою сущность и не всплывает до карточки", () => {
    const tapped: string[] = [];
    let bubbled = 0;
    const el = draw(rows, (id) => tapped.push(id));
    el.addEventListener("click", () => (bubbled += 1));
    el.querySelectorAll<HTMLElement>("button.level")[1].click();
    expect(tapped).toEqual(["sensor.mc"]);
    expect(bubbled).toBe(0);
  });

  it("пустой список рисует пустой ряд, а не падает", () => {
    expect(draw([]).querySelectorAll("button.level")).toHaveLength(0);
  });
});
