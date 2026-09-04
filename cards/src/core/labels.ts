/**
 * Подписи, выведенные из имён сущностей. Без DOM — покрывается тестами.
 */

/**
 * Убирает из имени сущности имя устройства: оно уже сказано заголовком
 * карточки. «Canon G3030 series Cyan» при принтере «Canon G3030 series»
 * становится «Cyan». Если после отрезания ничего не остаётся, имя не трогаем.
 */
export function stripDeviceName(
  friendlyName: string | undefined,
  deviceName: string | undefined
): string | undefined {
  if (!friendlyName) return undefined;
  if (deviceName && friendlyName.startsWith(deviceName)) {
    const rest = friendlyName.slice(deviceName.length).trim();
    if (rest) return rest;
  }
  return friendlyName;
}

/**
 * Цвет уровня — по тем же ступеням, что HA красит батарейки: 70 и 30
 * процентов. Годится и для расходников: вопрос у них тот же, «скоро ли
 * кончится».
 */
export function levelColor(level: number | undefined): string {
  if (level === undefined) return "var(--state-unavailable-color)";
  if (level >= 70) return "var(--state-sensor-battery-high-color, #4caf50)";
  if (level >= 30) return "var(--state-sensor-battery-medium-color, #ffa600)";
  return "var(--state-sensor-battery-low-color, #db4437)";
}

/** Прежнее имя: у батареек тот же смысл. */
export const batteryColor = levelColor;

/**
 * Цвет нагрузки — обратный цвету уровня. У батарейки много это хорошо, у
 * загрузки процессора и заполненности диска наоборот: чем выше, тем тревожнее.
 */
export function loadColor(level: number | undefined): string {
  if (level === undefined) return "var(--state-unavailable-color)";
  if (level >= 90) return "var(--error-color, #db4437)";
  if (level >= 80) return "var(--warning-color, #ffa600)";
  return "var(--state-icon-color)";
}
