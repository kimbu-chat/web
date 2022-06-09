import { createAction } from '@reduxjs/toolkit';

type Deferred<TData = string, TException = unknown> = {
  resolve: (data?: TData) => void;
  reject: (e?: TException) => void;
};

export type Meta<TData = Record<string, unknown>, TException = unknown> = {
  deferred: Deferred<TData, TException>;
};

type PrepareActionFnType<TPayload, TMetaPayload = unknown> = (
  payload: TPayload,
  meta?: Meta<TMetaPayload, unknown>,
) => {
  meta: Meta<TMetaPayload, unknown> | undefined;
  payload: TPayload;
};

function prepareActionFn<TPayload, TMetaPayload = unknown>(
  payload: TPayload,
  meta?: Meta<TMetaPayload, unknown> | undefined,
) {
  return {
    meta,
    payload,
  };
}

export function createDeferredAction<
  TPayload,
  TMetaPayload = unknown,
  TType extends string = string,
>(type: TType) {
  return createAction<PrepareActionFnType<TPayload, TMetaPayload>, TType>(type, prepareActionFn);
}
