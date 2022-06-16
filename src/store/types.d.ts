/* eslint-disable @typescript-eslint/naming-convention */
import { compose } from 'redux';

import { store } from '@store/index';
import combinedReducer from '@store/root-reducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    webkitAudioContext: typeof AudioContext;
  }
  type Store = ReturnType<typeof store>;
  export type RootState = ReturnType<typeof combinedReducer>;
  export type AppDispatch = typeof store.dispatch;
}
