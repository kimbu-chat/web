/* eslint-disable @typescript-eslint/naming-convention */
import { compose } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    webkitAudioContext: typeof AudioContext;
  }
}
