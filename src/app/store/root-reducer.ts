import { combineReducers } from 'redux';

import auth from './auth/reducer';
import dialogs from './dialogs/reducer';

export default combineReducers({
  auth,
  dialogs
});
