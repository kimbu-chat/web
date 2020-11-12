import React, { useState, useRef, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './message-input.scss';

import { UserPreview } from 'app/store/my-profile/models';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { MessageActions } from 'app/store/messages/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { SystemMessageType, MessageState, FileType } from 'app/store/messages/models';
import { LocalizationContext } from 'app/app';
import useInterval from 'use-interval';
import useOnPaste from 'app/utils/hooks/use-on-paste';

import AddSvg from 'app/assets/icons/ic-add-new.svg';
import VoiceSvg from 'app/assets/icons/ic-microphone.svg';
import moment from 'moment';
import { useEffect } from 'react';
import { getMyProfileSelector } from 'app/store/my-profile/selectors';
import MessageSmiles from './message-smiles/message-smiles';
import Mousetrap from 'mousetrap';
import useReferredState from 'app/utils/hooks/use-referred-state';
import { getTypingStrategy } from 'app/store/settings/selectors';
import { typingStrategy } from 'app/store/settings/models';
import { ChatActions } from 'app/store/chats/actions';
import MessageInputAttachment from './message-input-attachment/message-input-attachment';
import useOnClickOutside from 'app/utils/hooks/use-on-click-outside';
import { getFileType } from 'app/utils/functions/get-file-extension';
import RespondingMessage from 'app/components/messenger-page/responding-message/responding-message';
import { RootState } from 'app/store/root-reducer';
import { Chat } from 'app/store/chats/models';

namespace CreateMessageInput {
	export interface RecordedData {
		mediaRecorder: MediaRecorder | null;
		tracks: MediaStreamTrack[];
		isRecording: boolean;
		needToSubmit: boolean;
	}
}

const CreateMessageInput = () => {
	const { t } = useContext(LocalizationContext);

	const sendMessage = useActionWithDispatch(MessageActions.createMessage);
	const notifyAboutTyping = useActionWithDispatch(MessageActions.messageTyping);
	const uploadAttachmentRequest = useActionWithDispatch(ChatActions.uploadAttachmentRequestAction);

	const currentUser = useSelector<RootState, UserPreview | undefined>((state) => state.myProfile.user);
	const selectedChat = useSelector(getSelectedChatSelector);
	const myProfile = useSelector(getMyProfileSelector);
	const messageToEdit = useSelector((state: RootState) => state.messages.messageToEdit);
	const myTypingStrategy = useSelector(getTypingStrategy);
	const replyingMessage = useSelector((state: RootState) => state.messages.messageToReply);

	const { reference: refferedText, state: text, setState: setText } = useReferredState<string>('');
	const [isRecording, setIsRecording] = useState(false);
	const [recordedSeconds, setRecordedSeconds] = useState(0);
	const [rows, setRows] = useState(1);

	const mainInputRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const registerAudioBtnRef = useRef<HTMLButtonElement>(null);
	const recorderData = useRef<CreateMessageInput.RecordedData>({
		mediaRecorder: null,
		tracks: [],
		isRecording: false,
		needToSubmit: false,
	});
	const updatedSelectedChat = useRef<Chat | undefined>();

	useEffect(() => {
		if (messageToEdit) {
			setText(messageToEdit.text);
		}
	}, [messageToEdit]);

	useEffect(() => {
		updatedSelectedChat.current = selectedChat;
	}, [selectedChat]);

	useInterval(
		() => {
			if (isRecording) {
				setRecordedSeconds((x) => x + 1);
			}
		},
		isRecording ? 1000 : null,
		true,
	);

	const sendMessageToServer = () => {
		const chatId = updatedSelectedChat.current?.id;

		const text = refferedText.current;

		if (text.trim().length > 0 && updatedSelectedChat.current && currentUser) {
			const attachments = updatedSelectedChat.current?.attachmentsToSend?.map(({ attachment }) => attachment);

			sendMessage({
				currentUser: currentUser,
				selectedChatId: chatId || -1,
				chat: updatedSelectedChat.current,
				message: {
					text,
					systemMessageType: SystemMessageType.None,
					userCreator: currentUser,
					creationDateTime: new Date(new Date().toUTCString()),
					state: MessageState.QUEUED,
					id: new Date().getTime(),
					chatId: chatId,
					attachments: attachments,
				},
			});
		}

		setText('');
		setRows(1);
	};

	const onPaste = useCallback(
		(event: ClipboardEvent) => {
			console.log(event.clipboardData);
			if (event.clipboardData?.files.length! > 0) {
				for (var index = 0; index < event.clipboardData?.files.length!; ++index) {
					const file = event.clipboardData?.files!.item(index) as File;

					//extension test
					const fileType = getFileType(file.name);

					console.log(file.name);
					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: fileType,
						file,
						attachmentId: String(new Date().getTime()),
					});
				}
			}
		},
		[uploadAttachmentRequest, selectedChat?.id],
	);

	useOnPaste(mainInputRef, onPaste);

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

	const onType = useCallback(
		(event) => {
			const minRows = 1;
			const maxRows = 20;
			const textareaLineHeight = 18;
			const previousRows = event.target.rows;

			event.target.rows = minRows;

			const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

			if (currentRows === previousRows) {
				event.target.rows = currentRows;
			}

			if (currentRows >= maxRows) {
				event.target.rows = maxRows;
				event.target.scrollTop = event.target.scrollHeight;
			}

			setText(event.target.value);
			handleTextChange(event.target.value);

			console.log(currentRows < maxRows ? currentRows : maxRows);

			setRows(currentRows < maxRows ? currentRows : maxRows);
		},
		[setText, handleTextChange, setRows],
	);

	const handleFocus = useCallback(() => {
		if (myTypingStrategy === typingStrategy.nle) {
			Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
				sendMessageToServer();
			});
			Mousetrap.bind('enter', (e) => {
				onType(e);
			});
		} else {
			Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], (e) => {
				setText((oldText) => oldText + '\n');
				onType(e);
			});
			Mousetrap.bind('enter', (e) => {
				e.preventDefault();
				sendMessageToServer();
			});
		}
	}, [setText, onType, sendMessageToServer, myTypingStrategy]);

	const handleBlur = useCallback(() => {
		Mousetrap.unbind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter']);
		Mousetrap.unbind('enter');
	}, []);

	const startRecording = useCallback(() => {
		Mousetrap.bind('esc', cancelRecording);
		recorderData.current.tracks.forEach((track) => track.stop());
		recorderData.current.tracks = [];

		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			recorderData.current.mediaRecorder = new MediaRecorder(stream);
			recorderData.current.mediaRecorder?.start();
			const tracks = stream.getTracks();
			recorderData.current.tracks.push(...tracks);

			recorderData.current.isRecording = true;
			setIsRecording(true);

			let audioChunks: Blob[] = [];
			recorderData.current.mediaRecorder?.addEventListener('dataavailable', (event) => {
				audioChunks.push(event.data);
			});

			recorderData.current.mediaRecorder?.addEventListener('stop', () => {
				setIsRecording(false);
				recorderData.current.isRecording = false;

				recorderData.current.tracks.forEach((track) => track.stop());
				recorderData.current.tracks = [];

				if (audioChunks[0]?.size > 0 && recorderData.current.needToSubmit) {
					const audioBlob = new Blob(audioChunks);
					const audioFile = new File([audioBlob], 'audio.mp3', {
						type: 'audio/mp3; codecs="opus"',
					});
					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: FileType.recording,
						file: audioFile as File,
						attachmentId: String(new Date().getTime()),
					});
				}

				setRecordedSeconds(0);
			});
		});
	}, [selectedChat, setRecordedSeconds, uploadAttachmentRequest, recorderData.current]);

	const stopRecording = useCallback(() => {
		Mousetrap.unbind('esc');
		if (recorderData.current.isRecording) {
			if (recorderData.current.mediaRecorder?.state === 'recording') {
				recorderData.current.needToSubmit = true;
				recorderData.current.mediaRecorder?.stop();
			}

			recorderData.current.tracks.forEach((track) => track.stop());
			recorderData.current.tracks = [];
		}
	}, [recorderData.current]);

	const cancelRecording = useCallback(() => {
		Mousetrap.unbind('esc');
		recorderData.current.isRecording = false;
		recorderData.current.tracks.forEach((track) => track.stop());
		recorderData.current.tracks = [];
		recorderData.current.needToSubmit = false;
		recorderData.current.mediaRecorder?.stop();
	}, [recorderData.current]);

	useOnClickOutside(registerAudioBtnRef, cancelRecording);

	const handleRegisterAudioBtnClick = useCallback(() => {
		if (recorderData.current.isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	}, [startRecording, stopRecording, recorderData.current]);

	const openSelectFiles = useCallback(() => {
		console.log('eeeeZZ');
		fileInputRef.current?.click();
	}, [fileInputRef]);

	const uploadFile = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files?.length! > 0) {
				for (var index = 0; index < event.target.files!.length; ++index) {
					const file = event.target.files!.item(index) as File;

					//extension test
					const fileType = getFileType(file.name);

					console.log(file.name);
					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: fileType,
						file,
						attachmentId: String(new Date().getTime()),
					});
				}
			}
		},
		[uploadAttachmentRequest, selectedChat],
	);

	if (messageToEdit) {
		return (
			<div>
				{selectedChat?.attachmentsToSend?.map((attachment) => {
					return <MessageInputAttachment attachment={attachment} key={attachment.attachment.id} />;
				})}
				{replyingMessage && <RespondingMessage />}
				<div className='message-input__send-message'>
					{selectedChat && (
						<>
							{!isRecording && (
								<>
									<input
										multiple
										className='hidden'
										type='file'
										onChange={uploadFile}
										ref={fileInputRef}
									/>
									<button onClick={openSelectFiles} className='message-input__add'>
										<AddSvg />
									</button>
								</>
							)}
							<div className='message-input__input-group'>
								{!isRecording && (
									<textarea
										rows={rows}
										ref={mainInputRef}
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
			</div>
		);
	}

	return (
		<div>
			{selectedChat?.attachmentsToSend?.map((attachment) => {
				return <MessageInputAttachment attachment={attachment} key={attachment.attachment.id} />;
			})}
			{selectedChat && (
				<>
					{replyingMessage && <RespondingMessage />}
					<div className='message-input__send-message'>
						{!isRecording && (
							<>
								<input
									multiple
									className='hidden'
									type='file'
									onChange={uploadFile}
									ref={fileInputRef}
								/>
								<button onClick={openSelectFiles} className='message-input__add'>
									<AddSvg />
								</button>
							</>
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
									ref={mainInputRef}
									rows={rows}
									placeholder={t('messageInput.write')}
									value={text}
									onChange={onType}
									className='mousetrap message-input__input-message'
									onFocus={handleFocus}
									onBlur={handleBlur}
								/>
							)}
							{isRecording && (
								<div className='message-input__recording-info'>
									Release outside this field to cancel
								</div>
							)}
							<div className='message-input__right-btns'>
								{!isRecording && <MessageSmiles setText={setText} />}
								<button
									onClick={handleRegisterAudioBtnClick}
									ref={registerAudioBtnRef}
									className={`message-input__voice-btn ${
										isRecording ? 'message-input__voice-btn--active' : ''
									}`}
								>
									<VoiceSvg />
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default React.memo(CreateMessageInput);
