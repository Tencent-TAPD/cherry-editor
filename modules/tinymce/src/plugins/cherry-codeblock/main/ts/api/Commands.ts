/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import * as Dialog from '../ui/Dialog';
import * as Utils from '../util/Utils';

const register = function (editor: Editor) {
  editor.addCommand('codeblock', function () {
    const node = editor.selection.getNode();
    if (editor.selection.isCollapsed() || Utils.isCodeBlock(node)) {
      Dialog.open(editor);
    } else {
      editor.formatter.toggle('code');
    }
  });
};

export {
  register
};
