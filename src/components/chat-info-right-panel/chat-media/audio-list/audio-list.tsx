import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { getSelectedChatAudiosSelector } from '@store/chats/selectors';
import { getAudioAttachmentsAction } from '@store/chats/actions';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { doesYearDifferFromCurrent, setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/infinite-scroll';
import { MessageAudioAttachment } from '@components/audio-attachment';
import { AUDIO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';

import './audio-list.scss';

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
          onReachExtreme={loadMore}
          hasMore={audiosForSelectedChat?.hasMore}
          isLoading={audiosForSelectedChat?.loading}
          threshold={0.3}>
          {audiosWithSeparators?.map((attachment) => (
            <React.Fragment key={attachment.id}>
              {attachment.needToShowMonthSeparator && (
                <div className="chat-audios__separator">
                  {attachment.needToShowYearSeparator ||
                  doesYearDifferFromCurrent(attachment.creationDateTime)
                    ? dayjs(attachment.creationDateTime).format('MMMM YYYY')
                    : dayjs(attachment.creationDateTime).format('MMMM')}
                </div>
              )}
              <div className="chat-audios__audio">
                <MessageAudioAttachment key={attachment.id} {...attachment} />
              </div>
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
