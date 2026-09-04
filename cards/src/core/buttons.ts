/**
 * Разбор списка кнопок. Отдельным модулем без DOM — как и остальная чистая
 * логика, чтобы её покрывали тесты.
 */

export interface ButtonConfig {
  /** Что нажимаем: script, scene, button, switch — что угодно нажимаемое. */
  entity: string;
  name?: string;
  icon?: string;
}

/**
 * Подпись кнопки по умолчанию. У скриптов имена вида «IR — Bedroom: Night
 * Mode»: общий префикс на кнопке не нужен, он уже сказан заголовком карточки.
 */
export function buttonLabel(
  friendlyName: string | undefined
): string | undefined {
  if (!friendlyName) return undefined;
  const afterColon = friendlyName.split(":").pop();
  return afterColon ? afterColon.trim() : friendlyName;
}

export function normalizeButton(button: ButtonConfig | string): ButtonConfig {
  return typeof button === "string" ? { entity: button } : button;
}
