import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getVideoAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatVideosSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components';
import { VIDEO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import { VideoFromList } from './video/video-from-list';

import './video-list.scss';

export const VideoList = () => {
  const getVideoAttachmentss = useActionWithDispatch(getVideoAttachmentsAction);

  const videosForSelectedChat = useSelector(getSelectedChatVideosSelector);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: videosForSelectedChat?.videos?.length || 0,
      limit: VIDEO_ATTACHMENTS_LIMIT,
    };

    getVideoAttachmentss({
      page,
    });
  }, [videosForSelectedChat?.videos, getVideoAttachmentss]);

  const videosWithSeparators = setSeparators(
    videosForSelectedChat?.videos,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-video">
      <InfiniteScroll
        className="chat-video__video-container"
        onReachExtreme={loadMore}
        hasMore={videosForSelectedChat?.hasMore}
        isLoading={videosForSelectedChat?.loading}>
        {videosWithSeparators?.map((video) => (
          <VideoFromList attachmentsArr={videosWithSeparators} key={video.id} video={video} />
        ))}
      </InfiniteScroll>
    </div>
  );
};