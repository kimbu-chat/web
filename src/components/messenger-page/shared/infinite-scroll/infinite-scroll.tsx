import * as React from 'react';
import { InfiniteScrollLoader } from './infinite-scroll-loader/infinite-scroll-loader';

interface IInfiniteScrollProps {
  children: React.ReactNode;
  Loader?: () => JSX.Element;
  className?: string;
  hasMore?: boolean;
  isLoading?: boolean;
  onReachExtreme: () => void;
  isReverse?: boolean;
  threshold?: number | Array<number>;
}

const InfiniteScroll: React.FC<IInfiniteScrollProps> = React.memo(
  ({ children, Loader = InfiniteScrollLoader, className = '', hasMore, isLoading, onReachExtreme, isReverse, threshold = 0.0 }) => {
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
            <Loader />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.hasMore === nextProps.hasMore,
);

InfiniteScroll.displayName = 'InfiniteScroll';

export { InfiniteScroll };
