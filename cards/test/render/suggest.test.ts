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

const hass = {
  states: Object.fromEntries(STATES.map((e) => [e.entity_id, e])),
  entities: {
    ...Object.fromEntries(
      Object.entries(DEVICES).map(([id, device_id]) => [id, { device_id }])
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

  it("an entity nothing can be built around gets no suggestion at all", () => {
    const types = (window.customCards ?? [])
      .filter((card) => suggest(card.type, "sensor.lonely_temperature").length)
      .map((card) => card.type);
    expect(types).toEqual([]);
  });
});
