import React, { useCallback, useRef } from 'react';

import { useSelector } from 'react-redux';

import { MessageAudioAttachment } from '@components/audio-attachment';
import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getAudioAttachmentsAction } from '@store/chats/actions';
import { IAudioAttachment } from '@store/chats/models';
import { getSelectedChatAudiosSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { AUDIO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { setSeparators } from '@utils/set-separators';

import './audio-list.scss';

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
    getAudios({
      page: { offset: audiosForSelectedChat?.audios.length || 0, limit: AUDIO_ATTACHMENTS_LIMIT },
    });
  }, [getAudios, audiosForSelectedChat?.audios.length]);

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
            separateGroupable(audiosWithSeparators).map((audiosArr) => (
              <div key={`${audiosArr[0]?.id}Arr`}>
                <ChatAttachment items={audiosArr} AttachmentComponent={AudioAttachmentComponent} />
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
