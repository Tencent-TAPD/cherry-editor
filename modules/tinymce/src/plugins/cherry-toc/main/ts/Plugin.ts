/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import * as Commands from './api/Commands';
import * as Buttons from './ui/Buttons';

export default function () {
  PluginManager.add('cherry-toc', function (editor) {
    Commands.register(editor);
    Buttons.register(editor);
  });
}
