/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isTouchSupported } from './touch-supported';

export default function placeCaretAtEnd(el: HTMLElement) {
  if (isTouchSupported) {
    return;
  }

  el.focus();
  if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    // @ts-ignore
  } else if (typeof document.body.createTextRange !== 'undefined') {
    // @ts-ignore
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}
