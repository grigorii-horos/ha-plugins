/**
 * Элемент списка сущностей в конфиге карточки.
 *
 * Списками задаются очень разные вещи — картриджи, расходники, датчики зоны,
 * потребители электричества, устройства человека, — но устроены они одинаково:
 * либо просто entity_id, либо он же со своим именем, иконкой и цветом.
 */
export interface EntityItem {
  entity: string;
  name?: string;
  icon?: string;
  color?: string;
}

/** Приводит короткую запись к полной. */
export function normalizeItem(item: EntityItem | string): EntityItem {
  return typeof item === "string" ? { entity: item } : item;
}
