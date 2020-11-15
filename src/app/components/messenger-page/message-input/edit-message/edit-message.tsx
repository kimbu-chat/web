import { ChatActions } from 'app/store/chats/actions';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { RootState } from 'app/store/root-reducer';
import { typingStrategy } from 'app/store/settings/models';
import { getTypingStrategy } from 'app/store/settings/selectors';
import { getFileType } from 'app/utils/functions/get-file-extension';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import useOnPaste from 'app/utils/hooks/use-on-paste';
import Mousetrap from 'mousetrap';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageInputAttachment from '../message-input-attachment/message-input-attachment';
import AddSvg from 'app/assets/icons/ic-add-new.svg';
import './edit-message.scss';
import { LocalizationContext } from 'app/app';
import { MessageActions } from 'app/store/messages/actions';
import { AttachmentToSend, BaseAttachment, Chat } from 'app/store/chats/models';
import { AttachmentCreation } from 'app/store/messages/models';
import { useDrop, useGlobalDrop } from 'app/utils/hooks/use-drop';

const EditMessage = () => {
	const { t } = useContext(LocalizationContext);

	const uploadAttachmentRequest = useActionWithDispatch(ChatActions.uploadAttachmentRequestAction);
	const submitEditMessage = useActionWithDispatch(MessageActions.submitEditMessage);

	const messageToEdit = useSelector((state: RootState) => state.messages.messageToEdit);
	const selectedChat = useSelector(getSelectedChatSelector);
	const myTypingStrategy = useSelector(getTypingStrategy);

	const [newText, setNewText] = useState(messageToEdit?.text || '');
	const [removedAttachments, setRemovedAttachments] = useState<AttachmentCreation[]>([]);
	const [rows, setRows] = useState(1);
	const [isDraggingOver, setIsDraggingOver] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const mainInputRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const updatedSelectedChat = useRef<Chat | undefined>();

	useEffect(() => {
		updatedSelectedChat.current = selectedChat;
	}, [selectedChat]);

	const removeAttachment = useCallback(
		(attachmentToRemove: AttachmentCreation) => {
			setRemovedAttachments((oldList) => [...oldList, attachmentToRemove]);
		},
		[setRemovedAttachments],
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

			setNewText(event.target.value);

			console.log(currentRows < maxRows ? currentRows : maxRows);

			setRows(currentRows < maxRows ? currentRows : maxRows);
		},
		[setNewText, setRows],
	);

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

	const dragRef = useDrop({
		onDragOver: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(true);
		},
		onDragEnter: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(true);
		},
		onDragLeave: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(false);
		},
		onDrop: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(false);

			if (e.dataTransfer?.files?.length! > 0) {
				for (var index = 0; index < e.dataTransfer!.files!.length; ++index) {
					const file = e.dataTransfer?.files[index] as File;

					const fileType = getFileType(file.name);

					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: fileType,
						file,
						attachmentId: String(new Date().getTime()),
					});
				}
			}
		},
	});

	useGlobalDrop({
		onDragEnter: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(true);
		},
		onDragOver: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(true);
		},
		onDragLeave: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
		},
	});

	const uploadFile = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.files?.length! > 0) {
				for (var index = 0; index < event.target.files!.length; ++index) {
					const file = event.target.files!.item(index) as File;

					const fileType = getFileType(file.name);

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

	const submitEditedMessage = useCallback(() => {
		const newAttachments = updatedSelectedChat.current?.attachmentsToSend?.map(({ attachment }) => attachment);

		submitEditMessage({
			messageId: messageToEdit!.id,
			chatId: selectedChat!.id,
			text: newText,
			removedAttachments: removedAttachments,
			newAttachments: newAttachments,
		});
	}, [messageToEdit, selectedChat, updatedSelectedChat, newText]);

	const openSelectFiles = useCallback(() => {
		fileInputRef.current?.click();
	}, [fileInputRef]);

	const handleFocus = useCallback(() => {
		if (myTypingStrategy === typingStrategy.nle) {
			Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], () => {
				submitEditedMessage();
			});
			Mousetrap.bind('enter', (e) => {
				onType(e);
			});
		} else {
			Mousetrap.bind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter'], (e) => {
				setNewText((oldText) => oldText + '\n');
				onType(e);
			});
			Mousetrap.bind('enter', (e) => {
				e.preventDefault();
				submitEditedMessage();
			});
		}
	}, [setNewText, onType, submitEditedMessage, myTypingStrategy]);

	const handleBlur = useCallback(() => {
		Mousetrap.unbind(['command+enter', 'ctrl+enter', 'alt+enter', 'shift+enter']);
		Mousetrap.unbind('enter');
	}, []);

	useOnPaste(mainInputRef, onPaste);

	return (
		<div ref={dragRef}>
			{messageToEdit?.attachments
				?.filter(
					({ id }) => removedAttachments.findIndex((removedAttachment) => removedAttachment.id === id) === -1,
				)
				.map((attachment) => {
					return (
						<MessageInputAttachment
							attachment={{ attachment } as AttachmentToSend<BaseAttachment>}
							isFromEdit={true}
							removeSelectedAttachment={removeAttachment}
							key={attachment.id}
						/>
					);
				})}
			{selectedChat?.attachmentsToSend?.map((attachment) => {
				return <MessageInputAttachment attachment={attachment} key={attachment.attachment.id} />;
			})}

			{(isDragging || isDraggingOver) && (
				<div className={`message-input__drag ${isDraggingOver ? 'message-input__drag--active' : ''}`}>
					Drop files here to send them
				</div>
			)}

			{selectedChat && !(isDragging || isDraggingOver) && (
				<div className='message-input__send-message'>
					<input multiple className='hidden' type='file' onChange={uploadFile} ref={fileInputRef} />
					<button onClick={openSelectFiles} className='message-input__add'>
						<AddSvg />
					</button>

					<div className='message-input__input-group'>
						<textarea
							rows={rows}
							ref={mainInputRef}
							placeholder={t('messageInput.write')}
							value={newText}
							onChange={onType}
							className='mousetrap  message-input__input-message'
							onFocus={handleFocus}
							onBlur={handleBlur}
						/>
					</div>
					<button onClick={submitEditedMessage} className='message-input__edit-confirm'>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default EditMessage;
