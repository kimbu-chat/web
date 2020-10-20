import Avatar from 'app/components/shared/avatar/avatar';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import './edit-profile.scss';
import CloseSVG from 'app/assets/icons/ic-close.svg';
import InfoSvg from 'app/assets/icons/ic-info.svg';
import EditSvg from 'app/assets/icons/ic-edit.svg';
import { Messenger } from 'app/containers/messenger/messenger';
import { MyProfileActions } from 'app/store/my-profile/actions';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useRef } from 'react';

namespace EditProfile {
	export interface Props {
		setImageUrl: (url: string | null | ArrayBuffer) => void;
		displayChangePhoto: (data: Messenger.photoSelect) => void;
	}
}

const EditProfile = ({ setImageUrl, displayChangePhoto }: EditProfile.Props) => {
	const myProfile = useSelector(getMyProfileSelector);

	const changePhoto = useActionWithDeferred(MyProfileActions.updateMyAvatar);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const reader = new FileReader();

		reader.onload = () => {
			setImageUrl(reader.result);
			displayChangePhoto({ onSubmit: changePhoto });
		};

		if (e.target.files) {
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const openFileExplorer = useCallback(() => fileInputRef.current?.click(), [fileInputRef]);

	return (
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
					Upload New Photo
				</button>
				<div className='edit-profile__photo-requirements'>At least 256 x 256px PNG or JPG file.</div>
			</div>
			<div className='edit-profile__profile-data'>
				<div className='edit-profile__data-category'>
					<InfoSvg className='edit-profile__data-category__info-svg' viewBox='0 0 25 25' />
					<div className='edit-profile__data-field'>
						<div className='edit-profile__data-value'>{`${myProfile?.firstName} ${myProfile?.lastName}`}</div>
						<div className='edit-profile__data-name'>Name</div>
					</div>
					<button className='edit-profile__edit'>
						<EditSvg viewBox='0 0 25 25' />
					</button>
				</div>
				<div className='edit-profile__data-category'>
					<InfoSvg className='edit-profile__data-category__info-svg' viewBox='0 0 25 25' />
					<div className='edit-profile__data-field'>
						<div className='edit-profile__data-value'>{myProfile?.phoneNumber}</div>
						<div className='edit-profile__data-name'>Mobile</div>
					</div>
					<button className='edit-profile__edit'>
						<EditSvg viewBox='0 0 25 25' />
					</button>
				</div>
				<div className='edit-profile__data-category'>
					<InfoSvg className='edit-profile__data-category__info-svg' viewBox='0 0 25 25' />
					<div className='edit-profile__data-field'>
						<div className='edit-profile__data-value'>{`@${myProfile?.nickname}`}</div>
						<div className='edit-profile__data-name'>Username</div>
					</div>
					<button className='edit-profile__edit'>
						<EditSvg viewBox='0 0 25 25' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
