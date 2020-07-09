import { all, takeLatest, fork } from 'redux-saga/effects';
import { AuthActionTypes } from './auth/types';
import { confirmPhoneNumberSaga, sendSmsPhoneConfirmationCodeSaga, initializeSaga } from './auth/sagas';
import { DialogsActionTypes } from './dialogs/types';
import { getDialogsSaga } from './dialogs/sagas';
import { messages, createMessage, messageTyping } from './messages/sagas';
import { MessagesActionTypes } from './messages/types';
import { FriendsActionTypes } from './friends/types';
import { ConferencesActionTypes } from './conferences/types';
import { createConferenceSaga, createConferenceFromEventSaga } from './conferences/sagas';
import { getFriendsSaga } from './user/sagas';

function* rootSaga() {
  yield all([
    takeLatest(AuthActionTypes.CONFIRM_PHONE, confirmPhoneNumberSaga),
    takeLatest(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE, sendSmsPhoneConfirmationCodeSaga),
    takeLatest(DialogsActionTypes.GET_DIALOGS, getDialogsSaga),
    takeLatest(MessagesActionTypes.GET_MESSAGES, messages),
    takeLatest(MessagesActionTypes.CREATE_MESSAGE, createMessage),
    takeLatest(MessagesActionTypes.NOTIFY_USER_ABOUT_MESSAGE_TYPING, messageTyping),
    takeLatest(FriendsActionTypes.GET_FRIENDS, getFriendsSaga),
    takeLatest(ConferencesActionTypes.CREATE_CONFERENCE, createConferenceSaga),
    takeLatest(ConferencesActionTypes.CREATE_CONFERENCE_FROM_EVENT, createConferenceFromEventSaga),
    fork(initializeSaga)
  ]);
}

export default rootSaga;
