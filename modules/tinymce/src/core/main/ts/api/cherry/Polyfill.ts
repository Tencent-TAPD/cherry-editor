/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

(function (elem) {
  const isNode = function (object) {
    if (typeof Node === 'function') {
      return object instanceof Node;
    }
    return (
      object
      && typeof object === 'object'
      && object.nodeName
      && object.nodeType >= 1
      && object.nodeType <= 12
    );
  };
  for (let i = 0; i < elem.length; i++) {
    if (!window[elem[i]] || 'append' in window[elem[i]].prototype) {
      continue;
    }
    window[elem[i]].prototype.append = function () {
      const argArr = Array.prototype.slice.call(arguments);
      const docFrag = document.createDocumentFragment();
      for (let n = 0; n < argArr.length; n++) {
        docFrag.appendChild(isNode(argArr[n])
          ? argArr[n]
          : document.createTextNode(String(argArr[n])));
      }
      this.appendChild(docFrag);
    };
  }
}([ 'Element', 'CharacterData', 'DocumentType' ]));
