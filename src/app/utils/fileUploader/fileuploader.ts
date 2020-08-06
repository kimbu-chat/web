import { AuthService } from 'app/services/auth-service';
import axios from 'axios';
import { call } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

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
	const imagePath: string = request.path.replace('file://', '/');

	const userAccessToken = new AuthService().securityTokens.accessToken;

	let data = new FormData();
	let blob = yield call(() => fetch(imagePath).then((r) => r.blob()));

	data.append('file', blob, request.fileName);

	for (let i in request.parameters) {
		data.append(i, request.parameters[i]);
	}
	try {
		const response = yield call(() =>
			axios.post(request.url, data, {
				headers: {
					Authorization: `bearer ${userAccessToken}`,
					'content-type': 'multipart/form-data',
				},
			}),
		);
		if (request.completedCallback) yield call(request.completedCallback, response);
	} catch (error) {
		if (request.errorCallback) request.errorCallback(error);
	}
}
