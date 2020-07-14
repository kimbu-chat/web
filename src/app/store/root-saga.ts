import { all, takeLatest, fork, takeEvery } from 'redux-saga/effects';
import { AuthActionTypes } from './auth/types';
import { confirmPhoneNumberSaga, sendSmsPhoneConfirmationCodeSaga, initializeSaga } from './auth/sagas';
import { DialogsActionTypes } from './dialogs/types';
import { getDialogsSaga, resetUnreadMessagesCountSaga, removeDialogSaga, muteDialogSaga } from './dialogs/sagas';
import { messages, createMessage, messageTyping } from './messages/sagas';
import { MessagesActionTypes } from './messages/types';
import { FriendsActionTypes } from './friends/types';
import { userActionTypes } from './user/types';
import { ConferencesActionTypes } from './conferences/types';
import {
  createConferenceSaga,
  createConferenceFromEventSaga,
  getConferenceUsersSaga,
  leaveConferenceSaga,
  addUsersToConferenceSaga,
  renameConferenceSaga
} from './conferences/sagas';
import { getFriendsSaga, deleteFriendSaga, getMyProfileSaga, updateMyProfileSaga } from './user/sagas';

function* rootSaga() {
  yield all([
    takeLatest(AuthActionTypes.CONFIRM_PHONE, confirmPhoneNumberSaga),
    takeLatest(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE, sendSmsPhoneConfirmationCodeSaga),
    takeLatest(MessagesActionTypes.GET_MESSAGES, messages),
    takeEvery(MessagesActionTypes.CREATE_MESSAGE, createMessage),
    takeLatest(MessagesActionTypes.NOTIFY_USER_ABOUT_MESSAGE_TYPING, messageTyping),
    takeLatest(MessagesActionTypes.RESET_UNREAD_MESSAGES_COUNT, resetUnreadMessagesCountSaga),

    takeLatest(ConferencesActionTypes.CREATE_CONFERENCE, createConferenceSaga),
    takeLatest(ConferencesActionTypes.CREATE_CONFERENCE_FROM_EVENT, createConferenceFromEventSaga),
    takeLatest(ConferencesActionTypes.GET_CONFERENCE_USERS, getConferenceUsersSaga),
    takeLatest(ConferencesActionTypes.LEAVE_CONFERENCE, leaveConferenceSaga),
    takeLatest(ConferencesActionTypes.ADD_USERS_TO_CONFERENCE, addUsersToConferenceSaga),
    takeLatest(ConferencesActionTypes.RENAME_CONFERENCE, renameConferenceSaga),
    takeEvery(DialogsActionTypes.REMOVE_DIALOG, removeDialogSaga),
    takeEvery(DialogsActionTypes.MUTE_DIALOG, muteDialogSaga),
    takeLatest(DialogsActionTypes.GET_DIALOGS, getDialogsSaga),
    takeLatest(FriendsActionTypes.GET_FRIENDS, getFriendsSaga),
    takeLatest(FriendsActionTypes.DELETE_FRIEND, deleteFriendSaga),
    takeLatest(userActionTypes.GET_MY_PROFILE, getMyProfileSaga),
    takeLatest(userActionTypes.UPDATE_MY_PROFILE_INFO, updateMyProfileSaga),
    fork(initializeSaga)
  ]);
}

export default rootSaga;
