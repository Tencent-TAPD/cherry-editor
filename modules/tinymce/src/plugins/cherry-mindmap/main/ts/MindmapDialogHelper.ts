/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';

const CHERRY_MINDMAP_DIALOG = `
    <div class="cherry-mindmap-dialog__mask">
    <div class="cherry-mindmap-dialog__content">
        <div class="cherry-mindmap-dialog__head clearfix">
            <span class="cherry-mindmap-dialog__head-title">插入思维导图</span>
            <span class="cherry-mindmap-dialog__head-close ico-dialog-close j-close-dialog"></span>
            <span class="cherry-mindmap-dialog__head-fullscreen font-editor font-editor-fullscreen j-set-dialog-size"></span>
        </div>
        <div class="cherry-mindmap-dialog__body">
            <div class="cherry-mindmap-dialog__body--loading j-dialog-loading" style="display: block;">
               <div class="cherry-mindmap-dialog__body--loading_icon strip-loading2"></div>
            </div>
            <iframe style="visibility: visible;" allowtransparency="true" id="cherry-mindmap-dialog-iframe" src="CHERRY_MINDMAP_URL" width="100%" frameborder="0" height="100%" loaded="true"></iframe>
        </div>
        <div class="cherry-mindmap-dialog__foot">
        <div class="cherry-mindmap-dialog__foot-btns">
            <span class="foot-btn foot-btn__ensure j-foot-btn__ensure">确定</span>
            <span class="foot-btn foot-btn__cancel j-close-dialog">取消</span>
        </div>
        </div>
    </div>
    </div>
`;

interface CherryMindmapDialogHelperConstruct {
  target: HTMLElement;
}

class CherryMindmapDialogHelper implements CherryMindmapDialogHelperConstruct {
  public target: HTMLElement;
  public editor: Editor;
  public created: boolean;
  public dialogVisble: boolean;
  public handlers: object;
  public mindmapUrl: string;
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
      document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog .j-dialog-loading').style.display = 'none';
      switch (event.data.eventName) {
        case 'GET_MINDMAP_DATA:SUCCESS':
          this.onSure(this.encodeJSON(event.data.value.jsonData), event.data.value.base64Data, event.data.value.imageInfo);
          break;
        default:
          break;
      }
    }, false);
  }

  init(editor: Editor) {
    this.editor = editor;
    this.mindmapUrl = editor.getParam('cherry_mindmap_url', '');
  }

  public onSure(jsonData, base64Data, imageInfo: { width?: number } = {}) {
    const self = this;
    const imageTarget = this.target;
    this.beforeInsertJSON(jsonData, (id, token = '') => {
      const imagesUploadHandler = this.editor.getParam('images_upload_handler', null);
      function success(data) {
        imageTarget.setAttribute('src', data);
        imageTarget.setAttribute('data-mce-src', data);
        imageTarget.setAttribute('data-mindmap-json', id);
        imageTarget.setAttribute('data-mindmap-oldjson', '');
        imageTarget.setAttribute('data-mindmap-oldsrc', '');
        imageTarget.setAttribute('data-mindmap-token', token);
        imageTarget.setAttribute('data-start-key', '');
        if (imageInfo.width) {
          imageTarget.setAttribute('width', `${imageInfo.width}`);
        }
        document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog').style.display = 'none';
        self.target = null;
        self.editor.fire('closeCustomDialog');
      }
      function failed() {
        document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog').style.display = 'none';
        // @ts-ignore
        const mindmapSaveFailed: Function = self.getParam('mindmap_save_failed', null);
        if (typeof mindmapSaveFailed === 'function') {
          mindmapSaveFailed(self.target);
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

  openMindmapDialog(item) {
    if (!item) {
      return ;
    }
    this.setDialogVisible(
      item,
      true,
      item.getAttribute('data-mindmap-json'),
      item.getAttribute('data-mindmap-token')
    );
  }

  setDialogVisible(target, val, json = '', token = '') {
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
        if (json && target) {
          this.beforeParseJSON(json, token, (originJSON) => {
            this.updateMindmap(originJSON);
          });
        } else {
          this.updateMindmap(json);
        }
      });

      document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog').style.display = 'block';
      document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog .j-dialog-loading').style.display = 'block';
    } else {
      document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog').style.display = 'none';
      if (!fromInsert && this.target.getAttribute('data-mindmap-oldjson')) {
        this.target.setAttribute('data-mindmap-json', this.target.getAttribute('data-mindmap-oldjson'));
        this.target.setAttribute('src', this.target.getAttribute('data-mindmap-oldsrc'));
        this.target.setAttribute('data-mce-src', this.target.getAttribute('data-mindmap-oldsrc'));
        this.target.setAttribute('data-mindmap-oldjson', '');
        this.target.setAttribute('data-mindmap-oldsrc', '');
      }
      this.target = target;
    }
  }

  insertEmptyImg() {
    const key = this.encodeJSON(this.generateRandomKey()).replace(/=/g, '');
    this.editor.insertContent(this.createEmptyMindmaphImg(key));
    const img = this.editor.$(`img[data-start-key="${key}"]`);
    this.openMindmapDialog(img[0]);
  }

  createEmptyMindmaphImg(key) {
    const emptyImgPath = this.editor.getParam('mindmap_empty_img');
    const emptyImgJSON = this.editor.getParam('mindmap_empty_json');
    return `<img src="${emptyImgPath}" data-start-key="${key}" alt="cherry-mindmap" title="点击图片，进入思维导图编辑" data-control="cherry-mindmap" data-mindmap-json="${emptyImgJSON}" data-mindmap-oldjson="${emptyImgJSON}">`;
  }

  createIframe(cb) {
    if (this.created && document.querySelector('.j-cherry-mindmap-dialog')) {
      cb();
      // @ts-ignore
      document.querySelector('#cherry-mindmap-dialog-iframe').focus();
      return ;
    }
    this.created = true;

    const dialog = document.createElement('div');
    dialog.setAttribute('class', 'cherry-mindmap-dialog j-cherry-mindmap-dialog cherry-mindmap-dialog--normal');
    // @ts-ignore
    dialog.style = 'display:none;';
    dialog.innerHTML = CHERRY_MINDMAP_DIALOG.replace('CHERRY_MINDMAP_URL', this.mindmapUrl);
    document.body.appendChild(dialog);

    this.bindEvent();
    setTimeout(() => {
      cb();
      // @ts-ignore
      dialog.querySelector('#cherry-mindmap-dialog-iframe').focus();
    }, 3000);
  }

  updateMindmap(json) {
    if (!this.dialogVisble) {
      return ;
    }
    // @ts-ignore
    const ifram = document.getElementById('cherry-mindmap-dialog-iframe').contentWindow;
    ifram.postMessage({
      eventName: 'INIT_MINDMAP',
      value: this.decodeJSON(json),
    }, '*');

    const oldJSON = this.target.getAttribute('data-mindmap-oldjson');
    if (!oldJSON) {
      this.target.setAttribute('data-mindmap-oldjson', this.target.getAttribute('data-mindmap-json'));
      this.target.setAttribute('data-mindmap-oldsrc', this.target.getAttribute('src'));
      this.target.setAttribute('src', this.editor.getParam('mindmap_empty_img'));
      this.target.setAttribute('data-mce-src', this.editor.getParam('mindmap_empty_img'));
    }
  }

  decodeJSON(json) {
    if (json && json.trim().indexOf('id:') === 0) {
      return json;
    }
    return json ? decodeURIComponent(escape(window.atob(json))) : null;
  }

  encodeJSON(json) {
    if (json && json.trim().indexOf('id:') === 0) {
      return json;
    }
    return window.btoa(unescape(encodeURIComponent(json)));
  }

  bindEvent() {
    if (!document.querySelector('.j-cherry-mindmap-dialog')) {
      return ;
    }
    document.querySelector('.j-cherry-mindmap-dialog .j-foot-btn__ensure').addEventListener('click', (e) => {
      this.onInsertMindmap(e);
      this.editor.fire('showDialogTitle');
    });
    document.querySelectorAll('.j-cherry-mindmap-dialog .j-close-dialog').forEach((item) => {
      item.addEventListener('click', (e) => {
        this.editor.fire('showDialogTitle');
        this.setDialogVisible(null, false);
        this.editor.fire('closeCustomDialog');
      });
    });
    document.querySelector('.j-cherry-mindmap-dialog .j-set-dialog-size').addEventListener('click', (e) => {
      const dialog = document.querySelector('.j-cherry-mindmap-dialog');
      const { target } = e;
      let targetClass = (target as HTMLElement).getAttribute('class');
      let dialogClass = '';
      if (targetClass.indexOf('font-editor-fullscreen-restore') < 0) {
        dialogClass = dialog.getAttribute('class').replace(/cherry-mindmap-dialog--normal/g, 'cherry-mindmap-dialog--fullscreen');
        targetClass = targetClass.replace(/font-editor-fullscreen/g, 'font-editor-fullscreen-restore');
      } else {
        dialogClass = dialog.getAttribute('class').replace(/cherry-mindmap-dialog--fullscreen/g, 'cherry-mindmap-dialog--normal');
        targetClass = targetClass.replace(/font-editor-fullscreen-restore/g, 'font-editor-fullscreen');
      }
      dialog.setAttribute('class', dialogClass);
      (target as HTMLElement).setAttribute('class', targetClass);
    });
  }

  resetDialogSize() {
    const dialog = document.querySelector('.j-cherry-mindmap-dialog');
    let dialogClass = dialog.getAttribute('class');
    if (dialogClass.indexOf('cherry-mindmap-dialog--fullscreen') > -1) {
      dialogClass = dialogClass.replace(/cherry-mindmap-dialog--fullscreen/g, 'cherry-mindmap-dialog--normal');
      dialog.setAttribute('class', dialogClass);
      const fullscreenIcon = document.querySelector('.j-cherry-mindmap-dialog .j-set-dialog-size');
      let fullscreenIconClass = fullscreenIcon.getAttribute('class');
      fullscreenIconClass = fullscreenIconClass.replace(/font-editor-fullscreen-restore/g, 'font-editor-fullscreen');
      fullscreenIcon.setAttribute('class', fullscreenIconClass);
    }
  }

  onInsertMindmap(e) {
    const ifram = (document.getElementById('cherry-mindmap-dialog-iframe') as HTMLIFrameElement).contentWindow;
    ifram.postMessage({
      eventName: 'GET_MINDMAP_DATA',
      value: '',
    }, '*');
    document.querySelector<HTMLElement>('.j-cherry-mindmap-dialog .j-dialog-loading').style.display = 'block';
  }

  base64ToFile(base64Data, name) {
    const bytes = window.atob(base64Data.split(',')[1]);
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    const file = new Blob([ ab ], { type: 'image/png' });
    // @ts-ignore
    file.lastModifiedDate = new Date();
    // @ts-ignore
    file.name = name;
    return file;
  }

  beforeInsertJSON(json, cb) {
    const beforeInsertJSON = this.editor.getParam('mindmap_before_insert_json', '');
    if (beforeInsertJSON) {
      beforeInsertJSON(json, (id, token) => {
        if (id) {
          cb(`id:${id}`, token);
        } else {
          cb(json);
        }
      });
      return;
    }
    cb(json);
  }

  beforeParseJSON(json, token, cb) {
    let id = '';
    if (json && json.trim().indexOf('id:') === 0) {
      id = json.trim().replace('id:', '');
    } else {
      cb(json);
      return ;
    }
    const beforeParseJSON = this.editor.getParam('mindmap_before_parse_json', '');
    if (beforeParseJSON) {
      beforeParseJSON(id, token, (orignJSON) => {
        if (orignJSON) {
          cb(orignJSON);
        } else {
          cb(json);
        }
      });
      return;
    }
    cb(json);
  }

  generateRandomKey() {
    return Math.random().toString(36);
  }

  cacheMindmap(json) {
    this.target.setAttribute('data-mindmap-json', this.encodeJSON(json));
    // @ts-ignore
    this.editor.fire('keyup', this.editor);
  }
}

export default new CherryMindmapDialogHelper();
