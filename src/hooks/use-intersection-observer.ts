import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import throttle from 'lodash/fp/throttle';
import noop from 'lodash/noop';

type IntersectionObserverHook = {
  rootRef: RefObject<HTMLElement>;
  threshold?: number | number[];
  margin?: number;
  throttleMs?: number;
};

type TargetCallback = (entry: IntersectionObserverEntry) => void;
type RootCallback = (entries: IntersectionObserverEntry[]) => void;
type ObserveCleanup = () => void;
export type ObserveFn = (target: HTMLElement, targetCallback?: TargetCallback) => ObserveCleanup;
type IntersectionController = {
  observer: IntersectionObserver;
  callbacks: Map<HTMLElement, TargetCallback>;
};

export function useIntersectionObserver(
  { rootRef, threshold, margin, throttleMs }: IntersectionObserverHook,
  rootCallback?: RootCallback,
) {
  const intersectionControllerRef = useRef<IntersectionController>();
  const rootCallbackRef = useRef<RootCallback>();
  rootCallbackRef.current = rootCallback;

  useEffect(
    () => () => {
      if (intersectionControllerRef.current) {
        intersectionControllerRef.current.observer.disconnect();
        intersectionControllerRef.current.callbacks.clear();
        intersectionControllerRef.current = undefined;
      }
    },
    [],
  );

  function initIntersectionController() {
    const callbacks = new Map();
    const entriesAccumulator = new Map<Element, IntersectionObserverEntry>();

    const observerCallbackSync = () => {
      const entries = Array.from(entriesAccumulator.values());

      entries.forEach((entry: IntersectionObserverEntry) => {
        const callback = callbacks.get(entry.target);

        if (callback) {
          callback(entry, entries);
        }
      });

      if (rootCallbackRef.current) {
        rootCallbackRef.current(entries);
      }

      entriesAccumulator.clear();
    };

    const scheduler = throttleMs ? throttle : undefined;

    const observerCallback = scheduler
      ? scheduler(throttleMs as number, observerCallbackSync)
      : observerCallbackSync;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entriesAccumulator.set(entry.target, entry);
        });
        observerCallback();
      },
      {
        root: rootRef.current,
        rootMargin: margin ? `${margin}px` : undefined,
        threshold,
      },
    );

    intersectionControllerRef.current = { observer, callbacks };
  }

  const observe = useCallback(
    (target: HTMLElement, targetCallback: TargetCallback | undefined) => {
      if (!intersectionControllerRef.current) {
        initIntersectionController();
      }

      const controller = intersectionControllerRef.current;
      controller?.observer.observe(target);

      if (targetCallback) {
        controller?.callbacks.set(target, targetCallback);
      }

      return () => {
        if (targetCallback) {
          controller?.callbacks.delete(target);
        }

        controller?.observer.unobserve(target);
      };
    },
    // Arguments should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { observe };
}

export function useOnIntersect(
  targetRef: RefObject<HTMLDivElement>,
  observe?: ObserveFn,
  callback?: TargetCallback,
) {
  const unobserveRef = useRef<ObserveCleanup>(noop);
  useEffect(
    () => {
      unobserveRef.current = observe
        ? observe(targetRef.current as HTMLDivElement, callback)
        : noop;

      return unobserveRef.current;
    },
    // Arguments should never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { unobserve: unobserveRef.current };
}

export function useIsIntersecting(
  targetRef: RefObject<HTMLDivElement>,
  observe?: ObserveFn,
  callback?: TargetCallback,
) {
  const [isIntersecting, setIsIntersecting] = useState(!observe);

  const { unobserve } = useOnIntersect(targetRef, observe, (entry) => {
    setIsIntersecting(entry.isIntersecting);

    if (callback) {
      callback(entry);
    }
  });

  if (isIntersecting) {
    unobserve();
  }

  return isIntersecting;
}
