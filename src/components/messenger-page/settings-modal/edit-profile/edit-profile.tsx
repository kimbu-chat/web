import { FadeAnimationWrapper, LabeledInput, PhotoEditor } from '@components';
import { myProfileSelector } from '@store/my-profile/selectors';
import React, { useCallback, useContext, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './edit-profile.scss';
import UserSvg from '@icons/user.svg';
import TopAvatarLine from '@icons/top-avatar-line.svg';
import PhotoSvg from '@icons/picture.svg';
import BottomAvatarLine from '@icons/bottom-avatar-line.svg';
import * as MyProfileActions from '@store/my-profile/actions';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

import { LocalizationContext } from '@contexts';
import { IAvatarSelectedData, IAvatar } from '@store/common/models';
import { validateNickname } from '@utils/validate-nick-name';
import { parsePhoneNumber } from 'libphonenumber-js';
import { ChangePhoneModal } from './change-phone-modal/change-phone-modal';
import { DeleteAccountModal } from './delete-account-modal/delete-account-modal';

export const EditProfile = React.memo(() => {
  const { t } = useContext(LocalizationContext);
  const myProfile = useSelector(myProfileSelector);

  const uploadAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
  const updateMyProfile = useActionWithDeferred(MyProfileActions.updateMyProfileAction);
  const checkNicknameAvailability = useActionWithDeferred(
    MyProfileActions.checkNicknameAvailabilityAction,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [newAvatar, setNewAvatar] = useState(myProfile?.avatar);
  const [firstName, setFirstName] = useState(myProfile?.firstName || '');
  const [lastName, setLastName] = useState(myProfile?.lastName || '');
  const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);
  const [isNickNameValid, setIsNickNameValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nickname, setNickname] = useState(myProfile?.nickname || '');

  const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
  const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [
    setChangePhotoDisplayed,
  ]);
  const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [
    setChangePhotoDisplayed,
  ]);

  const [editPhoneModalDisplayed, setEditPhoneModalDisplayed] = useState(false);
  const changeEditPhoneModalDisplayedState = useCallback(() => {
    setEditPhoneModalDisplayed((oldState) => !oldState);
  }, [setEditPhoneModalDisplayed]);

  const [deleteAccountModalDisplayed, setDeleteAccountModalDisplayed] = useState(false);
  const changeDeleteAccountModalDisplayedState = useCallback(() => {
    setDeleteAccountModalDisplayed((oldState) => !oldState);
  }, [setDeleteAccountModalDisplayed]);

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

  const openFileExplorer = useCallback(() => {
    fileInputRef.current?.click();
    removeAvatar();
  }, [fileInputRef, removeAvatar]);

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
    [
      setNickname,
      setIsNickNameAvailable,
      checkNicknameAvailability,
      setIsLoading,
      setIsNickNameValid,
    ],
  );

  const sumbmitChanges = useCallback(() => {
    if (
      newAvatar?.id !== myProfile?.avatar?.id ||
      firstName !== myProfile?.firstName ||
      lastName !== myProfile?.lastName ||
      nickname !== myProfile?.nickname
    ) {
      updateMyProfile({ firstName, lastName, nickname, avatar: newAvatar });
    }
  }, [newAvatar?.id, myProfile?.avatar?.id, firstName, lastName, nickname]);

  return (
    <>
      <div className="edit-profile">
        <h2 className="edit-profile__title">{t('editProfile.personal-information')}</h2>
        <div className="edit-profile__photo-data">
          <div className="edit-profile__avatar-wrapper">
            {newAvatar?.previewUrl ? (
              <img src={newAvatar?.previewUrl} alt="" className="edit-profile__avatar" />
            ) : (
              <UserSvg className="edit-profile__avatar-icon" viewBox="0 0 68 78" />
            )}
            <TopAvatarLine className="edit-profile__avatar-wrapper__top-line" viewBox="0 0 48 48" />
            <BottomAvatarLine
              className="edit-profile__avatar-wrapper__bottom-line"
              viewBox="0 0 114 114"
            />
          </div>

          <input
            onChange={handleImageChange}
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
          />

          <div className="edit-profile__avatar-upload">
            <button
              type="button"
              onClick={openFileExplorer}
              className="edit-profile__avatar-upload-btn">
              <PhotoSvg viewBox="0 0 18 19" />
              <span>{t('editProfile.upload_new_photo')}</span>
            </button>
            <div className="edit-profile__avatar-requirements">{t('editProfile.requirements')}</div>
          </div>
        </div>

        <LabeledInput
          label={t('editProfile.first_name')}
          value={firstName}
          onChange={changeFirstName}
          containerClassName="edit-profile__input"
        />

        <LabeledInput
          label={t('editProfile.last_name')}
          value={lastName}
          onChange={changeLastName}
          containerClassName="edit-profile__input"
        />

        <LabeledInput
          label={t('editProfile.username')}
          value={nickname}
          onChange={onChangeNickname}
          containerClassName="edit-profile__input"
          errorText={
            isNickNameValid
              ? isNickNameAvailable
                ? undefined
                : t('editProfile.nickname-busy')
              : t('editProfile.nickname-not-acceptable')
          }
        />
        <button
          type="button"
          onClick={sumbmitChanges}
          className="edit-profile__btn edit-profile__btn--personal"
          disabled={
            !isNickNameAvailable ||
            isLoading ||
            !isNickNameValid ||
            firstName.length === 0 ||
            lastName.length === 0
          }>
          {t('editProfile.save-changes')}
        </button>

        <h2 className="edit-profile__title edit-profile__title--phone">
          {t('editProfile.phone-number')}
        </h2>
        <div className="edit-profile__phone-data">
          <div className="edit-profile__phone">
            {parsePhoneNumber(myProfile?.phoneNumber!).formatInternational()}
          </div>
          <button
            onClick={changeEditPhoneModalDisplayedState}
            type="button"
            className="edit-profile__btn">
            {t('editProfile.change-number')}
          </button>
        </div>
        <div className="edit-profile__phone-details">{t('editProfile.phone-details')}</div>

        <h2 className="edit-profile__title edit-profile__title--delete">
          {t('editProfile.delete-account')}
        </h2>
        <div className="edit-profile__delete-data">
          <div className="edit-profile__delete-details">{t('editProfile.delete-details')}</div>
          <button
            onClick={changeDeleteAccountModalDisplayedState}
            type="button"
            className="edit-profile__btn edit-profile__btn--delete">
            {t('editProfile.delete-confirmation')}
          </button>
        </div>
      </div>

      {changePhotoDisplayed && (
        <PhotoEditor
          hideChangePhoto={hideChangePhoto}
          imageUrl={imageUrl}
          onSubmit={changeMyAvatar}
        />
      )}

      <FadeAnimationWrapper isDisplayed={editPhoneModalDisplayed}>
        <ChangePhoneModal onClose={changeEditPhoneModalDisplayedState} />
      </FadeAnimationWrapper>

      <FadeAnimationWrapper isDisplayed={deleteAccountModalDisplayed}>
        <DeleteAccountModal onClose={changeDeleteAccountModalDisplayedState} />
      </FadeAnimationWrapper>
    </>
  );
});
