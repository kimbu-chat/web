import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getCallsAction, resetSearchCallsAction } from '@store/calls/actions';
import { getCallsListSelector, getSearchCallsListSelector } from '@store/calls/selectors';
import { InfiniteScroll, SearchBox } from '@components';
import { CALL_LIMIT } from '@utils/pagination-limits';

import { CallItem } from './call-item/call-item';

import './call-list.scss';

export const CallList = () => {
  const callsList = useSelector(getCallsListSelector);
  const searchCallsList = useSelector(getSearchCallsListSelector);

  const getCalls = useActionWithDispatch(getCallsAction);
  const resetSearchCalls = useActionWithDispatch(resetSearchCallsAction);

  const [searchString, setSearchString] = useState('');
  const changeSearchString = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      getCalls({
        page: {
          offset: 0,
          limit: CALL_LIMIT,
        },
        initializedByScroll: false,
        name: e.target.value,
      });
      setSearchString(e.target.value);
    },
    [setSearchString, getCalls],
  );

  const loadMore = useCallback(() => {
    getCalls({
      page: {
        offset: searchString.length ? searchCallsList.callIds.length : callsList.callIds.length,
        limit: CALL_LIMIT,
      },
      initializedByScroll: true,
      name: searchString,
    });
  }, [callsList.callIds.length, getCalls, searchString, searchCallsList.callIds.length]);

  const renderCall = useCallback((callId: number) => <CallItem key={callId} callId={callId} />, []);

  const renderedCalls = useMemo(() => {
    if (searchString.length) {
      return searchCallsList.callIds.map(renderCall);
    }
    return callsList.callIds.map(renderCall);
  }, [searchString.length, searchCallsList.callIds, callsList.callIds, renderCall]);

  useEffect(
    () => () => {
      resetSearchCalls();
    },
    [resetSearchCalls],
  );

  return (
    <div className="messenger__calls">
      <div className="call-list__search-top">
        <SearchBox
          containerClassName="call-list__search-top__search-container"
          inputClassName="call-list__search-top__search-input"
          iconClassName="call-list__search-top__search-icon"
          onChange={changeSearchString}
        />
      </div>
      <div className="call-list">
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={searchString.length ? searchCallsList.hasMore : callsList.hasMore}
          isLoading={searchString.length ? searchCallsList.loading : callsList.loading}>
          {renderedCalls}
        </InfiniteScroll>
      </div>
    </div>
  );
};