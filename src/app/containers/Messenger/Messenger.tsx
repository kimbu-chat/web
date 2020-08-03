import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import './Messenger.scss';
import SearchTop from '../../components/MessengerPage/SearchTop/SearchTop';
import ChatData from '../../components/MessengerPage/ChatData/ChatData';
import ChatList from '../../components/MessengerPage/ChatList/ChatList';
import Chat from '../../components/MessengerPage/Chat/Chat';
import CreateMessageInput from '../../components/MessengerPage/create-message-input/Index';
import AccountInfo from '../AccountInfo/AccountInfo';
import BackgroundBlur from '../../utils/BackgroundBlur';
import CreateChat from '../../components/MessengerPage/CreateChat/CreateChat';
import ChatInfo from '../../components/MessengerPage/ChatInfo/ChatInfo';
import ContactSearch from '../../components/MessengerPage/ContactSearch/ContactSearch';
import ChangePhoto from '../../components/MessengerPage/ChangePhoto/ChangePhoto';
import AccountSettings from 'app/components/MessengerPage/AccountSettings/AccountSettings';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { AvatarSelectedData, UserPreview } from 'app/store/my-profile/models';
import { ChatActions } from 'app/store/dialogs/actions';
import { MessageActions } from 'app/store/messages/actions';
import { useSelector } from 'react-redux';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';

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
	const changeSelectedDialog = useActionWithDispatch(ChatActions.changeSelectedChat);
	const createDialog = useActionWithDispatch(MessageActions.createDialog);

	const selectedDialog = useSelector(getSelectedDialogSelector);

	const { id: chatId } = useParams();
	const history = useHistory();

	//redux sync with history
	history.listen((location, action) => {
		if (location.pathname.split('/')[2]) {
			changeSelectedDialog(Number(location.pathname.split('/')[2]));
		}
	});

	useEffect(() => {
		if (chatId) changeSelectedDialog(Number(chatId));
		else changeSelectedDialog(-1);
	}, []);

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
	const displaySlider = () => {
		setAccountInfoIsDisplayed(true);
	};
	const hideSlider = () => {
		setAccountInfoIsDisplayed(false);
	};

	//Create chat display and hide
	const displayCreateChat = () => {
		setCreateChatDisplayed(true);
	};
	const hideCreateChat = () => {
		setCreateChatDisplayed(false);
	};

	//Chat info display and hide
	const displayChatInfo = () => {
		setInfoDisplayed(!infoDisplayed);
	};
	const hideChatInfo = () => {
		setInfoDisplayed(false);
	};

	//Settings dispay and hide settings

	const displaySettings = () => setSettingsDisplayed(true);
	const hideSettings = () => setSettingsDisplayed(false);

	//Contact search display and hide
	const displayContactSearch = (actions?: Messenger.contactSearchActions) => {
		setContactSearchDisplayed({ isDisplayed: true, ...actions });
	};
	const hideContactSearch = () => {
		setContactSearchDisplayed({ isDisplayed: false });
	};

	//Cropper display and hide
	const hideChangePhoto = () => setPhotoSelected({ isDisplayed: false });
	const displayChangePhoto = ({ onSubmit }: Messenger.photoSelect) => {
		setPhotoSelected({ ...photoSelected, isDisplayed: true, onSubmit });
		hideContactSearch();
		hideSlider();
	};

	//Creation of empty dialog with contact

	const createEmptyDialog = (user: UserPreview) => {
		createDialog(user);
		const dialogId = Number(`${user.id}1`);
		history.push(`/chats/${dialogId}`);
		hideContactSearch();
	};

	//hide chatInfo on dialog change

	useEffect(() => hideChatInfo(), [selectedDialog?.id]);

	return (
		<div className='messenger'>
			<SearchTop displaySlider={displaySlider} displayCreateChat={displayCreateChat} />

			{photoSelected.isDisplayed && (
				<ChangePhoto imageUrl={imageUrl} hideChangePhoto={hideChangePhoto} onSubmit={photoSelected.onSubmit} />
			)}

			{(createChatDisplayed ||
				accountInfoIsDisplayed ||
				contactSearchDisplayed.isDisplayed ||
				settingsDisplayed ||
				photoSelected.isDisplayed) && (
				<BackgroundBlur
					onClick={() => {
						hideCreateChat();
						hideContactSearch();
						hideSlider();
						hideChangePhoto();
						hideSettings();
					}}
				/>
			)}

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

			<ContactSearch onClickOnContact={createEmptyDialog} hide={hideContactSearch} {...contactSearchDisplayed} />

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

export default Messenger;
