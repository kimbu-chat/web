import React, { useState, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './message-input.scss';

import { UserPreview } from 'app/store/my-profile/models';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { MessageActions } from 'app/store/messages/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { SystemMessageType, MessageState } from 'app/store/messages/models';
import { LocalizationContext } from 'app/app';
import { RootState } from 'app/store/root-reducer';
import useInterval from 'use-interval';

import AddSvg from 'app/assets/icons/ic-add-new.svg';
import VoiceSvg from 'app/assets/icons/ic-microphone.svg';
import moment from 'moment';
import { useEffect } from 'react';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import MessageSmiles from './message-smiles/message-smiles';
import Mousetrap from 'mousetrap';
import useReferredState from 'app/utils/hooks/useReferredState';
import { getTypingStrategy } from 'app/store/settings/selectors';
import { typingStrategy } from 'app/store/settings/models';

const CreateMessageInput = () => {
	const { t } = useContext(LocalizationContext);

	const sendMessage = useActionWithDispatch(MessageActions.createMessage);
	const notifyAboutTyping = useActionWithDispatch(MessageActions.messageTyping);

	const currentUser = useSelector<RootState, UserPreview | undefined>((state) => state.myProfile.user);
	const selectedChat = useSelector(getSelectedChatSelector);
	const myProfile = useSelector(getMyProfileSelector);
	const messageToEdit = useSelector((state: RootState) => state.messages.messageToEdit);
	const myTypingStrategy = useSelector(getTypingStrategy);

	const { reference: refferedText, state: text, setState: setText } = useReferredState<string>('');
	const [isRecording, setIsRecording] = useState(false);
	const [recordedSeconds, setRecordedSeconds] = useState(0);

	const registerAudioBtnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (messageToEdit) {
			setText(messageToEdit.text);
		}
	}, [messageToEdit]);

	useInterval(
		() => {
			if (isRecording) {
				setRecordedSeconds((x) => x + 1);
			}
		},
		isRecording ? 1000 : null,
		true,
	);

	const sendMessageToServer = useCallback(() => {
		const chatId = selectedChat?.id;

		const text = refferedText.current;

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
	}, [selectedChat?.id, currentUser, refferedText, sendMessage]);

	const handleTextChange = useCallback(
		(newText: string): void => {
			notifyAboutTyping({
				chatId: selectedChat?.id || -1,
				text: newText,
				interlocutorName: `${myProfile?.firstName} ${myProfile?.lastName}`,
			});
		},
		[selectedChat?.id, myProfile],
	);

	const handleFocus = useCallback(() => {
		if (myTypingStrategy === typingStrategy.nle) {
			Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
				sendMessageToServer();
			});
			Mousetrap.bind('enter', () => {});
		} else {
			Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
				setText((oldText) => oldText + '\n');
			});
			Mousetrap.bind('enter', () => {
				sendMessageToServer();
			});
		}
	}, [setText, sendMessageToServer, myTypingStrategy]);

	const handleBlur = useCallback(() => {
		Mousetrap.unbind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter']);
		Mousetrap.unbind('enter');
	}, []);

	const registerAudio = () => {
		const recorderData: {
			mediaRecorder: MediaRecorder | null;
			tracks: MediaStreamTrack[];
			isRecording: boolean;
			needToSubmit: boolean;
		} = { mediaRecorder: null, tracks: [], isRecording: false, needToSubmit: false };

		recorderData.tracks.forEach((track) => track.stop());
		recorderData.tracks = [];

		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			recorderData.mediaRecorder = new MediaRecorder(stream);
			recorderData.mediaRecorder?.start();
			const tracks = stream.getTracks();
			recorderData.tracks.push(...tracks);

			recorderData.isRecording = true;
			setIsRecording(true);

			let audioChunks: Blob[] = [];
			recorderData.mediaRecorder?.addEventListener('dataavailable', (event) => {
				audioChunks.push(event.data);
			});

			recorderData.mediaRecorder?.addEventListener('stop', () => {
				setIsRecording(false);
				recorderData.isRecording = false;

				recorderData.tracks.forEach((track) => track.stop());
				recorderData.tracks = [];

				if (audioChunks[0]?.size > 0 && recorderData.needToSubmit) {
					const audioBlob = new Blob(audioChunks);
					const audioUrl = URL.createObjectURL(audioBlob);
					const audio = new Audio(audioUrl);
					audio.play();
				}

				setRecordedSeconds(0);
			});

			const handleMouseUp = (event: MouseEvent) => {
				document.removeEventListener('mouseup', handleMouseUp);
				console.log(registerAudioBtnRef.current?.contains(event.target as Node));
				if (registerAudioBtnRef.current?.contains(event.target as Node)) {
					if (recorderData.isRecording) {
						if (recorderData.mediaRecorder?.state === 'recording') {
							recorderData.needToSubmit = true;
							recorderData.mediaRecorder?.stop();
						}

						recorderData.tracks.forEach((track) => track.stop());
						recorderData.tracks = [];
					} else {
						setTimeout(() => {
							if (recorderData.isRecording) {
								if (recorderData.mediaRecorder?.state === 'recording') {
									recorderData.needToSubmit = false;
									recorderData.mediaRecorder?.stop();
								}

								recorderData.tracks.forEach((track) => track.stop());
								recorderData.tracks = [];
							}
						}, 100);
					}
				} else {
					recorderData.isRecording = false;
					recorderData.tracks.forEach((track) => track.stop());
					recorderData.tracks = [];
					recorderData.needToSubmit = false;
					recorderData.mediaRecorder?.stop();
				}
			};

			document.addEventListener('mouseup', handleMouseUp);
		});
	};

	const onType = useCallback(
		(event) => {
			setText(event.target.value);
			handleTextChange(event.target.value);
		},
		[setText, handleTextChange],
	);

	if (messageToEdit) {
		return (
			<div className='message-input__send-message'>
				{selectedChat && (
					<>
						{!isRecording && (
							<button className='message-input__add'>
								<AddSvg />
							</button>
						)}
						<div className='message-input__input-group'>
							{!isRecording && (
								<textarea
									placeholder={t('messageInput.write')}
									value={text}
									onChange={onType}
									className='mousetrap  message-input__input-message'
									onFocus={handleFocus}
									onBlur={handleBlur}
								/>
							)}
						</div>
						<button className='message-input__edit-confirm'>Save</button>
					</>
				)}
			</div>
		);
	}

	return (
		<div className='message-input__send-message'>
			{selectedChat && (
				<React.Fragment>
					{!isRecording && (
						<button className='message-input__add'>
							<AddSvg />
						</button>
					)}
					{isRecording && (
						<>
							<div className='message-input__red-dot'></div>
							<div className='message-input__counter'>
								{moment.utc(recordedSeconds * 1000).format('mm:ss')}
							</div>
						</>
					)}
					<div className='message-input__input-group'>
						{!isRecording && (
							<textarea
								placeholder={t('messageInput.write')}
								value={text}
								onChange={onType}
								className='mousetrap message-input__input-message'
								onFocus={handleFocus}
								onBlur={handleBlur}
							/>
						)}
						{isRecording && (
							<div className='message-input__recording-info'>Release outside this field to cancel</div>
						)}
						<div className='message-input__right-btns'>
							{!isRecording && <MessageSmiles setText={setText} />}
							<button
								onMouseDown={registerAudio}
								ref={registerAudioBtnRef}
								className={`message-input__voice-btn ${
									isRecording ? 'message-input__voice-btn--active' : ''
								}`}
							>
								<VoiceSvg />
							</button>
						</div>
					</div>
				</React.Fragment>
			)}
		</div>
	);
};

export default React.memo(CreateMessageInput);
