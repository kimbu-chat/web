import { LocalizationContext } from 'app/app';
import Avatar from 'app/components/shared/avatar/avatar';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { Messenger } from 'app/containers/messenger/messenger';
import { FriendActions } from 'app/store/friends/actions';
import { AvatarSelectedData } from 'app/store/my-profile/models';
import { RootState } from 'app/store/root-reducer';
import { getStringInitials } from 'app/utils/interlocutor-name-utils';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FriendFromList from '../friend-from-list/friend-from-list';
import SearchBox from '../search-box/search-box';
import CloseSVG from 'app/assets/icons/ic-close.svg';
import './create-conference.scss';

namespace ICreateConference {
	export interface Props {
		close: () => void;
		isDisplayed: boolean;
		preSelectedUserIds?: number[];
		displayChangePhoto: (data: Messenger.photoSelect) => void;
		setImageUrl: (url: string | null | ArrayBuffer) => void;
	}

	export enum conferenceCreationStage {
		userSelect,
		conferenceCreation,
	}
}

const CreateConference = ({
	close,
	isDisplayed,
	preSelectedUserIds,
	displayChangePhoto,
	setImageUrl,
}: ICreateConference.Props) => {
	const { t } = useContext(LocalizationContext);

	const [selectedChatIds, setSelectedChatIds] = useState<number[]>(preSelectedUserIds ? preSelectedUserIds : []);
	const [currentStage, setCurrrentStage] = useState(ICreateConference.conferenceCreationStage.userSelect);
	const [newAvatarData, setNewAvatarData] = useState<AvatarSelectedData | null>(null);
	const [newName, setNewName] = useState('');

	const friends = useSelector((state: RootState) => state.friends.friends);

	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const goToNexStage = useCallback(() => {
		setCurrrentStage((oldStage) => {
			if (oldStage === ICreateConference.conferenceCreationStage.userSelect) {
				return ICreateConference.conferenceCreationStage.conferenceCreation;
			}

			return ICreateConference.conferenceCreationStage.conferenceCreation;
		});
	}, [setCurrrentStage]);

	const isSelected = useCallback(
		(id: number) => {
			return selectedChatIds.includes(id);
		},
		[selectedChatIds],
	);

	const changeSelectedState = useCallback(
		(id: number) => {
			console.log(selectedChatIds);

			if (selectedChatIds.includes(id)) {
				setSelectedChatIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
			} else {
				setSelectedChatIds((oldChatIds) => [...oldChatIds, id]);
			}
		},
		[selectedChatIds],
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
				setImageUrl(reader.result);
				displayChangePhoto({ onSubmit: (data) => setNewAvatarData(data) });
			};

			if (e.target.files) reader.readAsDataURL(e.target.files[0]);
		},
		[displayChangePhoto, setImageUrl, setNewAvatarData],
	);
	const onSubmit = useCallback(() => {
		close();
		if (newAvatarData) {
			//avatar set logic here
		}
	}, [newAvatarData, newName]);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			{isDisplayed && (
				<Modal
					title={
						<div className='create-conference__heading'>
							<div className='create-conference__title'>{t('createConference.add_members')}</div>
							<div className='create-conference__selected-count'>{`${selectedChatIds.length} / 1000`}</div>
						</div>
					}
					closeModal={close}
					contents={
						<>
							{currentStage === ICreateConference.conferenceCreationStage.userSelect && (
								<div className={'create-conference__select-friends'}>
									<SearchBox onChange={(e) => searchFriends(e.target.value)} />
									<div className='create-conference__friends-block'>
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

							{currentStage === ICreateConference.conferenceCreationStage.conferenceCreation && (
								<div className='edit-chat-modal'>
									<div className='edit-chat-modal__change-photo'>
										<div className='edit-chat-modal__current-photo-wrapper'>
											<Avatar
												src={newAvatarData?.croppedImagePath}
												className='edit-chat-modal__current-photo'
											>
												{getStringInitials(newName)}
											</Avatar>
											<button className='edit-chat-modal__remove-photo'>
												<CloseSVG viewBox='0 0 25 25' />
											</button>
										</div>
										<div className='edit-chat-modal__change-photo-data'>
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
										<span className='edit-chat-modal__description__label'>
											Description (optional)
										</span>
										<textarea className='edit-chat-modal__description__input' />
									</div>
								</div>
							)}
						</>
					}
					buttons={[
						{
							text: t('createConference.cancel'),
							style: {
								color: '#6D7885',
								backgroundColor: '#fff',
								padding: '11px 48px',
								border: '1px solid #D7D8D9',
								marginRight: '20px',
							},

							position: 'left',
							onClick: close,
						},
						{
							text: t('createConference.create'),
							style: {
								color: '#fff',
								backgroundColor: '#3F8AE0',
								padding: '11px 88px',
								display:
									currentStage === ICreateConference.conferenceCreationStage.userSelect
										? 'block'
										: 'none',
							},

							position: 'left',
							onClick: goToNexStage,
						},
						{
							text: t('createConference.create'),
							style: {
								color: '#fff',
								backgroundColor: '#3F8AE0',
								padding: '11px 88px',
								display:
									currentStage === ICreateConference.conferenceCreationStage.conferenceCreation
										? 'block'
										: 'none',
							},

							position: 'left',
							onClick: onSubmit,
						},
					]}
				/>
			)}
		</WithBackground>
	);
};

export default CreateConference;
