import React, { useCallback, useRef } from 'react';

import { IVideoAttachment } from 'kimbu-models';
import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getVideoAttachmentsAction } from '@store/chats/actions';
import { IGroupable } from '@store/chats/models';
import { getSelectedChatVideosSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { setSeparators } from '@utils/set-separators';

import { VideoFromList } from './video/video-from-list';

import './video-list.scss';

const ATTACHMENTS_GROUP_PREFIX = 'videos';

export const VideoList = () => {
  const getVideoAttachmentss = useActionWithDispatch(getVideoAttachmentsAction);
  const containerRef = useRef<HTMLDivElement>(null);
  const videosForSelectedChat = useSelector(getSelectedChatVideosSelector);

  const loadMore = useCallback(() => {
    getVideoAttachmentss();
  }, [getVideoAttachmentss]);

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
          separateGroupable({
            groupableItems: videosWithSeparators,
            prefix: ATTACHMENTS_GROUP_PREFIX,
          }).map((pack) => (
            <div key={pack.id} className="chat-video__video-container">
              <ChatAttachment
                items={pack.attachments}
                AttachmentComponent={VideoAttachmentComponent}
              />
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};
