/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import grapDialogHelper from './GrapDialogHelper';

const drawioIcon = `<svg width="20px" height="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 850.394 850.394" enable-background="new 0 0 850.394 850.394" xml:space="preserve">
<g>
<g>
<path fill="#DB8736" d="M850.39,58.74v732.91c0,32.39-25.27,58.74-56.34,58.74H56.35C25.28,850.39,0,824.04,0,791.65V58.74
 C0,26.35,25.28,0,56.35,0h737.7C825.12,0,850.39,26.35,850.39,58.74z"/>
</g>
<g>
<path fill="#CA6F2E" d="M850.39,408.83v382.82c0,32.39-25.27,58.74-56.34,58.74H216.17L89.78,724l147.58-116.94l229.78-432.51
 l102.01-45.57L850.39,408.83z"/>
</g>
<path fill="#FFFFFF" d="M740.107,501.646H631.763L515.673,348.747h31.414c16.568,0,30-13.432,30-30V148.668
c0-16.568-13.432-30-30-30h-243.78c-16.568,0-30,13.432-30,30v170.079c0,16.568,13.432,30,30,30h32.887L217.442,501.646H110.286
c-16.568,0-30,13.432-30,30v170.079c0,16.568,13.432,30,30,30h243.78c16.568,0,30-13.432,30-30V531.646c0-16.568-13.432-30-30-30
h-60.653l118.752-152.899h28.173l116.09,152.899h-60.1c-16.568,0-30,13.432-30,30v170.079c0,16.568,13.432,30,30,30h243.779
c16.568,0,30-13.432,30-30V531.646C770.107,515.078,756.676,501.646,740.107,501.646z"/>
</g>
</svg>`;

export default () => {
  PluginManager.add('cherry-draw.io', function plugin(editor) {
    editor.ui.registry.addIcon('ch-draw.io', drawioIcon);
    editor.ui.registry.addButton('ch-drawio', {
      icon: 'ch-draw.io',
      tooltip: 'Draw.io',
      onAction() {
        grapDialogHelper.init(editor);
        grapDialogHelper.insertEmptyImg();
      },
      onSetup() {
        function openDrawioDialog(event) {
          if (event.target.getAttribute('data-control') === 'tapd-graph') {
            grapDialogHelper.init(editor);
            grapDialogHelper.openGrapDialog(event.target);
          }
        }
        editor.on('click', openDrawioDialog);
        return () => {};
      }
    });
  });
};
