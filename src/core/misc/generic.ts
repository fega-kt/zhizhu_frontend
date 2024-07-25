export type StatusMapValue = {
  title: string;
  color: string;
  textColor?: string;
};

export type StatusMap<T extends string | number> = Record<T, StatusMapValue>;

export type ValueMap<T extends string | number> = Record<T, string>;
