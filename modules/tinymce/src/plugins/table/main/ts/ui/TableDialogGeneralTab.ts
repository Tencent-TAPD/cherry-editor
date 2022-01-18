/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { Dialog } from 'tinymce/core/api/ui/Ui';
import { hasAppearanceOptions } from '../api/Settings';

const getItems = (editor: Editor, classes: Dialog.ListBoxItemSpec[], insertNewTable: boolean) => {
  const rowColCountItems: Dialog.BodyComponentSpec[] = !insertNewTable ? [] : [
    {
      type: 'input',
      name: 'cols',
      label: 'Cols',
      inputMode: 'numeric'
    },
    {
      type: 'input',
      name: 'rows',
      label: 'Rows',
      inputMode: 'numeric'
    }
  ];

  // const alwaysItems: Dialog.BodyComponentSpec[] = [
  //   {
  //     type: 'input',
  //     name: 'width',
  //     label: 'Width'
  //   },
  //   {
  //     type: 'input',
  //     name: 'height',
  //     label: 'Height'
  //   }
  // ];

  const appearanceItems: Dialog.BodyComponentSpec[] = hasAppearanceOptions(editor) ? [
    {
      type: 'input',
      name: 'cellpadding',
      label: 'Padding',
      inputMode: 'numeric'
    },
    {
      type: 'input',
      name: 'border',
      label: 'Border width'
    },
    {
      name: 'bordercolor',
      type: 'colorinput',
      label: 'Border color'
    },
    {
      name: 'backgroundcolor',
      type: 'colorinput',
      label: 'Background color'
    },
    {
      type: 'selectbox',
      name: 'align',
      label: 'Table Alignment',
      items: [
        {
          text: 'None',
          value: ''
        },
        {
          text: 'Left',
          value: 'left'
        },
        {
          text: 'Center',
          value: 'center'
        },
        {
          text: 'Right',
          value: 'right'
        }
      ]
    },
    {
      type: 'label',
      label: 'Caption',
      items: [{
        type: 'checkbox',
        name: 'caption',
        label: '是否显示标题'
      }]
    }
  ] : [];

  // const alignmentItem: Dialog.ListBoxSpec[] = [
  //   {
  //     type: 'listbox',
  //     name: 'align',
  //     label: 'Alignment',
  //     items: [
  //       { text: 'None', value: '' },
  //       { text: 'Left', value: 'left' },
  //       { text: 'Center', value: 'center' },
  //       { text: 'Right', value: 'right' }
  //     ]
  //   }
  // ];

  const classListItem: Dialog.ListBoxSpec[] = classes.length > 0 ? [
    {
      type: 'listbox',
      name: 'class',
      label: 'Class',
      items: classes
    }
  ] : [];

  return rowColCountItems.concat(appearanceItems).concat(classListItem);
};

export { getItems };
