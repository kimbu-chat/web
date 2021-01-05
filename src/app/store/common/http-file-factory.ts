import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { call, cancelled, put, select, take, takeEvery } from 'redux-saga/effects';
import { END, eventChannel, SagaIterator, buffers } from 'redux-saga';
import { isNetworkError } from 'app/utils/error-utils';
import { ISecurityTokens } from '../auth/models';
import { selectSecurityTokensSelector } from '../auth/selectors';
import { RefreshToken } from '../auth/features/refresh-token/refresh-token';
import { RefreshTokenSuccess } from '../auth/features/refresh-token/refresh-token-success';

export enum HttpRequestMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

type HttpHeaders = { [key: string]: string };

function createUploadFileChannel(requestConfig: AxiosRequestConfig) {
  return eventChannel((emit) => {
    const onStart = () => {
      emit({ start: true });
    };

    const onSuccess = (response: AxiosResponse<any>) => {
      emit({ response: response.data });
      console.log('upload ended');
      emit(END);
    };

    const onFailure = (err: string) => {
      emit({ err });
      console.log('upload canceled');
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

function* uploadFileSaga(requestConfig: AxiosRequestConfig, cancelTokenSource: CancelTokenSource, callbacks?: IFilesRequestGeneratorCallbacks): SagaIterator {
  const uploadFileChannel = yield call(createUploadFileChannel, requestConfig);

  yield takeEvery(
    uploadFileChannel,
    function* ({ start, progress = 0, err, response }: { start: number; progress: number; err: string; response: AxiosResponse<any> }) {
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
    },
  );
}

interface IFilesRequestGeneratorCallbacks {
  onStart?: (payload: { cancelTokenSource: CancelTokenSource }) => SagaIterator<any>;
  onProgress?: (payload: { progress: number }) => SagaIterator<any>;
  onSuccess?: (payload: any) => SagaIterator<any>;
  onFailure?: () => SagaIterator<any>;
}

export interface IFilesRequestGenerator<T, B> {
  generator: (body: B, callbacks: IFilesRequestGeneratorCallbacks) => SagaIterator;
  call: (args: any) => T;
}

type UrlGenerator<TBody> = (body: TBody) => string;

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

  const auth: ISecurityTokens = yield select(selectSecurityTokensSelector);

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

export const httpFilesRequestFactory = <T, B>(
  url: string | UrlGenerator<B>,
  method: HttpRequestMethod,
  headers?: HttpHeaders,
): IFilesRequestGenerator<T, B> => {
  function* generator(body: B, callbacks: IFilesRequestGeneratorCallbacks): SagaIterator {
    let cancelTokenSource: CancelTokenSource;

    try {
      let auth: ISecurityTokens = yield select(selectSecurityTokensSelector);

      if (auth?.refreshTokenRequestLoading) {
        yield take(RefreshTokenSuccess.action);
      }

      const finalUrl: string = typeof url === 'function' ? (url as UrlGenerator<B>)(body!) : url;

      try {
        cancelTokenSource = axios.CancelToken.source();
        return yield call(httpRequest, finalUrl, method, body, cancelTokenSource, headers, callbacks);
      } catch (e) {
        const error = e as AxiosError;
        if (isNetworkError(e)) {
          alert('Network Error.');
        } else if (error?.response?.status === 401) {
          yield put(RefreshToken.action());

          yield take(RefreshTokenSuccess.action);

          auth = yield select(selectSecurityTokensSelector);

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
