import React, { useCallback, useState, useMemo } from 'react';
import './call-list.scss';

import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getCallsAction } from '@store/calls/actions';
import {
  getCallsListSelector,
  getSearchCallsListSelector,
  gethasMoreCallsSelector,
  getCallsAreLoadingSelector,
} from '@store/calls/selectors';
import { InfiniteScroll, SearchTop } from '@components/messenger-page';
import { CALL_LIMIT } from '@utils/pagination-limits';
import { ICall } from '@store/calls/common/models';
import { CallItem } from './call-item/call-item';

export const CallList = () => {
  const calls = useSelector(getCallsListSelector);
  const searchCalls = useSelector(getSearchCallsListSelector);
  const hasMoreCalls = useSelector(gethasMoreCallsSelector);
  const areCallsLoading = useSelector(getCallsAreLoadingSelector);

  const getCalls = useActionWithDispatch(getCallsAction);

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
        offset: searchString.length ? searchCalls.length : calls.length,
        limit: CALL_LIMIT,
      },
      initializedByScroll: true,
      name: searchString,
    });
  }, [calls.length, getCalls, searchString, searchCalls.length]);

  const renderCall = useCallback((call: ICall) => <CallItem key={call.id} call={call} />, []);

  const renderedCalls = useMemo(() => {
    if (searchString.length) {
      return searchCalls.map(renderCall);
    }
    return calls.map(renderCall);
  }, [searchString.length, searchCalls, calls, renderCall]);

  return (
    <div className="messenger__calls">
      <SearchTop onChange={changeSearchString} searchFor="calls" />
      <div className="call-list">
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={hasMoreCalls}
          isLoading={areCallsLoading}>
          {renderedCalls}
        </InfiniteScroll>
      </div>
    </div>
  );
};
