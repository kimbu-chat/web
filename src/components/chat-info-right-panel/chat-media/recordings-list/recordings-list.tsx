import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { getSelectedChatRecordingsSelector } from '@store/chats/selectors';
import { getVoiceAttachmentsAction } from '@store/chats/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { doesYearDifferFromCurrent, setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components';
import { VOICE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { RecordingAttachment } from '@components/message-item/attachments/recording-attachment/recording-attachment';

import './recordings-list.scss';

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
          onReachExtreme={loadMore}
          hasMore={recordingsForSelectedChat?.hasMore}
          isLoading={recordingsForSelectedChat?.loading}>
          {recordingsWithSeparators?.map((recording) => (
            <div key={recording.id} className="chat-recordings__recording">
              {recording.needToShowMonthSeparator && (
                <div className="chat-recordings__separator">
                  {recording.needToShowYearSeparator ||
                  doesYearDifferFromCurrent(recording.creationDateTime)
                    ? dayjs(recording.creationDateTime).format('MMMM YYYY')
                    : dayjs(recording.creationDateTime).format('MMMM')}
                </div>
              )}
              <RecordingAttachment key={recording.id} attachment={recording} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
