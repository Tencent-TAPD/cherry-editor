/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';

export default () => {
  PluginManager.add('cherry-splitline', function plugin(editor) {
    editor.ui.registry.addButton('ch-splitline', {
      icon: 'splitline',
      tooltip: 'Split Line',
      onAction() {
        editor.insertContent('<div><hr></div>');
      },
    });
  });
};
