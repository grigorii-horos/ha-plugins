# Charge tile (`horos-charge-tile`) — design

Date: 2026-11-05. Status: approved in conversation; builder check done, answers folded in.

## Intent

Two watches charge from a three-port Zigbee USB hub in the living room: a Pixel Watch on
port L2, an Amazfit Bip U Pro on port L1. One Home Assistant automation keeps each of
them between a lower and an upper battery limit by switching its port (spec of the
automation: `~/Sync/Configs/Things/homeassistant/docs/pixel_watch_smart_charging.md`).

Today the dashboard shows this as eight stock tiles in a "Часы" section. The owner wants
**one card per watch** that shows the charge, the min/max limits and a forced charge at
a glance, and lets him change the limits and start the forced charge from the card.

## Goals

- One card per device, exactly **2 standard section rows** high (`rows: 2`,
  `min_rows: 2`), obeying the grid arithmetic in `CLAUDE.md`
  (`R * (56 + 8) - 8` px, card fills it).
- Row 1 — the stock tile line (`renderTile`): icon, name, status as the secondary line,
  the battery level as the large value on the right.
- Row 2 — one control line in the `customFeatures` slot:
  - a **range bar** `--feature-height` tall: its fill is the current battery level, two
    handles are the min and max limits; dragging a handle writes the `input_number`;
  - a **force button** on the right: «⚡ 30 мин» when idle; while forced it shows the
    time left (e.g. «23 мин») and a tap cancels it.
- While the port is on, the fill carries the same charging shimmer as `levels.ts`
  (shared look with ha-smart-charging; reuse the keyframes, do not invent a new one).
- The icon is coloured while the port is on, with the switch's stock state colour
  (`tileColor(switch)`, as `plug-tile` does); `color:` from the config overrides it as
  on every card *(builder's call)*. Off → neutral.
- Tapping the tile line opens more-info of the battery entity (stock tile behaviour
  through the shared actions).

## Status line (secondary)

Computed by the card, first match wins:

1. force timer `active` → «Принудительно · ещё N мин» / "Forced · N min left"
2. data not fresh, port on → «Нет данных · импульс» / "No data · pulse"
3. data not fresh, port off → «Нет данных с HH:MM» / "No data since HH:MM"
4. port on → «Заряжается до {max}%» / "Charging to {max}%"
5. port off → «Включится ниже {min}%» / "Starts below {min}%"

"Fresh" mirrors the automation exactly *(builder's call — otherwise the card would say
"Charging to 80%" during a blind pulse)*: a numeric level among `battery`, and, when
`stale_after` (seconds) is set, the newest `last_reported` of `battery` entities is
younger than that. The browser's state stream carries no `last_reported`, so the card
subscribes to a `render_template` on HA for it (re-rendered every minute through
`now()`). HH:MM = that newest `last_reported` (or `last_changed` if the entity
is unavailable).

Unavailable port → the shared `unavailableSegment` wins over all of these.

## Config (roles, set by a human — no guessing by name)

```yaml
type: custom:horos-charge-tile
battery: sensor.google_pixel_watch_battery_level      # required; a string or a list
stale_after: 3600                                     # optional, seconds (see status)
switch: switch.device_usb_plug_3_ports_livingroom_l2  # required
min: input_number.watch_charge_min                    # required
max: input_number.watch_charge_max                    # required
force: timer.pixel_watch_force_charge                 # optional; no button without it
name: Pixel Watch                                     # TileBaseConfig fields as usual
icon: mdi:watch
```

`battery` takes one entity or a list; the first numeric one is the level, exactly like
`levels` in the automation *(builder's call: the Amazfit has two LNXlink sensors)*. The
first entity of the list is what more-info opens.

`min`/`max` accept `input_number` and `number` entities (both are set with
`<domain>.set_value`). Step, min and max of the handles come from the entity
attributes. The handles cannot cross: min ≤ max − step.

The force button calls `timer.start` on `force` (the timer's own duration, 30 min, is
configured in HA, the card does not pass one) and `timer.cancel` when active. Time
left: from the timer's `finishes_at` attribute, re-rendered once a minute.

## Pulse period (added 2026-11-05, owner's request)

Optional `pulse_every`: an `input_number` of hours (Pixel Watch 3, Amazfit 18). A button
between the bar and the force button shows «⏱ N ч»; a tap adds one step and goes round
to the minimum past the maximum; a 500 ms hold opens the helper's more-info. The
automation pulses a device without data once the port has been off for its period minus
the 10 minutes of the pulse (checked every 10 minutes); any charge resets the count.

## Optional roles (added 2026-11-05, owner's request)

Only `battery` is required; the card works with or without an automation. No `switch`:
status speaks of data only (nothing when fresh), the icon takes the battery colour and
opens more-info. A `switch`: «Заряжается» / «Не заряжается» when there are no limits,
and the icon toggles the port (`{action: toggle, entity: switch}` — the main entity is
the battery). No `min`/`max`: the bar is a plain level fill. «Нет данных · импульс» only
with `pulse_every`; otherwise a port on without data reads «Нет данных с HH:MM».

## Editor

`FormCardEditor` with `ha-form` entity selectors: battery (sensor, device_class battery),
switch (switch), min and max (input_number, number), force (timer), plus the shared
name/icon fields. No Features panel content of our own (the control line is
`customFeatures`, not a stock feature — HA has no dual-handle range feature).

## Home Assistant side (the owner's config, not this repo)

In scope of this plan, approved by the owner; done outside this repository, **in this
order**: timers and automation first (and tested by starting a timer by hand), then the
card, then the dashboard swap last — so the button never exists without the logic
behind it:

- two `timer` helpers, 30 min: `timer.pixel_watch_force_charge`,
  `timer.amazfit_force_charge`;
- the automation `watch_charging_range` gets a `force` key per device: while the
  timer is `active` the port is turned on and the max cut-off is skipped; the timer
  starting/finishing triggers a re-evaluation; reaching 100% while forced cancels the
  timer (builder's call, agreed as a guess);
- the "Часы" section on the Overview dashboard is replaced by two `horos-charge-tile`
  cards (merge into the dashboard config, never overwrite).

## Layout rules specific to this card *(builder's call)*

- `getGridOptions()` returns `rows: 2`, `min_rows: 2`, not `"auto"`.
- The card has no stock features: a user `features` list and `levels: false` are
  ignored (the editor does not offer them). The control line is always there.

## Code placement *(builder's call)*

- The range bar is private to this card: `cards/src/charge/range-bar.ts`, not
  `core/`, so nothing has to be mirrored into ha-smart-charging. If it is ever wanted
  there, it moves to `core/` then.
- The charging shimmer keyframes are duplicated into the range bar's styles with a
  comment pointing at `levels.ts` (identical values), instead of extracting them —
  `levels.ts` stays untouched.

## Non-goals

- No multi-device card (the owner explicitly wants one card per watch).
- No charging logic in the card: it only shows state and writes limits / starts the
  timer. The automation decides.
- No `levels.ts` changes and no copying the cutoffs back from ha-smart-charging
  (see `CLAUDE.md`). The range bar is a new module of its own.
- No `suggest` rule: a watch battery + a port + two helpers cannot be recognised
  objectively as one device (they belong to different devices).

## Anti-goals

- Taller than 2 rows, or a card that leaves a hole inside its slot.
- A handle that writes on every pixel of a drag (write once on release).
- Pixel numbers of our own instead of HA tokens.

## Repository obligations (from `CLAUDE.md`)

Card + editor + README row + screenshot (`docs/images/charge.png`, shot from the
`cards-lab` dashboard in English, with a stock tile next to it for comparison);
en/ru strings through `t()`; logic (status selection, handle clamping, minutes left)
covered in vitest; `npm run build` with `NODE_ENV=production`; `dist/` rebuilt and
committed; `script/publish.py` to deploy.

## Left to the builder

- Exact markup of the range bar (pointer events, keyboard: arrows move the focused
  handle by one step), as long as it uses HA tokens and `--feature-height`.
- Width of the force button (it must fit «⚡ 30 мин» and «23 мин»).
- Behaviour on narrow cards (`min_columns` 6 as the other cards).
