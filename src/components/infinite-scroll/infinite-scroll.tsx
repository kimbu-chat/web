import React from 'react';

import { InfiniteScrollLoader } from './infinite-scroll-loader/infinite-scroll-loader';

import './infinite-scroll.scss';

interface IInfiniteScrollProps {
  children: React.ReactNode;
  Loader?: () => JSX.Element;
  className?: string;
  hasMore?: boolean;
  isLoading?: boolean;
  onReachTop?: () => void;
  onReachBottom?: () => void;
  threshold?: number | Array<number>;
}

export const InfiniteScroll: React.FC<IInfiniteScrollProps> = ({
  children,
  Loader = InfiniteScrollLoader,
  className = '',
  hasMore,
  isLoading,
  onReachTop,
  onReachBottom,
  threshold = 0.0,
}) => {
  const loaderTopRef = React.useRef<HTMLDivElement>(null);
  const loaderBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadMoreTop = (entries: Array<IntersectionObserverEntry>) => {
      const [first] = entries;

      if (!isLoading && onReachTop && hasMore && first.isIntersecting) {
        onReachTop();
      }
    };

    const loadMoreBottom = (entries: Array<IntersectionObserverEntry>) => {
      const [first] = entries;

      if (!isLoading && onReachBottom && hasMore && first.isIntersecting) {
        onReachBottom();
      }
    };

    const options = { threshold };
    const topObserver = new IntersectionObserver(loadMoreTop, options);
    const bottomObserver = new IntersectionObserver(loadMoreBottom, options);

    const topLoaderCurrent = loaderTopRef.current;
    const bottomLoaderCurrent = loaderBottomRef.current;

    if (topLoaderCurrent) {
      topObserver.observe(topLoaderCurrent);
    }

    if (bottomLoaderCurrent) {
      bottomObserver.observe(bottomLoaderCurrent);
    }

    return () => {
      if (topLoaderCurrent) {
        topObserver.unobserve(topLoaderCurrent);
      }

      if (bottomLoaderCurrent) {
        bottomObserver.unobserve(bottomLoaderCurrent);
      }
    };
  }, [hasMore, isLoading, loaderBottomRef, loaderTopRef, onReachBottom, onReachTop, threshold]);

  return (
    <div className={`infinite-scroll ${className}`}>
      {hasMore && onReachTop && (
        <div ref={loaderTopRef} className="infinite-scroll__loader">
          <Loader />
        </div>
      )}
      {children}
      {hasMore && onReachBottom && (
        <div ref={loaderBottomRef} className="infinite-scroll__loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

InfiniteScroll.displayName = 'InfiniteScroll';
