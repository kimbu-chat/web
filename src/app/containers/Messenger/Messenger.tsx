import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import './messenger.scss';

import SearchTop from '../../components/messenger-page/search-top/search-top';
import ChatData from '../../components/messenger-page/chat-data/chat-data';
import ChatList from '../../components/messenger-page/chat-list/chat-list';
import Chat from '../../components/messenger-page/chat/chat';
import CreateMessageInput from '../../components/messenger-page/message-input/message-input';
import AccountInfo from '../account-info/account-info';
import WithBackground from '../../components/shared/with-background';
import CreateChat from '../../components/messenger-page/create-chat/create-chat';
import ChatInfo from '../../components/messenger-page/chat-info/chat-info';
import ChangePhoto from '../../components/messenger-page/change-photo/change-photo';
import AccountSettings from 'app/components/messenger-page/account-settings/account-settings';
import InternetError from 'app/components/shared/internet-error/internet-error';
import IncomingCall from 'app/components/messenger-page/incoming-call/incoming-call';
import ActiveCall from 'app/components/messenger-page/active-call/active-call';
import ContactSearch from 'app/components/messenger-page/contact-search/contact-search';
import RoutingChats from 'app/components/messenger-page/routing-chats/routing-chats';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { AvatarSelectedData } from 'app/store/my-profile/models';
import { ChatActions } from 'app/store/chats/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { isCallingMe, amICaling, doIhaveCall } from 'app/store/calls/selectors';
import RespondingMessage from 'app/components/messenger-page/responding-message/responding-message';
import { RootState } from 'app/store/root-reducer';
import CallList from 'app/components/messenger-page/call-list/call-list';

export namespace Messenger {
	export interface photoSelect {
		isDisplayed?: boolean;
		onSubmit?: (data: AvatarSelectedData) => void;
	}
}

const Messenger = () => {
	const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);

	const selectedChat = useSelector(getSelectedChatSelector);
	const amICalled = useSelector(isCallingMe);
	const amICalingSomebody = useSelector(amICaling);
	const amISpeaking = useSelector(doIhaveCall);
	const replyingMessage = useSelector((state: RootState) => state.messages.messageToReply);

	const { id: chatId } = useParams<{ id: string }>();

	const [photoSelected, setPhotoSelected] = useState<Messenger.photoSelect>({
		isDisplayed: false,
	});
	const [createChatDisplayed, setCreateChatDisplayed] = useState(false);
	const [contactSearchDisplayed, setContactSearchDisplayed] = useState(false);
	const [infoDisplayed, setInfoDisplayed] = useState(false);
	const [accountInfoIsDisplayed, setAccountInfoIsDisplayed] = useState(false);
	const [settingsDisplayed, setSettingsDisplayed] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>('');

	//!Side EFFECTS
	useEffect(() => {
		if (chatId) changeSelectedChat(Number(chatId));
		else changeSelectedChat(-1);
	}, [chatId]);

	//hide chatInfo on chat change
	useEffect(() => hideChatInfo(), [selectedChat?.id]);

	//hide slider on other modals are displayed
	useEffect(() => hideSlider(), [
		createChatDisplayed,
		contactSearchDisplayed,
		createChatDisplayed,
		settingsDisplayed,
	]);
	//!--

	//Slider display and hide
	const displaySlider = useCallback(() => {
		setAccountInfoIsDisplayed(true);
	}, [setAccountInfoIsDisplayed]);
	const hideSlider = useCallback(() => {
		setAccountInfoIsDisplayed(false);
	}, [setAccountInfoIsDisplayed]);

	//Create chat display and hide
	const changeCreateChatDisplayed = useCallback(() => {
		setCreateChatDisplayed((oldState) => !oldState);
	}, [setCreateChatDisplayed]);

	//Chat info display and hide
	const displayChatInfo = useCallback(() => {
		setInfoDisplayed((oldDisplayedState) => !oldDisplayedState);
	}, [setInfoDisplayed]);
	const hideChatInfo = useCallback(() => {
		setInfoDisplayed(false);
	}, [setInfoDisplayed]);

	//Settings dispay and hide settings
	const changeSettingsDisplayed = useCallback(() => {
		setSettingsDisplayed((oldState) => !oldState);
	}, [setSettingsDisplayed]);

	//Cropper display and hide
	const hideChangePhoto = useCallback(() => setPhotoSelected({ isDisplayed: false }), []);
	const displayChangePhoto = useCallback(
		({ onSubmit }: Messenger.photoSelect) => {
			setPhotoSelected({ ...photoSelected, isDisplayed: true, onSubmit });
			hideSlider();
		},
		[setPhotoSelected, hideSlider],
	);

	//Contact search displayed
	const changeContactSearchDisplayed = useCallback(() => {
		setContactSearchDisplayed((oldState) => !oldState);
	}, [setContactSearchDisplayed]);

	return (
		<div className='messenger'>
			{amICalled && <IncomingCall />}
			<ActiveCall isDisplayed={amISpeaking || amICalingSomebody} />

			<InternetError />

			<RoutingChats />

			<div className='messenger__chat-list'>
				{true && (
					<>
						<SearchTop displaySlider={displaySlider} displayCreateChat={changeCreateChatDisplayed} />{' '}
						<ChatList />{' '}
					</>
				)}
				{false && <CallList />}
			</div>

			<WithBackground
				isBackgroundDisplayed={Boolean(photoSelected.isDisplayed)}
				onBackgroundClick={hideChangePhoto}
			>
				{photoSelected.isDisplayed && (
					<ChangePhoto
						imageUrl={imageUrl}
						hideChangePhoto={hideChangePhoto}
						onSubmit={photoSelected.onSubmit}
					/>
				)}
			</WithBackground>

			<WithBackground isBackgroundDisplayed={accountInfoIsDisplayed} onBackgroundClick={hideSlider}>
				<AccountInfo
					isDisplayed={accountInfoIsDisplayed}
					hideSlider={hideSlider}
					displayContactSearch={changeContactSearchDisplayed}
					displayCreateChat={changeCreateChatDisplayed}
					displaySettings={changeSettingsDisplayed}
					displayChangePhoto={displayChangePhoto}
					setImageUrl={setImageUrl}
				/>
			</WithBackground>

			<ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />

			<WithBackground isBackgroundDisplayed={createChatDisplayed} onBackgroundClick={changeCreateChatDisplayed}>
				<CreateChat
					setImageUrl={setImageUrl}
					displayChangePhoto={displayChangePhoto}
					hide={changeCreateChatDisplayed}
					isDisplayed={createChatDisplayed}
				/>
			</WithBackground>

			<WithBackground isBackgroundDisplayed={settingsDisplayed} onBackgroundClick={changeSettingsDisplayed}>
				<AccountSettings isDisplayed={settingsDisplayed} hide={changeSettingsDisplayed} />
			</WithBackground>

			{/* Contact search modal */}
			<WithBackground
				isBackgroundDisplayed={contactSearchDisplayed}
				onBackgroundClick={changeContactSearchDisplayed}
			>
				<ContactSearch hide={changeContactSearchDisplayed} isDisplayed={contactSearchDisplayed} />
			</WithBackground>

			<div className={`messenger__chat-send ${infoDisplayed ? 'messenger__chat-send--little' : ''}`}>
				<Chat />
				{replyingMessage && <RespondingMessage />}
				<CreateMessageInput />
			</div>
			<ChatInfo
				displayCreateChat={changeCreateChatDisplayed}
				setImageUrl={setImageUrl}
				displayChangePhoto={displayChangePhoto}
				isDisplayed={infoDisplayed}
			/>
		</div>
	);
};

export default React.memo(Messenger);
