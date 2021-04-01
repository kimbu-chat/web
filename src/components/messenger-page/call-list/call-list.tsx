import React, { useCallback } from 'react';
import './call-list.scss';

import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import * as CallActions from '@store/calls/actions';
import {
  getCallsListSelector,
  gethasMoreCallsSelector,
  getCallsAreLoadingSelector,
} from '@store/calls/selectors';
import { InfiniteScroll } from '@components/messenger-page';
import { CALL_LIMIT } from '@utils/pagination-limits';
import { CallItem } from './call-item/call-item';

export const CallList = () => {
  const calls = useSelector(getCallsListSelector);
  const hasMoreCalls = useSelector(gethasMoreCallsSelector);
  const areCallsLoading = useSelector(getCallsAreLoadingSelector);

  const getCalls = useActionWithDispatch(CallActions.getCallsAction);

  const loadMore = useCallback(() => {
    getCalls({
      page: {
        offset: calls.length,
        limit: CALL_LIMIT,
      },
    });
  }, [calls, getCalls]);

  return (
    <div className="call-list">
      <InfiniteScroll onReachExtreme={loadMore} hasMore={hasMoreCalls} isLoading={areCallsLoading}>
        {calls.map((call) => (
          <CallItem key={call.id} call={call} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
