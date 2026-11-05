# Charge tile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `custom:horos-charge-tile` — one 2-row card per watch: battery, min/max range bar, 30-minute forced charge — plus the HA timers/automation it drives.

**Architecture:** Pure logic (level pick, freshness, status, minutes left, limit clamping) in `cards/src/charge/charge.ts`; the range bar is a small LitElement `horos-charge-range` in `cards/src/charge/range-bar.ts` that emits one `limit-change` event on release; the card extends `BaseTileCard` and puts the bar + force button into `customFeatures`.

**Tech Stack:** Lit 3, TypeScript, Vite, vitest (node + happy-dom). HA REST/WS via `~/Sync/Configs/Things/homeassistant/bin/ha`.

**Spec:** `docs/superpowers/specs/2026-11-05-charge-tile-design.md`

## Global Constraints

- Height exactly 2 rows: `getGridOptions()` → `rows: 2, min_rows: 2`, `getCardSize()` → 2; `:host`/`ha-card` fill `2 * 64 - 8 = 120px`.
- Control height `var(--feature-height, 42px)`; colours/sizes only via HA tokens with fallback.
- Strings via `t()`, ru + en at once. Comments English, explain why.
- `levels.ts` untouched; nothing new in `core/`.
- Build `npm run build` (sets `NODE_ENV=production`); `dist/` committed; deploy `../script/publish.py`.
- HA order: timers + automation first, card second, dashboard swap last. Dashboard edits merge, never overwrite.

## Review Focus

- Limit entity unavailable → bar shows no handle for it, drag disabled, no service call (test in Task 2/3).
- Battery sensors all unavailable → status «Нет данных с HH:MM», fill 0, no shimmer (Task 2).
- `force` not configured → no button, bar takes the full width (Task 4).
- Timer `active` with `finishes_at` in the past (clock skew) → «ещё 0 мин», never negative (Task 2).
- Drag min past max → clamped to `max - step`; one service call per release, not per move (Task 3).

---

### Task 1: HA — force timers and automation

**Files (outside repo):** HA config via API; doc `~/Sync/Configs/Things/homeassistant/docs/pixel_watch_smart_charging.md`.

- [ ] Create `timer.pixel_watch_force_charge`, `timer.amazfit_force_charge` (`timer/create`, `duration: "00:30:00"`, `restore: true`), Russian names via entity registry.
- [ ] Automation `watch_charging_range`: each device row gets `force: timer.<…>`; triggers `timer` state change (`id: force`) for both timers; per device, before the existing choose: if `states(d.force) == 'active'` → if level ≥ 100 → `timer.cancel`, else turn port on if off; and skip the max cut-off. When a timer goes `idle` the normal rules re-evaluate (it is a trigger).
- [ ] Verify: `ha call timer.start` on the Amazfit timer at 99% → L1 on; `timer.cancel` → L1 off (99 ≥ 80). Traces without error.
- [ ] Update the doc's Logic section.

### Task 2: Pure logic — `cards/src/charge/charge.ts`

**Interfaces — Produces:**
- `pickLevel(hass, ids: string[]): { entityId?: string; level?: number }` — first entity whose state is numeric.
- `lastReport(hass, ids: string[]): Date | undefined` — newest `last_reported ?? last_changed`.
- `isFresh(hass, ids, staleAfter: number | undefined, now: Date): boolean`
- `minutesLeft(finishesAt: string | undefined, now: Date): number` — `Math.max(0, Math.ceil(ms / 60000))`.
- `chargeStatus(input: { forced: boolean; minutesLeft: number; fresh: boolean; on: boolean; min?: number; max?: number; since?: Date }): { key: string; params: Record<string, string|number> }` with keys `charge.forced` `{minutes}`, `charge.pulse`, `charge.noData` `{time}`, `charge.charging` `{max}`, `charge.waiting` `{min}`.
- `clampLimit(which: "min"|"max", value, other: number|undefined, step, lo, hi): number`.

- [ ] Tests `cards/test/charge.test.ts`: status order (forced beats everything; not fresh + on → pulse; not fresh + off → noData; on → charging; off → waiting); `isFresh` with `staleAfter` undefined true when numeric, false at 3601 s; `pickLevel` skips `unavailable` to the second id; `minutesLeft` past → 0, 22.1 min → 23; `clampLimit("min", 85, 80, 5, 10, 100)` → 75, `clampLimit("max", 40, 50, 5, 10, 100)` → 55, rounding to step.
- [ ] Run `npm test -- charge` → FAIL; implement; → PASS.
- [ ] Add i18n keys (ru/en): `charge.title` «Зарядка»/"Charging", `charge.forced` «Принудительно · ещё {minutes} мин»/"Forced · {minutes} min left", `charge.pulse` «Нет данных · импульс»/"No data · pulse", `charge.noData` «Нет данных с {time}»/"No data since {time}", `charge.charging` «Заряжается до {max}%»/"Charging to {max}%", `charge.waiting` «Включится ниже {min}%»/"Starts below {min}%", `charge.force` «30 мин»/"30 min", `charge.forceLeft` «{minutes} мин»/"{minutes} min", `charge.min` «Мин.»/"Min", `charge.max` «Макс.»/"Max".
- [ ] Commit.

### Task 3: Range bar — `cards/src/charge/range-bar.ts`

**Interfaces — Produces:** element `horos-charge-range` with properties `level?: number`, `min?: number`, `max?: number`, `step = 1`, `lo = 0`, `hi = 100`, `charging = false`, `disabledMin = false`, `disabledMax = false`; fires `limit-change` (`detail: { which: "min"|"max"; value: number }`, bubbles, composed) once on pointerup / per arrow key.

- [ ] Tests `cards/test/render/charge-range.test.ts` (happy-dom): fill `width` = `level%`; handles at `min%`/`max%` with `role="slider"`, `aria-valuenow`; ArrowRight on focused min handle → one event `{which:"min", value: min+step}`; ArrowRight on min at `max-step` → no event; disabled handle not rendered; `charging` sets class `charging` on fill.
- [ ] Implement: track = rounded rect `height: var(--feature-height, 42px)`, `border-radius: var(--ha-border-radius-lg, 12px)`, background `color-mix` of `--tile-color`; fill coloured by `levelColor(level)` from `core/labels`; shimmer keyframes copied from `levels.ts` (comment: keep in sync, shared look with ha-smart-charging) incl. `prefers-reduced-motion`; handles 6px-wide pills, values written next to them; pointer capture on handle, position → value via `clampLimit`, emit on pointerup.
- [ ] Tests PASS; commit.

### Task 4: Card + editor

**Files:** Create `cards/src/cards/charge-tile.ts`, `cards/src/editors/charge-tile-editor.ts`; modify `cards/src/main.ts` (import).

**Interfaces — Consumes:** Task 2 functions, Task 3 element.
**Config:** `ChargeTileConfig extends TileBaseConfig { type; battery: string | string[]; switch: string; min: string; max: string; force?: string; stale_after?: number }`.

- [ ] `setConfig` throws without `battery`, `switch`, `min`, `max`. `getGridOptions()` → `{ ...super, rows: 2, min_rows: 2 }`; `contentRows()`/`fixedRows()` → 1; `base` gets the config with `features`/`levels` removed.
- [ ] Render via `renderTile`: icon `mdi:watch`; color = switch on ? `tileColor(switch)` : `"var(--state-inactive-color)"`; primary `cardName` from first battery entity; secondary = `unavailableSegment(switch)` or the `chargeStatus` text; large value = picked battery level; `mainEntityId` = first battery id; `customFeatures` = `<horos-charge-range>` + force button (`ha-control-button`, icon `mdi:lightning-bolt`, label `charge.force` / `charge.forceLeft`, tap → `timer.start` or `timer.cancel`). `limit-change` → `<domain>.set_value` on `min`/`max`. Re-render every 60 s while forced (interval set in `connectedCallback`, cleared in `disconnectedCallback`).
- [ ] Editor `HorosChargeTileEditor extends BaseCardEditor`: entity selectors battery (sensor/battery, `multiple: true`), switch, min/max (`input_number`, `number`), force (`timer`), `stale_after` number; labels ru/en.
- [ ] Register `horos-charge-tile`, name `{ ru: "Зарядка", en: "Charge" }`, no `suggest`.
- [ ] `npm test` and `npm run build` green; `npm run dev`, cards-lab: card next to a stock tile, screenshot over CDP; check 120px slot filled, drag writes, button toggles timer. Commit.

### Task 5: Docs, release, dashboard

- [ ] README row + `docs/images/charge.png` from cards-lab (English). Bump version in `package.json`/`main.ts`. `npm run build`, commit `dist/`, `../script/publish.py`.
- [ ] Overview dashboard: replace the «Часы» section with a section holding two `horos-charge-tile` cards (Pixel: battery `sensor.google_pixel_watch_battery_level`, `stale_after: 3600`, L2, `watch_charge_*`, `timer.pixel_watch_force_charge`; Amazfit: both LNXlink sensors, L1, `amazfit_charge_*`, `timer.amazfit_force_charge`). Merge into config; screenshot.
- [ ] Update the HA doc's Dashboard section.
