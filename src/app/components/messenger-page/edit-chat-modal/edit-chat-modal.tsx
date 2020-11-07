import React, { useCallback, useRef } from 'react';
import './edit-chat-modal.scss';

import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';

import CloseSVG from 'app/assets/icons/ic-close.svg';
import ChangePhoto from 'app/components/messenger-page/change-photo/change-photo';
import { AvatarSelectedData } from 'app/store/my-profile/models';
import { useState } from 'react';
import { Chat } from 'app/store/chats/models';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useSelector } from 'react-redux';
import Avatar from 'app/components/shared/avatar/avatar';
import { getInterlocutorInitials } from 'app/utils/interlocutor-name-utils';
import { ChatActions } from 'app/store/chats/actions';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';

namespace EditChatModal {
	export interface Props {
		onClose: () => void;
	}
}

const EditChatModal = ({ onClose }: EditChatModal.Props) => {
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const changeConferenceAvatar = useActionWithDeferred(ChatActions.changeConferenceAvatar);
	const renameConference = useActionWithDispatch(ChatActions.renameConference);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [avatarData, setAvatarData] = useState<AvatarSelectedData | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>(null);
	const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
	const [newName, setNewName] = useState(selectedChat.conference?.name!);

	const applyAvatarData = useCallback((data) => setAvatarData(data), [setAvatarData]);

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

			if (e.target.files) reader.readAsDataURL(e.target.files[0]);
		},
		[displayChangePhoto, setImageUrl],
	);

	const onSubmit = useCallback(() => {
		onClose();
		if (avatarData) {
			changeConferenceAvatar({
				conferenceId: selectedChat?.conference?.id!,
				avatarData: avatarData,
			});
		}

		if (newName !== selectedChat.conference?.name) {
			renameConference({ newName, chat: selectedChat });
		}
	}, [avatarData, newName, selectedChat.id]);

	return (
		<>
			<WithBackground onBackgroundClick={onClose}>
				<Modal
					title='Edit group'
					contents={
						<div className='edit-chat-modal'>
							<div className='edit-chat-modal__change-photo'>
								<div className='edit-chat-modal__current-photo-wrapper'>
									<Avatar
										src={avatarData?.croppedImagePath || selectedChat.conference?.avatarUrl}
										className='edit-chat-modal__current-photo'
									>
										{getInterlocutorInitials(selectedChat)}
									</Avatar>
									<button className='edit-chat-modal__remove-photo'>
										<CloseSVG viewBox='0 0 25 25' />
									</button>
								</div>
								<div className='edit-chat-modal__change-photo-data'>
									<input
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)}
										ref={fileInputRef}
										type='file'
										hidden
										accept='image/*'
									/>
									<button
										onClick={() => fileInputRef.current?.click()}
										className='edit-chat-modal__change-photo__btn'
									>
										Upload New Photo
									</button>
									<span className='edit-chat-modal__change-photo__description'>
										At least 256 x 256px PNG or JPG file.
									</span>
								</div>
							</div>
							<div className='edit-chat-modal__name'>
								<span className='edit-chat-modal__name__label'>Name</span>
								<input
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									type='text'
									className='edit-chat-modal__name__input'
								/>
							</div>
							<div className='edit-chat-modal__description'>
								<span className='edit-chat-modal__description__label'>Description (optional)</span>
								<textarea className='edit-chat-modal__description__input' />
							</div>
						</div>
					}
					closeModal={onClose}
					buttons={[
						{
							children: 'Save',
							style: {
								marginRight: '20px',
								width: '50%',
							},
							onClick: onSubmit,
							position: 'left',
							width: 'contained',
							variant: 'contained',
							color: 'primary',
						},
						{
							children: 'Cancel',
							style: {
								margin: '0 0 0 10px',
								color: '#6D7885',
								width: '50%',
							},
							onClick: onClose,
							position: 'left',
							width: 'auto',
							variant: 'outlined',
							color: 'default',
						},
					]}
				/>
			</WithBackground>
			{changePhotoDisplayed && (
				<ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={applyAvatarData} />
			)}
		</>
	);
};

export default EditChatModal;
