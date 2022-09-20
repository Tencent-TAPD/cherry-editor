import {
  AlloyComponent,
  AlloySpec,
  AnchorSpec, Bubble,
  GuiFactory, InlineView, Layout, LayoutInside, MaxHeight, MaxWidth
} from '@ephox/alloy';
import { Cell, Id, Merger, Optional } from '@ephox/katamari';
import { InlineContent } from '@ephox/bridge';
import { SugarElement } from '@ephox/sugar';
import { PlatformDetection } from '@ephox/sand';
import Editor from 'tinymce/core/api/Editor';
import { renderPopover } from 'tinymce/themes/silver/ui/toolbar/CommonToolbar';
import { UiFactoryBackstage } from 'tinymce/themes/silver/backstage/Backstage';
import Delay from 'tinymce/core/api/util/Delay';
import { getContextToolbarBounds } from 'tinymce/themes/silver/ui/context/ContextToolbarBounds';
import { renderContextPopover } from 'tinymce/themes/silver/ui/context/ContextUi';
import { lookup } from 'tinymce/themes/silver/ui/context/ContextPopover';

export type ContextTypes = InlineContent.ContextPopover;

interface Extras {
  backstage: UiFactoryBackstage;
}

const bubbleSize = 12;
const bubbleAlignments = {
  valignCentre: [],
  alignCentre: [],
  alignLeft: [ 'tox-pop--align-left' ],
  alignRight: [ 'tox-pop--align-right' ],
  right: [ 'tox-pop--right' ],
  left: [ 'tox-pop--left' ],
  bottom: [ 'tox-pop--bottom' ],
  top: [ 'tox-pop--top' ]
};

const anchorOverrides = {
  maxHeightFunction: MaxHeight.expandable(),
  maxWidthFunction: MaxWidth.expandable()
};

// On desktop we prioritise north-then-south because it's cleaner, but on mobile we prioritise south to try to avoid overlapping with native context toolbars
const desktopAnchorSpecLayouts = {
  onLtr: () => [ Layout.north, Layout.south, Layout.northeast, Layout.southeast, Layout.northwest, Layout.southwest,
    LayoutInside.north, LayoutInside.south, LayoutInside.northeast, LayoutInside.southeast, LayoutInside.northwest, LayoutInside.southwest ],
  onRtl: () => [ Layout.north, Layout.south, Layout.northwest, Layout.southwest, Layout.northeast, Layout.southeast,
    LayoutInside.north, LayoutInside.south, LayoutInside.northwest, LayoutInside.southwest, LayoutInside.northeast, LayoutInside.southeast ]
};

const mobileAnchorSpecLayouts = {
  onLtr: () => [ Layout.south, Layout.southeast, Layout.southwest, Layout.northeast, Layout.northwest, Layout.north,
    LayoutInside.north, LayoutInside.south, LayoutInside.northeast, LayoutInside.southeast, LayoutInside.northwest, LayoutInside.southwest ],
  onRtl: () => [ Layout.south, Layout.southwest, Layout.southeast, Layout.northwest, Layout.northeast, Layout.north,
    LayoutInside.north, LayoutInside.south, LayoutInside.northwest, LayoutInside.southwest, LayoutInside.northeast, LayoutInside.southeast ]
};

const getAnchorLayout = (position: InlineContent.ContextPosition, isTouch: boolean): Partial<AnchorSpec> => {
  if (position === 'line') {
    return {
      bubble: Bubble.nu(bubbleSize, 0, bubbleAlignments),
      layouts: {
        onLtr: () => [ Layout.east ],
        onRtl: () => [ Layout.west ]
      },
      overrides: anchorOverrides
    };
  } else {
    return {
      bubble: Bubble.nu(0, bubbleSize, bubbleAlignments),
      layouts: isTouch ? mobileAnchorSpecLayouts : desktopAnchorSpecLayouts,
      overrides: anchorOverrides
    };
  }
};

const register = (editor: Editor, registryContextPopovers, sink: AlloyComponent, extras: Extras) => {
  const isTouch = PlatformDetection.detect().deviceType.isTouch;
  const getBounds = () => getContextToolbarBounds(editor, extras.backstage.shared);

  const buildPopover = (popovers: ContextTypes): AlloySpec => {
    return renderPopover({
      uid: Id.generate('context-popover'),
      onEscape: Optional.none,
      hoverElements: popovers.element
    });
  };

  const contextPopover = GuiFactory.build(
    renderContextPopover({
      sink,
      onEscape: () => {
        editor.focus();
        return Optional.some(true);
      }
    })
  );

  const getAnchor = (position: InlineContent.ContextPosition, element: Optional<SugarElement>): AnchorSpec => {
    const anchorage = position === 'node' ? extras.backstage.shared.anchors.node(element) : extras.backstage.shared.anchors.cursor();
    return Merger.deepMerge(
      anchorage,
      getAnchorLayout(position, isTouch())
    );
  };

  const launchContext = (popover: ContextTypes, elem: Optional<Element>) => {
    const popoverSpec = buildPopover(popover);
    const sElem = elem.map(SugarElement.fromDom);
    const anchor = getAnchor(popover.position, sElem);
    InlineView.showWithinBounds(contextPopover, anchor, wrapInPopDialog(popoverSpec), () => Optional.some(getBounds()));
  };

  const timer = Cell(null);

  const wrapInPopDialog = (toolbarSpec: AlloySpec) => ({
    dom: {
      tag: 'div',
      classes: [ 'tox-pop__dialog' ]
    },
    components: [ toolbarSpec ],
  });

  const launchPopover = (targetNode) => {
    lookup(editor, registryContextPopovers, targetNode).fold(
      () => {
        InlineView.hide(contextPopover);
      },
      (info) => {
        launchContext(info.popover, Optional.some(info.elem.dom));
      }
    );
  };

  const clearTimer = () => {
    const current = timer.get();
    if (current !== null) {
      Delay.clearTimeout(current);
      timer.set(null);
    }
  };

  const resetTimer = (t) => {
    clearTimer();
    timer.set(t);
  };

  editor.on('init', () => {
    editor.on('mouseover', (event) => {
      resetTimer(
        Delay.setEditorTimeout(editor, () => launchPopover(event.target), 100)
      );
    });
    editor.on('mouseLeave', () => {
      clearTimer();
    });
    editor.on('focus click', (event) => {
      resetTimer(
        Delay.setEditorTimeout(editor, () => InlineView.hide(contextPopover), 500)
      );
    });
  });
};

export { register };
