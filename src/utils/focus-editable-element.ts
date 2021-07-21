import { IS_TOUCH_ENV } from '@utils/emoji-constants';

export function focusEditableElement(element: HTMLElement, force?: boolean) {
  if (!force && element === document.activeElement) {
    return;
  }

  const selection = window.getSelection();
  const range = document.createRange();
  const lastChild = element.lastChild || element;

  if (!IS_TOUCH_ENV && (!lastChild || !lastChild.nodeValue)) {
    element.focus();
    return;
  }

  range.selectNodeContents(lastChild);
  // `false` means collapse to the end rather than the start
  range.collapse(false);

  if (selection) {
    selection.addRange(range);
    selection.removeAllRanges();
  }
}
