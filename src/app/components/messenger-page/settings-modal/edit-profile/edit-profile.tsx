import { Avatar, BaseBtn, PhotoEditor } from 'components';
import { getMyProfileSelector } from 'store/my-profile/selectors';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import React, { useCallback, useContext, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './edit-profile.scss';
import CloseSVG from 'icons/ic-close.svg';
import ValidSvg from 'icons/ic-check-filled.svg';
import InValidSvg from 'icons/ic-dismiss.svg';
import { MyProfileActions } from 'store/my-profile/actions';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';

import { LocalizationContext } from 'app/app';
import { IAvatarSelectedData, IAvatar } from 'app/store/common/models';
import { validateNickname } from 'app/utils/validate-nick-name';

export const EditProfile = React.memo(() => {
  const { t } = useContext(LocalizationContext);
  const myProfile = useSelector(getMyProfileSelector);

  const uploadAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
  const updateMyProfile = useActionWithDeferred(MyProfileActions.updateMyProfileAction);
  const checkNicknameAvailability = useActionWithDeferred(MyProfileActions.checkNicknameAvailabilityAction);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const [newAvatar, setNewAvatar] = useState(myProfile?.avatar);
  const [firstName, setFirstName] = useState(myProfile?.firstName || '');
  const [lastName, setLastName] = useState(myProfile?.lastName || '');
  const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);
  const [isNickNameValid, setIsNickNameValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nickname, setNickname] = useState(myProfile?.nickname || '');

  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);
  const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);
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
    [setImageUrl, displayChangePhoto, fileInputRef],
  );
  const changeMyAvatar = useCallback((data: IAvatarSelectedData) => {
    setNewAvatar({
      url: data.imagePath,
      previewUrl: data.croppedImagePath,
    } as IAvatar);
    setIsLoading(true);
    uploadAvatar({
      pathToFile: data.croppedImagePath,
    }).then((response: IAvatar) => {
      setNewAvatar(response);
      setIsLoading(false);
    });
  }, []);
  const removeAvatar = useCallback(() => {
    setNewAvatar(undefined);
  }, [setNewAvatar]);
  const changeFirstName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
    },
    [setFirstName],
  );
  const changeLastName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(event.target.value);
    },
    [setLastName],
  );
  const onChangeNickname = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newNickName = event.target.value;
      setNickname(newNickName);

      if (newNickName === myProfile?.nickname) {
        setIsNickNameAvailable(true);
        return;
      }

      if (validateNickname(newNickName)) {
        setIsNickNameValid(true);

        setIsLoading(true);
        checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
          setIsNickNameAvailable(isAvailable);
          setIsLoading(false);
        });
      } else {
        setIsNickNameValid(false);
      }
    },
    [setNickname, setIsNickNameAvailable, checkNicknameAvailability, setIsLoading, setIsNickNameValid],
  );

  const sumbmitChanges = useCallback(() => {
    if (newAvatar?.id !== myProfile?.avatar?.id || firstName !== myProfile?.firstName || lastName !== myProfile?.lastName || nickname !== myProfile?.nickname) {
      updateMyProfile({ firstName, lastName, nickname, avatar: newAvatar });
    }
  }, [newAvatar?.id, myProfile?.avatar?.id]);

  return (
    <>
      <div className='edit-profile'>
        <div className='edit-profile__photo-data'>
          <div className='edit-profile__avatar-wrapper'>
            <Avatar className='edit-profile__account-avatar' src={newAvatar?.previewUrl}>
              {getUserInitials(myProfile)}
            </Avatar>
            {newAvatar?.previewUrl && (
              <button type='button' onClick={removeAvatar} className='edit-profile__remove-photo'>
                <CloseSVG viewBox='0 0 25 25' />
              </button>
            )}
          </div>
          <input onChange={handleImageChange} ref={fileInputRef} type='file' hidden accept='image/*' />
          <button type='button' onClick={openFileExplorer} className='edit-profile__upload-photo'>
            {t('editProfile.upload_new_photo')}
          </button>
          <div className='edit-profile__photo-requirements'>{t('editProfile.requirements')}</div>
        </div>
        <div className='edit-profile__edit-name'>
          <div className='edit-profile__edit-name'>
            <div className='edit-profile__edit-name__input-block'>
              <span className='edit-profile__edit-name__input-label'>{t('editNameModal.first_name')}</span>
              <input value={firstName} onChange={changeFirstName} type='text' className='edit-profile__edit-name__input' />
            </div>
            <div className='edit-profile__edit-name__input-block'>
              <span className='edit-profile__edit-name__input-label'>{t('editNameModal.last_name')}</span>
              <input value={lastName} onChange={changeLastName} type='text' className='edit-profile__edit-name__input' />
            </div>
          </div>
        </div>
        <div className='edit-profile__edit-username'>
          <div className='edit-profile__edit-username__input-block'>
            <span className='edit-profile__edit-username__input-label'>{t('editUsernameModal.username')}</span>
            {!isNickNameValid && <div>This nick name is not acceptable</div>}
            <div className='edit-profile__edit-username__input-wrapper'>
              <input value={nickname} onChange={onChangeNickname} type='text' className='edit-profile__edit-username__input' />
              {isNickNameValid && isNickNameAvailable && (
                <div className='edit-profile__edit-username__valid'>
                  <ValidSvg viewBox='0 0 25 25' />
                </div>
              )}
              {(!isNickNameValid || !isNickNameAvailable) && (
                <div className='edit-profile__edit-username__invalid'>
                  <InValidSvg viewBox='0 0 25 25' />
                </div>
              )}
            </div>
          </div>
          <span className='edit-profile__edit-username__requirements'>{t('editUsernameModal.requirements')}</span>
        </div>
        <BaseBtn
          disabled={!isNickNameAvailable || isLoading || !isNickNameValid || firstName.length === 0 || lastName.length === 0}
          onClick={sumbmitChanges}
          className='edit-profile__edit-btn'
          width='contained'
          color='primary'
          variant='contained'
          isLoading={isLoading}
        >
          Submit
        </BaseBtn>
      </div>
      {changePhotoDisplayed && <PhotoEditor hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={changeMyAvatar} />}
    </>
  );
});
