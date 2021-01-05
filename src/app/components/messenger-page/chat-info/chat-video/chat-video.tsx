import React, { useCallback, useContext } from 'react';
import './chat-video.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';

import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { ChatActions } from 'store/chats/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatVideosSelector } from 'store/chats/selectors';
import { IPage } from 'app/store/models';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { setSeparators } from 'app/utils/set-separators';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { VIDEO_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { VideoFromList } from './video/video-from-list';

export const ChatVideo = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const getVideoAttachmentss = useActionWithDispatch(ChatActions.getVideoAttachments);

  const videosForSelectedChat = useSelector(getSelectedChatVideosSelector);

  const location = useLocation();

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: videosForSelectedChat?.videos!.length || 0,
      limit: VIDEO_ATTACHMENTS_LIMIT,
    };

    getVideoAttachmentss({
      page,
    });
  }, [videosForSelectedChat?.videos]);

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
      <InfiniteScroll
        className='chat-video__video-container'
        onReachExtreme={loadMore}
        hasMore={videosForSelectedChat?.hasMore}
        isLoading={videosForSelectedChat?.loading}
      >
        {videosWithSeparators?.map((video) => (
          <VideoFromList key={video.id} video={video} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
