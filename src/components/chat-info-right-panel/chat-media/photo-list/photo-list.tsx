import React, { useCallback } from 'react';

import { useSelector } from 'react-redux';

import { ChatAttachment } from '@components/chat-attachment/chat-attachment';
import { InfiniteScroll } from '@components/infinite-scroll';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getPhotoAttachmentsAction } from '@store/chats/actions';
import { IPictureAttachment } from '@store/chats/models';
import { getSelectedChatPhotosSelector } from '@store/chats/selectors';
import { IPage } from '@store/common/models';
import { separateGroupable } from '@utils/date-utils';
import { PHOTO_ATTACHMENTS_LIMIT } from '@utils/pagination-limits';
import { setSeparators } from '@utils/set-separators';

import { Photo } from './photo/photo';

import type { ObserveFn } from '@hooks/use-intersection-observer';

import './photo-list.scss';

type PhotoListProps = {
  observeIntersection: ObserveFn;
};

const PhotoList: React.FC<PhotoListProps> = ({ observeIntersection }) => {
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
      <Photo
        photo={photo}
        attachmentsArr={photoForSelectedChat.photos}
        observeIntersection={observeIntersection}
      />
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
            <ChatAttachment
              key={`${photoArr[0]?.id}Arr`}
              items={photoArr}
              AttachmentComponent={PhotoAttachmentComponent}
            />
          ))}
      </InfiniteScroll>
    </div>
  );
};

PhotoList.displayName = 'PhotoList';

export { PhotoList };
