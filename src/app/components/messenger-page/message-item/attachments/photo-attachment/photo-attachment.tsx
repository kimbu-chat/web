import React, { useCallback, useState } from 'react';
import './photo-attachment.scss';

import { FadeAnimationWrapper, BigPhoto } from 'components';
import { IPictureAttachment } from 'store/chats/models';

namespace MessagePhotoAttachmentNS {
  export interface IProps {
    attachment: IPictureAttachment;
  }
}

export const MessagePhotoAttachment = React.memo(({ attachment }: MessagePhotoAttachmentNS.IProps) => {
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
