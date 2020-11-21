import React, { useCallback, useRef } from 'react';
import './edit-chat-modal.scss';

import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';

import CloseSVG from 'app/assets/icons/ic-close.svg';
import ChangePhoto from 'app/components/messenger-page/change-photo/change-photo';
import { AvatarSelectedData, UploadAvatarResponse } from 'app/store/my-profile/models';
import { useState } from 'react';
import { Chat, EditGroupChatReqData } from 'app/store/chats/models';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { useSelector } from 'react-redux';
import Avatar from 'app/components/shared/avatar/avatar';
import { getInterlocutorInitials } from 'app/utils/functions/interlocutor-name-utils';
import { ChatActions } from 'app/store/chats/actions';
import { useActionWithDeferred } from 'app/utils/hooks/use-action-with-deferred';
import { MyProfileActions } from 'app/store/my-profile/actions';
import CircularProgress from 'app/components/messenger-page/shared/circular-progress/circular-progress';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';

namespace EditChatModal {
	export interface Props {
		onClose: () => void;
	}
}

const EditChatModal = ({ onClose }: EditChatModal.Props) => {
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const uploadGroupChatAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
	const cancelAvatarUploading = useActionWithDispatch(MyProfileActions.cancelAvatarUploadingRequestAction);
	const editGroupChat = useActionWithDispatch(ChatActions.editGroupChat);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [newName, setNewName] = useState(selectedChat.groupChat?.name!);
	const [avatarData, setAvatarData] = useState<AvatarSelectedData | null>(null);
	const [avararUploadResponse, setAvatarUploadResponse] = useState<UploadAvatarResponse | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>(null);
	const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
	const [newDescription, setNewDescription] = useState(selectedChat.groupChat?.description || '');
	const [uploaded, setUploaded] = useState(0);
	const [uploadEnded, setUploadEnded] = useState(true);

	const applyAvatarData = useCallback(
		(data: AvatarSelectedData) => {
			setAvatarData(data);
			setUploadEnded(false);
			uploadGroupChatAvatar({ pathToFile: data.croppedImagePath, onProgress: setUploaded })
				.then((response: UploadAvatarResponse) => {
					setAvatarUploadResponse(response);
					setUploadEnded(true);
				})
				.catch(() => {
					cancelAvatarUploading();
					setAvatarData({ offsetY: 0, offsetX: 0, width: 0, imagePath: '', croppedImagePath: '' });
					setAvatarUploadResponse({ url: '', previewUrl: '', id: '' });
					setUploadEnded(true);
				});
		},
		[setAvatarData, setUploaded, uploadGroupChatAvatar, setAvatarUploadResponse],
	);

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

		const changes: EditGroupChatReqData = {
			id: selectedChat.groupChat!.id,
			avatar: avararUploadResponse,
			name: newName,
			description: newDescription,
		};

		editGroupChat(changes);
	}, [selectedChat, avararUploadResponse, newName, newDescription]);

	const discardNewAvatar = useCallback(() => {
		cancelAvatarUploading();
		setAvatarData({ offsetY: 0, offsetX: 0, width: 0, imagePath: '', croppedImagePath: '' });
		setAvatarUploadResponse({ url: '', previewUrl: '', id: '' });
		setUploadEnded(true);
	}, [setAvatarData, setAvatarUploadResponse, setUploadEnded]);

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
										src={
											typeof avatarData?.croppedImagePath === 'string'
												? avatarData?.croppedImagePath
												: selectedChat.groupChat?.avatar?.previewUrl
										}
										className='edit-chat-modal__current-photo'
									>
										{getInterlocutorInitials(selectedChat)}
									</Avatar>
									{avatarData?.croppedImagePath && <CircularProgress progress={uploaded} />}

									{(avatarData?.croppedImagePath.length! === 0
										? false
										: selectedChat.groupChat?.avatar?.url.length! > 0 ||
										  avatarData?.croppedImagePath.length! > 0) && (
										<button onClick={discardNewAvatar} className='edit-chat-modal__remove-photo'>
											<CloseSVG viewBox='0 0 25 25' />
										</button>
									)}
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
								<textarea
									value={newDescription}
									onChange={(e) => setNewDescription(e.target.value)}
									className='edit-chat-modal__description__input'
								/>
							</div>
						</div>
					}
					closeModal={onClose}
					buttons={[
						{
							children: 'Save',
							className: 'edit-chat-modal__confirm-btn',
							onClick: onSubmit,
							disabled: !uploadEnded,
							position: 'left',
							width: 'contained',
							variant: 'contained',
							color: 'primary',
						},
						{
							children: 'Cancel',
							className: 'edit-chat-modal__cancel-btn',
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
