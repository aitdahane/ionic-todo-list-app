export const reorderItems = <T = any>(
  items: T[],
  fromPosition: number,
  toPosition
): T[] => {
  if (fromPosition === toPosition) {
    return items;
  }
  const fromP = Math.max(fromPosition, 0);
  const toP = Math.min(toPosition, items.length - 1);
  return [
    ...items.filter(({}, index) => index < toP && index !== fromP),
    items[Math.max(fromP, toP)],
    items[Math.min(fromP, toP)],
    ...items.filter(({}, index) => index > toP && index !== fromP),
  ];
};

export const sortByPosition = <T extends { position?: number }>(
  items: T[]
): T[] => {
  return items?.sort((a, b) => a?.position - b?.position);
};

export const findById = <T extends { id: number }>(
  items: T[],
  id: number,
): T => {
  return items?.find((item) => id === item.id);
}