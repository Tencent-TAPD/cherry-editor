/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

import PluginManager from 'tinymce/core/api/PluginManager';
import tipsICON from './icons/panel-block-icon-tips';
import infoICON from './icons/panel-block-icon-info';
import okICON from './icons/panel-block-icon-ok';
import warningICON from './icons/panel-block-icon-warning';
import errorICON from './icons/panel-block-icon-error';
import deleteICON from './icons/panel-block-icon-delete';


export default () => {
  PluginManager.add('cherry-panel', function plugin(editor) {
    const defaultType = 'tips';
  	const defaultBubbleMenu = 'cherry-panel__tips cherry-panel__info cherry-panel__ok cherry-panel__warning cherry-panel__error | cherry-panel__delete';
  	const panelList = {
  		tips: { name: 'tips', icon: tipsICON, iconName: 'panel-block-icon-tips', color: '#3582FB', background: '#EBF3FE' },
  		info: { name: 'info', icon: infoICON, iconName: 'panel-block-icon-info', color: '#8091A5', background: '#F8F8F8' },
  		ok: { name: 'ok', icon: okICON, iconName: 'panel-block-icon-ok', color: '#56BD5B', background: '#EDF9EF' },
  		warning: { name: 'warning', icon: warningICON, iconName: 'panel-block-icon-warning', color: '#FFBF4D', background: '#FFEED6' },
  		error: { name: 'error', icon: errorICON, iconName: 'panel-block-icon-error', color: '#F85E5E', background: '#FFEFEF' },
  		delete: { name: 'delete', icon: deleteICON, iconName: 'panel-block-icon-delete', color: 'rgb(222, 53, 11)', background: 'rgb(255, 235, 230)' },
  	};
    // 获取可以插入到富文本中的信息版icon
  	const getPanelIconShowInIframe = function (type = defaultType) {
  		const panel = panelList[type] ? panelList[type] : panelList[defaultType];
  		return panel.icon.replace(/<svg version=/g, '<svg style="width:inherit;color:inherit;height:inherit;" version=');
  	};

  	// 获取可以插入到toolbar中的信息版 icon
  	const getPanelIconShowInToolbar = function (type = defaultType) {
  		const panel = panelList[type] ? panelList[type] : panelList[defaultType];
  		return panel.icon.replace(/<svg version=/g, '<svg style="width:16px;color:inherit;height:16px;" version=');
  	};

    const panelTemplate = function (type = defaultType, html = null) {
    	const panel = panelList[type] ? panelList[type] : panelList[defaultType];
    	const selected = html ? html : editor.selection.getContent();
    	const icon = getPanelIconShowInIframe(type);
      return `
			<div contenteditable="false" data-panel-type="${type}" class="cherry-panel-block" 
				style="
					position: relative;
					border-radius: 3px;
					margin: 0.75rem 0px 0px;
					padding: 8px;
					word-break: break-word;
					transition:all 0.3s ease 0s;
					background-color: ${panel.background};
					cursor: pointer;
				"
			>
				<div contenteditable="true" class="cherry-panel-block__content" 
					style="
						display:inline-block;
						width: calc(100% - 35px);
						padding-left: 35px;
						outline:none;
						position: relative;
					"
				>
					<div contenteditable="false" class="cherry-panel-block__left" 
						style="
							display:inline-block;
							width:20px;
							vertical-align: top;
							outline: none;
							cursor: pointer;
							position: absolute;
							top: 0;
							left: 5px;
						"
					>
						<span contenteditable="false" class="cherry-panel-block__icon" style="width:16px;vertical-align: middle;color:${panel.color}">${icon}</span>
					</div>
					${selected ? selected : '<p><br></p>'}
				</div>
			</div>
		`;
    };
    // 获取光标所在的信息面板
    const getCurrentPanelBlock = function () {
    	const currentNode = editor.selection.getNode();
    	let targetDom = null;
    	if (editor.dom.is(currentNode, 'div') && editor.dom.hasClass(currentNode, 'cherry-panel-block')) {
        targetDom = currentNode;
      } else {
        const parentDom = editor.dom.getParent(currentNode, 'div.cherry-panel-block');
        if (parentDom) {
          targetDom = parentDom;
        }
      }
      if (!targetDom || !editor.dom.hasClass(targetDom, 'cherry-panel-block')) {
        return false;
      }
      return targetDom;
    };

    const getCurrentPanelBlockLeft = function () {
    	const currentNode = editor.selection.getNode();
    	let targetDom = null;
    	if (editor.dom.is(currentNode, 'div') && editor.dom.hasClass(currentNode, 'cherry-panel-block__left')) {
        targetDom = currentNode;
      } else {
        const parentDom = editor.dom.getParent(currentNode, 'div.cherry-panel-block__left');
        if (parentDom) {
          targetDom = parentDom;
        }
      }
      if (!targetDom || !editor.dom.hasClass(targetDom, 'cherry-panel-block__left')) {
        return false;
      }
      return targetDom;
    };

    // 获取光标所在的信息面板的类型
    const getCurrentPanelBlockType = function (obj = null) {
    	if (!obj) {
    		obj = getCurrentPanelBlock();
    	}
    	return editor.dom.getAttrib(obj, 'data-panel-type', defaultType);
    };

    // 插入新信息面板
    const insert = function (type = defaultType) {
      const isAlreadyPanelBlock = getCurrentPanelBlock();
      if (isAlreadyPanelBlock) {
        return false;
      }
      editor.undoManager.transact(function () {
        editor.insertContent(panelTemplate(type));
        const newNode = getCurrentPanelBlock();
        const targetNode = editor.dom.select('div.cherry-panel-block__content', newNode);
        editor.selection.select(targetNode[0], true);
        editor.nodeChanged();
      });
    };

    const highlight = function (isHighlight = true) {
      const targetDom = getCurrentPanelBlock();
      if (editor.dom.hasClass(targetDom, 'cherry-panel-block__highlight')) {
        if (!isHighlight) {
          editor.dom.removeClass(targetDom, 'cherry-panel-block__highlight');
        }
      } else {
        if (isHighlight) {
          editor.dom.addClass(targetDom, 'cherry-panel-block__highlight');
        }
      }
    };

    // 修改信息面板的类型
    const change = function (type = defaultType) {
    	const panel = panelList[type] ? panelList[type] : panelList[defaultType];
    	const targetDom = getCurrentPanelBlock();
      const currentType = getCurrentPanelBlockType(targetDom);
      if (currentType == panel.name) {
        return false;
      }
      editor.dom.setAttrib(targetDom, 'data-panel-type', panel.name);
      editor.dom.setStyle(targetDom, 'background-color', panel.background);
      const spanDoms = editor.dom.select('span.cherry-panel-block__icon', targetDom);
      for (const oneSpanDom of spanDoms) {
        editor.dom.setStyle(oneSpanDom, 'color', panel.color);
        editor.dom.setHTML(oneSpanDom, getPanelIconShowInIframe(type));
      }
      editor.nodeChanged();
    };

    // 删除信息面板
    const remove = function (removeAll = true) {
    	const targetDom = getCurrentPanelBlock();
    	if (removeAll) {
    		editor.dom.remove(targetDom);
    	} else {
	    	const lefts = editor.dom.select('div.cherry-panel-block__left', targetDom);
	    	for (const left of lefts) {
	    		editor.dom.remove(left);
	    	}
	    	const contents = editor.dom.select('div.cherry-panel-block__content', targetDom);
	    	const content = contents[0]  ? contents[0] : editor.dom.create('br');
	    	editor.dom.remove(targetDom);
	    	editor.insertContent(content.innerHTML);
    	}
    	editor.nodeChanged();
    };

    // 修正光标，不让光标出现在panelblock > div.cherry-panel-block__content 之外的地方
    const resetCursor = function () {
    	editor.dom.select('div.cherry-panel-block__content').forEach((dom) => {
    		if (editor.dom.getAttrib(dom, 'contenteditable') != 'true') {
          editor.dom.setAttrib(dom, 'contenteditable', 'true');
    		}
      });
    	const selected = getCurrentPanelBlock();
    	if (selected === false) {
    		return false;
    	}
    	const isSelectedContent = getCurrentPanelBlockLeft();
    	if (isSelectedContent === false) {
    		return false;
    	}
    	editor.selection.select(selected, false);
    };

    // 连续两个换行自动拆成两个信息面板，或者自动结束面板
    const listenEnter = function (e) {
    	if (e.key == 'Enter' && !e.ctrlKey) {
    		const isPanelBlock = getCurrentPanelBlock();
    		if (isPanelBlock === false) {
    			return true;
    		}
    		const currentNode = editor.selection.getNode() as HTMLElement;
    		const prevNode = currentNode.previousSibling as HTMLElement;
    		let nextNode = currentNode.nextSibling as HTMLElement;
    		if (currentNode.tagName.toLowerCase() == 'p' && prevNode.tagName.toLowerCase() == 'p') {
    			// 连续两个换行
    			if (/^\n$/.test(currentNode.innerText) && /^\n$/.test(prevNode.innerText)) {
    				if (nextNode) {
    					// 如果后面有内容，则拆分信息面板
    					const type = getCurrentPanelBlockType();
    					let allNextNodeHtml = currentNode.outerHTML + nextNode.outerHTML;
    					editor.dom.remove(prevNode);
    					editor.dom.remove(currentNode);
    					while (nextNode.nextSibling) {
    						const tmpNode = nextNode;
    						nextNode = nextNode.nextSibling as HTMLElement;
    						editor.dom.remove(tmpNode);
    						allNextNodeHtml += nextNode.outerHTML;
    					}
    					editor.dom.remove(nextNode);
    					const newPanel = panelTemplate(type, allNextNodeHtml);
    					const newLine = editor.dom.create('p', {}, '<br>');
    					editor.dom.insertAfter(newLine, isPanelBlock);
    					editor.selection.select(newLine, true);
    					editor.insertContent(newPanel);
    					const newPanelNode = getCurrentPanelBlock();
    					if (newPanelNode) {
    						const firstP = editor.dom.select('div.cherry-panel-block__content p:first', newPanelNode);
    						if (firstP) {
    							editor.selection.select(firstP[0], true);
    						}
    					}
    					editor.nodeChanged();
    				} else {
    					// 退出信息面板
    					editor.dom.remove(currentNode);
    					editor.dom.remove(prevNode);
    					const newLine = editor.dom.create('p', {}, '<br>');
    					editor.dom.insertAfter(newLine, isPanelBlock);
              editor.selection.select(newLine, true);
              editor.nodeChanged();
    				}
    			}
    		} else if (isBrLine(currentNode) && isLastChild(currentNode) && isBrLine(prevNode)) {
          // 退出信息面板
          editor.dom.remove(currentNode);
          editor.dom.remove(prevNode);
          const newLine = editor.dom.create('p', {}, '<br>');
          editor.dom.insertAfter(newLine, isPanelBlock);
          editor.selection.select(newLine, true);
          editor.nodeChanged();
        }
    	}
    };

    const isPanelBlock = function (dom) {
    	if (editor.dom.is(dom, 'div') && editor.dom.hasClass(dom, 'cherry-panel-block')) {
    		return true;
    	}
    	return false;
    };

    const isBrLine = (element) => {
      return element.childNodes.length === 1 &&  element.childNodes[0].tagName.toLowerCase() === 'br';
    }
    const isLastChild = (element) => {
      if (editor.dom.hasClass(element, 'cherry-panel-block__content')) {
        return true;
      }
      while (!element.nextSibling) {
        element = element.parentNode;
        if (editor.dom.hasClass(element, 'cherry-panel-block__content')) {
          return true;
        }
      }
      return !element.nextSibling;
    }

    // editor.on('nodeChange', (e) => {
    // 	const targetPanel = getCurrentPanelBlock();
    // 	if (targetPanel === false) {
    // 		return ;
    // 	}
    // 	let leftIcons = editor.dom.select('div.cherry-panel-block__left', targetPanel);
    // 	leftIcons = leftIcons ? leftIcons[0] : false;
    // 	let rightDoms = editor.dom.select('.cherry-panel-block__content>*:not(.cherry-panel-block__left)', targetPanel);
    // 	rightDoms = rightDoms ? rightDoms[0] : false;
    // });

    editor.on('click', (e) => {
    	resetCursor();
    });

    editor.on('keyup', (e) => {
      resetCursor();
      listenEnter(e);
    });

    // 注册命令
    editor.addCommand('insertCherryPanel', function () {
      insert(defaultType);
    });

    editor.addCommand('changeCherryPanel', function (ui, type = defaultType) {
      change(type);
    });

    editor.addCommand('removeCherryPanel', function () {
      remove(true);
    });

    editor.addCommand('cleanCherryPanel', function () {
      remove(false);
    });

    // 注册toolbar 按钮
    editor.ui.registry.addIcon(panelList[defaultType].iconName, getPanelIconShowInToolbar());
    editor.ui.registry.addToggleButton('ch-panel', {
      icon: panelList[defaultType].iconName,
      tooltip: 'Panel Block',
      onAction (api) {
        if (api.isActive()) {
          editor.execCommand('cleanCherryPanel');
        } else {
          editor.execCommand('insertCherryPanel');
        }
      },
      // @ts-ignore
      onSetup (api) {
        editor.on('nodeChange', () => {
          const isActive = getCurrentPanelBlock() !== false;
          api.setActive(isActive);
        });
      }
    });

    // 注册bubble menu 按钮组
    editor.ui.registry.addContextToolbar('panelblock_toolbar', {
      predicate: node => isPanelBlock(node),

      items: editor.getParam('panelblock_toolbar', defaultBubbleMenu),
      position: 'node',
      scope: 'node'
    });

    // 注册bubble menu 按钮组里的具体按钮
    Object.keys(panelList).forEach((key) => {
    	editor.ui.registry.addIcon(panelList[key].iconName, getPanelIconShowInToolbar(key));
    	if (key != 'delete') {
        editor.ui.registry.addToggleButton(`ch-panel__${key}`, {
          icon: panelList[key].iconName,
          tooltip: `Panel Block ${key}`,
          onAction () {
            editor.execCommand('changeCherryPanel', false, key);
          },
          // @ts-ignore
          onSetup (api) {
            const type = getCurrentPanelBlockType();
            api.setActive(type == key);
          }
        });
    	}
    });
    editor.ui.registry.addToggleButton('ch-panel__delete', {
      icon: panelList.delete.iconName,
      tooltip: 'Panel Block delete',
      onAction () {
        editor.execCommand('removeCherryPanel');
      },
      // @ts-ignore
      onSetup (api) {
        let dom = document.querySelector('.tox-tbtn[aria-label="Panel Block delete"]') as HTMLElement;
        dom = dom ? dom : document.querySelector('.tox-tbtn[aria-label="删除"]');
        if (!dom) {
          return true;
        }
        dom.onmouseenter = () => {
          highlight(true);
        };
        dom.onmouseleave = () => {
          highlight(false);
        };
        return (api) => {
          dom.onmouseenter = null;
          dom.onmouseleave = null;
        };
      }
    });
  });
};
