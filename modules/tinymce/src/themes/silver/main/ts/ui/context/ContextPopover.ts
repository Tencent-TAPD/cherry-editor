import { Compare, SugarElement } from '@ephox/sugar';
import { Optional } from '@ephox/katamari';
import Editor from 'tinymce/core/api/Editor';
import { ContextTypes } from 'tinymce/themes/silver/Popover';

type PopoverResult = { elem: SugarElement; popover: ContextTypes };

const getMatchedPopover = (elem: SugarElement, contextPopovers: Array<ContextTypes>, editor: Editor): ContextTypes => {
  const rootElem = SugarElement.fromDom(editor.getBody());
  const isRoot = (elem: SugarElement<Node>) => Compare.eq(elem, rootElem);
  const keys = Object.keys(contextPopovers);
  const focusElem = editor.selection.getNode();

  // 选中的元素不弹出气泡框，避免与toolbar冲突
  if (focusElem === elem.dom) {
    return null;
  }

  for (let i = 0; i < keys.length; i++) {
    const contextPopover = contextPopovers[keys[i]];
    let currentNode = elem.dom;
    if (!contextPopover.predicate(currentNode)) {
      continue;
    }

    const matchClass = contextPopover.matchClass;
    while (currentNode && !isRoot(currentNode)) {
      if (currentNode.className && matchClass.some((item) => currentNode.className.includes(item))) {
        contextPopover.element = currentNode.querySelector('.for-popover').cloneNode(true);

        if (contextPopover.element.nodeName === 'IFRAME') {
          const href = contextPopover.element.getAttribute('data-src');
          contextPopover.element.setAttribute('src', href);
        }

        return contextPopover;
      }
      currentNode = currentNode.parentNode;
    }
  }
  return null;
};

const matchStartNode = (elem: SugarElement, contextPopovers: Array<ContextTypes>, editor: Editor): Optional<PopoverResult> => {
  const matchedPopover = getMatchedPopover(elem, contextPopovers, editor);
  if (matchedPopover) {
    return Optional.some({ elem, popover: matchedPopover });
  }
  return Optional.none();
};

const lookup = (editor: Editor, contextPopovers: Array<ContextTypes>, targetNode: Element): Optional<PopoverResult> => {
  const startNode = SugarElement.fromDom(targetNode);
  return matchStartNode(startNode, contextPopovers, editor);
};

export {
  lookup
};
