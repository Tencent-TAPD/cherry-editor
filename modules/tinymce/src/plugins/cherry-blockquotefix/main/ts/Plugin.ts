/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';

export default () => {
  PluginManager.add('cherry-blockquotefix', function plugin(editor) {
    editor.on('KeyDown', function (e) {
      if (e.keyCode == 27) {
        const { dom } = editor;
        const parentBlock = editor.selection.getSelectedBlocks()[0];
        const containerBlock = parentBlock.parentNode.nodeName == 'BODY' ? dom.getParent(parentBlock, dom.isBlock) : dom.getParent(parentBlock.parentNode, dom.isBlock);
        const newBlock = editor.dom.create('p');
        newBlock.innerHTML = '<br data-mce-bogus="1">';
        dom.insertAfter(newBlock, containerBlock);
        const rng = dom.createRng();
        newBlock.normalize();
        rng.setStart(newBlock, 0);
        rng.setEnd(newBlock, 0);
        editor.selection.setRng(rng);
      }
    });
  });
};
