export interface Parser<T> {
  parse: (response: any) => Promise<T>;
}
