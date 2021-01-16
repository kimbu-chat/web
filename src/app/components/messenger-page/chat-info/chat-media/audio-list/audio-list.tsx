import React, { useCallback } from 'react';
import './audio-list.scss';

import { useSelector } from 'react-redux';
import { getSelectedChatAudiosSelector } from 'store/chats/selectors';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from 'app/utils/set-separators';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { AUDIO_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { MessageAudioAttachment } from 'components';

export const AudioList = React.memo(() => {
  const audiosForSelectedChat = useSelector(getSelectedChatAudiosSelector);

  const getAudios = useActionWithDispatch(ChatActions.getAudioAttachments);

  const loadMore = useCallback(() => {
    getAudios({ page: { offset: audiosForSelectedChat?.audios.length || 0, limit: AUDIO_ATTACHMENTS_LIMIT } });
  }, [getAudios, audiosForSelectedChat?.audios.length]);

  const audiosWithSeparators = setSeparators(
    audiosForSelectedChat?.audios,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className='chat-audios'>
      <div className='chat-audios__audios'>
        <InfiniteScroll onReachExtreme={loadMore} hasMore={audiosForSelectedChat?.hasMore} isLoading={audiosForSelectedChat?.loading} threshold={0.3}>
          {audiosWithSeparators?.map((attachment) => (
            <div key={attachment.id} className='chat-audios__audio'>
              {attachment.needToShowMonthSeparator && (
                <div className='chat-audios__separator'>
                  {attachment.needToShowYearSeparator || doesYearDifferFromCurrent(attachment.creationDateTime)
                    ? moment(attachment.creationDateTime).format('MMMM YYYY')
                    : moment(attachment.creationDateTime).format('MMMM')}
                </div>
              )}
              <MessageAudioAttachment key={attachment.id} attachment={attachment} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
});
