# Custom tile cards for Home Assistant

Date: 2026-09-04
Status: implemented and verified against a live HA 2026.9.0

## The problem

In Home Assistant one physical thing turns into a dozen tiles. A Zigbee plug gives 13
entities, three of which are interesting. A thermostatic valve gives 30. The dashboard
has to be assembled by hand and is noisy anyway.

What is needed is a set of cards where several entities are packed into one tile by
meaning.

## The main decision

**The cards don't reimplement the stock tile's markup — they are assembled from its
components.**

`ha-tile-container` gives the body, ripple, gesture recognition, the hold indicator and
the focus ring. `ha-tile-icon` and `ha-tile-info` give the icon and the texts.
`hui-card-features` gives the features row. None of that is drawn by us.

Exactly two things of our own are left, neither of which the tile has:

1. the right-hand column of large values;
2. a separate tap target per value.

Everything else is the choice of entities and the order they are shown in. The value of
the plugin is in the content, not in a visual language of its own.

**A card is a ready-made layout for a specific meaning, not a builder.** The config only
answers the question "which entity in which role". No detection by device or area:
entities are listed explicitly.

### How we get hold of their components

Neither `ha-tile-container`, nor `ha-tile-icon`, nor `ha-tile-info`, nor
`hui-card-features` is exported. But they do get registered in the page's shared element
registry once HA loads the stock tile's bundle.

So on connect a card asks HA to create an ordinary `tile` through
`window.loadCardHelpers()` — purely for the side effect of the import — and waits for the
registration, five seconds at most. Until it is ready, a banner is drawn. If the wait
times out, the banner stays: we are not going to assemble a cut-down copy of the markup
for that case, that is exactly the private markup we are moving away from.

The features editor lives in a separate bundle, the tile editor's. It is pulled in the
same way, through the stock tile's `getConfigElement()`.

## Scope

Twenty-four cards. Twenty-three are tiles: one line, roles, a right-hand column of
values. Script buttons are a grid: a heading and a lattice of ready-made HA cards.

Seven of them came later, once the first sixteen had been living on a real dashboard:
lights, media, a climate unit, updates, to-do lists, alerts and a script-driven lamp.
Heating came last, when the rooms had been filled in and it turned out to be the only
system left with nothing to call its own.

A thermostatic valve card was considered and dropped — the air conditioner card covers
one valve; what was missing was the system above them.

HyperHDR backlight is postponed.

## The right-hand column

The one departure from the canon: the main values are moved to the right in a large font.
The stock tile hides the value in the secondary line; here the meaning of the card can be
read from a distance.

There can be one to three values, separated by slashes. Each next one drops the font a
step: `--ha-font-size-xl` (20px), `--ha-font-size-l` (16px), `--ha-font-size-m` (14px).
Four is a config error.

The price of each next value is the card name. A pair starts eating into it at around
240px of width; three only fit on a wide grid. So there is one value by default and the
rest are switched on deliberately through `big_values`.

A role that moved into the right-hand column is removed from the secondary line — a value
must not be shown twice.

**Every value has an icon.** On its own "63%" says nothing: it could be humidity,
battery, disk space or brush life. The unit does not save it — everything is in per cent.
An icon names the quantity without spending room on a word, and stays muted so the number
remains the star. The role-to-icon mapping is in `core/role-icons.ts`.

## The cards

### Room climate

```yaml
type: custom:horos-climate-tile
name: Bedroom
temperature: sensor.sensor_temperature_humidity_bedroom_temperature
humidity: sensor.sensor_temperature_humidity_bedroom_humidity
illuminance: sensor.sensor_illuminance_bedroom_illuminance
# pm25: sensor.device_air_filter_livingroom_pm25   — only exists in the living room
big_values: [temperature, humidity]   # optional, [temperature] by default
```

Temperature is the large value on the right. Humidity, illuminance and PM2.5 go into the
secondary line, always in that order. Roles that are not filled are skipped. Only
`temperature` is mandatory, and it is also the card's main entity.

### Plug with power metering

```yaml
type: custom:horos-plug-tile
name: Boiler
switch: switch.device_plug_boiler_kitchen
power: sensor.device_plug_boiler_kitchen_power
energy: sensor.device_plug_boiler_kitchen_energy
toggle_button: false   # true expands into features: [{type: toggle}]
big_values: [power, energy]   # optional, [power] by default
```

Power is the large value on the right. The secondary line holds the switch state and the
accumulated energy. Only `switch` is mandatory, and it is also the main entity.

### Plant

```yaml
type: custom:horos-plant-tile
name: Orange tree
moisture: sensor.soil_temperature_humidity_sensor_balcony_orange_soil_moisture
temperature: sensor.soil_temperature_humidity_sensor_balcony_orange_temperature
battery: sensor.soil_temperature_humidity_sensor_balcony_orange_battery
dry_below: 30
wet_above: 70
big_values: [moisture, temperature]   # optional, [moisture] by default
```

Soil moisture is the large value on the right, and the same moisture fills the bar below
the line.

The `dry_below` and `wet_above` thresholds set the colour only: below the lower one it is
dry and the colour is the warning one, between them it is normal and the colour is the
success one, above the upper one it is overwatered and the colour is the info one. The
colours come from theme tokens. The defaults are 30 and 70.

Only `moisture` is mandatory, and it is also the main entity.

## The grid card

Buttons are built differently from tiles: a heading and a grid. We draw neither — the
heading is the stock `heading` card, the cells are stock `button` cards. Our work here is
entirely in what goes into the grid and in sane defaults, so that a dozen blocks in the
config become one list.

### Script buttons

```yaml
type: custom:horos-buttons-tile
name: Lamp
icon: mdi:lamp
columns: 3
buttons:
  - entity: script.ir_1_inc
    name: Bright
    icon: mdi:brightness-7
  - script.ir_1_on_off        # short form: name and icon fill themselves in
```

Every cell is a stock `button` card. A button takes anything pressable: `script`, `scene`,
`button`, `input_button`, `switch`.

The default label comes from the part of the entity name after the colon: scripts carry
names like "IR — Bedroom: Night Mode", and the shared prefix is redundant on the button,
the heading already said it. The default icon is the entity's own, which for scripts is a
scroll — so a meaningful grid needs icons set. That is what the long form is for.

### Printer

```yaml
type: custom:horos-printer-tile
status: sensor.canon_g3030_series
cartridges:
  - sensor.canon_g3030_series_black_pgbk
  - sensor.canon_g3030_series_cyan
  - sensor.canon_g3030_series_magenta
  - sensor.canon_g3030_series_yellow
sensors:
  - sensor.canon_g3030_series_uptime
low_below: 15
```

An ordinary tile: a line with the name and state, ink levels below it.

**Every colour gets its own level row.** Under the tile line come bars: a label, a fill in
the colour of the ink itself, a per cent. The colour here _is_ the name — a cyan bar is
cyan ink, so the labels could go unread.

The large value on the right is the **consumable ink closest to running out**: the thing a
printer is looked at for at all, whether it is time to buy more. The state and the other
sensors go to the second line.

The only saturated spot is the ink itself.

**The thresholds come from the printer, they are not set by us.** IPP reports the meaning
of a level along with the level:

| marker | `marker_type` | high | low | what the level means |
|---|---|---|---|---|
| ink | `ink-cartridge` | 100 | 15 | how much is left, is consumed |
| waste ink absorber | `waste-ink` | 80 | 0 | how much has accumulated, fills up |

So their alarms are opposite: for ink when the level has **dropped** below
`marker_low_level`, for the absorber when it has **grown** up to `marker_high_level`.
Treating "low" the same way for both is wrong — for the absorber a low level is good news.
The bug was made in exactly that way, with a fixed 15% threshold, and was caught by the
owner asking "what is MC".

Fullness is counted against the marker's capacity, not against a hundred: the absorber's
capacity is 80, so a level of 10 is 12.5% of the bar.

`low_below` overrides the printer's threshold, but only for consumable ink.

Two colours are not taken from the palette:

- **black ink** is painted in the text colour rather than pure black — otherwise the bar
  merges with the background on a dark theme. It behaves like ink on paper;
- **MC** is the maintenance tank, not ink, and gets a shade of its own. In grey it was
  indistinguishable from black, which also comes out grey.

### Vacuum

```yaml
type: custom:horos-vacuum-tile
vacuum: vacuum.xiaomi_sg_1065555985_c102gl
battery: sensor.xiaomi_..._battery_level_p_3_1
sensors: [sensor.xiaomi_..._cleaning_mode_p_4_4]
consumables:
  - { entity: sensor.xiaomi_..._brush_life_level_p_9_2, name: Main brush }
  - { entity: sensor.xiaomi_..._filter_life_level_p_11_1, name: Filter }
low_below: 20
```

The device's 78 entities are reduced to one tile. On the line — what it is doing and how
much charge is left; below — the life of each consumable as its own bar.

The bars are painted **by level**, not in the tile colour: a docked vacuum's tile colour
is the inactive one, and every bar came out the same grey. A consumable asks the same
question a battery does, so the steps are the same — 70 and 30 per cent.

### Batteries

```yaml
type: custom:horos-batteries-tile
batteries: [sensor.…, …]   # all 43 if you like
low_below: 30
```

The card deliberately shows **not every battery but only the ones running down**,
emptiest first. Nobody reads a list of forty rows, and the card asks exactly one question:
what needs replacing. When nothing does, it says so — "all charged, 43 total".

### Safety

```yaml
type: custom:horos-safety-tile
sensors: [binary_sensor.sensor_water_bathroom_water_leak]
```

Normally it keeps quiet in a single line. An alarm is not only a sensor that fired: **an
unavailable sensor is an alarm too**, because it guards nothing. A broken sensor's silence
is indistinguishable from a healthy one's unless something says so. Such a sensor is shown
separately, in yellow, with its own glyph.

This is not a hypothetical case: the kitchen gas sensor was found `unavailable` while
going through the devices, and there was nowhere to notice it from.

### Home server

```yaml
type: custom:horos-server-tile
status: binary_sensor.pi_hole_status
disk: sensor.transmission_available_disk_space_home
download: sensor.transmission_download_speed_2
upload: sensor.transmission_upload_speed_2
services: [sensor.pi_hole_ads_percentage_blocked]
```

Three integrations in one tile. Download and upload are marked with arrows: they are often
both zero and blur together without a label.

### Computer

```yaml
type: custom:horos-computer-tile
name: minisforum
status: binary_sensor.lnxlink_desktop_minisforum_lwt
cpu: sensor.lnxlink_desktop_minisforum_cpu_usage
memory: sensor.lnxlink_desktop_minisforum_memory_usage
gpu: sensor.lnxlink_desktop_minisforum_gpu_amd_0
temperatures: [ … all 11 sensors … ]
disks: [ … all partitions … ]
sensors: [sensor.lnxlink_desktop_minisforum_current_users]
alerts:
  - binary_sensor.lnxlink_desktop_minisforum_required_restart
  - binary_sensor.lnxlink_desktop_minisforum_system_updates
big_values: [temperature, cpu]
```

The device's 100 entities are reduced to one tile. The value is not in showing eleven
temperature sensors and three disk partitions, but in **reducing them to one number
each**: how hot and how full.

`temperatures`, `disks` and `disks_free` are lists the extreme one is taken from. That
extreme sensor becomes an ordinary role, so a tap on the value opens exactly the one that
is hottest right now. On the very first check the card showed 92.5 °C and 99.3% load —
precisely what is impossible to notice in a list of eleven rows.

`alerts` are binary sensors mentioned **only once they have fired**: a restart is
required, updates are available. Normally they are invisible.

**Used and free space are different roles, not one.** `disks` is the per cent used,
`disks_free` the per cent free, as the HA companion app for macOS reports it. Everything
about them is opposite: the extreme is the fullest against the emptiest, and they are
coloured differently — used like load (a lot is bad), free like a battery (little is bad).
Feeding one into the other's role means silently showing 32% where it is really 68%. That
is the same class of bug as the ink absorber, so a separate role was made.

Thanks to that the card also covered the Mac mini, which has neither CPU nor temperatures
— only disk, the foreground application and the connection type.

Load bars are painted with the inverted colour: on a battery a lot is good, on a processor
and a disk it is the other way round. The steps are 80 and 90 per cent.

### Air

```yaml
type: custom:horos-air-tile
name: Air purifier
appliance: fan.device_air_filter_livingroom
pm25: sensor.device_air_filter_livingroom_pm25
sensors: [sensor.device_air_filter_livingroom_fan_speed]
alerts: [binary_sensor.device_air_filter_livingroom_replace_filter]
big_values: [pm25]
```

Purifier, recuperator, humidifier, dehumidifier. Different domains, one question: is it
running and what is happening to the air. So the appliance is one `appliance` role of any
domain — `fan`, `humidifier`, or the plug the appliance is connected to.

**A negative PM2.5 counts as no data, not as zero.** A switched-off IKEA purifier reports
−1: a concentration is never negative, and a figure like that must not be put in the
card's headline. Caught on a live card — it honestly showed "−1 µg/m³".

### Covers

```yaml
type: custom:horos-cover-tile
cover: cover.device_curtain_robot_balcony
illuminance: sensor.device_curtain_robot_balcony_illuminance
battery: sensor.device_curtain_robot_balcony_battery
big_values: [illuminance, battery]
```

Open, close and set a position straight from the card. The controls are stock HA features
(`cover-position`, `cover-open-close`); we draw no buttons of our own, and the card only
supplies them as the default features list — the editor's Features panel is where they are
removed.

**The set of controls is picked from the cover's own `supported_features`:** the position
slider is only offered to a cover that can set one. The balcony one has
`supported_features: 15` — open, close, stop and set position — so it gets both the slider
and the three buttons.

The `position` role is left for covers that report a position but cannot set one: they get
a bar of their own. Where there is a slider, no bar is drawn — it would show the same
thing twice.

### Energy

```yaml
type: custom:horos-energy-tile
total: sensor.all_standby_power
consumers:
  - { entity: sensor.device_plug_boiler_kitchen_power, name: Boiler }
  - { entity: sensor.device_plug_recuperator_bedroom_power, name: Recuperator }
limit: 6
```

Who in the house is eating electricity, hungriest first.

**The level here means not "how much is left" but a share of the hungriest one.** The
scale is shared and relative: the bar length answers "who draws more", not "what per
cent". This is the only card with those bar semantics, which is why it is spelled out.

Consumers drawing nothing are not shown: a row with an empty bar says nothing and takes
room. The ones that lost connection are **counted out loud** instead — a silent power
meter is easy to mistake for a switched-off appliance. On the live house that showed up
immediately: "2 drawing power · 4 offline".

The card does not sum the listed consumers. That sum would be smaller than the house's
real draw — only the listed plugs are metered — and would pass an incomplete figure off as
the total.

### Presence

```yaml
type: custom:horos-presence-tile
areas:
  - { entity: binary_sensor.magic_areas_..._livingroom_area_state, name: Living room }
  - { entity: binary_sensor.magic_areas_..._bedroom_area_state, name: Bedroom }
```

It names only the occupied areas — usually one or two — instead of listing all eight. The
large value is how many there are right now.

Areas that lost connection are counted separately: an area with nothing to say and an
empty area are different things.

### Not responding

```yaml
type: custom:horos-offline-tile
limit: 4
ignore: [sensor.the_one_that_is_silent_legitimately]
```

**The one card that walks the states itself** instead of taking entities from the config.
Listing nine hundred entities by hand is not possible, and the selection rule here is
objective — state `unavailable` — so there is nothing to guess. It is a deliberate
exception to the "no auto-detection" rule.

**It counts things, not entities.** A dead plug has six silent entities, Syncthing
seventeen: a list of ninety-two rows says less than a list of forty-four things. Entities
without a device each count for themselves — templates, helpers and IR lamps are separate
things, not parts of something bigger.

Service domains (`update`, `select`, `text`, `button`, `number`, `event`, `notify`) and
hidden entities are not counted: their unavailability means nothing to whoever lives here.
The order is by the number of silent entities, ties broken alphabetically, so the list
does not jump around between updates.

The card was written last and was needed first: the gas sensor had been silent for who
knows how long, four power meters turned up by accident while going through energy, lamps
and air conditioners while going through the devices. On the live house it immediately
showed forty-four silent things.

### Person

```yaml
type: custom:horos-person-tile
person: person.alice
battery: sensor.phone_alice_battery_level
location: sensor.phone_alice_geocoded_location
devices:
  - { entity: sensor.google_pixel_watch_battery_level, name: Watch }
```

Whether they are home, where exactly, how much charge. The person's portrait is shown by
default — it says more than a faceless icon. The other devices' batteries use the same
level rows.

## Suggestions in the add-card dialog

HA's "Add to dashboard → By entity" dialog asks every entry in `window.customCards` for
a `getEntitySuggestion(hass, entityId)` and renders what comes back under "Community",
as a live preview next to the core suggestions. `registerCard` takes a `suggest`
function per card and passes it through; the rules live next to each card, the helpers
in `core/suggest.ts`.

This is the one bounded exception to "no auto-detection". It holds because a suggestion
is not a card: it is a draft the user sees rendered and edits before adding. The rules
still use nothing but objective facts:

| what is picked | what is suggested | how it is found |
|---|---|---|
| a room sensor | room climate | `device_class` of the temperature, humidity, illuminance and PM2.5 entities of the same device |
| a plug or its meter | plug | the `switch` of that device plus its power and energy |
| soil moisture | plant | `device_class: moisture` on a sensor, plus soil temperature and battery |
| a cover or its battery | cover | the `cover` of that device plus illuminance and battery |
| a purifier or its sensor | air | a `fan`/`humidifier` plus what that device measures |
| anything on a printer | printer | siblings carrying a `marker_type` attribute |
| a vacuum | vacuum | the `vacuum` plus the battery of that device |
| a person | person | the person's `device_trackers`, then the battery on the tracker's device |
| a battery | batteries | every `device_class: battery` sensor in the house |
| a leak/smoke/gas sensor | safety | every alarm binary sensor in the house |
| an occupancy sensor | presence | every occupancy/presence/motion binary sensor |
| a power sensor | energy | every `device_class: power` sensor |

Two rules shape the answers. A card **stays quiet when it would say no more than the
stock tile**: a lone temperature sensor whose device carries nothing else suggests
nothing, and so does a plug with no meter. And the list cards arrive **filled with the
whole set** rather than with the single entity that was clicked — a batteries card
holding one battery is worth less than a tile, while one holding all forty-three is the
card itself.

The computer, server, buttons and offline cards suggest nothing: there is no objective
signal to start them from, only names.

Verified in the live dialog: picking the bedroom temperature sensor shows "Room climate"
under Community, previewing 28.1 °C with the humidity of the same device already in the
secondary line.

### Lights

```yaml
type: custom:horos-light-tile
group: light.kitchen
lights: [light.kitchen_strip, light.kitchen_lamp, light.kitchen_spots]
```

A single light is what the stock tile is for. What it cannot answer is the room: which
of the five are on and how bright. So every light is a level row and the bar is its
brightness, in the light's own colour.

**A light that is off keeps its row.** Dropping it would leave the card answering "what
is on" with a list that has no "off" in it, and the reader has no way to tell an empty
row from a light nobody listed.

The brightness slider is offered only when a `group` is set: one slider cannot mean five
different lights.

### Media

```yaml
type: custom:horos-media-tile
players: [media_player.tv, media_player.kitchen_speaker, media_player.kodi]
```

The stock media-control card is one player and half a screen. The question here is
smaller: is anything playing in the house, what, and how loud. Whoever is playing owns
the line and the playback buttons — that is the player one reaches for.

Volume fills the bars, and the row ends with the player's state. The first version put
the track title there, and a title is a sentence: it pushed the volume bar off the card.
The title is named once, in the line above.

### Air conditioner

```yaml
type: custom:horos-ac-tile
climate: climate.living_room_ac
temperature: sensor.living_room_temperature
humidity: sensor.living_room_humidity
power: sensor.ac_plug_power
```

**The unit and the room are different things.** A climate entity reports the air at its
own intake, which is warmer or colder than where anyone sits, so the room's temperature
and humidity are roles of their own, filled from the room's sensors. The unit's target
stays where the stock `target-temperature` feature draws it.

Power is here for the same reason the plug card has it: the honest answer to "should I
leave it running" is a number in watts.

### Updates

```yaml
type: custom:horos-updates-tile
limit: 4
```

The second card that walks the states itself, on the same grounds as the offline one:
the rule is objective — an `update` entity that is `on` — and Home Assistant scatters
those across every integration and add-on it has.

**A skipped version is not news.** HA keeps such an entity `on` for ever, and a card that
keeps shouting about an update its owner has already waved away is a card one learns to
ignore. Skipped ones are counted apart and stay out unless `include_skipped` asks.

### Tasks

```yaml
type: custom:horos-tasks-tile
calendar: calendar.family
lists: [todo.shopping_list, todo.chores]
```

A `todo` entity's state is how much is left on it, which is the one number a dashboard
can use; the items themselves are for the to-do card. The bars are shares of the longest
list — the same relative scale the energy card uses, and for the same reason: the
question is which list is the heavy one.

The calendar fills the line with what is coming up next.

### Alerts

```yaml
type: custom:horos-alerts-tile
alerts:
  - binary_sensor.purifier_replace_filter
  - entity: sensor.printer_status
    alert_when: [jam, error]
```

Several cards already carry an `alerts` role, because a filter that wants changing
belongs next to the purifier it is in. What was missing was the tile for the ones that
belong to nothing in particular, and for the case where there are five of them.

**The card is quiet by design.** While nothing has fired it is one line saying how many
things it watches; a card that always shows something is read as decoration. The same
reasoning as the safety card, and the same rule about silence: an alert that is
`unavailable` cannot fire, so it is reported rather than counted as good news.

A binary sensor needs no configuration — `on` is what firing looks like. Anything else
says so itself through `alert_when`, and `unavailable`/`unknown` never count as fired
even when listed: an entity with no data has told us nothing.

### Script lamp

```yaml
type: custom:horos-lamp-tile
state: input_boolean.bedroom_lamp
power: script.lamp_on_off
bright: script.lamp_brighter
dim: script.lamp_dimmer
presets: [script.lamp_full, script.lamp_night]
```

An infrared lamp has nothing to switch: it is a remote control, and HA reaches it
through one script per press. Laid out as the buttons card it is a grid of eight squares
for one lamp, and it reads as a keypad.

**The scripts go in as roles, not as a list.** `bright` and `dim` are the two halves of
one control, `warm` and `cold` of another, presets are the looks the lamp can take. That
is what lets the card draw them the way Home Assistant draws a light: the button group
its cover feature uses, the segmented selector its climate modes use.

Those controls — `ha-control-button`, `ha-control-button-group`, `ha-control-select` —
arrive with the feature bundles rather than with the tile, and features load on demand:
a dashboard whose cards have no features has none of them. `ensureControls` in
`core/ha-internals.ts` pulls them in the same way the tile itself is pulled in, by
rendering a tile that asks for a couple of features out of sight. Rendering is the
operative word: Lit imports them while rendering, not while being constructed, so the
probe has to be attached to the document.

**The state stays optional and separate.** With an infrared lamp nobody knows whether it
is on. Point the card at an `input_boolean` somebody flips alongside the script and the
line, the colour and the icon start telling the truth; leave it out and the card says
nothing about the state rather than guessing.

### Heating

```yaml
type: custom:horos-heating-tile
mode: sensor.boiler_mode
burner: binary_sensor.boiler_burner_active
pump: binary_sensor.boiler_pump_active
switch: switch.boiler_plug
power: sensor.boiler_plug_power
energy: sensor.boiler_plug_energy
zones:
  - entity: climate.radiator_bedroom
    name: Bedroom
  - entity: climate.radiator_living_room
    name: Living room
```

**Heating is the one system with no entity of its own.** The boiler is in the kitchen,
the demand is in the bedroom, the bill is on a socket — three places on a dashboard, and
nowhere to ask "why is it burning right now". Here the boiler is the line and the rooms
are the rows, which makes the answer one glance: the burner is on because these two rooms
are cold.

**Demand comes from `hvac_action` and nowhere else.** It is tempting to derive it —
current below target, so the room must be calling — and it would be wrong: a valve can be
shut by a schedule, by an open window, by a boiler that is off. A thermostat that does not
report `hvac_action` is therefore left out of the count entirely rather than counted as
quiet, which is why `countDemand` has a denominator of its own instead of using the number
of rooms.

**The bar is the demand, not the temperature.** A room either has the boiler working for
it or it does not; there is no honest 0..100 scale between "at 20°" and "asked for 21°".
The row's text carries the two numbers instead, the current one stripped of its unit so
that the pair does not crowd the bar out of the row.

**No suggestion rule.** Which of two `heat` binary sensors is the burner and which is the
pump cannot be told from the registry, and a card must not guess a role from a name. This
one is assembled by hand.

## Height

A card is one layout row for the line and everything else underneath.

`ha-tile-container` does not agree: its top row is `flex: 1`, so a tile of a fixed height
puts every spare pixel into the icon-and-text row — the stock tile at four rows is 248px
of a single line, with the features still pinned at the bottom. That row is the card's
identity and belongs at exactly one row; the room under it is what the content is for.
The row lives in HA's shadow and cannot be restyled from outside, so it is outvoted
instead: our half of the card asks for the free space with a growth factor two orders of
magnitude larger, and the row keeps its 56px minimum plus a rounding error.

**A card takes the height it is given only when it has something to fill it with.** A
block host with an automatic height ignores that height outright — a card told to be four
rows tall drew 130px inside a 248px slot and left the rest as a hole, which is what
started all this. Inheriting the height fixes that, but a card that is one line and
nothing else does not inherit it: an empty card body reads as a bug, while a gap under a
short card is what the stock tile leaves there too. Hence the `filled` attribute on the
host.

**What fills the space depends on what is in it.** A list of level rows spreads evenly,
the way `hui-card-features` spreads features with `align-content: space-evenly`. Buttons,
sliders and selectors do not stretch: they are 42px on every card, because they take that
number from `--feature-height`, the same variable the stock features use — a row of lamp
buttons must not be a different height from a row of climate buttons on the card next to
it. They spread apart instead.

**Two row counts, not one.** `getCardSize` answers "how tall is this card" and counts
everything below the line: two level rows to a layout row, one row per feature or control.
`min_rows` answers "how small may it be made" and counts only what cannot be squeezed —
the controls. A list of rows lives with whatever it is given; a row of buttons does not,
so a card with buttons cannot be dragged shorter than they are.

**The card's own line can be switched off.** `levels: false` — the shared field, so it
works on every card that has one — leaves the top line alone.

**Controls are features, and only features.** Everything under the line that HA already
draws — cover buttons and slider, climate modes and target, playback, the brightness
slider, the plant gauge — is a stock feature; the card only decides what the default list
is, from the entity's own `supported_features` where that is the question. The editor
shows that default list as the current one, so a control is removed exactly where a stock
feature is removed, and there is no second switch for it in the card's own fields. An
empty `features: []` therefore has to mean "none", not "back to the defaults" — that is
what the editor writes when the last one is deleted.

The card fields this replaced — `controls`, `brightness`, `toggle_button` — are still read
so that an existing config keeps working, and are gone from the editors. A card built from
a list of equal entities has no main entity to address features to; the media card names
its first player for that, and the ones with nothing of their own simply have no panel.

## Level rows

The device invented for ink turned out to be a general one: several homogeneous levels
that have to be seen together to tell what is about to run out. It lives in
`core/levels.ts` and is used by four cards — printer, vacuum, person, computer.

Every row is a label on the left, a bar in the middle, a value on the right. The bar is
built like the stock `hui-bar-gauge-card-feature`: a solid fill in the colour of the
contents and the same colour at 20% in the remainder, only thinner, so several rows fit.

**The first version drew vertical flasks in a row** — closer to a real tank printer with
its transparent windows on the front. But at the height of a stock features line five
flasks turned into slivers with nothing to make out, and that same height shrank the
vacuum and the computer. A horizontal row gives the same thing — a fill up to the level in
the colour of the contents — plus a label and a number.

The label width is a fraction rather than automatic: otherwise names of different lengths
drag the bars around and the row stops reading as one scale.

A row is clickable: a tap opens more-info for its entity. On alarm a glyph appears next to
the label and the value goes to the error colour. The glyph differs per case: ink running
out, an overflowing absorber, an overloaded processor.

A role shown as a row does not also go into the card's secondary line — there it would be
a nameless per cent.

## Features

The tile cards accept `features` and `features_position` (`bottom` or `inline`) and hand
them to the stock `hui-card-features`. Every HA feature works inside our cards — toggles,
brightness sliders, climate modes, cover controls.

The cards' own elements are expressed through the same mechanism; there is no markup of
our own for them:

- the plant gauge is `{type: "bar-gauge", min: 0, max: 100}`, taking its colour from
  `--tile-color`, that is, from our dryness thresholds;
- `toggle_button: true` on a plug is `{type: "toggle"}`.

If the user sets `features` themselves, their list replaces ours entirely.

## Appearance

The shared fields, with the stock tile's names: `icon`, `color` (an HA palette name,
`primary`, `state` or a ready CSS colour), `vertical`, `hide_state`,
`show_entity_picture`.

The entity picture URL is taken the same way as in the tile's `_getImageUrl`:
`entity_picture_local`, otherwise `entity_picture`, through `hass.hassUrl`. Cameras, with
their separate size-aware URL, are not supported.

## Interactions

The stock tile's full set, with the same field names: `tap_action`, `hold_action`,
`double_tap_action` and their three icon variants.

Supported are `more-info`, `toggle`, `navigate`, `url`, `perform-action` (and the old name
`call-service`), `none`, `fire-dom-event`, plus `confirmation` on any of them. The
semantics mirror `handle-action.ts`, including the per-domain toggle services: covers get
`open_cover`/`close_cover`, a lock `unlock`/`lock`, a button `press`.

Gesture recognition, the hold and all press feedback come from `ha-tile-container`. We
only tell it whether the gestures are armed (`hasHold`, `hasDoubleClick`) and listen for
the `action` event.

The default icon action is a copy of `getEntityDefaultTileIconAction`: toggleable domains
plus `button`, `input_button`, `scene` get `toggle`, everything else `none`. So a plug's
icon toggles and has a coloured backdrop, while a climate or plant icon is not interactive
and has no backdrop — exactly like the stock tile for a sensor. A tap on such an icon
falls through to the card body and opens more-info.

### Per-value popups

A departure from the canon: a tap on a specific value opens more-info for **its** entity
rather than for the main one. A tap on the temperature opens the temperature popup, on the
humidity the humidity popup, on a piece of the secondary line whatever is in that piece.
The rest of the card's area leads to the main entity.

Tile content does not take events, so the tap targets switch them back on with
`pointer-events: auto` and stop the bubbling.

## Editors

Every card has its own GUI editor built on `ha-form`. Roles are separate
`ha-entity-picker`s filtered by meaning: humidity only offers `device_class: humidity`,
power only `power`, a switch only the `switch` domain.

Plus two expandable sections following the stock tile editor's scheme:

- **"Appearance"** — icon and colour side by side in a grid, the entity-picture and
  hide-state toggles, then the layout with the same pictures HA uses. The icon is given
  `context.icon_entity`. Colour needs `include_state: true`, otherwise the value `state`
  counts as invalid and the field is highlighted as an error.
- **"Interactions"** — six actions through the stock `ui_action` selector, with a divider
  and an `optional_actions` group.

Every action is given `context: { entity_id, area_id }`. Without it the action editor does
not know what the action applies to and does not fill the entity into `more-info`,
`toggle` and the service target. On the stock tile that is always the `entity` field; here
it is a role: `switch`, `temperature`, `moisture`.

The name uses the stock `entity_name` selector, so it has the same "Composed / Custom"
switch. The `features` list is the stock `hui-card-features-editor`.

The config holds a boolean `vertical` while the form shows `content_layout` as pictures —
the editor converts one into the other, exactly as the stock one does.

## Technical part

**Location.** The `cards/` folder at the repository root. The `frontend/` folder is a
clone of the home-assistant/frontend sources; it stays untouched and serves as a
reference.

**Stack.** TypeScript, Lit 3, a Vite build in library mode. Lit is bundled in. One
`ha-plugins-cards.js` file for every card — one dashboard resource, one HACS entry. The
cards register themselves in `window.customCards`, so they show up in the card picker.

The build must run with `NODE_ENV=production`, which the npm script sets: the developer's
shell exports `development`, and Lit then resolves to its dev build with warnings — the
bundle silently grows by a third (173 KB against 136 KB).

**Target HA version** — 2026.9 and newer. Compatibility with older ones is not supported.

**Tests.** Vitest over the pure logic: assembling the secondary line, resolving roles,
moisture thresholds, state colours, picking and splitting the large values, arming
gestures, toggle services, the default icon action, cartridge labels and colours, button
labels, keeping manual settings when a list is edited in the GUI. Appearance is checked in
a real HA; markup is not covered by unit tests beyond our own templates.

The pure-logic modules deliberately do not import the DOM: files with `@customElement`
register elements on load and crash in node.

## How it is verified

**Development is Vite straight off the working machine, with no file copying.** `npm run
dev` brings up a server on `0.0.0.0:5188`, and the dashboard has a module resource
`http://192.168.100.201:5188/src/main.ts` added to it. Edit a file, F5 in the browser, new
version.

The port is deliberately not 5173: that one was already taken by another project of the
developer's, and the dashboard silently loaded from someone else's server. The cards are
attached by absolute URL, so a substitution like that shows no sign of itself — a plugin
is worth keeping on a port of its own.

Two conditions. The dashboard is opened over **http**, not https — otherwise the browser
blocks the http module as mixed content. And reloading is F5 only: a custom element that
is already registered cannot be redefined in a live page, which is why HMR is off.

**Production is the built bundle in `/config/www/`**, with the resource
`/local/ha-plugins-cards.js?v=<hash>`. The version in the URL is mandatory, otherwise HA
serves the cached file.

The HA config of this installation is not where it is expected: Home Assistant runs under
rootless podman as a user, and the container's `/config` is
`~/.local/state/podman/homeassistant/config` on the host. Neither `docker ps` as root nor
a filesystem search finds it; the path comes from `podman inspect` run as the user who
owns the container.

Deployment is done by `script/publish.py`: build, copy over SSH, update the resource with
a new hash in the URL.

Verified by shutting the dev server down: the dashboard keeps working and all sixteen card
types are in place.

**Release is a HACS custom repository.** The built `dist/ha-plugins-cards.js` is committed
and versioned, `hacs.json` is in place: HACS installs the plugin straight from the
repository.

That is the only installation path available without the machine owner's involvement. SSH
to the HA host was closed at first (`Permission denied (publickey,password)` — the key is
bound to the host alias, not the IP), and HA has no file-writing services, only
`file.read_file`. So the bundle cannot be put into `/config/www/` from outside, while HACS
can.

The bundle was verified separately from the dev version: loaded in a clean page, it
registers every card and fills `window.customCards`, with no console errors.

**A separate dashboard.** `/cards-lab/cards` ("Cards Lab" in the sidebar); the working
`/lovelace/home` is left alone. Sections: climate for six rooms, four plugs, two plants, a
card with a wrong `entity_id` to check the banner, "Two large values" and "Interactions
and features".

The deployment script is idempotent over the resource and the dashboard, and it **merges**
into the dashboard config rather than overwriting it. It used to overwrite: edits made in
the GUI would be silently reverted to the version in code. That nearly happened once — the
person card had been configured through the editor, with the phone battery moved into the
device list, and running the script blind would have taken it back.

## What was verified against a live HA

Not by tests, but by measurements and clicks in the browser:

- the cards are registered in `window.customCards` and appear in the picker;
- a tap on the temperature opens the temperature popup, on the humidity the humidity one,
  on a piece of the secondary line its entity; empty area leads to the main entity;
- a 500ms hold performs `hold_action` (taking you to history), a short tap does not;
- pressing fills the card with the state colour — captured close up with real mouse input:
  the pressed card is amber, the neighbouring one white;
- the sensor icon and the plug icon match the stock tile in classes and backdrop: the
  sensor has `container` with no tone, the plug `container background`, amber at 0.2;
- the editor was captured next to the stock one and compared field by field;
- an unavailable main entity does not break the line: no number, a status in the secondary
  line;
- the printer card and both button cards were compared against the owner's reference
  screenshots: contents, icons, labels and layout match.

## The defects found during the review

Checking the cards in code and in the browser produced ten defects. All are closed.

**Loading the bundle twice broke registration.** `customElements.define` on a name already
taken throws, and the whole module dies with it. It would have happened routinely: the dev
resource stays in the dashboard and one installed through HACS shows up next to it.
Whichever loaded first would win — so you could end up looking at old code thinking it
updated. Now the second copy quietly yields and says so in the console.

**The cards did not tell HA their size.** `getGridOptions` was not implemented and
`getCardSize` returned one for all of them: a printer with five ink rows claimed the
height of a single row. Now it is `rows: "auto"` — the way the stock cards with a floating
height describe themselves — and `getCardSize` counts the content.

**The large values could not be pressed from the keyboard.** We deliberately made every
value a separate target — but it was a `span` with a click handler. Now it is a button
reachable by tab, with the entity name in `title` and `aria-label`: "63%" on its own says
nothing about whose it is, neither on hover nor to a screen reader.

**The language was mixed.** HA translates states itself, while our labels were hard-coded
Russian — a Russian "all clear, 1 sensor" next to "Docked · Standard · Charging". Now the
strings go through a dictionary and are picked by HA's language, with plural forms for
both languages — a form that does not match the count grates in either. The names in the
card picker stay English: that list is filled while the bundle loads, before the language
is known.

**One missing entity blacked out the whole card.** Batteries have 43 of them: rename one
and instead of a card you get a banner, with the other 42 invisible. Now a row that
disappeared is dropped and its count is named at the end of the secondary line. A card
only goes dark when the main entity is missing — that is a config error, not life.

**The deployment script overwrote the whole dashboard.** Edits made in the GUI were
silently reverted to the version in code. Now it only appends the cards that are missing
and leaves the existing ones alone. A card's identity is its type plus the first entity in
it: the name will not do, it gets edited in the GUI, while the entity stays.

**The tests did not see the markup.** Every check was over pure logic, and each visual bug
had to be caught by screenshots by hand. A happy-dom environment was added, along with
checks of the level rows' markup — fill width, clamping to the bounds, the alarm glyph,
tap bubbling. Full cards cannot be assembled that way, they lean on HA components, but our
own templates are under test now.

**"All off" about lights that had stopped answering.** The light card counted anything
that was not `on` as off, so a room whose lamps had lost connection was reported as a
quiet, tidy room. Now an unreachable light keeps its row with the status Home Assistant
itself gives it, the "N of M on" count is only about the ones that answer, and the number
that do not is named on the line. Found on the real dashboard: two unavailable bedroom
lamps under the heading "All off".

**A minus was drawn as a measurement.** The living-room purifier reports `-1 μg/m³` for
PM2.5 while its fan is off — a sentinel for "no reading", not a value. The card showed it
in the secondary line and, worse, large in the right-hand column. There is a set of device
classes whose quantity has no negative half — a concentration, a share of something
present, a light level — and a minus there now means "nothing to show", the same as an
empty role. Power stays out of that set on purpose: below zero it means a house exporting
to the grid.

**The `CartridgeConfig` type had drifted from its meaning.** Eight cards used it for an
item of any list — consumables, sensors, areas, consumers. It became `EntityItem` in a
module of its own.

## What is missing compared to the stock tile

- the `assist` action. The `ha-voice-command-dialog` is not exported and is not registered
  on a fresh page — verified. Pretending the action works is worse than honestly writing a
  warning to the console.

`state_content` and `time_format` were missing at first and are supported now: when either
is set, the secondary line is rendered by the stock `state-display`, so attributes and
last-changed behave exactly as they do on the stock tile.

## Resolved questions

The repository root was not under git at first — only `frontend/` was, and that is a clone
of upstream home-assistant/frontend rather than a fork. The plugin now lives in its own
repository, `grigorii-horos/ha-plugins`, published under MIT with the built bundle
committed for HACS.
