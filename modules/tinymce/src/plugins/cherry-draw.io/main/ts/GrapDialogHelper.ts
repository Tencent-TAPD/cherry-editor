/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import FULL_SCREEN_ICON from './icons/fullscreen';
import EXIT_FULL_SCREEN_ICON from './icons/exit-fullscreen';
import CLOSE_ICON from './icons/close';

const TAPD_GRAP_DIALOG_STYLES = `
    img[data-control="tapd-graph"] {
        cursor: pointer;
    }
    .tapd-grap-dialog {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .tapd-grap-dialog--fullscreen .tapd-grap-dialog__content{
        width: 100%;
        height: 100%;
    }
    .tapd-grap-dialog--fullscreen .tapd-grap-dialog__mask{
        padding-top: 0;
    }
    .tapd-grap-dialog__mask {
        width: 100%;
        height: 100%;
        padding-top: 50px;
        background-color: rgba(0, 0, 0, .1);
    }
    .tapd-grap-dialog__content {
        width: 80%;
        height: 80%;
        margin: 0 auto;
        background-color: #fff;
        opacity: 1;
        border-radius: 3px;
        border: solid 1px #aab5c1;
        -moz-box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        -webkit-box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        -o-box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .tapd-grap-dialog__head {
        padding: 0 18px;
        height: 43px;
        line-height: 43px;
        background-color: transparent;
        border-bottom: 1px solid #dfe6ee;
        border-top-right-radius: 3px;
        border-top-left-radius: 3px;
        text-align: left;
    }
    .tapd-grap-dialog__head .ch-icon:hover {
        color: #3582fb;
    }
    .tapd-grap-dialog__head-title {
        font-size: 14px;
        color: #3f4a56;
    }
    .tapd-grap-dialog__head-close,
    .tapd-grap-dialog__head-fullscreen {
        float: right;
        margin-left: 15px;
        color: #8091a5;
        font-size: 14px;
        cursor: pointer;
    }
    .tapd-grap-dialog .tapd-grap-dialog__head-close{
        line-height: 44px;
    }
    .tapd-grap-dialog__body {
        position: relative;
        height: calc(100% - 100px);
    }
    .tapd-grap-dialog__body--loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100% - 50px);
        line-height: 50px;
        color: #3f4a56;
        background-color: rgba(255, 255, 255, .5);
    }
    .tapd-grap-dialog__body--loading_icon {
        background-repeat: no-repeat;
    }
    .tapd-grap-dialog__foot {
        height: 55px;
    }
    .tapd-grap-dialog__foot-btns {
        float: right;
        margin-top: 12px;
    }
    .tapd-grap-dialog__foot-btns .foot-btn {
        display: inline-block;
        min-width: 60px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        cursor: pointer;
        text-decoration: none;
        outline: 0;
        border-radius: 2px;
        text-align: center;
        vertical-align: middle;
        font-size: 12px;
    }
    .tapd-grap-dialog__foot-btns .foot-btn__ensure {
        color: #fff;
        border: 1px solid #3582fb;
        background-color: #3582fb;
    }
    .tapd-grap-dialog__foot-btns .foot-btn__ensure:hover {
        border: 1px solid #5d9bfc;
        background-color: #5d9bfc
    }
    .tapd-grap-dialog__foot-btns .foot-btn__cancel {
        margin-right: 25px;
        color: #3582fb;
        border: 1px solid #d7e6fe;
        background-color: #fff;
    }
    .tapd-grap-dialog__foot-btns .foot-btn__cancel:hover {
        color: #5d9bfc;
        border: 1px solid #5d9bfc;
        background-color: #fff
    }

`;

const TAPD_GRAP_DIALOG = `
    <div class="tapd-grap-dialog__mask">
    <div class="tapd-grap-dialog__content">
        <div class="tapd-grap-dialog__head clearfix">
            <span class="tapd-grap-dialog__head-title">插入画图</span>
            <span class="tapd-grap-dialog__head-close j-close-dialog">${CLOSE_ICON}</span>
            <span class="tapd-grap-dialog__head-fullscreen j-set-dialog-size">${FULL_SCREEN_ICON}</span>
        </div>
        <div class="tapd-grap-dialog__body">
            <div class="tapd-grap-dialog__body--loading j-dialog-loading" style="display: block;">
               <div class="tapd-grap-dialog__body--loading_icon strip-loading2"></div>
            </div>
            <iframe style="visibility: visible;" allowtransparency="true" id="tapd-grap-dialog-iframe" src="TAPD_GRAP_URL" width="100%" frameborder="0" height="100%" loaded="true"></iframe>
        </div>
        <div class="tapd-grap-dialog__foot">
        <div class="tapd-grap-dialog__foot-btns">
            <span class="foot-btn foot-btn__ensure j-foot-btn__ensure">确定</span>
            <span class="foot-btn foot-btn__cancel j-close-dialog">取消</span>
        </div>
        </div>
    </div>
    </div>
`;

interface TapdGrapDialogHelperConstruct {
  target: HTMLElement,
}

class TapdGrapDialogHelper implements TapdGrapDialogHelperConstruct {
  public target: HTMLElement;
  public editor: Editor;
  public created: boolean;
  public dialogVisble: boolean;
  public handlers: object;
  public drawioUrl: string;
  constructor() {
    this.target = null;
    this.editor = null;
    this.created = false;
    this.dialogVisble = false;
    this.handlers = {};
    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.eventName || !this.target) {
        return;
      }
      switch (event.data.eventName) {
        case 'GET_GRAP_DATA:SUCCESS':
          this.onSure(this.encodeXml(event.data.value.xmlData), event.data.value.base64);
          break;
        case 'INIT_GRAP:SUCCESS':
          document.querySelector<HTMLElement>('.j-tapd-grap-dialog .j-dialog-loading').style.display = 'none';
          break;
        default:
          break;
      }
    }, false);
  }

  init(editor: Editor) {
    this.editor = editor;
    this.drawioUrl = editor.getParam('cherry_drawio_url', '');
  }

  onSure(xmlData, base64Data) {
    const self = this;
    const imageTarget = this.target;
    this.beforeInsertXML(xmlData, (xmlId, token = '') => {
      const imagesUploadHandler = this.editor.getParam('images_upload_handler', null);
      function success(data) {
        imageTarget.setAttribute('src', data);
        imageTarget.setAttribute('data-mce-src', data);
        imageTarget.setAttribute('data-origin-xml', xmlId);
        imageTarget.setAttribute('data-graph-oldxml', '');
        imageTarget.setAttribute('data-graph-oldsrc', '');
        imageTarget.setAttribute('data-graph-token', token);
        imageTarget.setAttribute('data-start-key', '');
        document.querySelector<HTMLElement>('.j-tapd-grap-dialog').style.display = 'none';
        self.target = null;
        self.editor.fire('closeCustomDialog');
      }
      function failed() {
        document.querySelector<HTMLElement>('.j-tapd-grap-dialog').style.display = 'none';
        // @ts-ignore
        const graphSaveFailed: Function = self.getParam('graph_save_failed', null);
        if (typeof graphSaveFailed === 'function') {
          graphSaveFailed(self.target);
        }
        self.target = null;
        self.editor.fire('closeCustomDialog');
      }
      if (imagesUploadHandler) {
        // @ts-ignore
        imagesUploadHandler({
          base64() {
            return base64Data;
          }
        }, success, failed);
      } else {
        failed();
      }
    });
  }

  openGrapDialog(item) {
    if (!item) {
      return ;
    }
    this.setDialogVisible(
      item,
      true,
      item.getAttribute('data-origin-xml'),
      item.getAttribute('data-graph-token')
    );
  }

  setDialogVisible(target, val, xml = '', token = '') {
    let fromInsert = false;
    if (this.target) {
      fromInsert = !!this.target.getAttribute('data-start-key');
      if (!val && fromInsert) {
        this.editor.dom.remove(this.target);
      }
    }
    this.dialogVisble = val;
    if (this.created) {
      this.resetDialogSize();
    }
    if (val) {
      this.target = target;
      this.createIframe(() => {
        if (xml && target) {
          this.beforeParseXML(xml, token, (originXml) => {
            this.updateGrap(originXml);
          });
        } else {
          this.updateGrap(xml);
        }
      });

      document.querySelector<HTMLElement>('.j-tapd-grap-dialog').style.display = 'block';
      document.querySelector<HTMLElement>('.j-tapd-grap-dialog .j-dialog-loading').style.display = 'block';
    } else {
      document.querySelector<HTMLElement>('.j-tapd-grap-dialog').style.display = 'none';
      if (!fromInsert && this.target.getAttribute('data-graph-oldxml')) {
        this.target.setAttribute('data-origin-xml', this.target.getAttribute('data-graph-oldxml'));
        this.target.setAttribute('src', this.target.getAttribute('data-graph-oldsrc'));
        this.target.setAttribute('data-mce-src', this.target.getAttribute('data-graph-oldsrc'));
        this.target.setAttribute('data-graph-oldxml', '');
        this.target.setAttribute('data-graph-oldsrc', '');
      }
      this.target = target;
    }
  }

  insertEmptyImg() {
    const key = this.encodeXml(this.generateRandomKey()).replace(/=/g, '');
    this.editor.insertContent(this.createEmptyGraphImg(key));
    const img = this.editor.$(`img[data-start-key="${key}"]`);
    this.openGrapDialog(img[0]);
  }

  createEmptyGraphImg(key) {
    const emptyImgPath = this.editor.getParam('graph_empty_img');
    const emptyImgXml = this.editor.getParam('graph_empty_xml');
    return `<img src="${emptyImgPath}" data-start-key="${key}" alt="tapd-graph" title="点击图片，进入图形化编辑" data-control="tapd-graph" data-origin-xml="${emptyImgXml}" data-graph-oldxml="${emptyImgXml}">`;
  }

  createIframe(cb) {
    if (this.created && document.querySelector('.j-tapd-grap-dialog')) {
      cb();
      return ;
    }
    this.created = true;

    const style = document.createElement('style');
    style.innerHTML  = TAPD_GRAP_DIALOG_STYLES;
    document.head.appendChild(style);

    const dialog = document.createElement('div');
    dialog.setAttribute('class', 'tapd-grap-dialog j-tapd-grap-dialog tapd-grap-dialog--normal');
    // @ts-ignore
    dialog.style = 'display:none;';
    dialog.innerHTML = TAPD_GRAP_DIALOG.replace('TAPD_GRAP_URL', this.drawioUrl);
    document.body.appendChild(dialog);

    this.bindEvent();
    setTimeout(() => {
      cb();
    }, 3000);
  }

  updateGrap(xml) {
    if (!this.dialogVisble) {
      return ;
    }
    // @ts-ignore
    const ifram = document.getElementById('tapd-grap-dialog-iframe').contentWindow;
    ifram.postMessage({
      eventName: 'INIT_GRAP',
      value: this.decodeXml(xml),
    }, '*');

    const oldXml = this.target.getAttribute('data-graph-oldxml');
    if (!oldXml) {
      this.target.setAttribute('data-graph-oldxml', this.target.getAttribute('data-origin-xml'));
      this.target.setAttribute('data-graph-oldsrc', this.target.getAttribute('src'));
      this.target.setAttribute('src', this.editor.getParam('graph_empty_img'));
      this.target.setAttribute('data-mce-src', this.editor.getParam('graph_empty_img'));
    }
  }

  decodeXml(xml) {
    if (xml && xml.trim().indexOf('id:') === 0) {
      return xml;
    }
    return xml ? decodeURIComponent(escape(window.atob(xml))) : null;
  }

  encodeXml(xml) {
    if (xml && xml.trim().indexOf('id:') === 0) {
      return xml;
    }
    return window.btoa(unescape(encodeURIComponent(xml)));
  }

  bindEvent() {
    if (!document.querySelector('.j-tapd-grap-dialog')) {
      return ;
    }
    document.querySelector('.j-tapd-grap-dialog .j-foot-btn__ensure').addEventListener('click', (e) => {
      this.onInsertGrap(e);
      this.editor.fire('showDialogTitle');
    });
    document.querySelectorAll('.j-tapd-grap-dialog .j-close-dialog').forEach((item) => {
      item.addEventListener('click', (e) => {
        this.editor.fire('showDialogTitle');
        this.setDialogVisible(null, false);
        this.editor.fire('closeCustomDialog');
      });
    });
    document.querySelector('.j-tapd-grap-dialog .j-set-dialog-size').addEventListener('click', (e) => {
      const dialog = document.querySelector('.j-tapd-grap-dialog');
      const { target } = e;
      const spanEl = (target as HTMLElement).closest('.j-set-dialog-size');
      const fullscreenStatus = spanEl.getAttribute('fullscreen');
      let dialogClass = '';
      if (!fullscreenStatus) {
        dialogClass = dialog.getAttribute('class').replace(/tapd-grap-dialog--normal/g, 'tapd-grap-dialog--fullscreen');
        spanEl.innerHTML = EXIT_FULL_SCREEN_ICON;
        spanEl.setAttribute('fullscreen', '1');
      } else {
        dialogClass = dialog.getAttribute('class').replace(/tapd-grap-dialog--fullscreen/g, 'tapd-grap-dialog--normal');
        spanEl.innerHTML = FULL_SCREEN_ICON;
        spanEl.setAttribute('fullscreen', '');
      }
      dialog.setAttribute('class', dialogClass);
    });
  }

  resetDialogSize() {
    const dialog = document.querySelector('.j-tapd-grap-dialog');
    let dialogClass = dialog.getAttribute('class');
    if (dialogClass.indexOf('tapd-grap-dialog--fullscreen') > -1) {
      dialogClass = dialogClass.replace(/tapd-grap-dialog--fullscreen/g, 'tapd-grap-dialog--normal');
      dialog.setAttribute('class', dialogClass);
      const fullscreenIcon = document.querySelector('.j-tapd-grap-dialog .j-set-dialog-size');
      let fullscreenIconClass = fullscreenIcon.getAttribute('class');
      fullscreenIconClass = fullscreenIconClass.replace(/font-editor-fullscreen-restore/g, 'font-editor-fullscreen');
      fullscreenIcon.setAttribute('class', fullscreenIconClass);
    }
  }

  onInsertGrap(e) {
    const ifram = (document.getElementById('tapd-grap-dialog-iframe') as HTMLIFrameElement).contentWindow;
    ifram.postMessage({
      eventName: 'GET_GRAP_DATA',
      value: '',
    }, '*');
  }

  base64ToFile(base64Data, name) {
    const bytes = window.atob(base64Data.split(',')[1]);
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    const file = new Blob([ab], { type: 'image/png' });
    // @ts-ignore
    file.lastModifiedDate = new Date();
    // @ts-ignore
    file.name = name;
    return file;
  }

  beforeInsertXML(xml, cb) {
    const beforeInsertXML = this.editor.getParam('graph_before_insert_XML', '');
    if (beforeInsertXML) {
      beforeInsertXML(xml, (id, token) => {
        if (id) {
          cb(`id:${id}`, token);
        } else {
          cb(xml);
        }
      });
      return;
    }
    cb(xml);
  }

  beforeParseXML(xml, token, cb) {
    let id = '';
    if (xml && xml.trim().indexOf('id:') === 0) {
      id = xml.trim().replace('id:', '');
    } else {
      cb(xml);
      return ;
    }
    const beforeParseXML = this.editor.getParam('graph_before_parse_XML', '');
    if (beforeParseXML) {
      beforeParseXML(id, token, (orignXML) => {
        if (orignXML) {
          cb(orignXML);
        } else {
          cb(xml);
        }
      });
      return;
    }
    cb(xml);
  }

  generateRandomKey() {
    return Math.random().toString(36);
  }

  cacheGrap(xml) {
    this.target.setAttribute('data-origin-xml', this.encodeXml(xml));
    // @ts-ignore
    this.editor.fire('keyup', this.editor);
  }
}

export default new TapdGrapDialogHelper();
