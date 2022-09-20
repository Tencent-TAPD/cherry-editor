/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import * as Dialog from './Dialog';

const isCodeBlockSelection = (editor: Editor) => {
  const node = editor.selection.getStart();
  return editor.dom.is(node, 'pre[class*="language-"]');
};

const register = function (editor: Editor) {
  editor.ui.registry.addToggleButton('cherry-codeblock', {
    icon: 'cherry-code-block',
    tooltip: 'Insert/edit code block',
    onAction: () => Dialog.open(editor),
    onSetup: (api) => {
      const nodeChangeHandler = () => {
        api.setActive(isCodeBlockSelection(editor));
      };
      editor.on('NodeChange', nodeChangeHandler);
      return () => editor.off('NodeChange', nodeChangeHandler);
    }
  });

  editor.ui.registry.addMenuItem('cherry-codeblock', {
    text: 'codeblock',
    icon: 'cherry-code-block',
    onAction: () => Dialog.open(editor)
  });
};

export {
  register
};
