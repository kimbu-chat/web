import { MESSAGE_INPUT_ID } from '@common/constants';

import { getSelectionText } from './get-selection';
import placeCaretAtEnd from './place-caret-at-end';
import { isTouchSupported } from './touch-supported';

export const onKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;

  const messageInput = document.querySelector(`#${MESSAGE_INPUT_ID}`) as HTMLDivElement;

  if (
    messageInput &&
    e.target !== messageInput &&
    target.tagName !== 'INPUT' &&
    !target.hasAttribute('contenteditable') &&
    !isTouchSupported &&
    !(window.innerWidth <= 720) &&
    getSelectionText().length === 0
  ) {
    messageInput.focus();
    placeCaretAtEnd(messageInput);
  }
};
