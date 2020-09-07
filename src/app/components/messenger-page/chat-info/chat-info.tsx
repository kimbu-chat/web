import React, { useState, useRef, useCallback } from 'react';
import './chat-info.scss';
import { useSelector } from 'react-redux';
import { Chat } from 'app/store/chats/models';
import { getInterlocutorInitials, getChatInterlocutor } from '../../../utils/interlocutor-name-utils';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { Messenger } from 'app/containers/Messenger/Messenger';
import { AvatarSelectedData } from 'app/store/my-profile/models';

import { getSelectedChatSelector } from 'app/store/chats/selectors';

import ChatManipulation from './chat-manipulation/chat-manipulation';
import StatusBadge from 'app/components/shared/status-badge/status-badge';
import ChatMembers from './chat-members/chat-members';
import RenameConferenceModal from './rename-conference-modal/rename-conference-modal';

import { FriendActions } from 'app/store/friends/actions';
import { ChatActions } from 'app/store/chats/actions';

import Avatar from 'app/components/shared/avatar/avatar';

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
	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const leaveConference = useActionWithDispatch(ChatActions.leaveConference);
	const removeChat = useActionWithDispatch(ChatActions.removeChat);
	const muteChat = useActionWithDispatch(ChatActions.muteChat);
	const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);
	const markUser = useActionWithDispatch(FriendActions.markUserAsAddedToConference);
	const renameConference = useActionWithDispatch(ChatActions.renameConference);
	const addUsersToConferece = useActionWithDeferred(ChatActions.addUsersToConference);
	const changeConferenceAvatar = useActionWithDeferred(ChatActions.changeConferenceAvatar);

	const deleteChat = (): void => removeChat(selectedChat);
	const muteThisChat = (): void => muteChat(selectedChat);
	const deleteContact = (): void => deleteFriend({ userIds: [selectedChat.interlocutor?.id || -1] });
	const deleteConference = (): void => leaveConference(selectedChat);
	const setNewConferenceName = (newName: string): void => renameConference({ newName, chat: selectedChat });
	const createConference = (): void => {
		displayCreateChat();
		markUser(selectedChat.interlocutor?.id || -1);
	};
	const addUsers = (userIds: number[]): void => {
		addUsersToConferece({ chat: selectedChat, userIds }).then(hideContactSearch);
	};
	const searchContactsToAdd = useCallback(
		(args?: Messenger.optionalContactSearchActions) => {
			displayContactSearch({
				isDisplayed: true,
				isSelectable: true,
				onSubmit: addUsers,
				displayMyself: false,
				...args,
			});
		},
		[addUsers],
	);
	const changeAvatar = (data: AvatarSelectedData) =>
		changeConferenceAvatar({
			conferenceId: selectedChat.conference?.id || -100,
			avatarData: data,
		});

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [renameConferenceOpened, setRenameConferenceOpened] = useState<boolean>(false);
	const openRenameConference = (): void => setRenameConferenceOpened(true);

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
			<div className={isDisplayed ? 'chat-info chat-info--active' : 'chat-info'}>
				<div className='chat-info__main-data'>
					{!conference && selectedChat?.interlocutor ? (
						<StatusBadge user={selectedChat.interlocutor} />
					) : (
						<div className='chat-info__avatar-group'>
							<Avatar className='chat-info__avatar' src={getChatAvatar()}>
								{getInterlocutorInitials(selectedChat)}
							</Avatar>
							<div
								onClick={() => fileInputRef.current?.click()}
								className={getChatAvatar() ? 'change-avatar change-avatar--hidden' : 'change-avatar'}
							>
								<div className='svg'>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
										<path
											fillRule='evenodd'
											d='M4.254 2.257A3.8 3.8 0 0 1 7.392.6h1.223c1.26 0 2.433.625 3.139 1.658l1.67.256A2.8 2.8 0 0 1 15.8 5.282V11a3.8 3.8 0 0 1-3.8 3.8H4A3.8 3.8 0 0 1 .2 11V5.282a2.8 2.8 0 0 1 2.376-2.768l1.678-.257zm.61 1.525l-2.046.314A1.2 1.2 0 0 0 1.8 5.282V11A2.2 2.2 0 0 0 4 13.2h8a2.2 2.2 0 0 0 2.2-2.2V5.282a1.2 1.2 0 0 0-1.018-1.186l-2.037-.312a.8.8 0 0 1-.572-.391l-.057-.1A2.2 2.2 0 0 0 8.615 2.2H7.392a2.2 2.2 0 0 0-1.91 1.107l-.046.081a.8.8 0 0 1-.573.394zM8 4.615A3.786 3.786 0 0 1 11.785 8.4 3.786 3.786 0 0 1 8 12.185 3.786 3.786 0 0 1 4.215 8.4 3.786 3.786 0 0 1 8 4.615zm0 1.6c-1.206 0-2.185.98-2.185 2.185 0 1.206.98 2.185 2.185 2.185 1.206 0 2.185-.98 2.185-2.185 0-1.206-.98-2.185-2.185-2.185z'
										></path>
									</svg>
								</div>
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
				</div>
				<ChatManipulation
					deleteChat={deleteChat}
					deleteConference={deleteConference}
					muteChat={muteThisChat}
					deleteContact={deleteContact}
					createConference={createConference}
					openRenameConference={openRenameConference}
					addMembers={searchContactsToAdd}
				/>

				{conference && <ChatMembers addMembers={searchContactsToAdd} />}

				{renameConferenceOpened && (
					<RenameConferenceModal
						close={() => setRenameConferenceOpened(false)}
						renameConference={setNewConferenceName}
					/>
				)}
			</div>
		);
	} else {
		return <div></div>;
	}
};

export default React.memo(ChatInfo, (prevProps, nextProps) => prevProps.isDisplayed === nextProps.isDisplayed);
