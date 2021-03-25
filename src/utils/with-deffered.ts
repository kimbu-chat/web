import curryRight from 'lodash/curryRight';
import { Dispatch } from 'redux';
import { RootAction } from 'typesafe-actions';

export const withDeferred = curryRight(
  (action: RootAction, dispatch: Dispatch) => new Promise((resolve, reject) => dispatch({ ...action, meta: { deferred: { resolve, reject } } })),
);
