/**
 * Выбор ролей для правой колонки.
 *
 * Крупных значений может быть от одного до трёх. Каждое следующее опускает
 * шрифт на ступень: 20px, 16px, 14px. Три помещаются только на широкой сетке —
 * на узкой от имени карточки почти ничего не остаётся, — но это осознанный
 * выбор владельца дашборда, а не запрет.
 */
import type { ResolvedRole } from "./format";

export const MAX_BIG_VALUES = 3;

export interface KeyedRole {
  key: string;
  role?: ResolvedRole;
}

/**
 * Проверяет список ролей из конфига. Пустой или отсутствующий список означает
 * «как раньше»: одно значение, главная роль карточки.
 */
export function resolveBigKeys(
  configured: string[] | undefined,
  fallback: string,
  allowed: readonly string[]
): string[] {
  if (!configured || configured.length === 0) return [fallback];

  if (configured.length > MAX_BIG_VALUES) {
    throw new Error(
      `Крупных значений может быть не больше ${MAX_BIG_VALUES}, указано ${configured.length}`
    );
  }

  const unknown = configured.filter((key) => !allowed.includes(key));
  if (unknown.length) {
    throw new Error(
      `Неизвестные роли в big_values: ${unknown.join(", ")}. ` +
        `Допустимы: ${allowed.join(", ")}`
    );
  }

  const duplicates = configured.filter(
    (key, index) => configured.indexOf(key) !== index
  );
  if (duplicates.length) {
    throw new Error(`Роль указана дважды: ${duplicates.join(", ")}`);
  }

  return configured;
}

/**
 * Делит роли на правую колонку и вторичную строку. Роль, ушедшая в крупные,
 * во вторичной строке не повторяется — иначе значение дублируется.
 */
export function splitRoles(
  roles: KeyedRole[],
  bigKeys: string[]
): { big: KeyedRole[]; rest: KeyedRole[] } {
  const big = bigKeys
    .map((key) => roles.find((item) => item.key === key))
    .filter((item): item is KeyedRole => !!item);

  const rest = roles.filter((item) => !bigKeys.includes(item.key));

  return { big, rest };
}
