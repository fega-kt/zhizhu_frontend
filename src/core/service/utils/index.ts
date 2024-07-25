/* eslint-disable no-bitwise */

export * from './base64-utils';

export * from './format-utils';

export { getFileExtension, replaceUrlStart, urlJoin } from './url-join';

export { defaultsDeep } from './defaults-deep';

export { isNameInvalid } from './name-invalid';

export const mergeObjects = (items: any[]) => {
  return items.reduce((acc, item) => {
    return {
      ...acc,
      ...item,
    };
  }, {});
};

export const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};

export { uiBlockingSubject } from './subjects';

export * from './file-utils';

export * from './expr-utils';

export * from './arrays';
