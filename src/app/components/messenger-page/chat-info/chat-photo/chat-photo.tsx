import React, { useCallback, useContext } from 'react';
import './chat-photo.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'store/chats/actions';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { Page } from 'store/common/models';
import { Link, useLocation } from 'react-router-dom';
import { setSeparators } from 'utils/functions/set-separators';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { Photo } from './photo/photo';

export const ChatPhoto = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const getPhotoAttachmentss = useActionWithDispatch(ChatActions.getPhotoAttachments);

  const selectedChat = useSelector(getSelectedChatSelector);
  const photoForSelectedChat = selectedChat?.photos;

  const location = useLocation();

  const loadMore = useCallback(() => {
    const page: Page = {
      offset: photoForSelectedChat?.photos!.length || 0,
      limit: 20,
    };

    getPhotoAttachmentss({
      page,
      chatId: selectedChat!.id,
    });
  }, [selectedChat!.id, photoForSelectedChat?.photos]);

  const photosWithSeparators = setSeparators(
    photoForSelectedChat?.photos,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className='chat-photo'>
      <div className='chat-photo__top'>
        <Link to={location.pathname.replace(/photo\/?/, '')} className='chat-photo__back'>
          <ReturnSvg viewBox='0 0 25 25' />
        </Link>
        <div className='chat-photo__heading'>{t('chatPhoto.photo')}</div>
      </div>
      <InfiniteScroll
        className='chat-photo__photo-container'
        onReachExtreme={loadMore}
        hasMore={photoForSelectedChat?.hasMore}
        isLoading={photoForSelectedChat?.loading}
        threshold={0.3}
        loader={
          <div className='loader ' key={0}>
            <div className=''>
              <div className='lds-ellipsis'>
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        }
      >
        {photosWithSeparators?.map((photo) => (
          <Photo photo={photo} key={photo.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
