import React, { useCallback, useState } from 'react';
import './photo-attachment.scss';

import { FadeAnimationWrapper, ImageModal } from 'components';
import { IPictureAttachment } from 'store/chats/models';

interface IMessagePhotoAttachmentProps {
  attachment: IPictureAttachment;
}

export const MessagePhotoAttachment: React.FC<IMessagePhotoAttachmentProps> = React.memo(({ attachment }) => {
  const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
  const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [setBigPhotoDisplayed]);

  return (
    <>
      <div onClick={changeBigPhotoDisplayed} className='photo-attachment'>
        <img src={attachment.previewUrl} alt='' className='photo-attachment__img' />
      </div>
      <FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
        <ImageModal url={attachment.url} onClose={changeBigPhotoDisplayed} />
      </FadeAnimationWrapper>
    </>
  );
});
