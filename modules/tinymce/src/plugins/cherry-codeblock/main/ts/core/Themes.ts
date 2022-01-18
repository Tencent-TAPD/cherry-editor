/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import Editor from 'tinymce/core/api/Editor';
import * as Settings from '../api/Settings';
import * as CodeBlock from './CodeBlock';

export interface ThemesSpec {
    text: string;
    value: string;
}

const getThemes = (editor: Editor): ThemesSpec[] => {
    const defaultThemes: ThemesSpec[] = [
        { text: 'default', value: 'solarizedlight' },
        { text: 'dark', value: 'tomorrow' }
    ];

    const customThemes = Settings.getThemes(editor);
    return customThemes ? customThemes : defaultThemes;
};

const getCurrentThemes = (editor: Editor, fallback: string): string => {
    const node = CodeBlock.getSelectedCodeBlock(editor);

    return node.fold(() => fallback, (n) => {
        const matches = n.className.match(/theme-(\w+)/);
        return matches ? matches[1] : fallback;
    });
};

export {
    getThemes,
    getCurrentThemes
};
