export function applyFontSize(fontSize = 16) {
  const element = document.querySelector('#message-font-size') || document.createElement('style');
  element.id = 'message-font-size';
  element.innerHTML = `.message__content span{ font-size: ${fontSize}px !important; }`;
  document.head.appendChild(element);
}