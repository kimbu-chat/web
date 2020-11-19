import React, { useCallback, useContext, useEffect, useRef } from 'react';
import './chat-audios.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';
import { LocalizationContext } from 'app/app';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { ChatActions } from 'app/store/chats/actions';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from 'app/utils/functions/set-separators';
import MessageAudioAttachment from '../../shared/audio-attachment/audio-attachment';

const ChatAudios = () => {
	const { t } = useContext(LocalizationContext);

	const selectedChat = useSelector(getSelectedChatSelector);
	const audios = selectedChat!.audios;

	const getAudios = useActionWithDispatch(ChatActions.getAudioAttachments);

	const loadMore = useCallback(() => {
		getAudios({ chatId: selectedChat?.id!, page: { offset: audios.audios.length, limit: 20 } });
		console.log('loas');
	}, [getAudios, selectedChat?.id, audios.audios.length]);

	const audiosContainerRef = useRef<HTMLDivElement>(null);

	const audiosWithSeparators = setSeparators(
		audios?.audios,
		{ separateByMonth: true, separateByYear: true },
		{ separateByMonth: true },
	);

	useEffect(loadMore, []);

	return (
		<div className='chat-audios'>
			<div className='chat-audios__top'>
				<Link to={location.pathname.replace(/audios\/?/, '')} className='chat-audios__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-audios__heading'>{t('chatAudios.audios')}</div>
			</div>
			<div ref={audiosContainerRef} className='chat-audios__audios'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={false}
					loadMore={loadMore}
					hasMore={audios?.hasMore}
					getScrollParent={() => audiosContainerRef.current}
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
					{audiosWithSeparators?.map((attachment) => (
						<div key={attachment.id} className='chat-audios__audio'>
							{attachment.needToShowMonthSeparator && (
								<div className='chat-audios__separator'>
									{attachment.needToShowYearSeparator ||
									doesYearDifferFromCurrent(attachment.creationDateTime)
										? `${moment(attachment.creationDateTime).format('MMMM')} (${moment(
												attachment.creationDateTime,
										  ).format('YYYY')})`
										: moment(attachment.creationDateTime).format('MMMM')}
								</div>
							)}
							<MessageAudioAttachment key={attachment.id} attachment={attachment} />
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatAudios;
