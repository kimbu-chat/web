import Avatar from 'app/components/shared/avatar/avatar';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { getUserInitials } from 'app/utils/functions/interlocutor-name-utils';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import './edit-profile.scss';
import CloseSVG from 'app/assets/icons/ic-close.svg';
import InfoSvg from 'app/assets/icons/ic-info.svg';
import PhoneSvg from 'app/assets/icons/ic-call.svg';
import EmailSvg from 'app/assets/icons/ic-email.svg';
import EditSvg from 'app/assets/icons/ic-edit.svg';
import { MyProfileActions } from 'app/store/my-profile/actions';
import { useActionWithDeferred } from 'app/utils/hooks/use-action-with-deferred';
import { useRef } from 'react';
import EditNameModal from './edit-name-modal/edit-name-modal';
import EditUserNameModal from './edit-username-modal/edit-username-modal';
import EditPhoneModal from './edit-phone-modal/edit-phone-modal';
import ChangePhoto from 'app/components/messenger-page/change-photo/change-photo';
import { LocalizationContext } from 'app/app';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';

const EditProfile = () => {
	const { t } = useContext(LocalizationContext);
	const myProfile = useSelector(getMyProfileSelector);

	const changeMyAvatar = useActionWithDeferred(MyProfileActions.updateMyAvatarAction);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>(null);
	const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);

	const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
	const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);

	const handleImageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			e.preventDefault();

			const reader = new FileReader();

			reader.onload = () => {
				setImageUrl(reader.result);
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

	return (
		<>
			<div className='edit-profile'>
				<div className='edit-profile__photo-data'>
					<div className='edit-profile__avatar-wrapper'>
						<Avatar className='edit-profile__account-avatar' src={myProfile?.avatarUrl}>
							{getUserInitials(myProfile)}
						</Avatar>
						<div className='edit-profile__remove-photo'>
							<CloseSVG viewBox='0 0 25 25' />
						</div>
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
							<div className='edit-profile__data-value'>{myProfile?.phoneNumber}</div>
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
};

export default EditProfile;
