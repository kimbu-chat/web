import React, { useCallback, useContext } from 'react';
import './chat-photo.scss';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { ChatActions } from 'store/chats/actions';
import { getSelectedChatPhotosSelector } from 'store/chats/selectors';
import { IPage } from 'app/store/models';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { setSeparators } from 'app/utils/set-separators';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { PHOTO_ATTACHMENTS_LIMIT } from 'app/utils/pagination-limits';
import { Photo } from './photo/photo';

export const ChatPhoto = React.memo(() => {
  const { t } = useContext(LocalizationContext);

  const getPhotoAttachmentss = useActionWithDispatch(ChatActions.getPhotoAttachments);

  const photoForSelectedChat = useSelector(getSelectedChatPhotosSelector);

  const location = useLocation();

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: photoForSelectedChat?.photos!.length || 0,
      limit: PHOTO_ATTACHMENTS_LIMIT,
    };

    getPhotoAttachmentss({
      page,
    });
  }, [photoForSelectedChat?.photos]);

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
      >
        {photosWithSeparators?.map((photo) => (
          <Photo photo={photo} key={photo.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
});
