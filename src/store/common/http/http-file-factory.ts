import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import noop from 'lodash/noop';
import { END, eventChannel, SagaIterator, buffers } from 'redux-saga';
import { call, cancelled, put, take, takeEvery } from 'redux-saga/effects';

import { emitToast } from '@utils/emit-toast';

import { isNetworkError } from '../../../utils/error-utils';
import { RefreshToken } from '../../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';

import { checkTokensSaga } from './check-tokens';
import { getAuthHeader } from './common';
import { HttpRequestMethod } from './http-request-method';

import type {
  IFilesRequestGeneratorCallbacks,
  HttpHeaders,
  IFilesRequestGenerator,
  UrlGenerator,
} from './types';

function createUploadFileChannel(requestConfig: AxiosRequestConfig) {
  return eventChannel((emit) => {
    const onStart = () => {
      emit({ start: true });
    };

    const onSuccess = (response: AxiosResponse) => {
      emit({ response });
      emit(END);
    };

    const onFailure = (err: { message?: string }) => {
      if (err.message) {
        emit({ err: err.message });
        emitToast(err.message);
        emit(END);
      }
    };

    const onProgress = (progressEvent: ProgressEvent<EventTarget>) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 100;
      emit({ progress, uploadedBytes: progressEvent.loaded });
    };

    // eslint-disable-next-line no-param-reassign
    requestConfig.onUploadProgress = onProgress;

    axios.create().request(requestConfig).then(onSuccess).catch(onFailure);

    onStart();

    return noop;
  }, buffers.expanding<{ progress: number; uploadedBytes: number } | { err: string } | { response: AxiosResponse } | { start: boolean }>(0));
}

function* uploadFileSaga(
  requestConfig: AxiosRequestConfig,
  cancelTokenSource: CancelTokenSource,
  callbacks?: IFilesRequestGeneratorCallbacks,
): SagaIterator {
  const uploadFileChannel = yield call(createUploadFileChannel, requestConfig);

  yield takeEvery(
    uploadFileChannel,
    function* uploadFile({
      start,
      progress = 0,
      uploadedBytes = 0,
      err,
      response,
    }: {
      start: number;
      progress: number;
      uploadedBytes: number;
      err: string;
      response: AxiosResponse;
    }) {
      if (start) {
        if (callbacks?.onStart) {
          yield call(callbacks.onStart, { cancelTokenSource });
        }
      }
      if (err) {
        if (callbacks?.onFailure) {
          yield call(callbacks.onFailure);
        }
        return;
      }
      if (response) {
        if (callbacks?.onSuccess) {
          yield call(callbacks.onSuccess, response);
        }
        return;
      }

      if (callbacks?.onProgress) {
        yield call(callbacks.onProgress, { progress, uploadedBytes });
      }
    },
  );
}

function* httpRequest<T>(
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

  const authHeader: HttpHeaders = yield call(getAuthHeader);

  requestConfig.headers = {
    ...headers,
    ...authHeader,
  };

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

export const httpFilesRequestFactory = <TResponse, TBody>(
  url: string | UrlGenerator<TBody>,
  method: HttpRequestMethod,
  headers?: HttpHeaders,
): IFilesRequestGenerator<TResponse, TBody> => {
  function* generator(body: TBody, callbacks: IFilesRequestGeneratorCallbacks): SagaIterator {
    let cancelTokenSource: CancelTokenSource | null = null;

    try {
      yield call(checkTokensSaga);

      const finalUrl: string = typeof url === 'function' ? (url as UrlGenerator<TBody>)(body) : url;

      try {
        cancelTokenSource = axios.CancelToken.source();
        return yield call(
          httpRequest,
          finalUrl,
          method,
          body,
          cancelTokenSource,
          headers,
          callbacks,
        );
      } catch (e) {
        const error = e as AxiosError;

        if (!isNetworkError(error) && error?.response?.status === 401) {
          yield put(RefreshToken.action());
          yield take(RefreshTokenSuccess.action);

          cancelTokenSource = axios.CancelToken.source();
          return yield call(
            httpRequest,
            finalUrl,
            method,
            body,
            cancelTokenSource,
            headers,
            callbacks,
          );
        }
        throw e;
      }
    } finally {
      if (yield cancelled()) {
        if (cancelTokenSource) {
          cancelTokenSource.cancel();
        }
      }
    }
  }

  return {
    generator,
    call: (a: TResponse): TResponse => a,
  };
};
