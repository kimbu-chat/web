import { useCallback } from 'react';
import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';
import { createCustomAction } from 'typesafe-actions';

import { withDeferred } from '@utils/with-deffered';

type ActionReturnType = ReturnType<typeof createCustomAction>;

export function useActionWithDeferred<T extends ActionReturnType>(
  action: T,
): <PromiseReturnType = never>(
  payload: Parameters<typeof action>[0],
) => Promise<PromiseReturnType> {
  const dispatch = useDispatch();
  return useCallback((...args) => flow([action, withDeferred(dispatch)])(...args), [
    dispatch,
    action,
  ]);
}

export function useEmptyActionWithDeferred<T extends ActionReturnType>(
  action: T,
): <PromiseReturnType = never>() => Promise<PromiseReturnType> {
  const dispatch = useDispatch();
  return useCallback((...args) => flow([action, withDeferred(dispatch)])(...args), [
    dispatch,
    action,
  ]);
}
