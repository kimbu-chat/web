import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import './Messenger.scss';

import SearchTop from '../../components/messenger-page/search-top/search-top';
import ChatData from '../../components/messenger-page/chat-data/chat-data';
import ChatList from '../../components/messenger-page/chat-list/chat-list';
import Chat from '../../components/messenger-page/chat/chat';
import CreateMessageInput from '../../components/messenger-page/message-input/message-input';
import AccountInfo from '../account-info/account-info';
import BackgroundBlur from '../../components/shared/background-blur';
import CreateChat from '../../components/messenger-page/create-chat/create-chat';
import ChatInfo from '../../components/messenger-page/chat-info/chat-info';
import ContactSearch from '../../components/messenger-page/contact-search/contact-search';
import ChangePhoto from '../../components/messenger-page/change-photo/change-photo';
import AccountSettings from 'app/components/messenger-page/account-settings/account-settings';
import InternetError from 'app/components/shared/internet-error/internet-error';
import OutgoingCall from 'app/components/messenger-page/outgoing-call/outgoing-call';
import IncomingCall from 'app/components/messenger-page/incoming-call/incoming-call';
import ActiveCall from 'app/components/messenger-page/active-call/active-call';

import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { AvatarSelectedData, UserPreview } from 'app/store/my-profile/models';
import { ChatActions } from 'app/store/chats/actions';
import { MessageActions } from 'app/store/messages/actions';
import { useSelector } from 'react-redux';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { isCallingMe, amCallingI, doIhaveCall } from 'app/store/calls/selectors';

export namespace Messenger {
	export interface contactSearchActions {
		isDisplayed: boolean;
		isSelectable?: boolean;
		onSubmit?: (userIds: number[]) => void;
		displayMyself?: boolean;
		excludeIds?: (number | undefined)[];
	}

	export interface optionalContactSearchActions {
		isSelectable?: boolean;
		onSubmit?: (userIds: number[]) => void;
		displayMyself?: boolean;
		excludeIds?: (number | undefined)[];
	}

	export interface photoSelect {
		isDisplayed?: boolean;
		onSubmit?: (data: AvatarSelectedData) => void;
	}
}

const Messenger = () => {
	const changeSelectedChat = useActionWithDispatch(ChatActions.changeSelectedChat);
	const createChat = useActionWithDispatch(MessageActions.createChat);

	const selectedChat = useSelector(getSelectedChatSelector);
	const amICalled = useSelector(isCallingMe);
	const amICaling = useSelector(amCallingI);
	const amISpeaking = useSelector(doIhaveCall);

	const { id: chatId } = useParams<{ id: string }>();
	const history = useHistory();

	//redux sync with history
	history.listen((location) => {
		if (location.pathname.split('/')[2]) {
			changeSelectedChat(Number(location.pathname.split('/')[2]));
		}
	});

	useEffect(() => {
		if (chatId) changeSelectedChat(Number(chatId));
		else changeSelectedChat(-1);
	}, []);

	//hide chatInfo on chat change

	useEffect(() => hideChatInfo(), [selectedChat?.id]);

	const [contactSearchDisplayed, setContactSearchDisplayed] = useState<Messenger.contactSearchActions>({
		isDisplayed: false,
	});
	const [photoSelected, setPhotoSelected] = useState<Messenger.photoSelect>({
		isDisplayed: false,
	});

	const [createChatDisplayed, setCreateChatDisplayed] = useState<boolean>(false);
	const [infoDisplayed, setInfoDisplayed] = useState<boolean>(false);
	const [accountInfoIsDisplayed, setAccountInfoIsDisplayed] = useState<boolean>(false);
	const [settingsDisplayed, setSettingsDisplayed] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>('');

	//Slider display and hide
	const displaySlider = useCallback(() => {
		setAccountInfoIsDisplayed(true);
	}, [setAccountInfoIsDisplayed]);
	const hideSlider = useCallback(() => {
		setAccountInfoIsDisplayed(false);
	}, [setAccountInfoIsDisplayed]);

	//Create chat display and hide
	const displayCreateChat = useCallback(() => {
		setCreateChatDisplayed(true);
	}, [setCreateChatDisplayed]);
	const hideCreateChat = useCallback(() => {
		setCreateChatDisplayed(false);
	}, [setCreateChatDisplayed]);

	//Chat info display and hide
	const displayChatInfo = useCallback(() => {
		setInfoDisplayed((oldDisplayedState) => !oldDisplayedState);
	}, [setInfoDisplayed]);
	const hideChatInfo = useCallback(() => {
		setInfoDisplayed(false);
	}, [setInfoDisplayed]);

	//Settings dispay and hide settings
	const displaySettings = useCallback(() => setSettingsDisplayed(true), [setSettingsDisplayed]);
	const hideSettings = useCallback(() => setSettingsDisplayed(false), [setSettingsDisplayed]);

	//Contact search display and hide
	const displayContactSearch = useCallback(
		(actions?: Messenger.contactSearchActions) => {
			setContactSearchDisplayed({ isDisplayed: true, ...actions });
		},
		[setContactSearchDisplayed],
	);
	const hideContactSearch = useCallback(() => {
		setContactSearchDisplayed({ isDisplayed: false });
	}, [setContactSearchDisplayed]);

	//Cropper display and hide
	const hideChangePhoto = useCallback(() => setPhotoSelected({ isDisplayed: false }), []);
	const displayChangePhoto = useCallback(
		({ onSubmit }: Messenger.photoSelect) => {
			setPhotoSelected({ ...photoSelected, isDisplayed: true, onSubmit });
			hideContactSearch();
			hideSlider();
		},
		[setPhotoSelected, hideContactSearch, hideSlider],
	);

	//Creation of empty chat with contact
	const createEmptyChat = useCallback((user: UserPreview) => {
		createChat(user);
		const chatId = Number(`${user.id}1`);
		history.push(`/chats/${chatId}`);
		hideContactSearch();
	}, []);

	//hide all on backgroundBlur click

	const hideAll = useCallback(() => {
		hideCreateChat();
		hideContactSearch();
		hideSlider();
		hideChangePhoto();
		hideSettings();
	}, [hideCreateChat, hideContactSearch, hideSlider, hideChangePhoto, hideSettings]);

	return (
		<div className='messenger'>
			{amICaling && <OutgoingCall />}
			{amICalled && <IncomingCall />}
			<ActiveCall isDisplayed={amISpeaking} />

			<InternetError />

			<SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />

			{photoSelected.isDisplayed && (
				<ChangePhoto imageUrl={imageUrl} hideChangePhoto={hideChangePhoto} onSubmit={photoSelected.onSubmit} />
			)}

			{(createChatDisplayed ||
				accountInfoIsDisplayed ||
				contactSearchDisplayed.isDisplayed ||
				settingsDisplayed ||
				photoSelected.isDisplayed) && <BackgroundBlur onClick={hideAll} />}

			<AccountInfo
				isDisplayed={accountInfoIsDisplayed}
				hideSlider={hideSlider}
				displayCreateChat={displayCreateChat}
				displayContactSearch={displayContactSearch}
				displaySettings={displaySettings}
				displayChangePhoto={displayChangePhoto}
				setImageUrl={setImageUrl}
			/>

			<ChatData chatInfoDisplayed={infoDisplayed} displayChatInfo={displayChatInfo} />

			<ChatList />

			<CreateChat
				setImageUrl={setImageUrl}
				displayChangePhoto={displayChangePhoto}
				hide={hideCreateChat}
				isDisplayed={createChatDisplayed}
			/>

			<AccountSettings isDisplayed={settingsDisplayed} hide={hideSettings} />

			<ContactSearch onClickOnContact={createEmptyChat} hide={hideContactSearch} {...contactSearchDisplayed} />

			{!createChatDisplayed && !contactSearchDisplayed.isDisplayed && (
				<div className='messenger__chat-send'>
					<Chat />
					<CreateMessageInput />
					<ChatInfo
						displayCreateChat={displayCreateChat}
						displayContactSearch={displayContactSearch}
						hideContactSearch={hideContactSearch}
						setImageUrl={setImageUrl}
						displayChangePhoto={displayChangePhoto}
						isDisplayed={infoDisplayed}
					/>
				</div>
			)}
		</div>
	);
};

export default React.memo(Messenger);
