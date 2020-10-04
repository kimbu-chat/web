import React, { useState, useRef, useCallback, useContext, useEffect } from 'react';
import './chat-info.scss';
import { useSelector } from 'react-redux';
import { Chat } from 'app/store/chats/models';
import { getInterlocutorInitials, getChatInterlocutor } from '../../../utils/interlocutor-name-utils';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
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

import { FriendActions } from 'app/store/friends/actions';
import { ChatActions } from 'app/store/chats/actions';

import Avatar from 'app/components/shared/avatar/avatar';
import Modal from 'app/components/shared/modal/modal';
import WithBackground from 'app/components/shared/with-background';
import { LocalizationContext } from 'app/app';

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
	const { t } = useContext(LocalizationContext);

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

	const leaveConference = useActionWithDeferred(ChatActions.leaveConference);
	const removeChat = useActionWithDispatch(ChatActions.removeChat);
	const muteChat = useActionWithDispatch(ChatActions.muteChat);
	const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);
	const markUser = useActionWithDispatch(FriendActions.markUserAsAddedToConference);
	const addUsersToConferece = useActionWithDeferred(ChatActions.addUsersToConference);
	const changeConferenceAvatar = useActionWithDeferred(ChatActions.changeConferenceAvatar);

	const [leaveConferenceModalOpened, setLeaveConferenceModalOpened] = useState<boolean>(false);

	const openLeaveConferenceModal = useCallback(() => setLeaveConferenceModalOpened(true), [
		setLeaveConferenceModalOpened,
	]);
	const closeLeaveConferenceModal = useCallback(() => setLeaveConferenceModalOpened(false), [
		setLeaveConferenceModalOpened,
	]);

	const deleteChat = useCallback(() => removeChat(selectedChat), [removeChat, selectedChat]);
	const muteThisChat = useCallback(() => muteChat(selectedChat), [muteChat, selectedChat]);
	const deleteContact = useCallback(() => deleteFriend({ userIds: [selectedChat?.interlocutor?.id || -1] }), [
		deleteFriend,
		selectedChat?.interlocutor?.id,
	]);
	const deleteConference = useCallback(async () => {
		await leaveConference(selectedChat);
		closeLeaveConferenceModal();
	}, [leaveConference, closeLeaveConferenceModal, selectedChat]);

	const createConference = useCallback(() => {
		displayCreateChat();
		markUser(selectedChat.interlocutor?.id || -1);
	}, [displayCreateChat, markUser, selectedChat?.interlocutor?.id]);
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

					<ChatInfoActions
						deleteChat={deleteChat}
						deleteConference={openLeaveConferenceModal}
						muteChat={muteThisChat}
						deleteContact={deleteContact}
						createConference={createConference}
						addMembers={searchContactsToAdd}
					/>

					<ChatMedia displayChatPhoto={displayChatPhoto} displayChatVideo={displayChatVideo} />

					{conference && <ChatMembers addMembers={searchContactsToAdd} />}
				</div>

				<ChatPhoto isDisplayed={chatPhotoDisplayed} close={closeChatPhoto} />

				<ChatVideo isDisplayed={chatVideoDisplayed} close={closeChatVideo} />

				<EditChatModal isDisplayed={editConferenceDisplayed} close={changeEditConferenceDisplayedState} />

				<WithBackground
					isBackgroundDisplayed={leaveConferenceModalOpened}
					onBackgroundClick={closeLeaveConferenceModal}
				>
					{leaveConferenceModalOpened && (
						<Modal
							title='Delete chat'
							contents={t('chatInfo.leave-confirmation', { conferenceName: conference?.name })}
							highlightedInContents={`‘${conference?.name}‘`}
							closeModal={closeLeaveConferenceModal}
							buttons={[
								{
									text: t('chatInfo.confirm'),
									style: {
										color: 'rgb(255, 255, 255)',
										backgroundColor: 'rgb(209, 36, 51)',
										padding: '16px 49.5px',
										margin: '0',
									},
									position: 'left',
									onClick: deleteConference,
								},
								{
									text: t('chatInfo.cancel'),
									style: {
										color: 'rgb(109, 120, 133)',
										backgroundColor: 'rgb(255, 255, 255)',
										padding: '16px 38px',
										margin: '0 0 0 10px',
										border: '1px solid rgb(215, 216, 217)',
									},

									position: 'left',
									onClick: closeLeaveConferenceModal,
								},
							]}
						/>
					)}
				</WithBackground>
			</React.Fragment>
		);
	} else {
		return <div></div>;
	}
};

export default React.memo(ChatInfo, (prevProps, nextProps) => prevProps.isDisplayed === nextProps.isDisplayed);
