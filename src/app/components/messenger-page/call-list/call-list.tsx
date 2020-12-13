import React, { useCallback } from 'react';
import './call-list.scss';

import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { getCallsList, gethasMoreCalls, getCallsAreLoading } from 'app/store/calls/selectors';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { CallFromList } from './call-from-list/call-from-list';

export const CallList = () => {
  const calls = useSelector(getCallsList);
  const hasMoreCalls = useSelector(gethasMoreCalls);
  const areCallsLoading = useSelector(getCallsAreLoading);

  const getCalls = useActionWithDispatch(CallActions.getCallsAction);

  const loadMore = useCallback(() => {
    getCalls({
      page: {
        offset: calls.length,
        limit: 20,
      },
    });
  }, [calls]);

  return (
    <div className='call-list'>
      <InfiniteScroll
        onReachExtreme={loadMore}
        hasMore={hasMoreCalls}
        isLoading={areCallsLoading}
        threshold={0.3}
        loader={
          <div className='loader ' key={0}>
            <div className=''>
              <div className='lds-ellipsis'>
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        }
      >
        {calls.map((call) => (
          <CallFromList key={call.id} call={call} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
