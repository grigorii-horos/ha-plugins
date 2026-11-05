import { describe, expect, it } from "vitest";
import "../../src/charge/range-bar";
import type { HorosChargeRange } from "../../src/charge/range-bar";

const make = async (
  props: Partial<HorosChargeRange> = {}
): Promise<{ el: HorosChargeRange; events: { which: string; value: number }[] }> => {
  const el = document.createElement("horos-charge-range") as HorosChargeRange;
  Object.assign(el, { level: 42, min: 50, max: 80, step: 5, lo: 10, hi: 100 }, props);
  const events: { which: string; value: number }[] = [];
  el.addEventListener("limit-change", (event) =>
    events.push((event as CustomEvent).detail)
  );
  document.body.append(el);
  await el.updateComplete;
  return { el, events };
};

const q = (el: HTMLElement, selector: string) =>
  el.shadowRoot!.querySelector(selector) as HTMLElement | null;

const key = (target: HTMLElement, name: string) =>
  target.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true }));

describe("the charge range bar", () => {
  it("fills to the battery level", async () => {
    const { el } = await make();
    expect(q(el, ".fill")!.style.width).toBe("42%");
  });

  it("places the handles at the limits, as sliders", async () => {
    const { el } = await make();
    const min = q(el, ".handle.min")!;
    const max = q(el, ".handle.max")!;
    expect(min.getAttribute("role")).toBe("slider");
    expect(min.getAttribute("aria-valuenow")).toBe("50");
    expect(min.style.left).toBe("50%");
    expect(max.style.left).toBe("80%");
  });

  it("an arrow key moves the focused handle by one step, once", async () => {
    const { el, events } = await make();
    key(q(el, ".handle.min")!, "ArrowRight");
    expect(events).toEqual([{ which: "min", value: 55 }]);
  });

  it("a handle already against the other one does not move", async () => {
    const { el, events } = await make({ min: 75 });
    key(q(el, ".handle.min")!, "ArrowRight");
    expect(events).toEqual([]);
  });

  it("a drag writes once, on release, clamped short of the other handle", async () => {
    const { el, events } = await make();
    const track = q(el, ".track")!;
    track.getBoundingClientRect = () =>
      ({ left: 0, width: 200, top: 0, height: 42, right: 200, bottom: 42 }) as DOMRect;
    const handle = q(el, ".handle.min")!;
    handle.setPointerCapture = () => undefined;
    const pointer = (type: string, clientX: number) =>
      handle.dispatchEvent(
        new PointerEvent(type, { clientX, pointerId: 1, bubbles: true })
      );
    pointer("pointerdown", 100);
    pointer("pointermove", 130);
    pointer("pointermove", 190);
    expect(events).toEqual([]);
    pointer("pointerup", 190);
    expect(events).toEqual([{ which: "min", value: 75 }]);
  });

  it("a limit that cannot be read has no handle", async () => {
    const { el } = await make({ max: undefined });
    expect(q(el, ".handle.max")).toBeNull();
    expect(q(el, ".handle.min")).not.toBeNull();
  });

  it("labels sit inside the band when it is wide enough", async () => {
    const { el } = await make({ trackWidth: 400 });
    expect(q(el, ".label.min")!.classList.contains("outside")).toBe(false);
  });

  it("labels move outside the handles when the band is too narrow for both", async () => {
    // 50..80 on a 150px track is a 45px band: two numbers do not fit in it.
    const { el } = await make({ trackWidth: 150 });
    expect(q(el, ".label.min")!.classList.contains("outside")).toBe(true);
    expect(q(el, ".label.max")!.classList.contains("outside")).toBe(true);
  });

  it("the fill shimmers while charging", async () => {
    const { el } = await make({ charging: true });
    expect(q(el, ".fill")!.classList.contains("charging")).toBe(true);
  });
});
