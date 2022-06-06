import { createAction, PayloadActionCreator } from '@reduxjs/toolkit';

type Deferred<TData = string, TException = unknown> = {
  resolve: (data?: TData) => void;
  reject: (e?: TException) => void;
};

export type Meta<TData = Record<string, unknown>, TException = unknown> = {
  deferred: Deferred<TData, TException>;
};

type PrepareActionFnType<TPayload, TMetaPayload> = (
  payload: TPayload,
  meta?: Meta<TMetaPayload, unknown>,
) => {
  meta: Meta<TMetaPayload, unknown>;
  payload: TPayload;
};

function prepareActionFn<TPayload, TMetaPayload>(
  payload: TPayload,
  meta: Meta<TMetaPayload, unknown>,
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
>(
  type: TType,
): PayloadActionCreator<
  ReturnType<PrepareActionFnType<TPayload, TMetaPayload>>['payload'],
  TType,
  PrepareActionFnType<TPayload, TMetaPayload>
> {
  return createAction<PrepareActionFnType<TPayload, TMetaPayload>, TType>(type, prepareActionFn);
}
