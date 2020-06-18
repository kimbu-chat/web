import { useCallback } from 'react';
import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';
import { withDeferred } from './with-deffered';

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function useActionWithDeferred<T extends (...args: any[]) => any>(
  action: T
): <P = any>(...args: ArgumentTypes<typeof action>) => Promise<P> {
  const dispatch = useDispatch();
  return useCallback(flow([action, withDeferred(dispatch)]), [dispatch, action]);
}
