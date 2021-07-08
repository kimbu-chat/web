import { useEffect, RefObject } from 'react';

import throttle from 'lodash/fp/throttle';

type IntersectionObserverHook = {
  target: RefObject<HTMLElement>;
  onIntersect: IntersectionObserverCallback;
  threshold?: number | number[];
  margin?: number;
  throttleMs?: number;
};

function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 0.1,
  margin,
  throttleMs,
}: IntersectionObserverHook) {
  const callback = throttleMs ? throttle(throttleMs, onIntersect) : onIntersect;
  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      rootMargin: margin ? `${margin}px` : undefined,
      threshold,
    });

    const current = target.current as Element;

    observer.observe(current);
    return () => {
      observer.unobserve(current);
    };
  });
}

export default useIntersectionObserver;
