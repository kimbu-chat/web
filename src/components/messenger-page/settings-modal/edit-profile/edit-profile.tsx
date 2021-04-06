import { Button, FadeAnimationWrapper, LabeledInput } from '@components/shared';
import { PhotoEditor } from '@components/messenger-page';
import { myProfileSelector } from '@store/my-profile/selectors';
import React, { useCallback, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import './edit-profile.scss';
import { ReactComponent as UserSvg } from '@icons/user.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { ReactComponent as PhotoSvg } from '@icons/picture.svg';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import * as MyProfileActions from '@store/my-profile/actions';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

import { useTranslation } from 'react-i18next';
import { IAvatarSelectedData, IAvatar } from '@store/common/models';
import { validateNickname } from '@utils/validate-nick-name';
import { parsePhoneNumber } from 'libphonenumber-js';
import { ChangePhoneModal } from './change-phone-modal/change-phone-modal';
import { DeleteAccountModal } from './delete-account-modal/delete-account-modal';

enum NicknameState {
  INVALID_NICKNAME = 'INVALID_NICKNAME',
  BUSY_NICKNAME = 'BUSY_NICKNAME',
  ALLOWED_NICKNAME = 'ALLOWED_NICKNAME',
}

export const EditProfile = React.memo(() => {
  const { t } = useTranslation();
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
  const [error, setError] = useState<NicknameState>(NicknameState.ALLOWED_NICKNAME);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
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

  const changeMyAvatar = useCallback(
    (data: IAvatarSelectedData) => {
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
    },
    [uploadAvatar],
  );

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
        setError(NicknameState.ALLOWED_NICKNAME);
        return;
      }

      if (validateNickname(newNickName)) {
        setError(NicknameState.ALLOWED_NICKNAME);

        setIsLoading(true);
        checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
          setError(isAvailable ? NicknameState.ALLOWED_NICKNAME : NicknameState.BUSY_NICKNAME);
          setIsLoading(false);
        });
      } else {
        setError(NicknameState.INVALID_NICKNAME);
      }
    },
    [setNickname, checkNicknameAvailability, setIsLoading, myProfile?.nickname],
  );

  const sumbmitChanges = useCallback(() => {
    if (
      newAvatar?.id !== myProfile?.avatar?.id ||
      firstName !== myProfile?.firstName ||
      lastName !== myProfile?.lastName ||
      nickname !== myProfile?.nickname
    ) {
      setSubmitLoading(true);
      updateMyProfile({ firstName, lastName, nickname, avatar: newAvatar }).then(() => {
        setSubmitLoading(false);
      });
    }
  }, [
    newAvatar,
    myProfile?.avatar?.id,
    myProfile?.firstName,
    myProfile?.lastName,
    myProfile?.nickname,
    firstName,
    lastName,
    nickname,
    updateMyProfile,
  ]);

  const errorsMap = {
    [NicknameState.BUSY_NICKNAME]: t('editProfile.nickname-busy'),
    [NicknameState.INVALID_NICKNAME]: t('editProfile.nickname-not-acceptable'),
    [NicknameState.ALLOWED_NICKNAME]: undefined,
  };

  return (
    <>
      <div className="edit-profile">
        <h2 className="edit-profile__title">{t('editProfile.personal-information')}</h2>
        <div className="edit-profile__photo-data">
          <div className="edit-profile__avatar-wrapper">
            {newAvatar?.previewUrl ? (
              <img src={newAvatar?.previewUrl} alt="" className="edit-profile__avatar" />
            ) : (
              <UserSvg className="edit-profile__avatar-wrapper__alt" viewBox="0 0 68 78" />
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
          errorText={errorsMap[error]}
        />
        <Button
          type="button"
          onClick={sumbmitChanges}
          className="edit-profile__btn edit-profile__btn--personal"
          loading={submitLoading}
          disabled={
            error !== NicknameState.ALLOWED_NICKNAME ||
            isLoading ||
            firstName.length === 0 ||
            lastName.length === 0
          }>
          {t('editProfile.save-changes')}
        </Button>

        <h2 className="edit-profile__title edit-profile__title--phone">
          {t('editProfile.phone-number')}
        </h2>
        <div className="edit-profile__phone-data">
          <div className="edit-profile__phone">
            {myProfile?.phoneNumber &&
              parsePhoneNumber(myProfile?.phoneNumber).formatInternational()}
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
