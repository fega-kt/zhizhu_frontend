import { chain } from 'lodash';

export class Arrays {
  /**
   * Chạy action (async) cho lần lượt từng phần tử trong mảng.
   */
  static async sequential<TInput>(array: TInput[], action: (input: TInput) => Promise<void>): Promise<void> {
    return array.reduce(async (prev, curr) => {
      await prev;
      await action(curr);
    }, Promise.resolve());
  }

  /**
   * Chạy action (async) đồng thời cho các phần tử trong mảng.
   */
  static async parallel<TInput>(array: TInput[], action: (input: TInput) => Promise<void>): Promise<void> {
    await Promise.all(array.map((item) => action(item)));
  }

  static concatFlatten<TInput, TOutput>(array: TInput[], action: (input: TInput) => TOutput[]): TOutput[] {
    return chain(array)
      .reduce((prev, curr) => {
        return prev.concat(action(curr));
      }, [] as TOutput[])
      .flatten()
      .value() as TOutput[];
  }
}
