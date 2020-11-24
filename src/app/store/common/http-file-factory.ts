import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take } from 'redux-saga/effects';
import { END, eventChannel, SagaIterator, buffers } from 'redux-saga';
import { SecurityTokens } from '../auth/models';
import { AuthActions } from '../auth/actions';
import { isNetworkError } from 'utils/functions/error-utils';
import { selectSecurityTokens } from '../auth/selectors';

export enum HttpRequestMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
}

export type HttpHeaders = { [key: string]: string };

export function* httpRequest<T>(
	url: string,
	method: HttpRequestMethod,
	body: T,
	cancelTokenSource: CancelTokenSource,
	headers?: HttpHeaders,
	callbacks?: IFilesRequestGeneratorCallbacks,
) {
	const requestConfig: AxiosRequestConfig = {
		url,
		method,
		cancelToken: cancelTokenSource?.token,
		responseType: 'json',
	};

	const auth: SecurityTokens = yield select(selectSecurityTokens);

	if (auth && auth.accessToken) {
		requestConfig.headers = {
			Authorization: `Bearer ${auth.accessToken}`,
		};
	}

	if (headers != null) {
		Object.keys(headers).forEach((prop) => {
			requestConfig.headers[prop] = headers[prop];
		});
	}

	switch (method) {
		case HttpRequestMethod.Get:
			requestConfig.params = body;
			break;
		case HttpRequestMethod.Post:
			requestConfig.data = body;
			break;
		case HttpRequestMethod.Put:
			requestConfig.data = body;
			break;
		case HttpRequestMethod.Delete:
			requestConfig.params = body;
			break;
		default:
			throw new Error('Unknown method.');
	}

	yield call(uploadFileSaga, requestConfig, cancelTokenSource, callbacks);
}

export function* uploadFileSaga(
	requestConfig: AxiosRequestConfig,
	cancelTokenSource: CancelTokenSource,
	callbacks?: IFilesRequestGeneratorCallbacks,
): SagaIterator {
	const channel = yield call(createUploadFileChannel, requestConfig);

	while (true) {
		const { start, progress = 0, err, response } = yield take(channel);

		if (start) {
			if (callbacks?.onStart) {
				yield call(() => callbacks.onStart!({ cancelTokenSource }));
			}
		}
		if (err) {
			if (callbacks?.onFailure) {
				yield call(() => callbacks.onFailure!());
			}
			return;
		}
		if (response) {
			if (callbacks?.onSuccess) {
				yield call(() => callbacks.onSuccess!(response));
			}
			return;
		}

		if (callbacks?.onProgress) {
			yield call(() => callbacks.onProgress!({ progress }));
		}
	}
}

function createUploadFileChannel(requestConfig: AxiosRequestConfig) {
	return eventChannel((emit) => {
		const onStart = () => {
			emit({ start: true });
		};

		const onSuccess = (response: AxiosResponse<any>) => {
			emit({ response: response.data });
			emit(END);
		};

		const onFailure = (err: string) => {
			emit({ err });
			emit(END);
		};

		const onProgress = (progressEvent: ProgressEvent<EventTarget>) => {
			const progress = (progressEvent.loaded / progressEvent.total) * 100;
			emit({ progress });
		};

		requestConfig.onUploadProgress = onProgress;

		axios.create().request(requestConfig).then(onSuccess).catch(onFailure);

		onStart();

		return () => {};
	}, buffers.expanding(0));
}

export interface IFilesRequestGeneratorCallbacks {
	onStart?: (payload: { cancelTokenSource: CancelTokenSource }) => SagaIterator<any>;
	onProgress?: (payload: any) => SagaIterator<any>;
	onSuccess?: (payload: any) => SagaIterator<any>;
	onFailure?: () => SagaIterator<any>;
}

export interface IFilesRequestGenerator<T, B> {
	generator: (body: B, callbacks: IFilesRequestGeneratorCallbacks) => SagaIterator;
	call: (args: any) => T;
}

type urlGenerator<TBody> = (body: TBody) => string;

export const httpFilesRequestFactory = <T, B>(
	url: string | urlGenerator<B>,
	method: HttpRequestMethod,
	headers?: HttpHeaders,
): IFilesRequestGenerator<T, B> => {
	function* generator(body: B, callbacks: IFilesRequestGeneratorCallbacks): SagaIterator {
		let cancelTokenSource: CancelTokenSource;

		try {
			let auth: SecurityTokens = yield select(selectSecurityTokens);

			if (auth?.refreshTokenRequestLoading) {
				yield take(AuthActions.refreshTokenSuccess);
			}

			const finalUrl: string = typeof url === 'function' ? (url as urlGenerator<B>)(body!) : url;

			try {
				cancelTokenSource = axios.CancelToken.source();
				return yield call(httpRequest, finalUrl, method, body, cancelTokenSource, headers, callbacks);
			} catch (e) {
				const error = e as AxiosError;
				if (isNetworkError(e)) {
					alert('Network Error.');
				} else if (error?.response?.status === 401) {
					yield put(AuthActions.refreshToken());

					yield take(AuthActions.refreshTokenSuccess);

					auth = yield select(selectSecurityTokens);

					if (auth.isAuthenticated) {
						cancelTokenSource = axios.CancelToken.source();
						return yield call(httpRequest, finalUrl, method, body, cancelTokenSource, headers, callbacks);
					}
				}
				throw e;
			}
		} finally {
			if (yield cancelled()) {
				if (cancelTokenSource!) {
					cancelTokenSource!.cancel();
				}
			}
		}
	}

	return {
		generator,
		call: (a) => a,
	};
};
