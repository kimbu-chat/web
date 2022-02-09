import React, { RefObject, useCallback } from 'react';

import { IVoiceAttachment } from 'kimbu-models';
import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { RecordingAttachment } from '@components/message-item/attachments/recording-attachment/recording-attachment';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getVoiceAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatRecordingsSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { setSeparators } from '@utils/set-separators';

import './chat-recordings.scss';

const ATTACHMENTS_GROUP_PREFIX = 'recordings';

interface IRecordingsListProps {
  rootRef: RefObject<HTMLDivElement>;
}

export const RecordingsList: React.FC<IRecordingsListProps> = ({ rootRef }) => {
  const recordingsForSelectedChat = useSelector(getSelectedChatRecordingsSelector);
  const getRecordings = useActionWithDispatch(getVoiceAttachmentsAction);

  const loadMore = useCallback(() => {
    getRecordings();
  }, [getRecordings]);

  const recordingsWithSeparators = setSeparators<IVoiceAttachment>(
    recordingsForSelectedChat?.data,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-recordings">
      <div className="chat-recordings__recordings">
        <InfiniteScroll
          debounceTime={500}
          triggerMargin={200}
          containerRef={rootRef}
          onReachBottom={loadMore}
          hasMore={recordingsForSelectedChat?.hasMore}
          isLoading={recordingsForSelectedChat?.loading}>
          {recordingsWithSeparators &&
            separateGroupable<IVoiceAttachment>({
              groupableItems: recordingsWithSeparators,
              prefix: ATTACHMENTS_GROUP_PREFIX,
            }).map((pack) => (
              <div key={pack.id}>
                <ChatAttachment
                  items={pack.attachments}
                  AttachmentComponent={RecordingAttachment}
                />
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
