import React, { RefObject, useMemo } from 'react';

import classnames from 'classnames';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';

import { useIntersectionObserver, useOnIntersect } from '@hooks/use-intersection-observer';

import './infinite-scroll.scss';

type InfiniteScrollProps = {
  children: React.ReactNode;
  className?: string;
  hasMore?: boolean;
  onReachTop?: () => void;
  onReachBottom?: () => void;
  threshold?: number | Array<number>;
  containerRef: RefObject<HTMLDivElement>;
  triggerMargin?: number;
  debounceTime?: number;
};

const TRIGGER_MARGIN = 500;

const LOAD_MORE_DEBOUNCE = 1000;

const BLOCK_NAME = 'infinite-scroll';

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  className,
  hasMore,
  onReachTop = noop,
  onReachBottom = noop,
  threshold = 0.0,
  containerRef,
  triggerMargin = TRIGGER_MARGIN,
  debounceTime = LOAD_MORE_DEBOUNCE,
}) => {
  const backwardsTriggerRef = React.useRef<HTMLDivElement>(null);
  const forwardsTriggerRef = React.useRef<HTMLDivElement>(null);

  const [loadMoreTop, loadMoreBottom] = useMemo(
    () => [
      debounce(onReachTop, debounceTime, { leading: true, trailing: false }),
      debounce(onReachBottom, debounceTime, { leading: true, trailing: false }),
    ],
    [debounceTime, onReachTop, onReachBottom],
  );

  const { observe: observeIntersection } = useIntersectionObserver(
    {
      rootRef: containerRef,
      margin: triggerMargin,
      threshold,
    },
    (entries) => {
      if (!hasMore) {
        return;
      }
      const triggerEntry = entries.find(({ isIntersecting }) => isIntersecting);

      if (!triggerEntry) {
        return;
      }

      const { target } = triggerEntry;

      if (target.className === 'top-trigger') {
        loadMoreTop();
      } else if (target.className === 'bottom-trigger') {
        loadMoreBottom();
      }
    },
  );

  useOnIntersect(forwardsTriggerRef, observeIntersection);
  useOnIntersect(backwardsTriggerRef, observeIntersection);

  return (
    <div className={classnames(BLOCK_NAME, className)}>
      <div ref={backwardsTriggerRef} key="top-trigger" className="top-trigger" />
      {children}
      <div ref={forwardsTriggerRef} key="bottom-trigger" className="bottom-trigger" />
    </div>
  );
};

InfiniteScroll.displayName = 'InfiniteScroll';
