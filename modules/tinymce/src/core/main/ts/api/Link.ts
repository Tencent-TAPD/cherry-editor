/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from './Editor';

const afterInsertLink = (editor: Editor, parentHtml: Element) => {
  if (parentHtml.querySelectorAll('a:not([data-link-mode="unLinkMode"])').length > 0) {
    editor.fire('initLink', parentHtml);
  }
};

export {
  afterInsertLink
};
