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

describe("сборка вторичной строки", () => {
  it("сохраняет порядок заполненных кусков", () => {
    expect(
      composeSegments([{ text: "47 %" }, { text: "115 lx" }]).map((s) => s.text)
    ).toEqual(["47 %", "115 lx"]);
  });

  it("выбрасывает незаполненные роли, не оставляя дырок", () => {
    expect(
      composeSegments([undefined, { text: "115 lx" }, undefined]).map(
        (s) => s.text
      )
    ).toEqual(["115 lx"]);
  });

  it("пустая строка — не кусок", () => {
    expect(composeSegments([undefined, { text: "" }, { text: "  " }])).toEqual(
      []
    );
  });

  it("кусок помнит свою сущность, чтобы открыть её more-info", () => {
    const segments = composeSegments([
      { text: "47 %", entityId: "sensor.hum" },
    ]);
    expect(segments[0].entityId).toBe("sensor.hum");
  });
});

describe("разрешение ролей", () => {
  const hass = fakeHass([
    entity("sensor.temp", "27.4", { unit_of_measurement: "°C" }),
    entity("sensor.broken", "unavailable"),
  ]);

  it("пустая роль не разрешается вовсе", () => {
    expect(resolveRole(hass, undefined)).toBeUndefined();
  });

  it("отсутствующая сущность помечается как missing", () => {
    const role = resolveRole(hass, "sensor.nope");
    expect(role?.missing).toBe(true);
    expect(role?.unavailable).toBe(false);
  });

  it("недоступная сущность помечается как unavailable", () => {
    const role = resolveRole(hass, "sensor.broken");
    expect(role?.missing).toBe(false);
    expect(role?.unavailable).toBe(true);
  });

  it("недоступная роль не даёт текста — она просто исчезнет из строки", () => {
    expect(formatRole(hass, resolveRole(hass, "sensor.broken"))).toBeUndefined();
  });

  it("нормальная роль форматируется силами HA", () => {
    expect(formatRole(hass, resolveRole(hass, "sensor.temp"))).toBe("27.4 °C");
  });

  it("недоступная роль отдаёт статус для вторичной строки", () => {
    expect(formatUnavailable(hass, resolveRole(hass, "sensor.broken"))).toBe(
      "unavailable"
    );
  });

  it("доступная роль статуса недоступности не отдаёт", () => {
    expect(
      formatUnavailable(hass, resolveRole(hass, "sensor.temp"))
    ).toBeUndefined();
  });

  it("кусок строки несёт сущность роли", () => {
    const segment = roleSegment(hass, resolveRole(hass, "sensor.temp"));
    expect(segment).toEqual({ text: "27.4 °C", entityId: "sensor.temp" });
  });

  it("у недоступной роли обычного куска нет, есть кусок со статусом", () => {
    const role = resolveRole(hass, "sensor.broken");
    expect(roleSegment(hass, role)).toBeUndefined();
    expect(unavailableSegment(hass, role)).toEqual({
      text: "unavailable",
      entityId: "sensor.broken",
    });
  });

  it("нечисловое состояние не превращается в число", () => {
    expect(numericState(resolveRole(hass, "sensor.broken"))).toBeUndefined();
    expect(numericState(resolveRole(hass, "sensor.temp"))).toBe(27.4);
  });
});

describe("имя карточки", () => {
  const hass = fakeHass([
    entity("sensor.temp", "27.4", { friendly_name: "Спальня температура" }),
  ]);

  it("берётся из конфига когда задано", () => {
    expect(cardName("Спальня", resolveRole(hass, "sensor.temp"))).toBe("Спальня");
  });

  it("иначе падает на имя сущности", () => {
    expect(cardName(undefined, resolveRole(hass, "sensor.temp"))).toBe(
      "Спальня температура"
    );
  });
});

describe("отделение единицы измерения", () => {
  it("отрезает единицу с конца", () => {
    expect(splitValueUnit("27.4 °C", "°C")).toEqual({
      value: "27.4",
      unit: "°C",
    });
  });

  it("оставляет строку целой когда единицы нет", () => {
    expect(splitValueUnit("Включён", undefined)).toEqual({ value: "Включён" });
  });

  it("не режет когда значение состоит из одной единицы", () => {
    expect(splitValueUnit("°C", "°C")).toEqual({ value: "°C" });
  });
});

describe("пороги влажности почвы", () => {
  it("ниже нижнего порога — сухо", () => {
    expect(moistureStatus(27, 30, 70)).toBe("dry");
  });

  it("между порогами — норма", () => {
    expect(moistureStatus(61, 30, 70)).toBe("ok");
  });

  it("выше верхнего порога — залито", () => {
    expect(moistureStatus(85, 30, 70)).toBe("wet");
  });

  it("границы включаются в норму", () => {
    expect(moistureStatus(30, 30, 70)).toBe("ok");
    expect(moistureStatus(70, 30, 70)).toBe("ok");
  });

  it("без числа статус неизвестен", () => {
    expect(moistureStatus(undefined, 30, 70)).toBe("unknown");
  });
});

describe("цвет плитки по состоянию", () => {
  it("включённый выключатель красится цепочкой цветов состояния", () => {
    const color = tileColor(entity("switch.plug", "on"));
    expect(color).toContain("--state-switch-on-color");
    expect(color).toContain("--state-active-color");
  });

  it("выключенный выключатель уходит в неактивный цвет", () => {
    const color = tileColor(entity("switch.plug", "off"));
    expect(color).toContain("--state-switch-off-color");
  });

  it("числовой сенсор HA не окрашивает — он просто активен", () => {
    expect(tileColor(entity("sensor.temp", "27.4"))).toBe(
      "var(--state-icon-color)"
    );
  });

  it("недоступная сущность красится в цвет недоступности", () => {
    expect(tileColor(entity("sensor.temp", "unavailable"))).toBe(
      "var(--state-unavailable-color)"
    );
  });

  it("заряд батареи имеет собственное правило", () => {
    expect(
      tileColor(entity("sensor.bat", "32", { device_class: "battery" }))
    ).toBe("var(--state-sensor-battery-medium-color)");
  });

  it("stateActive повторяет правила доменов HA", () => {
    expect(stateActive(entity("cover.c", "closed"))).toBe(false);
    expect(stateActive(entity("cover.c", "open"))).toBe(true);
    expect(stateActive(entity("sensor.s", "unknown"))).toBe(false);
  });
});

describe("выбор крупных значений", () => {
  const allowed = ["temperature", "humidity", "illuminance", "pm25"];

  it("без настройки показывается одна главная роль", () => {
    expect(resolveBigKeys(undefined, "temperature", allowed)).toEqual([
      "temperature",
    ]);
    expect(resolveBigKeys([], "temperature", allowed)).toEqual(["temperature"]);
  });

  it("две роли разрешены", () => {
    expect(
      resolveBigKeys(["temperature", "humidity"], "temperature", allowed)
    ).toEqual(["temperature", "humidity"]);
  });

  it("три роли разрешены", () => {
    expect(
      resolveBigKeys(
        ["temperature", "humidity", "illuminance"],
        "temperature",
        allowed
      )
    ).toEqual(["temperature", "humidity", "illuminance"]);
  });

  it("четыре роли — ошибка конфига", () => {
    expect(() =>
      resolveBigKeys(
        ["temperature", "humidity", "illuminance", "pm25"],
        "temperature",
        allowed
      )
    ).toThrow(new RegExp(String(MAX_BIG_VALUES)));
  });

  it("неизвестная роль — ошибка с подсказкой", () => {
    expect(() =>
      resolveBigKeys(["temperature", "co2"], "temperature", allowed)
    ).toThrow(/co2/);
  });

  it("одна роль дважды — ошибка", () => {
    expect(() =>
      resolveBigKeys(["humidity", "humidity"], "temperature", allowed)
    ).toThrow(/дважды/);
  });
});

describe("деление ролей на колонку и строку", () => {
  const roles: KeyedRole[] = [
    { key: "temperature" },
    { key: "humidity" },
    { key: "illuminance" },
  ];

  it("крупные роли не повторяются во вторичной строке", () => {
    const { big, rest } = splitRoles(roles, ["temperature", "humidity"]);
    expect(big.map((item) => item.key)).toEqual(["temperature", "humidity"]);
    expect(rest.map((item) => item.key)).toEqual(["illuminance"]);
  });

  it("порядок крупных берётся из конфига, а не из порядка ролей", () => {
    const { big } = splitRoles(roles, ["humidity", "temperature"]);
    expect(big.map((item) => item.key)).toEqual(["humidity", "temperature"]);
  });

  it("остаток сохраняет канонический порядок карточки", () => {
    const { rest } = splitRoles(roles, ["humidity"]);
    expect(rest.map((item) => item.key)).toEqual([
      "temperature",
      "illuminance",
    ]);
  });
});

describe("вооружение жестов", () => {
  it("незаданное действие жест не вооружает — как в HA", () => {
    expect(hasAction(undefined)).toBe(false);
  });

  it('явное "none" тоже не вооружает', () => {
    expect(hasAction({ action: "none" })).toBe(false);
  });

  it("заданное действие вооружает", () => {
    expect(hasAction({ action: "toggle" })).toBe(true);
  });
});

describe("сервис переключения по доменам", () => {
  it("обычный домен переключается turn_on/turn_off", () => {
    expect(toggleAction("switch", true)).toBe("turn_on");
    expect(toggleAction("switch", false)).toBe("turn_off");
  });

  it("шторы открываются и закрываются своими сервисами", () => {
    expect(toggleAction("cover", true)).toBe("open_cover");
    expect(toggleAction("cover", false)).toBe("close_cover");
  });

  it("замок инвертирован: включить значит открыть", () => {
    expect(toggleAction("lock", true)).toBe("unlock");
    expect(toggleAction("lock", false)).toBe("lock");
  });

  it("у кнопки выключения нет, обе стороны нажимают", () => {
    expect(toggleAction("button", true)).toBe("press");
    expect(toggleAction("button", false)).toBe("press");
  });
});

describe("действие иконки по умолчанию", () => {
  it("переключаемый домен переключается", () => {
    expect(defaultIconAction("switch.plug")).toEqual({ action: "toggle" });
    expect(defaultIconAction("light.lamp")).toEqual({ action: "toggle" });
    expect(defaultIconAction("fan.recuperator")).toEqual({ action: "toggle" });
  });

  it("кнопки и сцены тоже считаются действием", () => {
    expect(defaultIconAction("button.restart")).toEqual({ action: "toggle" });
    expect(defaultIconAction("scene.evening")).toEqual({ action: "toggle" });
  });

  it("у сенсора иконка сама по себе ничего не делает — как в HA", () => {
    expect(defaultIconAction("sensor.temp")).toEqual({ action: "none" });
  });

  it("без сущности действия нет", () => {
    expect(defaultIconAction(undefined)).toEqual({ action: "none" });
  });
});

describe("подписи и цвета картриджей", () => {
  it("имя принтера отрезается от имени картриджа", () => {
    expect(
      cartridgeLabel("Canon G3030 series Cyan", "Canon G3030 series")
    ).toBe("Cyan");
  });

  it("без имени принтера остаётся как есть", () => {
    expect(cartridgeLabel("Canon G3030 series Cyan", undefined)).toBe(
      "Canon G3030 series Cyan"
    );
  });

  it("не отрезает всё под ноль", () => {
    expect(cartridgeLabel("Canon G3030 series", "Canon G3030 series")).toBe(
      "Canon G3030 series"
    );
  });

  it("цвет угадывается по имени сущности", () => {
    expect(cartridgeColor("sensor.canon_g3030_series_black_pgbk")).toBe("black");
    expect(cartridgeColor("sensor.canon_g3030_series_cyan")).toBe("cyan");
    expect(cartridgeColor("sensor.canon_g3030_series_magenta")).toBe("purple");
    expect(cartridgeColor("sensor.canon_g3030_series_yellow")).toBe("yellow");
    expect(cartridgeColor("sensor.canon_g3030_series_mc")).toBe("blue-grey");
  });

  it("непонятная сущность цвета не получает", () => {
    expect(cartridgeColor("sensor.canon_g3030_series_uptime")).toBeUndefined();
  });

  it("чёрные чернила красятся цветом текста, а не чистым чёрным", () => {
    // иначе на тёмной теме капля сливается с фоном карточки
    expect(cartridgeCssColor("black")).toBe("var(--primary-text-color)");
  });

  it("остальные цвета берутся из палитры темы", () => {
    expect(cartridgeCssColor("cyan")).toBe(
      "var(--cyan-color, var(--state-icon-color))"
    );
  });

  it("готовый CSS-цвет пропускается как есть", () => {
    expect(cartridgeCssColor("#ff0066")).toBe("#ff0066");
  });
});

describe("подписи кнопок", () => {
  it("общий префикс скрипта отбрасывается", () => {
    expect(buttonLabel("IR — Bedroom: Night Mode")).toBe("Night Mode");
  });

  it("имя без двоеточия остаётся целым", () => {
    expect(buttonLabel("Вертикальная лампа")).toBe("Вертикальная лампа");
  });

  it("без имени подписи нет", () => {
    expect(buttonLabel(undefined)).toBeUndefined();
  });
});

describe("правка списка сущностей в GUI", () => {
  it("настройки, дописанные в YAML, переживают правку списка", () => {
    const previous = [
      { entity: "script.a", name: "Ярко", icon: "mdi:brightness-7" },
      "script.b",
    ];
    expect(mergeEntityList(previous, ["script.b", "script.a"])).toEqual([
      "script.b",
      { entity: "script.a", name: "Ярко", icon: "mdi:brightness-7" },
    ]);
  });

  it("новая сущность добавляется просто строкой", () => {
    expect(mergeEntityList([{ entity: "script.a" }], ["script.a", "script.c"]))
      .toEqual([{ entity: "script.a" }, "script.c"]);
  });

  it("убранная сущность исчезает вместе со своими настройками", () => {
    expect(
      mergeEntityList([{ entity: "script.a", name: "Ярко" }], ["script.c"])
    ).toEqual(["script.c"]);
  });
});

describe("маркеры принтера", () => {
  // значения сняты с живого Canon G3030 через IPP
  const ink = { marker_type: "ink-cartridge", marker_high_level: 100, marker_low_level: 15 };
  const waste = { marker_type: "waste-ink", marker_high_level: 80, marker_low_level: 0 };

  it("чернила расходуются: полный бак тревоги не даёт", () => {
    const marker = readMarker("50", ink);
    expect(marker).toEqual({ fill: 50, alarm: false, fills: false });
  });

  it("чернила ниже порога принтера — тревога", () => {
    expect(readMarker("15", ink)?.alarm).toBe(true);
    expect(readMarker("16", ink)?.alarm).toBe(false);
  });

  it("поглотитель наполняется: низкий уровень это хорошо", () => {
    const marker = readMarker("10", waste);
    expect(marker?.alarm).toBe(false);
    expect(marker?.fills).toBe(true);
  });

  it("поглотитель полон — тревога", () => {
    expect(readMarker("80", waste)?.alarm).toBe(true);
  });

  it("наполненность считается от вместимости, а не от сотни", () => {
    // у поглотителя вместимость 80, поэтому 10 это 12.5% ёмкости
    expect(readMarker("10", waste)?.fill).toBe(12.5);
  });

  it("свой порог перебивает порог принтера только у расходуемых", () => {
    expect(readMarker("20", ink, 25)?.alarm).toBe(true);
    expect(readMarker("20", waste, 25)?.alarm).toBe(false);
  });

  it("без атрибутов маркера шкала считается сотенной", () => {
    expect(readMarker("40", {})).toEqual({ fill: 40, alarm: false, fills: false });
  });

  it("нечисловое состояние маркером не считается", () => {
    expect(readMarker("unavailable", ink)).toBeUndefined();
  });
});

describe("цвет уровня", () => {
  it("полный — спокойный", () => {
    expect(levelColor(70)).toContain("battery-high");
    expect(levelColor(100)).toContain("battery-high");
  });

  it("средний — предупреждающий", () => {
    expect(levelColor(30)).toContain("battery-medium");
    expect(levelColor(69)).toContain("battery-medium");
  });

  it("низкий — тревожный", () => {
    expect(levelColor(29)).toContain("battery-low");
    expect(levelColor(0)).toContain("battery-low");
  });

  it("без данных — цвет недоступности", () => {
    expect(levelColor(undefined)).toContain("unavailable");
  });
});

describe("отрезание имени устройства", () => {
  it("общий префикс уходит", () => {
    expect(stripDeviceName("Xiaomi X20+ Filter life", "Xiaomi X20+")).toBe(
      "Filter life"
    );
  });

  it("чужой префикс не трогается", () => {
    expect(stripDeviceName("Filter life", "Xiaomi X20+")).toBe("Filter life");
  });

  it("имя не срезается под ноль", () => {
    expect(stripDeviceName("Xiaomi X20+", "Xiaomi X20+")).toBe("Xiaomi X20+");
  });
});

describe("цвет нагрузки", () => {
  it("обратен цвету уровня: много — плохо", () => {
    expect(loadColor(10)).toContain("state-icon-color");
    expect(loadColor(85)).toContain("warning");
    expect(loadColor(95)).toContain("error");
  });

  it("без данных — цвет недоступности", () => {
    expect(loadColor(undefined)).toContain("unavailable");
  });
});

describe("сведение списка датчиков к одному", () => {
  const hass = fakeHass([
    entity("sensor.cpu", "84.4", { unit_of_measurement: "°C" }),
    entity("sensor.gpu", "60", { unit_of_measurement: "°C" }),
    entity("sensor.nvme", "51.85", { unit_of_measurement: "°C" }),
    entity("sensor.broken", "unavailable"),
  ]);

  it("выбирает самый горячий", () => {
    expect(
      pickExtreme(hass, ["sensor.gpu", "sensor.cpu", "sensor.nvme"], "max")
        ?.entityId
    ).toBe("sensor.cpu");
  });

  it("выбирает самый холодный", () => {
    expect(
      pickExtreme(hass, ["sensor.gpu", "sensor.cpu", "sensor.nvme"], "min")
        ?.entityId
    ).toBe("sensor.nvme");
  });

  it("нечисловые пропускаются", () => {
    expect(
      pickExtreme(hass, ["sensor.broken", "sensor.gpu"], "max")?.entityId
    ).toBe("sensor.gpu");
  });

  it("если чисел нет вовсе — отдаёт первую роль, чтобы карточка сказала о проблеме", () => {
    expect(pickExtreme(hass, ["sensor.broken"], "max")?.entityId).toBe(
      "sensor.broken"
    );
  });

  it("пустой список — ничего", () => {
    expect(pickExtreme(hass, [], "max")).toBeUndefined();
    expect(pickExtreme(hass, undefined, "max")).toBeUndefined();
  });
});

describe("свободное место и занятое — разные роли", () => {
  // ловушка того же рода, что «мало чернил» у поглотителя: у Mac сенсор диска
  // отдаёт процент СВОБОДНОГО, и подставлять его в роль «занято» нельзя
  const hass = fakeHass([
    entity("sensor.mac_storage", "32.29", { unit_of_measurement: "%" }),
    entity("sensor.linux_disk_root", "72.5", { unit_of_measurement: "%" }),
    entity("sensor.linux_disk_boot", "28.8", { unit_of_measurement: "%" }),
  ]);

  it("из занятого берётся самый полный", () => {
    expect(
      pickExtreme(hass, ["sensor.linux_disk_boot", "sensor.linux_disk_root"], "max")
        ?.entityId
    ).toBe("sensor.linux_disk_root");
  });

  it("из свободного берётся самый пустой", () => {
    expect(
      pickExtreme(hass, ["sensor.mac_storage", "sensor.linux_disk_root"], "min")
        ?.entityId
    ).toBe("sensor.mac_storage");
  });

  it("свободное красится как батарейка: мало — тревожно", () => {
    expect(levelColor(32)).toContain("battery-medium");
    expect(levelColor(5)).toContain("battery-low");
  });

  it("занятое красится обратно: много — тревожно", () => {
    expect(loadColor(32)).toContain("state-icon-color");
    expect(loadColor(95)).toContain("error");
  });
});

describe("хвост «Battery level» в имени", () => {
  it("убирается: карточка и так вся про заряд", () => {
    expect(stripBatterySuffix("Phone Olga Battery level")).toBe("Phone Olga");
    expect(stripBatterySuffix("Sensor Motion Detector Kitchen Battery")).toBe(
      "Sensor Motion Detector Kitchen"
    );
  });

  it("русский вариант тоже", () => {
    expect(stripBatterySuffix("Датчик кухня заряд")).toBe("Датчик кухня");
  });

  it("имя не срезается под ноль", () => {
    expect(stripBatterySuffix("Battery")).toBe("Battery");
  });

  it("посторонние имена не трогает", () => {
    expect(stripBatterySuffix("Часы")).toBe("Часы");
    expect(stripBatterySuffix(undefined)).toBeUndefined();
  });
});

describe("язык карточек", () => {
  const ru = fakeHass([]);
  const en = { ...fakeHass([]), language: "en" };

  it("берётся из hass", () => {
    expect(languageOf(ru)).toBe("ru");
    expect(languageOf(en)).toBe("en");
  });

  it("región отбрасывается: en-GB это en", () => {
    expect(languageOf({ ...ru, language: "en-GB" })).toBe("en");
  });

  it("незнакомый язык — английский, а не пустая строка", () => {
    expect(languageOf({ ...ru, language: "uk" })).toBe("en");
    expect(languageOf(undefined)).toBe("en");
  });

  it("подставляет числа в строку", () => {
    expect(t(ru, "batteries.allFull", { count: 43 })).toBe("Все заряжены, 43 шт.");
    expect(t(en, "batteries.allFull", { count: 43 })).toBe("All charged, 43 total");
  });

  it("русские формы множественного числа", () => {
    expect(t(ru, "presence.empty", { count: 1 })).toBe("Пусто, 1 зона");
    expect(t(ru, "presence.empty", { count: 3 })).toBe("Пусто, 3 зоны");
    expect(t(ru, "presence.empty", { count: 8 })).toBe("Пусто, 8 зон");
    expect(t(ru, "presence.empty", { count: 11 })).toBe("Пусто, 11 зон");
    expect(t(ru, "presence.empty", { count: 22 })).toBe("Пусто, 22 зоны");
  });

  it("английские формы", () => {
    expect(t(en, "safety.calm", { count: 1 })).toBe("All clear, 1 sensor");
    expect(t(en, "safety.calm", { count: 4 })).toBe("All clear, 4 sensors");
  });

  it("неизвестный ключ не роняет карточку", () => {
    expect(t(ru, "нет.такого")).toBe("нет.такого");
  });
});
