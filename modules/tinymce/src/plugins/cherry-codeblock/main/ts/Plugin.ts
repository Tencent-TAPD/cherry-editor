/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import * as Commands from './api/Commands';
import * as FilterContent from './core/FilterContent';
import * as Buttons from './ui/Buttons';
import * as Dialog from './ui/Dialog';
import * as Utils from './util/Utils';

export default function () {
  PluginManager.add('cherry-codeblock', function (editor) {
    FilterContent.setup(editor);
    Buttons.register(editor);
    Commands.register(editor);

    editor.on('dblclick', function (ev) {
      if (Utils.isCodeBlock(ev.target)) {
        Dialog.open(editor);
      }
    });
  });
}
