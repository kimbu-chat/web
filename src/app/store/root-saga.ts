import { all, takeLatest, fork } from 'redux-saga/effects';
import { AuthActionTypes } from './auth/types';
import { confirmPhoneNumberSaga, sendSmsPhoneConfirmationCodeSaga, initializeSaga } from './auth/sagas';
import { DialogsActionTypes } from './dialogs/types';
import { getDialogsSaga } from './dialogs/sagas';
import { messages } from './messages/sagas';
import { GET_MESSAGES } from './messages/types';

function* rootSaga() {
  yield all([
    takeLatest(AuthActionTypes.CONFIRM_PHONE, confirmPhoneNumberSaga),
    takeLatest(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE, sendSmsPhoneConfirmationCodeSaga),
    takeLatest(DialogsActionTypes.GET_DIALOGS, getDialogsSaga),
    takeLatest(GET_MESSAGES, messages),
    fork(initializeSaga)
  ]);
}

export default rootSaga;
