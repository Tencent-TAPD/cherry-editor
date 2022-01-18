/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import DOMUtils from 'tinymce/core/api/dom/DOMUtils';
import Editor from 'tinymce/core/api/Editor';
import I18n from 'tinymce/core/api/util/I18n';
import * as Guid from './Guid';

const tocId = Guid.create('chtoc_');

const getTocClass = function (editor) {
  return editor.getParam('toc_class', 'toc');
};

const readHeaders = function (editor: Editor) {
  let headers = editor.$('h1,h2,h3,h4,h5,h6');
  let idMaps = {};

  let ret = [];
  for(let i = 0; i < headers.length; i++) {
    const h = headers[i];

    if(editor.$.text(h).trim().length <= 0) {
      continue;
    }

    const id = (h as Element).id;
    let hId = id ? id : 0;
    if(!id || idMaps[id]) {
      hId = tocId();
      (h as Element).setAttribute('id', hId);
    }
    idMaps[hId] = true;
    ret.push({
      id: hId,
      level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
      title: editor.$.text(h),
      element: h
    });
  }
  return ret;
};

// 获得目录起始层级
const getStartLevel = function (headers) {
  let minLevel = 9;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].level < minLevel) {
      minLevel = headers[i].level;
    }
  }
  return minLevel > 1 ? minLevel : 1;
};

const generateTocHtml = function (editor) {
  let html = `<p class="toc-title">${DOMUtils.DOM.encode(I18n.translate('Table of Contents'))}</p>`;
  const headers = readHeaders(editor);
  
  if (!headers.length) {
    return getTocLayout(editor, html);
  }
  const startLevel = getStartLevel(headers);

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    let spaces = '';
    for(let j = 0; j < h.level - startLevel; j++) {
      spaces += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    html += `<li class="toc-li">${spaces}<a class="level-${h.level}" href="#${h.id}">${h.title}</a></li>`;
  }

  return getTocLayout(editor, html);
};

const getTocLayout = function (editor, html) {
  return `<div class="${getTocClass(editor)}" contenteditable="false">${html}</div>`;
}

const insertToc = function (editor) {
  editor.insertContent(generateTocHtml(editor)+"<p></p>");
};

const testNeedChange = function (headersString: String, headers: Object) {
  let index = 0;
  let needChange = false;
  let hasTest = false;
  headersString.replace(/<a class="level-(\d)" href="[^"]*?#(.*?)">(.*?)<\/a>/g, (all, level, id, title) => {
    const h = headers[index];
    if(!h || level != h.level || id != h.id || title != h.title) {
      needChange = true;
    }
    index ++;
    hasTest = true;
    return all;
  });
  return !hasTest || needChange || headers[index];
}

const updateToc = function (editor) {
  if(editor.tocUpdater) {
    clearTimeout(editor.tocUpdater);
  }
  editor.tocUpdater = setTimeout(()=>{
    const tocClass = getTocClass(editor);
    const $tocElms = editor.$('.' + tocClass);
    
    if($tocElms.length <= 0) {
      return '';
    }
    const newToc = generateTocHtml(editor);
    const headers = readHeaders(editor);
    for(let i = 0; i < $tocElms.length; i++) {
      const $tocElm = $tocElms[i];
      if(testNeedChange($tocElm.innerHTML, headers)) {
        editor.undoManager.ignore(()=>{
          $tocElm.outerHTML = newToc;
        });
      }
    }
  }, 100);
};

const removeToc = function(editor) {
  const currentNode = editor.selection.getNode();
  let targetDom = null;
  if (editor.dom.is(currentNode, 'div') && editor.dom.hasClass(currentNode, getTocClass(editor))) {
    targetDom = currentNode;
  } else {
    const parentDom = editor.dom.getParent(currentNode, `div.${getTocClass(editor)}`);
    if (parentDom) {
      targetDom = parentDom;
    }
  }
  if (!targetDom || !editor.dom.hasClass(targetDom, getTocClass(editor))) {
    return false;
  }
  editor.dom.remove(targetDom);
  editor.nodeChanged();
};

export {
  insertToc,
  updateToc,
  removeToc
};
