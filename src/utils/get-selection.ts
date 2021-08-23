export const getSelectionText = (): string => {
  let text = '';
  const activeEl = document.activeElement;
  const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    activeElTagName === 'textarea' ||
    (activeElTagName === 'input' &&
      /^(?:text|search|password|tel|url)$/i.test((activeEl as HTMLInputElement).type) &&
      typeof (activeEl as HTMLInputElement)?.selectionStart === 'number')
  ) {
    text = (activeEl as HTMLInputElement).value.slice(
      (activeEl as HTMLInputElement).selectionStart as number,
      (activeEl as HTMLInputElement).selectionEnd as number,
    );
  } else if (window.getSelection) {
    text = window.getSelection()?.toString() || '';
  }
  return text;
};
