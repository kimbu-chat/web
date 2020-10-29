import React, { useCallback, useState } from 'react';
import PlaySvg from 'app/assets/icons/ic-play.svg';
import { Video } from 'app/store/chats/models';
import moment from 'moment';
import VideoPlayer from 'app/components/messenger-page/shared/video-player/video-player';
import FadeAnimationWrapper from 'app/components/shared/fade-animation-wrapper/fade-animation-wrapper';

namespace VideoNS {
	export interface Props {
		video: Video;
	}
}

const VideoFromList: React.FC<VideoNS.Props> = ({ video }) => {
	const [videoPlayerDisplayed, setVideoPlayerDisplayed] = useState(false);
	const changeVideoPlayerDisplayed = useCallback(() => setVideoPlayerDisplayed((oldState) => !oldState), [
		setVideoPlayerDisplayed,
	]);

	return (
		<React.Fragment key={video.id}>
			{video.needToShowSeparator && (
				<div className='chat-video__separator'>{moment(video.creationDateTime).format('MMMM')}</div>
			)}
			<div onClick={changeVideoPlayerDisplayed} className='chat-video__video-wrapper'>
				<img className='chat-video__video' src={video.previewImgUrl} alt={video.alt} />
				<button className='chat-video__play'>
					<PlaySvg viewBox='0 0 25 25' />
					<span className='chat-video__duration'>{moment.utc(video.duration * 1000).format('mm:ss')}</span>
				</button>
			</div>

			<FadeAnimationWrapper isDisplayed={videoPlayerDisplayed}>
				<VideoPlayer url={video.url} onClose={changeVideoPlayerDisplayed} />
			</FadeAnimationWrapper>
		</React.Fragment>
	);
};

export default VideoFromList;
