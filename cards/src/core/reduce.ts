/**
 * Сведение списка однородных сенсоров к одному.
 *
 * У компьютера двенадцать датчиков температуры и три раздела диска. Показывать
 * их списком бессмысленно: вопрос всегда один — насколько горячо и насколько
 * забито. Поэтому из списка выбирается крайний, и он же становится обычной
 * ролью: тап по нему откроет именно тот датчик, который сейчас крайний.
 */
import { numericState, resolveRole, type ResolvedRole } from "./format";
import type { HomeAssistant } from "./types";

export type Extreme = "max" | "min";

export function pickExtreme(
  hass: HomeAssistant | undefined,
  entityIds: string[] | undefined,
  mode: Extreme
): ResolvedRole | undefined {
  if (!hass || !entityIds?.length) return undefined;

  let best: ResolvedRole | undefined;
  let bestValue: number | undefined;

  for (const entityId of entityIds) {
    const role = resolveRole(hass, entityId);
    const value = numericState(role);
    if (value === undefined) continue;
    if (
      bestValue === undefined ||
      (mode === "max" ? value > bestValue : value < bestValue)
    ) {
      best = role;
      bestValue = value;
    }
  }

  // Ни одного числа: возвращаем первую роль, чтобы карточка сказала о проблеме,
  // а не притворилась, что списка не было.
  return best ?? resolveRole(hass, entityIds[0]);
}
