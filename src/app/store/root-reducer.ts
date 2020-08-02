import { combineReducers } from 'redux';

import auth from './auth/reducer';
import messages from './messages/reducer';
import dialogs from './dialogs/reducer';
import friends from './friends/reducer';
import myProfile from './my-profile/reducer';
import { AuthActions } from './auth/actions';
import { getType } from 'typesafe-actions';

const rootReducer = combineReducers({
	auth,
	dialogs,
	messages,
	friends,
	myProfile,
});

export type RootState = ReturnType<typeof rootReducer>;

export default (state: any, action: any): ReturnType<typeof rootReducer> => {
	if (action.type === getType(AuthActions.logout)) {
		return {
			...state,
			auth: {
				...state.auth,
				isAuthenticated: false,
			},
			dialogs: {
				...state.dialogs,
				dialogs: [],
				selectedDialogId: null,
			},
			messages: {
				...state.messages,
				messages: [],
			},
			myProfile: null,
		};
	}
	return rootReducer(state, action);
};
