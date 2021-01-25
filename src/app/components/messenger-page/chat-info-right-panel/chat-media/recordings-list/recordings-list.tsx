import React, { useCallback } from 'react';
import './recordings-list.scss';

import { useSelector } from 'react-redux';
import { getSelectedChatRecordingsSelector } from 'store/chats/selectors';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from 'app/utils/set-separators';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { VOICE_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { Recording } from './recording/recording';

export const RecordingsList = React.memo(() => {
  const recordingsForSelectedChat = useSelector(getSelectedChatRecordingsSelector);

  const getRecordings = useActionWithDispatch(ChatActions.getVoiceAttachments);

  const loadMore = useCallback(() => {
    getRecordings({ page: { offset: recordingsForSelectedChat?.recordings.length!, limit: VOICE_ATTACHMENTS_LIMIT } });
  }, [getRecordings, recordingsForSelectedChat]);

  const recordingsWithSeparators = setSeparators(
    recordingsForSelectedChat?.recordings,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className='chat-recordings'>
      <div className='chat-recordings__recordings'>
        <InfiniteScroll onReachExtreme={loadMore} hasMore={recordingsForSelectedChat?.hasMore} isLoading={recordingsForSelectedChat?.loading}>
          {recordingsWithSeparators?.map((recording) => (
            <div key={recording.id} className='chat-recordings__recording'>
              {recording.needToShowMonthSeparator && (
                <div className='chat-recordings__separator'>
                  {recording.needToShowYearSeparator || doesYearDifferFromCurrent(recording.creationDateTime)
                    ? moment(recording.creationDateTime).format('MMMM YYYY')
                    : moment(recording.creationDateTime).format('MMMM')}
                </div>
              )}
              <Recording key={recording.id} recording={recording} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});
