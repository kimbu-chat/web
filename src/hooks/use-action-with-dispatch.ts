import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import flow from 'lodash/flow';

export function useActionWithDispatch<T extends (...args: any[]) => any>(
  action: T,
): (...args: Parameters<typeof action>) => void {
  const dispatch = useDispatch();
  return useCallback((...actionArguments) => flow([action, dispatch])(...actionArguments), [dispatch, action]);
}
