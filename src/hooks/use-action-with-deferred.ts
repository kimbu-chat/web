import { useCallback } from 'react';
import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';
import { createCustomAction } from 'typesafe-actions';
import { withDeferred } from '@utils/with-deffered';

type ActionReturnType = ReturnType<typeof createCustomAction>;
type ArgumentTypes<F extends ActionReturnType> = F extends (...args: infer A) => any ? A : never;

export function useActionWithDeferred<T extends ActionReturnType>(
  action: T,
): <PromiseReturnType = any>(
  payload: ArgumentTypes<typeof action>[0],
) => Promise<PromiseReturnType> {
  const dispatch = useDispatch();
  return useCallback(flow([action, withDeferred(dispatch)]), [dispatch, action]);
}

export function useEmptyActionWithDeferred<T extends ActionReturnType>(
  action: T,
): <PromiseReturnType = any>() => Promise<PromiseReturnType> {
  const dispatch = useDispatch();
  return useCallback(flow([action, withDeferred(dispatch)]), [dispatch, action]);
}
