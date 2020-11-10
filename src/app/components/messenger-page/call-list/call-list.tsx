import React, { useCallback, useEffect, useRef } from 'react';
import './call-list.scss';

import { RootState } from 'app/store/root-reducer';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import CallFromList from './call-from-list/call-from-list';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';

const CallList = () => {
	const calls = useSelector((state: RootState) => state.calls);
	const callListRef = useRef<HTMLDivElement>(null);

	const getCalls = useActionWithDispatch(CallActions.getCallsAction);

	const loadMore = useCallback(() => {
		getCalls({
			page: {
				offset: calls.calls.length,
				limit: 20,
			},
		});
	}, [getCalls, calls.calls]);

	useEffect(loadMore, [loadMore]);

	return (
		<div ref={callListRef} className='call-list'>
			{false && (
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={calls.hasMore}
					getScrollParent={() => callListRef.current}
					loader={
						<div className='loader ' key={0}>
							<div className=''>
								<div className='lds-ellipsis'>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						</div>
					}
					useWindow={false}
					isReverse={false}
				>
					{calls.calls.map((call) => (
						<CallFromList key={call.id} call={call} />
					))}
				</InfiniteScroll>
			)}

			{calls.calls.map((call) => (
				<CallFromList key={call.id} call={call} />
			))}
		</div>
	);
};

export default CallList;
