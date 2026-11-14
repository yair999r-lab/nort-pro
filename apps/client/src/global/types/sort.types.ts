export type DirectionType = "asc" | "desc";

export type SortTableType<T> = {
  direction: DirectionType;
  orderBy: keyof T;
};
