/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see
 */
import { CherryEditor } from './CherryEditor';

declare const window: any;
declare const module: any;

if (typeof module === 'object') {
  try {
    module.exports = CherryEditor;
  } catch (_) {}
}

window.CherryEditor = CherryEditor;
