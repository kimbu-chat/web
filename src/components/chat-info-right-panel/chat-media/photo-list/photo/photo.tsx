import React from 'react';

import { MediaModal } from '@components/image-modal';
import ProgressiveImage from '@components/progressive-image';
import { useToggledState } from '@hooks/use-toggled-state';
import { IPictureAttachment } from '@store/chats/models';

import type { ObserveFn } from '@hooks/use-intersection-observer';

type PhotoProps = {
  photo: IPictureAttachment;
  attachmentsArr: IPictureAttachment[];
  observeIntersection: ObserveFn;
};

export const Photo: React.FC<PhotoProps> = ({ photo, attachmentsArr, observeIntersection }) => {
  const [bigPhotoDisplayed, displayBigPhoto, hideBigPhoto] = useToggledState(false);

  return (
    <>
      <ProgressiveImage
        onClick={displayBigPhoto}
        thumb={photo.previewUrl}
        src={photo.url}
        alt={photo.fileName}
        className="chat-photo__photo"
        width={148}
        height={98}
        observeIntersection={observeIntersection}
      />
      {bigPhotoDisplayed && (
        <MediaModal
          attachmentId={photo.id}
          attachmentsArr={attachmentsArr}
          onClose={hideBigPhoto}
        />
      )}
    </>
  );
};
