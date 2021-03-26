import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import flow from 'lodash/flow';

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function useActionWithDispatch<T extends (...args: any[]) => any>(
  action: T,
): (...args: ArgumentTypes<typeof action>) => void {
  const dispatch = useDispatch();
  return useCallback(flow([action, dispatch]), [dispatch]);
}
