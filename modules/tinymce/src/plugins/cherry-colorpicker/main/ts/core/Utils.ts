/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import LocalStorage from 'tinymce/core/api/util/LocalStorage';
import I18n from 'tinymce/core/api/util/I18n';

let left; let top;
let _editor;
let format = 'forecolor';
const colorMap = [
  '#fff',
  '#efeff4',
  '#e5e5ea',
  '#d1d1d6',
  '#c7c7cc',
  '#3f4a56',
  '#4a4a4d',
  '#000000',
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#4cd964',
  '#5ac8fa',
  '#007aff',
  '#5856d6',
  '#bd10e0',
  '#ffd8d6',
  '#ffeacc',
  '#fff5cc',
  '#dbf7e0',
  '#def4fe',
  '#cce4ff',
  '#deddf7',
  '#f2cff9',
  '#ffb1ac',
  '#ffd599',
  '#ffeb99',
  '#bff1c7',
  '#bde9fd',
  '#99caff',
  '#bcbbef',
  '#e59ff3',
  '#ff766f',
  '#ffb54d',
  '#ffdb4d',
  '#82e493',
  '#8cd9fc',
  '#4da2ff',
  '#8a89e2',
  '#d158e9',
  '#b22922',
  '#b26800',
  '#b28e00',
  '#359746',
  '#3f8caf',
  '#0055b2',
  '#3d3c95',
  '#840b9c',
  '#661813',
  '#663c00',
  '#665200',
  '#1e5728',
  '#245064',
  '#003166',
  '#232256',
  '#4c065a',
];
const arrowRight = '<svg style="height: 12px;width: 12px;color: #8091a5;" version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n'
    + '\t viewBox="90.288 58.809 850.394 850.394" enable-background="new 90.288 58.809 850.394 850.394" xml:space="preserve">\n'
    + '<g>\n'
    + '\t<path d="M322.498,909.202c-7.622,0-15.245-2.886-21.093-8.668c-11.781-11.649-11.888-30.645-0.238-42.426l368.318-372.482\n'
    + '\t\tL297.962,109.903c-11.65-11.782-11.543-30.776,0.238-42.426c11.783-11.649,30.777-11.542,42.426,0.238l392.381,396.817\n'
    + '\t\tc11.558,11.688,11.558,30.5,0,42.188L343.831,900.296C337.964,906.23,330.232,909.202,322.498,909.202z"/>\n'
    + '</g>\n'
    + '</svg>';

function calcPositionByButton(buttonEl) {
  const rect = buttonEl.getBoundingClientRect();
  const left = rect.x;
  const top = rect.y + rect.height + 3;
  return { left, top };
}

function menuClick(editor) {
  editor.editorContainer.getElementsByClassName('tox-editor-header')[0].addEventListener('click', (e) => {
    // @ts-ignore
    const parent = e.target.closest('.tox-split-button');
    if (parent) {
      const position = calcPositionByButton(parent);
      left = position.left;
      top = position.top;
    }
    removeMenu();
  });
}

function getMenuPosition(name: string) {
  const id = name === 'forecolor' ? 'tox-icon-text-color__color' : 'tox-icon-highlight-bg-color__color';
  const buttonEl = document.querySelector(`#${id}`)?.closest('.tox-split-button');
  if (buttonEl && !buttonEl.closest('.tox-editor-header')) {
    const position = calcPositionByButton(buttonEl);
    return position;
  }
  return { left, top };
}

function checkBoundary(menuEl: HTMLElement) {
  const menuRect = menuEl.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const SPACE = 8;
  const maxRight = bodyRect.right - SPACE;
  if (menuRect.right > maxRight) {
    menuEl.style.left = `${menuRect.left - (menuRect.right - maxRight)}px`;
  }
}

const cell = function (initial) {
  const value = {
    forecolor: '#ff3b30',
    hilitecolor: '#ffcc00'
  };
  const get = function (format) {
    return value[format];
  };
  const set = function (v, format) {
    value[format] = v;
  };
  return {
    get,
    set
  };
};
const lastColor = cell(null);

const calcCols = function (colors) {
  return Math.max(5, Math.ceil(Math.sqrt(colors)));
};

export const getColorCols$1 = function (editor) {
  const defaultCols = calcCols(colorMap.length);
  return getColorCols(editor, defaultCols);
};

const getColorCols = function (editor, defaultCols) {
  return editor.getParam('color_cols', defaultCols, 'number');
};

const setIconColor = function (splitButtonApi, name, newColor) {
  const setIconFillAndStroke = function (pathId, color) {
    splitButtonApi.setIconFill(pathId, color);
    splitButtonApi.setIconStroke(pathId, color);
  };

  const id = name === 'forecolor' ? 'tox-icon-text-color__color' : 'tox-icon-highlight-bg-color__color';
  setIconFillAndStroke(id, newColor);
};

const constant = function (value) {
  return function () {
    return value;
  };
};

const fireTextColorChange = function (editor, data) {
  return editor.fire('TextColorChange', data);
};

const noop = function () {};

const some = function (a) {
  const constantA = constant(a);

  const bind = function (f) {
    return f(a);
  };

  const me = {
    getOr: constantA,
    each(f) {
      f(a);
    },
    bind,
    toString() {
      return `some(${a})`;
    },
  };
  return me;
};

const from = function (value) {
  return value === null || value === undefined ? NONE : some(value);
};
const none = function () {
  return NONE;
};
const NONE = (function () {
  const id = function (n) {
    return n;
  };

  const me = {
    getOr: id,
    each: noop,
    bind: none,
    toString: constant('none()')
  };
  return me;
}());

const Option = {
  some,
  none,
  from
};

const applyColor = function (editor, format, value, onChoice) {
  onChoice(value);
  editor.execCommand('mceApplyTextcolor', format, value);
};

const colorPickerDialog = function (editor) {
  return function (callback, value) {
    const getOnSubmit = function (callback) {
      return function (api) {
        editor.fire('showDialogTitle');
        const data = api.getData();
        callback(Option.from(data.colorpicker));
        api.close();
      };
    };
    const onAction = function (api, details) {
      if (details.name === 'hex-valid') {
        if (details.value) {
          api.enable('ok');
        } else {
          api.disable('ok');
        }
      }
    };
    const initialData = { colorpicker: value };
    const submit = getOnSubmit(callback);
    editor.windowManager.open({
      title: 'Color Picker',
      size: 'normal',
      body: {
        type: 'panel',
        items: [{
          type: 'colorpicker',
          name: 'colorpicker',
          label: 'Color'
        }]
      },
      buttons: [
        {
          type: 'cancel',
          name: 'cancel',
          text: 'Cancel'
        },
        {
          type: 'submit',
          name: 'save',
          text: 'Save',
          primary: true
        }
      ],
      initialData,
      onAction,
      onSubmit: submit,
      onClose() {
      },
      onCancel() {
        callback(Option.none());
        editor.fire('showDialogTitle');
      }
    });
  };
};

const addColor = function (color) {
  colorCache.add(color);
};

const colorCache = getColorCache(10);
const indexOf = function (xs, x) {
  const r = rawIndexOf(xs, x);
  return r === -1 ? Option.none() : Option.some(r);
};
const rawIndexOf = function (ts, t) {
  return nativeIndexOf.call(ts, t);
};
const nativeIndexOf = Array.prototype.indexOf;

function getColorCache(maxCopy) {
  let max = maxCopy;
  if (max === void 0) {
    max = 8;
  }
  const prune = function (list) {
    const diff = max - list.length;
    return diff < 0 ? list.slice(0, max) : list;
  };
  const add = function (key) {
    const localstorage = getLocalStorage(format === 'forecolor' ? 'choose-colors' : 'back-colors');
    const cache = prune(localstorage);
    const remove = function (idx) {
      cache.splice(idx, 1);
    };
    indexOf(cache, key).each(remove);
    cache.unshift(key);
    if (cache.length > max) {
      cache.pop();
    }
    LocalStorage.setItem(format === 'forecolor' ? 'choose-colors' : 'back-colors', JSON.stringify(cache));
  };
  return {
    add
  };
}

function colorPicker(onChoice, name) {
  const dialog = colorPickerDialog(_editor);
  dialog((colorOpt) => {
    colorOpt.each((color) => {
      addColor(color);
      _editor.execCommand('mceApplyTextcolor', name, color);
      onChoice(color);
    });
  }, '#000000');
}

function clickColor(e, name) {
  let target = e.target;
  if (target.tagName === 'I') {
    target = target.parentNode;
  }
  if (!target.style.background) {
    return;
  }
  applyColor(_editor, name, target.style.background, (newColor) => {
    const hexNewColor = rgbToHex(newColor);
    lastColor.set(hexNewColor, format);
    addColor(hexNewColor);
    fireTextColorChange(_editor, {
      name,
      color: hexNewColor
    });
  });
}

function getLocalStorage(name) {
  const storageString = LocalStorage.getItem(name);
  return typeof storageString === 'string' ? JSON.parse(storageString) : [];
}

export function removeMenu() {
  const menu = document.getElementById('menu-dropdown');
  if (menu) {
    menu.parentNode.removeChild(document.getElementById('menu-dropdown'));
  }
}

function rgbToHex(rgb) {
  if (rgb && rgb.indexOf('#') >= 0) {
    return rgb;
  }
  const color = rgb.toString().match(/\d+/g);
  let hex = '#';

  for (let i = 0; i < 3; i++) {
    hex += (`0${Number(color[i]).toString(16)}`).slice(-2);
  }
  return hex;
}

const i = '<i style="border-right: 2px solid white;\n'
    + 'border-top: 2px solid white;'
    + 'transform: rotate(132deg);'
    + 'position: absolute;'
    + 'top: 3px;'
    + 'left: 3px;'
    + 'height: 4px;'
    + 'width: 7px;'
    + 'display: block;"></i>';
function menu(editor, colors, name) {
  removeMenu();
  let recentColor = lastColor.get(format);
  if (recentColor) {
    recentColor = rgbToHex(recentColor);
  }
  const colorMap = colors.map((item, index) => {
    const div = document.createElement('div');
    div.setAttribute('style', `background: ${item}; margin:3px 3px; width: 16px; height: 16px;border-radius: 2px; cursor: pointer;display: inline-block`);
    if (index === 0) {
      div.style.border = '1px solid #e8e8e8';
      div.style.boxSizing = 'border-box';
    }
    if (recentColor === item) {
      div.style.position = 'relative';
    }
    div.innerHTML = i;
    return div;
  });

  // 调色板
  const columns = getColorCols$1(editor);
  const menuDropDown = document.createElement('div');
  for (let i = 0; i < columns && colorMap.length; i++) {
    const row = document.createElement('div');
    colorMap.splice(0, columns).forEach((item) => {
      row.appendChild(item);
    });
    row.setAttribute('style', 'text-align: center; height: 22px');
    if (i === 0 || i === 1) {
      row.style.margin = '4px 0';
    }
    row.addEventListener('click', (e) => {
      clickColor(e, name);
    });
    menuDropDown.appendChild(row);
  }

  // 最近使用
  const localStorage = getLocalStorage(format === 'forecolor' ? 'choose-colors' : 'back-colors');

  const useRecently = document.createElement('div');
  useRecently.innerHTML = `<h3 style="font-size: 12px; color: #8091a5;font-weight: normal;margin: 0 3px 7px">${I18n.translate('History Color')}</h3>`;
  useRecently.setAttribute('style', 'padding: 5px 13px;');

  const usedRow = document.createElement('div');
  usedRow.style.textAlign = 'center';
  for (let i = 0; i < columns && localStorage.length; i++) {
    const div = document.createElement('div');
    div.setAttribute('style', `background: ${localStorage[i]}; margin:3px 3px 5px; width: 16px; height: 16px;border-radius: 2px; cursor: pointer;display: inline-block`);
    usedRow.appendChild(div);
  }
  usedRow.addEventListener('click', (e) => {
    clickColor(e, name);
  });
  useRecently.appendChild(usedRow);

  menuDropDown.appendChild(useRecently);

  // 调色盘
  const customColor = document.createElement('div');
  customColor.innerHTML = `<h3 style="font-size: 12px; font-weight: normal;margin: 0;cursor: pointer;">${I18n.translate('Custom color')}</h3>${arrowRight}`;
  customColor.setAttribute('style', 'padding: 10px 13px; border-top: 1px solid #C5D7EF;display: flex;align-items: center;justify-content: space-between;');
  customColor.addEventListener('click', () => {
    editor.fire('disableDialogTitle');
    colorPicker((newColor) => {
      const hexNewColor = rgbToHex(newColor);
      lastColor.set(hexNewColor, format);
      fireTextColorChange(editor, {
        name,
        color: hexNewColor
      });
    }, name);
  });
  menuDropDown.appendChild(customColor);
  const position = getMenuPosition(name);
  menuDropDown.setAttribute('style', `top: ${position.top}px; left: ${position.left}px;background: white; z-index: 2000; width: 202px; border: 1px solid #C5D7EF; box-shadow: 0 6px 12px rgba(0,0,0,0.09); padding: 5px 0; position: absolute`);
  menuDropDown.setAttribute('id', 'menu-dropdown');
  document.body.appendChild(menuDropDown);
  checkBoundary(menuDropDown);
}

export const getFetch = function (editor, name) {
  format = name;
  menu(editor, colorMap, name);

  editor.on('click', () => {
    removeMenu();
  });
};

export const onItemAction = function (editor, _splitButtonApi, value) {
  applyColor(editor, format, value, (newColor) => {
    const hexNewColor = rgbToHex(newColor);
    lastColor.set(hexNewColor, format);
    fireTextColorChange(editor, {
      name,
      color: hexNewColor
    });
  });
};


export const onSetup = function (editor, splitButtonApi, name) {
  _editor = editor;
  menuClick(_editor);
  setIconColor(splitButtonApi, name, lastColor.get(name));
  const handler = function (e) {
    setIconColor(splitButtonApi, e.name, lastColor.get(e.name));
  };
  editor.on('TextColorChange', handler);
  return function () {
    editor.off('TextColorChange', handler);
  };
};

export const onAction = function (editor, name) {
  format = name;
  if (lastColor.get(format) !== null) {
    applyColor(editor, name, lastColor.get(format), () => {
    });
  }
};
