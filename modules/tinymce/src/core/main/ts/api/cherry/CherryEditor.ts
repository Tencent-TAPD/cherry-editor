/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see
 */
import './Polyfill';
import '../Main';
import './lang/zh_CN';
import { tinymce } from '../Tinymce';
import Editor from '../Editor';
import { RawEditorSettings } from '../SettingsTypes';
import './BasePlugins';

export interface CherryEditorConstructor {
  editor: Editor;
  inited: Boolean;
  afterInitCallbacks: Array<Function>;
  afterInit: Function;
  flashAfterInitedCallbacks: Function;
}

export class CherryEditor implements CherryEditorConstructor {
  public editor: Editor;
  public inited = false;
  public afterInitCallbacks = [];
  public constructor(options?: RawEditorSettings) {
    const configs: RawEditorSettings = Object.assign({
      branding: false,
      menubar: false,
      statusbar: false,
      body_class: 'cherry-editor-body',
    }, options || {});
    this.init(configs);
    const setup = (editor: Editor) => {
      this.editor = editor;
      if (configs.setup) {
        configs.setup(editor);
      }
    };
    tinymce.init({ ...configs, setup });
    return this;
  }

  public init(configs: RawEditorSettings): void {
    this.inited = false;
    this.afterInitCallbacks = [];
    configs.init_instance_callback = (editor) => {
      this.inited = true;
      this.afterInitCallbacks.forEach((cb) => cb(editor));
      editor.fire('afterInit');
    };
    if (configs.value) {
      this.afterInit((editor: Editor) => {
        editor.setContent(configs.value);
        editor.undoManager.clear();
      });
    }
    if (configs.cherry_auto_focus) {
      this.afterInit((editor: Editor) => {
        editor.focus();
        editor.selection.select(editor.getBody(), true);
        editor.selection.collapse(false);
      });
    }
    if (configs.afterInit) {
      this.afterInit(configs.afterInit);
    }
  }

  public afterInit(cb: Function): void {
    if (typeof cb !== 'function') {
      return;
    }
    if (this.inited) {
      cb(this.editor);
      return;
    }
    this.afterInitCallbacks.push(cb);
  }

  public flashAfterInitedCallbacks(): void {
    this.afterInitCallbacks.forEach((cb) => cb(this.editor));
    this.afterInitCallbacks = [];
  }
}
