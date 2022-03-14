import React, { RefObject, useCallback } from 'react';

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

interface IAudioListProps {
  rootRef: RefObject<HTMLDivElement>;
}

export const AudioList: React.FC<IAudioListProps> = ({ rootRef }) => {
  const audiosForSelectedChat = useSelector(getSelectedChatAudiosSelector);
  const getAudios = useActionWithDispatch(getAudioAttachmentsAction);

  const loadMore = useCallback(() => {
    getAudios();
  }, [getAudios]);

  const audiosWithSeparators = setSeparators<IAudioAttachment>(
    audiosForSelectedChat?.data,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-audios">
      <div className="chat-audios__audios">
        <InfiniteScroll
          debounceTime={500}
          triggerMargin={200}
          containerRef={rootRef}
          onReachBottom={loadMore}
          hasMore={audiosForSelectedChat?.hasMore}
          isLoading={audiosForSelectedChat?.loading}
          threshold={0.3}>
          {audiosWithSeparators &&
            separateGroupable<IAudioAttachment>({
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
