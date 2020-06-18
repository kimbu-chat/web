import { all, takeLatest } from 'redux-saga/effects';
import { AuthActionTypes } from './auth/types';
import { confirmPhoneNumberSaga, sendSmsPhoneConfirmationCodeSaga } from './auth/sagas';

function* rootSaga() {
  yield all([
    takeLatest(AuthActionTypes.CONFIRM_PHONE, confirmPhoneNumberSaga),
    takeLatest(AuthActionTypes.SEND_PHONE_CONFIRMATION_CODE, sendSmsPhoneConfirmationCodeSaga)
  ]);
}

export default rootSaga;
