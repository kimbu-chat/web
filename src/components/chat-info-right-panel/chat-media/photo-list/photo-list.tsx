import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getPhotoAttachmentsAction } from '@store/chats/actions';
import { getSelectedChatPhotosSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { setSeparators } from '@utils/set-separators';
import { InfiniteScroll } from '@components/infinite-scroll';
import { PHOTO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { separateGroupable } from '@utils/date-utils';
import { ChatAttachment } from '@utils/chat-attachment/chat-attachment';
import { IPictureAttachment } from '@store/chats/models';

import { Photo } from './photo/photo';

import './photo-list.scss';

const PhotoList = () => {
  const getPhotoAttachments = useActionWithDispatch(getPhotoAttachmentsAction);
  const photoForSelectedChat = useSelector(getSelectedChatPhotosSelector);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: photoForSelectedChat?.photos.length || 0,
      limit: PHOTO_ATTACHMENTS_LIMIT,
    };

    getPhotoAttachments({
      page,
    });
  }, [photoForSelectedChat?.photos.length, getPhotoAttachments]);

  const photosWithSeparators = setSeparators(
    photoForSelectedChat?.photos,
    { separateByMonth: true, separateByYear: true },
    { separateByMonth: true, separateByYear: true },
  );

  const PhotoAttachmentComponent: React.FC<IPictureAttachment> = ({ ...photo }) =>
    photoForSelectedChat?.photos ? (
      <Photo photo={photo} attachmentsArr={photoForSelectedChat.photos} />
    ) : null;

  return (
    <div className="chat-photo">
      <InfiniteScroll
        className="chat-photo__photo-container"
        onReachBottom={loadMore}
        hasMore={photoForSelectedChat?.hasMore}
        isLoading={photoForSelectedChat?.loading}>
        {photosWithSeparators &&
          separateGroupable(photosWithSeparators).map((photoArr) => (
            <div key={`${photoArr[0]?.id}Arr`}>
              <ChatAttachment items={photoArr} AttachmentComponent={PhotoAttachmentComponent} />
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};

PhotoList.displayName = 'PhotoList';

export { PhotoList };
