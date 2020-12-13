import * as React from 'react';

namespace InfiniteScrollNS {
  export interface Props {
    children: React.ReactNode;
    loader: React.ReactNode;
    className?: string;
    hasMore?: boolean;
    isLoading: boolean;
    onReachExtreme: Function;
    isReverse?: boolean;
    threshold?: number | Array<number>;
  }
}

export const InfiniteScroll: React.FC<InfiniteScrollNS.Props> = ({
  children,
  loader,
  className = '',
  hasMore,
  isLoading,
  onReachExtreme,
  isReverse,
  threshold = 0.0,
}) => {
  const loaderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadMore = (entries: Array<IntersectionObserverEntry>) => {
      const [first] = entries;

      if (!isLoading && hasMore && first.isIntersecting) {
        onReachExtreme();
      }
    };

    const options = { threshold };
    const observer = new IntersectionObserver(loadMore, options);

    const loaderCurrent = loaderRef.current;
    if (loaderCurrent) {
      observer.observe(loaderCurrent);
    }

    return () => {
      if (loaderCurrent) {
        observer.unobserve(loaderCurrent);
      }
    };
  }, [hasMore, isLoading, onReachExtreme, threshold]);

  return (
    <div style={{ display: 'flex', flexDirection: isReverse ? 'column-reverse' : 'column' }} className={`endless-scroll-wrapper ${className}`}>
      {children}
      {hasMore && (
        <div ref={loaderRef} className='endless-scroll-loader-wrapper'>
          {loader}
        </div>
      )}
    </div>
  );
};
