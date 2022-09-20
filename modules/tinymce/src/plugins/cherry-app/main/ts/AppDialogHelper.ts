/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import I18n from 'tinymce/core/api/util/I18n';
const t = I18n.translate;

const CHERRY_APP_DIALOG = `
    <div class="cherry-app-dialog__mask">
    <div class="cherry-app-dialog__content" style="CHERRY_APP_STYLE">
        <div class="cherry-app-dialog__head clearfix">
            <span class="cherry-app-dialog__head-title">INSERT_APP_NAME</span>
            <span class="cherry-app-dialog__head-close ico-dialog-close j-close-dialog"></span>
            <span class="cherry-app-dialog__head-fullscreen font-editor font-editor-fullscreen j-set-dialog-size" style="display: none"></span>
        </div>
        <div class="cherry-app-dialog__body">
            <div class="cherry-app-dialog__body--loading j-dialog-loading" style="display: block;">
               <div class="cherry-app-dialog__body--loading_icon strip-loading2"></div>
            </div>
            <iframe style="visibility: visible;" allowtransparency="true" id="cherry-open-app-dialog-iframe" src="CHERRY_APP_URL" width="100%" frameborder="0" height="100%" loaded="true"></iframe>
        </div>
        <div class="cherry-app-dialog__foot">
        <div class="cherry-app-dialog__foot-btns">
            <span class="foot-btn foot-btn__ensure j-foot-btn__ensure">COMFIRM</span>
            <span class="foot-btn foot-btn__cancel j-close-dialog">CANCEL</span>
        </div>
        </div>
    </div>
    </div>
`;

const CHERRY_APP_WRAPPER = `
<div class="cherry-app-wrapper" contenteditable="false" style="position: relative;" data-app-filename="CHERRY_APP_FILENAME" data-app-url="CHERRY_APP_FILEURL" data-app-config="CHERRY_APP_CONFIG" data-app-mode="1">
  <div class="preview-card">
      <iframe src="CHERRY_APP_FILEURL" frameborder="0"></iframe>
      <div class="filename" title="CHERRY_APP_FILENAME">
          <img />
          <span class="name">CHERRY_APP_NAME</span>
          <span class="note">CHERRY_APP_NOTE</span>
      </div>
  </div>
  <div class="preview-textlink" style="display: none">
      <img />
      <span>CHERRY_APP_FILENAME</span>
  </div>
  <span class="end"></span>
</div>
`;

let id = 1;

interface CherryAppDialogHelperConstruct {
  target: HTMLElement;
}
class CherryAppDialogHelper implements CherryAppDialogHelperConstruct {
  public target: HTMLElement;
  public editor: Editor;
  public created: boolean;
  public dialogVisble: boolean;
  public handlers: object;
  public appConfig: object;
  public constructor() {
    this.target = null;
    this.editor = null;
    this.created = false;
    this.dialogVisble = false;
    this.handlers = {};
    this.appConfig = {};
  }

  public init(editor: Editor) {
    this.editor = editor;
    this.editor.settings._cherryAppId = id;
    id += 1;
    this.editor.on('OPENAPP_ENTRANCE_INIT:SUCCESS', (data) => {
      const loadingEl = this.getAppDialogEl('.j-dialog-loading');
      if (loadingEl) {
        loadingEl.style.display = 'none';
      }
    });
    this.editor.on('OPENAPP_ENTRANCE_CONFIRM:SUCCESS', (data) => {
      this.onSure(data.filename, data.url, data.sub);
    });
  }

  public cleanup() {
    const appDialogEl = this.getAppDialogEl();
    appDialogEl?.remove();
  }

  public onSure(filename, url, sub = '') {
    const self = this;
    const imageTarget = self.target;
    const base64Config = self.encodeJSON(self.appConfig);
    const html = CHERRY_APP_WRAPPER.replace(/CHERRY_APP_FILEURL/g, url).replace(/CHERRY_APP_FILENAME/g, `${filename}${sub}`).replace(/CHERRY_APP_NAME/g, filename).replace(/CHERRY_APP_NOTE/g, sub).replace(/CHERRY_APP_CONFIG/g, base64Config);
    imageTarget.outerHTML = html;
    const dialogEl = this.getAppDialogEl();
    if (dialogEl) {
      dialogEl.style.display = 'none';
    }
    self.target = null;
    self.editor.fire('closeCustomDialog');
  }

  public openAppDialog(item) {
    if (!item) {
      return ;
    }
    this.appConfig = this.decodeJSON(item.getAttribute('data-app-config'));
    // @ts-ignore
    this.appConfig.iframeId = 'cherry-open-app-dialog-iframe';

    this.setDialogVisible(
      item,
      true,
      item.getAttribute('data-app-filename'),
      item.getAttribute('data-app-url')
    );
  }

  public setDialogVisible(target, val, filename = '', url = '') {
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
      const data: any = Object.assign({}, this.appConfig);
      if (url) {
        data.filename = filename;
        data.fileurl = url;
      }
      this.createIframe(data.url, () => {
        this.updateApp(data);
      });
      const dialogEl = this.getAppDialogEl();
      if (dialogEl) {
        dialogEl.style.display = 'block';
      }
      const loadingEl = this.getAppDialogEl('.j-dialog-loading');
      if (loadingEl) {
        loadingEl.style.display = 'block';
      }
    } else {
      const dialogEl = this.getAppDialogEl();
      if (dialogEl) {
        dialogEl.style.display = 'none';
      }
      if (!fromInsert) {
        this.target.setAttribute('data-app-filename', this.target.getAttribute('data-app-oldfilename'));
        this.target.setAttribute('data-app-url', this.target.getAttribute('data-app-oldurl'));
        this.target.setAttribute('data-app-oldfilename', '');
        this.target.setAttribute('data-app-oldurl', '');
      }
      this.target = target;
    }
  }

  public insertEmptyImg(config) {
    this.appConfig = config;
    // @ts-ignore
    this.appConfig.iframeId = 'cherry-open-app-dialog-iframe';
    const key = this.encodeJSON(this.generateRandomKey()).replace(/=/g, '');
    this.editor.insertContent(this.createEmptyApphImg(key));
    const img = this.editor.$(`img[data-start-key="${key}"]`);
    this.openAppDialog(img[0]);
  }

  public createEmptyApphImg(key) {
    const emptyImgPath = this.editor.getParam('mindmap_empty_img');
    const base64Config = this.encodeJSON(this.appConfig);
    return `<img src="${emptyImgPath}" style="display:none" data-start-key="${key}" alt="cherry-app" data-control="cherry-app" data-app-filename data-app-url data-app-config="${base64Config}">`;
  }

  public createIframe(url, cb) {
    const dialogEl = this.getAppDialogEl();
    if (this.created && dialogEl) {
      document.querySelector('#cherry-open-app-dialog-iframe').setAttribute('src', url);
      const dialogTitleDom = dialogEl.querySelector('.cherry-app-dialog__head-title') || {};
      // @ts-ignore
      dialogTitleDom.innerText = this.appConfig.name;

      cb();
      return ;
    }
    this.created = true;

    const dialog = document.createElement('div');
    const id = this.editor.settings._cherryAppId;
    dialog.setAttribute('class', `cherry-app-dialog j-cherry-app-dialog j-cherry-app-dialog-${id} cherry-app-dialog--normal`);
    // @ts-ignore
    dialog.style = 'display:none;';
    let style = '';
    // @ts-ignore
    const { width, height, name } = this.appConfig;
    if (width) {
      style += `width: ${width}px;`;
    }
    if (height) {
      style += `height: ${height}px;`;
    }
    dialog.innerHTML = CHERRY_APP_DIALOG.replace('CHERRY_APP_URL', url).replace('CHERRY_APP_STYLE', style).replace('INSERT_APP_NAME', `${t('Insert ')}${t(name)}`).replace('COMFIRM', t('Comfirm')).replace('CANCEL', t('Cancel'));
    document.body.appendChild(dialog);

    this.bindEvent();
    cb();
  }

  public updateApp(config) {
    if (!this.dialogVisble) {
      return ;
    }
    this.editor.fire('OPENAPP_ENTRANCE_INIT', config);
    const oldUrl = this.target.getAttribute('data-app-oldurl');
    if (!oldUrl) {
      this.target.setAttribute('data-app-oldfilename', this.target.getAttribute('data-app-filename'));
      this.target.setAttribute('data-app-oldurl', this.target.getAttribute('data-app-url'));
    }
  }

  public decodeJSON(json) {
    return json ? JSON.parse(decodeURIComponent(escape(window.atob(json)))) : null;
  }

  public encodeJSON(json) {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(json))));
  }

  public bindEvent() {
    const dialogEl = this.getAppDialogEl();
    if (!dialogEl) {
      return ;
    }
    const ensureBtnEl = this.getAppDialogEl('.j-foot-btn__ensure');
    if (ensureBtnEl) {
      ensureBtnEl.addEventListener('click', (e) => {
        this.onInsertApp(e);
        this.editor.fire('showDialogTitle');
      });
    }
    dialogEl.querySelectorAll('.j-close-dialog').forEach((item) => {
      item.addEventListener('click', (e) => {
        this.editor.fire('showDialogTitle');
        this.setDialogVisible(null, false);
        this.editor.fire('closeCustomDialog');
      });
    });
    const setSizeBtnEl = this.getAppDialogEl('.j-set-dialog-size');
    if (setSizeBtnEl) {
      setSizeBtnEl.addEventListener('click', (e) => {
        const dialog = this.getAppDialogEl();
        const { target } = e;
        let targetClass = (target as HTMLElement).getAttribute('class');
        let dialogClass = '';
        if (targetClass.indexOf('font-editor-fullscreen-restore') < 0) {
          dialogClass = dialog.getAttribute('class').replace(/cherry-app-dialog--normal/g, 'cherry-app-dialog--fullscreen');
          targetClass = targetClass.replace(/font-editor-fullscreen/g, 'font-editor-fullscreen-restore');
        } else {
          dialogClass = dialog.getAttribute('class').replace(/cherry-app-dialog--fullscreen/g, 'cherry-app-dialog--normal');
          targetClass = targetClass.replace(/font-editor-fullscreen-restore/g, 'font-editor-fullscreen');
        }
        dialog.setAttribute('class', dialogClass);
        (target as HTMLElement).setAttribute('class', targetClass);
      });
    }
  }

  public resetDialogSize() {
    const dialog = this.getAppDialogEl();
    if (!dialog) {
      return;
    }
    let dialogClass = dialog.getAttribute('class');
    if (dialogClass.indexOf('cherry-app-dialog--fullscreen') > -1) {
      dialogClass = dialogClass.replace(/cherry-app-dialog--fullscreen/g, 'cherry-app-dialog--normal');
      dialog.setAttribute('class', dialogClass);
      const fullscreenIcon = this.getAppDialogEl('.j-set-dialog-size');
      if (fullscreenIcon) {
        let fullscreenIconClass = fullscreenIcon.getAttribute('class');
        fullscreenIconClass = fullscreenIconClass.replace(/font-editor-fullscreen-restore/g, 'font-editor-fullscreen');
        fullscreenIcon.setAttribute('class', fullscreenIconClass);
      }
    }
  }

  public onInsertApp(e) {
    this.editor.fire('OPENAPP_ENTRANCE_CONFIRM');
  }

  public base64ToFile(base64Data, name) {
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

  public beforeInsertJSON(json, cb) {
    const beforeInsertJSON = this.editor.getParam('app_before_insert_json', '');
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

  public beforeParseJSON(json, token, cb) {
    let id = '';
    if (json && json.trim().indexOf('id:') === 0) {
      id = json.trim().replace('id:', '');
    } else {
      cb(json);
      return ;
    }
    const beforeParseJSON = this.editor.getParam('app_before_parse_json', '');
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

  public generateRandomKey() {
    return Math.random().toString(36);
  }

  public cacheApp(json) {
    this.target.setAttribute('data-app-json', this.encodeJSON(json));
    // @ts-ignore
    this.editor.fire('keyup', this.editor);
  }

  public getAppDialogEl(childSelector = '') {
    const id = this.editor.settings._cherryAppId;
    const dialogEl = document.querySelector<HTMLElement>(`.j-cherry-app-dialog-${id}`);
    if (!childSelector) {
      return dialogEl;
    }
    return dialogEl?.querySelector<HTMLElement>(childSelector);
  }
}

export default CherryAppDialogHelper;
