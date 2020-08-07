import axios from 'axios';
import { call, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { selectSecurityTokens } from 'app/store/auth/selectors';
import { SecurityTokens } from 'app/store/auth/types';

export interface FileUploadRequest<TResponseBody = object> {
	uploadId?: string;
	path: string;
	url: string;
	fileName: string;
	parameters?: {
		[index: string]: string;
	};
	progressCallback?(response: ProgressUploadResponse): void;
	errorCallback?(response: ErrorUploadResponse): void;
	completedCallback?(response: CompletedUploadResponse<TResponseBody>): void;
	cancelledCallback?(uploadId: string): void;
}

export interface ProgressUploadResponse {
	progress: number;
	uploadId: string;
}

export interface ErrorUploadResponse {
	error: string;
	uploadId: string;
}

export interface CompletedUploadResponse<T> {
	data: any;
	httpResponseCode: string;
	httpResponseBody: T;
	uploadId: string;
}

export function* uploadFileSaga<T>(request: FileUploadRequest<T>): SagaIterator {
	const securityTokens: SecurityTokens = yield select(selectSecurityTokens);

	let data = new FormData();
	let blob = yield call(() => fetch(request.path).then((r) => r.blob()));

	data.append('file', blob, request.fileName);

	for (let i in request.parameters) {
		data.append(i, request.parameters[i]);
	}
	try {
		const response = yield call(() =>
			axios.post(request.url, data, {
				headers: {
					Authorization: `bearer ${securityTokens.accessToken}`,
					'content-type': 'multipart/form-data',
				},
			}),
		);
		if (request.completedCallback) {
			yield call(request.completedCallback, response);
		}
	} catch (error) {
		if (request.errorCallback) {
			request.errorCallback(error);
		}
	}
}
