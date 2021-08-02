import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { CenteredLoader, LoaderSize } from '@components/loader';
import { SearchBox } from '@components/search-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getCallsAction, resetSearchCallsAction } from '@store/calls/actions';
import { getCallsListSelector, getSearchCallsListSelector } from '@store/calls/selectors';
import { CALL_LIMIT } from '@utils/pagination-limits';

import { CallItem } from './call-item/call-item';

import './call-list.scss';

const BLOCK_NAME = 'call-list';

export const CallList = () => {
  const callsList = useSelector(getCallsListSelector);
  const searchCallsList = useSelector(getSearchCallsListSelector);
  const getCalls = useActionWithDispatch(getCallsAction);
  const resetSearchCalls = useActionWithDispatch(resetSearchCallsAction);

  const containerRef = useRef<HTMLDivElement>(null);

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
    <div>
      <div className={`${BLOCK_NAME}__search-top`}>
        <SearchBox
          containerClassName={`${BLOCK_NAME}__search-top__search-container`}
          inputClassName={`${BLOCK_NAME}__search-top__search-input`}
          iconClassName={`${BLOCK_NAME}__search-top__search-icon`}
          onChange={changeSearchString}
        />
      </div>
      <div className={BLOCK_NAME} ref={containerRef}>
        {searchCallsList.loading || callsList.loading ? (
          <CenteredLoader size={LoaderSize.LARGE} />
        ) : (
          <InfiniteScroll
            containerRef={containerRef}
            onReachBottom={loadMore}
            hasMore={searchString.length ? searchCallsList.hasMore : callsList.hasMore}
            isLoading={searchString.length ? searchCallsList.loading : callsList.loading}>
            {renderedCalls}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
