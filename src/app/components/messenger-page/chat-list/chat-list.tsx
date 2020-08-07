import React, { useEffect, useCallback, useRef } from 'react';
import './chat-list.scss';

import ChatFromList from '../chat-from-list/chat-from-list';
import InfiniteScroll from 'react-infinite-scroller';

import CircularProgress from '@material-ui/core/CircularProgress';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { Dialog } from 'app/store/dialogs/models';
import { RootState } from 'app/store/root-reducer';
import { ChatActions } from 'app/store/dialogs/actions';

export const DIALOGS_LIMIT = 25;

const ChatList = () => {
	const getChats = useActionWithDispatch(ChatActions.getChats);

	const dialogs = useSelector<RootState, Dialog[]>((rootState) => rootState.dialogs.dialogs);
	const hasMoreDialogs = useSelector<RootState, boolean>((rootState) => rootState.dialogs.hasMore);
	const searchString = useSelector<RootState, string>((rootState) => rootState.dialogs.searchString);

	useEffect(() => {
		getChats({
			page: { offset: 0, limit: DIALOGS_LIMIT },
			initializedBySearch: true,
			initiatedByScrolling: false,
			name: searchString,
		});
	}, [searchString]);

	const loadPage = useCallback(() => {
		const pageData = {
			limit: 25,
			offset: dialogs.length,
		};

		getChats({
			page: pageData,
			initializedBySearch: false,
			initiatedByScrolling: true,
			name: searchString,
		});
	}, [searchString, dialogs]);

	const chatListRef = useRef(null);

	return (
		<div ref={chatListRef} className='messenger__chat-list'>
			<InfiniteScroll
				pageStart={0}
				loadMore={loadPage}
				hasMore={hasMoreDialogs}
				loader={
					<div className='loader ' key={0}>
						<div className=''>
							<CircularProgress />
						</div>
					</div>
				}
				useWindow={false}
				getScrollParent={() => chatListRef.current}
				isReverse={false}
			>
				{dialogs?.map((dialog: Dialog) => {
					return <ChatFromList dialog={dialog} key={dialog.id} />;
				})}
			</InfiniteScroll>
		</div>
	);
};

export default React.memo(ChatList);
