/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';

export default () => {
  PluginManager.add('cherry-lineheight', function plugin(editor) {
    const lineheightVal = editor.getParam('lineheight_val', '1 1.5 1.6 1.75 1.8 2 3');
    editor.on('init', () => {
      editor.formatter.register({
        lineheight: {
          selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table',
          styles: { 'line-height': '%value' }
        }
      });
    });
    const doAct = function (value) {
      editor.formatter.apply('lineheight', { value });
      editor.fire('change', {});
    };
    editor.ui.registry.addMenuButton('ch-lineheight', {
      icon: 'lineheight',
      tooltip: 'Line Spacing',
      fetch(callback) {
        // @ts-ignore
        const { dom } = editor;
        const blocks = editor.selection.getSelectedBlocks();
        let lhv: string|number = 0;
        let isSetDefaultLhv = true;
        Array.prototype.forEach.call(blocks, (block) => {
          if (lhv === 0) {
            lhv = (dom.getStyle(block, 'line-height') || dom.getStyle(block.parentNode, 'line-height'))
              ? (dom.getStyle(block, 'line-height') || dom.getStyle(block.parentNode, 'line-height')) : 0;
          }
        })

        const items = lineheightVal.split(' ').map((item) => {
          const text = item;
          const value = item;
          if (lhv) {
            isSetDefaultLhv = false;
          }
          return {
            type: 'togglemenuitem',
            text,
            active: lhv == value,
            onAction() {
              doAct(value);
            }
          };
        });
        if (isSetDefaultLhv) {
          const lineheightDefaultVal = editor.getParam('lineheight_default_value', '1');
          items.find(item => item.text == lineheightDefaultVal).active = true;
        }
        callback(items);
      }
    });
  });
};
