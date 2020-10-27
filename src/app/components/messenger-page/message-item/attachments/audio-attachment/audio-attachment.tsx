import React, { useCallback, useRef, useState } from 'react';
import './audio-attachment.scss';
import { AudioBase } from 'app/store/messages/models';

import PlaySvg from 'app/assets/icons/ic-play.svg';
import PauseSvg from 'app/assets/icons/ic-pause.svg';
import moment from 'moment';

namespace AudioAttachment {
	export interface Props {
		attachment: AudioBase;
	}
}

const AudioAttachment = ({ attachment }: AudioAttachment.Props) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const audio = useRef<HTMLAudioElement | null>(null);

	const playPauseAudio = useCallback(() => {
		if (!audio.current) {
			audio.current = new Audio(attachment.url);
		}
		if (audio.current) {
			if (isPlaying) {
				console.log('pause');
				audio.current?.pause();
			} else {
				audio.current?.play();
			}
		}

		setIsPlaying((oldState) => !oldState);
	}, [setIsPlaying, isPlaying, attachment]);
	return (
		<div className='audio-attachment'>
			<button onClick={playPauseAudio} className='audio-attachment__download'>
				{isPlaying ? <PauseSvg viewBox='0 0 25 25' /> : <PlaySvg viewBox='0 0 25 25' />}
			</button>
			<div className='audio-attachment__data'>
				<h4 className='audio-attachment__file-name'>{attachment.fileName}</h4>
				<div className='audio-attachment__duration'>
					{moment.utc(attachment.durationInSeconds * 1000).format('mm:ss')}
				</div>
			</div>
		</div>
	);
};

export default AudioAttachment;
