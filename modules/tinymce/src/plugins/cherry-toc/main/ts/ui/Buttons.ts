/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import { Toolbar } from 'tinymce/core/api/ui/Ui';

const toggleState = (editor: Editor) => (api: Toolbar.ToolbarButtonInstanceApi) => {
  const toggleDisabledState = () => {
    api.setDisabled(editor.mode.isReadOnly());
  };

  toggleDisabledState();
  editor.on('LoadContent SetContent change', toggleDisabledState);
  editor.on('change keyup', ()=> {
    editor.execCommand('cherryUpdateToc');
  });
  return () => editor.on('LoadContent SetContent change', toggleDisabledState);
};

const isToc = (editor: Editor) => (elm) => {
  const ret = elm && editor.dom.is(elm, '.' + editor.getParam('toc_class', 'toc')) && editor.getBody().contains(elm);
  return ret && elm.getAttribute('data-mce-selected');
};

const register = (editor: Editor) => {
  editor.ui.registry.addButton('ch-toc', {
    icon: 'cherry-toc',
    tooltip: 'Table of contents',
    onAction: () => editor.execCommand('cherryInsertToc'),
    onSetup: toggleState(editor)
  });

  editor.ui.registry.addButton('ch-toc-remove', {
    icon: 'remove',
    tooltip: 'Remove',
    onAction: () => editor.execCommand('cherryRemoveToc')
  });

  editor.ui.registry.addContextToolbar('ch-toc', {
    items: 'ch-toc-remove',
    predicate: isToc(editor),
    scope: 'node',
    position: 'node'
  });
};

export {
  register
};
