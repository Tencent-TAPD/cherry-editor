import { ContextBar } from './ContextBar';

export interface ContextPopover extends ContextBar {
  type?: 'contextpopover';
  element?: HTMLElement;
  matchClass: Array<string>;
  disableRule?: (elem: Element) => boolean;
}
