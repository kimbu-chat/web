import { SagaIterator } from 'redux-saga';
import { delay, call, put } from 'redux-saga/effects';
import { InternetActions } from './actions';

export function* intervalInternetConnectionCheckSaga(): SagaIterator {
	const ping = (): Promise<boolean> => {
		return new Promise((resolve) => {
			const isOnline = () => resolve(true);
			const isOffline = () => resolve(false);

			fetch(`/file-for-ping.txt?d=${Date.now()}`)
				.then((response) => {
					if (response.ok) {
						isOnline();
					} else {
						isOffline();
					}
				})
				.catch(isOffline);
		});
	};

	while (true) {
		yield delay(10000);
		const internetState = yield call(ping);
		yield put(InternetActions.internetConnectionCheck({ state: internetState }));
	}
}
