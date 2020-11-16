import React, { useContext, useCallback, useEffect } from 'react';
import { Message, SystemMessageType, MessageState, FileType } from 'app/store/messages/models';
import { MessageUtils } from 'app/utils/functions/message-utils';
import { useSelector } from 'react-redux';
import './message-item.scss';

import { getMyIdSelector } from 'app/store/my-profile/selectors';
import { LocalizationContext } from 'app/app';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { getSelectedChatSelector } from 'app/store/chats/selectors';
import { MessageActions } from 'app/store/messages/actions';
import { setSelectedMessagesLength } from 'app/store/messages/selectors';
import Avatar from 'app/components/shared/avatar/avatar';
import { getUserInitials } from 'app/utils/functions/interlocutor-name-utils';
import { UserPreview } from 'app/store/my-profile/models';
import moment from 'moment';

import FileAttachment from '../shared/file-attachment/file-attachment';
import MessageAudioAttachment from '../shared/audio-attachment/audio-attachment';
import RecordingAttachment from './attachments/recording-attachment/recording-attachment';
import MediaGrid from './attachments/media-grid/media-grid';

import MessageQeuedSvg from 'app/assets/icons/ic-time.svg';
import MessageSentSvg from 'app/assets/icons/ic-tick.svg';
import MessageReadSvg from 'app/assets/icons/ic-double_tick.svg';
import SelectedSvg from 'app/assets/icons/ic-check-filled.svg';
import UnSelectedSvg from 'app/assets/icons/ic-check-outline.svg';
import {
	RawAttachment,
	PictureAttachment,
	VoiceAttachment,
	VideoAttachment,
	AudioAttachment,
} from 'app/store/chats/models';

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

	const isCurrentUserMessageCreator = message.userCreator?.id === myId;

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
				files: RawAttachment[];
				media: (VideoAttachment | PictureAttachment)[];
				audios: AudioAttachment[];
				recordings: VoiceAttachment[];
			},
			currentAttachment,
		) => {
			switch (currentAttachment.type) {
				case FileType.raw:
					{
						accum.files.push(currentAttachment as RawAttachment);
					}
					break;
				case FileType.picture:
					{
						accum.media.push(currentAttachment as PictureAttachment);
					}
					break;
				case FileType.video:
					{
						accum.media.push(currentAttachment as VideoAttachment);
					}
					break;
				case FileType.audio:
					{
						accum.audios.push(currentAttachment as AudioAttachment);
					}
					break;
				case FileType.voice:
					{
						accum.recordings.push(currentAttachment as VoiceAttachment);
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
			<div className={`message__item ${!message.needToShowCreator ? 'message__item--upcoming' : ''}`}>
				{message.needToShowCreator && (
					<p className='message__sender-name'>{`${message.userCreator?.firstName} ${message.userCreator?.lastName}`}</p>
				)}
				<div className='message__item-apart'>
					<span className='message__contents'>{message.text}</span>

					<div className='message__time-status'>
						{isCurrentUserMessageCreator &&
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
					<MessageAudioAttachment key={audio.id} attachment={audio} />
				))}

				{(structuredAttachments?.media.length || 0) > 0 && <MediaGrid media={structuredAttachments!.media} />}
			</div>
			{message.needToShowCreator && (
				<Avatar className={`message__sender-photo `} src={message.userCreator.avatar?.previewUrl}>
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
