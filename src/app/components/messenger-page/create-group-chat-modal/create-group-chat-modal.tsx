import { LocalizationContext } from 'app/app';
import { Avatar } from 'components';
import { Modal } from 'components';
import { WithBackground } from 'components';
import { ChangePhoto } from 'components';
import { FriendActions } from 'store/friends/actions';
import { AvatarSelectedData, UploadAvatarResponse, UserPreview } from 'store/my-profile/models';
import { RootState } from 'store/root-reducer';
import { getStringInitials } from 'utils/functions/interlocutor-name-utils';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FriendFromList } from 'components';
import { SearchBox } from 'components';
import CloseSVG from 'icons/ic-close.svg';
import './create-group-chat-modal.scss';
import { useActionWithDeferred } from 'utils/hooks/use-action-with-deferred';
import { ChatActions } from 'store/chats/actions';
import { Chat, GroupChatCreationReqData } from 'store/chats/models';
import { useHistory } from 'react-router';
import { MyProfileActions } from 'store/my-profile/actions';
import { CircularProgress } from 'components';

namespace ICreateGroupChatModal {
	export interface Props {
		onClose: () => void;
		preSelectedUserIds?: number[];
	}

	export enum groupChatCreationStage {
		userSelect = 'userSelect',
		groupChatCreation = 'groupChatCreation',
	}
}

export const CreateGroupChat = React.memo(({ onClose, preSelectedUserIds }: ICreateGroupChatModal.Props) => {
	const { t } = useContext(LocalizationContext);

	const currentUser = useSelector<RootState, UserPreview | undefined>((state) => state.myProfile.user);

	const history = useHistory();

	const uploadGroupChatAvatar = useActionWithDeferred(MyProfileActions.uploadAvatarRequestAction);
	const cancelAvatarUploading = useActionWithDispatch(MyProfileActions.cancelAvatarUploadingRequestAction);
	const submitGroupChatCreation = useActionWithDeferred(ChatActions.createGroupChat);

	const [selectedUserIds, setSelectedUserIds] = useState<number[]>(preSelectedUserIds ? preSelectedUserIds : []);
	const [currentStage, setCurrrentStage] = useState(ICreateGroupChatModal.groupChatCreationStage.userSelect);
	const [avatarData, setAvatarData] = useState<AvatarSelectedData | null>(null);
	const [avararUploadResponse, setAvatarUploadResponse] = useState<UploadAvatarResponse | null>(null);
	const [imageUrl, setImageUrl] = useState<string>('');
	const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [uploaded, setUploaded] = useState(0);
	const [uploadEnded, setUploadEnded] = useState(true);

	const friends = useSelector((state: RootState) => state.friends.friends);

	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const isSelected = useCallback(
		(id: number) => {
			return selectedUserIds.includes(id);
		},
		[selectedUserIds],
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

	const displayChangePhoto = useCallback(() => setChangePhotoDisplayed(true), [setChangePhotoDisplayed]);
	const hideChangePhoto = useCallback(() => setChangePhotoDisplayed(false), [setChangePhotoDisplayed]);

	const changeSelectedState = useCallback(
		(id: number) => {
			if (selectedUserIds.includes(id)) {
				setSelectedUserIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
			} else {
				setSelectedUserIds((oldChatIds) => [...oldChatIds, id]);
			}
		},
		[selectedUserIds],
	);

	const searchFriends = useCallback((name: string) => {
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: true });
	}, []);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			e.preventDefault();

			const reader = new FileReader();

			reader.onload = () => {
				setImageUrl(reader.result as string);
				displayChangePhoto();
			};

			if (e.target.files) reader.readAsDataURL(e.target.files[0]);
		},
		[displayChangePhoto, setImageUrl],
	);

	const discardAvatar = useCallback(() => {
		cancelAvatarUploading();
		setAvatarData(null);
		setAvatarUploadResponse(null);
		setUploadEnded(true);
	}, [setAvatarData, setAvatarUploadResponse, setUploadEnded]);

	const onSubmit = useCallback(() => {
		const groupChatToCreate: GroupChatCreationReqData = {
			name,
			currentUser: currentUser!,
			userIds: selectedUserIds,
			description,
			avatar: avararUploadResponse,
		};

		submitGroupChatCreation(groupChatToCreate).then((payload: Chat) => {
			history.push(`/chats/${payload.id}`);
			onClose();
		});
	}, [avararUploadResponse, description, name, onClose]);

	const goToGroupChatCreationStage = useCallback(() => {
		setCurrrentStage(ICreateGroupChatModal.groupChatCreationStage.groupChatCreation);
	}, [setCurrrentStage]);

	return (
		<>
			<WithBackground onBackgroundClick={onClose}>
				<Modal
					title={
						currentStage === ICreateGroupChatModal.groupChatCreationStage.userSelect ? (
							<div className='create-group-chat__heading'>
								<div className='create-group-chat__title'>{t('createGroupChatModal.add_members')}</div>
								<div className='create-group-chat__selected-count'>{`${selectedUserIds.length} / 1000`}</div>
							</div>
						) : (
							t('createGroupChatModal.new_group')
						)
					}
					closeModal={onClose}
					contents={
						<>
							{currentStage === ICreateGroupChatModal.groupChatCreationStage.userSelect && (
								<div className={'create-group-chat__select-friends'}>
									<SearchBox onChange={(e) => searchFriends(e.target.value)} />
									<div className='create-group-chat__friends-block'>
										{friends.map((friend) => {
											return (
												<FriendFromList
													key={friend.id}
													friend={friend}
													isSelected={isSelected(friend.id)}
													changeSelectedState={changeSelectedState}
												/>
											);
										})}
									</div>
								</div>
							)}

							{currentStage === ICreateGroupChatModal.groupChatCreationStage.groupChatCreation && (
								<div className='create-group-chat'>
									<div className='create-group-chat__change-photo'>
										<div className='create-group-chat__current-photo-wrapper'>
											<Avatar
												src={avatarData?.croppedImagePath}
												className='create-group-chat__current-photo'
											>
												{getStringInitials(name)}
											</Avatar>
											{avatarData && (
												<>
													<CircularProgress progress={uploaded} />
													<button
														onClick={discardAvatar}
														className='create-group-chat__remove-photo'
													>
														<CloseSVG viewBox='0 0 25 25' />
													</button>
												</>
											)}
										</div>
										<div className='create-group-chat__change-photo-data'>
											<input
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													handleImageChange(e)
												}
												ref={fileInputRef}
												type='file'
												hidden
												accept='image/*'
											/>
											<button
												onClick={() => fileInputRef.current?.click()}
												className='create-group-chat__change-photo__btn'
											>
												Upload New Photo
											</button>
											<span className='create-group-chat__change-photo__description'>
												At least 256 x 256px PNG or JPG file.
											</span>
										</div>
									</div>
									<div className='create-group-chat__name'>
										<span className='create-group-chat__name__label'>Name</span>
										<input
											value={name}
											onChange={(e) => setName(e.target.value)}
											type='text'
											className='create-group-chat__name__input'
										/>
									</div>
									<div className='create-group-chat__description'>
										<span className='create-group-chat__description__label'>
											Description (optional)
										</span>
										<textarea
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											className='create-group-chat__description__input'
										/>
									</div>
								</div>
							)}
						</>
					}
					buttons={[
						{
							children: t('createGroupChatModal.next'),
							style: {
								display:
									currentStage === ICreateGroupChatModal.groupChatCreationStage.userSelect
										? 'block'
										: 'none',
							},
							position: 'left',
							disabled: selectedUserIds.length === 0,
							onClick: goToGroupChatCreationStage,
							width: 'contained',
							variant: 'contained',
							color: 'primary',
						},
						{
							children: t('createGroupChatModal.create_groupChat'),
							style: {
								display:
									currentStage === ICreateGroupChatModal.groupChatCreationStage.groupChatCreation
										? 'block'
										: 'none',
							},
							disabled: name.length === 0 || !uploadEnded,
							position: 'left',
							onClick: onSubmit,
							width: 'contained',
							variant: 'contained',
							color: 'primary',
						},
					]}
				/>
			</WithBackground>
			{changePhotoDisplayed && (
				<ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={applyAvatarData} />
			)}
		</>
	);
});
