import React, { useState, useRef, useContext } from 'react';
import './_SendMessage.scss';
import { useSelector } from 'react-redux';
import { UserPreview } from 'app/store/my-profile/models';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { Dialog } from 'app/store/dialogs/models';
import { MessageActions } from 'app/store/messages/actions';
import { RootState } from 'app/store/root-reducer';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { SystemMessageType, MessageState } from 'app/store/messages/models';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { LocalizationContext } from 'app/app';

const CreateMessageInput = () => {
	const { t } = useContext(LocalizationContext);

	const sendMessage = useActionWithDispatch(MessageActions.createMessage);
	const notifyAboutTyping = useActionWithDispatch(MessageActions.messageTyping);

	const currentUserId = useSelector<RootState, number>((appState: RootState) => appState.myProfile.user.id);
	const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;
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

	const handleOutsideClick = (e: any) => {
		if (!emojiRef.current?.contains(e.target)) {
			setSmilesDisplayed(false);
			document.removeEventListener('click', handleOutsideClick, false);
		}
	};

	const sendMessageToServer = () => {
		const currentUser: UserPreview = {
			id: currentUserId,
		};
		const dialogId = selectedDialog.id;

		if (text.trim().length > 0) {
			sendMessage({
				currentUser: {
					id: currentUserId,
				},
				selectedDialogId: dialogId,
				dialog: selectedDialog,
				message: {
					text,
					systemMessageType: SystemMessageType.None,
					userCreator: currentUser,
					creationDateTime: new Date(new Date().toUTCString()),
					state: MessageState.QUEUED,
					id: new Date().getTime(),
					dialogId: dialogId,
				},
			});
		}

		setText('');
	};

	const handleTextChange = (newText: string): void => {
		const isDialog = Boolean(selectedDialog.interlocutor);

		notifyAboutTyping({
			interlocutorId: isDialog ? selectedDialog.interlocutor?.id : selectedDialog.conference?.id,
			isConference: !isDialog,
			text: newText,
		});
	};

	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter') {
			sendMessageToServer();
		}
	};
	return (
		<div className='messenger__send-message'>
			{selectedDialog && (
				<React.Fragment>
					<button onClick={() => handleClick()} className='messenger__display-smiles'>
						<svg
							className={smilesDisplayed ? 'blue' : 'black'}
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 16 16'
						>
							<path
								fillRule='evenodd'
								d='M8 .2a7.8 7.8 0 1 1 0 15.6A7.8 7.8 0 0 1 8 .2zm0 1.6a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8zm0 8.83a2.5 2.5 0 0 0 2.31-1.56.8.8 0 0 1 1.49.6 4.1 4.1 0 0 1-7.56.08.8.8 0 0 1 1.47-.63A2.5 2.5 0 0 0 8 10.63zm2-5.69c.54 0 .98.48.98 1.06 0 .59-.44 1.06-.99 1.06-.54 0-.98-.47-.98-1.06 0-.58.44-1.05.98-1.05zM6.97 6c0-.58-.44-1.06-.98-1.06-.55 0-1 .48-1 1.06 0 .58.45 1.06 1 1.06.54 0 .98-.48.98-1.06z'
							></path>
						</svg>
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
								onSelect={(emoji: any) => {
									setText((oldText) => oldText + emoji.native);
								}}
							/>
						</div>
					)}
				</React.Fragment>
			)}
		</div>
	);
};

export default CreateMessageInput;
