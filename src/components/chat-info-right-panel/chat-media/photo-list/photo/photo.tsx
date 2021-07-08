import React from 'react';

import { MediaModal } from '@components/image-modal';
import ProgressiveImage from '@components/progressive-image';
import { useToggledState } from '@hooks/use-toggled-state';
import { IPictureAttachment } from '@store/chats/models';

interface IPhotoProps {
  photo: IPictureAttachment;
  attachmentsArr: IPictureAttachment[];
}

export const Photo: React.FC<IPhotoProps> = ({ photo, attachmentsArr }) => {
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
      />
      {/* <img
        alt="low speed"
        onClick={displayBigPhoto}
        key={photo.id}
        className="chat-photo__photo"
        src={photo.url}
      /> */}
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
