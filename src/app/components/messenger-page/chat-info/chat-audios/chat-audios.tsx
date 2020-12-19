import React, { useCallback, useContext, useEffect } from 'react';
import './chat-audios.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { LocalizationContext } from 'app/app';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { ChatActions } from 'store/chats/actions';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import moment from 'moment';

import { doesYearDifferFromCurrent, setSeparators } from 'app/utils/set-separators';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { AUDIO_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { MessageAudioAttachment } from '../../shared/audio-attachment/audio-attachment';

export const ChatAudios = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const selectedChat = useSelector(getSelectedChatSelector);
  const audiosForSelectedChat = selectedChat?.audios;

  const location = useLocation();

  const getAudios = useActionWithDispatch(ChatActions.getAudioAttachments);

  const loadMore = useCallback(() => {
    getAudios({ chatId: selectedChat?.id!, page: { offset: audiosForSelectedChat?.audios.length || 0, limit: AUDIO_ATTACHMENTS_LIMIT } });
  }, [getAudios, selectedChat?.id, audiosForSelectedChat?.audios.length]);

  const audiosWithSeparators = setSeparators(
    audiosForSelectedChat?.audios,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  useEffect(loadMore, []);

  return (
    <div className='chat-audios'>
      <div className='chat-audios__top'>
        <Link to={location.pathname.replace(/audios\/?/, '')} className='chat-audios__back'>
          <ReturnSvg viewBox='0 0 25 25' />
        </Link>
        <div className='chat-audios__heading'>{t('chatAudios.audios')}</div>
      </div>
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
