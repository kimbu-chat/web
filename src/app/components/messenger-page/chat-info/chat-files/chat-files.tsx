import React, { useCallback, useContext, useRef } from 'react';
import './chat-files.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'store/chats/actions';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { Page } from 'store/common/models';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from 'utils/functions/set-separators';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { FileAttachment } from '../../shared/file-attachment/file-attachment';

export const ChatFiles = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const filesContainerRef = useRef<HTMLDivElement>(null);

  const getRawAttachments = useActionWithDispatch(ChatActions.getRawAttachments);

  const selectedChat = useSelector(getSelectedChatSelector);
  const filesForSelectedChat = selectedChat?.files;

  const location = useLocation();

  const loadMore = useCallback(() => {
    const page: Page = {
      offset: filesForSelectedChat?.files.length || 0,
      limit: 25,
    };

    getRawAttachments({
      page,
      chatId: selectedChat!.id,
    });
  }, [selectedChat?.id, filesForSelectedChat?.files]);

  const filesWithSeparators = setSeparators(
    filesForSelectedChat?.files,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className='chat-files'>
      <div className='chat-files__top'>
        <Link to={location.pathname.replace(/files\/?/, '')} className='chat-files__back'>
          <ReturnSvg viewBox='0 0 25 25' />
        </Link>
        <div className='chat-files__heading'>{t('chatFiles.files')}</div>
      </div>
      <div ref={filesContainerRef} className='chat-files__file-container'>
        <InfiniteScroll
          onReachExtreme={loadMore}
          hasMore={filesForSelectedChat?.hasMore}
          isLoading={filesForSelectedChat?.loading}
          threshold={0.3}
          loader={
            <div className='loader ' key={0}>
              <div className=''>
                <div className='lds-ellipsis'>
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          }
        >
          {filesWithSeparators?.map((file) => (
            <React.Fragment key={file.id}>
              {file.needToShowMonthSeparator && (
                <div className='chat-files__separator'>
                  {file.needToShowYearSeparator || doesYearDifferFromCurrent(file.creationDateTime)
                    ? moment(file.creationDateTime).format('MMMM YYYY')
                    : moment(file.creationDateTime).format('MMMM')}
                </div>
              )}
              <FileAttachment attachment={file} />
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});
