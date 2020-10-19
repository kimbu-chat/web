import { LocalizationContext } from 'app/app';
import Avatar from 'app/components/shared/avatar/avatar';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { Messenger } from 'app/containers/messenger/messenger';
import { FriendActions } from 'app/store/friends/actions';
import { AvatarSelectedData, UserPreview } from 'app/store/my-profile/models';
import { RootState } from 'app/store/root-reducer';
import { getStringInitials } from 'app/utils/interlocutor-name-utils';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FriendFromList from '../friend-from-list/friend-from-list';
import SearchBox from '../search-box/search-box';
import CloseSVG from 'app/assets/icons/ic-close.svg';
import './create-conference.scss';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { ChatActions } from 'app/store/chats/actions';
import { Chat } from 'app/store/chats/models';
import { useHistory } from 'react-router';

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

	const currentUser = useSelector<RootState, UserPreview | undefined>((state) => state.myProfile.user);

	const history = useHistory();

	const submitConferenceCreation = useActionWithDeferred(ChatActions.createConference);

	const [selectedUserIds, setSelectedUserIds] = useState<number[]>(preSelectedUserIds ? preSelectedUserIds : []);
	const [currentStage, setCurrrentStage] = useState(ICreateConference.conferenceCreationStage.userSelect);
	const [avatarData, setAvatarData] = useState<AvatarSelectedData | null>(null);
	const [name, setName] = useState('');
	//@ts-ignore
	const [error, setError] = useState('');

	const friends = useSelector((state: RootState) => state.friends.friends);

	const loadFriends = useActionWithDispatch(FriendActions.getFriends);

	const isSelected = useCallback(
		(id: number) => {
			return selectedUserIds.includes(id);
		},
		[selectedUserIds],
	);

	const changeSelectedState = useCallback(
		(id: number) => {
			console.log(selectedUserIds);

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
				setImageUrl(reader.result);
				displayChangePhoto({ onSubmit: (data) => setAvatarData(data) });
			};

			if (e.target.files) reader.readAsDataURL(e.target.files[0]);
		},
		[displayChangePhoto, setImageUrl, setAvatarData],
	);

	const discardAvatar = useCallback(() => setAvatarData(null), [setAvatarData]);

	const onSubmit = useCallback(() => {
		let validationPassed = true;

		if (name.trim().length > 0) {
			validationPassed = validationPassed && true;
			setError('');
		} else {
			validationPassed = false;
			setError(t('createChat.no_name_error'));
		}

		if (selectedUserIds.length > 0) {
			validationPassed = validationPassed && true;
			setError('');
		} else {
			validationPassed = false;
			setError(t('createChat.no_members_error'));
		}

		if (validationPassed) {
			submitConferenceCreation({
				name,
				currentUser: currentUser!,
				userIds: selectedUserIds,
				avatar: avatarData,
			})
				.then((payload: Chat) => history.push(`/chats/${payload.id}`))
				.then(close);
		}
	}, [avatarData, name, close, setError, t]);

	const goToNexStage = useCallback(() => {
		setCurrrentStage((oldStage) => {
			if (oldStage === ICreateConference.conferenceCreationStage.conferenceCreation) {
				onSubmit();
			}

			return ICreateConference.conferenceCreationStage.conferenceCreation;
		});
	}, [setCurrrentStage, onSubmit]);

	return (
		<WithBackground isBackgroundDisplayed={isDisplayed} onBackgroundClick={close}>
			{isDisplayed && (
				<Modal
					title={
						currentStage === ICreateConference.conferenceCreationStage.userSelect ? (
							<div className='create-conference__heading'>
								<div className='create-conference__title'>{t('createConference.add_members')}</div>
								<div className='create-conference__selected-count'>{`${selectedUserIds.length} / 1000`}</div>
							</div>
						) : (
							t('createConference.new_group')
						)
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
												src={avatarData?.croppedImagePath}
												className='edit-chat-modal__current-photo'
											>
												{getStringInitials(name)}
											</Avatar>
											<button onClick={discardAvatar} className='edit-chat-modal__remove-photo'>
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
											value={name}
											onChange={(e) => setName(e.target.value)}
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
								backgroundColor: selectedUserIds.length === 0 ? '#6ea2de' : '#3F8AE0',
								padding: '11px 88px',
								display:
									currentStage === ICreateConference.conferenceCreationStage.userSelect
										? 'block'
										: 'none',
							},

							position: 'left',
							disabled: selectedUserIds.length === 0,
							onClick: goToNexStage,
						},
						{
							text: t('createConference.next'),
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
