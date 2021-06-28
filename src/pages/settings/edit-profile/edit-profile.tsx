import React, { useCallback, useState, useRef, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { parsePhoneNumber } from 'libphonenumber-js';

import { Button } from '@components/button';
import { LabeledInput } from '@components/labeled-input';
import { CubeLoader } from '@components/cube-loader';
import { HorizontalSeparator } from '@components/horizontal-separator';
import { myProfileSelector } from '@store/my-profile/selectors';
import { ReactComponent as UserSvg } from '@icons/user.svg';
import { ReactComponent as TopAvatarLine } from '@icons/top-avatar-line.svg';
import { ReactComponent as BottomAvatarLine } from '@icons/bottom-avatar-line.svg';
import { ReactComponent as ColoredClose } from '@icons/colored-close.svg';
import { FileType } from '@store/chats/models';
import {
  uploadAvatarRequestAction,
  updateMyProfileAction,
  checkNicknameAvailabilityAction,
} from '@store/my-profile/actions';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { IAvatarSelectedData } from '@store/common/models';
import { validateNickname } from '@utils/validate-nick-name';
import { loadPhotoEditor } from '@routing/module-loader';
import { MediaModal } from '@components/image-modal';

import { useToggledState } from '../../../hooks/use-toggled-state';

import { ChangePhoneModal } from './change-phone-modal/change-phone-modal';
import { DeactivateAccountModal } from './deactivate-account-modal/deactivate-account-modal';
import { DeleteAccountModal } from './delete-account-modal/delete-account-modal';

import './edit-profile.scss';

const PhotoEditor = lazy(loadPhotoEditor);

enum NicknameState {
  INVALID_NICKNAME = 'INVALID_NICKNAME',
  BUSY_NICKNAME = 'BUSY_NICKNAME',
  ALLOWED_NICKNAME = 'ALLOWED_NICKNAME',
}

export const EditProfile = () => {
  const { t } = useTranslation();
  const myProfile = useSelector(myProfileSelector);

  const uploadAvatar = useActionWithDeferred(uploadAvatarRequestAction);
  const updateMyProfile = useActionWithDeferred(updateMyProfileAction);
  const checkNicknameAvailability = useActionWithDeferred(checkNicknameAvailabilityAction);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [newAvatar, setNewAvatar] = useState(myProfile?.avatar);
  const [firstName, setFirstName] = useState(myProfile?.firstName || '');
  const [lastName, setLastName] = useState(myProfile?.lastName || '');
  const [error, setError] = useState<NicknameState>(NicknameState.ALLOWED_NICKNAME);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nickname, setNickname] = useState(myProfile?.nickname || '');

  const [bigPhotoDisplayed, displayBigPhoto, hideBigPhoto] = useToggledState(false);
  const [changePhotoDisplayed, displayChangePhoto, hideChangePhoto] = useToggledState(false);
  const [editPhoneModalDisplayed, displayEditPhoneModal, hideEditPhoneModal] =
    useToggledState(false);
  const [
    deactivateAccountModalDisplayed,
    displayDeactivateAccountModal,
    hideDeactivateAccountModal,
  ] = useToggledState(false);
  const [deleteAccountModalDisplayed, displayDeleteAccountModal, hideDeleteAccountModal] =
    useToggledState(false);

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
    async (data: IAvatarSelectedData) => {
      setIsLoading(true);

      const response = await uploadAvatar({
        pathToFile: data.croppedImagePath,
      });
      setNewAvatar(response);
      setIsLoading(false);
    },
    [uploadAvatar],
  );

  const removeAvatar = useCallback(() => {
    setNewAvatar(undefined);
  }, [setNewAvatar]);

  const openFileExplorer = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

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
        <h2 className="edit-profile__page-name">{t('settings.edit_profile')}</h2>
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
            {newAvatar && (
              <>
                <button
                  onClick={displayBigPhoto}
                  type="button"
                  className="edit-profile__avatar-wrapper__view-avatar">
                  {t('editProfile.view_photo')}
                </button>
                <button
                  onClick={removeAvatar}
                  type="button"
                  className="edit-profile__avatar-wrapper__delete">
                  <ColoredClose className="edit-profile__avatar-wrapper__delete-icon" />
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

          <div className="edit-profile__avatar-upload">
            <div className="edit-profile__avatar-requirements">{t('editProfile.requirements')}</div>
            <button
              type="button"
              onClick={openFileExplorer}
              className="edit-profile__avatar-upload-btn">
              {t('editProfile.upload_new_photo')}
            </button>
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
          className="edit-profile__btn"
          loading={submitLoading}
          disabled={
            error !== NicknameState.ALLOWED_NICKNAME ||
            isLoading ||
            !firstName.length ||
            !lastName.length
          }>
          {t('editProfile.save-changes')}
        </Button>
        <HorizontalSeparator />
        <h2 className="edit-profile__title">{t('editProfile.phone-number')}</h2>
        <div className="edit-profile__phone">
          {myProfile?.phoneNumber && parsePhoneNumber(myProfile?.phoneNumber).formatInternational()}
        </div>
        <div className="edit-profile__details">{t('editProfile.phone-details')}</div>
        <button onClick={displayEditPhoneModal} type="button" className="edit-profile__btn">
          {t('editProfile.change-number')}
        </button>
        <HorizontalSeparator />
        <h2 className="edit-profile__title">{t('editProfile.account-actions')}</h2>
        <div className="edit-profile__details edit-profile__details--deactivate">
          {t('editProfile.deactivate-details')}
        </div>
        <button
          onClick={displayDeactivateAccountModal}
          type="button"
          className="edit-profile__btn edit-profile__btn--delete">
          {t('editProfile.deactivate-confirmation')}
        </button>
        <div className="edit-profile__details edit-profile__details--delete">
          {t('editProfile.delete-details')}
        </div>
        <button
          onClick={displayDeleteAccountModal}
          type="button"
          className="edit-profile__btn edit-profile__btn--delete">
          {t('editProfile.delete-confirmation')}
        </button>
      </div>

      {changePhotoDisplayed && (
        <Suspense fallback={<CubeLoader />}>
          <PhotoEditor
            hideChangePhoto={hideChangePhoto}
            imageUrl={imageUrl}
            onSubmit={changeMyAvatar}
          />
        </Suspense>
      )}

      {editPhoneModalDisplayed && <ChangePhoneModal onClose={hideEditPhoneModal} />}

      {deactivateAccountModalDisplayed && (
        <DeactivateAccountModal onClose={hideDeactivateAccountModal} />
      )}

      {deleteAccountModalDisplayed && <DeleteAccountModal onClose={hideDeleteAccountModal} />}

      {newAvatar?.url && bigPhotoDisplayed && (
        <MediaModal
          attachmentsArr={[{ url: newAvatar.url, id: 1, type: FileType.Picture }]}
          attachmentId={1}
          onClose={hideBigPhoto}
        />
      )}
    </>
  );
};
