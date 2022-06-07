import { useCallback } from 'react';

import { createAction } from '@reduxjs/toolkit';
import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';

import { withDeferred } from '@utils/with-deffered';

type ActionReturnType = ReturnType<typeof createAction>;
type ArgumentTypes<F extends ActionReturnType> = F extends (
    ...args: infer A
  ) => void
  ? A
  : never;

export function useActionWithDeferred<T extends ActionReturnType>(
  action: T,
): <PromiseReturnType = undefined>(
  payload?: ArgumentTypes<typeof action>[0],
) => Promise<PromiseReturnType> {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (...args) => flow([action, withDeferred(dispatch)])(...args),
    [dispatch, action],
  );
}
