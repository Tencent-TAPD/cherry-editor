/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
// import * as LinkTool from 'tinymce/core/api/Link';

export default () => {
  PluginManager.add('cherry-floatbar-extand', function plugin(editor) {
    // 暂时在表格里面先屏蔽这个文字操作框，后面需要按需显示
    const isEditable = node => editor.dom.getContentEditableParent(node) !== 'false';
    const isImage = node => {
      return node.nodeName === 'IMG' || (node.nodeName === 'FIGURE' && /image/i.test(node.className));
    };
    const inTable = (node) => {
      let parent = node.parentNode;
      while (parent && parent.tagName !== 'TABLE') {
        parent = parent.parentNode;
      }
      return parent && parent.tagName === 'TABLE';
    };
    const isLink = (node) => {
      const isA = node && node.nodeName.toLowerCase() === 'a';
      const hasHref = node && node.getAttribute('href');
      return isA && !!hasHref;
    };
    const isHr = (node) => node.nodeName === 'HR';
    editor.ui.registry.addContextToolbar('textselection', {
      predicate: (node) => !isImage(node)
        && !editor.selection.isCollapsed()
        && isEditable(node)
        && !inTable(node)
        && !isHr(node)
        && !(isLink(node)),
      items: editor.getParam('quickbars_selection_toolbar', 'bold italic | quicklink h2 h3 blockquote'),
      position: 'selection',
      scope: 'editor'
    });
  });
};
