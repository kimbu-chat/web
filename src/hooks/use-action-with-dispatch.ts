import { useCallback } from 'react';

import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';
import { RootAction } from 'typesafe-actions';

export function useActionWithDispatch<T extends (...args: any[]) => RootAction>(
  action: T,
): (...args: Parameters<typeof action>) => void {
  const dispatch = useDispatch();
  return useCallback(
    (...actionArguments) => flow([action, dispatch])(...actionArguments),
    [dispatch, action],
  );
}
