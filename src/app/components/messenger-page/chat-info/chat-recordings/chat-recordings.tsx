import React, { useCallback, useContext, useRef } from 'react';
import './chat-recordings.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';
import { LocalizationContext } from 'app/app';
import ChatRecording from './chat-recording/chat-recording';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { ChatActions } from 'app/store/chats/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import InfiniteScroll from 'react-infinite-scroller';

const ChatRecordings = () => {
	const { t } = useContext(LocalizationContext);
	const selectedChat = useSelector(getSelectedChatSelector);
	const recordings = selectedChat?.recordings;

	const getRecordings = useActionWithDispatch(ChatActions.getRecordings);

	const loadMore = useCallback(() => {
		getRecordings({ chatId: selectedChat?.id!, page: { offset: recordings?.recordings.length!, limit: 20 } });
	}, [getRecordings, selectedChat, recordings]);

	const recordingsContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div className='chat-recordings'>
			<div className='chat-recordings__top'>
				<Link to={location.pathname.replace('/audio-recordings', '')} className='chat-recordings__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-recordings__heading'>{t('chatRecordings.recordings')}</div>
			</div>
			<div ref={recordingsContainerRef} className='chat-recordings__recordings'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={recordings?.hasMore}
					getScrollParent={() => recordingsContainerRef.current}
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
					{recordings?.recordings.map((recording) => (
						<div className='chat-recordings__recording'>
							<ChatRecording key={recording.id} recording={recording} />
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatRecordings;
