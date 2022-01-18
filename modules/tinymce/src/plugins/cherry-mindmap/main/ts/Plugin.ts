/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import mindmapDialogHelper from './MindmapDialogHelper';

const mindmapIcon = `<svg width="20px" height="20px" version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 850.394 850.394" enable-background="new 0 0 850.394 850.394" xml:space="preserve">
     <g transform="scale(0.9)">
        <path fill="#2aa3ab"  d="M883 940h-765q-24 0 -41 -16.5t-17 -40.5v-765q0 -24 17 -41t41 -17h765q24 0 40.5 17t16.5 41v765q0 24 -16.5 40.5t-40.5 16.5zM882 118h-764v764h764v-764zM256 213q25 0 42 17t17 41q0 8 -2 15l84 71q29 -21 65 -21q18 0 35 5l49 -78q-9 -15 -9 -32q0 -24 17 -41
        t41.5 -17t41.5 17t17 41t-17 41.5t-42 17.5l-6 -1l-50 79q23 23 29 54l124 4q8 -15 21.5 -23.5t30.5 -8.5q24 0 41 17t17 41t-17 41t-41 17q-17 0 -31.5 -9.5t-21.5 -24.5l-124 -4q-7 24 -23 42.5t-39 28.5l24 136q27 4 45 25t18 49q0 31 -22 53t-53 22t-53 -22t-22 -53
        q0 -21 10.5 -38.5t27.5 -26.5l-24 -136q-29 -2 -54 -18l-65 62q3 8 3 18q0 24 -17.5 41t-41.5 17t-41 -17t-17 -41.5t17 -41.5t41 -17q11 0 22 4l65 -61q-14 -25 -14 -54q0 -26 11 -49l-84 -71q-12 5 -25 5q-24 0 -41 -17t-17 -41t17 -41t41 -17z"/>
     </g>
</svg>`;

export default () => {
  PluginManager.add('cherry-mindmap', function plugin(editor) {
    editor.ui.registry.addIcon('ch-mindmap', mindmapIcon);
    editor.ui.registry.addButton('ch-mindmap', {
      icon: 'ch-mindmap',
      tooltip: 'CherryMindmap',
      onAction() {
        mindmapDialogHelper.init(editor);
        mindmapDialogHelper.insertEmptyImg();
      },
      onSetup() {
        function openMindmapDialog(event) {
          if (event.target.getAttribute('data-control') === 'cherry-mindmap') {
            mindmapDialogHelper.init(editor);
            mindmapDialogHelper.openMindmapDialog(event.target);
          }
        }
        editor.on('click', openMindmapDialog);
        return () => {};
      }
    });
  });
};
