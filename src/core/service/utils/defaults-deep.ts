import { Dictionary } from 'lodash';

type Undef = { '@Undefined$ymbol': true };
type NonUndef<T> = T extends Undef ? never : T;

type Converted<T> = {
  [P in keyof T]: Undef extends T[P] ? NonUndef<T[P]> | undefined : T[P];
};

type NonTraversable = { [Symbol.toPrimitive]: any };

type DefaultsDeep<T, U extends Partial<T>> = {
  [P in keyof T]-?: NonNullable<T[P]> extends NonTraversable
    ? null extends U[P]
      ? undefined extends U[P]
        ? T[P] | Undef
        : T[P]
      : undefined extends U[P]
      ? NonNullable<T[P]> | Undef
      : NonNullable<T[P]>
    : U[P] extends Partial<T[P]>
    ? null extends U[P]
      ? undefined extends U[P]
        ? Converted<DefaultsDeep<T[P], NonNullable<U[P]>>> | Undef
        : Converted<DefaultsDeep<T[P], NonNullable<U[P]>>>
      : undefined extends U[P]
      ? Converted<NonNullable<DefaultsDeep<T[P], NonNullable<U[P]>>>> | Undef
      : Converted<NonNullable<DefaultsDeep<T[P], NonNullable<U[P]>>>>
    : undefined extends U[P]
    ? undefined extends T[P]
      ? T[P] | Undef
      : T[P]
    : T[P];
};

const isPlainObject = (obj: any) => Object.prototype.toString.call(obj) === '[object Object]';
const isNil = (v: any) => v === null || v === undefined;

export const defaultsDeep = <T, U extends Partial<NonNullable<T>>>(
  object: T,
  defaults: U,
): Converted<DefaultsDeep<NonNullable<T>, U>> =>
  Object.entries(defaults).reduce(
    (acc, [key, value]: [string, any]) => {
      if (isNil(acc[key]) && !isNil(value)) {
        acc[key] = value;
      }
      if (isPlainObject(acc[key]) && isPlainObject(value)) {
        acc[key] = defaultsDeep(acc[key], value);
      }
      return acc;
    },
    { ...object } as Dictionary<any>,
  ) as Converted<DefaultsDeep<NonNullable<T>, U>>;
