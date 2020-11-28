import React, { useCallback, useContext, useRef } from 'react';
import './chat-video.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';

import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { ChatActions } from 'store/chats/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { Page } from 'store/common/models';
import InfiniteScroll from 'react-infinite-scroller';
import { Link, useLocation } from 'react-router-dom';
import { setSeparators } from 'utils/functions/set-separators';
import { VideoFromList } from './video/video-from-list';

export const ChatVideo = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  const getVideoAttachmentss = useActionWithDispatch(ChatActions.getVideoAttachments);
  const selectedChat = useSelector(getSelectedChatSelector);
  const videosForSelectedChat = selectedChat!.videos;

  const location = useLocation();

  const loadMore = useCallback(() => {
    const page: Page = {
      offset: videosForSelectedChat?.videos!.length || 0,
      limit: 20,
    };

    getVideoAttachmentss({
      page,
      chatId: selectedChat!.id,
    });
  }, [selectedChat!.id, videosForSelectedChat?.videos]);

  const videosWithSeparators = setSeparators(
    videosForSelectedChat?.videos,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className='chat-video'>
      <div className='chat-video__top'>
        <Link to={location.pathname.replace(/video\/?/, '')} className='chat-video__back'>
          <ReturnSvg viewBox='0 0 25 25' />
        </Link>
        <div className='chat-video__heading'>{t('chatVideo.video')}</div>
      </div>
      <div className='chat-video__video-container'>
        <InfiniteScroll
          pageStart={0}
          initialLoad
          loadMore={loadMore}
          hasMore={videosForSelectedChat.hasMore}
          getScrollParent={() => videoContainerRef.current}
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
          useWindow={false}
          isReverse={false}
        >
          {videosWithSeparators?.map((video) => (
            <VideoFromList key={video.id} video={video} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});
