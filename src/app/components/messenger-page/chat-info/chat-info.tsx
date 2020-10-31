import React, { useState, useRef, useCallback } from 'react';
import './chat-info.scss';
import { useSelector } from 'react-redux';
import { Chat } from 'app/store/chats/models';
import { getInterlocutorInitials, getChatInterlocutor } from '../../../utils/interlocutor-name-utils';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
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
import ConferenceAddFriendModal from '../conference-add-friend-modal/conference-add-friend-modal';
import ChangePhoto from 'app/components/messenger-page/change-photo/change-photo';
import { Route } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';
import ChatRecordings from './chat-recordings/chat-recordings';
import ChatFiles from './chat-files/chat-files';

const ChatInfo: React.FC = () => {
	const [editConferenceDisplayed, setEditConferenceDisplayed] = useState(false);
	const changeEditConferenceDisplayedState = useCallback(() => {
		setEditConferenceDisplayed((oldState) => !oldState);
	}, [setEditConferenceDisplayed]);

	const [addFriendsModalDisplayed, setAddFriendsModalDisplayed] = useState(false);
	const changeSetAddFriendsModalDisplayedState = useCallback(() => {
		setAddFriendsModalDisplayed((oldState) => !oldState);
	}, [setAddFriendsModalDisplayed]);

	const selectedChat = useSelector(getSelectedChatSelector) as Chat;

	const changeConferenceAvatar = useActionWithDeferred(ChatActions.changeConferenceAvatar);

	const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>(null);
	const [changePhotoDisplayed, setChangePhotoDisplayed] = useState(false);

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

		return (
			<React.Fragment>
				<div className={'chat-info'}>
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

					<ChatInfoActions addMembers={changeSetAddFriendsModalDisplayedState} />

					<ChatMedia />

					{conference && <ChatMembers addMembers={changeSetAddFriendsModalDisplayedState} />}
				</div>

				<Route path='/(contacts|calls|settings|chats)/:chatId?/info/photo' exact>
					{({ match }) => (
						<CSSTransition
							in={match != null}
							timeout={200}
							classNames='chat-info__nested-slide'
							unmountOnExit
						>
							<ChatPhoto />
						</CSSTransition>
					)}
				</Route>

				<Route path='/(contacts|calls|settings|chats)/:chatId?/info/audio-recordings' exact>
					{({ match }) => (
						<CSSTransition
							in={match != null}
							timeout={200}
							classNames='chat-info__nested-slide'
							unmountOnExit
						>
							<ChatRecordings />
						</CSSTransition>
					)}
				</Route>

				<Route path='/(contacts|calls|settings|chats)/:chatId?/info/video' exact>
					{({ match }) => (
						<CSSTransition
							in={match != null}
							timeout={200}
							classNames='chat-info__nested-slide'
							unmountOnExit
						>
							<ChatVideo />
						</CSSTransition>
					)}
				</Route>

				<Route path='/(contacts|calls|settings|chats)/:chatId?/info/files' exact>
					{({ match }) => (
						<CSSTransition
							in={match != null}
							timeout={200}
							classNames='chat-info__nested-slide'
							unmountOnExit
						>
							<ChatFiles />
						</CSSTransition>
					)}
				</Route>

				<FadeAnimationWrapper isDisplayed={editConferenceDisplayed}>
					<EditChatModal onClose={changeEditConferenceDisplayedState} />
				</FadeAnimationWrapper>

				<FadeAnimationWrapper isDisplayed={addFriendsModalDisplayed}>
					<ConferenceAddFriendModal onClose={changeSetAddFriendsModalDisplayedState} />
				</FadeAnimationWrapper>

				{changePhotoDisplayed && (
					<ChangePhoto hideChangePhoto={hideChangePhoto} imageUrl={imageUrl} onSubmit={changeAvatar} />
				)}
			</React.Fragment>
		);
	} else {
		return <div></div>;
	}
};

export default React.memo(ChatInfo);
