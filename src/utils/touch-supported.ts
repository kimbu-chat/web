/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
export const isTouchSupported =
  // @ts-ignore
  'ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch);
