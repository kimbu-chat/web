import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getSelectedChatRecordingsSelector } from '@store/chats/selectors';
import { getVoiceAttachmentsAction } from '@store/chats/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/infinite-scroll';
import { VOICE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { RecordingAttachment } from '@components/message-item/attachments/recording-attachment/recording-attachment';
import './recordings-list.scss';
import { separateGroupable } from '@utils/date-utils';
import { ChatAttachment } from '@components/chat-attachment/chat-attachment';

export const RecordingsList = () => {
  const recordingsForSelectedChat = useSelector(getSelectedChatRecordingsSelector);

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
    <div className="chat-recordings">
      <div className="chat-recordings__recordings">
        <InfiniteScroll
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
