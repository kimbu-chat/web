import React, { useCallback } from 'react';
import './call-list.scss';

import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { CallActions } from 'store/calls/actions';
import { getCallsList, gethasMoreCalls, getCallsAreLoading } from 'app/store/calls/selectors';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { CALL_LIMIT } from 'app/utils/pagination-limits';
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
        limit: CALL_LIMIT,
      },
    });
  }, [calls]);

  return (
    <div className='call-list'>
      <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreCalls} isLoading={areCallsLoading}>
        {calls.map((call) => (
          <CallFromList key={call.id} call={call} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
