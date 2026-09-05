/**
 * Поиск того, что перестало отвечать.
 *
 * Единственная карточка, которая сама перебирает состояния, а не берёт
 * сущности из конфига. Так и задумано: перечислить руками девятьсот сущностей
 * невозможно, а правило отбора здесь объективное — состояние `unavailable`, —
 * так что угадывать нечего.
 *
 * Считается по устройствам, а не по сущностям: у одной отвалившейся розетки их
 * шесть, у Syncthing семнадцать, и список из девяноста двух строк говорит
 * меньше, чем список из семнадцати устройств.
 */
import type { HomeAssistant } from "./types";

/** Служебные домены: их недоступность ничего не значит для жильца. */
export const DEFAULT_IGNORED_DOMAINS = [
  "update",
  "select",
  "text",
  "button",
  "number",
  "event",
  "notify",
];

export interface OfflineGroup {
  /** Имя устройства, либо самой сущности, если устройства нет. */
  name: string;
  /** Сколько сущностей молчит. */
  count: number;
  /** За какую сущность зацепиться при тапе. */
  entityId: string;
}

export interface OfflineOptions {
  ignore?: string[];
  ignoreDomains?: string[];
}

export function findOffline(
  hass: HomeAssistant | undefined,
  options: OfflineOptions = {}
): OfflineGroup[] {
  if (!hass) return [];

  const ignored = new Set(options.ignore ?? []);
  const ignoredDomains = new Set(
    options.ignoreDomains ?? DEFAULT_IGNORED_DOMAINS
  );

  const groups = new Map<string, OfflineGroup>();

  for (const [entityId, stateObj] of Object.entries(hass.states)) {
    if (!stateObj || stateObj.state !== "unavailable") continue;
    if (ignored.has(entityId)) continue;
    if (ignoredDomains.has(entityId.split(".")[0])) continue;

    const registry = hass.entities?.[entityId];
    if (registry?.hidden) continue;

    const device = registry?.device_id
      ? hass.devices?.[registry.device_id]
      : undefined;
    const name =
      device?.name_by_user ??
      device?.name ??
      stateObj.attributes.friendly_name ??
      entityId;
    const key = registry?.device_id ?? entityId;

    const group = groups.get(key);
    if (group) {
      group.count += 1;
    } else {
      groups.set(key, { name, count: 1, entityId });
    }
  }

  // Сначала те, у кого молчит больше всего, при равенстве — по алфавиту,
  // чтобы список не прыгал от обновления к обновлению.
  return [...groups.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
}
