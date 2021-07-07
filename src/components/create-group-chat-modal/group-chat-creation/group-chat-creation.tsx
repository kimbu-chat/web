import React, { lazy, useCallback, useRef, useState } from 'react';

import { LabeledInput } from '@components/labeled-input';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { loadPhotoEditor } from '@routing/module-loader';
import { IAvatar, IAvatarSelectedData } from '@store/common/models';
import {
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
} from '@store/my-profile/actions';

const PhotoEditor = lazy(loadPhotoEditor);

interface IGroupChatCreationProps {
  setAvatarUploadResponse: (avatar: IAvatar | null) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
}

const GroupChatCreation: React.FC<IGroupChatCreationProps> = ({
  setAvatarUploadResponse,
  setName,
  setDescription,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadGroupChatAvatar = useActionWithDeferred(uploadAvatarRequestAction);
  const cancelAvatarUploading = useActionWithDispatch(cancelAvatarUploadingRequestAction);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const [avatarData, setAvatarData] = useState<IAvatarSelectedData | null>(null);

  const applyAvatarData = useCallback(
    async (data: IAvatarSelectedData) => {
      setAvatarData(data);
      try {
        const response = await uploadGroupChatAvatar({
          pathToFile: data.croppedImagePath,
        });
        setAvatarUploadResponse(response);
      } catch {
        setAvatarData(null);
        setAvatarUploadResponse(null);
      }
    },
    [setAvatarData, uploadGroupChatAvatar, setAvatarUploadResponse],
  );

  const displayChangePhoto = useCallback(
    () => setChangePhotoDisplayed(true),
    [setChangePhotoDisplayed],
  );
  const hideChangePhoto = useCallback(
    () => setChangePhotoDisplayed(false),
    [setChangePhotoDisplayed],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const reader = new FileReader();

      reader.onload = () => {
        setImageUrl(reader.result as string);
        displayChangePhoto();
      };

      if (e.target.files) {
        reader.readAsDataURL(e.target.files[0]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [displayChangePhoto, setImageUrl, fileInputRef],
  );

  const discardAvatar = useCallback(() => {
    cancelAvatarUploading();
    setAvatarData(null);
    setAvatarUploadResponse(null);
  }, [cancelAvatarUploading, setAvatarUploadResponse]);

  return (
    <>
      <div className="create-group-chat">
        <div className="create-group-chat__current-photo-wrapper">
          <GroupSvg viewBox="0 0 24 24" className="create-group-chat__current-photo-wrapper__alt" />
          <input
            onChange={handleImageChange}
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
          />
          {avatarData?.croppedImagePath && (
            <img
              src={avatarData?.croppedImagePath}
              alt=""
              className="create-group-chat__current-photo-wrapper__img"
            />
          )}
          <button
            type="button"
            onClick={() => {
              discardAvatar();
              fileInputRef.current?.click();
            }}
            className="create-group-chat__change-photo-btn">
            <PictureSvg viewBox="0 0 18 19" />
            <span>Upload New Photo</span>
          </button>
          <TopAvatarLine
            className="create-group-chat__current-photo-wrapper__top-line"
            viewBox="0 0 48 48"
          />
          <BottomAvatarLine
            className="create-group-chat__current-photo-wrapper__bottom-line"
            viewBox="0 0 114 114"
          />
        </div>
        <div className="create-group-chat__criteria">At least 256*256px PNG or JPG </div>

        <LabeledInput
          label="Name"
          onChange={(e) => setName(e.target.value)}
          containerClassName="create-group-chat__input"
        />

        <LabeledInput
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
          containerClassName="create-group-chat__input"
        />
      </div>
      {changePhotoDisplayed && (
        <PhotoEditor
          hideChangePhoto={hideChangePhoto}
          imageUrl={imageUrl}
          onSubmit={applyAvatarData}
        />
      )}
    </>
  );
};
GroupChatCreation.displayName = 'GroupChatCreation';

export { GroupChatCreation };
