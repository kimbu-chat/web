export function debounce<F extends () => void>(
  fn: F,
  ms: number,
  shouldRunFirst = true,
  shouldRunLast = true,
) {
  let waitingTimeout: number | undefined;

  return (...args: Parameters<F>) => {
    if (waitingTimeout) {
      clearTimeout(waitingTimeout);
      waitingTimeout = undefined;
    } else if (shouldRunFirst) {
      // eslint-disable-next-line
      // @ts-ignore
      fn(...args);
    }

    // eslint-disable-next-line no-restricted-globals
    waitingTimeout = self.setTimeout(() => {
      if (shouldRunLast) {
        // eslint-disable-next-line
        // @ts-ignore
        fn(...args);
      }

      waitingTimeout = undefined;
    }, ms);
  };
}
