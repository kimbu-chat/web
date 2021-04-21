import React, { useCallback } from 'react';
import './recordings-list.scss';

import { useSelector } from 'react-redux';
import { getSelectedChatRecordingsSelector } from '@store/chats/selectors';
import { getVoiceAttachmentsAction } from '@store/chats/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/messenger-page';
import { VOICE_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { Recording } from './recording/recording';

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
                    ? moment(recording.creationDateTime).format('MMMM YYYY')
                    : moment(recording.creationDateTime).format('MMMM')}
                </div>
              )}
              <Recording key={recording.id} {...recording} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
