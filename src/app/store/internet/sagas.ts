import { SagaIterator } from 'redux-saga';
import { delay, call, put } from 'redux-saga/effects';
import { InternetActions } from './actions';

export function* intervalInternetConnectionCheckSaga(): SagaIterator {
	const ping = (): Promise<boolean> => {
		return new Promise((resolve) => {
			const isOnline = () => resolve(true);
			const isOffline = () => resolve(false);

			fetch(
				'https://kimbu-bucket.s3.eu-west-3.amazonaws.com/kimbu-bucket/2020/11/12/191fdb61cdf041999622cd8b9387d91b',
			)
				.then(isOnline)
				.catch(isOffline);
		});
	};

	while (true) {
		yield delay(10000);
		const internetState = yield call(ping);
		yield put(InternetActions.internetConnectionCheck({ state: internetState }));
	}
}
