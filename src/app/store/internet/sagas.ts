import { SagaIterator } from 'redux-saga';
import { delay, call, put } from 'redux-saga/effects';
import { InternetActions } from './actions';

export function* intervalInternetConnectionCheckSaga(): SagaIterator {
	console.log('saga called');
	const ping = (timeout: number): Promise<boolean> => {
		return new Promise((resolve) => {
			const isOnline = () => resolve(true);
			const isOffline = () => resolve(false);

			const xhr = new XMLHttpRequest();

			xhr.onerror = isOffline;
			xhr.ontimeout = isOffline;
			xhr.onreadystatechange = () => {
				if (xhr.readyState === xhr.HEADERS_RECEIVED) {
					if (xhr.status) {
						isOnline();
					} else {
						isOffline();
					}
				}
			};

			xhr.open('HEAD', 'https://notifications.ravudi.com/');
			xhr.timeout = timeout;
			xhr.send();
		});
	};

	while (true) {
		yield delay(10000);
		console.log('ping');
		const internetState = yield call(ping, 500);
		yield put(InternetActions.internetConnectionCheck({ state: internetState }));
	}
}
