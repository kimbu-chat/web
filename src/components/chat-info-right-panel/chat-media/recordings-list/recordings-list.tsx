import React, { useCallback, useRef } from 'react';

import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { RecordingAttachment } from '@components/message-item/attachments/recording-attachment/recording-attachment';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getVoiceAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatRecordingsSelector } from '@store/chats/selectors';
import { separateGroupable } from '@utils/date-utils';
import { VOICE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { setSeparators } from '@utils/set-separators';

import './recordings-list.scss';

export const RecordingsList = () => {
  const recordingsForSelectedChat = useSelector(getSelectedChatRecordingsSelector);
  const containerRef = useRef<HTMLDivElement>(null);
  const getRecordings = useActionWithDispatch(getVoiceAttachmentsAction);

  const loadMore = useCallback(() => {
    getRecordings({
      page: {
        // TODO: set up default offset and limit values
        offset: recordingsForSelectedChat?.recordings.length || 0,
        limit: VOICE_ATTACHMENTS_LIMIT,
      },
    });
  }, [getRecordings, recordingsForSelectedChat]);

  const recordingsWithSeparators = setSeparators(
    recordingsForSelectedChat?.recordings,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-recordings" ref={containerRef}>
      <div className="chat-recordings__recordings">
        <InfiniteScroll
          containerRef={containerRef}
          onReachBottom={loadMore}
          hasMore={recordingsForSelectedChat?.hasMore}
          isLoading={recordingsForSelectedChat?.loading}>
          {recordingsWithSeparators &&
            separateGroupable(recordingsWithSeparators).map((recordingsArr) => (
              <div key={`${recordingsArr[0]?.id}Arr`}>
                <ChatAttachment items={recordingsArr} AttachmentComponent={RecordingAttachment} />
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
