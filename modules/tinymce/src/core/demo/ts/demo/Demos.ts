/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import AnnotationsDemo from './AnnotationsDemo';
import CommandsDemo from './CommandsDemo';
import ContentEditableFalseDemo from './ContentEditableFalseDemo';
import CustomThemeDemo from './CustomThemeDemo';
import FixedToolbarContainerDemo from './FixedToolbarContainerDemo';
import FullDemo from './FullDemo';
import IframeDemo from './IframeDemo';
import InlineDemo from './InlineDemo';
import ResponsiveDemo from './ResponsiveDemo';
import ShadowDomDemo from './ShadowDomDemo';
import ShadowDomInlineDemo from './ShadowDomInlineDemo';
import SourceDumpDemo from './SourceDumpDemo';
import StickyToolbarDemo from './StickyToolbarDemo';
import TinyMceDemo from './TinyMceDemo';
import CherryDemo from './CherryDemo';

declare const window: any;

window.demos = {
  CherryDemo,
  CommandsDemo,
  ContentEditableFalseDemo,
  CustomThemeDemo,
  IframeDemo,
  InlineDemo,
  FixedToolbarContainerDemo,
  FullDemo,
  TinyMceDemo,
  AnnotationsDemo,
  SourceDumpDemo,
  ResponsiveDemo,
  StickyToolbarDemo,
  ShadowDomDemo,
  ShadowDomInlineDemo
};
