import { createAction } from 'typesafe-actions';
import { IInternetState } from './models';

export namespace InternetActions {
  export const internetConnectionCheck = createAction('INTERNET_CONNECTION_CHECK')<IInternetState>();
}
