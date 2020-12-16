import React, { useCallback, useContext } from 'react';
import './chat-recordings.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { Link, useLocation } from 'react-router-dom';
import { LocalizationContext } from 'app/app';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from 'utils/functions/set-separators';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { VOICE_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { ChatRecording } from './chat-recording/chat-recording';

export const ChatRecordings = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const selectedChat = useSelector(getSelectedChatSelector);
  const recordingsForSelectedChat = selectedChat?.recordings;

  const location = useLocation();

  const getRecordings = useActionWithDispatch(ChatActions.getVoiceAttachments);

  const loadMore = useCallback(() => {
    getRecordings({ chatId: selectedChat?.id!, page: { offset: recordingsForSelectedChat?.recordings.length!, limit: VOICE_ATTACHMENTS_LIMIT } });
  }, [getRecordings, selectedChat, recordingsForSelectedChat]);

  const recordingsWithSeparators = setSeparators(
    recordingsForSelectedChat?.recordings,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className='chat-recordings'>
      <div className='chat-recordings__top'>
        <Link to={location.pathname.replace(/audio-recordings\/?/, '')} className='chat-recordings__back'>
          <ReturnSvg viewBox='0 0 25 25' />
        </Link>
        <div className='chat-recordings__heading'>{t('chatRecordings.recordings')}</div>
      </div>
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
              <ChatRecording key={recording.id} recording={recording} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});
