import { FadeAnimationWrapper } from '@components/shared';
import { MediaModal } from '@components/messenger-page';
import { IGroupable, IPictureAttachment } from '@store/chats/models';
import { doesYearDifferFromCurrent } from '@utils/set-separators';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';

interface IPhotoProps {
  photo: IPictureAttachment & IGroupable;
  attachmentsArr: IPictureAttachment[];
}

export const Photo: React.FC<IPhotoProps> = ({ photo, attachmentsArr }) => {
  const [bigPhotoDisplayed, setBigPhotoDisplayed] = useState(false);
  const changeBigPhotoDisplayed = useCallback(() => setBigPhotoDisplayed((oldState) => !oldState), [
    setBigPhotoDisplayed,
  ]);

  return (
    <>
      {photo.needToShowMonthSeparator && (
        <div className="chat-photo__separator">
          {photo.needToShowMonthSeparator &&
            (photo.needToShowYearSeparator || doesYearDifferFromCurrent(photo.creationDateTime)
              ? dayjs(photo.creationDateTime).format('MMMM YYYY')
              : dayjs(photo.creationDateTime).format('MMMM'))}
        </div>
      )}
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
