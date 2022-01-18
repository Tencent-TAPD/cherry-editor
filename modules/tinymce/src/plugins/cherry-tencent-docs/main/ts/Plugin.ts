/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import Editor from 'tinymce/core/api/Editor';
import { NestedMenuItemContents } from '../../../../../../bridge/src/main/ts/ephox/bridge/components/menu/NestedMenuItem';

import docIcon from './icons/doc_icon';
import excelIcon from './icons/excel_icon';
import pptIcon from './icons/ppt_icon';
import tencentDocLogo from './icons/tencent_doc_logo';

function composedPath(event) {
  if (event.path) {
    return event.path;
  }
  try {
    return event.composedPath();
  } catch (e) {
    const path = [];
    let el = event.target;
    while (el) {
      path.push(el);
      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);
        return path;
      }
      el = el.parentElement;
    }
    return path;
  }
}

export default () => {
  PluginManager.add('cherry-tencent-docs', function plugin(editor: Editor) {
    editor.ui.registry.addIcon('tencent_doc_doc_icon', docIcon);
    editor.ui.registry.addIcon('tencent_doc_excel_icon', excelIcon);
    editor.ui.registry.addIcon('tencent_doc_ppt_icon', pptIcon);
    editor.ui.registry.addIcon('tencent_doc_logo', tencentDocLogo);

    editor.ui.registry.addMenuButton('ch-tencent-docs', {
      icon: 'tencent_doc_logo',
      tooltip: 'Tencent Doc',
      fetch(callback) {
        const items = [{
          icon: 'tencent_doc_logo',
          type: 'togglemenuitem',
          text: 'Insert Tencent Doc',
          onAction() {
            editor.fire('createTencentMyDocDialogEvent', { editor });
          }
        }, {
          icon: 'tencent_doc_doc_icon',
          type: 'togglemenuitem',
          text: 'New Online Doc',
          onAction() {
            editor.fire('createTencentDocDialogEvent', { editor });
          }
        }, {
          icon: 'tencent_doc_excel_icon',
          type: 'togglemenuitem',
          text: 'New Online Sheet',
          onAction() {
            editor.fire('createTencentSheetDialogEvent', { editor });
          }
        }, {
          icon: 'tencent_doc_ppt_icon',
          type: 'togglemenuitem',
          text: 'New Online Slide',
          onAction() {
            editor.fire('createTencentSlideDialogEvent', { editor });
          }
        }] as NestedMenuItemContents[];
        callback(items);
      }
    });
    editor.on('click', function (event) {
      const value = (function getCherryModuleEventInfo(event) {
        let fileid = '';
        let filetype = '';
        let filetitle = '';
        let fileurl = '';
        let eventflag = '';
        const path = composedPath(event);

        for (let index = path.length - 1; index >= 0; index--) {
          const element = path[index];
          if (!element.getAttribute) {
            continue;
          }
          if (element.getAttribute('fileid')) {
            fileid = element.getAttribute('fileid');
          }
          if (element.getAttribute('filetype')) {
            filetype = element.getAttribute('filetype');
          }
          if (element.getAttribute('filetitle')) {
            filetitle = element.getAttribute('filetitle');
          }
          if (element.getAttribute('fileurl')) {
            fileurl = element.getAttribute('fileurl');
          }
          if (element.getAttribute('cm-eventflag')) {
            eventflag = element.getAttribute('cm-eventflag');
          }
        }
        return {
          fileid,
          filetype,
          filetitle,
          fileurl,
          eventflag,
        };
      }(event));
      if (value.eventflag === 'editTxDoc') {
        editor.fire('editTencentDocDialogEvent', { editor, id: value.fileid, type: value.filetype, title: value.filetitle });
      }
      if (value.eventflag === 'deleteTxDoc') {
        editor.fire('deleteTencentDocDialogEvent', { editor, id: value.fileid });
      }
    });
    editor.on('mouseover', function (event) {
      const path = composedPath(event);

      for (let index = path.length - 1; index >= 0; index--) {
        const element = path[index];
        if (!element.getAttribute) {
          continue;
        }
        if (element.getAttribute('class') === 'edit-btn-icon') {
          element.setAttribute('fill', '#5d9bfc');
        }
        if (element.getAttribute('class') === 'remove-btn-icon') {
          element.setAttribute('fill', '#5d9bfc');
        }
      }
    });
    editor.on('mouseout', function (event) {
      const path = composedPath(event);

      for (let index = path.length - 1; index >= 0; index--) {
        const element = path[index];
        if (!element.getAttribute) {
          continue;
        }
        if (element.getAttribute('class') === 'edit-btn-icon') {
          element.setAttribute('fill', '#8091a5');
        }
        if (element.getAttribute('class') === 'remove-btn-icon') {
          element.setAttribute('fill', '#8091a5');
        }
      }
    });
  });
};
