import { Register } from '@store/auth/features/register/register';
import { getStringInitials } from '@utils/interlocutor-name-utils';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as CloseSVG } from '@icons/ic-close.svg';

import { useTranslation } from 'react-i18next';
import { authLoadingSelector } from '@store/auth/selectors';
import { useSelector } from 'react-redux';
import { CheckNicknameAvailability } from '@store/my-profile/features/check-nickname-availability/check-nickname-availability';
import { CancelAvatarUploading } from '@store/my-profile/features/cancel-avatar-uploading/cancel-avatar-uploading';
import { UploadAvatar } from '@store/my-profile/features/upload-avatar/upload-avatar';
import { validateNickname } from '@utils/validate-nick-name';
import { Avatar, BaseBtn } from '@components/shared';
import { PhotoEditor, CircularProgress } from '@components/messenger-page';
import { IAvatarSelectedData, IAvatar } from '@store/common/models';

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

  const uploadRegistrationAvatar = useActionWithDeferred(UploadAvatar.action);
  const register = useActionWithDeferred(Register.action);
  const checkNicknameAvailability = useActionWithDeferred(CheckNicknameAvailability.action);
  const cancelAvatarUploading = useActionWithDispatch(CancelAvatarUploading.action);

  const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);

  const [avatarData, setAvatarData] = useState<IAvatarSelectedData | null>(null);
  const [avararUploadResponse, setAvatarUploadResponse] = useState<IAvatar | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const [uploaded, setUploaded] = useState(0);
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

  const applyAvatarData = useCallback(
    (data: IAvatarSelectedData) => {
      setAvatarData(data);
      setUploadEnded(false);
      uploadRegistrationAvatar({ pathToFile: data.croppedImagePath, onProgress: setUploaded })
        .then((response) => {
          setAvatarUploadResponse(response);
          setUploadEnded(true);
        })
        .catch(() => {
          setAvatarData(null);
          setAvatarUploadResponse(null);
          setUploadEnded(true);
        });
    },
    [setAvatarData, setUploaded, uploadRegistrationAvatar, setAvatarUploadResponse],
  );

  const discardAvatar = useCallback(() => {
    cancelAvatarUploading();
    setAvatarData(null);
    setAvatarUploadResponse(null);
    setUploadEnded(true);
  }, [cancelAvatarUploading]);

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
              <div className="create-group-chat__current-photo-wrapper">
                <Avatar
                  src={avatarData?.croppedImagePath}
                  className="create-group-chat__current-photo">
                  {getStringInitials(`${firstName} ${lastName}`)}
                </Avatar>
                {avatarData && (
                  <>
                    <CircularProgress progress={uploaded} />
                    <button
                      type="button"
                      onClick={discardAvatar}
                      className="create-group-chat__remove-photo">
                      <CloseSVG viewBox="0 0 25 25" />
                    </button>
                  </>
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
                className="create-group-chat__change-photo__btn">
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
          <BaseBtn
            disabled={
              !uploadEnded ||
              !(firstName.length > 0) ||
              !(lastName.length > 0) ||
              !isNickNameAvailable ||
              isNickNameCheckLoading
            }
            isLoading={isLoading}
            onClick={onSubmit}
            variant="contained"
            color="primary"
            width="contained"
            className="phone-confirmation__btn">
            {t('register.register')}
          </BaseBtn>
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
