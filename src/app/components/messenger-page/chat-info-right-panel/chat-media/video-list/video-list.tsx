import React, { useCallback } from 'react';
import './video-list.scss';

import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { ChatActions } from 'store/chats/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatVideosSelector } from 'store/chats/selectors';
import { IPage } from 'app/store/common/models';
import { setSeparators } from 'app/utils/set-separators';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { VIDEO_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { VideoFromList } from './video/video-from-list';

export const VideoList = React.memo(() => {
  const getVideoAttachmentss = useActionWithDispatch(ChatActions.getVideoAttachments);

  const videosForSelectedChat = useSelector(getSelectedChatVideosSelector);

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
