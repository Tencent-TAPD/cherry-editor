/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

declare let tinymce: any;

export default function () {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = '<p>Cherry</p>';

  textarea.classList.add('tinymce');
  document.querySelector('#ephox-ui').appendChild(textarea);

  tinymce.init({
    height: 800,
    menubar: false,
    statusbar: false,
    base_url: '../../../../js/cherry/',
    selector: 'textarea.tinymce',
    auto_focus: false,
    skip_focus: true,
    plugins: [
        'quickbars',
        'link',
        'image',
        'imagetools',
        'lists',
        'advlist',
        'table',
        'fullscreen',
        'paste',
        'anchor',
        'media',
        'advlist',

        'cherry-draw.io',
        'cherry-mindmap',
        'cherry-app',
        'cherry-alignment',
        'cherry-blockquotefix',
        'cherry-floatbar-extand',
        'cherry-lineheight',
        'cherry-word',
        'cherry-video',
        'cherry-splitline',
        'cherry-number-headings',
        'cherry-indentation',
        'cherry-colorpicker',
        'cherry-checklist',
        'cherry-panel',
        'cherry-tencent-docs',
        'cherry-table',
        'cherry-code',
        'cherry-toc',
        'cherry-codeblock',
    ],

    toolbar1: 'fontselect fontsizeselect formatselect ch-number-headings | ch-alignment ch-indentation ch-lineheight | bold italic underline strikethrough | ch-text-color ch-back-color removeformat | numlist bullist ch-checklist | ch-table image ch-video ch-panel emoji cherry-codeblock link | ch-tencent-docs ch-drawio ch-splitline blockquote ch-word| ch-code fullscreen',

    toolbar_mode: 'floating',
    quickbars_insert_toolbar: false,
    table_toolbar: 'mytableprops tabledelete | tablemergecells tablesplitcells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
    panelblock_toolbar: 'cherry-panel__tips cherry-panel__info cherry-panel__ok cherry-panel__warning cherry-panel__error | cherry-panel__delete',
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    valid_children: '+pre[ol],+a[i|#text],+body[style]',
    block_formats: 'Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;Paragraph=p',
    body_class: 'cherry-editor-content',
    setup(ed) {
      ed.ui.registry.addButton('demoButton', {
        text: 'Demo',
        onAction() {
          ed.insertContent('Hello world!');
        }
      });
    },
    cherry_drawio_url: "",
  });
}
