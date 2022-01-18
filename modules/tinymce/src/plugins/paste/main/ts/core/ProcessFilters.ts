/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import DomParser from 'tinymce/core/api/html/DomParser';
import HtmlSerializer from 'tinymce/core/api/html/Serializer';
import Tools from 'tinymce/core/api/util/Tools';
import * as Events from '../api/Events';
import * as Settings from '../api/Settings';
import * as WordFilter from './WordFilter';

const preProcess = (editor: Editor, html: string) => {
  const parser = DomParser({ }, editor.schema);

  // Strip meta elements
  parser.addNodeFilter('meta', (nodes) => {
    Tools.each(nodes, (node) => {
      node.remove();
    });
  });

  parser.addNodeFilter('#text', (nodes) => {
    // @ts-ignore
    Tools.each(nodes, (node) => {
      if (node.parent.name === 'style') {
        node.value = node.value.replace(/text-indent/g, 'original-text-indent');
      }
      return node;
    });
  });

  const fragment = parser.parse(html, { forced_root_block: false, isRootContent: true });
  return HtmlSerializer({ validate: Settings.getValidate(editor) }, editor.schema).serialize(fragment);
};

const processResult = function (content: string, cancelled: boolean) {
  return { content, cancelled };
};

const postProcessFilter = function (editor: Editor, html: string, internal: boolean, isWordHtml: boolean) {
  const tempBody = editor.dom.create('div', { style: 'display:none' }, html);
  const postProcessArgs = Events.firePastePostProcess(editor, tempBody, internal, isWordHtml);
  return processResult(postProcessArgs.node.innerHTML, postProcessArgs.isDefaultPrevented());
};

const filterContent = function (editor: Editor, content: string, internal: boolean, isWordHtml: boolean) {
  const preProcessArgs = Events.firePastePreProcess(editor, content, internal, isWordHtml);

  // Filter the content to remove potentially dangerous content (eg scripts)
  const filteredContent = preProcess(editor, preProcessArgs.content);

  if (editor.hasEventListeners('PastePostProcess') && !preProcessArgs.isDefaultPrevented()) {
    return postProcessFilter(editor, filteredContent, internal, isWordHtml);
  } else {
    return processResult(filteredContent, preProcessArgs.isDefaultPrevented());
  }
};

const process = function (editor: Editor, html: string, internal: boolean) {
  const isWordHtml = WordFilter.isWordContent(html);
  let content = isWordHtml ? WordFilter.preProcess(editor, html) : html;
  // cherry-customized--start
  // 处理Excel中的对齐
  const alignCenterClass = (content.match(/^\.\w+\s*\{[^}]*text-align:center;/img) || []).map(function(res) {
    return res.match(/^\.(\w+)\s*\{/)[1];
  });
  const alignRightClass = (content.match(/^\.\w+\s*\{[^}]*text-align:right;/img) || []).map(function(res) {
    return res.match(/^\.(\w+)\s*\{/)[1];
  });
  content = content.replace(/class=\w+[^>]*style='/ig, function(res) {
    const className = res.match(/class=(\w+)/i)[1];
    if (alignCenterClass.indexOf(className) !== -1) {
      return `${res}text-align:center;`;
    } if (alignRightClass.indexOf(className) !== -1) {
      return `${res}text-align:right;`;
    }
    return res;
  });
  // 处理Excel中的加粗
  const borderClass = (content.match(/^\.\w+\s*\{[^}]*font-weight:700;/img) || []).map(function(res) {
    return res.match(/^\.(\w+)\s*\{/)[1];
  });
  content = content.replace(/font-weight:700;/ig, '').replace(/class=(\w+)[^>]*>[^<]*</ig, function(res) {
    const className = res.match(/class=(\w+)/i)[1];
    if (borderClass.indexOf(className) !== -1) {
      return res.replace(/>([^<]*)</, '><strong>$1</strong><');
    }
    return res;
  });
  // 处理pt导致Table放缩出错
  content = content.replace(/:\s*[\d.]+pt/ig, function(res) {
    const ptVal = res.match(/:\s*([\d.]+)pt/i)[1];
    return `:${(Number(ptVal) * 1.33).toFixed(2)}px`;
  });
  // 外层节点有固定高度时，部分内容展示不出来
  content = content.replace(/<(div|p)\s[\s\S]*style="[\s\S]*([^-]height\s*:[^;]*)[^"]*"\>/ig, function(res) {
    return res.replace(/[^-](height\s*:[^;]*);/g, '');
  });
  // cherry-customized--end

  return filterContent(editor, content, internal, isWordHtml);
};

export {
  process
};
