/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import jsBeautify from './libs/js-beautify';
import 'dompurify';
declare let CodeMirror: any;
declare let DOMPurify: any;

export default () => {
  PluginManager.add('cherry-code', function plugin(editor) {
    const addAttr = [ 'contenteditable', 'fileid', 'filetype', 'filetitle', 'fileurl', 'cm-eventflag' ];
    const setContent = function (editor, html) {
      html = DOMPurify.sanitize(html, { ALLOW_UNKNOWN_PROTOCOLS: true, ADD_ATTR: addAttr });
      editor.undoManager.transact(function () {
        editor.setContent(html);
      });
      editor.nodeChanged();
    };
    const getContent = function (editor) {
      return formatHTML(editor.getContent({ source_view: true }));
    };
    const formatHTML = function (html) {
      html = html.replace(/<!--[^>\n]*?-->/g, '');
      html = DOMPurify.sanitize(html, { ALLOW_UNKNOWN_PROTOCOLS: true, ADD_ATTR: addAttr });
      html = jsBeautify.html(html, {
        preserve_newlines: true,
        indent_inner_html: true,
      });
      const nNumbers = html.match(/\n/g) ? html.match(/\n/g).length : 0;
      if (nNumbers < 30) {
        for (let i = nNumbers; i < 30; i++) {
          html += '\n';
        }
      }
      return html;
    };

    const open = function (editor) {
      const editorContent = getContent(editor);
      const container = editor.getContainer();
      const toxPopup = document.querySelector('.tox-tinymce-aux') as HTMLElement;

      const codeToolBar = document.createElement('div');
      codeToolBar.className = 'cherry-code-toolbar tox-toolbar__primary';
      const codeBackBtn = document.createElement('a');
      codeBackBtn.className = 'j-cherry-code-back cherry-code-back';
      codeBackBtn.innerHTML = '<< 返回';
      codeToolBar.appendChild(codeBackBtn);
      const codeContainer = document.createElement('div');
      codeContainer.className = 'cherry-code-model j-cherry-code-model';
      const codemirrorContainer = document.createElement('div');
      codemirrorContainer.className = 'cherry-codemirror-container';
      const codeText = document.createElement('textarea');
      codeText.value = editorContent;
      codeText.className = 'cherry-codemirror j-cherry-codemirror';
      codemirrorContainer.appendChild(codeText);
      codeContainer.appendChild(codeToolBar);
      codeContainer.appendChild(codemirrorContainer);
      container.appendChild(codeContainer);
      container.className = container.className.replace(/tox /, 'cherry-code-model ');
      if (toxPopup) {
        toxPopup.style.display = 'none';
      }
      const codeEditor = CodeMirror.fromTextArea(codeText, {
        lineNumbers: true,     // 显示行数
        indentUnit: 4,         // 缩进单位为4
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true,   // 括号匹配
        mode: 'htmlmixed',
        lineWrapping: true,    // 自动换行
        autoFocus: true,
        theme: 'default',
        foldGutter: true,
        cursorHeight: 0.85,
        height: '200px',
        gutters: [ 'CodeMirror-linenumbers', 'CodeMirror-foldgutter' ]
      });
      codeEditor.on('change', (codemirror, evt) => {
        const newHtml = codeEditor.getValue();
        setContent(editor, newHtml);
      });
      codeBackBtn.addEventListener('click', () => {
        const newHtml = codeEditor.getValue();
        setContent(editor, newHtml);
        container.className = container.className.replace(/cherry-code-model /, 'tox ');
        const toxPopup = document.querySelector('.tox-tinymce-aux') as HTMLElement;
        if (toxPopup) {
          toxPopup.style.display = 'block';
        }
        codeContainer.remove();
      }, false);
    };

    editor.addCommand('mceCodeEditor', function () {
      open(editor);
    });
    editor.ui.registry.addButton('ch-code', {
      icon: 'sourcecode',
      tooltip: 'Source code',
      onAction() {
        return open(editor);
      }
    });
    editor.ui.registry.addMenuItem('ch-code', {
      icon: 'sourcecode',
      text: 'Source code',
      onAction() {
        return open(editor);
      }
    });
  });
};
