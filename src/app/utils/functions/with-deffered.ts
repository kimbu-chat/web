import curryRight from 'lodash/curryRight';
import { Dispatch } from 'redux';

export const withDeferred = curryRight(
	(action: any, dispatch: Dispatch) =>
		new Promise((resolve, reject) => dispatch({ ...action, meta: { deferred: { resolve, reject } } })),
);
