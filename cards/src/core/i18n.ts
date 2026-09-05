/**
 * Строки карточек на языке пользователя.
 *
 * Home Assistant переводит состояния сам, а наши подписи были жёстко русскими.
 * На английском интерфейсе получалось «Всё спокойно, 1 датч.» рядом с
 * «Docked · Standard · Charging» — половина карточки на одном языке, половина
 * на другом.
 *
 * Названия карточек в списке добавления остаются английскими: этот список
 * заполняется при загрузке бандла, когда языка пользователя ещё нет.
 */
import type { HomeAssistant } from "./types";

type Dict = Record<string, string>;

const RU: Dict = {
  "entity.missing.one": "Сущность не найдена: {list}",
  "entity.missing.many": "Сущности не найдены: {list}",
  "internals.failed": "Не удалось загрузить компоненты Home Assistant",
  "value.unknown": "нет данных",

  "batteries.title": "Батарейки",
  "batteries.allFull": "Все заряжены, {count} шт.",

  "safety.title": "Безопасность",
  "safety.calm.one": "Всё спокойно, {count} датчик",
  "safety.calm.few": "Всё спокойно, {count} датчика",
  "safety.calm.many": "Всё спокойно, {count} датчиков",
  "safety.offline": "{name}: нет связи",

  "presence.title": "Присутствие",
  "presence.empty.one": "Пусто, {count} зона",
  "presence.empty.few": "Пусто, {count} зоны",
  "presence.empty.many": "Пусто, {count} зон",

  "energy.title": "Энергия",
  "energy.consuming": "{count} потребляют",
  "energy.idle": "Никто не потребляет",

  "offline.count": "{count} без связи",
  "offline.title": "Не отвечает",
  "offline.allAnswer": "Все на связи",
  "offline.more.one": "и ещё {count}",
  "offline.more.few": "и ещё {count}",
  "offline.more.many": "и ещё {count}",
  "list.missing.one": "{count} не найдена",
  "list.missing.few": "{count} не найдены",
  "list.missing.many": "{count} не найдено",

  "server.title": "Домашний сервер",
  "vacuum.title": "Пылесос",
  "printer.title": "Принтер",
  "computer.title": "Компьютер",
  "person.title": "Человек",
  "air.title": "Воздух",
  "cover.title": "Шторы",

  "level.cpu": "CPU",
  "level.memory": "Память",
  "level.gpu": "GPU",
  "level.disk": "Диск",
  "level.diskFree": "Свободно",
  "level.open": "Открыто",
};

const EN: Dict = {
  "entity.missing.one": "Entity not found: {list}",
  "entity.missing.many": "Entities not found: {list}",
  "internals.failed": "Could not load Home Assistant components",
  "value.unknown": "no data",

  "batteries.title": "Batteries",
  "batteries.allFull": "All charged, {count} total",

  "safety.title": "Safety",
  "safety.calm.one": "All clear, {count} sensor",
  "safety.calm.many": "All clear, {count} sensors",
  "safety.offline": "{name}: no connection",

  "presence.title": "Presence",
  "presence.empty.one": "Empty, {count} area",
  "presence.empty.many": "Empty, {count} areas",

  "energy.title": "Energy",
  "energy.consuming": "{count} drawing power",
  "energy.idle": "Nothing drawing power",

  "offline.count": "{count} offline",
  "offline.title": "Not responding",
  "offline.allAnswer": "Everything is answering",
  "offline.more.one": "and {count} more",
  "offline.more.many": "and {count} more",
  "list.missing.one": "{count} not found",
  "list.missing.many": "{count} not found",

  "server.title": "Home server",
  "vacuum.title": "Vacuum",
  "printer.title": "Printer",
  "computer.title": "Computer",
  "person.title": "Person",
  "air.title": "Air",
  "cover.title": "Curtains",

  "level.cpu": "CPU",
  "level.memory": "Memory",
  "level.gpu": "GPU",
  "level.disk": "Disk",
  "level.diskFree": "Free",
  "level.open": "Open",
};

const DICTS: Record<string, Dict> = { ru: RU, en: EN };

/** Язык пользователя из hass; на неизвестном языке говорим по-английски. */
export function languageOf(hass: HomeAssistant | undefined): string {
  const language = hass?.language ?? hass?.locale?.language ?? "en";
  const base = language.split("-")[0].toLowerCase();
  return base in DICTS ? base : "en";
}

/**
 * Форма множественного числа. У русского их три, у английского две — «1
 * sensors» и «2 зона» одинаково режут глаз.
 */
function pluralForm(language: string, count: number): "one" | "few" | "many" {
  if (language !== "ru") return count === 1 ? "one" : "many";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "one";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
  return "many";
}

export function t(
  hass: HomeAssistant | undefined,
  key: string,
  params: Record<string, string | number> = {}
): string {
  const language = languageOf(hass);
  const dict = DICTS[language] ?? EN;

  // Ключ со счётчиком может иметь формы: safety.calm.one / .few / .many
  const count = params.count;
  const form =
    typeof count === "number"
      ? `${key}.${pluralForm(language, count)}`
      : undefined;

  const template =
    (form && (dict[form] ?? EN[form])) ?? dict[key] ?? EN[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole
  );
}
