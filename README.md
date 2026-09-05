# Horos cards for Home Assistant

Lovelace cards that pack several entities into a single tile — grouped by device or
by meaning.

![Cards](docs/images/hero.png)

[![HACS: Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
[![Home Assistant 2026.9+](https://img.shields.io/badge/Home%20Assistant-2026.9%2B-41BDF5.svg)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Why

One physical thing turns into a dozen entities in Home Assistant: a Zigbee plug gives
you 13, a robot vacuum 78, a computer reporting through lnxlink all 100. The stock tile
shows exactly one of them, so seeing the whole device means lining up five tiles in a
row.

These cards pull out of those entities the thing you actually look at the device for:
a printer — the level of every cartridge, a vacuum — its battery and how much life is
left in the consumables, a person — whether they are home and whether their watch is
about to die.

The cards are not a generic builder. The config says **which entity plays which role**,
and the card decides the layout itself.

## How it works

The cards **don't reimplement the stock tile's markup — they are assembled from its
components**: `ha-tile-container`, `ha-tile-icon`, `ha-tile-info`, `hui-card-features`.
Ripple, gesture recognition, the focus ring, `state_content`, stock features and all six
actions (tap/hold/double tap, and the same three on the icon) come from there too.

Only what the tile does not have is written here: the right-hand column of large values,
a separate tap target per value, and the level rows.

The interface and the editors are translated into English and Russian; the language
follows the user's Home Assistant setting.

The rationale behind the decisions, and the list of what is missing compared to the
stock tile, are in the [design spec](docs/superpowers/specs/2026-09-04-ha-tile-cards-design.md).

## Installation

HACS → ⋮ → Custom repositories → the address of this repository, category **Dashboard**.
Then "Install" and reload the page.

The built `dist/ha-plugins-cards.js` is committed to the repository, so no access to the
Home Assistant filesystem is needed.

Manually: drop `dist/ha-plugins-cards.js` into `config/www/` and add it under
Settings → Dashboards → ⋮ → Resources as a JavaScript module `/local/ha-plugins-cards.js`.

Every card shows up in the card picker, and each one has its own visual editor — writing
YAML is optional.

## Suggestions when adding a card

![Suggestion in the add-card dialog](docs/images/suggestion.png)

In edit mode, "Add card → By entity" asks every installed card what it would build
for the entity you picked, and the answers show up under "Community". These cards
answer, and the suggestion arrives already filled in: pick the bedroom temperature
sensor and you get a room card that has found the humidity on the same device; pick one
cartridge and you get the printer with all of its ink; pick any battery and you get the
card holding every battery in the house.

That is not the auto-detection the cards refuse to do. A suggestion is a draft rendered
in front of you and editable before it is added, and the rules behind it are objective —
domain, `device_class`, entity attributes, belonging to one device. Nothing is guessed
from names.

A card stays quiet when it would not say more than the stock tile: a lone temperature
sensor with nothing else on its device suggests nothing.

## Cards

The fields shared by every card (except `horos-buttons-tile`) are the stock tile's own:
`name`, `icon`, `color`, `vertical`, `hide_state`, `state_content`, `time_format`,
`features`, `features_position`, `tap_action`, `hold_action`, `double_tap_action` and the
same three actions on the icon.

Wherever a field takes a list, an item can be either an `entity_id` string or
`{entity, name, icon, color}` if you want your own label or row colour.

`big_values` picks which values move into the right-hand column in a large font (up to
three).

### Room — `horos-climate-tile`

![Climate](docs/images/climate.png)

Temperature, humidity, illuminance and PM2.5 of a single room.

```yaml
type: custom:horos-climate-tile
name: Bedroom
temperature: sensor.bedroom_temperature
humidity: sensor.bedroom_humidity
illuminance: sensor.bedroom_illuminance
pm25: sensor.bedroom_pm25
big_values: [temperature]
```

### Plug — `horos-plug-tile`

![Plug](docs/images/plug.png)

Switch, current power draw and accumulated energy. `toggle_button: true` adds a
full-width toggle.

```yaml
type: custom:horos-plug-tile
switch: switch.boiler
power: sensor.boiler_power
energy: sensor.boiler_energy
```

### Plant — `horos-plant-tile`

![Plant](docs/images/plant.png)

Soil moisture as a bar, with dry and overwatered thresholds (`dry_below`, `wet_above`).

```yaml
type: custom:horos-plant-tile
name: Orange tree
moisture: sensor.orange_moisture
temperature: sensor.orange_temperature
battery: sensor.orange_battery
dry_below: 25
```

### Cover — `horos-cover-tile`

![Cover](docs/images/cover.png)

Cover position on a slider plus up/stop/down buttons (`controls: true`).

```yaml
type: custom:horos-cover-tile
cover: cover.balcony
controls: true
illuminance: sensor.balcony_illuminance
battery: sensor.balcony_battery
```

### Air — `horos-air-tile`

![Air](docs/images/air.png)

Purifier, recuperator, humidifier: the appliance itself plus what it measures.

```yaml
type: custom:horos-air-tile
appliance: fan.purifier_living_room
pm25: sensor.purifier_pm25
humidity: sensor.purifier_humidity
power: sensor.purifier_power
```

### Printer — `horos-printer-tile`

![Printer](docs/images/printer.png)

Cartridge levels in their own colours, plus the printer state. Thresholds come from the
printer's own markers, and the waste ink tank is counted the other way round — it fills
up rather than runs out.

```yaml
type: custom:horos-printer-tile
status: sensor.printer_status
cartridges:
  - sensor.printer_black
  - sensor.printer_cyan
  - sensor.printer_magenta
  - sensor.printer_yellow
```

### Vacuum — `horos-vacuum-tile`

![Vacuum](docs/images/vacuum.png)

Battery and the remaining life of brushes, filter and mop.

```yaml
type: custom:horos-vacuum-tile
vacuum: vacuum.robot
battery: sensor.robot_battery
consumables:
  - entity: sensor.robot_main_brush_left
    name: Main brush
  - sensor.robot_side_brush_left
  - sensor.robot_filter_left
```

### Computer — `horos-computer-tile`

![Computer](docs/images/computer.png)

CPU, memory, GPU and disk load; in large type — the hottest of all temperature sensors.

```yaml
type: custom:horos-computer-tile
status: sensor.desktop_status
cpu: sensor.desktop_cpu_load
memory: sensor.desktop_memory_use
gpu: sensor.desktop_gpu_load
temperatures: [sensor.desktop_cpu_temp, sensor.desktop_gpu_temp]
disks: [sensor.desktop_disk_use]
```

### Server — `horos-server-tile`

![Server](docs/images/server.png)

Free space, network throughput and the state of services.

```yaml
type: custom:horos-server-tile
status: binary_sensor.server_online
disk: sensor.server_disk_free
download: sensor.server_download
upload: sensor.server_upload
services: [binary_sensor.syncthing, binary_sensor.jellyfin]
```

### Person — `horos-person-tile`

![Person](docs/images/person.png)

Whether someone is home, where exactly, and the battery of their devices.

```yaml
type: custom:horos-person-tile
person: person.alice
battery: sensor.alice_phone_battery
location: sensor.alice_phone_geocoded_location
devices:
  - entity: sensor.alice_watch_battery
    name: Watch
  - sensor.alice_tablet_battery
```

### Presence — `horos-presence-tile`

![Presence](docs/images/presence.png)

Which areas currently have someone in them.

```yaml
type: custom:horos-presence-tile
areas:
  - binary_sensor.living_room_presence
  - binary_sensor.kitchen_presence
```

### Energy — `horos-energy-tile`

![Energy](docs/images/energy.png)

Who in the house is drawing power right now. `limit` caps how many consumers are shown.

```yaml
type: custom:horos-energy-tile
total: sensor.house_power
consumers: [sensor.boiler_power, sensor.recuperator_power]
limit: 4
```

### Batteries — `horos-batteries-tile`

![Batteries](docs/images/batteries.png)

Only the batteries that are running low: below `low_below` (30% by default).

```yaml
type: custom:horos-batteries-tile
batteries: [sensor.motion_kitchen_battery, sensor.door_battery]
low_below: 30
```

### Safety — `horos-safety-tile`

![Safety](docs/images/safety.png)

Leak, smoke, gas — and, separately, the sensors that have gone quiet.

```yaml
type: custom:horos-safety-tile
sensors: [binary_sensor.leak_kitchen, binary_sensor.smoke_hall]
```

### Not responding — `horos-offline-tile`

![Not responding](docs/images/offline.png)

Unavailable entities grouped by device: one device, one line, not twenty. Nothing to
list — the card walks every entity itself.

```yaml
type: custom:horos-offline-tile
limit: 6
ignore: [sensor.flaky_one]
ignore_domains: [update]
```

### Buttons — `horos-buttons-tile`

![Buttons](docs/images/buttons.png)

A grid of buttons that run scripts and scenes.

```yaml
type: custom:horos-buttons-tile
name: Light
icon: mdi:lamp
columns: 3
buttons:
  - entity: script.light_bright
    name: Bright
    icon: mdi:brightness-7
  - script.light_dim
  - scene.night
```

## Development

```sh
cd cards
npm install
npm run dev     # http://<this-host>:5188
npm test
npm run build   # ../dist/ha-plugins-cards.js — the file HACS installs
```

Dev mode is only for while the cards are being edited: the dashboard then loads them
straight off the development machine, with `http://<host>:5188/src/main.ts` added to the
dashboard resources. The dashboard has to be opened over **http** for that, otherwise the
browser blocks the http module as mixed content. Reloading means F5: a custom element
that is already registered cannot be redefined in a live page.

The `frontend/` folder is a clone of the home-assistant/frontend sources. It is not part
of the project and is not committed, but it is the reference for markup and design tokens.

### Deploying to your own Home Assistant

```sh
script/publish.py
```

Builds the bundle, copies it into `www/` on the Home Assistant host and updates the
dashboard resource, appending a hash of the contents to the URL. That version in the URL
is mandatory: without it HA keeps serving the cached old file and the update silently
never reaches the browser.

The host and path come from `HA_SSH_HOST` and `HA_WWW`, the URL and token from
`HOME_ASSISTANT_URL` and `HOME_ASSISTANT_KEY`.

## License

[MIT](LICENSE)
