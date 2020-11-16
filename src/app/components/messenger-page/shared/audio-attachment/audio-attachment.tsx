import React, { useCallback, useRef, useState } from 'react';
import './audio-attachment.scss';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import PauseSvg from 'app/assets/icons/ic-pause.svg';
import moment from 'moment';
import { changeMusic } from 'app/utils/functions/current-music';
import { AudioAttachment } from 'app/store/chats/models';

namespace AudioAttachmentNS {
	export interface Props {
		attachment: AudioAttachment;
	}
}

const MessageAudioAttachment = ({ attachment }: AudioAttachmentNS.Props) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const audio = useRef<HTMLAudioElement | null>(null);

	const playPauseAudio = useCallback(() => {
		if (!audio.current) {
			audio.current = new Audio(attachment.url);
		}
		changeMusic(audio.current, setIsPlaying, true);
	}, [setIsPlaying, isPlaying, attachment]);

	return (
		<div className='audio-attachment'>
			<button onClick={playPauseAudio} className='audio-attachment__download'>
				{isPlaying ? <PauseSvg viewBox='0 0 25 25' /> : <PlaySvg viewBox='0 0 25 25' />}
			</button>
			<div className='audio-attachment__data'>
				<h4 className='audio-attachment__file-name'>{attachment.title}</h4>
				<div className='audio-attachment__duration'>
					{moment.utc(attachment.duration * 1000).format('mm:ss')}
				</div>
			</div>
		</div>
	);
};

export default MessageAudioAttachment;
