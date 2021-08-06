import React, { useCallback, useRef } from 'react';

import { IVideoAttachment, IPaginationParams } from 'kimbu-models';
import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getVideoAttachmentsAction } from '@store/chats/actions';
import { IGroupable } from '@store/chats/models';
import { getSelectedChatVideosSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { VIDEO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { setSeparators } from '@utils/set-separators';

import { VideoFromList } from './video/video-from-list';

import './video-list.scss';

export const VideoList = () => {
  const getVideoAttachmentss = useActionWithDispatch(getVideoAttachmentsAction);
  const containerRef = useRef<HTMLDivElement>(null);
  const videosForSelectedChat = useSelector(getSelectedChatVideosSelector);

  const loadMore = useCallback(() => {
    const page: IPaginationParams = {
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

  const VideoAttachmentComponent: React.FC<IVideoAttachment & IGroupable> = ({ ...video }) =>
    videosForSelectedChat?.videos ? (
      <VideoFromList video={video} attachmentsArr={videosForSelectedChat.videos} />
    ) : null;

  return (
    <div className="chat-video" ref={containerRef}>
      <InfiniteScroll
        containerRef={containerRef}
        className="chat-video__scroll"
        onReachBottom={loadMore}
        hasMore={videosForSelectedChat?.hasMore}
        isLoading={videosForSelectedChat?.loading}>
        {videosWithSeparators &&
          separateGroupable(videosWithSeparators).map((videosArr) => (
            <div key={`${videosArr[0]?.id}Arr`} className="chat-video__video-container">
              <ChatAttachment items={videosArr} AttachmentComponent={VideoAttachmentComponent} />
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};
