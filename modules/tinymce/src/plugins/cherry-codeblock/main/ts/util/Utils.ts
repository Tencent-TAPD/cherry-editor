/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

function isCodeBlock(elm: Element) {
  return elm && elm.nodeName === 'PRE' && elm.className.indexOf('language-') !== -1;
}

function trimArg<T>(predicateFn: (a: T) => boolean) {
  return function (arg1: any, arg2: T) {
    return predicateFn(arg2);
  };
}

export {
  isCodeBlock,
  trimArg
};
