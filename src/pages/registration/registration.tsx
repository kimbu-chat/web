import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getStringInitials } from '@utils/user-utils';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { authLoadingSelector } from '@store/auth/selectors';
import { validateNickname } from '@utils/validate-nick-name';
import { Button } from '@components/button';
import { IAvatarSelectedData, IAvatar } from '@store/common/models';
import {
  cancelAvatarUploadingRequestAction,
  checkNicknameAvailabilityAction,
  uploadAvatarRequestAction,
} from '@store/my-profile/actions';
import { registerAction } from '@store/login/actions';

const PhotoEditor = lazy(() => import('@components/photo-editor/photo-editor'));

interface IRegistrationProps {
  preloadNext: () => void;
}

export const Registration: React.FC<IRegistrationProps> = ({ preloadNext }) => {
  const { t } = useTranslation();

  const isLoading = useSelector(authLoadingSelector);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    preloadNext();
  }, [preloadNext]);

  const uploadRegistrationAvatar = useActionWithDeferred(uploadAvatarRequestAction);
  const register = useActionWithDeferred(registerAction);
  const checkNicknameAvailability = useActionWithDeferred(checkNicknameAvailabilityAction);
  const cancelAvatarUploading = useActionWithDispatch(cancelAvatarUploadingRequestAction);

  const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);

  const [avararUploadResponse, setAvatarUploadResponse] = useState<IAvatar | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const [uploadEnded, setUploadEnded] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);
  const [isNickNameValid, setIsNickNameValid] = useState(true);
  const [isNickNameCheckLoading, setIsNickNameCheckLoading] = useState(true);

  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [
    setChangePhotoDisplayed,
  ]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [
    setChangePhotoDisplayed,
  ]);
  const changeFirstName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value),
    [setFirstName],
  );
  const changeLastName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value),
    [setLastName],
  );

  const onChangeNickname = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newNickName = event.target.value;
      setNickName(newNickName);

      if (validateNickname(newNickName)) {
        setIsNickNameCheckLoading(true);
        setIsNickNameValid(true);

        checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
          setIsNickNameAvailable(isAvailable);
          setIsNickNameCheckLoading(false);
        });
      } else {
        setIsNickNameValid(false);
      }
    },
    [
      setNickName,
      setIsNickNameAvailable,
      checkNicknameAvailability,
      setIsNickNameCheckLoading,
      setIsNickNameValid,
    ],
  );

  const discardAvatar = useCallback(() => {
    cancelAvatarUploading();
    setAvatarUploadResponse(null);
    setUploadEnded(true);
  }, [cancelAvatarUploading]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      discardAvatar();
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
    [displayChangePhoto, setImageUrl, fileInputRef, discardAvatar],
  );

  const applyAvatarData = useCallback(
    async (data: IAvatarSelectedData) => {
      try {
        setUploadEnded(false);
        const response = await uploadRegistrationAvatar({
          pathToFile: data.croppedImagePath,
        });
        setAvatarUploadResponse(response);
        setUploadEnded(true);
      } catch {
        setAvatarUploadResponse(null);
        setUploadEnded(true);
      }
    },
    [uploadRegistrationAvatar, setAvatarUploadResponse],
  );

  const onSubmit = useCallback(() => {
    register({
      firstName,
      lastName,
      nickname: nickName,
      avatarId: avararUploadResponse?.id,
    });
  }, [register, firstName, lastName, nickName, avararUploadResponse?.id]);

  return (
    <>
      <div className="registration">
        <div className="registration__window">
          <div className="registrtion__avatar-upload">
            <div className="edit-profile__photo-data">
              <div className="registration__current-photo-wrapper">
                {avararUploadResponse?.previewUrl ? (
                  <img
                    draggable={false}
                    alt={getStringInitials(`${firstName} ${lastName}`)}
                    src={avararUploadResponse?.previewUrl}
                    className="registration__current-photo"
                  />
                ) : (
                  <div draggable={false} className="registration__current-photo">
                    {getStringInitials(`${firstName} ${lastName}`)}
                  </div>
                )}
              </div>
              <input
                onChange={handleImageChange}
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
              />
              <button
                type="button"
                onClick={openFileExplorer}
                className="registration__change-photo__btn">
                Upload New Photo
              </button>
              <div className="register__photo-requirements">{t('register.photo-requirements')}</div>
            </div>
          </div>
          <div className="registration__user-data">
            <div className="registration__input-group">
              <input
                onChange={changeFirstName}
                placeholder="First name"
                type="text"
                className="registrtion__input"
              />
              <input
                onChange={changeLastName}
                placeholder="Last name"
                type="text"
                className="registrtion__input"
              />
            </div>
            <div className="registration__input-group">
              {!isNickNameValid && <div>This nick name is not acceptable</div>}
              <input
                onChange={onChangeNickname}
                placeholder="Nickname"
                type="text"
                className="registrtion__input"
              />
            </div>
          </div>
          <Button
            disabled={
              !uploadEnded ||
              !firstName.length ||
              !lastName.length ||
              !isNickNameAvailable ||
              isNickNameCheckLoading
            }
            loading={isLoading}
            onClick={onSubmit}
            className="phone-confirmation__btn">
            {t('register.register')}
          </Button>
        </div>
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

export default Registration;
