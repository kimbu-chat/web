import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getSelectedChatAudiosSelector } from '@store/chats/selectors';
import { getAudioAttachmentsAction } from '@store/chats/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/infinite-scroll';
import { MessageAudioAttachment } from '@components/audio-attachment';
import { AUDIO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import './audio-list.scss';
import { separateGroupable } from '@utils/date-utils';
import { IAudioAttachment } from '@store/chats/models';
import { ChatAttachment } from '@utils/chat-attachment/chat-attachment';

const AudioAttachmentComponent: React.FC<IAudioAttachment> = ({ ...audio }) => (
  <div className="chat-audios__audio">
    <MessageAudioAttachment {...audio} />
  </div>
);

export const AudioList = () => {
  const audiosForSelectedChat = useSelector(getSelectedChatAudiosSelector);

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
    <div className="chat-audios">
      <div className="chat-audios__audios">
        <InfiniteScroll
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
