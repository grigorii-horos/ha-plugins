# Horos cards для Home Assistant

Карточки, которые собирают несколько сущностей в одну плитку — по устройству или
по смыслу.

![Карточки](docs/images/hero.png)

[![HACS: Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
[![Home Assistant 2026.9+](https://img.shields.io/badge/Home%20Assistant-2026.9%2B-41BDF5.svg)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Зачем

Одна физическая вещь в HA рассыпается на десяток сущностей: Zigbee-розетка даёт 13,
робот-пылесос — 78, компьютер через lnxlink — все 100. Штатная плитка показывает ровно
одну из них, и чтобы увидеть устройство целиком, приходится ставить пять плиток в ряд.

Эти карточки собирают из сущностей то, ради чего на устройство смотрят: принтер —
уровни всех картриджей, пылесос — заряд и ресурс расходников, человек — дома ли он и
не сели ли его часы.

Карточки не универсальный конструктор: в конфиге указывается, **какая сущность играет
какую роль**, а раскладку карточка выбирает сама.

## Как устроено

Карточки **не повторяют вёрстку штатной плитки, а собираются из её компонентов** —
`ha-tile-container`, `ha-tile-icon`, `ha-tile-info`, `hui-card-features`. Оттуда же
приходят ripple, распознавание жестов, кольцо фокуса, `state_content`, штатные
features и все шесть действий (tap/hold/double tap, отдельно по иконке).

Своего в карточке только то, чего у плитки нет: правая колонка с крупными значениями,
отдельная цель тапа у каждой величины и строки уровней.

Интерфейс и редакторы переведены на русский и английский, язык берётся из настроек
пользователя HA.

Подробности, включая обоснование решений и то, чего против штатной плитки нет, —
в [спецификации](docs/superpowers/specs/2026-09-04-ha-tile-cards-design.md).

## Установка

HACS → ⋮ → Custom repositories → адрес этого репозитория, категория **Dashboard**.
Дальше — «Install» и перезагрузка страницы.

Собранный `dist/ha-plugins-cards.js` лежит в репозитории, поэтому доступ к файловой
системе Home Assistant не нужен.

Вручную: положить `dist/ha-plugins-cards.js` в `config/www/` и добавить его в
Settings → Dashboards → ⋮ → Resources как JavaScript module `/local/ha-plugins-cards.js`.

Все карточки есть в списке добавления карточки — искать по названию, и у каждой свой
графический редактор, YAML писать не обязательно.

## Карточки

Поля, общие для всех карточек (кроме `horos-buttons-tile`), — те же, что у штатной
плитки: `name`, `icon`, `color`, `vertical`, `hide_state`, `state_content`,
`time_format`, `features`, `features_position`, `tap_action`, `hold_action`,
`double_tap_action` и три таких же действия по иконке.

Там, где в поле ждут список, элементом может быть либо `entity_id` строкой, либо
`{entity, name, icon, color}` — если хочется своё имя или цвет строки.

Поле `big_values` выбирает, какие величины уйдут в правую колонку крупным шрифтом
(до трёх).

### Комната — `horos-climate-tile`

![Климат](docs/images/climate.png)

Температура, влажность, освещённость и PM2.5 одной комнаты.

```yaml
type: custom:horos-climate-tile
name: Спальня
temperature: sensor.bedroom_temperature
humidity: sensor.bedroom_humidity
illuminance: sensor.bedroom_illuminance
pm25: sensor.bedroom_pm25
big_values: [temperature]
```

### Розетка — `horos-plug-tile`

![Розетка](docs/images/plug.png)

Выключатель, текущая мощность и накопленная энергия. `toggle_button: true` добавляет
кнопку включения во всю ширину.

```yaml
type: custom:horos-plug-tile
switch: switch.boiler
power: sensor.boiler_power
energy: sensor.boiler_energy
```

### Растение — `horos-plant-tile`

![Растение](docs/images/plant.png)

Влажность почвы полосой, с порогами сухости и перелива (`dry_below`, `wet_above`).

```yaml
type: custom:horos-plant-tile
name: Апельсин
moisture: sensor.orange_moisture
temperature: sensor.orange_temperature
battery: sensor.orange_battery
dry_below: 25
```

### Штора — `horos-cover-tile`

![Штора](docs/images/cover.png)

Положение шторы ползунком и кнопки вверх/стоп/вниз (`controls: true`).

```yaml
type: custom:horos-cover-tile
cover: cover.balcony
controls: true
illuminance: sensor.balcony_illuminance
battery: sensor.balcony_battery
```

### Воздух — `horos-air-tile`

![Воздух](docs/images/air.png)

Очиститель, рекуператор, увлажнитель: сам прибор плюс то, что он меряет.

```yaml
type: custom:horos-air-tile
appliance: fan.purifier_living_room
pm25: sensor.purifier_pm25
humidity: sensor.purifier_humidity
power: sensor.purifier_power
```

### Принтер — `horos-printer-tile`

![Принтер](docs/images/printer.png)

Уровни картриджей в их собственных цветах и состояние принтера. Пороги берутся из
маркеров самого принтера, а бак отработанных чернил считается наоборот — он
заполняется, а не расходуется.

```yaml
type: custom:horos-printer-tile
status: sensor.printer_status
cartridges:
  - sensor.printer_black
  - sensor.printer_cyan
  - sensor.printer_magenta
  - sensor.printer_yellow
```

### Пылесос — `horos-vacuum-tile`

![Пылесос](docs/images/vacuum.png)

Заряд и остаток ресурса щёток, фильтра и швабры.

```yaml
type: custom:horos-vacuum-tile
vacuum: vacuum.robot
battery: sensor.robot_battery
consumables:
  - entity: sensor.robot_main_brush_left
    name: Осн. щётка
  - sensor.robot_side_brush_left
  - sensor.robot_filter_left
```

### Компьютер — `horos-computer-tile`

![Компьютер](docs/images/computer.png)

Загрузка CPU, памяти, GPU и дисков; крупно — самая горячая точка из всех датчиков
температуры.

```yaml
type: custom:horos-computer-tile
status: sensor.desktop_status
cpu: sensor.desktop_cpu_load
memory: sensor.desktop_memory_use
gpu: sensor.desktop_gpu_load
temperatures: [sensor.desktop_cpu_temp, sensor.desktop_gpu_temp]
disks: [sensor.desktop_disk_use]
```

### Сервер — `horos-server-tile`

![Сервер](docs/images/server.png)

Свободное место, скорости сети и состояние сервисов.

```yaml
type: custom:horos-server-tile
status: binary_sensor.server_online
disk: sensor.server_disk_free
download: sensor.server_download
upload: sensor.server_upload
services: [binary_sensor.syncthing, binary_sensor.jellyfin]
```

### Человек — `horos-person-tile`

![Человек](docs/images/person.png)

Дома ли человек, где именно, и заряд его устройств.

```yaml
type: custom:horos-person-tile
person: person.alice
battery: sensor.alice_phone_battery
location: sensor.alice_phone_geocoded_location
devices:
  - entity: sensor.alice_watch_battery
    name: Часы
  - sensor.alice_tablet_battery
```

### Присутствие — `horos-presence-tile`

![Присутствие](docs/images/presence.png)

В каких зонах сейчас кто-то есть.

```yaml
type: custom:horos-presence-tile
areas:
  - binary_sensor.living_room_presence
  - binary_sensor.kitchen_presence
```

### Энергия — `horos-energy-tile`

![Энергия](docs/images/energy.png)

Кто в доме ест электричество прямо сейчас. `limit` — сколько потребителей показывать.

```yaml
type: custom:horos-energy-tile
total: sensor.house_power
consumers: [sensor.boiler_power, sensor.recuperator_power]
limit: 4
```

### Батарейки — `horos-batteries-tile`

![Батарейки](docs/images/batteries.png)

Только те батарейки, что садятся: ниже `low_below` (по умолчанию 30%).

```yaml
type: custom:horos-batteries-tile
batteries: [sensor.motion_kitchen_battery, sensor.door_battery]
low_below: 30
```

### Безопасность — `horos-safety-tile`

![Безопасность](docs/images/safety.png)

Протечка, дым, газ — и отдельно те датчики, что молчат.

```yaml
type: custom:horos-safety-tile
sensors: [binary_sensor.leak_kitchen, binary_sensor.smoke_hall]
```

### Что не отвечает — `horos-offline-tile`

![Что не отвечает](docs/images/offline.png)

Сущности без связи, сгруппированные по устройствам: одно устройство — одна строка, а
не двадцать. Ничего перечислять не нужно, карточка сама обходит все сущности.

```yaml
type: custom:horos-offline-tile
limit: 6
ignore: [sensor.flaky_one]
ignore_domains: [update]
```

### Кнопки — `horos-buttons-tile`

![Кнопки](docs/images/buttons.png)

Сетка кнопок, запускающих скрипты и сцены.

```yaml
type: custom:horos-buttons-tile
name: Свет
icon: mdi:lamp
columns: 3
buttons:
  - entity: script.light_bright
    name: Ярко
    icon: mdi:brightness-7
  - script.light_dim
  - scene.night
```

## Разработка

```sh
cd cards
npm install
npm run dev     # http://<этот-хост>:5188
npm test
npm run build   # ../dist/ha-plugins-cards.js — его и ставит HACS
```

Dev-режим нужен, только пока карточки правятся: дашборд тогда грузит их прямо с машины
разработчика — в ресурсы дашборда добавляется модуль `http://<хост>:5188/src/main.ts`.
Дашборд при этом открывается по **http**, иначе браузер зарубит http-модуль как mixed
content. Обновление — F5: переопределить зарегистрированный custom element в живой
странице нельзя.

Папка `frontend/` — клон исходников home-assistant/frontend. Она не часть проекта и не
версионируется, но нужна как справочник по вёрстке и токенам.

### Обновление своего Home Assistant

```sh
script/publish.py
```

Собирает бандл, кладёт его в `www/` на хосте HA и обновляет ресурс дашборда, добавляя к
адресу хеш содержимого. Версия в адресе обязательна: без неё HA продолжает отдавать
закешированный старый файл, и обновление проходит незаметно для браузера.

Хост и путь берутся из `HA_SSH_HOST` и `HA_WWW`, адрес и токен — из
`HOME_ASSISTANT_URL` и `HOME_ASSISTANT_KEY`.

## Лицензия

[MIT](LICENSE)
