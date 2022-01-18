/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';

export default () => {
  PluginManager.add('cherry-word', function plugin(editor) {
    editor.ui.registry.addToggleButton('ch-word', {
      tooltip: 'Word',
      icon: 'word',
      onAction() {
        const filePickerCallback = editor.getParam('file_picker_callback');
        if (filePickerCallback) {
          filePickerCallback((data) => {
            const res = data.match(/<body>([\S\s]*)<\/body>/);
            if (res) {
              const dom = document.createElement('div');
              dom.innerHTML = res[1];
              editor.insertContent(dom.outerHTML);
            }
          }, '', { filetype: 'word' });
        }
      }
    });
  });
};
