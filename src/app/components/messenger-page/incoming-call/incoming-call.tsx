import React, { useEffect, useCallback, useContext } from 'react';
import './incoming-call.scss';
import { useActionWithDispatch } from 'app/utils/hooks/use-action-with-dispatch';
import { CallActions } from 'app/store/calls/actions';
import { useSelector } from 'react-redux';
import { getCallInterlocutorSelector } from 'app/store/calls/selectors';
import Avatar from 'app/components/shared/avatar/avatar';
import { getUserInitials } from 'app/utils/functions/interlocutor-name-utils';

//sounds
import incomingCallSound from 'app/assets/sounds/calls/imcoming-call.ogg';
import { RootState } from 'app/store/root-reducer';
import { Rnd } from 'react-rnd';
import ReactDOM from 'react-dom';

//svgs
import AcceptWithAudioSvg from 'app/assets/icons/ic-call-filled.svg';
import AcceptWithVideoSvg from 'app/assets/icons/ic-video-call-filled.svg';
import DeclineCallSvg from 'app/assets/icons/ic-call-out.svg';
import { LocalizationContext } from 'app/app';

const IncomingCall = () => {
	const { t } = useContext(LocalizationContext);
	const declineCallAction = useActionWithDispatch(CallActions.declineCallAction);
	const acceptCall = useActionWithDispatch(CallActions.acceptCallAction);

	const interlocutor = useSelector(getCallInterlocutorSelector);
	const isCallingWithVideo = useSelector((state: RootState) => state.calls.isInterlocutorVideoEnabled);

	useEffect(() => {
		//repeatable playing beep-beep
		const audio = new Audio(incomingCallSound);

		const repeatAudio = function () {
			audio.play();
		};

		audio.addEventListener('ended', repeatAudio, false);

		audio.play();

		return () => {
			audio.pause();
			audio.removeEventListener('ended', repeatAudio);
			audio.currentTime = 0;
		};
	});

	const acceptWithVideo = useCallback(() => {
		acceptCall({
			constraints: {
				videoEnabled: true,
				audioEnabled: true,
			},
		});
	}, []);

	const acceptWithAudio = useCallback(() => {
		acceptCall({
			constraints: {
				videoEnabled: false,
				audioEnabled: true,
			},
		});
	}, []);

	return (
		<Rnd
			default={{
				x: 20,
				y: 20,
				width: window.innerWidth - 40,
				height: 100,
			}}
			bounds='body'
		>
			<div className='incoming-call'>
				<Avatar className='incoming-call__img' src={interlocutor?.avatarUrl}>
					{getUserInitials(interlocutor)}
				</Avatar>
				<div className='incoming-call__info'>
					<h1 className='incoming-call__calling-name'>{`${interlocutor?.firstName} ${interlocutor?.lastName}`}</h1>
					<h3 className='incoming-call__additional-data'>
						{isCallingWithVideo ? t('incomingCall.incoming_video') : t('incomingCall.incoming_audio')}
					</h3>
				</div>
				<div className='incoming-call__right-btns'>
					<button
						onClick={acceptWithAudio}
						className='incoming-call__call-btn incoming-call__call-btn--accept'
					>
						<AcceptWithAudioSvg viewBox='0 0 25 25' />
					</button>
					<button
						onClick={declineCallAction}
						className='incoming-call__call-btn incoming-call__call-btn--cancel'
					>
						<DeclineCallSvg viewBox='0 0 25 25' />
					</button>
					<button
						onClick={acceptWithVideo}
						className='incoming-call__call-btn incoming-call__call-btn--video'
					>
						<AcceptWithVideoSvg viewBox='0 0 25 25' />
					</button>
				</div>
			</div>
		</Rnd>
	);
};

const IncomingCallPortal = () => {
	return ReactDOM.createPortal(<IncomingCall />, document.getElementById('root') || document.createElement('div'));
};

export default IncomingCallPortal;
