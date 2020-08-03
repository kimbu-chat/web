import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { UserPreview, AvatarSelectedData } from 'app/store/my-profile/models';
import FriendItem from './FriendItem/FriendItem';

import './_CreateChat.scss';
import { Messenger } from 'app/containers/Messenger/Messenger';
import { FriendActions } from 'app/store/friends/actions';
import { ChatActions } from 'app/store/dialogs/actions';
import { RootState } from 'app/store/root-reducer';
import { LocalizationContext } from 'app/app';

namespace CreateChat {
	export interface Props {
		hide: () => void;
		setImageUrl: (url: string | null | ArrayBuffer) => void;
		displayChangePhoto: (data: Messenger.photoSelect) => void;
		isDisplayed: boolean;
	}

	export interface validationError {
		isPresent: boolean;
		text?: string;
	}
}

const CreateChat = ({ hide, setImageUrl, displayChangePhoto, isDisplayed }: CreateChat.Props) => {
	const { t } = useContext(LocalizationContext);

	const loadFriends = useActionWithDispatch(FriendActions.getFriends);
	const unsetFriends = useActionWithDispatch(FriendActions.unsetSelectedUserIdsForNewConference);
	const submitConferenceCreation = useActionWithDeferred(ChatActions.createConference);

	const friends = useSelector<RootState, UserPreview[]>((state) => state.friends.friends);
	const currentUser = useSelector<RootState, UserPreview>((state) => state.myProfile.user);
	const selectedUserIds = useSelector<RootState, number[]>((state) => state.friends.userIdsToAddIntoConference);

	const [chatName, setChatName] = useState<string>('');
	const [searchFriendStr, setSearchFriendStr] = useState<string>('');
	const [error, setError] = useState<CreateChat.validationError>({ isPresent: false });
	const [avatarData, setAvatarData] = useState<AvatarSelectedData | null>(null);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const searchFriends = (name: string, initializedBySearch: boolean) => {
		setSearchFriendStr(name);
		loadFriends({ page: { offset: 0, limit: 25 }, name, initializedBySearch: initializedBySearch });
	};

	useEffect(() => {
		searchFriends('', false);
		setChatName('');
		setSearchFriendStr('');

		return () => searchFriends('', true);
	}, [isDisplayed]);

	const rejectConferenceCreation = () => {
		unsetFriends();
		hide();
	};

	const createConference = () => {
		let validationPassed = false;
		if (chatName.trim().length > 0) {
			setError({ isPresent: false });
			validationPassed = true;
		} else {
			return setError({
				isPresent: true,
				text: t('createChat.no_name_error'),
			});
		}

		if (selectedUserIds.length > 0) {
			setError({ isPresent: false });
			validationPassed = true;
		} else {
			return setError({ isPresent: true, text: t('createChat.no_members_error') });
		}

		if (validationPassed) {
			return submitConferenceCreation({
				name: chatName,
				currentUser: currentUser,
				userIds: selectedUserIds,
				avatar: avatarData,
			}).then(hide);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const reader = new FileReader();

		reader.onload = () => {
			setImageUrl(reader.result);
			displayChangePhoto({ onSubmit: setAvatarData });
		};

		if (e.target.files) reader.readAsDataURL(e.target.files[0]);
	};

	return (
		<div
			className={isDisplayed ? 'messenger__create-chat messenger__create-chat--active' : 'messenger__create-chat'}
		>
			<div className='messenger__create-chat__header'>
				<button onClick={rejectConferenceCreation} className='messenger__create-chat__back flat'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path d='M10.634 3.634a.9.9 0 1 0-1.278-1.268l-4.995 5.03a.9.9 0 0 0 0 1.268l4.936 4.97a.9.9 0 0 0 1.278-1.268L6.268 8.03l4.366-4.396z'></path>
						</svg>
					</div>
					<span>{t('back')}</span>
				</button>
				<div className='messenger__create-chat__title'>{t('createChat.createChat')}</div>
				<div className=''></div>
			</div>
			<div className='messenger__create-chat__chat-data'>
				<div onClick={() => fileInputRef.current?.click()} className='messenger__create-chat__img-select'>
					{!avatarData?.croppedImagePath && (
						<div className='svg'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
								<path
									fillRule='evenodd'
									d='M6.72 4.36l.2-.35A4 4 0 0110.38 2h3.23a4 4 0 013.46 1.99l.21.37 2.32.35A4 4 0 0123 8.67V17a5 5 0 01-5 5H6a5 5 0 01-5-5V8.67A4 4 0 014.4 4.7l2.32-.35zm.78 1.9l-2.8.43A2 2 0 003 8.67V17a3 3 0 003 3h12a3 3 0 003-3V8.67a2 2 0 00-1.7-1.98l-2.78-.43a1 1 0 01-.72-.48l-.45-.79A2 2 0 0013.62 4h-3.23a2 2 0 00-1.74 1l-.44.77a1 1 0 01-.71.5zM12 8a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>
					)}
					{avatarData?.croppedImagePath && <img src={avatarData?.croppedImagePath} alt='Error' />}
					<input
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)}
						ref={fileInputRef}
						type='file'
						hidden
						accept='image/*'
					/>
				</div>
				<div className=''>
					{error.isPresent && <p className='error'>{error.text}</p>}
					<input
						onChange={(e) => setChatName(e.target.value)}
						value={chatName}
						type='text'
						placeholder={t('createChat.search-friends')}
						className='messenger__create-chat__chat-title'
					/>
				</div>
			</div>
			<div className='messenger__create-chat__contacts-select'>
				<input
					placeholder={t('createChat.search-friends')}
					type='text'
					className='messenger__create-chat__contact-name'
					onChange={(e) => searchFriends(e.target.value, true)}
					value={searchFriendStr}
				/>
				<div className='messenger__create-chat__contacts-list'>
					{friends.map((friend: UserPreview) => (
						<FriendItem user={friend} key={friend.id} />
					))}
				</div>
			</div>
			<div className='messenger__create-chat__confirm-chat'>
				<button onClick={createConference} className='messenger__create-chat__confirm-chat-btn'>
					{t('createChat.confirm')}
				</button>
				<button onClick={rejectConferenceCreation} className='messenger__create-chat__dismiss-chat-btn'>
					{t('createChat.reject')}
				</button>
			</div>
		</div>
	);
};

export default CreateChat;
