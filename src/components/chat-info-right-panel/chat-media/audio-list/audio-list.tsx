import React, { useCallback, useRef } from 'react';

import { IAudioAttachment } from 'kimbu-models';
import { useSelector } from 'react-redux';

import { MessageAudioAttachment } from '@components/audio-attachment';
import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getAudioAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatAudiosSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { setSeparators } from '@utils/set-separators';

import './audio-list.scss';

const ATTACHMENTS_GROUP_PREFIX = 'audios';

const AudioAttachmentComponent: React.FC<IAudioAttachment> = ({ ...audio }) => (
  <div className="chat-audios__audio">
    <MessageAudioAttachment {...audio} />
  </div>
);

export const AudioList = () => {
  const audiosForSelectedChat = useSelector(getSelectedChatAudiosSelector);
  const containerRef = useRef<HTMLDivElement>(null);
  const getAudios = useActionWithDispatch(getAudioAttachmentsAction);

  const loadMore = useCallback(() => {
    getAudios();
  }, [getAudios]);

  const audiosWithSeparators = setSeparators(
    audiosForSelectedChat?.audios,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-audios" ref={containerRef}>
      <div className="chat-audios__audios">
        <InfiniteScroll
          containerRef={containerRef}
          onReachBottom={loadMore}
          hasMore={audiosForSelectedChat?.hasMore}
          isLoading={audiosForSelectedChat?.loading}
          threshold={0.3}>
          {audiosWithSeparators &&
            separateGroupable({
              groupableItems: audiosWithSeparators,
              prefix: ATTACHMENTS_GROUP_PREFIX,
            }).map((pack) => (
              <div key={pack.id}>
                <ChatAttachment
                  items={pack.attachments}
                  AttachmentComponent={AudioAttachmentComponent}
                />
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
