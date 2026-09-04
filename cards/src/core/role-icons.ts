/**
 * Иконки ролей для правой колонки.
 *
 * Само по себе «63%» не говорит ничего: это может быть влажность, заряд,
 * место на диске или ресурс щётки. Единица измерения не спасает — проценты
 * есть у всего. Иконка называет величину, не занимая места под слово.
 */
export const ROLE_ICONS: Record<string, string> = {
  temperature: "mdi:thermometer",
  humidity: "mdi:water-percent",
  moisture: "mdi:water-percent",
  illuminance: "mdi:brightness-5",
  pm25: "mdi:blur",
  power: "mdi:flash",
  energy: "mdi:counter",
  battery: "mdi:battery",
  disk: "mdi:harddisk",
  cpu: "mdi:cpu-64-bit",
  memory: "mdi:memory",
  gpu: "mdi:expansion-card",
  download: "mdi:download",
  upload: "mdi:upload",
  total: "mdi:flash",
};
