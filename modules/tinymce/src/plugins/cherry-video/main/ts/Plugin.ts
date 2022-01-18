/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';

export default () => {
  PluginManager.add('cherry-video', function plugin(editor) {
    const videoTemplateCallback = editor.getParam('video_template_callback');
    const doUpload = function () {
      const filePickerCallback = editor.getParam('file_picker_callback');
      if (filePickerCallback) {
        filePickerCallback((data) => {
          if (data.preview_url) {
            const video = videoTemplateCallback(data);
            if(!data.loadingImg) {
              editor.insertContent(video);
            } else {
              const bookmark = editor.selection.getBookmark(2, true);
              let content = editor.getContent();
              content = content.replace(data.loadingImg, video);
              editor.setContent(content);
              editor.selection.moveToBookmark(bookmark);
            }
          }
        }, '', { filetype: 'media' });
      }
    };
    editor.ui.registry.addButton('ch-video', {
      icon: 'video',
      tooltip: 'Video',
      onAction() {
        doUpload();
      }
    });
  });
};
