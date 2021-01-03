import { createReducer } from 'typesafe-actions';
import { InternetConnectionCheck } from './features/internet-connection-check/internet-connection-check';
import { IInternetState } from './models';

const initialState: IInternetState = {
  isInternetConnected: typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
};

const internet = createReducer<IInternetState>(initialState).handleAction(InternetConnectionCheck.action, InternetConnectionCheck.reducer);

export default internet;
