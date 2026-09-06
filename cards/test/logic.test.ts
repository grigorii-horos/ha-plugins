import { describe, expect, it } from "vitest";
import {
  cardName,
  composeSegments,
  formatRole,
  numericState,
  formatUnavailable,
  resolveRole,
  roleSegment,
  unavailableSegment,
  splitValueUnit,
} from "../src/core/format";
import { moistureStatus } from "../src/core/moisture";
import {
  cartridgeColor,
  cartridgeCssColor,
  cartridgeLabel,
  readMarker,
} from "../src/core/printer";
import { buttonLabel } from "../src/core/buttons";
import { mergeEntityList } from "../src/core/entity-lists";
import { languageOf, t } from "../src/core/i18n";
import { findOffline } from "../src/core/offline";
import { findUpdates } from "../src/core/updates";
import { firingStates, isFiring } from "../src/core/alerts";
import { countDemand, zoneState } from "../src/core/heating";
import { featureLayout, featureRowCount } from "../src/core/features";
import {
  levelColor,
  loadColor,
  stripBatterySuffix,
  stripDeviceName,
} from "../src/core/labels";
import { pickExtreme } from "../src/core/reduce";
import { stateActive, tileColor } from "../src/core/state-color";
import {
  defaultIconAction,
  hasAction,
  toggleAction,
} from "../src/core/actions";
import {
  MAX_BIG_VALUES,
  resolveBigKeys,
  splitRoles,
  type KeyedRole,
} from "../src/core/big-values";
import type { HassEntity, HomeAssistant } from "../src/core/types";

const entity = (
  entity_id: string,
  state: string,
  attributes: HassEntity["attributes"] = {}
): HassEntity => ({ entity_id, state, attributes });

const fakeHass = (entities: HassEntity[]): HomeAssistant => ({
  states: Object.fromEntries(entities.map((e) => [e.entity_id, e])),
  localize: (key) => key,
  formatEntityState: (stateObj) =>
    stateObj.attributes.unit_of_measurement
      ? `${stateObj.state} ${stateObj.attributes.unit_of_measurement}`
      : stateObj.state,
  hassUrl: (path) => `http://ha.local${path ?? ""}`,
  language: "ru",
  callService: async () => undefined,
});

describe("assembling the secondary line", () => {
  it("keeps the order of the filled pieces", () => {
    expect(
      composeSegments([{ text: "47 %" }, { text: "115 lx" }]).map((s) => s.text)
    ).toEqual(["47 %", "115 lx"]);
  });

  it("drops the roles that are not filled, leaving no holes", () => {
    expect(
      composeSegments([undefined, { text: "115 lx" }, undefined]).map(
        (s) => s.text
      )
    ).toEqual(["115 lx"]);
  });

  it("an empty string is not a piece", () => {
    expect(composeSegments([undefined, { text: "" }, { text: "  " }])).toEqual(
      []
    );
  });

  it("a piece remembers its entity so more-info can open it", () => {
    const segments = composeSegments([
      { text: "47 %", entityId: "sensor.hum" },
    ]);
    expect(segments[0].entityId).toBe("sensor.hum");
  });
});

describe("role resolution", () => {
  const hass = fakeHass([
    entity("sensor.temp", "27.4", { unit_of_measurement: "°C" }),
    entity("sensor.broken", "unavailable"),
    entity("sensor.pm25_idle", "-1", {
      device_class: "pm25",
      unit_of_measurement: "μg/m³",
    }),
    entity("sensor.pm25_reading", "12", {
      device_class: "pm25",
      unit_of_measurement: "μg/m³",
    }),
    entity("sensor.export", "-450", {
      device_class: "power",
      unit_of_measurement: "W",
    }),
  ]);

  it("an empty role does not resolve at all", () => {
    expect(resolveRole(hass, undefined)).toBeUndefined();
  });

  it("a missing entity is marked as missing", () => {
    const role = resolveRole(hass, "sensor.nope");
    expect(role?.missing).toBe(true);
    expect(role?.unavailable).toBe(false);
  });

  it("an unavailable entity is marked as unavailable", () => {
    const role = resolveRole(hass, "sensor.broken");
    expect(role?.missing).toBe(false);
    expect(role?.unavailable).toBe(true);
  });

  it("a minus where the quantity has no minus is not a reading", () => {
    const role = resolveRole(hass, "sensor.pm25_idle");
    expect(role?.impossible).toBe(true);
    expect(role?.unavailable).toBe(false);
    expect(formatRole(hass, role)).toBeUndefined();
    expect(numericState(role)).toBeUndefined();
  });

  it("a real reading of the same quantity goes through", () => {
    const role = resolveRole(hass, "sensor.pm25_reading");
    expect(role?.impossible).toBe(false);
    expect(numericState(role)).toBe(12);
  });

  it("a minus stays a value where the quantity has one", () => {
    // Power below zero is a house exporting to the grid, not a broken sensor.
    const role = resolveRole(hass, "sensor.export");
    expect(role?.impossible).toBe(false);
    expect(numericState(role)).toBe(-450);
  });

  it("an unavailable role gives no text — it just leaves the line", () => {
    expect(formatRole(hass, resolveRole(hass, "sensor.broken"))).toBeUndefined();
  });

  it("a normal role is formatted by HA itself", () => {
    expect(formatRole(hass, resolveRole(hass, "sensor.temp"))).toBe("27.4 °C");
  });

  it("an unavailable role returns a status for the secondary line", () => {
    expect(formatUnavailable(hass, resolveRole(hass, "sensor.broken"))).toBe(
      "unavailable"
    );
  });

  it("an available role returns no unavailability status", () => {
    expect(
      formatUnavailable(hass, resolveRole(hass, "sensor.temp"))
    ).toBeUndefined();
  });

  it("a line piece carries the role's entity", () => {
    const segment = roleSegment(hass, resolveRole(hass, "sensor.temp"));
    expect(segment).toEqual({ text: "27.4 °C", entityId: "sensor.temp" });
  });

  it("an unavailable role has no ordinary piece, only a status one", () => {
    const role = resolveRole(hass, "sensor.broken");
    expect(roleSegment(hass, role)).toBeUndefined();
    expect(unavailableSegment(hass, role)).toEqual({
      text: "unavailable",
      entityId: "sensor.broken",
    });
  });

  it("a non-numeric state does not turn into a number", () => {
    expect(numericState(resolveRole(hass, "sensor.broken"))).toBeUndefined();
    expect(numericState(resolveRole(hass, "sensor.temp"))).toBe(27.4);
  });
});

describe("the card name", () => {
  const hass = fakeHass([
    entity("sensor.temp", "27.4", { friendly_name: "Bedroom temperature" }),
  ]);

  it("comes from the config when it is set", () => {
    expect(cardName("Bedroom", resolveRole(hass, "sensor.temp"))).toBe("Bedroom");
  });

  it("otherwise falls back to the entity name", () => {
    expect(cardName(undefined, resolveRole(hass, "sensor.temp"))).toBe(
      "Bedroom temperature"
    );
  });
});

describe("splitting off the unit", () => {
  it("cuts the unit off the end", () => {
    expect(splitValueUnit("27.4 °C", "°C")).toEqual({
      value: "27.4",
      unit: "°C",
    });
  });

  it("leaves the string whole when there is no unit", () => {
    expect(splitValueUnit("Switched on", undefined)).toEqual({ value: "Switched on" });
  });

  it("does not cut when the value is nothing but the unit", () => {
    expect(splitValueUnit("°C", "°C")).toEqual({ value: "°C" });
  });
});

describe("soil moisture thresholds", () => {
  it("below the lower threshold — dry", () => {
    expect(moistureStatus(27, 30, 70)).toBe("dry");
  });

  it("between the thresholds — normal", () => {
    expect(moistureStatus(61, 30, 70)).toBe("ok");
  });

  it("above the upper threshold — overwatered", () => {
    expect(moistureStatus(85, 30, 70)).toBe("wet");
  });

  it("the bounds count as normal", () => {
    expect(moistureStatus(30, 30, 70)).toBe("ok");
    expect(moistureStatus(70, 30, 70)).toBe("ok");
  });

  it("without a number the status is unknown", () => {
    expect(moistureStatus(undefined, 30, 70)).toBe("unknown");
  });
});

describe("tile colour by state", () => {
  it("a switch that is on takes the state colour chain", () => {
    const color = tileColor(entity("switch.plug", "on"));
    expect(color).toContain("--state-switch-on-color");
    expect(color).toContain("--state-active-color");
  });

  it("a switch that is off falls back to the inactive colour", () => {
    const color = tileColor(entity("switch.plug", "off"));
    expect(color).toContain("--state-switch-off-color");
  });

  it("HA does not colour a numeric sensor — it is simply active", () => {
    expect(tileColor(entity("sensor.temp", "27.4"))).toBe(
      "var(--state-icon-color)"
    );
  });

  it("an unavailable entity takes the unavailable colour", () => {
    expect(tileColor(entity("sensor.temp", "unavailable"))).toBe(
      "var(--state-unavailable-color)"
    );
  });

  it("battery charge has a rule of its own", () => {
    expect(
      tileColor(entity("sensor.bat", "32", { device_class: "battery" }))
    ).toBe("var(--state-sensor-battery-medium-color)");
  });

  it("stateActive mirrors HA's domain rules", () => {
    expect(stateActive(entity("cover.c", "closed"))).toBe(false);
    expect(stateActive(entity("cover.c", "open"))).toBe(true);
    expect(stateActive(entity("sensor.s", "unknown"))).toBe(false);
  });
});

describe("picking the large values", () => {
  const allowed = ["temperature", "humidity", "illuminance", "pm25"];

  it("with nothing set one main role is shown", () => {
    expect(resolveBigKeys(undefined, "temperature", allowed)).toEqual([
      "temperature",
    ]);
    expect(resolveBigKeys([], "temperature", allowed)).toEqual(["temperature"]);
  });

  it("two roles are allowed", () => {
    expect(
      resolveBigKeys(["temperature", "humidity"], "temperature", allowed)
    ).toEqual(["temperature", "humidity"]);
  });

  it("three roles are allowed", () => {
    expect(
      resolveBigKeys(
        ["temperature", "humidity", "illuminance"],
        "temperature",
        allowed
      )
    ).toEqual(["temperature", "humidity", "illuminance"]);
  });

  it("four roles — a config error", () => {
    expect(() =>
      resolveBigKeys(
        ["temperature", "humidity", "illuminance", "pm25"],
        "temperature",
        allowed
      )
    ).toThrow(new RegExp(String(MAX_BIG_VALUES)));
  });

  it("an unknown role — an error with a hint", () => {
    expect(() =>
      resolveBigKeys(["temperature", "co2"], "temperature", allowed)
    ).toThrow(/co2/);
  });

  it("one role twice — an error", () => {
    expect(() =>
      resolveBigKeys(["humidity", "humidity"], "temperature", allowed)
    ).toThrow(/twice/);
  });
});

describe("splitting roles between the column and the line", () => {
  const roles: KeyedRole[] = [
    { key: "temperature" },
    { key: "humidity" },
    { key: "illuminance" },
  ];

  it("large roles are not repeated in the secondary line", () => {
    const { big, rest } = splitRoles(roles, ["temperature", "humidity"]);
    expect(big.map((item) => item.key)).toEqual(["temperature", "humidity"]);
    expect(rest.map((item) => item.key)).toEqual(["illuminance"]);
  });

  it("the order of the large ones comes from the config, not from the roles", () => {
    const { big } = splitRoles(roles, ["humidity", "temperature"]);
    expect(big.map((item) => item.key)).toEqual(["humidity", "temperature"]);
  });

  it("the remainder keeps the card's canonical order", () => {
    const { rest } = splitRoles(roles, ["humidity"]);
    expect(rest.map((item) => item.key)).toEqual([
      "temperature",
      "illuminance",
    ]);
  });
});

describe("arming the gestures", () => {
  it("an action that is not set arms no gesture — as in HA", () => {
    expect(hasAction(undefined)).toBe(false);
  });

  it('an explicit "none" does not arm one either', () => {
    expect(hasAction({ action: "none" })).toBe(false);
  });

  it("an action that is set arms it", () => {
    expect(hasAction({ action: "toggle" })).toBe(true);
  });
});

describe("the toggle service per domain", () => {
  it("an ordinary domain toggles with turn_on/turn_off", () => {
    expect(toggleAction("switch", true)).toBe("turn_on");
    expect(toggleAction("switch", false)).toBe("turn_off");
  });

  it("covers open and close with their own services", () => {
    expect(toggleAction("cover", true)).toBe("open_cover");
    expect(toggleAction("cover", false)).toBe("close_cover");
  });

  it("a lock is inverted: turning it on means unlocking", () => {
    expect(toggleAction("lock", true)).toBe("unlock");
    expect(toggleAction("lock", false)).toBe("lock");
  });

  it("a button has no off, both sides press", () => {
    expect(toggleAction("button", true)).toBe("press");
    expect(toggleAction("button", false)).toBe("press");
  });
});

describe("the default icon action", () => {
  it("a toggleable domain toggles", () => {
    expect(defaultIconAction("switch.plug")).toEqual({ action: "toggle" });
    expect(defaultIconAction("light.lamp")).toEqual({ action: "toggle" });
    expect(defaultIconAction("fan.recuperator")).toEqual({ action: "toggle" });
  });

  it("buttons and scenes count as an action too", () => {
    expect(defaultIconAction("button.restart")).toEqual({ action: "toggle" });
    expect(defaultIconAction("scene.evening")).toEqual({ action: "toggle" });
  });

  it("on a sensor the icon does nothing by itself — as in HA", () => {
    expect(defaultIconAction("sensor.temp")).toEqual({ action: "none" });
  });

  it("without an entity there is no action", () => {
    expect(defaultIconAction(undefined)).toEqual({ action: "none" });
  });
});

describe("cartridge labels and colours", () => {
  it("the printer name is cut off the cartridge name", () => {
    expect(
      cartridgeLabel("Canon G3030 series Cyan", "Canon G3030 series")
    ).toBe("Cyan");
  });

  it("without the printer name it stays as it is", () => {
    expect(cartridgeLabel("Canon G3030 series Cyan", undefined)).toBe(
      "Canon G3030 series Cyan"
    );
  });

  it("does not cut everything down to nothing", () => {
    expect(cartridgeLabel("Canon G3030 series", "Canon G3030 series")).toBe(
      "Canon G3030 series"
    );
  });

  it("the colour is guessed from the entity name", () => {
    expect(cartridgeColor("sensor.canon_g3030_series_black_pgbk")).toBe("black");
    expect(cartridgeColor("sensor.canon_g3030_series_cyan")).toBe("cyan");
    expect(cartridgeColor("sensor.canon_g3030_series_magenta")).toBe("purple");
    expect(cartridgeColor("sensor.canon_g3030_series_yellow")).toBe("yellow");
    expect(cartridgeColor("sensor.canon_g3030_series_mc")).toBe("blue-grey");
  });

  it("an unrecognised entity gets no colour", () => {
    expect(cartridgeColor("sensor.canon_g3030_series_uptime")).toBeUndefined();
  });

  it("black ink takes the text colour, not pure black", () => {
    // otherwise the drop merges with the card background on a dark theme
    expect(cartridgeCssColor("black")).toBe("var(--primary-text-color)");
  });

  it("the other colours come from the theme palette", () => {
    expect(cartridgeCssColor("cyan")).toBe(
      "var(--cyan-color, var(--state-icon-color))"
    );
  });

  it("a ready CSS colour passes through as is", () => {
    expect(cartridgeCssColor("#ff0066")).toBe("#ff0066");
  });
});

describe("button labels", () => {
  it("the shared script prefix is dropped", () => {
    expect(buttonLabel("IR — Bedroom: Night Mode")).toBe("Night Mode");
  });

  it("a name without a colon stays whole", () => {
    expect(buttonLabel("Vertical lamp")).toBe("Vertical lamp");
  });

  it("without a name there is no label", () => {
    expect(buttonLabel(undefined)).toBeUndefined();
  });
});

describe("editing an entity list in the GUI", () => {
  it("settings written in YAML survive an edit of the list", () => {
    const previous = [
      { entity: "script.a", name: "Bright", icon: "mdi:brightness-7" },
      "script.b",
    ];
    expect(mergeEntityList(previous, ["script.b", "script.a"])).toEqual([
      "script.b",
      { entity: "script.a", name: "Bright", icon: "mdi:brightness-7" },
    ]);
  });

  it("a new entity is added as a plain string", () => {
    expect(mergeEntityList([{ entity: "script.a" }], ["script.a", "script.c"]))
      .toEqual([{ entity: "script.a" }, "script.c"]);
  });

  it("a removed entity disappears together with its settings", () => {
    expect(
      mergeEntityList([{ entity: "script.a", name: "Bright" }], ["script.c"])
    ).toEqual(["script.c"]);
  });
});

describe("printer markers", () => {
  // the values are taken off a live Canon G3030 over IPP
  const ink = { marker_type: "ink-cartridge", marker_high_level: 100, marker_low_level: 15 };
  const waste = { marker_type: "waste-ink", marker_high_level: 80, marker_low_level: 0 };

  it("ink is consumed: a full tank raises no alarm", () => {
    const marker = readMarker("50", ink);
    expect(marker).toEqual({ fill: 50, alarm: false, fills: false });
  });

  it("ink below the printer's threshold — alarm", () => {
    expect(readMarker("15", ink)?.alarm).toBe(true);
    expect(readMarker("16", ink)?.alarm).toBe(false);
  });

  it("the absorber fills up: a low level is good news", () => {
    const marker = readMarker("10", waste);
    expect(marker?.alarm).toBe(false);
    expect(marker?.fills).toBe(true);
  });

  it("the absorber is full — alarm", () => {
    expect(readMarker("80", waste)?.alarm).toBe(true);
  });

  it("fullness is counted against capacity, not against a hundred", () => {
    // the absorber's capacity is 80, so 10 is 12.5% of it
    expect(readMarker("10", waste)?.fill).toBe(12.5);
  });

  it("a custom threshold overrides the printer's only for consumables", () => {
    expect(readMarker("20", ink, 25)?.alarm).toBe(true);
    expect(readMarker("20", waste, 25)?.alarm).toBe(false);
  });

  it("without marker attributes the scale is assumed to be a hundred", () => {
    expect(readMarker("40", {})).toEqual({ fill: 40, alarm: false, fills: false });
  });

  it("a non-numeric state does not count as a marker", () => {
    expect(readMarker("unavailable", ink)).toBeUndefined();
  });
});

describe("level colour", () => {
  it("full — calm", () => {
    expect(levelColor(70)).toContain("battery-high");
    expect(levelColor(100)).toContain("battery-high");
  });

  it("middling — warning", () => {
    expect(levelColor(30)).toContain("battery-medium");
    expect(levelColor(69)).toContain("battery-medium");
  });

  it("low — alarming", () => {
    expect(levelColor(29)).toContain("battery-low");
    expect(levelColor(0)).toContain("battery-low");
  });

  it("no data — the unavailable colour", () => {
    expect(levelColor(undefined)).toContain("unavailable");
  });
});

describe("cutting off the device name", () => {
  it("a shared prefix goes", () => {
    expect(stripDeviceName("Xiaomi X20+ Filter life", "Xiaomi X20+")).toBe(
      "Filter life"
    );
  });

  it("someone else's prefix is left alone", () => {
    expect(stripDeviceName("Filter life", "Xiaomi X20+")).toBe("Filter life");
  });

  it("the name is not cut down to nothing", () => {
    expect(stripDeviceName("Xiaomi X20+", "Xiaomi X20+")).toBe("Xiaomi X20+");
  });
});

describe("load colour", () => {
  it("the inverse of level colour: a lot is bad", () => {
    expect(loadColor(10)).toContain("state-icon-color");
    expect(loadColor(85)).toContain("warning");
    expect(loadColor(95)).toContain("error");
  });

  it("no data — the unavailable colour", () => {
    expect(loadColor(undefined)).toContain("unavailable");
  });
});

describe("reducing a list of sensors to one", () => {
  const hass = fakeHass([
    entity("sensor.cpu", "84.4", { unit_of_measurement: "°C" }),
    entity("sensor.gpu", "60", { unit_of_measurement: "°C" }),
    entity("sensor.nvme", "51.85", { unit_of_measurement: "°C" }),
    entity("sensor.broken", "unavailable"),
  ]);

  it("picks the hottest", () => {
    expect(
      pickExtreme(hass, ["sensor.gpu", "sensor.cpu", "sensor.nvme"], "max")
        ?.entityId
    ).toBe("sensor.cpu");
  });

  it("picks the coldest", () => {
    expect(
      pickExtreme(hass, ["sensor.gpu", "sensor.cpu", "sensor.nvme"], "min")
        ?.entityId
    ).toBe("sensor.nvme");
  });

  it("non-numeric ones are skipped", () => {
    expect(
      pickExtreme(hass, ["sensor.broken", "sensor.gpu"], "max")?.entityId
    ).toBe("sensor.gpu");
  });

  it("with no numbers at all — the first role, so the card reports the problem", () => {
    expect(pickExtreme(hass, ["sensor.broken"], "max")?.entityId).toBe(
      "sensor.broken"
    );
  });

  it("an empty list — nothing", () => {
    expect(pickExtreme(hass, [], "max")).toBeUndefined();
    expect(pickExtreme(hass, undefined, "max")).toBeUndefined();
  });
});

describe("free space and used space are different roles", () => {
  // the same class of trap as "ink low" on the absorber: on a Mac the disk sensor
  // reports the per cent FREE, and feeding that into the "used" role is wrong
  const hass = fakeHass([
    entity("sensor.mac_storage", "32.29", { unit_of_measurement: "%" }),
    entity("sensor.linux_disk_root", "72.5", { unit_of_measurement: "%" }),
    entity("sensor.linux_disk_boot", "28.8", { unit_of_measurement: "%" }),
  ]);

  it("out of the used ones the fullest is taken", () => {
    expect(
      pickExtreme(hass, ["sensor.linux_disk_boot", "sensor.linux_disk_root"], "max")
        ?.entityId
    ).toBe("sensor.linux_disk_root");
  });

  it("out of the free ones the emptiest is taken", () => {
    expect(
      pickExtreme(hass, ["sensor.mac_storage", "sensor.linux_disk_root"], "min")
        ?.entityId
    ).toBe("sensor.mac_storage");
  });

  it("free space is coloured like a battery: little is alarming", () => {
    expect(levelColor(32)).toContain("battery-medium");
    expect(levelColor(5)).toContain("battery-low");
  });

  it("used space is coloured the other way round: a lot is alarming", () => {
    expect(loadColor(32)).toContain("state-icon-color");
    expect(loadColor(95)).toContain("error");
  });
});

describe('the "Battery level" tail in a name', () => {
  it("is removed: the card is all about charge anyway", () => {
    expect(stripBatterySuffix("Phone Olga Battery level")).toBe("Phone Olga");
    expect(stripBatterySuffix("Sensor Motion Detector Kitchen Battery")).toBe(
      "Sensor Motion Detector Kitchen"
    );
  });

  it("the Russian variant too", () => {
    expect(stripBatterySuffix("Датчик кухня заряд")).toBe("Датчик кухня");
  });

  it("the name is not cut down to nothing", () => {
    expect(stripBatterySuffix("Battery")).toBe("Battery");
  });

  it("unrelated names are left alone", () => {
    expect(stripBatterySuffix("Watch")).toBe("Watch");
    expect(stripBatterySuffix(undefined)).toBeUndefined();
  });
});

describe("the cards' language", () => {
  const ru = fakeHass([]);
  const en = { ...fakeHass([]), language: "en" };

  it("comes from hass", () => {
    expect(languageOf(ru)).toBe("ru");
    expect(languageOf(en)).toBe("en");
  });

  it("the region is dropped: en-GB is en", () => {
    expect(languageOf({ ...ru, language: "en-GB" })).toBe("en");
  });

  it("an unknown language — English, not an empty string", () => {
    expect(languageOf({ ...ru, language: "uk" })).toBe("en");
    expect(languageOf(undefined)).toBe("en");
  });

  it("substitutes numbers into a string", () => {
    expect(t(ru, "batteries.allFull", { count: 43 })).toBe("Все заряжены, 43 шт.");
    expect(t(en, "batteries.allFull", { count: 43 })).toBe("All charged, 43 total");
  });

  it("Russian plural forms", () => {
    expect(t(ru, "presence.empty", { count: 1 })).toBe("Пусто, 1 зона");
    expect(t(ru, "presence.empty", { count: 3 })).toBe("Пусто, 3 зоны");
    expect(t(ru, "presence.empty", { count: 8 })).toBe("Пусто, 8 зон");
    expect(t(ru, "presence.empty", { count: 11 })).toBe("Пусто, 11 зон");
    expect(t(ru, "presence.empty", { count: 22 })).toBe("Пусто, 22 зоны");
  });

  it("English forms", () => {
    expect(t(en, "safety.calm", { count: 1 })).toBe("All clear, 1 sensor");
    expect(t(en, "safety.calm", { count: 4 })).toBe("All clear, 4 sensors");
  });

  it("an unknown key does not break the card", () => {
    expect(t(ru, "no.such.key")).toBe("no.such.key");
  });
});

describe("finding what is not responding", () => {
  // counted by device: one dead plug has six silent entities
  const hass = {
    ...fakeHass([
      entity("switch.plug", "unavailable"),
      entity("sensor.plug_power", "unavailable"),
      entity("sensor.plug_energy", "unavailable"),
      entity("light.lamp", "unavailable"),
      entity("sensor.alive", "21.5"),
      entity("update.firmware", "unavailable"),
      entity("sensor.hidden_one", "unavailable"),
      entity("sensor.no_device", "unavailable", {
        friendly_name: "Sensor without a device",
      }),
    ]),
    entities: {
      "switch.plug": { device_id: "plug" },
      "sensor.plug_power": { device_id: "plug" },
      "sensor.plug_energy": { device_id: "plug" },
      "light.lamp": { device_id: "lamp" },
      "update.firmware": { device_id: "plug" },
      "sensor.hidden_one": { device_id: "plug", hidden: true },
    },
    devices: {
      plug: { name: "Plug", name_by_user: "Boiler plug" },
      lamp: { name: "Lamp" },
    },
  };

  it("counts devices, not entities", () => {
    const groups = findOffline(hass);
    expect(groups.map((g) => [g.name, g.count])).toEqual([
      ["Boiler plug", 3],
      ["Lamp", 1],
      ["Sensor without a device", 1],
    ]);
  });

  it("a name given by the user beats the factory one", () => {
    expect(findOffline(hass)[0].name).toBe("Boiler plug");
  });

  it("service domains are not counted", () => {
    // update.firmware belongs to the same plug but does not count
    expect(findOffline(hass)[0].count).toBe(3);
    expect(findOffline(hass, { ignoreDomains: [] })[0].count).toBe(4);
  });

  it("hidden entities are not counted", () => {
    expect(
      findOffline(hass).some((g) => g.name === "Hidden")
    ).toBe(false);
  });

  it("the ones named in ignore are silent legitimately", () => {
    const groups = findOffline(hass, { ignore: ["light.lamp"] });
    expect(groups.map((g) => g.name)).not.toContain("Lamp");
  });

  it("live entities do not get in", () => {
    expect(findOffline(hass).some((g) => g.entityId === "sensor.alive")).toBe(
      false
    );
  });

  it("the order is stable: by count, then alphabetically", () => {
    const names = findOffline(hass).map((g) => g.name);
    expect(names).toEqual([...names]);
    expect(names[1] < names[2]).toBe(true);
  });

  it("without hass — an empty list, not a crash", () => {
    expect(findOffline(undefined)).toEqual([]);
  });
});

describe("finding what asks to be updated", () => {
  const hass = {
    ...fakeHass([
      entity("update.core", "on", {
        friendly_name: "Core Update",
        title: "Home Assistant Core",
        latest_version: "2026.9.1",
      }),
      entity("update.addon", "on", {
        friendly_name: "Add-on Update",
        latest_version: "3.0.0",
        skipped_version: "3.0.0",
      }),
      entity("update.router", "on", { friendly_name: "Router firmware" }),
      entity("update.quiet", "off", { friendly_name: "Nothing to do here" }),
      entity("update.hidden_one", "on", { friendly_name: "Hidden" }),
      entity("sensor.not_an_update", "on"),
    ]),
    entities: {
      "update.router": { device_id: "router" },
      "update.hidden_one": { hidden: true },
    },
    devices: { router: { name: "TP-Link", name_by_user: "Router" } },
  };

  it("counts the update entities that are on", () => {
    expect(findUpdates(hass).map((u) => u.entityId)).toEqual([
      "update.addon",
      "update.core",
      "update.router",
    ]);
  });

  it("marks a version the owner has skipped instead of hiding it", () => {
    const skipped = findUpdates(hass).filter((u) => u.skipped);
    expect(skipped.map((u) => u.entityId)).toEqual(["update.addon"]);
  });

  it("names the device where there is one, the title otherwise", () => {
    const byId = Object.fromEntries(findUpdates(hass).map((u) => [u.entityId, u.name]));
    expect(byId["update.router"]).toBe("Router");
    expect(byId["update.core"]).toBe("Home Assistant Core");
  });

  it("carries the offered version when the entity says", () => {
    expect(findUpdates(hass)[1].version).toBe("2026.9.1");
    expect(findUpdates(hass)[2].version).toBeUndefined();
  });

  it("skips hidden entities and everything outside the domain", () => {
    const ids = findUpdates(hass).map((u) => u.entityId);
    expect(ids).not.toContain("update.hidden_one");
    expect(ids).not.toContain("sensor.not_an_update");
    expect(ids).not.toContain("update.quiet");
  });

  it("ignores what it was told to ignore", () => {
    expect(
      findUpdates(hass, { ignore: ["update.core"] }).map((u) => u.entityId)
    ).not.toContain("update.core");
  });

  it("without hass — an empty list, not a crash", () => {
    expect(findUpdates(undefined)).toEqual([]);
  });
});

describe("when an alert counts as fired", () => {
  it("a binary sensor needs no configuration", () => {
    expect(firingStates({ entity: "binary_sensor.a" })).toEqual(["on"]);
    expect(isFiring({ entity: "binary_sensor.a" }, "on")).toBe(true);
    expect(isFiring({ entity: "binary_sensor.a" }, "off")).toBe(false);
  });

  it("anything else says which states count", () => {
    const printer = { entity: "sensor.printer", alert_when: ["jam", "error"] };
    expect(isFiring(printer, "jam")).toBe(true);
    expect(isFiring(printer, "error")).toBe(true);
    expect(isFiring(printer, "idle")).toBe(false);
  });

  it("one state can be given without a list", () => {
    expect(isFiring({ entity: "cover.door", alert_when: "open" }, "open")).toBe(true);
  });

  it("no data is never a firing: the card says that separately", () => {
    const item = { entity: "binary_sensor.a", alert_when: ["unavailable", "on"] };
    expect(isFiring(item, "unavailable")).toBe(false);
    expect(isFiring(item, "unknown")).toBe(false);
    expect(isFiring(item, undefined)).toBe(false);
    expect(isFiring(item, "on")).toBe(true);
  });
});

describe("what a heating zone reports", () => {
  const zone = (state: string, action?: string) =>
    entity("climate.room", state, action ? { hvac_action: action } : {});

  it("a room asking for heat", () => {
    expect(zoneState(zone("heat", "heating"))).toBe("heating");
  });

  it("a room that has what it wanted", () => {
    expect(zoneState(zone("heat", "idle"))).toBe("idle");
  });

  it("a radiator turned off", () => {
    expect(zoneState(zone("off", "off"))).toBe("off");
  });

  it("a radiator that stopped answering", () => {
    expect(zoneState(zone("unavailable"))).toBe("offline");
    expect(zoneState(undefined)).toBe("offline");
  });

  it("a thermostat that does not report demand says so", () => {
    // Not "idle": below its target it may well be calling, and we cannot tell.
    expect(zoneState(zone("heat"))).toBe("unknown");
  });

  it("the count only speaks for the rooms that answered", () => {
    expect(
      countDemand(["heating", "idle", "unknown", "offline", "off"])
    ).toEqual({ calling: 1, reporting: 3, offline: 1 });
  });
});

describe("how a features list is laid out", () => {
  const three = [{ type: "a" }, { type: "b" }, { type: "c" }];

  it("at the bottom they are one column, one row each", () => {
    const layout = featureLayout(three, "bottom");
    expect(layout.inline).toEqual([]);
    expect(layout.below).toEqual(three);
    expect(featureRowCount(layout)).toBe(3);
  });

  it("inline the first one goes up and the rest pair off", () => {
    const layout = featureLayout(three, "inline");
    expect(layout.inline).toEqual([{ type: "a" }]);
    expect(layout.below).toEqual([{ type: "b" }, { type: "c" }]);
    expect(layout.columns).toBe(2);
    expect(featureRowCount(layout)).toBe(1);
  });

  it("a single feature inline leaves nothing below", () => {
    const layout = featureLayout([{ type: "a" }], "inline");
    expect(layout.below).toEqual([]);
    expect(featureRowCount(layout)).toBe(0);
  });

  it("five inline are one up top and two rows of two", () => {
    const five = [...three, { type: "d" }, { type: "e" }];
    expect(featureRowCount(featureLayout(five, "inline"))).toBe(2);
  });

  it("no features at all is no rows", () => {
    expect(featureRowCount(featureLayout(undefined, "bottom"))).toBe(0);
  });
});
