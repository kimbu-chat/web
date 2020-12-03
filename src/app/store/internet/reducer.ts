import { createReducer } from 'typesafe-actions';
import { InternetConnectionCheck } from './features/internet-connection-check';
import { InternetState } from './models';

const initialState: InternetState = {
  isInternetConnected: typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
};

const internet = createReducer<InternetState>(initialState).handleAction(InternetConnectionCheck.action, InternetConnectionCheck.reducer);

export default internet;
