import { Avatar, ChangePhoto, FadeAnimationWrapper } from 'components';
import { getMyProfileSelector } from 'store/my-profile/selectors';
import { getUserInitials } from 'utils/functions/interlocutor-name-utils';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import './edit-profile.scss';
import CloseSVG from 'icons/ic-close.svg';
import InfoSvg from 'icons/ic-info.svg';
import PhoneSvg from 'icons/ic-call.svg';
import EmailSvg from 'icons/ic-email.svg';
import EditSvg from 'icons/ic-edit.svg';
import { MyProfileActions } from 'store/my-profile/actions';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { useRef } from 'react';
import { EditNameModal } from './edit-name-modal/edit-name-modal';
import { EditUserNameModal } from './edit-username-modal/edit-username-modal';
import { EditPhoneModal } from './edit-phone-modal/edit-phone-modal';
import { LocalizationContext } from 'app/app';
import { AvatarSelectedData, UploadAvatarResponse } from 'store/my-profile/models';
import { parsePhoneNumber } from 'libphonenumber-js';

export const EditProfile = React.memo(() => {
	const { t } = useContext(LocalizationContext);
	const myProfile = useSelector(getMyProfileSelector);

	const uploadAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
	const updateMyProfile = useActionWithDeferred(MyProfileActions.updateMyProfileAction);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [imageUrl, setImageUrl] = useState<string>('');
	const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);

	const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
	const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);

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
		},
		[setImageUrl, displayChangePhoto],
	);

	const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);

	const [isEditNameDisplayed, setIsEditNameDisplayed] = useState(false);
	const [isEditUsernameDisplayed, setIsEditUsernameDisplayed] = useState(false);
	const [isEditPhoneDisplayed, setIsEditPhoneDisplayed] = useState(false);

	const changeIsEditNameDisplayed = useCallback(() => {
		setIsEditNameDisplayed((oldState) => !oldState);
	}, [setIsEditNameDisplayed]);
	const changeIsEditUsernameDisplayed = useCallback(() => {
		setIsEditUsernameDisplayed((oldState) => !oldState);
	}, [setIsEditUsernameDisplayed]);
	const changeIsEditPhoneDisplayed = useCallback(() => {
		setIsEditPhoneDisplayed((oldState) => !oldState);
	}, [setIsEditPhoneDisplayed]);

	const changeMyAvatar = useCallback((data: AvatarSelectedData) => {
		uploadAvatar({
			pathToFile: data.croppedImagePath,
		}).then((response: UploadAvatarResponse) => {
			updateMyProfile({
				avatar: response,
				firstName: myProfile!.firstName,
				lastName: myProfile!.lastName,
			});
		});
	}, []);

	const removeAvatar = useCallback(() => {
		updateMyProfile({
			avatar: {
				url: '',
				previewUrl: '',
				id: '',
			},
			firstName: myProfile!.firstName,
			lastName: myProfile!.lastName,
		});
	}, [updateMyProfile, myProfile]);

	return (
		<>
			<div className='edit-profile'>
				<div className='edit-profile__photo-data'>
					<div className='edit-profile__avatar-wrapper'>
						<Avatar className='edit-profile__account-avatar' src={myProfile?.avatar?.previewUrl}>
							{getUserInitials(myProfile)}
						</Avatar>
						{myProfile?.avatar?.previewUrl && (
							<button onClick={removeAvatar} className='edit-profile__remove-photo'>
								<CloseSVG viewBox='0 0 25 25' />
							</button>
						)}
					</div>
					<input
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)}
						ref={fileInputRef}
						type='file'
						hidden
						accept='image/*'
					/>
					<button onClick={openFileExplorer} className='edit-profile__upload-photo'>
						{t('editProfile.upload_new_photo')}
					</button>
					<div className='edit-profile__photo-requirements'>{t('editProfile.requirements')}</div>
				</div>
				<div className='edit-profile__profile-data'>
					<div className='edit-profile__data-category'>
						<InfoSvg className='edit-profile__data-category__info-svg' viewBox='0 0 25 25' />
						<div className='edit-profile__data-field'>
							<div className='edit-profile__data-value'>{`${myProfile?.firstName} ${myProfile?.lastName}`}</div>
							<div className='edit-profile__data-name'>{t('editProfile.name')}</div>
						</div>
						<button onClick={changeIsEditNameDisplayed} className='edit-profile__edit'>
							<EditSvg viewBox='0 0 25 25' />
						</button>
					</div>
					<div className='edit-profile__data-category'>
						<PhoneSvg className='edit-profile__data-category__info-svg' viewBox='0 0 25 25' />
						<div className='edit-profile__data-field'>
							<div className='edit-profile__data-value'>
								{parsePhoneNumber(myProfile?.phoneNumber!).formatInternational()}
							</div>
							<div className='edit-profile__data-name'>{t('editProfile.mobile')}</div>
						</div>
						<button onClick={changeIsEditPhoneDisplayed} className='edit-profile__edit'>
							<EditSvg viewBox='0 0 25 25' />
						</button>
					</div>
					<div className='edit-profile__data-category'>
						<EmailSvg className='edit-profile__data-category__info-svg' viewBox='0 0 25 25' />
						<div className='edit-profile__data-field'>
							<div className='edit-profile__data-value'>{`@${myProfile?.nickname}`}</div>
							<div className='edit-profile__data-name'>{t('editProfile.username')}</div>
						</div>
						<button onClick={changeIsEditUsernameDisplayed} className='edit-profile__edit'>
							<EditSvg viewBox='0 0 25 25' />
						</button>
					</div>
				</div>
			</div>
			<FadeAnimationWrapper isDisplayed={isEditNameDisplayed}>
				<EditNameModal onClose={changeIsEditNameDisplayed} />
			</FadeAnimationWrapper>

			<FadeAnimationWrapper isDisplayed={isEditUsernameDisplayed}>
				<EditUserNameModal onClose={changeIsEditUsernameDisplayed} />
			</FadeAnimationWrapper>

			<FadeAnimationWrapper isDisplayed={isEditPhoneDisplayed}>
				<EditPhoneModal onClose={changeIsEditPhoneDisplayed} />
			</FadeAnimationWrapper>

			{changePhotoDisplayed && (
				<ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={changeMyAvatar} />
			)}
		</>
	);
});
