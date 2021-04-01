import { AxiosResponse, CancelTokenSource } from 'axios';
import { SagaIterator } from 'redux-saga';

export type IRequestGenerator<TResponse, TBody> = {
  generator: (body?: TBody) => SagaIterator;
  call: (args: TResponse) => TResponse;
};

export type HttpHeaders = { [key: string]: string };

export type UrlGenerator<TBody> = (body: TBody) => string;

export interface IFilesRequestGeneratorCallbacks {
  onStart?: (payload: { cancelTokenSource: CancelTokenSource }) => SagaIterator;
  onProgress?: (payload: { progress: number; uploadedBytes: number }) => SagaIterator;
  onSuccess?: (payload: AxiosResponse) => SagaIterator;
  onFailure?: () => SagaIterator;
}

export interface IFilesRequestGenerator<TResponse, TBody> {
  generator: (body: TBody, callbacks: IFilesRequestGeneratorCallbacks) => SagaIterator;
  call: (args: TResponse) => TResponse;
}
