import React, { useCallback, useState } from 'react';
import './call-list.scss';

import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import * as CallActions from '@store/calls/actions';
import {
  getCallsListSelector,
  getSearchCallsListSelector,
  gethasMoreCallsSelector,
  getCallsAreLoadingSelector,
} from '@store/calls/selectors';
import { InfiniteScroll, SearchTop } from '@components/messenger-page';
import { CALL_LIMIT } from '@utils/pagination-limits';
import { CallItem } from './call-item/call-item';

export const CallList = () => {
  const calls = useSelector(getCallsListSelector);
  const searchCalls = useSelector(getSearchCallsListSelector);
  const hasMoreCalls = useSelector(gethasMoreCallsSelector);
  const areCallsLoading = useSelector(getCallsAreLoadingSelector);

  const getCalls = useActionWithDispatch(CallActions.getCallsAction);

  const [searchString, setSearchString] = useState('');
  const changeSearchString = useCallback(
    (name: string) => {
      setSearchString(name);
    },
    [setSearchString],
  );

  const loadMore = useCallback(() => {
    getCalls({
      page: {
        offset: searchString.length > 0 ? searchCalls.length : calls.length,
        limit: CALL_LIMIT,
      },
      initializedByScroll: true,
      name: searchString,
    });
  }, [calls.length, getCalls, searchString, searchCalls.length]);

  return (
    <div className="messenger__calls">
      <SearchTop onChange={changeSearchString} searchFor="calls" />
      <div className="call-list">
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreCalls}
          isLoading={areCallsLoading}>
          {}

          {searchString.length > 0
            ? searchCalls.map((call) => <CallItem key={call.id} call={call} />)
            : calls.map((call) => <CallItem key={call.id} call={call} />)}
        </InfiniteScroll>
      </div>
    </div>
  );
};
