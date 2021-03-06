import React, { lazy, useCallback, useRef, useState } from 'react';

import { IAvatar } from 'kimbu-models';
import { useTranslation } from 'react-i18next';

import { LabeledInput } from '@components/labeled-input';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import { ReactComponent as DeleteSvg } from '@icons/delete.svg';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { ReactComponent as PictureSvg } from '@icons/picture.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { loadPhotoEditor } from '@routing/module-loader';
import { IAvatarSelectedData } from '@store/common/models';
import {
  uploadAvatarRequestAction,
  cancelAvatarUploadingRequestAction,
} from '@store/my-profile/actions';

const PhotoEditor = lazy(loadPhotoEditor);

interface IGroupChatCreationProps {
  setAvatarUploadResponse: (avatar?: IAvatar) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
}

const BLOCK_NAME = 'create-group-chat';

const GroupChatCreation: React.FC<IGroupChatCreationProps> = ({
  setAvatarUploadResponse,
  setName,
  setDescription,
}) => {
  const { t } = useTranslation();

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
        setAvatarUploadResponse(undefined);
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
    setAvatarUploadResponse(undefined);
  }, [cancelAvatarUploading, setAvatarUploadResponse]);

  const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);

  return (
    <>
      <div className={BLOCK_NAME}>
        <div className={`${BLOCK_NAME}__current-photo-wrapper`}>
          <GroupSvg className={`${BLOCK_NAME}__current-photo-wrapper__alt`} />
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
              className={`${BLOCK_NAME}__current-photo-wrapper__img`}
            />
          )}
          <button
            type="button"
            onClick={openFileExplorer}
            className={`${BLOCK_NAME}__change-photo-btn`}>
            <PictureSvg />
            <span>{t('groupChatCreation.upload_new')}</span>
          </button>
          <TopAvatarLine className={`${BLOCK_NAME}__current-photo-wrapper__top-line`} />
          <BottomAvatarLine className={`${BLOCK_NAME}__current-photo-wrapper__bottom-line`} />
        </div>
        <div className={`${BLOCK_NAME}__criteria`}>{t('groupChatCreation.requirements')}</div>

        {avatarData?.croppedImagePath && (
          <button type="button" onClick={discardAvatar} className={`${BLOCK_NAME}__delete`}>
            <DeleteSvg className={`${BLOCK_NAME}__delete__icon`} />
            <span className={`${BLOCK_NAME}__delete__text`}>
              {t('groupChatCreation.delete-photo')}
            </span>
          </button>
        )}

        <LabeledInput
          autoFocus
          maxLength={35}
          label={t('groupChatCreation.name')}
          onChange={(e) => setName(e.target.value)}
          containerClassName={`${BLOCK_NAME}__input`}
        />

        <LabeledInput
          label={t('groupChatCreation.description')}
          onChange={(e) => setDescription(e.target.value)}
          containerClassName={`${BLOCK_NAME}__input`}
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
