/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import { ToolbarSplitButtonItemTypes } from '../../../../../../bridge/src/main/ts/ephox/bridge/components/toolbar/ToolbarSplitButton';

export default () => {
  PluginManager.add('cherry-alignment', (editor) => {
    editor.ui.registry.addSplitButton('ch-alignment', {
      icon: 'align-left',
      tooltip: 'Alignment',
      presets: 'listpreview',
      columns: 3,
      onAction() {
        return editor.execCommand('JustifyLeft');
      },
      fetch(callback) {
        const items = [{
          type: 'choiceitem',
          icon: 'align-left',
          value: 'alignleft'
        }, {
          type: 'choiceitem',
          icon: 'align-center',
          value: 'aligncenter'
        }, {
          type: 'choiceitem',
          icon: 'align-right',
          value: 'alignright'
        }] as ToolbarSplitButtonItemTypes[];
        callback(items);
      },
      onItemAction(_splitButtonApi, value) {
        if (value === 'alignleft') {
          return editor.execCommand('JustifyLeft');
        } if (value === 'aligncenter') {
          return editor.execCommand('JustifyCenter');
        }
        return editor.execCommand('JustifyRight');
      }
    });
  });
};
