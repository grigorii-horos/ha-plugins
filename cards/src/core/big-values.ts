/**
 * Picking the roles for the right-hand column.
 *
 * There can be one to three large values. Each next one drops the font a step:
 * 20px, 16px, 14px. Three only fit on a wide grid — on a narrow one almost
 * nothing is left of the card name — but that is the dashboard owner's
 * deliberate choice, not something to forbid.
 */
import type { ResolvedRole } from "./format";

export const MAX_BIG_VALUES = 3;

export interface KeyedRole {
  key: string;
  role?: ResolvedRole;
}

/**
 * Validates the list of roles from the config. An empty or missing list means
 * "as before": one value, the card's main role.
 */
export function resolveBigKeys(
  configured: string[] | undefined,
  fallback: string,
  allowed: readonly string[]
): string[] {
  if (!configured || configured.length === 0) return [fallback];

  if (configured.length > MAX_BIG_VALUES) {
    throw new Error(
      `At most ${MAX_BIG_VALUES} large values are allowed, got ${configured.length}`
    );
  }

  const unknown = configured.filter((key) => !allowed.includes(key));
  if (unknown.length) {
    throw new Error(
      `Unknown roles in big_values: ${unknown.join(", ")}. ` +
        `Allowed: ${allowed.join(", ")}`
    );
  }

  const duplicates = configured.filter(
    (key, index) => configured.indexOf(key) !== index
  );
  if (duplicates.length) {
    throw new Error(`Role listed twice: ${duplicates.join(", ")}`);
  }

  return configured;
}

/**
 * Splits roles between the right-hand column and the secondary line. A role that
 * went large is not repeated in the secondary line — otherwise it shows twice.
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
