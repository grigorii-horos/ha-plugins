/**
 * Списки сущностей в GUI-редакторе.
 *
 * В форме список — это просто entity_id, а в конфиге могут лежать объекты со
 * своим именем и иконкой. Модуль без DOM: логику покрывают тесты.
 */

/**
 * Пересобирает список после правки в GUI, сохраняя настройки, дописанные
 * руками в YAML. Иначе выбор одной сущности стирал бы имена и иконки всех
 * остальных.
 */
export function mergeEntityList<T extends { entity: string }>(
  previous: (T | string)[] | undefined,
  entityIds: string[]
): (T | string)[] {
  const byEntity = new Map<string, T | string>();
  for (const item of previous ?? []) {
    byEntity.set(typeof item === "string" ? item : item.entity, item);
  }
  return entityIds.map((entityId) => byEntity.get(entityId) ?? entityId);
}

/** Достаёт entity_id из списка, который может быть смесью строк и объектов. */
export function entityIdsOf(
  items: ({ entity: string } | string)[] | undefined
): string[] {
  return (items ?? []).map((item) =>
    typeof item === "string" ? item : item.entity
  );
}
