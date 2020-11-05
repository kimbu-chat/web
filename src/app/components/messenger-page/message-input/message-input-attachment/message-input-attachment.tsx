import {
	AttachmentToSend,
	AudioAttachment,
	BaseAttachment,
	PictureAttachment,
	RawAttachment,
	VideoAttachment,
} from 'app/store/chats/models';
import { FileType } from 'app/store/messages/models';
import React, { useCallback } from 'react';
import './message-input-attachment.scss';

import PhotoSVG from 'app/assets/icons/ic-photo.svg';
import VideoSVG from 'app/assets/icons/ic-video-call.svg';
import FileSVG from 'app/assets/icons/ic-documents.svg';
import MicrophoneSVG from 'app/assets/icons/ic-microphone.svg';
import PlaySVG from 'app/assets/icons/ic-play.svg';
import CloseSVG from 'app/assets/icons/ic-close.svg';
import { getSelectedChatIdSelector } from 'app/store/chats/selectors';
import { useSelector } from 'react-redux';
import { ChatActions } from 'app/store/chats/actions';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';

namespace MessageInputAttachment {
	export interface Props {
		attachment: AttachmentToSend<BaseAttachment>;
	}
}

const MessageInputAttachment: React.FC<MessageInputAttachment.Props> = ({ attachment }) => {
	const selectedChatId = useSelector(getSelectedChatIdSelector);
	const removeAttachment = useActionWithDispatch(ChatActions.removeAttachmentAction);

	const removeThisAttachment = useCallback(() => {
		removeAttachment({
			chatId: selectedChatId!,
			attachmentId: attachment.attachment.id,
		});
	}, [selectedChatId, attachment.attachment.id]);

	return (
		<div
			style={{
				backgroundColor: `${
					attachment.success
						? 'rgba(50, 168, 82, 0.4)'
						: attachment.failure
						? 'rgba(168, 50, 83, 0,4)'
						: ' rgba(63, 138, 224, 0.1)'
				}`,
			}}
			className='message-input-attachment'
		>
			<div className='message-input-attachment__icon'>
				{attachment.attachment.type === FileType.file && <FileSVG viewBox='0 0 25 25' />}
				{attachment.attachment.type === FileType.video && (
					<>
						<img
							src={(attachment.attachment as VideoAttachment).firstFrameUrl}
							alt=''
							className='message-input-attachment__bg'
						/>
						<VideoSVG viewBox='0 0 25 25' />
					</>
				)}
				{attachment.attachment.type === FileType.recording && <MicrophoneSVG viewBox='0 0 25 25' />}
				{attachment.attachment.type === FileType.photo && (
					<>
						<img
							src={(attachment.attachment as PictureAttachment).previewUrl}
							alt=''
							className='message-input-attachment__bg'
						/>
						<PhotoSVG viewBox='0 0 25 25' />
					</>
				)}
				{attachment.attachment.type === FileType.music && <PlaySVG viewBox='0 0 25 25' />}
			</div>
			<div className='message-input-attachment__progress-container'>
				<div style={{ width: `${attachment.progress}%` }} className='message-input-attachment__progress'></div>
			</div>
			{(attachment.attachment.type === FileType.music || attachment.attachment.type === FileType.file) && (
				<div className='message-input-attachment__title'>
					{(attachment.attachment as AudioAttachment | RawAttachment).title}
				</div>
			)}
			<button onClick={removeThisAttachment} className='message-input-attachment__close'>
				<CloseSVG viewBox='0 0 25 25' />
			</button>
		</div>
	);
};

export default MessageInputAttachment;
