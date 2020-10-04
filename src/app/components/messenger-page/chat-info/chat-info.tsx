import React, { useState, useRef, useCallback, useEffect } from 'react';
import './chat-info.scss';
import { useSelector } from 'react-redux';
import { Chat } from 'app/store/chats/models';
import { getInterlocutorInitials, getChatInterlocutor } from '../../../utils/interlocutor-name-utils';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { Messenger } from 'app/containers/Messenger/Messenger';
import { AvatarSelectedData } from 'app/store/my-profile/models';

import { getSelectedChatSelector } from 'app/store/chats/selectors';

import InterlocutorInfo from './interlocutor-info/interlocutor-info';
import ChatInfoActions from './chat-actions/chat-actions';
import ChatMembers from './chat-members/chat-members';
import ChatMedia from './chat-media/chat-media';
import ChatPhoto from './chat-photo/chat-photo';
import ChatVideo from './chat-video/chat-video';

import { ChatActions } from 'app/store/chats/actions';

import Avatar from 'app/components/shared/avatar/avatar';

import EditSvg from 'app/assets/icons/ic-edit.svg';
import PhotoSvg from 'app/assets/icons/ic-photo.svg';
import EditChatModal from '../edit-chat-modal/edit-chat-modal';

namespace ChatInfo {
	export interface Props {
		displayCreateChat: () => void;
		hideContactSearch: () => void;
		displayContactSearch: (action?: Messenger.contactSearchActions) => void;
		setImageUrl: (url: string | null | ArrayBuffer) => void;
		displayChangePhoto: (data: Messenger.photoSelect) => void;
		isDisplayed: boolean;
	}
}

const ChatInfo: React.FC<ChatInfo.Props> = ({
	displayCreateChat,
	displayContactSearch,
	hideContactSearch,
	setImageUrl,
	displayChangePhoto,
	isDisplayed,
}) => {
	const [chatPhotoDisplayed, setChatPhotoDisplayed] = useState(false);
	const closeChatPhoto = useCallback(() => setChatPhotoDisplayed(false), [setChatPhotoDisplayed]);
	const displayChatPhoto = useCallback(() => setChatPhotoDisplayed(true), [setChatPhotoDisplayed]);

	const [chatVideoDisplayed, setChatVideoDisplayed] = useState(false);
	const closeChatVideo = useCallback(() => setChatVideoDisplayed(false), [setChatVideoDisplayed]);
	const displayChatVideo = useCallback(() => setChatVideoDisplayed(true), [setChatVideoDisplayed]);

	const [editConferenceDisplayed, setEditConferenceDisplayed] = useState(false);
	const changeEditConferenceDisplayedState = useCallback(() => {
		setEditConferenceDisplayed((oldState) => !oldState);
	}, [setEditConferenceDisplayed]);

	useEffect(() => {
		return () => {
			closeChatPhoto();
			closeChatVideo();
		};
	}, [isDisplayed]);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const addUsersToConferece = useActionWithDeferred(ChatActions.addUsersToConference);
	const changeConferenceAvatar = useActionWithDeferred(ChatActions.changeConferenceAvatar);

	const addUsers = useCallback(
		(userIds: number[]): void => {
			addUsersToConferece({ chat: selectedChat, userIds }).then(hideContactSearch);
		},
		[addUsersToConferece, hideContactSearch, selectedChat],
	);

	const searchContactsToAdd = useCallback(
		(args?: Messenger.optionalContactSearchActions) => {
			displayContactSearch({
				isDisplayed: true,
				isSelectable: true,
				onSubmit: addUsers,
				displayMyself: false,
				onClickOnContact: undefined,
				...args,
			});
		},
		[addUsers, displayContactSearch],
	);
	const changeAvatar = useCallback(
		(data: AvatarSelectedData) => {
			changeConferenceAvatar({
				conferenceId: selectedChat?.conference?.id!,
				avatarData: data,
			});
		},
		[changeConferenceAvatar, selectedChat?.conference?.id],
	);

	const fileInputRef = useRef<HTMLInputElement>(null);

	if (selectedChat) {
		const { interlocutor, conference } = selectedChat;

		const getChatAvatar = (): string => {
			if (interlocutor) {
				return interlocutor.avatarUrl as string;
			}

			return conference?.avatarUrl as string;
		};

		const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			e.preventDefault();

			const reader = new FileReader();

			reader.onload = () => {
				setImageUrl(reader.result);
				displayChangePhoto({ onSubmit: changeAvatar });
			};

			if (e.target.files) reader.readAsDataURL(e.target.files[0]);
		};

		return (
			<React.Fragment>
				<div className={isDisplayed ? 'chat-info chat-info--active' : 'chat-info'}>
					<div className='chat-info__main-data'>
						{!conference && selectedChat?.interlocutor ? (
							<Avatar className='chat-info__avatar' src={getChatAvatar()}>
								{getInterlocutorInitials(selectedChat)}
							</Avatar>
						) : (
							<div className='chat-info__avatar-group'>
								<Avatar className='chat-info__avatar' src={getChatAvatar()}>
									{getInterlocutorInitials(selectedChat)}
								</Avatar>
								<div
									onClick={() => fileInputRef.current?.click()}
									className={
										getChatAvatar() ? 'change-avatar change-avatar--hidden' : 'change-avatar'
									}
								>
									<PhotoSvg className='change-avatar__svg' viewBox='0 0 25 25' />
								</div>
							</div>
						)}
						<input
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)}
							ref={fileInputRef}
							type='file'
							hidden
							accept='image/*'
						/>
						<span className='chat-info__interlocutor'>{getChatInterlocutor(selectedChat)}</span>
						{conference && (
							<button onClick={changeEditConferenceDisplayedState} className='chat-info__rename-btn'>
								<EditSvg />
							</button>
						)}
					</div>

					<InterlocutorInfo />

					<ChatInfoActions displayCreateChat={displayCreateChat} addMembers={searchContactsToAdd} />

					<ChatMedia displayChatPhoto={displayChatPhoto} displayChatVideo={displayChatVideo} />

					{conference && <ChatMembers addMembers={searchContactsToAdd} />}
				</div>

				<ChatPhoto isDisplayed={chatPhotoDisplayed} close={closeChatPhoto} />

				<ChatVideo isDisplayed={chatVideoDisplayed} close={closeChatVideo} />

				<EditChatModal isDisplayed={editConferenceDisplayed} close={changeEditConferenceDisplayedState} />
			</React.Fragment>
		);
	} else {
		return <div></div>;
	}
};

export default React.memo(ChatInfo, (prevProps, nextProps) => prevProps.isDisplayed === nextProps.isDisplayed);
