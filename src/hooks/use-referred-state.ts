import { useEffect, useRef } from 'react';

export function useReferState<T>(stateValue: T) {
  const reference = useRef<T>(stateValue);

  useEffect(() => {
    reference.current = stateValue;
  }, [stateValue]);

  return reference;
}
