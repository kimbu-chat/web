import React, { useCallback, useState } from 'react';
import './photo-attachment.scss';

import { FadeAnimationWrapper, BigPhoto } from 'components';
import { PictureAttachment } from 'store/chats/models';

namespace PhotoAttachment {
  export interface Props {
    attachment: PictureAttachment;
  }
}

export const MessagePhotoAttachment = React.memo(({ attachment }: PhotoAttachment.Props) => {
  const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
  const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [setBigPhotoDisplayed]);

  return (
    <>
      <div onClick={changeBigPhotoDisplayed} className='photo-attachment'>
        <img src={attachment.previewUrl} alt='' className='photo-attachment__img' />
      </div>
      <FadeAnimationWrapper isDisplayed={bigPhotoDisplayed}>
        <BigPhoto url={attachment.url} onClose={changeBigPhotoDisplayed} />
      </FadeAnimationWrapper>
    </>
  );
});
