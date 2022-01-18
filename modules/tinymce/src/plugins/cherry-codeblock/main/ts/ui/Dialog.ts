/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import { Arr } from '@ephox/katamari';
import Editor from 'tinymce/core/api/Editor';
import * as CodeBlock from '../core/CodeBlock';
import * as Languages from '../core/Languages';
import * as Themes from '../core/Themes';

type LanguageSpec = Languages.LanguageSpec;
type ThemesSpec = Themes.ThemesSpec;

const open = (editor: Editor) => {
  const languages: LanguageSpec[] = Languages.getLanguages(editor);
  const defaultLanguage: string = Arr.head(languages).fold(() => '', (l) => l.value);
  const currentLanguage: string = Languages.getCurrentLanguage(editor, defaultLanguage);
  const themes: ThemesSpec[] = Themes.getThemes(editor);
  const defaultThemes: string = Arr.head(themes).fold(() => '', (l) => l.value);
  const currentTheme: string = Themes.getCurrentThemes(editor, defaultThemes);
  const currentCode: string = CodeBlock.getCurrentCode(editor);
  // const currentTheme: string = [
  //   { value: '1', text: 'default' },
  //   { value: '2', text: 'dark' }
  // ];
  editor.windowManager.open({
    title: 'Insert/edit code block',
    size:'large',
    body: {
      type: 'panel',
      items: [
        {
          type: 'selectbox', // component type
          name: 'themes', // identifier
          label: '代码块主题',
          items: themes
        },
        {
          type: 'selectbox', // component type
          name: 'language', // identifier
          label: '编程语言',
          items: languages
        },
        {
          type: 'textarea',
          name: 'code',
          label: '输入代码',
          maximized: true,
        },
      ]
    },
    buttons: [
      {
        type: 'cancel',
        name: 'closeButton',
        text: '取消'
      },
      {
        type: 'submit',
        name: 'submitButton',
        text: '确认',
        primary: true
      }
    ],
    initialData: {
      language: currentLanguage,
      code: currentCode,
      themes: currentTheme,
    },
    onSubmit: (api) => {
      const data = api.getData();
      CodeBlock.insertCodeBlock(editor, data.language, data.code, data.themes);
      api.close();
    }
  });
};

export {
  open
};
