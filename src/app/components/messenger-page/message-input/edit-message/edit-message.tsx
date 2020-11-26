import { ChatActions } from 'store/chats/actions';
import { getSelectedChatSelector } from 'store/chats/selectors';
import { RootState } from 'store/root-reducer';
import { typingStrategy } from 'store/settings/models';
import { getTypingStrategy } from 'store/settings/selectors';
import { getFileType } from 'utils/functions/get-file-extension';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import Mousetrap from 'mousetrap';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MessageInputAttachment } from '../message-input-attachment/message-input-attachment';
import AddSvg from 'icons/ic-add-new.svg';
import './edit-message.scss';
import { LocalizationContext } from 'app/app';
import { MessageActions } from 'store/messages/actions';
import { AttachmentToSend, BaseAttachment, Chat } from 'store/chats/models';
import { AttachmentCreation } from 'store/messages/models';
import { useGlobalDrop } from 'utils/hooks/use-drop';
import useReferState from 'app/utils/hooks/use-referred-state';
import { ExpandingTextarea } from '../expanding-textarea/expanding-textarea';

export const EditMessage = React.memo(() => {
	const { t } = useContext(LocalizationContext);

	const uploadAttachmentRequest = useActionWithDispatch(ChatActions.uploadAttachmentRequestAction);
	const submitEditMessage = useActionWithDispatch(MessageActions.submitEditMessage);

	const messageToEdit = useSelector((state: RootState) => state.messages.messageToEdit);
	const selectedChat = useSelector(getSelectedChatSelector);
	const myTypingStrategy = useSelector(getTypingStrategy);

	const [newText, setNewText] = useState(messageToEdit?.text || '');
	const referredNewText = useReferState(newText);
	const [removedAttachments, setRemovedAttachments] = useState<AttachmentCreation[]>([]);
	const referredRemovedAttachments = useReferState(removedAttachments);
	const [isDraggingOver, setIsDraggingOver] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

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
			setNewText(event.target.value);
		},
		[setNewText],
	);

	const onPaste = useCallback(
		(event: React.ClipboardEvent<HTMLTextAreaElement>) => {
			if (event.clipboardData?.files.length! > 0) {
				for (let index = 0; index < event.clipboardData?.files.length!; ++index) {
					const file = event.clipboardData?.files!.item(index) as File;

					//extension test
					const fileType = getFileType(file.name);

					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: fileType,
						file,
						attachmentId: new Date().getTime(),
					});
				}
			}
		},
		[uploadAttachmentRequest, selectedChat?.id],
	);

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
				for (let index = 0; index < event.target.files!.length; ++index) {
					const file = event.target.files!.item(index) as File;

					const fileType = getFileType(file.name);

					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: fileType,
						file,
						attachmentId: new Date().getTime(),
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
			chatId: updatedSelectedChat.current!.id,
			text: referredNewText.current,
			removedAttachments: referredRemovedAttachments.current,
			newAttachments: newAttachments,
		});
	}, [messageToEdit, updatedSelectedChat, referredNewText, referredRemovedAttachments]);

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

	const onDragOver = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(true);
		},
		[setIsDraggingOver],
	);

	const onDragEnter = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(true);
		},
		[setIsDraggingOver],
	);

	const onDragLeave = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(false);
		},
		[setIsDraggingOver],
	);

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDraggingOver(false);

			if (e.dataTransfer?.files?.length! > 0) {
				for (let index = 0; index < e.dataTransfer!.files!.length; ++index) {
					const file = e.dataTransfer?.files[index] as File;

					const fileType = getFileType(file.name);

					uploadAttachmentRequest({
						chatId: selectedChat!.id,
						type: fileType,
						file,
						attachmentId: new Date().getTime(),
					});
				}
			}
		},
		[setIsDraggingOver, selectedChat?.id, uploadAttachmentRequest],
	);

	return (
		<div onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
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
						<ExpandingTextarea
							placeholder={t('messageInput.write')}
							value={newText}
							onChange={onType}
							className='mousetrap  message-input__input-message'
							onFocus={handleFocus}
							onBlur={handleBlur}
							onPaste={onPaste}
						/>
					</div>
					<button onClick={submitEditedMessage} className='message-input__edit-confirm'>
						Save
					</button>
				</div>
			)}
		</div>
	);
});
