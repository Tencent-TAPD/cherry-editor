/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import AppDialogHelper from './AppDialogHelper';
import appIcon from './icons/app_icon';
import textlinkIcon from './icons/app_textlink_icon';
import cardIcon from './icons/app_card_icon';
import openIcon from './icons/app_open_icon';
import editIcon from './icons/app_edit_icon';
import removeIcon from './icons/app_remove_icon';

const MAX_PLUGINS_NUM = 10;

export default () => {
  PluginManager.add('cherry-app', function plugin(editor) {
    const appDialogHelper = new AppDialogHelper();
    appDialogHelper.init(editor);
    editor.on('remove', () => {
      appDialogHelper.cleanup();
    });
    editor.ui.registry.addIcon('ch-app', appIcon);
    editor.ui.registry.addIcon('ch-app-textlink', textlinkIcon);
    editor.ui.registry.addIcon('ch-app-card', cardIcon);
    editor.ui.registry.addIcon('ch-app-open', openIcon);
    editor.ui.registry.addIcon('ch-app-edit', editIcon);
    editor.ui.registry.addIcon('ch-app-remove', removeIcon);

    for (let i = 0; i < MAX_PLUGINS_NUM; i++) {
      editor.ui.registry.addButton(`ch-app${i}`, {
        icon: 'ch-app',
        tooltip: `CherryApp${i}`,
        onAction() {
          const getCherryAppConfig = editor.getParam(
            'getCherryAppConfig',
            null
          );
          if (getCherryAppConfig) {
            getCherryAppConfig((config) => {
              if (config.length > i) {
                appDialogHelper.insertEmptyImg(config[i]);
              }
            });
          }
        }
      });
    }

    let currentNode = null;

    editor.ui.registry.addToggleButton('ch-app-textlink', {
      tooltip: 'Text Link',
      icon: 'ch-app-textlink',
      onAction(api) {
        if (currentNode) {
          const root = editor.$(currentNode);
          root.attr('data-app-mode', '2');
          root.css({
            'width': 'max-content',
            'box-shadow': 'none'
          });
          root.find('.preview-card').css('display', 'none');
          root.find('.preview-textlink').css('display', 'inline-flex');
          document.querySelector('.tox-pop').remove();
          api.setActive(!api.isActive());
        }
      },
      onSetup(api) {
        if (currentNode) {
          const root = editor.$(currentNode);
          api.setActive(root.attr('data-app-mode') === '2');
        }
        return () => {};
      }
    });

    editor.ui.registry.addToggleButton('ch-app-card', {
      tooltip: 'Card Preview',
      icon: 'ch-app-card',
      onAction(api) {
        if (currentNode) {
          const root = editor.$(currentNode);
          root.css({
            'width': '50%',
            'box-shadow': '5px 5px 5px #e0e0e0'
          });
          root.attr('data-app-mode', '1');
          root.find('.preview-textlink').css('display', 'none');
          root.find('.preview-card').css('display', 'block');
          document.querySelector('.tox-pop').remove();
          api.setActive(!api.isActive());
        }
      },
      onSetup(api) {
        if (currentNode) {
          const root = editor.$(currentNode);
          api.setActive(root.attr('data-app-mode') === '1');
        }
        return () => {};
      }
    });

    editor.ui.registry.addButton('ch-app-open', {
      tooltip: 'Open',
      icon: 'ch-app-open',
      onAction() {
        if (currentNode) {
          window.open(currentNode.getAttribute('data-app-url'));
        }
      }
    });

    editor.ui.registry.addButton('ch-app-edit', {
      tooltip: 'Edit',
      icon: 'ch-app-edit',
      onAction() {
        if (currentNode) {
          appDialogHelper.openAppDialog(currentNode);
        }
      }
    });

    editor.ui.registry.addButton('ch-app-remove', {
      tooltip: 'Delete',
      icon: 'ch-app-remove',
      onAction() {
        if (currentNode) {
          currentNode.outerHTML = '<br />';
          document.querySelector('.tox-pop').remove();
        }
      }
    });

    editor.ui.registry.addContextToolbar('ch-app-toolbar', {
      items: 'ch-app-textlink ch-app-card ch-app-open ch-app-edit ch-app-remove',
      predicate: (node) => {
        if (node.className === 'cherry-app-wrapper') {
          currentNode = node;
          node.setAttribute('data-mce-selected', '1');
          return true;
        }
        if (currentNode) {
          currentNode.removeAttribute('data-mce-selected');
          currentNode = null;
        }
        return false;
      },
      position: 'node',
      scope: 'node'
    });
  });
};
