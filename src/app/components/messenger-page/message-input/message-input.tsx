import React, { useState, useRef, useContext, useCallback, KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import './message-input.scss';

import { Picker, BaseEmoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { UserPreview } from 'app/store/my-profile/models';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { MessageActions } from 'app/store/messages/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { SystemMessageType, MessageState } from 'app/store/messages/models';
import { LocalizationContext } from 'app/app';
import { RootState } from 'app/store/root-reducer';

import AddSvg from 'app/assets/icons/ic-add-new.svg';

const CreateMessageInput = () => {
	const { t } = useContext(LocalizationContext);

	const sendMessage = useActionWithDispatch(MessageActions.createMessage);
	const notifyAboutTyping = useActionWithDispatch(MessageActions.messageTyping);

	const currentUser = useSelector<RootState, UserPreview | undefined>((state) => state.myProfile.user);
	const selectedChat = useSelector(getSelectedChatSelector);
	const [text, setText] = useState('');
	const [smilesDisplayed, setSmilesDisplayed] = useState<boolean>(false);

	const emojiRef = useRef<HTMLDivElement | null>(null);

	const handleClick = () => {
		if (!smilesDisplayed) {
			setSmilesDisplayed(true);
			document.addEventListener('click', handleOutsideClick, false);
			return;
		}
		setSmilesDisplayed(false);
		document.removeEventListener('click', handleOutsideClick, false);
	};

	const handleOutsideClick = useCallback(
		(e: MouseEvent) => {
			if (!emojiRef.current?.contains(e.target as Node)) {
				setSmilesDisplayed(false);
				document.removeEventListener('click', handleOutsideClick, false);
			}
		},
		[setSmilesDisplayed, emojiRef],
	);

	const sendMessageToServer = () => {
		const chatId = selectedChat?.id;

		if (text.trim().length > 0 && selectedChat && currentUser) {
			sendMessage({
				currentUser: currentUser,
				selectedChatId: chatId || -1,
				chat: selectedChat,
				message: {
					text,
					systemMessageType: SystemMessageType.None,
					userCreator: currentUser,
					creationDateTime: new Date(new Date().toUTCString()),
					state: MessageState.QUEUED,
					id: new Date().getTime(),
					chatId: chatId,
				},
			});
		}

		setText('');
	};

	const handleTextChange = (newText: string): void => {
		const isChat = Boolean(selectedChat?.interlocutor);

		notifyAboutTyping({
			interlocutorId: isChat ? selectedChat?.interlocutor?.id : selectedChat?.conference?.id,
			isConference: !isChat,
			text: newText,
		});
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			sendMessageToServer();
		}
	};
	return (
		<div className='messenger__send-message'>
			{selectedChat && (
				<React.Fragment>
					<button onClick={handleClick} className='messenger__add'>
						<AddSvg />
					</button>
					<div className='messenger__input-group' onSubmit={sendMessageToServer}>
						<input
							placeholder={t('messageInput.write')}
							type='text'
							value={text}
							onChange={(event) => {
								setText(event.target.value);
								handleTextChange(event.target.value);
							}}
							className='messenger__input-message'
							onKeyPress={handleKeyPress}
						/>
						<button className='messenger__send-btn' onClick={sendMessageToServer}>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path d='M2.56 10.26c.07-.55.58-1.04 1.12-1.1L11 8.38c.56-.06.56-.16 0-.22l-7.3-.78c-.55-.06-1.05-.55-1.12-1.1l-.54-4.02c-.15-1.1.52-1.57 1.5-1.04l11.38 6.1c.97.52 1 1.37 0 1.9l-11.38 6.1c-.97.52-1.65.06-1.5-1.04l.54-4.02z'></path>
							</svg>
						</button>
					</div>
					{smilesDisplayed && (
						<div ref={emojiRef} className='emoji-wrapper'>
							<Picker
								set='apple'
								showSkinTones={false}
								showPreview={false}
								//problems with typization detected
								i18n={{
									search: t('emojiMart.search'),
									notfound: t('emojiMart.notfound'),
									categories: {
										search: t('emojiMart.categories.search'),
										recent: t('emojiMart.categories.recent'),
										people: t('emojiMart.categories.people'),
										nature: t('emojiMart.categories.nature'),
										foods: t('emojiMart.categories.foods'),
										activity: t('emojiMart.categories.activity'),
										places: t('emojiMart.categories.places'),
										objects: t('emojiMart.categories.objects'),
										symbols: t('emojiMart.categories.symbols'),
										flags: t('emojiMart.categories.flags'),
									},
								}}
								onSelect={(emoji: BaseEmoji) => {
									setText((oldText) => oldText + (emoji.native as string));
								}}
							/>
						</div>
					)}
				</React.Fragment>
			)}
		</div>
	);
};

export default React.memo(CreateMessageInput);
