/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import * as Toc from '../core/Toc';

const register = function (editor) {
  editor.addCommand('cherryInsertToc', function () {
    Toc.insertToc(editor);
  });

  editor.addCommand('cherryUpdateToc', function () {
    Toc.updateToc(editor);
  });

  editor.addCommand('cherryRemoveToc', function () {
    Toc.removeToc(editor);
  });
};

export {
  register
};
