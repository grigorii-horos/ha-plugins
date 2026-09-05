import { beforeAll, describe, expect, it } from "vitest";
import type { CardSuggestion, HassEntity, HomeAssistant } from "../../src/core/types";

/**
 * Entity suggestions, checked the way HA asks for them: through the entries the
 * bundle puts into `window.customCards`.
 *
 * This needs a DOM because importing the cards registers custom elements, so
 * the test lives in the happy-dom half of the suite.
 */

const entity = (
  entity_id: string,
  state: string,
  attributes: HassEntity["attributes"] = {}
): HassEntity => ({ entity_id, state, attributes });

const STATES: HassEntity[] = [
  entity("sensor.bedroom_temperature", "21.5", { device_class: "temperature" }),
  entity("sensor.bedroom_humidity", "48", { device_class: "humidity" }),
  entity("sensor.bedroom_battery", "97", { device_class: "battery" }),
  entity("sensor.lonely_temperature", "18", { device_class: "temperature" }),
  entity("switch.boiler", "on"),
  entity("sensor.boiler_power", "7", { device_class: "power" }),
  entity("sensor.boiler_energy", "368", { device_class: "energy" }),
  entity("sensor.orange_moisture", "63", { device_class: "moisture" }),
  entity("sensor.orange_temperature", "22", { device_class: "temperature" }),
  entity("sensor.printer_status", "Idle"),
  entity("sensor.printer_black", "40", { marker_type: "ink-cartridge" }),
  entity("sensor.printer_cyan", "50", { marker_type: "ink-cartridge" }),
  entity("sensor.printer_uptime", "1200"),
  entity("binary_sensor.kitchen_leak", "off", { device_class: "moisture" }),
  entity("binary_sensor.hall_smoke", "off", { device_class: "smoke" }),
  entity("sensor.watch_battery", "57", { device_class: "battery" }),
  entity("sensor.hidden_battery", "10", { device_class: "battery" }),
  entity("sensor.kitchen_temperature", "23", { device_class: "temperature" }),
  entity("binary_sensor.kitchen_area", "on", { device_class: "occupancy" }),
  entity("binary_sensor.kitchen_motion", "on", { device_class: "motion" }),
  entity("binary_sensor.bedroom_area", "off", { device_class: "occupancy" }),
  entity("binary_sensor.homeless_presence", "on", { device_class: "presence" }),
  entity("sensor.house_power", "430", { device_class: "power" }),
  entity("light.kitchen_strip", "on", { brightness: 128 }),
  entity("light.kitchen_lamp", "off"),
  entity("light.lonely_lamp", "on"),
  entity("media_player.kitchen_speaker", "playing", { volume_level: 0.4 }),
  entity("media_player.kitchen_tv", "idle"),
  entity("climate.kitchen_ac", "cool"),
  entity("update.core", "on", { latest_version: "2026.9.1" }),
  entity("todo.shopping", "3"),
  entity("todo.chores", "1"),
  entity("binary_sensor.pump_problem", "on", { device_class: "problem" }),
  entity("binary_sensor.box_tamper", "off", { device_class: "tamper" }),
];

const DEVICES: Record<string, string> = {
  "sensor.bedroom_temperature": "bedroom_sensor",
  "sensor.bedroom_humidity": "bedroom_sensor",
  "sensor.bedroom_battery": "bedroom_sensor",
  "switch.boiler": "plug",
  "sensor.boiler_power": "plug",
  "sensor.boiler_energy": "plug",
  "sensor.orange_moisture": "soil_sensor",
  "sensor.orange_temperature": "soil_sensor",
  "sensor.printer_status": "printer",
  "sensor.printer_black": "printer",
  "sensor.printer_cyan": "printer",
  "sensor.printer_uptime": "printer",
};

const AREAS: Record<string, string> = {
  "binary_sensor.kitchen_area": "kitchen",
  "binary_sensor.kitchen_motion": "kitchen",
  "binary_sensor.bedroom_area": "bedroom",
  "light.kitchen_strip": "kitchen",
  "light.kitchen_lamp": "kitchen",
  "media_player.kitchen_speaker": "kitchen",
  "media_player.kitchen_tv": "kitchen",
  "climate.kitchen_ac": "kitchen",
  "sensor.kitchen_temperature": "kitchen",
};

const hass = {
  states: Object.fromEntries(STATES.map((e) => [e.entity_id, e])),
  entities: {
    ...Object.fromEntries(
      Object.entries(DEVICES).map(([id, device_id]) => [id, { device_id }])
    ),
    ...Object.fromEntries(
      Object.entries(AREAS).map(([id, area_id]) => [id, { area_id }])
    ),
    "sensor.hidden_battery": { hidden: true },
  },
  localize: (key: string) => key,
  formatEntityState: (stateObj: HassEntity) => stateObj.state,
  hassUrl: (path?: string) => path ?? "",
  callService: async () => undefined,
} as unknown as HomeAssistant;

const suggest = (type: string, entityId: string): CardSuggestion[] => {
  const entry = window.customCards?.find((card) => card.type === type);
  if (!entry?.getEntitySuggestion) return [];
  const result = entry.getEntitySuggestion(hass, entityId);
  if (!result) return [];
  return Array.isArray(result) ? result : [result];
};

const config = (type: string, entityId: string) =>
  suggest(type, entityId)[0]?.config;

beforeAll(async () => {
  await import("../../src/main");
});

describe("entity suggestions", () => {
  it("every card that suggests is registered with a suggestion function", () => {
    const withSuggestion = (window.customCards ?? []).filter(
      (card) => card.getEntitySuggestion
    );
    expect(withSuggestion.length).toBeGreaterThan(0);
  });

  it("a room sensor suggests the climate card with its siblings", () => {
    expect(config("horos-climate-tile", "sensor.bedroom_temperature")).toEqual({
      type: "custom:horos-climate-tile",
      temperature: "sensor.bedroom_temperature",
      humidity: "sensor.bedroom_humidity",
    });
  });

  it("the picked entity keeps its own role", () => {
    expect(
      config("horos-climate-tile", "sensor.bedroom_humidity")
    ).toMatchObject({ humidity: "sensor.bedroom_humidity" });
  });

  it("a lone temperature sensor suggests nothing — that is the stock tile", () => {
    expect(suggest("horos-climate-tile", "sensor.lonely_temperature")).toEqual(
      []
    );
  });

  it("a metered plug suggests the plug card from one device", () => {
    expect(config("horos-plug-tile", "switch.boiler")).toEqual({
      type: "custom:horos-plug-tile",
      switch: "switch.boiler",
      power: "sensor.boiler_power",
      energy: "sensor.boiler_energy",
    });
  });

  it("soil moisture suggests the plant card", () => {
    expect(config("horos-plant-tile", "sensor.orange_moisture")).toEqual({
      type: "custom:horos-plant-tile",
      moisture: "sensor.orange_moisture",
      temperature: "sensor.orange_temperature",
    });
  });

  it("a printer marker suggests every cartridge of that printer", () => {
    expect(config("horos-printer-tile", "sensor.printer_black")).toEqual({
      type: "custom:horos-printer-tile",
      status: "sensor.printer_status",
      cartridges: ["sensor.printer_black", "sensor.printer_cyan"],
    });
  });

  it("a battery suggests the whole set, the picked one first", () => {
    expect(config("horos-batteries-tile", "sensor.watch_battery")).toEqual({
      type: "custom:horos-batteries-tile",
      batteries: [
        "sensor.watch_battery",
        "sensor.bedroom_battery",
      ],
    });
  });

  it("hidden entities stay out of a suggested list", () => {
    const batteries = config("horos-batteries-tile", "sensor.watch_battery")
      ?.batteries as string[];
    expect(batteries).not.toContain("sensor.hidden_battery");
  });

  it("a leak sensor suggests the safety card with the other alarms", () => {
    expect(config("horos-safety-tile", "binary_sensor.kitchen_leak")).toEqual({
      type: "custom:horos-safety-tile",
      sensors: ["binary_sensor.kitchen_leak", "binary_sensor.hall_smoke"],
    });
  });

  it("any entity of the printer leads to the printer card", () => {
    // Whoever clicks the uptime sensor is looking at the printer, not at a
    // counter: the whole device is one card here.
    expect(config("horos-printer-tile", "sensor.printer_uptime")).toMatchObject({
      cartridges: ["sensor.printer_black", "sensor.printer_cyan"],
    });
  });

  it("presence takes one sensor per area, the area aggregate winning", () => {
    expect(config("horos-presence-tile", "binary_sensor.bedroom_area")).toEqual({
      type: "custom:horos-presence-tile",
      areas: ["binary_sensor.bedroom_area", "binary_sensor.kitchen_area"],
    });
  });

  it("a presence sensor with no area is not about a room, so it is left out", () => {
    const areas = config("horos-presence-tile", "binary_sensor.bedroom_area")
      ?.areas as string[];
    expect(areas).not.toContain("binary_sensor.homeless_presence");
  });

  it("energy keeps the metered plugs and leaves the house total out of them", () => {
    expect(config("horos-energy-tile", "sensor.boiler_power")).toEqual({
      type: "custom:horos-energy-tile",
      consumers: ["sensor.boiler_power"],
      limit: 6,
    });
  });

  it("a device-less power sensor becomes the total instead of a consumer", () => {
    expect(config("horos-energy-tile", "sensor.house_power")).toEqual({
      type: "custom:horos-energy-tile",
      total: "sensor.house_power",
      consumers: ["sensor.boiler_power"],
      limit: 6,
    });
  });

  it("a light suggests the lights of its area, not of the house", () => {
    expect(config("horos-light-tile", "light.kitchen_strip")).toEqual({
      type: "custom:horos-light-tile",
      lights: ["light.kitchen_strip", "light.kitchen_lamp"],
    });
  });

  it("a light with no area suggests nothing — a room is what makes a set", () => {
    expect(suggest("horos-light-tile", "light.lonely_lamp")).toEqual([]);
  });

  it("a speaker suggests the players of its area", () => {
    expect(config("horos-media-tile", "media_player.kitchen_speaker")).toEqual({
      type: "custom:horos-media-tile",
      players: ["media_player.kitchen_speaker", "media_player.kitchen_tv"],
    });
  });

  it("a climate entity is paired with the room's own sensors", () => {
    expect(config("horos-ac-tile", "climate.kitchen_ac")).toEqual({
      type: "custom:horos-ac-tile",
      climate: "climate.kitchen_ac",
      temperature: "sensor.kitchen_temperature",
    });
  });

  it("any update entity leads to the card that speaks for all of them", () => {
    expect(config("horos-updates-tile", "update.core")).toEqual({
      type: "custom:horos-updates-tile",
    });
  });

  it("a to-do list suggests the card holding every list", () => {
    expect(config("horos-tasks-tile", "todo.chores")).toEqual({
      type: "custom:horos-tasks-tile",
      lists: ["todo.chores", "todo.shopping"],
    });
  });

  it("a problem sensor suggests the alerts card with the quiet ones too", () => {
    expect(config("horos-alerts-tile", "binary_sensor.pump_problem")).toEqual({
      type: "custom:horos-alerts-tile",
      alerts: ["binary_sensor.pump_problem", "binary_sensor.box_tamper"],
    });
  });

  it("an entity nothing can be built around gets no suggestion at all", () => {
    const types = (window.customCards ?? [])
      .filter((card) => suggest(card.type, "sensor.lonely_temperature").length)
      .map((card) => card.type);
    expect(types).toEqual([]);
  });
});
