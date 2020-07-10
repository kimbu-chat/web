import { combineReducers } from 'redux';

import auth from './auth/reducer';
import messages from './messages/reducer';
import dialogs from './dialogs/reducer';
import friends from './friends/reducer';

export default combineReducers({
  auth,
  dialogs,
  messages,
  friends
});
