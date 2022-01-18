/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import * as Settings from '../api/Settings';
import * as CodeBlock from './CodeBlock';

export interface LanguageSpec {
  text: string;
  value: string;
}

const getLanguages = (editor: Editor): LanguageSpec[] => {
  const defaultLanguages: LanguageSpec[] = [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'PHP', value: 'php' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'C', value: 'c' },
    { text: 'C#', value: 'csharp' },
    { text: 'C++', value: 'cpp' }
  ];

  const customLanguages = Settings.getLanguages(editor);
  return customLanguages ? customLanguages : defaultLanguages;
};

const getCurrentLanguage = (editor: Editor, fallback: string): string => {
  const node = CodeBlock.getSelectedCodeBlock(editor);

  return node.fold(() => fallback, (n) => {
    const matches = n.className.match(/language-(\w+)/);
    return matches ? matches[1] : fallback;
  });
};

export {
  getLanguages,
  getCurrentLanguage
};
