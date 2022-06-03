import { useCallback } from 'react';

import flow from 'lodash/flow';
import { useDispatch } from 'react-redux';

export function useActionWithDispatch<
    T extends (...args: never[]) => any,
    >(action: T): (...args: Parameters<typeof action>) => void {
    const dispatch = useDispatch();
    return useCallback(
        (...actionArguments) => flow([action, dispatch])(...actionArguments),
        [dispatch, action],
    );
}
