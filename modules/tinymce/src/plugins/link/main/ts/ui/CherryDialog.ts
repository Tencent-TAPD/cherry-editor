/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */
interface dialogFormFields {
  href: string
  text: string
  title: string
  target: Element
}
const dialog = {
  dialogClass: 'cherry-link-dialog',
  created: false,
  defaultData: {
    href: 'http://',
    text: '',
    title: '',
    target: '',
  },
  configs: {},
  template: `
    <div class="cherry-dialog">
      <div class="cherry-dialog__content" style="width: 500px;">
        <div class="cherry-dialog__head clearfix">
          <span class="cherry-dialog__head-title">链接</span>
          <span class="cherry-dialog__head-close ico-dialog-close j-close"></span>
        </div>
        <div class="cherry-dialog__body">
          <form class="link-form">
            <div class="link-form-item">
              <p class="link-form-item__label">地址</p>
              <div class="link-form-item__input">
                <input class="form-item__href" name="href" type="text"/>
              </div>
            </div>
            <div class="link-form-item j-form-item__text-container">
              <p class="link-form-item__label">显示文字</p>
              <div class="link-form-item__input">
                <input class="form-item__text" name="text"  type="text"/>
              </div>
            </div>
            <div class="link-form-item">
              <p class="link-form-item__label">标题</p>
              <div class="link-form-item__input">
                <input class="form-item__title" name="title"  type="text"/>
              </div>
            </div>
            <div class="link-form-item">
              <p class="link-form-item__label">链接打开方式</p>
              <div class="link-form-item__input">
                <select class="form-item__target" name="target">
                  <option value="">当前窗口打开</option>
                  <option value="_blank">在新窗口打开</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="cherry-dialog__foot">
          <div class="cherry-dialog__foot-btns">
            <span class="foot-btn foot-btn__ensure j-ensure">确定</span>
            <span class="foot-btn foot-btn__cancel j-cancel">取消</span>
          </div>
        </div>
    </div>
  </div>`,
  create() {
    if (this.created || document.querySelector(`.${this.dialogClass}`)) {
      this.created = true;
      this.bindEvent();
      return;
    }
    this.created = true;
    const dialogNode = document.createElement('div');
    dialogNode.setAttribute('class', `cherry-dialog-wrap ${this.dialogClass}`);
    dialogNode.innerHTML = this.template;
    document.querySelector('body').appendChild(dialogNode);
    this.bindEvent();
    this.handleFocus = this.handleFocus.bind(this);
  },
  handleFocus() {
    this.$('.form-item__href').select();
  },
  show(data = {}, configs) {
    this.create();
    this.$('.form-item__href').addEventListener('focus', this.handleFocus);
    setTimeout(() => {
      this.$('.form-item__href').focus();
    }, 0);
    document.querySelector<HTMLElement>(`.${this.dialogClass}`).style.display = 'block';
    this.applyData(data);
    this.configs = configs;
    if (configs.noText) {
      this.$('.j-form-item__text-container').style.display = 'none';
    } else {
      this.$('.j-form-item__text-container').style.display = 'block';
    }
  },
  hide() {
    document.querySelector<HTMLElement>(`.${this.dialogClass}`).style.display = 'none';
    this.$('.form-item__href').removeEventListener('focus', this.handleFocus);
  },
  bindEvent() {
    this.$('.j-ensure').removeEventListener('click', dialogEvent.sure);
    this.$('.j-ensure').addEventListener('click', dialogEvent.sure);
    this.$('.j-cancel').removeEventListener('click', dialogEvent.cancel);
    this.$('.j-cancel').addEventListener('click', dialogEvent.cancel);
    this.$('.j-close').removeEventListener('click', dialogEvent.cancel);
    this.$('.j-close').addEventListener('click', dialogEvent.cancel);
  },
  onEnsure() {
    const { submit } = this.configs;
    if (submit) {
      if (submit()) {
        this.hide();
      }
      return ;
    }
    this.hide();
  },
  onCancel() {
    this.hide();
  },
  $(className) {
    return document.querySelector(`.${this.dialogClass} ${className}`);
  },
  applyData(data) {
    const temp = Object.assign({}, this.defaultData, data);
    if (!temp.href) {
      temp.href = this.defaultData.href;
    }
    Object.keys(temp).forEach((key) => {
      const el = this.$(`.form-item__${key}`);
      el.value = temp[key];
    });
  },
  getData(): dialogFormFields {
    const data = {};
    Object.keys(this.defaultData).forEach((key) => {
      const el = this.$(`.form-item__${key}`);
      data[key] = el.value;
    });
    return data as dialogFormFields;
  }
};
const dialogEvent = {
  sure() {
    api.editor.fire('showDialogTitle');
    dialog.onEnsure();
  },
  cancel() {
    api.editor.fire('showDialogTitle');
    dialog.onCancel();
  }
};

const api = {
  noText: false,
  data: {},
  editor: null,
  show(data, editor) {
    const {
      text,
      title,
      target,
      link,
    } = data.initialData;
    this.data = data.initialData;
    this.editor = editor;
    // 选中多行的时候不允许设置当前选中的文字
    this.noText = data.body.items[1].name !== 'text';
    dialog.show({
      text,
      title,
      target,
      href: link,
    }, {
      noText: this.noText,
      submit: () => {
        const beforeInsetLink = editor.getParam('before_insert_link', () => true);
        if (!beforeInsetLink(dialog.getData(), editor)) {
          return false;
        }
        data.onSubmit(this);
        return true;
      }
    });
  },
  getData() {
    const {
      text,
      title,
      target,
      href
    } = dialog.getData();
    if (this.noText) {
      return {
        target,
        title,
        url: {
          value: href,
          meta: {
            attach: undefined,
            text: href,
          }
        },
      };
    }
    this.data.text = text;
    this.data.title = title;
    this.data.target = target;
    this.data.url.value = href;
    return this.data;
  },
  close() {
    dialog.hide();
  },
};

export default api;