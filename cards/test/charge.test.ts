import { describe, expect, it } from "vitest";
import {
  chargeStatus,
  clampLimit,
  nextPeriod,
  isFresh,
  lastReport,
  minutesLeft,
  pickLevel,
} from "../src/charge/charge";
import type { HassEntity, HomeAssistant } from "../src/core/types";

const NOW = new Date("2026-11-05T15:00:00Z");

const entity = (
  entity_id: string,
  state: string,
  reported?: string
): HassEntity =>
  ({
    entity_id,
    state,
    attributes: {},
    last_changed: reported,
    last_reported: reported,
  }) as HassEntity;

const fakeHass = (entities: HassEntity[]): HomeAssistant => ({
  states: Object.fromEntries(entities.map((e) => [e.entity_id, e])),
  localize: (key) => key,
  formatEntityState: (stateObj) => stateObj.state,
  hassUrl: (path) => `http://ha.local${path ?? ""}`,
  language: "ru",
  callService: async () => undefined,
});

describe("picking the battery level", () => {
  it("skips an unavailable sensor and takes the next numeric one", () => {
    const hass = fakeHass([
      entity("sensor.a", "unavailable"),
      entity("sensor.b", "99.0"),
    ]);
    expect(pickLevel(hass, ["sensor.a", "sensor.b"])).toEqual({
      entityId: "sensor.b",
      level: 99,
    });
  });

  it("gives nothing when no sensor is numeric", () => {
    const hass = fakeHass([entity("sensor.a", "unknown")]);
    expect(pickLevel(hass, ["sensor.a", "sensor.missing"])).toEqual({});
  });
});

describe("freshness, the way the automation counts it", () => {
  it("without stale_after a numeric level is enough", () => {
    const hass = fakeHass([entity("sensor.a", "50", "2026-11-01T00:00:00Z")]);
    expect(isFresh(hass, ["sensor.a"], undefined, NOW)).toBe(true);
  });

  it("with stale_after the newest report has to be younger", () => {
    const hass = fakeHass([
      entity("sensor.a", "50", "2026-11-05T13:59:59Z"),
      entity("sensor.b", "x", "2026-11-05T14:00:01Z"),
    ]);
    expect(isFresh(hass, ["sensor.a", "sensor.b"], 3600, NOW)).toBe(true);
    expect(isFresh(hass, ["sensor.a"], 3600, NOW)).toBe(false);
  });

  it("a report time from HA beats what the browser state carries", () => {
    // The frontend's state stream has no last_reported: an unchanged report
    // reaches the card only through a template rendered on the HA side.
    const hass = fakeHass([entity("sensor.a", "50", "2026-11-05T10:00:00Z")]);
    const reported = new Date("2026-11-05T14:30:00Z");
    expect(isFresh(hass, ["sensor.a"], 3600, NOW, reported)).toBe(true);
    expect(isFresh(hass, ["sensor.a"], 3600, NOW)).toBe(false);
  });

  it("is never fresh without a numeric level", () => {
    const hass = fakeHass([entity("sensor.a", "unavailable", NOW.toISOString())]);
    expect(isFresh(hass, ["sensor.a"], undefined, NOW)).toBe(false);
  });

  it("the last report is the newest of the list", () => {
    const hass = fakeHass([
      entity("sensor.a", "1", "2026-11-05T10:00:00Z"),
      entity("sensor.b", "1", "2026-11-05T12:00:00Z"),
    ]);
    expect(lastReport(hass, ["sensor.a", "sensor.b"])?.toISOString()).toBe(
      "2026-11-05T12:00:00.000Z"
    );
  });
});

describe("minutes left on the forced charge", () => {
  it("rounds up", () => {
    const end = new Date(NOW.getTime() + 22.1 * 60000).toISOString();
    expect(minutesLeft(end, NOW)).toBe(23);
  });

  it("is never negative", () => {
    expect(minutesLeft("2026-11-05T14:00:00Z", NOW)).toBe(0);
    expect(minutesLeft(undefined, NOW)).toBe(0);
  });
});

describe("the status line", () => {
  const base = {
    forced: false,
    minutesLeft: 0,
    fresh: true,
    on: false as boolean | undefined,
    pulse: true,
    min: 50 as number | undefined,
    max: 80 as number | undefined,
  };

  it("a forced charge beats everything", () => {
    expect(
      chargeStatus({ ...base, forced: true, minutesLeft: 23, fresh: false, on: true })
    ).toEqual({ key: "charge.forced", params: { minutes: 23 } });
  });

  it("no data with the port on is a blind pulse", () => {
    expect(chargeStatus({ ...base, fresh: false, on: true })?.key).toBe("charge.pulse");
  });

  it("no data with the port off says since when", () => {
    const since = new Date(2026, 10, 5, 12, 5);
    expect(chargeStatus({ ...base, fresh: false, since })).toEqual({
      key: "charge.noData",
      params: { time: "12:05" },
    });
  });

  it("no data with the port on and no pulse configured is just no data", () => {
    const since = new Date(2026, 10, 5, 12, 5);
    expect(chargeStatus({ ...base, fresh: false, on: true, pulse: false, since })?.key).toBe(
      "charge.noData"
    );
  });

  it("without limits the port only says whether it charges", () => {
    const plain = { ...base, min: undefined, max: undefined };
    expect(chargeStatus({ ...plain, on: true })).toEqual({ key: "charge.on", params: {} });
    expect(chargeStatus({ ...plain, on: false })).toEqual({ key: "charge.off", params: {} });
  });

  it("without a port fresh data needs no status at all", () => {
    expect(chargeStatus({ ...base, on: undefined })).toBeUndefined();
    expect(chargeStatus({ ...base, on: undefined, fresh: false })?.key).toBe("charge.noData");
  });

  it("port on is charging to max, port off waits for min", () => {
    expect(chargeStatus({ ...base, on: true })).toEqual({
      key: "charge.charging",
      params: { max: 80 },
    });
    expect(chargeStatus(base)).toEqual({ key: "charge.waiting", params: { min: 50 } });
  });
});

describe("moving a limit", () => {
  it("min cannot reach max", () => {
    expect(clampLimit("min", 85, 80, 5, 10, 100)).toBe(75);
  });

  it("max cannot reach min", () => {
    expect(clampLimit("max", 40, 50, 5, 10, 100)).toBe(55);
  });

  it("snaps to the step and stays in range", () => {
    expect(clampLimit("min", 47, 80, 5, 10, 100)).toBe(45);
    expect(clampLimit("max", 120, 50, 5, 10, 100)).toBe(100);
    expect(clampLimit("min", 2, undefined, 5, 10, 100)).toBe(10);
  });
});

describe("the pulse period button", () => {
  it("adds one step per tap", () => {
    expect(nextPeriod(3, 1, 1, 48)).toBe(4);
  });

  it("goes round to the minimum after the maximum", () => {
    expect(nextPeriod(48, 1, 1, 48)).toBe(1);
  });

  it("starts from the minimum when the value is unknown", () => {
    expect(nextPeriod(undefined, 1, 1, 48)).toBe(1);
  });
});
