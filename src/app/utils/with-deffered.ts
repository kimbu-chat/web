import curryRight from 'lodash/curryRight';

export const withDeferred = curryRight(
  (action: any, dispatch: (arg0: any) => void) =>
    new Promise((resolve, reject) => dispatch({ ...action, deferred: { resolve, reject } }))
);
