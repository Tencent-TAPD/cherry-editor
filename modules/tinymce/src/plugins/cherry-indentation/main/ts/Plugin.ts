/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import { ToolbarSplitButtonItemTypes } from '../../../../../../bridge/src/main/ts/ephox/bridge/components/toolbar/ToolbarSplitButton';

export default () => {
  PluginManager.add('cherry-indentation', function plugin(editor) {
    editor.ui.registry.addSplitButton('ch-indentation', {
      icon: 'indent',
      tooltip: 'Indentation',
      presets: 'listpreview',
      columns: 2,
      onAction() {
        return editor.execCommand('indent');
      },
      fetch(callback) {
        const items = [{
          type: 'choiceitem',
          icon: 'indent',
          value: 'indent'
        }, {
          type: 'choiceitem',
          icon: 'outdent',
          value: 'outdent'
        }] as ToolbarSplitButtonItemTypes[];
        callback(items);
      },
      onItemAction(_splitButtonApi, value) {
        if (value === 'indent') {
          return editor.execCommand('indent');
        }
        return editor.execCommand('outdent');
      },
    });
  });
};
