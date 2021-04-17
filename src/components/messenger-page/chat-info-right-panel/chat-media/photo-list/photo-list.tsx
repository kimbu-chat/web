import React, { useCallback } from 'react';
import './photo-list.scss';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useSelector } from 'react-redux';
import { getPhotoAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatPhotosSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/messenger-page';
import { PHOTO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { Photo } from './photo/photo';

const PhotoList = React.memo(() => {
  const getPhotoAttachmentss = useActionWithDispatch(getPhotoAttachmentsAction);

  const photoForSelectedChat = useSelector(getSelectedChatPhotosSelector);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: photoForSelectedChat?.photos.length || 0,
      limit: PHOTO_ATTACHMENTS_LIMIT,
    };

    getPhotoAttachmentss({
      page,
    });
  }, [photoForSelectedChat?.photos, getPhotoAttachmentss]);

  const photosWithSeparators = setSeparators(
    photoForSelectedChat?.photos,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  return (
    <div className="chat-photo">
      <InfiniteScroll
        className="chat-photo__photo-container"
        onReachExtreme={loadMore}
        hasMore={photoForSelectedChat?.hasMore}
        isLoading={photoForSelectedChat?.loading}>
        {photosWithSeparators?.map((photo) => (
          <Photo photo={photo} attachmentsArr={photosWithSeparators} key={photo.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
});

PhotoList.displayName = 'PhotoList';

export { PhotoList };
