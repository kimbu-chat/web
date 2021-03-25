import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take, takeEvery } from 'redux-saga/effects';
import { END, eventChannel, SagaIterator, buffers } from 'redux-saga';
import noop from 'lodash/noop';
import { RootState } from 'typesafe-actions';
import { isNetworkError } from '../../../utils/error-utils';
import { ISecurityTokens } from '../../auth/common/models';
import { securityTokensSelector } from '../../auth/selectors';
import { RefreshToken } from '../../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../../auth/features/refresh-token/refresh-token-success';
import { HttpRequestMethod } from './http-request-method';
import type { IFilesRequestGeneratorCallbacks, HttpHeaders, IFilesRequestGenerator, UrlGenerator } from './types';

function createUploadFileChannel(requestConfig: AxiosRequestConfig) {
  return eventChannel((emit) => {
    const onStart = () => {
      emit({ start: true });
    };

    const onSuccess = (response: AxiosResponse) => {
      emit({ response: response.data });
      emit(END);
    };

    const onFailure = (err: string) => {
      emit({ err });
      emit(END);
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
  }, buffers.expanding(0));
}

function* uploadFileSaga(requestConfig: AxiosRequestConfig, cancelTokenSource: CancelTokenSource, callbacks?: IFilesRequestGeneratorCallbacks): SagaIterator {
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

  const auth: ISecurityTokens = yield select(securityTokensSelector);

  if (auth && auth.accessToken) {
    requestConfig.headers = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
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

export const httpFilesRequestFactory = <TResponse, TBody>(
  url: string | UrlGenerator<TBody>,
  method: HttpRequestMethod,
  headers?: HttpHeaders,
): IFilesRequestGenerator<TResponse, TBody> => {
  function* generator(body: TBody, callbacks: IFilesRequestGeneratorCallbacks): SagaIterator {
    let cancelTokenSource = null;

    try {
      const refreshTokenRequestLoading = yield select((rootState: RootState) => rootState.auth.refreshTokenRequestLoading);

      if (refreshTokenRequestLoading) {
        yield take(RefreshTokenSuccess.action);
      }

      const finalUrl: string = typeof url === 'function' ? (url as UrlGenerator<TBody>)(body) : url;

      try {
        cancelTokenSource = axios.CancelToken.source();
        return yield call(httpRequest, finalUrl, method, body, cancelTokenSource, headers, callbacks);
      } catch (e) {
        const error = e as AxiosError;

        if (!isNetworkError(e) && error?.response?.status === 401) {
          yield put(RefreshToken.action());
          yield take(RefreshTokenSuccess.action);

          cancelTokenSource = axios.CancelToken.source();
          return yield call(httpRequest, finalUrl, method, body, cancelTokenSource, headers, callbacks);
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
