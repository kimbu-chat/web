import { all } from 'redux-saga/effects';
import { MessageSagas } from './messages/sagas';
import { SagaIterator } from 'redux-saga';
import { FriendSagas } from './friends/sagas';
import { ChatSagas } from './chats/sagas';
import { AuthSagas } from './auth/sagas';
import { MyProfileSagas } from './my-profile/sagas';
import { InitiationSagas } from './initiation/sagas';
import { CallsSagas } from './calls/sagas';

export function* rootSaga(): SagaIterator {
	yield all([
		...InitiationSagas,
		...ChatSagas,
		...MessageSagas,
		...AuthSagas,
		...FriendSagas,
		...MyProfileSagas,
		...CallsSagas,
	]);
}
