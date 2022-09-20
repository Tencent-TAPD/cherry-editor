/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from "tinymce/core/api/PluginManager";
import Editor from "tinymce/core/api/Editor";
import { NestedMenuItemContents } from "../../../../../../bridge/src/main/ts/ephox/bridge/components/menu/NestedMenuItem";

import storyIcon from "./icons/choose_workitem_story";
import bugIcon from "./icons/choose_workitem_bug";
import taskIcon from "./icons/choose_workitem_task";
import chooseWorkItemLogo from "./icons/choose_workitem";
import deleteICON from "./icons/choose_workitem_delete";

function composedPath(event) {
  if (event.path) {
    return event.path;
  }
  try {
    return event.composedPath();
  } catch (e) {
    const path = [];
    let el = event.target;
    while (el) {
      path.push(el);
      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);
        return path;
      }
      el = el.parentElement;
    }
    return path;
  }
}
export default () => {
  PluginManager.add("cherry-choose-workitem", function plugin(editor: Editor) {
    editor.ui.registry.addIcon("workitem_story_icon", storyIcon);
    editor.ui.registry.addIcon("workitem_bug_icon", bugIcon);
    editor.ui.registry.addIcon("workitem_task_icon", taskIcon);
    editor.ui.registry.addIcon("choose_workitem_logo", chooseWorkItemLogo);
    editor.ui.registry.addIcon("workitem_delete_icon", deleteICON);
    const defaultType = "delete";
    const defaultList = {
      choose: {
        name: "Choose story",
      },
      change: {
        name: "Again insert",
      },
      show: {
        name: "Show field",
      },
    };
    const defaultBubbleMenu =
      "ch-workitem__change | ch-workitem__show | ch-workitem__delete";
    const workitemList = {
      delete: {
        name: "delete",
        icon: deleteICON,
        iconName: "workitem_delete_icon",
        color: "rgb(222, 53, 11)",
        background: "rgb(255, 235, 230)",
      },
    };
    editor.on('click', function (event) {
      function getCherryModuleEventInfo(event) {
        let eventflag = '';
        const path = composedPath(event);

        for (let index = path.length - 1; index >= 0; index--) {
          const element = path[index];
          if (!element.getAttribute) {
            continue;
          }

          if (element.getAttribute('cm-eventflag')) {
            eventflag = element.getAttribute('cm-eventflag');
          }
        }
        return {
          eventflag,
        };
      };
      const value = getCherryModuleEventInfo(event);
      const targetDom = getCurrentChooseWorkItemTable();
      if (value.eventflag === 'refreshWorkItemBlock') {
        editor.fire('refreshWorkItemBlockEvent', { editor: editor, workitemBlockNode: targetDom });
      }
    });
    editor.ui.registry.addMenuButton("ch-choose-workitem", {
      icon: "choose_workitem_logo",
      tooltip: "WorkItem",
      fetch: function (callback) {
        const items = [
          {
            icon: "workitem_story_icon",
            type: "togglemenuitem",
            text: "Story",
            onAction: function () {
              editor.fire("createChooseWorkItemStoryEvent", { editor: editor });
            },
          },
          {
            icon: "workitem_bug_icon",
            type: "togglemenuitem",
            text: "Bug",
            onAction: function () {
              editor.fire("createChooseWorkItemBugEvent", { editor: editor });
            },
          },
          {
            icon: "workitem_task_icon",
            type: "togglemenuitem",
            text: "Task",
            onAction: function () {
              editor.fire("createChooseWorkItemTaskEvent", { editor: editor });
            },
          },
        ] as NestedMenuItemContents[];
        callback(items);
      },
    });
    const isWorkItemBlock = function (dom) {
      if (
        editor.dom.is(dom, "div") &&
        editor.dom.hasClass(dom, "cherry-choose-workitem")
      ) {
        return true;
      }
      return false;
    };
    // 获取光标所在的业务对象表格
    const getCurrentChooseWorkItemTable = function () {
      const currentNode = editor.selection.getNode();
      let targetDom = null;
      if (
        editor.dom.is(currentNode, "div") &&
        editor.dom.hasClass(currentNode, "cherry-choose-workitem")
      ) {
        targetDom = currentNode;
      } else {
        const parentDom = editor.dom.getParent(
          currentNode,
          "div.cherry-choose-workitem"
        );
        if (parentDom) {
          targetDom = parentDom;
        }
      }
      if (
        !targetDom ||
        !editor.dom.hasClass(targetDom, "cherry-choose-workitem")
      ) {
        return false;
      }
      return targetDom;
    };
    // 删除业务对象表格
    const remove = function () {
      const targetDom = getCurrentChooseWorkItemTable();
      editor.dom.remove(targetDom);
    };
    editor.addCommand("changeWorkItemBlock", function (ui, type) {
      if (type === void 0) {
        type = defaultType;
      }
    });
    editor.addCommand("showWorkItemBlock", function (ui, { key, targetDom }) {
      if (key == "show") {
        editor.fire("createWorkItemShowFileds", {
          editor: editor,
          workitemBlockNode: targetDom,
        });
      } else if (key == "change") {
        editor.fire("changeWorkItemShowFileds", {
          editor: editor,
          workitemBlockNode: targetDom,
        });
      }
    });
    editor.addCommand("removeWorkItemBlock", function () {
      remove();
    });

    // 注册bubble menu 按钮组
    editor.ui.registry.addContextToolbar("chooseworkitem_toolbar", {
      predicate: function (node) {
        return isWorkItemBlock(node);
      },
      items: editor.getParam("chooseworkitem_toolbar", defaultBubbleMenu),
      position: "node",
      scope: "node",
    });
    // 注册bubble menu 按钮组里的具体按钮
    Object.keys(defaultList).forEach((key) => {
      editor.ui.registry.addToggleButton(`ch-workitem__${key}`, {
        text: defaultList[key].name,
        tooltip: `${defaultList[key].name}`,
        onAction() {
          const targetDom = getCurrentChooseWorkItemTable();
          editor.execCommand("showWorkItemBlock", true, { key, targetDom });
        },
      });
    });
    editor.ui.registry.addToggleButton("ch-workitem__delete", {
      icon: workitemList.delete.iconName,
      tooltip: "Delete workitem block",
      onAction: function () {
        editor.execCommand("removeWorkItemBlock");
      },
    });
  });
};
