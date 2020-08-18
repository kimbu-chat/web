import { IInternetState } from './models';
import { createAction } from 'typesafe-actions';

export namespace InternetActions {
	export const internetConnectionCheck = createAction('INTERNET_CONNECTION_CHECK')<IInternetState>();
}
