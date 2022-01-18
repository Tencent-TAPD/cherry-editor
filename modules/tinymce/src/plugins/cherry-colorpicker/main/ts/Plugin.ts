/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import { onAction, getFetch, onItemAction, onSetup, removeMenu, getColorCols$1 } from './core/Utils';

export default () => {
  const backCmdName = 'hilitecolor';
  const textCmdName = 'forecolor';
  PluginManager.add('cherry-colorpicker', function plugin(editor) {

    document.body.addEventListener('click', removeMenu);

    editor.ui.registry.addSplitButton('ch-text-color', {
      icon: 'color-picker-text',
      tooltip: 'Text Colour',
      columns: getColorCols$1(editor),
      fetch() {
        getFetch(editor, textCmdName);
      },
      onAction(_splitButtonApi) {
        onAction(editor, textCmdName);
      },
      onItemAction(_splitButtonApi, value) {
        onItemAction(editor, _splitButtonApi, value);
      },
      // @ts-ignore
      onSetup(splitButtonApi) {
        onSetup(editor, splitButtonApi, textCmdName);
      }
    });

    editor.ui.registry.addSplitButton('ch-back-color', {
      icon: 'color-picker-back',
      tooltip: 'Background Colour',
      columns: getColorCols$1(editor),
      fetch() {
        getFetch(editor, backCmdName);
      },
      onAction(_splitButtonApi) {
        onAction(editor, backCmdName);
      },
      onItemAction(_splitButtonApi, value) {
        onItemAction(editor, _splitButtonApi, value);
      },
      // @ts-ignore
      onSetup: (splitButtonApi) => {
        onSetup(editor, splitButtonApi, backCmdName);
      }
    });

  });
};
