import { useCallback } from 'react';
import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';
import { withDeferred } from '../functions/with-deffered';
import { createCustomAction } from 'typesafe-actions';

type ActionReturnType = ReturnType<typeof createCustomAction>;
type ArgumentTypes<F extends ActionReturnType> = F extends (...args: infer A) => any ? A : never;

export function useActionWithDeferred<T extends ActionReturnType>(
	action: T,
): <PromiseReturnType = any>(payload: ArgumentTypes<typeof action>[0]) => Promise<PromiseReturnType> {
	const dispatch = useDispatch();
	return useCallback(flow([action, withDeferred(dispatch)]), [dispatch, action]);
}
