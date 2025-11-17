export const SORT_ORDER = [1, -1] as const;

export type SortOrder = (typeof SORT_ORDER)[number];
