import { KEY_NAME } from '../../constants';

export const inputUtils = {
  special: {
    [KEY_NAME.BACKSPACE]: true,
    [KEY_NAME.SHIFT]: true,
    [KEY_NAME.CTRL]: true,
    [KEY_NAME.ALT]: true,
    [KEY_NAME.DELETE]: true,
  },
  navigational: {
    [KEY_NAME.UP_ARROW]: true,
    [KEY_NAME.DOWN_ARROW]: true,
    [KEY_NAME.LEFT_ARROW]: true,
    [KEY_NAME.RIGHT_ARROW]: true,
  },
  isSpecial(e: React.KeyboardEvent<HTMLDivElement>) {
    return typeof this.special[e.key] !== 'undefined';
  },
  isNavigational(e: React.KeyboardEvent<HTMLDivElement>) {
    return typeof this.navigational[e.key] !== 'undefined';
  },
  isShortCut(e: React.KeyboardEvent<HTMLDivElement>) {
    return e.ctrlKey && e.key === 'a';
  },
};
