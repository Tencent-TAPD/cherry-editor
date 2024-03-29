/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import RangeUtils from 'tinymce/core/api/dom/RangeUtils';
import Editor from 'tinymce/core/api/Editor';
import Delay from 'tinymce/core/api/util/Delay';
import { Clipboard } from '../api/Clipboard';
import * as Settings from '../api/Settings';
import { ClipboardContents } from './Clipboard';
import * as InternalHtml from './InternalHtml';
import * as Utils from './Utils';

const getCaretRangeFromEvent = function (editor: Editor, e: MouseEvent) {
  return RangeUtils.getCaretRangeFromPoint(e.clientX, e.clientY, editor.getDoc());
};

const isPlainTextFileUrl = function (content: ClipboardContents) {
  const plainTextContent = content['text/plain'];
  return plainTextContent ? plainTextContent.indexOf('file://') === 0 : false;
};

const setFocusedRange = function (editor: Editor, rng: Range) {
  editor.focus();
  editor.selection.setRng(rng);
};

const setDragTip = function (editor, clipboard, state) {
  let dragTip: HTMLElement = document.querySelector('#editor-dragtip');
  if (dragTip) {
    dragTip.style.display = 'flex';
  } else {
    dragTip = document.createElement('div');
    dragTip.id = 'editor-dragtip';
    dragTip.className = 'edit-view-left';
    dragTip.innerHTML = '将图片/视频拖动到此区域插入<a class="font font-close">关闭</a>';
    dragTip.addEventListener('click', function () {
      this.style.display = 'none';
    });
    dragTip.addEventListener('drop', function (e) {
      clipboard.pasteImageOrVideoData(e);
      this.style.display = 'none';
      state.set(false);
    });
    dragTip.addEventListener('dragleave', function() {
      this.style.display = 'none';
      state.set(false);
    });
    editor.iframeElement.parentElement.appendChild(dragTip);
  }
};

const setup = function (editor: Editor, clipboard: Clipboard, draggingInternallyState) {
  // Block all drag/drop events
  if (Settings.shouldBlockDrop(editor)) {
    editor.on('dragend dragover draggesture dragdrop drop drag', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // Prevent users from dropping data images on Gecko
  if (!Settings.shouldPasteDataImages(editor)) {
    editor.on('drop', function (e) {
      const dataTransfer = e.dataTransfer;

      if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
        e.preventDefault();
      }
    });
  }

  editor.on('drop', function (e) {
    const rng = getCaretRangeFromEvent(editor, e);

    if (e.isDefaultPrevented() || draggingInternallyState.get()) {
      return;
    }

    const dropContent = clipboard.getDataTransferItems(e.dataTransfer);
    const internal = clipboard.hasContentType(dropContent, InternalHtml.internalHtmlMime());

    if ((!clipboard.hasHtmlOrText(dropContent) || isPlainTextFileUrl(dropContent)) && clipboard.pasteImageData(e, rng)) {
      return;
    }

    if (rng && Settings.shouldFilterDrop(editor)) {
      let content = dropContent['mce-internal'] || dropContent['text/html'] || dropContent['text/plain'];

      if (content) {
        e.preventDefault();

        // FF 45 doesn't paint a caret when dragging in text in due to focus call by execCommand
        Delay.setEditorTimeout(editor, function () {
          editor.undoManager.transact(function () {
            if (dropContent['mce-internal']) {
              editor.execCommand('Delete');
            }

            setFocusedRange(editor, rng);

            content = Utils.trimHtml(content);

            if (!dropContent['text/html']) {
              clipboard.pasteText(content);
            } else {
              clipboard.pasteHtml(content, internal);
            }
          });
        });
      }
    }
  });

  editor.on('dragstart', function (_e) {
    draggingInternallyState.set(true);
  });

  editor.on('dragover dragend', function (e) {
    if (Settings.shouldPasteDataImages(editor) && draggingInternallyState.get() === false) {
      e.preventDefault();
      setFocusedRange(editor, getCaretRangeFromEvent(editor, e));
      setDragTip(editor, clipboard, draggingInternallyState);
    }

    if (e.type === 'dragend') {
      draggingInternallyState.set(false);
    }
  });
};

export {
  setup
};
