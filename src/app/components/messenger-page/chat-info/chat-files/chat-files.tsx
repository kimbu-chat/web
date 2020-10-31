import React, { useCallback, useContext, useRef } from 'react';
import './chat-files.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { Page } from 'app/store/common/models';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation } from 'react-router-dom';
import ChatFile from './chat-file/chat-file';

const ChatFiles = () => {
	const { t } = useContext(LocalizationContext);

	const filesContainerRef = useRef<HTMLDivElement>(null);

	const getFiles = useActionWithDispatch(ChatActions.getFiles);
	const selectedChat = useSelector(getSelectedChatSelector);
	const filesForSelectedDialog = selectedChat!.files;

	const location = useLocation();

	const loadMore = useCallback(() => {
		console.log('call');
		const page: Page = {
			offset: filesForSelectedDialog?.files!.length || 0,
			limit: 20,
		};

		console.log(page);

		getFiles({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, filesForSelectedDialog?.files]);

	const filesWithSeparators = filesForSelectedDialog?.files.map((elem, index, array) => {
		const elemCopy = { ...elem };
		if (
			index === 0 ||
			new Date(array[index - 1].creationDateTime).getMonth() !== new Date(elem.creationDateTime).getMonth()
		) {
			elemCopy.needToShowSeparator = true;
		}
		return elemCopy;
	});

	return (
		<div className={'chat-files'}>
			<div className='chat-files__top'>
				<Link to={location.pathname.replace('/files', '')} className='chat-files__back'>
					<ReturnSvg viewBox='0 0 25 25' />
				</Link>
				<div className='chat-files__heading'>{t('chatFiles.files')}</div>
			</div>
			<div ref={filesContainerRef} className='chat-files__file-container'>
				<InfiniteScroll
					pageStart={0}
					initialLoad={true}
					loadMore={loadMore}
					hasMore={filesForSelectedDialog.hasMore}
					getScrollParent={() => filesContainerRef.current}
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
					{filesWithSeparators?.map((file) => (
						<ChatFile file={file} key={file.id} />
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatFiles;
