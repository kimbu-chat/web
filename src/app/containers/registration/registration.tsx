import { Register } from 'app/store/auth/features/register/register';
import { AvatarSelectedData, UploadAvatarResponse } from 'app/store/my-profile/models';
import { getStringInitials } from 'app/utils/functions/interlocutor-name-utils';
import { useActionWithDeferred } from 'app/utils/hooks/use-action-with-deferred';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CloseSVG from 'icons/ic-close.svg';
import { LocalizationContext } from 'app/app';
import { getAuthIsLoading } from 'app/store/auth/selectors';
import { useSelector } from 'react-redux';
import { CheckNicknameAvailability } from 'app/store/my-profile/features/check-nickname-availability/check-nickname-availability';
import { CancelAvatarUploading } from 'app/store/my-profile/features/cancel-avatar-uploading/cancel-avatar-uploading';
import { UploadAvatar } from 'app/store/my-profile/features/upload-avatar/upload-avatar';
import { Avatar, BaseBtn, ChangePhoto, CircularProgress } from '../../components';

namespace RegistrationNS {
  export interface Props {
    preloadNext: () => void;
  }
}

export const Registration: React.FC<RegistrationNS.Props> = ({ preloadNext }) => {
  const { t } = useContext(LocalizationContext);

  const isLoading = useSelector(getAuthIsLoading);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    preloadNext();
  }, []);

  const uploadGroupChatAvatar = useActionWithDeferred(UploadAvatar.action);
  const register = useActionWithDeferred(Register.action);
  const checkNicknameAvailability = useActionWithDeferred(CheckNicknameAvailability.action);
  const cancelAvatarUploading = useActionWithDispatch(CancelAvatarUploading.action);

  const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);

  const [avatarData, setAvatarData] = useState<AvatarSelectedData | null>(null);
  const [avararUploadResponse, setAvatarUploadResponse] = useState<UploadAvatarResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [uploadEnded, setUploadEnded] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);
  const [isNickNameCheckLoading, setIsNickNameCheckLoading] = useState(true);

  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);
  const changeFirstName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value), [setFirstName]);
  const changeLastName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value), [setLastName]);

  const onChangeNickname = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newNickName = event.target.value;
      setNickName(newNickName);
      setIsNickNameCheckLoading(true);
      checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
        setIsNickNameAvailable(isAvailable);
        setIsNickNameCheckLoading(false);
      });
    },
    [setNickName, setIsNickNameAvailable, checkNicknameAvailability, setIsNickNameCheckLoading],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const reader = new FileReader();

      reader.onload = () => {
        setImageUrl(reader.result as string);
        displayChangePhoto();
      };

      if (e.target.files) reader.readAsDataURL(e.target.files[0]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [displayChangePhoto, setImageUrl, fileInputRef],
  );

  const applyAvatarData = useCallback(
    (data: AvatarSelectedData) => {
      setAvatarData(data);
      setUploadEnded(false);
      uploadGroupChatAvatar({ pathToFile: data.croppedImagePath, onProgress: setUploaded })
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
    [setAvatarData, setUploaded, uploadGroupChatAvatar, setAvatarUploadResponse],
  );

  const discardAvatar = useCallback(() => {
    cancelAvatarUploading();
    setAvatarData(null);
    setAvatarUploadResponse(null);
    setUploadEnded(true);
  }, [setAvatarData, setAvatarUploadResponse, setUploadEnded]);

  const onSubmit = useCallback(() => {
    register({
      firstName,
      lastName,
      nickname: nickName,
      avatarId: avararUploadResponse?.id,
    });
  }, [firstName, lastName, nickName, avararUploadResponse]);

  return (
    <>
      <div className='registration'>
        <div className='registration__window'>
          <div className='registrtion__avatar-upload'>
            <div className='edit-profile__photo-data'>
              <div className='create-group-chat__current-photo-wrapper'>
                <Avatar src={avatarData?.croppedImagePath} className='create-group-chat__current-photo'>
                  {getStringInitials(`${firstName} ${lastName}`)}
                </Avatar>
                {avatarData && (
                  <>
                    <CircularProgress progress={uploaded} />
                    <button type='button' onClick={discardAvatar} className='create-group-chat__remove-photo'>
                      <CloseSVG viewBox='0 0 25 25' />
                    </button>
                  </>
                )}
              </div>
              <input onChange={handleImageChange} ref={fileInputRef} type='file' hidden accept='image/*' />
              <button type='button' onClick={openFileExplorer} className='create-group-chat__change-photo__btn'>
                Upload New Photo
              </button>
              <div className='register__photo-requirements'>{t('register.photo-requirements')}</div>
            </div>
          </div>
          <div className='registration__user-data'>
            <div className='registration__input-group'>
              <input onChange={changeFirstName} placeholder='First name' type='text' className='registrtion__input' />
              <input onChange={changeLastName} placeholder='Last name' type='text' className='registrtion__input' />
            </div>
            <div className='registration__input-group'>
              <input onChange={onChangeNickname} placeholder='Nickname' type='text' className='registrtion__input' />
            </div>
          </div>
          <BaseBtn
            disabled={!uploadEnded || !(firstName.length > 0) || !(lastName.length > 0) || !isNickNameAvailable || isNickNameCheckLoading}
            isLoading={isLoading}
            onClick={onSubmit}
            variant='contained'
            color='primary'
            width='contained'
            className='phone-confirmation__btn'
          >
            {t('register.register')}
          </BaseBtn>
        </div>
      </div>
      {changePhotoDisplayed && <ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={applyAvatarData} />}
    </>
  );
};

export default Registration;
