/**
 * The logic of the charge tile, kept apart from the markup so it can be tested
 * in node.
 *
 * The card shows what a Home Assistant automation does; it decides nothing.
 * That is why freshness here is counted exactly the way the automation counts
 * it: a card that disagreed would say "charging to 80%" during a blind pulse.
 */
import type { HomeAssistant } from "../core/types";

export interface PickedLevel {
  entityId?: string;
  level?: number;
}

/**
 * The first numeric level of the list.
 *
 * A watch may have more than one sensor for the same battery (LNXlink can
 * register a device twice); the automation takes the first one that answers,
 * and so does the card.
 */
export function pickLevel(hass: HomeAssistant, ids: string[]): PickedLevel {
  for (const entityId of ids) {
    const state = hass.states[entityId]?.state;
    if (state === undefined || state.trim() === "") continue;
    const level = Number(state);
    if (Number.isFinite(level)) return { entityId, level };
  }
  return {};
}

/**
 * The newest report among the list.
 *
 * `last_reported` moves on every report, even an unchanged one; HA only sends
 * it when it differs from `last_changed`, hence the fallback.
 */
export function lastReport(hass: HomeAssistant, ids: string[]): Date | undefined {
  let newest: number | undefined;
  for (const entityId of ids) {
    const stateObj = hass.states[entityId] as
      | { last_reported?: string; last_updated?: string; last_changed?: string }
      | undefined;
    // last_updated also moves on an attribute change, which is still a report.
    const stamp =
      stateObj?.last_reported ?? stateObj?.last_updated ?? stateObj?.last_changed;
    if (!stamp) continue;
    const time = Date.parse(stamp);
    if (Number.isFinite(time) && (newest === undefined || time > newest)) {
      newest = time;
    }
  }
  return newest === undefined ? undefined : new Date(newest);
}

/**
 * Whether the battery data can be trusted.
 *
 * Without `staleAfter` a numeric level is enough: MQTT sensors do not re-report
 * an unchanged value, so their age says nothing, and they go unavailable when
 * the watch disconnects. With it, the newest report must be younger than that.
 *
 * `reported` is that newest report as Home Assistant knows it. The browser's
 * state stream carries no `last_reported` at all — an unchanged report is not
 * a state change and never reaches the frontend — so the card asks HA for it
 * through a template; the state's own stamps are only the fallback.
 */
export function isFresh(
  hass: HomeAssistant,
  ids: string[],
  staleAfter: number | undefined,
  now: Date,
  reported?: Date
): boolean {
  if (pickLevel(hass, ids).level === undefined) return false;
  if (staleAfter === undefined) return true;
  const last = reported ?? lastReport(hass, ids);
  return !!last && (now.getTime() - last.getTime()) / 1000 < staleAfter;
}

/** Whole minutes left on a timer, rounded up and never below zero. */
export function minutesLeft(finishesAt: string | undefined, now: Date): number {
  const end = finishesAt ? Date.parse(finishesAt) : NaN;
  if (!Number.isFinite(end)) return 0;
  return Math.max(0, Math.ceil((end - now.getTime()) / 60000));
}

export interface StatusInput {
  forced: boolean;
  minutesLeft: number;
  fresh: boolean;
  on: boolean;
  min?: number;
  max?: number;
  since?: Date;
}

export interface Status {
  key: string;
  params: Record<string, string | number>;
}

const pad = (value: number): string => String(value).padStart(2, "0");

/** The secondary line: the first rule that holds wins. */
export function chargeStatus(input: StatusInput): Status {
  if (input.forced) {
    return { key: "charge.forced", params: { minutes: input.minutesLeft } };
  }
  if (!input.fresh) {
    if (input.on) return { key: "charge.pulse", params: {} };
    const since = input.since;
    return {
      key: "charge.noData",
      params: {
        time: since ? `${pad(since.getHours())}:${pad(since.getMinutes())}` : "—",
      },
    };
  }
  return input.on
    ? { key: "charge.charging", params: { max: input.max ?? "—" } }
    : { key: "charge.waiting", params: { min: input.min ?? "—" } };
}

/**
 * A limit as it may be written: on the step, inside the entity's range, and at
 * least one step away from the other limit — min and max may not meet, or the
 * automation would switch the port on and off on the same reading.
 */
export function clampLimit(
  which: "min" | "max",
  value: number,
  other: number | undefined,
  step: number,
  lo: number,
  hi: number
): number {
  const safeStep = step > 0 ? step : 1;
  let result = Math.round(value / safeStep) * safeStep;
  if (other !== undefined) {
    result =
      which === "min"
        ? Math.min(result, other - safeStep)
        : Math.max(result, other + safeStep);
  }
  result = Math.min(hi, Math.max(lo, result));
  // Float steps (0.5) leave noise like 45.00000001 behind.
  return Number(result.toFixed(6));
}

/**
 * A template HA renders to the newest `last_reported` of the list, as epoch
 * seconds. `now()` is there only to make HA re-render it every minute: a
 * same-value report changes no state and would not wake the template.
 */
export function lastReportedTemplate(ids: string[]): string {
  return (
    `{% set _ = now() %}{{ expand(${JSON.stringify(ids)}) ` +
    "| map(attribute='last_reported') | map('as_timestamp') | max | default('') }}"
  );
}
