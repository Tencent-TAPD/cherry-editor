/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Optional } from '@ephox/katamari';
import Editor from 'tinymce/core/api/Editor';
import { InlineContent } from 'tinymce/core/api/ui/Ui';

import * as Settings from '../api/Settings';
import * as Actions from '../core/Actions';
import * as Utils from '../core/Utils';

const setupButtons = function (editor: Editor) {

  editor.ui.registry.addToggleButton('link', {
    icon: 'link',
    tooltip: 'Insert/edit link',
    onAction: Actions.openDialog(editor),
    onSetup: Actions.toggleActiveState(editor)
  });

  // cherry-customized--start
  editor.ui.registry.addButton('openlink', {
    icon: 'ch-open-link',
    tooltip: 'Open link',
    onAction: Actions.gotoSelectedLink(editor),
    onSetup: Actions.toggleEnabledState(editor)
  });

  editor.ui.registry.addButton('unlink', {
    icon: 'unlink',
    tooltip: 'Remove link',
    onAction: () => Utils.unlink(editor),
    onSetup: Actions.toggleUnlinkState(editor)
  });

  editor.ui.registry.addToggleButton('cardlink', {
    tooltip: 'Card Mode',
    onAction: () => {
      document.querySelector('.tox-pop').remove();
      editor.fire('mceCardMode');
    },
    icon: 'card-mode',
    onSetup(api) {
      const elm = editor.selection.getNode();
      api.setActive(elm.getAttribute('mode') === 'card');
      return () => {};
    }
  });

  editor.ui.registry.addToggleButton('insidelink', {
    tooltip: 'Inside Mode',
    onAction: () => {
      document.querySelector('.tox-pop').remove();
      editor.fire('mceInsideMode');
    },
    icon: 'insert-mode',
    onSetup(api) {
      const elm = editor.selection.getNode();
      api.setActive(elm.getAttribute('mode') === 'insert');
      return () => {};
    }
  });

  editor.ui.registry.addToggleButton('normallink', {
    tooltip: 'Normal Mode',
    onAction: () => {
      // @ts-ignore
      editor.selection.getNode().click();
      editor.fire('mceNormalMode');
      document.querySelector('.tox-pop').remove();
    },
    icon: 'normal-link',
    onSetup(api) {
      const elm = editor.selection.getNode();
      api.setActive(elm.getAttribute('mode') === 'normal');
      return () => {};
    }
  });

  editor.ui.registry.addButton('copylink', {
    tooltip: 'Copy Link',
    onAction: Actions.copyLink(editor),
    icon: 'copy-link',
  });

  editor.ui.registry.addButton('deletelink', {
    tooltip: 'Delete Link',
    icon: 'link-remove',
    onAction: Actions.deleteLink(editor),
  });
  // cherry-customized--end
};

const setupMenuItems = function (editor: Editor) {
  editor.ui.registry.addMenuItem('openlink', {
    text: 'Open link',
    icon: 'new-tab',
    onAction: Actions.gotoSelectedLink(editor),
    onSetup: Actions.toggleEnabledState(editor)
  });

  editor.ui.registry.addMenuItem('link', {
    icon: 'link',
    text: 'Link...',
    shortcut: 'Meta+K',
    onAction: Actions.openDialog(editor)
  });

  editor.ui.registry.addMenuItem('unlink', {
    icon: 'unlink',
    text: 'Remove link',
    onAction: () => Utils.unlink(editor),
    onSetup: Actions.toggleUnlinkState(editor)
  });
};

const setupContextMenu = function (editor: Editor) {
  const inLink = 'link unlink openlink';
  const noLink = 'link';
  editor.ui.registry.addContextMenu('link', {
    update: (element) => Utils.hasLinks(editor.dom.getParents(element, 'a') as HTMLAnchorElement[]) ? inLink : noLink
  });
};

const setupContextToolbar = function (editor: Editor) {
  const linkToolbar = Settings.getToolbarItems(editor);
  editor.ui.registry.addContextToolbar('link', {
    items: linkToolbar,
    predicate: (elem) => {
      const isShowEntityLink = Utils.isLink(elem) && Utils.isTapdLink(elem, editor) && elem.getAttribute('is-tapdlink') === 'true';
      return isShowEntityLink;
    },
    position: 'node',
    scope: 'node'
  });
};

// cherry-customized--start
const setupContextPopover = function (editor: Editor) {
  editor.ui.registry.addPopover('link', {
    predicate: (elem) => {
      const isShowEntityLink = Utils.isLink(elem) && Utils.isTapdLink(elem, editor);
      return isShowEntityLink;
    },
    position: 'node',
    scope: 'node',
    matchClass: [ 'show-popover' ],
  });
};
// cherry-customized--end

const setupContextToolbars = function (editor: Editor) {
  const collapseSelectionToEnd = function (editor: Editor) {
    editor.selection.collapse(false);
  };

  const onSetupLink = (buttonApi: InlineContent.ContextFormButtonInstanceApi) => {
    const node = editor.selection.getNode();
    buttonApi.setDisabled(!Utils.getAnchorElement(editor, node));
    return () => { };
  };

  editor.ui.registry.addContextForm('quicklink', {
    launch: {
      type: 'contextformtogglebutton',
      icon: 'link',
      tooltip: 'Link',
      onSetup: Actions.toggleActiveState(editor)
    },
    label: 'Link',
    predicate: (node) => !!Utils.getAnchorElement(editor, node) && Settings.hasContextToolbar(editor),
    initValue: () => {
      const elm = Utils.getAnchorElement(editor);
      return !!elm ? Utils.getHref(elm) : '';
    },
    commands: [
      {
        type: 'contextformtogglebutton',
        icon: 'link',
        tooltip: 'Link',
        primary: true,
        onSetup: (buttonApi) => {
          const node = editor.selection.getNode();
          // TODO: Make a test for this later.
          buttonApi.setActive(!!Utils.getAnchorElement(editor, node));
          return Actions.toggleActiveState(editor)(buttonApi);
        },
        onAction: (formApi) => {
          const anchor = Utils.getAnchorElement(editor);
          const value = formApi.getValue();
          if (!anchor) {
            const attachState = { href: value, attach: () => { } };
            const onlyText = Utils.isOnlyTextSelected(editor);
            const text: Optional<string> = onlyText ? Optional.some(Utils.getAnchorText(editor.selection, anchor)).filter((t) => t.length > 0).or(Optional.from(value)) : Optional.none();
            Utils.link(editor, attachState, {
              href: value,
              text,
              title: Optional.none(),
              rel: Optional.none(),
              target: Optional.none(),
              class: Optional.none()
            });
            formApi.hide();
          } else {
            editor.undoManager.transact(() => {
              editor.dom.setAttrib(anchor, 'href', value);
              collapseSelectionToEnd(editor);
              formApi.hide();
            });
          }
        }
      },
      {
        type: 'contextformbutton',
        icon: 'unlink',
        tooltip: 'Remove link',
        onSetup: onSetupLink,
        // TODO: The original inlite action was quite complex. Are we missing something with this?
        onAction: (formApi) => {
          Utils.unlink(editor);
          formApi.hide();
        }
      },
      {
        type: 'contextformbutton',
        icon: 'new-tab',
        tooltip: 'Open link',
        onSetup: onSetupLink,
        onAction: (formApi) => {
          Actions.gotoSelectedLink(editor)();
          formApi.hide();
        }
      }
    ]
  });
};

export {
  setupButtons,
  setupMenuItems,
  setupContextMenu,
  setupContextToolbars,
  setupContextToolbar,
  setupContextPopover
};
