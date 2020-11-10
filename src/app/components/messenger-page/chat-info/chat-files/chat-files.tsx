import React, { useCallback, useContext, useRef } from 'react';
import './chat-files.scss';

import ReturnSvg from 'app/assets/icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { Page } from 'app/store/common/models';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation } from 'react-router-dom';
import FileAttachment from '../../shared/file-attachment/file-attachment';
import moment from 'moment';

import { setSeparators } from 'app/utils/functions/set-separators';

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
			limit: 25,
		};

		console.log(page);

		getFiles({
			page,
			chatId: selectedChat!.id,
		});
	}, [selectedChat!.id, filesForSelectedDialog?.files]);

	const filesWithSeparators = setSeparators(filesForSelectedDialog?.files, 'month', true);

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
						<React.Fragment key={file.id}>
							{file.needToShowSeparator && (
								<div className='chat-files__separator'>
									{moment(file.creationDateTime).format('MMMM')}
								</div>
							)}
							<FileAttachment attachment={file} />
						</React.Fragment>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default ChatFiles;
