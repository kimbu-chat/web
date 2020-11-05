import React, { useRef } from 'react';
import moment from 'moment';
import PlaySvg from 'app/assets/icons/ic-play.svg';
import PauseSvg from 'app/assets/icons/ic-pause.svg';

import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import { changeMusic } from 'app/utils/current-music';
import H5AudioPlayer from 'react-h5-audio-player';

namespace ChatRecordingNS {
	export interface Props {
		recording: {
			url: string;
			duration: number;
		};
	}
}

const ChatRecording: React.FC<ChatRecordingNS.Props> = ({ recording }) => {
	const audioRef = useRef<H5AudioPlayer>();
	return (
		<AudioPlayer
			ref={audioRef as React.RefObject<H5AudioPlayer>}
			onPlay={() => changeMusic(audioRef.current?.audio.current!)}
			src={recording.url}
			preload='none'
			defaultCurrentTime={<span>{moment.utc(recording.duration * 1000).format('mm:ss')}</span>}
			showSkipControls={false}
			showJumpControls={false}
			autoPlayAfterSrcChange={false}
			layout='horizontal-reverse'
			customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.CURRENT_TIME]}
			customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
			customAdditionalControls={[]}
			customIcons={{
				play: (
					<div className='recording-attachment__btn'>
						<PlaySvg viewBox='0 0 25 25' />
					</div>
				),
				pause: (
					<div className='recording-attachment__btn'>
						<PauseSvg viewBox='0 0 25 25' />
					</div>
				),
			}}
		/>
	);
};

export default ChatRecording;
