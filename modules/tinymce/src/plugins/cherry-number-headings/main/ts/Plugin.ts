/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import Delay from 'tinymce/core/api/util/Delay';

export default () => {
  PluginManager.add('cherry-number-headings', function plugin(editor) {
    let toggleState = false;
    editor.ui.registry.addToggleButton('ch-number-headings', {
      tooltip: 'Number Headings',
      icon: 'number-headings',
      onAction () {
        toggleState = !toggleState;
        editor.fire('NumberHeadingsToggleStateChange');
      },
      onSetup (api) {
        const doNumberHeadings = function () {
          const { $ } = editor;
          if (toggleState) {
            const ids = [];
            $('h1,h2,h3,h4').each(function () {
              const level = Number(this.nodeName[1]);
              if (ids.length >= level) {
                ids[level - 1]++;
              } else {
                ids.push(1, 1, 1, 1);
              }
              ids.length = level;
              const obj = $(this).find('.nh-number');
              if (obj.length > 0) {
                const preContent = obj.text().replace(/^\s*(\d\.?)+\s?/, '');
                $(this).prepend(preContent);
              }
              $(this).prepend(`<span class="nh-number">${ids.join('.')}. </span>`);
              obj.remove();
            });
          } else {
            $('span.nh-number').remove();
          }
        };
        const toggleStateChangeHandler = function () {
          api.setActive(toggleState);
          doNumberHeadings();
        };
        const contentChangeHandler = Delay.debounce(function () {
          const newToggleState = editor.$('span.nh-number').length > 0;
          if (newToggleState !== toggleState) {
            toggleState = newToggleState;
            editor.fire('NumberHeadingsToggleStateChange');
          }
        });
        editor.on('NumberHeadingsToggleStateChange', toggleStateChangeHandler);
        editor.on('LoadContent SetContent input', contentChangeHandler);
        return function () {
          editor.off('NumberHeadingsToggleStateChange', toggleStateChangeHandler);
          editor.off('LoadContent SetContent input', contentChangeHandler);
        };
      }
    });
  });
};
