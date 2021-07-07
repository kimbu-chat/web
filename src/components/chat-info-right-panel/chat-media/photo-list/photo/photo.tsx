import React from 'react';

import { MediaModal } from '@components/image-modal';
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
      <img
        alt="low speed"
        onClick={displayBigPhoto}
        key={photo.id}
        className="chat-photo__photo"
        src={photo.url}
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
