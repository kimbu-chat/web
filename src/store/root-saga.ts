import { all } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { FriendSagas } from './friends/sagas';
import { ChatSagas } from './chats/sagas';
import { AuthSagas } from './auth/sagas';
import { MyProfileSagas } from './my-profile/sagas';
import { InitiationSagas } from './initiation/sagas';
import { CallsSagas } from './calls/sagas';
import { SettingsSagas } from './settings/sagas';
import { InternetSagas } from './internet/sagas';
import { UsersSagas } from './users/sagas';

export function* rootSaga(): SagaIterator {
  yield all([
    ...InitiationSagas,
    ...InternetSagas,
    ...ChatSagas,
    ...AuthSagas,
    ...FriendSagas,
    ...MyProfileSagas,
    ...CallsSagas,
    ...SettingsSagas,
    ...UsersSagas,
  ]);
}
