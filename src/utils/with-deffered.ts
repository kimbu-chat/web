import { ActionCreatorWithPreparedPayload } from '@reduxjs/toolkit';
import curryRight from 'lodash/curryRight';
import { Dispatch } from 'redux';

export const withDeferred = curryRight(
  (action: ActionCreatorWithPreparedPayload<unknown[], unknown>, dispatch: Dispatch) =>
    new Promise((resolve, reject) =>
      dispatch({ ...action, meta: { deferred: { resolve, reject } } }),
    ),
);
