/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
// import { isFigure, isImage } from '../core/ImageData';
// import * as Utils from '../core/Utils';
// import { Dialog } from './Dialog';

const register = (editor: Editor) => {
  // editor.ui.registry.addToggleButton('image', {
  //   icon: 'image',
  //   tooltip: 'Insert/edit image',
  //   onAction: Dialog(editor).open,
  //   onSetup: (buttonApi) => editor.selection.selectorChangedWithUnbind('img:not([data-mce-object],[data-mce-placeholder]),figure.image', buttonApi.setActive).unbind
  // });

  // editor.ui.registry.addMenuItem('image', {
  //   icon: 'image',
  //   text: 'Image...',
  //   onAction: Dialog(editor).open
  // });

  // editor.ui.registry.addContextMenu('image', {
  //   update: (element): string[] => isFigure(element) || (isImage(element) && !Utils.isPlaceholderImage(element)) ? [ 'image' ] : []
  // });

  const doUpload = function () {
    const filePickerCallback = editor.getParam('file_picker_callback');
    if (filePickerCallback) {
      filePickerCallback(function (url) {
        if (url) {
          const { clientWidth } = editor.editorContainer;
          const dom = document.createElement('img');
          dom.src = url;
          dom['data-mce-src'] = url;
          dom.onload = function() {
            if (dom.width > clientWidth * 0.8) {
              dom.style.width = '80%';
            }
            editor.insertContent(dom.outerHTML);
          };
          dom.onerror = function() {
            editor.insertContent(dom.outerHTML);
          };
        }
      }, '', { filetype: 'image' });
    }
  };
  let uuid = 0;
  const doInputUrl = function() {
    const uid = (uuid += 1);
    const innerHTML = '<input type="text" id="imageUrl" class="network-image-'+ uid + '" placeholder="http://">'
                    + '<p class="plugin_image--text">无访问权限的图片可能导致无法显示。</p>';

    editor.windowManager.open({
      title: '图片地址',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: innerHTML
          }
        ]
      },
      buttons: [{
        primary: true,
        type: 'submit',
        text: '确认'
      }, {
        type: 'cancel',
        text: '取消'
      }],
      onSubmit() {
        const img = document.querySelector<HTMLInputElement>(`.network-image-${uid}`);
        const url = !!img ? img.value : '';
        const { clientWidth } = editor.editorContainer;
        const dom = document.createElement('img');
        dom.src = url;
        dom['data-mce-src'] = url;
        dom.onload = function() {
          if (dom.width > clientWidth * 0.8) {
            dom.style.width = '80%';
          }
          editor.insertContent(dom.outerHTML);
          editor.windowManager.close();
        };
        dom.onerror = function() {
          editor.insertContent(dom.outerHTML);
          editor.windowManager.close();
        };
      },
      onCancel(api) {
        setTimeout(api.close, 0);
      },
    });
  };
  editor.ui.registry.addMenuButton('image', {
    icon: 'image',
    tooltip: 'Insert image',
    fetch(callback) {
      callback([{
        type: 'togglemenuitem',
        text: '本地上传',
        onAction() {
          doUpload();
        }
      }, {
        type: 'togglemenuitem',
        text: '网络图片',
        onAction() {
          doInputUrl();
        }
      }]);
    },
    onSetup (buttonApi) {
      return editor.selection.selectorChangedWithUnbind('img:not([data-mce-object],[data-mce-placeholder]),figure.image', buttonApi.setActive).unbind;
    }
  });

};

export {
  register
};
