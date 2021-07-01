import React, { useCallback, useState } from 'react';

import FadeAnimationWrapper from '@components/fade-animation-wrapper';
import { MediaModal } from '@components/image-modal';
import { IPictureAttachment } from '@store/chats/models';

interface IPhotoProps {
  photo: IPictureAttachment;
  attachmentsArr: IPictureAttachment[];
}

export const Photo: React.FC<IPhotoProps> = ({ photo, attachmentsArr }) => {
  const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
  const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [
    setBigPhotoDisplayed,
  ]);

  return (
    <>
      <img
        alt="low speed"
        onClick={changeBigPhotoDisplayed}
        key={photo.id}
        className="chat-photo__photo"
        src={photo.url}
      />
      <FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
        <MediaModal
          attachmentId={photo.id}
          attachmentsArr={attachmentsArr}
          onClose={changeBigPhotoDisplayed}
        />
      </FadeAnimationWrapper>
    </>
  );
};
