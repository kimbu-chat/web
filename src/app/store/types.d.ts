import { compose } from 'redux';
import { RootAction } from './root-action';

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
