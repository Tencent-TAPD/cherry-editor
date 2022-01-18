/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 */

export default (editor) => {
  const defaultTable = 10;
  const removeGrid = function () {
    const grid = editor.editorContainer.getElementsByClassName("tox-collection--list");
    if (!grid.length) {
      return;
    }
    grid[0].parentNode.removeChild(grid[0]);
    gridWidth = 0;
    left = 0;
    top = 0;
    tablePicker = null;
  };

  let top;
  let left;
  function onSetup(editor) {
    editor.editorContainer
      .getElementsByClassName("tox-editor-header")[0]
      .addEventListener("click", function (e) {
        removeGrid();
        const bar = editor.editorContainer;
        // @ts-ignore
        const parent = e.target.closest(".tox-tbtn");
        if (parent) {
          left = parent.offsetLeft;
          let current = parent.offsetParent;
          while (current !== bar && parent !== bar) {
            left += current.offsetLeft;
            current = current.offsetParent;
          }

          top = parent.offsetTop;
          current = parent.offsetParent;
          while (current !== bar && parent !== bar) {
            top += current.offsetTop + current.clientTop;
            current = current.offsetParent;
          }
          top += parent.getBoundingClientRect().height;
        }
      });
    editor.on("click", function () {
      removeGrid();
    });
    editor.on("mousemove", function (e) {
      mouseMoveEvent(e, true);
    });
  }


  let tablePicker;
  let gridWidth;
  let offsetLeft = 0;
  let offsetTop = 0;
  const mouseMoveEvent = function (e, isEditor = false) {
    if (
      !editor.editorContainer
      || !document.body.contains(editor.editorContainer)
      || !editor.editorContainer.getElementsByClassName("tox-collection--list").length
    ) {
      return;
    }
    if (!left || !top) {
      return;
    }
    const bar = editor.editorContainer;
    const parent = e.target;

    if (parent && !isEditor) {
      let left1;
      let left2 = 0;
      let top1;
      let top2 = 0;
      left1 = parent.offsetLeft;
      let current = parent.offsetParent;
      while (current) {
        if (current == bar) {
          left2 = left1;
        }
        left1 += current.offsetLeft;
        current = current.offsetParent;
      }

      top1 = parent.offsetTop;
      current = parent.offsetParent;
      while (current) {
        if (current == bar) {
          top2 = top1;
        }
        top1 += current.offsetTop + current.clientTop;
        current = current.offsetParent;
      }
      offsetTop = top1 - top2;
      offsetLeft = left1 - left2;
    }
    let row;
    let col;
    if (isEditor) {
      row = Math.ceil(
        (e.clientX -
          left +
          5 +
          parseInt(
            window
              .getComputedStyle(document.body, null)
              .marginLeft.replace("px", "")
          )) /
          17
      );
      col = Math.ceil((e.clientY - top + 10) / 17);
    } else {
      row = Math.ceil(
        (e.clientX -
          offsetLeft -
          left +
          5 +
          parseInt(
            window
              .getComputedStyle(document.body, null)
              .marginLeft.replace("px", "")
          )) /
          17
      );
      col = Math.ceil((e.clientY - offsetTop - top + 10) / 17);
    }

    row = row >= 20 ? 20 : row;
    col = col >= 20 ? 20 : col;

    const selectRow = row > 0 ? row : 0;
    const selectCol = col > 0 ? col : 0;
    row = row >= defaultTable ? row : defaultTable;
    col = col >= defaultTable ? col : defaultTable;
    gridWidth = row * 17;

    const picker = (editor.editorContainer.getElementsByClassName(
      "tox-insert-table-picker"
    ) as unknown) as HTMLElement[];
    if (picker.length) {
      picker[0].style.width = `${gridWidth}px`;
    }

    const inner = getGrid(row, col, selectRow, selectCol);
    tablePicker = tablePicker
      ? tablePicker
      : editor.editorContainer.getElementsByClassName("tox-insert-table-picker")[0];
    if (tablePicker) {
      tablePicker.innerHTML = inner;
    }
  };

  const adjustEdge = function () {
    const editorWrap = editor.editorContainer.getElementsByClassName('tox-sidebar-wrap')[0]
    const editorWidth = editorWrap.offsetWidth; // 编辑区域宽度
    const cellWidth = 17; // 每个小格子宽度
    const maxAmount = 20; // 每一行小格子最大数量
    const tableWrapMaxWidth = cellWidth * maxAmount;
    if (left + tableWrapMaxWidth > editorWidth) {
      // 如果超出边界，调整表格选择区域位置
      left = editorWidth - tableWrapMaxWidth
    }
  }

  document.addEventListener('mousemove', mouseMoveEvent);
  editor.on('destroy', () => {
    document.removeEventListener('mousemove', mouseMoveEvent);
  })

  const insertTableEvent = function () {
    editor.editorContainer
      .getElementsByClassName("tox-insert-table-picker")[0]
      .addEventListener("click", (e) => {
        // @ts-ignore
        if (e.target.nodeName !== "DIV") {
          return;
        }
        // @ts-ignore
        const span = e.target.parentNode.lastElementChild;
        const row = parseInt(span.getAttribute("row"));
        const col = parseInt(span.getAttribute("col"));
        if (row && col) {
          const table = editor.plugins.table.insertTable(row, col);
          table.setAttribute("cellpadding", 8);
          table.style.setProperty("width", "75%");
          table.style.setProperty("background-color", "#FFFFFF");
          table.style.setProperty("border-color", "#CED4D9");
          table.setAttribute("border", "2");
          // 防止后面不可点击
          const emptyLine = document.createElement("p");
          emptyLine.innerHTML = "&nbsp;";
          // 套一个元素用来清除浮动
          let temp = document.createElement('div');
          temp.classList.add('tox-clear-float');
          temp.innerHTML = table.outerHTML;
          editor.dom.insertAfter(emptyLine, table);
          editor.dom.insertAfter(temp, table);
          table.remove();
        }

        removeGrid();
      });
  };
  const getGrid = function (row, col, selectRow, selectCol) {
    let button = "";
    if (!selectCol || !selectRow) {
      selectCol = 0;
      selectRow = 0;
    }
    for (let i = 0; i < row * col; i++) {
      if (
        (i + 1) % row <= selectRow &&
        (selectRow === row || (i + 1) % row !== 0) &&
        Math.ceil((i + 1) / row) <= selectCol
      ) {
        button +=
          '<div role="button" style="border-width: 0 0 1px 1px;" class="tox-insert-table-picker__selected" tabindex="-1"></div>';
      } else {
        button +=
          '<div role="button" style="border-width: 0 0 1px 1px;" tabindex="-1"></div>';
      }
    }
    button += `<span class="tox-insert-table-picker__label" row="${selectRow}" col="${selectCol}">${selectRow}×${selectCol}</span>`;
    return button;
  };
  const openGrid = function () {
    const inner = getGrid(defaultTable, defaultTable, 0, 0);
    gridWidth = defaultTable * 17;
    adjustEdge(); // 表格下拉框超出边界就改变下拉框的位置
    const grid = `<div role="menu" class="tox-menu tox-collection tox-collection--list" style="position: absolute; left: ${left}px; top: ${top}px; overflow: hidden auto;z-index: 2000;">
                 <div class="tox-collection__group">
                     <div class="tox-fancymenuitem tox-menu-nav__js">
                         <div class="tox-insert-table-picker" style="width: ${gridWidth}px">
                            ${inner}
                         </div>
                     </div>
                 </div>
            </div>`;
    editor.editorContainer.appendChild(
        new DOMParser()
          .parseFromString(grid, "text/html")
          .getElementsByClassName("tox-collection--list")[0]
      );
    insertTableEvent();
  };

  editor.ui.registry.addButton("ch-table", {
    tooltip: "Table",
    icon: "table-cell",
    onAction: openGrid,
    onSetup() {
      onSetup(editor);
    },
  });
};
