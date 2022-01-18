/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';

const getLanguages = (editor: Editor) => editor.getParam('codeblock_languages');
const getThemes = (editor: Editor) => editor.getParam('codeblock_themes');

const useGlobalPrismJS = (editor: Editor) => editor.getParam('codeblock_global_prismjs', false, 'boolean');

export {
  getLanguages,
  useGlobalPrismJS,
  getThemes
};
