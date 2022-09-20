/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import { Optional } from '@ephox/katamari';
import DOMUtils from 'tinymce/core/api/dom/DOMUtils';
import Editor from 'tinymce/core/api/Editor';
import * as Utils from '../util/Utils';
import * as Prism from './Prism';


const getSelectedCodeBlock = (editor: Editor) => {
  const node = editor.selection ? editor.selection.getNode() : null;

  if (Utils.isCodeBlock(node)) {
    return Optional.some(node);
  }

  return Optional.none<Element>();
};

const insertCodeBlock = (editor: Editor, language: string, code: string, theme: string) => {
  editor.undoManager.transact(() => {
    const node = getSelectedCodeBlock(editor);

    code = DOMUtils.DOM.encode(code);

    return node.fold(() => {
      editor.insertContent('<pre id="__new" class="language-' + language + ' line-numbers theme-' + theme + '">' + code + '</pre>');
      editor.selection.select(editor.$('#__new').removeAttr('id')[0]);
    }, (n) => {
      editor.dom.setAttrib(n, 'class', 'language-' + language + ' line-numbers theme-' + theme);
      n.innerHTML = code;
      Prism.get(editor).highlightElement(n);
      editor.selection.select(n);
    });
  });
};

const getCurrentCode = (editor: Editor): string => {
  const node = getSelectedCodeBlock(editor);
  return node.fold(() => '', (n) => {
    n.innerHTML = n.innerHTML.replace(/<br>/g, '\n'); 
    return n.textContent
  });
};

export {
  getSelectedCodeBlock,
  insertCodeBlock,
  getCurrentCode
};
