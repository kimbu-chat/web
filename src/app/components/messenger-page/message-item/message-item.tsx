import React, { useContext, useCallback, useEffect } from 'react';
import { messageFrom } from '../chat/chat';
import {
	Message,
	SystemMessageType,
	MessageState,
	FileType,
	AudioBase,
	VideoBase,
	RecordingBase,
	FileBase,
} from 'app/store/messages/models';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';

import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { setSelectedMessagesLength } from 'app/store/messages/selectors';
import Avatar from 'app/components/shared/avatar/avatar';
import { getUserInitials } from 'app/utils/interlocutor-name-utils';
import { UserPreview } from 'app/store/my-profile/models';
import moment from 'moment';

import FileAttachment from './attachments/file-attachment/file-attachment';
import AudioAttachment from './attachments/audio-attachment/audio-attachment';
import RecordingAttachment from './attachments/recording-attachment/recording-attachment';
import MediaGrid from './attachments/media-grid/media-grid';

import MessageQeuedSvg from 'app/assets/icons/ic-time.svg';
import MessageSentSvg from 'app/assets/icons/ic-tick.svg';
import MessageReadSvg from 'app/assets/icons/ic-double_tick.svg';
import SelectedSvg from 'app/assets/icons/ic-check-filled.svg';
import UnSelectedSvg from 'app/assets/icons/ic-check-outline.svg';

namespace Message {
	export interface Props {
		message: Message;
	}
}

const MessageItem = ({ message }: Message.Props) => {
	const currentUserId = useSelector(getMyIdSelector) as number;
	const selectedChatId = useSelector(getSelectedChatSelector)?.id;
	const isSelectState = useSelector(setSelectedMessagesLength) > 0;
	const myId = useSelector(getMyIdSelector) as number;

	useEffect(() => console.log('rerender'), []);

	const messageIsFrom = useCallback(
		(id: Number | undefined) => {
			if (id === myId) {
				return messageFrom.me;
			} else {
				return messageFrom.others;
			}
		},
		[myId],
	);

	const from = messageIsFrom(message.userCreator?.id);

	const { t } = useContext(LocalizationContext);

	const selectMessage = useActionWithDispatch(MessageActions.selectMessage);

	const selectThisMessage = useCallback(
		(event?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
			event?.stopPropagation();
			selectMessage({ chatId: selectedChatId as number, messageId: message.id });
		},
		[selectedChatId, message.id],
	);

	const structuredAttachments = message.attachments?.reduce(
		(
			accum: {
				files: FileBase[];
				media: (FileBase | VideoBase)[];
				audios: AudioBase[];
				recordings: RecordingBase[];
			},
			currentAttachment,
		) => {
			switch (currentAttachment.type) {
				case FileType.file:
					{
						accum.files.push(currentAttachment);
					}
					break;
				case FileType.photo:
					{
						accum.media.push(currentAttachment);
					}
					break;
				case FileType.video:
					{
						accum.media.push(currentAttachment as VideoBase);
					}
					break;
				case FileType.music:
					{
						accum.audios.push(currentAttachment as AudioBase);
					}
					break;
				case FileType.recording:
					{
						accum.recordings.push(currentAttachment as RecordingBase);
					}
					break;
			}

			return accum;
		},
		{ files: [], media: [], audios: [], recordings: [] },
	);

	if (message?.systemMessageType !== SystemMessageType.None) {
		return (
			<div className='message__separator'>
				<span>{MessageUtils.constructSystemMessageText(message as Message, t, currentUserId)}</span>
			</div>
		);
	}

	return (
		<div
			className={`message__container 
				${message.isSelected ? 'message__container--selected' : ''}`}
			onClick={isSelectState ? selectThisMessage : () => {}}
		>
			<div className={`message__item ${!message.needToShowCreator ? 'message__item--upcoming' : ''} }`}>
				{message.needToShowCreator && (
					<p className='message__sender-name'>{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
				)}
				<div className='message__item-apart'>
					<span className='message__contents'>{message.text}</span>

					<div className='message__time-status'>
						{from === messageFrom.me &&
							(message.state === MessageState.READ ? (
								<MessageReadSvg viewBox='0 0 25 25' className='message__read' />
							) : message.state === MessageState.QUEUED ? (
								<MessageQeuedSvg viewBox='0 0 25 25' className='message__read' />
							) : (
								<MessageSentSvg viewBox='0 0 25 25' className='message__read' />
							))}

						<span className={`message__time`}>
							{moment.utc(message.creationDateTime).local().format('LT')}
						</span>
					</div>
				</div>
				{structuredAttachments?.files.map((file) => (
					<FileAttachment key={file.id} attachment={file} />
				))}

				{structuredAttachments?.recordings.map((recording) => (
					<RecordingAttachment key={recording.id} attachment={recording} />
				))}

				{structuredAttachments?.audios.map((audio) => (
					<AudioAttachment key={audio.id} attachment={audio} />
				))}

				{(structuredAttachments?.media.length || 0) > 0 && <MediaGrid media={structuredAttachments!.media} />}
			</div>
			{message.needToShowCreator && (
				<Avatar className={`message__sender-photo `} src={message.userCreator?.avatarUrl}>
					{getUserInitials(message.userCreator as UserPreview)}
				</Avatar>
			)}

			<div onClick={selectThisMessage} className={`message__selected`}>
				{message.isSelected ? <SelectedSvg /> : <UnSelectedSvg className={`message__unselected`} />}
			</div>
		</div>
	);
};

export default React.memo(MessageItem);
